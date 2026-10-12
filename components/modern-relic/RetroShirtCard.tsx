"use client";
import { useState } from "react";
import type { PrintfulProduct } from "@/lib/printful";
import { retroShirts } from "@/data/deadsignal/retro-products";

export function RetroShirtCard({ product }: { product: PrintfulProduct }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? 0);
  const variant = product.variants.find(v => v.id === variantId);
  const design = retroShirts.find(d => d.externalId === product.externalId);
  return <article className="card">
    <p className="eyebrow">{design?.collection ?? "Modern Relic"}</p>
    {product.image && <img src={product.image} alt={`Front design artwork for ${design?.title ?? product.name}`} width="1086" height="1448" loading="lazy" style={{ width: "100%", height: "auto", objectFit: "contain" }} />}
    <h2>{design?.title ?? product.name}</h2>
    <p>{design?.description}</p>
    <p>Bella + Canvas 3001 · Black · Front print · Modern Relic inside label</p>
    {product.variants.length > 0 ? <>
      <label htmlFor={`size-${product.id}`}>Size</label>{" "}
      <select id={`size-${product.id}`} value={variantId} onChange={e => setVariantId(Number(e.target.value))} style={{ padding: "0.55rem", background: "#181512", color: "#e8e1d4", border: "1px solid #b08d57", borderRadius: "3px" }}>
        {product.variants.map(v => <option value={v.id} key={v.id}>{v.size}</option>)}
      </select>
      <p className="shop-feature-price">{variant ? new Intl.NumberFormat("en-US", {style:"currency",currency:"USD"}).format(variant.priceCents / 100) : ""}</p>
      <p>Plus destination shipping and applicable tax. Final total confirmed before payment.</p>
    </> : <p>Sizes are being prepared.</p>}
    <p><strong>Checkout coming soon.</strong></p>
  </article>;
}
