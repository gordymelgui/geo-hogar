const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (name.includes('node_modules')) continue;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(name);
    }
  }
  return fileList;
}

const rootDir = path.resolve(__dirname, '..');
const jsFiles = getFiles(rootDir);

console.log(`Encontrados ${jsFiles.length} archivos JavaScript para verificar.`);

let hasErrors = false;
for (const file of jsFiles) {
  try {
    execSync(`node -c "${file}"`, { stdio: 'pipe' });
    console.log(`✅ ${path.relative(rootDir, file)}: OK`);
  } catch (err) {
    console.error(`❌ ${path.relative(rootDir, file)}: ERROR DE SINTAXIS`);
    console.error(err.stderr.toString());
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log("¡Todos los archivos JS tienen una sintaxis correcta!");
}
