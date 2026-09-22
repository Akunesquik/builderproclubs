import { useState } from 'react'
import { NB_SLOTS, appliquer, parNom, coutPlayStyle, estDebloque } from '../lib/playstyles.js'
import { appliquerSpec, specParNom, estDebloqueeSpec } from '../lib/specialisations.js'
import ChoixPlayStyle from './molecule/ChoixPlayStyle.jsx'
import ChoixSpecialisation from './molecule/ChoixSpecialisation.jsx'

/**
 * Les emplacements de PlayStyles du build, plus l'emplacement de spécialisation.
 * Choisir un PlayStyle/une spécialisation monte automatiquement les attributs requis
 * à leur seuil ; le retirer libère l'emplacement mais ne rend pas les AP (à toi de
 * rebaisser les stats).
 */
export default function PlayStylesPanel({ arche, stats, slots, restant, onStats, onSlots, spec, onSpec }) {
  const [ouvert, setOuvert] = useState(null) // index d'emplacement en cours de choix
  const [ouvertgold, setOuvertGold] = useState(null) // index d'emplacement gold en cours de choix
  const [ouvertSpec, setOuvertSpec] = useState(false) // emplacement de spé en cours de choix

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

  function choisirSpec(sp) {
    onSpec(sp.nom)
    onStats(appliquerSpec(arche, stats, sp))
    setOuvertSpec(false)
  }

  function retirerSpec(e) {
    e.stopPropagation()
    onSpec(null)
  }

  const spChoisie = spec ? specParNom(arche, spec) : null
  const specPerdue = spChoisie && !estDebloqueeSpec(arche, stats, spChoisie)

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
        {/* Gold */}
        <button
          className={'' + (spChoisie ? ' rempli' : '') + (specPerdue ? ' perdu' : '') + " flex flex-row items-center gap-2 border border-gray-500 rounded p-2 max-w-30"}
          onClick={() => setOuvertSpec(true)}
          title={specPerdue ? 'Les seuils ne sont plus atteints' : undefined}
        >
          {spChoisie ? (
            <>
              <img src={`${import.meta.env.BASE_URL}img/playstyles/gold/${spChoisie.archetypeGagne.slice(0,-1)}.png`} alt={spChoisie.archetypeGagne} />
            </>
          ) : (
            <>
              <span className="slot-plus">+</span>
              <span className="slot-cat">spécialisation</span>
            </>
          )}
        </button>

        {/* Silver */}
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
                  <img src={`${import.meta.env.BASE_URL}img/playstyles/silver/${ps.nom}.png`} alt={ps.nom} />
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

      {ouvertSpec ? (
        <ChoixSpecialisation
          arche={arche}
          stats={stats}
          restant={restant}
          deja={spec}
          onChoisir={choisirSpec}
          onFermer={() => setOuvertSpec(false)}
        />
      ) : null}
    </section>
  )
}