import { createContext, useContext, useState, useEffect } from 'react'
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
