// Script para probar con image_url (snake_case) en lugar de imageUrl

async function testSnakeCase() {
    try {
        console.log('🚀 Probando con image_url (snake_case)...\n');
        
        // 1. Obtener un producto para probar
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
        const targetProduct = getData.data.products.find(p => p.id === 'prod-choripapa-clasica');
        
        if (!targetProduct) {
            console.error('❌ No se encontró el producto de prueba');
            return;
        }
        
        console.log('📦 Producto antes de actualización:', JSON.stringify(targetProduct, null, 2));
        
        // 2. Crear variantes de prueba con image_url (snake_case)
        const testVariants = [
            {
                size: "1P",
                price: 16000,
                image_url: "https://example.com/small-choripapa.jpg"
            },
            {
                size: "2P", 
                price: 30000,
                image_url: "https://example.com/medium-choripapa.jpg"
            }
        ];
        
        console.log('\n🔄 Enviando actualización con variantes (image_url)...');
        console.log('📦 Variantes a enviar:', JSON.stringify(testVariants, null, 2));
        
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
        console.log('\n✅ Respuesta del backend:', JSON.stringify(updateData, null, 2));
        
        // 4. Verificar el resultado
        console.log('\n🔍 Verificando resultado...');
        
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
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    }
}

// Ejecutar la prueba
testSnakeCase(); 