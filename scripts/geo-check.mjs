import fs from 'node:fs';
import path from 'node:path';

const base=(process.argv[2]||'http://127.0.0.1:3000').replace(/\/$/,'');
const root=process.cwd();
const dir=path.join(root,'seo','geo');
const required=['README.md','entity-profile.json','answer-engine-content-map.json','citation-policy.md','geographic-policy.json','hreflang-cluster.json','geo-checklist.md'];
let failures=0;
const pass=message=>console.log(`✓ ${message}`);
const fail=message=>{failures++;console.error(`✗ ${message}`)};
for(const file of required)fs.existsSync(path.join(dir,file))?pass(`seo/geo/${file}`):fail(`Missing seo/geo/${file}`);
if(failures)process.exit(1);

const entity=JSON.parse(fs.readFileSync(path.join(dir,'entity-profile.json'),'utf8'));
const answers=JSON.parse(fs.readFileSync(path.join(dir,'answer-engine-content-map.json'),'utf8'));
const geographic=JSON.parse(fs.readFileSync(path.join(dir,'geographic-policy.json'),'utf8'));
const cluster=JSON.parse(fs.readFileSync(path.join(dir,'hreflang-cluster.json'),'utf8'));
const indexable=JSON.parse(fs.readFileSync(path.join(root,'seo','indexable-routes.json'),'utf8'));
const routeSet=new Set(indexable.routes.map(route=>route.path));

entity.entity.name==='WATCHWORLDCUP'&&entity.entity.canonicalUrl==='https://watchworldcup.us'?pass('Canonical entity identity is fixed'):fail('Entity identity mismatch');
entity.verifiedOffer.map(plan=>plan.price).join(',')==='25,38,62'?pass('Verified GEO offer facts match production prices'):fail('GEO price mismatch');
entity.entity.publicContact.phoneE164==='+212723279328'?pass('GEO contact matches production WhatsApp recipient'):fail('GEO contact mismatch');
answers.answers.every(answer=>routeSet.has(answer.page))?pass('Every answer-engine target is an indexable canonical route'):fail('Answer-engine map targets a non-indexable route');
geographic.architecture==='subdirectories only'&&!geographic.geoSubdomainsAllowed&&!geographic.doorwayPagesAllowed?pass('Geographic architecture blocks subdomains and doorway pages'):fail('Geographic architecture policy mismatch');
cluster.reciprocal&&cluster.members.length===2?pass('Current hreflang cluster is recorded as reciprocal'):fail('Hreflang cluster inventory mismatch');

const parseAlternates=html=>[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map(match=>({language:match[1],url:match[2]}));
const expected=[
  {language:'x-default',url:'https://watchworldcup.us/world-cup-2026/replays'},
  {language:'en-US',url:'https://watchworldcup.us/world-cup-2026/replays/usa'},
];
for(const pathname of ['/world-cup-2026/replays','/world-cup-2026/replays/usa']){
  const response=await fetch(base+pathname);
  const html=await response.text();
  const alternates=parseAlternates(html);
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]||'';
  response.status===200?pass(`${pathname} returns 200`):fail(`${pathname} returned ${response.status}`);
  canonical===`https://watchworldcup.us${pathname}`?pass(`${pathname} self-canonical`):fail(`${pathname} canonical mismatch`);
  expected.every(item=>alternates.some(actual=>actual.language===item.language&&actual.url===item.url))?pass(`${pathname} reciprocal x-default/en-US alternates`):fail(`${pathname} hreflang mismatch`);
}

const llmsResponse=await fetch(base+'/llms.txt');
const llms=await llmsResponse.text();
llmsResponse.status===200&&/text\/plain/i.test(llmsResponse.headers.get('content-type')||'')?pass('/llms.txt returns plain text'):fail('/llms.txt delivery mismatch');
for(const requiredText of ['WATCHWORLDCUP','$25','$38','$62','+212 723 279 328','Sitemap','Claim boundaries'])llms.includes(requiredText)?pass(`/llms.txt contains ${requiredText}`):fail(`/llms.txt missing ${requiredText}`);
for(const forbiddenText of ['35,000','147,000','100% stability','#1 Worldwide'])if(llms.includes(forbiddenText))fail(`/llms.txt contains unsupported claim ${forbiddenText}`);

if(failures){console.error(`\n${failures} GEO failure(s)`);process.exit(1)}
console.log('\nSEO/GEO PACKAGE CHECK PASSED');
