import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
