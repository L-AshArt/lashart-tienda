import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
export default function Carrito() {
  const { items,total,removeItem,updateQty } = useCart()
  const freeShip = total>=800
  if (items.length===0) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">🛒</div>
      <h1 className="font-display text-3xl font-light mb-3">Tu carrito está vacío</h1>
      <p className="text-sm text-brand-black/45 mb-8">Explora nuestro catálogo y agrega tus favoritos.</p>
      <Link to="/catalogo" className="inline-block bg-brand-black text-white text-[10px] tracking-[0.35em] uppercase px-8 py-4 hover:bg-brand-rose transition-colors">Ver Catálogo</Link>
    </div>
  )
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-light mb-10">Mi Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item=>(
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-sm shadow-sm">
              <div className="w-20 h-20 bg-brand-nude rounded-sm overflow-hidden flex-shrink-0">
                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" onError={e=>e.target.src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f5ede8" width="100" height="100"/%3E%3C/svg%3E'} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-light leading-snug">{item.nombre}</h3>
                <p className="text-sm text-brand-rose mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-brand-rose-light">
                    <button onClick={()=>updateQty(item.id,item.qty-1)} className="px-3 py-1.5 hover:bg-brand-nude transition-colors">−</button>
                    <span className="px-3 py-1.5 text-sm border-x border-brand-rose-light w-10 text-center">{item.qty}</span>
                    <button onClick={()=>updateQty(item.id,item.qty+1)} className="px-3 py-1.5 hover:bg-brand-nude transition-colors">+</button>
                  </div>
                  <button onClick={()=>removeItem(item.id)} className="text-xs text-brand-black/25 hover:text-red-400 transition-colors">Eliminar</button>
                </div>
              </div>
              <p className="font-medium">{formatPrice(item.price*item.qty)}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
            <h2 className="font-display text-xl font-light mb-6">Resumen</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-brand-black/55"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-brand-black/55"><span>Envío</span><span className={freeShip?'text-green-600 font-medium':''}>{freeShip?'GRATIS':'Al pagar'}</span></div>
              <div className="border-t border-brand-rose-light pt-3 flex justify-between"><span className="font-medium">Total</span><span className="font-display text-xl font-light">{formatPrice(total)}</span></div>
            </div>
            {!freeShip&&<div className="bg-brand-rose/10 p-3 rounded-sm mb-4 text-center"><p className="text-[11px] text-brand-rose">🌸 Agrega {formatPrice(800-total)} más para envío gratis</p></div>}
            <Link to="/checkout" className="block w-full bg-brand-black text-white text-center text-[10px] tracking-[0.35em] uppercase py-4 hover:bg-brand-rose transition-colors duration-300">Proceder al Pago</Link>
            <Link to="/catalogo" className="block text-center text-[10px] text-brand-black/35 hover:text-brand-rose mt-3 tracking-wide transition-colors">← Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
