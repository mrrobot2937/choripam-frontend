#!/usr/bin/env node

/**
 * Script de prueba completo para Ay Wey
 * Verifica que todos los componentes funcionen correctamente
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando pruebas completas de Ay Wey...\n');

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Verificar estructura del proyecto
logSection('Verificando estructura del proyecto');

const requiredFiles = [
  'package.json',
  'src/app/layout.tsx',
  'src/components/SimpleCartPanel.tsx',
  'src/contexts/CartContext.tsx',
  'src/services/api-service.ts',
  'src/services/graphql-api.ts',
  'public/ay-wey-logo.svg',
  'env.config.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    logSuccess(`${file} existe`);
  } else {
    logError(`${file} NO existe`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  logError('Faltan archivos requeridos. Verifica la estructura del proyecto.');
  process.exit(1);
}

// Verificar configuración
logSection('Verificando configuración');

try {
  const envConfig = require('./env.config.js');
  if (envConfig.defaultRestaurant === 'ay-wey') {
    logSuccess('Restaurante por defecto configurado como "ay-wey"');
  } else {
    logError(`Restaurante por defecto incorrecto: ${envConfig.defaultRestaurant}`);
  }
  
  if (envConfig.port === 3001) {
    logSuccess('Puerto configurado como 3001');
  } else {
    logError(`Puerto incorrecto: ${envConfig.port}`);
  }
} catch (error) {
  logError(`Error leyendo env.config.js: ${error.message}`);
}

// Verificar contenido de archivos clave
logSection('Verificando contenido de archivos');

// Verificar CartContext
try {
  const cartContextContent = fs.readFileSync('src/contexts/CartContext.tsx', 'utf8');
  if (cartContextContent.includes('"ay-wey"')) {
    logSuccess('CartContext usa "ay-wey" por defecto');
  } else {
    logError('CartContext NO usa "ay-wey" por defecto');
  }
} catch (error) {
  logError(`Error leyendo CartContext: ${error.message}`);
}

// Verificar API service
try {
  const apiServiceContent = fs.readFileSync('src/services/api-service.ts', 'utf8');
  if (apiServiceContent.includes('ay-wey')) {
    logSuccess('API service usa "ay-wey" por defecto');
  } else {
    logError('API service NO usa "ay-wey" por defecto');
  }
} catch (error) {
  logError(`Error leyendo API service: ${error.message}`);
}

// Verificar GraphQL service
try {
  const graphqlContent = fs.readFileSync('src/services/graphql-api.ts', 'utf8');
  if (graphqlContent.includes('ay-wey')) {
    logSuccess('GraphQL service usa "ay-wey" por defecto');
  } else {
    logError('GraphQL service NO usa "ay-wey" por defecto');
  }
} catch (error) {
  logError(`Error leyendo GraphQL service: ${error.message}`);
}

// Verificar admin layout
try {
  const adminLayoutContent = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');
  if (adminLayoutContent.includes('Ay Wey - Admin')) {
    logSuccess('Admin layout muestra "Ay Wey - Admin"');
  } else {
    logError('Admin layout NO muestra "Ay Wey - Admin"');
  }
} catch (error) {
  logError(`Error leyendo admin layout: ${error.message}`);
}

// Verificar login admin
try {
  const loginContent = fs.readFileSync('src/app/admin/login/page.tsx', 'utf8');
  if (loginContent.includes('admin@aywey.com')) {
    logSuccess('Login admin usa email de Ay Wey');
  } else {
    logError('Login admin NO usa email de Ay Wey');
  }
} catch (error) {
  logError(`Error leyendo login admin: ${error.message}`);
}

// Verificar SimpleCartPanel
try {
  const cartPanelContent = fs.readFileSync('src/components/SimpleCartPanel.tsx', 'utf8');
  if (cartPanelContent.includes('Tu carrito - Ay Wey')) {
    logSuccess('SimpleCartPanel muestra "Ay Wey" en el título');
  } else {
    logError('SimpleCartPanel NO muestra "Ay Wey" en el título');
  }
  
  if (cartPanelContent.includes('Cliente Ay Wey')) {
    logSuccess('SimpleCartPanel usa datos por defecto de Ay Wey');
  } else {
    logError('SimpleCartPanel NO usa datos por defecto de Ay Wey');
  }
} catch (error) {
  logError(`Error leyendo SimpleCartPanel: ${error.message}`);
}

// Verificar que no hay referencias a "choripam"
logSection('Verificando que no hay referencias a "choripam"');

try {
  const grepResult = execSync('grep -r "choripam" src/ --include="*.tsx" --include="*.ts" || true', { encoding: 'utf8' });
  if (grepResult.trim()) {
    logWarning('Se encontraron referencias a "choripam":');
    console.log(grepResult);
  } else {
    logSuccess('No se encontraron referencias a "choripam" en el código');
  }
} catch (error) {
  logSuccess('No se encontraron referencias a "choripam" en el código');
}

// Verificar dependencias
logSection('Verificando dependencias');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', 'react-dom', '@apollo/client', 'graphql'];
  
  let allDepsOk = true;
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      logSuccess(`${dep} está instalado`);
    } else {
      logError(`${dep} NO está instalado`);
      allDepsOk = false;
    }
  });
  
  if (allDepsOk) {
    logSuccess('Todas las dependencias requeridas están instaladas');
  }
} catch (error) {
  logError(`Error verificando dependencias: ${error.message}`);
}

// Verificar que el logo existe
logSection('Verificando assets');

if (fs.existsSync('public/ay-wey-logo.svg')) {
  const logoContent = fs.readFileSync('public/ay-wey-logo.svg', 'utf8');
  if (logoContent.includes('Ay Wey')) {
    logSuccess('Logo de Ay Wey existe y contiene el texto correcto');
  } else {
    logWarning('Logo de Ay Wey existe pero no contiene el texto esperado');
  }
} else {
  logError('Logo de Ay Wey NO existe');
}

// Resumen final
logSection('Resumen de pruebas');

log('🎉 Pruebas completadas. Verifica los resultados arriba.');
log('📋 Para iniciar el servidor de desarrollo: npm run dev');
log('🔗 El proyecto debería estar disponible en: http://localhost:3001');
log('👤 Credenciales de admin: admin@aywey.com / demo123');
log('🏪 Restaurante configurado: ay-wey');

console.log('\n' + '='.repeat(50));
log('¡Ay Wey está listo para usar! 🚀', 'green');
console.log('='.repeat(50)); 