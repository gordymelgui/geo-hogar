const fs = require('fs');
const path = require('path');
const https = require('https');

// Bounding box para Asunción y Gran Asunción (aprox)
// minLat, minLng, maxLat, maxLng
const BBOX = "-25.4,-57.7,-25.1,-57.4"; 

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Query to get amenities (hospitals, schools, etc) and leisure (parks)
const query = `
  [out:json][timeout:25];
  (
    node["amenity"="hospital"](${BBOX});
    node["amenity"="clinic"](${BBOX});
    node["amenity"="school"](${BBOX});
    node["amenity"="university"](${BBOX});
    node["leisure"="park"](${BBOX});
    node["shop"="supermarket"](${BBOX});
    node["shop"="mall"](${BBOX});
  );
  out body;
  >;
  out skel qt;
`;

async function fetchPOIs() {
  console.log("Descargando Puntos de Interés (POIs) desde OpenStreetMap...");
  
  const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'GeoHogar-POI-Scraper/1.0'
    }
  });
  
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Overpass API Error: ${res.status} - ${errText}`);
  }
  
  const json = await res.json();
  return json.elements;
}

async function main() {
  try {
    const elements = await fetchPOIs();
    const pois = elements.filter(e => e.type === 'node' && e.tags).map(e => {
      let type = 'other';
      if (e.tags.amenity === 'hospital' || e.tags.amenity === 'clinic') type = 'health';
      else if (e.tags.amenity === 'school' || e.tags.amenity === 'university') type = 'education';
      else if (e.tags.leisure === 'park') type = 'nature';
      else if (e.tags.shop === 'supermarket' || e.tags.shop === 'mall') type = 'commerce';
      
      return {
        id: e.id,
        lat: e.lat,
        lng: e.lon,
        name: e.tags.name || 'Unnamed',
        type: type
      };
    });
    
    const outPath = path.join(__dirname, 'pois.json');
    fs.writeFileSync(outPath, JSON.stringify(pois, null, 2));
    console.log(`Guardados ${pois.length} POIs en ${outPath}`);
  } catch (err) {
    console.error("Error fetching POIs:", err);
  }
}

main();
