import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow cross-origin requests from network devices during development
  allowedDevOrigins: [
    "10.21.85.252", // Previous network IP
    "10.26.1.241",  // Current network IP
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
