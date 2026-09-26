import { reglage, coutPoint, moyenne } from '../../lib/couts.js'
import LigneAttribut from './LigneAttribut.jsx'
import { useLanguage } from '../../i18n/context.jsx'

export default function ListeAttributs({
  categorie,
  attributs,
  arche,
  stats,
  setStats,
  restant,
  corps,
  bonusStats,
  ajustementsAffiches
}) {
  const { t, langue } = useLanguage()

  const categorieTraduite =
    t.categories?.[categorie] ?? categorie

  const categoriePhysique =
    categorie === 'Physique'

  const categorieAutres =
    categorie === 'Autres'

  return (
    <section
      className={
        categoriePhysique
          ? 'flex-2'
          : 'flex-1 min-w-[260px]'
      }
    >
      <div className="flex justify-between items-center categorie-tete">
        <h2>{categorieTraduite}</h2>

        <span
          className={
            'categorie-moy ' +
            (categorieAutres ? 'invisible' : '')
          }
          aria-hidden={categorieAutres}
        >
          <em>{t.attributes?.average ?? 'moy'}</em>
          {moyenne(attributs, stats)}
        </span>
      </div>

      <div
        className={
          categoriePhysique
            ? 'flex flex-col sm:grid sm:grid-cols-2 gap-x-4 min-w-70 sm:min-w-135'
            : 'lignes'
        }
      >
        {attributs.map((a) => {
          const reg = reglage(arche, a.id)
          const valeur =
            stats[a.id] ?? reg.base
          const cout = coutPoint(
            arche,
            a.id,
            valeur
          )

          return (
            <LigneAttribut
              key={a.id}
              attr={a}
              reg={reg}
              valeur={valeur}
              cout={cout}
              abordable={
                cout !== null &&
                cout <= restant
              }
              restant={restant}
              arche={arche}
              corps={corps}
              bonusStats={bonusStats}
              ajustementsAffiches={
                ajustementsAffiches
              }
              setStats={setStats}
            />
          )
        })}
      </div>
    </section>
  )
}