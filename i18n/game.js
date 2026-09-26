const en = {
  language: {
    french: 'Français',
    english: 'English',
  },

  app: {
    title: 'Pro Clubs Build Builder',
    subtitle:
      'Choose an archetype, spend your attribute points, and see the cost of the next point update in real time.',
  },

  actions: {
    reset: 'Reset everything',
    copy: 'Copy build link',
    copied: 'Link copied',
    hideAdjustments: '↺ Hide adjustments',
    showAdjustments: '+/− Show adjustments',
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
    starsOf: '{value} stars out of {max}',
    lower: 'Decrease',
    raise: 'Increase',
    adjustment: 'Height/weight adjustment',
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

  specializations: {
    title: 'Specialization',
    choose: 'Choose a specialization',
    add: 'Add a specialization',
    noneDefined:
      'No specialization is defined for this archetype.',
    explanation:
      'The displayed price corresponds to the missing attribute points required to reach the thresholds.',
    acquired: 'Acquired',
    cost: 'Cost',
  },

  bandeau: {
    specialization: 'Specialization',
    playstyles: 'PlayStyles',
    equipped: 'equipped',
    additionalBonuses: 'Additional bonuses',
    specializationSlot: 'specialization',
    freeSlot: 'empty slot',
    thresholdsNotMet: 'The requirements are no longer met',
  },

  playstyles: {
    title: 'PlayStyles',
    choose: 'Choose a PlayStyle',
    add: 'Add a PlayStyle',
    locked: 'Locked',
    unlocked: 'Unlocked',
    selected: 'Selected',
    unavailable: 'Unavailable',
    unaffordable: 'Not enough AP',
    requirements: 'Requirements',
    cost: 'Cost',
    level: 'Level',
    close: 'Close',
    noReachable:
      'No reachable PlayStyle for this archetype.',
    explanation:
      'The displayed price corresponds to the missing attribute points required to reach the thresholds.',
    noDetails: 'No details available',
    hoverDetails:
      'Hover over a PlayStyle to see its details',
    missingAp: 'Missing {value} AP',
    insufficientAp: 'Not enough AP',
    lockedAria: 'Locked PlayStyle',
    cheapest: '5 cheapest perks',
    mostExpensive: '5 most expensive perks',
    costAp: 'Cost: {value} AP',
  },

  rankings: {
    title: 'Attribute Cost Ranking',
    withoutBonuses: 'Without bonuses / penalties',
    withBonuses: 'With bonuses / penalties',

    currentToMax: 'CURRENT → MAX',
    currentTo80: 'CURRENT → 80',
    currentTo85: 'CURRENT → 85',
    currentTo90: 'CURRENT → 90',

    explanationWithout:
      'AP cost to raise each attribute from its current value to the target, without taking bonuses/penalties into account (height, weight, masteries, facilities). Cheapest first: this is the most AP-efficient order.',

    explanationWith:
      'AP cost for each attribute, taking your current bonuses/penalties into account (height, weight, masteries, club facilities).',

    reminder:
      '⚠️ Reminder: bonuses/penalties are not taken into account when unlocking PlayStyles.',
  },

  facilities: {
    title: 'Club Facilities',
    installation: 'Facility',
    level: 'Level',
    bonus: 'Bonus',
    cost: 'Cost',
    totalCost: 'Total cost',
    deselectAll: 'Deselect all',
    noData: 'No facility data available',
    close: 'Close',
    levelTitle: 'Level {level}',
    levelCost: 'Level {level}: {cost} costs',
  },

  masteries: {
    title: 'Masteries',
    close: 'Close',
    archetype: 'Archetype',
    level: 'Level',
    instruction:
      'You can click Level {level} to validate all masteries for this tier',
  },

  infosPro: {
    title: 'Pro Info',
    man: 'Male',
    woman: 'Female',
    height: 'Height',
    weight: 'Weight',
    runningType: 'Running Type',
    runningTypes: {
      lengthy: 'Lengthy',
      explosive: 'Explosive',
      controlled: 'Controlled',
    },
  },

  jauge: {
    remainingAp: 'AP remaining',
    archetypeLevel: 'Archetype level',
  },

  bonusStats: {
    adjustment: 'Height/weight adjustment',
  },

  stats: {
    skillMoves: 'Skill Moves',
    weakFoot: 'Weak Foot',
  },

  footer: {
    createdBy: 'Made by Klebar and Loup (Symphonyyyyyyyyyyy)',
    disclaimer: 'Not affiliated with EA Sports.',
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
    costAp: '{value} AP',
  },
}

export default en