import { useState } from 'react'

export default function ClassementsAttributs({
  classements,
  arche,
}) {
  const [avecBonus, setAvecBonus] = useState(false)

  const colonnes = [
    {
      id: 'minMax',
      titre: 'ACTUEL → MAX',
    },
    {
      id: 'min80',
      titre: 'ACTUEL → 80',
    },
    {
      id: 'min85',
      titre: 'ACTUEL → 85',
    },
    {
      id: 'min90',
      titre: 'ACTUEL → 90',
    },
  ]

  const cle = avecBonus ? 'effectif' : 'brut'

  const explication = avecBonus
    ? "Coût en AP pour chaque attribut, en tenant compte de tes bonus/malus actuels (taille, poids, maîtrises, installations du club)."
    : "Coût en AP pour amener chaque attribut de sa valeur actuelle jusqu'à la cible, sans tenir compte des bonus/malus (taille, poids, maîtrises, installations). Les moins chers en premier : c'est l'ordre le plus rentable pour dépenser tes AP."

  const afficherLigne = (item, index) => (
    <div
      key={item.id}
      className="classement-ligne"
    >
      <div className="classement-rang">
        {index + 1}
      </div>

      <div className="classement-info">
        <div className="classement-nom">
          {item.nom}
        </div>

        <div className="classement-details">
          {avecBonus &&
          item.actuelEffectif !== undefined
            ? `${item.actuelEffectif} → ${item.cible}`
            : `${item.actuel} → ${item.cible}`}
        </div>
      </div>

      <div
        className="classement-cout"
        style={{
          color: '#f59e0b',
          fontWeight: 700,
        }}
      >
        {item.cout} AP
      </div>
    </div>
  )

  return (
    <section className="classements">
      <div className="classements-header">
        <div className="classements-header-top">
          <div>
            <h2>
              Classement des coûts d'attributs
            </h2>

            <p className="classements-archetype">
              {arche.nom}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAvecBonus((v) => !v)}
            className={`classements-toggle ${avecBonus ? 'active' : ''}`}
            aria-pressed={avecBonus}
          >
            <span className="classements-toggle-track">
              <span className="classements-toggle-thumb" />
            </span>

            <span className="classements-toggle-label">
              {avecBonus ? 'Avec bonus / malus' : 'Sans bonus / malus'}
            </span>
          </button>
        </div>

        <p
          className="classements-explication"
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {explication}

          {avecBonus && (
            <>
              {' '}
              <span
                style={{
                  color: '#f59e0b',
                  fontWeight: 700,
                }}
              >
                ⚠️ Rappel : les bonus/malus ne sont pas
                pris en compte pour le déblocage des
                PlayStyles.
              </span>
            </>
          )}
        </p>
      </div>

      <div className="classements-grid">
        {colonnes.map((colonne) => {
          const liste =
            classements?.[cle]?.[colonne.id] ??
            []

          return (
            <div
              key={colonne.id}
              className="classement-colonne"
            >
              <h3>
                {colonne.titre}
              </h3>

              <div className="classement-liste">
                {liste.map(afficherLigne)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}