const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') processDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const origContent = content;
      // Also remove literal emoji characters
      const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;
      
      content = content.replace(emojiRegex, '');
      
      // In the grep output I saw things like "Precios/m" or "ROI: "
      // If there are exactly two question marks followed by a space, it might be an artifact of encoding.
      // Emojis often become in some terminal outputs, but let's check if they are literally in the file.
      content = content.replace(/\?\? /g, '');

      // Replace specific known emojis that might have bypassed if not covered by regex
      // (some emojis are in different ranges like   )
      content = content.replace(/[]/g, '');

      if (content !== origContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Cleaned ${file}`);
      }
    }
  }
}

processDir(__dirname);
console.log('Done cleaning emojis from all files.');
