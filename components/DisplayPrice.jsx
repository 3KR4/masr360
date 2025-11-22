export default function DisplayPrice({ price, sale, stock, qty = 1 }) {
  // Ensure qty is at least 1
  const quantity = Math.max(1, qty);

  // Is on sale?
  const isOnSale = sale && sale > 0;

  // Normal price * qty
  const totalOriginal = (price * quantity).toFixed(2);

  // Discounted price * qty
  const discountedUnit = isOnSale ? price - price * (sale / 100) : price;

  const totalDiscounted = (discountedUnit * quantity).toFixed(2);

  return (
    <div className="price-holder">
      {/* Out of Stock */}
      {stock <= 0 ? (
        <p className="out-of-stock">
          Last price: <span>${totalOriginal}</span> —{" "}
          <span className="status">Out of stock</span>
        </p>
      ) : isOnSale ? (
        // On Sale
        <p className="on-sale">
          <span className="new-price">${totalDiscounted}</span>
          <span className="old-price">${totalOriginal}</span>
          <span className="discount">-{sale}% OFF</span>
        </p>
      ) : (
        // Normal Price
        <p className="regular-price">${totalOriginal}</p>
      )}
    </div>
  );
}
