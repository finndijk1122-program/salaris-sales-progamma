import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, products, validCount } from './calculator.js';

test('ook zonder sales wordt de maandelijkse licentie afgetrokken', () => {
  assert.deepEqual(calculate({}), { sales: 0, gross: 0, ziggo: 0, vodafone: 0, license: 70, payout: -70 });
});

for (const product of products) {
  test(`correct tarief voor ${product.id}`, () => {
    const result = calculate({ [product.id]: 3 });
    assert.equal(result.sales, 3);
    assert.equal(result.gross, product.rate * 3);
    assert.equal(result.payout, product.rate * 3 - 70);
  });
}

test('alle typen worden opgeteld met één licentieaftrek', () => {
  const counts = Object.fromEntries(products.map(product => [product.id, 2]));
  assert.deepEqual(calculate(counts), { sales: 12, gross: 500, ziggo: 420, vodafone: 80, license: 70, payout: 430 });
});

test('één tweejarig Ziggo-abonnement dekt de licentie', () => {
  assert.equal(calculate({ 'ziggo-tv-2': 1 }).payout, 0);
});

test('ongeldige aantallen worden geweigerd', () => {
  for (const invalid of [-1, 1.5, NaN, Infinity, 'abc', '', 1000001]) {
    assert.equal(validCount(invalid), false);
    assert.throws(() => calculate({ 'ziggo-tv-2': invalid }), RangeError);
  }
});
