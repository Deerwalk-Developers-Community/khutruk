/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  images: {
    domains: ["gateway.pinata.cloud"],
  },
};

export default nextConfig;
