/** @type {import('next').NextConfig} */
const nextConfig = {
  // A stray ~/pnpm-lock.yaml makes Next guess the home dir as the workspace root.
  turbopack: {
    root: import.meta.dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
