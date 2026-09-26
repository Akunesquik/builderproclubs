import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/context.jsx'
import DATA from '../../data/fc27.json'

export default function MaitrisesPanel({
  selections,
  onChange
}) {
  const { t, langue } = useLanguage()

  const [ouvert, setOuvert] = useState(false)

  useEffect(() => {
    if (!ouvert) return undefined

    const fermerAvecEchap = (event) => {
      if (event.key === 'Escape') {
        setOuvert(false)
      }
    }

    window.addEventListener(
      'keydown',
      fermerAvecEchap
    )

    return () => {
      window.removeEventListener(
        'keydown',
        fermerAvecEchap
      )
    }
  }, [ouvert])

  const groupeOrder = {
    DEF: 0,
    MID: 1,
    ATT: 2,
  }

  const archetypes = [
    ...DATA.archetypes
  ].sort((a, b) => {
    const groupDiff =
      (groupeOrder[a.groupe] ?? 999) -
      (groupeOrder[b.groupe] ?? 999)

    if (groupDiff !== 0) return groupDiff

    return a.nom.localeCompare(b.nom)
  })

  const niveauxToShow = [10, 30]

  function toggleNiveau(
    archetypeId,
    niveau
  ) {
    onChange((prev) => {
      const nouveau = {
        ...(prev || {})
      }

      const niveauxActuels =
        nouveau[archetypeId] || []

      if (
        niveauxActuels.includes(niveau)
      ) {
        // Retire le niveau
        const nouveauxNiveaux =
          niveauxActuels.filter(
            (n) => n !== niveau
          )

        if (
          nouveauxNiveaux.length === 0
        ) {
          delete nouveau[archetypeId]
        } else {
          nouveau[archetypeId] =
            nouveauxNiveaux
        }
      } else {
        // Ajoute le niveau
        nouveau[archetypeId] = [
          ...niveauxActuels,
          niveau,
        ].sort((a, b) => a - b)
      }

      return nouveau
    })
  }

  function togglePalier(niveau) {
    onChange((prev) => {
      const nouveau = {
        ...(prev || {})
      }

      const tousSelectionnes =
        archetypes.every(
          (archetype) =>
            (
              nouveau[
                archetype.id
              ] || []
            ).includes(niveau)
        )

      archetypes.forEach(
        (archetype) => {
          const niveauxActuels =
            nouveau[
              archetype.id
            ] || []

          if (tousSelectionnes) {
            const nouveauxNiveaux =
              niveauxActuels.filter(
                (n) => n !== niveau
              )

            if (
              nouveauxNiveaux.length === 0
            ) {
              delete nouveau[
                archetype.id
              ]
            } else {
              nouveau[
                archetype.id
              ] = nouveauxNiveaux
            }
          } else if (
            !niveauxActuels.includes(
              niveau
            )
          ) {
            nouveau[
              archetype.id
            ] = [
              ...niveauxActuels,
              niveau,
            ].sort(
              (a, b) => a - b
            )
          }
        }
      )

      return nouveau
    })
  }

  const traduireAttribut = (
    attribut
  ) => {
    if (langue === 'en') {
      return (
        t.attributes?.names?.[
          attribut
        ] ??
        t.stats?.[attribut] ??
        attribut
      )
    }

    return attribut
  }

  const traduireArchetype = (
    archetype
  ) => {
    if (langue === 'en') {
      return (
        archetype.nomEn ??
        archetype.nom
      )
    }

    return archetype.nom
  }

  return (
    <>
      {/* Bouton Maîtrises */}
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="club-facilities"
      >
        <img
          className="club-facilities-image"
          src={`${import.meta.env.BASE_URL}img/installations-club/Maitrise.png`}
          alt=""
        />

        <span className="club-facilities-label">
          {t.masteries?.title ??
            'Maîtrises'}
        </span>
      </button>

      {/* Modal */}
      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"
          onClick={() => setOuvert(false)}
          role="presentation"
        >
          <div
            className="relative w-[800px] max-w-full p-4.5 border border-filet-fort rounded modale"
            role="dialog"
            aria-modal="true"
            aria-label={
              t.masteries?.title ??
              'Maîtrises'
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Header */}
            <header className="flex flex-col gap-4 pb-3 border-b border-filet">
              <div className="flex items-center justify-between gap-4 w-full">
                <h2 className="text-xl font-semibold">
                  {t.masteries?.title ??
                    'Maîtrises'}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setOuvert(false)
                  }
                  aria-label={
                    t.masteries?.close ??
                    'Fermer'
                  }
                  className="text-3xl"
                >
                  ×
                </button>
              </div>

              <p className="text-sm">
                {t.masteries
                  ?.instructions ??
                  "Vous pouvez cliquer sur Niveau 'nombre' pour valider toutes les maitrises de ce palier"}
              </p>
            </header>

            {/* Tableau */}
            <div className="club-facilities-liste">

              {/* Header */}
              <div className="table-header">
                <div className="table-cell-header">
                  {t.masteries
                    ?.archetype ??
                    'Archétype'}
                </div>

                {niveauxToShow.map(
                  (niveau) => {
                    const tousSelectionnes =
                      archetypes.every(
                        (archetype) =>
                          (
                            selections?.[
                              archetype.id
                            ] || []
                          ).includes(
                            niveau
                          )
                      )

                    return (
                      <div
                        key={niveau}
                        className="table-cell-header p-1 flex justify-start"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            togglePalier(
                              niveau
                            )
                          }
                          className={`w-full h-full rounded border transition-all p-4 ${
                            tousSelectionnes
                              ? 'border-green-400 bg-green-400/10'
                              : 'border-transparent hover:border-filet-fort'
                          }`}
                        >
                          {t.masteries
                            ?.level ??
                            'Niveau'}{' '}
                          {niveau}
                        </button>
                      </div>
                    )
                  }
                )}
              </div>

              {/* Archétypes */}
              {archetypes.map(
                (archetype) => (
                  <div
                    key={archetype.id}
                    className="table-row"
                  >
                    {/* Nom de l'archétype */}
                    <div className="flex gap-2 items-center installation-name">
                      <img
                        src={`${import.meta.env.BASE_URL}img/archetypes/${archetype.id.toLowerCase()}.svg`}
                        alt={traduireArchetype(
                          archetype
                        )}
                        className="w-16 h-16"
                      />

                      {traduireArchetype(
                        archetype
                      )}
                    </div>

                    {/* Niveaux */}
                    {niveauxToShow.map(
                      (niveau) => {
                        const niveauxSelectionnes =
                          selections?.[
                            archetype.id
                          ] || []

                        const isSelected =
                          niveauxSelectionnes.includes(
                            niveau
                          )

                        const maitrise =
                          DATA.maitrise?.[
                            archetype.id
                          ] || {}

                        const bonus =
                          maitrise[
                            String(niveau)
                          ] || []

                        return (
                          <div
                            key={niveau}
                            className="niveau-bonus flex"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggleNiveau(
                                  archetype.id,
                                  niveau
                                )
                              }
                              className={`
                                w-full h-full
                                text-left
                                rounded
                                border
                                transition-all
                                p-2
                                ${
                                  isSelected
                                    ? 'border-green-400 bg-green-400/10'
                                    : 'border-transparent hover:border-filet-fort'
                                }
                              `}
                            >
                              {bonus.length >
                              0 ? (
                                bonus.map(
                                  ({
                                    attribut,
                                    gain
                                  }) => {
                                    const attr =
                                      DATA.attributs.find(
                                        (a) =>
                                          a.id ===
                                          attribut
                                      )

                                    return (
                                      <div
                                        key={
                                          attribut
                                        }
                                      >
                                        {attr
                                          ? traduireAttribut(
                                              attr.id
                                            )
                                          : traduireAttribut(
                                              attribut
                                            )}{' '}
                                        +{gain}
                                      </div>
                                    )
                                  }
                                )
                              ) : (
                                '-'
                              )}
                            </button>
                          </div>
                        )
                      }
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}