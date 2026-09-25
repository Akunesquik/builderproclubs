function ajouterBonus(bonus, attribut, gain) {
  bonus[attribut] = (bonus[attribut] || 0) + gain
}

function ajouterBonusMaitrises(bonus, maitrises, data) {
  Object.entries(maitrises).forEach(([archetypeId, niveaux]) => {
    const maitrise = data.maitrise?.[archetypeId]
    if (!maitrise) return

    niveaux.forEach((niveau) => {
      const gains = maitrise[String(niveau)] || []

      gains.forEach(({ attribut, gain }) => {
        ajouterBonus(bonus, attribut, gain)
      })
    })
  })
}

function ajouterBonusInstallations(bonus, installations, data) {
  Object.entries(installations).forEach(([installationId, niveau]) => {
    const installation = data.installationsClub?.find(
      (inst) => inst.id === installationId
    )

    if (!installation) return

    const niveauData = installation.niveaux[niveau - 1]
    if (!niveauData?.bonus) return

    niveauData.bonus.split('//').forEach((ligne) => {
      const match = ligne.trim().match(/^(.+?)\s+\+(\d+)$/)
      if (!match) return

      const nomAttribut = match[1].trim()
      const gain = Number(match[2])

      const attribut = data.attributs.find(
        (attr) => attr.id.toLowerCase() === nomAttribut.toLowerCase()
      )

      if (!attribut) return

      ajouterBonus(bonus, attribut.id, gain)
    })
  })
}

export function calculerBonusStats({ maitrises, installations, data }) {
  const bonus = {}

  ajouterBonusMaitrises(bonus, maitrises, data)
  ajouterBonusInstallations(bonus, installations, data)

  return bonus
}

