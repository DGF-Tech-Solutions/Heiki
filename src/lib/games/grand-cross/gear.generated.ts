/**
 * L'equipaggiamento di Grand Cross: set, parti, valori per rarita', effetti bonus,
 * e come si impilano gli strati delle icone.
 *
 * FONTE: il client, via python script/equipaggiamento.py (eroi/equipaggiamento.json;
 * lo studio e' EQUIPAGGIAMENTO.md nella radice della pipeline).
 *
 * GENERATO DA scripts/import-gear.mts - NON MODIFICARE A MANO.
 */

import type { GearIndex } from "../gear-types";

export const GEAR: GearIndex = {
  "rules": {
    "upgradesPerAwakening": 5,
    "awakenings": 5,
    "optionStep": 0.1,
    "obtainableRatings": [
      1,
      2,
      3,
      4,
      5
    ]
  },
  "sets": [
    {
      "id": 1,
      "name": {
        "it": "Carica",
        "en": "Onslaught"
      },
      "pieces": 4,
      "stat": "atk",
      "mode": "percent",
      "value": 20,
      "obtainable": true
    },
    {
      "id": 7,
      "name": {
        "it": "Muro di ferro",
        "en": "Iron Wall"
      },
      "pieces": 2,
      "stat": "def",
      "mode": "percent",
      "value": 20,
      "obtainable": true
    },
    {
      "id": 2,
      "name": {
        "it": "Vita",
        "en": "Life"
      },
      "pieces": 4,
      "stat": "hp",
      "mode": "percent",
      "value": 20,
      "obtainable": true
    },
    {
      "id": 3,
      "name": {
        "it": "Concentrazione",
        "en": "Concentration"
      },
      "pieces": 4,
      "stat": "critPer",
      "mode": "points",
      "value": 30,
      "obtainable": true
    },
    {
      "id": 6,
      "name": {
        "it": "Occhio della mente",
        "en": "Mind's Eye"
      },
      "pieces": 2,
      "stat": "critResPer",
      "mode": "points",
      "value": 30,
      "obtainable": true
    },
    {
      "id": 10,
      "name": {
        "it": "Recupero",
        "en": "Recovery"
      },
      "pieces": 2,
      "stat": "hpRecoveryPer",
      "mode": "points",
      "value": 20,
      "obtainable": true
    },
    {
      "id": 8,
      "name": {
        "it": "Congenialità",
        "en": "Congeniality"
      },
      "pieces": 2,
      "stat": "critAtkPer",
      "mode": "points",
      "value": 20,
      "obtainable": true
    },
    {
      "id": 11,
      "name": {
        "it": "Forza d'animo",
        "en": "Fortitude"
      },
      "pieces": 2,
      "stat": "critDefPer",
      "mode": "points",
      "value": 40,
      "obtainable": true
    },
    {
      "id": 12,
      "name": {
        "it": "Furto di vita",
        "en": "Lifesteal"
      },
      "pieces": 2,
      "stat": "hpStealPer",
      "mode": "points",
      "value": 15,
      "obtainable": true
    },
    {
      "id": 4,
      "name": {
        "it": "Pazienza",
        "en": "Patience"
      },
      "pieces": 2,
      "stat": "fixedDefPer",
      "mode": "points",
      "value": 10,
      "obtainable": false
    },
    {
      "id": 5,
      "name": {
        "it": "Perforazione",
        "en": "Pierce"
      },
      "pieces": 4,
      "stat": "fixedAtkPer",
      "mode": "points",
      "value": 20,
      "obtainable": false
    },
    {
      "id": 9,
      "name": {
        "it": "Rigenerazione",
        "en": "Regeneration"
      },
      "pieces": 4,
      "stat": "hpRegenPer",
      "mode": "points",
      "value": 20,
      "obtainable": false
    }
  ],
  "parts": [
    {
      "part": 1,
      "name": {
        "it": "Braccialetto",
        "en": "Bracelet"
      },
      "stat": "atk",
      "group": 1
    },
    {
      "part": 2,
      "name": {
        "it": "Collana",
        "en": "Necklace"
      },
      "stat": "def",
      "group": 2
    },
    {
      "part": 3,
      "name": {
        "it": "Cintura",
        "en": "Belt"
      },
      "stat": "hp",
      "group": 3
    },
    {
      "part": 4,
      "name": {
        "it": "Anello",
        "en": "Ring"
      },
      "stat": "atk",
      "group": 1
    },
    {
      "part": 5,
      "name": {
        "it": "Orecchini",
        "en": "Earrings"
      },
      "stat": "def",
      "group": 2
    },
    {
      "part": 6,
      "name": {
        "it": "Runa",
        "en": "Rune"
      },
      "stat": "hp",
      "group": 3
    }
  ],
  "values": {
    "1": {
      "1": {
        "min": 90,
        "max": 120,
        "step": 4
      },
      "2": {
        "min": 120,
        "max": 160,
        "step": 6
      },
      "3": {
        "min": 180,
        "max": 240,
        "step": 10
      },
      "4": {
        "min": 270,
        "max": 360,
        "step": 16
      },
      "5": {
        "min": 390,
        "max": 520,
        "step": 24
      },
      "6": {
        "min": 510,
        "max": 680,
        "step": 32
      }
    },
    "2": {
      "1": {
        "min": 45,
        "max": 60,
        "step": 2
      },
      "2": {
        "min": 61,
        "max": 80,
        "step": 4
      },
      "3": {
        "min": 91,
        "max": 120,
        "step": 6
      },
      "4": {
        "min": 135,
        "max": 180,
        "step": 8
      },
      "5": {
        "min": 195,
        "max": 260,
        "step": 12
      },
      "6": {
        "min": 255,
        "max": 340,
        "step": 16
      }
    },
    "3": {
      "1": {
        "min": 900,
        "max": 1200,
        "step": 40
      },
      "2": {
        "min": 1200,
        "max": 1600,
        "step": 60
      },
      "3": {
        "min": 1800,
        "max": 2400,
        "step": 100
      },
      "4": {
        "min": 2700,
        "max": 3600,
        "step": 160
      },
      "5": {
        "min": 3900,
        "max": 5200,
        "step": 240
      },
      "6": {
        "min": 5100,
        "max": 6800,
        "step": 320
      }
    },
    "4": {
      "1": {
        "min": 60,
        "max": 80,
        "step": 2
      },
      "2": {
        "min": 75,
        "max": 100,
        "step": 3
      },
      "3": {
        "min": 105,
        "max": 140,
        "step": 5
      },
      "4": {
        "min": 150,
        "max": 200,
        "step": 8
      },
      "5": {
        "min": 210,
        "max": 280,
        "step": 12
      },
      "6": {
        "min": 270,
        "max": 360,
        "step": 16
      }
    },
    "5": {
      "1": {
        "min": 30,
        "max": 40,
        "step": 1
      },
      "2": {
        "min": 38,
        "max": 50,
        "step": 2
      },
      "3": {
        "min": 53,
        "max": 70,
        "step": 3
      },
      "4": {
        "min": 75,
        "max": 100,
        "step": 4
      },
      "5": {
        "min": 105,
        "max": 140,
        "step": 6
      },
      "6": {
        "min": 135,
        "max": 180,
        "step": 8
      }
    },
    "6": {
      "1": {
        "min": 600,
        "max": 800,
        "step": 20
      },
      "2": {
        "min": 750,
        "max": 1000,
        "step": 30
      },
      "3": {
        "min": 1050,
        "max": 1400,
        "step": 50
      },
      "4": {
        "min": 1500,
        "max": 2000,
        "step": 80
      },
      "5": {
        "min": 2100,
        "max": 2800,
        "step": 120
      },
      "6": {
        "min": 2700,
        "max": 3600,
        "step": 160
      }
    }
  },
  "options": [
    {
      "id": 1,
      "group": 1,
      "name": {
        "it": "Attacco",
        "en": "Attack"
      },
      "stat": "atk",
      "mode": "percent",
      "min": 1,
      "max": 3
    },
    {
      "id": 2,
      "group": 1,
      "name": {
        "it": "Perforazione",
        "en": "Pierce"
      },
      "stat": "fixedAtkPer",
      "mode": "points",
      "min": 2,
      "max": 6
    },
    {
      "id": 3,
      "group": 1,
      "name": {
        "it": "Possibilità critico",
        "en": "Crit Chance"
      },
      "stat": "critPer",
      "mode": "points",
      "min": 1.5,
      "max": 4.5
    },
    {
      "id": 4,
      "group": 1,
      "name": {
        "it": "Danno critico",
        "en": "Crit Damage"
      },
      "stat": "critAtkPer",
      "mode": "points",
      "min": 2,
      "max": 6
    },
    {
      "id": 5,
      "group": 2,
      "name": {
        "it": "Difesa",
        "en": "Defense"
      },
      "stat": "def",
      "mode": "percent",
      "min": 1,
      "max": 3
    },
    {
      "id": 6,
      "group": 2,
      "name": {
        "it": "Resistenza",
        "en": "Resistance"
      },
      "stat": "fixedDefPer",
      "mode": "points",
      "min": 2,
      "max": 6
    },
    {
      "id": 7,
      "group": 2,
      "name": {
        "it": "Resistenza critico",
        "en": "Crit Resistance"
      },
      "stat": "critResPer",
      "mode": "points",
      "min": 1.5,
      "max": 4.5
    },
    {
      "id": 8,
      "group": 2,
      "name": {
        "it": "Difesa critico",
        "en": "Crit Defense"
      },
      "stat": "critDefPer",
      "mode": "points",
      "min": 2,
      "max": 6
    },
    {
      "id": 9,
      "group": 3,
      "name": {
        "it": "PS",
        "en": "HP"
      },
      "stat": "hp",
      "mode": "percent",
      "min": 1,
      "max": 3
    },
    {
      "id": 10,
      "group": 3,
      "name": {
        "it": "Velocità di rigenerazione",
        "en": "Regeneration Rate"
      },
      "stat": "hpRegenPer",
      "mode": "points",
      "min": 2,
      "max": 6
    },
    {
      "id": 11,
      "group": 3,
      "name": {
        "it": "Velocità di recupero",
        "en": "Recovery Rate"
      },
      "stat": "hpRecoveryPer",
      "mode": "points",
      "min": 2,
      "max": 6
    },
    {
      "id": 12,
      "group": 3,
      "name": {
        "it": "Furto di vita",
        "en": "Lifesteal"
      },
      "stat": "hpStealPer",
      "mode": "points",
      "min": 1.5,
      "max": 4.5
    }
  ],
  "icons": {
    "size": 128,
    "objectBox": [
      4,
      4,
      120,
      120
    ],
    "setBox": [
      89,
      -3,
      44,
      44
    ],
    "order": {
      "gear": [
        "sfondo",
        "oggetto",
        "cornice",
        "esagono",
        "lettera",
        "stelle",
        "piu",
        "set"
      ],
      "costume": [
        "sfondo",
        "oggetto",
        "cornice",
        "marchio",
        "lettera"
      ]
    },
    "rarity": {
      "1": "C",
      "2": "UC",
      "3": "R",
      "4": "SR",
      "5": "SSR",
      "6": "UR",
      "7": "LR"
    },
    "layers": [
      "cornice_1",
      "cornice_2",
      "cornice_3",
      "cornice_4",
      "cornice_5",
      "cornice_6",
      "cornice_7",
      "esagono",
      "lettera_1",
      "lettera_2",
      "lettera_3",
      "lettera_4",
      "lettera_5",
      "lettera_6",
      "lettera_7",
      "marchio_condiviso",
      "marchio_costume",
      "marchio_set",
      "piu_1",
      "piu_2",
      "piu_3",
      "piu_4",
      "piu_5",
      "set_1",
      "set_10",
      "set_11",
      "set_12",
      "set_2",
      "set_3",
      "set_4",
      "set_5",
      "set_6",
      "set_7",
      "set_8",
      "set_9",
      "sfondo_1",
      "sfondo_2",
      "sfondo_3",
      "sfondo_4",
      "sfondo_5",
      "sfondo_6",
      "sfondo_7",
      "stelle_1",
      "stelle_2",
      "stelle_3",
      "stelle_4",
      "stelle_5"
    ]
  },
  "pieceImages": [
    "10_1",
    "10_2",
    "10_3",
    "10_4",
    "10_5",
    "10_6",
    "11_1",
    "11_2",
    "11_3",
    "11_4",
    "11_5",
    "11_6",
    "12_1",
    "12_2",
    "12_3",
    "12_4",
    "12_5",
    "12_6",
    "1_1",
    "1_2",
    "1_3",
    "1_4",
    "1_5",
    "1_6",
    "2_1",
    "2_2",
    "2_3",
    "2_4",
    "2_5",
    "2_6",
    "3_1",
    "3_2",
    "3_3",
    "3_4",
    "3_5",
    "3_6",
    "4_1",
    "4_2",
    "4_3",
    "4_4",
    "4_5",
    "4_6",
    "5_1",
    "5_2",
    "5_3",
    "5_4",
    "5_5",
    "5_6",
    "6_1",
    "6_2",
    "6_3",
    "6_4",
    "6_5",
    "6_6",
    "7_1",
    "7_2",
    "7_3",
    "7_4",
    "7_5",
    "7_6",
    "8_1",
    "8_2",
    "8_3",
    "8_4",
    "8_5",
    "8_6",
    "9_1",
    "9_2",
    "9_3",
    "9_4",
    "9_5",
    "9_6"
  ],
  "slotImages": [
    1,
    2,
    3,
    4,
    5,
    6
  ]
};
