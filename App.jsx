import { useState, useMemo, useEffect, useCallback } from 'react'
import DATA from './data/fc27.json'
import './styles.css'
import ArchetypeSelector from './front/ArchetypeSelector.jsx'

/* ------------------------------------------------------------------ outils */

/** Coût en AP pour passer la valeur `v` à `v + 1`. null = plus d'achat possible. */
function coutPoint(arche, attrId, v) {
  const palier = DATA.coutsAP.find((p) => v >= p.min && v <= p.max)
  if (!palier) return null
  const mult = (arche.remises && arche.remises[attrId]) || 1
  return Math.max(1, Math.round(palier.cout * mult))
}

/** Coût cumulé pour amener un attribut de `base` à `cible`. */
function coutCumule(arche, attrId, base, cible) {
  let total = 0
  for (let v = base; v < cible; v++) {
    const c = coutPoint(arche, attrId, v)
    if (c === null) break
    total += c
  }
  return total
}

function budgetNiveau(niveau) {
  const l = DATA.niveaux.find((n) => n.niveau === niveau)
  return l ? l.cumul : 0
}

/* ------------------------------------------------- encodage du lien partagé */

function encodeBuild(archeId, niveau, deltas) {
  const corps = [archeId, niveau, deltas.join('.')].join('~')
  return btoa(unescape(encodeURIComponent(corps))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeBuild(code) {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
    const [archeId, niveau, deltas] = decodeURIComponent(escape(atob(b64))).split('~')
    return {
      archeId,
      niveau: Number(niveau),
      deltas: (deltas || '').split('.').map((n) => Number(n) || 0),
    }
  } catch {
    return null
  }
}

/* ------------------------------------------------------------- sous-blocs */

function Jauge({ depenses, budget }) {
  const pct = budget ? Math.min(100, (depenses / budget) * 100) : 0
  const restant = budget - depenses
  return (
    <div className="jauge">
      <div className="jauge-chiffre">
        <strong className={restant < 0 ? 'negatif' : ''}>{restant}</strong>
        <span>AP restants</span>
      </div>
      <div className="jauge-piste" role="progressbar" aria-valuenow={depenses} aria-valuemin={0} aria-valuemax={budget}>
        <div className={'jauge-remplissage' + (restant < 0 ? ' depasse' : '')} style={{ width: pct + '%' }} />
      </div>
      <div className="jauge-legende">
        <span>{depenses} dépensés</span>
        <span>{budget} au total</span>
      </div>
      <p className="jauge-aide">Le chiffre sous le + est le prix du point suivant. Il monte par paliers.</p>
    </div>
  )
}

function LigneAttribut({ attr, valeur, base, plafond, cout, remise, abordable, onChange }) {
  const pct = Math.max(2, Math.min(100, valeur))
  const investi = valeur > base
  return (
    <div className={'ligne' + (investi ? ' investie' : '')}>
      <button
        className="pas"
        onClick={() => onChange(-1)}
        disabled={valeur <= base}
        aria-label={'Baisser ' + attr.nom}
      >
        −
      </button>
      <div className="ligne-corps">
        <div className="ligne-tete">
          <span className="ligne-nom">
            {attr.nom}
            {remise ? <em className="remise" title="Attribut clé de l'archétype : moins cher">clé</em> : null}
          </span>
          <span className="ligne-valeur">{valeur}</span>
        </div>
        <div className="barre">
          <div className="barre-base" style={{ width: Math.min(100, base) + '%' }} />
          <div className="barre-gain" style={{ width: pct + '%' }} />
          {plafond < 99 ? <div className="barre-plafond" style={{ left: Math.min(100, plafond) + '%' }} /> : null}
        </div>
      </div>
      <button
        className={'pas plus' + (abordable ? '' : ' hors-budget')}
        onClick={() => onChange(1)}
        disabled={valeur >= plafond || cout === null}
        aria-label={'Monter ' + attr.nom}
      >
        <span className="pas-signe">+</span>
        <span className="pas-cout">{valeur >= plafond ? 'max' : cout}</span>
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------- app */

export default function App() {
  const depart = useMemo(() => {
    const code = window.location.hash.replace(/^#\/?b\//, '')
    const lu = window.location.hash.startsWith('#/b/') ? decodeBuild(code) : null
    const arche = DATA.archetypes.find((a) => a.id === (lu && lu.archeId)) || DATA.archetypes[11]
    return { arche, niveau: (lu && lu.niveau) || 40, deltas: (lu && lu.deltas) || null }
  }, [])

  const [archeId, setArcheId] = useState(depart.arche.id)
  const [niveau, setNiveau] = useState(depart.niveau)
  const [stats, setStats] = useState(() => {
    const s = { ...depart.arche.base }
    if (depart.deltas) {
      DATA.attributs.forEach((a, i) => {
        s[a.id] = (depart.arche.base[a.id] || 0) + (depart.deltas[i] || 0)
      })
    }
    return s
  })
  const [copie, setCopie] = useState(false)

  const arche = DATA.archetypes.find((a) => a.id === archeId)

  const changerArchetype = useCallback((id) => {
    const a = DATA.archetypes.find((x) => x.id === id)
    setArcheId(id)
    setStats({ ...a.base })
  }, [])

  const attributsVisibles = useMemo(
    () => DATA.attributs.filter((a) => (arche.max[a.id] || 0) > (arche.base[a.id] || 0) || (arche.base[a.id] || 0) > 20),
    [arche]
  )

  const parCategorie = useMemo(() => {
    const map = new Map()
    attributsVisibles.forEach((a) => {
      if (!map.has(a.categorie)) map.set(a.categorie, [])
      map.get(a.categorie).push(a)
    })
    return [...map.entries()]
  }, [attributsVisibles])

  const depenses = useMemo(
    () =>
      DATA.attributs.reduce(
        (t, a) => t + coutCumule(arche, a.id, arche.base[a.id] || 0, stats[a.id] || 0),
        0
      ),
    [arche, stats]
  )

  const budget = budgetNiveau(niveau)
  const restant = budget - depenses

  const debloques = useMemo(
    () =>
      DATA.playStyles.map((ps) => ({
        ...ps,
        ok: ps.exigences.every((e) => (stats[e.attribut] || 0) >= e.seuil),
        manque: ps.exigences
          .filter((e) => (stats[e.attribut] || 0) < e.seuil)
          .map((e) => {
            const at = DATA.attributs.find((a) => a.id === e.attribut)
            return (at ? at.nom : e.attribut) + ' ' + e.seuil
          }),
      })),
    [stats]
  )

  const lien = useMemo(() => {
    const deltas = DATA.attributs.map((a) => (stats[a.id] || 0) - (arche.base[a.id] || 0))
    return '#/b/' + encodeBuild(arche.id, niveau, deltas)
  }, [arche, niveau, stats])

  useEffect(() => {
    window.history.replaceState(null, '', lien)
  }, [lien])

  function ajuster(attrId, sens) {
    setStats((s) => {
      const v = s[attrId] || 0
      if (sens > 0) {
        if (v >= arche.max[attrId]) return s
        if (coutPoint(arche, attrId, v) === null) return s
        return { ...s, [attrId]: v + 1 }
      }
      if (v <= arche.base[attrId]) return s
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
    Math.round(attrs.reduce((t, a) => t + (stats[a.id] || 0), 0) / (attrs.length || 1))

  return (
    <div className="app">
      <header className="entete">
        <div className="marque">
          <span className="marque-jeu">FC 27</span>
          <h1>Constructeur de build Clubs Pro</h1>
        </div>
        <p className="accroche">
          Choisis un archétype, dépense tes points d'attribut, vois le prix du point suivant monter en temps réel.
        </p>
      </header>

      <ArchetypeSelector
            archetypes={DATA.archetypes}
            archeId={archeId}
            changerArchetype={changerArchetype}
      />

      <div className="grille">
        <aside className="rail">
          <Jauge depenses={depenses} budget={budget} />

          <label className="champ">
            <span className="champ-label">
              Niveau d'archétype <strong>{niveau}</strong>
            </span>
            <input
              type="range"
              min="1"
              max="40"
              value={niveau}
              onChange={(e) => setNiveau(Number(e.target.value))}
            />
          </label>

          

          <div className="fiche">
            <p className="fiche-desc">{arche.description}</p>
            <dl>
              <div>
                <dt>Poste</dt>
                <dd>{arche.positions}</dd>
              </div>
              <div>
                <dt>Signature</dt>
                <dd>{arche.signature}</dd>
              </div>
              {arche.inspiration && arche.inspiration !== '—' ? (
                <div>
                  <dt>Inspiré de</dt>
                  <dd>{arche.inspiration}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="actions">
            <button className="bouton" onClick={copierLien}>
              {copie ? 'Lien copié' : 'Copier le lien du build'}
            </button>
            <button className="bouton fantome" onClick={() => setStats({ ...arche.base })}>
              Tout remettre à zéro
            </button>
          </div>
        </aside>

        <main className="attributs">
          {parCategorie.map(([cat, attrs]) => (
            <section key={cat} className="categorie">
              <div className="categorie-tete">
                <h2>{cat}</h2>
                <span className="categorie-moy">
                  <em>moy</em>
                  {moyenne(attrs)}
                </span>
              </div>
              <div className="lignes">
                {attrs.map((a) => {
                  const v = stats[a.id] || 0
                  const cout = coutPoint(arche, a.id, v)
                  return (
                    <LigneAttribut
                      key={a.id}
                      attr={a}
                      valeur={v}
                      base={arche.base[a.id] || 0}
                      plafond={arche.max[a.id] || 0}
                      cout={cout}
                      remise={!!(arche.remises && arche.remises[a.id])}
                      abordable={cout !== null && cout <= restant}
                      onChange={(sens) => ajuster(a.id, sens)}
                    />
                  )
                })}
              </div>
            </section>
          ))}

          <section className="categorie">
            <div className="categorie-tete">
              <h2>PlayStyles</h2>
              <span className="categorie-moy">
                <em>ouverts</em>
                {debloques.filter((p) => p.ok).length}
              </span>
            </div>
            <div className="playstyles">
              {debloques.map((ps) => (
                <div key={ps.nom} className={'ps' + (ps.ok ? ' ouvert' : '')}>
                  <span className="ps-nom">{ps.nom}</span>
                  <span className="ps-etat">
                    {ps.ok ? 'débloqué' : 'il manque ' + ps.manque.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <div className="ap-mobile" aria-hidden="true">
        <span className={restant < 0 ? 'negatif' : ''}>{restant}</span> AP restants
        <span className="ap-mobile-detail">{arche.nom} · niveau {niveau}</span>
      </div>

      <footer className="pied">
        Les valeurs affichées viennent de <code>data/fc27-data.xlsx</code> et restent à vérifier en jeu.
        Site non affilié à EA Sports.
      </footer>
    </div>
  )
}
