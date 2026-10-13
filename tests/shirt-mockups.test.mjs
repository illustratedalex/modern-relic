import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { retroShirts } from '../data/deadsignal/retro-products.ts';
import { FRONT_POSITION } from '../lib/checkout/print-item.ts';

const manifest = JSON.parse(readFileSync('data/deadsignal/shirt-mockups.json', 'utf8'));
test('all three exact shirt designs have permanent garment and model mockups', () => {
  assert.equal(manifest.length, 3);
  for (const design of retroShirts) {
    const record = manifest.find(entry => entry.externalId === design.externalId);
    assert.ok(record);
    assert.equal(record.slug, design.slug);
    assert.equal(record.catalogProductId, 71);
    assert.equal(record.catalogVariantId, 4016);
    assert.equal(record.color, 'Black');
    assert.deepEqual(record.position, FRONT_POSITION);
    assert.match(record.artwork, new RegExp(`/${design.slug}\\.png$`));
    assert.equal(record.images.length, 2);
    for (const image of record.images) {
      const bytes = readFileSync(`public${image.path}`);
      assert.ok(bytes.length > 100000);
      assert.equal(bytes[0], 0xff); assert.equal(bytes[1], 0xd8);
      assert.ok(image.view === 'shirt' || image.view === 'model');
    }
  }
});
test('gallery has labelled, keyboard-operable independent view controls', () => {
  const component = readFileSync('components/modern-relic/RetroShirtCard.tsx', 'utf8');
  assert.match(component, /aria-pressed=\{imageView === view\}/);
  assert.match(component, /type="button"/);
  assert.match(component, /aria-controls=/);
  assert.match(component, /setImageView\(view\)/);
  assert.match(component, /useState<"shirt" \| "model">\("shirt"\)/);
  assert.doesNotMatch(component, /src=\{product.image\}/);
  assert.match(component, /onChange=\{e => setVariantId\(Number\(e.target.value\)\)\}/);
  assert.match(component, /href=\{`\/shop\/checkout\?variant=\$\{variant.id\}`\}/);
});
