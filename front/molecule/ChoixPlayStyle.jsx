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
      .sort((a, b) => a.cout - b.cout || a.ps.nom.localeCompare(b.ps.nom))
  }, [arche, stats, deja])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/75 p-0 md:p-6"
      onClick={onFermer}
      role="dialog"
      aria-modal="true"
      aria-label="Choisir un PlayStyle"
    >
      <div
        className="modale flex max-h-[85vh] w-full max-w-2xl flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-baseline justify-between gap-4 border-b border-[var(--filet)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Ajouter un PlayStyle</h2>
            <p className="modale-aide">
              Le prix affiché correspond aux points d'attribut manquants pour atteindre les seuils.
            </p>
          </div>
          <button className="pas" onClick={onFermer} aria-label="Fermer">
            ×
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-2">
          {liste.length === 0 ? (
            <p className="modale-aide py-6">Aucun PlayStyle atteignable pour cet archétype.</p>
          ) : null}

          {liste.map(({ ps, cout, ouvert, detail, pris }) => (
            <button
              key={ps.nom}
              className={'ps-ligne' + (pris ? ' pris' : '')}
              disabled={pris}
              onClick={() => onChoisir(ps)}
            >
              <span className="ps-ligne-tete">
                <span className="ps-ligne-nom">
                  {ps.nom}
                  <em className="ps-cat">{ps.categorie}</em>
                </span>
                <span
                  className={
                    'ps-prix' +
                    (ouvert ? ' ouvert' : cout > restant ? ' hors-budget' : '')
                  }
                >
                  {pris ? 'déjà pris' : ouvert ? 'déjà atteint' : `${cout} AP`}
                </span>
              </span>

              <span className="ps-exigences">
                {detail.map((d) => (
                  <span key={d.attribut} className={'ps-exig' + (d.manque ? '' : ' ok')}>
                    {d.nom} {d.actuel}
                    {d.manque ? (
                      <>
                        {' → '}
                        <strong>{d.seuil}</strong>
                        <em>+{d.cout}</em>
                      </>
                    ) : (
                      ' ✓'
                    )}
                  </span>
                ))}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
