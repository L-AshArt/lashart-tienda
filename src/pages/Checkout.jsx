import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
const PKG=[
  {id:'estafeta',name:'Estafeta',        desc:'3-5 días hábiles',             price:120},
  {id:'dhl',     name:'DHL Express',     desc:'1-2 días hábiles',             price:180},
  {id:'fedex',   name:'FedEx',           desc:'2-3 días hábiles',             price:150},
  {id:'pickup',  name:'Recoger en tienda',desc:'Gratis · Coordinar WhatsApp', price:0},
]
export default function Checkout() {
  const { items, total } = useCart()
  const [step,setStep]=useState(1)
  const [ship,setShip]=useState(null)
  const [form,setForm]=useState({nombre:'',email:'',telefono:'',calle:'',colonia:'',ciudad:'',cp:'',estado:''})
  const freeShip=total>=800, shipCost=freeShip?0:(ship?.price||0), grand=total+shipCost
  if (items.length===0) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="font-display text-2xl text-brand-black/25">Tu carrito está vacío</p>
      <Link to="/catalogo" className="mt-6 inline-block text-xs text-brand-rose">← Ir al catálogo</Link>
    </div>
  )
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-light mb-10">Finalizar Pedido</h1>
      <div className="flex items-center gap-2 mb-10 text-[10px] tracking-[0.25em] uppercase">
        {['Datos','Envío','Pago'].map((s,i)=>(
          <div key={s} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${step>i+1?'bg-green-500 text-white':step===i+1?'bg-brand-rose text-white':'bg-brand-nude text-brand-black/35'}`}>{step>i+1?'✓':i+1}</span>
            <span className={step===i+1?'text-brand-black':'text-brand-black/30'}>{s}</span>
            {i<2&&<span className="text-brand-black/15 mx-1">—</span>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step===1&&(
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h2 className="font-display text-2xl font-light mb-6">Tus Datos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['nombre','Nombre completo','text','sm:col-span-2'],['email','Correo','email',''],['telefono','Teléfono / WhatsApp','tel',''],['calle','Calle y número','text','sm:col-span-2'],['colonia','Colonia','text',''],['cp','C.P.','text',''],['ciudad','Ciudad','text',''],['estado','Estado','text','']].map(([n,l,t,c])=>(
                  <div key={n} className={c}>
                    <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-black/45 mb-1.5">{l}</label>
                    <input type={t} name={n} value={form[n]} onChange={e=>setForm(f=>({...f,[e.target.name]:e.target.value}))}
                      className="w-full border border-brand-rose-light px-3 py-2.5 text-sm outline-none focus:border-brand-rose bg-brand-cream rounded-sm" />
                  </div>
                ))}
              </div>
              <button onClick={()=>setStep(2)} disabled={!form.nombre||!form.email||!form.telefono}
                className="mt-6 w-full bg-brand-black text-white text-[10px] tracking-[0.35em] uppercase py-4 hover:bg-brand-rose transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Continuar → Envío
              </button>
            </div>
          )}
          {step===2&&(
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h2 className="font-display text-2xl font-light mb-6">Método de Envío</h2>
              {freeShip&&<div className="bg-green-50 border border-green-200 rounded-sm p-3 mb-5 text-xs text-green-700">🎉 ¡Tienes envío gratis en este pedido!</div>}
              <div className="space-y-3">
                {PKG.map(pk=>(
                  <label key={pk.id} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${ship?.id===pk.id?'border-brand-rose bg-brand-rose/5':'border-brand-rose-light hover:bg-brand-nude'}`}>
                    <input type="radio" name="ship" checked={ship?.id===pk.id} onChange={()=>setShip(pk)} className="accent-brand-rose" />
                    <div className="flex-1"><p className="text-sm font-medium">{pk.name}</p><p className="text-[11px] text-brand-black/45 mt-0.5">{pk.desc}</p></div>
                    <span className="text-sm font-medium">{pk.price===0?'Gratis':freeShip?<span className="line-through text-brand-black/25">{formatPrice(pk.price)}</span>:formatPrice(pk.price)}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={()=>setStep(1)} className="flex-1 border border-brand-rose-light text-[10px] tracking-[0.25em] uppercase py-3.5 hover:bg-brand-nude transition-colors rounded-sm">← Atrás</button>
                <button onClick={()=>setStep(3)} disabled={!ship} className="flex-1 bg-brand-black text-white text-[10px] tracking-[0.25em] uppercase py-3.5 hover:bg-brand-rose transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-sm">Continuar → Pago</button>
              </div>
            </div>
          )}
          {step===3&&(
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h2 className="font-display text-2xl font-light mb-6">Pago</h2>
              <div className="bg-brand-nude rounded-sm p-8 text-center mb-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-brand-black/40 mb-2">Total a pagar</p>
                <p className="font-display text-5xl font-light">{formatPrice(grand)}</p>
                <p className="text-xs text-brand-black/35 mt-2">Tarjeta · OXXO · Transferencia</p>
              </div>
              <button onClick={()=>alert('🔜 MercadoPago se integra cuando tengas las credenciales. Por ahora contacta por WhatsApp.')}
                className="w-full bg-brand-rose text-white text-[10px] tracking-[0.35em] uppercase py-4 hover:bg-brand-black transition-colors duration-300">
                Pagar con MercadoPago
              </button>
              <p className="text-[10px] text-brand-black/25 text-center mt-3">🔒 Pago 100% seguro</p>
              <button onClick={()=>setStep(2)} className="mt-4 w-full text-[10px] text-brand-black/35 hover:text-brand-rose tracking-wide transition-colors">← Cambiar método de envío</button>
            </div>
          )}
        </div>
        <div>
          <div className="bg-white p-5 rounded-sm shadow-sm sticky top-24">
            <h3 className="font-display text-lg font-light mb-4">Tu Pedido</h3>
            <div className="space-y-2.5 mb-4 max-h-52 overflow-y-auto pr-1">
              {items.map(i=>(
                <div key={i.id} className="flex justify-between text-[11px]">
                  <span className="text-brand-black/60 flex-1 mr-2 line-clamp-1">{i.nombre} ×{i.qty}</span>
                  <span className="text-brand-black font-medium flex-shrink-0">{formatPrice(i.price*i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-rose-light pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-brand-black/55"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              {ship&&<div className="flex justify-between text-brand-black/55"><span>{ship.name}</span><span>{shipCost===0?'Gratis':formatPrice(shipCost)}</span></div>}
              <div className="flex justify-between pt-2 border-t border-brand-rose-light"><span className="font-medium">Total</span><span className="font-display text-lg font-light">{formatPrice(grand)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
