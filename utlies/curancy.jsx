const CURRENCY_FORMATTER = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
});

export const formatCurrency = (number) => {
  return CURRENCY_FORMATTER.format(number);
};

export default formatCurrency;
