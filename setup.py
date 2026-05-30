#!/usr/bin/env python3
import os

def write(path, content):
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ✓ {path}")

print("\n🌸 Generando L-Ash Art Tienda...")

write('.gitignore', """node_modules
dist
.env
.env.local
.DS_Store
""")

write('package.json', """{
  "name": "lashart-tienda",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.4"
  }
}""")

write('index.html', """<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="L-Ash Art - Materiales profesionales para extensiones de pestañas" />
    <title>L-Ash Art | Tienda</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>""")

write('vite.config.js', """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
""")

write('tailwind.config.js', """/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-black':      '#0d0d0d',
        'brand-rose':       '#c97b84',
        'brand-rose-light': '#f0c4c9',
        'brand-nude':       '#f5ede8',
        'brand-cream':      '#faf6f4',
        'brand-gold':       '#c9a260',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
""")

write('postcss.config.js', "export default { plugins: { tailwindcss: {}, autoprefixer: {} } }\n")

write('vercel.json', '{\n  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]\n}\n')

write('src/main.jsx', """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
""")

write('src/index.css', """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-brand-cream text-brand-black font-body antialiased; }
  h1,h2,h3,h4 { @apply font-display; }
}

@keyframes fadeIn    { from{opacity:0}              to{opacity:1} }
@keyframes fadeInUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideInR  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }

.fade-in        { animation: fadeIn   0.6s ease-out both; }
.fade-in-up     { animation: fadeInUp 0.7s ease-out both; }
.slide-in-right { animation: slideInR 0.4s ease-out both; }

::-webkit-scrollbar       { width:4px }
::-webkit-scrollbar-track { background:#faf6f4 }
::-webkit-scrollbar-thumb { background:#c97b84; border-radius:2px }
""")

write('src/App.jsx', """import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider }  from './context/CartContext'
import { StoreProvider } from './context/StoreContext'
import Header     from './components/Header'
import Footer     from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home     from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Carrito  from './pages/Carrito'
import Checkout from './pages/Checkout'
import Pedido   from './pages/Pedido'
import Admin    from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <CartDrawer />
            <main className="flex-1">
              <Routes>
                <Route path="/"                   element={<Home />} />
                <Route path="/catalogo"            element={<Catalogo />} />
                <Route path="/catalogo/:categoria" element={<Catalogo />} />
                <Route path="/producto/:id"        element={<Producto />} />
                <Route path="/carrito"             element={<Carrito />} />
                <Route path="/checkout"            element={<Checkout />} />
                <Route path="/pedido/:id"          element={<Pedido />} />
                <Route path="/admin"               element={<Admin />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
""")

write('src/utils/format.js', """export function formatPrice(n) {
  return new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',minimumFractionDigits:0}).format(n)
}
export function formatDate(ts) {
  return new Intl.DateTimeFormat('es-MX',{dateStyle:'medium',timeStyle:'short'}).format(new Date(ts))
}
""")

write('src/context/CartContext.jsx', """import { createContext, useContext, useState, useEffect } from 'react'
const Ctx = createContext(null)
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lashart_cart') || '[]') } catch { return [] }
  })
  const [open, setOpen] = useState(false)
  useEffect(() => { localStorage.setItem('lashart_cart', JSON.stringify(items)) }, [items])
  const total = items.reduce((s,i) => s + i.price * i.qty, 0)
  const count = items.reduce((s,i) => s + i.qty, 0)
  function addItem(product, qty=1) {
    setItems(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id===product.id ? {...i,qty:i.qty+qty} : i)
      return [...prev, {...product,qty}]
    })
    setOpen(true)
  }
  function removeItem(id)     { setItems(prev => prev.filter(i => i.id !== id)) }
  function updateQty(id, qty) { if (qty<1) return removeItem(id); setItems(prev => prev.map(i => i.id===id ? {...i,qty} : i)) }
  function clearCart()        { setItems([]) }
  return <Ctx.Provider value={{items,total,count,open,setOpen,addItem,removeItem,updateQty,clearCart}}>{children}</Ctx.Provider>
}
export const useCart = () => useContext(Ctx)
""")

