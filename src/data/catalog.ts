import type { Locale } from "@/i18n/config";

export type ProductCategorySlug = "films" | "granules" | "coextrusion" | "sheets";

export interface ProductSpecRow {
  property: Record<Locale, string>;
  value: string;
  method: string;
}

export interface ProductItem {
  slug: string;
  code: string;
  category: ProductCategorySlug;
  categoryName: Record<Locale, string>;
  title: Record<Locale, string>;
  shortSummary: Record<Locale, string>;
  description: Record<Locale, string>;
  primaryImage: string;
  galleryImages: Array<{
    src: string;
    alt: Record<Locale, string>;
    isClientSlot?: boolean;
    slotCode?: string;
  }>;
  keyMetrics: Array<{
    label: Record<Locale, string>;
    value: string;
  }>;
  specifications: ProductSpecRow[];
  advantages: Record<Locale, string[]>;
  applications: Record<Locale, string[]>;
  processingNotes: Record<Locale, string>;
}

export interface FaqItem {
  id: string;
  category: Record<Locale, string>;
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
}

export interface EditorialSlotItem {
  slug: string;
  slotCode: string;
  type: "news" | "case";
  categoryLabel: Record<Locale, string>;
  statusBadge: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  bodyParagraphs: Record<Locale, string[]>;
  technicalSpecs: Array<{
    label: Record<Locale, string>;
    value: Record<Locale, string>;
  }>;
  image: string;
  imageAlt: Record<Locale, string>;
}

