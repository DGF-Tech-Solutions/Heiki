/**
 * La Battaglia del Re Demone di Grand Cross.
 *
 * FONTE: il client, via python script/re_demone_divinita.py (eroi/re_demone_divinita.json).
 * Quattro difficolta' in catena, due fasi ciascuna; le regole sono le 134 sequenze di
 * DB_demonlord_rule. Lo studio: RE_DEMONE_DIVINITA.md.
 *
 * GENERATO DA scripts/import-endgame.mts - NON MODIFICARE A MANO.
 */

import type { DemonKingIndex } from "../endgame-types";

export const DEMON_KING: DemonKingIndex = {
 "name": {
  "it": "La Battaglia del Re Demone",
  "en": "Demon King Battle"
 },
 "unlock": {
  "it": "[Episodio 510] Guerriero del Purgatorio",
  "en": "[Episode 510] Warrior of Purgatory"
 },
 "guide": [
  {
   "it": "La Battaglia del Re Demone è una modalità di gioco difficile che richiede un'attenta preparazione.\\nLe regole imposte possono variare a seconda del livello di difficoltà; per questo è fondamentale impostare i Team A e B in modo che siano in grado di rispettare tali regole.\\n\\nA seguito di un avviso, il Re Demone impone al giocatore di rispettare 3 regole una volta trascorso un certo numero di turni.\\n\\nIn base all'ordine in cui gli eroi usano le loro abilità e reagiscono ad ogni regola, si stabilisce se il giocatore è riuscito o meno nell'impresa.\\n\\nIl contatore Wild aumenta di 1 per ogni abilità che rispetta le regole del Re Demone. L'Energia perniciosa aumenta di 1 per ogni abilità che non rispetta le regole del Re Demone.",
   "en": "The Demon King Battle is a challenging game mode that requires careful preparation.\\nVarious rules can be imposed depending on difficulty level, so setting Teams A and B that can respond to these rules is a basic step in preparing for the Demon King Battle.\\n\\nAfter a warning, the Demon King imposes 3 rules to the player every set number of turns.\\n\\nSuccess and failure are determined by the order in which heroes use their skills and respond to each rule.\\n\\nThe Wild counter goes up by 1 for every skill that abides by the Demon King's rules. Malicious Energy goes up by 1 for every skill that fails to abide by the Demon King's rules."
  },
  {
   "it": "Wild entra in battaglia e ti aiuta quando il contatore Wild corrisponde a 1 o un numero superiore. Più alto è il contatore, maggiore sarà l'impatto di Wild nella battaglia.",
   "en": "Wild enters the battle and aids you when the Wild counter is 1 or higher. The higher the counter, the greater the impact Wild makes in battle."
  },
  {
   "it": "Quando accumuli una certa quantità di Energia perniciosa, lo Status del Verdetto del Re Demone aumenta di 1. A ogni Status è associato un effetto distinto.\\n\\nSentenza di eliminazione si attiva quando il Verdetto del Re Demone raggiunge lo Status 3: entrambi i Team A e B vengono eliminati e la partita finisce. Evita di far arrivare il Verdetto del Re Demone allo Status 3.",
   "en": "When you accumulate a certain amount of Malicious Energy, the Demon King's Verdict tier increases by 1. Each tier has a unique effect attached to it.\\n\\nAnnihilation Sentence activates when the Demon King's Verdict reaches tier 3, annihilating both Teams A and B and ending the game. Be careful not to let the Demon King's Verdict reach tier 3."
  },
  {
   "it": "Attenendoti correttamente alle regole del Re Demone, Wild scomparirà, indebolendo temporaneamente il Re Demone e impedendo che le sue regole vengano imposte.\\n\\nSe non rispetti la Regola imposta dal Re Demone, quest'ultimo darà il suo Verdetto.\\n\\nIl Verdetto del Re Demone indebolisce i tuoi personaggi fino al termine della fase.\\n\\nA seconda della difficoltà della fase, tutte le squadre verranno eliminate se i Verdetti del Re Demone raggiungono un determinato numero.",
   "en": "If you successfully abide by the rules imposed by the Demon King, Wild will appear, temporarily weaken the Demon King, and prevent the next rule from being imposed.\\n\\nIf you fail to abide by the imposed Demon King's Rule, the Demon King will give his Verdict.\\n\\nThe Demon King's Verdict weakens your characters and lasts until the end of the stage.\\n\\nDepending on the stage difficulty, all teams will be annihilated if the Demon King's Verdicts reach a certain number."
  },
  {
   "it": "Il mancato rispetto delle regole imposte dal Re Demone determina un aumento di Energia perniciosa. Quando accumuli una certa quantità di Energia perniciosa, lo Status del Verdetto del Re Demone aumenta di 1. A ogni Status è associato un effetto distinto.",
   "en": "Failing to abide by the Demon King's rules causes Malicious Energy to build up. When you accumulate a certain amount of Malicious Energy, the Demon King's Verdict tier increases by 1. Each tier has a unique effect attached to it."
  },
  {
   "it": "Infrangere le Regole del Re Demone porta a un altro Verdetto del Re Demone.",
   "en": "Breaking the Demon King's Rules adds another Demon King's Verdict."
  },
  {
   "it": "Il Re Demone è un avversario formidabile che richiede preparazione. Prendi decisioni ponderate prima della resa dei conti.",
   "en": "The Demon King is a formidable foe that requires you to be prepared. Make your decisions carefully before the showdown."
  }
 ],
 "attempts": {
  "it": "Puoi affrontare il Re Demone.\\n*Avrai 1 tentativo a settimana di affrontare il Re Demone.",
  "en": "You can battle the Demon King.\\n※You will be given 1 weekly attempt to battle the Demon King."
 },
 "coinPoints": [
  {
   "rarity": "R",
   "points": 1
  },
  {
   "rarity": "SR",
   "points": 15
  },
  {
   "rarity": "SSR",
   "points": 225
  }
 ],
 "allyPassives": [
  "800002"
 ],
 "difficulties": [
  {
   "name": {
    "it": "Difficile",
    "en": "Hard"
   },
   "color": "#DF6100",
   "level": 1,
   "bossLevel": 150,
   "energy": 20,
   "gold": 10000,
   "power": 2000000,
   "clear": [
    {
     "id": "1260103",
     "count": 10
    }
   ],
   "drops": {
    "draws": 1,
    "entries": [
     {
      "id": "542404",
      "count": 4,
      "weight": 1000
     },
     {
      "id": "543104",
      "count": 20,
      "weight": 1500
     },
     {
      "id": "543105",
      "count": 20,
      "weight": 1500
     },
     {
      "id": "543101",
      "count": 30,
      "weight": 2000
     },
     {
      "id": "543102",
      "count": 30,
      "weight": 2000
     },
     {
      "id": "543103",
      "count": 30,
      "weight": 2000
     }
    ]
   },
   "verdict": [
    {
     "threshold": 5,
     "passive": "951431"
    },
    {
     "threshold": 5,
     "passive": "951432"
    },
    {
     "threshold": 5,
     "passive": "951433"
    }
   ],
   "points": {
    "x1": 75,
    "x3": 225
   },
   "phases": [
    {
     "foe": {
      "monster": "2390301",
      "level": 150,
      "multipliers": {
       "atk": 125,
       "def": 130,
       "hp": 650
      },
      "estimate": {
       "atk": 11800,
       "def": 12532,
       "hp": 1517750
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": null
    },
    {
     "foe": {
      "monster": "2390302",
      "level": 150,
      "multipliers": {
       "atk": 120,
       "def": 190,
       "hp": 700
      },
      "estimate": {
       "atk": 11328,
       "def": 19732,
       "hp": 1752800
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": {
      "type": "attribute_type",
      "sequences": [
       [
        [
         1
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         3
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         3
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         3
        ],
        [
         2
        ]
       ]
      ]
     }
    }
   ]
  },
  {
   "name": {
    "it": "Estremo",
    "en": "Extreme"
   },
   "color": "#E800CF",
   "level": 2,
   "bossLevel": 200,
   "energy": 30,
   "gold": 15000,
   "power": 2000000,
   "clear": [
    {
     "id": "1260103",
     "count": 17
    }
   ],
   "drops": {
    "draws": 1,
    "entries": [
     {
      "id": "542405",
      "count": 1,
      "weight": 1000
     },
     {
      "id": "543104",
      "count": 30,
      "weight": 1500
     },
     {
      "id": "543105",
      "count": 30,
      "weight": 1500
     },
     {
      "id": "543101",
      "count": 50,
      "weight": 2000
     },
     {
      "id": "543102",
      "count": 50,
      "weight": 2000
     },
     {
      "id": "543103",
      "count": 50,
      "weight": 2000
     }
    ]
   },
   "verdict": [
    {
     "threshold": 4,
     "passive": "951431"
    },
    {
     "threshold": 4,
     "passive": "951432"
    },
    {
     "threshold": 4,
     "passive": "951433"
    }
   ],
   "points": {
    "x1": 150,
    "x3": 450
   },
   "phases": [
    {
     "foe": {
      "monster": "2390303",
      "level": 200,
      "multipliers": {
       "atk": 105,
       "def": 130,
       "hp": 650
      },
      "estimate": {
       "atk": 14212,
       "def": 16562,
       "hp": 2005250
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": {
      "type": "attribute_type",
      "sequences": [
       [
        [
         1
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         3
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         3
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         3
        ],
        [
         2
        ]
       ]
      ]
     }
    },
    {
     "foe": {
      "monster": "2390304",
      "level": 200,
      "multipliers": {
       "atk": 110,
       "def": 180,
       "hp": 750
      },
      "estimate": {
       "atk": 14888,
       "def": 24723,
       "hp": 2478000
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": {
      "type": "card_rank",
      "sequences": [
       [
        [
         1
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         2
        ]
       ]
      ]
     }
    }
   ]
  },
  {
   "name": {
    "it": "Inferno",
    "en": "Hell"
   },
   "color": "#FF007F",
   "level": 3,
   "bossLevel": 240,
   "energy": 50,
   "gold": 30000,
   "power": 2000000,
   "clear": [
    {
     "id": "1260104",
     "count": 17
    }
   ],
   "drops": {
    "draws": 1,
    "entries": [
     {
      "id": "6020063",
      "count": 1,
      "weight": 100
     },
     {
      "id": "6020064",
      "count": 1,
      "weight": 300
     },
     {
      "id": "540012",
      "count": 10,
      "weight": 1200
     },
     {
      "id": "542405",
      "count": 1,
      "weight": 1900
     },
     {
      "id": "520001",
      "count": 5,
      "weight": 3000
     },
     {
      "id": "530001",
      "count": 30,
      "weight": 3500
     }
    ]
   },
   "verdict": [
    {
     "threshold": 3,
     "passive": "951441"
    },
    {
     "threshold": 3,
     "passive": "951442"
    },
    {
     "threshold": 3,
     "passive": "951443"
    }
   ],
   "points": {
    "x1": 225,
    "x3": 675
   },
   "phases": [
    {
     "foe": {
      "monster": "2390305",
      "level": 240,
      "multipliers": {
       "atk": 95,
       "def": 100,
       "hp": 700
      },
      "estimate": {
       "atk": 16606,
       "def": 25400,
       "hp": 5145000
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": {
      "type": "attack_type",
      "sequences": [
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         5
        ]
       ],
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         5
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         5
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         5
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         1
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         2
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         5
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         6,
         7
        ]
       ]
      ]
     }
    },
    {
     "foe": {
      "monster": "2390306",
      "level": 240,
      "multipliers": {
       "atk": 100,
       "def": 140,
       "hp": 850
      },
      "estimate": {
       "atk": 17480,
       "def": 35560,
       "hp": 6264500
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": {
      "type": "card_rank",
      "sequences": [
       [
        [
         1
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         2
        ]
       ]
      ]
     }
    }
   ]
  },
  {
   "name": {
    "it": "Caos",
    "en": "Chaos"
   },
   "color": "#FF0000",
   "level": 4,
   "bossLevel": 300,
   "energy": 70,
   "gold": 50000,
   "power": 2000000,
   "clear": [
    {
     "id": "1260104",
     "count": 27
    }
   ],
   "drops": {
    "draws": 1,
    "entries": [
     {
      "id": "6020063",
      "count": 1,
      "weight": 100
     },
     {
      "id": "6020064",
      "count": 1,
      "weight": 300
     },
     {
      "id": "540012",
      "count": 15,
      "weight": 1200
     },
     {
      "id": "542405",
      "count": 1,
      "weight": 1900
     },
     {
      "id": "520001",
      "count": 7,
      "weight": 3000
     },
     {
      "id": "530001",
      "count": 40,
      "weight": 3500
     }
    ]
   },
   "verdict": [
    {
     "threshold": 3,
     "passive": "951465"
    },
    {
     "threshold": 3,
     "passive": "951466"
    },
    {
     "threshold": 3,
     "passive": "951467"
    }
   ],
   "points": {
    "x1": 300,
    "x3": 900
   },
   "phases": [
    {
     "foe": {
      "monster": "2390307",
      "level": 300,
      "multipliers": {
       "atk": 150,
       "def": 100,
       "hp": 1000
      },
      "estimate": {
       "atk": 32595,
       "def": 43360,
       "hp": 6180000
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": {
      "type": "attack_type",
      "sequences": [
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         5
        ]
       ],
       [
        [
         1
        ],
        [
         3,
         4
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         5
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         5
        ]
       ],
       [
        [
         2
        ],
        [
         3,
         4
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         3,
         4
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         5
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         1
        ],
        [
         6,
         7
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         1
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         2
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         5
        ]
       ],
       [
        [
         3,
         4
        ],
        [
         3,
         4
        ],
        [
         6,
         7
        ]
       ]
      ]
     }
    },
    {
     "foe": {
      "monster": "2390308",
      "level": 300,
      "multipliers": {
       "atk": 150,
       "def": 140,
       "hp": 1200
      },
      "estimate": {
       "atk": 32595,
       "def": 43960,
       "hp": 11028000
      },
      "extraPassives": [
       "800002"
      ]
     },
     "rules": {
      "type": "card_rank",
      "sequences": [
       [
        [
         1
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         1
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         1
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         1
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         2
        ]
       ],
       [
        [
         2
        ],
        [
         2
        ],
        [
         3
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         1
        ]
       ],
       [
        [
         2
        ],
        [
         3
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         1
        ],
        [
         2
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         1
        ]
       ],
       [
        [
         3
        ],
        [
         2
        ],
        [
         2
        ]
       ]
      ]
     }
    }
   ]
  }
 ],
 "exchange": [
  {
   "give": {
    "id": "5301011",
    "count": 4
   },
   "choices": [
    "5301012",
    "5301013",
    "5301014",
    "5301015",
    "5301016"
   ],
   "weekly": 100
  },
  {
   "give": {
    "id": "5301012",
    "count": 4
   },
   "choices": [
    "5301011",
    "5301013",
    "5301014",
    "5301015",
    "5301016"
   ],
   "weekly": 100
  },
  {
   "give": {
    "id": "5301013",
    "count": 4
   },
   "choices": [
    "5301011",
    "5301012",
    "5301014",
    "5301015",
    "5301016"
   ],
   "weekly": 100
  },
  {
   "give": {
    "id": "5301014",
    "count": 4
   },
   "choices": [
    "5301011",
    "5301012",
    "5301013",
    "5301015",
    "5301016"
   ],
   "weekly": 100
  },
  {
   "give": {
    "id": "5301015",
    "count": 4
   },
   "choices": [
    "5301011",
    "5301012",
    "5301013",
    "5301014",
    "5301016"
   ],
   "weekly": 100
  },
  {
   "give": {
    "id": "5301016",
    "count": 4
   },
   "choices": [
    "5301011",
    "5301012",
    "5301013",
    "5301014",
    "5301015"
   ],
   "weekly": 100
  }
 ],
 "boxes": {
  "912099": [
   {
    "id": "1000606",
    "count": 1,
    "weight": 0
   },
   {
    "id": "545101",
    "count": 9,
    "weight": 0
   },
   {
    "id": "545102",
    "count": 30,
    "weight": 0
   },
   {
    "id": "543215",
    "count": 15,
    "weight": 0
   }
  ],
  "1260103": [
   {
    "id": "5301011",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301012",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301013",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301014",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301015",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301016",
    "count": 2,
    "weight": 1000
   }
  ],
  "1260104": [
   {
    "id": "5301011",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301012",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301013",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301014",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301015",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301016",
    "count": 3,
    "weight": 1000
   }
  ],
  "1260137": [
   {
    "id": "5301011",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301012",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301013",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301014",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301015",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301016",
    "count": 2,
    "weight": 0
   }
  ],
  "1260138": [
   {
    "id": "5301011",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301012",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301013",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301014",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301015",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301016",
    "count": 3,
    "weight": 0
   }
  ]
 },
 "banned": [
  "1936501",
  "1983501"
 ],
 "monsters": {
  "2390301": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Condanna a morte",
      "en": "Death Sentence"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]20%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]20%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]20%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]20%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Spada dell'Ira",
      "en": "Sword of Wrath"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]5%[-] l'Attacco di tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF](Accumulabile)[-]",
       "en": "Decreases all enemies' Attack by [FFAE00]5%[-] for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]5%[-] l'Attacco di tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF](Accumulabile)[-]",
       "en": "Decreases all enemies' Attack by [FFAE00]5%[-] for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF](Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Carisma abissale",
      "en": "Abyssal Charisma"
     },
     "ranks": [
      {
       "it": "Riempie la propria Barra Mossa finale di [FFAE00]3[-] [FFAE00]sfera/e[-] e aumenta del [FFAE00]30%[-] l'Attacco per [FFAE00]2 turni[-].",
       "en": "Fills own Ultimate Move Gauge by [FFAE00]3[-] [FFAE00]orb(s)[-] and increases Attack by [FFAE00]30%[-] for [FFAE00]2 turns[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_king_monster_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Colpo della disperazione",
      "en": "Despair Strike"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]Lv. 1[-][00D5FF]\"Svenimento\"[-] su tutti i nemici per [FFAE00]2 turni[-] poi infligge danni pari al [FFAE00]500%[-] dell’Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※[FFAE00]Liv. 1[-] Svenimento: Impossibile usare abilità Buff e Debuff.[-]",
       "en": "Applies [FFAE00]Lv. 1[-] [00D5FF]Blackout[-] on all enemies for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 1[-] Blackout: Unable to use Buff and Debuff skills.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951401",
    "951402",
    "951413",
    "951414",
    "951419",
    "951457"
   ],
   "hiddenPassives": 1,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Riduzione Barra Mossa finale / Purificazione",
     "en": "Ultimate Move Gauge Decrease / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica vari Debuff e ha effetti che aumentano i suoi danni.",
     "en": "The Demon King applies various Debuffs and has effects that increase his damage."
    },
    "unique": null
   }
  },
  "2390302": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Spada dell'Ira",
      "en": "Sword of Wrath"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], riduce le Barre Mossa finale del bersaglio di [FFAE00]1 sfera[-] e riempie la propria Barra Mossa finale di [FFAE00]1 sfera[-].",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-], decreases their Ultimate Move Gauges by [FFAE00]1 orb[-], and fills own Ultimate Move Gauge by [FFAE00]1 orb[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], riduce le Barre Mossa finale del bersaglio di [FFAE00]2 sfere[-] e riempie la propria Barra Mossa finale di [FFAE00]2 sfere[-].",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-], decreases their Ultimate Move Gauges by [FFAE00]2 orbs[-], and fills own Ultimate Move Gauge by [FFAE00]2 orbs[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Squarcio infernale",
      "en": "Hell Slash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari a [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      },
      {
       "it": "Infligge danni pari a [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Contaminazione maledetta",
      "en": "Cursed Pollution"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]disattiva tutti gli effetti abilità, incluse le Mosse finali[-] per [FFAE00]2 turno/i[-], poi [00D5FF]Elimina[-] [FFAE00]2[-] [FFAE00]abilità[-] tra quelle del nemico.\\n[00D5FF](Manca il bersaglio quando attacca nemici con un effetto Aumento delle statistiche relative all’Attacco)[-]\\n\\n[00D5FF]※Eliminazione: Rimuove casualmente delle abilità dal bersaglio quando attacca (mosse finali escluse).\\n(Elimina le Mosse finali se non ci sono altre abilità da rimuovere)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]disables effects of all skills including Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then [00D5FF]Deletes[-] [FFAE00]2[-] [FFAE00]skill(s)[-] from the pool of all enemy skills.\\n[00D5FF](Misses when attacking enemies with an Attack-related Stats Increase effect)[-]\\n\\n[00D5FF]※Delete: Randomly removes skills from the target (Excluding Ultimate Moves)\\n(Deletes Ultimate Moves if there is no skill to remove)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Prigione dei mille chiodi",
      "en": "Prison of Ten Thousand Bolts"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]15%[-] le statistiche relative alla Difesa di tutti i nemici per [FFAE00]2 turni[-], infligge danni pari a [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi applica [00D5FF]Svenimento[-] di [FFAE00]Liv. 1[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Effetto Svenimento [FFAE00]Liv. 1[-]: impossibile usare abilità Buff e Debuff[-]",
       "en": "Decreases all enemies' Defense-related stats by [FFAE00]15%[-] for [FFAE00]2 turns[-], inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-], then applies [FFAE00]Lv. 1[-] [00D5FF]Blackout[-] for [FFAE00]2 turns[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 1[-] Blackout effect: Unable to use buff and debuff skills[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951403",
    "951404",
    "951413",
    "951414",
    "951419",
    "951457"
   ],
   "hiddenPassives": 4,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Riduzione Barra Mossa finale / Purificazione",
     "en": "Ultimate Move Gauge Decrease / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica dei Buff su sé stesso all'inizio della battaglia. Se il nemico rispetta le Regole, i Buff verranno rimossi nell'ordine. Inoltre, il Re Demone usa un'Abilità Attacco che rimuove le abilità nemiche una volta trascorso un certo numero di turni, ma i nemici con effetti Aumento statistiche relative all'Attacco non subiscono danni da questa abilità.",
     "en": "The Demon King applies Buffs on himself at the start of the battle. If the enemy abides by the rules, the Buffs will be removed in order. In addition, the Demon King uses an Attack Skill that removes enemy skills every set number of turns, but enemies with Attack-related Stats Increase effects do not take damage from this skill."
    },
    "unique": null
   }
  },
  "2390303": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Condanna a morte",
      "en": "Death Sentence"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]20%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]20%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]20%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]20%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Spada dell'Ira",
      "en": "Sword of Wrath"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]5%[-] l'Attacco di tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF](Accumulabile)[-]",
       "en": "Decreases all enemies' Attack by [FFAE00]5%[-] for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]5%[-] l'Attacco di tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF](Accumulabile)[-]",
       "en": "Decreases all enemies' Attack by [FFAE00]5%[-] for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF](Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Carisma abissale",
      "en": "Abyssal Charisma"
     },
     "ranks": [
      {
       "it": "Riempie la propria Barra Mossa finale di [FFAE00]5[-] [FFAE00]sfera/e[-] e aumenta le statistiche di base del [FFAE00]30%[-] per [FFAE00]2 turni[-].",
       "en": "Fills own Ultimate Move Gauge by [FFAE00]5[-] [FFAE00]orb(s)[-] and increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turns[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_king_monster_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Colpo della disperazione",
      "en": "Despair Strike"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]Lv. 1[-][00D5FF]\"Svenimento\"[-] su tutti i nemici per [FFAE00]2 turni[-] poi infligge danni pari al [FFAE00]600%[-] dell’Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※[FFAE00]Liv. 1[-] Svenimento: Impossibile usare abilità Buff e Debuff.[-]",
       "en": "Applies [FFAE00]Lv. 1[-] [00D5FF]Blackout[-] on all enemies for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 1[-] Blackout: Unable to use Buff and Debuff skills.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951405",
    "951406",
    "951413",
    "951414",
    "951418",
    "951438",
    "951419",
    "951457",
    "951460"
   ],
   "hiddenPassives": 2,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Purificazione",
     "en": "Stance Cancel / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica un Buff su sé stesso all'inizio della battaglia. Se il nemico rispetta le Regole, il Buff verrà rimosso.",
     "en": "The Demon King applies a Buff on himself at the start of the battle. If the enemy abides by the rules, the Buff will be removed."
    },
    "unique": null
   }
  },
  "2390304": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Condanna a morte",
      "en": "Death Sentence"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]riduce i ranghi abilità[-].",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]decreases skill ranks[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Squarcio infernale",
      "en": "Hell Slash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari a [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      },
      {
       "it": "Infligge danni pari a [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Bozzolo malvagio",
      "en": "Evil Cocoon"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta le statistiche relative ai PS del [FFAE00]30%[-] per [FFAE00]2 turno/i[-] e [00D5FF]Riflette[-] [FFAE00]100%[-] dei danni subiti.\\n\\n[00D5FF]※Riflessione: Restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a stance that increases HP-related stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and [00D5FF]Reflects[-] [FFAE00]100%[-] of damage taken.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_demon_king_monster_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Prigione dei mille chiodi",
      "en": "Prison of Ten Thousand Bolts"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]15%[-] le statistiche relative alla Difesa di tutti i nemici per [FFAE00]2 turni[-], infligge danni pari a [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi applica [00D5FF]Svenimento[-] di [FFAE00]Liv. 1[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Effetto Svenimento [FFAE00]Liv. 1[-]: impossibile usare abilità Buff e Debuff[-]",
       "en": "Decreases all enemies' Defense-related stats by [FFAE00]15%[-] for [FFAE00]2 turns[-], inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-], then applies [FFAE00]Lv. 1[-] [00D5FF]Blackout[-] for [FFAE00]2 turns[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 1[-] Blackout effect: Unable to use buff and debuff skills[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951407",
    "951408",
    "951413",
    "951414",
    "951419",
    "951421",
    "951424",
    "951457",
    "951460"
   ],
   "hiddenPassives": 5,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Purificazione",
     "en": "Stance Cancel / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica dei Buff su sé stesso all'inizio della battaglia. Se il nemico rispetta le Regole, i Buff verranno rimossi nell'ordine. Inoltre, il Re Demone aumenta le proprie statistiche relative ai PS e usa un Atteggiamento che riflette una parte dei danni che subisce una volta trascorso un certo numero di turni.",
     "en": "The Demon King applies Buffs on himself at the start of the battle. If the enemy abides by the rules, the Buffs will be removed in order. In addition, the Demon King increases his HP-related stats and uses a Stance which reflects a portion of the damage he takes every set number of turns."
    },
    "unique": null
   }
  },
  "2390305": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Condanna a morte",
      "en": "Death Sentence"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]20%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]20%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]20%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]20%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Spada dell'Ira",
      "en": "Sword of Wrath"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]5%[-] l'Attacco e la Difesa di tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF](Accumulabile)[-]",
       "en": "Decreases all enemies' Attack and Defense by [FFAE00]5%[-] for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]5%[-] l'Attacco e la Difesa di tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF](Accumulabile)[-]",
       "en": "Decreases all enemies' Attack and Defense by [FFAE00]5%[-] for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF](Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Contaminazione maledetta",
      "en": "Cursed Pollution"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]disattiva tutti gli effetti abilità, incluse le Mosse finali[-] per [FFAE00]2 turno/i[-], poi [00D5FF]Elimina[-] [FFAE00]3[-] [FFAE00]abilità[-] tra quelle del nemico.\\n[00D5FF](Manca il bersaglio quando attacca nemici con un effetto Aumento delle statistiche relative all’Attacco)[-]\\n\\n[00D5FF]※Eliminazione: Rimuove casualmente delle abilità dal bersaglio quando attacca (mosse finali escluse).\\n(Elimina le Mosse finali se non ci sono altre abilità da rimuovere)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]disables effects of all skills including Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then [00D5FF]Deletes[-] [FFAE00]3[-] [FFAE00]skill(s)[-] from the pool of all enemy skills.\\n[00D5FF](Misses when attacking enemies with an Attack-related Stats Increase effect)[-]\\n\\n[00D5FF]※Delete: Randomly removes skills from the target (Excluding Ultimate Moves)\\n(Deletes Ultimate Moves if there is no skill to remove)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Colpo della disperazione",
      "en": "Despair Strike"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]Lv. 2[-] [00D5FF]\"Svenimento\"[-] su tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]700%[-] dell’Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※[FFAE00]Liv. 2[-] Svenimento: Impossibile usare abilità Buff e Debuff e abilità Attacco.[-]",
       "en": "Applies [FFAE00]Lv. 2[-] [00D5FF]Blackout[-] on all enemies for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]700%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 2[-] Blackout: Unable to use Buff, Debuff, and Attack Skills.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951409",
    "951410",
    "951413",
    "951414",
    "951418",
    "951450",
    "951419",
    "951457",
    "951460"
   ],
   "hiddenPassives": 6,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Purificazione",
     "en": "Stance Cancel / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica dei Buff su sé stesso all'inizio della battaglia. Se il nemico rispetta le Regole, i Buff verranno rimossi nell'ordine. Inoltre, il Re Demone usa un'Abilità Attacco che rimuove le abilità nemiche una volta trascorso un certo numero di turni, ma i nemici con effetti Aumento statistiche relative all'Attacco non subiscono danni da questa abilità.",
     "en": "The Demon King applies Buffs on himself at the start of the battle. If the enemy abides by the rules, the Buffs will be removed in order. In addition, the Demon King uses an Attack Skill that removes enemy skills every set number of turns, but enemies with Attack-related Stats Increase effects do not take damage from this skill."
    },
    "unique": null
   }
  },
  "2390306": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Condanna a morte",
      "en": "Death Sentence"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]riduce i ranghi abilità[-].",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]decreases skill ranks[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Squarcio infernale",
      "en": "Hell Slash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari a [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      },
      {
       "it": "Infligge danni pari a [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Bozzolo malvagio",
      "en": "Evil Cocoon"
     },
     "ranks": [
      {
       "it": "Recupera i propri PS per il [00FF00]15%[-] dei PS massimi e assume un Atteggiamento che fa sì che tutti gli attacchi sull'eroe infliggano [FFAE00]1[-] danno per [FFAE00]2 turno/i[-]. [00D5FF]Se subisce danni in caso di attacco[-], infligge a tutti i nemici [00D5FF]Ossidazione[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Ossidazione: riduce i ranghi abilità e infligge danni pari al [FFAE00]20%[-] dei PS massimi per [FFAE00]ciascuna[-] abilità il cui rango è stato ridotto alla fine del turno del nemico.[-]",
       "en": "Recovers own HP by [00FF00]15%[-] of Max HP and assumes a stance that makes all attacks that would damage the hero deal [FFAE00]1[-] damage instead for [FFAE00]2 turn(s)[-]. [00D5FF]Upon taking damage when attacked[-], inflicts all enemies with [00D5FF]Oxidize[-] for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Oxidize: Decreases skill ranks and inflicts damage equal to [FFAE00]20%[-] of Max HP for [FFAE00]each[-] skill that had its rank decreased at the end of the enemy's turn.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_demon_king_monster_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Prigione dei mille chiodi",
      "en": "Prison of Ten Thousand Bolts"
     },
     "ranks": [
      {
       "it": "Rimuove [00D5FF]Corrosione[-] da [FFFFFF]tutti i nemici[-], infligge danni pari al [FFAE00]500%[-] dell'Attacco, causa [00D5FF]Rilascio Corrosione[-] pari al [FFAE00]100%[-] e infligge il [FFAE00]Liv. 2[-] di [00D5FF]Svenimento[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※ [FFAE00]Liv. 2[-] dell'effetto Svenimento: impossibile usare abilità Attacco, Buff e Debuff.[-][00D5FF]※Rilascio Corrosione: infligge danni aggiuntivi pari ai danni residui dell'effetto Corrosione rimosso.[-]",
       "en": "Removes [00D5FF]Corrosion[-] from [FFFFFF]all enemies[-], inflicts damage equal to [FFAE00]500%[-] of Attack, causes [00D5FF]Corrosion Release[-] equal to [FFAE00]100%[-], and inflicts [FFAE00]Lv. 2[-] [00D5FF]Blackout[-] for [FFAE00]2 turns[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 2[-] Blackout effect: Unable to use Buff, Debuff, and Attack Skills.[-][00D5FF]※ Corrosion Release: Inflicts additional damage equal to the remaining damage of the removed Corrosion effect.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951411",
    "951412",
    "951413",
    "951414",
    "951444",
    "951445",
    "951419",
    "951447",
    "951457",
    "951460"
   ],
   "hiddenPassives": 5,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Purificazione",
     "en": "Stance Cancel / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica dei Buff su sé stesso all'inizio della battaglia. Se il nemico rispetta le Regole, i Buff verranno rimossi nell'ordine. Inoltre, il Re Demone potenzia le proprie statistiche quando i suoi PS scendono sotto una certa soglia, quindi sii sempre consapevole di quanti danni stai infliggendo.",
     "en": "The Demon King applies Buffs on himself at the start of the battle. If the enemy abides by the rules, the Buffs will be removed in order. In addition, the Demon King enhances his stats when his HP falls below certain thresholds, so you must be aware of how much damage you inflict."
    },
    "unique": null
   }
  },
  "2390307": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Condanna a morte",
      "en": "Death Sentence"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Erosione[-] pari a [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Erosione: ignora Difesa e Resistenza.\\nAumenta i danni inflitti dell'[FFAE00]80%[-] della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Erosion[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Erosion: Ignores Defense and Resistance.\\nIncreases damage dealt by [FFAE00]80%[-] of Pierce Rate.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Erosione[-] pari a [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Erosione: ignora Difesa e Resistenza.\\nAumenta i danni inflitti dell'[FFAE00]80%[-] della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Erosion[-] damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Erosion: Ignores Defense and Resistance.\\nIncreases damage dealt by [FFAE00]80%[-] of Pierce Rate.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Squarcio infernale",
      "en": "Hell Slash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      },
      {
       "it": "Infligge danni pari a [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [00D5FF]Marchio della morte[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Marchio della morte: limita le statistiche relative a Recupero.\\nResistenza critico e Difesa critico [FFAE00]-[-][FFAE00]40%[-].[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and applies [00D5FF]Mark of Death[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Mark of Death: Restricts Recovery-related stats.\\n[FFAE00]-[-][FFAE00]40%[-] Crit Resistance and Crit Defense.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Bozzolo malvagio",
      "en": "Evil Cocoon"
     },
     "ranks": [
      {
       "it": "Recupera i propri PS per il [00FF00]25%[-] dei PS massimi e assume un Atteggiamento che fa sì che tutti gli attacchi sull'eroe infliggano [FFAE00]1[-] danno per [FFAE00]2 turno/i[-]. [00D5FF]Se subisce danni in caso di attacco[-], infligge a tutti i nemici [00D5FF]Ossidazione[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Ossidazione: riduce i ranghi abilità e infligge danni pari al [FFAE00]20%[-] dei PS massimi per [FFAE00]ciascuna[-] abilità il cui rango è stato ridotto alla fine del turno del nemico.[-]",
       "en": "Recovers own HP by [00FF00]25%[-] of Max HP and assumes a stance that makes all attacks that would damage the hero deal [FFAE00]1[-] damage instead for [FFAE00]2 turn(s)[-]. [00D5FF]Upon taking damage when attacked[-], inflicts all enemies with [00D5FF]Oxidize[-] for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Oxidize: Decreases skill ranks and inflicts damage equal to [FFAE00]20%[-] of Max HP for [FFAE00]each[-] skill that had its rank decreased at the end of the enemy's turn.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_demon_king_monster_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Colpo della disperazione",
      "en": "Despair Strike"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]Lv. 2[-] [00D5FF]\"Svenimento\"[-] su tutti i nemici per [FFAE00]2 turni[-], poi infligge danni pari al [FFAE00]700%[-] dell’Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※[FFAE00]Liv. 2[-] Svenimento: Impossibile usare abilità Buff e Debuff e abilità Attacco.[-]",
       "en": "Applies [FFAE00]Lv. 2[-] [00D5FF]Blackout[-] on all enemies for [FFAE00]2 turns[-], then inflicts damage equal to [FFAE00]700%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 2[-] Blackout: Unable to use Buff, Debuff, and Attack Skills.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951461",
    "951462",
    "951468",
    "951480",
    "951481",
    "951475",
    "951476",
    "951477",
    "951478",
    "951473",
    "951460"
   ],
   "hiddenPassives": 7,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Purificazione",
     "en": "Stance Cancel / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica un Buff su sé stesso all'inizio della battaglia. Se il nemico rispetta le Regole, il Buff verrà rimosso.",
     "en": "The Demon King applies a Buff on himself at the start of the battle. If the enemy abides by the rules, the Buff will be removed."
    },
    "unique": null
   }
  },
  "2390308": {
   "name": {
    "it": "Re Demone",
    "en": "Demon King"
   },
   "nameDeduced": true,
   "description": null,
   "race": 1,
   "attribute": 5,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Condanna a morte",
      "en": "Death Sentence"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Erosione[-] pari a [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Erosione: ignora Difesa e Resistenza.\\nAumenta i danni inflitti dell'[FFAE00]80%[-] della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Erosion[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Erosion: Ignores Defense and Resistance.\\nIncreases damage dealt by [FFAE00]80%[-] of Pierce Rate.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Erosione[-] pari a [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Erosione: ignora Difesa e Resistenza.\\nAumenta i danni inflitti dell'[FFAE00]80%[-] della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Erosion[-] damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Erosion: Ignores Defense and Resistance.\\nIncreases damage dealt by [FFAE00]80%[-] of Pierce Rate.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Spada dell'Ira",
      "en": "Sword of Wrath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Debilitazione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Debilitazione: [FFAE00]x2[-] aumento Possibilità critico e [FFAE00]x2[-] aumento Danno critico.\\nApplica Tomba della morte al bersaglio quando infligge danni ai nemici colpiti da Tocco della morte.[-]",
       "en": "Inflicts [00D5FF]Debilitation[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Debilitation: [FFAE00]2x[-] Crit Chance and [FFAE00]2x[-] Crit Damage Increase.\\nInflicts Death's Tomb on the target when dealing damage to enemies affected by Death's Touch.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Debilitazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Debilitazione: [FFAE00]x2[-] aumento Possibilità critico e [FFAE00]x2[-] aumento Danno critico.\\nApplica Tomba della morte al bersaglio quando infligge danni ai nemici colpiti da Tocco della morte.[-]",
       "en": "Inflicts [00D5FF]Debilitation[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Debilitation: [FFAE00]2x[-] Crit Chance and [FFAE00]2x[-] Crit Damage Increase.\\nInflicts Death's Tomb on the target when dealing damage to enemies affected by Death's Touch.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_02_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Contaminazione maledetta",
      "en": "Cursed Pollution"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], applica [00D5FF]Tocco della morte[-] per [FFAE00]2 turni[-], poi [00D5FF]Elimina[-] [FFAE00]3[-] [FFAE00]abilità[-] tra quelle del nemico.\\n[00D5FF](Manca il bersaglio quando attacca nemici con un effetto Aumento statistiche relative all'Attacco)[-]\\n\\n[00D5FF]※Tocco della morte: disabilita le Abilità Attacco.\\nViene rimosso dopo aver usato un'abilità.[-]\\n[00D5FF]※Eliminazione: rimuove casualmente delle abilità dal bersaglio (Mosse finali escluse).\\n(Elimina le Mosse finali se non ci sono altre abilità da rimuovere)[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-], inflicts [00D5FF]Death's Touch[-] for [FFAE00]2 turns[-], then [00D5FF]Deletes[-] [FFAE00]3[-] [FFAE00]skill(s)[-] from the pool of all enemy skills.\\n[00D5FF](Misses when attacking enemies with an Attack-related Stats Increase effect)[-]\\n\\n[00D5FF]※Death's Touch: Disables Attack Skills.\\nRemoved upon using a skill.[-]\\n[00D5FF]※Delete: Randomly removes skills from the target (Excluding Ultimate Moves).\\n(Deletes Ultimate Moves if there is no skill to remove)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Lancia della morte",
      "en": "Death Spear"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni [00D5FF]Recisione[-] pari al [FFAE00]10000%[-] dell'Attacco, poi elimina tutti i nemici nei Team A e B.\\n\\n[00D5FF]※Recisione: x3 Aumento Possibilità critico.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts [00D5FF]Sever[-] damage equal to [FFAE00]10000%[-] of Attack, then annihilates all enemies in Teams A and B.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_king_monster_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Prigione dei mille chiodi",
      "en": "Prison of Ten Thousand Bolts"
     },
     "ranks": [
      {
       "it": "Rimuove [00D5FF]Corrosione[-] da [FFFFFF]tutti i nemici[-], infligge danni pari al [FFAE00]500%[-] dell'Attacco, causa [00D5FF]Rilascio Corrosione[-] pari al [FFAE00]100%[-] e infligge il [FFAE00]Liv. 2[-] di [00D5FF]Svenimento[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※ [FFAE00]Liv. 2[-] dell'effetto Svenimento: impossibile usare abilità Attacco, Buff e Debuff.[-][00D5FF]※Rilascio Corrosione: infligge danni aggiuntivi pari ai danni residui dell'effetto Corrosione rimosso.[-]",
       "en": "Removes [00D5FF]Corrosion[-] from [FFFFFF]all enemies[-], inflicts damage equal to [FFAE00]500%[-] of Attack, causes [00D5FF]Corrosion Release[-] equal to [FFAE00]100%[-], and inflicts [FFAE00]Lv. 2[-] [00D5FF]Blackout[-] for [FFAE00]2 turns[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 2[-] Blackout effect: Unable to use Buff, Debuff, and Attack Skills.[-][00D5FF]※ Corrosion Release: Inflicts additional damage equal to the remaining damage of the removed Corrosion effect.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_king_monster_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951463",
    "951464",
    "951468",
    "951476",
    "951479",
    "951478",
    "951473",
    "951460"
   ],
   "hiddenPassives": 9,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Purificazione",
     "en": "Stance Cancel / Purify"
    },
    "behavior": {
     "it": "Il Re Demone applica dei Buff su sé stesso all'inizio della battaglia. Se il nemico rispetta le Regole, i Buff verranno rimossi nell'ordine. Inoltre, il Re Demone potenzia le proprie statistiche quando i suoi PS scendono sotto una certa soglia, quindi sii sempre consapevole di quanti danni stai infliggendo.",
     "en": "The Demon King applies Buffs on himself at the start of the battle. If the enemy abides by the rules, the Buffs will be removed in order. In addition, the Demon King enhances his stats when his HP falls below certain thresholds, so you must be aware of how much damage you inflict."
    },
    "unique": null
   }
  }
 },
 "passives": {
  "800002": {
   "name": {
    "it": "Aumento uso abilità",
    "en": "Skill Use Increase"
   },
   "text": {
    "it": "Aumenta il numero di utilizzi abilità di [FFAE00]2[-].",
    "en": "Increases the number of skill uses by [FFAE00]2[-]."
   }
  },
  "951401": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Carisma abissale\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Abyssal Charisma\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951402": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951403": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Contaminazione maledetta\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Cursed Pollution\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951404": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951405": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Carisma abissale\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Abyssal Charisma\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951406": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951407": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Bozzolo malvagio\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Evil Cocoon\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951408": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951409": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Contaminazione maledetta\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Cursed Pollution\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951410": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951411": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Bozzolo malvagio\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Evil Cocoon\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951412": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951413": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti i Debuff[-] oltre che a [00D5FF]Coercizione, Espulsione e Oscurità[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuffs[-], as well as [00D5FF]Coerce, Expel, and Darkness[-]."
   }
  },
  "951414": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Stordimento / Pietrificazione / Congelamento / Coercizione / Espulsione / Corrosione / Infezione / Oscurità / Disabilita abilità / Fuoco[-].",
    "en": "Immune to [00D5FF]Stun / Petrify / Freeze / Coerce / Expel / Corrosion / Infect / Darkness / Skill Disable / Burn[-]."
   }
  },
  "951418": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta le statistiche di base dell'eroe del [FFAE00]1%[-] per [FFAE00]ogni[-] Debuff applicato su tutti i nemici.\\n[00D5FF](Limite 20 volta/e)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]1%[-] for [FFAE00]every[-] Debuff applied on all enemies.\\n[00D5FF](Limit 20 time(s))[-]"
   }
  },
  "951419": {
   "name": {
    "it": "Aumento Danno critico/Possibilità critico",
    "en": "Crit Chance / Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]7%[-] la Possibilità critico e il Danno critico per [FFAE00]ogni[-] sfera nella Barra Mossa finale dell'eroe.",
    "en": "Increases Crit Chance and Crit Damage by [FFAE00]7%[-] for [FFAE00]every[-] orb in the hero's Ultimate Move Gauge."
   }
  },
  "951421": {
   "name": {
    "it": "Configurazione bersaglio",
    "en": "Configure Target"
   },
   "text": {
    "it": "Attaccare un nemico con un Debuff provocherà un colpo critico.",
    "en": "Attacking an enemy with a Debuff results in a critical strike."
   }
  },
  "951424": {
   "name": {
    "it": "Ignora Difesa critico",
    "en": "Ignore Crit Defense"
   },
   "text": {
    "it": "Se l'attacco di un eroe su un nemico provoca un colpo critico, ignora [FFAE00]50%[-] della Difesa critico del nemico.",
    "en": "If a Critical Strike occurs when the hero attacks an enemy, ignores [FFAE00]50%[-] of the enemy's Crit Defense."
   }
  },
  "951431": {
   "name": {
    "it": "Status 1 Verdetto del Re Demone",
    "en": "Demon King's Verdict Tier 1"
   },
   "text": {
    "it": "Applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] su chi attacca se l'eroe riceve danni da un'abilità durante il turno del nemico.",
    "en": "Applies [FFAE00]2[-] [00D5FF]Ignite[-] effects on the attacker if the hero receives damage from a skill during the enemy's turn."
   }
  },
  "951432": {
   "name": {
    "it": "Status 2 Verdetto del Re Demone",
    "en": "Demon King's Verdict Tier 2"
   },
   "text": {
    "it": "Alla fine del turno, applica il [FFAE00]Liv. 1[-] di [00D5FF]Svenimento[-] per [FFAE00]2 turni[-] sugli [00D5FF]eroi nemici che non hanno usato abilità[-].\\n\\n[00D5FF]※[FFAE00]Liv. 1[-] dell'effetto Svenimento: Impossibile usare Abilità Buff e Debuff[-]",
    "en": "At the end of the turn, applies [FFAE00]Lv. 1[-] [00D5FF]Blackout[-] for [FFAE00]2 turns[-] on [00D5FF]enemy heroes who have not used Skills[-].\\n\\n[00D5FF]※ [FFAE00]Lv. 1[-] Blackout effect: Unable to use buff and debuff skills[-]"
   }
  },
  "951433": {
   "name": {
    "it": "Sentenza di eliminazione",
    "en": "Annihilation Sentence"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" dopo aver aumentato tutte le statistiche dell'eroe del [FFAE00]100%[-].",
    "en": "Uses \"Death Spear\" after increasing all stats of the hero by [FFAE00]100%[-]."
   }
  },
  "951438": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Applica Attacco disabilitato per [FFAE00]2 turni[-] se i nemici hanno almeno [FFAE00]3[-] Debuff all'inizio del turno degli alleati.",
    "en": "Applies Attack Disable for [FFAE00]2 turns[-] if enemies have [FFAE00]3[-] or more Debuffs at the start of the allies' turn."
   }
  },
  "951441": {
   "name": {
    "it": "Status 1 Verdetto del Re Demone",
    "en": "Demon King's Verdict Tier 1"
   },
   "text": {
    "it": "[00D5FF]Rimuove [FFAE00]1[-] Buff[-] da tutti i nemici all'inizio del turno degli alleati. Applica [00D5FF]Incendio[-] sui nemici a cui è stato rimosso un Buff e aumenta il Danno critico dell'eroe del [FFAE00]10%[-] per [FFAE00]ogni[-] effetto [00D5FF]Incendio[-] applicato sui nemici.",
    "en": "[00D5FF]Removes [FFAE00]1[-] Buff[-] from all enemies at the start of the allies' turn. Applies [00D5FF]Ignite[-] to enemies who had a Buff removed and increases the hero's Crit Damage by [FFAE00]10%[-] for [FFAE00]each[-] [00D5FF]Ignite[-] effect applied to enemies."
   }
  },
  "951442": {
   "name": {
    "it": "Status 2 Verdetto del Re Demone",
    "en": "Demon King's Verdict Tier 2"
   },
   "text": {
    "it": "All'inizio del turno degli alleati, applica [FFAE00]1 Debuff[-] [00D5FF]a caso (senza doppioni)[-] dalla lista di seguito su tutti i nemici per [FFAE00]2 turni[-]. Lista Debuff: [00D5FF]Attacco disabilitato, Disabilita Buff, Disabilita Debuff, Disabilita Recupero[-].",
    "en": "At the start of the allies' turn, applies [FFAE00]1 debuff[-] from the following list [00D5FF]at random (without duplicates)[-] on all enemies for [FFAE00]2 turns[-]. Debuff list: [00D5FF]Attack Disable, Buff Disable, Debuff Disable, Recovery Disable[-]."
   }
  },
  "951443": {
   "name": {
    "it": "Sentenza di eliminazione",
    "en": "Annihilation Sentence"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" dopo aver aumentato tutte le statistiche dell'eroe del [FFAE00]100%[-].",
    "en": "Uses \"Death Spear\" after increasing all stats of the hero by [FFAE00]100%[-]."
   }
  },
  "951444": {
   "name": {
    "it": "Aumento Perforazione",
    "en": "Pierce Rate Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]20%[-] la Perforazione dell'eroe per [FFAE00]2 turni[-] se subisce danni mentre assume un Atteggiamento.\\n[00D5FF](Accumulabile)[-].",
    "en": "Increases the hero's Pierce Rate by [FFAE00]20%[-] for [FFAE00]2 turns[-] if taking damage while assuming a Stance.\\n[00D5FF](Can be stacked)[-]"
   }
  },
  "951445": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "L'effetto Aumento Perforazione viene rimosso se sono presenti almeno [FFAE00]3[-] accumuli all'inizio del turno, e aumenta le statistiche relative all’Attacco del [FFAE00]10%[-] per ogni effetto rimosso.\\n[00D5FF](può essere accumulato)[-]",
    "en": "Pierce Rate Increase effect is removed if there are [FFAE00]3[-] or more stacks at the start of the turn, and Attack-related stats are increased by [FFAE00]10%[-] for each effect removed.\\n[00D5FF](Can be stacked)[-]"
   }
  },
  "951447": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]1%[-] le statistiche di base dell'eroe ogni volta che l'uso di una sua abilità [00D5FF]riduce i ranghi abilità del nemico[-].\\n[00D5FF](Limite: 20 volta/e)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]1%[-] each time the hero's skill use [00D5FF]decreases enemy skill ranks[-].\\n[00D5FF](Limit 20 time(s))[-]"
   }
  },
  "951450": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Applica Attacco disabilitato e Disabilita Debuff per [FFAE00]2 turni[-] se i nemici hanno almeno [FFAE00]6[-] Debuff all'inizio del turno degli alleati.",
    "en": "Applies Attack Disable and Debuff Disable for [FFAE00]2 turns[-] if enemies have [FFAE00]6[-] or more Debuffs at the start of the allies' turn."
   }
  },
  "951457": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] l'Attacco dell'eroe alla fine del turno degli alleati.\\n[00D5FF](Limite 10 volta/e)[-]",
    "en": "Increases the hero's Attack by [FFAE00]10%[-] at the end of the allies' turn.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "951460": {
   "name": {
    "it": "Aumento danni razza",
    "en": "Race Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]500%[-] i danni inflitti dall'eroe a nemici della Dea.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage dealt to Goddess enemies by [FFAE00]500%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "951461": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Bozzolo malvagio\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Evil Cocoon\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951462": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951463": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Contaminazione maledetta\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Cursed Pollution\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "951464": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" quando usa [FFAE00]Sentenza di eliminazione[-].",
    "en": "Uses \"Death Spear\" when using [FFAE00]Annihilation Sentence[-]."
   }
  },
  "951465": {
   "name": {
    "it": "Status 1 Verdetto del Re Demone",
    "en": "Demon King's Verdict Tier 1"
   },
   "text": {
    "it": "Aumenta le proprie statistiche base di [FFAE00]1000%[-] quando un'abilità nemica [00D5FF]sale di rango con un'abilità Unica o con un effetto Reliquia sacra[-].\\n[00D5FF](Limite: 1 volta/e)[-]",
    "en": "Increases own basic stats by [FFAE00]1000%[-] when an enemy's skill is [00D5FF]ranked up with a Unique ability or Holy Relic effect[-].\\n[00D5FF](Limit 1 time(s))[-]"
   }
  },
  "951466": {
   "name": {
    "it": "Status 2 Verdetto del Re Demone",
    "en": "Demon King's Verdict Tier 2"
   },
   "text": {
    "it": "[00D5FF]Senza duplicati, [-]all'inizio del turno degli alleati, [FFAE00]1[-] [00D5FF]effetto casuale tra Disabilita Attacco, Disabilita Buff, Disabilita Debuff o Disabilita Recupero viene applicato[-] a tutti i nemici per [FFAE00]2 turni[-].",
    "en": "[00D5FF]Avoiding duplicates, [-] [FFAE00]1[-] [00D5FF] random effect between Attack Disable, Buff Disable, Debuff Disable, or Recovery Disable is applied[-] on all enemies for [FFAE00]2 turns[-] at the start of the allies' turn."
   }
  },
  "951467": {
   "name": {
    "it": "Sentenza di eliminazione",
    "en": "Annihilation Sentence"
   },
   "text": {
    "it": "Usa \"Lancia della morte\" dopo aver aumentato tutte le statistiche dell'eroe del [FFAE00]100%[-].",
    "en": "Uses \"Death Spear\" after increasing all stats of the hero by [FFAE00]100%[-]."
   }
  },
  "951468": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "Diventa immune a [00D5FF]tutti gli effetti Debuff[-] oltre che a [00D5FF]Coercizione, Espulsione e Oscurità[-], e le [00D5FF]statistiche non scendono sotto i loro valori iniziali[-]. [00D5FF]Blocca gli effetti delle abilità Visione e Macchia di sangue, inclusi quelli delle Mosse finali.[-]",
    "en": "Becomes immune to [00D5FF]all Debuff effects[-] as well as [00D5FF]Coerce, Expel, and Darkness[-], and [00D5FF]stats do not fall below their initial values[-]. [00D5FF]Blocks enemies' Bloodstain and Insight skill effects including those of Ultimate Moves[-]."
   }
  },
  "951473": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Se i danni subiti superano il [FFAE00]10%[-] dei PS massimi, i danni finali subiti si riducono del [FFAE00]50%[-].",
    "en": "If damage taken exceeds [FFAE00]10%[-] of Max HP, final damage taken decreases by [FFAE00]50%[-]."
   }
  },
  "951475": {
   "name": {
    "it": "Miglioramento attacco a bersaglio singolo",
    "en": "Single-Target Attack Enhancement"
   },
   "text": {
    "it": "Applica l'effetto [00D5FF]Tocco della morte[-] al bersaglio per [FFAE00]1 turno[-] quando infligge danni da attacco a bersaglio singolo.\\n\\n[00D5FF]※Tocco della morte: disabilita le Abilità Attacco.\\nViene rimosso dopo aver usato un'abilità.[-]",
    "en": "Inflicts the [00D5FF]Death's Touch[-] effect on the target for [FFAE00]1 turn[-] when dealing single-target attack damage.\\n\\n[00D5FF]※Death's Touch: Disables Attack Skills.\\nRemoved upon using a skill.[-]"
   }
  },
  "951476": {
   "name": {
    "it": "Palude della morte",
    "en": "Death's Marsh"
   },
   "text": {
    "it": "Quando un Debuff [00D5FF]Tocco della morte[-] applicato al nemico viene rimosso a causa di turni scaduti, quel nemico subisce [00D5FF]Tomba della morte[-].\\n\\n[00D5FF]※Tomba della morte: blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali. Tutte le statistiche [FFAE00]-30%[-].\\n(Abilità Recupero e Atteggiamento escluse)[-]",
    "en": "When a [00D5FF]Death's Touch[-] Debuff applied to the enemy is removed due to elapsed turns, that enemy is inflicted with [00D5FF]Death's Tomb[-].\\n\\n[00D5FF]※Death's Tomb: Blocks all skill effects including those of Ultimate Moves. All stats [FFAE00]-30%[-].\\n(Excludes Stance and Recovery Skills)[-]"
   }
  },
  "951477": {
   "name": {
    "it": "Trasferimento di Debuff",
    "en": "Debuff Transfer"
   },
   "text": {
    "it": "Se c'è un nemico colpito dal Debuff [00D5FF]Tomba della morte[-] alla fine del suo turno, i nemici adiacenti subisco [00D5FF]Tocco della morte[-] per [FFAE00]1 turno[-].\\n\\n[00D5FF]※Tocco della morte: disabilita le Abilità Attacco.\\nViene rimosso dopo aver usato un'abilità.[-]",
    "en": "If there is an enemy affected by the [00D5FF]Death's Tomb[-] Debuff at the end of their turn, enemies adjacent to them are inflicted with [00D5FF]Death's Touch[-] for [FFAE00]1 turn[-].\\n\\n[00D5FF]※Death's Touch: Disables Attack Skills.\\nRemoved upon using a skill.[-]"
   }
  },
  "951478": {
   "name": {
    "it": "Resistenza contrattacco",
    "en": "Counter Resistance"
   },
   "text": {
    "it": "Quando si subiscono danni dal contrattacco di un nemico, tutte le statistiche di quel nemico si riducono dell'[FFAE00]80%[-].",
    "en": "When taking damage from an enemy's counter, all stats of that enemy decrease by [FFAE00]80%[-]."
   }
  },
  "951479": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Aumenta le statistiche relative all'Attacco del [FFAE00]10%[-] per [FFAE00]ogni[-] Debuff [00D5FF]Tocco della morte e Tomba della morte[-] sul nemico.\\n[00D5FF](Limite: 8 volta/e)[-]\\n\\n[00D5FF]※Tocco della morte: disabilita le Abilità Attacco.\\nViene rimosso dopo aver usato un'abilità.[-]\\n[00D5FF]※Tomba della morte: blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali. Tutte le statistiche [FFAE00]-30%[-].\\n(Abilità Recupero e Atteggiamento escluse)[-]",
    "en": "Increases Attack-related stats by [FFAE00]10%[-] for [FFAE00]each[-] [00D5FF]Death's Touch and Death's Tomb[-] Debuff on the enemy.\\n[00D5FF](Limit 8 time(s))[-]\\n\\n[00D5FF]※Death's Touch: Disables Attack Skills.\\nRemoved upon using a skill.[-]\\n[00D5FF]※Death's Tomb: Blocks all skill effects including those of Ultimate Moves. All stats [FFAE00]-50%[-].\\n(Excludes Stance and Recovery Skills)[-]"
   }
  },
  "951480": {
   "name": {
    "it": "Comportamento radicato",
    "en": "Grounded Attitude"
   },
   "text": {
    "it": "Ottiene l'effetto Abilità [00D5FF]Bozzolo malvagio[-] all'inizio della battaglia.",
    "en": "Gains the [00D5FF]Evil Cocoon[-] skill effect at the start of the battle."
   }
  },
  "951481": {
   "name": {
    "it": "Riduzione statistiche relative ai PS",
    "en": "HP-related Stats Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] le statistiche relative ai PS di tutti i nemici quando assumono un Atteggiamento.",
    "en": "Decreases HP-related stats of all enemies by [FFAE00]40%[-] when assuming a Stance."
   }
  }
 },
 "items": {
  "520001": {
   "name": {
    "it": "Martello di Vaizel",
    "en": "Hammer of Vaizel"
   },
   "icon": true
  },
  "530001": {
   "name": {
    "it": "Incudine",
    "en": "Anvil"
   },
   "icon": true
  },
  "540012": {
   "name": {
    "it": "Frammento di Caos",
    "en": "Chaos Fragment"
   },
   "icon": true
  },
  "542404": {
   "name": {
    "it": "Ciondolo dell'evoluzione",
    "en": "Evolution Pendant"
   },
   "icon": true
  },
  "542405": {
   "name": {
    "it": "Ciondolo dell'evoluzione",
    "en": "Evolution Pendant"
   },
   "icon": true
  },
  "543101": {
   "name": {
    "it": "Corno di Demone rosso",
    "en": "Red Demon's Horn"
   },
   "icon": true
  },
  "543102": {
   "name": {
    "it": "Ala di Demone grigio",
    "en": "Gray Demon's Wing"
   },
   "icon": true
  },
  "543103": {
   "name": {
    "it": "Orecchio di Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex's Ear"
   },
   "icon": true
  },
  "543104": {
   "name": {
    "it": "Nucleo di Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth's Core"
   },
   "icon": true
  },
  "543105": {
   "name": {
    "it": "Energia del Demone Originale",
    "en": "Original Demon's Energy"
   },
   "icon": true
  },
  "543215": {
   "name": {
    "it": "Magnificenza del Valhalla",
    "en": "Magnificence of Valhalla"
   },
   "icon": true
  },
  "545101": {
   "name": {
    "it": "Sfera di Hraesvelgr",
    "en": "Hraesvelgr's Orb"
   },
   "icon": true
  },
  "545102": {
   "name": {
    "it": "Piuma di Hraesvelgr",
    "en": "Hraesvelgr's Feather"
   },
   "icon": true
  },
  "912099": {
   "name": {
    "it": "Dono del sovrano",
    "en": "Ruler's Gift"
   },
   "icon": true
  },
  "1000606": {
   "name": {
    "it": "Gioiello selezione King",
    "en": "King Selection Jewel"
   },
   "icon": true
  },
  "1260103": {
   "name": {
    "it": "Cassa del Cristallo della Memoria I",
    "en": "Memory Crystal Box I"
   },
   "icon": true
  },
  "1260104": {
   "name": {
    "it": "Cassa del Cristallo della Memoria II",
    "en": "Memory Crystal Box II"
   },
   "icon": true
  },
  "1260137": {
   "name": {
    "it": "Cassa selezione Cristallo della Memoria I",
    "en": "Memory Crystal Selection Box I"
   },
   "icon": true
  },
  "1260138": {
   "name": {
    "it": "Cassa selezione Cristallo della Memoria II",
    "en": "Memory Crystal Selection Box II"
   },
   "icon": true
  },
  "5301011": {
   "name": {
    "it": "Cristallo della Memoria (Demone)",
    "en": "Memory Crystal (Demon)"
   },
   "icon": true
  },
  "5301012": {
   "name": {
    "it": "Cristallo della Memoria (Gigante)",
    "en": "Memory Crystal (Giant)"
   },
   "icon": true
  },
  "5301013": {
   "name": {
    "it": "Cristallo della Memoria (Umano)",
    "en": "Memory Crystal (Human)"
   },
   "icon": true
  },
  "5301014": {
   "name": {
    "it": "Cristallo della Memoria (Fata)",
    "en": "Memory Crystal (Fairy)"
   },
   "icon": true
  },
  "5301015": {
   "name": {
    "it": "Cristallo della Memoria (Dea)",
    "en": "Memory Crystal (Goddess)"
   },
   "icon": true
  },
  "5301016": {
   "name": {
    "it": "Cristallo della Memoria (Sconosciuto)",
    "en": "Memory Crystal (Unknown)"
   },
   "icon": true
  },
  "6020063": {
   "name": {
    "it": "Creatura indigena del Purgatorio (Sigillo)",
    "en": "Indigenous Purgatory Creature (Seal)"
   },
   "icon": true
  },
  "6020064": {
   "name": {
    "it": "Creatura indigena del Purgatorio (Cavalletta)",
    "en": "Indigenous Purgatory Creature (Grasshopper)"
   },
   "icon": true
  }
 }
};
