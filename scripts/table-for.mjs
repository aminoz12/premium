// fix-tables.mjs   ,  run once with: node fix-tables.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const files = await glob('docs/**/*.md');

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');

  const fixed = original
    .split('\n')
    .flatMap((line) => {
      if (!line.includes('|')) return [line];
      const rows = line.split(/(?<=\|)[ \t]+(?=\|)/).map(r => r.trim()).filter(Boolean);
      return rows.length > 1 ? rows : [line];
    })
    .join('\n');

  if (fixed !== original) {
    fs.writeFileSync(file, fixed, 'utf8');
    console.log('Fixed:', file);
  }
}
console.log('Done.');