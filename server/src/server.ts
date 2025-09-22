import app from "./app.js";
import { env } from "./config/env.js";
import { startCleanupJob, startTestPingJob } from "./jobs/cleanup.js";

app.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
  startCleanupJob();
//   startTestPingJob();
});
