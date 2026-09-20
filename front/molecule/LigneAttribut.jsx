import { useRef, useCallback, useState, useEffect } from 'react'
import { estEtoiles } from '../../lib/couts.js'
import Etoiles from './Etoiles.jsx'

export default function LigneAttribut({ attr, reg, valeur, cout, abordable, onChange }) {
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

  const valeurDepuisPosition = useCallback((clientX) => {
    const el = barreRef.current
    if (!el) return valeurRef.current
    const rect = el.getBoundingClientRect()
    const fraction = borne(((clientX - rect.left) / rect.width) * 100) / 100
    const brute = reg.min + fraction * (reg.max - reg.min)
    return Math.round(brute)
  }, [reg.min, reg.max])

  const appliquerPosition = useCallback((clientX) => {
    const cible = valeurDepuisPosition(clientX)
    const delta = cible - valeurRef.current
    if (delta !== 0) {
      valeurRef.current = cible      // mise à jour optimiste immédiate
      setValeurAffichee(cible)       // rendu instantané, sans attendre le parent
      onChange(delta)
    }
  }, [valeurDepuisPosition, onChange])

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return
    appliquerPosition(e.clientX)
  }, [appliquerPosition])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }, [onPointerMove])

  const onPointerDown = useCallback((e) => {
    dragging.current = true
    appliquerPosition(e.clientX)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }, [appliquerPosition, onPointerMove, onPointerUp])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(1)
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(-1)
  }, [onChange])

  const pctBase = reg.base

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
          <span className="ligne-nom">
            {attr.nom}
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
          <div
            className="barre barre-slidable"
            ref={barreRef}
            role="slider"
            tabIndex={0}
            aria-valuemin={reg.min}
            aria-valuemax={reg.max}
            aria-valuenow={valeurAffichee}
            aria-label={attr.nom}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
          >
            <div className="barre-gain" style={{ width: borne(valeurAffichee) + '%' }} />
            <div className="barre-base" style={{ width: borne(pctBase) + '%' }} />
          </div>
        )}
      </div>

      <button
        className={'pas plus' + (abordable ? '' : ' hors-budget')}
        onClick={() => onChange(1)}
        disabled={cout === null}
        aria-label={'Monter ' + attr.nom}
      >
        <span className="pas-signe">+</span>
        <span className="pas-cout">{cout === null ? 'max' : cout}</span>
      </button>
    </div>
  )
}