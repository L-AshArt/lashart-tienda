import { Link } from 'react-router-dom'
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
