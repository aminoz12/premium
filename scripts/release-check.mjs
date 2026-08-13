import fs from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

const root=process.cwd();
const port=3210;
const base=`http://127.0.0.1:${port}`;
const failures=[];
const pass=message=>console.log(`✓ ${message}`);
const fail=message=>{failures.push(message);console.error(`✗ ${message}`)};

function source(path){return fs.readFileSync(`${root}/${path}`,'utf8')}
function command(name,args){
  const result=spawnSync(name,args,{cwd:root,stdio:'inherit'});
  if(result.status!==0)throw new Error(`${name} ${args.join(' ')} exited ${result.status}`);
}

for(const file of ['package-lock.json','next.config.js','netlify.toml','.nvmrc']){
  fs.existsSync(`${root}/${file}`)?pass(`${file} exists`):fail(`${file} is missing`);
}
const netlify=source('netlify.toml');
const nodeVersion=source('.nvmrc').trim();
/command = "npm run build"/.test(netlify)&&/publish = "\.next"/.test(netlify)&&nodeVersion==='20'?pass('Netlify uses the production Next.js build with Node 20 fixed by .nvmrc'):fail('Netlify build settings do not match the release contract');
const contact=source('app/contact/page.tsx');
!contact.includes('mailto:')&&!contact.includes('EDITORIAL_EMAIL')&&!contact.includes('SUPPORT_EMAIL')?pass('Contact page does not publish unverified email mailboxes'):fail('Contact page still publishes an unverified mailbox');
const sourceText=['lib','app','scripts'].flatMap(dir=>fs.readdirSync(`${root}/${dir}`,{recursive:true}).filter(name=>/\.(?:ts|tsx|mjs)$/.test(name)).map(name=>source(`${dir}/${name}`))).join('\n');
const obsolete=['premium','iptv','.com'].join('');
!sourceText.toLowerCase().includes(obsolete)?pass('Source contains no obsolete external IPTV domain'):fail('Source contains the obsolete external IPTV domain');

if(failures.length)process.exit(1);

const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:root,stdio:['ignore','pipe','pipe']});
let serverLog='';
server.stdout.on('data',chunk=>{serverLog+=chunk.toString()});
server.stderr.on('data',chunk=>{serverLog+=chunk.toString()});

async function waitForServer(){
  const deadline=Date.now()+20000;
  while(Date.now()<deadline){
    if(server.exitCode!==null)throw new Error(`Production server exited early:\n${serverLog}`);
    try{const response=await fetch(base);if(response.ok)return}catch{}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw new Error(`Production server did not become ready:\n${serverLog}`);
}

try{
  await waitForServer();
  pass(`production server started on ${base}`);

  const home=await fetch(base);
  const html=await home.text();
  const requiredHeaders={
    'strict-transport-security':'max-age=31536000; includeSubDomains',
    'x-content-type-options':'nosniff',
    'x-frame-options':'DENY',
    'referrer-policy':'strict-origin-when-cross-origin',
    'cross-origin-opener-policy':'same-origin',
  };
  for(const[key,value]of Object.entries(requiredHeaders))home.headers.get(key)===value?pass(`${key} release header`):fail(`${key} header mismatch: ${home.headers.get(key)||'missing'}`);
  const csp=home.headers.get('content-security-policy')||'';
  csp.includes("frame-ancestors 'none'")&&csp.includes("default-src 'self'")?pass('Content Security Policy is active'):fail('Content Security Policy is missing required directives');
  (html.match(/<h1[\s>]/g)||[]).length===1?pass('homepage has one H1 in initial HTML'):fail('homepage initial H1 count mismatch');
  (/<link rel="canonical" href="https:\/\/watchworldcup\.us\/?"\/>/.test(html))?pass('homepage self-canonical is in initial HTML'):fail('homepage canonical is missing or incorrect');
  html.includes('"@type":"Organization"')?pass('visible organization data is represented in initial HTML'):fail('organization structured data is missing');

  const contactResponse=await fetch(`${base}/contact`);
  const contactHtml=await contactResponse.text();
  !contactHtml.includes('mailto:')&&contactHtml.includes('phone=212723279328')?pass('contact route uses only the verified WhatsApp recipient'):fail('contact route exposes an unverified channel');
  const security=await fetch(`${base}/.well-known/security.txt`);
  const securityText=await security.text();
  security.status===200&&securityText.includes('Contact: https://watchworldcup.us/contact')&&!security.headers.get('x-robots-tag')?pass('security.txt uses the verified HTTPS contact without an indexing override'):fail('security.txt release contract failed');

  for(const script of ['seo:inventory','seo:files:check','geo:check','seo:check','quality:check','cta:check','icons:check','webp:check','images:check','data:check','migration:check','policy:check']){
    command('npm',['run',script,'--',base]);
  }
  command('npm',['audit','--omit=dev','--audit-level=high']);
  if(failures.length)throw new Error(`${failures.length} release assertion(s) failed`);
  console.log('\nTECHNICAL RELEASE GATES PASSED');
  console.log('The fixed production candidate is ready; public cutover requires authenticated Netlify and domain access.');
} finally {
  server.kill('SIGTERM');
  await new Promise(resolve=>{if(server.exitCode!==null)return resolve();server.once('exit',resolve);setTimeout(resolve,3000)});
}
