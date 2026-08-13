import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const app=path.join(root,'app');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.tsx?$/.test(entry.name))files.push(full)}}
walk(app);

let failures=0;
let svgCount=0;
const fail=message=>{failures++;console.error(`✗ ${message}`)};
for(const file of files){
  const source=fs.readFileSync(file,'utf8');
  const rel=path.relative(root,file);
  const emoji=[...source.matchAll(/\p{Extended_Pictographic}/gu)].map(match=>match[0]);
  if(emoji.length)fail(`${rel} contains emoji characters: ${[...new Set(emoji)].join(' ')}`);
  const glyphs=[...source.matchAll(/[→✓⚠❗✅❌]/gu)].map(match=>match[0]);
  if(glyphs.length)fail(`${rel} contains decorative text glyphs instead of SVG: ${[...new Set(glyphs)].join(' ')}`);
  if(/(?:lucide|heroicons|react-icons|fontawesome|font-awesome|@fortawesome)/i.test(source))fail(`${rel} imports an external icon library`);
  svgCount+=(source.match(/<svg\b/g)||[]).length;
}
if(svgCount<20)fail(`Only ${svgCount} inline SVG definitions/usages were found`);
if(failures){console.error(`\n${failures} icon-policy failure(s)`);process.exit(1)}
console.log(`✓ ${svgCount} raw inline SVG definitions/usages found; no emoji, decorative arrow/check glyphs, or external icon libraries`);
