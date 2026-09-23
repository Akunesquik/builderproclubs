import { useState } from 'react'
import { NB_SLOTS, appliquer, parNom, coutPlayStyle, estDebloque } from '../lib/playstyles.js'
import { appliquerSpec, specParNom, estDebloqueeSpec } from '../lib/specialisations.js'
import ChoixPlayStyle from './molecule/ChoixPlayStyle.jsx'
import ChoixSpecialisation from './molecule/ChoixSpecialisation.jsx'
import ClubFacilitiesPanel from './ClubFacilitiesPanel.jsx'
import JaugePoints from './molecule/JaugePoints.jsx'

/**
 * Les emplacements de PlayStyles du build, plus l'emplacement de spécialisation.
 * Choisir un PlayStyle/une spécialisation monte automatiquement les attributs requis
 * à leur seuil ; le retirer libère l'emplacement mais ne rend pas les AP
 * (à toi de rebaisser les stats).
 */
export default function PlayStylesPanel({
  arche,
  stats,
  slots,
  restant,
  onStats,
  onSlots,
  spec,
  onSpec,
  installations,
  onInstallations,
  depenses,
  budget,
  niveau,
  onNiveau
}) {
  const [ouvert, setOuvert] = useState(null)
  const [ouvertSpec, setOuvertSpec] = useState(false)

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

  function retirerDepuisLaPopup(nom) {
    onSlots(slots.map((slot) => (slot === nom ? null : slot)))
    setOuvert(null)
  }

  function choisirSpec(sp) {
    onSpec(sp)
    onStats(appliquerSpec(arche, stats, sp))
    setOuvertSpec(false)
  }

  const spChoisie = spec
  const specPerdue =
    spChoisie && !estDebloqueeSpec(arche, stats, spChoisie)

  return (
    <section className="w-full">

      {/* Les 4 blocs ont la même largeur */}
      <div className="grid grid-cols-2 md:flex md:flex-row gap-4 w-full mx-auto justify-center">

        {/* ==================== SPÉCIALITÉ ==================== */}
        <div className="w-full lg:flex-1 min-w-0 max-w-50">

          <div className="categorie-tete">
            <h2>Spécialité</h2>
          </div>

          <div className="specialite-ligne">
            <button
              className={
                (spChoisie ? ' rempli' : '') +
                (specPerdue ? ' perdu' : '') +
                ' flex flex-row items-center gap-2 border border-gray-500 rounded p-2 max-w-full'
              }
              onClick={() => setOuvertSpec(true)}
              title={
                specPerdue
                  ? 'Les seuils ne sont plus atteints'
                  : undefined
              }
            >
              {spChoisie ? (
                <>
                  <img
                    src={`${import.meta.env.BASE_URL}img/playstyles/gold/${spChoisie.archetypeGagne.slice(0, -1)}.png`}
                    alt={spChoisie.archetypeGagne}
                    className="h-20"
                  />

                  <span className="pr-2 text-left text-sm font-bold">
                    {spChoisie.nom}
                  </span>
                </>
              ) : (
                <>
                  <span className="slot-plus">+</span>
                  <span className="slot-cat">
                    spécialisation
                  </span>
                </>
              )}
            </button>
          </div>

        </div>


        {/* ==================== PLAYSTYLES ==================== */}
        <div className="w-full lg:flex-1 min-w-0">

          <div className="flex justify-between items-center categorie-tete">
            <h2>PlayStyles</h2>

            <span className="categorie-moy">
              <em>équipés</em>
              <h2>{slots.filter(Boolean).length}/{NB_SLOTS}</h2>
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-3">

            {Array.from({ length: NB_SLOTS }, (_, i) => {
              const nom = slots[i]
              const ps = nom ? parNom(nom) : null
              const perdu =
                ps && !estDebloque(arche, stats, ps)

              return (
                <button
                  key={i}
                  className={
                    (ps ? ' rempli' : '') +
                    (perdu ? ' perdu' : '') +
                    ' flex flex-row items-center gap-2 border border-gray-500 rounded p-2 max-w-full'
                  }
                  onClick={() => setOuvert(i)}
                  title={
                    perdu
                      ? 'Les seuils ne sont plus atteints'
                      : undefined
                  }
                >
                  {ps ? (
                    <>
                      <img
                        src={`${import.meta.env.BASE_URL}img/playstyles/silver/${ps.nom}.png`}
                        alt={ps.nom}
                        className="h-20"
                      />

                      <span
                        onClick={(e) => retirer(i, e)}
                        role="button"
                      >
                        ×
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="slot-plus">
                        +
                      </span>

                      <span className="slot-cat flex items-center min-h-[80px] max-w-[78px]">
                        emplacement libre
                      </span>
                    </>
                  )}
                </button>
              )
            })}

          </div>

        </div>


        {/* ==================== INSTALLATIONS ==================== */}
        <div className="w-full lg:flex-1 min-w-0 max-w-70">

          <div className="categorie-tete">
            <h2 className="installations-titre">
              Installations club
            </h2>
          </div>

          <ClubFacilitiesPanel
            selections={Object.fromEntries(
              (installations || []).map((id) => [id, 1])
            )}
            onChange={(newSelections) => {
              const selectedInstallations =
                Object.entries(newSelections || {})
                  .filter(([_, niveau]) => niveau > 0)
                  .map(([id]) => id)

              onInstallations(selectedInstallations)
            }}
          />

        </div>


        {/* ==================== RÉSUMÉ ==================== */}
        <div className="w-full lg:flex-1 min-w-0 max-w-80">

          <div className="playstyles-summary">
            <JaugePoints
              depenses={depenses}
              budget={budget}
              niveau={niveau}
              onNiveau={onNiveau}
            />
          </div>

        </div>

      </div>


      {/* ==================== POPUP PLAYSTYLE ==================== */}

      {ouvert !== null ? (
        <ChoixPlayStyle
        arche={arche}
        stats={stats}
        restant={restant}
        deja={slots.filter(Boolean)}
        onChoisir={choisir}
        onRetirer={retirerDepuisLaPopup}
        onFermer={() => setOuvert(null)}
        />
      ) : null}


      {/* ==================== POPUP SPÉCIALISATION ==================== */}
      {ouvertSpec ? (
        <ChoixSpecialisation
          arche={arche}
          stats={stats}
          restant={restant}
          deja={spChoisie}
          onChoisir={choisirSpec}
          onFermer={() => setOuvertSpec(false)}
        />
      ) : null}

    </section>
  )
}