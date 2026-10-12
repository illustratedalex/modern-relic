import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderTotal } from '../lib/pricing.ts';
for (const shippingCostCents of [0,499,799,1999]) {
  test(`preserves margin after shipping ${shippingCostCents} and transaction fees`, () => {
    const q = calculateOrderTotal({productCostCents:1192, shippingCostCents, supplierTaxCents:65, salesTaxCents:100, quantity:1, processorBasisPoints:290, processorFixedCents:30});
    const net = q.totalCents * .971 - 30 - 1192 - shippingCostCents - 65 - 100;
    assert.ok(net >= 350 && net < 351);
  });
}
test('charges the fixed processing fee once for a multiple-item order', () => {
  const q = calculateOrderTotal({productCostCents:2384,shippingCostCents:650,supplierTaxCents:0,salesTaxCents:0,quantity:2,processorBasisPoints:290,processorFixedCents:30});
  assert.equal(q.profitCents,700);
  assert.ok(q.totalCents * .971 - 30 - 2384 - 650 >= 700);
});
test('rejects invalid or fractional cost inputs', () => {
  assert.throws(()=>calculateOrderTotal({productCostCents:-1,shippingCostCents:0,supplierTaxCents:0,salesTaxCents:0,quantity:1,processorBasisPoints:290,processorFixedCents:30}));
});