write('src/context/StoreContext.jsx', """import { createContext, useContext, useState, useEffect } from 'react'
const BASE = 'https://firestore.googleapis.com/v1/projects/lashart-b86d4/databases/(default)/documents'
const Ctx  = createContext(null)

function parseDoc(doc) {
  const id = doc.name.split('/').pop()
  const obj = { id }
  for (const [k,v] of Object.entries(doc.fields||{})) {
    if      (v.stringValue  !== undefined) obj[k] = v.stringValue
    else if (v.integerValue !== undefined) obj[k] = Number(v.integerValue)
    else if (v.doubleValue  !== undefined) obj[k] = Number(v.doubleValue)
    else if (v.booleanValue !== undefined) obj[k] = v.booleanValue
    else if (v.arrayValue)                obj[k] = (v.arrayValue.values||[]).map(x=>x.stringValue||'')
  }
  return obj
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res  = await fetch(`${BASE}/products`)
      const data = await res.json()
      const docs = (data.documents||[]).map(parseDoc).filter(p => p.store_visible !== false && p.nombre)
      setProducts(docs.length ? docs : DEMO)
    } catch(e) { console.error(e); setError(e.message); setProducts(DEMO) }
    finally { setLoading(false) }
  }

  const getCategories = () => [...new Set(products.map(p=>p.categoria).filter(Boolean))]
  const getByCategory = (cat) => cat ? products.filter(p=>p.categoria===cat) : products
  const getById       = (id)  => products.find(p=>p.id===id)

  return <Ctx.Provider value={{products,loading,error,getCategories,getByCategory,getById,refetch:fetchProducts}}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)

const DEMO = [
  {id:'d1',nombre:'Pestañas Clásicas 0.15mm',  categoria:'Pestañas', precio:180,precio_mayoreo:150,min_mayoreo:5,imagen:'',descripcion:'Hebras de seda ultra-finas para técnica clásica. Caja de 16 líneas.',store_visible:true},
  {id:'d2',nombre:'Adhesivo Negro Premium 5ml', categoria:'Adhesivos',precio:320,precio_mayoreo:280,min_mayoreo:3,imagen:'',descripcion:'Adhesivo de secado rápido 1-2 seg. Retención 6-8 semanas.',store_visible:true},
  {id:'d3',nombre:'Pinzas Curvas Titanio',       categoria:'Pinzas',   precio:450,precio_mayoreo:390,min_mayoreo:2,imagen:'',descripcion:'Pinzas de titanio anti-estáticas. Precisión profesional.',store_visible:true},
  {id:'d4',nombre:'Pestañas Volumen 0.07mm',    categoria:'Pestañas', precio:200,precio_mayoreo:170,min_mayoreo:5,imagen:'',descripcion:'Hebras ultraligeras para técnica rusa y volumen.',store_visible:true},
  {id:'d5',nombre:'Removedor en Crema 15g',     categoria:'Accesorios',precio:120,precio_mayoreo:95,min_mayoreo:5,imagen:'',descripcion:'Removedor suave sin irritación. Acción en 5 minutos.',store_visible:true},
  {id:'d6',nombre:'Kit Principiante Completo',  categoria:'Kits',     precio:1200,precio_mayoreo:1050,min_mayoreo:2,imagen:'',descripcion:'Todo para empezar: hebras, adhesivo, pinzas y removedor.',store_visible:true},
  {id:'d7',nombre:'Pestañas Mega Vol. 0.05mm',  categoria:'Pestañas', precio:220,precio_mayoreo:185,min_mayoreo:5,imagen:'',descripcion:'La fibra más delgada para mega volumen. 16 líneas.',store_visible:true},
  {id:'d8',nombre:'Gel Removedor 10ml',          categoria:'Accesorios',precio:95,precio_mayoreo:75,min_mayoreo:6,imagen:'',descripcion:'Removedor en gel con mayor control de aplicación.',store_visible:true},
]
""")

PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f5ede8' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c97b84' font-size='60'%3E%F0%9FA%AA%84%3C/text%3E%3C/svg%3E"

write('src/components/Header.jsx', """import { useState } from 'react'
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
""")

