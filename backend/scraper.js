const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// 2. CAMUFLAJE (ROTACIÓN DE USER-AGENTS)
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:121.0) Gecko/20100101 Firefox/121.0'
];

function getRandomUserAgent() {
  const index = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[index];
}

// 3. RETARDOS HUMANIZADOS
const sleepRandom = () => {
  const min = 1500;
  const max = 4500;
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`  [Anti-bot] Pausa aleatoria de ${ms}ms...`);
  return new Promise(r => setTimeout(r, ms));
};

// Listado de URLs a explorar para tener datos variados (diferentes contextos)
const TARGETS = [
  // --- VENTAS ---
  { url: 'https://www.infocasas.com.py/venta/inmuebles/asuncion', label: 'Venta Inmuebles Asunción' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/luque', label: 'Venta Inmuebles Luque' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/lambare', label: 'Venta Inmuebles Lambaré' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/san-lorenzo', label: 'Venta Inmuebles San Lorenzo' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/fernando-de-la-mora', label: 'Venta Inmuebles Fernando de la Mora' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/mariano-roque-alonso', label: 'Venta Inmuebles Mariano Roque Alonso' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/capiata', label: 'Venta Inmuebles Capiatá' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/nemby', label: 'Venta Inmuebles Ñemby' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/villa-elisa', label: 'Venta Inmuebles Villa Elisa' },
  { url: 'https://www.infocasas.com.py/venta/inmuebles/limpio', label: 'Venta Inmuebles Limpio' },

  // --- ALQUILERES ---
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/asuncion', label: 'Alquiler Inmuebles Asunción' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/luque', label: 'Alquiler Inmuebles Luque' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/lambare', label: 'Alquiler Inmuebles Lambaré' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/san-lorenzo', label: 'Alquiler Inmuebles San Lorenzo' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/fernando-de-la-mora', label: 'Alquiler Inmuebles Fernando de la Mora' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/mariano-roque-alonso', label: 'Alquiler Inmuebles Mariano Roque Alonso' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/capiata', label: 'Alquiler Inmuebles Capiatá' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/nemby', label: 'Alquiler Inmuebles Ñemby' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/villa-elisa', label: 'Alquiler Inmuebles Villa Elisa' },
  { url: 'https://www.infocasas.com.py/alquiler/inmuebles/limpio', label: 'Alquiler Inmuebles Limpio' }
];

