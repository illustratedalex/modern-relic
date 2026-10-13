import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import Stripe from 'stripe';
const temp=mkdtempSync(join(process.cwd(),'tests','webhook-compiled-'));
after(()=>rmSync(temp,{recursive:true,force:true}));
for(const path of ['pricing','printful','checkout/print-item','checkout/quote','checkout/fulfillment']){
 let output=ts.transpileModule(readFileSync(`lib/${path}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 output=output.replace(/from "(\.\.?\/[^".]+)"/g,'from "$1.mjs"');mkdirSync(join(temp,path,'..'),{recursive:true});writeFileSync(join(temp,`${path}.mjs`),output);
}
const source=readFileSync('app/api/stripe/test-webhook/route.ts','utf8');
let output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
output=output.replace('from "@/lib/checkout/fulfillment"','from "./checkout/fulfillment.mjs"').replace('from "next/server"','from "next/server.js"');
writeFileSync(join(temp,'receiver.mjs'),output);
const {POST}=await import(pathToFileURL(join(temp,'receiver.mjs')));
const webhookSecret='whsec_unit_test_only';
const prior=process.env.STRIPE_TEST_WEBHOOK_SECRET;process.env.STRIPE_TEST_WEBHOOK_SECRET=webhookSecret;
after(()=>{if(prior===undefined)delete process.env.STRIPE_TEST_WEBHOOK_SECRET;else process.env.STRIPE_TEST_WEBHOOK_SECRET=prior;});
let fetched=0;const originalFetch=global.fetch;global.fetch=async()=>{fetched++;throw new Error('Unexpected supplier call');};after(()=>global.fetch=originalFetch);
const session={id:'cs_test_only',livemode:false,payment_status:'unpaid',status:'complete',currency:'usd',amount_total:2300,metadata:{brand:'modern-relic',sandbox:'true'}};
function request(object,valid=true){const payload=JSON.stringify({id:'evt_test_only',type:'checkout.session.completed',livemode:false,data:{object}});return new Request('https://example.com/api/stripe/test-webhook',{method:'POST',body:payload,headers:{'stripe-signature':valid?Stripe.webhooks.generateTestHeaderString({payload,secret:webhookSecret}):'t=1,v1=invalid'}});}
test('unsigned or altered webhooks never reach supplier even on public receiver',async()=>{
 assert.equal((await POST(request(session,false))).status,400);assert.equal(fetched,0);
 const payload=JSON.stringify({id:'evt_test',type:'checkout.session.completed',livemode:false,data:{object:session}});
 const signature=Stripe.webhooks.generateTestHeaderString({payload,secret:webhookSecret});
 assert.equal((await POST(new Request('https://example.com',{method:'POST',headers:{'stripe-signature':signature},body:payload+' '}))).status,400);assert.equal(fetched,0);
});
test('valid signed unpaid or live sessions do not create drafts',async()=>{
 assert.equal((await POST(request(session))).status,200);
 assert.equal((await POST(request({...session,payment_status:'paid',livemode:true}))).status,200);assert.equal(fetched,0);
});
