import { useRef, useCallback, useState, useEffect } from 'react'
import { estEtoiles, coutPoint } from '../../lib/couts.js'
import Etoiles from './Etoiles.jsx'
import BonusStats from './BonusStats.jsx'

export default function LigneAttribut({
  attr,
  reg,
  valeur,
  cout,
  abordable,
  restant,
  onChange,
  arche,
  corps
}) {
  const etoiles = estEtoiles(reg)
  const investi = valeur > reg.base
  const borne = (x) => Math.max(0, Math.min(100, x))

  const dragging = useRef(false)

  // Valeurs locales toujours à jour pendant le clic maintenu
  const valeurRef = useRef(valeur)
  const restantRef = useRef(restant)

  const intervalRef = useRef(null)

  const [valeurAffichee, setValeurAffichee] = useState(valeur)

  // Synchronisation avec le parent
  useEffect(() => {
    valeurRef.current = valeur
    restantRef.current = restant

    if (!dragging.current) {
      setValeurAffichee(valeur)
    }
  }, [valeur, restant])

  // Vérifie si on peut augmenter la stat
  const peutAugmenter = useCallback(() => {
    const valeurActuelle = valeurRef.current
    const restantActuel = restantRef.current

    if (valeurActuelle >= reg.max) {
      return false
    }

    const cout = coutPoint(
      arche,
      attr.id,
      valeurActuelle
    ) || 0

    return restantActuel >= cout
  }, [arche, attr.id, reg.max])

  // Vérifie si on peut diminuer la stat
  const peutDiminuer = useCallback(() => {
    return valeurRef.current > reg.min
  }, [reg.min])

  const stopRepeatingChange = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const appliquerChangement = useCallback(
    (amount) => {
      const valeurActuelle = valeurRef.current
      const restantActuel = restantRef.current

      // =========================
      // AUGMENTATION
      // =========================
      if (amount > 0) {
        if (valeurActuelle >= reg.max) {
          return false
        }

        const cout = coutPoint(
          arche,
          attr.id,
          valeurActuelle
        ) || 0

        // Pas assez de points
        if (restantActuel < cout) {
          return false
        }

        // Mise à jour locale immédiate
        valeurRef.current = Math.min(
          reg.max,
          valeurActuelle + amount
        )

        restantRef.current -= cout

        setValeurAffichee(valeurRef.current)

        onChange(amount)

        return true
      }

      // =========================
      // DIMINUTION
      // =========================
      if (amount < 0) {
        if (valeurActuelle <= reg.min) {
          return false
        }

        valeurRef.current = Math.max(
          reg.min,
          valeurActuelle + amount
        )

        setValeurAffichee(valeurRef.current)

        onChange(amount)

        return true
      }

      return false
    },
    [
      arche,
      attr.id,
      reg.max,
      reg.min,
      onChange
    ]
  )

  // Gestion du clic maintenu
  const startRepeatingChange = useCallback(
    (amount) => {
      // Évite plusieurs intervalles simultanés
      stopRepeatingChange()

      // Premier changement immédiat
      const premierChangement = appliquerChangement(amount)

      if (!premierChangement) {
        return
      }

      // Répétition
      intervalRef.current = setInterval(() => {
        const changement = appliquerChangement(amount)

        // Dès que ce n'est plus possible, on arrête
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

  const handleMouseDown = (amount) => {
    startRepeatingChange(amount)
  }

  return (
    <div className={'ligne' + (investi ? ' investie' : '')}>

      {/* BOUTON - */}
      <button
        className="pas"
        onMouseDown={() => handleMouseDown(-1)}
        onMouseUp={stopRepeatingChange}
        onMouseLeave={stopRepeatingChange}
        disabled={valeur <= reg.min}
        aria-label={'Baisser ' + attr.nom}
      >
        −
      </button>

      <div className="ligne-corps">

        <div className="ligne-tete">

          <span className="ligne-nom flex">
            {attr.nom}{' '}

            <BonusStats
              arche={arche}
              attr={attr}
              corps={corps}
            />

            {reg.cle ? (
              <em
                className="remise"
                title="Attribut clé : les paliers les moins chers"
              >
                clé
              </em>
            ) : null}
          </span>

          <span className="ligne-valeur">
            {etoiles ? (
              <Etoiles
                valeur={valeur}
                max={reg.max}
              />
            ) : (
              <>
                {valeurAffichee}
                <small className="ligne-plafond">
                  /{reg.max}
                </small>
              </>
            )}
          </span>

        </div>

        {etoiles ? null : (
          <div className="barre">

            <div
              className="barre-gain z-1"
              style={{
                width: borne(valeurAffichee) + '%'
              }}
            />

            <div
              className="barre-base"
              style={{
                width: reg.base + '%'
              }}
            />

          </div>
        )}

      </div>

      {/* BOUTON + */}
      <button
        className={
          'pas plus' +
          (abordable ? '' : ' hors-budget')
        }
        onMouseDown={() => handleMouseDown(2)}
        onMouseUp={stopRepeatingChange}
        onMouseLeave={stopRepeatingChange}
        disabled={cout === null || !abordable}
        aria-label={'Monter ' + attr.nom}
      >
        <span className="pas-signe">+</span>

        <span className="pas-cout">
          {cout === null ? 'max' : cout}
        </span>
      </button>

    </div>
  )
}