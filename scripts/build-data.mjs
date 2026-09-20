/**
 * data/fc27-data.xlsx  ->  src/data/fc27.json
 *
 *   npm run data
 *
 * Chaque onglet a une note en ligne 1, une ligne vide en 2, les en-têtes en 3.
 */
import * as XLSX from 'xlsx'
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(ROOT, 'data', 'fc27-data.xlsx')
const CIBLE = join(ROOT, 'data', 'fc27.json')

const wb = XLSX.read(readFileSync(SOURCE), { type: 'buffer' })

const lire = (nom) => {
  const ws = wb.Sheets[nom]
  if (!ws) throw new Error(`Onglet manquant : ${nom}`)
  return XLSX.utils
    .sheet_to_json(ws, { range: 2, defval: null })
    .filter((r) => r.archetype !== null || r.id !== null || r.courbe !== null || r.niveau !== null || r.nom !== null)
}

const nb = (v) => (v === null || v === '' ? null : Number(v))
const txt = (v) => (v === null ? '' : String(v).trim())
const oui = (v) => /^(oui|yes|true|1|x)$/i.test(txt(v))

/* ---------------------------------------------------------------- attributs */

const attributs = lire('Attributs').map((r) => ({
  id: txt(r.id),
  nom: txt(r.nom),
  categorie: txt(r.categorie),
}))
const idsAttr = new Set(attributs.map((a) => a.id))

/* ------------------------------------------------------------------ courbes */

const courbes = {}
for (const r of lire('Courbes')) {
  const nom = txt(r.courbe)
  if (!nom) continue
  ;(courbes[nom] ||= []).push({ min: nb(r.valeur_min), max: nb(r.valeur_max), cout: nb(r.cout) })
}
for (const [nom, plages] of Object.entries(courbes)) {
  plages.sort((a, b) => a.min - b.min)
  for (let i = 1; i < plages.length; i++) {
    if (plages[i].min <= plages[i - 1].max) {
      throw new Error(`Courbes "${nom}" : les plages ${plages[i - 1].min}-${plages[i - 1].max} et ${plages[i].min}-${plages[i].max} se chevauchent`)
    }
  }
}

/* -------------------------------------------------------------------- stats */

const stats = {}
for (const r of lire('Stats')) {
  const arch = txt(r.archetype)
  const attr = txt(r.attribut)
  if (!arch || !attr) continue
  if (!idsAttr.has(attr)) throw new Error(`Stats : attribut inconnu "${attr}" (archétype ${arch})`)
  const courbe = txt(r.courbe) || 'A'
  if (!courbes[courbe]) throw new Error(`Stats : courbe inconnue "${courbe}" (${arch} / ${attr})`)
  const base = nb(r.base) ?? 0
  const min = nb(r.limite_min) ?? base
  const max = nb(r.limite_max) ?? base
  if (base < min || base > max) {
    throw new Error(`Stats : ${arch} / ${attr} — base ${base} hors des limites ${min}-${max}`)
  }
  ;(stats[arch] ||= {})[attr] = { base, min, max, courbe, cle: oui(r.cle) }
}

/* -------------------------------------------------------------------- corps */

const corps = {}
for (const r of lire('Corps')) {
  const arch = txt(r.archetype)
  if (!arch) continue
  corps[arch] = {
    taille: { base: nb(r.taille_base), min: nb(r.taille_min), max: nb(r.taille_max) },
    poids: { base: nb(r.poids_base), min: nb(r.poids_min), max: nb(r.poids_max) },
  }
}

/* -------------------------------------------------------------- archétypes */

const archetypes = lire('Archetypes').map((r) => {
  const id = txt(r.id)
  if (!stats[id]) throw new Error(`Stats : aucune ligne pour l'archétype "${id}"`)
  const manquants = attributs.filter((a) => !stats[id][a.id]).map((a) => a.id)
  if (manquants.length) throw new Error(`Stats : ${id} — attributs manquants : ${manquants.join(', ')}`)
  return {
    id,
    nom: txt(r.nom_fr) || txt(r.nom),
    nomEn: txt(r.nom),
    groupe: txt(r.groupe),
    positions: txt(r.positions),
    inspiration: txt(r.inspiration),
    signature: txt(r.playstyle_signature),
    description: txt(r.description),
    stats: stats[id],
    corps: corps[id] || null,
  }
})

/* ------------------------------------------------------- niveaux, playstyles */

const niveaux = lire('Niveaux').map((r) => ({
  niveau: nb(r.niveau),
  gain: nb(r.ap_gagnes),
  cumul: nb(r.ap_cumules),
}))

const playStyles = lire('PlayStyles').map((r) => {
  const exigences = []
  for (const i of [1, 2, 3]) {
    const a = txt(r[`attribut_${i}`])
    const s = nb(r[`seuil_${i}`])
    if (a && s) {
      if (!idsAttr.has(a)) throw new Error(`PlayStyles "${txt(r.nom)}" : attribut inconnu "${a}"`)
      exigences.push({ attribut: a, seuil: s })
    }
  }
  return { nom: txt(r.nom), categorie: txt(r.categorie), exigences }
})

/* ------------------------------------------------------------------ sortie */

const data = {
  jeu: 'FC 27',
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
    `${Object.keys(courbes).length} courbes, ${playStyles.length} PlayStyles.`
)
