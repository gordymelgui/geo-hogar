const fs = require('fs');

const data = JSON.parse(fs.readFileSync('next-props-structure.json', 'utf-8'));

console.log('Claves en fetchResult:', data.fetchResult ? Object.keys(data.fetchResult) : 'No existe');
if (data.fetchResult && data.fetchResult.searchFast) {
  console.log('Claves en fetchResult.searchFast:', Object.keys(data.fetchResult.searchFast));
  const searchData = data.fetchResult.searchFast.data;
  if (Array.isArray(searchData)) {
    console.log('searchFast.data tiene', searchData.length, 'elementos');
    console.log('Primer elemento de searchFast.data:', JSON.stringify(searchData[0], null, 2).slice(0, 800));
  } else {
    console.log('searchFast.data no es un array, es:', typeof searchData);
  }
}

console.log('\nClaves en apolloState (primeras 30):');
if (data.apolloState) {
  const keys = Object.keys(data.apolloState);
  console.log(keys.slice(0, 30));
  
  // Buscar claves que parezcan inmuebles o propiedades
  const inmuebleKeys = keys.filter(k => k.toLowerCase().includes('inmueble') || k.toLowerCase().includes('listing') || k.toLowerCase().includes('prop'));
  console.log('\nClaves que coinciden con inmuebles/listings:', inmuebleKeys.slice(0, 10));
  if (inmuebleKeys.length > 0) {
    console.log('Detalle del primer inmueble encontrado en apolloState:', JSON.stringify(data.apolloState[inmuebleKeys[0]], null, 2).slice(0, 600));
  }
}
