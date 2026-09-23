import { useEffect, useState } from 'react'
import DATA from '../data/fc27.json'

export default function MaitrisesPanel({ selections, onChange }) {
  const [ouvert, setOuvert] = useState(false)

  useEffect(() => {
    if (!ouvert) return undefined
    const fermerAvecEchap = (event) => {
      if (event.key === 'Escape') setOuvert(false)
    }
    window.addEventListener('keydown', fermerAvecEchap)
    return () => window.removeEventListener('keydown', fermerAvecEchap)
  }, [ouvert])

  // Use the pre-processed data from fc27.json, sorted by group and then by name
  // Group order: DEF (défense), MID (milieu), ATT (attaque)
  const groupeOrder = { DEF: 0, MID: 1, ATT: 2 };
  const archetypes = [...DATA.archetypes].sort((a, b) => {
    const groupDiff = (groupeOrder[a.groupe] || 999) - (groupeOrder[b.groupe] || 999);
    if (groupDiff !== 0) return groupDiff;
    return a.nom.localeCompare(b.nom);
  })

  // Define the levels we want to show (based on user example: 10, 30)
  const niveauxToShow = [10, 30]

  // Calculate total cost of selected archetypes (though archetypes don't have costs in the data)
  // We'll use a placeholder cost calculation for now
  const totalCost = 0

  function toggleNiveau(archetypeId, niveau) {
    onChange(prevSelections => {
      const newSelections = { ...(prevSelections || {}) }
      const currentNiveau = newSelections[archetypeId] || 0

      // If clicking on a selected niveau, deselect it (set to 0)
      // If clicking on a different niveau, select that niveau
      if (currentNiveau === niveau) {
        newSelections[archetypeId] = 0
        // Remove entry if 0 to keep object clean
        if (newSelections[archetypeId] === 0) {
          delete newSelections[archetypeId]
        }
      } else {
        newSelections[archetypeId] = niveau
      }

      return newSelections
    })
  }

  // Calculate the stat value for a given archetype, stat, and level
  function getStatValue(archetype, statName, niveau) {
    const stat = archetype.stats[statName]
    if (!stat) return 0

    // Find the level data
    const niveauData = DATA.niveaux.find(n => n.niveau === niveau)
    if (!niveauData) return stat.base

    // Calculate the stat progression based on level
    // This is a simplified calculation - in reality, this would be more complex
    const cumul = niveauData.cumul
    const base = stat.base
    const min = stat.min
    const max = stat.max

    // Simple linear interpolation between min and max based on cumul
    // Max cumul is 962 (from niveau 40)
    const maxCumul = 962
    const progress = Math.min(cumul / maxCumul, 1) // Cap at 1.0
    const value = Math.round(min + (max - min) * progress)

    return value
  }

  return (
    <>
      <button type="button" onClick={() => setOuvert(true)} className="club-facilities">
        <img
          className="club-facilities-image"
          src={`${import.meta.env.BASE_URL}img/installations-club/Maitrise.png`}
          alt=""
        />
        <span className="club-facilities-label">Maîtrises</span>
      </button>

      {ouvert ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90" onClick={() => setOuvert(false)} role="presentation">
          <div
            className="relative w-[800px] max-w-full p-4.5 border border-filet-fort rounded modale"
            role="dialog"
            aria-modal="true"
            aria-label="Maîtrises"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-4 pb-3 border-b border-filet">
              <h2 className="text-xl font-semibold">Maîtrises</h2>
              <div className="total-cost flex items-center gap-2">
                Coût total: <strong className="whitespace-nolength">{totalCost.toLocaleString()} </strong>
              </div>
              <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer" className="text-3xl">×</button>
            </header>
            <div className="club-facilities-liste">
              {/* Table header */}
              <div className="table-header">
                <div className="table-cell-header">Archétype</div>
                {niveauxToShow.map(niveau => (
                  <div key={niveau} className="table-cell-header">
                    Niveau {niveau}
                  </div>
                ))}
              </div>

              {/* Table rows */}
              {archetypes.length > 0 ? (
                archetypes.map((archetype) => (
                  <div key={archetype.id} className="table-row">
                    <div className="table-cell installation-name">{archetype.nom}</div>
                    {niveauxToShow.map((niveau) => {
                      const selectedNiveau = (selections || {})[archetype.id] || 0
                      const isSelected = selectedNiveau === niveau

                      // For demonstration, we'll show a couple of key stats
                      // In a real implementation, you might want to show more details or a combination
                      const placementsGardien = getStatValue(archetype, 'vista', niveau)
                      const taclesDebout = getStatValue(archetype, 'tacle_debout', niveau)

                      // Format the bonus text similar to the example
                      // For Facilitateur at niveau 10: "Placement Gardien +1; Tacles debout +1"
                      // We'll calculate the actual values based on base stats

                      const basePG = getStatValue(archetype, 'vista', 1)
                      const baseTD = getStatValue(archetype, 'tacle_debout', 1)

                      const bonusPG = placementsGardien - basePG
                      const bonusTD = taclesDebout - baseTD

                      let bonusText = ''
                      if (bonusPG > 0) {
                        bonusText += `Placement Gardien +${bonusPG}`
                      }
                      if (bonusTD > 0) {
                        if (bonusText) bonusText += '; '
                        bonusText += `Tacles debout +${bonusTD}`
                      }
                      if (!bonusText) {
                        bonusText = '-'
                      }

                      return (
                        <div
                          key={niveau}
                          className={`table-cell niveau-bonus ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleNiveau(archetype.id, niveau)}
                          title={`Niveau ${niveau}`}
                        >
                          <div className="bonus-text">
                            {bonusText}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))
              ) : (
                <div className="table-row">
                  <div className="table-cell installation-name" colSpan={3}>
                    Aucune donnée de maîtrise disponible
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