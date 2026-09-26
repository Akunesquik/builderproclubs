import {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo
} from 'react'
import { useLanguage } from '../../i18n/context.jsx'
import {
  estEtoiles,
  coutPoint,
  reglage
} from '../../lib/couts.js'
import {
  calculerAjustementTaillePoids
} from '../../lib/taillePoids.js'
import Etoiles from './composants/Etoiles.jsx'
import BonusStats from './composants/BonusStats.jsx'

export default function LigneAttribut({
  attr,
  reg,
  valeur,
  cout,
  abordable,
  restant,
  arche,
  corps,
  bonusStats,
  ajustementsAffiches,
  setStats
}) {
  const { t } = useLanguage()

  const etoiles = estEtoiles(reg)
  const investi = valeur > reg.base
  const dragging = useRef(false)
  const valeurRef = useRef(valeur)
  const restantRef = useRef(restant)
  const intervalRef = useRef(null)

  const [valeurAffichee, setValeurAffichee] =
    useState(valeur)

  const borne = (x) =>
    Math.max(0, Math.min(100, x))

  const couleurBarre = (valeur) => {
    if (valeur < 50) return '#ef4444'
    if (valeur < 80) return '#fb923c'
    if (valeur < 90) return '#15803d'
    return '#84cc16'
  }

  // Traduction du nom de l'attribut
  const nomAttribut =
    t.attributes?.names?.[attr.id] ??
    t.attributes?.names?.[attr.nom] ??
    t.stats?.[attr.id] ??
    t.stats?.[attr.nom] ??
    attr.nom

  // Bonus/malus taille-poids + maîtrise
  const ajustement = useMemo(() => {
    const taillepoids =
      calculerAjustementTaillePoids({
        attr,
        corps,
        arche
      })

    const bonusMaitrise =
      bonusStats?.[attr.id] || 0

    return taillepoids + bonusMaitrise
  }, [attr, corps, arche, bonusStats])

  // Synchronisation avec le parent
  useEffect(() => {
    valeurRef.current = valeur
    restantRef.current = restant

    if (!dragging.current) {
      setValeurAffichee(valeur)
    }
  }, [valeur, restant])

  // Modification réelle de la stat
  const ajuster = useCallback(
    (sens) => {
      setStats((stats) => {
        const reglageAttribut =
          reglage(arche, attr.id)

        const valeurActuelle =
          stats[attr.id] ??
          reglageAttribut.base

        if (sens > 0) {
          if (
            coutPoint(
              arche,
              attr.id,
              valeurActuelle
            ) === null
          ) {
            return stats
          }

          return {
            ...stats,
            [attr.id]: valeurActuelle + 1
          }
        }

        if (
          valeurActuelle <=
          reglageAttribut.min
        ) {
          return stats
        }

        return {
          ...stats,
          [attr.id]: valeurActuelle - 1
        }
      })
    },
    [arche, attr.id, setStats]
  )

  const stopRepeatingChange =
    useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, [])

  // Changement local + modification réelle du build
  const appliquerChangement =
    useCallback(
      (amount) => {
        const valeurActuelle =
          valeurRef.current

        const restantActuel =
          restantRef.current

        if (amount > 0) {
          if (
            valeurActuelle >= reg.max
          ) {
            return false
          }

          const coutActuel =
            coutPoint(
              arche,
              attr.id,
              valeurActuelle
            ) || 0

          if (
            restantActuel < coutActuel
          ) {
            return false
          }

          valeurRef.current = Math.min(
            reg.max,
            valeurActuelle + amount
          )

          restantRef.current -= coutActuel

          setValeurAffichee(
            valeurRef.current
          )

          ajuster(1)

          return true
        }

        if (amount < 0) {
          if (
            valeurActuelle <= reg.min
          ) {
            return false
          }

          valeurRef.current = Math.max(
            reg.min,
            valeurActuelle + amount
          )

          setValeurAffichee(
            valeurRef.current
          )

          ajuster(-1)

          return true
        }

        return false
      },
      [
        arche,
        attr.id,
        reg.max,
        reg.min,
        ajuster
      ]
    )

  // Gestion du clic maintenu
  const startRepeatingChange =
    useCallback(
      (amount) => {
        stopRepeatingChange()

        const premierChangement =
          appliquerChangement(amount)

        if (!premierChangement) return

        intervalRef.current =
          setInterval(() => {
            const changement =
              appliquerChangement(amount)

            if (!changement) {
              stopRepeatingChange()
            }
          }, 100)
      },
      [
        appliquerChangement,
        stopRepeatingChange
      ]
    )

  const valeurAvecAjustement =
    ajustementsAffiches
      ? Math.max(
          0,
          Math.min(
            99,
            valeurAffichee + ajustement
          )
        )
      : valeurAffichee

  return (
    <div
      className={
        'ligne' +
        (investi ? ' investie' : '')
      }
    >
      <button
        className="pas !leading-none flex flex-col"
        onMouseDown={() =>
          startRepeatingChange(-1)
        }
        onMouseUp={
          stopRepeatingChange
        }
        onMouseLeave={
          stopRepeatingChange
        }
        disabled={
          valeur <= reg.min
        }
        aria-label={
          `${t.attributes?.decrease ?? 'Baisser'} ${nomAttribut}`
        }
      >
        <span className="pas-signe">
          -
        </span>

        <span className="pas-cout">
          {valeur - 1 >= reg.min
            ? coutPoint(
                arche,
                attr.id,
                valeur - 1
              )
            : ''}
        </span>
      </button>

      <div className="ligne-corps">
        <div className="ligne-tete">
          <span className="ligne-nom flex">
            <span
              className={
                reg.cle
                  ? 'text-green-500'
                  : ''
              }
            >
              {nomAttribut}
            </span>

            {!ajustementsAffiches && (
              <BonusStats
                arche={arche}
                attr={attr}
                corps={corps}
                bonusStats={bonusStats}
              />
            )}
          </span>

          <span className="ligne-valeur">
            {etoiles ? (
              <Etoiles
                valeur={valeur}
                max={reg.max}
              />
            ) : (
              <>
                {valeurAvecAjustement}

                <small className="ligne-plafond">
                  /{reg.max}
                </small>
              </>
            )}
          </span>
        </div>

        {!etoiles && (
          <div className="barre">
            <div
              className="barre-base"
              style={{
                width:
                  borne(
                    valeurAvecAjustement
                  ) + '%',
                backgroundColor: investi
                  ? couleurBarre(
                      valeurAvecAjustement
                    )
                  : '#46596a'
              }}
            />
          </div>
        )}
      </div>

      <button
        className={
          'pas plus' +
          (abordable
            ? ''
            : ' hors-budget')
        }
        onMouseDown={() =>
          startRepeatingChange(1)
        }
        onMouseUp={
          stopRepeatingChange
        }
        onMouseLeave={
          stopRepeatingChange
        }
        disabled={
          cout === null ||
          !abordable
        }
        aria-label={
          `${t.attributes?.increase ?? 'Monter'} ${nomAttribut}`
        }
      >
        <span className="pas-signe">
          +
        </span>

        <span className="pas-cout">
          {cout === null
            ? (
                t.attributes?.max ??
                'max'
              )
            : cout}
        </span>
      </button>
    </div>
  )
}