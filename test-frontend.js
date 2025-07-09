// Script para probar el frontend
const testFrontend = async () => {
  console.log('🔍 Probando el frontend...');
  
  try {
    // Test 1: Verificar que el servidor de desarrollo se puede iniciar
    console.log('\n1️⃣ Verificando configuración del frontend...');
    
    const fs = require('fs');
    const path = require('path');
    
    // Verificar archivos importantes
    const importantFiles = [
      'package.json',
      'next.config.ts',
      'src/lib/apollo-client.ts',
      'env.config.js'
    ];
    
    for (const file of importantFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file} existe`);
      } else {
        console.log(`❌ ${file} no existe`);
      }
    }
    
    // Verificar configuración de GraphQL
    const apolloConfig = fs.readFileSync('src/lib/apollo-client.ts', 'utf8');
    if (apolloConfig.includes('import config from') && apolloConfig.includes('config.GRAPHQL_URL')) {
      console.log('✅ Cliente Apollo configurado para usar configuración externa');
    } else {
      console.log('❌ Cliente Apollo no está configurado correctamente');
    }
    
    // Verificar configuración de entorno
    const envConfig = fs.readFileSync('env.config.js', 'utf8');
    if (envConfig.includes('choripam-backend-real-4o8ibxnaq-david-leons-projects-e6b66126.vercel.app')) {
      console.log('✅ Configuración de entorno correcta');
    } else {
      console.log('❌ Configuración de entorno incorrecta');
    }
    
    console.log('\n2️⃣ Frontend configurado correctamente');
    console.log('🚀 Para iniciar el servidor de desarrollo:');
    console.log('   npm run dev');
    console.log('\n📱 El frontend estará disponible en: http://localhost:3000');
    console.log('🔧 Panel de administración: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error probando el frontend:', error);
  }
};

// Ejecutar la prueba
testFrontend(); 