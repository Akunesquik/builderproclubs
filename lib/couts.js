import DATA from '../data/fc27.json'

const VIDE = { base: 0, min: 0, max: 0, cle: false, c: -1 }

/** Réglages d'un attribut pour un archétype : base, limites, clé, index de courbe. */
export function reglage(arche, attrId) {
  return (arche.stats && arche.stats[attrId]) || VIDE
}

/** Paliers de prix de cet attribut : [[valeurMin, valeurMax, cout], …]. */
export function paliers(reg) {
  return DATA.courbes[reg.c] || []
}

/** Attribut noté en étoiles (gestes techniques, mauvais pied). */
export function estEtoiles(reg) {
  return reg.max <= 5
}

/**
 * Coût en AP pour passer de `v` à `v + 1`.
 * Le palier lu est celui qui contient la valeur VISÉE.
 * Renvoie null si le plafond est atteint ou si aucun palier ne couvre la cible.
 */
export function coutPoint(arche, attrId, v) {
  const reg = reglage(arche, attrId)
  const cible = v + 1
  if (cible > reg.max) return null
  const p = paliers(reg).find(([a, b]) => cible >= a && cible <= b)
  return p ? p[2] : null
}

/** Coût cumulé pour amener un attribut de `de` à `a`. */
export function coutCumule(arche, attrId, de, a) {
  let total = 0
  for (let v = de; v < a; v++) {
    const c = coutPoint(arche, attrId, v)
    if (c === null) break
    total += c
  }
  return total
}

/** Total dépensé sur l'ensemble du build. */
export function totalDepense(arche, stats) {
  return DATA.attributs.reduce((t, a) => {
    const r = reglage(arche, a.id)
    return t + coutCumule(arche, a.id, r.base, stats[a.id] ?? r.base)
  }, 0)
}

/** Valeurs de départ d'un archétype. */
export function statsInitiales(arche) {
  const s = {}
  DATA.attributs.forEach((a) => {
    s[a.id] = reglage(arche, a.id).base
  })
  return s
}

/** Budget d'AP disponible à ce niveau. */
export function budgetNiveau(niveau) {
  const l = DATA.niveaux.find((n) => n.niveau === niveau)
  return l ? l.cumul : 0
}

/** Attributs réellement modifiables pour cet archétype. */
export function attributsVisibles(arche) {
  return DATA.attributs.filter((a) => {
    const r = reglage(arche, a.id)
    return r.max > r.min
  })
}

/** Les mêmes, groupés par catégorie, dans l'ordre de la feuille Attributs. */
export function attributsParCategorie(arche) {
  const map = new Map()
  attributsVisibles(arche).forEach((a) => {
    if (!map.has(a.categorie)) map.set(a.categorie, [])
    map.get(a.categorie).push(a)
  })
  return [...map.entries()]
}

/** Moyenne affichée d'une catégorie. */
export function moyenne(attrs, stats) {
  if (!attrs.length) return 0
  return Math.round(attrs.reduce((t, a) => t + (stats[a.id] ?? 0), 0) / attrs.length)
}
