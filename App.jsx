import { useState, useMemo, useEffect, useCallback } from 'react'
import DATA from './data/fc27.json'
import './styles.css'

import ArchetypeSelector from './front/ArchetypeSelector.jsx'
import CategorieAttributs from './front/molecule/CategorieAttributs.jsx'
import PlayStylesPanel from './front/PlayStylesPanel.jsx'

import {
  reglage,
  coutPoint,
  totalDepense,
  statsInitiales,
  budgetNiveau,
  attributsParCategorie,
} from './lib/couts.js'
import { NB_SLOTS } from './lib/playstyles.js'
import { INSTALLATIONS } from './lib/installations.js'
import { encodeBuild, decodeBuild } from './lib/partage.js'

const slotsVides = () => Array(NB_SLOTS).fill(null)

const corpsInitial = (arche) => ({
  taille: arche.corps ? arche.corps.taille.base : 180,
  poids: arche.corps ? arche.corps.poids.base : 78,
})

export default function App() {
  const depart = useMemo(() => {
    const lu = decodeBuild(window.location.hash)
    const arche = (lu && lu.arche) || DATA.archetypes[0]
    return {
      arche,
      niveau: (lu && lu.niveau) || 40,
      stats: (lu && lu.stats) || statsInitiales(arche),
      corps: (lu && lu.corps) || corpsInitial(arche),
      slots: lu && lu.slots ? lu.slots.slice(0, NB_SLOTS) : slotsVides(),
      installations: lu && lu.installations
        ? lu.installations.filter((id) => INSTALLATIONS.some((installation) => installation.id === id))
        : [],
      spec: (lu && lu.spec) || arche.specialisations?.find((s) => s.nom === 'Aucune') || arche.specialisations?.[0] || null,
    }
  }, [])

  const [archeId, setArcheId] = useState(depart.arche.id)
  const [niveau, setNiveau] = useState(depart.niveau)
  const [stats, setStats] = useState(depart.stats)
  const [spec, setSpec] = useState(  depart.arche.specialisations?.find((s) => s.nom === 'Aucune') ||  depart.arche.specialisations?.[0] ||  null)
  const [corps, setCorps] = useState(depart.corps)
  const [slots, setSlots] = useState(depart.slots)
  const [installations, setInstallations] = useState(depart.installations)
  const [copie, setCopie] = useState(false)
  const [bonusStats, setBonusStats] = useState({})
  const [maitrises, setMaitrises] = useState({})

  const arche = DATA.archetypes.find((a) => a.id === archeId)

  const changerArchetype = useCallback((id) => {
    const a = DATA.archetypes.find((x) => x.id === id)
    setArcheId(id)
    setStats(statsInitiales(a))
    setSlots(slotsVides())
    setInstallations([])
    setCorps(corpsInitial(a))
    setSpec(a.specialisations?.find((s) => s.nom === 'Aucune') || a.specialisations?.[0] || null)
  }, [])

  function reinitialiser() {
    setStats(statsInitiales(arche))
    setSlots(slotsVides())
    setInstallations([])
  }

  const parCategorie = useMemo(() => attributsParCategorie(arche), [arche])
  const depenses = useMemo(() => totalDepense(arche, stats), [arche, stats])
  const budget = budgetNiveau(niveau)
  const restant = budget - depenses

  const lien = useMemo(
    () => encodeBuild({ arche, niveau, stats, corps, slots, installations }),
    [arche, niveau, stats, corps, slots, installations]
  )

  useEffect(() => {
    window.history.replaceState(null, '', lien)
  }, [lien])

  useEffect(() => {
    const nouveauxBonus = {}

    Object.entries(maitrises).forEach(([archetypeId, niveaux]) => {
      const maitrise = DATA.maitrise?.[archetypeId]

      if (!maitrise) return

      niveaux.forEach((niveau) => {
        const bonus = maitrise[String(niveau)] || []

        bonus.forEach(({ attribut, gain }) => {
          nouveauxBonus[attribut] =
            (nouveauxBonus[attribut] || 0) + gain
        })
      })
    })

    setBonusStats(nouveauxBonus)
  }, [maitrises])

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

  function copierLien() {
    const url = window.location.origin + window.location.pathname + lien
    navigator.clipboard.writeText(url).then(() => {
      setCopie(true)
      setTimeout(() => setCopie(false), 2000)
    })
  }

  return (
    <div className="app">
      <header className="app-header mt-2">
        <div>
          <div className="marque">
            <span className="marque-jeu">FC 27</span>
            <h1>Constructeur de build Clubs Pro</h1>
          </div>

          <p className="accroche">
            Choisis un archétype, dépense tes points d'attribut, vois le prix du point suivant
            monter en temps réel.
          </p>

        </div>

        <div className="actions">
          <button className="bouton" onClick={copierLien}>
            {copie ? 'Lien copié' : 'Copier le lien du build'}
          </button>
          <button className="bouton fantome" onClick={reinitialiser}>
            Tout remettre à zéro
          </button>
        </div>

      </header>


      <ArchetypeSelector
        archetypes={DATA.archetypes}
        archeId={archeId}
        changerArchetype={changerArchetype}
      />

      <PlayStylesPanel
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
      />

      <main className="flex flex-wrap flex-row gap-10 mt-5">
        {parCategorie.map(([cat, attrs]) => (
          <CategorieAttributs
            key={cat}
            categorie={cat}
            attributs={attrs}
            arche={arche}
            stats={stats}
            restant={restant}
            onAjuster={ajuster}
            corps={corps}
            setCorps={setCorps}
            bonusStats={bonusStats}
            setBonusStats={setBonusStats}
          />
        ))}
      </main>

      <div className="ap-mobile" aria-hidden="true">
        <span className={restant < 0 ? 'negatif' : ''}>{restant}</span> AP restants
        <span className="ap-mobile-detail">
          {arche.nom} · niveau {niveau}
        </span>
      </div>

      <footer className="pied">
        Fait par <code>Klebar</code> et <code>Loup</code>
        <br />
        Site non affilié à EA Sports.
      </footer>
    </div>
  )
}