export const PRODUCT_CATEGORIES: Array<{
  slug: ProductCategorySlug;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
}> = [
  {
    slug: "films",
    name: {
      ar: "أفلام ASA المقاومة للعوامل الجوية",
      en: "ASA Weather-Resistant Films",
    },
    summary: {
      ar: "أفلام بوليمر ثلاثي مبثوقة للتغليف الحراري المباشر فوق ألواح الأسقف والقطاعات المعمارية.",
      en: "Extruded terpolymer surface films engineered for direct thermal lamination onto roofing panels and architectural profiles.",
    },
  },
  {
    slug: "granules",
    name: {
      ar: "حبيبات راتنج ASA الخام",
      en: "ASA Resin Granules",
    },
    summary: {
      ar: "حبيبات خام وماسترباتش ملون لعمليات البثق والحقن الصناعي عالية الثبات ضد الأشعة.",
      en: "Virgin polymer pellets and pre-colored compounds for weather-resistant extrusion and injection molding.",
    },
  },
  {
    slug: "coextrusion",
    name: {
      ar: "مواد البثق المشترك ASA",
      en: "ASA Co-Extrusion Material",
    },
    summary: {
      ar: "مركبات طبقة الحماية السطحية (Capstock) المصممة للاندماج الحراري مع ركائز PVC و UPVC.",
      en: "Specialized capstock compounds tuned to match the melt rheology of rigid and foamed PVC/UPVC cores.",
    },
  },
  {
    slug: "sheets",
    name: {
      ar: "الألواح المموجة وألواح الأسقف",
      en: "Corrugated & Roofing Sheets",
    },
    summary: {
      ar: "ألواح أسقف وتكسيات صناعية متعددة الطبقات مغلفة بطبقة ASA للمصانع والمستودعات.",
      en: "Multi-layer corrugated roofing and cladding sheets shielded by an exterior ASA weather barrier.",
    },
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    slug: "asa-weather-resistant-arch-film-ec100",
    code: "ASA Film (Top) 10 Codes",
    category: "films",
    categoryName: {
      ar: "أفلام ASA المقاومة للعوامل الجوية",
      en: "ASA Weather-Resistant Films",
    },
    title: {
      ar: "أفلام الطبقة العلوية ASA Film (Top) المقاومة للشمس (10 أكواد قياسية)",
      en: "ASA Film (Top) Exterior Weather-Shield Layer (10 Standard ERP Codes)",
    },
    shortSummary: {
      ar: "فيلم تغليف خارجي (Top Layer) متوفر بـ 10 أكواد معتمدة (ECRAL5012, ECCMB97508, ECCMO96398, ECCMA96681, ECCMO96375, ECRAL7045, ECRAL1014, ECRAL6019, ECCMO96275, ECRAL9016).",
      en: "Exterior lamination top film stocked in 10 ERP codes (ECRAL5012, ECCMB97508, ECCMO96398, ECCMA96681, ECCMO96375, ECRAL7045, ECRAL1014, ECRAL6019, ECCMO96275, ECRAL9016).",
    },
    description: {
      ar: "صُممت أفلام الطبقة العلوية ASA Film (Top) للتغليف الحراري المباشر على الوجه الخارجي لألواح الأسقف المموجة وقطاعات UPVC. تضم 10 درجات لونية معتمدة في نظام المصنع بثبات لوني (ΔE أقل من 1.5 بعد 3000 ساعة QUV) ومقاومة كاملة للأملاح والأشعة فوق البنفسجية.",
      en: "ASA Film (Top) is extruded for inline thermal lamination onto the sun-facing exterior of UPVC and PVC roofing sheets. Stocked across 10 certified ERP color codes with verified color retention (ΔE < 1.5 after 3000 hours QUV) and coastal corrosion resistance.",
    },
    primaryImage: "/assets/opt/asa-red-sheet.webp",
    galleryImages: [
      {
        src: "/assets/opt/asa-red-sheet.webp",
        alt: {
          ar: "نموذج سطح فيلم ولوح ASA باللون الأحمر القرمزي",
          en: "Red ASA surface film and corrugated sheet specimen",
        },
      },
      {
        src: "/assets/opt/hero-partnership.webp",
        alt: {
          ar: "تطبيقات أفلام وألواح ASA في الأسقف الصناعية",
          en: "Industrial roofing applications for ASA films and panels",
        },
      },
      {
        src: "",
        isClientSlot: true,
        slotCode: "[FILM_ROLL_CLOSEUP_SLOT]",
        alt: {
          ar: "مساحة مخصصة لصورة رول فيلم ASA على خط التغليف",
          en: "Reserved slot for factory ASA film roll close-up photograph",
        },
      },
    ],
    keyMetrics: [
      {
        label: { ar: "نطاق السماكة", en: "Film Thickness" },
        value: "0.15 to 0.35 mm",
      },
      {
        label: { ar: "ثبات اللون QUV", en: "QUV Color Shift" },
        value: "ΔE < 1.5 (3000h)",
      },
      {
        label: { ar: "الكثافة النوعية", en: "Specific Gravity" },
        value: "1.07 g/cm³",
      },
    ],
    specifications: [
      {
        property: { ar: "السماكة القياسية للفيلم", en: "Standard Film Gauge" },
        value: "0.15 to 0.35 mm",
        method: "ISO 4593",
      },
      {
        property: { ar: "الكثافة النوعية (23 °C)", en: "Specific Gravity (23 °C)" },
        value: "1.07 g/cm³",
        method: "ISO 1183",
      },
      {
        property: { ar: "مقاومة الشد عند الخضوع", en: "Tensile Strength at Yield" },
        value: "42 to 46 MPa",
        method: "ISO 527",
      },
      {
        property: { ar: "درجة حرارة التليين فيكات", en: "Vicat Softening Temperature" },
        value: "96 °C",
        method: "ISO 306 (B/50)",
      },
      {
        property: { ar: "ثبات اللون بعد 3000 ساعة QUV", en: "Color Stability (3000h QUV)" },
        value: "ΔE < 1.5",
        method: "ASTM G154",
      },
    ],
    advantages: {
      ar: [
        "سلسلة بوليمر مشبعة بمطاط الأكريليك تمنع التشقق الضوئي والاصفرار في المناخ الصحراوي.",
        "انتظام دقيق في السماكة عبر عرض الرول يضمن تغليفاً خالياً من الفقاعات الهوائية.",
        "متوفر بسطح لامع أو مطفي ساتان أو محبب معماري لتقليل الوهج الشمسي.",
      ],
      en: [
        "Saturated acrylate elastomer backbone prevents UV-induced micro-cracking and yellowing in desert climates.",
        "Tightly controlled cross-web gauge tolerance ensures bubble-free inline lamination.",
        "Available in high-gloss, architectural satin, and fine pebble embossed textures.",
      ],
    },
    applications: {
      ar: [
        "تغليف ألواح الأسقف الصناعية والمستودعات اللوجستية.",
        "تغليف قطاعات النوافذ والأبواب الخارجية المصنوعة من UPVC.",
        "تغليف ألواح الواجهات المعمارية وكبائن المعدات الخارجية.",
      ],
      en: [
        "Surface lamination for industrial roofing panels and logistics warehouses.",
        "Exterior weather-shield wrapping for UPVC window and door profiles.",
        "Architectural wall cladding panels and outdoor utility enclosures.",
      ],
    },
    processingNotes: {
      ar: "يُطبق الفيلم بالحرارة والضغط المباشر على اللوح الساخن فور خروجه من قالب البثق عند درجة حرارة سطح 140 إلى 170 درجة مئوية.",
      en: "Applied via inline thermal calendering onto the hot extrudate immediately post-die at substrate surface temperatures of 140 to 170 °C.",
    },
  },
  {
    slug: "asa-solar-reflective-film-ec120",
    code: "ASA Film (Bottom) 3 Codes",
    category: "films",
    categoryName: {
      ar: "أفلام ASA المقاومة للعوامل الجوية",
      en: "ASA Weather-Resistant Films",
    },
    title: {
      ar: "أفلام الطبقة السفلية ASA Film (Bottom) للتبطين والحماية (3 أكواد قياسية)",
      en: "ASA Film (Bottom) Backing & Chemical-Shield Layer (3 Standard ERP Codes)",
    },
    shortSummary: {
      ar: "فيلم التبطين السفلي (Bottom Layer) للألواح متعددة الطبقات متوفر بـ 3 أكواد معتمدة: أخضر (ECCMG96279)، أبيض (ECCMA45050)، وأصفر (ECCMO98501).",
      en: "Underside backing ASA film for multi-layer panels stocked in 3 verified ERP codes: Green (ECCMG96279), White (ECCMA45050), and Yellow (ECCMO98501).",
    },
    description: {
      ar: "تُستخدم أفلام الطبقة السفلية ASA Film (Bottom) لتغليف الوجه الداخلي السفلي لألواح الأسقف UPVC و PVC لعزل الركيزة عن الأبخرة الكيميائية والرطوبة وتوازن الإجهاد الحراري، وتتوفر بالأكواد ECCMG96279 و ECCMA45050 و ECCMO98501.",
      en: "ASA Film (Bottom) bonds thermally to the underside of co-extruded UPVC and PVC roofing panels to balance thermal expansion, increase interior light reflection, and shield against acid and alkali factory vapors across codes ECCMG96279, ECCMA45050, and ECCMO98501.",
    },
    primaryImage: "/assets/opt/hero-partnership.webp",
    galleryImages: [
      {
        src: "/assets/opt/hero-partnership.webp",
        alt: {
          ar: "ألواح أسقف مغلفة بفيلم ASA العاكس للحرارة",
          en: "Roofing panels laminated with solar-reflective ASA film",
        },
      },
      {
        src: "/assets/opt/asa-color-jars.webp",
        alt: {
          ar: "درجات ألوان حبيبات وأصباغ ASA الحرارية",
          en: "Thermal pigment grades for ASA formulations",
        },
      },
    ],
    keyMetrics: [
      {
        label: { ar: "سماكة الفيلم", en: "Film Gauge" },
        value: "0.20 to 0.45 mm",
      },
      {
        label: { ar: "حرارة التليين فيكات", en: "Vicat Softening" },
        value: "100 to 102 °C",
      },
      {
        label: { ar: "مؤشر الانعكاس الشمسي", en: "Solar Reflectance" },
        value: "SRI 78 (Ivory Grade)",
      },
    ],
    specifications: [
      {
        property: { ar: "سماكة الفيلم القياسية", en: "Standard Film Thickness" },
        value: "0.20 to 0.45 mm",
        method: "ISO 4593",
      },
      {
        property: { ar: "الكثافة النوعية", en: "Specific Gravity" },
        value: "1.08 g/cm³",
        method: "ISO 1183",
      },
      {
        property: { ar: "حرارة التليين فيكات (B/50)", en: "Vicat Softening Point (B/50)" },
        value: "100 to 102 °C",
        method: "ISO 306",
      },
      {
        property: { ar: "ثبات اللون QUV 3000h", en: "QUV 3000h Color Stability" },
        value: "ΔE < 1.3",
        method: "ASTM G154",
      },
    ],
    advantages: {
      ar: [
        "يقلل انتقال الحرارة الإشعاعية إلى داخل الهناجر والمصانع المبردة.",
        "مقاومة ممتازة للغبار الصحراوي وسهولة التنظيف بالماء.",
        "توافق تام مع خطوط التغليف الحراري لألواح UPVC و PVC الفوم.",
      ],
      en: [
        "Reduces radiant heat transfer into climate-controlled factories and storage halls.",
        "Low-retention surface resists desert dust accumulation.",
        "Direct thermal fusion compatibility with rigid UPVC and cellular PVC boards.",
      ],
    },
    applications: {
      ar: [
        "أسقف ثلاجات التخزين والمصانع الغذائية.",
        "مزارع الإنتاج الحيواني والبيوت المحمية.",
        "تغليف كبائن الاتصالات ووحدات الطاقة الشمسية.",
      ],
      en: [
        "Cold-storage roofing and food processing plants.",
        "Agricultural livestock facilities and shaded structures.",
        "Telecom shelters and solar inverter enclosures.",
      ],
    },
    processingNotes: {
      ar: "يوصى بحفظ الرولات في عبواتها الأصلية بعيداً عن الرطوبة والحرارة الزائدة قبل التركيب على خط التغليف.",
      en: "Store rolls in original sealed moisture-barrier packaging away from direct heat sources prior to inline lamination.",
    },
  },
  {
    slug: "asa-coextrusion-resin-granules-ec200",
    code: "EC-GRAN-200",
    category: "granules",
    categoryName: {
      ar: "حبيبات راتنج ASA الخام",
      en: "ASA Resin Granules",
    },
    title: {
      ar: "حبيبات راتنج ASA للبثق المشترك والألواح (EC-GRAN-200)",
      en: "Weather-Resistant ASA Extrusion Resin Granules (EC-GRAN-200)",
    },
    shortSummary: {
      ar: "حبيبات بوليمر ASA بمؤشر تدفق ذوبان 15 إلى 20 جم/10 دقائق مصممة لبثق الألواح والقطاعات الخارجية.",
      en: "Extrusion-grade ASA pellets (MFI 15 to 20 g/10 min) compounded with UV stabilizers for profile and sheet production.",
    },
    description: {
      ar: "توفر حبيبات EC-GRAN-200 توازناً محكماً بين لزوجة المصهور ومقاومة الصدمات (15 إلى 18 كيلوجول/م²). تتوفر باللون الطبيعي أو ملونة مسبقاً بسبع درجات قياسية جاهزة للتشغيل المباشر في ماكينات البثق.",
      en: "EC-GRAN-200 pellets provide balanced melt viscosity and Charpy impact toughness (15 to 18 kJ/m²). Supplied in natural tone or pre-compounded in seven UV-fast architectural colors ready for direct hopper feeding.",
    },
    primaryImage: "/assets/opt/asa-color-jars.webp",
    galleryImages: [
      {
        src: "/assets/opt/asa-color-jars.webp",
        alt: {
          ar: "سبع عبوات زجاجية تحتوي على حبيبات راتنج ASA الملونة",
          en: "Seven laboratory glass jars displaying colored ASA resin granules",
        },
      },
      {
        src: "/assets/opt/asa-black-corrugated.webp",
        alt: {
          ar: "حبيبات ASA باللون الأسود الفحمي مع اللوح المبثوق",
          en: "Charcoal black ASA granules alongside extruded corrugated panel",
        },
      },
    ],
    keyMetrics: [
      {
        label: { ar: "تدفق الذوبان MFI", en: "Melt Flow Index" },
        value: "15 to 20 g/10 min",
      },
      {
        label: { ar: "صدمات شاربي", en: "Charpy Impact" },
        value: "15 to 18 kJ/m²",
      },
      {
        label: { ar: "معامل الانحناء", en: "Flexural Modulus" },
        value: "2350 MPa",
      },
    ],
    specifications: [
      {
        property: { ar: "الكثافة النوعية عند 23 °C", en: "Specific Gravity at 23 °C" },
        value: "1.07 g/cm³",
        method: "ISO 1183",
      },
      {
        property: { ar: "مؤشر تدفق الذوبان (220 °C / 10 kg)", en: "Melt Flow Rate (220 °C / 10 kg)" },
        value: "15 to 20 g/10 min",
        method: "ISO 1133",
      },
      {
        property: { ar: "مقاومة الشد عند الخضوع", en: "Tensile Strength at Yield" },
        value: "45 MPa",
        method: "ISO 527",
      },
      {
        property: { ar: "مقاومة صدمات شاربي المسننة", en: "Charpy Notched Impact (23 °C)" },
        value: "15 to 18 kJ/m²",
        method: "ISO 179",
      },
      {
        property: { ar: "درجة حرارة التليين فيكات (B/50)", en: "Vicat Softening Temperature" },
        value: "98 °C",
        method: "ISO 306",
      },
    ],
    advantages: {
      ar: [
        "توزيع متجانس للأصباغ غير العضوية داخل الحبيبة يمنع ظهور خطوط اللون أثناء البثق.",
        "محتوى رطوبة منخفض وثبات حراري يمنع تكون الغازات أو النقاط السوداء في القالب.",
        "متاح بمطابقة لونية مخصصة وفق أكواد RAL أو عينات المصنع.",
      ],
      en: [
        "Homogeneous pigment dispersion eliminates color streaking during wide-die sheet extrusion.",
        "High thermal stability prevents die-lip degradation and gas pitting.",
        "Available in custom RAL color matches or pre-colored masterbatch blends.",
      ],
    },
    applications: {
      ar: [
        "بثق الألواح المصمتة والمموجة للأسقف والواجهات.",
        "بثق قطاعات النوافذ، السياج الخارجي، وتكسيات الجدران.",
        "إنتاج مواسير ووصلات التهوية الخارجية المعرضة للشمس.",
      ],
      en: [
        "Monolayer and multi-layer sheet extrusion for roofing and siding.",
        "Exterior window profiles, fencing rails, and architectural trim.",
        "Outdoor ventilation ducts and weather-exposed conduits.",
      ],
    },
    processingNotes: {
      ar: "تجفف الحبيبات عند 80 إلى 85 درجة مئوية لمدة 3 إلى 4 ساعات قبل التشغيل. حرارة الإسطوانة الموصى بها: 185 إلى 215 درجة مئوية.",
      en: "Pre-dry pellets at 80 to 85 °C for 3 to 4 hours in a dehumidifying dryer. Recommended barrel profile: 185 to 215 °C.",
    },
  },
  {
    slug: "asa-injection-molding-grade-ec240",
    code: "EC-GRAN-240",
    category: "granules",
    categoryName: {
      ar: "حبيبات راتنج ASA الخام",
      en: "ASA Resin Granules",
    },
    title: {
      ar: "حبيبات ASA عالية الانسيابية للحقن الصناعي (EC-GRAN-240)",
      en: "High-Flow Injection Molding ASA Granules (EC-GRAN-240)",
    },
    shortSummary: {
      ar: "صنف حقن صناعي عالي السيولة (20 إلى 25 جم/10 دقائق) لإنتاج أجزاء السيارات الخارجية وهياكل الأجهزة.",
      en: "High-flow injection grade (MFI 20 to 25 g/10 min) engineered for exterior automotive trim, grilles, and electrical housings.",
    },
    description: {
      ar: "صُمم الصنف EC-GRAN-240 لملء قوالب الحقن الدقيقة بسرعة مع الحفاظ على ثبات الأبعاد ولمعان السطح الخارجي دون الحاجة إلى رش دهان، مما يقلل خطوات التصنيع في قطاعات السيارات والأجهزة الكهروميكانيكية.",
      en: "EC-GRAN-240 is formulated to fill complex thin-wall injection molds cleanly while delivering mold-in-color surface gloss and UV durability, eliminating secondary painting operations for exterior components.",
    },
    primaryImage: "/assets/opt/asa-color-jars.webp",
    galleryImages: [
      {
        src: "/assets/opt/asa-color-jars.webp",
        alt: {
          ar: "حبيبات راتنج ASA المخصصة للحقن الصناعي",
          en: "ASA injection molding resin granules in multiple colors",
        },
      },
      {
        src: "",
        isClientSlot: true,
        slotCode: "[INJECTION_MOLDED_PART_SLOT]",
        alt: {
          ar: "مساحة مخصصة لصورة قطع محقونة من مادة ASA",
          en: "Reserved slot for injection-molded ASA automotive/housing specimen",
        },
      },
    ],
    keyMetrics: [
      {
        label: { ar: "تدفق الذوبان MFI", en: "Melt Flow Index" },
        value: "20 to 25 g/10 min",
      },
      {
        label: { ar: "حرارة التليين فيكات", en: "Vicat Softening" },
        value: "100 to 102 °C",
      },
      {
        label: { ar: "مقاومة الشد", en: "Tensile Yield" },
        value: "46 to 48 MPa",
      },
    ],
    specifications: [
      {
        property: { ar: "مؤشر تدفق الذوبان (220 °C / 10 kg)", en: "Melt Flow Rate (220 °C / 10 kg)" },
        value: "20 to 25 g/10 min",
        method: "ISO 1133",
      },
      {
        property: { ar: "مقاومة الشد عند الخضوع", en: "Tensile Strength at Yield" },
        value: "46 to 48 MPa",
        method: "ISO 527",
      },
      {
        property: { ar: "معامل الانحناء الميكانيكي", en: "Flexural Modulus" },
        value: "2400 to 2450 MPa",
        method: "ISO 178",
      },
      {
        property: { ar: "درجة حرارة التليين فيكات (B/50)", en: "Vicat Softening Temperature" },
        value: "100 to 102 °C",
        method: "ISO 306",
      },
    ],
    advantages: {
      ar: [
        "سيولة عالية تملأ القوالب ذات الجدران الرقيقة (1.50 إلى 4.00 مم) دون علامات تدفق.",
        "مقاومة عالية للحرارة تحت أشعة الشمس المباشرة تصل إلى 102 درجة مئوية فيكات.",
        "مقاومة ممتازة للمنظفات والزيوت والعوامل الجوية دون تشقق إجهادي.",
      ],
      en: [
        "High melt fluidity fills thin-wall geometries (1.50mm to 4.00mm) without weld-line weakness.",
        "Elevated heat deflection and Vicat softening (up to 102 °C) for sun-exposed housings.",
        "Resists detergents, oils, and environmental stress cracking.",
      ],
    },
    applications: {
      ar: [
        "أغطية المرايا الجانبية، الشبك الأمامي، وحليات السيارات الخارجية.",
        "صناديق وحدات التكييف الخارجية ولوحات توزيع الكهرباء.",
        "حوامل وإطارات أنظمة الطاقة الشمسية والإضاءة الخارجية.",
      ],
      en: [
        "Automotive mirror housings, front grilles, and exterior pillar trim.",
        "Outdoor HVAC condenser casings and weatherproof electrical junction boxes.",
        "Solar mounting brackets and exterior lighting fixtures.",
      ],
    },
    processingNotes: {
      ar: "حرارة الحقن الموصى بها: 220 إلى 250 درجة مئوية، وحرارة القالب: 60 إلى 80 درجة مئوية مع تجفيف مسبق لمدة 3 ساعات عند 85 درجة مئوية.",
      en: "Recommended melt temperature: 220 to 250 °C; mold temperature: 60 to 80 °C after 3 hours drying at 85 °C.",
    },
  },
  {
    slug: "asa-upvc-coextrusion-capstock-ec300",
    code: "EC-COEX-300",
    category: "coextrusion",
    categoryName: {
      ar: "مواد البثق المشترك ASA",
      en: "ASA Co-Extrusion Material",
    },
    title: {
      ar: "مركب البثق المشترك ASA لألواح القرميد والأسقف UPVC (EC-COEX-300)",
      en: "ASA Co-Extrusion Capstock for UPVC Roofing (EC-COEX-300)",
    },
    shortSummary: {
      ar: "مادة طبقة سطحية (0.20 إلى 0.50 مم) متوافقة حرارياً مع UPVC لإنتاج ألواح القرميد الإسباني والأسقف المضلعة.",
      en: "Dedicated co-extrusion capstock (0.20mm to 0.50mm layer) rheology-matched to rigid UPVC for Spanish roof tiles and trapezoidal sheets.",
    },
    description: {
      ar: "طُور مركب EC-COEX-300 خصيصاً لمصانع ألواح الأسقف التي تستخدم تقنية البثق المشترك متعدد الطبقات (ABA أو ABC). يتطابق سلوكه الانسيابي مع ركيزة UPVC داخل موزع القالب (Feedblock)، مما يمنح طبقة خارجية متجانسة شديدة الالتصاق.",
      en: "EC-COEX-300 is specifically formulated for multi-layer roof sheet extruders running 2-layer or 3-layer (ASA/UPVC) feedblocks. Its melt elasticity matches rigid UPVC cores, ensuring uniform 0.20mm to 0.50mm capstock distribution across deep corrugation peaks.",
    },
    primaryImage: "/assets/opt/asa-black-corrugated.webp",
    galleryImages: [
      {
        src: "/assets/opt/asa-black-corrugated.webp",
        alt: {
          ar: "لوح سقف UPVC مغلف بطبقة بثق مشترك ASA سوداء",
          en: "UPVC roofing sheet co-extruded with charcoal black ASA capstock",
        },
      },
      {
        src: "/assets/opt/asa-red-sheet.webp",
        alt: {
          ar: "لوح بثق مشترك ASA باللون الأحمر مع الحبيبات",
          en: "Red co-extruded ASA roof sheet with raw granules",
        },
      },
    ],
    keyMetrics: [
      {
        label: { ar: "سماكة طبقة الحماية", en: "Capstock Thickness" },
        value: "0.20 to 0.50 mm",
      },
      {
        label: { ar: "حرارة رأس القالب", en: "Die Head Window" },
        value: "200 to 215 °C",
      },
      {
        label: { ar: "ثبات اللون QUV", en: "QUV Stability" },
        value: "ΔE < 1.5 (3000h)",
      },
    ],
    specifications: [
      {
        property: { ar: "سماكة طبقة البثق المشترك الموصى بها", en: "Recommended Capstock Gauge" },
        value: "0.20 to 0.50 mm",
        method: "Optical Microscopy",
      },
      {
        property: { ar: "الكثافة النوعية", en: "Specific Gravity" },
        value: "1.07 g/cm³",
        method: "ISO 1183",
      },
      {
        property: { ar: "مؤشر تدفق الذوبان (220 °C / 10 kg)", en: "Melt Flow Rate (220 °C / 10 kg)" },
        value: "16 to 22 g/10 min",
        method: "ISO 1133",
      },
      {
        property: { ar: "مقاومة صدمات شاربي المسننة", en: "Charpy Notched Impact" },
        value: "14 to 17 kJ/m²",
        method: "ISO 179",
      },
      {
        property: { ar: "درجة حرارة التليين فيكات", en: "Vicat Softening Point" },
        value: "95 to 99 °C",
        method: "ISO 306",
      },
    ],
    advantages: {
      ar: [
        "التصاق جزيئي مباشر مع UPVC دون الحاجة إلى طبقة لاصقة وسيطة.",
        "يحافظ على سماكة ثابتة عند قمم التمويج ومناطق التشكيل الحراري العميق.",
        "متوفر بسطح عالي اللمعان أو مطفي مقاوم للخدش والتكلس.",
      ],
      en: [
        "Direct molecular interfacial adhesion to UPVC without requiring a tie-layer adhesive.",
        "Maintains uniform capstock thickness over deep Spanish-tile thermoforming peaks.",
        "Available in high-gloss or low-gloss matte formulations.",
      ],
    },
    applications: {
      ar: [
        "بثق ألواح القرميد الصناعي الإسباني والكلاسيكي (ASA + UPVC).",
        "ألواح الأسقف المضلعة والمموجة للمصانع والمنشآت التجارية.",
        "البثق المشترك لقطاعات النوافذ وتكسيات الجدران الفوم.",
      ],
      en: [
        "Spanish-style synthetic resin roof tiles (ASA/UPVC co-extrusion).",
        "Trapezoidal and corrugated industrial factory roofing sheets.",
        "Co-extruded window profiles and cellular PVC siding.",
      ],
    },
    processingNotes: {
      ar: "تجفيف مسبق عند 80 إلى 85 درجة مئوية لمدة 3 إلى 4 ساعات. حرارة الإسطوانة الفرعية: 185 إلى 215 درجة مئوية.",
      en: "Pre-dry at 80 to 85 °C for 3 to 4 hours. Co-extruder barrel zones: 185 to 215 °C; feedblock and die: 200 to 215 °C.",
    },
  },
  {
    slug: "asa-corrugated-industrial-roof-sheet-ec400",
    code: "EC-SHEET-400",
    category: "sheets",
    categoryName: {
      ar: "الألواح المموجة وألواح الأسقف",
      en: "Corrugated & Roofing Sheets",
    },
    title: {
      ar: "ألواح الأسقف المموجة والمضلعة المغلفة بطبقة ASA (EC-SHEET-400)",
      en: "ASA-Clad Corrugated Industrial Roofing Sheets (EC-SHEET-400)",
    },
    shortSummary: {
      ar: "ألواح أسقف هندسية جاهزة للتركيب بسماكة إجمالية 2.00 إلى 3.50 مم تجمع بين صلابة UPVC ودرع الحماية الخارجي ASA.",
      en: "Finished multi-layer corrugated roofing panels (2.00mm to 3.50mm total gauge) combining a rigid UPVC structural core with an ASA weather shield.",
    },
    description: {
      ar: "تُنتج ألواح EC-SHEET-400 في مصنع مدينة السادات كبديل هندسي طويل العمر لألواح الصاج المجلفن والفيبرجلاس. لا تصدأ الألواح تحت تأثير الرطوبة الساحلية أو الأبخرة الكيميائية، وتوفر عزلاً حرارياً وصوتياً ملحوظاً أثناء الأمطار والحر الصيفي.",
      en: "Manufactured at our Sadat City facility, EC-SHEET-400 corrugated panels replace corroding galvanized steel and fiberglass sheets. They never rust in coastal or acid-vapor industrial zones and provide thermal and acoustic insulation.",
    },
    primaryImage: "/assets/opt/asa-red-sheet.webp",
    galleryImages: [
      {
        src: "/assets/opt/asa-red-sheet.webp",
        alt: {
          ar: "لوح سقف مموج ASA باللون الأحمر القرمزي",
          en: "Crimson red ASA corrugated industrial roofing sheet",
        },
      },
      {
        src: "/assets/opt/asa-black-corrugated.webp",
        alt: {
          ar: "لوح سقف مموج ASA باللون الأسود الفحمي",
          en: "Charcoal black ASA corrugated industrial roofing sheet",
        },
      },
      {
        src: "/assets/opt/hero-partnership.webp",
        alt: {
          ar: "تشكيلة ألوان ألواح الأسقف المموجة لشركة مصر الصين لـ ASA",
          en: "Multi-color corrugated ASA roofing panels showcase",
        },
      },
    ],
    keyMetrics: [
      {
        label: { ar: "السماكة الكلية للوح", en: "Total Sheet Gauge" },
        value: "2.00 to 3.50 mm",
      },
      {
        label: { ar: "طبقة حماية ASA", en: "ASA Shield Layer" },
        value: "0.25 to 0.50 mm",
      },
      {
        label: { ar: "مقاومة الصدمات", en: "Impact Resistance" },
        value: "12 to 18 kJ/m²",
      },
    ],
    specifications: [
      {
        property: { ar: "السماكة الإجمالية للوح", en: "Total Panel Thickness" },
        value: "2.00, 2.50, 3.00, 3.50 mm",
        method: "ISO 4593",
      },
      {
        property: { ar: "سماكة طبقة ASA السطحية", en: "Exterior ASA Layer Gauge" },
        value: "0.25 to 0.50 mm",
        method: "Microscopic Cross-Section",
      },
      {
        property: { ar: "مقاومة الشد عند الخضوع", en: "Tensile Strength at Yield" },
        value: "42 to 48 MPa",
        method: "ISO 527",
      },
      {
        property: { ar: "معامل الانحناء الميكانيكي", en: "Flexural Modulus" },
        value: "2200 to 2450 MPa",
        method: "ISO 178",
      },
      {
        property: { ar: "ثبات اللون بعد 3000 ساعة QUV", en: "UV Color Stability (3000h QUV)" },
        value: "ΔE < 1.5",
        method: "ASTM G154",
      },
    ],
    advantages: {
      ar: [
        "مقاومة كاملة للصدأ والأملاح والأحماض في المدن الساحلية والمناطق الصناعية.",
        "عزل حراري يخفض درجة حرارة المبنى مقارنة بالصاج المعدني غير المعزول.",
        "عزل صوتي يقلل ضوضاء الأمطار والرياح داخل صالات الإنتاج.",
      ],
      en: [
        "Complete immunity to rust, salt spray, and chemical fumes in coastal and industrial zones.",
        "Lower thermal conductivity than bare corrugated steel roofing.",
        "Dampens rain and wind impact noise inside manufacturing halls.",
      ],
    },
    applications: {
      ar: [
        "أسقف وتكسيات المصانع الكيميائية، مصانع الأسمدة، والمستودعات.",
        "أسقف القرى السياحية، المظلات، ومواقف السيارات.",
        "عنابر الدواجن والمزارع ومخازن الحبوب.",
      ],
      en: [
        "Chemical plants, fertilizer warehouses, and industrial workshops.",
        "Coastal resort roofing, canopies, and covered parking structures.",
        "Poultry houses, agricultural barns, and grain storage facilities.",
      ],
    },
    processingNotes: {
      ar: "يُثبت اللوح على المدادات المعدنية باستخدام مسامير ذاتية الثقب مزودة بأغطية حماية EPDM/ASA مع مراعاة خلوص التمدد الحراري.",
      en: "Fasten to steel purlins using self-drilling screws fitted with weatherproof EPDM/ASA sealing caps and pre-drilled thermal expansion clearance.",
    },
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-asa",
    category: { ar: "كيمياء البوليمرات", en: "Polymer Chemistry" },
    question: {
      ar: "ما هو بوليمر ASA ولماذا يُعتمد في الأجواء الحارة والمكشوفة؟",
      en: "What is ASA polymer and why is it specified for harsh outdoor climates?",
    },
    answer: {
      ar: "بوليمر ASA (Acrylonitrile Styrene Acrylate) هو بوليمر ثلاثي هندسي يتكون من شبكة أكريلونيتريل وستايرين مدعمة بمطاط الأكريليك المشبع. يمنحه الأكريلونيتريل المقاومة الكيميائية والصلابة الحرارية، ويمنحه الستايرين لمعان السطح وسهولة التشكيل، بينما يضمن مطاط الأكريليك الخالي من الروابط المزدوجة مقاومة طويلة الأمد للأشعة فوق البنفسجية والصدمات دون اصفرار أو تقصف.",
      en: "ASA (Acrylonitrile Styrene Acrylate) is an amorphous engineering terpolymer comprising a styrene-acrylonitrile matrix grafted with saturated acrylate elastomer. Acrylonitrile provides chemical and thermal resistance, styrene supplies surface gloss and processability, and the saturated acrylate rubber absorbs impact while resisting UV photo-oxidation without yellowing or embrittlement.",
    },
  },
  {
    id: "asa-vs-abs-uv",
    category: { ar: "مقارنة المواد", en: "Material Comparison" },
    question: {
      ar: "كيف يختلف بوليمر ASA عن مادة ABS التقليدية تحت أشعة الشمس المباشرة؟",
      en: "How does ASA differ chemically from ABS under prolonged UV exposure?",
    },
    answer: {
      ar: "تحتوي مادة ABS على مطاط البوتادين (Butadiene) الذي يضم روابط كربون مزدوجة غير مشبعة تتكسر سريعاً بفعل الأشعة فوق البنفسجية والأكسجين، مما يؤدي إلى اصفرار اللوح وفقدان مقاومته للصدمات خلال أشهر. في المقابل، يستبدل بوليمر ASA البوتادين بمطاط الأكريليك المشبع الخالي من الروابط المزدوجة، فيحتفظ بلونه (ΔE < 1.5 بعد 3000 ساعة QUV) وخواصه الميكانيكية لسنوات طويلة في الشمس.",
      en: "ABS relies on polybutadiene rubber containing unsaturated carbon-carbon double bonds that rapidly cleave when exposed to solar UV radiation and atmospheric oxygen, causing chalking and impact failure within months outdoors. ASA replaces butadiene with a saturated acrylic ester elastomer free of double bonds, retaining both impact strength and color stability (ΔE < 1.5 after 3000h QUV) outdoors.",
    },
  },
  {
    id: "coextrusion-thickness-pvc",
    category: { ar: "البثق المشترك والتغليف", en: "Co-Extrusion & Lamination" },
    question: {
      ar: "ما هي سماكة طبقة ASA الموصى بها عند البثق المشترك أو التغليف فوق ألواح PVC و UPVC؟",
      en: "What ASA capstock or film thickness is recommended over PVC and UPVC substrates?",
    },
    answer: {
      ar: "للأسقف الصناعية وألواح القرميد المعرضة لأشعة الشمس المباشرة في مصر والشرق الأوسط، نوصي بسماكة طبقة ASA تتراوح بين 0.20 مم و 0.50 مم (أو أفلام بسمك 0.15 إلى 0.35 مم). تتوافق القطبية الكيميائية ومعامل التمدد الحراري بين ASA و UPVC، مما يسمح بالاندماج الحراري المباشر داخل قالب البثق دون الحاجة إلى مادة لاصقة وسيطة.",
      en: "For industrial roofing tiles and cladding panels exposed to Middle Eastern solar radiation, we recommend an exterior ASA capstock layer between 0.20mm and 0.50mm (or laminated film between 0.15mm and 0.35mm). Because ASA and rigid PVC/UPVC share compatible polarity and thermal expansion profiles, they fuse directly inside the co-extrusion die or thermal calender without delamination.",
    },
  },
  {
    id: "processing-drying-temperatures",
    category: { ar: "إعدادات التشغيل للمصانع", en: "Factory Processing" },
    question: {
      ar: "ما هي درجات حرارة التجفيف والبثق الموصى بها لتشغيل حبيبات راتنج ASA؟",
      en: "What drying and barrel temperature settings are required when processing ASA granules?",
    },
    answer: {
      ar: "يجب تجفيف حبيبات ASA مسبقاً في مجفف هواء ساخن عند درجة حرارة 80 إلى 85 درجة مئوية لمدة 3 إلى 4 ساعات لإزالة الرطوبة السطحية ومنع ظهور الفقاعات أو الخطوط الفضية. في ماكينات البثق المشترك والألواح، تُضبط مناطق الإسطوانة بين 185 و 215 درجة مئوية ورأس القالب بين 200 و 215 درجة مئوية. وفي ماكينات الحقن، تُضبط حرارة الصهر بين 220 و 250 درجة مئوية.",
      en: "Pre-dry ASA resin granules at 80 to 85 °C for 3 to 4 hours prior to processing to prevent moisture splay and surface blisters. For sheet extrusion and co-extrusion, set barrel zones between 185 °C and 215 °C and the die head between 200 °C and 215 °C. For injection molding, set melt temperatures between 220 °C and 250 °C with mold temperatures of 60 to 80 °C.",
    },
  },
  {
    id: "sample-testing-workflow",
    category: { ar: "العينات والتوريد", en: "Samples & Supply" },
    question: {
      ar: "هل يمكن للمصانع طلب عينات فعلية لاختبارها على خطوط الإنتاج قبل التعاقد؟",
      en: "Can factories request physical ASA samples for production-line trials before bulk orders?",
    },
    answer: {
      ar: "نعم. يتبع فريقنا مسار عمل من 4 مراحل يبدأ بتحديد متطلباتكم الفنية (التطبيق، الركيزة، السماكة، واللون)، ثم إرسال عينات فعلية من أفلام أو حبيبات أو ألواح ASA من مصنع مدينة السادات، تليها تجربة التشغيل الفعلي على ماكيناتكم للتحقق من الالتصاق والانسيابية قبل تأكيد الطلبية التجارية.",
      en: "Yes. Every bulk supply begins with our 4-stage qualification workflow: specify your substrate and gauge requirements, inspect physical film rolls or resin granules dispatched from Sadat City, run live compatibility trials on your extrusion or molding line, and confirm production batch specifications only after trial approval.",
    },
  },
  {
    id: "storage-handling-guidelines",
    category: { ar: "التخزين والمناولة", en: "Storage & Handling" },
    question: {
      ar: "ما هي إرشادات التخزين والمناولة الصحيحة لأفلام وحبيبات ASA؟",
      en: "What are the storage and handling requirements for ASA films and resin bags?",
    },
    answer: {
      ar: "تُحفظ رولات الأفلام وأكياس الحبيبات في مستودعات داخلية جافة وجيدة التهوية بعيداً عن أشعة الشمس المباشرة ومصادر الحرارة المرتفعة والغبار والتلوث الكيميائي. يُنصح بإبقاء العبوات الواقية مغلقة حتى موعد التشغيل المباشر على الماكينة لضمان نظافة السطح وثبات نسبة الرطوبة.",
      en: "Store ASA film rolls and 25 kg moisture-sealed resin bags indoors in a dry, ventilated warehouse protected from contamination, water ingress, and elevated heat sources. Keep protective wrapping sealed until the material is staged at the extruder or laminator.",
    },
  },
];

