import fs from 'node:fs';
import path from 'node:path';

const base=(process.argv[2]||'http://127.0.0.1:3000').replace(/\/$/,'');
const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/images/og/manifest.json'),'utf8'));
let failures=0;
const fail=message=>{failures++;console.error(`✗ ${message}`)};
const pass=message=>console.log(`✓ ${message}`);

function webpSize(buffer){
  if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')throw new Error('not WebP');
  let offset=12;
  while(offset+8<=buffer.length){
    const type=buffer.toString('ascii',offset,offset+4);
    const length=buffer.readUInt32LE(offset+4);
    const data=offset+8;
    if(type==='VP8X'&&data+10<=buffer.length)return{width:1+buffer.readUIntLE(data+4,3),height:1+buffer.readUIntLE(data+7,3)};
    if(type==='VP8 '&&data+10<=buffer.length)return{width:buffer.readUInt16LE(data+6)&0x3fff,height:buffer.readUInt16LE(data+8)&0x3fff};
    if(type==='VP8L'&&data+5<=buffer.length){const bits=buffer.readUInt32LE(data+1);return{width:1+(bits&0x3fff),height:1+((bits>>14)&0x3fff)}}
    offset=data+length+(length%2);
  }
  throw new Error('WebP dimension chunk absent');
}

const files=new Set();
for(const item of manifest){
  const disk=path.join(root,'public',item.file);
  if(files.has(item.file))fail(`Duplicate image file ${item.file}`);
  files.add(item.file);
  if(!item.file.endsWith('.webp'))fail(`${item.file} is not WebP`);
  if(!fs.existsSync(disk)){fail(`Missing ${item.file}`);continue}
  const buffer=fs.readFileSync(disk);
  try{const size=webpSize(buffer);if(size.width!==1200||size.height!==630)fail(`${item.file} is ${size.width}x${size.height}`)}catch(error){fail(`${item.file}: ${error.message}`)}
  if(buffer.length>250000)fail(`${item.file} exceeds 250 KB`);
  if(buffer.length<20000)fail(`${item.file} is suspiciously small`);
}

for(const item of manifest){
  const response=await fetch(base+item.path);
  const html=await response.text();
  const expected=`https://watchworldcup.us${item.file}`;
  const og=html.match(/<meta property="og:image" content="([^"]+)/)?.[1]||'';
  const tw=html.match(/<meta name="twitter:image" content="([^"]+)/)?.[1]||'';
  const ogAlt=html.match(/<meta property="og:image:alt" content="([^"]+)/)?.[1]||'';
  const ogType=html.match(/<meta property="og:image:type" content="([^"]+)/)?.[1]||'';
  if(response.status!==200)fail(`${item.path} returned ${response.status}`);
  if(og!==expected)fail(`${item.path} og:image mismatch: ${og}`);
  if(tw!==expected)fail(`${item.path} twitter:image mismatch: ${tw}`);
  if(!ogAlt)fail(`${item.path} missing og:image:alt`);
  if(ogType!=='image/webp')fail(`${item.path} og:image:type is ${ogType||'missing'}`);
  const imageResponse=await fetch(base+item.file,{method:'HEAD'});
  if(imageResponse.status!==200||!/image\/webp/i.test(imageResponse.headers.get('content-type')||''))fail(`${item.file} delivery failed`);
}

const sitemap=await(await fetch(base+'/sitemap.xml')).text();
const sitemapPaths=[...sitemap.matchAll(/<url>\s*<loc>https:\/\/watchworldcup\.us([^<]*)<\/loc>/g)].map(match=>match[1]||'/');
if(manifest.length!==sitemapPaths.length)fail(`Manifest has ${manifest.length} records but sitemap has ${sitemapPaths.length} URLs`);
for(const pathName of sitemapPaths)if(!manifest.some(item=>item.path===pathName))fail(`Sitemap path missing image: ${pathName}`);
if(!failures)pass(`${manifest.length} unique 1200x630 WebP cards passed format, dimensions, compression, metadata, alt and delivery checks`);
else{console.error(`${failures} image metadata failure(s)`);process.exit(1)}
