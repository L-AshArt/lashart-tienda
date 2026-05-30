import { Link } from 'react-router-dom'
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
