import DATA from '../data/fc27.json'

/** Les réglages d'un attribut pour un archétype : base, limites, courbe, clé. */
export function reglage(arche, attrId) {
  return arche.stats[attrId] || { base: 0, min: 0, max: 0, courbe: 'A', cle: false }
}

/**
 * Coût en AP pour passer de `v` à `v + 1`.
 * La courbe donne le prix de la valeur VISÉE : passer de 84 à 85 lit la plage qui contient 85.
 * Renvoie null quand le plafond est atteint ou qu'aucune plage ne couvre la cible.
 */
export function coutPoint(arche, attrId, v) {
  const r = reglage(arche, attrId)
  const cible = v + 1
  if (cible > r.max) return null
  const plages = DATA.courbes[r.courbe]
  if (!plages) return null
  const p = plages.find((x) => cible >= x.min && cible <= x.max)
  return p ? p.cout : null
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

/** Budget disponible à ce niveau. */
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
