// One-off asset preparation. Never runs as part of the normal site build.
// Uses existing Printful access only; does not edit products, variants, orders, or settings.
import { mkdir, writeFile } from 'node:fs/promises';
import { FRONT_POSITION } from '../lib/checkout/print-item.ts';

const expected = new Map([
  ['mr-little-rust-tee-v1', 'little-rust'],
  ['mr-original-parts-tee-v1', 'original-parts'],
  ['mr-raised-on-static-tee-v1', 'raised-on-static'],
]);
const token = process.env.PRINTFUL_ACCESS_TOKEN?.trim();
if (!token) throw new Error('Existing Printful access is unavailable');
let storeId;
async function api(path, data) {
  const response = await fetch(`https://api.printful.com${path}`, {
    method: data ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, ...(storeId ? { 'X-PF-Store-Id': String(storeId) } : {}), ...(data ? { 'Content-Type': 'application/json' } : {}) },
    ...(data ? { body: JSON.stringify(data) } : {}),
    redirect: 'error', signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`Printful ${path.split('?')[0]} returned ${response.status}`);
  const body = await response.json();
  return body.result ?? body.data;
}
const stores = await api('/v2/stores');
const matches = stores.filter(s => s.name.trim().toLowerCase() === 'modern relic');
if (matches.length !== 1) throw new Error('Modern Relic store is not unique');
storeId = matches[0].id;
const products = (await api('/store/products?limit=100')).filter(p => expected.has(p.external_id));
if (products.length !== 3) throw new Error('Expected three Modern Relic shirts');
const printfiles = await api('/mockup-generator/printfiles/71?technique=DTG');
console.log('MOCKUP_CATALOG ' + JSON.stringify(printfiles));
const details = [];
for (const product of products) {
  const detail = await api(`/store/products/${product.id}`);
  const variant = detail.sync_variants.find(v => v.synced && v.product?.product_id === 71 && v.color === 'Black');
  if (!variant) throw new Error(`Expected black Bella+Canvas 3001: ${product.external_id}`);
  const front = variant.files.find(f => ['front', 'default'].includes(f.type) && f.status === 'ok');
  if (!front || !front.url || front.width < FRONT_POSITION.width || front.height < FRONT_POSITION.height) throw new Error('Original artwork is unavailable');
  details.push({ slug: expected.get(product.external_id), externalId: product.external_id, syncProductId: product.id, catalogVariantId: variant.variant_id, name: variant.name, color: variant.color, front: { id: front.id, url: front.url, width: front.width, height: front.height }, position: FRONT_POSITION });
}
console.log('MOCKUP_PRODUCTS ' + JSON.stringify(details));
if (process.argv.includes('--generate')) throw new Error('Choose verified mockup groups before generation');
