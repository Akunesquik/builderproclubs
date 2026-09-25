import { useState, useMemo, useEffect, useCallback } from 'react'
import DATA from './data/fc27.json'
import './styles.css'
import ArchetypeSelector from './front/section/ArchetypeSelector.jsx'
import ListeAttributs from './front/molecule/ListeAttributs.jsx'
import Bandeau from './front/section/Bandeau.jsx'
import ClassementsAttributs from './front/section/ClassementsAttributs.jsx'
import {
  reglage, coutPoint, coutCumule, totalDepense, statsInitiales,
  budgetNiveau, attributsParCategorie, attributsVisibles,
} from './lib/couts.js'
import { calculerAjustementTaillePoids } from './lib/taillePoids.js'
import { NB_SLOTS } from './lib/playstyles.js'
import { encodeBuild, decodeBuild } from './lib/partage.js'
import Header from './front/section/Header.jsx'

const slotsVides = () => Array(NB_SLOTS).fill(null)
const corpsInitial = (arche) => ({
  taille: arche.corps ? arche.corps.taille.base : 180,
  poids: arche.corps ? arche.corps.poids.base : 78,
})

export default function App() {
  // BUILD INITIAL
  const depart = useMemo(() => {
    const lu = decodeBuild(window.location.hash)
    const arche = (lu && lu.arche) || DATA.archetypes[0]

    return {
      arche,
      niveau: (lu && lu.niveau) || 40,
      stats: (lu && lu.stats) || statsInitiales(arche),
      corps: (lu && lu.corps) || corpsInitial(arche),
      slots: lu && lu.slots ? lu.slots.slice(0, NB_SLOTS) : slotsVides(),
      installations: lu && lu.installations ? lu.installations : {},
      spec: (lu && lu.spec) ||
        arche.specialisations?.find((s) => s.nom === 'Aucune') ||
        arche.specialisations?.[0] || null,
      maitrises: (lu && lu.maitrises) || {},
      genre: (lu && lu.genre) || 'H',
    }
  }, [])

  // STATES
  const [archeId, setArcheId] = useState(depart.arche.id)
  const [niveau, setNiveau] = useState(depart.niveau)
  const [stats, setStats] = useState(depart.stats)
  const [spec, setSpec] = useState(depart.spec)
  const [corps, setCorps] = useState(depart.corps)
  const [slots, setSlots] = useState(depart.slots)
  const [installations, setInstallations] = useState(depart.installations)
  const [bonusStats, setBonusStats] = useState({})
  const [maitrises, setMaitrises] = useState(depart.maitrises)
  const [genre, setGenre] = useState(depart.genre)
  const [ajustementsAffiches, setAjustementsAffiches] = useState(false)

  // ARCHETYPE ACTUEL
  const arche = DATA.archetypes.find((a) => a.id === archeId)

  // CHANGEMENT D'ARCHETYPE
  const changerArchetype = useCallback((id) => {
    const a = DATA.archetypes.find((x) => x.id === id)
    if (!a) return

    setArcheId(id)
    setStats(statsInitiales(a))
    setSlots(slotsVides())
    setInstallations({})
    setCorps(corpsInitial(a))
    setSpec(
      a.specialisations?.find((s) => s.nom === 'Aucune') ||
      a.specialisations?.[0] || null
    )
    setMaitrises({})
  }, [])

  // REINITIALISATION
  function reinitialiser() {
    setStats(statsInitiales(arche))
    setSlots(slotsVides())
    setInstallations({})
    setCorps(corpsInitial(arche))
    setSpec(
      arche.specialisations?.find((s) => s.nom === 'Aucune') ||
      arche.specialisations?.[0] || null
    )
    setMaitrises({})
  }

  // ATTRIBUTS PAR CATEGORIE
  const parCategorie = useMemo(() => attributsParCategorie(arche), [arche])

  // DEPENSES DU BUILD
  const depenses = useMemo(() => totalDepense(arche, stats), [arche, stats])
  const budget = budgetNiveau(niveau)
  const restant = budget - depenses

  // URL DE PARTAGE
  const lien = useMemo(
    () => encodeBuild({
      arche, niveau, stats, corps, slots, installations, spec, maitrises, genre,
    }),
    [arche, niveau, stats, corps, slots, installations, spec, maitrises, genre]
  )

  // METTRE A JOUR L'URL
  useEffect(() => {
    window.history.replaceState(null, '', lien)
  }, [lien])

  // CALCUL DES BONUS / MALUS
  useEffect(() => {
    const nouveauxBonus = {}

    // MAÎTRISES
    Object.entries(maitrises).forEach(([archetypeId, niveaux]) => {
      const maitrise = DATA.maitrise?.[archetypeId]
      if (!maitrise) return

      niveaux.forEach((niveauMaitrise) => {
        const bonus = maitrise[String(niveauMaitrise)] || []

        bonus.forEach(({ attribut, gain }) => {
          nouveauxBonus[attribut] = (nouveauxBonus[attribut] || 0) + gain
        })
      })
    })

    // INSTALLATIONS
    Object.entries(installations).forEach(([installationId, niveauInstallation]) => {
      const installation = DATA.installationsClub?.find(
        (inst) => inst.id === installationId
      )
      if (!installation) return

      const niveauData = installation.niveaux[niveauInstallation - 1]
      if (!niveauData?.bonus) return

      niveauData.bonus.split('//').forEach((line) => {
        const match = line.trim().match(/^(.+?)\s+\+(\d+)$/)
        if (!match) return

        const nomAttribut = match[1].trim()
        const gain = Number(match[2])
        const attribut = DATA.attributs.find(
          (attr) => attr.id.toLowerCase() === nomAttribut.toLowerCase()
        )
        if (!attribut) return

        nouveauxBonus[attribut.id] = (nouveauxBonus[attribut.id] || 0) + gain
      })
    })

    setBonusStats(nouveauxBonus)
  }, [maitrises, installations])

  // CLASSEMENTS DES ATTRIBUTS
  const classementsAttributs = useMemo(() => {
    const attributs = attributsVisibles(arche)

    const obtenirAjustement = (attr) => {
      const taillePoids = calculerAjustementTaillePoids({ attr, corps, arche })
      const bonusMaitriseInstallation = bonusStats?.[attr.id] || 0
      return taillePoids + bonusMaitriseInstallation
    }

    const obtenirStatActuelle = (attr) => {
      const r = reglage(arche, attr.id)
      return stats?.[attr.id] ?? r.base
    }

    const calculerCoutRestant = (attr, niveauActuel, cible) => {
      if (niveauActuel >= cible) return 0
      return coutCumule(arche, attr.id, niveauActuel, cible)
    }

    const construireClassementBrut = (cibleType) => {
      return attributs
        .map((attr) => {
          const r = reglage(arche, attr.id)
          const statActuelle = obtenirStatActuelle(attr)
          const cible = cibleType === 'max'
            ? r.max
            : Math.min(Number(cibleType), r.max)

          const niveauDepart = Math.max(
            r.min,
            Math.min(statActuelle, r.max)
          )

          const cout = calculerCoutRestant(attr, niveauDepart, cible)

          return {
            id: attr.id,
            nom: attr.nom || attr.label || attr.id,
            categorie: attr.categorie,
            min: r.min,
            actuel: statActuelle,
            max: r.max,
            cible,
            depart: niveauDepart,
            cout,
            ajustement: 0,
          }
        })
        .filter(Boolean)
        .sort((a, b) => {
          if (a.cout !== b.cout) return a.cout - b.cout
          if (a.actuel !== b.actuel) return a.actuel - b.actuel
          return a.nom.localeCompare(b.nom)
        })
    }

    const construireClassementEffectif = (cibleType) => {
      return attributs
        .map((attr) => {
          const r = reglage(arche, attr.id)
          const statActuelle = obtenirStatActuelle(attr)
          const ajustement = obtenirAjustement(attr)
          const valeurEffectiveActuelle = statActuelle + ajustement

          const cible = cibleType === 'max'
            ? r.max
            : Math.min(Number(cibleType), r.max)

          if (valeurEffectiveActuelle >= cible) {
            return {
              id: attr.id,
              nom: attr.nom || attr.label || attr.id,
              categorie: attr.categorie,
              min: r.min,
              actuel: statActuelle,
              actuelEffectif: valeurEffectiveActuelle,
              max: r.max,
              cible,
              depart: statActuelle,
              niveauNecessaire: statActuelle,
              cout: 0,
              ajustement,
            }
          }

          const niveauNecessaire = Math.max(r.min, cible - ajustement)
          if (niveauNecessaire > r.max) return null

          const niveauDepart = Math.max(
            r.min,
            Math.min(statActuelle, r.max)
          )

          const cout = calculerCoutRestant(
            attr,
            niveauDepart,
            niveauNecessaire
          )

          return {
            id: attr.id,
            nom: attr.nom || attr.label || attr.id,
            categorie: attr.categorie,
            min: r.min,
            actuel: statActuelle,
            actuelEffectif: valeurEffectiveActuelle,
            max: r.max,
            niveauNecessaire,
            cible,
            depart: niveauDepart,
            cout,
            ajustement,
          }
        })
        .filter(Boolean)
        .sort((a, b) => {
          if (a.cout !== b.cout) return a.cout - b.cout
          if (a.actuel !== b.actuel) return a.actuel - b.actuel
          return a.nom.localeCompare(b.nom)
        })
    }

    return {
      brut: {
        minMax: construireClassementBrut('max'),
        min80: construireClassementBrut(80),
        min85: construireClassementBrut(85),
        min90: construireClassementBrut(90),
      },
      effectif: {
        minMax: construireClassementEffectif('max'),
        min80: construireClassementEffectif(80),
        min85: construireClassementEffectif(85),
        min90: construireClassementEffectif(90),
      },
    }
  }, [arche, corps, bonusStats, stats])

  // MODIFICATION D'UN ATTRIBUT
  function ajuster(attrId, sens) {
    setStats((s) => {
      const r = reglage(arche, attrId)
      const v = s[attrId] ?? r.base

      if (sens > 0) {
        if (coutPoint(arche, attrId, v) === null) return s
        return { ...s, [attrId]: v + 1 }
      }

      if (v <= r.min) return s
      return { ...s, [attrId]: v - 1 }
    })
  }

  return (
    <div className="app">
      <Header
        ajustementsAffiches={ajustementsAffiches}
        setAjustementsAffiches={setAjustementsAffiches}
        reinitialiser={reinitialiser}
        lien={lien}
      />

      <ArchetypeSelector
        archetypes={DATA.archetypes}
        archeId={archeId}
        changerArchetype={changerArchetype}
      />

      <Bandeau
        arche={arche}
        stats={stats}
        slots={slots}
        restant={restant}
        onStats={setStats}
        onSlots={setSlots}
        spec={spec}
        onSpec={setSpec}
        installations={installations}
        onInstallations={setInstallations}
        depenses={depenses}
        budget={budget}
        niveau={niveau}
        onNiveau={setNiveau}
        maitrises={maitrises}
        setMaitrises={setMaitrises}
        corps={corps}
        setCorps={setCorps}
        genre={genre}
        setGenre={setGenre}
        bonusStats={bonusStats}
      />

      <main className="flex flex-wrap flex-row gap-10 mt-5">
        {parCategorie.map(([cat, attrs]) => (
          <ListeAttributs
            key={cat}
            categorie={cat}
            attributs={attrs}
            arche={arche}
            stats={stats}
            restant={restant}
            onAjuster={ajuster}
            corps={corps}
            bonusStats={bonusStats}
            setBonusStats={setBonusStats}
            ajustementsAffiches={ajustementsAffiches}
          />
        ))}
      </main>

      <ClassementsAttributs
        classements={classementsAttributs}
        arche={arche}
      />

      <div className="ap-mobile" aria-hidden="true">
        <span className={restant < 0 ? 'negatif' : ''}>
          {restant}
        </span>{' '}
        AP restants
        <span className="ap-mobile-detail">
          {arche.nom} · niveau {niveau}
        </span>
      </div>

      <footer className="pied">
        Fait par <code>Klebar</code> et <code>Loup</code> (Symphonyyyyyyyyyyy)
        <br />
        Site non affilié à EA Sports.
      </footer>
    </div>
  )
}