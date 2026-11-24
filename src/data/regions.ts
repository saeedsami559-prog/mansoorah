import type { L10n } from '../i18n/types';

export interface Wilayat {
  id: string;
  name: L10n;
}

export interface Region {
  id: 'muscat' | 'batinah-north' | 'batinah-south' | 'dhofar';
  name: L10n;
  capital: L10n;
  wilayats: Wilayat[];
}

/** Launch governorates and their wilayats. */
export const REGIONS: Region[] = [
  {
    id: 'muscat',
    name: { en: 'Muscat', ar: 'مسقط' },
    capital: { en: 'Muscat', ar: 'مسقط' },
    wilayats: [
      { id: 'muscat', name: { en: 'Muscat', ar: 'مسقط' } },
      { id: 'muttrah', name: { en: 'Muttrah', ar: 'مطرح' } },
      { id: 'bawshar', name: { en: 'Bawshar', ar: 'بوشر' } },
      { id: 'seeb', name: { en: 'Seeb', ar: 'السيب' } },
      { id: 'amerat', name: { en: 'Al Amerat', ar: 'العامرات' } },
      { id: 'qurayyat', name: { en: 'Qurayyat', ar: 'قريات' } },
    ],
  },
  {
    id: 'batinah-north',
    name: { en: 'Al Batinah North', ar: 'شمال الباطنة' },
    capital: { en: 'Sohar', ar: 'صحار' },
    wilayats: [
      { id: 'sohar', name: { en: 'Sohar', ar: 'صحار' } },
      { id: 'shinas', name: { en: 'Shinas', ar: 'شناص' } },
      { id: 'liwa', name: { en: 'Liwa', ar: 'لوى' } },
      { id: 'saham', name: { en: 'Saham', ar: 'صحم' } },
      { id: 'khaburah', name: { en: 'Al Khaburah', ar: 'الخابورة' } },
      { id: 'suwaiq', name: { en: 'As Suwaiq', ar: 'السويق' } },
    ],
  },
  {
    id: 'batinah-south',
    name: { en: 'Al Batinah South', ar: 'جنوب الباطنة' },
    capital: { en: 'Rustaq', ar: 'الرستاق' },
    wilayats: [
      { id: 'rustaq', name: { en: 'Rustaq', ar: 'الرستاق' } },
      { id: 'awabi', name: { en: 'Al Awabi', ar: 'العوابي' } },
      { id: 'nakhal', name: { en: 'Nakhal', ar: 'نخل' } },
      { id: 'wadi-maawil', name: { en: 'Wadi Al Maawil', ar: 'وادي المعاول' } },
      { id: 'barka', name: { en: 'Barka', ar: 'بركاء' } },
      { id: 'musannah', name: { en: 'Al Musannah', ar: 'المصنعة' } },
    ],
  },
  {
    id: 'dhofar',
    name: { en: 'Dhofar', ar: 'ظفار' },
    capital: { en: 'Salalah', ar: 'صلالة' },
    wilayats: [
      { id: 'salalah', name: { en: 'Salalah', ar: 'صلالة' } },
      { id: 'taqah', name: { en: 'Taqah', ar: 'طاقة' } },
      { id: 'mirbat', name: { en: 'Mirbat', ar: 'مرباط' } },
      { id: 'thumrait', name: { en: 'Thumrait', ar: 'ثمريت' } },
      { id: 'sadah', name: { en: 'Sadah', ar: 'سدح' } },
      { id: 'rakhyut', name: { en: 'Rakhyut', ar: 'رخيوت' } },
    ],
  },
];

export type RegionId = Region['id'];

export function getRegion(id: string | undefined): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export function getWilayat(regionId: string, wilayatId: string): Wilayat | undefined {
  return getRegion(regionId)?.wilayats.find((w) => w.id === wilayatId);
}
