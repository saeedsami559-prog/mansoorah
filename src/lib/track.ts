import { DEMO_MODE } from '../config/site';

/**
 * Measurement hook. In demo mode it only logs to the console – no third-party trackers.
 * Connect a privacy-friendly analytics tool here after launch.
 */
export function track(event: string, props: Record<string, string | number | boolean> = {}): void {
  if (DEMO_MODE && import.meta.env.DEV) console.info('[track]', event, props);
}
