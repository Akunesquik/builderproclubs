import { useState } from 'react'

export default function ClassementsAttributs({
  classements,
  arche,
}) {
  const [avecBonusMalus, setAvecBonusMalus] =
    useState(false)

  if (!classements) {
    return null
  }

  const donnees = avecBonusMalus
    ? classements.effectif
    : classements.brut

  const colonnes = [
    {
      key: 'minMax',
      titre: 'ACTUEL → MAX',
    },
    {
      key: 'min80',
      titre: 'ACTUEL → 80',
    },
    {
      key: 'min85',
      titre: 'ACTUEL → 85',
    },
    {
      key: 'min90',
      titre: 'ACTUEL → 90',
    },
  ]

  return (
    <section className="classements-attributs">
      <div className="classements-header">
        <div>
          <h2>
            Classement des coûts d'attributs
          </h2>

          {arche?.nom && (
            <p className="classements-archetype">
              {arche.nom}
            </p>
          )}
        </div>

        <button
          type="button"
          className={
            avecBonusMalus
              ? 'classements-toggle active'
              : 'classements-toggle'
          }
          onClick={() =>
            setAvecBonusMalus(
              (value) => !value
            )
          }
        >
          {avecBonusMalus
            ? 'Avec bonus / malus'
            : 'Sans bonus / malus'}
        </button>
      </div>

      {avecBonusMalus && (
        <div className="classements-warning">
          ⚠ Rappel : les bonus/malus ne permettent pas
          de débloquer un PlayStyle.
        </div>
      )}

      <div className="classements-grid">
        {colonnes.map((colonne) => {
          const classement =
            (
              donnees?.[colonne.key] || []
            ).filter(
              (attr) =>
                attr.nom !==
                  'Gestes techniques' &&
                attr.nom !==
                  'Mauvais pied'
            )

          return (
            <div
              key={colonne.key}
              className="classement-colonne"
            >
              <h3>{colonne.titre}</h3>

              {classement.length === 0 ? (
                <div className="classement-vide">
                  Aucun attribut
                </div>
              ) : (
                <div className="classement-liste">
                  {classement.map(
                    (attr, index) => (
                      <div
                        key={attr.id}
                        className="classement-ligne"
                      >
                        <div className="classement-rang">
                          {index + 1}
                        </div>

                        <div className="classement-info">
                          <div className="classement-nom">
                            {attr.nom}
                          </div>

                          <div className="classement-details">
                            {attr.actuel}
                            {' → '}
                            {avecBonusMalus &&
                            attr.niveauNecessaire !=
                              null
                              ? attr.cible
                              : attr.cible}

                            {avecBonusMalus &&
                              attr.ajustement !==
                                0 && (
                                <span
                                  className={
                                    attr.ajustement >
                                    0
                                      ? 'bonus'
                                      : 'malus'
                                  }
                                >
                                  {' '}
                                  (
                                  {attr.ajustement >
                                  0
                                    ? '+'
                                    : ''}
                                  {
                                    attr.ajustement
                                  }
                                  )
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="classement-cout">
                          {attr.cout === 0
                            ? 'Déjà atteint'
                            : `${attr.cout} AP`}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}