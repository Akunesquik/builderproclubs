export function calculerAjustementTaillePoids({ attr, corps, arche }) {
  if (!corps || !arche || !arche.corps) return 0

  const taille = corps.taille
  const poids = corps.poids

  const tailleMin = arche.corps.taille.min
  const tailleRef = arche.corps.taille.base
  const tailleMax = arche.corps.taille.max

  const poidsMin = arche.corps.poids.min
  const poidsRef = arche.corps.poids.base
  const poidsMax = arche.corps.poids.max

  // Determines poids column (0-4) based on poids ranges
  let poidsCol = 2 // default: poids de référence
  if (poids >= poidsMin && poids <= poidsMin + 1) { poidsCol = 0 }
  else if (poids >= poidsMin + 2 && poids <= poidsRef - 1) { poidsCol = 1 }
  else if (poids === poidsRef) { poidsCol = 2 }
  else if (poids >= poidsRef + 1 && poids <= poidsMax - 2) { poidsCol = 3 }
  else if (poids >= poidsMax - 1 && poids <= poidsMax) { poidsCol = 4 }

  // Determines taille row (0-8) based on 9 taille ranges per user spec
  let tailleRow = 4 // default: taille de référence
  if (taille === tailleMin) { tailleRow = 0 }
  else if (taille >= tailleMin + 1 && taille <= Math.floor((tailleRef + 2 * tailleMin - 1) / 3)) { tailleRow = 1 }
  else if (taille >= Math.ceil((tailleRef + 2 * tailleMin + 2) / 3) && taille <= Math.floor((2 * tailleRef + tailleMin - 2) / 3)) { tailleRow = 2 }
  else if (taille >= Math.ceil((2 * tailleRef + tailleMin + 1) / 3) && taille <= tailleRef - 1) { tailleRow = 3 }
  else if (taille === tailleRef) { tailleRow = 4 }
  else if (taille >= tailleRef + 1 && taille <= Math.floor((2 * tailleRef + tailleMax - 1) / 3)) { tailleRow = 5 }
  else if (taille >= Math.ceil((2 * tailleRef + tailleMax + 2) / 3) && taille <= Math.floor((2 * tailleRef + 2 * tailleMax - 2) / 3)) { tailleRow = 6 }
  else if (taille >= Math.ceil((tailleRef + 2 * tailleMax + 1) / 3) && taille <= tailleMax - 1) { tailleRow = 7 }
  else if (taille === tailleMax) { tailleRow = 8 }

  // Base values per stat for poids columns 0-4
  const baseColParStat = {
    'Accélération': [6, 5, 4, 3, 2],
    'Agilité': [6, 5, 4, 3, 2],
    'Équilibre': [2, 3, 4, 5, 6],
    'Détente': [-6, -5, -4, -3, -2],
    'Vitesse de sprint': [-2, -3, -4, -5, -6],
    'Force': [-6, -5, -4, -3, -2]
  }

  const baseCol = baseColParStat[attr.nom] || [0, 0, 0, 0, 0]

  // Adjustment formula based on stat type
  if (['Accélération', 'Agilité', 'Équilibre'].includes(attr.nom)) {
    return baseCol[poidsCol] - tailleRow
  } else { // Détente, Vitesse de sprint, Force
    return baseCol[poidsCol] + tailleRow
  }
}