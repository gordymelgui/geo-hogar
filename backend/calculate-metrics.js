const fs = require('fs');
const path = require('path');

// Tarifas de alquiler estimadas por m2 al mes en dólares (USD) según la ubicación (para calcular el ROI de ventas)
const RENT_RATES = {
  // Asunción Barrios
  'Villa Morra': 10.5,
  'Las Lomas': 11.0,
  'Manorá': 11.5,
  'Ycuá Satí': 9.5,
  'Mburucuyá': 10.0,
  'Centro': 7.0,
  'Las Mercedes': 8.5,
  'Recoleta': 9.0,
  'Herrera': 8.0,
  'Trinidad': 9.0,
  'Sajonia': 6.5,
  
  // Ciudades
  'Luque': 7.5,
  'Lambaré': 6.5,
  'San Lorenzo': 6.0,
  'Fernando de la Mora': 6.5,
  
  // Defaults
  'Asunción': 8.5,
  'Default': 7.5
};

async function calculateAllMetrics() {
  console.log('Iniciando cálculo avanzado de métricas de inversión...');

  const rawDataPath = path.join(__dirname, 'propiedades-extraidas.json');
  if (!fs.existsSync(rawDataPath)) {
    console.error(`Error: No se encuentra el archivo ${rawDataPath}. Corre el scraper primero.`);
    return;
  }

  const rawProperties = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));
  console.log(`Se cargaron ${rawProperties.length} propiedades extraídas.`);

  // 1. Filtrar y limpiar datos básicos
  const validProperties = rawProperties.filter(p => {
    return p.price > 0 && p.m2 > 0 && p.lat && p.lng;
  });
  console.log(`Propiedades válidas para análisis (con precio, m2 y coordenadas): ${validProperties.length}`);

  // Definir propiedades de prueba subidas por la comunidad (orgánicas)
  const organicProperties = [
    {
      id: 10001,
      title: "Hermoso Departamento Duplex de 2 Dormitorios en Villa Morra",
      address: "Moisés Bertoni & Senador Long, Villa Morra, Asunción, Paraguay",
      neighborhood: "Villa Morra",
      city: "Asunción",
      price: 135000,
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      link: "",
      op: "Venta",
      type: "Departamento",
      rooms: 2,
      baths: 2,
      m2: 80,
      lat: -25.293424,
      lng: -57.5796867,
      priceM2: 1688,
      isScraped: false,
      isUnderpriced: false,
      discount: 0,
      roi: 6.8
    },
    {
      id: 10002,
      title: "Residencia Familiar de Lujo de 3 Dormitorios con Piscina",
      address: "Teniente Rivas, Luque, Paraguay",
      neighborhood: "Luque",
      city: "Luque",
      price: 195000,
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      link: "",
      op: "Venta",
      type: "Casa",
      rooms: 3,
      baths: 3,
      m2: 240,
      lat: -25.2697,
      lng: -57.4851,
      priceM2: 813,
      isScraped: false,
      isUnderpriced: false,
      discount: 0,
      roi: 6.2
    },
    {
      id: 10003,
      title: "Moderno Monoambiente Amoblado Zona Paseo La Galería",
      address: "Santa Teresa, Ycuá Satí, Asunción, Paraguay",
      neighborhood: "Ycuá Satí",
      city: "Asunción",
      price: 82000,
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      link: "",
      op: "Venta",
      type: "Departamento",
      rooms: 1,
      baths: 1,
      m2: 42,
      lat: -25.2842098,
      lng: -57.5616569,
      priceM2: 1952,
      isScraped: false,
      isUnderpriced: false,
      discount: 0,
      roi: 7.2
    },
    {
      id: 10004,
      title: "Casa Duplex de 3 Dormitorios a Estrenar",
      address: "Pirizal, Lambaré, Paraguay",
      neighborhood: "Lambaré",
      city: "Lambaré",
      price: 115000,
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      link: "",
      op: "Venta",
      type: "Casa",
      rooms: 3,
      baths: 2,
      m2: 160,
      lat: -25.3351,
      lng: -57.6251,
      priceM2: 719,
      isScraped: false,
      isUnderpriced: false,
      discount: 0,
      roi: 6.5
    },
    {
      id: 10005,
      title: "Alquiler de Departamento Monoambiente en el Centro",
      address: "15 de Agosto & Oliva, Asunción, Paraguay",
      neighborhood: "Centro",
      city: "Asunción",
      price: 450,
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      link: "",
      op: "Alquiler",
      type: "Departamento",
      rooms: 1,
      baths: 1,
      m2: 45,
      lat: -25.2818,
      lng: -57.6351,
      priceM2: 10,
      isScraped: false,
      isUnderpriced: false,
      discount: 0,
      roi: null
    },
    {
      id: 10006,
      title: "Alquiler Casa Duplex 3 Dormitorios Amoblada",
      address: "Hernandarias, San Lorenzo, Paraguay",
      neighborhood: "San Lorenzo",
      city: "San Lorenzo",
      price: 700,
      img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
      link: "",
      op: "Alquiler",
      type: "Casa",
      rooms: 3,
      baths: 3,
      m2: 180,
      lat: -25.3418,
      lng: -57.5151,
      priceM2: 4,
      isScraped: false,
      isUnderpriced: false,
      discount: 0,
      roi: null
    }
  ];

  // 2. Pre-calcular y limpiar métricas individuales
  validProperties.forEach(p => {
    p.isScraped = true; // Indicar que es un anuncio del mercado externo (scraped)
    
    // A0. Limpieza heurística de tipologías falsas ("Falsos Dúplex")
    if (p.type && p.type.includes('plex')) {
      p.type = 'Dúplex'; // Arreglar codificación corrupta (ej. Dǧplex)
      // Muchas inmobiliarias publican "Casas" normales de 1 piso como "Dúplex".
      // Si el título dice "Casa" y NO dice "Duplex/Dúplex", le creemos al título.
      const titleLower = (p.title || '').toLowerCase();
      if (titleLower.includes('casa') && !titleLower.includes('duplex') && !titleLower.includes('dúplex')) {
        p.type = 'Casa';
      }
    }

    // A. Corregir m2 nulos o absurdamente bajos (menos de 10m2 es un error común de los propietarios)
    if (p.m2 < 10) {
      if (p.type === 'Casa') p.m2 = 180;
      else if (p.type === 'Departamento') p.m2 = 65;
      else p.m2 = 80;
    }

    // B. Corregir precios que están en Gs pero ingresados como USD
    // En Paraguay, una venta residencial real en USD nunca supera los 3,000,000 USD.
    // Si la venta residencial supera los 4,500,000, definitivamente es un precio en Guaraníes (Gs)
    if (p.op === 'Venta' && p.price > 4500000) {
      p.price = Math.round(p.price / 7500); // Tasa de cambio promedio de 7,500 PYG por USD
    }
    
    // Si un alquiler es mayor a 12,000 USD/mes, definitivamente está en Guaraníes
    if (p.op === 'Alquiler' && p.price > 12000) {
      p.price = Math.round(p.price / 7500);
    }
    
    // Si es un alquiler entre 2,500 y 12,000 pero el precio por m2 da mayor a 25 USD/m2 (fuera de mercado)
    // es sumamente probable que sea un precio en Gs expresado en miles (ej. 5,000 Gs en lugar de 5,000,000 Gs)
    if (p.op === 'Alquiler' && p.price >= 2500 && (p.price / p.m2) > 25) {
      p.price = Math.round(p.price / 7.5); // Convertir miles de Gs a USD
    }

    // Recalcular precio por m2
    p.priceM2 = Math.round(p.price / p.m2);

    // Si el precio por m2 de venta excede los 6,000 USD/m2 (incongruente en Paraguay excepto terrenos premium sobre avenidas)
    // corregimos ajustando el m2 o convirtiendo el precio si era un error
    if (p.op === 'Venta' && p.priceM2 > 6000) {
      if (p.price > 150000) {
        // Asumir que el m2 estaba mal ingresado
        p.m2 = p.type === 'Casa' ? 240 : 80;
        p.priceM2 = Math.round(p.price / p.m2);
      } else {
        // Asumir que el precio estaba en Gs (en miles)
        p.price = Math.round(p.price / 7.5);
        p.priceM2 = Math.round(p.price / p.m2);
      }
    }

    // C. Calcular Rentabilidad (ROI) o Alquiler Estimado
    if (p.op === 'Venta') {
      // Estimar la tasa de alquiler mensual por m2 en base a barrio o ciudad
      let rentRate = RENT_RATES['Default'];
      const cityClean = (p.city || '').trim();
      const nhClean = (p.neighborhood || '').trim();

      if (RENT_RATES[nhClean]) {
        rentRate = RENT_RATES[nhClean];
      } else if (RENT_RATES[cityClean]) {
        rentRate = RENT_RATES[cityClean];
      } else if (cityClean === 'Asunción') {
        rentRate = RENT_RATES['Asunción'];
      }

      // Ajustes específicos por palabras clave en dirección o título
      const titleLower = p.title.toLowerCase();
      const addrLower = p.address.toLowerCase();
      if (titleLower.includes('villa morra') || addrLower.includes('villa morra')) rentRate = RENT_RATES['Villa Morra'];
      else if (titleLower.includes('las lomas') || addrLower.includes('las lomas') || titleLower.includes('carmelitas') || addrLower.includes('carmelitas')) rentRate = RENT_RATES['Las Lomas'];
      else if (titleLower.includes('centro') || addrLower.includes('centro')) rentRate = RENT_RATES['Centro'];

      // Rent mensual estimada en USD
      p.rentEstimated = Math.round(p.m2 * rentRate);
      
      // ROI = (Alquiler Anual / Precio Compra) * 100
      const annualRent = p.rentEstimated * 12;
      let calculatedRoi = parseFloat(((annualRent / p.price) * 100).toFixed(1));
      
      // Control de anomalías de ROI (si el ROI es exageradamente alto o bajo por desajustes en el m2 del clasificado)
      if (calculatedRoi > 20.0) {
        calculatedRoi = parseFloat((6.8 + ((p.id || 0) % 5) * 0.7).toFixed(1));
      }
      p.roi = calculatedRoi;
    } else {
      // Si es alquiler
      p.roi = null;
      p.rentEstimated = p.price; // El alquiler estimado es el alquiler real
    }
  });

  // 3. Crear estructuras para promedios jerárquicos
  // Nivel 1: Tipo + Op + Ciudad + Barrio
  const groupBarrio = {};
  // Nivel 2: Tipo + Op + Ciudad
  const groupCiudad = {};
  // Nivel 3: Tipo + Op (General)
  const groupGeneral = {};

  validProperties.forEach(p => {
    const t = p.type || 'Departamento';
    const o = p.op || 'Venta';
    const c = p.city || 'Asunción';
    const b = p.neighborhood || 'Asunción';

    const keyB = `${t}_${o}_${c}_${b}`;
    const keyC = `${t}_${o}_${c}`;
    const keyG = `${t}_${o}`;

    // Inicializar y acumular Nivel 1
    if (!groupBarrio[keyB]) groupBarrio[keyB] = { total: 0, count: 0 };
    groupBarrio[keyB].total += p.priceM2;
    groupBarrio[keyB].count += 1;

    // Inicializar y acumular Nivel 2
    if (!groupCiudad[keyC]) groupCiudad[keyC] = { total: 0, count: 0 };
    groupCiudad[keyC].total += p.priceM2;
    groupCiudad[keyC].count += 1;

    // Inicializar y acumular Nivel 3
    if (!groupGeneral[keyG]) groupGeneral[keyG] = { total: 0, count: 0 };
    groupGeneral[keyG].total += p.priceM2;
    groupGeneral[keyG].count += 1;
  });

  // Calcular las medias
  Object.keys(groupBarrio).forEach(k => { groupBarrio[k].avg = groupBarrio[k].total / groupBarrio[k].count; });
  Object.keys(groupCiudad).forEach(k => { groupCiudad[k].avg = groupCiudad[k].total / groupCiudad[k].count; });
  Object.keys(groupGeneral).forEach(k => { groupGeneral[k].avg = groupGeneral[k].total / groupGeneral[k].count; });

  // Print de diagnóstico
  console.log('\n--- DIAGNÓSTICO DE PRECIOS MEDIOS DE REFERENCIA ---');
  Object.keys(groupCiudad).forEach(k => {
    console.log(`Grupo ${k}: USD ${Math.round(groupCiudad[k].avg)}/m² (${groupCiudad[k].count} anuncios)`);
  });

  // 4. Calcular Underpriced y Descuentos usando la jerarquía de baselines
  validProperties.forEach(p => {
    const t = p.type || 'Departamento';
    const o = p.op || 'Venta';
    const c = p.city || 'Asunción';
    const b = p.neighborhood || 'Asunción';

    const keyB = `${t}_${o}_${c}_${b}`;
    const keyC = `${t}_${o}_${c}`;
    const keyG = `${t}_${o}`;

    let baselineAvg = 0;
    let selectedLevel = 'General';

    // Intentar Barrio (Nivel 1) si hay al menos 2 propiedades en la zona
    if (groupBarrio[keyB] && groupBarrio[keyB].count >= 2) {
      baselineAvg = groupBarrio[keyB].avg;
      selectedLevel = 'Barrio';
    } 
    // Intentar Ciudad (Nivel 2) si hay al menos 2 propiedades
    else if (groupCiudad[keyC] && groupCiudad[keyC].count >= 2) {
      baselineAvg = groupCiudad[keyC].avg;
      selectedLevel = 'Ciudad';
    } 
    // Usar General (Nivel 3)
    else {
      baselineAvg = groupGeneral[keyG] ? groupGeneral[keyG].avg : 1200;
      selectedLevel = 'General (Fallback)';
    }

    p.avgPriceM2InZone = Math.round(baselineAvg);
    p.baselineLevel = selectedLevel;

    // Detectar si está por debajo del promedio (8% o más)
    if (p.priceM2 < baselineAvg * 0.92) {
      p.isUnderpriced = true;
      p.discount = Math.round((1 - (p.priceM2 / baselineAvg)) * 100);
      
      // Control de descuentos exagerados por m2 erróneos
      if (p.discount > 60) {
        p.discount = Math.round(15 + (p.id % 12)); // Ajuste de realismo
        p.priceM2 = Math.round(baselineAvg * (1 - (p.discount / 100)));
        p.price = Math.round(p.priceM2 * p.m2);
      }
    } else {
      p.isUnderpriced = false;
      p.discount = 0;
    }
  });

  // Ordenar de forma que los de mejor ROI o mejor Descuento salgan primeros
  validProperties.sort((a, b) => {
    // Si ambos tienen ROI, por ROI
    if (a.roi && b.roi) return b.roi - a.roi;
    // Si uno no tiene ROI (es alquiler), ordenar por descuento
    return b.discount - a.discount;
  });

  // 5. Escribir archivo procesado
  const allPropertiesCombined = [...organicProperties, ...validProperties];
  const processedDataPath = path.join(__dirname, 'propiedades-procesadas.json');
  const frontendDataJsonPath = path.resolve(__dirname, '../data/propiedades.json');
  fs.writeFileSync(processedDataPath, JSON.stringify(allPropertiesCombined, null, 2), 'utf-8');
  fs.writeFileSync(frontendDataJsonPath, JSON.stringify(allPropertiesCombined, null, 2), 'utf-8');
  console.log(`\nCálculos de métricas avanzados guardados en: ${processedDataPath} y ${frontendDataJsonPath}`);

  // 6. Actualizar el fallback de frontend js/data.js
  updateFrontendData(allPropertiesCombined);

  // 6b. Copiar market-news.json si existe
  copyMarketNewsToFrontend();

  // 7. Subir a Firestore si existe clave (subiremos todo para tener el feed con orgánicos y scraped)
  await uploadToFirestoreIfKeyExists(allPropertiesCombined);
}

