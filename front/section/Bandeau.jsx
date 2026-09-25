import { useMemo, useState } from 'react'
import {
  NB_SLOTS,
  appliquer,
  parNom,
  estDebloque,
} from '../../lib/playstyles.js'
import {
  appliquerSpec,
  estDebloqueeSpec,
} from '../../lib/specialisations.js'

import PlaystylePanel from '../popup/PlaystylePanel.jsx'
import SpecialisationPanel from '../popup/SpecialisationPanel.jsx'
import ClubFacilitiesPanel from '../popup/ClubFacilitiesPanel.jsx'
import MaitrisesPanel from '../popup/MaitrisesPanel.jsx'
import JaugePoints from '../molecule/composants/JaugePoints.jsx'
import DATA from '../../data/fc27.json'

export default function Bandeau({
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
  onNiveau,
  maitrises,
  setMaitrises,

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

  const NOM_FR_PLAYSTYLE = Object.fromEntries(
    DATA.playStyles.map((p) => [p.nom, p.nomFr])
  )

  // PlayStyles débloqués via une installation du club au niveau 3
  const playstylesInstallations = useMemo(() => {
    const noms = new Set()

    Object.entries(installations || {}).forEach(([id, niv]) => {
      if (niv === 3) {
        const inst = DATA.installationsClub.find((i) => i.id === id)
        const styleJeu = inst?.niveaux?.[2]?.styleJeu

        if (styleJeu) {
          noms.add(styleJeu)
        }
      }
    })

    return [...noms]
  }, [installations])

 

  function retirer(i, e) {
    e.stopPropagation()

    const suivants = [...slots]
    suivants[i] = null

    onSlots(suivants)
  }

  function retirerDepuisLaPopup(nom) {
    onSlots(
      slots.map((slot) =>
        slot === nom ? null : slot
      )
    )

    setOuvert(null)
  }

  function choisirSpec(sp) {
    onSpec(sp)
    onStats(appliquerSpec(arche, stats, sp))
    setOuvertSpec(false)
  }

  const spChoisie = spec

  const specPerdue =
    spChoisie &&
    !estDebloqueeSpec(arche, stats, spChoisie)

  return (
    <section className="w-full">

      {/* ==================== LIGNE 1 : Spécialité / PlayStyles / Bonus additionnels / Résumé ==================== */}
      <div className="grid grid-cols-2 md:flex md:flex-row gap-4 w-full mx-auto justify-center">

        {/* ==================== SPÉCIALITÉ ==================== */}
        <div className="w-full lg:flex-1 min-w-0 max-w-50">

          <div className="categorie-tete">
            <h2>Spécialité</h2>
          </div>

          <div className="specialite-ligne">
            <button
              type="button"
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
                    src={`${import.meta.env.BASE_URL}img/playstyles/gold/${NOM_FR_PLAYSTYLE[spChoisie.archetypeGagne.slice(0, -1)]}.png`}
                    alt={spChoisie.archetypeGagne}
                    className="h-20"
                  />

                  <span className="pr-2 text-left text-sm font-bold">
                    {spChoisie.nom}
                  </span>
                </>
              ) : (
                <>
                  <span className="slot-plus">
                    +
                  </span>

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
              <h2>
                {slots.filter(Boolean).length}/{NB_SLOTS}
              </h2>
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
                        src={`${import.meta.env.BASE_URL}img/playstyles/silver/${NOM_FR_PLAYSTYLE[ps.nom]}.png`}
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

            {/* ==================== PLAYSTYLE(S) VIA INSTALLATIONS DU CLUB ==================== */}
            {playstylesInstallations.map((nom) => {
              const frenchName = NOM_FR_PLAYSTYLE[nom] ?? nom
              let path
              if (frenchName.at(-1) === '+'){
                path = `${import.meta.env.BASE_URL}img/playstyles/gold/${frenchName.slice(0,-1)}.png`
              }
              else{
                path = `${import.meta.env.BASE_URL}img/playstyles/silver/${frenchName}.png`
              }

              return (
                <div
                  key={nom}
                  className="rempli flex items-center justify-center border border-amber-400 rounded p-2 max-w-full"
                  title={nom}
                >
                  <img
                    src={path}
                    alt={nom}
                    className="h-20"
                  />
                </div>
              )
            })}

          </div>

        </div>


        {/* ==================== INSTALLATIONS ==================== */}
        <div className="w-full lg:flex-1 min-w-0 max-w-70">

          <div className="categorie-tete">
            <h2 className="installations-titre">
              Bonus additionnels
            </h2>
          </div>

          {/* ================= INSTALLATIONS ================= */}
          <ClubFacilitiesPanel
            selections={installations}
            onChange={onInstallations}
          />

          {/* ================= MAÎTRISES ================= */}
          <div className="mt-[10px]">
            <MaitrisesPanel  selections={maitrises}  onChange={setMaitrises}/>
          </div>

        </div>


        {/* ==================== RÉSUMÉ ==================== */}
        <div className="w-full lg:flex-1 min-w-0 max-w-80">

          <div className="playstyles-summary">
            <JaugePoints  depenses={depenses}  budget={budget}  niveau={niveau}  onNiveau={onNiveau}/>
          </div>

        </div>

      </div>
   


      {/* ==================== POPUP PLAYSTYLE ==================== */}

      {ouvert !== null ? (
        <PlaystylePanel
        arche={arche}
        stats={stats}
        restant={restant}
        deja={slots.filter(Boolean)}
        onChoisir={choisir}
        onRetirer={retirerDepuisLaPopup}
        onFermer={() => setOuvert(null)}
        spec={spec}
        />
      ) : null}


      {/* ================== POPUP SPÉCIALISATION ====================== */}
          
      {ouvertSpec ? (
        <SpecialisationPanel
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