async function scrapeAll() {
  console.log(`Iniciando extracción masiva con PAGINACIÓN en ${TARGETS.length} categorías...`);
  
  const propertiesMap = new Map(); // Usar Map para deduplicar por ID de inmueble
  const MAX_PAGES = 20;

  for (let i = 0; i < TARGETS.length; i++) {
    const target = TARGETS[i];
    let page = 1;
    let keepScraping = true;
    
    console.log(`\n[${i + 1}/${TARGETS.length}] Explorando categoría: ${target.label}...`);

    while (keepScraping && page <= MAX_PAGES) {
      // 1. FALTA DE PAGINACIÓN: Iterar páginas
      const currentUrl = page === 1 ? target.url : `${target.url}/pagina-${page}`;
      console.log(`  -> Obteniendo página ${page}: ${currentUrl}`);
      
      try {
        const response = await axios.get(currentUrl, {
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
          },
          timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();
        let extractedCount = 0;

        if (nextDataScript) {
          try {
            const nextData = JSON.parse(nextDataScript);
            let listings = null;
            
            if (nextData.props && nextData.props.pageProps && nextData.props.pageProps.fetchResult && nextData.props.pageProps.fetchResult.searchFast && nextData.props.pageProps.fetchResult.searchFast.data) {
              listings = nextData.props.pageProps.fetchResult.searchFast.data;
            }
            
            if (!listings || listings.length === 0) {
              listings = findListingsInObject(nextData);
            }

            if (listings && listings.length > 0) {
              listings.forEach(item => {
                const parsed = parseNextListing(item);
                if (parsed && parsed.id && parsed.price > 0) {
                  // Si la URL origen define el tipo u op, los usamos como fallback
                  if (target.label.includes('Alquiler')) parsed.op = 'Alquiler';
                  if (target.label.includes('Venta')) parsed.op = 'Venta';
                  if (target.label.includes('Casas')) parsed.type = 'Casa';
                  if (target.label.includes('Deptos')) parsed.type = 'Departamento';
                  
                  if (!propertiesMap.has(parsed.id)) {
                    propertiesMap.set(parsed.id, parsed);
                    extractedCount++;
                  }
                }
              });
            }
          } catch (jsonErr) {
            console.error(`  [!] Error al procesar JSON en la pág ${page}:`, jsonErr.message);
          }
        }

        // Fallback clásico HTML si no se extrajo nada con NEXT_DATA
        if (extractedCount === 0) {
          $('.propiedad-card, .listing-card, [class*="card"], article').each((idx, el) => {
            const card = $(el);
            const title = card.find('h2, h3, [class*="title"]').text().trim();
            const priceText = card.find('[class*="price"], [class*="precio"]').text().trim();
            const location = card.find('[class*="location"], [class*="direccion"], [class*="address"]').text().trim();
            const img = card.find('img').attr('src') || card.find('img').attr('data-src');
            const link = card.find('a').attr('href');

            // Filtrar menús falsos
            if (title && priceText && !['Venta', 'Alquiler', 'Proyectos', 'Inmobiliarias', 'Noticias'].includes(title)) {
              const price = parsePrice(priceText);
              if (price > 0) {
                const id = link ? Array.from(link).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0) : Date.now() + Math.floor(Math.random() * 100000);
                
                if (!propertiesMap.has(id)) {
                  const op = target.label.includes('Alquiler') ? 'Alquiler' : 'Venta';
                  const type = target.label.includes('Casas') ? 'Casa' : 'Departamento';
                  
                  let city = 'Asunción';
                  if (target.label.includes('Luque')) city = 'Luque';
                  else if (target.label.includes('Lambaré')) city = 'Lambaré';
                  else if (target.label.includes('San Lorenzo')) city = 'San Lorenzo';
                  else if (target.label.includes('Fernando de la Mora')) city = 'Fernando de la Mora';
                  else if (target.label.includes('Mariano Roque Alonso')) city = 'Mariano Roque Alonso';
                  else if (target.label.includes('Capiatá')) city = 'Capiatá';
                  else if (target.label.includes('Ñemby')) city = 'Ñemby';
                  else if (target.label.includes('Villa Elisa')) city = 'Villa Elisa';
                  else if (target.label.includes('Limpio')) city = 'Limpio';

                  propertiesMap.set(id, {
                    id,
                    title,
                    address: location || `${city}, Paraguay`,
                    neighborhood: city,
                    city: city,
                    price,
                    img: img || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                    link: link ? (link.startsWith('http') ? link : `https://www.infocasas.com.py${link}`) : '',
                    op,
                    type,
                    rooms: 2,
                    baths: 1,
                    m2: 60,
                    lat: -25.2867,
                    lng: -57.6111
                  });
                  extractedCount++;
                }
              }
            }
          });
        }

        console.log(`    Se agregaron ${extractedCount} inmuebles nuevos. Total único: ${propertiesMap.size}`);
        
        if (extractedCount === 0) {
          console.log(`    No se encontraron más resultados nuevos en la pág ${page}. Pasando a la siguiente categoría...`);
          keepScraping = false;
        }

      } catch (err) {
        if (err.response && err.response.status === 404) {
           console.log(`    Fin de la paginación (404) en la pág ${page}.`);
           keepScraping = false;
        } else {
           console.error(`    Error HTTP en pág ${page}:`, err.message);
           keepScraping = false;
        }
      }

      if (keepScraping) {
        page++;
        await sleepRandom();
      }
    }
  }

  // Guardar todas las propiedades deduplicadas
  const allProperties = Array.from(propertiesMap.values());
  const outputPath = path.join(__dirname, 'propiedades-extraidas.json');
  fs.writeFileSync(outputPath, JSON.stringify(allProperties, null, 2), 'utf-8');
  console.log(`\n¡Extracción masiva finalizada! Se guardaron ${allProperties.length} propiedades únicas en: ${outputPath}`);
}

