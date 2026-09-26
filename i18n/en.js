const en = {
  language: {
    french: 'Français',
    english: 'English',
  },

  app: {
    title: 'Pro Clubs Build Builder',
    subtitle:
      'Choose an archetype, spend your attribute points, and see the next point cost update in real time.',
  },

  actions: {
    reset: 'Reset everything',
    copy: 'Copy build link',
    copied: 'Link copied',
  },

  header: {
    tagline:
      'Choose an archetype, spend your attribute points, and see the next point cost update in real time.',
    adjustments: {
      show: 'Show adjustments',
      hide: 'Hide adjustments',
    },
  },

  attributes: {
    title: 'Attributes',
    cost: 'Cost',
    ap: 'AP',
    min: 'MIN',
    max: 'MAX',
    increase: 'Increase',
    decrease: 'Decrease',
    average: 'avg',
    starsOf: (value, max) => `${value} stars out of ${max}`,
    lower: 'Decrease',
    raise: 'Increase',

    categories: {
      ballControl: 'Ball Control',
      shooting: 'Shooting',
      passing: 'Passing',
      defense: 'Defense',
      pace: 'Pace',
      physical: 'Physical',
      other: 'Other',
    },

    names: {
      agilite: 'Agility',
      equilibre: 'Balance',
      reactivite: 'Reactions',
      conduite: 'Ball Control',
      dribbles: 'Dribbling',
      calme: 'Composure',
      pos_off: 'Attacking Positioning',
      finition: 'Finishing',
      puissance_tir: 'Shot Power',
      tir_loin: 'Long Shots',
      volees: 'Volleys',
      penaltys: 'Penalties',
      vista: 'Vision',
      centres: 'Crossing',
      precision_cf: 'Free Kick Accuracy',
      passes_courtes: 'Short Passing',
      passes_longues: 'Long Passing',
      effet: 'Curve',
      interceptions: 'Interceptions',
      precision_tete: 'Heading Accuracy',
      sens_defensif: 'Defensive Awareness',
      tacle_debout: 'Standing Tackle',
      tacle_glisse: 'Sliding Tackle',
      acceleration: 'Acceleration',
      vitesse: 'Sprint Speed',
      detente: 'Jumping',
      endurance: 'Stamina',
      force: 'Strength',
      agressivite: 'Aggression',
      gestes: 'Skill Moves',
      mauvais_pied: 'Weak Foot',
    },
  },

  body: {
    title: 'Body',
    height: 'Height',
    weight: 'Weight',
  },

  archetypes: {
    title: 'Archetypes',
    goalkeeper: 'Goalkeeper',
    defense: 'Defense',
    midfield: 'Midfield',
    attack: 'Attack',
  },

  bandeau: {
    specialization: 'Specialization',
    specializationSlot: 'Choose a specialization',
    thresholdsNotMet: 'Requirements not met',
    playstyles: 'PlayStyles',
    equipped: 'Equipped',
    freeSlot: 'Empty slot',
    additionalBonuses: 'Additional bonuses',
  },

  specialisations: {
    title: 'Specialization',
    choose: 'Choose a specialization',
    description:
      'The displayed cost corresponds to the missing attribute points required to reach the thresholds.',
    empty:
      'No specialization defined for this archetype.',
    acquired: 'Acquired',
    names: {
    'Aucune': 'None',

    // Facilitateur
    'Facilitateur+': 'Progressor+',
    'Pionnier': 'Pioneer',
    'Vigile': 'Sentinel',

    // Boss
    'Boss+': 'Boss+',
    'Passage en force': 'Enforcer',
    'Capitano': 'Captain',

    // Traqueur
    'Traqueur+': 'Marauder+',
    'Bolide': 'Speedster',
    'Athlète': 'Athlete',

    // Trouble-fête
    'Trouble-fête+': 'Disruptor+',
    'Intraitable': 'Unstoppable',
    'Pilier': 'Pillar',

    // Récupérateur
    'Récupérateur+': 'Recycler+',
    'Pilote': 'Driver',
    'Pickpocket': 'Pickpocket',

    // Maestro
    'Maestro+': 'Maestro+',
    'Démolisseur': 'Destroyer',
    'Fiable': 'Reliable',

    // Créateur
    'Créateur+': 'Creator+',
    'Architecte': 'Architect',
    'Sniper': 'Sniper',

    // Étincelle
    'Étincelle+': 'Spark+',
    'Joker': 'Wildcard',
    'As': 'Ace',

    // Magicien
    'Magicien+': 'Magician+',
    'Surdoué': 'Prodigy',
    'Envahisseur': 'Invader',

    // Finisseur
    'Finisseur+': 'Finisher+',
    'Sangsue': 'Leech',
    'Chasseur': 'Hunter',

    // Point d'appui
    "Point d'appui+": 'Target+',
    'Électron libre': 'Free Spirit',
    'Coureur': 'Runner',
    },
  },

  playstyles: {
    add: 'Add a PlayStyle',
    choose: 'Choose a PlayStyle',
    description:
      'The displayed cost corresponds to the missing attribute points required to reach the thresholds.',
    empty:
      'No PlayStyle is reachable for this archetype.',
    locked: 'Locked PlayStyle',
    insufficientAp: 'Not enough AP',
    noDetails: 'No details available',
    cost: 'Cost',
    missing: 'Missing',
    hoverDetails:
      'Hover over a PlayStyle to see its details',
    cheapestPerks:
      '5 cheapest perks',
    mostExpensivePerks:
      '5 most expensive perks',

    equipped: 'equipped',
    freeSlot: 'empty slot',
    thresholdsLost:
      'The thresholds are no longer met',

    categories: {
      'Buts': 'Goals',
      'Passes': 'Passing',
      'Défense': 'Defending',
      'Conduite de balle': 'Ball Control',
      'Physique': 'Physical',
    },
  },

  rankings: {
    title: 'Attribute cost ranking',

    withBonuses: 'With bonuses / penalties',
    withoutBonuses: 'Without bonuses / penalties',

    withBonusesDescription:
      'AP cost for each attribute, taking your current bonuses/penalties into account (height, weight, masteries, club facilities).',

    withoutBonusesDescription:
      'AP cost to raise each attribute from its current value to the target, without taking bonuses/penalties into account (height, weight, masteries, club facilities). Cheapest attributes are shown first.',

    bonusWarning:
      'Reminder: bonuses/penalties do not count towards PlayStyle unlock requirements.',

    columns: {
      minMax: 'CURRENT → MAX',
      min80: 'CURRENT → 80',
      min85: 'CURRENT → 85',
      min90: 'CURRENT → 90',
    },
  },

  facilities: {
    title: 'Club Facilities',
    level: 'Level',
    bonus: 'Bonus',
    cost: 'Cost',
    installation: 'Facility',
    level1: 'Level 1',
    level2: 'Level 2',
    level3: 'Level 3',
    deselectAll: 'Deselect all',
    totalCost: 'Total cost',
    noData: 'No facility data available',
    close: 'Close',

    names: {
      'analyste-des-perf': 'Performance Analyst',
      'bottes-de-compression': 'Compression Boots',
      'coach-passes': 'Passing Coach',
      'coach-tacles': 'Tackling Coach',
      'coach-tactique-attaque': 'Attacking Tactical Coach',
      'coach-tactique-defense': 'Defensive Tactical Coach',
      'coach-technique': 'Technical Coach',
      'coach-tirs': 'Shooting Coach',
      'entretien-des-terrains': 'Pitch Maintenance',
      'equipe-de-prep-physique': 'Physical Preparation Team',
      'exercice-d-agilite': 'Agility Drill',
      'exercice-de-finition-rapide': 'Quick Finishing Drill',
      'exercice-de-force': 'Strength Drill',
      'exercice-de-passe': 'Passing Drill',
      'exercice-tir-rasant-appuye': 'Low Driven Shot Drill',
      'filet-de-finition': 'Finishing Net',
      'filet-de-futnet': 'Footvolley Net',
      'gilets-gps': 'GPS Vests',
      'mannequins-coup-de-pied-arrete': 'Free Kick Dummies',
      'mini-cages': 'Mini Goals',
      'parachute-de-vitesse': 'Speed Parachute',
      'piquets-de-slalom': 'Slalom Poles',
      'piste-d-athletisme': 'Athletics Track',
      'prof-de-yoga': 'Yoga Instructor',
      'psychologue-du-sport': 'Sports Psychologist',
      'rebondisseurs': 'Rebounders',
      'recruteur': 'Scout',
      'responsable-du-materiel': 'Equipment Manager',
      'salle-de-musculation': 'Gym',
      'salle-rv': 'VR Room',
      'scientifique-du-sport': 'Sports Scientist',
      'terrain-d-entrainement': 'Training Pitch',
    },
  },

  masteries: {
    title: 'Masteries',
    archetype: 'Archetype',
    level: 'Level',
    instructions:
      "Click on Level 'number' to validate all masteries for that tier",
    close: 'Close',
  },

  infosPro: {
    title: 'Pro info',
    male: 'Male',
    female: 'Female',
    height: 'Height',
    weight: 'Weight',
    runningType: 'Running style',
  },

  jauge: {
    remainingAp: 'AP remaining',
    archetypeLevel: 'Archetype level',
  },

  bonusStats: {
    adjustment: 'Height/weight and mastery adjustment',
  },

  footer: {
    createdBy: 'Made by Klebar and Loup (Symphonyyyyyyyyyyy)',
    disclaimer: 'Not affiliated with EA Sports.',
  },

  stats: {
    skillMoves: 'Skill Moves',
    weakFoot: 'Weak Foot',
  },

  common: {
    yes: 'Yes',
    no: 'No',
    none: 'None',
    current: 'Current',
    target: 'Target',
    total: 'Total',
    available: 'Available',
    max: 'Max',
    close: 'Close',
    cost: 'Cost',
    missing: 'Missing',
  },
}

export default en