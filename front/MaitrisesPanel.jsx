import { useEffect, useState } from 'react'
import DATA from '../data/fc27.json'

export default function MaitrisesPanel({ selections, onChange }) {
  const [ouvert, setOuvert] = useState(false)

  useEffect(() => {
    if (!ouvert) return undefined

    const fermerAvecEchap = (event) => {
      if (event.key === 'Escape') {
        setOuvert(false)
      }
    }

    window.addEventListener('keydown', fermerAvecEchap)

    return () => {
      window.removeEventListener('keydown', fermerAvecEchap)
    }
  }, [ouvert])

  const groupeOrder = {
    DEF: 0,
    MID: 1,
    ATT: 2,
  }

  const archetypes = [...DATA.archetypes].sort((a, b) => {
    const groupDiff =
      (groupeOrder[a.groupe] ?? 999) -
      (groupeOrder[b.groupe] ?? 999)

    if (groupDiff !== 0) return groupDiff

    return a.nom.localeCompare(b.nom)
  })

  const niveauxToShow = [10, 30]

  function toggleNiveau(archetypeId, niveau) {

    const currentNiveau =
      selections?.[archetypeId] || 0

    // Si on clique sur le niveau déjà sélectionné,
    // on le désélectionne
    if (currentNiveau === niveau) {
      onChange((prev) => {
        const nouveau = { ...(prev || {}) }
        delete nouveau[archetypeId]
        return nouveau
      })

      return
    }

    // Sinon on sélectionne le nouveau niveau
    onChange((prev) => ({
      ...(prev || {}),
      [archetypeId]: niveau,
    }))
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
          Maîtrises
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
            aria-label="Maîtrises"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-4 pb-3 border-b border-filet">
              <h2 className="text-xl font-semibold">
                Maîtrises
              </h2>

              <button
                type="button"
                onClick={() => setOuvert(false)}
                aria-label="Fermer"
                className="text-3xl"
              >
                ×
              </button>
            </header>

            {/* Tableau */}
            <div className="club-facilities-liste">

              {/* Header */}
              <div className="table-header">
                <div className="table-cell-header">
                  Archétype
                </div>

                {niveauxToShow.map((niveau) => (
                  <div
                    key={niveau}
                    className="table-cell-header"
                  >
                    Niveau {niveau}
                  </div>
                ))}
              </div>

              {/* Archétypes */}
              {archetypes.map((archetype) => (
                <div
                  key={archetype.id}
                  className="table-row"
                >
                  {/* Nom de l'archétype */}
                  <div className="flex gap-2 items-center installation-name">
                    <img
                      src={`${import.meta.env.BASE_URL}img/archetypes/${archetype.id.toLowerCase()}.svg`}
                      alt={archetype.nom}
                      className="w-16 h-16"
                    />

                    {archetype.nom}
                  </div>

                  {/* Niveaux */}
                  {niveauxToShow.map((niveau) => {
                    const selectedNiveau =
                      selections?.[archetype.id] || 0

                    const isSelected =
                      selectedNiveau === niveau

                    const maitrise =
                      DATA.maitrise?.[archetype.id] || {}

                    const bonus =
                      maitrise[String(niveau)] || []

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
                          {bonus.length > 0 ? (
                            bonus.map(({ attribut, gain }) => {
                              const attr =
                                DATA.attributs.find(
                                  (a) => a.id === attribut
                                )

                              return (
                                <div key={attribut}>
                                  {attr
                                    ? attr.nom
                                    : attribut}{' '}
                                  +{gain}
                                </div>
                              )
                            })
                          ) : (
                            '-'
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}

            </div>
          </div>
        </div>
      )}
    </>
  )
}