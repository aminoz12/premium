const base=(process.argv[2]||'http://127.0.0.1:3000').replace(/\/$/,'');
let failures=0;
const pass=message=>console.log(`✓ ${message}`);
const fail=message=>{failures++;console.error(`✗ ${message}`)};

const sitemapResponse=await fetch(base+'/sitemap.xml');
const sitemap=await sitemapResponse.text();
const entries=[...sitemap.matchAll(/<url>\s*<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
entries.length===40?pass('sitemap contains exactly 40 indexable URLs'):fail(`sitemap contains ${entries.length} URLs`);
for(const absolute of entries){
  const expected=new URL(absolute);
  const response=await fetch(base+expected.pathname,{redirect:'manual'});
  const html=await response.text();
  const canonical=html.match(/<link rel="canonical" href="([^"]+)/)?.[1]||'';
  const robots=html.match(/<meta name="robots" content="([^"]+)/)?.[1]||'';
  if(response.status!==200)fail(`${expected.pathname} returned ${response.status}`);
  if(canonical!==absolute)fail(`${expected.pathname} canonical ${canonical||'missing'} != ${absolute}`);
  if(!robots.includes('index, follow'))fail(`${expected.pathname} is not explicitly index/follow`);
}
if(!failures)pass('all sitemap URLs return 200 with exact self-canonicals and index/follow');

const redirects=[
  ['/index.html','/'],
  ['/channels','/live-tv'],
  ['/live-channels','/live-tv'],
  ['/world-cup-2026-iptv/','/world-cup-2026'],
  ['/world-cup-2026-iptv/matches/mexico-vs-south-africa/','/world-cup-2026'],
  ['/world-cup-2026-iptv/teams/mexico/','/world-cup-2026/teams'],
  ['/world-cup-2026-iptv/usa/','/world-cup-2026/replays/usa'],
  ['/usa','/world-cup-2026/replays/usa'],
  ['/uk','/world-cup-2026/replays'],
  ['/fr','/world-cup-2026/replays'],
  ['/es','/world-cup-2026/replays'],
  ['/de','/world-cup-2026/replays'],
  ['/gr','/world-cup-2026/replays'],
  ['/al','/world-cup-2026/replays'],
  ['/blog/world-cup-final-2026','/world-cup-2026/final'],
  ['/blog/iptv-setup-guide','/guides/4k-hdr-sports-setup'],
  ['/blog/how-to-use-iptv-on-firestick','/guides/best-device-live-sports'],
  ['/blog/best-iptv-apps-android','/guides/best-device-live-sports'],
];
for(const[path,target]of redirects){
  const response=await fetch(base+path,{redirect:'manual'});
  const location=response.headers.get('location')||'';
  response.status===308&&location===target?pass(`${path} 308 -> ${target}`):fail(`${path} returned ${response.status} -> ${location||'none'}`);
}

const removals=[
  ['/checkout',410],
  ['/cart',404],
  ['/client-area',404],
  ['/api/test',404],
  ['/search',404],
  ['/?s=world+cup',404],
  ['/refund-policy',404],
  ['/definitely-not-a-page',404],
];
for(const[path,status]of removals){
  const response=await fetch(base+path,{redirect:'manual'});
  response.status===status?pass(`${path} returns ${status}`):fail(`${path} returns ${response.status}, expected ${status}`);
  if(path==='/checkout'||path.includes('?s='))!response.headers.get('x-robots-tag')?pass(`${path} relies on its removal status without an indexing override`):fail(`${path} sends an unexpected X-Robots-Tag`);
}

for(const path of ['/?utm_source=release-check','/pricing?utm_campaign=release-check']){
  const expectedPath=new URL(base+path).pathname;
  const expectedCanonical=`https://watchworldcup.us${expectedPath==='/'?'':expectedPath}`;
  const response=await fetch(base+path,{redirect:'manual'});
  const html=await response.text();
  const canonical=html.match(/<link rel="canonical" href="([^"]+)/)?.[1]||'';
  response.status===200&&canonical===expectedCanonical?pass(`${path} consolidates to ${expectedCanonical}`):fail(`${path} returned ${response.status} with canonical ${canonical||'missing'}`);
}

const robots=await(await fetch(base+'/robots.txt')).text();
for(const path of ['/api/','/checkout','/cart','/client-area'])robots.includes(`Disallow: ${path}`)?pass(`robots blocks ${path}`):fail(`robots does not block ${path}`);

const utilities=[
  ['/feed.xml',200,/application\/(?:rss\+xml|xml)/i],
  ['/robots.txt',200,/text\/plain/i],
  ['/sitemap.xml',200,/application\/xml/i],
  ['/manifest.webmanifest',200,/application\/manifest\+json/i],
  ['/.well-known/security.txt',200,/text\/plain/i],
  ['/llms.txt',200,/text\/plain/i],
  ['/downloads/world-cup-2026-final-standings.csv',200,/text\/csv/i],
  ['/downloads/world-cup-2026-final-standings.json',200,/application\/json/i],
];
for(const[path,status,type]of utilities){
  const response=await fetch(base+path,{redirect:'manual'});
  const contentType=response.headers.get('content-type')||'';
  response.status===status&&type.test(contentType)?pass(`${path} returns ${status} ${contentType.split(';')[0]}`):fail(`${path} returns ${response.status} ${contentType||'without content type'}`);
}

if(failures){console.error(`\n${failures} indexation-policy failure(s)`);process.exit(1)}
console.log('\nINDEXATION POLICY CHECK PASSED');
