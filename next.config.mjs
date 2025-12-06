/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase body size limit for base64 images
    },
  },
};

export default nextConfig;