write('src/components/Footer.jsx', """import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-nude mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="font-display text-3xl font-light tracking-[0.25em] mb-0.5">L-ASH</div>
            <div className="text-[8px] tracking-[0.6em] text-brand-rose uppercase mb-4">ART</div>
            <p className="text-xs text-brand-nude/50 leading-relaxed max-w-xs">Materiales profesionales para extensionistas. Calidad que se ve, resultados que se sienten.</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.35em] uppercase mb-5 text-brand-rose">Tienda</h4>
            <ul className="space-y-2.5">
              {[['Catálogo','/catalogo'],['Pestañas','/catalogo/Pestañas'],['Adhesivos','/catalogo/Adhesivos'],['Kits','/catalogo/Kits'],['Mi Carrito','/carrito']].map(([l,t])=>(
                <li key={t}><Link to={t} className="text-xs text-brand-nude/50 hover:text-brand-rose transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.35em] uppercase mb-5 text-brand-rose">Contacto</h4>
            <ul className="space-y-2.5 text-xs text-brand-nude/50">
              <li>📍 México</li><li>📱 WhatsApp disponible</li>
              <li>📦 Envíos a todo México</li><li>💳 MercadoPago · Transferencia</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-brand-nude/30">© 2025 L-Ash Art. Todos los derechos reservados.</p>
          <p className="text-[10px] text-brand-nude/30">Hecho con 🖤 para profesionales</p>
        </div>
      </div>
    </footer>
  )
}
""")

write('src/components/ProductCard.jsx', f"""import {{ Link }} from 'react-router-dom'
import {{ useCart }} from '../context/CartContext'
import {{ formatPrice }} from '../utils/format'
const PH = "{PH}"
export default function ProductCard({{ product }}) {{
  const {{ addItem }} = useCart()
  const img   = product.imagen || product.images?.[0] || PH
  const price = Number(product.precio || 0)
  const mP    = Number(product.precio_mayoreo || 0)
  const mMin  = Number(product.min_mayoreo    || 0)
  return (
    <div className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <Link to={{`/producto/${{product.id}}`}} className="block overflow-hidden aspect-square bg-brand-nude">
        <img src={{img}} alt={{product.nombre}}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={{e=>{{e.target.src=PH}}}} />
      </Link>
      {{product.categoria && (
        <span className="absolute top-2.5 left-2.5 bg-brand-black/80 text-white text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm">
          {{product.categoria}}
        </span>
      )}}
      <div className="p-4">
        <Link to={{`/producto/${{product.id}}`}}>
          <h3 className="font-display text-base font-light text-brand-black leading-snug mb-2 hover:text-brand-rose transition-colors line-clamp-2">{{product.nombre}}</h3>
        </Link>
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-brand-black font-medium text-sm">{{formatPrice(price)}}</span>
            {{mP>0&&mMin>0&&<p className="text-[10px] text-brand-rose/80 mt-0.5">{{formatPrice(mP)}} ×{{mMin}}+</p>}}
          </div>
          <button onClick={{()=>addItem({{id:product.id,nombre:product.nombre,price,imagen:img}},1)}}
            className="flex-shrink-0 bg-brand-black text-white text-[9px] tracking-[0.2em] uppercase px-3 py-2 hover:bg-brand-rose transition-colors rounded-sm">
            + Carrito
          </button>
        </div>
      </div>
    </div>
  )
}}
""")

