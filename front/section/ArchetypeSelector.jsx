import { useLanguage } from '../../i18n/context.jsx'

const GROUPES = [
  { id: 'GK', key: 'goalkeeper' },
  { id: 'DEF', key: 'defense' },
  { id: 'MID', key: 'midfield' },
  { id: 'ATT', key: 'attack' },
]

export default function ArchetypeSelector({
  archetypes,
  archeId,
  changerArchetype,
}) {
  const { t, langue } = useLanguage()

  return (
    <div className="bloc mb-5 flex w-full">
      <div className="flex flex-wrap flex-1 justify-center">
        {GROUPES.map((g) => {
          const liste = archetypes.filter(
            (a) => a.groupe === g.id
          )

          if (!liste.length) return null

          return (
            <div
              key={g.id}
              className="p-2 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-600" />

                <span className="whitespace-nowrap">
                  {t.archetypes[g.key]}
                </span>

                <span className="h-px flex-1 bg-gray-600" />
              </div>

              <div className="mx-1 gap-1 flex mt-2">
                {liste.map((a) => {
                  const nom =
                    langue === 'en'
                      ? a.nomEn || a.nom
                      : a.nom

                  return (
                    <button
                      key={a.id}
                      className={`puce flex flex-col items-center ${
                        a.id === archeId ? 'active' : ''
                      }`}
                      onClick={() =>
                        changerArchetype(a.id)
                      }
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}img/archetypes/${a.id.toLowerCase()}.svg`}
                        alt={nom}
                        className="w-16 h-16"
                      />

                      {nom}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}