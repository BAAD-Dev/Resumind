import cron from "node-cron";
import { prisma } from "../db//prisma.js";
import cloudinary from "../config/cloudinary.js";

async function runCleanUp() {
  console.log("🧹 [CRON] Starting daily cleanup job for guest data...");
  const expiredCV = await prisma.cV.findMany({
    where: {
      isGuest: true,
      expiresAt: {
        lte: new Date(),
      },
    },
  });

  if (expiredCV.length === 0) {
    console.log("🧹 [CRON] No expired guest CVs to clean up. Job finished.");
    return;
  }
  console.log(`🧹 [CRON] Found ${expiredCV.length} expired CV(s) to delete.`);

  for (const cv of expiredCV) {
    try {
      if (cv.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(cv.cloudinaryPublicId, {
          resource_type: "raw",
        });
        console.log(
          `✅ [CRON] Deleted file from Cloudinary: ${cv.cloudinaryPublicId}`
        );
      }

      await prisma.cV.delete({
        where: { id: cv.id },
      });
      console.log(`✅ [CRON] Deleted CV record from database: ${cv.id}`);
    } catch (error) {
      console.error(`❌ [CRON] Failed to delete CV ${cv.id}:`, error);
    }
  }
  console.log("🧹 [CRON] Cleanup job finished.");
}

export function startCleanupJob() {
  // This cron schedule runs the job every day at 2:00 AM
  cron.schedule("0 2 * * *", runCleanUp, {
    // We only need to specify the timezone. The task will be scheduled by default.
    timezone: "Asia/Jakarta",
  });

  console.log(
    "⏰ [CRON] Cleanup job has been scheduled to run daily at 2:00 AM."
  );
}

//TEST - This cron schedule string means "run at every 10 second".

export function startTestPingJob() {
  cron.schedule("*/10 * * * * *", () => {
    const timestamp = new Date().toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
    console.log(
      `❤️  [CRON PING] The scheduler is alive! Current time: ${timestamp}`
    );
  });

  console.log(
    "❤️  [CRON PING] Test ping job scheduled to run every 10 seconds."
  );
}
