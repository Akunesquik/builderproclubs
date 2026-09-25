import { useState } from 'react'

export default function ClassementsAttributs({
  classements,
  arche,
}) {
  /*
   * ============================================================
   * MODE DE CALCUL
   *
   * false = sans bonus / malus
   * true  = avec bonus / malus
   * ============================================================
   */

  const [avecBonusMalus, setAvecBonusMalus] =
    useState(false)

  /*
   * ============================================================
   * COLONNES DU CLASSEMENT
   * ============================================================
   */

  const colonnes = [
    {
      key: 'minMax',
      titre: 'MIN → MAX',
      description:
        'Coût pour atteindre le maximum',
    },
    {
      key: 'min80',
      titre: 'MIN → 80',
      description:
        'Coût pour atteindre 80',
    },
    {
      key: 'min85',
      titre: 'MIN → 85',
      description:
        'Coût pour atteindre 85',
    },
    {
      key: 'min90',
      titre: 'MIN → 90',
      description:
        'Coût pour atteindre 90',
    },
  ]

  /*
   * ============================================================
   * DONNÉES À AFFICHER
   *
   * brut :
   *   coûts sans aucun bonus/malus
   *
   * effectif :
   *   coûts avec bonus/malus
   * ============================================================
   */

  const donnees = avecBonusMalus
    ? classements?.effectif
    : classements?.brut

  /*
   * ============================================================
   * FORMATAGE DU BONUS / MALUS
   * ============================================================
   */

  const afficherAjustement = (ajustement) => {
    if (!ajustement) {
      return null
    }

    return (
      <span
        className={
          ajustement > 0
            ? 'text-green-400'
            : 'text-red-400'
        }
      >
        {ajustement > 0
          ? `+${ajustement}`
          : ajustement}
      </span>
    )
  }

  return (
    <section className="w-full mt-16 mb-10">

      {/* ========================================================
          TITRE + BOUTON
          ======================================================== */}

      <div
        className="
          border-b
          border-[#2c3b48]
          pb-3
          mb-5
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          "
        >

          {/* ----------------------------------------------------
              TITRE
              ---------------------------------------------------- */}

          <div>
            <h2
              className="
                text-xl
                font-semibold
                tracking-tight
              "
            >
              Classement des coûts
            </h2>

            <p
              className="
                text-xs
                text-[#8fa2b0]
                mt-1
              "
            >
              Attributs les moins chers à améliorer
              pour {arche?.nom || 'cet archétype'}
            </p>
          </div>

          {/* ----------------------------------------------------
              BOUTON DE BASCULE
              ---------------------------------------------------- */}

          <div
            className="
              flex
              items-center
              rounded
              border
              border-[#344554]
              bg-[#141c23]
              p-1
            "
          >

            <button
              type="button"
              onClick={() =>
                setAvecBonusMalus(false)
              }
              className={`
                px-3
                py-1.5
                text-xs
                font-semibold
                rounded-sm
                transition-all
                ${
                  !avecBonusMalus
                    ? 'bg-[#2c3b48] text-white shadow-sm'
                    : 'text-[#718492] hover:text-[#cbd5dc]'
                }
              `}
            >
              Sans bonus / malus
            </button>

            <button
              type="button"
              onClick={() =>
                setAvecBonusMalus(true)
              }
              className={`
                px-3
                py-1.5
                text-xs
                font-semibold
                rounded-sm
                transition-all
                ${
                  avecBonusMalus
                    ? 'bg-[#2c3b48] text-white shadow-sm'
                    : 'text-[#718492] hover:text-[#cbd5dc]'
                }
              `}
            >
              Avec bonus / malus
            </button>

          </div>

        </div>

        {/* ======================================================
            DESCRIPTION DU MODE ACTUEL
            ====================================================== */}

        <div
          className="
            mt-3
            text-[11px]
            text-[#667986]
          "
        >

          {avecBonusMalus ? (
            <>
              <span className="text-[#a9b7c1]">
                Avec bonus / malus :
              </span>{' '}
              le classement cherche le minimum
              d'AP nécessaire pour atteindre la
              valeur finale souhaitée.
              <span className="ml-3 text-amber-400">
                ⚠ Rappel : les bonus/malus ne permettent pas de débloquer un PlayStyle.
                </span>
            </>
          ) : (
            <>
              <span className="text-[#a9b7c1]">
                Sans bonus / malus :
              </span>{' '}
              le classement utilise uniquement
              les coûts bruts des attributs.
            </>
          )}

        </div>

      </div>

      {/* ========================================================
          LES 4 CLASSEMENTS
          ======================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >

        {colonnes.map((colonne) => {
          const classement =
            (donnees?.[colonne.key] || []).filter(
                (attr) =>
                attr.cout > 0 &&
                attr.nom !== 'Gestes techniques' &&
                attr.nom !== 'Mauvais pied'
            )
          return (
            <div
              key={colonne.key}
              className="
                min-w-0
                bg-[#18212a]
                border
                border-[#2c3b48]
                rounded-[3px]
                overflow-hidden
              "
            >

              {/* ==================================================
                  HEADER DE LA COLONNE
                  ================================================== */}

              <div
                className="
                  px-4
                  py-3
                  border-b
                  border-[#2c3b48]
                  bg-[#212d38]
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <h3
                    className="
                      text-sm
                      font-semibold
                      tracking-wide
                      text-[#e9eff3]
                    "
                  >
                    {colonne.titre}
                  </h3>

                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-[#5d6f80]
                      uppercase
                    "
                  >
                    AP
                  </span>

                </div>

                <p
                  className="
                    text-[10px]
                    leading-4
                    text-[#5d6f80]
                    mt-1
                  "
                >
                  {colonne.description}
                </p>

              </div>

              {/* ==================================================
                  LISTE DES ATTRIBUTS
                  ================================================== */}

              <div>

                {classement.length === 0 ? (

                  <div
                    className="
                      px-4
                      py-8
                      text-center
                      text-xs
                      text-[#5d6f80]
                    "
                  >
                    Aucun attribut disponible
                  </div>

                ) : (

                  classement.map(
                    (attr, index) => {
                      const rang = index + 1

                      /*
                       * ------------------------------------------------
                       * NIVEAU BRUT NÉCESSAIRE
                       *
                       * Sans bonus :
                       *     cible
                       *
                       * Avec bonus :
                       *     niveauNecessaire
                       * ------------------------------------------------
                       */

                      const niveauNecessaire =
                        avecBonusMalus
                          ? attr.niveauNecessaire
                          : attr.cible

                      return (
                        <div
                          key={attr.id}
                          className="
                            group
                            grid
                            grid-cols-[30px_minmax(0,1fr)_64px]
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            border-b
                            border-[#1d2731]
                            last:border-b-0
                            hover:bg-[#212d38]
                            transition-colors
                          "
                        >

                          {/* =========================================
                              RANG
                              ========================================= */}

                          <div
                            className="
                              text-xs
                              font-semibold
                              text-[#5d6f80]
                              tabular-nums
                            "
                          >
                            {rang}
                          </div>

                          {/* =========================================
                              ATTRIBUT
                              ========================================= */}

                          <div className="min-w-0">

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                min-w-0
                              "
                            >

                              <span
                                className="
                                  min-w-0
                                  truncate
                                  text-[13px]
                                  text-[#e9eff3]
                                  group-hover:text-white
                                "
                              >
                                {attr.nom}
                              </span>

                            </div>

                            {/* -----------------------------------------
                                MIN → NIVEAU NÉCESSAIRE
                                ----------------------------------------- */}

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                mt-0.5
                                text-[10px]
                                text-[#5d6f80]
                              "
                            >

                              <span>
                                {attr.min}
                              </span>

                              <span>
                                →
                              </span>

                              <span>
                                {niveauNecessaire}
                              </span>

                              {/* ---------------------------------------
                                  BONUS / MALUS
                                  --------------------------------------- */}

                              {avecBonusMalus &&
                                attr.ajustement !== 0 && (
                                  <>
                                    <span>
                                      ·
                                    </span>

                                    {afficherAjustement(
                                      attr.ajustement
                                    )}
                                  </>
                                )}

                            </div>

                          </div>

                          {/* =========================================
                              COÛT AP
                              ========================================= */}

                          <div
                            className="
                              text-right
                              whitespace-nowrap
                            "
                          >

                            <span
                              className="
                                text-sm
                                font-bold
                                text-[#f2a33c]
                                tabular-nums
                              "
                            >
                              {attr.cout.toLocaleString(
                                'fr-FR'
                              )}
                            </span>

                            <span
                              className="
                                ml-1
                                text-[10px]
                                text-[#5d6f80]
                              "
                            >
                              AP
                            </span>

                          </div>

                        </div>
                      )
                    }
                  )

                )}

              </div>

            </div>
          )
        })}

      </div>

      {/* ========================================================
          EXPLICATION
          ======================================================== */}

      <div
        className="
          mt-4
          px-1
          text-[11px]
          leading-5
          text-[#5d6f80]
        "
      >

        {avecBonusMalus ? (
          <>
            <span className="text-[#8fa2b0]">
              💡
            </span>{' '}
            Le calcul prend en compte les bonus/malus
            actuels de taille, poids, maîtrises et
            installations. Le coût affiché correspond
            uniquement aux AP réellement dépensés.
          </>
        ) : (
          <>
            <span className="text-[#8fa2b0]">
              💡
            </span>{' '}
            Le calcul ignore volontairement tous les
            bonus/malus et utilise uniquement la courbe
            de coût de chaque attribut.
          </>
        )}

      </div>

    </section>
  )
}