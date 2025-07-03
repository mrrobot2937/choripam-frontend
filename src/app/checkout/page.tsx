"use client";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import Image from "next/image";

const paymentOptions = [
  { value: "efectivo", label: "Efectivo a la entrega" },
  { value: "transferencia", label: "Transferencia bancaria (Nequi)" },
];
const deliveryOptions = [
  { value: "mesa", label: "Para la mesa" },
  { value: "recoger", label: "Para recoger" },
  { value: "domicilio", label: "A domicilio" },
];

const NEQUI_NUMBER = "3001234567"; // Cambia por el número real
const QR_IMAGE = "/qr-nequi.png"; // Debes agregar esta imagen en public

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [payment, setPayment] = useState(paymentOptions[0].value);
  const [delivery, setDelivery] = useState(deliveryOptions[0].value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [terms, setTerms] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mesa, setMesa] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  function handleApplyCoupon() {
    if (coupon.toUpperCase() === "PRIMERA10" && !couponApplied) {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponApplied(true);
    }
  }

  async function handleOrder() {
    setLoading(true);
    setError("");
    try {
      const pedido = {
        nombre: name,
        telefono: phone,
        correo: email,
        direccion: delivery === "domicilio" ? address : "",
        mesa: delivery === "mesa" ? mesa : "",
        productos: cart.map(item => ({
          id: typeof item.id === "number" ? item.id : parseInt(item.id, 10),
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        metodo_pago: payment,
        modalidad_entrega: delivery
      };
      const res = await fetch("http://localhost:8000/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
      });
      if (!res.ok) throw new Error("Error al guardar el pedido");
      // Enviar mensaje de WhatsApp al cliente
      const whatsappBody = payment === "transferencia"
        ? `Hola ${name}, tu pedido en Choripam fue recibido. Recuerda transferir a Nequi ${NEQUI_NUMBER} y enviar el comprobante para confirmar tu pago. Total: $${total.toLocaleString()}`
        : `Hola ${name}, tu pedido en Choripam fue recibido. Te esperamos para entregarlo. Total: $${total.toLocaleString()}`;
      await fetch("http://localhost:8000/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: `whatsapp:+57${phone.replace(/[^0-9]/g, "")}`,
          body: whatsappBody
        })
      });
      setOrderSent(true);
      clearCart();
    } catch (err) {
      setError("No se pudo guardar el pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // Mensaje de WhatsApp personalizado
  const WHATSAPP_NUMBER = "573155707763";
  let whatsappMsg = "";
  if (payment === "transferencia") {
    whatsappMsg = encodeURIComponent(
      `Hola, me gustaría confirmar mi pedido:\n\n${cart
        .map((item) => `- ${item.name} x${item.quantity}`)
        .join("\n")}\n\nTotal: $${total.toLocaleString()}\nPago: Transferencia bancaria (Nequi)\nEntrega: ${delivery}${delivery === "domicilio" ? `\nDirección: ${address}` : ""}\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${email}\n\nYa realicé la transferencia al número ${NEQUI_NUMBER}. Por favor, responde este mensaje con el comprobante de la transacción. Nuestro bot lo analizará automáticamente para confirmar tu pago.`
    );
  } else {
    whatsappMsg = encodeURIComponent(
      `Hola, me gustaría confirmar mi pedido:\n\n${cart
        .map((item) => `- ${item.name} x${item.quantity}`)
        .join("\n")}\n\nTotal: $${total.toLocaleString()}\nPago: Efectivo a la entrega\nEntrega: ${delivery}${delivery === "domicilio" ? `\nDirección: ${address}` : ""}\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${email}`
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <Image src="/choripam-logo.svg" alt="Logo Choripam" width={60} height={30} />
          <h1 className="text-3xl font-extrabold">Finalizar pedido</h1>
        </div>
        {orderSent ? (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-400">¡Pedido realizado!</h2>
            <p className="text-lg">Te va a llegar un mensaje a tu WhatsApp para confirmar el pago de tu pedido.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-8 py-3 rounded-full bg-green-400 text-black font-bold text-lg shadow-lg hover:bg-green-300 transition-colors"
            >
              Ir a WhatsApp
            </a>
            {payment === "transferencia" && (
              <div className="mt-6 text-center text-yellow-400">
                <p className="mb-2">Recuerda enviar el comprobante de la transferencia. Nuestro bot lo analizará automáticamente para confirmar tu pago.</p>
              </div>
            )}
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={async e => {
              e.preventDefault();
              await handleOrder();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold">Nombre</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-bold">Método de pago</label>
                <select
                  value={payment}
                  onChange={e => setPayment(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {paymentOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-bold">Modalidad de entrega</label>
                <select
                  value={delivery}
                  onChange={e => setDelivery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {deliveryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {delivery === "domicilio" && (
              <div>
                <label className="block mb-2 font-bold">Dirección</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            )}
            {delivery === "mesa" && (
              <div>
                <label className="block mb-2 font-bold">Número de mesa</label>
                <input
                  type="text"
                  required
                  value={mesa}
                  onChange={e => setMesa(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            )}
            {payment === "transferencia" && (
              <div className="bg-zinc-800 rounded-xl p-4 mt-4 flex flex-col items-center">
                <p className="text-lg font-bold text-yellow-400 mb-2">Transfiere a Nequi</p>
                <Image src={QR_IMAGE} alt="QR Nequi" width={120} height={120} className="mb-2 rounded-lg" />
                <p className="text-white text-lg">Número: <span className="font-mono text-yellow-400">{NEQUI_NUMBER}</span></p>
                <p className="text-sm text-gray-400 mt-2">Luego de transferir, haz clic en "Confirmar pedido" y envía el comprobante al WhatsApp que se abrirá automáticamente.</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cupón de descuento"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled={couponApplied}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors"
                disabled={couponApplied}
              >
                {couponApplied ? "Aplicado" : "Aplicar"}
              </button>
            </div>
            <div className="bg-zinc-800 rounded-xl p-4 mt-4">
              <h2 className="text-xl font-bold mb-2">Resumen del pedido</h2>
              {cart.length === 0 ? (
                <p className="text-zinc-400">No hay productos en el carrito.</p>
              ) : (
                <ul className="mb-2">
                  {cart.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-lg text-green-400">
                  <span>Descuento</span>
                  <span>- ${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-extrabold mt-2">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={e => setTerms(e.target.checked)}
                className="w-5 h-5 accent-yellow-400"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-300">Acepto los <a href="/privacidad" target="_blank" className="underline text-yellow-400">términos de privacidad</a></label>
            </div>
            {error && <div className="text-red-400 text-center font-bold mb-4">{error}</div>}
            {loading && <div className="text-yellow-400 text-center font-bold mb-4">Guardando pedido...</div>}
            <button
              type="submit"
              className="w-full mt-6 py-4 rounded-full bg-green-400 text-black font-bold text-2xl shadow-lg hover:bg-green-300 transition-colors disabled:opacity-50"
              disabled={cart.length === 0 || !terms}
            >
              Confirmar pedido
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 