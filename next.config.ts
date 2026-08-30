import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `/cv` renders the PDF with @react-pdf and registers its fonts by reading
  // `public/fonts/*.ttf` off disk. Those reads are a runtime `path.join`, so
  // the output file tracer can't see them — and on a serverless deploy
  // `public/` is uploaded as CDN assets, not into the function's filesystem.
  // Without this, the route builds fine and then 500s in production.
  outputFileTracingIncludes: {
    "/cv": ["./public/fonts/**/*"],
  },
};

export default nextConfig;
