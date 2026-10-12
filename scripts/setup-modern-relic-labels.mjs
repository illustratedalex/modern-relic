import {writeFile,mkdir} from 'node:fs/promises';
const token=process.env.PRINTFUL_ACCESS_TOKEN?.trim();if(!token)throw new Error('Missing Printful access');
const storeId=18894996;
async function api(path,method='GET',body){const r=await fetch('https://api.printful.com'+path,{method,headers:{Authorization:'Bearer '+token,'X-PF-Store-Id':String(storeId),'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,redirect:'error',signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('Printful '+r.status+' at '+path);return await r.json();}
const stores=(await api('/v2/stores')).data;
if(stores.filter(s=>s.id===storeId&&s.name==='Modern Relic').length!==1)throw new Error('Store mismatch');
const cat=(await api('/products/71')).result;
if(cat.product.brand!=='Bella + Canvas'||cat.product.model!=='3001'||cat.product.currency!=='USD')throw new Error('Catalog mismatch');
const label=cat.product.files.find(f=>f.type==='label_inside');if(Number(label?.additional_price)!==0.99)throw new Error('Label price changed');
const targets=[
{product:480846657,external:'mr-raised-on-static-tee-v1',ids:[5568793340,5568793342,5568793344,5568793347,5568793349,5568793351]},
{product:480846683,external:'mr-original-parts-tee-v1',ids:[5568793499,5568793519,5568793523,5568793527,5568793533,5568793536]},
{product:480846703,external:'mr-little-rust-tee-v1',ids:[5568793550,5568793551,5568793552,5568793554,5568793555,5568793556]}
];
const labelUrl='https://raw.githubusercontent.com/illustratedalex/modern-relic/a92f2df06da4b494a621dba4c48a419896e56efe/public/images/modern-relic/branding/modern-relic-neck-label-v1.png';
const rows=[];const originalPrices={4016:16.19,4017:16.19,4018:16.19,4019:16.19,4020:18.25,5295:20.31};
for(const t of targets){const p=(await api('/store/products/'+t.product)).result;
if(p.sync_product.external_id!==t.external||p.sync_variants.length!==6)throw new Error('Product mismatch');
for(const v of p.sync_variants){
const c=cat.variants.find(x=>x.id===v.variant_id);
if(!t.ids.includes(v.id)||!c||c.color!=='Black'||v.currency!=='USD'||!v.synced||v.is_ignored)throw new Error('Variant mismatch');
const front=v.files.find(f=>['default','front'].includes(f.type));
if(!front||front.status!=='ok')throw new Error('Missing valid front');
const existing=v.files.filter(f=>f.type==='label_inside');
if(existing.some(f=>f.url!==labelUrl))throw new Error('Different label already present');
const cents=Math.ceil((Math.round(Number(c.price)*100)+99+350+30)*10000/9710);
const price=(cents/100).toFixed(2);
if(![originalPrices[v.variant_id].toFixed(2),price].includes(v.retail_price))throw new Error('Unexpected existing price');
rows.push({v,frontId:front.id,price});
}}
await mkdir('public',{recursive:true});
const result={storeId,labelCost:0.99,profitTarget:3.5,shipping:'destination quote required',variants:[]};
for(const {v,frontId,price} of rows){
const files=v.files.filter(f=>f.type!=='label_inside').map(f=>({id:f.id,type:f.type,...(f.options?{options:f.options}:{}),...(f.position?{position:f.position}:{})}));
files.push({type:'label_inside',url:labelUrl,options:[{id:'template_type',value:'native'}]});
if(v.files.find(f=>f.type==='label_inside')?.url!==labelUrl||v.retail_price!==price)await api('/store/variants/'+v.id,'PUT',{files,retail_price:price});
const fresh=(await api('/store/variants/'+v.id)).result;
const l=fresh.files.find(f=>f.type==='label_inside');
const front=fresh.files.find(f=>['default','front'].includes(f.type));
if(!l||l.url!==labelUrl||front?.id!==frontId||fresh.retail_price!==price||!fresh.synced)throw new Error('Update verification failed for '+v.id);
result.variants.push({id:v.id,productId:v.sync_product_id,size:v.size,retailPrice:price,frontPreserved:true,labelFileId:l.id,labelStatus:l.status,labelOptions:l.options??[],labelWidth:l.width,labelHeight:l.height});
await writeFile('public/modern-relic-label-setup.json',JSON.stringify(result));
}
console.log('Modern Relic native labels applied to '+result.variants.length+' variants');