import { useState, useMemo, useEffect, useCallback } from 'react'
import DATA from './data/fc27.json'
import './styles.css'
import ArchetypeSelector from './front/ArchetypeSelector.jsx'
import JaugePoints from './front/molecule/JaugePoints.jsx'
import {
  reglage,
  coutPoint,
  totalDepense,
  statsInitiales,
  budgetNiveau,
  attributsVisibles,
} from './lib/couts.js'

/* ------------------------------------------------- encodage du lien partagé */

function encodeBuild(archeId, niveau, deltas, corps) {
  const corpsTxt = corps ? corps.taille + '.' + corps.poids : ''
  const body = [archeId, niveau, deltas.join('.'), corpsTxt].join('~')
  return btoa(unescape(encodeURIComponent(body)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function decodeBuild(code) {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
    const [archeId, niveau, deltas, corpsTxt] = decodeURIComponent(escape(atob(b64))).split('~')
    const [taille, poids] = (corpsTxt || '').split('.').map(Number)
    return {
      archeId,
      niveau: Number(niveau),
      deltas: (deltas || '').split('.').map((n) => Number(n) || 0),
      corps: taille && poids ? { taille, poids } : null,
    }
  } catch {
    return null
  }
}

/* ------------------------------------------------------------- sous-blocs */

function LigneAttribut({ attr, reg, valeur, cout, abordable, onChange }) {
  const etoiles = reg.max <= 5
  const amplitude = Math.max(1, reg.max - reg.min)
  const pct = ((valeur - reg.min) / amplitude) * 100
  const investi = valeur > reg.base

  return (
    <div className={'ligne' + (investi ? ' investie' : '')}>
      <button
        className="pas"
        onClick={() => onChange(-1)}
        disabled={valeur <= reg.min}
        aria-label={'Baisser ' + attr.nom}
      >
        −
      </button>

      <div className="ligne-corps">
        <div className="ligne-tete">
          <span className="ligne-nom">
            {attr.nom}
            {reg.cle ? (
              <em className="remise" title="Attribut clé : la courbe de prix la moins chère">
                clé
              </em>
            ) : null}
          </span>
          <span className="ligne-valeur">
            {valeur}
            {etoiles ? '★' : null}
            <small className="ligne-plafond">/{reg.max}</small>
          </span>
        </div>
        {etoiles ? null : (
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700">
            <div
              className={`h-full transition-all ${
                valeur === reg.base
                  ? 'bg-gray-500'
                  : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, valeur))}%`,
              }}
            />

            {/* Valeur de base */}
            <div
              className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-white"
              style={{
                left: `${Math.max(0, Math.min(100, reg.base))}%`,
              }}
            />

            {/* Valeur maximale */}
            <div
              className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-gray-400"
              style={{
                left: `${Math.max(0, Math.min(100, reg.max))}%`,
              }}
            />
          </div>
        )}
      </div>

      <button
        className={'pas plus' + (abordable ? '' : ' hors-budget')}
        onClick={() => onChange(1)}
        disabled={cout === null}
        aria-label={'Monter ' + attr.nom}
      >
        <span className="pas-signe">+</span>
        <span className="pas-cout">{cout === null ? 'max' : cout}</span>
      </button>
    </div>
  )
}

function Curseur({ label, unite, valeur, min, max, onChange }) {
  return (
    <label className="champ">
      <span className="champ-label">
        {label}{' '}
        <strong>
          {valeur} {unite}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

/* ------------------------------------------------------------------- app */

export default function App() {
  const depart = useMemo(() => {
    const lu = window.location.hash.startsWith('#/b/')
      ? decodeBuild(window.location.hash.replace(/^#\/?b\//, ''))
      : null
    const arche =
      DATA.archetypes.find((a) => a.id === (lu && lu.archeId)) || DATA.archetypes[0]
    return { arche, niveau: (lu && lu.niveau) || 40, deltas: lu && lu.deltas, corps: lu && lu.corps }
  }, [])

  const [archeId, setArcheId] = useState(depart.arche.id)
  const [niveau, setNiveau] = useState(depart.niveau)
  const [stats, setStats] = useState(() => {
    const s = statsInitiales(depart.arche)
    if (depart.deltas) {
      DATA.attributs.forEach((a, i) => {
        s[a.id] = reglage(depart.arche, a.id).base + (depart.deltas[i] || 0)
      })
    }
    return s
  })
  const [corps, setCorps] = useState(
    () =>
      depart.corps || {
        taille: depart.arche.corps ? depart.arche.corps.taille.base : 180,
        poids: depart.arche.corps ? depart.arche.corps.poids.base : 78,
      }
  )
  const [copie, setCopie] = useState(false)

  const arche = DATA.archetypes.find((a) => a.id === archeId)

  const changerArchetype = useCallback((id) => {
    const a = DATA.archetypes.find((x) => x.id === id)
    setArcheId(id)
    setStats(statsInitiales(a))
    if (a.corps) setCorps({ taille: a.corps.taille.base, poids: a.corps.poids.base })
  }, [])

  const parCategorie = useMemo(() => {
    const map = new Map()
    attributsVisibles(arche).forEach((a) => {
      if (!map.has(a.categorie)) map.set(a.categorie, [])
      map.get(a.categorie).push(a)
    })
    return [...map.entries()]
  }, [arche])

  const depenses = useMemo(() => totalDepense(arche, stats), [arche, stats])
  const budget = budgetNiveau(niveau)
  const restant = budget - depenses

  const lien = useMemo(() => {
    const deltas = DATA.attributs.map((a) => (stats[a.id] ?? 0) - reglage(arche, a.id).base)
    return '#/b/' + encodeBuild(arche.id, niveau, deltas, corps)
  }, [arche, niveau, stats, corps])

  useEffect(() => {
    window.history.replaceState(null, '', lien)
  }, [lien])

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

  const moyenne = (attrs) =>
    Math.round(
      attrs.reduce((t, a) => t + (stats[a.id] ?? 0), 0) / (attrs.length || 1)
    )

  return (
    <div className="app">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="marque">
            <span className="marque-jeu">FC 27</span>
            <h1>Constructeur de build Clubs Pro</h1>
          </div>

          <p className="accroche">
            Choisis un archétype, dépense tes points d'attribut, vois le prix du point suivant
            monter en temps réel.
          </p>

          <div className="actions max-w-50 mt-5">
            <button className="bouton" onClick={copierLien}>
              {copie ? 'Lien copié' : 'Copier le lien du build'}
            </button>
            <button className="bouton fantome" onClick={() => setStats(statsInitiales(arche))}>
              Tout remettre à zéro
            </button>
          </div>
        </div>

        <div className="shrink-0">
          <JaugePoints depenses={depenses} budget={budget} />
          <Curseur
            label="Niveau d'archétype"
            unite=""
            valeur={niveau}
            min={1}
            max={40}
            onChange={setNiveau}
          />
          {arche.corps ? (
            <div className="corps">
              <Curseur
                label="Taille"
                unite="cm"
                valeur={corps.taille}
                min={arche.corps.taille.min}
                max={arche.corps.taille.max}
                onChange={(v) => setCorps((c) => ({ ...c, taille: v }))}
              />
              <Curseur
                label="Poids"
                unite="kg"
                valeur={corps.poids}
                min={arche.corps.poids.min}
                max={arche.corps.poids.max}
                onChange={(v) => setCorps((c) => ({ ...c, poids: v }))}
              />
            </div>
          ) : null}
        </div>
      </header>

      <hr className="my-4 border-gray-700" />

      <ArchetypeSelector
        archetypes={DATA.archetypes}
        archeId={archeId}
        changerArchetype={changerArchetype}
      />

      <main className="flex flex-wrap flex-row gap-10">
        {parCategorie.map(([cat, attrs]) => (
          <section key={cat} className="flex-1 min-w-[260px]">
            <div className="flex justify-between items-center categorie-tete">
              <h2>{cat}</h2>
              <span className="categorie-moy">
                <em>moy</em>
                {moyenne(attrs)}
              </span>
            </div>
            <div className="lignes">
              {attrs.map((a) => {
                const reg = reglage(arche, a.id)
                const v = stats[a.id] ?? reg.base
                const cout = coutPoint(arche, a.id, v)
                return (
                  <LigneAttribut
                    key={a.id}
                    attr={a}
                    reg={reg}
                    valeur={v}
                    cout={cout}
                    abordable={cout !== null && cout <= restant}
                    onChange={(sens) => ajuster(a.id, sens)}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </main>

      <div className="ap-mobile" aria-hidden="true">
        <span className={restant < 0 ? 'negatif' : ''}>{restant}</span> AP restants
        <span className="ap-mobile-detail">
          {arche.nom} · niveau {niveau}
        </span>
      </div>

      <footer className="pied">
        Les valeurs affichées viennent de <code>data/fc27-data.xlsx</code> et restent à vérifier en
        jeu. Site non affilié à EA Sports.
      </footer>
    </div>
  )
}
