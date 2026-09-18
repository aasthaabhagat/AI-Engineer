import type { NextConfig } from "next";

/**
 * The app used to have fourteen top-level pages. It now has three, with the
 * old pages grouped underneath. These redirects keep every previously valid
 * URL — and every bookmark or anchor link — working.
 */
const MOVED: Record<string, string> = {
  "/today": "/",
  "/roadmap": "/plan/roadmap",
  "/calendar": "/plan/calendar",
  "/skills": "/plan/skills",
  "/projects": "/plan/projects",
  "/portfolio": "/plan/readiness",
  "/career": "/plan/readiness",
  "/reviews": "/plan/reviews",
  "/blueprints": "/library/patterns",
  "/system-design": "/library/system-design",
  "/radar": "/library/radar",
  "/knowledge": "/library/journal",
  "/plan": "/plan/roadmap",
  "/library": "/library/patterns",
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return Object.entries(MOVED).map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));
  },
};

export default nextConfig;
