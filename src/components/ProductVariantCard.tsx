"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useCart, Product } from "../contexts/CartContext";
import Image from "next/image";

export default function ProductVariantCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Verificar si el producto tiene variantes
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  
  // Efecto para forzar actualización del precio en dispositivos problemáticos
  useEffect(() => {
    // Forzar actualización del componente cuando cambie la variante seleccionada
    setForceUpdate(prev => prev + 1);
  }, [selected]);
  
  // Usar useMemo para calcular la variante actual de manera más eficiente
  const variant = useMemo(() => {
    if (hasVariants && product.variants && product.variants[selected]) {
      return product.variants[selected];
    }
    return null;
  }, [hasVariants, product.variants, selected]);

  // Imagen principal: la de la variante si existe, si no la del producto
  const mainImageUrl = useMemo(() => {
    if (variant && (variant as { imageUrl?: string })?.imageUrl) {
      return (variant as { imageUrl?: string }).imageUrl;
    }
    return product.image_url;
  }, [variant, product.image_url]);

  // Calcular precio y tamaño con useMemo para evitar recálculos innecesarios
  const displayPrice = useMemo(() => {
    // Incluir forceUpdate para garantizar actualización en dispositivos problemáticos
    return variant ? variant.price : product.price;
  }, [variant, product.price, forceUpdate]);
  
  const displaySize = useMemo(() => {
    return variant ? variant.size : "Único";
  }, [variant, forceUpdate]);

  // Función optimizada para cambiar variante
  const handleVariantChange = useCallback((index: number) => {
    setSelected(index);
    setImageError(false);
    
    // Forzar actualización del DOM en dispositivos móviles
    if (typeof window !== 'undefined') {
      // Pequeño timeout para garantizar el re-renderizado en algunos dispositivos
      setTimeout(() => {
        // Trigger a custom event to notify about variant change
        const event = new CustomEvent('variant-changed', { detail: { index } });
        window.dispatchEvent(event);
      }, 0);
    }
  }, []);

  const handleAdd = useCallback(() => {
    if (variant) {
      addToCart(product, variant);
    } else {
      addToCart(product);
    }
  }, [variant, product, addToCart]);

  return (
    <div className="bg-zinc-900 rounded-3xl p-2 md:p-4 shadow-2xl flex flex-col gap-2 md:gap-3 border border-zinc-800 hover:border-yellow-400 transition-colors relative overflow-hidden group h-full">
      {/* Imagen del producto - Mejorada para imágenes cuadradas */}
      <div className="relative aspect-square w-full bg-zinc-800 rounded-2xl overflow-hidden mb-2 md:mb-3">
        {mainImageUrl && !imageError ? (
          <Image 
            src={mainImageUrl} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rg=" 
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
            <div className="text-4xl mb-2">🍽️</div>
            <span className="text-sm font-medium">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Miniaturas de variantes */}
      {hasVariants && (
        <div className="mb-2">
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2">
            {product.variants!.map((v, i) => (
              <button
                key={`variant-thumb-${i}-${v.size}`}
                className={`border-2 rounded-lg p-1 transition-all flex-shrink-0 ${selected === i ? 'border-yellow-400' : 'border-zinc-700'}`}
                onClick={() => handleVariantChange(i)}
                aria-label={`Seleccionar variante ${v.size}`}
                type="button"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-800 rounded-md overflow-hidden flex items-center justify-center">
                  {(v as { imageUrl?: string })?.imageUrl ? (
                    <Image
                      src={(v as { imageUrl?: string }).imageUrl!}
                      alt={v.size}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={v.size}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full opacity-50"
                      />
                    ) : (
                      <span className="text-zinc-500 text-lg">🍽️</span>
                    )
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Información del producto */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 line-clamp-2 leading-tight">{product.name}</h3>
        <p className="text-gray-300 mb-2 md:mb-3 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">{product.description}</p>
        
        {/* Categoría */}
        {product.category && (
          <div className="mb-2 md:mb-3">
            <span className="inline-block px-2 md:px-3 py-1 text-xs bg-yellow-400 text-black rounded-full font-bold">
              {typeof product.category === 'string' ? product.category : product.category.name}
            </span>
          </div>
        )}

        {/* Selector de variante (si las hay) */}
        {hasVariants && (
          <div className="mb-2 md:mb-3">
            <p className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2 font-medium">Tamaño:</p>
            <div className="flex gap-1 md:gap-2 flex-wrap">
              {product.variants!.map((v, i) => (
                <button
                  key={`variant-btn-${i}-${v.size}`}
                  className={`px-2 md:px-3 py-1 rounded-full font-bold border-2 transition-colors text-xs md:text-sm ${
                    selected === i 
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow' 
                      : 'bg-zinc-800 border-zinc-700 text-white hover:bg-yellow-400 hover:text-black'
                  }`}
                  onClick={() => handleVariantChange(i)}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Precio y tiempo de preparación */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <span 
            key={`price-${selected}-${displayPrice}`}
            className="text-yellow-400 font-extrabold text-base md:text-lg transition-all duration-200"
            style={{ willChange: 'contents' }}
          >
            ${displayPrice.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          {product.preparation_time && (
            <span className="text-gray-400 text-xs font-medium">
              ⏱️ {product.preparation_time} min
            </span>
          )}
        </div>

        {/* Estado de disponibilidad */}
        {product.is_available === false && (
          <div className="mb-2 md:mb-3">
            <span className="inline-block px-2 md:px-3 py-1 text-xs bg-red-500 text-white rounded-full font-bold">
              No disponible
            </span>
          </div>
        )}

        {/* Botón de agregar */}
        <button
          className={`mt-auto px-3 md:px-4 py-2 md:py-3 rounded-full font-bold transition-colors text-xs md:text-base shadow-lg ${
            product.is_available === false
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95'
          }`}
          onClick={handleAdd}
          disabled={product.is_available === false}
        >
          {product.is_available === false 
            ? 'No disponible' 
            : hasVariants 
              ? `Agregar ${displaySize}` 
              : 'Agregar al carrito'
          }
        </button>
      </div>
    </div>
  );
} 