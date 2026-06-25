const fs = require('fs');

const data = JSON.parse(fs.readFileSync('next-props-structure.json', 'utf-8'));
const searchData = data.fetchResult.searchFast.data;

if (searchData && searchData.length > 0) {
  const item = searchData[0];
  console.log('Todas las claves del primer item de searchFast.data:');
  console.log(Object.keys(item));
  
  console.log('\nValores seleccionados importantes:');
  console.log('ID:', item.id);
  console.log('Título:', item.title);
  console.log('Dirección:', item.address);
  console.log('Coordenadas (lat, lng):', item.latitude, item.longitude);
  console.log('Precios (price, currency):', item.price, item.currency, item.priceUSD);
  console.log('Habitaciones / Dormitorios:', item.bedrooms, item.rooms);
  console.log('Baños:', item.bathrooms);
  console.log('m2 (construidos, terreno):', item.builtArea, item.landArea, item.m2);
  console.log('Imágenes (mainImage, images):', item.mainImage, item.images ? item.images.length : 0);
  if (item.mainImage) {
    console.log('Detalle de mainImage:', item.mainImage);
  }
} else {
  console.log('No hay items en searchFast.data');
}
