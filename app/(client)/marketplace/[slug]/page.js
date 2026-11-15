import MarketplaceDetailsClient from "./MarketplaceDetailsClient";
import { getCachedProduct, buildSEO } from "@/utils/seo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const product = await getCachedProduct(slug);

  if (!product) {
    return buildSEO({
      title: "Egyptian Heritage Marketplace | Handmade Crafts & Souvenirs",
      description:
        "Shop authentic Egyptian handmade crafts, jewelry, home decor, and souvenirs made by talented local artisans on Masr360.",
      url: `/marketplace/${slug || ""}`,
    });
  }

  const productName =
    product?.translations?.EN?.name ||
    product?.name ||
    "Authentic Egyptian Craft";
  const productDesc =
    product?.translations?.EN?.desc ||
    product?.description ||
    product?.desc ||
    "";
  const pricePart = product?.price ? ` Price: ${product.price} EGP.` : "";

  const dynamicDescription = `Discover ${productName}, an authentic Egyptian product that celebrates local craftsmanship and heritage, available through Masr360.${pricePart}${
    productDesc ? ` ${productDesc.slice(0, 140).trim()}...` : ""
  }`;

  const image =
    product?.images?.[0] || product?.imgs?.[0] || "/brand/og-image.jpg";

  return buildSEO({
    title: `${productName} | Masr360 Marketplace`,
    description: dynamicDescription,
    image,
    url: `/marketplace/${slug}`,
    extraOpenGraph: {
      type: "website",
    },
  });
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <MarketplaceDetailsClient slug={resolvedParams?.slug} />;
}
