"use client";
import { useState } from "react";
import type { FormEvent } from "react";
type Variant = { id:number; name:string };
type Quote = { name:string;quantity:number;totalCents:number;shippingCents:number;currency:string };
const states = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");
const money = (c:number) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(c/100);
export function CheckoutForm({variants,initialVariant,live=false}:{variants:Variant[];initialVariant:number;live?:boolean}) {
  const [variantId,setVariantId]=useState(initialVariant);
  const [quantity,setQuantity]=useState(1);
  const [recipient,setRecipient]=useState({name:"",address1:"",address2:"",city:"",state_code:"NH",country_code:"US",zip:""});
  const [quote,setQuote]=useState<Quote|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [attemptId,setAttemptId]=useState<string|null>(null);
  const reset=()=>{setQuote(null);setError("");setAttemptId(null);};
  const input={variantId,quantity,recipient};
  async function calculate(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setError("");setQuote(null);setAttemptId(null);
    try{const response=await fetch(live?"/api/shop/live-quote":"/api/shop/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});
      const body=await response.json();if(!response.ok)throw new Error(body.error);setQuote(body);
    }catch(e){setError(e instanceof Error?e.message:"Unable to calculate shipping.");}finally{setBusy(false);}
  }
  async function pay(){
    if(!quote)return;setBusy(true);setError("");const attempt=attemptId??crypto.randomUUID();setAttemptId(attempt);
    try{const response=await fetch(live?"/api/shop/live-checkout":"/api/shop/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...input,approvedTotalCents:quote.totalCents,attemptId:attempt})});
      const body=await response.json();if(response.status===409){setQuote(body.quote);setAttemptId(null);throw new Error(body.error);}
      if(!response.ok)throw new Error(body.error);window.location.assign(body.url);
    }catch(e){setError(e instanceof Error?e.message:"Unable to start checkout.");setBusy(false);}
  }
  return <form onSubmit={calculate} className="checkout-form card">
    {!live&&<p><strong>Test checkout — no real charge or shipment.</strong></p>}
    <fieldset disabled={busy}>
      <label htmlFor="order-variant">Product and size</label>
      <select id="order-variant" value={variantId} onChange={e=>{setVariantId(Number(e.target.value));reset();}}>{variants.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select>
      <label htmlFor="order-quantity">Quantity</label>
      <input id="order-quantity" type="number" min="1" max="10" required value={quantity} onChange={e=>{setQuantity(Number(e.target.value));reset();}} />
      <h2>Shipping address</h2>
      {([['name','Full name','name'],['address1','Street address','address-line1'],['address2','Apartment or suite (optional)','address-line2'],['city','City','address-level2'],['zip','ZIP code','postal-code']] as const).map(([key,label,auto])=><div key={key}>
        <label htmlFor={`shipping-${key}`}>{label}</label><input id={`shipping-${key}`} autoComplete={auto} value={recipient[key]} required={key!=="address2"} maxLength={100} onChange={e=>{setRecipient({...recipient,[key]:e.target.value});reset();}} />
      </div>)}
      <label htmlFor="shipping-state">State</label><select id="shipping-state" value={recipient.state_code} onChange={e=>{setRecipient({...recipient,state_code:e.target.value});reset();}}>{states.map(s=><option key={s}>{s}</option>)}</select>
      <p>United States shipping.</p>
      <button type="submit" className="btn primary">{busy?"Working…":"Calculate shipping and total"}</button>
    </fieldset>
    {error&&<p role="alert">{error}</p>}
    {quote&&<section aria-live="polite">
      <h2>Review your order</h2><p>{quote.quantity} × {quote.name}</p>
      <p>Ship to: {recipient.name}, {recipient.address1}{recipient.address2?`, ${recipient.address2}`:""}, {recipient.city}, {recipient.state_code} {recipient.zip}</p>
      <p>Destination shipping included: {money(quote.shippingCents)}</p>
      <p className="shop-feature-price">{live?"Total":"Test total"}: {money(quote.totalCents)}</p>
      {!live&&<p>This is a test payment only.</p>}
      <button className="btn primary" type="button" disabled={busy} onClick={pay}>{busy?"Opening checkout…":live?"Continue to payment":"Continue to test payment"}</button>
    </section>}
  </form>;
}
