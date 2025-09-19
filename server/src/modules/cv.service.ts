import cloudinary from "../config/cloudinary.js";
import type { UploadApiResponse } from "cloudinary";
import type { JWTPayload } from "../utils/jwt.js";

class CVService {
  /**
   * Uploads a file buffer to Cloudinary.
   * @param file The file object from Multer (containing the buffer).
   * @param user The user payload from the JWT.
   * @returns A Promise that resolves with the Cloudinary upload response.
   */
  async uploadCV(
    file: Express.Multer.File,
    user: JWTPayload
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cvs",
          public_id: `user_${user.id}_${Date.now()}`,
          resource_type: "raw",
          type: "upload",
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
