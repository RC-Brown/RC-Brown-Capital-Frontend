/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole:
      process.env.NODE_ENV != "development"
        ? {
            exclude: ["error"],
          }
        : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    domains: ["firebasestorage.googleapis.com", "storage.googleapis.com"],
  },
};

export default nextConfig;
