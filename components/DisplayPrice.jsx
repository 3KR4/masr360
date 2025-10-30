export default function DisplayPrice({ price, sale, stock }) {
  // Check if the product is on sale
  const isOnSale = sale && sale > 0;
  const discountedPrice = isOnSale
    ? (price - price * (sale / 100)).toFixed(2)
    : price.toFixed(2);

  return (
    <div className="price-holder">
      {/* 🧾 Out of Stock */}
      {stock <= 0 ? (
        <p className="out-of-stock">
          Last price: <span>${price.toFixed(2)}</span> —{" "}
          <span className="status">Out of stock</span>
        </p>
      ) : isOnSale ? (
        // 💰 On Sale
        <p className="on-sale">
          <span className="new-price">${discountedPrice}</span>
          <span className="old-price">${price.toFixed(2)}</span>
          <span className="discount">-{sale}% OFF</span>
        </p>
      ) : (
        // 💵 Regular price
        <p className="regular-price">${price.toFixed(2)}</p>
      )}
    </div>
  );
}
