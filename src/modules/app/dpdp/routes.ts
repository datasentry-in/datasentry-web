/**
 * Where the DPDP mock lives (src/app/app/dpdp-demo). Every link in the mock
 * reads from here, so moving it is a one-line change plus the folder. The
 * live app, when it ships, mounts alongside at /app/dpdp.
 */
export const DEMO_BASE = '/app/dpdp-demo';

/** A path inside the console: demoPath() is the portfolio, demoPath(org, 'gaps') a module. */
export const demoPath = (...segments: string[]) => [DEMO_BASE, ...segments.filter(Boolean)].join('/');
