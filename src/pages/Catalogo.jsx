import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

const TIPOS = [
  { key:'todos',    label:'Todos'      },
  { key:'clasica',  label:'Clásica'    },
  { key:'tec',      label:'Tecnológicas' },
  { key:'abanico',  label:'Abanico'    },
  { key:'adhesivo', label:'Adhesivos'  },
  { key:'pinza',    label:'Pinzas'     },
  { key:'insumo',   label:'Insumos'    },
  { key:'otro',     label:'Otros'      },
]

const FIBRAS = ['clasica', 'tec', 'abanico']

// ── Catálogo para fibras: grosor → curva → largo ──────────────────────────────
function FibraCatalog({ products, tipo }) {
  const isClasica = tipo === 'clasica'
  const groupKey  = isClasica ? 'grosor' : 'dimension'

  // estado: { [gval]: curva seleccionada }
  const [selCurva, setSelCurva] = useState({})
  // estado: { [`${gval}|${curva}`]: largo seleccionado }
  const [selLargo, setSelLargo] = useState({})

  const groups = [...new Set(
    products.map(p => p[groupKey]).filter(Boolean)
  )].sort((a, b) => {
    const n = (v) => parseFloat(v) || 0
    return n(a) - n(b)
  })

  return (
    <div className="space-y-5">
      {groups.map(gval => {
        const gProds   = products.filter(p => p[groupKey] === gval)
        const curvas   = [...new Set(gProds.map(p => p.curva).filter(Boolean))].sort()
        const curva    = selCurva[gval] || curvas[0]
        const cProds   = gProds.filter(p => p.curva === curva)
        const largos   = isClasica
          ? [...new Set(cProds.map(p => p.largo).filter(Boolean))].sort((a,b)=>{
              if (a==='Mix') return -1; if (b==='Mix') return 1
              return Number(a)-Number(b)
            })
          : []
        const largoKey = `${gval}|${curva}`
        const largo    = selLargo[largoKey] || largos[0] || ''
        const final    = isClasica
          ? cProds.filter(p => p.largo === largo)
          : cProds

        if (final.length === 0) return null

        return (
          <div key={gval} className="bg-white rounded-sm shadow-sm overflow-hidden">
            {/* Header grosor / dimension */}
            <div className="px-5 py-3 bg-brand-nude border-b border-brand-rose-light flex items-baseline gap-2">
              <span className="font-display text-xl font-light">{gval}</span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-brand-black/40">
                {isClasica ? 'mm' : ''}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Curva chips */}
              {curvas.length > 0 && (
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-brand-black/35 mb-2">Curva</p>
                  <div className="flex gap-2">
                    {curvas.map(c => (
                      <button key={c}
                        onClick={() => setSelCurva(s => ({...s, [gval]: c}))}
                        className={`w-10 h-10 text-sm rounded-sm transition-all border ${
                          curva === c
                            ? 'bg-brand-black text-white border-brand-black'
                            : 'bg-white text-brand-black border-brand-rose-light hover:bg-brand-nude'
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Largo chips (solo clásica) */}
              {isClasica && largos.length > 1 && (
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-brand-black/35 mb-2">Largo</p>
                  <div className="flex flex-wrap gap-2">
                    {largos.map(l => (
                      <button key={l}
                        onClick={() => setSelLargo(s => ({...s, [largoKey]: l}))}
                        className={`px-3 py-1.5 text-xs rounded-sm transition-all border ${
                          largo === l
                            ? 'bg-brand-rose text-white border-brand-rose'
                            : 'bg-white text-brand-black border-brand-rose-light hover:bg-brand-nude'
                        }`}>
                        {l === 'Mix' ? 'Mix' : `${l}mm`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Productos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {final.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Catálogo para no-fibras: agrupa por marca ─────────────────────────────────
function MarcaCatalog({ products }) {
  const marcas = [...new Set(products.map(p => p.marca || 'Sin marca'))]

  if (marcas.length <= 1) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {marcas.map(marca => {
        const mp = products.filter(p => (p.marca || 'Sin marca') === marca)
        return (
          <div key={marca} className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-brand-nude border-b border-brand-rose-light">
              <span className="font-display text-xl font-light">{marca}</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mp.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Catalogo() {
  const { products, loading } = useStore()
  const [tipo, setTipo] = useState('todos')

  const available = TIPOS.filter(t =>
    t.key === 'todos' || products.some(p => p.tipo === t.key)
  )

  const filtered = tipo === 'todos'
    ? products
    : products.filter(p => p.tipo === tipo)

  const isFibra = FIBRAS.includes(tipo)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="text-[10px] text-brand-black/35 mb-6 tracking-wide">
        <Link to="/" className="hover:text-brand-rose">Inicio</Link> / Catálogo
        {tipo !== 'todos' && (
          <span> / {available.find(t => t.key === tipo)?.label}</span>
        )}
      </div>

      <h1 className="font-display text-5xl font-light mb-8">Catálogo</h1>

      {/* Tipo tabs */}
      <div className="flex flex-wrap gap-2 mb-8 pb-5 border-b border-brand-rose-light">
        {available.map(t => (
          <button key={t.key} onClick={() => setTipo(t.key)}
            className={`text-[9px] tracking-[0.25em] uppercase px-4 py-2 rounded-sm transition-all ${
              tipo === t.key
                ? 'bg-brand-black text-white'
                : 'bg-white text-brand-black/50 hover:bg-brand-nude'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-brand-black/30 mb-5">
        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
      </p>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_,i) => (
            <div key={i} className="h-44 bg-brand-nude rounded-sm animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">✨</div>
          <p className="font-display text-2xl text-brand-black/25">Sin productos aquí</p>
        </div>
      ) : isFibra ? (
        <FibraCatalog products={filtered} tipo={tipo} />
      ) : tipo === 'todos' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <MarcaCatalog products={filtered} />
      )}
    </div>
  )
}