write('src/components/CartDrawer.jsx', f"""import {{ Link }} from 'react-router-dom'
import {{ useCart }} from '../context/CartContext'
import {{ formatPrice }} from '../utils/format'
const PH = "{PH}"
export default function CartDrawer() {{
  const {{ items,total,count,open,setOpen,removeItem,updateQty }} = useCart()
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={{()=>setOpen(false)}} />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-brand-cream z-50 shadow-2xl flex flex-col slide-in-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-rose-light">
          <div>
            <h2 className="font-display text-xl font-light">Mi Carrito</h2>
            <p className="text-[10px] text-brand-rose tracking-[0.2em] uppercase">{{count}} {{count===1?'artículo':'artículos'}}</p>
          </div>
          <button onClick={{()=>setOpen(false)}} className="p-2 hover:text-brand-rose transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{1.5}} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {{items.length===0 ? (
            <div className="text-center py-16 text-brand-black/30">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-display text-lg font-light">Carrito vacío</p>
            </div>
          ) : items.map(item=>(
            <div key={{item.id}} className="flex gap-3 bg-white p-3 rounded-sm">
              <div className="w-14 h-14 bg-brand-nude rounded-sm overflow-hidden flex-shrink-0">
                <img src={{item.imagen||PH}} alt={{item.nombre}} className="w-full h-full object-cover" onError={{e=>e.target.src=PH}} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-brand-black leading-tight line-clamp-2">{{item.nombre}}</p>
                <p className="text-xs text-brand-rose mt-0.5">{{formatPrice(item.price)}}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={{()=>updateQty(item.id,item.qty-1)}} className="w-5 h-5 border border-brand-rose-light text-xs flex items-center justify-center hover:bg-brand-rose hover:text-white transition-colors rounded-sm">−</button>
                  <span className="text-xs w-4 text-center">{{item.qty}}</span>
                  <button onClick={{()=>updateQty(item.id,item.qty+1)}} className="w-5 h-5 border border-brand-rose-light text-xs flex items-center justify-center hover:bg-brand-rose hover:text-white transition-colors rounded-sm">+</button>
                </div>
              </div>
              <button onClick={{()=>removeItem(item.id)}} className="text-brand-black/25 hover:text-brand-rose transition-colors self-start pt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ))}}
        </div>
        {{items.length>0 && (
          <div className="px-5 py-5 border-t border-brand-rose-light bg-white">
            {{total<800 && <p className="text-[10px] text-brand-rose text-center mb-3">🌸 Agrega {{formatPrice(800-total)}} más para envío gratis</p>}}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-black/50">Total</span>
              <span className="font-display text-xl font-light">{{formatPrice(total)}}</span>
            </div>
            <Link to="/checkout" onClick={{()=>setOpen(false)}}
              className="block w-full bg-brand-black text-white text-center text-[10px] tracking-[0.3em] uppercase py-3.5 hover:bg-brand-rose transition-colors duration-300">
              Finalizar Pedido
            </Link>
            <Link to="/catalogo" onClick={{()=>setOpen(false)}}
              className="block w-full text-center text-[10px] tracking-[0.2em] uppercase py-2.5 text-brand-black/40 hover:text-brand-rose transition-colors mt-1">
              Seguir Comprando
            </Link>
          </div>
        )}}
      </div>
    </>
  )
}}
""")

write('src/pages/Home.jsx', """import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
const CATS = [
  {name:'Pestañas', icon:'✨',desc:'Clásica · Volumen · Mega',    bg:'bg-gradient-to-br from-brand-rose/20 to-brand-nude'},
  {name:'Adhesivos',icon:'💧',desc:'Secado rápido y lento',       bg:'bg-gradient-to-br from-brand-black/5 to-brand-nude'},
  {name:'Pinzas',   icon:'🔧',desc:'Titanio y acero inox',        bg:'bg-gradient-to-br from-brand-gold/20 to-brand-nude'},
  {name:'Kits',     icon:'🎁',desc:'Sets completos para iniciar', bg:'bg-gradient-to-br from-brand-rose-light/40 to-brand-nude'},
]
export default function Home() {
  const { products, loading } = useStore()
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-black min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-rose rounded-full filter blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-brand-gold rounded-full filter blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <p className="text-brand-rose text-[10px] tracking-[0.6em] uppercase mb-7 fade-in">Colección Profesional 2025</p>
            <h1 className="font-display text-6xl sm:text-7xl font-light text-white leading-[1.02] mb-7 fade-in-up" style={{animationDelay:'0.1s'}}>
              El arte<br/><em className="italic text-brand-rose">perfecto</em><br/>empieza aquí
            </h1>
            <p className="text-brand-nude/60 text-sm leading-relaxed mb-10 max-w-sm fade-in-up" style={{animationDelay:'0.2s'}}>
              Materiales de extensiones de pestañas de calidad profesional. Envíos seguros a todo México.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fade-in-up" style={{animationDelay:'0.3s'}}>
              <Link to="/catalogo" className="inline-block bg-brand-rose text-white text-[10px] tracking-[0.35em] uppercase px-9 py-4 hover:bg-white hover:text-brand-black transition-all duration-300">Ver Catálogo</Link>
              <Link to="/catalogo/Kits" className="inline-block border border-white/25 text-white text-[10px] tracking-[0.35em] uppercase px-9 py-4 hover:border-brand-rose hover:text-brand-rose transition-all duration-300">Ver Kits</Link>
            </div>
          </div>
        </div>
        <div className="absolute right-[-2rem] top-1/2 -translate-y-1/2 -rotate-90 text-white/[0.04] font-display text-[140px] font-bold select-none pointer-events-none whitespace-nowrap">L-ASH ART</div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-brand-rose text-[10px] tracking-[0.5em] uppercase mb-2">Explorar</p>
          <h2 className="font-display text-4xl font-light">Categorías</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATS.map(cat => (
            <Link key={cat.name} to={`/catalogo/${cat.name}`}
              className={`group ${cat.bg} p-6 rounded-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-display text-xl font-light text-brand-black mb-1">{cat.name}</h3>
              <p className="text-[11px] text-brand-black/45 tracking-wide">{cat.desc}</p>
              <div className="mt-4 text-[10px] tracking-[0.3em] uppercase text-brand-rose">Ver →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-brand-rose text-[10px] tracking-[0.5em] uppercase mb-2">Lo más vendido</p>
              <h2 className="font-display text-4xl font-light">Destacados</h2>
            </div>
            <Link to="/catalogo" className="text-[10px] tracking-[0.25em] uppercase text-brand-black/40 hover:text-brand-rose transition-colors hidden sm:block">Ver todo →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_,i)=><div key={i} className="bg-brand-nude rounded-sm animate-pulse aspect-square"/>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/catalogo" className="inline-block border border-brand-black text-brand-black text-[10px] tracking-[0.35em] uppercase px-10 py-3.5 hover:bg-brand-black hover:text-white transition-all duration-300">
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Banner mayoreo */}
      <section className="bg-brand-rose py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-white/70 text-[10px] tracking-[0.5em] uppercase mb-4">¿Eres extensionista?</p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-white mb-5">Precios de mayoreo disponibles</h2>
          <p className="text-white/65 text-sm mb-9 max-w-md mx-auto leading-relaxed">Compra volumen y obtén mejores precios automáticamente. Se aplican directo en tu carrito.</p>
          <Link to="/catalogo" className="inline-block bg-white text-brand-rose text-[10px] tracking-[0.35em] uppercase px-9 py-4 hover:bg-brand-black hover:text-white transition-all duration-300">Comprar Ahora</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {icon:'📦',title:'Envíos Seguros',    desc:'Elige paquetería al pagar. Rastreo incluido.'},
            {icon:'✅',title:'Calidad Garantizada',desc:'Probados por extensionistas profesionales.'},
            {icon:'💳',title:'Pago Seguro',        desc:'Tarjeta, OXXO y transferencia con MercadoPago.'},
          ].map(f=>(
            <div key={f.title} className="p-8 bg-brand-nude rounded-sm">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display text-xl font-light mb-2">{f.title}</h3>
              <p className="text-xs text-brand-black/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
""")

