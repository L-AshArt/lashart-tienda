#!/usr/bin/env node
/**
 * Migra lashArt/prods (blob JSON) → colecciones products/ y products_private/
 *
 * Usage:
 *   node scripts/migrate-to-collection.mjs --dry-run   # preview sin writes
 *   node scripts/migrate-to-collection.mjs              # migración real
 *
 * Credenciales (una de las dos opciones):
 *   A) Pon service-account.json en la raíz del proyecto (está en .gitignore)
 *   B) Exporta las variables de entorno:
 *        FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore }                 from 'firebase-admin/firestore'

const DRY_RUN   = process.argv.includes('--dry-run')
const FORCE     = process.argv.includes('--force')
const BLOB_URL  = 'https://firestore.googleapis.com/v1/projects/lashart-b86d4/databases/(default)/documents/lashArt/prods'

// ── credenciales ─────────────────────────────────────────────────────────────

function initAdmin() {
  if (getApps().length) return
  const saPath = new URL('../service-account.json', import.meta.url).pathname
                      .replace(/^\/([A-Z]:)/, '$1') // fix Windows path
  if (existsSync(saPath)) {
    const sa = JSON.parse(readFileSync(saPath, 'utf8'))
    initializeApp({ credential: cert(sa) })
    console.log('  credenciales: service-account.json')
  } else {
    const pk = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    if (!pk) {
      console.error('ERROR: no se encontró service-account.json ni FIREBASE_PRIVATE_KEY')
      process.exit(1)
    }
    initializeApp({ credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  pk,
    }) })
    console.log('  credenciales: variables de entorno')
  }
}

// ── helpers (misma lógica que dry-run aprobado) ───────────────────────────────

function cleanKey(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
}

function docId(gk) {
  // ID determinístico y legible (idempotente si se re-ejecuta)
  return gk.toLowerCase().replace(/[^a-z0-9|]/g, '_').replace(/\|/g, '__').replace(/_+/g, '_').slice(0, 100)
}

function adhesivNombre(p) {
  const marca  = (p.marca  || '').trim()
  const nombre = (p.nombre || '').trim()
  if (!marca || marca === 'Otra') return nombre
  if (nombre.toLowerCase().includes(marca.toLowerCase())) return nombre
  if (marca.toLowerCase().includes(nombre.toLowerCase())) return marca
  const unique = nombre.split(' ').filter(w => !marca.split(' ').includes(w))
  return unique.length ? `${marca} ${unique.join(' ')}` : `${marca} ${nombre}`
}

// clásicas sin marca confirmadas como Nagaraku por Ashlee
function marcaLabel(p) { return p.marca || (p.tipo === 'clasica' ? 'Nagaraku' : 'Genérica') }

function groupKey(p) {
  const n = (p.notas || '').trim()
  switch (p.tipo) {
    case 'clasica':  return `clasica|${marcaLabel(p)}|${p.grosor}|${p.curva}|${n}`
    case 'tec': {
      if (p.dimension === 'custom') {
        if (p.dimensionLabel === 'Fluffy')        return `tec|${p.marca}|Fluffy|${p.curvaLabel||p.curva}`
        if (/^\d+U$/.test(p.dimensionLabel||'')) return `tec|${p.marca}|${p.dimensionLabel}|${p.curva}`
        return `tec_solo|${p.marca}|${n||p.id}`
      }
      if (p.marca === 'DiyDay' && n === 'U') return `tec|DiyDay|U-Shape ${p.dimension}|${p.curva}`
      return `tec|${p.marca}|${p.dimension}|${p.curva}|${n}`
    }
    case 'abanico':  return `abanico|${p.marca}|${p.dimension}|${p.curva}`
    case 'adhesivo': return `adhesivo|${adhesivNombre(p)}`
    case 'pinza':
      if (p.marca === 'L-Ash Art' && p.subtipo === 'L') return 'pinza|LashArt|L'
      return `pinza|${p.marca}|${p.subtipo}`
    case 'insumo':   return `insumo|${p.nombre}`
    case 'otro':     return `otro|${p.nombre}|${n}`
    default:         return `unknown|${p.id}`
  }
}

function docNombre(p, gk) {
  const n = (p.notas || '').trim()
  switch (p.tipo) {
    case 'clasica': {
      const nota = n ? ` (${n})` : ''
      return `${marcaLabel(p)} Clásica Diámetro ${p.grosor} Curva ${p.curva}${nota}`
    }
    case 'tec': {
      if (p.dimension === 'custom') {
        if (p.dimensionLabel === 'Fluffy')        return `${p.marca} Tec Fluffy Curva ${p.curvaLabel||p.curva}`
        if (/^\d+U$/.test(p.dimensionLabel||'')) return `${p.marca} ${p.dimensionLabel} Curva ${p.curva}`
        return `${p.marca} Tec ${n || '(especial)'}`
      }
      if (p.marca === 'DiyDay' && n === 'U') return `DiyDay Tec U-Shape ${p.dimension} Curva ${p.curva}`
      const nota = n ? ` (${n})` : ''
      return `${p.marca} Tec ${p.dimensionLabel||p.dimension} Curva ${p.curvaLabel||p.curva}${nota}`
    }
    case 'abanico':  return `${p.marca} Abanico ${p.dimensionLabel||p.dimension} Curva ${p.curvaLabel||p.curva}`
    case 'adhesivo': return adhesivNombre(p)
    case 'pinza':
      return gk === 'pinza|LashArt|L' ? 'L-Ash Art Pinza L' : `${p.marca} ${p.subtipo}`
    case 'insumo':   return p.nombre
    case 'otro': {
      const nota = (p.notas||'').trim()
      return nota ? `${p.nombre} (${nota})` : p.nombre
    }
    default: return `id:${p.id}`
  }
}

function familia(p, gk) {
  if (p.tipo === 'clasica')                return 'Pestañas Clásicas'
  if (p.tipo === 'tec' || gk.startsWith('tec_solo')) return 'Tecnológicas'
  if (p.tipo === 'abanico')               return 'Abanico'
  if (p.tipo === 'adhesivo')              return 'Adhesivos'
  if (p.tipo === 'pinza')                 return 'Pinzas'
  if (p.tipo === 'insumo')                return 'Insumos'
  if (p.tipo === 'otro')                  return 'Otros'
  return 'Sin familia'
}

function isVariantProduct(p, gk) {
  if (['adhesivo','insumo','otro'].includes(p.tipo)) return false
  if (p.tipo === 'pinza' && gk !== 'pinza|LashArt|L') return false
  if (gk.startsWith('tec_solo')) return false
  return true
}

function variantKey(p, gk) {
  return gk === 'pinza|LashArt|L'
    ? `col_${cleanKey(p.notas||'default')}`
    : `v_${cleanKey(p.largo || p.largoLabel || 'mix')}`
}

function variantData(p, gk) {
  const d = {
    precio_menudeo: p.precioMenudeo,
    precio_mayoreo: p.precioMayoreo || 0,
    min_mayoreo:    p.minMayoreo    || 0,
    stock_local:    p.stock  || 0,
    stock_online:   0,
  }
  if ((p.tipo === 'clasica' || p.tipo === 'abanico') && p.grosor) d.diametro  = p.grosor
  if (p.largo)                                d.largo     = p.largo
  if (p.curvaLabel || p.curva)                d.curva     = p.curvaLabel || p.curva
  if (p.dimension && p.dimension !== 'custom') d.dimension = p.dimensionLabel || p.dimension
  if (gk === 'pinza|LashArt|L') { d.color = p.notas; delete d.largo }
  return d
}

// ── build documents ───────────────────────────────────────────────────────────

async function buildDocs(raw) {
  const groups = new Map()
  for (const p of raw) {
    const gk = groupKey(p)
    if (!groups.has(gk)) groups.set(gk, { nombre: docNombre(p, gk), familia: familia(p, gk), tipo: p.tipo, gk, members: [] })
    groups.get(gk).members.push(p)
  }

  const docs = []
  for (const [gk, g] of groups) {
    const id   = docId(gk)
    const base = { nombre: g.nombre, familia: g.familia, tipo: g.tipo, store_visible: true }
    if (gk.startsWith('tec|DiyDay|U-Shape')) base.formaAbanico = 'U-Shape'

    if (isVariantProduct(g.members[0], gk)) {
      const variants = {}
      const priv     = {}
      for (const p of g.members) {
        const vk       = variantKey(p, gk)
        variants[vk]   = variantData(p, gk)
        priv[vk]       = { costo: p.costo || 0, src_id: p.id }
      }
      docs.push({ id, pub: { ...base, variants }, priv: { variants_costo: Object.fromEntries(Object.entries(priv).map(([k,v]) => [k, { costo: v.costo }])), src_ids: Object.values(priv).map(v => v.src_id) } })
    } else {
      const totalStock = g.members.reduce((s, p) => s + (p.stock || 0), 0)
      const p0 = g.members[0]
      docs.push({ id, pub: { ...base, precio_menudeo: p0.precioMenudeo, precio_mayoreo: p0.precioMayoreo||0, min_mayoreo: p0.minMayoreo||0, stock_local: totalStock, stock_online: 0 },
                  priv: { costo: p0.costo||0, src_ids: g.members.map(p => p.id) } })
    }
  }
  return docs
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  MIGRACIÓN lashArt/prods → products/ ${DRY_RUN ? '[DRY-RUN]' : '[REAL]'}`)
  console.log(`${'═'.repeat(60)}\n`)

  // 1. Fetch blob
  console.log('1. Leyendo lashArt/prods...')
  const res = await fetch(BLOB_URL)
  if (!res.ok) { console.error(`ERROR fetching blob: ${res.status}`); process.exit(1) }
  const blob = await res.json()
  const raw  = JSON.parse(blob.fields.d.stringValue)
  console.log(`   ${raw.length} SKUs leídos`)

  // 1b. Backup local — ANTES de cualquier escritura (incluso en dry-run)
  const today      = new Date().toISOString().slice(0, 10)
  const backupPath = new URL(`../backup-antes-de-migrar-${today}.json`, import.meta.url)
                         .pathname.replace(/^\/([A-Z]:)/, '$1')
  writeFileSync(backupPath, JSON.stringify({ fecha: new Date().toISOString(), skus: raw.length, productos: raw }, null, 2), 'utf8')
  console.log(`   respaldo guardado → backup-antes-de-migrar-${today}.json`)

  // 2. Build docs
  console.log('2. Agrupando productos...')
  const docs = await buildDocs(raw)
  console.log(`   ${docs.length} documentos a crear (${docs.length} en products/ + ${docs.length} en products_private/)`)

  // 3. Dry-run: imprimir y salir
  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Documentos que se crearían:\n')
    for (const d of docs) {
      const varCount = d.pub.variants ? Object.keys(d.pub.variants).length : null
      const detail   = varCount != null ? `${varCount} variante(s)` : `stock_local:${d.pub.stock_local}`
      console.log(`  products/${d.id}  ← ${d.pub.nombre} [${detail}]`)
    }
    console.log(`\n  Total: ${docs.length} docs en products/ + ${docs.length} en products_private/`)
    console.log('  Ningún write ejecutado (--dry-run)\n')
    return
  }

  // 4. Init Admin SDK
  console.log('3. Iniciando Firebase Admin...')
  initAdmin()
  const db = getFirestore()

  // 5. Idempotency check
  console.log('4. Verificando si la migración ya fue ejecutada...')
  const existing = await db.collection('products').limit(1).get()
  if (!existing.empty && !FORCE) {
    console.error('\nERROR: La colección products/ ya tiene documentos.')
    console.error('Si quieres re-ejecutar la migración usa --force (borra y re-crea todo).')
    process.exit(1)
  }
  if (!existing.empty && FORCE) {
    console.log('   --force: borrando colección existente...')
    // Borrar en lotes de 500
    let deleted = 0
    let snap = await db.collection('products').limit(500).get()
    while (!snap.empty) {
      const batch = db.batch()
      snap.docs.forEach(d => {
        batch.delete(d.ref)
        batch.delete(db.collection('products_private').doc(d.id))
      })
      await batch.commit()
      deleted += snap.size
      snap = await db.collection('products').limit(500).get()
    }
    console.log(`   ${deleted} documentos borrados`)
  }

  // 6. Write en un solo batch (266 writes ≤ 500 límite de Firestore)
  console.log('5. Escribiendo documentos...')
  const batch = db.batch()
  for (const d of docs) {
    batch.set(db.collection('products').doc(d.id),         d.pub)
    batch.set(db.collection('products_private').doc(d.id), d.priv)
  }
  await batch.commit()
  console.log(`   ✓ ${docs.length * 2} writes confirmados (batch único, atómico)`)

  // 7. Verificación spot-check
  console.log('6. Verificando muestra de documentos...')
  const checks = ['tec__nagaraku__3d__d_', 'adhesivo__golle_negro', 'pinza__lashArt__l']
  for (const id of checks) {
    const snap = await db.collection('products').doc(id).get()
    if (snap.exists) {
      console.log(`   ✓ products/${id} → ${snap.data().nombre}`)
    } else {
      console.log(`   ✗ products/${id} NO encontrado`)
    }
  }

  // 8. Resumen
  const varDocs  = docs.filter(d =>  d.pub.variants).length
  const soloDocs = docs.filter(d => !d.pub.variants).length
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  MIGRACIÓN COMPLETADA`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`  products/ creados       : ${docs.length} (${varDocs} con variantes, ${soloDocs} standalone)`)
  console.log(`  products_private/ creados: ${docs.length}`)
  console.log(`  lashArt/prods           : intacto (backup)`)
  console.log(`\n  Próximo paso: actualizar StoreContext.jsx para leer de products/`)
  console.log(`${'═'.repeat(60)}\n`)
}

main().catch(e => { console.error('\nERROR:', e.message); process.exit(1) })
