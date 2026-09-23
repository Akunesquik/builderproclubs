import { useEffect, useState } from 'react'
import DATA from '../data/fc27.json'

export default function ClubFacilitiesPanel({ selections, onChange }) {
  const [ouvert, setOuvert] = useState(false)

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
  const totalCost = Object.entries(selections || {}).reduce((total, [installationId, selectedNiveau]) => {
    const installation = installationsClub.find(inst => inst.id === installationId)
    if (installation && selectedNiveau >= 1 && selectedNiveau <= 3) {
      const niveauData = installation.niveaux[selectedNiveau]
      if (niveauData) {
        const cost = niveauData.cost ?? 0
        return total + cost
      }
    }
    return total
  }, 0)

  function toggleNiveau(installationId, niveau) {
    onChange(prevSelections => {
      const newSelections = { ...(prevSelections || {}) }
      const currentNiveau = newSelections[installationId] || 0

      // If clicking on a selected niveau, deselect it (set to 0)
      // If clicking on a different niveau, select that niveau
      // If clicking on the same niveau when it's 0, select it
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
      <button className="club-facilities" type="button" onClick={() => setOuvert(true)}>
        <img
          className="club-facilities-image"
          src={`${import.meta.env.BASE_URL}img/installations-club/image-removebg-preview%20%283%29.png`}
          alt=""
        />
        <span className="club-facilities-label">Sélectionner les installations du club</span>
      </button>

      {ouvert ? (
        <div className="club-facilities-overlay" onClick={() => setOuvert(false)} role="presentation">
          <div
            className="club-facilities-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Sélectionner les installations du club"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="club-facilities-entete">
              <h2>Installations du club</h2>
              <div className="total-cost">
                Coût total: <strong>{totalCost.toLocaleString()} </strong>
              </div>
              <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer">×</button>
            </header>
            <div className="club-facilities-liste">
              {/* Table header */}
              <div className="table-header">
                <div className="table-cell-header">Installation</div>
                <div className="table-cell-header">Niveau 1</div>
                <div className="table-cell-header">Niveau 2</div>
                <div className="table-cell-header">Niveau 3</div>
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

                      // Split bonus by \n to display each attribute on a separate line
                      const bonusLines = bonusText.split(/\r?\n/)

                      return (
                        <div
                          key={niveau}
                          className={`table-cell niveau-bonus ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleNiveau(installation.id, niveau)}
                          title={`Niveau ${niveau}: ${costText} coûts`}
                        >
                          {bonusLines.map((line, index) => {
                            const match = line.match(/^(.+)\s+(\+\d+)$/);
                            let attr = line;
                            let value = '';
                            if (match) {
                              attr = match[1];
                              value = match[2];
                            }
                            return (
                              <div key={index} className="bonus-line">
                                {attr} : <span className="bonus-value">{value}</span>
                              </div>
                            );
                          })}
                          {isSelected && (
                            <div className="cost-indicator">+{costText}</div>
                          )}
                        </div>
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