export const EDITORIAL_SLOTS: EditorialSlotItem[] = [
  {
    slug: "sadat-city-extrusion-line-commissioning-slot",
    slotCode: "[NEWS_ARTICLE_SLOT_01]",
    type: "news",
    categoryLabel: {
      ar: "تحديثات المصنع وخطوط الإنتاج",
      en: "Factory & Extrusion Line Dispatch",
    },
    statusBadge: {
      ar: "[بيانات قيد الاعتماد من الشركة]",
      en: "[CLIENT_DATA_PENDING]",
    },
    title: {
      ar: "تجهيز خطوط بثق أفلام وحبيبات ASA في المنطقة الصناعية بمدينة السادات",
      en: "Sadat City ASA Film & Compounding Line Commissioning Slot",
    },
    summary: {
      ar: "مساحة مخصصة لنشر التقرير المصور الرسمي لخطوط البثق المشترك ومعمل مراقبة الجودة في مصنع مدينة السادات، محافظة المنوفية.",
      en: "Reserved editorial slot for the official commissioning report and photography of the Sadat City co-extrusion and compounding lines.",
    },
    bodyParagraphs: {
      ar: [
        "هذا القالب التحريري مهيأ لاستقبال البيان الرسمي والتواريخ المعتمدة من إدارة شركة مصر الصين لـ ASA حول تشغيل خطوط إنتاج الأفلام والحبيبات في مدينة السادات.",
        "طبقاً لسياسة دقة البيانات الصناعية، لا يتم إدراج تواريخ أو أرقام طاقة إنتاجية افتراضية قبل استلام الوثائق الرسمية من المصنع.",
      ],
      en: [
        "This structured editorial template is reserved for the verified plant commissioning announcement and official photography from EGYPT CHINA FOR ASA in Sadat City.",
        "In strict adherence to industrial data integrity, no unverified dates or speculative tonnage figures are published prior to client sign-off.",
      ],
    },
    technicalSpecs: [
      {
        label: { ar: "الموقع الصناعي", en: "Industrial Location" },
        value: {
          ar: "مدينة السادات، المنوفية (30°26'02.2\"N 30°36'45.7\"E)",
          en: "Sadat City, Monufia (30°26'02.2\"N 30°36'45.7\"E)",
        },
      },
      {
        label: { ar: "حالة النشر", en: "Publication Status" },
        value: {
          ar: "[NEWS_ARTICLE_SLOT_01 : بانتظار النص الرسمي]",
          en: "[NEWS_ARTICLE_SLOT_01 : Official Copy Pending]",
        },
      },
    ],
    image: "/assets/opt/factory-facade.webp",
    imageAlt: {
      ar: "واجهة مصنع شركة مصر الصين لـ ASA في مدينة السادات",
      en: "Exterior facade of the EGYPT CHINA FOR ASA facility in Sadat City",
    },
  },
  {
    slug: "quv-3000h-color-stability-protocol-slot",
    slotCode: "[NEWS_ARTICLE_SLOT_02]",
    type: "news",
    categoryLabel: {
      ar: "تقارير مختبر الجودة",
      en: "Laboratory QC Bulletin",
    },
    statusBadge: {
      ar: "[بيانات قيد الاعتماد من الشركة]",
      en: "[CLIENT_DATA_PENDING]",
    },
    title: {
      ar: "بروتوكول اختبار التعتيق المتسارع QUV لمدة 3000 ساعة لأصباغ ASA",
      en: "ASTM G154 3000-Hour QUV Weathering Verification Protocol Slot",
    },
    summary: {
      ar: "ملخص فني لمعايير فحص ثبات اللون (ΔE < 1.5) ومقاومة التكلس السطحي لسبع درجات لونية قياسية في مختبر الشركة.",
      en: "Technical bulletin slot detailing spectrophotometer ΔE < 1.5 verification across our standard ASA masterbatch and film grades.",
    },
    bodyParagraphs: {
      ar: [
        "يوضح هذا القسم الإجراءات المعملية المتبعة لقياس تغير اللون (ΔE) ومعامل الاحتفاظ باللمعان بعد تعريض عينات الألواح والأفلام للأشعة فوق البنفسجية والرطوبة المتكاثفة وفق معيار ASTM G154.",
        "يتم إرفاق صور تقارير الفحص المعملي المعتمدة في هذه المساحة فور رفعها من قسم الجودة.",
      ],
      en: [
        "This technical bulletin slot documents our ASTM G154 accelerated UV and condensation testing procedure used to verify ΔE < 1.5 color retention across desert and coastal exposure profiles.",
        "Scanned laboratory test certificates and batch spectrograms will populate this slot upon release by the quality assurance department.",
      ],
    },
    technicalSpecs: [
      {
        label: { ar: "معيار الفحص المعتمد", en: "Reference Test Standard" },
        value: { ar: "ASTM G154 / ISO 4892", en: "ASTM G154 / ISO 4892" },
      },
      {
        label: { ar: "معيار القبول اللوني", en: "Pass Criterion" },
        value: { ar: "ΔE < 1.5 بعد 3000 ساعة", en: "ΔE < 1.5 after 3000 Hours" },
      },
    ],
    image: "/assets/opt/asa-color-jars.webp",
    imageAlt: {
      ar: "عينات حبيبات ASA الملونة في عبوات الاختبار الزجاجية",
      en: "Colored ASA resin granules in laboratory glass jars",
    },
  },
  {
    slug: "industrial-warehouse-corrugated-roofing-case-slot",
    slotCode: "[PROJECT_CASE_SLOT_01]",
    type: "case",
    categoryLabel: {
      ar: "دراسة حالة مشروع صناعي",
      en: "Industrial Roofing Case Slot",
    },
    statusBadge: {
      ar: "[مساحة مخصصة لمشروع العميل]",
      en: "[PROJECT_CASE_SLOT]",
    },
    title: {
      ar: "تطبيق ألواح الأسقف المموجة ASA/UPVC في الهناجر والمستودعات الصناعية",
      en: "Industrial Warehouse ASA/UPVC Corrugated Roofing Application Slot",
    },
    summary: {
      ar: "نموذج توثيقي لتوريد وتركيب ألواح الأسقف المموجة المغلفة بطبقة ASA بسمك 0.30 مم لمقاومة الحرارة والتآكل في المناطق الصناعية.",
      en: "Case study slot documenting 0.30mm ASA-capped UPVC corrugated roofing sheets engineered for high-heat industrial warehouses.",
    },
    bodyParagraphs: {
      ar: [
        "خُصصت هذه البطاقة لتوثيق مشاريع التوريد الفعلية للمصانع والمستودعات اللوجستية في مصر، بما يشمل المساحة المغطاة، كود اللون المعتمد، وسماكة اللوح المركب.",
        "يُستبدل الرمز [PROJECT_CASE_SLOT_01] بصور الموقع الفعلية وبيانات المشروع بعد موافقة العميل.",
      ],
      en: [
        "This case study template is structured to record verified Egyptian industrial warehouse installations, including roof area, specified ASA swatch code, and total panel gauge.",
        "Field installation photographs and client-approved project metrics replace [PROJECT_CASE_SLOT_01] upon publication.",
      ],
    },
    technicalSpecs: [
      {
        label: { ar: "هيكل اللوح الموصى به", en: "Specified Panel Structure" },
        value: {
          ar: "0.30mm ASA Cap + 2.50mm UPVC Core",
          en: "0.30mm ASA Cap + 2.50mm UPVC Core",
        },
      },
      {
        label: { ar: "حالة التوثيق", en: "Case Status" },
        value: {
          ar: "[PROJECT_CASE_SLOT_01 : بانتظار صور المشروع]",
          en: "[PROJECT_CASE_SLOT_01 : Site Photos Pending]",
        },
      },
    ],
    image: "/assets/opt/asa-black-corrugated.webp",
    imageAlt: {
      ar: "لوح سقف صناعي مموج من مادة ASA باللون الأسود الفحمي",
      en: "Charcoal black corrugated ASA industrial roofing panel",
    },
  },
  {
    slug: "coastal-architectural-cladding-and-tiles-case-slot",
    slotCode: "[PROJECT_CASE_SLOT_02]",
    type: "case",
    categoryLabel: {
      ar: "تطبيقات المناطق الساحلية",
      en: "Coastal Cladding Case Slot",
    },
    statusBadge: {
      ar: "[مساحة مخصصة لمشروع العميل]",
      en: "[PROJECT_CASE_SLOT]",
    },
    title: {
      ar: "حماية القرميد المعماري والواجهات الساحلية بأفلام ASA المقاومة للأملاح",
      en: "Coastal Resort Roof Tile & Facade Lamination Case Slot",
    },
    summary: {
      ar: "نموذج توثيقي لاستخدام أفلام وحبيبات ASA بالألوان القرميدية والعاجية في المشروعات الساحلية المعرضة للرطوبة الملحية والأشعة فوق البنفسجية.",
      en: "Application dossier slot for terracotta and crimson ASA surface films protecting coastal roofing profiles from salt spray and UV fade.",
    },
    bodyParagraphs: {
      ar: [
        "تستعرض هذه المساحة أداء أفلام السطح EC-FILM-100 ومركبات البثق المشترك EC-COEX-300 في البيئات الساحلية عالية الملوحة مقارنة بالدهانات التقليدية التي تتقشر بفعل الرطوبة.",
        "تُضاف بيانات المشروع الساحلي وصور ما بعد التركيب فور اعتمادها من المكتب الهندسي.",
      ],
      en: [
        "This case slot highlights the performance of EC-FILM-100 surface films and EC-COEX-300 capstock in high-salinity coastal environments where painted metal roofing blisters and corrodes.",
        "Verified project coordinates and post-installation photographs will be inserted upon client release.",
      ],
    },
    technicalSpecs: [
      {
        label: { ar: "الألوان القياسية المستخدمة", en: "Target Swatch Grades" },
        value: {
          ar: "أحمر قرمزي (EC-SW-03) وبرتقالي قرميدي (EC-SW-02)",
          en: "Crimson Red (EC-SW-03) & Terracotta Orange (EC-SW-02)",
        },
      },
      {
        label: { ar: "حالة التوثيق", en: "Case Status" },
        value: {
          ar: "[PROJECT_CASE_SLOT_02 : بانتظار بيانات العميل]",
          en: "[PROJECT_CASE_SLOT_02 : Client Release Pending]",
        },
      },
    ],
    image: "/assets/opt/asa-red-sheet.webp",
    imageAlt: {
      ar: "لوح ASA مموج باللون الأحمر القرمزي للمناطق الساحلية والحارة",
      en: "Crimson red ASA corrugated sheet engineered for coastal UV resistance",
    },
  },
];

