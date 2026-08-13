import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dir=path.join(root,'seo');
const required=['README.md','indexable-routes.json','metadata-inventory.csv','runtime-snapshot.json','redirect-map.json','status-policy.json','structured-data-inventory.json','deployment-checklist.md','post-launch-monitoring.md','search-console-submission.md','lighthouse-summary.json','quality-summary.json','lighthouse-home-production.json','lighthouse-home-desktop-production.json'];
let failures=0;
const pass=message=>console.log(`✓ ${message}`);
const fail=message=>{failures++;console.error(`✗ ${message}`)};
for(const file of required)fs.existsSync(path.join(dir,file))?pass(`seo/${file}`):fail(`Missing seo/${file}`);
if(failures)process.exit(1);

const routes=JSON.parse(fs.readFileSync(path.join(dir,'indexable-routes.json'),'utf8'));
const snapshot=JSON.parse(fs.readFileSync(path.join(dir,'runtime-snapshot.json'),'utf8'));
const redirects=JSON.parse(fs.readFileSync(path.join(dir,'redirect-map.json'),'utf8'));
const statuses=JSON.parse(fs.readFileSync(path.join(dir,'status-policy.json'),'utf8'));
const schemas=JSON.parse(fs.readFileSync(path.join(dir,'structured-data-inventory.json'),'utf8'));
const csvLines=fs.readFileSync(path.join(dir,'metadata-inventory.csv'),'utf8').trim().split(/\r?\n/);

routes.count===40&&routes.routes.length===40?pass('40 generated indexable routes'):fail('Indexable route count mismatch');
csvLines.length===41?pass('Metadata CSV has header plus 40 routes'):fail(`Metadata CSV has ${csvLines.length} lines`);
Object.values(snapshot.checks).every(Boolean)?pass('Runtime SEO snapshot checks all pass'):fail('Runtime SEO snapshot contains a failed check');
redirects.status===308&&redirects.rules.length>=19?pass(`${redirects.rules.length} redirect policies recorded`):fail('Redirect policy inventory mismatch');
statuses.removed.some(item=>item.status===410)&&statuses.removed.filter(item=>item.status===404).length>=6?pass('404 and 410 removal policies recorded'):fail('Removal status policy incomplete');
['Product','Offer','AggregateRating','Review'].every(type=>schemas.forbiddenWithoutEvidence.includes(type))?pass('Unsupported commercial schema types are explicitly forbidden'):fail('Structured-data guard list incomplete');
const uniquePaths=new Set(routes.routes.map(route=>route.path));
uniquePaths.size===40?pass('Indexable paths are unique'):fail('Duplicate indexable path');
if(routes.routes.some(route=>!route.canonical.startsWith('https://watchworldcup.us')))fail('Canonical host mismatch in route inventory');else pass('All generated canonicals use watchworldcup.us');

if(failures){console.error(`\n${failures} SEO-file failure(s)`);process.exit(1)}
console.log('\nSEO FILE PACKAGE CHECK PASSED');
