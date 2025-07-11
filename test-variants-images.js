// Script para probar que las imágenes de las variantes se muestran correctamente

async function testVariantsImages() {
    try {
        console.log('🚀 Probando visualización de imágenes de variantes...\n');
        
        // 1. Obtener todos los productos
        console.log('🔍 Obteniendo productos...');
        
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
        
        // 2. Encontrar productos con variantes que tengan imágenes
        const productsWithImageVariants = data.data.products.filter(p => 
            p.variants && p.variants.length > 0 && 
            p.variants.some(v => v.imageUrl)
        );
        
        console.log(`🎯 Productos con variantes que tienen imágenes: ${productsWithImageVariants.length}`);
        
        productsWithImageVariants.forEach((product, i) => {
            console.log(`\n${i + 1}. ${product.name} (${product.id})`);
            console.log(`   Imagen principal: ${product.imageUrl || 'Sin imagen'}`);
            console.log(`   Variantes:`);
            product.variants.forEach((variant, j) => {
                console.log(`     ${j + 1}. ${variant.size} - $${variant.price} - Imagen: ${variant.imageUrl || 'Sin imagen'}`);
            });
        });
        
        // 3. Si no hay productos con imágenes en variantes, crear uno de prueba
        if (productsWithImageVariants.length === 0) {
            console.log('\n⚠️ No se encontraron productos con imágenes en variantes. Creando uno de prueba...');
            
            const testProductId = 'prod-bebida-agua';
            
            // Actualizar el producto con variantes que tengan imágenes
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
                        productId: testProductId,
                        input: {
                            name: "Agua con Gas o Sin Gas",
                            description: "Agua embotellada, con gas o sin gas.",
                            price: 5000,
                            imageUrl: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/prducts/agua.png",
                            available: true,
                            categoryId: "bebidas",
                            variants: [
                                {
                                    size: "Con Gas",
                                    price: 5000,
                                    imageUrl: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/prducts/choripam-calidoso.jpeg"
                                },
                                {
                                    size: "Sin Gas",
                                    price: 5000,
                                    imageUrl: "https://terrazaedenfiles.s3.us-east-2.amazonaws.com/prducts/agua.png"
                                }
                            ]
                        }
                    }
                })
            });
            
            const updateData = await updateResponse.json();
            console.log('📝 Resultado de actualización:', updateData);
            
            if (updateData.data?.updateProduct?.success) {
                console.log('✅ Producto actualizado correctamente');
                
                // Verificar que se guardó correctamente
                const verifyResponse = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query GetProduct($productId: String!) {
                                product(productId: $productId) {
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
                            productId: testProductId
                        }
                    })
                });
                
                const verifyData = await verifyResponse.json();
                const updatedProduct = verifyData.data.product;
                
                if (updatedProduct) {
                    console.log('\n📦 Producto después de actualización:');
                    console.log(`   Nombre: ${updatedProduct.name}`);
                    console.log(`   Imagen principal: ${updatedProduct.imageUrl || 'Sin imagen'}`);
                    console.log(`   Variantes:`);
                    updatedProduct.variants.forEach((variant, j) => {
                        console.log(`     ${j + 1}. ${variant.size} - $${variant.price} - Imagen: ${variant.imageUrl || 'Sin imagen'}`);
                    });
                    
                    const hasImages = updatedProduct.variants.some(v => v.imageUrl);
                    console.log(`\n✅ ¿Las variantes tienen imágenes? ${hasImages ? 'SÍ' : 'NO'}`);
                    
                    if (hasImages) {
                        console.log('🎉 ¡ÉXITO! Las variantes ahora tienen imágenes y deberían mostrarse en el frontend');
                        console.log('\n💡 Ahora puedes verificar en el navegador que las imágenes se muestran correctamente');
                    } else {
                        console.log('❌ Las variantes no tienen imágenes después de la actualización');
                    }
                }
            } else {
                console.error('❌ Error actualizando producto:', updateData);
            }
        } else {
            console.log('\n✅ Se encontraron productos con imágenes en variantes. El frontend debería mostrarlas correctamente.');
        }
        
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    }
}

// Ejecutar la prueba
testVariantsImages(); 