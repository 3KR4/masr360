const extractImages = (imgs) => {
  if (!imgs || !Array.isArray(imgs)) return [];
  return imgs.map((img) => {
    if (typeof img === "string") return img;
    if (img?.url) return img.url;
    return null;
  }).filter(Boolean);
};

export const normalizeProduct = (p) => ({
  id: p._id,
  name: p.name,
  images: extractImages(p.imgs),
  price: p.price,
  sale: p.discount,
  category: p.category?._id || p.category,
  categoryName: p.category?.name,
  rate: p.avgRating,
  reviewsCount: p.reviewsCount,
  priceAfterDiscount: p.priceAfterDiscount,
  description: p.desc,
  stock: p.quantity,
  specifications: p.specifications
    ? typeof p.specifications === "object" && !Array.isArray(p.specifications)
      ? Object.entries(p.specifications).map(([key, value]) => ({ key, value }))
      : p.specifications
    : [],
  tags: p.tags,
  translations: p.translations,
  createdAt: p.createdAt,
  cartItem: p.cartItem || null,
});

export const normalizeCartItem = (item) => {
  const p = item.product;
  return {
    id: p._id,
    name: p.name,
    desc: p.desc,
    images: extractImages(p.imgs),
    price: p.price,
    discount: p.discount,
    sale: p.discount,
    quantity: item.cartQuantity,
    cartQuantity: item.cartQuantity,
    stock: p.quantity,
    category: p.category,
    categoryName: p.category?.name || "",
    specifications: p.specifications,
    translations: p.translations,
    tags: p.tags,
    avgRating: p.avgRating,
    reviewsCount: p.reviewsCount,
    createdAt: p.createdAt,
  };
};

export const normalizeReview = (r) => ({
  id: r._id,
  rate: r.rate,
  title: r.title,
  text: r.desc,
  date: r.createdAt,
  fullName: r.user?.username || "Anonymous",
  userId: r.user?._id || r.user,
});

export const normalizeTicket = (ticket) => {
  if (!ticket || !ticket.type || ticket.type === "free") {
    return { type: "free", prices: {} };
  }
  const pricing = ticket.pricing || ticket.prices || {};
  const type = ticket.type;
  const prices = {};

  if (type === "static") {
    prices.staticPrice = pricing.staticPrice ?? pricing.static ?? 0;
  } else if (type === "pricePerAge") {
    const p = pricing.pricePerAge || pricing;
    prices.pricePerAge = {
      children: p.children ?? 0,
      adults: p.adults ?? 0,
      seniors: p.seniors ?? 0,
    };
  } else if (type === "pricePerRegion") {
    const p = pricing.pricePerRegion || pricing;
    prices.pricePerRegion = {
      egyptian: p.egyptian ?? 0,
      foreign: p.foreign ?? 0,
    };
  } else if (type === "ageAndRegion") {
    const a = pricing.ageAndRegion || pricing;
    const pair = (g) => ({
      egyptian: g?.egyptian ?? 0,
      foreign: g?.foreign ?? 0,
    });
    prices.ageAndRegion = {
      students: pair(a.students),
      adults: pair(a.adults),
      seniors: pair(a.seniors),
    };
  }

  return { type, prices };
};

export const normalizePlace = (p) => {
  const gov = p.governorate && typeof p.governorate === "object" ? p.governorate : null;
  const governorateId =
    gov?._id || gov?.id || (typeof p.governorate === "string" ? p.governorate : "") || "";
  const governorateName =
    gov?.translations?.EN?.name || gov?.name || p.governorateName || "";
  const locationIframe =
    p.locationIframe || p.location?.iFrame || "";

  return {
    id: p._id,
    _id: p._id,
    name: p.name,
    images: extractImages(p.imgs),
    description: p.desc,
    location: {
      link: p.location,
      iFrame: locationIframe,
    },
    category: p.category,
    categoryName: p.category?.name,
    subCategory: p.subCategory,
    subCategoryName: p.subCategory?.name,
    governorate: gov || governorateId,
    governorateId,
    governorateName,
    translations: p.translations,
    tickets: p.ticket ? normalizeTicket(p.ticket) : null,
    createdAt: p.createdAt,
    // raw passthrough (dashboard form/table compatibility)
    imgs: p.imgs,
    desc: p.desc,
    locationIframe,
  };
};

export const normalizeNight = (n) => {
  const gov = n.governorate && typeof n.governorate === "object" ? n.governorate : null;
  const governorateId =
    gov?._id || gov?.id || (typeof n.governorate === "string" ? n.governorate : "") || "";
  const governorateName =
    gov?.translations?.EN?.name || gov?.name || n.governorateName || "";
  const locationIframe =
    n.locationIframe || n.location?.iFrame || "";

  return {
    id: n._id,
    _id: n._id,
    name: n.name,
    images: extractImages(n.imgs),
    description: n.desc,
    rate: n.avgRating ?? n.rate ?? 0,
    reviewsCount: n.reviewsCount ?? 0,
    location: {
      link: n.location,
      iFrame: locationIframe,
    },
    category: n.category,
    categoryName: n.category?.name,
    subCategory: n.subCategory,
    subCategoryName: n.subCategory?.name,
    governorate: gov || governorateId,
    governorateId,
    governorateName,
    translations: n.translations,
    createdAt: n.createdAt,
    // raw passthrough (dashboard form/table compatibility)
    imgs: n.imgs,
    desc: n.desc,
    locationIframe,
  };
};

export const computeReviewsOverview = (reviews) => {
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return { finalRate: 0, totalReviews: 0, rates: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }
  const finalRate = reviews.reduce((s, r) => s + r.rate, 0) / totalReviews;
  const rates = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const rounded = Math.round(r.rate);
    if (rates[rounded] !== undefined) rates[rounded]++;
  });
  return { finalRate: Math.round(finalRate * 10) / 10, totalReviews, rates };
};