// Buscar de forma recursiva listados de inmuebles dentro del objeto NEXT_DATA
function findListingsInObject(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  if (Array.isArray(obj)) {
    if (obj.length > 0 && obj[0] && typeof obj[0] === 'object' && obj[0].price_amount_usd && obj[0].latitude) {
      return obj;
    }
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const result = findListingsInObject(obj[key]);
      if (result) return result;
    }
  }
  return null;
}

// Convertir una propiedad extraída de __NEXT_DATA__
function parseNextListing(item) {
  let price = 0;
  if (item.price_amount_usd) {
    price = item.price_amount_usd;
  } else if (item.price && typeof item.price === 'object') {
    price = item.price.amount || 0;
  } else if (item.price) {
    price = parsePrice(item.price);
  }

  let type = 'Departamento';
  if (item.property_type && typeof item.property_type === 'object') {
    type = item.property_type.name || 'Departamento';
  } else if (item.property_type) {
    type = item.property_type;
  }

  let op = 'Venta';
  if (item.operation_type && typeof item.operation_type === 'object') {
    op = item.operation_type.name || 'Venta';
  } else if (item.operation_type) {
    op = item.operation_type;
  }

  let neighborhood = 'Asunción';
  if (item.locations && item.locations.neighbourhood && item.locations.neighbourhood.length > 0) {
    neighborhood = item.locations.neighbourhood[0].name;
  } else if (item.technicalSheet) {
    const field = item.technicalSheet.find(x => x.field === 'neighborhood_name');
    if (field && field.value) {
      neighborhood = field.value;
    }
  }

  let city = 'Asunción';
  const addrLower = (item.address || '').toLowerCase();
  if (addrLower.includes('luque')) city = 'Luque';
  else if (addrLower.includes('lambare')) city = 'Lambaré';
  else if (addrLower.includes('san lorenzo')) city = 'San Lorenzo';
  else if (addrLower.includes('fernando de la mora')) city = 'Fernando de la Mora';
  else if (addrLower.includes('mariano roque alonso')) city = 'Mariano Roque Alonso';
  else if (addrLower.includes('capiata')) city = 'Capiatá';
  else if (addrLower.includes('nemby')) city = 'Ñemby';
  else if (addrLower.includes('villa elisa')) city = 'Villa Elisa';
  else if (addrLower.includes('limpio')) city = 'Limpio';
  else if (item.locations) {
    if (item.locations.city && item.locations.city.length > 0) {
      city = item.locations.city[0].name;
    } else if (item.locations.state && item.locations.state.length > 0) {
      const sName = item.locations.state[0].name;
      if (sName !== 'Asunción' && sName !== 'Central') {
        city = sName;
      }
    }
  }

  return {
    id: item.id || Date.now(),
    title: item.title || `${type} en ${neighborhood}`,
    address: item.address || `${neighborhood}, Paraguay`,
    neighborhood: neighborhood,
    city: city,
    price: price,
    img: item.img || (item.images && item.images.length > 0 ? item.images[0].image : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'),
    link: item.link ? (item.link.startsWith('http') ? item.link : `https://www.infocasas.com.py${item.link}`) : '',
    op: op,
    type: type,
    rooms: item.bedrooms || item.rooms || 2,
    baths: item.bathrooms || 1,
    m2: item.m2 || item.m2Built || 60,
    lat: item.latitude || -25.2867,
    lng: item.longitude || -57.6111
  };
}

// Helper para limpiar precios
function parsePrice(text) {
  if (!text) return 0;
  if (typeof text === 'number') return text;
  const clean = text.replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

scrapeAll();
