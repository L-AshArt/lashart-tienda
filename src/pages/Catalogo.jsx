import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
export default function Catalogo() {
  const { categoria } = useParams()
  const { products, loading, getCategories } = useStore()
  const [active, setActive] = useState(categoria||'Todos')
  const [sort,   setSort]   = useState('default')
  const cats = ['Todos', ...getCategories()]
  const list = useMemo(() => {
    let r = active==='Todos' ? products : products.filter(p=>p.categoria===active)
    if (sort==='asc')  r=[...r].sort((a,b)=>a.precio-b.precio)
    if (sort==='desc') r=[...r].sort((a,b)=>b.precio-a.precio)
    if (sort==='name') r=[...r].sort((a,b)=>a.nombre.localeCompare(b.nombre))
    return r
  }, [products,active,sort])
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-[10px] text-brand-black/35 mb-8 tracking-wide">
        <Link to="/" className="hover:text-brand-rose">Inicio</Link> / Catálogo{active!=='Todos'&&<span> / {active}</span>}
      </div>
      <h1 className="font-display text-5xl font-light mb-10">Catálogo</h1>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {cats.map(cat=>(
            <button key={cat} onClick={()=>setActive(cat)}
              className={`text-[9px] tracking-[0.25em] uppercase px-4 py-2 rounded-sm transition-all ${active===cat?'bg-brand-black text-white':'bg-white text-brand-black/50 hover:bg-brand-nude'}`}>
              {cat}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          className="ml-auto text-[9px] tracking-[0.2em] uppercase bg-white border border-brand-rose-light px-3 py-2 outline-none text-brand-black/50 rounded-sm">
          <option value="default">Ordenar</option>
          <option value="asc">Precio ↑</option>
          <option value="desc">Precio ↓</option>
          <option value="name">Nombre</option>
        </select>
      </div>
      <p className="text-[10px] text-brand-black/30 mb-6">{list.length} {list.length===1?'producto':'productos'}</p>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_,i)=><div key={i} className="bg-brand-nude rounded-sm animate-pulse aspect-square"/>)}
        </div>
      ) : list.length===0 ? (
        <div className="text-center py-24"><div className="text-5xl mb-4">✨</div><p className="font-display text-2xl text-brand-black/25">Sin productos aquí</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {list.map(p=><ProductCard key={p.id} product={p}/>)}
        </div>
      )}
    </div>
  )
}
