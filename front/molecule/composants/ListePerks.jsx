export default function ListePerks({ titre, perks, playStyleGold, NOM_FR_PLAYSTYLE }) {
  return (
    <div className="rounded border border-gray-700 p-2">
      <h3 className="mb-2 font-bold">
        {titre}
      </h3>

      <ol className="space-y-2">
        {perks.map(({ ps, cout, pris }) => {
          const estPlayStyleGold = ps.nom === playStyleGold

          return (
            <li
              key={ps.nom}
              className="flex items-center justify-between gap-2"
            >
              <span
                className={
                  'flex min-w-0 items-center gap-1 ' +
                  (pris || estPlayStyleGold
                    ? 'text-green-400'
                    : '')
                }
              >
                <img
                  src={`${import.meta.env.BASE_URL}img/playstyles/${
                    estPlayStyleGold ? 'gold' : 'silver'
                  }/${NOM_FR_PLAYSTYLE[ps.nom]}.png`}
                  alt=""
                  className="h-8 w-8 shrink-0 object-contain"
                />

                <span className="truncate">
                  {ps.nom}
                </span>
              </span>

              <strong className="shrink-0">
                {cout} AP
              </strong>
            </li>
          )
        })}
      </ol>
    </div>
  )
}