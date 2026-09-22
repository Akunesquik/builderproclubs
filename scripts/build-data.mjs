/**
 * data/fc27-data.xlsx  ->  data/fc27.json
 *
 *   npm run data
 *
 * Une feuille par archétype : lignes = attributs, colonnes = paliers de valeur.
 * Les listes de paliers identiques sont dédupliquées dans data.courbes pour
 * garder le JSON léger ; chaque attribut ne stocke que l'index de sa courbe.
 */
import * as XLSX from 'xlsx'
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(ROOT, 'data', 'fc27-data.xlsx')
const CIBLE = join(ROOT, 'data', 'fc27.json')

const wb = XLSX.read(readFileSync(SOURCE), { type: 'buffer' })

const feuille = (nom) => {
  const ws = wb.Sheets[nom]
  if (!ws) throw new Error(`Onglet manquant : « ${nom} »`)
  return ws
}
const lire = (nom) =>
  XLSX.utils
    .sheet_to_json(feuille(nom), { range: 2, defval: null })
    .filter((r) => Object.values(r).some((v) => v !== null && v !== ''))

const nb = (v) => (v === null || v === '' ? null : Number(v))
const tx = (v) => (v === null || v === undefined ? '' : String(v).trim())
const oui = (v) => /^(oui|yes|true|1|x)$/i.test(tx(v))

/* ---------------------------------------------------------------- listes */

const attributs = lire('Attributs').map((r) => ({
  id: tx(r.id),
  nom: tx(r.nom),
  categorie: tx(r.categorie),
}))
const idsAttr = new Set(attributs.map((a) => a.id))

const reglages = {}
for (const r of lire('Reglages')) {
  const v = nb(r.valeur)
  reglages[tx(r.cle)] = v === null || Number.isNaN(v) ? tx(r.valeur) : v
}

/* ------------------------------------------- en-têtes de paliers -------- */

/** « 85-89 » -> [85, 89] ; « 95 » -> [95, 95] ; « ★3 » -> [3, 3] ; sinon null. */
function bornes(entete) {
  const h = tx(entete)
  const etoile = h.match(/^[★*]\s*(\d+)$/)
  if (etoile) return [Number(etoile[1]), Number(etoile[1])]
  const plage = h.match(/^(\d+)\s*[-–]\s*(\d+)$/)
  if (plage) return [Number(plage[1]), Number(plage[2])]
  if (/^\d+$/.test(h)) return [Number(h), Number(h)]
  return null
}

const COLS_FIXES = new Set(['attribut', 'nom', 'categorie', 'cle', 'base', 'limite_min', 'limite_max'])

/* --------------------------------------- dédoublonnage des courbes ------ */

const courbes = []
const indexCourbe = new Map()
function courbeIndex(paliers) {
  const clef = JSON.stringify(paliers)
  if (!indexCourbe.has(clef)) {
    indexCourbe.set(clef, courbes.length)
    courbes.push(paliers)
  }
  return indexCourbe.get(clef)
}

/* --------------------------------------------------- spécialisations --- */

const specialisationsParArchetype = new Map()

for (const r of lire('Specialisations')) {
  const archetype = tx(r.archetype)
  const nom = tx(r.specialisation)
  if (!archetype || !nom) continue

  const exigences = []
  for (const i of [1, 2, 3]) {
    const a = tx(r[`attribut_${i}`])
    const s = nb(r[`seuil_${i}`])
    if (a && s) {
      if (!idsAttr.has(a)) {
        throw new Error(`Spécialisation « ${nom} » (${archetype}) : attribut inconnu « ${a} »`)
      }
      exigences.push({ attribut: a, seuil: s })
    }
  }

  const spec = {
    nom,
    archetypeGagne: tx(r.archetype_gagne) || null, // null pour "Aucune"
    exigences,
  }

  if (!specialisationsParArchetype.has(archetype)) specialisationsParArchetype.set(archetype, [])
  specialisationsParArchetype.get(archetype).push(spec)
}

/* --------------------------------------------- lecture d'un archétype --- */

