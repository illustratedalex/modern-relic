import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
const temp=mkdtempSync(join(process.cwd(),'tests','live-compiled-'));
after(()=>rmSync(temp,{recursive:true,force:true}));
for(const path of ['pricing','printful','checkout/print-item','checkout/quote','checkout/live','checkout/live-fulfillment']) {
 let output=ts.transpileModule(readFileSync(`lib/${path}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 output=output.replace(/from "(\.\.?\/[^".]+)"/g,'from "$1.mjs"');
 mkdirSync(join(temp,path,'..'),{recursive:true});writeFileSync(join(temp,`${path}.mjs`),output);
}
const {livePaidInput,liveExternalId,verifyMargin,fulfillLiveOrder}=await import(pathToFileURL(join(temp,'checkout/live-fulfillment.mjs')));
const {liveCheckoutEnabled,liveOrigin}=await import(pathToFileURL(join(temp,'checkout/live.mjs')));
const {livePrintItem,FRONT_POSITION}=await import(pathToFileURL(join(temp,'checkout/print-item.mjs')));
const session={id:'cs_live_unit_only',livemode:true,payment_status:'paid',status:'complete',currency:'usd',amount_total:2231,
 metadata:{brand:'modern-relic',sandbox:'false',expected_total:'2231',variant_id:'5568793340',quantity:'1',recipient_name:'Unit Buyer',address1:'18 Opera House Square',address2:'',city:'Claremont',state:'NH',country:'US',zip:'03743',print_file_ids:'1,2'},
 payment_intent:{status:'succeeded',latest_charge:{paid:true,captured:true,refunded:false,amount_refunded:0,disputed:false,amount:2231,balance_transaction:{currency:'usd',fee:95}}}};
test('live orders reject test sessions, unpaid sessions, wrong amounts and brands',()=>{
 assert.equal(livePaidInput(session).quantity,1);
 for(const override of [{livemode:false},{payment_status:'unpaid'},{amount_total:1},{metadata:{...session.metadata,brand:'other'}},{metadata:{...session.metadata,sandbox:'true'}}]) assert.throws(()=>livePaidInput({...session,...override}));
});
test('actual fees and supplier costs must leave $2.50–$5 per item',()=>{
 assert.equal(verifyMargin(2231,95,1786,1),350);
 assert.throws(()=>verifyMargin(2231,95,1900,1));
 assert.throws(()=>verifyMargin(2231,95,1500,1));
 assert.throws(()=>verifyMargin(2231,-1,1786,1));
});
test('live identifiers are unique, stable and separate from sandbox drafts',()=>{
 assert.equal(liveExternalId(session.id).length,32);
 assert.equal(liveExternalId(session.id),liveExternalId(session.id));
 assert.notEqual(liveExternalId(session.id),liveExternalId('cs_live_other'));
 assert.ok(liveExternalId(session.id).startsWith('mr-live-'));
});
test('live release fails closed without every production gate and correct origin',()=>{
 const keys=['VERCEL_ENV','MODERN_RELIC_LIVE_CHECKOUT','MODERN_RELIC_TAX_POLICY','STRIPE_LIVE_WEBHOOK_SECRET'];
 const prior=keys.map(k=>process.env[k]);
 try {
  Object.assign(process.env,{VERCEL_ENV:'production',MODERN_RELIC_LIVE_CHECKOUT:'enabled',MODERN_RELIC_TAX_POLICY:'nh-unregistered',STRIPE_LIVE_WEBHOOK_SECRET:'whsec_unit_only'});
  assert.equal(liveCheckoutEnabled(),true);
  for(const key of keys){const value=process.env[key];delete process.env[key];assert.equal(liveCheckoutEnabled(),false);process.env[key]=value;}
  assert.equal(liveOrigin(new Request('https://example.com',{headers:{origin:'https://attacker.example'}})),false);
 }finally{keys.forEach((k,i)=>{if(prior[i]===undefined)delete process.env[k];else process.env[k]=prior[i];});}
});
const files=[{id:1,type:'default',status:'ok',width:1086,height:1448},{id:2,type:'label_inside',status:'ok',width:1254,height:1254}];
test('front art is limited to 7 inches and native garment label is retained',()=>{
 const item=livePrintItem(5568793340,1,files);
 assert.deepEqual(item.files[0].position,FRONT_POSITION);
 assert.equal(item.files[0].position.width/150,7);
 assert.equal(item.files[1].options[0].value,'native');
 assert.throws(()=>livePrintItem(5568793340,1,[{...files[0],width:500},files[1]]));
});
test('repeated paid notification reuses accepted supplier order without any mutation',async()=>{
 const priorFetch=global.fetch, priorToken=process.env.PRINTFUL_ACCESS_TOKEN;process.env.PRINTFUL_ACCESS_TOKEN='unit-only-token';
 let calls=0;
 try {
  global.fetch=async(url,options)=>{calls++;assert.equal(options.method,'GET');return new Response(JSON.stringify({result:{id:123,status:'pending'}}));};
  const stripe={checkout:{sessions:{retrieve:async()=>session}}};
  assert.deepEqual(await fulfillLiveOrder(stripe,session.id),{id:123,reused:true,status:'pending'});
  assert.equal(calls,1);
 }finally{global.fetch=priorFetch;if(priorToken===undefined)delete process.env.PRINTFUL_ACCESS_TOKEN;else process.env.PRINTFUL_ACCESS_TOKEN=priorToken;}
});
test('refunded or fee-unavailable payments never reach Printful',async()=>{
 const priorFetch=global.fetch;let calls=0;global.fetch=async()=>{calls++;throw new Error('Unexpected call');};
 try {for(const override of [{amount_refunded:1},{balance_transaction:null}]){
  const s={...session,payment_intent:{status:'succeeded',latest_charge:{...session.payment_intent.latest_charge,...override}}};
  await assert.rejects(fulfillLiveOrder({checkout:{sessions:{retrieve:async()=>s}}},session.id));
 }assert.equal(calls,0);}finally{global.fetch=priorFetch;}
});
