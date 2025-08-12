/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // For your property images
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // For property placeholders
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // For agent photo placeholders
      },
    ],
  },
};

export default nextConfig;