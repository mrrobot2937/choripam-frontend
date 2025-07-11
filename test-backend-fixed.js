// Script para probar que el backend funciona correctamente después de los cambios

async function testBackendFixed() {
    try {
        console.log('🚀 Probando que el backend funciona correctamente...\n');
        
        // 1. Obtener todos los productos
        console.log('🔍 Obteniendo productos desde el backend...');
        
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
                            imageUrl
                            available
                            variants {
                                size
                                price
                                imageUrl
                            }
                        }
                    }
                `,
                variables: {
                    restaurantId: "choripam"
                }
            })
        });
        
        const data = await response.json();
        
        if (data.errors) {
            console.error('❌ Errores en la consulta:', data.errors);
            return;
        }
        
        console.log('✅ ¡ÉXITO! El backend responde correctamente');
        console.log(`📦 Productos obtenidos: ${data.data.products.length}`);
        
        // 2. Mostrar algunos productos para verificar la estructura
        console.log('\n📋 Estructura de productos (primeros 3):');
        data.data.products.slice(0, 3).forEach((product, i) => {
            console.log(`\n${i + 1}. ${product.name} (${product.id})`);
            console.log(`   Imagen principal: ${product.imageUrl || 'Sin imagen'}`);
            if (product.variants && product.variants.length > 0) {
                console.log(`   Variantes:`);
                product.variants.forEach((variant, j) => {
                    console.log(`     ${j + 1}. ${variant.size} - $${variant.price} - Imagen: ${variant.imageUrl || 'Sin imagen'}`);
                });
            } else {
                console.log(`   Sin variantes`);
            }
        });
        
        // 3. Buscar productos con variantes que tengan imágenes
        const productsWithImageVariants = data.data.products.filter(p => 
            p.variants && p.variants.length > 0 && 
            p.variants.some(v => v.imageUrl)
        );
        
        console.log(`\n🎯 Productos con variantes que tienen imágenes: ${productsWithImageVariants.length}`);
        
        if (productsWithImageVariants.length > 0) {
            console.log('\n✅ ¡PERFECTO! El backend ahora devuelve imágenes en las variantes:');
            productsWithImageVariants.forEach((product, i) => {
                console.log(`\n${i + 1}. ${product.name} (${product.id})`);
                product.variants.forEach((variant, j) => {
                    console.log(`     ${j + 1}. ${variant.size} - $${variant.price} - Imagen: ${variant.imageUrl}`);
                });
            });
        }
        
        console.log('\n🎉 ¡El problema está resuelto!');
        console.log('💡 Ahora el frontend debería mostrar las imágenes de las variantes correctamente.');
        console.log('💡 Reinicia el servidor de desarrollo del frontend si es necesario.');
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
        console.log('\n💡 Asegúrate de que:');
        console.log('   1. El backend esté corriendo en http://localhost:8000');
        console.log('   2. Hayas instalado las dependencias de Python (pip install -r requirements.txt)');
        console.log('   3. El backend se haya reiniciado después de los cambios');
    }
}

// Ejecutar la prueba
testBackendFixed(); 