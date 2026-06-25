const fs = require('fs');
const props = JSON.parse(fs.readFileSync('data/propiedades.json', 'utf8'));

const neighborhoodData = {};

props.forEach(p => {
  let zone = p.neighborhood || 'Otros';
  if (zone.toLowerCase().includes('sati') || zone.toLowerCase().includes('ycua')) {
    zone = 'Ycuá Satí';
  }
  if (!neighborhoodData[zone]) {
    neighborhoodData[zone] = { totalSalePriceM2: 0, saleCount: 0, rentPrices: [], rentCount: 0 };
  }
  
  const pm2 = p.priceM2 || (p.price && p.m2 && p.m2 > 0 ? p.price / p.m2 : 0);
  if (p.op === 'Venta') {
    if (pm2 > 0) {
      neighborhoodData[zone].totalSalePriceM2 += pm2;
      neighborhoodData[zone].saleCount++;
    }
  } else if (p.op === 'Alquiler') {
    neighborhoodData[zone].rentPrices.push(p.price);
    neighborhoodData[zone].rentCount++;
  }
});

console.log('--- NEIGHBORHOOD STATS ---');
for (const [name, data] of Object.entries(neighborhoodData)) {
  const avgSaleM2 = data.saleCount > 0 ? Math.round(data.totalSalePriceM2 / data.saleCount) : 0;
  const avgRent = data.rentCount > 0 ? Math.round(data.rentPrices.reduce((a,b)=>a+b,0) / data.rentCount) : 0;
  if (data.saleCount > 0 || data.rentCount > 0) {
    console.log(`${name}: Avg Sale USD/m² = ${avgSaleM2} (count: ${data.saleCount}), Avg Rent USD = ${avgRent} (count: ${data.rentCount})`);
  }
}
