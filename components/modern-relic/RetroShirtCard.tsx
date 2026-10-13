"use client";
import { useState } from "react";
import Image from "next/image";
import type { PrintfulProduct } from "@/lib/printful";
import { retroShirts } from "@/data/deadsignal/retro-products";

export function RetroShirtCard({ product, testCheckout = false, liveCheckout = false }: { product: PrintfulProduct; testCheckout?: boolean; liveCheckout?: boolean }) {
  const [imageView, setImageView] = useState<"shirt" | "model">("shirt");
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? 0);
  const variant = product.variants.find(v => v.id === variantId);
  const design = retroShirts.find(d => d.externalId === product.externalId);
  return <article className="card">
    <p className="eyebrow">{design?.collection ?? "Modern Relic"}</p>
    {design && <div className="shirt-gallery">
      <Image
        id={`shirt-image-${product.id}`}
        src={`/images/modern-relic/products/mockups/${design.slug}-${imageView === "shirt" ? 2 : 1}.jpg`}
        alt={`${design.title} on a black Bella + Canvas 3001 T-shirt${imageView === "model" ? ", worn by a model" : ", front view"}`}
        width={1600}
        height={1600}
        sizes="(max-width: 900px) 88vw, 22vw"
        className="shirt-gallery-image"
      />
      <div className="shirt-gallery-controls" role="group" aria-label={`Views of ${design.title}`}>
        {(["shirt", "model"] as const).map(view => <button
          key={view}
          type="button"
          aria-pressed={imageView === view}
          aria-controls={`shirt-image-${product.id}`}
          onClick={() => setImageView(view)}
        >
          <Image src={`/images/modern-relic/products/mockups/${design.slug}-${view === "shirt" ? 2 : 1}.jpg`} alt="" width={44} height={44} sizes="44px" />
          {view === "shirt" ? "Shirt" : "On model"}
        </button>)}
      </div>
      <p className="shirt-gallery-note">Printful mockup · Front view</p>
    </div>}
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
    {(testCheckout || liveCheckout) && variant ? <a className="btn primary" href={`/shop/checkout?variant=${variant.id}`}>{liveCheckout?"Buy now":"Test checkout"}</a> : <p><strong>Checkout coming soon.</strong></p>}
  </article>;
}
