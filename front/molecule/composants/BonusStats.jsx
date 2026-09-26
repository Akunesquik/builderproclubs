import { useMemo } from 'react'
import { useLanguage } from '../../../i18n/context.jsx'
import { calculerAjustementTaillePoids } from '../../../lib/taillePoids.js'

export default function BonusStats({
    arche,
    attr,
    corps,
    bonusStats
}) {
    const { t } = useLanguage()

    const ajustementAffichage = useMemo(() => {
        const taillepoids =
            calculerAjustementTaillePoids({
                attr,
                corps,
                arche
            })

        const bonusMaitrise =
            bonusStats?.[attr.id] || 0

        const ajustement =
            taillepoids + bonusMaitrise

        return ajustement !== 0
            ? (
                ajustement > 0
                    ? `+${ajustement}`
                    : `${ajustement}`
              )
            : ''
    }, [
        attr,
        corps,
        arche,
        bonusStats
    ])

    // Retourner le span UNIQUEMENT s'il y a quelque chose à afficher
    return ajustementAffichage !== '' ? (
        <span
            title={`${t.bonusStats?.adjustment ?? 'Ajustement taille/poids et maîtrise'} : ${ajustementAffichage}`}
            className={`ml-2 px-2 rounded ${
                ajustementAffichage < 0
                    ? "bg-red-500/50"
                    : ""
            } ${
                ajustementAffichage > 0
                    ? "bg-green-500/50"
                    : ""
            } text-white`}
        >
            {ajustementAffichage}
        </span>
    ) : null
}