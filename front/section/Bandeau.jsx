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
import { determinerTypeCourse } from '../../lib/typeCourse.js'

import PlaystylePanel from '../popup/PlaystylePanel.jsx'
import SpecialisationPanel from '../popup/SpecialisationPanel.jsx'
import ClubFacilitiesPanel from '../popup/ClubFacilitiesPanel.jsx'
import MaitrisesPanel from '../popup/MaitrisesPanel.jsx'
import JaugePoints from '../molecule/composants/JaugePoints.jsx'
import Curseur from '../molecule/composants/Curseur.jsx'
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
  corps,
  setCorps,
  genre,
  setGenre,
  bonusStats,
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

  // Type de course, calculé à partir des stats / bonus / corps / genre actuels
  const typeCourse = useMemo(
    () =>
      arche.corps
        ? determinerTypeCourse(arche, stats, corps, genre, bonusStats)
        : null,
    [arche, stats, corps, genre, bonusStats]
  )

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


      {/* ==================== LIGNE 2 : Infos pro (genre / taille / poids / type de course sur 4 colonnes) ==================== */}
      <div className="w-full mt-1">

        <div className="categorie-tete">
          <h2>Infos pro</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 w-full items-center">

          {/* Colonne 1 : Genre */}
          <div className="w-full flex flex-row gap-2 justify-center ">
            <div className="flex gap-2 w-full items-end">
              <button
                type="button"
                onClick={() => setGenre('H')}
                className={
                  'flex-1 rounded border p-1.5 text-sm font-semibold transition ' +
                  (genre === 'H'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                    : 'border-gray-500 text-gray-400 hover:text-white hover:border-gray-300')
                }
              >
                Homme
              </button>
              <button
                type="button"
                onClick={() => setGenre('F')}
                className={
                  'flex-1 rounded border p-1.5 text-sm font-semibold transition ' +
                  (genre === 'F'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                    : 'border-gray-500 text-gray-400 hover:text-white hover:border-gray-300')
                }
              >
                Femme
              </button>
            </div>
          </div>

          {/* Colonne 2 : Taille */}
          <div className="w-full">
            {arche.corps ? (
              <Curseur
                label="Taille"
                unite="cm"
                valeur={corps.taille}
                min={arche.corps.taille.min}
                max={arche.corps.taille.max}
                onChange={(v) => setCorps((c) => ({ ...c, taille: v }))}
              />
            ) : null}
          </div>

          {/* Colonne 3 : Poids */}
          <div className="w-full">
            {arche.corps ? (
              <Curseur
                label="Poids"
                unite="kg"
                valeur={corps.poids}
                min={arche.corps.poids.min}
                max={arche.corps.poids.max}
                onChange={(v) => setCorps((c) => ({ ...c, poids: v }))}
              />
            ) : null}
          </div>

          {/* Colonne 4 : Type de course */}
          <div className="w-full">
            {typeCourse ? (
              <div className="flex flex-col items-center justify-center gap-0.5 rounded border border-green-500/50 bg-green-500/10 px-2 py-1.5 w-full">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide leading-tight">
                  Type de course
                </span>
                <span className="text-sm font-bold text-green-400 leading-tight">
                  {typeCourse.nom}
                </span>
              </div>
            ) : null}
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