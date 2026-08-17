import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const excluded=new Set(['node_modules','.next']);
const images=[];
const forbidden=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(excluded.has(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else{const ext=path.extname(entry.name).toLowerCase();if(ext==='.webp')images.push(full);if(['.jpg','.jpeg','.png','.gif','.bmp','.avif'].includes(ext))forbidden.push(full)}}}
walk(root);
let failures=0;
const fail=message=>{failures++;console.error(`✗ ${message}`)};
const pass=message=>console.log(`✓ ${message}`);
if(forbidden.length)for(const file of forbidden)fail(`Non-WebP raster remains: ${path.relative(root,file)}`);else pass('No JPG, JPEG, PNG, GIF, BMP or AVIF files remain');
for(const file of images){const buffer=fs.readFileSync(file);if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')fail(`${path.relative(root,file)} has an invalid WebP container`)}
images.length>0?pass(`${images.length} WebP assets have valid containers`):fail('No WebP assets found');
const nextConfig=fs.readFileSync(path.join(root,'next.config.js'),'utf8');
/formats:\s*\['image\/webp'\]/.test(nextConfig)&&!nextConfig.includes("image/avif")?pass('Next Image runtime output is restricted to WebP'):fail('Next Image formats are not WebP-only');
const scanRoots=['app','lib','scripts','seo'];
for(const name of scanRoots){for(const file of fs.readdirSync(path.join(root,name),{recursive:true}).filter(item=>/\.(?:ts|tsx|js|mjs|py|css|md|json|csv)$/.test(item)&&!item.includes('lighthouse-home-')&&!item.endsWith('webp-assets-check.mjs')&&!item.endsWith('convert-raster-to-webp.py'))){const full=path.join(root,name,file);const source=fs.readFileSync(full,'utf8');if(/\.(?:jpe?g|png|gif|bmp|avif)(?:["'`)\s]|$)/i.test(source))fail(`${path.relative(root,full)} references a non-WebP raster`)}}
for(const file of fs.readdirSync(root).filter(name=>name.endsWith('.md'))){const source=fs.readFileSync(path.join(root,file),'utf8');if(/\.(?:jpe?g|png|gif|bmp|avif)(?:["'`)\s]|$)/i.test(source))fail(`${file} references a non-WebP raster`)}
if(failures){console.error(`\n${failures} WebP asset failure(s)`);process.exit(1)}
console.log('WEBP ASSET CHECK PASSED');
