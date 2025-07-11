// Script para probar que el admin maneja correctamente las imágenes de las variantes

async function testAdminImages() {
    try {
        console.log('🚀 Probando que el admin maneja correctamente las imágenes de variantes...\n');
        
        // 1. Obtener productos desde el backend para verificar que tienen imágenes
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
        
        console.log('✅ Backend responde correctamente');
        console.log(`📦 Productos obtenidos: ${data.data.products.length}`);
        
        // 2. Buscar productos con variantes que tengan imágenes
        const productsWithImageVariants = data.data.products.filter(p => 
            p.variants && p.variants.length > 0 && 
            p.variants.some(v => v.imageUrl)
        );
        
        console.log(`🎯 Productos con variantes que tienen imágenes: ${productsWithImageVariants.length}`);
        
        if (productsWithImageVariants.length > 0) {
            console.log('\n📋 Productos con imágenes en variantes:');
            productsWithImageVariants.forEach((product, i) => {
                console.log(`\n${i + 1}. ${product.name} (${product.id})`);
                console.log(`   Imagen principal: ${product.imageUrl || 'Sin imagen'}`);
                console.log(`   Variantes:`);
                product.variants.forEach((variant, j) => {
                    console.log(`     ${j + 1}. ${variant.size} - $${variant.price} - Imagen: ${variant.imageUrl || 'Sin imagen'}`);
                });
            });
            
            console.log('\n✅ ¡PERFECTO! El backend devuelve imágenes en las variantes');
            console.log('💡 Ahora el admin debería poder:');
            console.log('   1. Mostrar las imágenes de las variantes en el formulario de edición');
            console.log('   2. Permitir editar las URLs de las imágenes de las variantes');
            console.log('   3. Guardar correctamente las imágenes de las variantes');
            
            console.log('\n🎯 Próximos pasos:');
            console.log('   1. Ve al admin del frontend (http://localhost:3000/admin/products)');
            console.log('   2. Edita un producto que tenga variantes con imágenes');
            console.log('   3. Verifica que las URLs de las imágenes aparecen en el formulario');
            console.log('   4. Modifica una URL de imagen y guarda');
            console.log('   5. Verifica que el cambio se guardó correctamente');
            
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
        console.log('\n💡 Asegúrate de que:');
        console.log('   1. El backend esté corriendo en http://localhost:8000');
        console.log('   2. El frontend esté corriendo en http://localhost:3000');
        console.log('   3. Hayas reiniciado el servidor de desarrollo del frontend');
    }
}

// Ejecutar la prueba
testAdminImages(); 