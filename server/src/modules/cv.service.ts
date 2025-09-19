import cloudinary from "../config/cloudinary.js";
import type { UploadApiResponse } from "cloudinary";
import type { JWTPayload } from "../utils/jwt.js";

class CVService {

  async uploadCV(
    file: Express.Multer.File,
    user: JWTPayload
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // Use upload_stream to upload the buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cvs",
          public_id: `user_${user.id}_${Date.now()}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            resolve(result);
          } else {
            reject(
              new Error("Cloudinary upload failed for an unknown reason.")
            );
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }
}

export default new CVService();
