import { reglage, coutPoint, moyenne } from '../../lib/couts.js'
import LigneAttribut from './LigneAttribut.jsx'

export default function ListeAttributs({ categorie, attributs, arche, stats, restant, onAjuster, corps, bonusStats, ajustementsAffiches }) {
  return (
    <section className={categorie === 'Physique' ? "flex-2" : "flex-1 " + "min-w-[260px]" } >
      <div className="flex justify-between items-center categorie-tete">
        <h2>{categorie}</h2>
        <span className={'categorie-moy ' + (categorie === 'Autres' ? 'invisible' : '')} aria-hidden={categorie === 'Autres'}>
          <em>moy</em>
          {moyenne(attributs, stats)}
        </span>
      </div>
      <div className={ categorie === 'Physique' ? 'flex flex-col sm:grid sm:grid-cols-2 gap-x-4 min-w-70 sm:min-w-135' : 'lignes'} >
        {attributs.map((a) => {
          const reg = reglage(arche, a.id)
          const v = stats[a.id] ?? reg.base
          const cout = coutPoint(arche, a.id, v)

          return (
            <LigneAttribut
              key={a.id}
              attr={a}
              reg={reg}
              valeur={v}
              cout={cout}
              abordable={cout !== null && cout <= restant}
              restant={restant}
              onChange={(sens) => onAjuster(a.id, sens)}
              arche={arche}
              corps={corps}
              bonusStats={bonusStats}
              ajustementsAffiches={ajustementsAffiches}
            />
          )
        })}
      </div>
    </section>
  )
}