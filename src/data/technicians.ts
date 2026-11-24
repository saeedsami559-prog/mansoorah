import type { L10n } from '../i18n/types';
import type { RegionId } from './regions';
import { availableSlots } from '../lib/slots';
import { relativeISO } from '../lib/dates';
import { canDo } from './services';

/** Fictional technicians for the prototype. Avatars are generated illustrations, never photos. */
export interface Technician {
  id: string;
  name: L10n;
  gender: 'm' | 'f';
  region: RegionId;
  wilayats: L10n[];
  skills: string[]; // service slugs
  rating: number;
  reviews: number;
  years: number;
  jobs: number;
  pro: boolean;
  languages: L10n;
  bio: L10n;
  /** Avatar palette index. */
  tone: number;
}

const AR_EN: L10n = { en: 'Arabic, English', ar: 'العربية، الإنجليزية' };
const AR_ONLY_PLUS: L10n = { en: 'Arabic, basic English', ar: 'العربية، إنجليزية أساسية' };

export const TECHNICIANS: Technician[] = [
  {
    id: 'hamed-alhinai',
    name: { en: 'Hamed Al-Hinai', ar: 'حامد الهنائي' },
    gender: 'm',
    region: 'muscat',
    wilayats: [
      { en: 'Seeb', ar: 'السيب' },
      { en: 'Bawshar', ar: 'بوشر' },
    ],
    skills: ['smart-door-lock', 'security-cameras', 'video-doorbell'],
    rating: 4.9,
    reviews: 212,
    years: 8,
    jobs: 640,
    pro: true,
    languages: AR_EN,
    bio: {
      en: 'Former security-systems installer who now focuses on smart locks and camera setups for villas in Seeb and Bawshar. Known for tidy cable work.',
      ar: 'عمل سابقًا في تركيب أنظمة الأمن، ويتخصص الآن في الأقفال الذكية والكاميرات للفلل في السيب وبوشر. معروف بترتيبه المتقن للأسلاك.',
    },
    tone: 0,
  },
  {
    id: 'khalid-alkindi',
    name: { en: 'Khalid Al-Kindi', ar: 'خالد الكندي' },
    gender: 'm',
    region: 'muscat',
    wilayats: [
      { en: 'Bawshar', ar: 'بوشر' },
      { en: 'Muttrah', ar: 'مطرح' },
      { en: 'Muscat', ar: 'مسقط' },
    ],
    skills: ['wifi-network', 'iot-hub', 'tech-repair'],
    rating: 4.8,
    reviews: 168,
    years: 6,
    jobs: 455,
    pro: true,
    languages: AR_EN,
    bio: {
      en: 'Network engineer by training. Fixes Wi-Fi dead zones in multi-floor homes and builds hub automations that families actually use.',
      ar: 'مهندس شبكات بالأساس. يعالج ضعف الواي فاي في المنازل متعددة الطوابق ويبني أتمتة منزلية تستخدمها العائلات فعلًا.',
    },
    tone: 1,
  },
  {
    id: 'fatma-albusaidi',
    name: { en: 'Fatma Al-Busaidi', ar: 'فاطمة البوسعيدية' },
    gender: 'f',
    region: 'muscat',
    wilayats: [
      { en: 'Seeb', ar: 'السيب' },
      { en: 'Al Amerat', ar: 'العامرات' },
    ],
    skills: ['smart-lighting', 'iot-hub', 'smart-ac-controller'],
    rating: 4.9,
    reviews: 134,
    years: 5,
    jobs: 380,
    pro: true,
    languages: AR_EN,
    bio: {
      en: 'Electrical technician specialising in smart lighting scenes and AC automations. Often requested by households who prefer a female technician.',
      ar: 'فنّية كهرباء متخصصة في مشاهد الإضاءة الذكية وأتمتة المكيّفات، وتطلبها كثير من الأسر التي تفضّل فنّية.',
    },
    tone: 2,
  },
  {
    id: 'yousuf-almaskari',
    name: { en: 'Yousuf Al-Maskari', ar: 'يوسف المسكري' },
    gender: 'm',
    region: 'batinah-north',
    wilayats: [
      { en: 'Sohar', ar: 'صحار' },
      { en: 'Liwa', ar: 'لوى' },
    ],
    skills: ['smart-door-lock', 'security-cameras', 'smart-lighting'],
    rating: 4.7,
    reviews: 96,
    years: 7,
    jobs: 310,
    pro: false,
    languages: AR_ONLY_PLUS,
    bio: {
      en: 'Covers Sohar and Liwa for locks, cameras and lighting. Patient with first-time smart-home owners and always explains the app step by step.',
      ar: 'يغطي صحار ولوى في الأقفال والكاميرات والإضاءة. صبور مع من يقتنون أجهزة ذكية لأول مرة ويشرح التطبيق خطوة بخطوة.',
    },
    tone: 3,
  },
  {
    id: 'salim-alshukaili',
    name: { en: 'Salim Al-Shukaili', ar: 'سالم الشكيلي' },
    gender: 'm',
    region: 'batinah-north',
    wilayats: [
      { en: 'Saham', ar: 'صحم' },
      { en: 'Sohar', ar: 'صحار' },
      { en: 'Al Khaburah', ar: 'الخابورة' },
    ],
    skills: ['wifi-network', 'tech-repair', 'smart-ac-controller'],
    rating: 4.6,
    reviews: 71,
    years: 4,
    jobs: 205,
    pro: false,
    languages: AR_ONLY_PLUS,
    bio: {
      en: 'Troubleshooter for TVs, streaming boxes, printers and routers. Gives a clear parts quote before touching anything.',
      ar: 'متخصص في تشخيص أعطال التلفزيونات وأجهزة البث والطابعات والراوترات، ويقدّم سعرًا واضحًا للقطع قبل أي عمل.',
    },
    tone: 4,
  },
  {
    id: 'ahmed-alsinani',
    name: { en: 'Ahmed Al-Sinani', ar: 'أحمد السناني' },
    gender: 'm',
    region: 'batinah-south',
    wilayats: [
      { en: 'Barka', ar: 'بركاء' },
      { en: 'Rustaq', ar: 'الرستاق' },
    ],
    skills: ['security-cameras', 'video-doorbell', 'smart-lighting'],
    rating: 4.8,
    reviews: 119,
    years: 9,
    jobs: 520,
    pro: true,
    languages: AR_EN,
    bio: {
      en: 'Nine years installing cameras and doorbells across Barka and Rustaq, including farms and large compounds with long gate distances.',
      ar: 'تسع سنوات في تركيب الكاميرات وأجراس الأبواب في بركاء والرستاق، بما في ذلك المزارع والمجمّعات الكبيرة ذات البوابات البعيدة.',
    },
    tone: 5,
  },
  {
    id: 'maryam-alrawahi',
    name: { en: 'Maryam Al-Rawahi', ar: 'مريم الرواحية' },
    gender: 'f',
    region: 'batinah-south',
    wilayats: [
      { en: 'Barka', ar: 'بركاء' },
      { en: 'Al Musannah', ar: 'المصنعة' },
      { en: 'Nakhal', ar: 'نخل' },
    ],
    skills: ['wifi-network', 'iot-hub', 'smart-lighting'],
    rating: 4.9,
    reviews: 88,
    years: 4,
    jobs: 240,
    pro: false,
    languages: AR_EN,
    bio: {
      en: 'IT graduate who sets up Wi-Fi, hubs and lighting for new homes in Barka and Al Musannah. Great at explaining settings simply.',
      ar: 'خرّيجة تقنية معلومات تُعدّ الواي فاي ووحدات التحكم والإضاءة للمنازل الجديدة في بركاء والمصنعة، وتشرح الإعدادات ببساطة.',
    },
    tone: 6,
  },
  {
    id: 'mohammed-almahri',
    name: { en: 'Mohammed Al-Mahri', ar: 'محمد المهري' },
    gender: 'm',
    region: 'dhofar',
    wilayats: [
      { en: 'Salalah', ar: 'صلالة' },
      { en: 'Taqah', ar: 'طاقة' },
    ],
    skills: ['smart-door-lock', 'security-cameras', 'video-doorbell', 'wifi-network'],
    rating: 4.8,
    reviews: 102,
    years: 6,
    jobs: 330,
    pro: true,
    languages: AR_EN,
    bio: {
      en: 'Salalah-based all-rounder for locks, cameras and Wi-Fi. Seals outdoor devices properly for the khareef humidity.',
      ar: 'فنّي متعدد المهارات في صلالة للأقفال والكاميرات والواي فاي، ويُحكم عزل الأجهزة الخارجية لتتحمّل رطوبة الخريف.',
    },
    tone: 7,
  },
  {
    id: 'abdullah-alshanfari',
    name: { en: 'Abdullah Al-Shanfari', ar: 'عبدالله الشنفري' },
    gender: 'm',
    region: 'dhofar',
    wilayats: [
      { en: 'Salalah', ar: 'صلالة' },
      { en: 'Mirbat', ar: 'مرباط' },
    ],
    skills: ['smart-ac-controller', 'tech-repair', 'iot-hub'],
    rating: 4.7,
    reviews: 64,
    years: 5,
    jobs: 190,
    pro: false,
    languages: AR_ONLY_PLUS,
    bio: {
      en: 'Handles AC controllers, gadget repairs and hub setups in Salalah and Mirbat. Quick, careful and punctual.',
      ar: 'يتولى وحدات التحكم بالمكيّفات وإصلاح الأجهزة وإعداد وحدات التحكم في صلالة ومرباط. سريع ودقيق وملتزم بالمواعيد.',
    },
    tone: 8,
  },
  {
    id: 'nasser-alhashmi',
    name: { en: 'Nasser Al-Hashmi', ar: 'ناصر الهاشمي' },
    gender: 'm',
    region: 'muscat',
    wilayats: [
      { en: 'Al Amerat', ar: 'العامرات' },
      { en: 'Qurayyat', ar: 'قريات' },
      { en: 'Muttrah', ar: 'مطرح' },
    ],
    skills: ['tech-repair', 'smart-ac-controller', 'wifi-network', 'smart-door-lock'],
    rating: 4.6,
    reviews: 57,
    years: 3,
    jobs: 150,
    pro: false,
    languages: AR_EN,
    bio: {
      en: 'Covers Al Amerat, Qurayyat and Muttrah for repairs, Wi-Fi and AC controllers. Comfortable working in apartments and older homes.',
      ar: 'يغطي العامرات وقريات ومطرح في الإصلاحات والواي فاي ووحدات التحكم بالمكيّفات، ومعتاد على العمل في الشقق والمنازل القديمة.',
    },
    tone: 9,
  },
];

