import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { SITE_URL, UPDATED_ISO } from "@/lib/site";

export const revalidate = 3600;

const DEFAULT_ROUTE_LAST_MODIFIED = "2026-08-13T02:08:56+01:00";

// These dates represent content changes in this repository, not a synthetic
// “freshness” signal. Keep a route out of the sitemap if its content is not
// valuable or cannot be supported by current evidence.
const routeLastModified: Record<string, string> = {
  "": "2026-08-17T16:36:52+01:00",
  "/order": "2026-08-17T16:36:52+01:00",
  "/data": UPDATED_ISO,
  "/research/world-cup-2026-replay-source-tracker": UPDATED_ISO,
  "/world-cup-2026": UPDATED_ISO,
  "/world-cup-2026/awards": UPDATED_ISO,
  "/world-cup-2026/final": UPDATED_ISO,
  "/world-cup-2026/final-standings": UPDATED_ISO,
  "/world-cup-history": UPDATED_ISO,
  "/world-cup-history/records": UPDATED_ISO,
  "/world-cup-history/winners": UPDATED_ISO,
};

const paths = [
  "",
  "/live-tv",
  "/sports",
  "/movies",
  "/series",
  "/pricing",
  "/order",
  "/setup-guides",
  "/world-cup-2026",
  "/world-cup-2026/final",
  "/world-cup-2026/final-standings",
  "/world-cup-2026/awards",
  "/world-cup-history",
  "/world-cup-history/winners",
  "/world-cup-history/records",
  "/world-cup-2026/replays",
  "/world-cup-2026/replays/usa",
  "/world-cup-2026/teams",
  "/world-cup-2026/host-cities",
  "/guides",
  "/guides/is-iptv-legal",
  "/guides/watch-soccer-without-cable",
  "/guides/streaming-latency",
  "/guides/sports-streaming-accessibility",
  "/data",
  "/research",
  "/research/streaming-benchmark-methodology",
  "/research/world-cup-2026-replay-source-tracker",
  "/updates",
  "/about",
  "/editorial-policy",
  "/corrections",
  "/contact",
  "/support",
  "/dmca",
  "/refund-policy",
  "/privacy-policy",
  "/terms-of-service",
];

const imageFor = (path: string) =>
  `${SITE_URL}/images/og/${path === "" ? "home" : path.replace(/^\//, "").replaceAll("/", "--")}.webp`;

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedEntries = paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(
      routeLastModified[path] ?? DEFAULT_ROUTE_LAST_MODIFIED,
    ),
    images: [imageFor(path)],
  }));

  const guideEntries = guides.map((guide) => {
    const path = `/guides/${guide.slug}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: new Date(guide.dateModified),
      images: [imageFor(path)],
    };
  });

  return [...fixedEntries, ...guideEntries];
}
