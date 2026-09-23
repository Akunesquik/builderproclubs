import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  playStylesAccessibles,
  detailExigences,
  coutPlayStyle,
  estDebloque,
} from '../../lib/playstyles.js'

/**
 * Liste des PlayStyles disponibles pour l'archétype, triée par coût croissant,
 * avec le détail des points d'attribut à payer pour chacun.
 */
export default function ChoixPlayStyle({ arche, stats, restant, deja, onChoisir, onRetirer, onFermer }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onFermer])

  const [hoveredPs, setHoveredPs] = useState(null);
  
  const liste = useMemo(() => {
    return playStylesAccessibles(arche)
      .map((ps) => ({
        ps,
        cout: coutPlayStyle(arche, stats, ps),
        ouvert: estDebloque(arche, stats, ps),
        detail: detailExigences(arche, stats, ps),
        pris: deja.includes(ps.nom),
      }))
  }, [arche, stats, deja])

  const classement = useMemo(
    () => [...liste].sort((a, b) => a.cout - b.cout || a.ps.nom.localeCompare(b.ps.nom)),
    [liste]
  )

  const moinsChers = classement.slice(0, 5)
  const plusChers = [...classement].reverse().slice(0, 5)


  const categories = [...new Set(liste.map((item) => item.ps.categorie))]
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/75 p-0 md:p-6"
      onClick={onFermer}
      role="dialog"
      aria-modal="true"
      aria-label="Choisir un PlayStyle"
    >
      <div className="modale flex max-h-[85vh] w-full max-w-6xl flex-col"  onClick={(e) => e.stopPropagation()}>
        <header className="flex items-baseline justify-between gap-4 border-b border-[var(--filet)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Ajouter un PlayStyle</h2>
            <p className="modale-aide">
              Le prix affiché correspond aux points d'attribut manquants pour atteindre les seuils.
            </p>
          </div>
          <button className="" onClick={onFermer} aria-label="Fermer">
            ×
          </button>
        </header>
            <div className='playstyles-modal-body flex flex-row'>
              <div className="playstyles-options overflow-y-auto px-5 py-2">
              {liste.length === 0 ? (
                <p className="modale-aide py-6">Aucun PlayStyle atteignable pour cet archétype.</p>
              ) : null}

              {categories.map((categorie, index) => (
                <Fragment key={categorie}>
                {index > 0 ? <div className="playstyle-separateur" /> : null}
                <div className={'playstyles-categorie mb-5 w-full ' + (categorie === 'Buts' ? 'playstyles-categorie-buts' : '')}>
                  <h3 className='flex self-stretch items-center font-bold'>{categorie}</h3>
                  
                  <div className='flex flex-wrap gap-4  w-full'>
                  {liste
                    .filter((item) => item.ps.categorie === categorie)
                    .map((item) => (
                
                      <button
                        key={item.ps.nom}
                          className={
                            'playstyle-choice border rounded ' +
                            (item.pris ? 'playstyle-choice-selected ' : 'playstyle-choice-available ') +
                            (!item.ouvert ? 'playstyle-choice-locked ' : '') +
                            (item.cout > restant && item.cout > 0 ? 'playstyle-choice-unaffordable ' : '')
                          }
                          onClick={() => {
                            if (item.pris) {
                              onRetirer(item.ps.nom)
                              return;
                            }
                            if (item.cout > 0 && item.cout > restant) {
                              return;
                            }
                            onChoisir(item.ps);

                          }}
                          onMouseEnter={() => setHoveredPs(item)}
                          onMouseLeave={() => setHoveredPs(null)}
                        >
                          <span className="playstyle-choice-image">
                            {!item.ouvert ? <span className="playstyle-choice-lock" aria-label="PlayStyle verrouillé">🔒</span> : null}
                            <img src={`${import.meta.env.BASE_URL}img/playstyles/silver/${item.ps.nom}.png`} alt={item.ps.nom} className="hover:scale-105 transition-transform duration-200" />
                            {item.cout > restant && item.cout > 0 ? <span className="playstyle-choice-cross" aria-label="AP insuffisants" /> : null}
                          </span>
                      </button>
                    ))}

                  </div>
                </div>
                </Fragment>
              ))}
            </div>
            <div className='playstyles-right-column rounded mt-2 max-w-50 w-full h-auto text-sm text-white'>
              <div className="playstyle-details border rounded border-white max-w-50 w-full flex flex-col text-sm text-white p-2">
                {hoveredPs ? (
                <>
                  <div className="font-bold mb-1">
                    {hoveredPs.ps.nom}
                  </div>

                  <div className="mt-2 text-left w-full">
                    {hoveredPs.detail?.length > 0 ? (
                      hoveredPs.detail.map((detail) => (
                        <div key={detail.attribut} className="mb-2 flex items-baseline gap-1">
                          <span>{detail.nom} :</span>
                          <span>{detail.actuel} ➔</span>
                          <strong className="font-bold text-green-400">{detail.seuil}</strong>
                        </div>
                      ))
                    ) : (
                      <p className="italic">
                        Aucun détail disponible
                      </p>
                    )}
                    <div className='flex justify-end min-w-full'>
                      {hoveredPs ? <span className="font-bold text-orange-400">Coût : {hoveredPs.cout} AP</span> : null}
                      {hoveredPs && hoveredPs.cout - restant > 0  ? <span className="text-red-500">Manque {hoveredPs.cout - restant} AP</span> : null}
                    </div>
                  </div>
                </>
                ) : (
                  <p className="italic text-center">
                    Survollez un PlayStyle pour voir ses détails
                  </p>
                )}
              </div>
              <div className="playstyles-classement modal-classement">
                  <h3>Les 5 perks les moins chers</h3>
                  <ol>
                    {moinsChers.map(({ ps, cout, pris }) => (
                      <li key={ps.nom}>
                        <span className={'classement-nom ' + (pris ? 'classement-selectionne' : '')}>
                          <img
                            src={`${import.meta.env.BASE_URL}img/playstyles/silver/${ps.nom}.png`}
                            alt=""
                          />
                          {ps.nom}
                        </span>
                        <strong>{cout} AP</strong>
                      </li>
                    ))}
                  </ol>
              </div>
              <div className="playstyles-classement modal-classement">
                  <h3>Les 5 perks les plus chers</h3>
                  <ol>
                    {plusChers.map(({ ps, cout, pris }) => (
                      <li key={ps.nom}>
                        <span className={'classement-nom ' + (pris ? 'classement-selectionne' : '')}>
                          <img
                            src={`${import.meta.env.BASE_URL}img/playstyles/silver/${ps.nom}.png`}
                            alt=""
                          />
                          {ps.nom}
                        </span>
                        <strong>{cout} AP</strong>
                      </li>
                    ))}
                  </ol>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