write('src/pages/Catalogo.jsx', """import { useState, useMemo } from 'react'
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
""")

write('src/pages/Producto.jsx', f"""import {{ useState }} from 'react'
import {{ useParams, Link, useNavigate }} from 'react-router-dom'
import {{ useStore }} from '../context/StoreContext'
import {{ useCart }}  from '../context/CartContext'
import {{ formatPrice }} from '../utils/format'
const PH = "{PH}"
export default function Producto() {{
  const {{ id }} = useParams()
  const {{ getById, products }} = useStore()
  const {{ addItem }} = useCart()
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
  function handleAdd() {{
    addItem({{id:p.id,nombre:p.nombre,price:active,imagen:img}},qtyV)
    setAdded(true); setTimeout(()=>setAdded(false),2000)
  }}
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-[10px] text-brand-black/35 mb-8">
        <Link to="/" className="hover:text-brand-rose">Inicio</Link> /
        <Link to="/catalogo" className="mx-1 hover:text-brand-rose">Catálogo</Link>
        {{p.categoria&&<><Link to={{`/catalogo/${{p.categoria}}`}} className="mx-1 hover:text-brand-rose">{{p.categoria}}</Link>/</>}}
        <span className="ml-1 text-brand-black/50">{{p.nombre}}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">
        <div className="aspect-square bg-brand-nude rounded-sm overflow-hidden">
          <img src={{img}} alt={{p.nombre}} className="w-full h-full object-cover" onError={{e=>e.target.src=PH}} />
        </div>
        <div className="flex flex-col justify-center">
          {{p.categoria&&<Link to={{`/catalogo/${{p.categoria}}`}} className="text-[10px] tracking-[0.45em] uppercase text-brand-rose mb-4 inline-block hover:underline">{{p.categoria}}</Link>}}
          <h1 className="font-display text-5xl font-light mb-5 leading-tight">{{p.nombre}}</h1>
          <div className="mb-6">
            <span className="text-4xl font-display font-light">{{formatPrice(active)}}</span>
            {{mP>0&&mMin>0&&<div className="mt-1.5 text-xs text-brand-rose">{{qtyV>=mMin?'✓ Precio mayoreo aplicado':`Compra ${{mMin}}+ para mayoreo: ${{formatPrice(mP)}}`}}</div>}}
          </div>
          {{p.descripcion&&<p className="text-sm text-brand-black/55 leading-relaxed mb-8">{{p.descripcion}}</p>}}
          <div className="flex items-center gap-4 mb-7">
            <div className="flex items-center border border-brand-rose-light">
              <button onClick={{()=>setQty(q=>Math.max(1,q-1))}} className="px-5 py-3 hover:bg-brand-nude transition-colors text-lg">−</button>
              <span className="px-5 py-3 text-sm border-x border-brand-rose-light w-14 text-center">{{qtyV}}</span>
              <button onClick={{()=>setQty(q=>q+1)}} className="px-5 py-3 hover:bg-brand-nude transition-colors text-lg">+</button>
            </div>
            {{p.stock!==undefined&&Number(p.stock)<=5&&<p className="text-xs text-brand-rose">⚠ Últimas {{p.stock}} pzas</p>}}
          </div>
          <button onClick={{handleAdd}} className={{`py-4 text-[10px] tracking-[0.35em] uppercase transition-all duration-300 ${{addedV?'bg-green-600 text-white':'bg-brand-black text-white hover:bg-brand-rose'}}`}}>
            {{addedV?'✓ Agregado al Carrito':'Agregar al Carrito'}}
          </button>
        </div>
      </div>
      {{related.length>0&&(
        <div>
          <h2 className="font-display text-3xl font-light mb-8">También te puede gustar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {{related.map(r=>(
              <div key={{r.id}} onClick={{()=>{{navigate(`/producto/${{r.id}}`);window.scrollTo(0,0)}}}} className="cursor-pointer group">
                <div className="aspect-square bg-brand-nude rounded-sm overflow-hidden mb-3">
                  <img src={{r.imagen||PH}} alt={{r.nombre}} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={{e=>e.target.src=PH}} />
                </div>
                <p className="font-display text-sm font-light group-hover:text-brand-rose transition-colors">{{r.nombre}}</p>
                <p className="text-xs text-brand-rose mt-0.5">{{formatPrice(r.precio||0)}}</p>
              </div>
            ))}}
          </div>
        </div>
      )}}
    </div>
  )
}}
""")

