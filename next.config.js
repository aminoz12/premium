/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [55, 65, 75],
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/world-cup-2026-iptv/teams/:path*', destination: '/world-cup-2026/teams', permanent: true },
      { source: '/world-cup-2026-iptv/matches/:path*', destination: '/world-cup-2026', permanent: true },
      { source: '/world-cup-2026-iptv/usa/:path*', destination: '/world-cup-2026/replays/usa', permanent: true },
      { source: '/world-cup-2026-iptv/:path*', destination: '/world-cup-2026', permanent: true },
      { source: '/usa', destination: '/world-cup-2026/replays/usa', permanent: true },
      { source: '/uk', destination: '/world-cup-2026/replays', permanent: true },
      { source: '/fr', destination: '/world-cup-2026/replays', permanent: true },
      { source: '/es', destination: '/world-cup-2026/replays', permanent: true },
      { source: '/de', destination: '/world-cup-2026/replays', permanent: true },
      { source: '/gr', destination: '/world-cup-2026/replays', permanent: true },
      { source: '/al', destination: '/world-cup-2026/replays', permanent: true },
      { source: '/channels', destination: '/live-tv', permanent: true },
      { source: '/live-channels', destination: '/live-tv', permanent: true },
      { source: '/blog/world-cup-final-2026', destination: '/world-cup-2026/final', permanent: true },
      { source: '/blog/iptv-setup-guide', destination: '/guides/4k-hdr-sports-setup', permanent: true },
      { source: '/blog/how-to-use-iptv-on-firestick', destination: '/guides/best-device-live-sports', permanent: true },
      { source: '/blog/best-iptv-apps-android', destination: '/guides/best-device-live-sports', permanent: true },
      { source: '/:path+/', destination: '/:path+', permanent: true },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Content-Security-Policy', value: `default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` },
    ];
    const imageCacheHeaders = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }];
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/images/:path*', headers: imageCacheHeaders },
      { source: '/hero-fallback.webp', headers: imageCacheHeaders },
      { source: '/world-cup-fallback.webp', headers: imageCacheHeaders },
    ];
  },
};
module.exports = nextConfig;
