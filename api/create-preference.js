export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { items, payer, shipping } = req.body
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) return res.status(500).json({ error: 'Agrega MERCADOPAGO_ACCESS_TOKEN en Vercel' })
  const siteUrl = process.env.VITE_SITE_URL || 'https://lashart-tienda.vercel.app'
  try {
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        items: items.map(i => ({ id:i.id, title:i.nombre, quantity:Number(i.qty), unit_price:Number(i.price), currency_id:'MXN' })),
        payer: { name:payer.nombre, email:payer.email, phone:{ number:payer.telefono } },
        shipments: { cost:Number(shipping?.price||0), mode:'not_specified' },
        back_urls: { success:`${siteUrl}/pedido/ok`, failure:`${siteUrl}/checkout`, pending:`${siteUrl}/pedido/pendiente` },
        auto_return: 'approved',
        statement_descriptor: 'L-ASH ART',
      }),
    })
    if (!r.ok) throw new Error(await r.text())
    const d = await r.json()
    res.json({ init_point:d.init_point, sandbox_init_point:d.sandbox_init_point })
  } catch(e) { console.error(e); res.status(500).json({ error:'Error al crear preferencia' }) }
}
