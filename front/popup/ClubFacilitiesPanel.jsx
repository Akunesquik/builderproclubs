import { useEffect, useState } from 'react'
import DATA from '../../data/fc27.json'

// Create a map from playstyle English names to French names for image lookup
const PLAYSTYLE_MAP = Object.fromEntries(
  DATA.playStyles.map(ps => [ps.nom, ps.nomFr])
)

export default function ClubFacilitiesPanel({ selections, onChange }) {
  const [ouvert, setOuvert] = useState(false)

  const NOM_ATTRIBUT = Object.fromEntries(
    DATA.attributs.map((a) => [a.id, a.nom])
  )

  useEffect(() => {
    if (!ouvert) return undefined
    const fermerAvecEchap = (event) => {
      if (event.key === 'Escape') setOuvert(false)
    }
    window.addEventListener('keydown', fermerAvecEchap)
    return () => window.removeEventListener('keydown', fermerAvecEchap)
  }, [ouvert])

  // Use the pre-processed data from fc27.json, sorted by name
  const installationsClub = [...DATA.installationsClub].sort((a, b) =>
    a.nom.localeCompare(b.nom)
  )

  // Calculate total cost of selected installations
  const totalCost = Object.entries(selections || {}).reduce(
    (total, [installationId, selectedNiveau]) => {
      const installation = installationsClub.find(
        (inst) => inst.id === installationId
      )

      if (installation && selectedNiveau >= 1 && selectedNiveau <= 3) {
        const niveauData = installation.niveaux[selectedNiveau - 1]

        if (niveauData) {
          const cost = niveauData.cost ?? 0
          return total + cost
        }
      }

      return total
    },0)

  function toggleNiveau(installationId, niveau) {
   onChange((prev) => {

      const newSelections = { ...(prev || {}) }
      const currentNiveau = newSelections[installationId] || 0

      if (currentNiveau === niveau) {
        newSelections[installationId] = 0
        // Remove entry if 0 to keep object clean
        if (newSelections[installationId] === 0) {
          delete newSelections[installationId]
        }
      } else {
        newSelections[installationId] = niveau
      }

      return newSelections
    })
  }

  return (
    <>
      <button type="button" onClick={() => setOuvert(true)} className="club-facilities">
        <img
          className="club-facilities-image"
          src={`${import.meta.env.BASE_URL}img/installations-club/InstallClub.png`}
          alt=""
        />
        <span className="club-facilities-label">Installations du club</span>
      </button>

      {ouvert ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75" onClick={() => setOuvert(false)} role="presentation">
          <div
            className="relative w-[1100px] max-w-[95vw] p-4.5  border border-filet-fort rounded modale"
            role="dialog"
            aria-modal="true"
            aria-label="Installations du club"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-4 pb-3 border-b border-filet">
              <h2 className="text-xl font-semibold">Installations du club</h2>
              <div className="total-cost flex items-center gap-2">
                Coût total: <strong className="whitespace-nolength">{totalCost.toLocaleString()} </strong>
              </div>
              <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer" className="text-3xl">×</button>
            </header>
            <div className="club-facilities-liste">
              {/* Table header */}
              <div className="table-header">
                <div className="table-cell-header">Installation</div>
                <div className="table-cell-header text-center" style={{ textAlign: 'center' }}>Niveau 1</div>
                <div className="table-cell-header text-center" style={{ textAlign: 'center' }}>Niveau 2</div>
                <div className="table-cell-header text-center" style={{ textAlign: 'center' }}>Niveau 3</div>
              </div>

              {/* Table rows */}
              {installationsClub.length > 0 ? (
                installationsClub.map((installation) => (
                  <div key={installation.id} className="table-row">
                    <div className="table-cell installation-name">{installation.nom}</div>
                    {[
                      { niveau: 1, label: 'Niveau 1' },
                      { niveau: 2, label: 'Niveau 2' },
                      { niveau: 3, label: 'Niveau 3' }
                    ].map(({ niveau }) => {
                      const selectedNiveau = (selections || {})[installation.id] || 0
                      const isSelected = selectedNiveau === niveau
                      const niveauData = installation.niveaux[niveau - 1]
                      const bonusText = niveauData ? niveauData.bonus : '-'
                      const costText = niveauData ? (niveauData.cost ?? 0).toLocaleString() : '0'
                      const styleJeu = niveauData?.styleJeu

                      const bonusLines = bonusText.split('//')

                      return (
                        <button
                          key={niveau}
                          className={`table-cell niveau-bonus border rounded transition-all overflow-hidden ${
                            isSelected
                              ? 'border-green-400 bg-green-400/10'
                              : 'border-transparent hover:border-filet-fort'
                          }`}
                          onClick={() => toggleNiveau(installation.id, niveau)}
                          title={`Niveau ${niveau}: ${costText} coûts${styleJeu ? ` — ${styleJeu}` : ''}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            {/* Stats à gauche, une par ligne */}
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              {bonusLines.map((line, index) => {
                                const match = line.trim().match(/^(.+?)\s+\+(\d+)$/)

                                let attr = line.trim()
                                let value = ''

                                if (match) {
                                  attr = NOM_ATTRIBUT[match[1]] ?? match[1]
                                  value = match[2]
                                }

                                return (
                                  <div key={index} className="text-xs truncate">
                                    {attr} : <span className="font-bold text-green-400">+{value}</span>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Séparateur + logo du playstyle, à droite, centré verticalement */}
                            {styleJeu ? (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-sm font-bold text-filet-fort">+</span>
                                {(() => {
                                  const frenchName = PLAYSTYLE_MAP[styleJeu]
                                  if (!frenchName) return null
                                  const silverPath = `${import.meta.env.BASE_URL}img/playstyles/silver/${frenchName}.png`
                                  const goldPath = `${import.meta.env.BASE_URL}img/playstyles/gold/${frenchName}.png`
                                  return (
                                    <img
                                      src={silverPath}
                                      alt={styleJeu}
                                      className="h-8 w-8"
                                      onError={(e) => {
                                        if (e.target.src.includes('/silver/')) {
                                          e.target.src = goldPath
                                        } else {
                                          e.target.style.display = 'none'
                                        }
                                      }}
                                    />
                                  )
                                })()}
                              </div>
                            ) : null}
                          </div>

                          <div className="cost-indicator text-center mt-2">
                            Coût : {costText}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))
              ) : (
                <div className="table-row">
                  <div className="table-cell installation-name" colSpan="4">
                    Aucune donnée d'installation disponible
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}