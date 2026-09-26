const fr = {
  language: {
    french: 'Français',
    english: 'English',
  },

  app: {
    title: 'Constructeur de build Clubs Pro',
    subtitle:
      "Choisis un archétype, dépense tes points d'attribut, vois le prix du point suivant monter en temps réel.",
  },

  actions: {
    reset: 'Tout remettre à zéro',
    copy: 'Copier le lien du build',
    copied: 'Lien copié',
  },

  header: {
    tagline:
      "Choisis un archétype, dépense tes points d'attribut, vois le prix du point suivant monter en temps réel.",
    adjustments: {
      show: 'Afficher les ajustements',
      hide: 'Masquer les ajustements',
    },
  },

  attributes: {
    title: 'Attributs',
    cost: 'Coût',
    ap: 'AP',
    min: 'MIN',
    max: 'MAX',
    increase: 'Augmenter',
    decrease: 'Diminuer',
    average: 'moy',
    starsOf: (value, max) => `${value} étoiles sur ${max}`,
    lower: 'Diminuer',
    raise: 'Augmenter',

    categories: {
      ballControl: 'Conduite de balle',
      shooting: 'Tir',
      passing: 'Passes',
      defense: 'Défense',
      pace: 'Rapidité',
      physical: 'Physique',
      other: 'Autres',
    },

    names: {
      agilite: 'Agilité',
      equilibre: 'Équilibre',
      reactivite: 'Réactivité',
      conduite: 'Conduite',
      dribbles: 'Dribbles',
      calme: 'Calme',
      pos_off: 'Positionnement offensif',
      finition: 'Finition',
      puissance_tir: 'Puissance de tir',
      tir_loin: 'Tir de loin',
      volees: 'Volées',
      penaltys: 'Penaltys',
      vista: 'Vista',
      centres: 'Centres',
      precision_cf: 'Précision coups francs',
      passes_courtes: 'Passes courtes',
      passes_longues: 'Passes longues',
      effet: 'Effet',
      interceptions: 'Interceptions',
      precision_tete: 'Précision de tête',
      sens_defensif: 'Sens défensif',
      tacle_debout: 'Tacle debout',
      tacle_glisse: 'Tacle glissé',
      acceleration: 'Accélération',
      vitesse: 'Vitesse de sprint',
      detente: 'Détente',
      endurance: 'Endurance',
      force: 'Force',
      agressivite: 'Agressivité',
      gestes: 'Gestes techniques',
      mauvais_pied: 'Mauvais pied',
    },
  },

  body: {
    title: 'Corps',
    height: 'Taille',
    weight: 'Poids',
  },

  archetypes: {
    title: 'Archétypes',
    goalkeeper: 'Gardien',
    defense: 'Défense',
    midfield: 'Milieu',
    attack: 'Attaque',
  },

  bandeau: {
    specialization: 'Spécialisation',
    specializationSlot: 'Choisir une spécialisation',
    thresholdsNotMet: 'Seuils non atteints',
    playstyles: 'PlayStyles',
    equipped: 'Équipés',
    freeSlot: 'Emplacement libre',
    additionalBonuses: 'Bonus supplémentaires',
  },

specialisations: {
  title: 'Spécialisation',
  choose: 'Choisir une spécialisation',
  description:
    "Le prix affiché correspond aux points d'attribut manquants pour atteindre les seuils.",
  empty:
    'Aucune spécialisation définie pour cet archétype.',
  acquired: 'Acquis',

  names: {
    'Aucune': 'Aucune',

    // Facilitateur
    'Facilitateur+': 'Facilitateur+',
    'Pionnier': 'Pionnier',
    'Vigile': 'Vigile',

    // Boss
    'Boss+': 'Boss+',
    'Passage en force': 'Passage en force',
    'Capitano': 'Capitano',

    // Traqueur
    'Traqueur+': 'Traqueur+',
    'Bolide': 'Bolide',
    'Athlète': 'Athlète',

    // Trouble-fête
    'Trouble-fête+': 'Trouble-fête+',
    'Intraitable': 'Intraitable',
    'Pilier': 'Pilier',

    // Récupérateur
    'Récupérateur+': 'Récupérateur+',
    'Pilote': 'Pilote',
    'Pickpocket': 'Pickpocket',

    // Maestro
    'Maestro+': 'Maestro+',
    'Démolisseur': 'Démolisseur',
    'Fiable': 'Fiable',

    // Créateur
    'Créateur+': 'Créateur+',
    'Architecte': 'Architecte',
    'Sniper': 'Sniper',

    // Étincelle
    'Étincelle+': 'Étincelle+',
    'Joker': 'Joker',
    'As': 'As',

    // Magicien
    'Magicien+': 'Magicien+',
    'Surdoué': 'Surdoué',
    'Envahisseur': 'Envahisseur',

    // Finisseur
    'Finisseur+': 'Finisseur+',
    'Sangsue': 'Sangsue',
    'Chasseur': 'Chasseur',

    // Point d'appui
    "Point d'appui+": "Point d'appui+",
    'Électron libre': 'Électron libre',
    'Coureur': 'Coureur',
  },
},

  playstyles: {
    add: 'Ajouter un PlayStyle',
    choose: 'Choisir un PlayStyle',
    description:
      "Le prix affiché correspond aux points d'attribut manquants pour atteindre les seuils.",
    empty:
      'Aucun PlayStyle atteignable pour cet archétype.',
    locked: 'PlayStyle verrouillé',
    insufficientAp: 'AP insuffisants',
    noDetails: 'Aucun détail disponible',
    cost: 'Coût',
    missing: 'Manque',
    hoverDetails:
      'Survolez un PlayStyle pour voir ses détails',
    cheapestPerks:
      'Les 5 perks les moins chers',
    mostExpensivePerks:
      'Les 5 perks les plus chers',

    equipped: 'équipés',
    freeSlot: 'emplacement libre',
    thresholdsLost:
      'Les seuils ne sont plus atteints',

    categories: {
      'Buts': 'Buts',
      'Passes': 'Passes',
      'Défense': 'Défense',
      'Conduite de balle': 'Conduite de balle',
      'Physique': 'Physique',
    },
  },

  rankings: {
    title: "Classement des coûts d'attributs",

    withBonuses: 'Avec bonus / malus',
    withoutBonuses: 'Sans bonus / malus',

    withBonusesDescription:
      'Coût en AP pour chaque attribut, en tenant compte de tes bonus/malus actuels (taille, poids, maîtrises, installations du club).',

    withoutBonusesDescription:
      "Coût en AP pour amener chaque attribut de sa valeur actuelle jusqu'à la cible, sans tenir compte des bonus/malus (taille, poids, maîtrises, installations). Les moins chers en premier : c'est l'ordre le plus rentable pour dépenser tes AP.",

    bonusWarning:
      "Rappel : les bonus/malus ne sont pas pris en compte pour le déblocage des PlayStyles.",

    columns: {
      minMax: 'ACTUEL → MAX',
      min80: 'ACTUEL → 80',
      min85: 'ACTUEL → 85',
      min90: 'ACTUEL → 90',
    },
  },

  facilities: {
    title: 'Installations du club',
    level: 'Niveau',
    bonus: 'Bonus',
    cost: 'Coût',
    installation: 'Installation',
    level1: 'Niveau 1',
    level2: 'Niveau 2',
    level3: 'Niveau 3',
    deselectAll: 'Tout désélectionner',
    totalCost: 'Coût total',
    noData: "Aucune donnée d'installation disponible",
    close: 'Fermer',
  },

  masteries: {
    title: 'Maîtrises',
    archetype: 'Archétype',
    level: 'Niveau',
    instructions:
      "Vous pouvez cliquer sur Niveau 'nombre' pour valider toutes les maîtrises de ce palier",
    close: 'Fermer',
  },

  infosPro: {
    title: 'Infos pro',
    male: 'Homme',
    female: 'Femme',
    height: 'Taille',
    weight: 'Poids',
    runningType: 'Type de course',
  },

  jauge: {
    remainingAp: 'AP restants',
    archetypeLevel: "Niveau d'archétype",
  },

  bonusStats: {
    adjustment: 'Ajustement taille/poids et maîtrises',
  },

  footer: {
    createdBy: 'Fait par Klebar et Loup (Symphonyyyyyyyyyyy)',
    disclaimer: 'Site non affilié à EA Sports.',
  },

  stats: {
    skillMoves: 'Gestes techniques',
    weakFoot: 'Mauvais pied',
  },

  common: {
    yes: 'Oui',
    no: 'Non',
    none: 'Aucune',
    current: 'Actuel',
    target: 'Cible',
    total: 'Total',
    available: 'Disponible',
    max: 'Max',
    close: 'Fermer',
    cost: 'Coût',
    missing: 'Manque',
  },
}

export default fr