import { createContext, useContext, useState, useEffect } from 'react'

// TODO: si el catálogo supera 300 docs, implementar paginación con
// pageToken en lugar de aumentar pageSize indefinidamente
const PRODUCTS_URL = 'https://firestore.googleapis.com/v1/projects/lashart-b86d4/databases/(default)/documents/products?pageSize=300'
const Ctx = createContext(null)

// Convierte Firestore REST wire format → JS plano (recursivo)
function decode(fields) {
  const out = {}
  for (const [k, v] of Object.entries(fields || {})) {
    if      ('stringValue'  in v) out[k] = v.stringValue
    else if ('integerValue' in v) out[k] = Number(v.integerValue)
    else if ('doubleValue'  in v) out[k] = v.doubleValue
    else if ('booleanValue' in v) out[k] = v.booleanValue
    else if ('nullValue'    in v) out[k] = null
    else if ('mapValue'     in v) out[k] = decode(v.mapValue.fields || {})
    else if ('arrayValue'   in v) out[k] = (v.arrayValue.values || []).map(el => decode({ _: el })._)
  }
  return out
}

// Añade el distinguidor de variante al nombre base del documento
function variantNombre(base, v) {
  if (v.largo) return `${base} ${v.largo === 'Mix' ? 'Mix' : `${v.largo}mm`}`
  if (v.color) return `${base} ${v.color}`
  return base
}

function buildDesc(doc, v) {
  const parts = []
  if (v?.diametro)                   parts.push(`Diámetro ${v.diametro}`)
  if (v?.curva)                      parts.push(`Curva ${v.curva}`)
  if (v?.largo && v.largo !== 'Mix') parts.push(`Largo ${v.largo}mm`)
  if (v?.largo === 'Mix')            parts.push('Largos mixtos')
  if (v?.dimension)                  parts.push(v.dimension)
  if (doc.marca)                     parts.push(`Marca ${doc.marca}`)
  return parts.join(' · ')
}

// Expande un documento de products/ a uno o varios objetos planos
function expandDoc(docId, doc) {
  const base = {
    categoria:     doc.familia || '',
    tipo:          doc.tipo    || '',
    marca:         doc.marca   || '',
    imagen:        doc.imagen  || '',
    store_visible: doc.store_visible !== false,
    subtipo:       '',
  }

  if (doc.variants) {
    // Producto con variantes → un objeto plano por variante
    return Object.entries(doc.variants).map(([vk, v]) => ({
      ...base,
      id:             `${docId}__${vk}`,
      nombre:         variantNombre(doc.nombre, v),
      precio:         Number(v.precio_menudeo  || 0),
      precio_mayoreo: Number(v.precio_mayoreo  || 0),
      min_mayoreo:    Number(v.min_mayoreo      || 0),
      stock:          Number(v.stock_local      || 0),
      descripcion:    buildDesc(doc, v),
      grosor:         v.diametro  || '',  // ponytail: migration renamed grosor→diametro; FibraCatalog reads grosor
      curva:          v.curva     || '',
      largo:          v.largo     || '',
      dimension:      v.dimension || '',
    }))
  }

  // Standalone → un solo objeto plano
  // tec_solo sin dimension propia: 'Especial' para que FibraCatalog los muestre agrupados
  const dimension = doc.dimension || (doc.tipo === 'tec' ? 'Especial' : '')
  return [{
    ...base,
    id:             docId,
    nombre:         doc.nombre,
    precio:         Number(doc.precio_menudeo  || 0),
    precio_mayoreo: Number(doc.precio_mayoreo  || 0),
    min_mayoreo:    Number(doc.min_mayoreo      || 0),
    stock:          Number(doc.stock_local      || 0),
    descripcion:    buildDesc(doc, null),
    grosor:         '',
    curva:          '',
    largo:          '',
    dimension,
  }]
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res  = await fetch(PRODUCTS_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const flat = (data.documents || [])
        .flatMap(fsDoc => {
          const id  = fsDoc.name.split('/').at(-1)
          const doc = decode(fsDoc.fields)
          return expandDoc(id, doc)
        })
        .filter(p => p.precio > 0)
      setProducts(flat)
    } catch (e) {
      console.error('StoreContext:', e)
      setError(e.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const getCategories = () => [...new Set(products.map(p => p.categoria).filter(Boolean))]
  const getByCategory = (cat) => cat ? products.filter(p => p.categoria === cat) : products
  const getById       = (id)  => products.find(p => p.id === id)

  return (
    <Ctx.Provider value={{ products, loading, error, getCategories, getByCategory, getById, refetch: fetchProducts }}>
      {children}
    </Ctx.Provider>
  )
}
export const useStore = () => useContext(Ctx)

// const DEMO = [
//   { id:'d1__v_mix', nombre:'Nagaraku Clásica Diámetro 0.07 Curva D Mix', categoria:'Pestañas Clásicas', precio:70, precio_mayoreo:60, min_mayoreo:5, stock:4, imagen:'', descripcion:'Diámetro 0.07 · Curva D · Largos mixtos', tipo:'clasica', marca:'', grosor:'0.07', curva:'D', largo:'Mix', dimension:'', subtipo:'', store_visible:true },
//   { id:'d2',        nombre:'Golle Negro',                                  categoria:'Adhesivos',         precio:250,precio_mayoreo:0, min_mayoreo:0, stock:2, imagen:'', descripcion:'Marca Golle',                                tipo:'adhesivo', marca:'Golle', grosor:'',     curva:'',  largo:'',    dimension:'', subtipo:'', store_visible:true },
// ]
