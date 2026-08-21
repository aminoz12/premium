const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
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
  return results;
}

const files = walk('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // Remove imports
  content = content.replace(/import\s*\{[^}]*\}\s*from\s*["'].*ads.*["']\s*;?\r?\n/g, '');
  content = content.replace(/import\s*AdSlot\s*from\s*["'].*ads.*["']\s*;?\r?\n/g, '');
  
  // Remove ad components
  content = content.replace(/<AdSlot[^>]*\/>/g, '');
  content = content.replace(/<NativeAd[^>]*\/>/g, '');
  content = content.replace(/<BannerAd[^>]*\/>/g, '');
  
  // Remove multi-line ad components if any
  content = content.replace(/<AdSlot[\s\S]*?<\/AdSlot>/g, '');
  content = content.replace(/<NativeAd[\s\S]*?<\/NativeAd>/g, '');
  content = content.replace(/<BannerAd[\s\S]*?<\/BannerAd>/g, '');

  // Remove empty conditional rendering left behind (like in page.tsx)
  content = content.replace(/\{idx\s*>\s*0\s*&&\s*idx\s*%\s*4\s*===\s*0\s*&&\s*\(\s*\)\}/g, '');
  
  // Also try to find empty curly brace wrappers that might have been left behind.
  // We'll just be specific for the known one above.
  
  if (content !== originalContent) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Cleaned', f);
  }
});
