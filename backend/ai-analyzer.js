require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

/**
 * Analiza la descripción de una propiedad y extrae tags de valor para inversores.
 * @param {string} description 
 * @returns {Promise<string[]>} Array de tags
 */
async function analyzePropertyDescription(description) {
  if (!model || !description || description.length < 20) {
    return [];
  }

  const prompt = `
  Eres un analista inmobiliario experto. Analiza la siguiente descripción de una propiedad en Paraguay y extrae EXACTAMENTE y ÚNICAMENTE una lista en formato JSON (array de strings) con las etiquetas (tags) de oportunidad de inversión aplicables.
  
  Opciones permitidas de tags (sólo usa estas si aplican, si no, devuelve array vacío []):
  - "Oportunidad de Flipping" (si dice a refaccionar, a demoler, necesita arreglos, ideal constructores, terreno)
  - "Vendedor Motivado" (si dice urge, motivo de viaje, remate, oferta por tiempo limitado)
  - "Financiación Propia" (si dice financio, financiación propia, a cuotas, sin bancos)
  - "Ideal Rentistas" (si dice ya alquilado, con renta asegurada, ideal para alquiler)
  
  Devuelve SOLO un array JSON válido sin formato markdown ni backticks. Ejemplo: ["Oportunidad de Flipping", "Vendedor Motivado"]. Si no aplica nada, devuelve [].

  Descripción de la propiedad:
  """
  ${description}
  """
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Parse the JSON
    let tags = [];
    try {
      // Remover backticks markdown si la IA los incluye por error
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      tags = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Error parseando respuesta de IA:", text);
    }
    
    return Array.isArray(tags) ? tags : [];
  } catch (error) {
    console.error("Error consultando Gemini API:", error.message);
    return [];
  }
}

// Retardo para evitar rate limits
const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * Procesa una lista de propiedades, añadiendo la propiedad aiTags.
 */
async function enrichPropertiesWithAI(properties) {
  console.log(`Iniciando análisis de IA para ${properties.length} propiedades...`);
  if (!model) {
    console.warn("No se proporcionó GEMINI_API_KEY en el entorno. Saltando análisis de IA.");
    return properties;
  }

  const batchSize = 10;
  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize);
    console.log(`Procesando lote de IA ${i} a ${i + batch.length}...`);
    
    await Promise.all(batch.map(async (p) => {
      if (p.description) {
        const tags = await analyzePropertyDescription(p.description);
        p.aiTags = tags;
      } else {
        p.aiTags = [];
      }
    }));
    
    // Pequeño delay para no saturar la API gratuita
    await delay(2000);
  }
  
  console.log("Análisis de IA completado.");
  return properties;
}

module.exports = {
  analyzePropertyDescription,
  enrichPropertiesWithAI
};
