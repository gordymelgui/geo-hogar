const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function dump() {
  const url = 'https://www.infocasas.com.py/venta/departamentos/asuncion';
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const $ = cheerio.load(response.data);
    const nextDataScript = $('#__NEXT_DATA__').html();
    
    if (nextDataScript) {
      const nextData = JSON.parse(nextDataScript);
      
      // Escribir las claves del objeto principal y de props
      console.log('Claves principales de __NEXT_DATA__:', Object.keys(nextData));
      if (nextData.props) {
        console.log('Claves de nextData.props:', Object.keys(nextData.props));
        if (nextData.props.pageProps) {
          console.log('Claves de nextData.props.pageProps:', Object.keys(nextData.props.pageProps));
          
          // Escribir en un archivo para poder verlo
          fs.writeFileSync('next-props-structure.json', JSON.stringify(nextData.props.pageProps, null, 2), 'utf-8');
          console.log('Estructura completa de pageProps guardada en next-props-structure.json');
        }
      }
    } else {
      console.log('No se encontró el script __NEXT_DATA__. Salvando HTML completo para inspección...');
      fs.writeFileSync('page.html', response.data, 'utf-8');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

dump();
