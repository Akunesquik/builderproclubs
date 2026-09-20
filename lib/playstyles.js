import DATA from '../data/fc27.json'
import { reglage, coutCumule } from './couts.js'

/** Nombre d'emplacements de PlayStyles (onglet Reglages de l'Excel). */
export const NB_SLOTS = Number(DATA.reglages && DATA.reglages.slots_playstyles) || 5

/** Un PlayStyle n'est proposé que si chacun de ses seuils est atteignable par l'archétype. */
export function estAccessible(arche, ps) {
  return (
    ps.exigences.length > 0 &&
    ps.exigences.every((e) => reglage(arche, e.attribut).max >= e.seuil)
  )
}

export function playStylesAccessibles(arche) {
  return DATA.playStyles.filter((ps) => estAccessible(arche, ps))
}

/** Détail par exigence : où on en est, ce qu'il manque, ce que ça coûte. */
export function detailExigences(arche, stats, ps) {
  return ps.exigences.map((e) => {
    const r = reglage(arche, e.attribut)
    const actuel = stats[e.attribut] ?? r.base
    const cible = Math.min(e.seuil, r.max)
    const attr = DATA.attributs.find((a) => a.id === e.attribut)
    return {
      attribut: e.attribut,
      nom: attr ? attr.nom : e.attribut,
      actuel,
      seuil: e.seuil,
      manque: Math.max(0, cible - actuel),
      cout: coutCumule(arche, e.attribut, actuel, cible),
    }
  })
}

/** Coût total en AP pour débloquer ce PlayStyle depuis le build actuel. */
export function coutPlayStyle(arche, stats, ps) {
  return detailExigences(arche, stats, ps).reduce((t, d) => t + d.cout, 0)
}

export function estDebloque(arche, stats, ps) {
  return ps.exigences.every(
    (e) => (stats[e.attribut] ?? reglage(arche, e.attribut).base) >= e.seuil
  )
}

/** Monte les attributs requis jusqu'à leur seuil. Ne baisse jamais rien. */
export function appliquer(arche, stats, ps) {
  const suivant = { ...stats }
  ps.exigences.forEach((e) => {
    const r = reglage(arche, e.attribut)
    const actuel = suivant[e.attribut] ?? r.base
    suivant[e.attribut] = Math.max(actuel, Math.min(e.seuil, r.max))
  })
  return suivant
}

export function parNom(nom) {
  return DATA.playStyles.find((p) => p.nom === nom) || null
}
