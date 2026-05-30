import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useCart }  from '../context/CartContext'
import { formatPrice } from '../utils/format'
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f5ede8' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c97b84' font-size='60'%3E%F0%9FA%AA%84%3C/text%3E%3C/svg%3E"
export default function Producto() {
  const { id } = useParams()
  const { getById, products } = useStore()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [qty,added] = [useState(1),useState(false)]
  const setQty=qty[1], setAdded=added[1]
  const qtyV=qty[0], addedV=added[0]
  const p = getById(id)
  if (!p) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <p className="font-display text-2xl text-brand-black/25">Producto no encontrado</p>
      <Link to="/catalogo" className="mt-6 inline-block text-xs text-brand-rose">← Catálogo</Link>
    </div>
  )
  const price=Number(p.precio||0), mP=Number(p.precio_mayoreo||0), mMin=Number(p.min_mayoreo||0)
  const active=(mP>0&&mMin>0&&qtyV>=mMin)?mP:price
  const img=p.imagen||p.images?.[0]||PH
  const related=products.filter(x=>x.categoria===p.categoria&&x.id!==id).slice(0,4)
  function handleAdd() {
    addItem({id:p.id,nombre:p.nombre,price:active,imagen:img},qtyV)
    setAdded(true); setTimeout(()=>setAdded(false),2000)
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-[10px] text-brand-black/35 mb-8">
        <Link to="/" className="hover:text-brand-rose">Inicio</Link> /
        <Link to="/catalogo" className="mx-1 hover:text-brand-rose">Catálogo</Link>
        {p.categoria&&<><Link to={`/catalogo/${p.categoria}`} className="mx-1 hover:text-brand-rose">{p.categoria}</Link>/</>}
        <span className="ml-1 text-brand-black/50">{p.nombre}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">
        <div className="aspect-square bg-brand-nude rounded-sm overflow-hidden">
          <img src={img} alt={p.nombre} className="w-full h-full object-cover" onError={e=>e.target.src=PH} />
        </div>
        <div className="flex flex-col justify-center">
          {p.categoria&&<Link to={`/catalogo/${p.categoria}`} className="text-[10px] tracking-[0.45em] uppercase text-brand-rose mb-4 inline-block hover:underline">{p.categoria}</Link>}
          <h1 className="font-display text-5xl font-light mb-5 leading-tight">{p.nombre}</h1>
          <div className="mb-6">
            <span className="text-4xl font-display font-light">{formatPrice(active)}</span>
            {mP>0&&mMin>0&&<div className="mt-1.5 text-xs text-brand-rose">{qtyV>=mMin?'✓ Precio mayoreo aplicado':`Compra ${mMin}+ para mayoreo: ${formatPrice(mP)}`}</div>}
          </div>
          {p.descripcion&&<p className="text-sm text-brand-black/55 leading-relaxed mb-8">{p.descripcion}</p>}
          <div className="flex items-center gap-4 mb-7">
            <div className="flex items-center border border-brand-rose-light">
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-5 py-3 hover:bg-brand-nude transition-colors text-lg">−</button>
              <span className="px-5 py-3 text-sm border-x border-brand-rose-light w-14 text-center">{qtyV}</span>
              <button onClick={()=>setQty(q=>q+1)} className="px-5 py-3 hover:bg-brand-nude transition-colors text-lg">+</button>
            </div>
            {p.stock!==undefined&&Number(p.stock)<=5&&<p className="text-xs text-brand-rose">⚠ Últimas {p.stock} pzas</p>}
          </div>
          <button onClick={handleAdd} className={`py-4 text-[10px] tracking-[0.35em] uppercase transition-all duration-300 ${addedV?'bg-green-600 text-white':'bg-brand-black text-white hover:bg-brand-rose'}`}>
            {addedV?'✓ Agregado al Carrito':'Agregar al Carrito'}
          </button>
        </div>
      </div>
      {related.length>0&&(
        <div>
          <h2 className="font-display text-3xl font-light mb-8">También te puede gustar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map(r=>(
              <div key={r.id} onClick={()=>{navigate(`/producto/${r.id}`);window.scrollTo(0,0)}} className="cursor-pointer group">
                <div className="aspect-square bg-brand-nude rounded-sm overflow-hidden mb-3">
                  <img src={r.imagen||PH} alt={r.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>e.target.src=PH} />
                </div>
                <p className="font-display text-sm font-light group-hover:text-brand-rose transition-colors">{r.nombre}</p>
                <p className="text-xs text-brand-rose mt-0.5">{formatPrice(r.precio||0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
