// app/api/upload/route.ts
// Issues a short-lived signature so the browser can upload straight to Cloudinary.
import { NextResponse } from 'next/server';
import { cloudinary } from '../../lib/cloudinary';
import { errorResponse, requireAgent } from '../../lib/auth';

export async function POST(request: Request) {
  try {
    await requireAgent();
    const { kind } = (await request.json().catch(() => ({}))) as { kind?: string };

    const params: Record<string, string | number> = { timestamp: Math.round(Date.now() / 1000) };
    if (kind === 'tour-video') params.folder = 'tours/video';
    else if (kind === 'tour') params.folder = 'tours/images';
    else params.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET || 'Property_Image';

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

    return NextResponse.json({
      ...params,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (e) {
    return errorResponse(e, 'Could not sign upload');
  }
}
