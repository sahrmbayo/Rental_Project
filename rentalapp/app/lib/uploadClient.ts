// Browser helper: asks our API for a signature, then uploads straight to Cloudinary.
export type UploadKind = 'image' | 'tour' | 'tour-video';

const MAX_BYTES: Record<UploadKind, number> = {
  image: 10 * 1024 * 1024,
  tour: 20 * 1024 * 1024,
  'tour-video': 100 * 1024 * 1024,
};

export async function uploadToCloudinary(file: File, kind: UploadKind) {
  if (file.size > MAX_BYTES[kind]) {
    throw new Error(`File is too large (max ${Math.round(MAX_BYTES[kind] / 1024 / 1024)} MB)`);
  }
  if (kind === 'image' && !file.type.startsWith('image/')) throw new Error('Please choose an image file');

  const sigRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind }),
  });
  if (!sigRes.ok) throw new Error('You are not allowed to upload files');
  const { signature, apiKey, cloudName, timestamp, folder, upload_preset } = await sigRes.json();

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  if (folder) form.append('folder', folder);
  if (upload_preset) form.append('upload_preset', upload_preset);

  const resourceType = kind === 'tour-video' ? 'video' : kind === 'tour' ? 'auto' : 'image';
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Upload failed');
  return { url: data.secure_url as string, publicId: data.public_id as string };
}
