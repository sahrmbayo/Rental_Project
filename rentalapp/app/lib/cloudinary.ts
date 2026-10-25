import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function destroyImages(publicIds: string[]) {
  const results = await Promise.allSettled(
    publicIds.map((id) => cloudinary.uploader.destroy(id, { resource_type: 'image' }))
  );
  results.forEach((r) => r.status === 'rejected' && console.error('Cloudinary destroy failed:', r.reason));
}
