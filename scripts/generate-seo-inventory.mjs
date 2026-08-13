import fs from 'node:fs';
import path from 'node:path';

const base=(process.argv[2]||'http://127.0.0.1:3000').replace(/\/$/,'');
const out=path.join(process.cwd(),'seo');
fs.mkdirSync(out,{recursive:true});
const esc=value=>`"${String(value??'').replaceAll('"','""')}"`;
const visibleWords=html=>html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/gi,' ').match(/[A-Za-zÀ-ÿ0-9'-]+/g)?.length||0;
const schemaTypes=html=>{
  const found=new Set();
  for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
    try{
      const walk=value=>{if(Array.isArray(value))return value.forEach(walk);if(!value||typeof value!=='object')return;if(value['@type'])found.add(Array.isArray(value['@type'])?value['@type'].join('|'):value['@type']);for(const child of Object.values(value))walk(child)};
      walk(JSON.parse(match[1]));
    }catch{}
  }
  return [...found].sort();
};

const sitemapResponse=await fetch(base+'/sitemap.xml');
if(!sitemapResponse.ok)throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap=await sitemapResponse.text();
const urls=[...sitemap.matchAll(/<url>\s*<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
const rows=[];
for(const url of urls){
  const pathname=new URL(url).pathname;
  const response=await fetch(base+pathname,{redirect:'manual'});
  const html=await response.text();
  rows.push({
    pathname,
    status:response.status,
    title:html.match(/<title>(.*?)<\/title>/s)?.[1]||'',
    description:html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'',
    canonical:html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]||'',
    robots:html.match(/<meta name="robots" content="([^"]*)"/)?.[1]||'',
    h1Count:(html.match(/<h1[\s>]/g)||[]).length,
    serverWords:visibleWords(html),
    ogImage:html.match(/<meta property="og:image" content="([^"]*)"/)?.[1]||'',
    twitterCard:html.match(/<meta name="twitter:card" content="([^"]*)"/)?.[1]||'',
    hreflang:[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map(match=>({language:match[1],url:match[2]})),
    schemaTypes:schemaTypes(html),
  });
}
const headers=['pathname','status','title','description','canonical','robots','h1_count','server_words','og_image','twitter_card','hreflang','schema_types'];
const lines=[headers.map(esc).join(',')];
for(const row of rows)lines.push([row.pathname,row.status,row.title,row.description,row.canonical,row.robots,row.h1Count,row.serverWords,row.ogImage,row.twitterCard,row.hreflang.map(item=>`${item.language}:${item.url}`).join('|'),row.schemaTypes.join('|')].map(esc).join(','));
fs.writeFileSync(path.join(out,'metadata-inventory.csv'),lines.join('\n')+'\n');
const robotsResponse=await fetch(base+'/robots.txt');
const robots=await robotsResponse.text();
const replayDefault=rows.find(row=>row.pathname==='/world-cup-2026/replays');
const replayUsa=rows.find(row=>row.pathname==='/world-cup-2026/replays/usa');
const hasAlternate=(row,language,url)=>Boolean(row?.hreflang.some(item=>item.language===language&&item.url===url));
const checks={
  routeCount:rows.length,
  allStatus200:rows.every(row=>row.status===200),
  allExplicitIndexFollow:rows.every(row=>row.robots.includes('index, follow')),
  allOneH1:rows.every(row=>row.h1Count===1),
  allSelfCanonical:rows.every(row=>row.canonical===`https://watchworldcup.us${row.pathname==='/'?'':row.pathname}`),
  uniqueTitles:new Set(rows.map(row=>row.title)).size===rows.length,
  uniqueDescriptions:new Set(rows.map(row=>row.description)).size===rows.length,
  uniqueSocialImages:new Set(rows.map(row=>row.ogImage)).size===rows.length,
  geoHreflangReciprocal:hasAlternate(replayDefault,'x-default','https://watchworldcup.us/world-cup-2026/replays')&&hasAlternate(replayDefault,'en-US','https://watchworldcup.us/world-cup-2026/replays/usa')&&hasAlternate(replayUsa,'x-default','https://watchworldcup.us/world-cup-2026/replays')&&hasAlternate(replayUsa,'en-US','https://watchworldcup.us/world-cup-2026/replays/usa'),
  robotsAdvertisesSitemap:robots.includes('Sitemap: https://watchworldcup.us/sitemap.xml'),
};
fs.writeFileSync(path.join(out,'runtime-snapshot.json'),JSON.stringify({generatedAt:'2026-08-11',sourceOrigin:base,canonicalOrigin:'https://watchworldcup.us',checks,rows},null,2)+'\n');
fs.writeFileSync(path.join(out,'indexable-routes.json'),JSON.stringify({canonicalOrigin:'https://watchworldcup.us',count:rows.length,routes:rows.map(row=>({path:row.pathname,canonical:row.canonical,title:row.title,hreflang:row.hreflang,schemaTypes:row.schemaTypes}))},null,2)+'\n');
if(!Object.values(checks).every(Boolean))throw new Error(`SEO inventory check failed: ${JSON.stringify(checks)}`);
console.log(`Generated SEO inventory for ${rows.length} indexable routes`);
