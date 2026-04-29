const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/rups/node/frontend/src');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/\buppercase\b/g, 'capitalize');
  content = content.replace(/\bfont-normal\b/g, 'font-normal'); // already normalized
  content = content.replace(/\bfont-black\b/g, 'font-normal');
  content = content.replace(/#89C74A/g, '#FF4C3B');
  content = content.replace(/\btracking-tighter\b/g, '');
  content = content.replace(/\btracking-widest\b/g, '');
  content = content.replace(/\btracking-\[.*?\]\b/g, '');
  
  // clean up multiple spaces that might have been created
  content = content.replace(/  +/g, ' ');
  // clean up class=" " to class=""
  content = content.replace(/className=" /g, 'className="');
  content = content.replace(/ className=""/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log('Modified:', file);
  }
});

console.log('Total files modified:', modifiedCount);
