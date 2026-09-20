import archetypeImages from '../data/archetypeImages.jsx'

const GROUPES = [
  { id: 'GK', label: 'Gardien' },
  { id: 'DEF', label: 'Défense' },
  { id: 'MID', label: 'Milieu' },
  { id: 'ATT', label: 'Attaque' },
]

export default function ArchetypeSelector({
  archetypes,
  archeId,
  changerArchetype,
}) {
  return (
    <div className="bloc mb-5">
      <div className="flex flex-wrap">
        {GROUPES.map((g) => {
          const liste = archetypes.filter((a) => a.groupe === g.id)

          if (!liste.length) return null

          return (
            <div key={g.id} className="p-2 flex">
              <div className="mx-1 gap-1 flex">
                {liste.map((a) => {
                  const image = archetypeImages[a.id]
                  return (
                    <button
                      key={a.id}
                      className={`puce flex flex-col items-center ${a.id === archeId ? 'active' : ''}`}
                      onClick={() => changerArchetype(a.id)}
                    >
                      {image && (
                        <img
                          src={image}
                          alt={a.nom}
                          className="w-16 h-16"
                        />
                      )}

                      {a.nom}
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