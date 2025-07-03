"use client";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import Image from "next/image";

type Variant = {
  label: string;
  price: number;
};

type Product = {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  variants: Variant[];
};

type CartProduct = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
};

export default function ProductVariantCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(0);
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const variant = hasVariants ? product.variants[selected] : null;

  if (!hasVariants) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 border border-zinc-800">
        <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
        <p className="text-red-400">Este producto no tiene variantes configuradas.</p>
      </div>
    );
  }

  function handleAdd() {
    if (!variant) return; // Verificación de seguridad
    
    const cartProduct: CartProduct = {
      id: Number(`${product.id}${selected}`), // id único por variante
      name: `${product.name} ${variant.label}`,
      price: variant.price,
      description: product.description,
      imageUrl: product.imageUrl,
    };
    
    addToCart(cartProduct);
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 border border-zinc-800 hover:border-yellow-400 transition-colors relative overflow-hidden group">
      <div className="h-40 w-full bg-zinc-800 rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} width={180} height={160} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-zinc-500">Sin imagen</span>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
      <p className="text-gray-300 mb-2 text-base">{product.description}</p>
      {/* Selector de variante */}
      <div className="flex gap-2 mb-2">
        {product.variants.map((v, i) => (
          <button
            key={v.label}
            className={`px-4 py-1 rounded-full font-bold border-2 transition-colors ${selected === i ? 'bg-yellow-400 text-black border-yellow-400 shadow' : 'bg-zinc-800 border-zinc-700 text-white hover:bg-yellow-400 hover:text-black'}`}
            onClick={() => setSelected(i)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <span className="text-yellow-400 font-extrabold text-xl mb-2">${variant?.price.toLocaleString() || '0'}</span>
      <button
        className="mt-auto px-4 py-2 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors text-lg shadow-lg"
        onClick={handleAdd}
      >
        Agregar al carrito
      </button>
    </div>
  );
} 