function lireArchetype(nomFeuille, idArchetype) {
  const lignes = lire(nomFeuille)
  if (!lignes.length) throw new Error(`Feuille « ${nomFeuille} » vide`)

  const stats = {}
  for (const r of lignes) {
    const attr = tx(r.attribut)
    if (!attr) continue
    if (!idsAttr.has(attr)) {
      throw new Error(`Feuille « ${nomFeuille} » : attribut inconnu « ${attr} »`)
    }
    const base = nb(r.base) ?? 0
    const min = nb(r.limite_min) ?? base
    const max = nb(r.limite_max) ?? base
    if (base < min || base > max) {
      throw new Error(`« ${nomFeuille} » / ${attr} : base ${base} hors des limites ${min}-${max}`)
    }

    const paliers = []
    for (const [entete, valeur] of Object.entries(r)) {
      if (COLS_FIXES.has(entete)) continue
      const cout = nb(valeur)
      if (cout === null || Number.isNaN(cout)) continue
      const b = bornes(entete)
      if (!b) continue
      paliers.push([b[0], b[1], cout])
    }
    paliers.sort((x, y) => x[0] - y[0])
    for (let i = 1; i < paliers.length; i++) {
      if (paliers[i][0] <= paliers[i - 1][1]) {
        throw new Error(
          `« ${nomFeuille} » / ${attr} : paliers ${paliers[i - 1][0]}-${paliers[i - 1][1]} et ${paliers[i][0]}-${paliers[i][1]} se chevauchent`
        )
      }
    }

    stats[attr] = { base, min, max, cle: oui(r.cle), c: courbeIndex(paliers) }
  }

  const manquants = attributs.filter((a) => !stats[a.id]).map((a) => a.id)
  if (manquants.length) {
    throw new Error(`Feuille « ${nomFeuille} » : lignes manquantes — ${manquants.join(', ')}`)
  }
  return stats
}

/* ------------------------------------------------------------- corps --- */

const corps = {}
for (const r of lire('Corps')) {
  corps[tx(r.archetype)] = {
    taille: { base: nb(r.taille_base), min: nb(r.taille_min), max: nb(r.taille_max) },
    poids: { base: nb(r.poids_base), min: nb(r.poids_min), max: nb(r.poids_max) },
  }
}

/* -------------------------------------------------------- archétypes --- */

const archetypes = lire('Archetypes').map((r) => {
  const id = tx(r.id)
  const nomFeuille = tx(r.feuille) || tx(r.nom_fr) || tx(r.nom)
  return {
    id,
    nom: tx(r.nom_fr) || tx(r.nom),
    nomEn: tx(r.nom),
    groupe: tx(r.groupe),
    positions: tx(r.positions),
    inspiration: tx(r.inspiration),
    signature: tx(r.playstyle_signature),
    description: tx(r.description),
    stats: lireArchetype(nomFeuille, id),
    corps: corps[id] || null,
    specialisations: specialisationsParArchetype.get(id) || [],
  }
})

/* -------------------------------------------- niveaux et playstyles ---- */

const niveaux = lire('Niveaux').map((r) => ({
  niveau: nb(r.niveau),
  gain: nb(r.ap_gagnes),
  cumul: nb(r.ap_cumules),
}))

const playStyles = lire('PlayStyles').map((r) => {
  const exigences = []
  for (const i of [1, 2, 3]) {
    const a = tx(r[`attribut_${i}`])
    const s = nb(r[`seuil_${i}`])
    if (a && s) {
      if (!idsAttr.has(a)) throw new Error(`PlayStyle « ${tx(r.nom)} » : attribut inconnu « ${a} »`)
      exigences.push({ attribut: a, seuil: s })
    }
  }
  return { nom: tx(r.nom), categorie: tx(r.categorie), exigences }
})

/* ------------------------------------------------------------ sortie --- */

const data = {
  jeu: 'FC 27',
  reglages,
  attributs,
  categories: [...new Set(attributs.map((a) => a.categorie))],
  courbes,
  archetypes,
  niveaux,
  playStyles,
}

writeFileSync(CIBLE, JSON.stringify(data))
console.log(
  `OK — ${archetypes.length} archétypes, ${attributs.length} attributs, ` +
    `${courbes.length} courbes distinctes, ${playStyles.length} PlayStyles.`
)
