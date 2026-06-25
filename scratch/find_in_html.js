const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const query = 'firebase';
console.log(`Searching for "${query}" in index.html...`);
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes(query)) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
