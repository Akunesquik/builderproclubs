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
      
      <h2>Archétype</h2>

      {GROUPES.map((g) => {
        const liste = archetypes.filter((a) => a.groupe === g.id)

        if (!liste.length) return null

        return (
          <div key={g.id} className="groupe">
            <span className="groupe-nom">{g.label}</span>

            <div className="puces">
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
  )
}