import { useMemo, useState } from 'react'

import {
  reglage,
  coutCumule,
  attributsVisibles,
} from '../../lib/couts.js'

import { calculerAjustementTaillePoids } from '../../lib/taillePoids.js'

export default function ClassementsAttributs({
  arche,
  corps,
  stats,
  bonusStats,
}) {
  const [avecBonus, setAvecBonus] = useState(false)

  const classements = useMemo(() => {
    const attributs = attributsVisibles(arche)

    const obtenirAjustement = (attr) => {
      const taillePoids = calculerAjustementTaillePoids({
        attr,
        corps,
        arche,
      })

      const bonusMaitriseInstallation =
        bonusStats?.[attr.id] || 0

      return taillePoids + bonusMaitriseInstallation
    }

    const obtenirStatActuelle = (attr) => {
      const r = reglage(arche, attr.id)
      return stats?.[attr.id] ?? r.base
    }

    const calculerCoutRestant = (
      attr,
      niveauActuel,
      cible
    ) => {
      if (niveauActuel >= cible) return 0

      return coutCumule(
        arche,
        attr.id,
        niveauActuel,
        cible
      )
    }

    const construireClassementBrut = (cibleType) => {
      return attributs
        .map((attr) => {
          const r = reglage(arche, attr.id)
          const statActuelle = obtenirStatActuelle(attr)

          const cible =
            cibleType === 'max'
              ? r.max
              : Math.min(Number(cibleType), r.max)

          const niveauDepart = Math.max(
            r.min,
            Math.min(statActuelle, r.max)
          )

          const cout = calculerCoutRestant(
            attr,
            niveauDepart,
            cible
          )

          return {
            id: attr.id,
            nom: attr.nom || attr.label || attr.id,
            categorie: attr.categorie,
            min: r.min,
            actuel: statActuelle,
            max: r.max,
            cible,
            depart: niveauDepart,
            cout,
            ajustement: 0,
          }
        })
        .sort((a, b) => {
          if (a.cout !== b.cout) {
            return a.cout - b.cout
          }

          if (a.actuel !== b.actuel) {
            return a.actuel - b.actuel
          }

          return a.nom.localeCompare(b.nom)
        })
    }

    const construireClassementEffectif = (cibleType) => {
      return attributs
        .map((attr) => {
          const r = reglage(arche, attr.id)
          const statActuelle = obtenirStatActuelle(attr)
          const ajustement = obtenirAjustement(attr)

          const valeurEffectiveActuelle =
            statActuelle + ajustement

          const cible =
            cibleType === 'max'
              ? r.max
              : Math.min(Number(cibleType), r.max)

          if (valeurEffectiveActuelle >= cible) {
            return {
              id: attr.id,
              nom: attr.nom || attr.label || attr.id,
              categorie: attr.categorie,
              min: r.min,
              actuel: statActuelle,
              actuelEffectif: valeurEffectiveActuelle,
              max: r.max,
              cible,
              depart: statActuelle,
              niveauNecessaire: statActuelle,
              cout: 0,
              ajustement,
            }
          }

          const niveauNecessaire = Math.max(
            r.min,
            cible - ajustement
          )

          if (niveauNecessaire > r.max) {
            return null
          }

          const niveauDepart = Math.max(
            r.min,
            Math.min(statActuelle, r.max)
          )

          const cout = calculerCoutRestant(
            attr,
            niveauDepart,
            niveauNecessaire
          )

          return {
            id: attr.id,
            nom: attr.nom || attr.label || attr.id,
            categorie: attr.categorie,
            min: r.min,
            actuel: statActuelle,
            actuelEffectif: valeurEffectiveActuelle,
            max: r.max,
            niveauNecessaire,
            cible,
            depart: niveauDepart,
            cout,
            ajustement,
          }
        })
        .filter(Boolean)
        .sort((a, b) => {
          if (a.cout !== b.cout) {
            return a.cout - b.cout
          }

          if (a.actuel !== b.actuel) {
            return a.actuel - b.actuel
          }

          return a.nom.localeCompare(b.nom)
        })
    }

    return {
      brut: {
        minMax: construireClassementBrut('max'),
        min80: construireClassementBrut(80),
        min85: construireClassementBrut(85),
        min90: construireClassementBrut(90),
      },

      effectif: {
        minMax: construireClassementEffectif('max'),
        min80: construireClassementEffectif(80),
        min85: construireClassementEffectif(85),
        min90: construireClassementEffectif(90),
      },
    }
  }, [arche, corps, bonusStats, stats])

  const colonnes = [
    {
      id: 'minMax',
      titre: 'ACTUEL → MAX',
    },
    {
      id: 'min80',
      titre: 'ACTUEL → 80',
    },
    {
      id: 'min85',
      titre: 'ACTUEL → 85',
    },
    {
      id: 'min90',
      titre: 'ACTUEL → 90',
    },
  ]

  const cle = avecBonus ? 'effectif' : 'brut'

  const explication = avecBonus
    ? 'Coût en AP pour chaque attribut, en tenant compte de tes bonus/malus actuels (taille, poids, maîtrises, installations du club).'
    : "Coût en AP pour amener chaque attribut de sa valeur actuelle jusqu'à la cible, sans tenir compte des bonus/malus (taille, poids, maîtrises, installations). Les moins chers en premier : c'est l'ordre le plus rentable pour dépenser tes AP."

  const afficherLigne = (item, index) => (
    <div
      key={item.id}
      className="classement-ligne"
    >
      <div className="classement-rang">
        {index + 1}
      </div>

      <div className="classement-info">
        <div className="classement-nom">
          {item.nom}
        </div>

        <div className="classement-details">
          {avecBonus &&
          item.actuelEffectif !== undefined
            ? `${item.actuelEffectif} → ${item.cible}`
            : `${item.actuel} → ${item.cible}`}
        </div>
      </div>

      <div
        className="classement-cout"
        style={{
          color: '#f59e0b',
          fontWeight: 700,
        }}
      >
        {item.cout} AP
      </div>
    </div>
  )

  return (
    <section className="classements">
      <div className="classements-header">
        <div className="classements-header-top">
          <div>
            <h2>
              Classement des coûts d'attributs
            </h2>

            <p className="classements-archetype">
              {arche.nom}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAvecBonus((v) => !v)}
            className={`classements-toggle ${
              avecBonus ? 'active' : ''
            }`}
            aria-pressed={avecBonus}
          >
            <span className="classements-toggle-track">
              <span className="classements-toggle-thumb" />
            </span>

            <span className="classements-toggle-label">
              {avecBonus
                ? 'Avec bonus / malus'
                : 'Sans bonus / malus'}
            </span>
          </button>
        </div>

        <p
          className="classements-explication"
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {explication}

          {avecBonus && (
            <>
              {' '}

              <span
                style={{
                  color: '#f59e0b',
                  fontWeight: 700,
                }}
              >
                ⚠️ Rappel : les bonus/malus ne sont pas
                pris en compte pour le déblocage des
                PlayStyles.
              </span>
            </>
          )}
        </p>
      </div>

      <div className="classements-grid">
        {colonnes.map((colonne) => {
          const liste =
            classements?.[cle]?.[colonne.id] ?? []

          return (
            <div
              key={colonne.id}
              className="classement-colonne"
            >
              <h3>
                {colonne.titre}
              </h3>

              <div className="classement-liste">
                {liste.map(afficherLigne)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
