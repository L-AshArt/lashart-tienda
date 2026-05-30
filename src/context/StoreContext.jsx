import { createContext, useContext, useState, useEffect } from 'react'
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