export const PURCHASE_STEPS_11: Array<{
  step: string;
  title: Record<Locale, string>;
  detail: Record<Locale, string>;
}> = [
  {
    step: "01",
    title: { ar: "استلام الاستفسار الفني", en: "Receive Inquiry" },
    detail: {
      ar: "استقبال طلب المصنع أو المشروع عبر نموذج الموقع أو البريد الرسمي مع تحديد فئة المنتج المطلوبة.",
      en: "Log initial inquiry from the manufacturer or contractor specifying target ASA film, granule, or sheet category.",
    },
  },
  {
    step: "02",
    title: { ar: "مناقشة تفاصيل المنتج والركيزة", en: "Communicate Product Details" },
    detail: {
      ar: "مراجعة نوع الركيزة (PVC أو UPVC أو ABS)، السماكة، العرض، كود اللون، وظروف التشغيل الحرارية.",
      en: "Confirm base substrate compatibility, film/capstock thickness, roll width, color code, and processing temperature window.",
    },
  },
  {
    step: "03",
    title: { ar: "تقديم عرض السعر الرسمي", en: "Quotation" },
    detail: {
      ar: "إصدار عرض سعر مفصل بناءً على الصنف المعتمد، الكمية المطلوبة، وشروط التسليم من مدينة السادات.",
      en: "Issue formal commercial quotation detailing unit pricing, minimum order batch, and Sadat City dispatch terms.",
    },
  },
  {
    step: "04",
    title: { ar: "تجهيز وإرسال العينات", en: "Sample Arrangement" },
    detail: {
      ar: "إرسال عينات فعلية من الأفلام أو الحبيبات أو الألواح لإجراء اختبارات المطابقة والتشغيل على ماكينات العميل.",
      en: "Prepare and dispatch physical ASA film rolls, resin granule samples, or color plaques for line trials.",
    },
  },
  {
    step: "05",
    title: { ar: "إبرام التعاقد التجاري", en: "Contract" },
    detail: {
      ar: "توقيع عقد التوريد بعد نجاح تجربة العينة واعتماد المواصفات الفنية واللونية النهائية.",
      en: "Execute supply contract following successful production-line trial and laboratory swatch approval.",
    },
  },
  {
    step: "06",
    title: { ar: "تأكيد التفاصيل النهائية للتشغيلة", en: "Final Details Confirmation" },
    detail: {
      ar: "تثبيت أرقام التشغيلات، أبعاد التقطيع، نظام التعبئة والتغليف، والجدول الزمني للإنتاج.",
      en: "Lock final slitting widths, core diameters, moisture-barrier packaging specs, and production schedule.",
    },
  },
  {
    step: "07",
    title: { ar: "الإنتاج الكمي على الخطوط", en: "Mass Production" },
    detail: {
      ar: "بدء البلمرة أو البثق في مصنع مدينة السادات تحت رقابة مستمرة لدرجات الحرارة والسماكة.",
      en: "Run scheduled compounding or extrusion batch at our Sadat City plant with inline gauge monitoring.",
    },
  },
  {
    step: "08",
    title: { ar: "الفحص أثناء الإنتاج", en: "Production Inspection" },
    detail: {
      ar: "مراقبة جودة السطح، اللمعان، والعرض على خط الإنتاج لمنع أي عيوب بصرية أو ميكانيكية.",
      en: "Conduct continuous in-process checks for surface gloss uniformity, pinhole absence, and dimensional accuracy.",
    },
  },
  {
    step: "09",
    title: { ar: "الاختبار المعملي للجودة", en: "Quality Testing" },
    detail: {
      ar: "سحب عينات من التشغيلة لفحص تدفق الذوبان (ISO 1133)، فيكات (ISO 306)، ومطابقة اللون الطيفية (ΔE).",
      en: "Verify batch retention samples in the QC lab for MFI (ISO 1133), Vicat softening (ISO 306), and spectrophotometer ΔE.",
    },
  },
  {
    step: "10",
    title: { ar: "التغليف المحمي والتسليم", en: "Delivery" },
    detail: {
      ar: "تغليف الرولات والأكياس ضد الرطوبة والحرارة وشحنها إلى مقر العميل المحلي أو التصديري.",
      en: "Pack in heat- and contamination-protected export wrapping and dispatch from Sadat City.",
    },
  },
  {
    step: "11",
    title: { ar: "الدعم الفني وما بعد البيع", en: "After-Sales Support" },
    detail: {
      ar: "متابعة أداء المادة على خطوط إنتاج العميل وتقديم المشورة الفنية لضبط حرارة القوالب والالتصاق.",
      en: "Provide ongoing extrusion temperature tuning, thermoforming guidance, and batch traceability support.",
    },
  },
];

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/30%C2%B026'02.2%22N+30%C2%B036'45.7%22E/@30.4339307,30.6101291,17z/data=!3m1!4b1!4m4!3m3!8m2!3d30.4339307!4d30.612704?hl=en";

