const fs = require('fs');
const path = require('path');

const MACRO_JSON_PATH = path.join(__dirname, '../data/macro-metrics.json');

async function scrapeMacro() {
  console.log('Iniciando extracción de métricas macroeconómicas...');
  
  let gdpGrowth = 4.0; // fallback
  let inflation = 4.0; // fallback
  let usdPyg = 6100; // fallback
  let eurPyg = 6500; // fallback
  let brlPyg = 1100; // fallback
  let mortgageRate = 8.5; // fallback (usually stable)
  let moodyRating = "Baa3"; // Investment Grade
  let fdiReturn = 18; // Constant from Rediex

  try {
    console.log('Obteniendo crecimiento del PIB (Banco Mundial)...');
    const gdpRes = await fetch('http://api.worldbank.org/v2/country/PRY/indicator/NY.GDP.MKTP.KD.ZG?format=json');
    const gdpData = await gdpRes.json();
    if (gdpData && gdpData[1]) {
      const latestGdp = gdpData[1].find(x => x.value !== null);
      if (latestGdp) gdpGrowth = parseFloat(latestGdp.value.toFixed(1));
    }
  } catch (e) {
    console.error('Error obteniendo PIB:', e.message);
  }

  try {
    console.log('Obteniendo inflación (Banco Mundial)...');
    const infRes = await fetch('http://api.worldbank.org/v2/country/PRY/indicator/FP.CPI.TOTL.ZG?format=json');
    const infData = await infRes.json();
    if (infData && infData[1]) {
      const latestInf = infData[1].find(x => x.value !== null);
      if (latestInf) inflation = parseFloat(latestInf.value.toFixed(1));
    }
  } catch (e) {
    console.error('Error obteniendo inflación:', e.message);
  }

  try {
    console.log('Obteniendo cotizaciones (Yahoo Finance)...');
    
    const [usdRes, eurRes, brlRes] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/PYG=X').catch(() => null),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/EURPYG=X').catch(() => null),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/BRL=X').catch(() => null)
    ]);

    if (usdRes) {
      const usdData = await usdRes.json();
      if (usdData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
        usdPyg = parseFloat(usdData.chart.result[0].meta.regularMarketPrice.toFixed(0));
      }
    }

    if (eurRes) {
      const eurData = await eurRes.json();
      if (eurData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
        eurPyg = parseFloat(eurData.chart.result[0].meta.regularMarketPrice.toFixed(0));
      }
    }

    if (brlRes) {
      const brlData = await brlRes.json();
      if (brlData?.chart?.result?.[0]?.meta?.regularMarketPrice) {
        const usdToBrl = brlData.chart.result[0].meta.regularMarketPrice;
        brlPyg = parseFloat((usdPyg / usdToBrl).toFixed(0));
      }
    }
  } catch (e) {
    console.error('Error obteniendo cotizaciones:', e.message);
  }

  const metrics = {
    gdpGrowth,
    inflation,
    usdPyg,
    eurPyg,
    brlPyg,
    mortgageRate,
    moodyRating,
    fdiReturn,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(MACRO_JSON_PATH, JSON.stringify(metrics, null, 2), 'utf8');
  console.log('Métricas macro guardadas en data/macro-metrics.json:', metrics);
}

scrapeMacro().catch(console.error);
