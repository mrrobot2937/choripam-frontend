#!/usr/bin/env node

/**
 * Script de prueba para validar el servicio GraphQL
 */

const { apiService } = require('./src/services/api-service');

async function testGraphQLService() {
    console.log('🧪 Iniciando pruebas del servicio GraphQL...\n');

    try {
        // Test 1: Verificar estado de conexión
        console.log('1. Verificando estado de conexión...');
        const connectionStatus = apiService.getConnectionStatus();
        console.log(`   Estado: ${connectionStatus}`);
        console.log(`   Servicio actual: ${apiService.getCurrentService()}\n`);

        // Test 2: Test de conexión completo
        console.log('2. Ejecutando test de conexión completo...');
        const connectionTest = await apiService.testConnection();
        console.log(`   Resultado:`, connectionTest);
        console.log('');

        // Test 3: Obtener productos
        console.log('3. Obteniendo productos...');
        const products = await apiService.getProducts('choripam');
        console.log(`   Productos obtenidos: ${products.products.length}`);
        console.log(`   Restaurant ID: ${products.restaurant_id}`);
        console.log('');

        // Test 4: Obtener órdenes
        console.log('4. Obteniendo órdenes...');
        const orders = await apiService.getOrders('choripam');
        console.log(`   Órdenes obtenidas: ${orders.orders.length}`);
        console.log(`   Restaurant ID: ${orders.restaurant_id}`);
        console.log('');

        // Test 5: Obtener categorías
        console.log('5. Obteniendo categorías...');
        const categories = await apiService.getCategories('choripam');
        console.log(`   Categorías obtenidas: ${categories.categories.length}`);
        console.log(`   Restaurant ID: ${categories.restaurant_id}`);
        console.log('');

        console.log('✅ Todas las pruebas del servicio GraphQL completadas exitosamente!');
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        process.exit(1);
    }
}

// Ejecutar las pruebas
testGraphQLService(); 