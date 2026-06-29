import { useState } from 'react'
import { formatPrice, formatDate } from '../utils/format'

// ponytail: token lives in useState (RAM only), intentionally dies on page refresh
const STATUS = { pendiente:'bg-yellow-100 text-yellow-700', pagado:'bg-blue-100 text-blue-700', enviado:'bg-purple-100 text-purple-700', entregado:'bg-green-100 text-green-700', cancelado:'bg-red-100 text-red-700' }

export default function Admin() {
  const [token,    setToken]   = useState('')
  const [auth,     setAuth]    = useState(false)
  const [pw,       setPw]      = useState('')
  const [orders,   setOrders]  = useState([])
  const [loading,  setLoading] = useState(false)
  const [selected, setSelected]= useState(null)
  const [error,    setError]   = useState('')

  async function handleLogin() {
    const res = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pw }),
    })
    if (!res.ok) { setPw(''); setError('Contraseña incorrecta'); return }
    const { token: t } = await res.json()
    setToken(t)
    setAuth(true)
    setError('')
    loadOrders(t)
  }

  async function loadOrders(t = token) {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (!res.ok) throw new Error('No autorizado')
      setOrders(await res.json())
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (!auth) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="bg-brand-cream p-8 rounded-sm w-80 text-center">
        <div className="font-display text-3xl font-light mb-1">L-ASH ART</div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-brand-rose mb-7">Panel Admin</p>
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        <div className="flex gap-2">
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            placeholder="Contraseña"
            className="flex-1 border border-brand-rose-light px-3 py-2.5 text-sm outline-none focus:border-brand-rose bg-white rounded-sm text-center tracking-widest" />
          <button onClick={handleLogin} className="bg-brand-rose text-white px-4 hover:bg-brand-black transition-colors rounded-sm text-lg">→</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light">Pedidos</h1>
        <button onClick={()=>loadOrders()} className="text-[10px] tracking-[0.3em] uppercase text-brand-rose hover:underline">↻ Actualizar</button>
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