write('src/pages/Carrito.jsx', """import { Link } from 'react-router-dom'
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
""")

write('src/pages/Checkout.jsx', """import { useState } from 'react'
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
""")

write('src/pages/Pedido.jsx', """import { useParams, Link } from 'react-router-dom'
export default function Pedido() {
  const { id } = useParams()
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-6">🎉</div>
      <h1 className="font-display text-5xl font-light mb-4">¡Pedido Confirmado!</h1>
      <p className="text-sm text-brand-black/50 mb-2">Número de pedido: <strong className="text-brand-rose">#{id}</strong></p>
      <p className="text-sm text-brand-black/45 mb-10 max-w-sm mx-auto leading-relaxed">Recibirás confirmación en breve. Contáctanos por WhatsApp para rastrear tu envío.</p>
      <Link to="/catalogo" className="inline-block bg-brand-black text-white text-[10px] tracking-[0.35em] uppercase px-10 py-4 hover:bg-brand-rose transition-colors">Seguir Comprando</Link>
    </div>
  )
}
""")

write('src/pages/Admin.jsx', """import { useState } from 'react'
import { formatPrice, formatDate } from '../utils/format'
const BASE='https://firestore.googleapis.com/v1/projects/lashart-b86d4/databases/(default)/documents'
const PIN='1379'
const STATUS={pendiente:'bg-yellow-100 text-yellow-700',pagado:'bg-blue-100 text-blue-700',enviado:'bg-purple-100 text-purple-700',entregado:'bg-green-100 text-green-700',cancelado:'bg-red-100 text-red-700'}
export default function Admin() {
  const [auth,setAuth]=useState(false)
  const [pin,setPin]=useState('')
  const [orders,setOrders]=useState([])
  const [loading,setLoading]=useState(false)
  const [selected,setSelected]=useState(null)
  function handlePin() { if(pin===PIN){setAuth(true);loadOrders()}else{setPin('');alert('PIN incorrecto')} }
  async function loadOrders() {
    setLoading(true)
    try {
      const res=await fetch(`${BASE}/orders?pageSize=50`)
      const data=await res.json()
      const docs=(data.documents||[]).map(doc=>{
        const id=doc.name.split('/').pop()
        const obj={id}
        Object.entries(doc.fields||{}).forEach(([k,v])=>{obj[k]=v.stringValue||v.integerValue||v.doubleValue||v.booleanValue||''})
        return obj
      })
      setOrders(docs.reverse())
    } catch(e){console.error(e)} finally{setLoading(false)}
  }
  if (!auth) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="bg-brand-cream p-8 rounded-sm w-80 text-center">
        <div className="font-display text-3xl font-light mb-1">L-ASH ART</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-brand-rose mb-7">Panel Admin</p>
        <div className="flex gap-2">
          <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handlePin()}
            placeholder="PIN" maxLength={6} className="flex-1 border border-brand-rose-light px-3 py-2.5 text-sm outline-none focus:border-brand-rose bg-white rounded-sm text-center tracking-widest" />
          <button onClick={handlePin} className="bg-brand-rose text-white px-4 hover:bg-brand-black transition-colors rounded-sm text-lg">→</button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light">Pedidos</h1>
        <button onClick={loadOrders} className="text-[10px] tracking-[0.3em] uppercase text-brand-rose hover:underline">↻ Actualizar</button>
      </div>
      {loading ? (
        <div className="text-center py-24 font-display text-2xl text-brand-black/25">Cargando...</div>
      ) : orders.length===0 ? (
        <div className="text-center py-24 font-display text-2xl text-brand-black/25">Sin pedidos aún</div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead className="bg-brand-nude">
              <tr>{['#','Cliente','Total','Estado','Fecha',''].map(h=><th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.3em] uppercase text-brand-black/40 font-normal">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-brand-rose-light/40">
              {orders.map(o=>(
                <tr key={o.id} className="hover:bg-brand-nude/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-brand-black/40">{o.id?.slice(-6)}</td>
                  <td className="px-4 py-3 font-medium">{o.nombre||'—'}</td>
                  <td className="px-4 py-3 text-brand-rose">{o.total?formatPrice(Number(o.total)):'—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-sm text-[9px] tracking-[0.2em] uppercase ${STATUS[o.estado]||'bg-brand-nude text-brand-black/40'}`}>{o.estado||'pendiente'}</span></td>
                  <td className="px-4 py-3 text-brand-black/35">{o.createdAt?formatDate(o.createdAt):'—'}</td>
                  <td className="px-4 py-3"><button onClick={()=>setSelected(o)} className="text-brand-rose hover:underline text-[10px]">Ver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-cream rounded-sm p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-light">Pedido #{selected.id?.slice(-6)}</h2>
              <button onClick={()=>setSelected(null)} className="text-brand-black/35 hover:text-brand-black text-lg">✕</button>
            </div>
            <pre className="text-[11px] bg-white p-4 rounded-sm overflow-auto whitespace-pre-wrap text-brand-black/70 leading-relaxed">{JSON.stringify(selected,null,2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
""")

