export const LICENSE_FEE = 70;
export const products = [
  { id: 'ziggo-tv-2', provider: 'ziggo', name: 'Internet + TV', duration: '2 jaar', rate: 70 },
  { id: 'ziggo-internet-2', provider: 'ziggo', name: 'Alleen internet', duration: '2 jaar', rate: 70 },
  { id: 'ziggo-tv-1', provider: 'ziggo', name: 'Internet + TV', duration: '1 jaar', rate: 35 },
  { id: 'ziggo-internet-1', provider: 'ziggo', name: 'Alleen internet', duration: '1 jaar', rate: 35 },
  { id: 'vodafone-unlimited', provider: 'vodafone', name: 'Unlimited', duration: 'Alle looptijden', rate: 30 },
  { id: 'vodafone-other', provider: 'vodafone', name: 'Overige abonnementen', duration: 'Alle looptijden', rate: 10 },
];

export function validCount(value) {
  const number = Number(value);
  return value !== '' && Number.isSafeInteger(number) && number >= 0 && number <= 1000000;
}

export function calculate(counts) {
  const totals = { sales: 0, gross: 0, ziggo: 0, vodafone: 0, license: LICENSE_FEE };
  for (const product of products) {
    const count = counts[product.id] ?? 0;
    if (!validCount(count)) throw new RangeError('Vul een heel aantal in tussen 0 en 1.000.000.');
    const amount = Number(count) * product.rate;
    totals.sales += Number(count);
    totals.gross += amount;
    totals[product.provider] += amount;
  }
  totals.payout = totals.gross - LICENSE_FEE;
  return totals;
}
