import type { L10n } from '../i18n/types';

export type ServiceCategory = 'smart' | 'maintenance';
export type IncludedIcon =
  | 'tool'
  | 'app'
  | 'test'
  | 'guide'
  | 'shield'
  | 'wifi'
  | 'cable'
  | 'search'
  | 'light'
  | 'camera'
  | 'bell'
  | 'cpu'
  | 'gauge'
  | 'clean';

export interface ServiceItem {
  icon: IncludedIcon;
  text: L10n;
}

export interface Faq {
  q: L10n;
  a: L10n;
}

export interface Service {
  slug: string;
  category: ServiceCategory;
  /** Fixed price in OMR – the same for every technician. */
  price: number;
  /** Optional note shown next to the price (e.g. parts quoted separately). */
  priceNote?: L10n;
  duration: { min: number; max: number };
  /** 1–100, used for "sort by popularity". */
  popularity: number;
  warranty: L10n;
  title: L10n;
  short: L10n;
  description: L10n;
  included: ServiceItem[];
  notIncluded: L10n[];
  prepare: L10n[];
  faq: Faq[];
  keywords: L10n;
}

const WARRANTY_7: L10n = { en: '7 days on installation', ar: '7 أيام على التركيب' };
const WARRANTY_7_GENERIC: L10n = { en: '7 days', ar: '7 أيام' };

const NOT_INCLUDED_DEVICE: L10n = { en: 'The device itself (supplied by you)', ar: 'الجهاز نفسه (توفّره أنت)' };
const NOT_INCLUDED_WIRING: L10n = { en: 'New electrical wiring or wall chasing', ar: 'تمديدات كهربائية جديدة أو تكسير الجدران' };
const NOT_INCLUDED_PARTS: L10n = { en: 'Spare parts or accessories', ar: 'قطع الغيار أو الملحقات' };

