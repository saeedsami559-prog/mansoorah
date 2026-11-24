import type { L10n } from '../i18n/types';

export interface LegalSection {
  id: string;
  title: L10n;
  paragraphs?: L10n[];
  bullets?: L10n[];
}

export type LegalDoc = 'privacy' | 'terms' | 'cancellation';

/** Date of the current text (shown as "last updated"). */
export const LEGAL_UPDATED = '2026-11-24';

export const LEGAL: Record<LegalDoc, LegalSection[]> = {
  privacy: [
    {
      id: 'who',
      title: { en: 'Who we are', ar: 'من نحن' },
      paragraphs: [
        {
          en: 'Mansoorah is a student venture from the University of Technology and Applied Sciences (course UNEP2109). This website is a prototype and the business is not yet registered. Once registered, Mansoorah will be the data controller for the personal data described below.',
          ar: 'منصورة مشروع طلابي من جامعة التقنية والعلوم التطبيقية (مقرر UNEP2109). هذا الموقع نسخة تجريبية، والنشاط التجاري لم يُسجَّل بعد. وبعد التسجيل، ستكون منصورة الجهة المسؤولة عن معالجة البيانات الشخصية الموضحة أدناه.',
        },
        {
          en: 'We follow Oman’s Personal Data Protection Law (Royal Decree 6/2022) and its Executive Regulations (Ministerial Decision 34/2024), overseen by the Ministry of Transport, Communications and Information Technology.',
          ar: 'نلتزم بقانون حماية البيانات الشخصية في سلطنة عُمان (المرسوم السلطاني رقم 6/2022) ولائحته التنفيذية (القرار الوزاري رقم 34/2024)، وتشرف على تطبيقه وزارة النقل والاتصالات وتقنية المعلومات.',
        },
      ],
    },
    {
      id: 'now',
      title: { en: 'How we handle your data today', ar: 'كيف نتعامل مع بياناتك حاليًا' },
      bullets: [
        {
          en: 'When you create an account, your name, e-mail, mobile number and role are stored in our database (hosted by Supabase) so you can log in again from any device.',
          ar: 'عند إنشاء حساب، يُحفظ اسمك وبريدك الإلكتروني ورقم هاتفك ونوع حسابك في قاعدة بياناتنا (المستضافة لدى Supabase) لتتمكن من الدخول مجددًا من أي جهاز.',
        },
        {
          en: 'Passwords are encrypted by our authentication provider. Mansoorah staff can never see your password.',
          ar: 'تُشفَّر كلمات المرور لدى مزوّد خدمة الدخول، ولا يستطيع فريق منصورة الاطلاع على كلمة مرورك أبدًا.',
        },
        {
          en: 'Bookings, ratings, technician applications, partner requests and contact messages are stored in the same database and can only be read by you (your own bookings) and the Mansoorah admin.',
          ar: 'تُحفظ الحجوزات والتقييمات وطلبات انضمام الفنيين وطلبات الشراكة ورسائل التواصل في قاعدة البيانات نفسها، ولا يطّلع عليها إلا أنت (لحجوزاتك) ومدير منصورة.',
        },
        {
          en: 'No online payments are taken yet and no card details are collected.',
          ar: 'لا يتم تحصيل أي مدفوعات إلكترونية حاليًا ولا جمع أي بيانات بطاقات.',
        },
        {
          en: 'There are no third-party trackers or advertising cookies on this site.',
          ar: 'لا توجد أدوات تتبع من أطراف خارجية ولا ملفات تعريف إعلانية في هذا الموقع.',
        },
      ],
    },
    {
      id: 'data',
      title: { en: 'What data we collect', ar: 'البيانات التي نجمعها' },
      bullets: [
        {
          en: 'Contact details: name, mobile number and (optionally) e-mail.',
          ar: 'بيانات التواصل: الاسم ورقم الهاتف والبريد الإلكتروني (اختياري).',
        },
        {
          en: 'Visit details: governorate, wilayat, area, house number, landmark and notes you give us.',
          ar: 'تفاصيل الزيارة: المحافظة والولاية والمنطقة ورقم المنزل والمعلم القريب والملاحظات التي تقدمها.',
        },
        { en: 'Booking history, ratings and reviews.', ar: 'سجل الحجوزات والتقييمات والمراجعات.' },
        {
          en: 'Payment status (paid / unpaid) from the payment gateway – never your full card number.',
          ar: 'حالة الدفع (مدفوع / غير مدفوع) من بوابة الدفع – وليس رقم بطاقتك الكامل أبدًا.',
        },
        {
          en: 'For technicians: ID, background-check result, certificates and payout details.',
          ar: 'للفنيين: بيانات الهوية ونتيجة فحص السجل والشهادات وبيانات تحويل الأرباح.',
        },
      ],
    },
    {
      id: 'why',
      title: { en: 'Why we use it, and your consent', ar: 'لماذا نستخدمها، وموافقتك' },
      paragraphs: [
        {
          en: 'We use your data only to arrange and complete your visit, to contact you about it, to handle warranty and complaints, and to keep the platform safe. We ask for your explicit consent before collecting personal data, and you can withdraw it at any time. Withdrawing consent does not affect bookings already completed.',
          ar: 'نستخدم بياناتك فقط لترتيب زيارتك وإتمامها، والتواصل معك بشأنها، ومعالجة الضمان والشكاوى، والحفاظ على أمان المنصة. ونطلب موافقتك الصريحة قبل جمع أي بيانات شخصية، ويمكنك سحبها في أي وقت، دون أن يؤثر ذلك على الحجوزات المكتملة سابقًا.',
        },
        {
          en: 'We will never sell your data or use it for advertising by others.',
          ar: 'لن نبيع بياناتك أبدًا، ولن نستخدمها لإعلانات جهات أخرى.',
        },
      ],
    },
    {
      id: 'sharing',
      title: { en: 'Who we share it with', ar: 'مع من نشاركها' },
      bullets: [
        {
          en: 'The technician you book – only your name, mobile, address and notes needed for the visit.',
          ar: 'الفنّي الذي تحجزه – فقط اسمك ورقم هاتفك وعنوانك والملاحظات اللازمة للزيارة.',
        },
        {
          en: 'Licensed Omani payment gateways, when you pay online.',
          ar: 'بوابات الدفع العُمانية المرخّصة، عند الدفع إلكترونيًا.',
        },
        { en: 'Authorities, only when the law requires it.', ar: 'الجهات الرسمية، فقط عندما يقتضي القانون ذلك.' },
      ],
    },
    {
      id: 'retention',
      title: { en: 'How long we keep it', ar: 'مدة الاحتفاظ بالبيانات' },
      paragraphs: [
        {
          en: 'We keep booking records only as long as needed for the service, the warranty and our legal and accounting obligations, then delete or anonymise them. You can ask us to delete your account and data at any time through the Contact page.',
          ar: 'نحتفظ بسجلات الحجز فقط للمدة اللازمة لتقديم الخدمة والضمان والوفاء بالتزاماتنا القانونية والمحاسبية، ثم نحذفها أو نجعلها مجهولة الهوية. ويمكنك طلب حذف حسابك وبياناتك في أي وقت عبر صفحة «تواصل معنا».',
        },
      ],
    },
    {
      id: 'rights',
      title: { en: 'Your rights', ar: 'حقوقك' },
      paragraphs: [{ en: 'Under the law you can ask us to:', ar: 'وفقًا للقانون، يحق لك أن تطلب منا:' }],
      bullets: [
        {
          en: 'tell you what data we hold about you and give you a copy;',
          ar: 'إعلامك بالبيانات التي نحتفظ بها عنك وتزويدك بنسخة منها؛',
        },
        { en: 'correct data that is wrong or incomplete;', ar: 'تصحيح البيانات غير الصحيحة أو غير المكتملة؛' },
        { en: 'delete your data when it is no longer needed;', ar: 'حذف بياناتك عندما لا تعود هناك حاجة إليها؛' },
        {
          en: 'stop processing based on your consent (withdraw consent);',
          ar: 'إيقاف المعالجة القائمة على موافقتك (سحب الموافقة)؛',
        },
        { en: 'tell you if a breach puts your data at risk.', ar: 'إبلاغك إذا تعرّضت بياناتك للخطر بسبب أي اختراق.' },
      ],
    },
    {
      id: 'security',
      title: { en: 'Security and breaches', ar: 'الأمان والاختراقات' },
      paragraphs: [
        {
          en: 'We use encrypted connections, database access rules that limit each account to its own data, and (when payments go live) only licensed payment providers. If a breach affects your data, we will notify the competent authority and you as the law requires.',
          ar: 'نستخدم اتصالات مشفّرة، وقواعد وصول تقصر كل حساب على بياناته فقط، و(عند تفعيل الدفع) مزوّدي دفع مرخّصين فقط. وإذا تأثرت بياناتك بأي اختراق، سنبلغ الجهة المختصة ونبلغك وفق ما يقتضيه القانون.',
        },
      ],
    },
    {
      id: 'contact',
      title: { en: 'Contact', ar: 'التواصل' },
      paragraphs: [
        {
          en: 'For any privacy question or request, contact us through the Contact page. If you are not satisfied with our answer, you can raise a complaint with the Ministry of Transport, Communications and Information Technology.',
          ar: 'لأي سؤال أو طلب يتعلق بالخصوصية، تواصل معنا عبر صفحة «تواصل معنا». وإذا لم تكن راضيًا عن ردنا، يمكنك تقديم شكوى إلى وزارة النقل والاتصالات وتقنية المعلومات.',
        },
      ],
    },
  ],
  terms: [
    {
      id: 'about',
      title: { en: 'About these terms', ar: 'حول هذه الشروط' },
      paragraphs: [
        {
          en: 'These terms apply to the Mansoorah website. Mansoorah is currently a student prototype: bookings are demonstrations, no technician is dispatched and no payment is taken. Commercial registration is in progress.',
          ar: 'تنطبق هذه الشروط على موقع منصورة. منصورة حاليًا نموذج أولي لمشروع طلابي: الحجوزات للعرض فقط، ولا يُرسل أي فنّي ولا يُحصَّل أي مبلغ. والسجل التجاري قيد الإجراء.',
        },
      ],
    },
    {
      id: 'service',
      title: { en: 'Our service', ar: 'خدمتنا' },
      paragraphs: [
        {
          en: 'Mansoorah is a platform that connects you with verified, independent Omani technicians. The technician performs the work; Mansoorah handles booking, fixed pricing, quality follow-up and the warranty process.',
          ar: 'منصورة منصة تربطك بفنيين عُمانيين مستقلين وموثَّقين. يُنفّذ الفنّي العمل، بينما تتولى منصورة الحجز والتسعير الثابت ومتابعة الجودة وإجراءات الضمان.',
        },
      ],
    },
    {
      id: 'prices',
      title: { en: 'Prices and payment', ar: 'الأسعار والدفع' },
      bullets: [
        {
          en: 'Each service has one fixed price in OMR, shown before you book. It is the same for every technician.',
          ar: 'لكل خدمة سعر ثابت واحد بالريال العُماني يظهر قبل الحجز، وهو نفسه لجميع الفنيين.',
        },
        {
          en: 'Prices are final. VAT is not added while Mansoorah is below Oman’s VAT registration threshold.',
          ar: 'الأسعار نهائية، ولا تُضاف ضريبة القيمة المضافة ما دامت منصورة دون حدّ التسجيل الضريبي في سلطنة عُمان.',
        },
        {
          en: 'Devices are supplied by you unless stated. Spare parts on a repair visit are quoted and need your approval first.',
          ar: 'يوفّر العميل الأجهزة ما لم يُذكر خلاف ذلك، وتُسعَّر قطع الغيار في زيارات الإصلاح وتتطلب موافقتك أولًا.',
        },
        {
          en: 'You can pay by OmanNet debit card, credit card, Thawani wallet or cash on completion.',
          ar: 'يمكنك الدفع ببطاقة الخصم OmanNet أو البطاقة الائتمانية أو محفظة ثواني أو نقدًا عند الإنجاز.',
        },
      ],
    },
    {
      id: 'responsibilities',
      title: { en: 'Your responsibilities', ar: 'مسؤولياتك' },
      bullets: [
        { en: 'Give accurate contact and address details.', ar: 'تقديم بيانات تواصل وعنوان صحيحة.' },
        {
          en: 'Make sure someone aged 18 or over is present during the visit.',
          ar: 'التأكد من وجود شخص يبلغ 18 عامًا أو أكثر أثناء الزيارة.',
        },
        { en: 'Provide safe access and the device to be installed.', ar: 'توفير وصول آمن والجهاز المطلوب تركيبه.' },
        { en: 'Leave honest ratings based on your real experience.', ar: 'تقديم تقييمات صادقة مبنية على تجربتك الفعلية.' },
      ],
    },
    {
      id: 'warranty',
      title: { en: 'Warranty', ar: 'الضمان' },
      paragraphs: [
        {
          en: 'Work is covered for 7 days. If something the technician installed or fixed isn’t right, we arrange a return visit at no extra cost. Faults in the device itself are covered by the manufacturer.',
          ar: 'العمل مضمون لمدة 7 أيام. إذا ظهرت مشكلة فيما ركّبه الفنّي أو أصلحه، نرتّب زيارة أخرى دون أي تكلفة إضافية. أما أعطال الجهاز نفسه فتغطيها الشركة المصنّعة.',
        },
      ],
    },
    {
      id: 'liability',
      title: { en: 'Liability', ar: 'المسؤولية' },
      paragraphs: [
        {
          en: 'Nothing in these terms limits your rights under Oman’s Consumer Protection Law. Complaints are handled through our support team first; you may also contact the Consumer Protection Authority.',
          ar: 'لا يحدّ أي بند في هذه الشروط من حقوقك وفق قانون حماية المستهلك في سلطنة عُمان. تُعالج الشكاوى أولًا عبر فريق الدعم لدينا، ويمكنك أيضًا التواصل مع هيئة حماية المستهلك.',
        },
      ],
    },
    {
      id: 'law',
      title: { en: 'Governing law', ar: 'القانون الواجب التطبيق' },
      paragraphs: [
        { en: 'These terms are governed by the laws of the Sultanate of Oman.', ar: 'تخضع هذه الشروط لقوانين سلطنة عُمان.' },
      ],
    },
  ],
  cancellation: [
    {
      id: 'free',
      title: { en: 'Free cancellation', ar: 'الإلغاء المجاني' },
      paragraphs: [
        {
          en: 'You can cancel or reschedule any booking free of charge up to 3 hours before the visit, from My Bookings or by WhatsApp.',
          ar: 'يمكنك إلغاء أي حجز أو تغيير موعده مجانًا حتى 3 ساعات قبل الزيارة، من صفحة «حجوزاتي» أو عبر واتساب.',
        },
      ],
    },
    {
      id: 'late',
      title: { en: 'Late cancellations and no-shows', ar: 'الإلغاء المتأخر وعدم الحضور' },
      paragraphs: [
        {
          en: 'If you cancel less than 3 hours before the visit, or the technician cannot access the property, a late-cancellation fee may apply in the live service. The exact amount will be published here before launch. No fee applies in this prototype.',
          ar: 'إذا ألغيت قبل أقل من 3 ساعات من الزيارة، أو تعذّر على الفنّي الوصول إلى العقار، فقد تُطبَّق رسوم إلغاء متأخر في الخدمة الفعلية، وسيُنشر مقدارها هنا قبل الإطلاق. ولا تُطبَّق أي رسوم في هذه النسخة التجريبية.',
        },
      ],
    },
    {
      id: 'ours',
      title: { en: 'If we cancel', ar: 'إذا ألغينا نحن' },
      paragraphs: [
        {
          en: 'If a technician cannot attend, we offer you another technician or time slot. If none suits you, you get a full refund.',
          ar: 'إذا تعذّر حضور الفنّي، نعرض عليك فنّيًا أو موعدًا آخر، وإن لم يناسبك أي منهما تسترد المبلغ كاملًا.',
        },
      ],
    },
    {
      id: 'refunds',
      title: { en: 'Refunds', ar: 'استرداد المبالغ' },
      bullets: [
        {
          en: 'Online payments are refunded in full to the original payment method.',
          ar: 'تُسترد المدفوعات الإلكترونية كاملة إلى وسيلة الدفع الأصلية.',
        },
        {
          en: 'The time it takes to appear depends on your bank or wallet provider.',
          ar: 'تعتمد مدة ظهور المبلغ على البنك أو مزوّد المحفظة.',
        },
        {
          en: 'Cash bookings are paid only on completion, so there is nothing to refund if you cancel.',
          ar: 'الحجوزات النقدية تُدفع عند الإنجاز فقط، لذا لا يوجد ما يُسترد عند الإلغاء.',
        },
      ],
    },
    {
      id: 'warranty',
      title: { en: 'Warranty re-visits', ar: 'زيارات الضمان' },
      paragraphs: [
        {
          en: 'If the work isn’t right within 7 days, contact us and the technician returns at no extra cost. If it still can’t be fixed, we refund the service price.',
          ar: 'إذا لم يكن العمل على ما يرام خلال 7 أيام، تواصل معنا وسيعود الفنّي دون أي تكلفة إضافية، وإن تعذّر الإصلاح نعيد لك سعر الخدمة.',
        },
      ],
    },
  ],
};
