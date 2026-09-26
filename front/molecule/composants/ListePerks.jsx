import { useLanguage } from '../../../i18n/context.jsx'

export default function ListePerks({
  titre,
  perks,
  playStyleGold,
  NOM_FR_PLAYSTYLE,
}) {
  const { t, langue } = useLanguage()

  return (
    <div className="rounded border border-gray-700 p-2">
      <h3 className="mb-2 font-bold">
        {titre}
      </h3>

      <ol className="space-y-2">
        {perks.map(
          ({ ps, cout, pris }) => {
            const estPlayStyleGold =
              ps.nom === playStyleGold

            const nom =
              langue === 'fr'
                ? ps.nomFr || ps.nom
                : ps.nom

            const nomImage =
              NOM_FR_PLAYSTYLE?.[ps.nom] ||
              ps.nomFr ||
              ps.nom

            return (
              <li
                key={ps.nom}
                className="flex items-center justify-between gap-2"
              >
                <span
                  className={
                    'flex min-w-0 items-center gap-1 ' +
                    (
                      pris ||
                      estPlayStyleGold
                        ? 'text-green-400'
                        : ''
                    )
                  }
                >
                  <img
                    src={`${import.meta.env.BASE_URL}img/playstyles/${
                      estPlayStyleGold
                        ? 'gold'
                        : 'silver'
                    }/${nomImage}.png`}
                    alt=""
                    className="h-8 w-8 shrink-0 object-contain"
                  />

                  <span className="truncate">
                    {nom}
                  </span>
                </span>

                <strong className="shrink-0">
                  {cout} {t.attributes.ap}
                </strong>
              </li>
            )
          }
        )}
      </ol>
    </div>
  )
}