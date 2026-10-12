export const MODERN_RELIC_PROFIT_CENTS = 350;

// Shipping and supplier tax must come from the current destination-specific quote.
// Processor rates must come from the payment method actually used at checkout.
export function calculateOrderTotal(input: {
  productCostCents: number;
  shippingCostCents: number;
  supplierTaxCents: number;
  salesTaxCents: number;
  quantity: number;
  processorBasisPoints: number;
  processorFixedCents: number;
}) {
  const values = Object.values(input);
  if (values.some(value => !Number.isSafeInteger(value) || value < 0)
    || input.quantity < 1 || input.processorBasisPoints >= 10000) throw new Error("Invalid pricing inputs");
  const profitCents = input.quantity * MODERN_RELIC_PROFIT_CENTS;
  const costs = input.productCostCents + input.shippingCostCents + input.supplierTaxCents;
  const totalCents = Math.ceil((costs + profitCents + input.salesTaxCents + input.processorFixedCents)
    * 10000 / (10000 - input.processorBasisPoints));
  return { totalCents, profitCents, shippingCostCents: input.shippingCostCents, salesTaxCents: input.salesTaxCents };
}
