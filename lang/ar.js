const ar = {
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
    chooseAddress: "اختر عنوانك",
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
  head: {
    searchIn: "بحث في",
    filterGov: "فلترة حسب المحافظة:",
    filterCat: "فلترة حسب القسم:",
    filterSubCat: "فلترة حسب القسم الفرعي:",
    noResults: "لا توجد نتائج مطابقة",
    create: "إضافة",
  },
  dashboard: {
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
  },
};

export default ar;
