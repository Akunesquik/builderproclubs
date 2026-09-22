import { useMemo } from 'react'
import { calculerAjustementTaillePoids } from '../../lib/taillePoids.js'

export default function BonusStats({ arche, attr, corps }) {
    const ajustementAffichage = useMemo(() => {
        const ajustement = calculerAjustementTaillePoids({ attr, corps, arche });
  if(['Accélération', 'Agilité', 'Équilibre','Détente','Vitesse','Force'].includes(attr.nom)){
        return ajustement !== 0 ? (ajustement > 0 ? `+${ajustement}` : `${ajustement}`) : '';
  }
  else{
    return ''
  }
    }, [calculerAjustementTaillePoids, attr, corps, arche])

    return (
      <span 
          title={ajustementAffichage !== '' 
              ? `Ajustement taille/poids : ${ajustementAffichage}`
              : 'Pas d\'ajustement taille/poids'}
          className={`ml-2 px-2 rounded ${ajustementAffichage < 0 ? "bg-red-500/50" : ""} ${ajustementAffichage > 0 ? "bg-green-500/50" : ""} text-white`}
          
      >
          {ajustementAffichage}
      </span>
  )
}