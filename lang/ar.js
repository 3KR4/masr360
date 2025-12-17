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
