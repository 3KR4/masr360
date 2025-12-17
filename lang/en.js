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