export const SERVICES: Service[] = [
  {
    slug: 'smart-door-lock',
    category: 'smart',
    price: 25,
    duration: { min: 60, max: 90 },
    popularity: 98,
    warranty: WARRANTY_7,
    title: { en: 'Smart Door Lock Installation', ar: 'تركيب قفل باب ذكي' },
    short: {
      en: 'Fit and configure a fingerprint, keypad or app-controlled lock on your main or internal door.',
      ar: 'تركيب وضبط قفل بالبصمة أو الرمز أو التطبيق على الباب الرئيسي أو الداخلي.',
    },
    description: {
      en: 'A verified technician removes your old lock, fits the new smart lock precisely to your door, pairs it with the manufacturer’s app and enrols every family member’s fingerprints or codes. You get a lock that closes smoothly, an app that works, and a clear walkthrough before we leave.',
      ar: 'يقوم فنّي موثَّق بفكّ القفل القديم وتركيب القفل الذكي الجديد بدقة على بابك، ثم ربطه بتطبيق الشركة المصنّعة وتسجيل بصمات أو رموز جميع أفراد الأسرة. تحصل على قفل يُغلق بسلاسة وتطبيق يعمل، مع شرح واضح قبل مغادرة الفنّي.',
    },
    included: [
      { icon: 'tool', text: { en: 'Removal of the old lock and precise fitting', ar: 'فكّ القفل القديم والتركيب بدقة' } },
      { icon: 'app', text: { en: 'App pairing and Wi-Fi/Bluetooth setup', ar: 'ربط التطبيق وإعداد الواي فاي أو البلوتوث' } },
      { icon: 'shield', text: { en: 'Enrolment of up to 6 fingerprints or codes', ar: 'تسجيل حتى 6 بصمات أو رموز' } },
      { icon: 'guide', text: { en: 'Handover walkthrough and battery tips', ar: 'شرح الاستخدام ونصائح البطاريات' } },
    ],
    notIncluded: [
      NOT_INCLUDED_DEVICE,
      { en: 'Door carpentry or re-drilling a new door', ar: 'أعمال النجارة أو تجهيز باب جديد بالكامل' },
      NOT_INCLUDED_PARTS,
    ],
    prepare: [
      { en: 'Keep the lock box, screws and manual next to the door.', ar: 'ضع علبة القفل والبراغي ودليل الاستخدام بجانب الباب.' },
      { en: 'Install the lock’s app on your phone and create an account.', ar: 'ثبّت تطبيق القفل على هاتفك وأنشئ حسابًا.' },
      {
        en: 'Make sure the people who need access are home to enrol fingerprints.',
        ar: 'تأكّد من وجود من يحتاجون الدخول لتسجيل بصماتهم.',
      },
    ],
    faq: [
      {
        q: { en: 'Will the lock fit my existing door?', ar: 'هل يناسب القفل بابي الحالي؟' },
        a: {
          en: 'Most smart locks fit standard wooden and metal doors 38–80 mm thick. Send us the lock model on WhatsApp before the visit and the technician will confirm.',
          ar: 'معظم الأقفال الذكية تناسب الأبواب الخشبية والمعدنية القياسية بسماكة 38–80 ملم. أرسل لنا موديل القفل عبر واتساب قبل الزيارة وسيؤكد الفنّي ذلك.',
        },
      },
      {
        q: { en: 'Can you help me choose a lock?', ar: 'هل يمكنكم مساعدتي في اختيار القفل؟' },
        a: {
          en: 'Yes. Tick “I need help choosing a device” when booking and the technician will recommend options that suit your door and budget.',
          ar: 'نعم. اختر «أحتاج مساعدة في اختيار الجهاز» عند الحجز وسيقترح الفنّي خيارات تناسب بابك وميزانيتك.',
        },
      },
      {
        q: { en: 'What if the lock stops working after installation?', ar: 'ماذا لو توقف القفل عن العمل بعد التركيب؟' },
        a: {
          en: 'Installation is covered for 7 days. If something we fitted isn’t right, the technician returns at no extra cost.',
          ar: 'التركيب مضمون لمدة 7 أيام. إذا ظهرت مشكلة في ما قمنا بتركيبه، يعود الفنّي دون أي تكلفة إضافية.',
        },
      },
    ],
    keywords: { en: 'smart lock installation Muscat, fingerprint door lock Oman', ar: 'تركيب قفل ذكي مسقط، قفل بصمة عمان' },
  },
  {
    slug: 'security-cameras',
    category: 'smart',
    price: 30,
    duration: { min: 90, max: 120 },
    popularity: 92,
    warranty: WARRANTY_7_GENERIC,
    title: { en: 'Security Camera Installation (up to 2 cameras)', ar: 'تركيب كاميرات مراقبة (حتى كاميرتين)' },
    short: {
      en: 'Mount up to two indoor or outdoor Wi-Fi cameras, aim them properly and connect them to your phone.',
      ar: 'تثبيت حتى كاميرتين داخليتين أو خارجيتين، وضبط زاوية الرؤية وربطهما بهاتفك.',
    },
    description: {
      en: 'We plan the best viewing angles with you, mount up to two cameras securely, route cables neatly along existing paths and connect everything to the camera app so you can watch live and receive motion alerts. Outdoor cameras are sealed against dust and heat.',
      ar: 'نخطط معك لأفضل زوايا الرؤية، ونثبّت حتى كاميرتين بإحكام، ونرتّب الأسلاك بشكل أنيق عبر المسارات الموجودة، ثم نربط كل شيء بتطبيق الكاميرا لتشاهد البث المباشر وتصلك تنبيهات الحركة. ونحكم عزل الكاميرات الخارجية ضد الغبار والحرارة.',
    },
    included: [
      {
        icon: 'camera',
        text: { en: 'Mounting of up to 2 cameras indoor or outdoor', ar: 'تثبيت حتى كاميرتين داخل المنزل أو خارجه' },
      },
      {
        icon: 'cable',
        text: { en: 'Neat cable routing along existing paths', ar: 'ترتيب الأسلاك بشكل أنيق عبر المسارات الموجودة' },
      },
      { icon: 'app', text: { en: 'App setup, live view and motion alerts', ar: 'إعداد التطبيق والبث المباشر وتنبيهات الحركة' } },
      { icon: 'shield', text: { en: 'Privacy zones and secure passwords', ar: 'ضبط مناطق الخصوصية وكلمات مرور آمنة' } },
    ],
    notIncluded: [
      NOT_INCLUDED_DEVICE,
      NOT_INCLUDED_WIRING,
      { en: 'Cameras beyond the first two (quoted on site)', ar: 'أي كاميرا إضافية بعد الكاميرتين (يُسعَّر في الموقع)' },
    ],
    prepare: [
      {
        en: 'Decide which areas you want covered (gate, parking, majlis entrance…).',
        ar: 'حدّد المناطق التي تريد تغطيتها (البوابة، المواقف، مدخل المجلس…).',
      },
      {
        en: 'Make sure there is a power socket near each camera position.',
        ar: 'تأكّد من وجود مقبس كهرباء قريب من مكان كل كاميرا.',
      },
      { en: 'Have your Wi-Fi name and password ready.', ar: 'جهّز اسم شبكة الواي فاي وكلمة المرور.' },
    ],
    faq: [
      {
        q: { en: 'Can I watch the cameras when I’m away?', ar: 'هل يمكنني مشاهدة الكاميرات وأنا خارج المنزل؟' },
        a: {
          en: 'Yes. The technician sets up remote viewing in the camera app and tests it on mobile data before leaving.',
          ar: 'نعم. يُعدّ الفنّي المشاهدة عن بُعد في تطبيق الكاميرا ويختبرها عبر بيانات الجوال قبل المغادرة.',
        },
      },
      {
        q: { en: 'Do you install wired CCTV systems?', ar: 'هل تركّبون أنظمة كاميرات سلكية؟' },
        a: {
          en: 'This fixed-price service covers up to two Wi-Fi or PoE cameras on existing power. Larger wired systems are quoted after a site visit.',
          ar: 'تشمل هذه الخدمة بسعر ثابت حتى كاميرتين تعملان بالواي فاي أو PoE على مصادر كهرباء موجودة. الأنظمة السلكية الأكبر تُسعَّر بعد زيارة الموقع.',
        },
      },
      {
        q: { en: 'Will cameras survive the summer heat?', ar: 'هل تتحمل الكاميرات حرارة الصيف؟' },
        a: {
          en: 'We recommend outdoor cameras rated IP65 or higher and mount them away from direct afternoon sun where possible.',
          ar: 'ننصح بكاميرات خارجية بتصنيف IP65 أو أعلى، ونثبّتها بعيدًا عن شمس الظهيرة المباشرة قدر الإمكان.',
        },
      },
    ],
    keywords: { en: 'security camera installation Oman, CCTV Muscat', ar: 'تركيب كاميرات مراقبة مسقط، كاميرات منزلية عمان' },
  },
  {
    slug: 'video-doorbell',
    category: 'smart',
    price: 18,
    duration: { min: 45, max: 60 },
    popularity: 84,
    warranty: WARRANTY_7_GENERIC,
    title: { en: 'Video Doorbell Installation', ar: 'تركيب جرس باب بالفيديو' },
    short: {
      en: 'See and talk to visitors from your phone with a properly mounted, connected video doorbell.',
      ar: 'شاهد زوّارك وتحدّث معهم من هاتفك عبر جرس باب بالفيديو مثبَّت ومتصل بشكل صحيح.',
    },
    description: {
      en: 'We mount your video doorbell at the right height for clear faces, connect it to existing doorbell wiring or set it up on battery, and pair it with your phone and any indoor chime. We check Wi-Fi strength at the gate so calls don’t drop.',
      ar: 'نثبّت جرس الباب بالفيديو على الارتفاع المناسب لرؤية الوجوه بوضوح، ونوصله بأسلاك الجرس الموجودة أو نعدّه للعمل بالبطارية، ثم نربطه بهاتفك وبالجرس الداخلي إن وُجد. ونتحقق من قوة الواي فاي عند البوابة حتى لا تنقطع المكالمات.',
    },
    included: [
      { icon: 'bell', text: { en: 'Mounting at the ideal height and angle', ar: 'التثبيت على الارتفاع والزاوية المثاليين' } },
      {
        icon: 'cable',
        text: {
          en: 'Connection to existing doorbell wiring or battery setup',
          ar: 'التوصيل بأسلاك الجرس الحالية أو الإعداد بالبطارية',
        },
      },
      { icon: 'wifi', text: { en: 'Wi-Fi signal check at the door or gate', ar: 'فحص إشارة الواي فاي عند الباب أو البوابة' } },
      { icon: 'app', text: { en: 'App pairing, chime and notifications', ar: 'ربط التطبيق والجرس الداخلي والإشعارات' } },
    ],
    notIncluded: [
      NOT_INCLUDED_DEVICE,
      NOT_INCLUDED_WIRING,
      { en: 'Wi-Fi extenders (available with Home Wi-Fi Setup)', ar: 'مقويات الواي فاي (متاحة ضمن خدمة إعداد الواي فاي)' },
    ],
    prepare: [
      { en: 'Tell us whether your gate is far from the router.', ar: 'أخبرنا إن كانت البوابة بعيدة عن الراوتر.' },
      {
        en: 'Charge the doorbell battery fully if it is battery-powered.',
        ar: 'اشحن بطارية الجرس بالكامل إن كان يعمل بالبطارية.',
      },
      { en: 'Install the doorbell app and sign in.', ar: 'ثبّت تطبيق الجرس وسجّل الدخول.' },
    ],
    faq: [
      {
        q: { en: 'My gate is far from the house. Will it work?', ar: 'بوابتي بعيدة عن المنزل، هل سيعمل الجرس؟' },
        a: {
          en: 'The technician measures signal strength first. If it is weak, they will suggest an extender or mesh point before mounting.',
          ar: 'يقيس الفنّي قوة الإشارة أولًا، وإن كانت ضعيفة يقترح مقوّيًا أو نقطة شبكة قبل التثبيت.',
        },
      },
      {
        q: { en: 'Can several family members answer the door?', ar: 'هل يمكن لعدة أفراد من الأسرة الرد على الجرس؟' },
        a: {
          en: 'Yes. We add shared users in the app so everyone gets the call.',
          ar: 'نعم. نضيف مستخدمين مشتركين في التطبيق لتصل المكالمة للجميع.',
        },
      },
      {
        q: { en: 'Do I need a subscription?', ar: 'هل أحتاج إلى اشتراك؟' },
        a: {
          en: 'Some brands charge for cloud recording. The technician will explain the free features of your model so you can decide.',
          ar: 'بعض العلامات التجارية تفرض رسومًا على التسجيل السحابي. سيشرح لك الفنّي المزايا المجانية في جهازك لتقرّر بنفسك.',
        },
      },
    ],
    keywords: { en: 'video doorbell installation Oman', ar: 'تركيب جرس باب ذكي عمان' },
  },
  {
    slug: 'smart-lighting',
    category: 'smart',
    price: 20,
    duration: { min: 60, max: 90 },
    popularity: 80,
    warranty: WARRANTY_7_GENERIC,
    title: { en: 'Smart Lighting Setup (up to 6 points)', ar: 'إعداد الإضاءة الذكية (حتى 6 نقاط)' },
    short: {
      en: 'Install and configure up to six smart bulbs, switches or LED strips with scenes and schedules.',
      ar: 'تركيب وضبط حتى ست لمبات أو مفاتيح أو شرائط LED ذكية مع المشاهد والجداول الزمنية.',
    },
    description: {
      en: 'Up to six smart bulbs, switches or LED strips installed and grouped by room, with scenes like “Majlis”, “Night” or “Away”, schedules and voice-assistant control. We make sure switches stay usable for guests and older family members.',
      ar: 'تركيب حتى ست لمبات أو مفاتيح أو شرائط LED ذكية وتجميعها حسب الغرف، مع مشاهد مثل «المجلس» و«الليل» و«خارج المنزل»، وجداول زمنية والتحكم بالمساعد الصوتي. ونحرص على أن تبقى المفاتيح سهلة الاستخدام للضيوف وكبار السن.',
    },
    included: [
      {
        icon: 'light',
        text: { en: 'Installation of up to 6 bulbs, switches or strips', ar: 'تركيب حتى 6 لمبات أو مفاتيح أو شرائط' },
      },
      { icon: 'app', text: { en: 'Room groups and app control', ar: 'تجميع الغرف والتحكم عبر التطبيق' } },
      { icon: 'gauge', text: { en: 'Scenes and schedules set up with you', ar: 'إعداد المشاهد والجداول الزمنية معك' } },
      { icon: 'guide', text: { en: 'Voice assistant linking if you have one', ar: 'الربط بالمساعد الصوتي إن وُجد' } },
    ],
    notIncluded: [
      NOT_INCLUDED_DEVICE,
      NOT_INCLUDED_WIRING,
      { en: 'Points beyond the first six (quoted on site)', ar: 'أي نقطة إضافية بعد النقاط الست (تُسعَّر في الموقع)' },
    ],
    prepare: [
      {
        en: 'Check that switch boxes have a neutral wire if you bought smart switches.',
        ar: 'تأكّد من وجود سلك محايد في علب المفاتيح إن اشتريت مفاتيح ذكية.',
      },
      { en: 'Write down which rooms and scenes you want.', ar: 'دوّن الغرف والمشاهد التي ترغب بها.' },
      { en: 'Have your Wi-Fi password ready.', ar: 'جهّز كلمة مرور الواي فاي.' },
    ],
    faq: [
      {
        q: { en: 'Do smart switches need a neutral wire?', ar: 'هل تحتاج المفاتيح الذكية إلى سلك محايد؟' },
        a: {
          en: 'Many do. The technician checks your switch boxes and recommends no-neutral models if needed.',
          ar: 'كثير منها يحتاج ذلك. يفحص الفنّي علب المفاتيح ويقترح طرازات لا تحتاج سلكًا محايدًا عند الحاجة.',
        },
      },
      {
        q: { en: 'Will normal switches still work?', ar: 'هل ستبقى المفاتيح العادية تعمل؟' },
        a: {
          en: 'Yes. We configure everything so guests can still use the wall switch as usual.',
          ar: 'نعم. نضبط كل شيء بحيث يستطيع الضيوف استخدام المفتاح الجداري كالمعتاد.',
        },
      },
      {
        q: { en: 'Can lights turn on automatically at Maghrib?', ar: 'هل يمكن تشغيل الإضاءة تلقائيًا عند المغرب؟' },
        a: {
          en: 'Yes. We can schedule lights at sunset, which shifts automatically through the year.',
          ar: 'نعم. يمكن جدولة الإضاءة مع غروب الشمس، ويتغيّر التوقيت تلقائيًا على مدار السنة.',
        },
      },
    ],
    keywords: { en: 'smart lighting installation Oman', ar: 'إضاءة ذكية تركيب مسقط' },
  },
  {
    slug: 'iot-hub',
    category: 'smart',
    price: 20,
    duration: { min: 60, max: 60 },
    popularity: 70,
    warranty: WARRANTY_7_GENERIC,
    title: { en: 'IoT Hub & Smart Home Controller Setup', ar: 'إعداد وحدة التحكم المنزلية الذكية' },
    short: {
      en: 'Bring all your smart devices into one hub or app, with automations that actually help.',
      ar: 'اجمع كل أجهزتك الذكية في وحدة تحكم أو تطبيق واحد، مع أتمتة مفيدة فعلًا.',
    },
    description: {
      en: 'We set up your smart-home hub or controller, connect your existing devices to it, and build simple automations: lights off when everyone leaves, door alerts at night, AC on before you arrive. One app, one place, less hassle.',
      ar: 'نُعدّ وحدة التحكم أو الموزّع الذكي في منزلك، ونربط به أجهزتك الحالية، ونبني أتمتة بسيطة: إطفاء الإضاءة عند خروج الجميع، وتنبيهات الباب ليلًا، وتشغيل المكيّف قبل وصولك. تطبيق واحد ومكان واحد وراحة أكبر.',
    },
    included: [
      { icon: 'cpu', text: { en: 'Hub placement and network connection', ar: 'تحديد مكان الوحدة وربطها بالشبكة' } },
      { icon: 'app', text: { en: 'Pairing of your existing smart devices', ar: 'ربط أجهزتك الذكية الحالية' } },
      { icon: 'gauge', text: { en: 'Up to 5 everyday automations', ar: 'حتى 5 عمليات أتمتة يومية' } },
      { icon: 'guide', text: { en: 'Family accounts and a short training', ar: 'حسابات للعائلة وتدريب قصير' } },
    ],
    notIncluded: [
      NOT_INCLUDED_DEVICE,
      { en: 'Installing new devices (book them separately)', ar: 'تركيب أجهزة جديدة (تُحجز بشكل منفصل)' },
      NOT_INCLUDED_PARTS,
    ],
    prepare: [
      { en: 'Make a list of the smart devices you already have.', ar: 'جهّز قائمة بالأجهزة الذكية الموجودة لديك.' },
      { en: 'Keep the hub near your router with a free power socket.', ar: 'ضع الوحدة قرب الراوتر مع مقبس كهرباء متاح.' },
      { en: 'Think about the routines you want automated.', ar: 'فكّر في الأمور اليومية التي تريد أتمتتها.' },
    ],
    faq: [
      {
        q: { en: 'Which hubs do you support?', ar: 'ما وحدات التحكم التي تدعمونها؟' },
        a: {
          en: 'Common Zigbee, Matter and Wi-Fi hubs sold in Oman. Share your model on WhatsApp if you are unsure.',
          ar: 'وحدات Zigbee وMatter والواي فاي الشائعة في السوق العُماني. أرسل لنا الموديل عبر واتساب إن لم تكن متأكدًا.',
        },
      },
      {
        q: { en: 'Can devices from different brands work together?', ar: 'هل يمكن لأجهزة من علامات مختلفة أن تعمل معًا؟' },
        a: {
          en: 'Often yes, through the hub or Matter. The technician checks compatibility before starting.',
          ar: 'غالبًا نعم، عبر وحدة التحكم أو معيار Matter. يتحقق الفنّي من التوافق قبل البدء.',
        },
      },
      {
        q: { en: 'What happens if the internet goes down?', ar: 'ماذا يحدث إذا انقطع الإنترنت؟' },
        a: {
          en: 'Local hubs keep most automations running offline. We show you which ones depend on the internet.',
          ar: 'تستمر معظم عمليات الأتمتة في الوحدات المحلية دون إنترنت، ونوضّح لك ما يعتمد منها على الاتصال.',
        },
      },
    ],
    keywords: { en: 'smart home hub setup Oman', ar: 'إعداد منزل ذكي عمان' },
  },
  {
    slug: 'wifi-network',
    category: 'maintenance',
    price: 15,
    duration: { min: 45, max: 60 },
    popularity: 95,
    warranty: WARRANTY_7_GENERIC,
    title: { en: 'Home Wi-Fi Setup & Optimization', ar: 'إعداد وتحسين شبكة الواي فاي المنزلية' },
    short: {
      en: 'Fix dead zones and slow speeds: router placement, mesh setup and secure settings.',
      ar: 'تخلّص من المناطق الميتة والسرعات البطيئة: موقع الراوتر وإعداد الشبكة المتداخلة وإعدادات آمنة.',
    },
    description: {
      en: 'Concrete villas and multi-floor homes are hard on Wi-Fi. We measure signal in every room, reposition your router, set up mesh points or extenders you have bought, separate a guest network and secure everything with strong passwords and updated firmware.',
      ar: 'الفلل الخرسانية والمنازل متعددة الطوابق تُضعف إشارة الواي فاي. نقيس الإشارة في كل غرفة، ونعيد تموضع الراوتر، ونُعدّ نقاط الشبكة المتداخلة أو المقويات التي اشتريتها، ونفصل شبكة للضيوف، ونؤمّن كل شيء بكلمات مرور قوية وتحديثات محدّثة.',
    },
    included: [
      { icon: 'search', text: { en: 'Room-by-room signal survey', ar: 'قياس الإشارة في كل غرفة' } },
      {
        icon: 'wifi',
        text: { en: 'Router placement and channel optimisation', ar: 'تحسين موقع الراوتر واختيار القناة المناسبة' },
      },
      {
        icon: 'cable',
        text: { en: 'Mesh or extender setup (your devices)', ar: 'إعداد الشبكة المتداخلة أو المقويات (من أجهزتك)' },
      },
      {
        icon: 'shield',
        text: { en: 'Guest network, strong passwords, firmware update', ar: 'شبكة للضيوف وكلمات مرور قوية وتحديث البرنامج' },
      },
    ],
    notIncluded: [
      { en: 'Routers, mesh points or extenders', ar: 'أجهزة الراوتر أو نقاط الشبكة أو المقويات' },
      { en: 'Changes to your internet plan with the provider', ar: 'تعديل باقة الإنترنت مع مزوّد الخدمة' },
      { en: 'Running new network cables through walls', ar: 'تمديد كابلات شبكة جديدة داخل الجدران' },
    ],
    prepare: [
      {
        en: 'Have your router admin login (often on a sticker underneath).',
        ar: 'جهّز بيانات دخول الراوتر (غالبًا على ملصق أسفله).',
      },
      { en: 'Note the rooms where Wi-Fi is weakest.', ar: 'حدّد الغرف التي تضعف فيها الإشارة.' },
      { en: 'Keep any mesh units or extenders unboxed and ready.', ar: 'أخرج نقاط الشبكة أو المقويات من علبها وجهّزها.' },
    ],
    faq: [
      {
        q: { en: 'Will this increase my internet speed?', ar: 'هل سيزيد هذا من سرعة الإنترنت؟' },
        a: {
          en: 'We can’t exceed your plan’s speed, but most homes get much closer to it in every room after optimisation.',
          ar: 'لا يمكننا تجاوز سرعة باقتك، لكن معظم المنازل تقترب منها كثيرًا في كل الغرف بعد التحسين.',
        },
      },
      {
        q: { en: 'Do you work with all providers?', ar: 'هل تعملون مع جميع مزوّدي الخدمة؟' },
        a: {
          en: 'Yes, we work with the router you have, whichever provider supplied it.',
          ar: 'نعم، نتعامل مع الراوتر الموجود لديك أيًّا كان مزوّد الخدمة.',
        },
      },
      {
        q: { en: 'Should I buy a mesh system?', ar: 'هل أشتري نظام شبكة متداخلة؟' },
        a: {
          en: 'For villas with two or more floors, usually yes. Book the survey first and the technician will tell you how many units you need.',
          ar: 'للفلل ذات الطابقين أو أكثر، غالبًا نعم. احجز الفحص أولًا وسيخبرك الفنّي بعدد الوحدات التي تحتاجها.',
        },
      },
    ],
    keywords: { en: 'wifi setup Muscat, mesh wifi installation Oman', ar: 'تقوية الواي فاي مسقط، إعداد شبكة منزلية' },
  },
  {
    slug: 'smart-ac-controller',
    category: 'maintenance',
    price: 12,
    duration: { min: 30, max: 45 },
    popularity: 76,
    warranty: WARRANTY_7_GENERIC,
    title: { en: 'Smart AC Controller Setup', ar: 'إعداد وحدة تحكم المكيّف الذكية' },
    short: {
      en: 'Control split ACs from your phone with schedules that keep the house cool and the bill lower.',
      ar: 'تحكّم بالمكيّفات من هاتفك مع جداول تحافظ على برودة المنزل وتخفّض الفاتورة.',
    },
    description: {
      en: 'We install your smart AC controller, teach it your AC remote’s signals, and set schedules and temperature limits that keep rooms comfortable during Omani summers without wasting power. Turn the AC on before you get home.',
      ar: 'نركّب وحدة التحكم الذكية للمكيّف، ونبرمجها على إشارات جهاز التحكم عن بُعد، ونضبط جداول وحدودًا للحرارة تُبقي الغرف مريحة في صيف عُمان دون هدر للكهرباء. شغّل المكيّف قبل أن تصل إلى المنزل.',
    },
    included: [
      {
        icon: 'tool',
        text: { en: 'Mounting the controller with clear line of sight', ar: 'تثبيت الوحدة في موضع مواجه للمكيّف' },
      },
      { icon: 'app', text: { en: 'Remote learning and app pairing', ar: 'برمجة إشارات الريموت وربط التطبيق' } },
      { icon: 'gauge', text: { en: 'Schedules and energy-saving limits', ar: 'جداول تشغيل وحدود لتوفير الطاقة' } },
      { icon: 'guide', text: { en: 'Quick demo for the whole family', ar: 'شرح سريع لجميع أفراد الأسرة' } },
    ],
    notIncluded: [
      NOT_INCLUDED_DEVICE,
      { en: 'AC servicing, gas refills or repairs', ar: 'صيانة المكيّف أو تعبئة الغاز أو الإصلاح' },
      NOT_INCLUDED_PARTS,
    ],
    prepare: [
      { en: 'Keep the original AC remote with working batteries.', ar: 'جهّز ريموت المكيّف الأصلي ببطاريات تعمل.' },
      { en: 'Note the AC brand and model.', ar: 'دوّن علامة المكيّف وطرازه.' },
      { en: 'Have your Wi-Fi password ready.', ar: 'جهّز كلمة مرور الواي فاي.' },
    ],
    faq: [
      {
        q: { en: 'Does it work with my AC brand?', ar: 'هل يعمل مع علامة مكيّفي؟' },
        a: {
          en: 'Most infrared-remote split and window ACs are supported. The technician confirms on the spot.',
          ar: 'معظم المكيّفات الجدارية والشباك التي تعمل بريموت الأشعة تحت الحمراء مدعومة، ويؤكد الفنّي ذلك في الموقع.',
        },
      },
      {
        q: { en: 'Is one controller enough for the house?', ar: 'هل تكفي وحدة واحدة للمنزل؟' },
        a: {
          en: 'You need one controller per room. Each extra controller in the same visit is set up for the same fixed price.',
          ar: 'تحتاج وحدة لكل غرفة. ويُعدّ كل جهاز إضافي في الزيارة نفسها بالسعر الثابت ذاته.',
        },
      },
      {
        q: { en: 'Can it save on my electricity bill?', ar: 'هل يوفّر في فاتورة الكهرباء؟' },
        a: {
          en: 'Schedules and temperature limits usually reduce running hours. Savings depend on your usage.',
          ar: 'تقلّل الجداول وحدود الحرارة عادةً ساعات التشغيل، ويعتمد مقدار التوفير على استخدامك.',
        },
      },
    ],
    keywords: { en: 'smart AC controller Oman', ar: 'تحكم ذكي بالمكيف عمان' },
  },
  {
    slug: 'tech-repair',
    category: 'maintenance',
    price: 10,
    priceNote: {
      en: 'Visit fee. Parts are quoted separately before any work.',
      ar: 'رسوم الزيارة. تُسعَّر القطع بشكل منفصل قبل بدء أي عمل.',
    },
    duration: { min: 30, max: 60 },
    popularity: 88,
    warranty: { en: '7 days on the work done', ar: '7 أيام على العمل المنجز' },
    title: { en: 'Tech Repair & Troubleshooting Visit (indoor gadgets)', ar: 'زيارة إصلاح وتشخيص الأجهزة المنزلية' },
    short: {
      en: 'A technician diagnoses and fixes smart devices, TVs, streaming boxes, printers and other indoor gadgets.',
      ar: 'فنّي يشخّص ويصلح الأجهزة الذكية والتلفزيونات وأجهزة البث والطابعات وغيرها من الأجهزة المنزلية.',
    },
    description: {
      en: 'Something stopped working? A technician visits, diagnoses the problem and fixes what can be fixed on the spot: settings, connections, resets, firmware and small part swaps. If a part is needed, you get a clear price before any work starts. No surprises.',
      ar: 'توقف جهاز عن العمل؟ يزورك فنّي ليشخّص المشكلة ويصلح ما يمكن إصلاحه في الموقع: الإعدادات والتوصيلات وإعادة الضبط وتحديث البرامج واستبدال القطع الصغيرة. وإذا احتاج الأمر قطعة غيار، تحصل على سعر واضح قبل بدء أي عمل، بلا مفاجآت.',
    },
    included: [
      { icon: 'search', text: { en: 'Full diagnosis of the problem', ar: 'تشخيص كامل للمشكلة' } },
      {
        icon: 'tool',
        text: { en: 'On-the-spot fixes: settings, resets, connections', ar: 'إصلاحات فورية: الإعدادات وإعادة الضبط والتوصيلات' },
      },
      { icon: 'app', text: { en: 'Firmware and app updates', ar: 'تحديث البرامج والتطبيقات' } },
      { icon: 'clean', text: { en: 'Written parts quote before any extra work', ar: 'عرض سعر مكتوب للقطع قبل أي عمل إضافي' } },
    ],
    notIncluded: [
      { en: 'Spare parts (quoted and approved by you first)', ar: 'قطع الغيار (تُسعَّر وتوافق عليها أولًا)' },
      { en: 'Large appliances (fridges, washers, AC units)', ar: 'الأجهزة الكبيرة (الثلاجات والغسالات ووحدات التكييف)' },
      { en: 'Phone and laptop board-level repair', ar: 'إصلاح لوحات الهواتف والحواسيب' },
    ],
    prepare: [
      {
        en: 'Describe the problem in the booking notes (or send a short video on WhatsApp).',
        ar: 'صف المشكلة في ملاحظات الحجز (أو أرسل مقطعًا قصيرًا عبر واتساب).',
      },
      {
        en: 'Have the device’s chargers, remotes and accounts available.',
        ar: 'جهّز الشواحن وأجهزة التحكم وبيانات الحسابات الخاصة بالجهاز.',
      },
      {
        en: 'Back up anything important if it is a storage device.',
        ar: 'احفظ نسخة من البيانات المهمة إن كان الجهاز يحتوي على تخزين.',
      },
    ],
    faq: [
      {
        q: { en: 'What does the 10 OMR visit fee cover?', ar: 'ماذا تشمل رسوم الزيارة البالغة 10 ر.ع.؟' },
        a: {
          en: 'Travel, diagnosis and up to an hour of hands-on fixes that don’t need parts.',
          ar: 'التنقل والتشخيص وحتى ساعة من الإصلاحات العملية التي لا تحتاج إلى قطع.',
        },
      },
      {
        q: { en: 'What if I don’t accept the parts quote?', ar: 'ماذا لو لم أوافق على سعر القطع؟' },
        a: {
          en: 'You only pay the visit fee. Nothing extra is done without your approval.',
          ar: 'تدفع رسوم الزيارة فقط، ولا يُنفَّذ أي عمل إضافي دون موافقتك.',
        },
      },
      {
        q: { en: 'Which gadgets do you cover?', ar: 'ما الأجهزة التي تغطّونها؟' },
        a: {
          en: 'Smart-home devices, TVs and streaming boxes, home printers, speakers, routers and similar indoor electronics.',
          ar: 'أجهزة المنزل الذكي، والتلفزيونات وأجهزة البث، والطابعات المنزلية، ومكبّرات الصوت، والراوترات، وما يشابهها من الأجهزة الداخلية.',
        },
      },
    ],
    keywords: { en: 'gadget repair home visit Oman', ar: 'إصلاح أجهزة منزلية زيارة عمان' },
  },
];

