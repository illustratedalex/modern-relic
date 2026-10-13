import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const temp=mkdtempSync(join(process.cwd(),'tests','checkout-compiled-'));
after(()=>rmSync(temp,{recursive:true,force:true}));
for(const path of ['pricing','printful','checkout/quote','checkout/fulfillment','checkout/sandbox']){
  const source=readFileSync(`lib/${path}.ts`,'utf8');
  let output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  output=output.replace(/from "(\.\.?\/[^".]+)"/g,'from "$1.mjs"');
  mkdirSync(join(temp,path,'..'),{recursive:true});writeFileSync(join(temp,`${path}.mjs`),output);
}
const {paidOrderInput,draftExternalId}=await import(pathToFileURL(join(temp,'checkout/fulfillment.mjs')));
const {moneyCents,quoteInputSchema}=await import(pathToFileURL(join(temp,'checkout/quote.mjs')));
const {sandboxStripe,sameCheckoutOrigin}=await import(pathToFileURL(join(temp,'checkout/sandbox.mjs')));
const session={id:'cs_test_example',livemode:false,payment_status:'paid',status:'complete',currency:'usd',amount_total:2300,
metadata:{brand:'modern-relic',sandbox:'true',expected_total:'2300',variant_id:'5568793340',quantity:'1',recipient_name:'Test Buyer',address1:'18 Opera House Square',address2:'',city:'Claremont',state:'NH',country:'US',zip:'03743'}};
test('accepts verified paid sandbox order with bound recipient and exact total',()=>assert.equal(paidOrderInput(session).variantId,5568793340));
test('rejects unpaid, live, incomplete, wrong-brand or mismatched-total sessions',()=>{
 for(const override of [{payment_status:'unpaid'},{livemode:true},{status:'open'},{currency:'eur'},{amount_total:2299},{metadata:{...session.metadata,brand:'needlebook'}}])assert.throws(()=>paidOrderInput({...session,...override}));
});
test('rejects unknown variants and invalid or excessive quantities',()=>{
 for(const override of [{variant_id:'12345'},{quantity:'0'},{quantity:'11'},{quantity:'1.5'}])assert.throws(()=>paidOrderInput({...session,metadata:{...session.metadata,...override}}));
});
test('stable unique draft identifier fits supplier limit for webhook retries',()=>{
 assert.equal(draftExternalId(session.id),draftExternalId(session.id));assert.notEqual(draftExternalId(session.id),draftExternalId('cs_test_other'));assert.equal(draftExternalId(session.id).length,32);
});
test('supplier amounts reject invalid, negative and fractional cent values',()=>{
 assert.equal(moneyCents('0.99'),99);assert.equal(moneyCents(11.92),1192);
 for(const value of [null,undefined,'NaN',-1,'1.001'])assert.throws(()=>moneyCents(value));
});
test('customer input cannot inject prices or supplier files',()=>{
 const input={variantId:5568793340,quantity:1,recipient:{name:'Test Buyer',address1:'18 Opera House Square',city:'Claremont',state_code:'NH',country_code:'US',zip:'03743'}};
 assert.equal(quoteInputSchema.safeParse(input).success,true);
 assert.equal(quoteInputSchema.safeParse({...input,totalCents:1}).success,false);
 assert.equal(quoteInputSchema.safeParse({...input,files:[{url:'https://example.com'}]}).success,false);
});
test('production and live keys cannot initialize sandbox payment client',()=>{
 const priorEnv=process.env.VERCEL_ENV,priorKey=process.env.STRIPE_SECRET_KEY;
 process.env.VERCEL_ENV='production';process.env.STRIPE_SECRET_KEY='sk_test_fake';assert.throws(sandboxStripe);
 process.env.VERCEL_ENV='preview';process.env.STRIPE_SECRET_KEY='sk_live_fake';assert.throws(sandboxStripe);
 if(priorEnv===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=priorEnv;
 if(priorKey===undefined)delete process.env.STRIPE_SECRET_KEY;else process.env.STRIPE_SECRET_KEY=priorKey;
});
test('checkout creation rejects requests from another website',()=>{
 assert.equal(sameCheckoutOrigin(new Request('https://example.com',{headers:{origin:'https://attacker.example'}})),false);
 assert.equal(sameCheckoutOrigin(new Request('https://example.com',{headers:{origin:'https://modern-relic-checkout-southernvt.vercel.app'}})),true);
});
