// TEMP DIAGNOSTIC — remove before merging to production
export default function handler(req, res) {
  const raw    = process.env.FIREBASE_PRIVATE_KEY ?? ''
  const fixed  = raw.replace(/\\n/g, '\n')
  const starts = fixed.startsWith('-----BEGIN PRIVATE KEY-----')
  const ends   = fixed.trimEnd().endsWith('-----END PRIVATE KEY-----')
  const literalNewlines = (raw.match(/\\n/g) ?? []).length

  res.json({
    FIREBASE_PROJECT_ID:    process.env.FIREBASE_PROJECT_ID ?? '(no definido)',
    FIREBASE_CLIENT_EMAIL:  process.env.FIREBASE_CLIENT_EMAIL ?? '(no definido)',
    privateKey: {
      raw_length:       raw.length,
      literal_slash_n:  literalNewlines,
      starts_correctly: starts,
      ends_correctly:   ends,
      fixed_length:     fixed.length,
    },
  })
}
