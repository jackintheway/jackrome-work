/* Written by tools/build-site.py at deploy time from Netlify's CONTEXT
   build variable, so the function bundle knows which deploy it belongs
   to. The runtime does not expose that label (found 2026-09-13: the
   first live record landed in the preview store). Committed with the
   local default so imports resolve; the build overwrites it. */
export const BUILD_CONTEXT = "dev";
