export function calculerAjustementTaillePoids({
  attr,
  corps,
  arche,
}) {
  if (
    !corps ||
    !arche ||
    !arche.corps
  ) {
    return 0
  }

  const taille = corps.taille
  const poids = corps.poids

  const tailleMin =
    arche.corps.taille.min

  const tailleRef =
    arche.corps.taille.base

  const tailleMax =
    arche.corps.taille.max

  const poidsMin =
    arche.corps.poids.min

  const poidsRef =
    arche.corps.poids.base

  const poidsMax =
    arche.corps.poids.max

  // Détermine la colonne de poids (0-4)
  let poidsCol = 2

  if (
    poids >= poidsMin &&
    poids <= poidsMin + 1
  ) {
    poidsCol = 0
  } else if (
    poids >= poidsMin + 2 &&
    poids <= poidsRef - 1
  ) {
    poidsCol = 1
  } else if (
    poids === poidsRef
  ) {
    poidsCol = 2
  } else if (
    poids >= poidsRef + 1 &&
    poids <= poidsMax - 2
  ) {
    poidsCol = 3
  } else if (
    poids >= poidsMax - 1 &&
    poids <= poidsMax
  ) {
    poidsCol = 4
  }

  // Détermine la ligne de taille (0-8)
  let tailleRow = 4

  if (taille === tailleMin) {
    tailleRow = 0
  } else if (
    taille >= tailleMin + 1 &&
    taille <=
      Math.floor(
        (tailleRef +
          2 * tailleMin -
          1) /
          3
      )
  ) {
    tailleRow = 1
  } else if (
    taille >=
      Math.ceil(
        (tailleRef +
          2 * tailleMin +
          2) /
          3
      ) &&
    taille <=
      Math.floor(
        (2 * tailleRef +
          tailleMin -
          2) /
          3
      )
  ) {
    tailleRow = 2
  } else if (
    taille >=
      Math.ceil(
        (2 * tailleRef +
          tailleMin +
          1) /
          3
      ) &&
    taille <=
      tailleRef - 1
  ) {
    tailleRow = 3
  } else if (
    taille === tailleRef
  ) {
    tailleRow = 4
  } else if (
    taille >= tailleRef + 1 &&
    taille <=
      Math.floor(
        (2 * tailleRef +
          tailleMax -
          1) /
          3
      )
  ) {
    tailleRow = 5
  } else if (
    taille >=
      Math.ceil(
        (2 * tailleRef +
          tailleMax +
          2) /
          3
      ) &&
    taille <=
      Math.floor(
        (2 * tailleRef +
          2 * tailleMax -
          2) /
          3
      )
  ) {
    tailleRow = 6
  } else if (
    taille >=
      Math.ceil(
        (tailleRef +
          2 * tailleMax +
          1) /
          3
      ) &&
    taille <=
      tailleMax - 1
  ) {
    tailleRow = 7
  } else if (
    taille === tailleMax
  ) {
    tailleRow = 8
  }

  /*
   * On utilise les IDs des attributs et non
   * leurs noms affichés.
   *
   * Cela permet de changer de langue sans
   * modifier les calculs.
   */
  const baseColParStat = {
    acceleration: [6, 5, 4, 3, 2],
    agilite: [6, 5, 4, 3, 2],
    equilibre: [2, 3, 4, 5, 6],
    detente: [-6, -5, -4, -3, -2],
    vitesse: [-2, -3, -4, -5, -6],
    force: [-6, -5, -4, -3, -2],
  }

  const baseCol =
    baseColParStat[attr.id] ||
    [0, 0, 0, 0, 0]

  if (
    [
      'acceleration',
      'agilite',
      'equilibre',
    ].includes(attr.id)
  ) {
    return (
      baseCol[poidsCol] -
      tailleRow
    )
  }

  return (
    baseCol[poidsCol] +
    tailleRow
  )
}