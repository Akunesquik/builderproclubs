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
    <div className="bloc">
      
      <div className="flex flex-wrap">
        {GROUPES.map((g) => {
          const liste = archetypes.filter((a) => a.groupe === g.id)

          if (!liste.length) return null

          return (
            <div key={g.id} className="p-2 flex">

              <div className="mx-1 gap-1 flex">
                {liste.map((a) => (
                  <button
                    key={a.id}
                    className={'puce' + (a.id === archeId ? ' active' : '')}
                    onClick={() => changerArchetype(a.id)}
                  >
                    {a.nom}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}