import { createHmac } from 'crypto'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function verifyToken(token) {
  const [exp, sig] = (token ?? '').split('.')
  if (!exp || !sig) return false
  const expected = createHmac('sha256', process.env.SESSION_SECRET).update(exp).digest('hex')
  return sig === expected && Number(exp) > Date.now()
}

function db() {
  if (!getApps().length) {
    initializeApp({ credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }) })
  }
  return getFirestore()
}

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!verifyToken(token)) return res.status(401).json({ error: 'No autorizado' })

  const snap = await db().collection('orders').limit(50).get()
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() })).reverse()
  res.json(orders)
}
