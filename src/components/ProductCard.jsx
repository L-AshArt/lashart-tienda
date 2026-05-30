import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f5ede8' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23c97b84' font-size='60'%3E%F0%9FA%AA%84%3C/text%3E%3C/svg%3E"
export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const img   = product.imagen || product.images?.[0] || PH
  const price = Number(product.precio || 0)
  const mP    = Number(product.precio_mayoreo || 0)
  const mMin  = Number(product.min_mayoreo    || 0)
  return (
    <div className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <Link to={`/producto/${product.id}`} className="block overflow-hidden aspect-square bg-brand-nude">
        <img src={img} alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e=>{e.target.src=PH}} />
      </Link>
      {product.categoria && (
        <span className="absolute top-2.5 left-2.5 bg-brand-black/80 text-white text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm">
          {product.categoria}
        </span>
      )}
      <div className="p-4">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-display text-base font-light text-brand-black leading-snug mb-2 hover:text-brand-rose transition-colors line-clamp-2">{product.nombre}</h3>
        </Link>
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-brand-black font-medium text-sm">{formatPrice(price)}</span>
            {mP>0&&mMin>0&&<p className="text-[10px] text-brand-rose/80 mt-0.5">{formatPrice(mP)} ×{mMin}+</p>}
          </div>
          <button onClick={()=>addItem({id:product.id,nombre:product.nombre,price,imagen:img},1)}
            className="flex-shrink-0 bg-brand-black text-white text-[9px] tracking-[0.2em] uppercase px-3 py-2 hover:bg-brand-rose transition-colors rounded-sm">
            + Carrito
          </button>
        </div>
      </div>
    </div>
  )
}
