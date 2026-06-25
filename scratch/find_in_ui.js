const fs = require('fs');
const content = fs.readFileSync('js/ui.js', 'utf8');
const lines = content.split('\n');

const query = 'data-view';
console.log(`Searching for "${query}"...`);
lines.forEach((line, idx) => {
  if (line.includes(query)) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
