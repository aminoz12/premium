import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const manifestPath = path.join(root, 'public/images/og/manifest.json');
const imageIndexPath = path.join(root, 'seo/images/image-search-index.json');

let failures = 0;
const pass = (msg) => console.log(`✓ ${msg}`);
const fail = (msg) => {
  failures++;
  console.error(`✗ ${msg}`);
};

console.log('--- IMAGE SEO & VISUAL SEARCH AUDIT ---');

// 1. Audit manifest file exists
if (!fs.existsSync(manifestPath)) {
  fail('OG manifest.json missing');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
pass(`OG manifest loaded with ${manifest.length} route image records`);

// 2. Audit search index file exists
if (fs.existsSync(imageIndexPath)) {
  const indexData = JSON.parse(fs.readFileSync(imageIndexPath, 'utf8'));
  pass(`Image Search Index loaded with ${indexData.imageSearchIndex.assets.length} registered visual assets`);
} else {
  fail('seo/images/image-search-index.json missing');
}

// 3. Validate WebP format and file size limits
for (const item of manifest) {
  const fileDisk = path.join(publicDir, item.file);
  if (!fs.existsSync(fileDisk)) {
    fail(`Image missing on disk: ${item.file}`);
    continue;
  }
  const stat = fs.statSync(fileDisk);
  if (stat.size > 250000) {
    fail(`Image ${item.file} exceeds 250 KB limit (${stat.size} bytes)`);
  }
  if (!item.file.endsWith('.webp')) {
    fail(`Image ${item.file} is not WebP format`);
  }
}
pass(`All ${manifest.length} OG social card images exist, use WebP format, and stay under 250 KB`);

// 4. Validate static fallback images
const fallbackImages = ['/hero-fallback.webp', '/world-cup-fallback.webp', '/logo.svg'];
for (const imgPath of fallbackImages) {
  const disk = path.join(publicDir, imgPath);
  if (!fs.existsSync(disk)) {
    fail(`Static fallback asset missing: ${imgPath}`);
  } else {
    pass(`Static asset verified: ${imgPath}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} Image SEO failure(s) detected.`);
  process.exit(1);
} else {
  console.log('\nIMAGE SEO & VISUAL SEARCH AUDIT PASSED CLEANLY');
}
