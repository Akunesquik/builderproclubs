import DATA from '../data/fc27.json'
import { reglage, coutCumule } from './couts.js'

/** Spécialisations "réelles" d'un archétype (la ligne Aucune sert juste de valeur par défaut). */
export function specialisationsArchetype(arche) {
  return (arche.specialisations || []).filter((s) => s.archetypeGagne)
}

/** Détail par exigence, même calcul que pour les PlayStyles. */
export function detailExigencesSpec(arche, stats, spec) {
  return spec.exigences.map((e) => {
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

/** Coût total en AP pour débloquer cette spécialisation depuis le build actuel. */
export function coutSpecialisation(arche, stats, spec) {
  return detailExigencesSpec(arche, stats, spec).reduce((t, d) => t + d.cout, 0)
}

export function estDebloqueeSpec(arche, stats, spec) {
  return spec.exigences.every(
    (e) => (stats[e.attribut] ?? reglage(arche, e.attribut).base) >= e.seuil
  )
}

/** Monte les attributs requis jusqu'à leur seuil. Ne baisse jamais rien. */
export function appliquerSpec(arche, stats, spec) {
  const suivant = { ...stats }
  spec.exigences.forEach((e) => {
    const r = reglage(arche, e.attribut)
    const actuel = suivant[e.attribut] ?? r.base
    suivant[e.attribut] = Math.max(actuel, Math.min(e.seuil, r.max))
  })
  return suivant
}

export function specParNom(arche, nom) {
  return (arche.specialisations || []).find((s) => s.nom === nom) || null
}