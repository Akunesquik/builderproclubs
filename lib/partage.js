import DATA from '../data/fc27.json'
import LZString from 'lz-string'

import {
  reglage,
  statsInitiales,
} from './couts.js'

const b64url = (s) =>
  LZString.compressToEncodedURIComponent(s)

const deb64url = (s) =>
  LZString.decompressFromEncodedURIComponent(s)

/**
 * Encode tout l'état du build
 * dans le fragment de l'URL.
 */
export function encodeBuild({
  arche,
  niveau,
  stats,
  corps,
  slots,
  installations = {},
  spec = null,
  maitrises = {},
  genre = 'H',
}) {
  // STATS
  // STATS MODIFIÉES UNIQUEMENT
const deltas = DATA.attributs
  .map((a, index) => ({
    index,
    delta:
      (stats[a.id] ?? 0) -
      reglage(arche, a.id).base,
  }))
  .filter(({ delta }) => delta !== 0)
  .map(({ index, delta }) => `${index}:${delta}`)
  .join('.')

  // PLAYSTYLES
  const emplacements = (slots || [])
    .map((nom) =>
      nom
        ? DATA.playStyles.findIndex(
            (p) => p.nom === nom
          )
        : -1
    )
    .join('.')

  // CORPS
  const corpsTxt = corps
    ? `${corps.taille}.${corps.poids}`
    : ''

  // INSTALLATIONS
  const installationsTxt =
    Object.entries(installations)
      .map(
        ([id, niveau]) =>
          `${id}:${niveau}`
      )
      .join('.')

  // SPECIALISATION
  const specTxt = spec?.nom || ''

  // MAITRISES
  const maitrisesTxt =
    Object.entries(maitrises)
      .map(
        ([archetypeId, niveaux]) =>
          `${archetypeId}:${niveaux.join(',')}`
      )
      .join('.')

  /*
   * Format :
   *
   * archetype
   * ~ niveau
   * ~ stats
   * ~ corps
   * ~ playstyles
   * ~ installations
   * ~ specialisation
   * ~ maitrises
   * ~ genre
   */

  const contenu = [
    arche.id,
    niveau,
    deltas,
    corpsTxt,
    emplacements,
    installationsTxt,
    specTxt,
    maitrisesTxt,
    genre,
  ].join('~')

  return '#/b/' + b64url(contenu)
}

/**
 * Relit le fragment d'URL.
 * Renvoie null si absent ou illisible.
 */
export function decodeBuild(hash) {
  if (
    !hash ||
    !hash.startsWith('#/b/')
  ) {
    return null
  }

  try {
    const contenu = deb64url(
      hash.replace(/^#\/b\//, '')
    )

    const parts = contenu.split('~')

    const [
      archeId,
      niveau,
      deltas,
      corpsTxt,
      emplacements,
      installationsTxt,
      specTxt,
      maitrisesTxt,
      genreTxt,
    ] = parts

    // ARCHETYPE
    const arche =
      DATA.archetypes.find(
        (a) => a.id === archeId
      )

    if (!arche) {
      return null
    }

    // STATS
    const stats = statsInitiales(arche)

    const d = (deltas || '')
      .split('.')
      .map(
        (n) => Number(n) || 0
      )

    DATA.attributs.forEach((a) => {
      stats[a.id] = reglage(arche, a.id).base
    })

    ;(deltas || '')
      .split('.')
      .filter(Boolean)
      .forEach((item) => {
        const [indexTxt, deltaTxt] = item.split(':')

        const index = Number(indexTxt)
        const delta = Number(deltaTxt)

        const attribut = DATA.attributs[index]

        if (attribut && Number.isFinite(delta)) {
          stats[attribut.id] =
            reglage(arche, attribut.id).base + delta
        }
      })

    // CORPS
    const [taille, poids] =
      (corpsTxt || '')
        .split('.')
        .map(Number)

    const corps =
      taille && poids
        ? {
            taille,
            poids,
          }
        : null

    // PLAYSTYLES
    const slots =
      (emplacements || '')
        .split('.')
        .map((i) => {
          const index = Number(i)

          const playstyle =
            DATA.playStyles[index]

          return playstyle
            ? playstyle.nom
            : null
        })

    // INSTALLATIONS
    const installations = {}

    ;(installationsTxt || '')
      .split('.')
      .filter(Boolean)
      .forEach((item) => {
        const [id, niveau] =
          item.split(':')

        if (id && niveau) {
          installations[id] =
            Number(niveau)
        }
      })

    // SPECIALISATION
    const spec =
      arche.specialisations?.find(
        (s) => s.nom === specTxt
      ) ||
      arche.specialisations?.find(
        (s) => s.nom === 'Aucune'
      ) ||
      arche.specialisations?.[0] ||
      null

    // MAITRISES
    const maitrises = {}

    ;(maitrisesTxt || '')
      .split('.')
      .filter(Boolean)
      .forEach((item) => {
        const [
          archetypeId,
          niveauxTxt,
        ] = item.split(':')

        if (
          !archetypeId ||
          !niveauxTxt
        ) {
          return
        }

        maitrises[archetypeId] =
          niveauxTxt
            .split(',')
            .map(Number)
            .filter(Boolean)
      })

    // GENRE
    const genre =
      genreTxt === 'F' ? 'F' : 'H'

    return {
      arche,
      niveau: Number(niveau) || 40,
      stats,
      corps,
      slots,
      installations,
      spec,
      maitrises,
      genre,
    }
  } catch {
    return null
  }
}