write('api/create-preference.js', """export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { items, payer, shipping } = req.body
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) return res.status(500).json({ error: 'Agrega MERCADOPAGO_ACCESS_TOKEN en Vercel' })
  const siteUrl = process.env.VITE_SITE_URL || 'https://lashart-tienda.vercel.app'
  try {
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        items: items.map(i => ({ id:i.id, title:i.nombre, quantity:Number(i.qty), unit_price:Number(i.price), currency_id:'MXN' })),
        payer: { name:payer.nombre, email:payer.email, phone:{ number:payer.telefono } },
        shipments: { cost:Number(shipping?.price||0), mode:'not_specified' },
        back_urls: { success:`${siteUrl}/pedido/ok`, failure:`${siteUrl}/checkout`, pending:`${siteUrl}/pedido/pendiente` },
        auto_return: 'approved',
        statement_descriptor: 'L-ASH ART',
      }),
    })
    if (!r.ok) throw new Error(await r.text())
    const d = await r.json()
    res.json({ init_point:d.init_point, sandbox_init_point:d.sandbox_init_point })
  } catch(e) { console.error(e); res.status(500).json({ error:'Error al crear preferencia' }) }
}
""")

write('public/favicon.svg', """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0d0d0d"/>
  <text y=".9em" font-size="70" x="15">🪄</text>
</svg>""")

print("\n✅  Todos los archivos generados.")
