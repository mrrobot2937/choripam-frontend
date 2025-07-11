// Script simple para probar actualización de variantes con imágenes

async function testVariantUpdate() {
    try {
        console.log('🚀 Probando actualización de variantes con imágenes...\n');
        
        // 1. Obtener todos los productos para encontrar uno específico
        console.log('🔍 Obteniendo todos los productos...');
        
        const getResponse = await fetch('http://localhost:8000/graphql', {
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
        
        const getData = await getResponse.json();
        console.log('📦 Productos obtenidos:', getData.data.products.length);
        
        // Encontrar el producto ChoriPapa Clásica
        const targetProduct = getData.data.products.find(p => p.id === 'prod-choripapa-clasica');
        
        if (!targetProduct) {
            console.error('❌ No se encontró el producto prod-choripapa-clasica');
            console.log('Productos disponibles:', getData.data.products.map(p => p.id));
            return;
        }
        
        console.log('📦 Producto encontrado:', JSON.stringify(targetProduct, null, 2));
        
        // 2. Crear variantes de prueba con imágenes
        const testVariants = [
            {
                size: "1P",
                price: 16000,
                imageUrl: "https://example.com/small-choripapa.jpg"
            },
            {
                size: "2P", 
                price: 30000,
                imageUrl: "https://example.com/medium-choripapa.jpg"
            },
            {
                size: "3P",
                price: 45000,
                imageUrl: "https://example.com/large-choripapa.jpg"
            },
            {
                size: "4P",
                price: 58000,
                imageUrl: "https://example.com/xlarge-choripapa.jpg"
            }
        ];
        
        console.log('\n🔄 Actualizando producto con variantes que incluyen imágenes...');
        console.log('📦 Variantes de prueba:', JSON.stringify(testVariants, null, 2));
        
        // 3. Actualizar el producto
        const updateResponse = await fetch('http://localhost:8000/graphql', {
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
                    productId: targetProduct.id,
                    input: {
                        variants: testVariants
                    }
                }
            })
        });
        
        const updateData = await updateResponse.json();
        console.log('\n✅ Resultado de actualización:', JSON.stringify(updateData, null, 2));
        
        // 4. Verificar el resultado obteniendo todos los productos nuevamente
        console.log('\n🔍 Verificando producto actualizado...');
        
        const verifyResponse = await fetch('http://localhost:8000/graphql', {
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
        
        const verifyData = await verifyResponse.json();
        
        // Encontrar el producto actualizado
        const updatedProduct = verifyData.data.products.find(p => p.id === targetProduct.id);
        
        if (updatedProduct) {
            console.log('\n📦 Producto después de actualización:', JSON.stringify(updatedProduct, null, 2));
            
            console.log('\n🎯 Análisis de variantes:');
            updatedProduct.variants.forEach((v, i) => {
                console.log(`  Variante ${i + 1}: ${v.size} - $${v.price} - Imagen: ${v.imageUrl || 'Sin imagen'}`);
            });
            
            const hasImages = updatedProduct.variants.some(v => v.imageUrl);
            console.log(`\n✅ ¿Las variantes tienen imágenes? ${hasImages ? 'SÍ' : 'NO'}`);
            
            if (hasImages) {
                console.log('🎉 ¡ÉXITO! Las variantes ahora tienen imágenes');
            } else {
                console.log('❌ Las variantes no tienen imágenes después de la actualización');
            }
        } else {
            console.log('❌ No se pudo encontrar el producto actualizado');
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    }
}

// Ejecutar la prueba
testVariantUpdate(); 