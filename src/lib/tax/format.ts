const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currency.format(Math.round(value));
}

export function formatCurrencyCents(value: number): string {
  return currencyCents.format(value);
}

export function formatPercent(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/** 0.0495 → "4.95%" (불필요한 0 을 붙이지 않는다) */
export function formatRate(value: number): string {
  const pct = value * 100;
  const trimmed = Number(pct.toFixed(4)).toString();
  return `${trimmed}%`;
}
