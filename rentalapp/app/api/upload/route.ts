import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { image } = await request.json();

  const data = new FormData();
  data.append('file', image);
  data.append('upload_preset', 'Property_Image'); // from Cloudinary
  data.append('cloud_name', 'dnzhlitms');        // from Cloudinary

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dnzhlitms/image/upload', {
      method: 'POST',
      body: data,
    });

    const file = await res.json();
    return NextResponse.json({ url: file.secure_url });
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
