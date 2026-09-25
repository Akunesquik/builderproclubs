import { reglage } from './couts.js'
import { calculerAjustementTaillePoids } from './taillePoids.js'
import DATA from '../data/fc27.json'

const ATTR_PAR_ID = Object.fromEntries(
  DATA.attributs.map((a) => [a.id, a])
)

/**
 * Valeur effective d'une stat = valeur investie + bonus maîtrise/installation
 * + ajustement taille/poids (même calcul que le badge affiché à côté de chaque ligne).
 */
const valeurEffective = (arche, stats, corps, bonusStats, id) => {
  const reg = reglage(arche, id)
  const base = stats[id] ?? reg.base
  const bonusMaitrise = bonusStats?.[id] || 0
  const attr = ATTR_PAR_ID[id]
  const ajustementCorps = attr
    ? calculerAjustementTaillePoids({ attr, corps, arche })
    : 0

  return base + bonusMaitrise + ajustementCorps
}

/**
 * Détermine le type de course (accélération) du joueur selon
 * son genre, sa taille, sa force, son agilité et son accélération
 * (bonus de maîtrises/installations + ajustement taille/poids inclus).
 */
export function determinerTypeCourse(arche, stats, corps, genre = 'H', bonusStats = {}) {
  const force = valeurEffective(arche, stats, corps, bonusStats, 'force')
  const agilite = valeurEffective(arche, stats, corps, bonusStats, 'agilite')
  const acceleration = valeurEffective(arche, stats, corps, bonusStats, 'acceleration')
  const taille = corps?.taille ?? 0

  const tailleMinLengthy = genre === 'F' ? 165 : 185
  const tailleMaxExplosive = genre === 'F' ? 162 : 182

  // Lengthy
  if (
    taille >= tailleMinLengthy &&
    force >= 65 &&
    force - agilite >= 4 &&
    acceleration >= 40
  ) {
    return { id: 'lengthy', nom: 'Lengthy', color: "border-blue-500/50 bg-blue-500/10" }
  }

  // Explosive
  if (
    taille <= tailleMaxExplosive &&
    agilite >= 65 &&
    agilite - force >= 10 &&
    acceleration >= 80
  ) {
    return { id: 'explosive', nom: 'Explosive', color: "border-red-500/50 bg-red-500/10" }
  }

  // Controlled (par défaut)
  return { id: 'controlled', nom: 'Controlled', color: "border-green-500/50 bg-green-500/10" }
}