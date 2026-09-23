import { useEffect, useState } from 'react'
import { INSTALLATIONS } from '../lib/installations.js'

export default function ClubFacilitiesPanel({ selection, onChange }) {
  const [ouvert, setOuvert] = useState(false)

  useEffect(() => {
    if (!ouvert) return undefined
    const fermerAvecEchap = (event) => {
      if (event.key === 'Escape') setOuvert(false)
    }
    window.addEventListener('keydown', fermerAvecEchap)
    return () => window.removeEventListener('keydown', fermerAvecEchap)
  }, [ouvert])

  function basculer(id) {
    onChange(
      selection.includes(id)
        ? selection.filter((selectionId) => selectionId !== id)
        : [...selection, id]
    )
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
              <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer">×</button>
            </header>
            <div className="club-facilities-liste">
              {INSTALLATIONS.map((installation) => (
                <label key={installation.id} className="club-facility">
                  <input
                    type="checkbox"
                    checked={selection.includes(installation.id)}
                    onChange={() => basculer(installation.id)}
                  />
                  <span>{installation.nom}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}