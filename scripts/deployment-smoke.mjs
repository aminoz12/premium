const base=(process.argv[2]||'http://127.0.0.1:3000').replace(/\/$/,'');
if(!/^https?:\/\//.test(base))throw new Error('Pass an absolute deployment origin as the first argument.');

const paths=['/','/live-tv','/sports','/movies','/series','/pricing','/order','/setup-guides','/world-cup-2026','/world-cup-2026/final','/world-cup-2026/final-standings','/world-cup-2026/awards','/world-cup-history','/world-cup-history/winners','/world-cup-history/records','/world-cup-2026/replays','/world-cup-2026/replays/usa','/world-cup-2026/teams','/world-cup-2026/host-cities','/guides','/guides/is-iptv-legal','/guides/watch-soccer-without-cable','/guides/streaming-latency','/guides/sports-streaming-accessibility','/data','/research','/research/streaming-benchmark-methodology','/research/world-cup-2026-replay-source-tracker','/updates','/guides/internet-speed-4k-sports','/guides/stop-sports-buffering','/guides/best-device-live-sports','/guides/4k-hdr-sports-setup','/about','/editorial-policy','/corrections','/contact','/support','/privacy-policy','/terms-of-service'];
const failures=[];
const fail=message=>{failures.push(message);console.error(`✗ ${message}`)};
const pass=message=>console.log(`✓ ${message}`);

for(const path of paths){
  const response=await fetch(base+path,{redirect:'manual'});
  const html=await response.text();
  if(response.status!==200){fail(`${path} returned ${response.status}`);continue}
  const h1=(html.match(/<h1[\s>]/g)||[]).length;
  const canonical=html.match(/<link rel="canonical" href="([^"]+)/)?.[1]||'';
  const metaRobots=html.match(/<meta name="robots" content="([^"]+)/)?.[1]||'';
  if(h1!==1)fail(`${path} initial H1 count ${h1}`);
  if(!canonical.startsWith('https://watchworldcup.us'))fail(`${path} canonical is ${canonical||'missing'}`);
  if(!metaRobots.includes('index, follow'))fail(`${path} is not explicitly index/follow`);
  if(response.headers.get('x-robots-tag'))fail(`${path} sends an unexpected X-Robots-Tag`);
}
if(!failures.length)pass(`${paths.length} crawlable routes passed status, H1, canonical and index/follow checks`);

const robots=await(await fetch(base+'/robots.txt')).text();
const sitemap=await(await fetch(base+'/sitemap.xml')).text();
const sitemapCount=(sitemap.match(/<url>/g)||[]).length;
robots.includes('Sitemap: https://watchworldcup.us/sitemap.xml')?pass('robots advertises the canonical sitemap'):fail('robots sitemap is missing');
sitemapCount===40?pass('sitemap contains 40 URLs'):fail(`sitemap contains ${sitemapCount} URLs`);

const contact=await(await fetch(base+'/contact')).text();
!contact.includes('mailto:')&&contact.includes('phone=212723279328')?pass('contact route exposes the fixed WhatsApp recipient'):fail('contact route channel mismatch');

for(const [path,status,location] of [['/channels',308,'/live-tv'],['/world-cup-2026-iptv/teams/mexico/',308,'/world-cup-2026/teams'],['/checkout',410,''],['/cart',404,''],['/client-area',404,''],['/search',404,''],['/?s=world+cup',404,''],['/refund-policy',200,''],['/definitely-not-a-page',404,'']]){
  const response=await fetch(base+path,{redirect:'manual'});
  const got=response.headers.get('location')||'';
  response.status===status&&(!location||got===location)?pass(`${path} returns ${status}${location?` to ${location}`:''}`):fail(`${path} returned ${response.status}${got?` to ${got}`:''}`);
  if(response.headers.get('x-robots-tag'))fail(`${path} sends an unexpected X-Robots-Tag`);
}

const home=await fetch(base);
for(const header of ['content-security-policy','strict-transport-security','x-content-type-options','x-frame-options','referrer-policy']){
  home.headers.get(header)?pass(`${header} is present`):fail(`${header} is missing`);
}

if(failures.length){console.error(`\n${failures.length} deployment smoke failure(s)`);process.exit(1)}
console.log('\nPRODUCTION DEPLOYMENT SMOKE PASSED');