export const CATEGORY_LABEL: Record<ServiceCategory, L10n> = {
  smart: { en: 'Smart Installations', ar: 'التركيبات الذكية' },
  maintenance: { en: 'Tech Repairs & Maintenance', ar: 'الإصلاح والصيانة التقنية' },
};

export const STARTER_PACKAGE = {
  slug: 'new-home-smart-starter',
  price: 55,
  separatePrice: 65,
  components: ['smart-door-lock', 'iot-hub', 'smart-lighting'] as const,
  title: { en: 'New Home Smart Starter', ar: 'باقة المنزل الذكي الجديد' } as L10n,
  description: {
    en: 'Smart lock + hub + up to 4 smart bulbs configured, in a single visit.',
    ar: 'قفل ذكي + وحدة تحكم + إعداد حتى 4 لمبات ذكية، في زيارة واحدة.',
  } as L10n,
};

export function getService(slug: string | undefined): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function durationLabel(s: Service, lang: 'en' | 'ar'): string {
  const unit = lang === 'ar' ? 'دقيقة' : 'min';
  // LTR isolate keeps "60–90" in order inside Arabic text.
  const range = s.duration.min === s.duration.max ? `${s.duration.min}` : `\u2066${s.duration.min}–${s.duration.max}\u2069`;
  return `${range} ${unit}`;
}

/** Anything that can be booked: a single service or the starter package. */
export interface Bookable {
  slug: string;
  title: L10n;
  price: number;
  duration: { min: number; max: number };
  warranty: L10n;
  isPackage: boolean;
  category: ServiceCategory | 'package';
}

export function getBookable(slug: string | undefined): Bookable | undefined {
  if (slug === STARTER_PACKAGE.slug) {
    return {
      slug,
      title: STARTER_PACKAGE.title,
      price: STARTER_PACKAGE.price,
      duration: { min: 120, max: 150 },
      warranty: WARRANTY_7,
      isPackage: true,
      category: 'package',
    };
  }
  const s = getService(slug);
  return s
    ? {
        slug: s.slug,
        title: s.title,
        price: s.price,
        duration: s.duration,
        warranty: s.warranty,
        isPackage: false,
        category: s.category,
      }
    : undefined;
}

/** A technician can take a package if they cover at least two of its three parts. */
export function canDo(skills: string[], slug: string): boolean {
  if (slug === STARTER_PACKAGE.slug) return STARTER_PACKAGE.components.filter((c) => skills.includes(c)).length >= 2;
  return skills.includes(slug);
}
