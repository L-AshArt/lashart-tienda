import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const NAV = [
  {label:'Inicio',   to:'/'},
  {label:'Catálogo', to:'/catalogo'},
  {label:'Pestañas', to:'/catalogo/Pestañas'},
  {label:'Adhesivos',to:'/catalogo/Adhesivos'},
  {label:'Kits',     to:'/catalogo/Kits'},
]

export default function Header() {
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  return (
    <>
      <div className="bg-brand-black text-brand-nude text-[10px] text-center py-2 tracking-[0.35em] uppercase font-light">
        Envío gratis en pedidos de $800 MXN o más
      </div>
      <header className="bg-brand-cream/95 border-b border-brand-rose-light sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="lg:hidden p-2" onClick={()=>setMenu(!menu)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
            <Link to="/" className="flex flex-col items-center leading-none absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <span className="font-display text-2xl font-light tracking-[0.25em] text-brand-black">L-ASH</span>
              <span className="text-[8px] tracking-[0.6em] text-brand-rose uppercase font-light -mt-1">ART</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map(l => (
                <Link key={l.to} to={l.to} className="text-[10px] tracking-[0.2em] uppercase text-brand-black hover:text-brand-rose transition-colors">{l.label}</Link>
              ))}
            </nav>
            <button onClick={()=>setOpen(true)} className="relative p-2 text-brand-black hover:text-brand-rose transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {count>0 && <span className="absolute -top-0.5 -right-0.5 bg-brand-rose text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
            </button>
          </div>
        </div>
        {menu && (
          <div className="lg:hidden border-t border-brand-rose-light">
            {NAV.map(l => (
              <Link key={l.to} to={l.to} onClick={()=>setMenu(false)}
                className="block px-6 py-3 text-[10px] tracking-[0.25em] uppercase text-brand-black hover:bg-brand-nude hover:text-brand-rose transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