export const GOOGLE_MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=30.4339307,30.612704&hl=en&z=15&output=embed";

export interface ErpAsaSkuItem {
  id: string;
  itemNo: number;
  code: string;
  category: string;
  categorySlug: string;
  colorEn: string;
  colorAr: string;
  colorZh: string;
  colorToken: string;
  specimenImage: string;
  finish: Record<Locale, string>;
  solar: Record<Locale, string>;
  substrate: Record<Locale, string>;
  description: Record<Locale, string>;
  inStock: boolean;
}

export interface ErpCategoryOption {
  slug: string;
  nameAr: string;
  nameEn: string;
  nameZh: string;
  sortOrder: number;
}

export const DEFAULT_ERP_CATEGORIES: ErpCategoryOption[] = [
  {
    slug: "top",
    nameAr: "أفلام الطبقة العلوية ASA Film (Top)",
    nameEn: "ASA Film (Top) Exterior Layer",
    nameZh: "ASA 表层耐候膜 (Top)",
    sortOrder: 1,
  },
  {
    slug: "bottom",
    nameAr: "أفلام الطبقة السفلية ASA Film (Bottom)",
    nameEn: "ASA Film (Bottom) Backing Layer",
    nameZh: "ASA 底层复合膜 (Bottom)",
    sortOrder: 2,
  },
];

