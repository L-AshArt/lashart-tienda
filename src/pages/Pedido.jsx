import { useParams, Link } from 'react-router-dom'
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
