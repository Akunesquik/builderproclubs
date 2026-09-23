import { useEffect, useMemo, useState } from 'react'
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
export default function ChoixPlayStyle({ arche, stats, restant, deja, onChoisir, onFermer }) {
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


  const categories = [...new Set(liste.map((item) => item.ps.categorie))]
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/75 p-0 md:p-6"
      onClick={onFermer}
      role="dialog"
      aria-modal="true"
      aria-label="Choisir un PlayStyle"
    >
      <div className="modale flex max-h-[85vh] w-full max-w-5xl flex-col"  onClick={(e) => e.stopPropagation()}>
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
        <div className='flex flex-row'>
           <div className="overflow-y-auto px-5 py-2">
              {liste.length === 0 ? (
                <p className="modale-aide py-6">Aucun PlayStyle atteignable pour cet archétype.</p>
              ) : null}

              {categories.map((categorie) => (
                <div key={categorie} className='flex flex-row items-center gap-10 mb-5 w-full'>
                  <h3 className='flex items-center w-15 font-bold'>{categorie}</h3>
                  
                  <div className='flex flex-wrap gap-4  w-full'>
                  {liste
                    .filter((item) => item.ps.categorie === categorie)
                    .map((item) => (
                
                      <button
                        key={item.ps.nom}
                        className={(item.pris ? ' pris border-white ' : 'opacity-50') + " border border-grey rounded " + (item.cout > restant && item.cout > 0 ? ' border-red-500 !cursor-default ' : '')  }
                        onClick={() => {
                          if (item.pris || (item.cout > 0 && item.cout > restant)) {
                            return;
                          }
                          onChoisir(item.ps);
                          
                        }}
                        onMouseEnter={() => setHoveredPs(item)}
                        onMouseLeave={() => setHoveredPs(null)}
                      >
                        <span className="flex flex-row">
                          <span className="">
                            <img src={`${import.meta.env.BASE_URL}img/playstyles/silver/${item.ps.nom}.png`} alt={item.ps.nom} className="hover:scale-105 transition-transform duration-200" />
                          </span>
                        </span>
                      </button>
                    ))}
                  <div className="h-px w-full bg-gray-700" />

                  </div>
                </div>
              ))}
            </div>
            <div className='rounded mt-2 max-w-50 w-full h-auto flex flex-col  text-sm text-white'>
              <div className="border rounded border-white max-w-50 w-full h-auto flex flex-col text-sm text-white p-2">
                {hoveredPs ? (
                <>
                  <div className="font-bold mb-1">
                    {hoveredPs.ps.nom}
                  </div>

                  <div className="mt-2 text-left w-full">
                    {hoveredPs.detail?.length > 0 ? (
                      hoveredPs.detail.map((detail) => (
                        <div key={detail.attribut} className="mb-2">
                          <div className="flex items-center">
                            <span className="">
                              {detail.nom}
                            </span>
                          </div>

                          <div className="ml-5 font-gray-500">
                            {detail.actuel} &rarr; {detail.seuil}
                          </div>
                          
                        </div>
                      ))
                    ) : (
                      <p className="italic">
                        Aucun détail disponible
                      </p>
                    )}
                    <div className='flex justify-end min-w-full'>
                      {hoveredPs && hoveredPs.cout - restant > 0  ? <span className="text-red-500">Manque {hoveredPs.cout - restant} AP</span> : null}
                      {hoveredPs && hoveredPs.cout - restant <= 0 && hoveredPs.cout > 0?  `${hoveredPs.cout} AP` : null}
                    </div>
                  </div>
                </>
                ) : (
                  <p className="italic text-center">
                    Survollez un PlayStyle pour voir ses détails
                  </p>
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
