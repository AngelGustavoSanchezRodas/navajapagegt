/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://cassette-voyage-troubling.ngrok-free.dev/api/:path*',
      },
    ];
  },
};

export default nextConfig;