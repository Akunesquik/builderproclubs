import { useMemo, useState } from 'react'
import { determinerTypeCourse } from '../../lib/typeCourse.js'
import Curseur from '../molecule/composants/Curseur.jsx'

export default function InfosPro({arche, corps, setCorps, stats, bonusStats, genre, setGenre }){

    const typeCourse = useMemo(
        () =>
        arche.corps
            ? determinerTypeCourse(arche, stats, corps, genre, bonusStats)
            : null,
        [arche, stats, corps, genre, bonusStats]
    )

    return (
        <div className="w-full mt-1">

        <div className="categorie-tete">
          <h2>Infos pro</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 w-full items-center">

          {/* Colonne 1 : Genre */}
          <div className="w-full flex flex-row gap-2 justify-center ">
            <div className="flex gap-2 w-full items-end">
              <button
                type="button"
                onClick={() => setGenre('H')}
                className={
                  'flex-1 rounded border p-1.5 text-sm font-semibold transition ' +
                  (genre === 'H'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                    : 'border-gray-500 text-gray-400 hover:text-white hover:border-gray-300')
                }
              >
                Homme
              </button>
              <button
                type="button"
                onClick={() => setGenre('F')}
                className={
                  'flex-1 rounded border p-1.5 text-sm font-semibold transition ' +
                  (genre === 'F'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                    : 'border-gray-500 text-gray-400 hover:text-white hover:border-gray-300')
                }
              >
                Femme
              </button>
            </div>
          </div>

          {/* Colonne 2 : Taille */}
          <div className="w-full">
            {arche.corps ? (
              <Curseur
                label="Taille"
                unite="cm"
                valeur={corps.taille}
                min={arche.corps.taille.min}
                max={arche.corps.taille.max}
                onChange={(v) => setCorps((c) => ({ ...c, taille: v }))}
              />
            ) : null}
          </div>

          {/* Colonne 3 : Poids */}
          <div className="w-full">
            {arche.corps ? (
              <Curseur
                label="Poids"
                unite="kg"
                valeur={corps.poids}
                min={arche.corps.poids.min}
                max={arche.corps.poids.max}
                onChange={(v) => setCorps((c) => ({ ...c, poids: v }))}
              />
            ) : null}
          </div>

          {/* Colonne 4 : Type de course */}
          <div className="w-full">
            {typeCourse ? (
              <div className="flex flex-col items-center justify-center gap-0.5 rounded border border-green-500/50 bg-green-500/10 px-2 py-1.5 w-full">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide leading-tight">
                  Type de course
                </span>
                <span className="text-sm font-bold text-green-400 leading-tight">
                  {typeCourse.nom}
                </span>
              </div>
            ) : null}
          </div>

        </div>

      </div>
    )
}