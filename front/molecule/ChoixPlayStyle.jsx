import { useEffect, useMemo } from 'react'
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
      <div
        className="modale flex max-h-[85vh] w-full max-w-4xl flex-col"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="overflow-y-auto px-5 py-2">
          {liste.length === 0 ? (
            <p className="modale-aide py-6">Aucun PlayStyle atteignable pour cet archétype.</p>
          ) : null}

          {categories.map((categorie) => (
            <div key={categorie} className='flex flex-row items-center gap-10 mb-5 w-full'>
              <h3 className='flex items-center w-15 font-bold'>{categorie}</h3>
              
              <div className='flex flex-wrap gap-4 w-full'>
               {liste
                .filter((item) => item.ps.categorie === categorie)
                .map(({ ps, cout, ouvert, detail, pris }) => (
                  <button
                    key={ps.nom}
                    className={(pris ? ' pris border-white ' : 'opacity-50') + " border border-grey rounded " + (cout > restant && cout > 0 ? ' border-red-500  ' : '')  }
                    disabled={pris || (cout > 0 && cout > restant)}
                    onClick={() => onChoisir(ps)}
                  >
                    <span className="flex flex-row">
                      <span className="">
                        <img src={`${import.meta.env.BASE_URL}img/playstyles/silver/${ps.nom}.png`} alt={ps.nom} />
                      </span>
                    </span>
                    
                  </button>
                ))}
              <div className="h-px w-full bg-gray-700" />

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
