"use client";
import { useState } from "react";
import ProductVariantCard from "../../components/ProductVariantCard";

const menuData = [
  {
    category: "Choripapas",
    products: [
      {
        id: 1,
        name: "Choripapa Clásica",
        description: "Papa amarilla, chorizo, tocineta artesanal, queso mozzarella gratinado, salsa BBQ, salsa maíz dulce y salsa de la casa.",
        imageUrl: "/choripapa-clasica.jpg",
        variants: [
          { label: "1P", price: 16000 },
          { label: "2P", price: 30000 },
          { label: "3P", price: 45000 },
          { label: "4P", price: 58000 },
        ],
      },
      {
        id: 2,
        name: "Choripapa Morronga",
        description: "Papa amarilla, chorizo, tocineta artesanal, mechada, queso mozzarella gratinado, salsa BBQ, salsa maíz dulce y salsa de la casa. Guiso opcional.",
        imageUrl: "/choripapa-morronga.jpg",
        variants: [
          { label: "1P", price: 19000 },
          { label: "2P", price: 36000 },
          { label: "3P", price: 53000 },
          { label: "4P", price: 68000 },
        ],
      },
      {
        id: 3,
        name: "Choripapa Garosa",
        description: "Papa amarilla, chorizo, tocineta, carne mechada, queso mozzarella gratinado, salsa BBQ, salsa maíz dulce y salsa de la casa.",
        imageUrl: "/choripapa-garosa.jpg",
        variants: [
          { label: "1P", price: 22000 },
          { label: "2P", price: 40000 },
          { label: "3P", price: 58000 },
          { label: "4P", price: 72000 },
        ],
      },
      {
        id: 4,
        name: "Choripapa Áspera",
        description: "Papa amarilla, chorizo, tocineta artesanal, costilla, queso mozzarella gratinado, salsa BBQ, salsa maíz dulce y salsa de la casa.",
        imageUrl: "/choripapa-aspera.jpg",
        variants: [
          { label: "1P", price: 24000 },
          { label: "2P", price: 42000 },
          { label: "3P", price: 60000 },
          { label: "4P", price: 74000 },
        ],
      },
      {
        id: 5,
        name: "Choripapa Golosa",
        description: "Papa amarilla, chorizo, tocineta artesanal, pollo y carne mechada, queso mozzarella gratinado, salsa BBQ, salsa maíz dulce y salsa de la casa.",
        imageUrl: "/choripapa-golosa.jpg",
        variants: [
          { label: "1P", price: 25000 },
          { label: "2P", price: 44000 },
          { label: "3P", price: 62000 },
          { label: "4P", price: 76000 },
        ],
      },
    ],
  },
  {
    category: "Picadas",
    products: [
      {
        id: 6,
        name: "Picada",
        description: "Papa amarilla, chorizo premium, costilla, trozos de lomo redondo, arepa, pico de gallo y salsas de la casa.",
        imageUrl: "/picada.jpg",
        variants: [
          { label: "1P", price: 30000 },
          { label: "2P", price: 55000 },
          { label: "3P", price: 82000 },
        ],
      },
    ],
  },
  {
    category: "Bebidas",
    products: [
      {
        id: 21,
        name: "Gaseosa Coca-Cola",
        description: "Gaseosa Coca-Cola 400ml.",
        imageUrl: "/gaseosa-coca.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 22,
        name: "Gaseosa Coca-Cola Zero",
        description: "Gaseosa Coca-Cola Zero 400ml.",
        imageUrl: "/gaseosa-coca-zero.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 23,
        name: "Gaseosa Quatro",
        description: "Gaseosa Quatro 400ml.",
        imageUrl: "/gaseosa-quatro.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 24,
        name: "Gaseosa Premio",
        description: "Gaseosa Premio 400ml.",
        imageUrl: "/gaseosa-premio.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 25,
        name: "Gaseosa Manzana",
        description: "Gaseosa Manzana 400ml.",
        imageUrl: "/gaseosa-manzana.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 26,
        name: "Gaseosa Colombiana",
        description: "Gaseosa Colombiana 400ml.",
        imageUrl: "/gaseosa-colombiana.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 27,
        name: "Gaseosa Uva",
        description: "Gaseosa Uva 400ml.",
        imageUrl: "/gaseosa-uva.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 28,
        name: "Gaseosa Naranja",
        description: "Gaseosa Naranja 400ml.",
        imageUrl: "/gaseosa-naranja.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 29,
        name: "Gaseosa Soda",
        description: "Gaseosa Soda 400ml.",
        imageUrl: "/gaseosa-soda.jpg",
        variants: [ { label: "400ml", price: 5000 } ]
      },
      {
        id: 30,
        name: "Jugo Uva",
        description: "Jugo natural de uva.",
        imageUrl: "/jugo-uva.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 31,
        name: "Jugo Fresa",
        description: "Jugo natural de fresa.",
        imageUrl: "/jugo-fresa.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 32,
        name: "Jugo Mora",
        description: "Jugo natural de mora.",
        imageUrl: "/jugo-mora.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 33,
        name: "Jugo Maracuyá",
        description: "Jugo natural de maracuyá.",
        imageUrl: "/jugo-maracuya.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 34,
        name: "Jugo Lulo",
        description: "Jugo natural de lulo.",
        imageUrl: "/jugo-lulo.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 35,
        name: "Jugo Mango",
        description: "Jugo natural de mango.",
        imageUrl: "/jugo-mango.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 36,
        name: "Jugo Frutos Rojos",
        description: "Jugo natural de frutos rojos.",
        imageUrl: "/jugo-frutos-rojos.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 37,
        name: "Jugo Piña",
        description: "Jugo natural de piña.",
        imageUrl: "/jugo-pina.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 38,
        name: "Jugo Guanábana",
        description: "Jugo natural de guanábana.",
        imageUrl: "/jugo-guanabana.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 39,
        name: "Agua",
        description: "Botella de agua.",
        imageUrl: "/agua.jpg",
        variants: [ { label: "500ml", price: 8000 } ]
      },
      {
        id: 40,
        name: "Leche",
        description: "Vaso de leche.",
        imageUrl: "/leche.jpg",
        variants: [ { label: "250ml", price: 10000 } ]
      },
      {
        id: 41,
        name: "Limonada natural",
        description: "Limonada natural.",
        imageUrl: "/limonada.jpg",
        variants: [ { label: "250ml", price: 7000 } ]
      },
      {
        id: 42,
        name: "Jarra de limonada",
        description: "Jarra de limonada natural.",
        imageUrl: "/jarra-limonada.jpg",
        variants: [ { label: "250ml", price: 14000 } ]
      },
      {
        id: 43,
        name: "Agua con gas o sin gas",
        description: "Agua con gas o sin gas.",
        imageUrl: "/agua-gas.jpg",
        variants: [ { label: "500ml", price: 4000 } ]
      },
    ],
  },
  {
    category: "Choripam",
    products: [
      {
        id: 44,
        name: "Choripam de la Casa",
        description: "Pan de orégano, chorizo premium, chimichurri, pico de gallo, queso crema, salsa verde.",
        imageUrl: "/choripam-casa.jpg",
        variants: [ { label: "Único", price: 16000 } ]
      },
      {
        id: 45,
        name: "Choripam Melo",
        description: "Pan de orégano, chorizo premium, pollo mechado, pico de gallo, queso crema, salsa verde de la casa.",
        imageUrl: "/choripam-melo.jpg",
        variants: [ { label: "Único", price: 19000 } ]
      },
      {
        id: 46,
        name: "Choripam Calidoso",
        description: "Pan de orégano, chorizo premium, pollo y carne mechada en guiso, salsa verde.",
        imageUrl: "/choripam-calidoso.jpg",
        variants: [ { label: "Único", price: 22000 } ]
      },
      {
        id: 47,
        name: "Choripam de Carnes",
        description: "Pan de orégano, chorizo premium, trozos de lomo redondo, chimichurri, pico de gallo, queso crema, salsa verde.",
        imageUrl: "/choripam-carnes.jpg",
        variants: [ { label: "Único", price: 25000 } ]
      },
    ],
  },
  {
    category: "Sándwich",
    products: [
      {
        id: 48,
        name: "Sándwich Potente",
        description: "Pan de orégano, lechuga, tomate, queso, tocineta, salsa de maíz dulce y salsa verde de la casa.",
        imageUrl: "/sandwich-potente.jpg",
        variants: [ { label: "Único", price: 15000 } ]
      },
      {
        id: 49,
        name: "Sándwich de la Casa",
        description: "Pan de orégano, pollo y carne mechada, pico de gallo, salsa verde de la casa.",
        imageUrl: "/sandwich-casa.jpg",
        variants: [ { label: "Único", price: 17000 } ]
      },
      {
        id: 50,
        name: "Sándwich Calidoso",
        description: "Pan de orégano, pollo mechado, trozos de lomo redondo, pico de gallo y salsa verde.",
        imageUrl: "/sandwich-calidoso.jpg",
        variants: [ { label: "Único", price: 21000 } ]
      },
    ],
  },
  {
    category: "Arepas",
    products: [
      {
        id: 51,
        name: "Arepa Quesuda",
        description: "Arepa rellena de queso mozzarella.",
        imageUrl: "/arepa-quesuda.jpg",
        variants: [ { label: "Única", price: 7000 } ]
      },
      {
        id: 52,
        name: "Arepa Chorizo",
        description: "Arepa rellena con chorizo premium de cerdo y queso crema.",
        imageUrl: "/arepa-chorizo.jpg",
        variants: [ { label: "Única", price: 8000 } ]
      },
      {
        id: 53,
        name: "Arepa Sencilla",
        description: "Arepa rellena con pollo mechado o carne mechada en guiso y salsas de la casa.",
        imageUrl: "/arepa-sencilla.jpg",
        variants: [ { label: "Única", price: 9000 } ]
      },
      {
        id: 54,
        name: "Arepa Mixta",
        description: "Arepa rellena con pollo mechado y carne mechada en guiso y salsas de la casa.",
        imageUrl: "/arepa-mixta.jpg",
        variants: [ { label: "Única", price: 10000 } ]
      },
      {
        id: 55,
        name: "Arepa con Todo",
        description: "Arepa rellena con pollo mechado, carne mechada en guiso, chorizo de cerdo premium y salsas de la casa.",
        imageUrl: "/arepa-todo.jpg",
        variants: [ { label: "Única", price: 12000 } ]
      },
    ],
  },
];

export default function MenuPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const categories = menuData.map((s) => s.category);
  const filtered = selected ? menuData.filter((s) => s.category === selected) : menuData;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Barra de filtros fija */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-6">Menú</h1>
          {/* Contenedor con scroll horizontal */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            <button
              className={`px-5 py-2 rounded-full font-bold border-2 transition-colors whitespace-nowrap flex-shrink-0 ${selected === null ? 'bg-yellow-400 text-black border-yellow-400 shadow' : 'bg-zinc-900 border-zinc-700 text-white hover:bg-yellow-400 hover:text-black'}`}
              onClick={() => setSelected(null)}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full font-bold border-2 transition-colors whitespace-nowrap flex-shrink-0 ${selected === cat ? 'bg-yellow-400 text-black border-yellow-400 shadow' : 'bg-zinc-900 border-zinc-700 text-white hover:bg-yellow-400 hover:text-black'}`}
                onClick={() => setSelected(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Contenido del menú */}
      <div className="px-4 py-8">
      {filtered.map((section) => (
        <section key={section.category} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-yellow-400 pb-2">{section.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {section.products.map((product) => (
              <ProductVariantCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
      </div>
    </div>
  );
} 