export function getTechnician(id: string | undefined): Technician | undefined {
  return TECHNICIANS.find((t) => t.id === id);
}

export function techniciansFor(slug: string): Technician[] {
  return TECHNICIANS.filter((t) => canDo(t.skills, slug));
}

export type Availability = 'today' | 'tomorrow' | 'later';

/** Availability is derived from the same slot model as the booking picker, so labels never disagree. */
export function availability(techId: string, now = new Date()): Availability {
  if (availableSlots(techId, relativeISO(0, now), now).length > 0) return 'today';
  if (availableSlots(techId, relativeISO(1, now), now).length > 0) return 'tomorrow';
  return 'later';
}

/** Best match = highest rating, then most reviews, then availability. */
export function rankTechnicians(list: Technician[], now = new Date()): Technician[] {
  const order: Record<Availability, number> = { today: 0, tomorrow: 1, later: 2 };
  return [...list].sort(
    (a, b) => b.rating - a.rating || order[availability(a.id, now)] - order[availability(b.id, now)] || b.reviews - a.reviews,
  );
}

/** Rating distribution (5★…1★ as percentages) derived from the average, for the profile bars. */
export function ratingBreakdown(t: Technician): number[] {
  const five = Math.round((t.rating - 4) * 85 + 5);
  const four = Math.max(4, 100 - five - 6);
  const three = 4;
  const two = 1;
  const one = Math.max(0, 100 - five - four - three - two);
  return [five, four, three, two, one];
}
