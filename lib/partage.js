import DATA from '../data/fc27.json'
import { reglage, statsInitiales } from './couts.js'

const b64url = (s) =>
  btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const deb64url = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))

/** Encode tout l'état du build dans le fragment d'URL. */
export function encodeBuild({ arche, niveau, stats, corps, slots }) {
  const deltas = DATA.attributs.map((a) => (stats[a.id] ?? 0) - reglage(arche, a.id).base)
  const emplacements = (slots || [])
    .map((nom) => (nom ? DATA.playStyles.findIndex((p) => p.nom === nom) : -1))
    .join('.')
  const corpsTxt = corps ? corps.taille + '.' + corps.poids : ''
  return '#/b/' + b64url([arche.id, niveau, deltas.join('.'), corpsTxt, emplacements].join('~'))
}

/** Relit le fragment d'URL. Renvoie null si absent ou illisible. */
export function decodeBuild(hash) {
  if (!hash || !hash.startsWith('#/b/')) return null
  try {
    const parts = deb64url(hash.replace(/^#\/?b\//, '')).split('~')
    const [archeId, niveau, deltas, corpsTxt, emplacements] = parts
    const arche = DATA.archetypes.find((a) => a.id === archeId)
    if (!arche) return null

    const stats = statsInitiales(arche)
    const d = (deltas || '').split('.').map((n) => Number(n) || 0)
    DATA.attributs.forEach((a, i) => {
      stats[a.id] = reglage(arche, a.id).base + (d[i] || 0)
    })

    const [taille, poids] = (corpsTxt || '').split('.').map(Number)
    const slots = (emplacements || '')
      .split('.')
      .map((i) => (DATA.playStyles[Number(i)] ? DATA.playStyles[Number(i)].nom : null))

    return {
      arche,
      niveau: Number(niveau) || 40,
      stats,
      corps: taille && poids ? { taille, poids } : null,
      slots,
    }
  } catch {
    return null
  }
}
