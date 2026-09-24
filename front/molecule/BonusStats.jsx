import { useMemo } from 'react'
import { calculerAjustementTaillePoids } from '../../lib/taillePoids.js'

export default function BonusStats({ arche, attr, corps, bonusStats }) {
    const ajustementAffichage = useMemo(() => {
        const taillepoids = calculerAjustementTaillePoids({ attr, corps, arche });  
        const bonusMaitrise = bonusStats?.[attr.id] || 0
        const ajustement = taillepoids + bonusMaitrise
        console.log(bonusStats)
        return ajustement !== 0 ? (ajustement > 0 ? `+${ajustement}` : `${ajustement}`) : '';

    }, [calculerAjustementTaillePoids, attr, corps, arche, bonusStats])

    // Retourner le span UNIQUEMENT s'il y a quelque chose à afficher
    return ajustementAffichage !== '' ? (
        <span
            title={`Ajustement taille/poids : ${ajustementAffichage}`}
            className={`ml-2 px-2 rounded ${ajustementAffichage < 0 ? "bg-red-500/50" : ""} ${ajustementAffichage > 0 ? "bg-green-500/50" : ""} text-white`}
        >
            {ajustementAffichage}
        </span>
    ) : null; // Retourne null (rien en HTML) quand pas d'ajustement
}