import { useEffect, useMemo } from 'react'
import {
  specialisationsArchetype,
  detailExigencesSpec,
  coutSpecialisation,
  estDebloqueeSpec,
} from '../../lib/specialisations.js'
import DATA from '../../data/fc27.json'

/**
 * Les 3 spécialisations de l'archétype, une par ligne :
 * icône du PlayStyle+ débloqué // stat 1 // stat 2 // stat 3 // prix en AP.
 */
export default function SpecialisationPanel({ arche, stats, restant, deja, onChoisir, onFermer }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onFermer()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onFermer])

  const liste = useMemo(() => {
    return specialisationsArchetype(arche)
      .map((spec) => ({
        spec,
        cout: coutSpecialisation(arche, stats, spec),
        ouvert: estDebloqueeSpec(arche, stats, spec),
        detail: detailExigencesSpec(arche, stats, spec),
        prise: spec.nom === deja?.nom,
      }))
      .sort((a, b) => a.cout - b.cout)
  }, [arche, stats, deja])

  const NOM_FR_PLAYSTYLE = Object.fromEntries(
    DATA.playStyles.map((p) => [p.nom, p.nomFr])
  )

  return (
    <div
      className=" fixed inset-0 z-50 flex sm:items-center justify-center bg-black/75 p-2 sm:p-6 w-full lg:max-w-full"
      onClick={onFermer}
      role="dialog"
      aria-modal="true"
      aria-label="Choisir une spécialisation"
    >
      <div
        className="modale flex max-h-[85vh] w-full max-w-3xl flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-baseline justify-between gap-4 border-b border-[var(--filet)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Spécialisation — {arche.nom}</h2>
            <p className="modale-aide">
              Le prix affiché correspond aux points d'attribut manquants pour atteindre les seuils.
            </p>
          </div>
          <button className="" onClick={onFermer} aria-label="Fermer">
            ×
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-3">
          {liste.length === 0 ? (
            
            <p className="modale-aide py-6">Aucune spécialisation définie pour cet archétype.</p>
          ) : null}
          <div className="flex flex-col gap-2">
            {liste.map(({ spec, cout, ouvert, detail, prise }) => {
              const bloque = !prise && cout > 0 && cout > restant
              return (
                <button
                  key={spec.nom}
                  className={
                    'flex flex-col sm:grid sm:grid-cols-[60px_160px_1fr_80px] items-center justify-center gap-4 rounded border border-grey px-3 py-2 text-left ' +
                    (prise ? ' pris border-white ' : ' opacity-80 ') +
                    (bloque ? ' border-red-500 ' : '')
                  }
                  disabled={prise || bloque}
                  onClick={() => onChoisir(spec)}
                >
                    <img
                      src={`${import.meta.env.BASE_URL}img/playstyles/gold/${NOM_FR_PLAYSTYLE[spec.archetypeGagne.slice(0, -1)]}.png`}
                      alt={spec.archetypeGagne}
                      title={spec.nom}
                      className='h-20 '
                      style={{
                        width: 'unset',
                        maxWidth: 'unset',
                      }}
                    />

                  <span className="w-40 shrink-0 font-medium flex justify-center">{spec.nom}</span>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:min-w-0">

                    {[0, 1, 2].map((i) => {
                      const d = detail[i]
                      return (
                        <span key={i} className="flex-1 text-sm">
                          {d ? (
                            <>
                              <span className="block font-medium">{d.nom}</span>
                              <span className="modale-aide">
                                {d.actuel} → {d.seuil}
                              </span>
                            </>
                          ) : null}
                        </span>
                      )
                    })}
                  </div>

                  <span className={'w-16 shrink-0 text-center sm:text-right  font-semibold ' + (ouvert ? 'text-green-400' : '')}>
                    {ouvert ? 'Acquis' : cout}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}