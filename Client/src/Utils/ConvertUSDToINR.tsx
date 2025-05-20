export const transferRates = [
  { amount: "Up to 99 USD", rate: 86.89 },
  { amount: "100 USD ~ 499 USD", rate: 88.28 },
  { amount: "500 USD ~ 999 USD", rate: 90.09 },
  { amount: "1000 USD ~ 4999 USD", rate: 93.55 },
  { amount: "5000 USD ~ 9999 USD", rate: 96.13 },
  { amount: "10000 USD and more", rate: 99.27 },
];

export function calculateINR(usd: number): number {
  let rate = 84.89; // default rate for smallest tier

  if (usd >= 10000) {
    rate = 99.27;
  } else if (usd >= 5000) {
    rate = 96.13;
  } else if (usd >= 1000) {
    rate = 93.55;
  } else if (usd >= 500) {
    rate = 90.09;
  } else if (usd >= 100) {
    rate = 88.28;
  }

  return parseFloat((usd * rate).toFixed(2));
}
