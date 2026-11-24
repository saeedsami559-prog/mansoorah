import type { L10n } from '../i18n/types';
import type { Faq } from './services';

export interface FaqGroup {
  id: string;
  title: L10n;
  items: Faq[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'booking',
    title: { en: 'Booking', ar: 'الحجز' },
    items: [
      {
        q: { en: 'How do I book a technician?', ar: 'كيف أحجز فنّيًا؟' },
        a: {
          en: 'Choose a service, pick a verified technician and a time slot, enter your address and confirm. It takes about two minutes and you don’t need to install an app.',
          ar: 'اختر الخدمة، ثم فنّيًا موثَّقًا وموعدًا مناسبًا، وأدخل عنوانك وأكّد الحجز. يستغرق ذلك نحو دقيقتين ولا تحتاج إلى تثبيت أي تطبيق.',
        },
      },
      {
        q: { en: 'How far ahead can I book?', ar: 'إلى أي مدى يمكنني الحجز مسبقًا؟' },
        a: {
          en: 'You can book up to 14 days ahead. Same-day visits are possible when a slot is at least two hours away. Fridays have limited afternoon slots.',
          ar: 'يمكنك الحجز حتى 14 يومًا مقدمًا. الزيارة في اليوم نفسه ممكنة إذا كان الموعد بعد ساعتين على الأقل. ويوم الجمعة متاح بمواعيد محدودة بعد العصر.',
        },
      },
      {
        q: { en: 'Which areas do you cover?', ar: 'ما المناطق التي تغطونها؟' },
        a: {
          en: 'At launch: Muscat, Al Batinah North, Al Batinah South and Dhofar. More governorates are on our roadmap.',
          ar: 'عند الإطلاق: مسقط وشمال الباطنة وجنوب الباطنة وظفار، وتشمل خطتنا محافظات أخرى لاحقًا.',
        },
      },
    ],
  },
  {
    id: 'pricing',
    title: { en: 'Pricing & payment', ar: 'الأسعار والدفع' },
    items: [
      {
        q: { en: 'Is the price really fixed?', ar: 'هل السعر ثابت فعلًا؟' },
        a: {
          en: 'Yes. Every service has one published price in OMR, the same for every technician, with no hidden fees. Only the Tech Repair visit may need parts, which are quoted and approved by you before any work.',
          ar: 'نعم. لكل خدمة سعر واحد معلن بالريال العُماني، وهو نفسه لجميع الفنيين، دون رسوم خفية. فقط زيارة الإصلاح قد تحتاج قطع غيار، وتُسعَّر وتوافق عليها قبل أي عمل.',
        },
      },
      {
        q: { en: 'Do you add VAT?', ar: 'هل تضيفون ضريبة القيمة المضافة؟' },
        a: {
          en: 'No. Prices are final. Mansoorah is below Oman’s VAT registration threshold, so VAT is not added.',
          ar: 'لا. الأسعار نهائية، فمنصورة دون حدّ التسجيل الإلزامي لضريبة القيمة المضافة في سلطنة عُمان، لذلك لا تُضاف الضريبة.',
        },
      },
      {
        q: { en: 'How can I pay?', ar: 'كيف يمكنني الدفع؟' },
        a: {
          en: 'OmanNet debit card, credit card, Thawani wallet, or cash when the job is complete. In this prototype no real payment is taken.',
          ar: 'ببطاقة الخصم عبر OmanNet، أو البطاقة الائتمانية، أو محفظة ثواني، أو نقدًا عند إتمام العمل. في هذه النسخة التجريبية لا يتم تحصيل أي مبالغ فعلية.',
        },
      },
    ],
  },
  {
    id: 'safety',
    title: { en: 'Technicians & safety', ar: 'الفنيون والأمان' },
    items: [
      {
        q: { en: 'How are technicians verified?', ar: 'كيف يتم التحقق من الفنيين؟' },
        a: {
          en: 'Every technician is Omani and goes through ID verification, a background check, a practical skills test and a short training on conduct in homes before going live.',
          ar: 'جميع الفنيين عُمانيون، ويمرّ كل منهم بالتحقق من الهوية وفحص السجل وخلفيته واختبار مهارات عملي وتدريب قصير على آداب العمل داخل المنازل قبل تفعيل حسابه.',
        },
      },
      {
        q: { en: 'Can I request a female technician?', ar: 'هل يمكنني طلب فنّية؟' },
        a: {
          en: 'Yes, where available. Filter technicians by name or mention it in the booking notes and we will do our best to match.',
          ar: 'نعم، حسب التوفر. يمكنك اختيار الفنّية من القائمة أو ذكر ذلك في ملاحظات الحجز وسنحرص على تلبية طلبك.',
        },
      },
      {
        q: { en: 'Are reviews real?', ar: 'هل التقييمات حقيقية؟' },
        a: {
          en: 'After launch, only customers with a completed booking can leave a review. On this prototype, all reviews shown are clearly labelled samples.',
          ar: 'بعد الإطلاق، لن يتمكن من التقييم إلا العملاء الذين اكتمل حجزهم. أما في هذه النسخة التجريبية فجميع التقييمات المعروضة أمثلة موضّحة بذلك.',
        },
      },
    ],
  },
  {
    id: 'warranty',
    title: { en: 'Warranty & cancellation', ar: 'الضمان والإلغاء' },
    items: [
      {
        q: { en: 'What does the 7-day warranty cover?', ar: 'ماذا يشمل ضمان الأيام السبعة؟' },
        a: {
          en: 'The work the technician did. If something they installed or fixed isn’t right within 7 days, they come back at no extra cost. Device faults are covered by the manufacturer’s warranty.',
          ar: 'يشمل العمل الذي نفّذه الفنّي. إذا ظهرت مشكلة فيما ركّبه أو أصلحه خلال 7 أيام، يعود دون أي تكلفة إضافية. أما أعطال الأجهزة نفسها فتغطيها ضمانة الشركة المصنّعة.',
        },
      },
      {
        q: { en: 'Can I cancel or reschedule?', ar: 'هل يمكنني الإلغاء أو تغيير الموعد؟' },
        a: {
          en: 'Yes. Cancellation and rescheduling are free up to 3 hours before the visit, from My Bookings.',
          ar: 'نعم. الإلغاء وتغيير الموعد مجانيان حتى 3 ساعات قبل الزيارة، من صفحة «حجوزاتي».',
        },
      },
      {
        q: { en: 'How do refunds work?', ar: 'كيف يتم استرداد المبلغ؟' },
        a: {
          en: 'If you paid online and cancel in time, the full amount goes back to the original payment method. See the Cancellation & Refund policy for details.',
          ar: 'إذا دفعت إلكترونيًا وألغيت في الوقت المحدد، يُعاد المبلغ كاملًا إلى وسيلة الدفع الأصلية. راجع سياسة الإلغاء والاسترداد للتفاصيل.',
        },
      },
    ],
  },
  {
    id: 'technicians',
    title: { en: 'For technicians', ar: 'للفنيين' },
    items: [
      {
        q: { en: 'How do I join as a technician?', ar: 'كيف أنضم كفنّي؟' },
        a: {
          en: 'Apply on the Join page. You need to be an Omani national with a valid ID, a relevant certificate or proven experience, your own basic tools and a smartphone.',
          ar: 'قدّم طلبك من صفحة «انضم كفنّي». يُشترط أن تكون عُماني الجنسية وتحمل بطاقة هوية سارية، مع شهادة ذات صلة أو خبرة مثبتة، وأدواتك الأساسية الخاصة وهاتف ذكي.',
        },
      },
      {
        q: { en: 'How much does Mansoorah keep?', ar: 'كم تأخذ منصورة من كل حجز؟' },
        a: {
          en: 'A 15%–20% commission on each completed booking. The rest is paid out to you weekly. The optional Pro plan costs 5 OMR a month.',
          ar: 'عمولة بين 15% و20% من كل حجز مكتمل، ويُحوَّل الباقي إليك أسبوعيًا. والباقة الاحترافية اختيارية بسعر 5 ر.ع. شهريًا.',
        },
      },
    ],
  },
  {
    id: 'privacy',
    title: { en: 'Privacy', ar: 'الخصوصية' },
    items: [
      {
        q: { en: 'What happens to my data on this prototype?', ar: 'ماذا يحدث لبياناتي في هذه النسخة التجريبية؟' },
        a: {
          en: 'Nothing leaves your browser. Bookings and forms are stored locally on your device, and are only shared if you choose to send them to us on WhatsApp or e-mail.',
          ar: 'لا يغادر أي شيء متصفحك. تُحفظ الحجوزات والنماذج محليًا على جهازك، ولا تُشارك إلا إذا اخترت إرسالها إلينا عبر واتساب أو البريد الإلكتروني.',
        },
      },
      {
        q: { en: 'Do you store card details?', ar: 'هل تحفظون بيانات البطاقات؟' },
        a: {
          en: 'Never. After launch, payments will run only through licensed Omani payment gateways; Mansoorah will not see or store your card number.',
          ar: 'أبدًا. بعد الإطلاق ستتم المدفوعات عبر بوابات دفع عُمانية مرخّصة فقط، ولن تطّلع منصورة على رقم بطاقتك أو تحفظه.',
        },
      },
    ],
  },
];

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items);
