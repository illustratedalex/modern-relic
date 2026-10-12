// Explicit, one-time setup job. Not part of the normal build command.
import { writeFile, mkdir } from 'node:fs/promises';
const STORE_ID = 18894996;
const ART_COMMIT = '7189bbbacc34688bd6ad7b0a491565193f414395';
const designs = [
  { slug: 'raised-on-static', title: 'Raised on Static — Modern Relic Tee' },
  { slug: 'original-parts', title: 'Original Parts. Mostly. — Modern Relic Tee' },
  { slug: 'little-rust', title: 'A Little Rust. A Lot of Stories. — Modern Relic Tee' },
];
const token = process.env.PRINTFUL_ACCESS_TOKEN?.trim();
if (process.env.VERCEL_ENV !== 'preview' || !token) throw new Error('Setup requires the Modern Relic Preview environment');
class ApiFailure extends Error { constructor(path, status) { super(`Printful ${path} returned HTTP ${status}`); } }
async function api(path, body) {
  const res = await fetch(`https://api.printful.com${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'X-PF-Store-Id': String(STORE_ID), 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    redirect: 'error', signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new ApiFailure(path, res.status);
  return await res.json();
}
const report = { storeId: STORE_ID, products: [], fulfillmentEnabled: false };
try {
  const stores = (await api('/v2/stores')).data;
  const store = stores?.find(s => s.id === STORE_ID && s.name === 'Modern Relic');
  if (!store) throw new Error('Expected Modern Relic store not found');
  const catalog = (await api('/products')).result;
  const matches = catalog.filter(p => p.brand === 'Bella + Canvas' && p.model === '3001');
  if (matches.length !== 1) throw new Error('Bella + Canvas 3001 catalog match is not unique');
  const product = (await api(`/products/${matches[0].id}`)).result;
  const sizes = ['S','M','L','XL','2XL','3XL'];
  const variants = sizes.map(size => product.variants.find(v => v.color === 'Black' && v.size === size && Number(v.price) > 0)).filter(Boolean);
  if (variants.length < 4) throw new Error('Insufficient verified Black S/M/L/XL variants');
  const printInfo = (await api(`/mockup-generator/printfiles/${matches[0].id}`)).result;
  const existing = (await api('/store/products?limit=100')).result;
  for (const design of designs) {
    const externalId = `mr-${design.slug}-tee-v1`;
    let syncProduct = existing.find(p => p.external_id === externalId);
    if (!syncProduct) {
      const artwork = `https://raw.githubusercontent.com/illustratedalex/modern-relic/${ART_COMMIT}/public/images/modern-relic/products/${design.slug}.png`;
      const syncVariants = variants.map(v => {
        const mapping = printInfo.variant_printfiles.find(p => p.variant_id === v.id);
        const file = printInfo.printfiles.find(f => f.printfile_id === mapping?.placements?.front);
        if (!file || file.width <= 0 || file.height <= 0 || file.dpi < 150) throw new Error('Front print template not verified');
        const width = Math.min(Math.round(7 * file.dpi), 1086);
        const height = Math.round(width * 1448 / 1086);
        const top = Math.round(file.dpi);
        if (height + top > file.height || width > file.width) throw new Error('Artwork does not fit verified template');
        // Product-only price estimate. Actual shipping and applicable tax are quoted separately at checkout.
        // Fee defaults are standard US domestic-card rates; checkout must use the actual configured fee schedule.
        const price = (Math.ceil((Math.round(Number(v.price) * 100) + 350 + 30) / (1 - 0.029)) / 100).toFixed(2);
        return {
          external_id: `${externalId}-${v.size}`, variant_id: v.id, retail_price: price,
          sku: `MR-${design.slug.toUpperCase()}-BLACK-${v.size}`, is_ignored: false,
          files: [{ type: 'front', url: artwork, filename: `${design.slug}.png`, position: {
            area_width: file.width, area_height: file.height, width, height, top,
            left: Math.round((file.width - width) / 2), limit_to_print_area: true,
          } }],
        };
      });
      syncProduct = (await api('/store/products', {
        sync_product: { external_id: externalId, name: design.title, thumbnail: artwork, is_ignored: false },
        sync_variants: syncVariants,
      })).result;
    }
    const detail = (await api(`/store/products/${syncProduct.id}`)).result;
    report.products.push({ name: detail.sync_product.name, id: detail.sync_product.id,
      variants: detail.sync_variants.map(v => ({ id: v.id, catalogVariantId: v.variant_id, price: v.retail_price, currency: v.currency, synced: v.synced })),
    });
    console.log(`Verified product: ${design.title}; variants: ${detail.sync_variants.length}`);
  }
} catch (error) {
  report.error = error instanceof ApiFailure ? error.message : 'Setup stopped: store, catalog, or template verification failed';
  console.log(report.error);
}
await mkdir('public', { recursive: true });
await writeFile('public/modern-relic-shirt-setup.json', JSON.stringify(report));
console.log(`Modern Relic setup finished with ${report.products.length} verified products; no orders created.`);
