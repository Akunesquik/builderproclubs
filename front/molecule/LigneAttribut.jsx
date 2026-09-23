import { useRef, useCallback, useState, useEffect } from 'react'
import { estEtoiles } from '../../lib/couts.js'
import Etoiles from './Etoiles.jsx'
import BonusStats from './BonusStats.jsx'

export default function LigneAttribut({ attr, reg, valeur, cout, abordable, onChange, arche, corps }) {
  const etoiles = estEtoiles(reg)
  const investi = valeur > reg.base
  const borne = (x) => Math.max(0, Math.min(100, x))

  const dragging = useRef(false)
  const valeurRef = useRef(valeur) // toujours à jour, même dans les listeners globaux
  const intervalRef = useRef(null) // Pour l'intervalle de répétition du clic maintenu

  // valeur affichée pendant le drag (optimiste, indépendante du round-trip parent)
  const [valeurAffichee, setValeurAffichee] = useState(valeur)

  // resynchronise si le parent renvoie une valeur différente (hors drag, ou après clamp par le parent)
  useEffect(() => {
    valeurRef.current = valeur
    if (!dragging.current) setValeurAffichee(valeur)
  }, [valeur])

  // Fonction pour démarrer l'incrémentation/décrémentation répétée
  const startRepeatingChange = useCallback((amount) => {
    // Appel immédiat
    onChange(amount)
    // Ensuite, répéter toutes les 100ms (peut être ajusté pour plus de réactivité)
    intervalRef.current = setInterval(() => {
      onChange(amount)
    }, 100)
  }, [onChange])

  // Fonction pour arrêter l'incrémentation/décrémentation répétée
  const stopRepeatingChange = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Gestion du clic maintenu sur les boutons
  const handleMouseDown = (amount) => {
    startRepeatingChange(amount)
  }

  return (
    <div className={'ligne' + (investi ? ' investie' : '')}>
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
            {attr.nom}
            {' '}
            <BonusStats arche={arche} attr={attr} corps={corps} />
            {reg.cle ? (
              <em className="remise" title="Attribut clé : les paliers les moins chers">
                clé
              </em>
            ) : null}
          </span>
          <span className="ligne-valeur">
            {etoiles ? (
              <Etoiles valeur={valeur} max={reg.max} />
            ) : (
              <>
                {valeurAffichee}
                <small className="ligne-plafond">/{reg.max}</small>
              </>
            )}
          </span>
        </div>

        {etoiles ? null : (
          <div className="barre">
            <div  className="barre-gain z-1"  style={{ width: borne(valeurAffichee) + '%' }}/>
            <div  className="barre-base"  style={{ width: reg.base + '%' }}/>
          </div>
        )}
      </div>

      <button
        className={'pas plus' + (abordable ? '' : ' hors-budget')}
        onMouseDown={() => handleMouseDown(1)}
        onMouseUp={stopRepeatingChange}
        onMouseLeave={stopRepeatingChange}
        disabled={cout === null || !abordable}
        aria-label={'Monter ' + attr.nom}
      >
        <span className="pas-signe">+</span>
        <span className="pas-cout">{cout === null ? 'max' : cout}</span>
      </button>
    </div>
  )
}