export const ERP_ASA_FILM_SKUS: ErpAsaSkuItem[] = [
  {
    id: "erp-01-eccmg96279",
    itemNo: 1,
    code: "ECCMG96279",
    category: "ASA Film (Bottom)",
    categorySlug: "bottom",
    colorEn: "Green",
    colorAr: "أخضر طبقة سفلية (Green)",
    colorZh: "绿色 (底层)",
    colorToken: "var(--sku-eccmg96279)",
    specimenImage: "/assets/opt/asa-color-jars.webp",
    finish: {
      ar: "طبقة تبطين سفلية متجانسة عالية الالتصاق",
      en: "Uniform Thermal-Bonding Backing Layer",
    },
    solar: {
      ar: "عزل سفلي مقاوم للرطوبة والأبخرة الصناعية، ΔE < 1.5",
      en: "Moisture & Chemical Vapor Backing Shield, ΔE < 1.5",
    },
    substrate: {
      ar: "الوجه السفلي لألواح الأسقف UPVC و PVC",
      en: "Underside Backing for UPVC & PVC Roof Panels",
    },
    description: {
      ar: "فيلم ASA للطبقة السفلية باللون الأخضر الصناعي (كود ECCMG96279)، مصمم لتوازن الإجهاد الحراري وحماية باطن الألواح في المصانع والمنشآت الزراعية.",
      en: "Green ASA bottom-layer backing film (Code ECCMG96279) engineered for thermal stress balance and underside chemical protection on industrial roofing sheets.",
    },
    inStock: true,
  },
  {
    id: "erp-02-eccma45050",
    itemNo: 2,
    code: "ECCMA45050",
    category: "ASA Film (Bottom)",
    categorySlug: "bottom",
    colorEn: "White",
    colorAr: "أبيض طبقة سفلية (White)",
    colorZh: "白色 (底层)",
    colorToken: "var(--sku-eccma45050)",
    specimenImage: "/assets/opt/hero-partnership.webp",
    finish: {
      ar: "سطح سفلي عاكس للإضاءة الداخلية وسهل التنظيف",
      en: "High-Reflectance Interior Backing Finish",
    },
    solar: {
      ar: "انعكاس ضوئي مرتفع داخل الهناجر، ثبات فيكات 98 °C",
      en: "High Interior Light Distribution, 98 °C Vicat",
    },
    substrate: {
      ar: "الوجه الداخلي لألواح المستودعات وعنابر الإنتاج",
      en: "Interior Ceiling Side of Co-Extruded UPVC Sheets",
    },
    description: {
      ar: "فيلم ASA للطبقة السفلية باللون الأبيض (كود ECCMA45050) يمنح السقف الداخلي للمصانع والمستودعات إضاءة منتظمة ومقاومة للرطوبة والأبخرة.",
      en: "White ASA bottom-layer film (Code ECCMA45050) providing bright interior ceiling reflectance and corrosion shielding for industrial halls.",
    },
    inStock: true,
  },
  {
    id: "erp-03-eccmo98501",
    itemNo: 3,
    code: "ECCMO98501",
    category: "ASA Film (Bottom)",
    categorySlug: "bottom",
    colorEn: "Yellow",
    colorAr: "أصفر طبقة سفلية (Yellow)",
    colorZh: "黄色 (底层)",
    colorToken: "var(--sku-eccmo98501)",
    specimenImage: "/assets/opt/asa-color-jars.webp",
    finish: {
      ar: "طبقة تبطين صناعية واضحة التمييز وعالية الترابط",
      en: "High-Visibility Co-Extrusion Backing Film",
    },
    solar: {
      ar: "مقاومة للأحماض والقلويات والأملاح، ΔE < 1.5",
      en: "Acid, Alkali & Salt Mist Resistant, ΔE < 1.5",
    },
    substrate: {
      ar: "ألواح التكسية والأسقف الصناعية متعددة الطبقات",
      en: "Multi-Layer Industrial Cladding & Roofing Cores",
    },
    description: {
      ar: "فيلم ASA للطبقة السفلية باللون الأصفر (كود ECCMO98501) مخصص للتغليف الحراري السفلي لألواح UPVC في البيئات الكيميائية والساحلية.",
      en: "Yellow ASA bottom-layer film (Code ECCMO98501) formulated for direct thermal lamination onto the underside of multi-layer UPVC profiles.",
    },
    inStock: true,
  },
  {
    id: "erp-04-ecral5012",
    itemNo: 4,
    code: "ECRAL5012",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Blue",
    colorAr: "أزرق سماوي قياسي (Blue)",
    colorZh: "天蓝色 (ECRAL5012)",
    colorToken: "var(--sku-ecral5012)",
    specimenImage: "/assets/opt/hero-partnership.webp",
    finish: {
      ar: "طبقة علوية ملساء أو محببة مقاومة لتراكم الأتربة",
      en: "Anti-Dust Weather-Shield Exterior Finish",
    },
    solar: {
      ar: "مقاومة 3000 ساعة QUV (ASTM G154)، ثبات لون ΔE < 1.3",
      en: "3000h QUV Verified (ASTM G154), Color Shift ΔE < 1.3",
    },
    substrate: {
      ar: "ألواح أسقف الهناجر والمصانع المموجة UPVC",
      en: "Industrial Corrugated UPVC Roofing & Cladding",
    },
    description: {
      ar: "الفيلم العلوي القياسي باللون الأزرق السماوي (كود ECRAL5012) الأكثر طلباً لأسقف المصانع والمستودعات اللوجستية البديلة للصاج المجلفن.",
      en: "Standard Light Blue exterior ASA top film (Code ECRAL5012) widely specified for factory roofing and logistics warehouse cladding.",
    },
    inStock: true,
  },
  {
    id: "erp-05-eccmb97508",
    itemNo: 5,
    code: "ECCMB97508",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Blue Dark",
    colorAr: "أزرق داكن صناعي (Blue Dark)",
    colorZh: "深蓝色 (ECCMB97508)",
    colorToken: "var(--sku-eccmb97508)",
    specimenImage: "/assets/opt/asa-color-jars.webp",
    finish: {
      ar: "طبقة حماية خارجية عميقة اللون عالية الكثافة",
      en: "Deep-Shade High-Opacity Exterior Capstock",
    },
    solar: {
      ar: "حجب كامل للأشعة فوق البنفسجية، ΔE < 1.4 بعد 3000 ساعة",
      en: "99.5% UV Barrier, ΔE < 1.4 after 3000h QUV",
    },
    substrate: {
      ar: "ألواح الأسقف والواجهات الصناعية في المناطق الساحلية",
      en: "Coastal & Heavy-Duty Industrial Roof Panels",
    },
    description: {
      ar: "فيلم ASA علوي باللون الأزرق الداكن (كود ECCMB97508) مصمم للمنشآت الصناعية والموانئ الساحلية التي تتطلب ثباتاً لونياً ومقاومة للأملاح.",
      en: "Dark Blue exterior ASA top film (Code ECCMB97508) formulated with heat-stable inorganic blue pigments for marine and industrial zones.",
    },
    inStock: true,
  },
  {
    id: "erp-06-eccmo96398",
    itemNo: 6,
    code: "ECCMO96398",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Brick Red",
    colorAr: "أحمر طوبي قرميدي (Brick Red)",
    colorZh: "砖红色 (ECCMO96398)",
    colorToken: "var(--sku-eccmo96398)",
    specimenImage: "/assets/opt/asa-red-sheet.webp",
    finish: {
      ar: "سطح قرميدي معماري لامع أو محبب مضاد للتكلس",
      en: "Anti-Chalking Architectural Terracotta Finish",
    },
    solar: {
      ar: "صبغة أكسيد غير عضوية مستقرة حرارياً، ΔE < 1.2",
      en: "Heat-Stable Inorganic Red Chromophore, ΔE < 1.2",
    },
    substrate: {
      ar: "ألواح القرميد الصناعي والأسقف المموجة UPVC",
      en: "Spanish Roof Tiles & Corrugated UPVC Sheets",
    },
    description: {
      ar: "فيلم ASA علوي باللون الأحمر الطوبي (كود ECCMO96398) مطابق لعينات ألواح الأسقف الحمراء في مصنع مدينة السادات لمقاومة شمس الصيف القاسية.",
      en: "Brick Red exterior ASA top film (Code ECCMO96398) matching our signature red roofing sheet specimen for high-insolation desert climates.",
    },
    inStock: true,
  },
  {
    id: "erp-07-eccma96681",
    itemNo: 7,
    code: "ECCMA96681",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Dark Grey",
    colorAr: "رمادي داكن أنثراسيت (Dark Grey)",
    colorZh: "深灰色 (ECCMA96681)",
    colorToken: "var(--sku-eccma96681)",
    specimenImage: "/assets/opt/asa-black-corrugated.webp",
    finish: {
      ar: "سطح ساتان معماري منخفض التوهج أو محبب",
      en: "Low-Glare Architectural Anthracite Satin",
    },
    solar: {
      ar: "ثبات أبعاد حتى 102 °C فيكات (ISO 306)، ΔE < 1.2",
      en: "Dimensional Stability to 102 °C Vicat, ΔE < 1.2",
    },
    substrate: {
      ar: "ألواح الأسقف الحديثة، قطاعات النوافذ، وتكسيات الواجهات",
      en: "Modern Roofing Tiles, Window Profiles & Facades",
    },
    description: {
      ar: "فيلم ASA علوي باللون الرمادي الداكن (كود ECCMA96681) مخصص للواجهات المعمارية الحديثة وألواح القرميد الصناعي ذات المظهر الفحمي والأنثراسيت.",
      en: "Dark Grey exterior ASA top film (Code ECCMA96681) engineered for contemporary architectural roofing and UPVC window profile lamination.",
    },
    inStock: true,
  },
  {
    id: "erp-08-eccmo96375",
    itemNo: 8,
    code: "ECCMO96375",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Dark Orange",
    colorAr: "برتقالي داكن (Dark Orange)",
    colorZh: "深橙色 (ECCMO96375)",
    colorToken: "var(--sku-eccmo96375)",
    specimenImage: "/assets/opt/asa-red-sheet.webp",
    finish: {
      ar: "ملمس قرميد كلاسيكي مقاوم للبهتان والأملاح",
      en: "Deep Terracotta Embossed or Smooth Finish",
    },
    solar: {
      ar: "انعكاس حراري للأشعة تحت الحمراء، ΔE < 1.4",
      en: "High Solar Stability, Color Shift ΔE < 1.4",
    },
    substrate: {
      ar: "بلاط الأسقف المعماري وإكسسوارات القرميد UPVC",
      en: "Architectural Roof Tiles & Ridge Accessories",
    },
    description: {
      ar: "فيلم ASA علوي باللون البرتقالي الداكن (كود ECCMO96375) يمنح أسقف المباني والمنتجعات الساحلية لون القرميد الدافئ دون تشقق أو بهتان.",
      en: "Dark Orange exterior ASA top film (Code ECCMO96375) delivering classic clay-tile aesthetics with 3000-hour QUV weather resistance.",
    },
    inStock: true,
  },
  {
    id: "erp-09-ecral7045",
    itemNo: 9,
    code: "ECRAL7045",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Grey",
    colorAr: "رمادي قياسي (Telegrey)",
    colorZh: "标准灰 (ECRAL7045)",
    colorToken: "var(--sku-ecral7045)",
    specimenImage: "/assets/opt/asa-black-corrugated.webp",
    finish: {
      ar: "سطح رمادي صناعي متوازن الانعكاس الحراري",
      en: "Balanced Solar-Reflectance Industrial Grey",
    },
    solar: {
      ar: "يقلل امتصاص الحرارة مقارنة بالدرجات الداكنة، ΔE < 1.2",
      en: "Reduced Heat Gain vs Dark Shades, ΔE < 1.2",
    },
    substrate: {
      ar: "أسقف المصانع، المستودعات، وكبائن المعدات الخارجية",
      en: "Factory Roofs, Logistics Halls & Utility Enclosures",
    },
    description: {
      ar: "فيلم ASA علوي باللون الرمادي القياسي (كود ECRAL7045) يجمع بين المظهر الصناعي المحايد وتقليل اكتساب الحرارة على أسقف الهناجر.",
      en: "Standard Telegrey exterior ASA top film (Code ECRAL7045) combining neutral architectural appearance with lower solar heat absorption.",
    },
    inStock: true,
  },
  {
    id: "erp-10-ecral1014",
    itemNo: 10,
    code: "ECRAL1014",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Ivory",
    colorAr: "عاجي معماري (Ivory)",
    colorZh: "象牙白 (ECRAL1014)",
    colorToken: "var(--sku-ecral1014)",
    specimenImage: "/assets/opt/hero-partnership.webp",
    finish: {
      ar: "سطح عاجي عاكس لأشعة الشمس ومقاوم للاصفرار",
      en: "Solar-Reflective Non-Yellowing Ivory Finish",
    },
    solar: {
      ar: "انعكاس شمسي عالٍ للمناطق الحارة، ΔE < 1.2",
      en: "High Solar Reflectance Index, ΔE < 1.2",
    },
    substrate: {
      ar: "أسقف المنشآت الغذائية، المخازن المبردة، والمزارع",
      en: "Cooled Warehouses, Food Plants & Agricultural Halls",
    },
    description: {
      ar: "فيلم ASA علوي باللون العاجي القياسي (كود ECRAL1014) مثالي للمصانع والمخازن التي تتطلب خفض حرارة السقف مع مظهر معماري راقٍ.",
      en: "Ivory exterior ASA top film (Code ECRAL1014) engineered to minimize roof surface temperature in hot desert industrial zones.",
    },
    inStock: true,
  },
  {
    id: "erp-11-ecral6019",
    itemNo: 11,
    code: "ECRAL6019",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Light Green",
    colorAr: "أخضر فاتح (Light Green)",
    colorZh: "浅绿色 (ECRAL6019)",
    colorToken: "var(--sku-ecral6019)",
    specimenImage: "/assets/opt/asa-color-jars.webp",
    finish: {
      ar: "سطح أخضر فاتح عاكس للحرارة ومقاوم للرطوبة",
      en: "Pastel Green UV-Stabilized Exterior Surface",
    },
    solar: {
      ar: "ثبات لوني ضد الأشعة والأملاح، ΔE < 1.3",
      en: "UV & Humidity Stabilized, Color Shift ΔE < 1.3",
    },
    substrate: {
      ar: "البيوت الزراعية، المشروعات البيئية، والمنشآت الصناعية",
      en: "Agri-Industrial Halls, Eco-Projects & Cladding",
    },
    description: {
      ar: "فيلم ASA علوي باللون الأخضر الفاتح (كود ECRAL6019) يناسب المشروعات الزراعية والصناعية التي تجمع بين الانعكاس الحراري واللون الهادئ.",
      en: "Light Green exterior ASA top film (Code ECRAL6019) suited for agricultural facilities, food processing roofs, and industrial siding.",
    },
    inStock: true,
  },
  {
    id: "erp-12-eccmo96275",
    itemNo: 12,
    code: "ECCMO96275",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "Orange",
    colorAr: "برتقالي قرميدي (Orange)",
    colorZh: "橙色 (ECCMO96275)",
    colorToken: "var(--sku-eccmo96275)",
    specimenImage: "/assets/opt/asa-color-jars.webp",
    finish: {
      ar: "سطح قرميدي مشرق عالي الثبات ضد الشمس",
      en: "Vibrant Terracotta Weather-Resistant Finish",
    },
    solar: {
      ar: "ثبات ΔE < 1.4 بعد 3000 ساعة تعتيق متسارع QUV",
      en: "QUV 3000h Weathering ΔE < 1.4 Verified",
    },
    substrate: {
      ar: "ألواح القرميد المموجة والواجهات المعمارية",
      en: "Corrugated Spanish Roof Profiles & Facades",
    },
    description: {
      ar: "فيلم ASA علوي باللون البرتقالي (كود ECCMO96275) مصمم لألواح القرميد والأسقف المعمارية التي تتطلب لوناً مشرقاً يدوم لسنوات دون بهتان.",
      en: "Orange exterior ASA top film (Code ECCMO96275) formulated for residential and commercial roof tiles requiring vivid long-term color.",
    },
    inStock: true,
  },
  {
    id: "erp-13-ecral9016",
    itemNo: 13,
    code: "ECRAL9016",
    category: "ASA Film (Top)",
    categorySlug: "top",
    colorEn: "White",
    colorAr: "أبيض ناصع قياسي (Traffic White)",
    colorZh: "交通白 (ECRAL9016)",
    colorToken: "var(--sku-ecral9016)",
    specimenImage: "/assets/opt/hero-partnership.webp",
    finish: {
      ar: "سطح أبيض ناصع عاكس لأشعة الشمس ومضاد للاصفرار",
      en: "Maximum Solar-Reflective Non-Yellowing White",
    },
    solar: {
      ar: "أعلى معامل انعكاس شمسي (SRI)، ثبات ΔE < 1.0",
      en: "Peak Solar Reflectance Index, ΔE < 1.0 (3000h QUV)",
    },
    substrate: {
      ar: "أسقف المخازن المبردة، مصانع الأدوية، وقطاعات UPVC",
      en: "Cold-Storage Roofs, Pharma Plants & UPVC Profiles",
    },
    description: {
      ar: "فيلم ASA علوي باللون الأبيض الناصع القياسي (كود ECRAL9016) يوفر أقصى انعكاس لأشعة الشمس المباشرة ويمنع اصفرار الألواح وقطاعات النوافذ.",
      en: "Traffic White exterior ASA top film (Code ECRAL9016) delivering maximum solar heat reflection and zero UV yellowing.",
    },
    inStock: true,
  },
];

export const DEFAULT_SITE_MEDIA: Record<string, string> = {
  hero_partnership: "/assets/opt/hero-partnership.webp",
  hero_red_sheet: "/assets/opt/asa-red-sheet.webp",
  factory_facade: "/assets/opt/factory-facade.webp",
  jar_granules: "/assets/opt/asa-color-jars.webp",
  black_corrugated: "/assets/opt/asa-black-corrugated.webp",
  red_sheet_macro: "/assets/opt/asa-red-sheet.webp",
};

export type SocialChannelId = "facebook" | "tiktok" | "instagram" | "whatsapp";

export interface SocialChannelConfig {
  id: SocialChannelId;
  // TODO: Replace null with verified official profile URLs once published
  url: string | null;
}

export const SOCIAL_CHANNELS: SocialChannelConfig[] = [
  { id: "facebook", url: null },
  { id: "tiktok", url: null },
  { id: "instagram", url: null },
  // WhatsApp resolves dynamically through SupabaseCatalogProvider.buildWhatsAppUrl
  { id: "whatsapp", url: "dynamic" },
];
