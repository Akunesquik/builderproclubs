import { estEtoiles } from '../../lib/couts.js'
import Etoiles from './Etoiles.jsx'

export default function LigneAttribut({ attr, reg, valeur, cout, abordable, onChange }) {
  const etoiles = estEtoiles(reg)
  const amplitude = Math.max(1, reg.max - reg.min)
  const pct = ((valeur - reg.min) / amplitude) * 100
  const pctBase = ((reg.base - reg.min) / amplitude) * 100
  const investi = valeur > reg.base
  const borne = (x) => Math.max(0, Math.min(100, x))

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
                {valeur}
                <small className="ligne-plafond">/{reg.max}</small>
              </>
            )}
          </span>
        </div>

        {etoiles ? null : (
          <div className="barre">
            <div className="barre-gain" style={{ width: borne(pct) + '%' }} />
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
