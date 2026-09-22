import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { estEtoiles, coutPoint } from '../../lib/couts.js'
import Etoiles from './Etoiles.jsx'
import BonusStats from './BonusStats.jsx'

export default function LigneAttribut({ attr, reg, valeur, cout, abordable, restant, onChange, arche, corps }) {
  const etoiles = estEtoiles(reg)
  const investi = valeur > reg.base
  const borne = (x) => Math.max(0, Math.min(100, x))

  const barreRef = useRef(null)
  const dragging = useRef(false)
  const valeurRef = useRef(valeur) // toujours à jour, même dans les listeners globaux

  // valeur affichée pendant le drag (optimiste, indépendante du round-trip parent)
  const [valeurAffichee, setValeurAffichee] = useState(valeur)

  // resynchronise si le parent renvoie une valeur différente (hors drag, ou après clamp par le parent)
  useEffect(() => {
    valeurRef.current = valeur
    if (!dragging.current) setValeurAffichee(valeur)
  }, [valeur])

  const maxAbordable = useMemo(() => {
    let v = valeur
    while (v < reg.max) {
      const coutSuivant = coutPoint(arche, attr.id, v)
      if (coutSuivant === null || coutSuivant > restant) {
        break
      }
      v++
    }
    return v
  }, [valeur, reg.max, restant, arche, attr.id])

  return (
    <div className={'ligne' + (investi ? ' investie' : '')}>
      <button
        className="pas"
        onClick={() => onChange(-1)}
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
            <div
              className="barre-gain z-1"
              style={{ width: borne(valeurAffichee) + '%' }}
            />

            <div
              className="barre-base"
              style={{ width: reg.base + '%' }}
            />

          </div>
        )}
      </div>

      <button
        className={'pas plus' + (abordable ? '' : ' hors-budget')}
        onClick={() => onChange(1)}
        disabled={cout === null || !abordable}
        aria-label={'Monter ' + attr.nom}
      >
        <span className="pas-signe">+</span>
        <span className="pas-cout">{cout === null ? 'max' : cout}</span>
      </button>
    </div>
  )
}