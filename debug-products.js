// 🔧 Script de Debugging para Productos GraphQL
// Copiar y pegar en la consola del navegador para testear

console.log('🔧 Iniciando debugging de productos...');

// Función para obtener todos los productos
async function debugGetProducts() {
    try {
        console.log('📋 Obteniendo productos...');
        const response = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetProducts($restaurantId: String!) {
                        products(restaurantId: $restaurantId) {
                            id
                            name
                            description
                            price
                            available
                            restaurantId
                        }
                    }
                `,
                variables: {
                    restaurantId: 'choripam'
                }
            })
        });
        
        const data = await response.json();
        console.log('✅ Productos obtenidos:', data);
        
        if (data.data?.products) {
            console.log('📊 Total productos:', data.data.products.length);
            console.log('🔍 Primeros 3 productos:');
            data.data.products.slice(0, 3).forEach((product, index) => {
                console.log(`  ${index + 1}. ID: ${product.id}, Nombre: ${product.name}`);
            });
        }
        
        return data.data?.products || [];
    } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        return [];
    }
}

// Función para probar actualización de un producto
async function debugUpdateProduct(productId, newName = 'Producto Actualizado TEST') {
    try {
        console.log(`🔄 Probando actualización del producto: ${productId}`);
        
        const response = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation UpdateProduct($productId: String!, $input: UpdateProductInput!) {
                        updateProduct(productId: $productId, productInput: $input) {
                            success
                            message
                            id
                        }
                    }
                `,
                variables: {
                    productId: productId,
                    input: {
                        name: newName
                    }
                }
            })
        });
        
        const data = await response.json();
        console.log('✅ Resultado de actualización:', data);
        return data;
    } catch (error) {
        console.error('❌ Error actualizando producto:', error);
        return null;
    }
}

// Función principal de debugging
async function runProductDebug() {
    console.log('🚀 Ejecutando debugging completo...');
    
    // 1. Obtener productos
    const productos = await debugGetProducts();
    
    if (productos.length > 0) {
        // 2. Probar actualización con el primer producto
        const primerProducto = productos[0];
        console.log(`🎯 Probando actualización con: ${primerProducto.id} - ${primerProducto.name}`);
        
        await debugUpdateProduct(primerProducto.id, `${primerProducto.name} - UPDATED`);
        
        // 3. Volver a obtener productos para ver si cambió
        console.log('🔄 Verificando cambios...');
        await debugGetProducts();
    } else {
        console.log('⚠️ No hay productos para probar');
    }
}

// Ejecutar automáticamente
runProductDebug();

console.log(`
📝 Comandos disponibles:
- debugGetProducts() - Obtener todos los productos
- debugUpdateProduct(id, nombre) - Actualizar un producto
- runProductDebug() - Ejecutar debugging completo

Ejemplo de uso:
debugUpdateProduct('tu-product-id', 'Nuevo Nombre');
`); 