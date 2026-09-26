const fr = {
  language: {
    french: 'Français',
    english: 'English',
  },

  app: {
    title: 'Constructeur de build Pro Clubs',
    subtitle:
      'Choisissez un archétype, dépensez vos points d’attribut et visualisez en temps réel le coût du prochain point.',
  },

  actions: {
    reset: 'Tout remettre à zéro',
    copy: 'Copier le lien du build',
    copied: 'Lien copié',
  },

  header: {
    tagline:
      'Choisissez un archétype, dépensez vos points d’attribut et visualisez en temps réel le coût du prochain point.',
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
    starsOf: (value, max) =>
      `${value} étoiles sur ${max}`,
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
      conduite: 'Conduite de balle',
      dribbles: 'Dribbles',
      calme: 'Calme',
      pos_off: 'Positionnement Off.',
      finition: 'Finition',
      puissance_tir: 'Puissance de tir',
      tir_loin: 'Tir de loin',
      volees: 'Volées',
      penaltys: 'Pénaltys',
      vista: 'Vista',
      centres: 'Centres',
      precision_cf: 'Précision CF',
      passes_courtes: 'Passes Courtes',
      passes_longues: 'Passes Longues',
      effet: 'Effet',
      interceptions: 'Interceptions',
      precision_tete: 'Précision de tête',
      sens_defensif: 'Lucidité déf.',
      tacle_debout: 'Tacle debout',
      tacle_glisse: 'Tacle glissé',
      acceleration: 'Accélération',
      vitesse: 'Vitesse',
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
    thresholdsNotMet: 'Conditions non remplies',
    playstyles: 'Styles de jeu',
    equipped: 'Équipé',
    freeSlot: 'Emplacement vide',
    additionalBonuses: 'Bonus supplémentaires',
  },

  specialisations: {
    title: 'Spécialisation',
    choose: 'Choisir une spécialisation',
    description:
      'Le coût affiché correspond aux points d’attribut manquants nécessaires pour atteindre les seuils.',
    empty:
      'Aucune spécialisation définie pour cet archétype.',
    acquired: 'Acquise',

    names: {
      'Aucune': 'Aucune',
      'Facilitateur+': 'Facilitateur+',
      'Pionnier': 'Pionnier',
      'Vigile': 'Vigile',
      'Boss+': 'Boss+',
      'Passage en force': 'Passage en force',
      'Capitano': 'Capitano',
      'Traqueur+': 'Traqueur+',
      'Bolide': 'Bolide',
      'Athlète': 'Athlète',
      'Trouble-fête+': 'Trouble-fête+',
      'Intraitable': 'Intraitable',
      'Pilier': 'Pilier',
      'Récupérateur+': 'Récupérateur+',
      'Pilote': 'Pilote',
      'Pickpocket': 'Pickpocket',
      'Maestro+': 'Maestro+',
      'Démolisseur': 'Démolisseur',
      'Fiable': 'Fiable',
      'Créateur+': 'Créateur+',
      'Architecte': 'Architecte',
      'Sniper': 'Sniper',
      'Étincelle+': 'Étincelle+',
      'Joker': 'Joker',
      'As': 'As',
      'Magicien+': 'Magicien+',
      'Surdoué': 'Surdoué',
      'Envahisseur': 'Envahisseur',
      'Finisseur+': 'Finisseur+',
      'Sangsue': 'Sangsue',
      'Chasseur': 'Chasseur',
      "Point d'appui+": "Point d'appui+",
      'Électron libre': 'Électron libre',
      'Coureur': 'Coureur',
    },
  },

  playstyles: {
    add: 'Ajouter un style de jeu',
    choose: 'Choisir un style de jeu',
    description:
      'Le coût affiché correspond aux points d’attribut manquants nécessaires pour atteindre les seuils.',
    empty:
      'Aucun style de jeu accessible pour cet archétype.',
    locked: 'Style de jeu verrouillé',
    insufficientAp: 'AP insuffisants',
    noDetails: 'Aucun détail disponible',
    cost: 'Coût',
    missing: 'Manquant',
    hoverDetails:
      'Survolez un style de jeu pour voir ses détails',
    cheapestPerks:
      '5 atouts les moins chers',
    mostExpensivePerks:
      '5 atouts les plus chers',

    equipped: 'équipé',
    freeSlot: 'emplacement vide',
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
    title: 'Classement des coûts des attributs',
    withBonuses: 'Avec bonus / malus',
    withoutBonuses: 'Sans bonus / malus',
    withBonusesDescription:
      'Coût en AP pour chaque attribut en tenant compte de tes bonus/malus actuels (taille, poids, maîtrises et installations du club).',
    withoutBonusesDescription:
      'Coût en AP pour augmenter chaque attribut de sa valeur actuelle jusqu’à la cible, sans tenir compte des bonus/malus (taille, poids, maîtrises et installations du club). Les attributs les moins chers sont affichés en premier.',
    bonusWarning:
      'Rappel : les bonus/malus ne comptent pas pour débloquer les styles de jeu.',
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
    noData: 'Aucune donnée d’installation disponible',
    close: 'Fermer',
  },

  masteries: {
    title: 'Maîtrises',
    archetype: 'Archétype',
    level: 'Niveau',
    instructions:
      "Cliquez sur le niveau 'nombre' pour valider toutes les maîtrises de ce palier",
    close: 'Fermer',
  },

  infosPro: {
    title: 'Infos pro',
    male: 'Homme',
    female: 'Femme',
    height: 'Taille',
    weight: 'Poids',
    runningType: 'Style de course',
  },

  jauge: {
    remainingAp: 'AP restants',
    archetypeLevel: 'Niveau d’archétype',
  },

  bonusStats: {
    adjustment:
      'Ajustement taille/poids et maîtrises',
  },

  footer: {
    createdBy:
      'Fait par Klebar et Loup (Symphonyyyyyyyyyyy)',
    disclaimer:
      'Site non affilié à EA Sports.',
  },

  stats: {
    skillMoves: 'Gestes techniques',
    weakFoot: 'Mauvais pied',
  },

  common: {
    yes: 'Oui',
    no: 'Non',
    none: 'Aucun',
    current: 'Actuel',
    target: 'Cible',
    total: 'Total',
    available: 'Disponible',
    max: 'Max',
    close: 'Fermer',
    cost: 'Coût',
    missing: 'Manquant',
  },
}

export default fr