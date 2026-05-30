import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f5ede8' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c97b84' font-size='60'%3E%F0%9FA%AA%84%3C/text%3E%3C/svg%3E"
export default function CartDrawer() {
  const { items,total,count,open,setOpen,removeItem,updateQty } = useCart()
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={()=>setOpen(false)} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-brand-cream z-50 shadow-2xl flex flex-col slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-rose-light">
          <div>
            <h2 className="font-display text-xl font-light">Mi Carrito</h2>
            <p className="text-[10px] text-brand-rose tracking-[0.2em] uppercase">{count} {count===1?'artículo':'artículos'}</p>
          </div>
          <button onClick={()=>setOpen(false)} className="p-2 hover:text-brand-rose transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length===0 ? (
            <div className="text-center py-16 text-brand-black/30">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-display text-lg font-light">Carrito vacío</p>
            </div>
          ) : items.map(item=>(
            <div key={item.id} className="flex gap-3 bg-white p-3 rounded-sm">
              <div className="w-14 h-14 bg-brand-nude rounded-sm overflow-hidden flex-shrink-0">
                <img src={item.imagen||PH} alt={item.nombre} className="w-full h-full object-cover" onError={e=>e.target.src=PH} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-brand-black leading-tight line-clamp-2">{item.nombre}</p>
                <p className="text-xs text-brand-rose mt-0.5">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={()=>updateQty(item.id,item.qty-1)} className="w-5 h-5 border border-brand-rose-light text-xs flex items-center justify-center hover:bg-brand-rose hover:text-white transition-colors rounded-sm">−</button>
                  <span className="text-xs w-4 text-center">{item.qty}</span>
                  <button onClick={()=>updateQty(item.id,item.qty+1)} className="w-5 h-5 border border-brand-rose-light text-xs flex items-center justify-center hover:bg-brand-rose hover:text-white transition-colors rounded-sm">+</button>
                </div>
              </div>
              <button onClick={()=>removeItem(item.id)} className="text-brand-black/25 hover:text-brand-rose transition-colors self-start pt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
        {items.length>0 && (
          <div className="px-5 py-5 border-t border-brand-rose-light bg-white">
            {total<800 && <p className="text-[10px] text-brand-rose text-center mb-3">🌸 Agrega {formatPrice(800-total)} más para envío gratis</p>}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-black/50">Total</span>
              <span className="font-display text-xl font-light">{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" onClick={()=>setOpen(false)}
              className="block w-full bg-brand-black text-white text-center text-[10px] tracking-[0.3em] uppercase py-3.5 hover:bg-brand-rose transition-colors duration-300">
              Finalizar Pedido
            </Link>
            <Link to="/catalogo" onClick={()=>setOpen(false)}
              className="block w-full text-center text-[10px] tracking-[0.2em] uppercase py-2.5 text-brand-black/40 hover:text-brand-rose transition-colors mt-1">
              Seguir Comprando
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
