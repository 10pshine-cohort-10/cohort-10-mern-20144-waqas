import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Result returned upon successful Cloudinary asset upload.
 * @typedef {Object} CloudinaryUploadResult
 * @property {string} public_id - Public identifier of the uploaded asset in Cloudinary.
 * @property {"image" | "video" | "raw" | "auto"} resource_type - Resource type of the asset.
 * @property {string} [secure_url] - Secure HTTPS delivery URL.
 * @property {string} [url] - Delivery URL.
 * @property {string} [format] - Format of the uploaded asset.
 * @property {number} [bytes] - Size of the asset in bytes.
 * @property {number} [width] - Width in pixels if applicable.
 * @property {number} [height] - Height in pixels if applicable.
 * @property {string} [created_at] - Creation timestamp from Cloudinary.
 */

/**
 * Uploads an in-memory file buffer to Cloudinary using upload_stream.
 *
 * @param {Buffer} fileBuffer - In-memory buffer of the file to upload.
 * @param {string} [folder="notesapp/uploads"] - Target folder path in Cloudinary.
 * @param {string} [publicId] - Optional custom public ID for the uploaded asset.
 * @returns {Promise<import("cloudinary").UploadApiResponse | CloudinaryUploadResult | null>} Upload result metadata on success, or null if no buffer is provided.
 */
export const uploadOnCloudinary = (fileBuffer, folder = "notesapp/uploads", publicId = undefined) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return resolve(null);
    }

    /** @type {import("cloudinary").UploadApiOptions} */
    const options = { folder, resource_type: "auto" };
    if (publicId) {
      options.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result ?? null);
      },
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary by its public ID.
 *
 * @param {string} publicId - Public identifier of the asset to delete.
 * @param {"image" | "video" | "raw"} [resourceType="image"] - Cloudinary resource type of the asset.
 * @returns {Promise<any | null>} Deletion response or null if invalid or on error.
 */
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};

export default cloudinary;
