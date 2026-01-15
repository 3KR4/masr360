const ar = {
  header: {
    logo_alt: "مصر 360",
    dashboard: "لوحة التحكم",
    search_placeholder: "استكشف مصر",
    search: "بحث",
    close_search: "إغلاق البحث",
    cart: "عربة التسوق",
    user_menu: "قائمة المستخدم",
    welcome_user: "محمود الشاذلي",
    my_bookings: "حجوزاتي",
    my_orders: "طلباتي",
    favorites: "المفضلة",
    support: "الدعم الفني",
    change_language: "تغيير اللغة",
    logout: "تسجيل الخروج",
    english: "الإنجليزية",
    arabic: "العربية",
    sign_up: "انشاء حساب",
    home: "الصفحة الرئيسية",
    tours: "الجولات",
    nights: "المساء",
    nights_short: "المساء",
    marketplace: "السوق",
    market_short: "السوق",
    about_us: "من نحن",
    about_short: "عنا",
    see_all: "عرض الكل",
    departments: {
      attractions: "المعالم",
      tours: "الجولات",
      activities: "الأنشطة",
      experiences: "التجارب",
      restaurants: "المطاعم",
      shopping: "التسوق",
    },
    categories: {
      pyramids: "الأهرامات",
      museums: "المتاحف",
      historical_sites: "المواقع التاريخية",
      desert_safari: "السفاري الصحراوي",
      cultural_tours: "الجولات الثقافية",
    },
    search_results: {
      private_events: "الفعاليات الخاصة",
      night_tours: "جولات الليل",
      dinner_cruises: "رحلات العشاء النيلية",
      see_more: "عرض المزيد من النتائج",
    },
  },
  footer: {
    description: "اكتشف جمال وتاريخ وثقافة مصر — كل ذلك في مكان واحد.",

    contact_title: "تواصل معنا",
    email_label: "البريد الإلكتروني",
    phone_label: "الهاتف",

    social_title: "وسائل التواصل",

    quick_links: "روابط سريعة",
    links: {
      home: "الرئيسية",
      governorates: "المحافظات",
      places: "أهم المعالم",
      products: "منتجات محلية",
      contact: "تواصل معنا",
    },

    rights: "جميع الحقوق محفوظة.",
    privacy: "سياسة الخصوصية",
  },
  sectionsTitles: {
    popular_products: {
      title: "المنتجات الأكثر رواجًا",
      subtitle:
        "اكتشف أكثر المنتجات اليدوية المحبوبة في مصر — مصنوعة بشغف، وبتراث أصيل، ولمسة فنية محلية حقيقية.",
      btn: "استكشف المزيد",
    },

    top_attractions: {
      title: "أهم المعالم",
      subtitle:
        "ادخل عالم التاريخ واستكشف أروع معالم مصر — من عجائبها القديمة إلى كنوزها الخالدة.",
      btn: "شاهد المزيد",
    },

    masr_nights: {
      title: "ليالي مصر",
      subtitle:
        "اكتشف الحياة الليلية النابضة في مصر — من الفعاليات المسائية والعروض الثقافية إلى الرحلات النيلية والجواهر الخفية بعد الغروب.",
      btn: "استكشف المزيد",
    },

    categories: {
      title: "التصنيفات",
      subtitle: "من المعابد القديمة إلى الشواطئ المشمسة — رحلتك تبدأ من هنا",
    },

    upcoming_events: {
      title: "الفعاليات القادمة",
      subtitle: "اطّلع على أحدث الفعاليات القادمة قريبًا!",
      btn: "استكشف المزيد",
    },

    discover_egypt: {
      title: "اكتشف مصر",
      subtitle: "تعرّف على أشهر المحافظات في مصر",
      btn: "عرض الكل",
    },
    discover_egypt_page: {
      mainTitle: "اكتشف مصر",
      subTitle:
        "مع Masr 360، يمكنك استكشاف كل محافظة وتجربة مصر كما لم تفعل من قبل.",
    },
    marketplace_page: {
      subTitle:
        "اكتشف الحرف اليدوية والهدايا التذكارية المصرية الأصيلة المصنوعة بأيدي حرفيين محليين — كل قطعة تعكس روح مصر.",
    },
    governorate_places: (governorateName) => ({
      mainTitle: `${governorateName} - أماكن`,
      subTitle: `استكشف جمال ومعالم ${governorateName}. اكتشف تاريخها ومعالمها وكنوزها المخفية فقط على Masr 360.`,
    }),

    discover_places: {
      mainTitle: "اكتشف الأماكن",
      subTitle:
        "مع Masr 360، استكشف الوجهات الرائدة، واكشف القصص المحلية، واختبر الجوهر الحقيقي لكل موقع.",
    },

    masr_nights_page: {
      mainTitle: "ليالي مصر",
      subTitle:
        "مع Masr 360، استمتع بالوجهات الرائدة، واكشف القصص المحلية، واختبر الجوهر الحقيقي لكل موقع بعد غروب الشمس.",
    },

    explore_games: {
      mainTitle: "استكشف الألعاب",
      subTitle:
        "اكتشف التفاصيل المخفية التي لا تُرى إلا على الموقع، واكسب عملات يمكنك استبدالها بمكافآت حقيقية في السوق.",
    },
  },
  sideNav: {
    menuRoutes: "قائمة الصفحات",
    overview: "نظرة عامة",
    slides: "السلايدر",
    users: "المستخدمين",
    governorates: "المحافظات",
    places: "الأماكن",
    nights: "الليالي",
    events: "الفعاليات",
    games: "الألعاب",
    orders: "الطلبات",
    products: "المنتجات",
    support: "الدعم",

    darkTheme: "الوضع الداكن",
    logout: "تسجيل الخروج",
    language: "اللغة",
  },
  auth: {
    login: "تسجيل الدخول",
    optional: "اختياري",
    createAccount: "إنشاء حسابك",
    loginToAccount: "تسجيل الدخول لحسابك",

    verifyPhone: "تأكيد رقم الهاتف",
    verifyEmail: "تأكيد البريد الإلكتروني",
    forgetPass: "التأكد من ملكية الحساب",
    choose_verify_method: "اختر طريقة التحقق",
    chooseNationality: "اختر جنسيتك",

    chooseInterests: "اختر اهتماماتك",

    emailPhoneLogin: "البريد الإلكتروني أو رقم الهاتف",
    accountDescription: "أنشئ حسابك للتواصل مع البائعين أو بيع منتجاتك الخاصة.",
    phoneDescription: "أدخل رمز التحقق المرسل إلى رقم هاتفك.",
    emailDescription: "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني.",
    addressDescription: "عنوانك يساعد في إدارة متجرك ويمكن تغييره في أي وقت.",
    interestsDescription: "اختر اهتماماتك لتظهر لك المحتويات ذات الصلة فورًا.",
    choose_verify_method_description:
      "اختر طريقة التحقق المناسبة لأثبات ملكيتك للحساب",
    createAccountBtn: "إنشاء حساب",
    verifyPhoneBtn: "تأكيد الهاتف",
    verifyEmailBtn: "تأكيد البريد",
    forgetPassBtn: "تأكيد ملكية الحساب",
    finishAccount: "إنهاء الحساب",
    next: "التالي",
    skip: "تخطي",
    orContinueWith: "أو المتابعة عبر",
    orLoginWith: "او تسجيل الدخول عبر",

    google: "حساب جوجل",
    haveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",
    sendCode: "ارسال رمز التحقق",

    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    email: "البريد الإلكتروني",
    emailOptional: "البريد الإلكتروني (اختياري)",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    forgetPassword: "هل تواجه مشكلة او نسيت",
    verify_by_email: "التحقق عبر البريد الإلكتروني",
    verify_by_phone: "التحقق عبر رقم الهاتف",
    makeNewPassword: "قم بأنشاء كلمة مرور جديدة",
    userVerified: "تم تأكيد الحساب بنجاح",
    userVerifiedDescription:
      "يمكنك الآن عرض كلمة المرور الحالية وتحديثها إذا رغبت.",
    update_pass_and_continue: "تحديث كلمة المرور والمتابعة",
    skip_and_login: "تخطي وتسجيل الدخول",
    viewYourCurrentPassword: "كلمة المرور الحالية",
    placeholders: {
      fullName: "أدخل اسمك الكامل",
      phone: "أدخل رقم هاتفك",
      email: "أدخل بريدك الإلكتروني",
      password: "أدخل كلمة المرور",
      confirmPassword: "أكد كلمة المرور",
      emailPhoneLogin: "اكتب البريد الإلكتروني أو رقم الهاتف",
      newPassword: "قم بأدخال كلمة المرور الجديدة",
    },

    errors: {
      requiredEmail: "البريد الإلكتروني مطلوب",
      requiredPassword: "كلمة المرور مطلوبة",
      requiredFullName: "الاسم الكامل مطلوب",
      requiredPhone: "رقم الهاتف مطلوب",
      invalidEmail: "أدخل بريدًا إلكترونيًا صالحًا (مثل user@example.com)",
      invalidPhone: "أدخل رقم هاتف صالح",
      phoneTooShort: "رقم الهاتف قصير جدًا",
      phoneTooLong: "رقم الهاتف طويل جدًا",
      passwordWeak:
        "يجب أن تكون كلمة المرور 8 أحرف على الأقل، وتشمل حرف كبير، رقم، وحرف خاص",
      passwordMismatch: "كلمات المرور غير متطابقة",
      fullNameTwoWords: "يجب أن يحتوي الاسم الكامل على كلمتين على الأقل",
      firstNameShort: "يجب أن يكون الاسم الأول 3 أحرف على الأقل",
      lastNameShort: "يجب أن يكون الاسم الأخير 3 أحرف على الأقل",
      emailPhoneLoginRequired: "البريد الإلكتروني أو رقم الهاتف مطلوب",
      emailPhoneLoginInvalid: "قم بأدخال أدخل بريد إلكتروني أو رقم هاتف صحيح",
    },
  },
  marketplace: {
    filter_by_availability: "التصفية حسب التوفر",
    selected_filters: "التصفيات المختارة",
    availability: "التوافرية",
    in_stock: "متوفر",
    out_of_stock: "غير متوفر",

    filter_by_price: "التصفية حسب السعر",
    enter_price_range: "أدخل الحد الأدنى والأقصى للسعر",
    min: "الأقل",
    max: "الأقصى",

    filter_by_categories: "التصفية حسب الفئات",
  },
  head: {
    searchIn: "بحث في",
    filterGov: "فلترة حسب المحافظة:",
    filterCat: "فلترة حسب القسم:",
    filterSubCat: "فلترة حسب القسم الفرعي:",
    noResults: "لا توجد نتائج مطابقة",
    create: "إضافة",
  },
  dashboard: {
    tables: {
      placeDetails: "تفاصيل المكان",
      categoriesAndSubcategories: "التصنيفات والتصنيفات الفرعية",
      reviews: "التقييمات",
      viewsCount: "عدد المشاهدات",
      governorate: "المحافظة",
      actions: "الإجراءات",
      cartItems: "عناصر العربة",
      ancientEgypt: "مصر القديمة",
      deserts: "الصحاري",
      review: "مراجعة",
      view: "عرض",
      edit: "تعديل",
      delete: "حذف",
      next: "التالي",
      prev: "السابق",
      first: "الأول",
      last: "الأخير",
      nights: "المساء",
      places: "الأماكن",
      products: "المنتجات",
      users: "المستخدمين",
      status: "الحالة",
      rating: "التقييم",
      description: "الوصف",
      eventDetails: "تفاصيل الحدث",
      categories: "التصنيفات",
      eventLasts: "مدة الحدث",
      startingTime: "وقت البدء",
      viewsCount: "عدد المشاهدات",
      governorate: "المحافظة",
      actions: "الإجراءات",
      events: "الأحداث",
      startsIn: "يبدأ بعد",
      hours: "ساعة",
      minutes: "دقيقة",
      seconds: "ثانية",
      days: "يوم",
    },
    forms: {
      title: "اسم المنتج",
      titlePlaceholder: "أدخل اسم المنتج",

      category: "القسم",
      categoryPlaceholder: "اختر القسم",

      stock: "الكمية",
      stockPlaceholder: "أدخل الكمية المتاحة",

      price: "السعر",
      pricePlaceholder: "أدخل سعر المنتج",

      sale: "الخصم (%)",
      salePlaceholder: "أدخل نسبة الخصم",

      description: "الوصف",
      descriptionPlaceholder: "أدخل وصف المنتج",

      createProduct: "إضافة منتج",
      tags: "الوسوم",
      tagsPlaceholder: "أدخل الوسوم",
      add: "إضافة",

      specifications: "المواصفات",
      specKey: "الخاصية",
      specValue: "القيمة",
      addSpecification: "إضافة مواصفة",

      images: "الصور",
      imagesHint: "اضغط أو اسحب الصور هنا",
      clickHere: "اضغط هنا",
      dropHere: "اترك هنا",

      governorate: "المحافظة",
      selectGovernorate: "اختر المحافظة",
      subCategory: "الفئة الفرعية",
      selectSubCategory: "اختر الفئة الفرعية",

      googleMapsLink: "رابط خرائط جوجل",
      googleMapsLinkPlaceholder: "https://maps.app.goo.gl/...",
      googleMapsIframe: "رابط تضمين خرائط جوجل",
      googleMapsIframePlaceholder: "https://www.google.com/maps/embed?pb=...",

      createPlace: "إنشاء مكان",
      governorateName: "اسم المحافظة",
      governorateNamePlaceholder: "ادخل اسم المحافظة",
      governorateDescriptionPlaceholder: "ادخل وصف للمحافظة",
      createGovernorate: "إنشاء محافظة",

      tickets: "التذاكر",
      freeEntry: "دخول مجاني",
      paidTickets: "تذاكر مدفوعة",
      staticPrice: "سعر ثابت",
      staticEgFr: "سعر للمصريين والأجانب",
      regionAge: "سعر حسب العمر",
      regionAgeEgFr: "سعر حسب العمر والجنسيات",

      students: "طلاب",
      adults: "بالغين",
      seniors: "كبار السن",
      egyptian: "مصري",
      foreigner: "أجنبي",

      errors: {
        titleRequired: "اسم المنتج مطلوب",
        titleMin: "اسم المنتج يجب أن يكون 3 أحرف على الأقل",

        stockRequired: "الكمية مطلوبة",
        stockMin: "أقل كمية هي 1",

        priceRequired: "السعر مطلوب",
        priceMin: "السعر يجب أن يكون أكبر من صفر",
        imagesRequired: "يجب رفع صورة واحدة على الأقل",

        googleMapsLinkRequired: "رابط خرائط جوجل مطلوب",
        googleMapsLinkInvalid: "الرجاء إدخال رابط خرائط جوجل صحيح",
        googleMapsIframeRequired: "رابط التضمين مطلوب",
        googleMapsIframeInvalid: "الرجاء إدخال رابط التضمين صحيح",

        saleMax: "نسبة الخصم لا يمكن أن تتجاوز 90%",

        governorateNameRequired: "اسم المحافظة مطلوب",
        governorateNameMinLength: "اسم المحافظة يجب أن يكون على الأقل 3 أحرف",
      },
    },
  },
  actions: {
    lang: "english",
    next: "التالي",
    prev: "السابق",
  },
  mainCard: {
    seeProduct: "عرض المنتج",
    startJourney: "ابدأ الرحلة",
    seeDetails: "عرض التفاصيل",
    reviews: "مراجعات",
    price: "السعر",
    sale: "خصم",
    outOfStock: "نفذ من المخزن",
    startAt: "بداية الحدث",
    lasts: "مدة الحدث",
    reward: "نقطة مكافأة",
    explore: "استكشف",
    places: "مكان",
    questions: "سؤال",
    eventTime: "وقت الحدث",
    governorate: "المحافظة",
    location: "الموقع",
    lastPrice: "آخر سعر",
    discount: "خصم",
  },
  cart: {
    emptyCart: "عربة التسوق فارغة",
    emptyMessage:
      "أضف بعض المنتجات التي تحبها — ستظهر هنا عندما تكون مستعدًا للدفع!",
    itemsInCart: "لديك {count} منتج في عربة التسوق",
    quantityLabel: "الكمية:",
    totalPrice: "إجمالي السعر:",
    viewCart: "عرض العربة",
    checkout: "الدفع",
    discount: "خصم",
    productDetails: "تفاصيل المنتج",
    remove: "إزالة",
    cartItems: "عناصر العربة",
    category: "التصنيف",
    outOfStock: "نفذ من المخزن",
    lastPrice: "آخر سعر",
    sale: "خصم",
    orderInformation: "معلومات الطلب",
    deliveryAddress: "عنوان التوصيل",
    addressRequired: "الرجاء إدخال عنوان التوصيل",
    addressPlaceholder: "مثال: 15 ش أحمد عرابي، مدينة نصر، القاهرة",
    deliveryInstructions: "تعليمات التوصيل (اختياري)",
    instructionsPlaceholder:
      "مثال: اتصل بي عند الوصول، أو اترك الطرد عند البوابة",
    orderSummary: "ملخص الطلب",
    shipping: "الشحن",
    couponCode: "كود الخصم",
    couponPlaceholder: "أدخل كود الخصم",
    apply: "تطبيق",
    paymentMethod: "طريقة الدفع",
    paymentIntegration: "سيتم تنفيذ تكامل الدفع في المرحلة القادمة.",
    shoppingCart: "عربة التسوق",
    checkoutDetails: "تفاصيل الدفع",
    step1: "العربة",
    step2: "التفاصيل",
    step3: "الدفع",
    previous: "السابق",
    next: "التالي",
    total: "الإجمالي",
    exploreMarketplace: "استكشف السوق",
    price: "السعر",
    quantity: "الكمية",
  },
  booking: {
    yourBookingsList: "قائمة حجوزاتك",
    subtitle:
      "اعرض جميع رحلاتك المحجوزة وزيارات المواقع، وتحقق من تفاصيل الدفع، وشاهد موعد زيارتك المجدولة.",
    placeDetails: "تفاصيل المكان",
    ticketPrice: "سعر التذكرة",
    peopleCount: "عدد الأشخاص",
    totalPaid: "إجمالي المدفوع",
    bookingDate: "تاريخ الحجز",
    visitDate: "تاريخ الزيارة",
    bookingList: "قائمة الحجوزات",
    in: "في",
    people: "أشخاص",
    person: "شخص",
    emptyBookings: "قائمة حجوزاتك فارغة",
    emptyMessage:
      "لم تحجز أي رحلات أو زيارات مواقع بعد. ابدأ في استكشاف أفضل الوجهات في مصر واحجز مغامرتك القادمة الآن!",
    explorePlaces: "استكشف الأماكن",
  },
  orders: {
    yourOrdersList: "قائمة طلباتك",
    subtitle:
      "هنا يمكنك عرض جميع طلباتك السابقة والحالية، وتتبع حالة كل طلب، ومراجعة التفاصيل المهمة مثل تاريخ التسليم وطريقة الدفع والتكلفة الإجمالية.",
    products: "المنتجات",
    totalPrice: "السعر الإجمالي",
    productsQuantity: "كمية المنتجات",
    paymentMethod: "طريقة الدفع",
    shipping: "الشحن",
    status: "الحالة",
    date: "التاريخ",
    itemsCount: "{count} منتج",
    emptyOrders: "قائمة طلباتك فارغة",
    emptyMessage:
      "لم تقدم أي طلبات بعد. ابدأ في استكشاف سوقنا واكتشف المنتجات المصرية الحرفية الفريدة — بمجرد إتمام عملية الشراء، ستظهر طلباتك هنا لسهولة التتبع.",
    exploreMarketplace: "استكشف السوق",
    paymentTypes: {
      card: "بطاقة",
      credit_card: "بطاقة ائتمان",
      paypal: "باي بال",
      cash_on_delivery: "الدفع عند الاستلام",
    },
    shippingTypes: {
      standard: "عادي",
      express: "سريع",
      pickup: "استلام من المتجر",
    },
    statusTypes: {
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    },
  },
  favorites: {
    title: "قائمة المفضلة الخاصة بك",
    subtitle:
      "اعرض جميع المنتجات والأماكن التي أضفتها إلى المفضلة — طريقة سريعة لتتبع ما تحبه والعودة إليه في أي وقت.",
    productsList: "قائمة المنتجات",
    placesList: "قائمة الأماكن",
    tableHeaders: {
      product: {
        details: "تفاصيل المنتج",
        price: "السعر",
        category: "الفئة",
        rating: "التقييم",
        remove: "إزالة",
      },
      place: {
        details: "تفاصيل المكان",
        location: "الموقع",
        remove: "إزالة",
      },
    },
    empty: {
      title: "قائمة المفضلة فارغة",
      description:
        "لم تضف أي منتجات أو أماكن إلى المفضلة بعد. ابدأ الاستكشاف وحفظ ما تحبه — ستظهر هنا للوصول السهل لاحقًا!",
      buttons: {
        marketplace: "استكشاف المتجر",
        egypt: "اكتشف مصر",
      },
    },
  },
  about: {
    hero_tagline: "العبها، عشها، واختبرها 360°",
    hero_title: "اكتشف مصر بطريقتك",
    hero_subtitle:
      "نظام سياحي متكامل مدعوم بالثقافة والتكنولوجيا ولعبة تجعل الاستكشاف مغامرة لا تُنسى.",

    nav: {
      about: "من نحن",
    },

    about_title: "من نحن",
    about_p1: {
      main: "Masr360 هو نظام سياحي رقمي متكامل يهدف لتغيير طريقة استكشاف مصر. نحن لا نساعد الزوار فقط في العثور على الأماكن - ",
      highlight:
        "بل نرشدهم خلال رحلة كاملة حيث يكون كل خطوة تفاعلية، مُجزية وذات معنى.",
    },
    about_p2:
      "في قلب Masr360 توجد تجربتنا الفريدة المتمثلة في لعبة استكشاف مكونة من 24 خطوة تشجع المسافرين على اكتشاف مصر الحقيقية مع الحصول على مكافآت.",

    ecosystem_title: "حول هذه اللعبة، بنينا نظاماً متكاملاً:",
    ecosystem: [
      {
        title: "مركز استكشاف",
        text: "لكل محافظة ومعلم سياحي",
      },
      {
        title: "دليل الحياة الليلية والثقافة",
        text: "لتجارب بعد الساعة 8 مساءً",
      },
      {
        title: "سوق إلكتروني",
        text: "يدعم الحرف اليدوية المصرية الأصيلة",
      },
      {
        title: "شركاء محليون",
        text: "بما في ذلك المقاهي والمطاعم والحرفيين ووكالات السياحة",
      },
      {
        title: "نظام مكافآت",
        text: "يربط كل هذه العناصر في حلقة واحدة سلسة",
      },
    ],

    not_app_title: "Masr360 ليس تطبيقًا -",
    not_app_highlight:
      "إنه نظام متكامل يربط السياح، المجتمعات المحلية، الأعمال، والثقافة.",
    not_app_text:
      "هدفنا هو أن يتمكن كل زائر من تجربة مصر بشكل كامل والاستمتاع بكل لحظة.",

    mission_title: "مهمتنا",
    vision_title: "رؤيتنا",
    vision_text:
      "بناء أول نظام سياحي شامل في مصر حيث يصبح الاستكشاف لعبة والثقافة تفاعلية.",

    game_title: "مركز اللعبة - ميزةنا الأساسية",
    game_subtitle: "لعبتنا هي قلب Masr360",
    game_intro: "لعبة Masr360 تحول السياحة إلى مغامرة تفاعلية.",

    game_points: [
      "اكسب نقاطًا بزيارة المواقع",
      "افتح تحديات جديدة",
      "أكمل التجارب الثقافية",
      "جرّب المقاهي والمطاعم الشريكة",
      "انضم إلى الجولات الإرشادية",
      "استبدل النقاط بخصومات حقيقية",
    ],

    game_note_title: "ليست للترفيه فقط -",
    game_note_highlight:
      "إنها المحرك الذي يربط بين الاكتشاف، الشركاء، السوق والخدمات السياحية.",
    game_note_end: "هذا ما لا يقدمه أي منصة سياحية أخرى في مصر.",

    why_title: "لماذا Masr360؟",
    why_text: [
      "Masr360 يحول استكشاف مصر إلى نظام متكامل وممتع.",
      "يستكشف الزوار مصر، يفتحون تحديات، يكسبون مكافآت، ويتفاعلون مع الأعمال المحلية.",
      "Masr360 يقدم قيمة حقيقية للسياح، المبدعين، وللهوية الثقافية لمصر.",
    ],

    values_title: "قيمنا",
    values_keywords: "التجربة • الأصالة • الأثر • الابتكار • الثقافة • البساطة",
    values: [
      { title: "الأصالة", text: "نعرض مصر الحقيقية." },
      { title: "الإبداع", text: "نجمع بين الثقافة والسياحة والألعاب." },
      { title: "الشمولية", text: "ندعم الحرفيين المحليين والأعمال الصغيرة." },
      { title: "الابتكار", text: "نجعل السياحة تجربة رقمية ذكية." },
      { title: "الأثر", text: "نساعد المجتمعات على النمو." },
    ],

    closing: [
      "حيث تصبح مصر مغامرة.",
      "حيث كل خطوة لها قصة.",
      "حيث الاستكشاف يصبح لعبة.",
    ],
  },
  support: {
    hero_title: "تحتاج مساعدة؟!",
    hero_subtitle: "يمكنك اختيار نوع المشكلة وشرحها، ثم تحديد طريقة الاتصال.",

    categories_title: "فئات المشكلة",
    categories: {
      technical: "مشكلة تقنية",
      account: "مشكلة في الحساب",
      payment: "مشكلة في الدفع",
      suggestion: "اقتراح",
      other: "شيء آخر",
    },

    description_title: "صف مشكلتك",
    description_placeholder_title: "عنوان مشكلتك",
    description_placeholder_details: "تفاصيل مشكلتك",
    errors: {
      title_required: "عنوان المشكلة مطلوب",
      title_minLength: "الحد الأدنى 5 أحرف",
      category_required: "الرجاء اختيار نوع المشكلة",
      contact_required: "الرجاء اختيار طريقة الاتصال",
    },

    contact_title: "اختر طريقة الاتصال",
    contact_methods: {
      whatsapp: "واتساب",
      email: "البريد الإلكتروني",
      phone: "مكالمة هاتفية",
    },

    submit_btn: {
      default: "أرسل مشكلتك",
      other: "أرسل مشكلتك",
    },
  },
  privacy: {
    privacy_policy: {
      mainTitle: "سياسة الخصوصية - Masr360",
      effectiveDate: "[أدخل التاريخ]",
      lastUpdated: "[أدخل التاريخ]",
      sections: {
        introduction: {
          title: "1. المقدمة",
          content: [
            "مرحبًا بكم في Masr360، منصة سياحية ذكية تجمع بين الثقافة والتكنولوجيا واستكشاف مصر بطريقة ممتعة ومسلية.",
            "توضح سياسة الخصوصية هذه كيفية جمع المعلومات الشخصية الخاصة بك واستخدامها وحمايتها عند زيارة موقعنا أو تطبيقنا.",
            "باستخدام Masr360، فإنك توافق على سياسة الخصوصية هذه.",
          ],
        },
        information_we_collect: {
          title: "2. المعلومات التي نجمعها",
          content: [
            "نجمع المعلومات لتقديم خدمات أفضل لمستخدمينا وشركائنا. وقد تشمل هذه المعلومات:",
          ],
          personal_info: [
            "الاسم، البريد الإلكتروني، ورقم الهاتف (لإنشاء الحساب أو الحجوزات).",
            "تفاصيل الدفع (تتم معالجتها بأمان عبر مزودين خارجيين).",
            "البيانات الديموغرافية (العمر، البلد، اللغة المفضلة).",
          ],
          non_personal_info: [
            "نوع الجهاز، المتصفح، وعنوان IP.",
            "بيانات الاستخدام مثل الصفحات التي تم زيارتها والإجراءات المتخذة.",
            "بيانات الموقع (إذا تم تمكين الوصول للموقع).",
          ],
        },
        how_we_use: {
          title: "3. كيفية استخدام معلوماتك",
          content: [
            "تساعدنا بياناتك على:",
            "تخصيص تجارب المستخدم والتوصيات.",
            "معالجة الحجوزات والمدفوعات والمعاملات.",
            "التواصل بشأن التحديثات والعروض ودعم العملاء.",
            "تحسين وظائف المنصة وإصلاح المشكلات التقنية.",
            "تحليل سلوك المستخدم لأغراض التحليلات الداخلية وتتبع الأداء.",
          ],
        },
        sharing_of_information: {
          title: "4. مشاركة المعلومات",
          content: [
            "لا تقوم Masr360 ببيع أو تأجير بياناتك الشخصية.",
            "قد نشارك بيانات محدودة في الحالات التالية فقط:",
            "مع البائعين أو الشركاء المعتمدين (لإتمام الحجوزات أو المشتريات).",
            "مع مزودي الخدمات (مثل بوابات الدفع وأدوات التحليل).",
            "عند الطلب من قبل السلطات القانونية أو المحافظات.",
            "جميع الشركاء ملزمون بالالتزام بمعايير حماية البيانات والسرية.",
          ],
        },
        data_security: {
          title: "5. حماية البيانات",
          content: [
            "نستخدم تشفير SSL وخوادم آمنة لحماية بياناتك الشخصية.",
            "الوصول إلى المعلومات الحساسة محدود للأشخاص المخولين فقط.",
            "يرجى ملاحظة أن أي نقل عبر الإنترنت ليس آمنًا 100٪، ويشارك المستخدمون المعلومات على مسؤوليتهم الخاصة.",
          ],
        },
        user_rights: {
          title: "6. حقوق المستخدم",
          content: [
            "لديك الحق في:",
            "الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها.",
            "سحب الموافقة على الاتصالات التسويقية.",
            "طلب تفاصيل عن المعلومات المخزنة.",
            "يمكن تقديم الطلبات عبر البريد الإلكتروني: privacy@masr360.com",
          ],
        },
        data_retention: {
          title: "7. الاحتفاظ بالبيانات",
          content: [
            "نحتفظ ببياناتك فقط طالما كان ذلك ضروريًا لتقديم الخدمة أو الالتزام القانوني أو العمليات التجارية.",
            "عندما لا تكون البيانات مطلوبة بعد ذلك، يتم حذفها أو إخفاؤها بشكل آمن.",
          ],
        },
        cookies: {
          title: "8. الكوكيز وتقنيات التتبع",
          content: [
            "تستخدم Masr360 ملفات تعريف الارتباط لتحسين الأداء وتخصيص المحتوى.",
            "يمكنك إدارة أو تعطيل الكوكيز من إعدادات المتصفح.",
            "للتفاصيل، يرجى مراجعة سياسة الكوكيز الخاصة بنا.",
          ],
        },
        third_party_links: {
          title: "9. روابط الأطراف الثالثة",
          content: [
            "قد يحتوي موقعنا على روابط لمواقع أو بائعين من أطراف ثالثة.",
            "Masr360 غير مسؤولة عن ممارسات الخصوصية الخاصة بهم، ونوصي بمراجعة سياساتهم بشكل منفصل.",
          ],
        },
        changes: {
          title: "10. التغييرات على هذه السياسة",
          content: [
            "قد تقوم Masr360 بتحديث سياسة الخصوصية بشكل دوري.",
            'سيتم نشر التحديثات مع تاريخ "آخر تحديث" جديد.',
            "يعني الاستمرار في استخدام المنصة بعد التحديثات أنك تقبل التغييرات.",
          ],
        },
        contact: {
          title: "11. التواصل معنا",
          content: [
            "إذا كانت لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى الاتصال بنا على:",
            "privacy@masr360.com",
            "www.masr360.com",
          ],
        },
      },
    },
  },
};

export default ar;
