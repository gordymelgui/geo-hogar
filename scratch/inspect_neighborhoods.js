const fs = require('fs');
const props = JSON.parse(fs.readFileSync('data/propiedades.json', 'utf8'));

const neighborhoods = {};
const cities = {};
const types = {};

props.forEach(p => {
  const n = p.neighborhood || 'N/A';
  const c = p.city || 'N/A';
  const t = p.type || 'N/A';

  neighborhoods[n] = (neighborhoods[n] || 0) + 1;
  cities[c] = (cities[c] || 0) + 1;
  types[t] = (types[t] || 0) + 1;
});

console.log('--- CITIES ---');
console.log(cities);
console.log('--- NEIGHBORHOODS ---');
console.log(neighborhoods);
console.log('--- TYPES ---');
console.log(types);
