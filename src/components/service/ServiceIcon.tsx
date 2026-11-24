import {
  AirVent,
  BellRing,
  BookOpen,
  Cable,
  Camera,
  Cctv,
  Cpu,
  Gauge,
  Lightbulb,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { IncludedIcon } from '../../data/services';

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  'smart-door-lock': LockKeyhole,
  'security-cameras': Cctv,
  'video-doorbell': BellRing,
  'smart-lighting': Lightbulb,
  'iot-hub': Network,
  'wifi-network': Wifi,
  'smart-ac-controller': AirVent,
  'tech-repair': Wrench,
};

export const INCLUDED_ICONS: Record<IncludedIcon, LucideIcon> = {
  tool: Wrench,
  app: Smartphone,
  test: Gauge,
  guide: BookOpen,
  shield: ShieldCheck,
  wifi: Wifi,
  cable: Cable,
  search: Search,
  light: Lightbulb,
  camera: Camera,
  bell: BellRing,
  cpu: Cpu,
  gauge: Gauge,
  clean: Sparkles,
};

export function ServiceIcon({ slug, className = 'size-5' }: { slug: string; className?: string }) {
  const Icon = SERVICE_ICONS[slug] ?? Wrench;
  return <Icon className={className} aria-hidden="true" />;
}
