"use client";

import { useCart } from "../contexts/CartContext";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
};

export default function ProductList({ products }: { products: Product[] }) {
  const { cart, addToCart, removeFromCart } = useCart();

  function getQuantity(productId: number) {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const quantity = getQuantity(product.id);
        return (
          <div key={product.id} className="bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 border border-zinc-800 hover:border-yellow-400 transition-colors relative overflow-hidden group">
            {/* Imagen del producto */}
            <div className="h-40 w-full bg-zinc-800 rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} width={180} height={160} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <span className="text-zinc-500">Sin imagen</span>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
            <p className="text-gray-300 mb-2 text-base">{product.description}</p>
            <span className="text-yellow-400 font-extrabold text-xl mb-2">${product.price.toLocaleString()}</span>
            {/* Controles de cantidad */}
            <div className="flex items-center gap-3 mb-2">
              <button
                className="w-8 h-8 rounded-full bg-zinc-800 text-yellow-400 border-2 border-yellow-400 font-bold text-xl flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors"
                onClick={() => removeFromCart(product.id)}
                disabled={quantity === 0}
                aria-label="Restar"
              >
                -
              </button>
              <span className="text-lg font-bold w-6 text-center">{quantity}</span>
              <button
                className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center hover:bg-yellow-300 transition-colors"
                onClick={() => addToCart(product)}
                aria-label="Sumar"
              >
                +
              </button>
            </div>
            {/* Espacio para cupones aplicados (placeholder) */}
            <div className="mb-2 min-h-[24px] text-green-400 font-bold text-sm"></div>
            <button
              className="mt-auto px-4 py-2 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors text-lg shadow-lg"
              onClick={() => addToCart(product)}
            >
              Agregar al carrito
            </button>
          </div>
        );
      })}
    </div>
  );
} 