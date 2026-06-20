/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.multipedidos.com.br' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'down-br.img.susercontent.com' },
      { protocol: 'https', hostname: 'prod-superon-public-media.s3-sa-east-1.amazonaws.com' }
    ]
  },
};

module.exports = nextConfig;
