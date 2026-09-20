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
    .filter((r) => Object.values(r).some((v) => v !== null && v !== ''))
}

const nb = (v) => (v === null || v === '' ? null : Number(v))

const attributs = lire('Attributs').map((r) => ({
  id: String(r.id).trim(),
  nom: String(r.nom).trim(),
  categorie: String(r.categorie).trim(),
}))

const coutsAP = lire('CoutsAP')
  .map((r) => ({ min: nb(r.valeur_min), max: nb(r.valeur_max), cout: nb(r.cout_par_point) }))
  .sort((a, b) => a.min - b.min)

const niveaux = lire('Niveaux').map((r) => ({
  niveau: nb(r.niveau),
  gain: nb(r.ap_gagnes),
  cumul: nb(r.ap_cumules),
}))

const playStyles = lire('PlayStyles').map((r) => {
  const exigences = []
  for (const i of [1, 2, 3]) {
    const a = r[`attribut_${i}`]
    const s = nb(r[`seuil_${i}`])
    if (a && s) exigences.push({ attribut: String(a).trim(), seuil: s })
  }
  return { nom: String(r.nom).trim(), categorie: String(r.categorie || '').trim(), exigences }
})

// remises : archetype -> attribut -> multiplicateur
const remises = {}
for (const r of lire('CoutsRemises')) {
  const a = String(r.archetype).trim()
  const m = nb(r.multiplicateur)
  if (!m || m === 1) continue
  ;(remises[a] ||= {})[String(r.attribut).trim()] = m
}

const parArchetype = (nomOnglet) => {
  const out = {}
  for (const r of lire(nomOnglet)) {
    const id = String(r.archetype).trim()
    out[id] = Object.fromEntries(attributs.map((a) => [a.id, nb(r[a.id]) ?? 0]))
  }
  return out
}
const base = parArchetype('StatsBase')
const max = parArchetype('StatsMax')

const archetypes = lire('Archetypes').map((r) => {
  const id = String(r.id).trim()
  if (!base[id]) throw new Error(`StatsBase : ligne manquante pour l'archétype "${id}"`)
  if (!max[id]) throw new Error(`StatsMax : ligne manquante pour l'archétype "${id}"`)
  return {
    id,
    nom: String(r.nom).trim(),
    groupe: String(r.groupe).trim(),
    positions: String(r.positions || '').trim(),
    inspiration: String(r.inspiration || '').trim(),
    signature: String(r.playstyle_signature || '').trim(),
    description: String(r.description || '').trim(),
    base: base[id],
    max: max[id],
    remises: remises[id] || {},
  }
})

// contrôles de cohérence
const idsAttr = new Set(attributs.map((a) => a.id))
for (const ps of playStyles) {
  for (const e of ps.exigences) {
    if (!idsAttr.has(e.attribut)) throw new Error(`PlayStyles "${ps.nom}" : attribut inconnu "${e.attribut}"`)
  }
}
for (let i = 1; i < coutsAP.length; i++) {
  if (coutsAP[i].min <= coutsAP[i - 1].max) {
    throw new Error(`CoutsAP : les paliers ${coutsAP[i - 1].min}-${coutsAP[i - 1].max} et ${coutsAP[i].min}-${coutsAP[i].max} se chevauchent`)
  }
}

const data = {
  jeu: 'FC 27',
  attributs,
  categories: [...new Set(attributs.map((a) => a.categorie))],
  archetypes,
  coutsAP,
  niveaux,
  playStyles,
}

writeFileSync(CIBLE, JSON.stringify(data))
console.log(
  `OK — ${archetypes.length} archétypes, ${attributs.length} attributs, ${playStyles.length} PlayStyles, ${coutsAP.length} paliers de prix.`
)