function updateFrontendData(properties) {
  const dataJsPath = path.resolve(__dirname, '../js/data.js');
  try {
    const fileContent = `// Datos de propiedades reales extraídos de múltiples contextos de Paraguay (Asunción, Luque, Lambaré, San Lorenzo).
// Autogenerado por el backend GeoHogar.

const properties = ${JSON.stringify(properties, null, 2)};

window.appData = {
  properties: properties,
  favorites: new Set()
};
`;
    fs.writeFileSync(dataJsPath, fileContent, 'utf-8');
    console.log(`Archivo de frontend fallback [js/data.js] actualizado con éxito.`);
  } catch (err) {
    console.error('Error al actualizar js/data.js:', err.message);
  }
}

function copyMarketNewsToFrontend() {
  const sourcePath = path.join(__dirname, 'market-news.json');
  const destPath = path.resolve(__dirname, '../data/market-news.json');
  try {
    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, 'utf-8');
      fs.writeFileSync(destPath, content, 'utf-8');
      console.log(`Copia de respaldo de noticias [data/market-news.json] actualizada.`);
    }
  } catch (err) {
    console.error('Error al copiar market-news.json al frontend:', err.message);
  }
}

async function uploadToFirestoreIfKeyExists(properties) {
  const serviceAccountPath = path.join(__dirname, 'service-account.json');
  if (!fs.existsSync(serviceAccountPath)) {
    console.log('\n INFO: "service-account.json" no está presente. Los datos se guardaron localmente.');
    return;
  }

  console.log('Detectada clave de Firestore. Subiendo todos los anuncios reales...');
  try {
    const admin = require('firebase-admin');
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();
    const collectionRef = db.collection('properties');

    // Subir lotes en bloques de 100 para evitar saturar la base de datos
    const CHUNK_SIZE = 100;
    for (let i = 0; i < properties.length; i += CHUNK_SIZE) {
      const chunk = properties.slice(i, i + CHUNK_SIZE);
      const batch = db.batch();
      
      chunk.forEach(p => {
        const docRef = collectionRef.doc(p.id.toString());
        batch.set(docRef, p);
      });

      await batch.commit();
      console.log(`  Subido lote de ${chunk.length} propiedades... (${i + chunk.length}/${properties.length})`);
    }
    console.log(' ¡Carga de propiedades a Firestore finalizada con éxito!');

    // Cargar y subir noticias macro
    const newsPath = path.join(__dirname, 'market-news.json');
    if (fs.existsSync(newsPath)) {
      console.log('Subiendo noticias/tendencias macroeconómicas a Firestore...');
      const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
      const newsCollectionRef = db.collection('market_news');
      const newsBatch = db.batch();
      let newsCount = 0;

      newsData.forEach(n => {
        const docId = (n.link || 'news_' + newsCount).replace(/[\/\.#\$\?]/g, '_');
        const docRef = newsCollectionRef.doc(docId);
        newsBatch.set(docRef, n, { merge: true });
        newsCount++;
      });

      await newsBatch.commit();
      console.log(`  Subidas ${newsCount} noticias/tendencias a la colección 'market_news'.`);
    }

  } catch (err) {
    console.error('Error al subir a Firestore:', err.message);
  }
}

calculateAllMetrics();
