const fs = require('fs');
const path = require('path');

let pois = null;

function loadPOIs() {
  if (!pois) {
    try {
      const poisPath = path.join(__dirname, 'pois.json');
      if (fs.existsSync(poisPath)) {
        pois = JSON.parse(fs.readFileSync(poisPath, 'utf8'));
      } else {
        console.warn("No se encontró pois.json. Ejecuta fetch-pois.js primero.");
        pois = [];
      }
    } catch (e) {
      console.error("Error leyendo pois.json:", e);
      pois = [];
    }
  }
  return pois;
}

// Fórmula de distancia Haversine (en metros)
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // radios de la tierra en metros
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

/**
 * Calcula un puntaje de plusvalía (0 a 100) según POIs cercanos
 */
function calculatePlusvaliaScore(lat, lng) {
  if (!lat || !lng) return 50; // Default
  
  const allPois = loadPOIs();
  if (allPois.length === 0) return 50;

  let healthCount = 0;
  let eduCount = 0;
  let natureCount = 0;
  let commerceCount = 0;

  allPois.forEach(poi => {
    const dist = getDistanceInMeters(lat, lng, poi.lat, poi.lng);
    if (dist <= 1500) { // Radio de 1.5 km
      if (poi.type === 'health') healthCount++;
      if (poi.type === 'education') eduCount++;
      if (poi.type === 'nature') natureCount++;
      if (poi.type === 'commerce') commerceCount++;
    }
  });

  // Fórmula ponderada
  // Salud (30%), Edu (30%), Comercio (30%), Naturaleza (10%)
  // Maximizamos a los 5 colegios, 3 hospitales, 5 super/malls, 2 parques
  let score = 0;
  score += Math.min(healthCount, 3) * (30 / 3);
  score += Math.min(eduCount, 5) * (30 / 5);
  score += Math.min(commerceCount, 5) * (30 / 5);
  score += Math.min(natureCount, 2) * (10 / 2);

  // Aseguramos que esté entre 30 y 100 (incluso sin nada, tiene valor base)
  let finalScore = Math.max(30, Math.min(100, Math.round(score)));
  
  return {
    score: finalScore,
    details: {
      health: healthCount,
      education: eduCount,
      nature: natureCount,
      commerce: commerceCount
    }
  };
}

module.exports = {
  calculatePlusvaliaScore
};
