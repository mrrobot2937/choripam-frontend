// Script de prueba para verificar la conexión con el nuevo backend
const testBackendConnection = async () => {
  const GRAPHQL_URL = 'https://choripam-backend-real-4o8ibxnaq-david-leons-projects-e6b66126.vercel.app/graphql';
  
  console.log('🔍 Probando conexión con el nuevo backend...');
  console.log(`📍 URL: ${GRAPHQL_URL}`);
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Probando health check...');
    const healthResponse = await fetch(GRAPHQL_URL.replace('/graphql', '/health'));
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: GraphQL query
    console.log('\n2️⃣ Probando query GraphQL...');
    const query = `
      query {
        products(restaurantId: "choripam") {
          id
          name
          price
          available
        }
      }
    `;
    
    const graphqlResponse = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query
      })
    });
    
    const graphqlData = await graphqlResponse.json();
    
    if (graphqlData.errors) {
      console.error('❌ Errores GraphQL:', graphqlData.errors);
    } else {
      console.log('✅ Query GraphQL exitosa');
      console.log(`📊 Productos encontrados: ${graphqlData.data.products.length}`);
      console.log('📋 Primeros 3 productos:');
      graphqlData.data.products.slice(0, 3).forEach(product => {
        console.log(`   - ${product.name} (ID: ${product.id}, Precio: ${product.price})`);
      });
    }
    
    // Test 3: Verificar que los productos tienen precios válidos
    console.log('\n3️⃣ Verificando precios de productos...');
    const productsWithPrices = graphqlData.data.products.filter(p => p.price && p.price > 0);
    console.log(`✅ Productos con precios válidos: ${productsWithPrices.length}/${graphqlData.data.products.length}`);
    
    if (productsWithPrices.length === graphqlData.data.products.length) {
      console.log('🎉 ¡Todos los productos tienen precios válidos!');
    } else {
      console.log('⚠️ Algunos productos no tienen precios válidos');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
};

// Ejecutar la prueba
testBackendConnection(); 