const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else {
        results.push(file);
      }
    });
  } catch (e) {}
  return results;
}

const files = [
  ...walk('./src'),
  ...walk('./scripts'),
  './next.config.mjs'
].filter(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.mjs') || f.endsWith('.cjs') || f.endsWith('.sh'));

let modifiedFiles = [];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // We want to replace webm with mp4 safely.
  // Be careful with case preservation.
  content = content.replace(/videos-webm/g, 'videos-mp4');
  content = content.replace(/webm/g, 'mp4');
  content = content.replace(/Webm/g, 'Mp4');
  content = content.replace(/WEBM/g, 'MP4');

  if (content !== originalContent) {
    fs.writeFileSync(f, content, 'utf8');
    modifiedFiles.push(f);
  }
});

console.log('Modified files:', modifiedFiles);
