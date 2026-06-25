const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// INSTRUCCIONES:
// 1. Descarga tu clave de cuenta de servicio desde la consola de Firebase (Project Settings > Service Accounts).
// 2. Guárdala en esta misma carpeta backend/ como 'serviceAccountKey.json'
// 3. Ejecuta este script: node upload_to_firebase.js

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n[ERROR] No se encontró serviceAccountKey.json.');
  console.error('Por favor, descarga la clave privada desde Firebase y colócala en backend/serviceAccountKey.json\n');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadCollection(fileName, collectionName, idField = 'id', isProp = false) {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`[INFO] Archivo ${fileName} no encontrado. Saltando...`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Subiendo ${data.length} documentos a la colección '${collectionName}'...`);
  
  const batch = db.batch();
  let count = 0;

  for (const item of data) {
    if (isProp) {
       item.isScraped = true; // Forzar flag para properties
       item.feedSource = 'scraper';
       
       // Asegurar lat/lng numéricos
       if(item.lat) item.lat = Number(item.lat);
       if(item.lng) item.lng = Number(item.lng);
    }
    
    // Si item no tiene ID, se autogenera.
    const docId = (item[idField] || Date.now() + count).toString();
    const docRef = db.collection(collectionName).doc(docId);
    batch.set(docRef, item, { merge: true });
    count++;
    
    if (count % 400 === 0) {
      await batch.commit();
      console.log(`  -> Lote de 400 procesado.`);
    }
  }

  if (count % 400 !== 0) {
    await batch.commit();
  }
  
  console.log(`[ÉXITO] ${count} documentos subidos a '${collectionName}'.`);
}

async function run() {
  // Subir propiedades
  await uploadCollection('propiedades-procesadas.json', 'properties', 'id', true);
  
  // Subir noticias/macro
  await uploadCollection('market-news.json', 'market_news', 'link', false);
  
  console.log('\n¡Todos los datos han sido inyectados a Firebase!');
  process.exit(0);
}

run();
