import { createHmac } from 'crypto'

// ponytail: delay on failure throttles brute force without external state — sufficient for a low-traffic admin panel
const FAIL_DELAY_MS = 2000

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (req.body?.pin !== process.env.ADMIN_PIN) {
    await new Promise(r => setTimeout(r, FAIL_DELAY_MS))
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }
  const exp = String(Date.now() + 8 * 60 * 60 * 1000) // 8 h
  const sig = createHmac('sha256', process.env.SESSION_SECRET).update(exp).digest('hex')
  res.json({ token: `${exp}.${sig}` })
}
