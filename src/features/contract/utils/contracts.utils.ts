export function formatCurrency(amount: number, currency: "PEN" | "USD" = "PEN"): string {
  const currencyConfig = {
    PEN: { symbol: "S/", locale: "es-PE" },
    USD: { symbol: "$", locale: "en-US" }
  };
  
  const config = currencyConfig[currency];
  return `${config.symbol} ${amount.toLocaleString(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}