"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const banners = [
  { src: "/banner1.jpg", alt: "Choripán especial" },
  { src: "/banner2.jpg", alt: "Promoción del día" },
  { src: "/banner3.jpg", alt: "Bebidas y combos" },
];

const cupones = [
  { code: "PRIMERA10", desc: "10% de descuento en tu primera compra" },
  { code: "FAMILIA", desc: "15% en pedidos familiares" },
];

const promos = [
  { title: "Combo Choripapa + Gaseosa", desc: "Aprovecha el combo del día", img: "/promo1.jpg" },
  { title: "2x1 en Arepas", desc: "Solo hoy, arepas rellenas 2x1", img: "/promo2.jpg" },
];

export default function Home() {
  const [showModal, setShowModal] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  // Slider automático
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIdx((idx) => (idx + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Logo fijo arriba a la izquierda */}
      <header className="fixed top-0 left-0 z-50 p-4">
        <Link href="/">
          <Image src="https://terrazaedenfiles.s3.us-east-2.amazonaws.com/WhatsApp+Image+2025-07-04+at+4.36.20+PM.jpeg" alt="Logo Choripam" width={120} height={60} className="drop-shadow-xl" />
        </Link>
      </header>
      {/* Banner/slider principal */}
      <section className="w-full flex flex-col items-center justify-center pt-24 pb-8 px-2 bg-gradient-to-br from-black via-zinc-900 to-yellow-400/10">
        <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl mb-6 relative">
          <Image
            src={banners[bannerIdx].src}
            alt={banners[bannerIdx].alt}
            width={900}
            height={350}
            className="w-full h-[220px] md:h-[350px] object-cover transition-all duration-700"
            priority
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <span key={i} className={`w-3 h-3 rounded-full ${i === bannerIdx ? "bg-yellow-400" : "bg-white/30"} border border-white/40`}></span>
            ))}
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-2 tracking-tight drop-shadow-lg animate-fade-in">¡El mejor choripán, promos y combos!</h1>
        <p className="text-xl md:text-2xl text-center text-gray-300 mb-4 animate-fade-in">Disfruta cupones, promociones y el sabor más auténtico.</p>
        <Link href="/menu">
          <button className="px-10 py-4 rounded-full bg-yellow-400 text-black text-2xl font-bold shadow-lg hover:bg-yellow-300 transition-colors animate-bounce">
            Ver Menú
          </button>
        </Link>
      </section>
      {/* Cupones del día */}
      <section className="w-full max-w-4xl mx-auto mt-8 mb-4 px-2">
        <h2 className="text-2xl font-bold mb-3 text-yellow-400">Cupones del día</h2>
        <div className="flex gap-4 flex-wrap">
          {cupones.map((c) => (
            <div key={c.code} className="bg-zinc-800 rounded-xl px-6 py-4 flex flex-col items-center shadow border border-yellow-400/40">
              <span className="font-mono text-lg text-yellow-400 bg-yellow-200/20 px-3 py-1 rounded mb-2">{c.code}</span>
              <span className="text-white text-base text-center">{c.desc}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Promociones del día */}
      <section className="w-full max-w-4xl mx-auto mt-4 mb-8 px-2">
        <h2 className="text-2xl font-bold mb-3 text-yellow-400">Promociones del día</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promos.map((promo) => (
            <div key={promo.title} className="bg-zinc-900 rounded-2xl flex flex-col md:flex-row items-center gap-4 p-4 shadow-xl border border-yellow-400/20">
              <Image src={promo.img} alt={promo.title} width={120} height={120} className="rounded-xl object-cover w-[120px] h-[120px]" />
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-1">{promo.title}</h3>
                <p className="text-white text-base">{promo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Modal de descuento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white text-black rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-xs animate-fade-in">
            <h2 className="text-3xl font-extrabold mb-2 text-yellow-500">¡Bienvenido!</h2>
            <p className="text-lg mb-4 text-center">Obtén <span className="font-bold text-2xl text-yellow-500">10% de descuento</span> en tu primera compra usando el cupón <span className="font-mono bg-yellow-200 px-2 py-1 rounded">PRIMERA10</span></p>
            <button onClick={() => setShowModal(false)} className="mt-2 px-6 py-2 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors">¡Quiero mi descuento!</button>
          </div>
        </div>
      )}
    </div>
  );
}
