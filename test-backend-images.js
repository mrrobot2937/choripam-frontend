// Script para probar que el backend ahora devuelve correctamente las imágenes de las variantes

async function testBackendImages() {
    try {
        console.log('🚀 Probando que el backend devuelve imágenes de variantes...\n');
        
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
        
        console.log('📦 Productos obtenidos:', data.data.products.length);
        
        // 2. Buscar productos con variantes que tengan imágenes
        const productsWithImageVariants = data.data.products.filter(p => 
            p.variants && p.variants.length > 0 && 
            p.variants.some(v => v.imageUrl)
        );
        
        console.log(`🎯 Productos con variantes que tienen imágenes: ${productsWithImageVariants.length}`);
        
        if (productsWithImageVariants.length > 0) {
            console.log('\n✅ ¡ÉXITO! El backend ahora devuelve imágenes en las variantes:');
            productsWithImageVariants.forEach((product, i) => {
                console.log(`\n${i + 1}. ${product.name} (${product.id})`);
                console.log(`   Imagen principal: ${product.imageUrl || 'Sin imagen'}`);
                console.log(`   Variantes:`);
                product.variants.forEach((variant, j) => {
                    console.log(`     ${j + 1}. ${variant.size} - $${variant.price} - Imagen: ${variant.imageUrl || 'Sin imagen'}`);
                });
            });
            
            console.log('\n🎉 ¡El problema está resuelto!');
            console.log('💡 Ahora el frontend debería mostrar las imágenes de las variantes correctamente.');
        } else {
            console.log('\n⚠️ No se encontraron productos con imágenes en variantes.');
            console.log('💡 Esto puede ser normal si no hay productos con imágenes en variantes configuradas.');
            
            // Mostrar algunos productos para verificar que la estructura es correcta
            console.log('\n📋 Estructura de productos (primeros 3):');
            data.data.products.slice(0, 3).forEach((product, i) => {
                console.log(`\n${i + 1}. ${product.name} (${product.id})`);
                if (product.variants && product.variants.length > 0) {
                    console.log(`   Variantes:`);
                    product.variants.forEach((variant, j) => {
                        console.log(`     ${j + 1}. ${variant.size} - $${variant.price} - Imagen: ${variant.imageUrl || 'Sin imagen'}`);
                    });
                } else {
                    console.log(`   Sin variantes`);
                }
            });
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
        console.log('\n💡 Asegúrate de que el backend esté corriendo en http://localhost:8000');
    }
}

// Ejecutar la prueba
testBackendImages(); 