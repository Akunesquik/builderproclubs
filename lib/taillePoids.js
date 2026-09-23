// Détermine le rang de taille (0 à 6) sur 7 tranches
function calculerRangTaille(taille, tailleMin, tailleRef, tailleMax) {
  const midBas = Math.floor((tailleRef - tailleMin) / 3) + tailleMin
  const midBasBas = Math.floor(2*(tailleRef -  tailleMin) / 3) + tailleMin
  const midHaut = Math.floor((tailleMax - tailleRef) / 3) + tailleRef - 1
  const midHautHaut = Math.floor(2*(tailleMax -  tailleRef) / 3) + tailleRef - 1 

  if (taille === tailleMin) {
    return 0 // rang 1
  } else if (taille >= tailleMin + 1 && taille <= midBas) {
    return 1 // rang 2
  } else if (taille >= midBas + 1 && taille <= midBasBas) {
    return 2 // rang 3
  } else if (taille >= midBasBas + 1 && taille <= tailleRef - 1) {
    return 3 // rang 3
  } else if (taille === tailleRef) {
    return 4 // rang 4
  } else if (taille >= tailleRef + 1 && taille <= midHaut) {
    return 5 // rang 5
  } else if (taille >= midHaut + 1 && taille <= midHautHaut) {
    return 6 // rang 6
  } else if (taille >= midHautHaut + 1 && taille <= tailleMax - 1) {
    return 7 // rang 6
  } else if (taille === tailleMax) {
    return 8 // rang 7
  }

  // sécurité si taille hors bornes [min, max]
  return 4
}


// Fonction de calcul de l'ajustement taille/poids pour les statistiques
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

  // Déterminer la colonne de poids (0-4)
  let poidsCol = 2 // défaut: poids de référence
  if (poids >= poidsMin && poids <= poidsMin + 1) {
    poidsCol = 0
  } else if (poids >= poidsMin + 2 && poids <= poidsRef - 1) {
    poidsCol = 1
  } else if (poids === poidsRef) {
    poidsCol = 2
  } else if (poids >= poidsRef + 1 && poids <= poidsMax - 2) {
    poidsCol = 3
  } else if (poids >= poidsMax - 1 && poids <= poidsMax) {
    poidsCol = 4
  }

  const tailleRow = calculerRangTaille(taille, tailleMin, tailleRef, tailleMax)

  // Tables de base pour chaque statistique (colonnes de poids 0-4)
  const baseColParStat = {
    'Accélération': [6, 5, 4, 3, 2],
    'Agilité': [6, 5, 4, 3, 2],
    'Équilibre': [2, 3, 4, 5, 6],
    'Détente': [-6, -5, -4, -3, -2],
    'Vitesse': [-2, -3, -4, -5, -6],
    'Force': [-6, -5, -4, -3, -2]
  }

  const baseCol = baseColParStat[attr.nom] || [0, 0, 0, 0, 0]

  const statsConcernées = ['Accélération', 'Agilité', 'Équilibre', 'Détente', 'Vitesse', 'Force'];

  if (statsConcernées.includes(attr.nom)) {
          
    // Formule d'ajustement selon le type de statistique
    if (['Accélération', 'Agilité', 'Équilibre'].includes(attr.nom)) {
      return baseCol[poidsCol] - tailleRow
    } else { // Détente, Vitesse de sprint, Force
      return baseCol[poidsCol] + tailleRow
    }
  }
  return 0

}