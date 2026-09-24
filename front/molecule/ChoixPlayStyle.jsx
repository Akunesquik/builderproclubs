import { Fragment, useEffect, useMemo, useState } from 'react'
import ListePerks from './petit/ListePerks.jsx'
import {
  playStylesAccessibles,
  detailExigences,
  coutPlayStyle,
  estDebloque,
} from '../../lib/playstyles.js'

import DATA from '../../data/fc27.json'

/**
 * Liste des PlayStyles disponibles pour l'archétype, triée par coût croissant,
 * avec le détail des points d'attribut à payer pour chacun.
 */
export default function ChoixPlayStyle({arche,stats,restant,deja,onChoisir,onRetirer,onFermer,spec,}) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onFermer()

    window.addEventListener('keydown', esc)

    return () => window.removeEventListener('keydown', esc)
  }, [onFermer])

  const NOM_FR_PLAYSTYLE = Object.fromEntries(
    DATA.playStyles.map((p) => [p.nom, p.nomFr])
  )

  const [hoveredPs, setHoveredPs] = useState(null)

  // Exemple : "Finisseur+" -> "Finisseur"
  const playStyleGold = spec?.archetypeGagne?.replace(/\+$/, '')

  const liste = useMemo(() => {
    return playStylesAccessibles(arche).map((ps) => ({
      ps,
      cout: coutPlayStyle(arche, stats, ps),
      ouvert: estDebloque(arche, stats, ps),
      detail: detailExigences(arche, stats, ps),
      pris: deja.includes(ps.nom),
    }))
  }, [arche, stats, deja])

  const classement = useMemo(
    () =>
      [...liste].sort(
        (a, b) =>
          a.cout - b.cout ||
          a.ps.nom.localeCompare(b.ps.nom)
      ),
    [liste]
  )

  const moinsChers = classement.slice(0, 5)
  const plusChers = [...classement].reverse().slice(0, 5)

  const categories = [
    ...new Set(liste.map((item) => item.ps.categorie)),
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex sm:items-center justify-center bg-black/75 p-2 sm:p-6 w-full lg:max-w-full "
      onClick={onFermer}
      role="dialog"
      aria-modal="true"
      aria-label="Choisir un PlayStyle"
    >
      {/* ==================== MODALE ==================== */}
      <div
        className="flex w-full max-w-6xl max-h-[90vh] flex-col overflow-hidden rounded-lg bg-gray-900 text-white modale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================== HEADER ==================== */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--filet)] px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold sm:text-lg">
              Ajouter un PlayStyle
            </h2>

            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              Le prix affiché correspond aux points d'attribut
              manquants pour atteindre les seuils.
            </p>
          </div>

          <button
            className="
              shrink-0
              text-2xl
              leading-none
              text-gray-400
              transition
              hover:text-white
            "
            onClick={onFermer}
            aria-label="Fermer"
          >
            ×
          </button>
        </header>

        {/* ==================== CONTENU ==================== */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
          {/* ==================== PLAYSTYLES ==================== */}
          <div className="min-w-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
            {liste.length === 0 ? (
              <p className="py-6 text-sm text-gray-400">
                Aucun PlayStyle atteignable pour cet archétype.
              </p>
            ) : null}

            {categories.map((categorie, index) => (
              <Fragment key={categorie}>
                {index > 0 ? (
                  <div className="my-4 border-t border-gray-700" />
                ) : null}

                <div className="mb-2 w-full">
                  <h3 className="mb-3 flex items-center font-bold">
                    {categorie}
                  </h3>

                  <div className="flex w-full flex-wrap gap-2 sm:gap-4">
                    {liste
                      .filter(
                        (item) =>
                          item.ps.categorie === categorie
                      )
                      .map((item) => {
                        const estPlayStyleGold =
                          item.ps.nom === playStyleGold

                        return (
                          <button
                            key={item.ps.nom}
                            disabled={estPlayStyleGold}
                            className={
                              `flex shrink-0 flex-row items-center gap-2 rounded border p-2 transition ` +
                              (item.pris || estPlayStyleGold
                                ? 'playstyle-choice-selected'
                                : 'playstyle-choice-available') +
                              (!item.ouvert && !estPlayStyleGold
                                ? ' playstyle-choice-locked'
                                : '') +
                              (item.cout > restant &&
                              item.cout > 0
                                ? ' playstyle-choice-unaffordable'
                                : '') +
                              (estPlayStyleGold
                                ? ' cursor-not-allowed'
                                : '')
                            }
                            onClick={() => {
                              if (estPlayStyleGold) {
                                return
                              }

                              if (item.pris) {
                                onRetirer(item.ps.nom)
                                return
                              }

                              if (
                                item.cout > 0 &&
                                item.cout > restant
                              ) {
                                return
                              }

                              onChoisir(item.ps)
                            }}
                            onMouseEnter={() =>
                              setHoveredPs(item)
                            }
                            onMouseLeave={() =>
                              setHoveredPs(null)
                            }
                          >
                            <span className="relative flex shrink-0 items-center justify-center">
                              {!item.ouvert &&
                              !estPlayStyleGold ? (
                                <span
                                  className="
                                    absolute
                                    z-10
                                    text-xl
                                    drop-shadow
                                  "
                                  aria-label="PlayStyle verrouillé"
                                >
                                  🔒
                                </span>
                              ) : null}

                              <img
                                src={`${import.meta.env.BASE_URL}img/playstyles/${
                                  estPlayStyleGold
                                    ? 'gold'
                                    : 'silver'
                                }/${NOM_FR_PLAYSTYLE[item.ps.nom]}.png`}
                                alt={item.ps.nom}
                                className="h-15 object-contain transition-transform duration-200 hover:scale-105"
                              />

                              {item.cout > restant &&
                              item.cout > 0 ? (
                                <span
                                  className="absolute inset-0"
                                  aria-label="AP insuffisants"
                                />
                              ) : null}
                            </span>
                          </button>
                        )
                      })}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>

          {/* ==================== COLONNE DROITE ==================== */}
          <div className="hidden w-60 shrink-0 flex-col gap-3 overflow-y-auto p-3 text-sm text-white lg:flex">
            {/* ==================== DÉTAILS ==================== */}
            <div className="flex w-full flex-col rounded border border-white p-2 h-45">
              {hoveredPs ? (
                <>
                  <div className="mb-1 font-bold">
                    {hoveredPs.ps.nom}
                  </div>

                  <div className="mt-2 w-full text-left">
                    {hoveredPs.detail?.length > 0 ? (
                      hoveredPs.detail.map((detail) => (
                        <div
                          key={detail.attribut}
                          className="mb-2 flex items-baseline gap-1"
                        >
                          <span>
                            {detail.nom} :
                          </span>

                          <span>
                            {detail.actuel} ➔
                          </span>

                          <strong className="font-bold text-green-400">
                            {detail.seuil}
                          </strong>
                        </div>
                      ))
                    ) : (
                      <p className="italic">
                        Aucun détail disponible
                      </p>
                    )}

                    <div className="mt-2 flex flex-col items-end gap-1">
                      <span className="font-bold text-orange-400">
                        Coût : {hoveredPs.cout} AP
                      </span>

                      {hoveredPs.cout - restant > 0 ? (
                        <span className="text-red-500">
                          Manque{' '}
                          {hoveredPs.cout - restant} AP
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center italic h-45 flex items-center">
                  Survolez un PlayStyle pour voir ses détails
                </p>
              )}
            </div>

            <ListePerks
              titre="Les 5 perks les moins chers"
              perks={moinsChers}
              playStyleGold={playStyleGold}
              NOM_FR_PLAYSTYLE={NOM_FR_PLAYSTYLE}
            />

            <ListePerks
              titre="Les 5 perks les plus chers"
              perks={plusChers}
              playStyleGold={playStyleGold}
              NOM_FR_PLAYSTYLE={NOM_FR_PLAYSTYLE}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

