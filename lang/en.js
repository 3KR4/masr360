const en = {
  sideNav: {
    menuRoutes: "Menu Routes",
    overview: "Overview",
    slides: "Slides",
    users: "Users",
    governorates: "Governorates",
    places: "Places",
    nights: "Nights",
    events: "Events",
    games: "Games",
    orders: "Orders",
    products: "Products",
    support: "Support",

    darkTheme: "Dark Theme",
    logout: "Log Out",
    language: "Language",
  },
  auth: {
    login: "Log in",
    optional: "optional",
    createAccount: "Create your account",
    loginToAccount: "log into your account",
    verifyPhone: "Verify your phone number",
    verifyEmail: "Verify your email address",
    forgetPass: "Verify account ownership",
    choose_verify_method: "choose verify method",
    chooseAddress: "Choose your address",
    chooseInterests: "Choose your interests",
    emailPhoneLogin: "Email or phone number",
    accountDescription:
      "Create your account to connect with sellers or sell your own items.",
    phoneDescription: "Enter the verification code sent to your phone number.",
    emailDescription: "Enter the verification code sent to your email address.",
    addressDescription:
      "Your address helps manage your store and can be changed anytime.",
    interestsDescription:
      "Choose your interests to see relevant content instantly.",
    choose_verify_method_description:
      "Choose a method to verify account ownership",
    createAccountBtn: "Create account",
    verifyPhoneBtn: "Verify phone",
    verifyEmailBtn: "Verify email",
    forgetPassBtn: "Verify Account Ownership",
    finishAccount: "Finish account",
    next: "Next",
    skip: "Skip",
    orContinueWith: "Or continue with",
    orLoginWith: "Or login with",
    google: "Google account",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    sendCode: "send code",
    fullName: "Full name",
    phone: "Phone number",
    email: "Email address",
    emailOptional: "Email address (optional)",
    password: "Password",
    confirmPassword: "Confirm password",
    forgetPassword: "do have a problem or forget your",
    verify_by_email: "Verify via email",
    verify_by_phone: "Verify via phone number",
    makeNewPassword: "make new password",
    userVerified: "Account verified successfully",
    userVerifiedDescription:
      "You can now view your current password and update it if you wish.",
    update_pass_and_continue: "Update password and continue",
    skip_and_login: "Skip and log in",
    viewYourCurrentPassword: "Your Current Password",

    placeholders: {
      fullName: "Enter your full name",
      phone: "Enter your phone",
      email: "Enter your email",
      password: "Enter your password",
      confirmPassword: "Confirm password",
      emailPhoneLogin: "Enter your email or phone number",
      newPassword: "Enter your new password",
    },

    errors: {
      requiredEmail: "Email address is required",
      requiredPassword: "Password is required",
      requiredFullName: "Your full name is required",
      requiredPhone: "phone number is required",
      invalidEmail: "Enter a valid email address (e.g. user@example.com)",
      invalidPhone: "Enter a valid phone number",
      phoneTooShort: "Phone number is too short",
      phoneTooLong: "Phone number is too long",
      passwordWeak:
        "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character",
      passwordMismatch: "Passwords do not match",
      fullNameTwoWords: "Full name must contain at least two words",
      firstNameShort: "First name must be at least 3 characters",
      lastNameShort: "Last name must be at least 3 characters",
      emailPhoneLoginRequired: "Email or phone number is required",
      emailPhoneLoginInvalid:
        "Please enter a valid email address or phone number",
    },
  },
  head: {
    searchIn: "Search in",
    filterGov: "Filter by governorate:",
    filterCat: "Filter by category:",
    filterSubCat: "Filter by sub category:",
    noResults: "No matching results",
    create: "Create",
  },
  dashboard: {
    forms: {
      title: "Title",
      titlePlaceholder: "Enter product title",

      category: "Category",
      categoryPlaceholder: "Select category",

      stock: "Stock",
      stockPlaceholder: "Enter stock quantity",

      price: "Price",
      pricePlaceholder: "Enter product price",

      sale: "Sale (%)",
      salePlaceholder: "Enter sale percentage",

      description: "Description",
      descriptionPlaceholder: "Enter product description",

      createProduct: "Create Product",
      tags: "Tags",
      tagsPlaceholder: "Enter your tags",
      add: "Add",

      specifications: "Specifications",
      specKey: "Key",
      specValue: "Value",
      addSpecification: "Add specification",

      images: "Images",
      imagesHint: "Click or drop images here",
      clickHere: "Click here",
      dropHere: "Drop here",

      governorate: "Governorate",
      selectGovernorate: "Select governorate",
      subCategory: "Sub Category",
      selectSubCategory: "Select sub category",

      googleMapsLink: "Google Maps Link",
      googleMapsLinkPlaceholder: "https://maps.app.goo.gl/...",
      googleMapsIframe: "Google Maps Embed URL",
      googleMapsIframePlaceholder: "https://www.google.com/maps/embed?pb=...",

      createPlace: "Create place",
      governorateName: "Governorate Name",
      governorateNamePlaceholder: "Enter Governorate name",
      governorateDescriptionPlaceholder: "Enter governorate description",
      createGovernorate: "Create Governorate",

      tickets: "Tickets",
      freeEntry: "Free Entry",
      paidTickets: "Paid Tickets",
      staticPrice: "Static Price",
      staticEgFr: "For Egyptians / Foreigners",
      regionAge: "Different by Age",
      regionAgeEgFr: "Different by Age and Nationality",

      students: "Students",
      adults: "Adults",
      seniors: "Seniors",
      egyptian: "Egyptian",
      foreigner: "Foreigner",

      errors: {
        titleRequired: "Product title is required",
        titleMin: "Title must be at least 3 characters",

        stockRequired: "Stock is required",
        stockMin: "Minimum stock is 1",

        priceRequired: "Price is required",
        priceMin: "Price must be more than 0",
        imagesRequired: "You must upload at least 1 image",

        googleMapsLinkRequired: "Google Maps link is required",
        googleMapsLinkInvalid: "Please enter a valid Google Maps link",
        googleMapsIframeRequired: "Google Maps embed link is required",
        googleMapsIframeInvalid: "Please enter a valid Google Maps embed URL",

        saleMax: "Sale cannot exceed 90%",

        governorateNameRequired: "The Governorate name is required",
        governorateNameMinLength:
          "The Governorate name must be at least 3 letters",
      },
    },
  },
  actions: {
    lang: "arabic",
  },
};

export default en;
