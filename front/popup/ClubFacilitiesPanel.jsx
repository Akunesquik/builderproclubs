import { useEffect, useState } from 'react'
import { useLanguage } from '../../i18n/context.jsx'
import DATA from '../../data/fc27.json'

// Create a map from playstyle English names to French names for image lookup
const PLAYSTYLE_MAP = Object.fromEntries(
  DATA.playStyles.map(ps => [ps.nom, ps.nomFr])
)

export default function ClubFacilitiesPanel({
  selections,
  onChange
}) {
  const { t, langue } = useLanguage()

  const [ouvert, setOuvert] = useState(false)

  const NOM_ATTRIBUT = Object.fromEntries(
    DATA.attributs.map((a) => [
      a.id,
      langue === 'en'
        ? (
            t.attributes?.names?.[a.id] ??
            a.nom
          )
        : a.nom
    ])
  )

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

    return () =>
      window.removeEventListener(
        'keydown',
        fermerAvecEchap
      )
  }, [ouvert])

  const installationsClub =
    [...DATA.installationsClub].sort(
      (a, b) =>
        a.nom.localeCompare(b.nom)
    )

  const totalCost =
    Object.entries(
      selections || {}
    ).reduce(
      (
        total,
        [
          installationId,
          selectedNiveau
        ]
      ) => {
        const installation =
          installationsClub.find(
            (inst) =>
              inst.id === installationId
          )

        if (
          installation &&
          selectedNiveau >= 1 &&
          selectedNiveau <= 3
        ) {
          const niveauData =
            installation.niveaux[
              selectedNiveau - 1
            ]

          if (niveauData) {
            const cost =
              niveauData.cost ?? 0

            return total + cost
          }
        }

        return total
      },
      0
    )

  function toggleNiveau(
    installationId,
    niveau
  ) {
    onChange((prev) => {
      const newSelections = {
        ...(prev || {})
      }

      const currentNiveau =
        newSelections[
          installationId
        ] || 0

      if (currentNiveau === niveau) {
        newSelections[
          installationId
        ] = 0

        if (
          newSelections[
            installationId
          ] === 0
        ) {
          delete newSelections[
            installationId
          ]
        }
      } else {
        newSelections[
          installationId
        ] = niveau
      }

      return newSelections
    })
  }

  function deselectionnerTout() {
    onChange({})
  }

  const traduireInstallation = (
    installation
  ) =>
    t.facilities?.names?.[
      installation.id
    ] ?? installation.nom

  const traduirePlayStyle = (
    styleJeu
  ) => {
    if (!styleJeu) return ''

    if (langue === 'en') {
      return (
        t.facilities?.playstyles?.[
          styleJeu
        ] ?? styleJeu
      )
    }

    return styleJeu
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="club-facilities"
      >
        <img
          className="club-facilities-image"
          src={`${import.meta.env.BASE_URL}img/installations-club/InstallClub.png`}
          alt=""
        />

        <span className="club-facilities-label">
          {t.facilities?.title ??
            'Installations du club'}
        </span>
      </button>

      {ouvert ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75"
          onClick={() => setOuvert(false)}
          role="presentation"
        >
          <div
            className="relative w-[1100px] max-w-[95vw] p-4.5 border border-filet-fort rounded modale"
            role="dialog"
            aria-modal="true"
            aria-label={
              t.facilities?.title ??
              'Installations du club'
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <header className="flex items-center justify-between gap-4 pb-3 border-b border-filet">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {t.facilities?.title ??
                    'Installations du club'}
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={
                    deselectionnerTout
                  }
                  className="border border-filet-fort rounded px-3 py-1 hover:bg-white/10"
                >
                  {t.facilities
                    ?.deselectAll ??
                    'Tout désélectionner'}
                </button>

                <div className="total-cost flex items-center gap-2">
                  {t.facilities
                    ?.totalCost ??
                    'Coût total'}
                  :{' '}
                  <strong className="whitespace-nolength">
                    {totalCost.toLocaleString()}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOuvert(false)
                }
                aria-label={
                  t.facilities?.close ??
                  'Fermer'
                }
                className="text-3xl"
              >
                ×
              </button>
            </header>

            <div className="club-facilities-liste">
              <div className="table-header">
                <div className="table-cell-header">
                  {t.facilities
                    ?.installation ??
                    'Installation'}
                </div>

                <div
                  className="table-cell-header text-center"
                  style={{
                    textAlign: 'center'
                  }}
                >
                  {t.facilities?.level1 ??
                    'Niveau 1'}
                </div>

                <div
                  className="table-cell-header text-center"
                  style={{
                    textAlign: 'center'
                  }}
                >
                  {t.facilities?.level2 ??
                    'Niveau 2'}
                </div>

                <div
                  className="table-cell-header text-center"
                  style={{
                    textAlign: 'center'
                  }}
                >
                  {t.facilities?.level3 ??
                    'Niveau 3'}
                </div>
              </div>

              {installationsClub.length >
              0 ? (
                installationsClub.map(
                  (installation) => (
                    <div
                      key={installation.id}
                      className="table-row"
                    >
                      <div className="table-cell installation-name">
                        {traduireInstallation(
                          installation
                        )}
                      </div>

                      {[
                        {
                          niveau: 1,
                          label:
                            'Niveau 1'
                        },
                        {
                          niveau: 2,
                          label:
                            'Niveau 2'
                        },
                        {
                          niveau: 3,
                          label:
                            'Niveau 3'
                        }
                      ].map(
                        ({ niveau }) => {
                          const selectedNiveau =
                            (
                              selections ||
                              {}
                            )[
                              installation.id
                            ] || 0

                          const isSelected =
                            selectedNiveau ===
                            niveau

                          const niveauData =
                            installation
                              .niveaux[
                              niveau - 1
                            ]

                          const bonusText =
                            niveauData
                              ? niveauData.bonus
                              : '-'

                          const costText =
                            niveauData
                              ? (
                                  niveauData.cost ??
                                  0
                                ).toLocaleString()
                              : '0'

                          const styleJeu =
                            niveauData?.styleJeu

                          const bonusLines =
                            bonusText.split(
                              '//'
                            )

                          const styleJeuTraduit =
                            traduirePlayStyle(
                              styleJeu
                            )

                          return (
                            <button
                              key={niveau}
                              className={`table-cell niveau-bonus border rounded transition-all overflow-hidden ${
                                isSelected
                                  ? 'border-green-400 bg-green-400/10'
                                  : 'border-transparent hover:border-filet-fort'
                              }`}
                              onClick={() =>
                                toggleNiveau(
                                  installation.id,
                                  niveau
                                )
                              }
                              title={`${
                                t.facilities
                                  ?.level ??
                                'Niveau'
                              } ${niveau}: ${costText} ${
                                t.facilities
                                  ?.cost ??
                                'coûts'
                              }${
                                styleJeuTraduit
                                  ? ` — ${styleJeuTraduit}`
                                  : ''
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                  {bonusLines.map(
                                    (
                                      line,
                                      index
                                    ) => {
                                      const match =
                                        line
                                          .trim()
                                          .match(
                                            /^(.+?)\s+\+(\d+)$/
                                          )

                                      let attr =
                                        line.trim()

                                      let value =
                                        ''

                                      if (
                                        match
                                      ) {
                                        attr =
                                          NOM_ATTRIBUT[
                                            match[1]
                                          ] ??
                                          match[1]

                                        value =
                                          match[2]
                                      }

                                      return (
                                        <div
                                          key={
                                            index
                                          }
                                          className="text-xs truncate"
                                        >
                                          {attr} :{' '}
                                          <span className="font-bold text-green-400">
                                            +{value}
                                          </span>
                                        </div>
                                      )
                                    }
                                  )}
                                </div>

                                {styleJeu ? (
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-sm font-bold text-filet-fort">
                                      +
                                    </span>

                                    {(() => {
                                      let path

                                      if (
                                        styleJeu.at(
                                          -1
                                        ) === '+'
                                      ) {
                                        path = `${import.meta.env.BASE_URL}img/playstyles/gold/${styleJeu.slice(0, -1)}.png`
                                      } else {
                                        path = `${import.meta.env.BASE_URL}img/playstyles/silver/${styleJeu}.png`
                                      }

                                      return (
                                        <img
                                          src={
                                            path
                                          }
                                          alt={
                                            styleJeuTraduit
                                          }
                                          className="h-10 w-10"
                                        />
                                      )
                                    })()}
                                  </div>
                                ) : null}
                              </div>

                              <div className="cost-indicator text-center mt-2">
                                {t.facilities
                                  ?.cost ??
                                  'Coût'}{' '}
                                : {costText}
                              </div>
                            </button>
                          )
                        }
                      )}
                    </div>
                  )
                )
              ) : (
                <div className="table-row">
                  <div
                    className="table-cell installation-name"
                    colSpan="4"
                  >
                    {t.facilities
                      ?.noData ??
                      "Aucune donnée d'installation disponible"}
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