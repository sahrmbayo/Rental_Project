// app/api/upload-tour/route.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { file, type } = await req.json(); // base-64 string

    // decide resource_type
    const isVideo = type === 'video';
    const result = await cloudinary.uploader.upload(file, {
      folder: isVideo ? 'tours/video' : 'tours/images',
      resource_type: isVideo ? 'video' : 'auto', // ← force video when needed
    });

    return Response.json({ url: result.secure_url });
  } catch (e: any) {
    console.error('Cloudinary upload error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}