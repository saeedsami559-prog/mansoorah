import type { L10n } from '../i18n/types';

export interface TeamMember {
  name: L10n;
  role: L10n;
  tone: number;
}

export const TEAM: TeamMember[] = [
  {
    name: { en: 'Said Sami Said Albalushi', ar: 'سعيد سامي سعيد البلوشي' },
    role: { en: 'Team Leader – Project Manager & Technical Lead', ar: 'قائد الفريق – مدير المشروع والمسؤول التقني' },
    tone: 0,
  },
  {
    name: { en: 'Omar Waleed Omar Albalushi', ar: 'عمر وليد عمر البلوشي' },
    role: { en: 'Operations & Quality Coordinator', ar: 'منسّق العمليات والجودة' },
    tone: 1,
  },
  {
    name: { en: 'Younis Hamood Alrusheidi', ar: 'يونس حمود الرشيدي' },
    role: { en: 'Marketing Lead', ar: 'مسؤول التسويق' },
    tone: 3,
  },
  {
    name: { en: 'Musab Fadhil Alwardi', ar: 'مصعب فاضل الوردي' },
    role: { en: 'Finance Lead', ar: 'المسؤول المالي' },
    tone: 5,
  },
  {
    name: { en: 'Ali Said Almasoudi', ar: 'علي سعيد المسعودي' },
    role: { en: 'Partnerships & Technician Relations Coordinator', ar: 'منسّق الشراكات وعلاقات الفنيين' },
    tone: 7,
  },
  {
    name: { en: 'Abdulrahman Fahad Said Saaiyid Alghammari', ar: 'عبدالرحمن فهد سعيد سعيّد الغماري' },
    role: { en: 'Customer Support & Content Coordinator', ar: 'منسّق دعم العملاء والمحتوى' },
    tone: 9,
  },
];
