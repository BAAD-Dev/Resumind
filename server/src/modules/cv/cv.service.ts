import cloudinary from "../../config/cloudinary.js";
import { prisma } from "../../db/prisma.js";
import type { UploadApiResponse } from "cloudinary";
import type { JWTPayload } from "../../utils/jwt.js";

class CVService {
  async handleUploadAndSave(
    file: Express.Multer.File,
    user: JWTPayload | undefined
  ) {
    // Step 1: Upload the file buffer to Cloudinary
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "cvs",
          },
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result);
            reject(new Error("Cloudinary upload failed."));
          }
        );
        uploadStream.end(file.buffer);
      }
    );

    // Step 2: Prepare the data for the database based on user status
    let dataToSave;
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (user) {
      // Case: Registered User
      dataToSave = {
        originalName: file.originalname,
        fileUrl: uploadResult.secure_url,
        userId: user.id,
        isGuest: false,
        expiresAt: null, // This CV will not expire
      };
    } else {
      // Case: Guest User
      dataToSave = {
        originalName: file.originalname,
        fileUrl: uploadResult.secure_url,
        userId: null,
        isGuest: true,
        expiresAt: new Date(Date.now() + oneDayInMs), // Set to expire in 24 hours
      };
    }

    // Step 3: Create the record in the database
    const newCvRecord = await prisma.cV.create({
      data: dataToSave,
    });

    return newCvRecord;
  }
}

export default new CVService();
