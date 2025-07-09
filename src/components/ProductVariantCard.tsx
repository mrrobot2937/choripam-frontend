"use client";
import { useState } from "react";
import { useCart, Product } from "../contexts/CartContext";
import Image from "next/image";

export default function ProductVariantCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  // Verificar si el producto tiene variantes
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const variant = hasVariants && product.variants ? product.variants[selected] : null;

  // Si no hay variantes, usar el precio base del producto
  const displayPrice = variant ? variant.price : product.price;
  const displaySize = variant ? variant.size : "Único";

  function handleAdd() {
    // Si hay variantes, usar la variante seleccionada
    if (hasVariants && variant) {
      addToCart(product, variant);
    } else {
      // Si no hay variantes, agregar el producto tal como está
      addToCart(product);
    }
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 border border-zinc-800 hover:border-yellow-400 transition-colors relative overflow-hidden group">
      {/* Imagen del producto */}
      <div className="h-40 w-full bg-zinc-800 rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
        {product.image_url && !imageError ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            width={180} 
            height={160} 
            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rg=" 
          />
        ) : (
          <div className="text-zinc-500 text-center">
            <div className="text-4xl mb-2">🍽️</div>
            <span className="text-sm">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
        <p className="text-gray-300 mb-3 text-base line-clamp-3">{product.description}</p>
        
        {/* Categoría */}
        {product.category && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs bg-yellow-400 text-black rounded-full font-bold">
              {typeof product.category === 'string' ? product.category : product.category.name}
            </span>
          </div>
        )}

        {/* Selector de variante (si las hay) */}
        {hasVariants && (
          <div className="mb-3">
            <p className="text-sm text-gray-400 mb-2">Tamaño:</p>
            <div className="flex gap-2 flex-wrap">
              {product.variants!.map((v, i) => (
                <button
                  key={`${v.size}-${i}`}
                  className={`px-3 py-1 rounded-full font-bold border-2 transition-colors text-sm ${
                    selected === i 
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow' 
                      : 'bg-zinc-800 border-zinc-700 text-white hover:bg-yellow-400 hover:text-black'
                  }`}
                  onClick={() => setSelected(i)}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Precio y tiempo de preparación */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-yellow-400 font-extrabold text-xl">
            ${displayPrice.toLocaleString()}
          </span>
          {product.preparation_time && (
            <span className="text-gray-400 text-sm">
              ⏱️ {product.preparation_time} min
            </span>
          )}
        </div>

        {/* Estado de disponibilidad */}
        {product.is_available === false && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs bg-red-500 text-white rounded-full font-bold">
              No disponible
            </span>
          </div>
        )}

        {/* Botón de agregar */}
        <button
          className={`mt-auto px-4 py-2 rounded-full font-bold transition-colors text-lg shadow-lg ${
            product.is_available === false
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-300'
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