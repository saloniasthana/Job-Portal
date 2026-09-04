import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

/**
 * Uploads a file buffer (from multer memoryStorage) to Cloudinary if configured,
 * otherwise writes it to the local /uploads folder. Returns { url, publicId }.
 */
export const uploadBuffer = (buffer, { folder, fileName, mimeType }) =>
  new Promise((resolve, reject) => {
    if (useCloudinary) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `job-portal/${folder}`, resource_type: 'auto', public_id: fileName, overwrite: true },
        (err, result) => {
          if (err) return reject(err);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(buffer);
      return;
    }

    const safeName = `${Date.now()}-${fileName}`;
    const destDir = path.join(uploadsDir, folder);
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFile(path.join(destDir, safeName), buffer, (err) => {
      if (err) return reject(err);
      resolve({ url: `/uploads/${folder}/${safeName}`, publicId: null });
    });
  });

export const deleteUpload = async (publicId) => {
  if (!publicId || !useCloudinary) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }).catch(() => {});
};

export const isCloudinaryEnabled = useCloudinary;
