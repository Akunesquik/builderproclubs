export default function ClassementsAttributs({
  classements,
  arche,
}) {
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
          {item.actuel} → {item.cible}
        </div>
      </div>

      <div className="classement-cout">
        {item.cout} AP
      </div>
    </div>
  )

  return (
    <section className="classements">
      <div className="classements-header">
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
          className="classements-toggle"
        >
          Sans bonus / malus
        </button>
      </div>

      <div className="classements-grid">
        {colonnes.map((colonne) => {
          const liste =
            classements?.brut?.[colonne.id] ?? []

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