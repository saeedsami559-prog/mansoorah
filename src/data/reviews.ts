import type { L10n } from '../i18n/types';
import { hash } from '../lib/slots';
import type { Technician } from './technicians';

/** Sample reviews (prototype). Always labelled as samples in the UI. */
export interface Review {
  name: L10n;
  area: L10n;
  rating: number;
  service: string;
  text: L10n;
  /** Weeks ago, shown relatively so it never goes stale. */
  weeksAgo: number;
}

export const HOME_REVIEWS: Review[] = [
  {
    name: { en: 'Aisha S.', ar: 'عائشة س.' },
    area: { en: 'Al Mawaleh, Seeb', ar: 'الموالح، السيب' },
    rating: 5,
    service: 'smart-door-lock',
    text: {
      en: 'Booked in two minutes, the price was exactly what the site said, and the technician enrolled all our fingerprints and explained the app to my parents.',
      ar: 'حجزت في دقيقتين، وكان السعر مطابقًا تمامًا لما في الموقع، وسجّل الفنّي بصماتنا جميعًا وشرح التطبيق لوالديّ.',
    },
    weeksAgo: 2,
  },
  {
    name: { en: 'Mohammed R.', ar: 'محمد ر.' },
    area: { en: 'Sohar', ar: 'صحار' },
    rating: 5,
    service: 'security-cameras',
    text: {
      en: 'Two cameras on the gate and parking, cables hidden neatly. Being able to check the house from work gives real peace of mind.',
      ar: 'كاميرتان على البوابة والمواقف، والأسلاك مخفية بإتقان. أن أطمئن على البيت وأنا في العمل راحة بال حقيقية.',
    },
    weeksAgo: 3,
  },
  {
    name: { en: 'Huda K.', ar: 'هدى ك.' },
    area: { en: 'Salalah', ar: 'صلالة' },
    rating: 4,
    service: 'wifi-network',
    text: {
      en: 'Wi-Fi now reaches the upstairs bedrooms. The technician was on time and told us honestly that we only needed one extra mesh point.',
      ar: 'أصبح الواي فاي يصل إلى غرف الطابق العلوي. جاء الفنّي في موعده وأخبرنا بصراحة أننا نحتاج نقطة شبكة إضافية واحدة فقط.',
    },
    weeksAgo: 5,
  },
];

const TEXT_POOL: L10n[] = [
  {
    en: 'Arrived on time, worked cleanly and explained everything before leaving.',
    ar: 'وصل في الموعد، وعمل بنظافة، وشرح كل شيء قبل المغادرة.',
  },
  {
    en: 'Very professional. The fixed price made it easy to book without haggling.',
    ar: 'محترف جدًا. السعر الثابت جعل الحجز سهلًا دون مساومة.',
  },
  {
    en: 'Patient with my questions and set up the app on both our phones.',
    ar: 'كان صبورًا مع أسئلتي وأعدّ التطبيق على هاتفينا.',
  },
  {
    en: 'Good value. Took a little longer than expected but the result is perfect.',
    ar: 'قيمة ممتازة. استغرق وقتًا أطول قليلًا من المتوقع لكن النتيجة ممتازة.',
  },
  {
    en: 'Respectful in the house and left everything tidy. Will book again.',
    ar: 'محترم داخل المنزل وترك المكان مرتبًا. سأحجز مرة أخرى.',
  },
  {
    en: 'Found the real problem quickly and didn’t try to sell me anything I didn’t need.',
    ar: 'اكتشف المشكلة الحقيقية بسرعة ولم يحاول بيعي شيئًا لا أحتاجه.',
  },
  {
    en: 'Messaged on WhatsApp before arriving, which I really appreciated.',
    ar: 'تواصل عبر واتساب قبل الوصول، وهذا ما قدّرته كثيرًا.',
  },
];

const NAMES: L10n[] = [
  { en: 'Saif A.', ar: 'سيف ع.' },
  { en: 'Zainab H.', ar: 'زينب ح.' },
  { en: 'Talal M.', ar: 'طلال م.' },
  { en: 'Rahma S.', ar: 'رحمة س.' },
  { en: 'Badr K.', ar: 'بدر ك.' },
  { en: 'Noura J.', ar: 'نورة ج.' },
  { en: 'Hilal N.', ar: 'هلال ن.' },
  { en: 'Shamsa R.', ar: 'شمسة ر.' },
];

/** Five deterministic sample reviews per technician. */
export function reviewsFor(t: Technician): Review[] {
  return Array.from({ length: 5 }, (_, i) => {
    const h = hash(`${t.id}-${i}`);
    return {
      name: NAMES[h % NAMES.length],
      area: t.wilayats[i % t.wilayats.length],
      rating: i === 3 && t.rating < 4.8 ? 4 : 5,
      service: t.skills[i % t.skills.length],
      text: TEXT_POOL[(h >>> 3) % TEXT_POOL.length],
      weeksAgo: 1 + i * 2 + (h % 2),
    };
  });
}
