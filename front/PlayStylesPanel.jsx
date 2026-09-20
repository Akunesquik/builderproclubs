import { useState } from 'react'
import { NB_SLOTS, appliquer, parNom, coutPlayStyle, estDebloque } from '../lib/playstyles.js'
import ChoixPlayStyle from './molecule/ChoixPlayStyle.jsx'

/**
 * Les emplacements de PlayStyles du build.
 * Choisir un PlayStyle monte automatiquement les attributs requis à leur seuil ;
 * le retirer libère l'emplacement mais ne rend pas les AP (à toi de rebaisser les stats).
 */
export default function PlayStylesPanel({ arche, stats, slots, restant, onStats, onSlots }) {
  const [ouvert, setOuvert] = useState(null) // index d'emplacement en cours de choix

  function choisir(ps) {
    const suivants = [...slots]
    suivants[ouvert] = ps.nom
    onSlots(suivants)
    onStats(appliquer(arche, stats, ps))
    setOuvert(null)
  }

  function retirer(i, e) {
    e.stopPropagation()
    const suivants = [...slots]
    suivants[i] = null
    onSlots(suivants)
  }

  return (
    <section className="w-full">
      <div className="flex justify-between items-center categorie-tete">
        <h2>PlayStyles</h2>
        <span className="categorie-moy">
          <em>équipés</em>
          {slots.filter(Boolean).length}/{NB_SLOTS}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 pt-3">
        {Array.from({ length: NB_SLOTS }, (_, i) => {
          const nom = slots[i]
          const ps = nom ? parNom(nom) : null
          const perdu = ps && !estDebloque(arche, stats, ps)
          return (
            <button
              key={i}
              className={'' + (ps ? ' rempli' : '') + (perdu ? ' perdu' : '') + " flex flex-row items-center gap-2 border border-gray-500 rounded p-2 max-w-30"}
              onClick={() => setOuvert(i)}
              title={perdu ? 'Les seuils ne sont plus atteints' : undefined}
            >
              {ps ? (
                <>
                  <img src={`/img/playstyles/silver/${ps.nom}.png`} alt={ps.nom} />
                  <span className="" onClick={(e) => retirer(i, e)} role="button"> × </span>
                </>
              ) : (
                <>
                  <span className="slot-plus">+</span>
                  <span className="slot-cat">emplacement libre</span>
                </>
              )}
            </button>
          )
        })}
      </div>

      {ouvert !== null ? (
        <ChoixPlayStyle
          arche={arche}
          stats={stats}
          restant={restant}
          deja={slots.filter(Boolean)}
          onChoisir={choisir}
          onFermer={() => setOuvert(null)}
        />
      ) : null}
    </section>
  )
}
