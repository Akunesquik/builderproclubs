/**
 * data/fc27-data.xlsx  ->  data/fc27.json
 *
 *   npm run data
 *
 *   Une feuille par archétype : lignes = attributs, colonnes = paliers de valeur.
 *   Les listes de paliers identiques sont dédupliquées dans data.courbes pour
 *   garder le JSON léger ; chaque attribut ne stocke que l'index de sa courbe.
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
  return { nom: tx(r.nom), nomFr: tx(r.nom_fr), categorie: tx(r.categorie), exigences }
})

/* -------------------------------------------- Installation Club ---- */

const installationsClubRows = lire('InstallationsClub')

const installationsMap = new Map()

for (const row of installationsClubRows) {
  const installation = tx(row['Installation'])
  const niveauStr = tx(row['Niveau'])

  if (!installation || !niveauStr) continue

  // Récupération du numéro de niveau
  const niveauMatch = niveauStr.match(/\d+/)

  if (!niveauMatch) continue

  const niveau = parseInt(niveauMatch[0], 10)

  if (niveau < 1 || niveau > 3) continue

  // Bonus
  const bonusValue = tx(row['Bonus d\'attributs'])
    .replace(/\r?\n/g, ' // ')

  // Style de jeu
  const styleJeu = tx(row['Style de jeu'])

  // Coût

  let cost = 0
  const costValue = row['Coût']

  if (
    costValue !== null &&
    costValue !== undefined &&
    costValue !== ''
  ) {
    if (typeof costValue === 'number') {
      cost = costValue
    } else {
      const cleanedCost = String(costValue)
        .replace(/[^\d,.-]/g, '')
        .replace(',', '.')

      const parsedCost = parseFloat(cleanedCost)

      if (!isNaN(parsedCost)) {
        cost = parsedCost
      }
    }
  }

  // Création de l'installation
  if (!installationsMap.has(installation)) {
    installationsMap.set(installation, {
      id: installation
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),

      nom: installation,

      niveaux: {
        1: {
          bonus: '',
          cost: 0,
          styleJeu: ''
        },
        2: {
          bonus: '',
          cost: 0,
          styleJeu: ''
        },
        3: {
          bonus: '',
          cost: 0,
          styleJeu: ''
        }
      }
    })
  }

  const inst = installationsMap.get(installation)

  inst.niveaux[niveau] = {
    bonus: bonusValue,
    cost,
    styleJeu: styleJeu === '-' ? '' : styleJeu
  }
}

// Conversion en tableau + tri alphabétique
const installationsClub = Array.from(
  installationsMap.values()
).sort((a, b) => a.nom.localeCompare(b.nom))

// Transformation des niveaux en tableau
for (const inst of installationsClub) {
  inst.niveaux = [1, 2, 3].map((niveau) => ({
    niveau,
    bonus: inst.niveaux[niveau].bonus,
    cost: inst.niveaux[niveau].cost,
    styleJeu: inst.niveaux[niveau].styleJeu
  }))
}

/* ------------------------------------------------------------ Maitrise ---- */

const maitrise = {}

for (const row of lire('Maitrise')) {
  const archetype = tx(row['Archétype'])

  if (!archetype) continue

  const maitriseArchetype = {}

  for (const palier of ['10', '30']) {
    const valeur = tx(row[palier])

    if (!valeur) {
      maitriseArchetype[palier] = []
      continue
    }

    maitriseArchetype[palier] = valeur
      .split(';')
      .map((bonus) => bonus.trim())
      .filter(Boolean)
      .map((bonus) => {
        // Exemple : "Passes Longues +1"
        const match = bonus.match(/^(.+?)\s*\+(\d+)$/)

        if (!match) {
          throw new Error(
            `Maitrise « ${archetype} » : bonus invalide « ${bonus} »`
          )
        }

        const nomAttribut = match[1].trim()
        const gain = Number(match[2])

        // Conversion du nom Excel vers l'id de l'attribut
        const attribut = attributs.find(
          (a) => a.id.toLowerCase() === nomAttribut.toLowerCase()
        )

        if (!attribut) {
          throw new Error(
            `Maitrise « ${archetype} » : attribut inconnu « ${nomAttribut} »`
          )
        }

        return {
          attribut: attribut.id,
          gain,
        }
      })
  }

  maitrise[archetype] = maitriseArchetype
}


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
  installationsClub,
  maitrise,
}

writeFileSync(CIBLE, JSON.stringify(data))
console.log('Build complete');