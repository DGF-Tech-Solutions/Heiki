/**
 * Gli Scontri finali («Death Match») di Grand Cross.
 *
 * FONTE: il client, via python script/scontri_finali.py (eroi/scontri_finali.json).
 * Le 118 righe di DB_stage_destroy sono 7 boss: lo stesso boss nelle sei regioni e'
 * lo stesso scontro, e cambia solo il materiale dei costumi dei boss 2 e 3 stelle.
 * Qui i 6 fissi: Lamek, d'evento, resta fuori (scelta dell'utente, 26/09).
 * Lo studio, con quello che e' letto e quello che e' dedotto: SCONTRI_FINALI.md.
 *
 * GENERATO DA scripts/import-endgame.mts - NON MODIFICARE A MANO.
 */

import type { DeathMatchIndex } from "../endgame-types";

export const DEATH_MATCH: DeathMatchIndex = {
 "name": {
  "it": "Scontro finale",
  "en": "Death Match"
 },
 "rules": [
  {
   "it": "1. Info Scontro finale\\nLo Scontro finale è una modalità di gioco in cui i giocatori devono scacciare i boss che invadono i villaggi.\\nI giocatori possono partecipare a battaglie a 2 giocatori in tempo reale.\\nInvita gli amici o i membri dell'Ordine dei cavalieri e giocate assieme.",
   "en": "1. Death Match Info\\nDeath Match is a game mode in which players drive out bosses that invade villages.\\nPlayers can participate in real-time 2-player battles.\\nInvite friends or Knighthood members and play together."
  },
  {
   "it": "2. Avvenimento degli Scontri finali\\nGli Scontri finali vengono sbloccati al Capitolo 5.\\nDopo che viene sbloccato lo Scontro finale, ogni Battaglia Boss dei capitoli completata aumenterà il Tasso scontro finale, con i Boss Scontro finale che arrivano nel villaggio al 100%.\\nNon puoi entrare nei villaggi dov'è apparso un Boss Scontro finale.",
   "en": "2. Death Match Occurrence\\nDeath Match is unlocked during Chapter 5.\\nAfter Death Match is unlocked, each chapter's cleared Boss Battle increases the Death Match Rate, with the Death Match Boss appearing in the village at 100%.\\nYou may not enter villages where the Death Match Boss has appeared."
  },
  {
   "it": "3. Limite di tempo Scontro finale\\nIl limite di tempo per uno Scontro finale è di 60 minuti.\\nSe il Boss non viene sconfitto entro il tempo limite, lo Scontro finale verrà considerato come fallito.",
   "en": "3. Death Match Time Limit\\nThe time limit for a Death Match is 60 minutes.\\nIf the boss is not defeated within the time limit, Death Match will result in failure."
  },
  {
   "it": "4. Combattimento nello Scontro finale\\nOgni Boss Scontro finale ha abilità Uniche.\\nUsa combinazioni diverse di Eroi per sconfiggere i Boss.\\nIl boss riempie la sua Barra Mossa finale con l'uso delle abilità e i loro effetti.",
   "en": "4. Fighting in Death Match\\nDeath Match Bosses each have unique abilities.\\nUse different combinations of heroes to defeat bosses.\\nThe boss fills its Ultimate Move Gauge through skill use and skill effects."
  },
  {
   "it": "5. ★★ (2☆) Informazioni Battaglia Boss\\nPorta a termine la missione [Episodio 204 - Larva demoniaca] per sbloccare le Battaglie Boss 2☆, che seguono le stesse regole per l'attuale Scontro finale.\\nCompletare la Battaglia Boss 2☆ aumenta la possibilità che appaia uno Scontro finale a parte, e appariranno i boss Bellmoth Bestia demoniaca e Demone originale dello Scontro finale.",
   "en": "5. ★★ (2☆) Boss Battle Info\\nClear the quest [Episode 204 - Demonic Larva] to unlock 2☆ Boss Battles, which follow the existing Death Match occurrence rules.\\nClearing a 2☆ Boss Battle increases a separate Death Match occurrence rate, and Death Match bosses Demonic Beast Bellmoth and Original Demon will appear."
  },
  {
   "it": "6. ★★★ (3☆) Informazioni Battaglia Boss\\nSi sblocca con le Battaglie Boss 2☆.\\nCompletare la Battaglia Boss 3☆ aumenta la possibilità che appaia uno Scontro finale a parte, e apparirà il Boss Scontro finale Indura della Punizione.\\n\\nLe Battaglie Boss 2☆ e 3☆ condividono lo Scontro finale che si sblocca in ogni capitolo. Per esempio, se uno Scontro finale attiva una Battaglia Boss 2☆ nel Capitolo 1, le Battaglie Boss 3☆ non attiveranno altri Scontri finali per il resto della giornata.\\nGli Scontri finali Indura della Punizione possono avvenire fino a 3 volte al giorno.",
   "en": "6. ★★★ (3☆) Boss Battle Info\\nUnlocks with 2☆ Boss Battles.\\nClearing a 3☆ Boss Battle increases a separate Death Match occurrence rate, and Death Match Boss Indura of Retribution will appear.\\n\\n2☆ and 3☆ Boss Battles share Death Match unlocks in each chapter. For example, if a Death Match triggers for a 2☆ Boss Battle in Chapter 1, 3☆ Boss Battles will not trigger Death Matches for the rest of the day.\\nIndura of Retribution Death Matches can occur up to 3 times per day."
  }
 ],
 "limits": {
  "minutes": 60,
  "chaosPerDay": 3
 },
 "regions": {
  "1": {
   "name": {
    "it": "Vanya",
    "en": "Vanya"
   },
   "chapter": 1
  },
  "2": {
   "name": {
    "it": "Dalmally",
    "en": "Dalmally"
   },
   "chapter": 2
  },
  "3": {
   "name": {
    "it": "Città postale Tala",
    "en": "Post Town Tala"
   },
   "chapter": 3
  },
  "4": {
   "name": {
    "it": "Vaizel",
    "en": "Vaizel"
   },
   "chapter": 4
  },
  "5": {
   "name": {
    "it": "Villaggio di Ordan",
    "en": "Ordan Village"
   },
   "chapter": 5
  },
  "6": {
   "name": {
    "it": "Castello di Liones",
    "en": "Liones Castle"
   },
   "chapter": 6
  }
 },
 "bosses": [
  {
   "key": "red-demon",
   "name": {
    "it": "Demone rosso",
    "en": "Red Demon"
   },
   "stars": 1,
   "regions": [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
   ],
   "race": 1,
   "attribute": 1,
   "advantage": 3,
   "guide": [
    {
     "it": "Il Demone rosso assume un Atteggiamento in alcune situazioni.",
     "en": "The Red Demon assumes a Stance in certain situations."
    }
   ],
   "warnings": [],
   "image": true,
   "icon": true,
   "cutIn": true,
   "material": "543101",
   "repulse": [
    {
     "id": "543101",
     "count": 4
    },
    {
     "id": "543101",
     "count": 1
    }
   ],
   "aiTeam": {
    "name": {
     "it": "Demone rosse\\nSupporto Sterminio",
     "en": "Red Demon\\nExtermination Support"
    },
    "power": 160000,
    "heroes": [
     "1967501",
     "1931501",
     "1919501",
     "1485001"
    ]
   },
   "artifactSet": {
    "name": {
     "it": "Scontro finale Demone rosso",
     "en": "Red Demon Death Match"
    },
    "cards": [
     {
      "it": "Demone rosso",
      "en": "Red Demon"
     },
     {
      "it": "Ban prigioniero",
      "en": "Prisoner Ban"
     },
     {
      "it": "Incendio a Vanya",
      "en": "Burning Vanya"
     }
    ],
    "levels": [
     "660041",
     "660042",
     "660043"
    ]
   },
   "costumeSets": [
    {
     "name": {
      "it": "Costume Benedizione del fiocco di neve blu",
      "en": "Blessing of the Blue Snowflake Costume"
     },
     "heroes": [
      "1024001",
      "1024002",
      "1030501",
      "1034001",
      "1035001",
      "1035002",
      "1035003",
      "1425001",
      "1425002",
      "1805001",
      "1805002",
      "1944501",
      "1944502",
      "1971501"
     ],
     "effect": {
      "it": "Il [FFAE00]Demone rosso[-] appare quando avviene uno Scontro finale dopo aver portato a termine una Battaglia Boss.\\n[00D5FF](Avviene quando si soddisfa la condizione di sblocco del Demone rosso. Se esistono effetti doppi, solo l'effetto Costume dell'eroe all'estrema sinistra si attiva.)[-]",
      "en": "[FFAE00]Red Demon[-] appears when a Death Match occurs after clearing a Boss Battle.\\n[00D5FF](Appears when Red Demon unlock condition is met. Only the costume effect of the leftmost hero activates if duplicate effects exist.)[-]"
     }
    },
    {
     "name": {
      "it": "Costume bacca scura dolce",
      "en": "Sweet Dark Berry Costume"
     },
     "heroes": [
      "1485001",
      "1485002"
     ],
     "effect": {
      "it": "Acquisisci [FFAE00]1[-] [00D5FF]Profumo seducente[-] al completamento dello Scontro finale Demone rosso a livello di difficoltà [00D5FF]inferno[-].\\n[00D5FF](Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Acquire [FFAE00]1[-] [00D5FF]Alluring Perfume[-] upon clearing Red Demon Death Match on [00D5FF]Hell[-] difficulty.\\n[00D5FF](Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    },
    {
     "name": {
      "it": "Costume Cioccolatino dolce a forma di cuore",
      "en": "Sweet Chocolate Heart Costume"
     },
     "heroes": [
      "1575001",
      "1575002",
      "1575003"
     ],
     "effect": {
      "it": "Ottieni [FFAE00]1[-] [00D5FF]Cassa materiali Miglioramento costumi casuale[-] portando a termine lo Scontro finale.\\n[00D5FF](Limite: 6 al giorno. Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Obtain [FFAE00]1[-] [00D5FF]Random Costume Enhance Materials Box[-] when clearing Death Match.\\n[00D5FF](Limit 6 times per day. Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    }
   ],
   "difficulties": [
    {
     "name": {
      "it": "Normale",
      "en": "Normal"
     },
     "color": "#0093B0",
     "level": 1,
     "bossLevel": 100,
     "energy": 16,
     "gold": 8000,
     "power": 80000,
     "unlock": {
      "it": "Vicino al Villaggio di Ordan",
      "en": "Near Ordan Village"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260102",
        "level": 100,
        "multipliers": {
         "atk": 100,
         "def": 100,
         "hp": 150
        },
        "estimate": {
         "atk": 4935,
         "def": 2952,
         "hp": 105525
        }
       }
      },
      {
       "foe": {
        "monster": "2260104",
        "level": 100,
        "multipliers": {
         "atk": 105,
         "def": 105,
         "hp": 160
        },
        "estimate": {
         "atk": 6867,
         "def": 3328,
         "hp": 115760
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543101",
       "count": 6
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510103",
        "count": 1,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 3,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 2,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 1,
        "weight": 500
       },
       {
        "id": "900903",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "900903",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543101",
        "count": 2,
        "weight": 2500
       },
       {
        "id": "543101",
        "count": 1,
        "weight": 2500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941015",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543101",
        "count": 1,
        "weight": 4000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Difficile",
      "en": "Hard"
     },
     "color": "#DF6100",
     "level": 2,
     "bossLevel": 140,
     "energy": 20,
     "gold": 12000,
     "power": 120000,
     "unlock": {
      "it": "Vicino al Villaggio di Ordan",
      "en": "Near Ordan Village"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260103",
        "level": 140,
        "multipliers": {
         "atk": 130,
         "def": 130,
         "hp": 180
        },
        "estimate": {
         "atk": 9685,
         "def": 6430,
         "hp": 193140
        }
       }
      },
      {
       "foe": {
        "monster": "2260104",
        "level": 140,
        "multipliers": {
         "atk": 150,
         "def": 150,
         "hp": 240
        },
        "estimate": {
         "atk": 13410,
         "def": 6555,
         "hp": 236040
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543101",
       "count": 7
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510104",
        "count": 1,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 3,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 2,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 1,
        "weight": 300
       },
       {
        "id": "900904",
        "count": 2,
        "weight": 1400
       },
       {
        "id": "900904",
        "count": 1,
        "weight": 1400
       },
       {
        "id": "543101",
        "count": 2,
        "weight": 3000
       },
       {
        "id": "543101",
        "count": 1,
        "weight": 3000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941016",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543101",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "543101",
        "count": 1,
        "weight": 3000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Estremo",
      "en": "Extreme"
     },
     "color": "#E800CF",
     "level": 3,
     "bossLevel": 180,
     "energy": 24,
     "gold": 18000,
     "power": 160000,
     "unlock": {
      "it": "Vicino al Villaggio di Ordan",
      "en": "Near Ordan Village"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260102",
        "level": 180,
        "multipliers": {
         "atk": 160,
         "def": 160,
         "hp": 200
        },
        "estimate": {
         "atk": 13656,
         "def": 8307,
         "hp": 244700
        }
       }
      },
      {
       "foe": {
        "monster": "2260103",
        "level": 180,
        "multipliers": {
         "atk": 170,
         "def": 170,
         "hp": 250
        },
        "estimate": {
         "atk": 16065,
         "def": 10720,
         "hp": 338250
        }
       }
      },
      {
       "foe": {
        "monster": "2260104",
        "level": 180,
        "multipliers": {
         "atk": 180,
         "def": 180,
         "hp": 300
        },
        "estimate": {
         "atk": 20412,
         "def": 10026,
         "hp": 373050
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543101",
       "count": 9
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510105",
        "count": 1,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 3,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 2,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 1,
        "weight": 200
       },
       {
        "id": "543203",
        "count": 1,
        "weight": 200
       },
       {
        "id": "900905",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "900905",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543101",
        "count": 3,
        "weight": 3500
       },
       {
        "id": "543101",
        "count": 2,
        "weight": 3500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941017",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543101",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543101",
        "count": 1,
        "weight": 2000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Inferno",
      "en": "Hell"
     },
     "color": "#FF007F",
     "level": 4,
     "bossLevel": 220,
     "energy": 28,
     "gold": 24000,
     "power": 300000,
     "unlock": {
      "it": "[Episodio 142] L'ultimo",
      "en": "[Episode 142] The Last One"
     },
     "allowedAttributes": [
      1,
      2
     ],
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260101",
        "level": 220,
        "multipliers": {
         "atk": 170,
         "def": 250,
         "hp": 250
        },
        "estimate": {
         "atk": 17570,
         "def": 15780,
         "hp": 370875
        }
       }
      },
      {
       "foe": {
        "monster": "2260105",
        "level": 220,
        "multipliers": {
         "atk": 170,
         "def": 320,
         "hp": 300
        },
        "estimate": {
         "atk": 19465,
         "def": 24531,
         "hp": 489900
        }
       }
      },
      {
       "foe": {
        "monster": "2260104",
        "level": 220,
        "multipliers": {
         "atk": 180,
         "def": 300,
         "hp": 400
        },
        "estimate": {
         "atk": 24732,
         "def": 20310,
         "hp": 601400
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543101",
       "count": 12
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543203",
        "count": 1,
        "weight": 800
       },
       {
        "id": "6020001",
        "count": 1,
        "weight": 50
       },
       {
        "id": "510105",
        "count": 1,
        "weight": 600
       },
       {
        "id": "900906",
        "count": 1,
        "weight": 550
       },
       {
        "id": "543101",
        "count": 5,
        "weight": 4000
       },
       {
        "id": "543101",
        "count": 4,
        "weight": 4000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "543203",
        "count": 1,
        "weight": 10000
       }
      ]
     }
    }
   ]
  },
  {
   "key": "gray-demon",
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "stars": 1,
   "regions": [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
   ],
   "race": 1,
   "attribute": 3,
   "advantage": 2,
   "guide": [
    {
     "it": "Il Demone grigio elude gli Attacchi mischia quando il suo Buff Volo è attivo.",
     "en": "Gray Demon evades melee attacks when its Flight buff is active."
    }
   ],
   "warnings": [],
   "image": true,
   "icon": true,
   "cutIn": true,
   "material": "543102",
   "repulse": [
    {
     "id": "543102",
     "count": 4
    },
    {
     "id": "543102",
     "count": 1
    }
   ],
   "aiTeam": {
    "name": {
     "it": "Demone grigio\\nSupporto Sterminio",
     "en": "Gray Demon\\nExtermination Support"
    },
    "power": 180000,
    "heroes": [
     "1095002",
     "1115001",
     "1887501",
     "1495001"
    ]
   },
   "artifactSet": {
    "name": {
     "it": "Scontro finale Demone grigio",
     "en": "Gray Demon Death Match"
    },
    "cards": [
     {
      "it": "Demone grigio",
      "en": "Gray Demon"
     },
     {
      "it": "King, Re delle Fate",
      "en": "King the Fairy King"
     },
     {
      "it": "Incendio a Dalmally",
      "en": "Burning Dalmally"
     }
    ],
    "levels": [
     "660051",
     "660052",
     "660053"
    ]
   },
   "costumeSets": [
    {
     "name": {
      "it": "Costume Grazia del fiocco di neve blu",
      "en": "Grace of the Blue Snowflake Costume"
     },
     "heroes": [
      "1184001",
      "1184002",
      "1185001",
      "1185002",
      "1185003"
     ],
     "effect": {
      "it": "Il [FFAE00]Demone grigio[-] appare quando avviene uno Scontro finale dopo aver portato a termine una Battaglia Boss.\\n[00D5FF](Avviene quando si soddisfa la condizione di sblocco del Demone grigio. Se esistono effetti doppi, solo l'effetto Costume dell'eroe all'estrema sinistra si attiva.)[-]",
      "en": "[FFAE00]Gray Demon[-] appears when a Death Match occurs after clearing a Boss Battle.\\n[00D5FF](Appears when Gray Demon unlock condition is met. Only the costume effect of the leftmost hero activates if duplicate effects exist.)[-]"
     }
    },
    {
     "name": {
      "it": "Costume bacca alla crema dolce",
      "en": "Sweet Cream Berry Costume"
     },
     "heroes": [
      "1495001",
      "1495002"
     ],
     "effect": {
      "it": "Acquisisci [FFAE00]1[-] [00D5FF]Tessuto splendido[-] al completamento dello Scontro finale Demone grigio a livello di difficoltà [00D5FF]inferno[-].\\n[00D5FF](Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Acquire [FFAE00]1[-] [00D5FF]Splendid Fabric[-] upon clearing Gray Demon Death Match on [00D5FF]Hell[-] difficulty.\\n[00D5FF](Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    },
    {
     "name": {
      "it": "Costume Cioccolatino dolce a forma di cuore",
      "en": "Sweet Chocolate Heart Costume"
     },
     "heroes": [
      "1575001",
      "1575002",
      "1575003"
     ],
     "effect": {
      "it": "Ottieni [FFAE00]1[-] [00D5FF]Cassa materiali Miglioramento costumi casuale[-] portando a termine lo Scontro finale.\\n[00D5FF](Limite: 6 al giorno. Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Obtain [FFAE00]1[-] [00D5FF]Random Costume Enhance Materials Box[-] when clearing Death Match.\\n[00D5FF](Limit 6 times per day. Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    }
   ],
   "difficulties": [
    {
     "name": {
      "it": "Normale",
      "en": "Normal"
     },
     "color": "#0093B0",
     "level": 1,
     "bossLevel": 110,
     "energy": 16,
     "gold": 8000,
     "power": 100000,
     "unlock": {
      "it": "[Episodio 73-1] Nuovi alleati",
      "en": "[Episode 73-1] New Allies"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260109",
        "level": 110,
        "multipliers": {
         "atk": 120,
         "def": 100,
         "hp": 280
        },
        "estimate": {
         "atk": 7854,
         "def": 3450,
         "hp": 184660
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543102",
       "count": 6
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510103",
        "count": 1,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 3,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 2,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 1,
        "weight": 500
       },
       {
        "id": "900903",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "900903",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543102",
        "count": 2,
        "weight": 2500
       },
       {
        "id": "543102",
        "count": 1,
        "weight": 2500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941015",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543102",
        "count": 1,
        "weight": 4000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Difficile",
      "en": "Hard"
     },
     "color": "#DF6100",
     "level": 2,
     "bossLevel": 150,
     "energy": 20,
     "gold": 12000,
     "power": 140000,
     "unlock": {
      "it": "[Episodio 73-1] Nuovi alleati",
      "en": "[Episode 73-1] New Allies"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260107",
        "level": 150,
        "multipliers": {
         "atk": 130,
         "def": 100,
         "hp": 280
        },
        "estimate": {
         "atk": 10594,
         "def": 4650,
         "hp": 293580
        }
       }
      },
      {
       "foe": {
        "monster": "2260106",
        "level": 150,
        "multipliers": {
         "atk": 130,
         "def": 100,
         "hp": 280
        },
        "estimate": {
         "atk": 10594,
         "def": 4650,
         "hp": 293580
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543102",
       "count": 7
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510104",
        "count": 1,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 3,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 2,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 1,
        "weight": 300
       },
       {
        "id": "900904",
        "count": 2,
        "weight": 1400
       },
       {
        "id": "900904",
        "count": 1,
        "weight": 1400
       },
       {
        "id": "543102",
        "count": 2,
        "weight": 3000
       },
       {
        "id": "543102",
        "count": 1,
        "weight": 3000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941016",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543102",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "543102",
        "count": 1,
        "weight": 3000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Estremo",
      "en": "Extreme"
     },
     "color": "#E800CF",
     "level": 3,
     "bossLevel": 190,
     "energy": 24,
     "gold": 18000,
     "power": 180000,
     "unlock": {
      "it": "[Episodio 73-1] Nuovi alleati",
      "en": "[Episode 73-1] New Allies"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260107",
        "level": 190,
        "multipliers": {
         "atk": 140,
         "def": 100,
         "hp": 280
        },
        "estimate": {
         "atk": 14265,
         "def": 5850,
         "hp": 366380
        }
       }
      },
      {
       "foe": {
        "monster": "2260106",
        "level": 190,
        "multipliers": {
         "atk": 140,
         "def": 100,
         "hp": 280
        },
        "estimate": {
         "atk": 14265,
         "def": 5850,
         "hp": 366380
        }
       }
      },
      {
       "foe": {
        "monster": "2260108",
        "level": 190,
        "multipliers": {
         "atk": 140,
         "def": 100,
         "hp": 340
        },
        "estimate": {
         "atk": 16716,
         "def": 7760,
         "hp": 409360
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543102",
       "count": 9
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510105",
        "count": 1,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 3,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 2,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 1,
        "weight": 200
       },
       {
        "id": "543202",
        "count": 1,
        "weight": 200
       },
       {
        "id": "900905",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "900905",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543102",
        "count": 3,
        "weight": 3500
       },
       {
        "id": "543102",
        "count": 2,
        "weight": 3500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941017",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543102",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543102",
        "count": 1,
        "weight": 2000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Inferno",
      "en": "Hell"
     },
     "color": "#FF007F",
     "level": 4,
     "bossLevel": 230,
     "energy": 28,
     "gold": 24000,
     "power": 300000,
     "unlock": {
      "it": "[Episodio 142] L'ultimo",
      "en": "[Episode 142] The Last One"
     },
     "allowedAttributes": [
      1,
      3
     ],
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260112",
        "level": 230,
        "multipliers": {
         "atk": 150,
         "def": 150,
         "hp": 350
        },
        "estimate": {
         "atk": 18344,
         "def": 10575,
         "hp": 548975
        }
       }
      },
      {
       "foe": {
        "monster": "2260110",
        "level": 230,
        "multipliers": {
         "atk": 150,
         "def": 150,
         "hp": 350
        },
        "estimate": {
         "atk": 18344,
         "def": 10575,
         "hp": 548975
        }
       }
      },
      {
       "foe": {
        "monster": "2260113",
        "level": 230,
        "multipliers": {
         "atk": 150,
         "def": 150,
         "hp": 500
        },
        "estimate": {
         "atk": 21510,
         "def": 14040,
         "hp": 722000
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543102",
       "count": 12
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543202",
        "count": 1,
        "weight": 800
       },
       {
        "id": "6020002",
        "count": 1,
        "weight": 50
       },
       {
        "id": "510105",
        "count": 1,
        "weight": 600
       },
       {
        "id": "900906",
        "count": 1,
        "weight": 550
       },
       {
        "id": "543102",
        "count": 5,
        "weight": 4000
       },
       {
        "id": "543102",
        "count": 4,
        "weight": 4000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "543202",
        "count": 1,
        "weight": 10000
       }
      ]
     }
    }
   ]
  },
  {
   "key": "crimson-demon",
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "stars": 1,
   "regions": [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
   ],
   "race": 1,
   "attribute": 2,
   "advantage": 1,
   "guide": [
    {
     "it": "La Bestia demoniaca Howlex attacca solamente i bersagli marchiati.",
     "en": "Demonic Beast Howlex only attacks Branded targets."
    }
   ],
   "warnings": [],
   "image": true,
   "icon": true,
   "cutIn": true,
   "material": "543103",
   "repulse": [
    {
     "id": "543103",
     "count": 4
    },
    {
     "id": "543103",
     "count": 1
    }
   ],
   "aiTeam": {
    "name": {
     "it": "Bestia demoniaca Howlex\\nSupporto Sterminio",
     "en": "Demonic Beast Howlex\\nExtermination Support"
    },
    "power": 200000,
    "heroes": [
     "1056502",
     "1395001",
     "1956501",
     "1065003"
    ]
   },
   "artifactSet": {
    "name": {
     "it": "Scontro finale Bestia demoniaca Howlex",
     "en": "Demonic Beast Howlex Death Match"
    },
    "cards": [
     {
      "it": "Bestia demoniaca Howlex",
      "en": "Demonic Beast Howlex"
     },
     {
      "it": "Oste Meliodas",
      "en": "Master Meliodas"
     },
     {
      "it": "Incendio a Città postale Tala",
      "en": "Burning Post Town Tala"
     }
    ],
    "levels": [
     "660061",
     "660062",
     "660063"
    ]
   },
   "costumeSets": [
    {
     "name": {
      "it": "Costume Gloria del fiocco di neve blu",
      "en": "Glory of the Blue Snowflake Costume"
     },
     "heroes": [
      "1004001",
      "1005001",
      "1005002",
      "1005003",
      "1010501",
      "1015001",
      "1015002",
      "1015003",
      "1395001",
      "1395002",
      "1880501",
      "1880502",
      "1920501",
      "1945501",
      "1971501",
      "2007501",
      "2009501"
     ],
     "effect": {
      "it": "La [FFAE00]Bestia demoniaca Howlex[-] appare quando avviene uno Scontro finale dopo aver portato a termine una Battaglia Boss.\\n\\n[00D5FF](Appare quando si soddisfano le condizioni di sblocco della Bestia demoniaca Howlex. Se esistono effetti doppi, solo l'effetto Costume dell'eroe all'estrema sinistra si attiva.)[-]",
      "en": "[FFAE00]Demonic Beast Howlex[-] appears when a Death Match occurs after clearing a Boss Battle.\\n\\n[00D5FF](Appears when Demonic Beast Howlex unlock conditions are met. Only the costume effect of the leftmost hero activates if duplicate effects exist.)[-]"
     }
    },
    {
     "name": {
      "it": "Costume cioccolato alla menta dolce",
      "en": "Sweet Mint Chocolate Costume"
     },
     "heroes": [
      "1385001",
      "1385002",
      "1385003",
      "1878501",
      "1878502",
      "1878503"
     ],
     "effect": {
      "it": "Acquisisci [FFAE00]1[-] [00D5FF]Componente brillante[-] al completamento dello Scontro finale Bestia demoniaca Howlex a livello di difficoltà [00D5FF]inferno[-].\\n[00D5FF](Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Acquire [FFAE00]1[-] [00D5FF]Brilliant Component[-] upon clearing Demonic Beast Howlex Death Match on [00D5FF]Hell[-] difficulty.\\n[00D5FF](Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    },
    {
     "name": {
      "it": "Costume Cioccolatino dolce a forma di cuore",
      "en": "Sweet Chocolate Heart Costume"
     },
     "heroes": [
      "1575001",
      "1575002",
      "1575003"
     ],
     "effect": {
      "it": "Ottieni [FFAE00]1[-] [00D5FF]Cassa materiali Miglioramento costumi casuale[-] portando a termine lo Scontro finale.\\n[00D5FF](Limite: 6 al giorno. Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Obtain [FFAE00]1[-] [00D5FF]Random Costume Enhance Materials Box[-] when clearing Death Match.\\n[00D5FF](Limit 6 times per day. Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    }
   ],
   "difficulties": [
    {
     "name": {
      "it": "Normale",
      "en": "Normal"
     },
     "color": "#0093B0",
     "level": 1,
     "bossLevel": 120,
     "energy": 16,
     "gold": 8000,
     "power": 120000,
     "unlock": {
      "it": "[Episodio 121] Derubati del potere",
      "en": "[Episode 121] Robbed of Power"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260126",
        "level": 120,
        "multipliers": {
         "atk": 130,
         "def": 110,
         "hp": 200
        },
        "estimate": {
         "atk": 9184,
         "def": 4147,
         "hp": 131000
        }
       }
      },
      {
       "foe": {
        "monster": "2260128",
        "level": 120,
        "multipliers": {
         "atk": 140,
         "def": 160,
         "hp": 340
        },
        "estimate": {
         "atk": 9933,
         "def": 6032,
         "hp": 276760
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543103",
       "count": 6
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510103",
        "count": 1,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 3,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 2,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 1,
        "weight": 500
       },
       {
        "id": "900903",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "900903",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543103",
        "count": 2,
        "weight": 2500
       },
       {
        "id": "543103",
        "count": 1,
        "weight": 2500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941015",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543103",
        "count": 1,
        "weight": 4000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Difficile",
      "en": "Hard"
     },
     "color": "#DF6100",
     "level": 2,
     "bossLevel": 160,
     "energy": 20,
     "gold": 12000,
     "power": 160000,
     "unlock": {
      "it": "[Episodio 121] Derubati del potere",
      "en": "[Episode 121] Robbed of Power"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260127",
        "level": 160,
        "multipliers": {
         "atk": 100,
         "def": 106,
         "hp": 220
        },
        "estimate": {
         "atk": 10140,
         "def": 7007,
         "hp": 279950
        }
       }
      },
      {
       "foe": {
        "monster": "2260128",
        "level": 160,
        "multipliers": {
         "atk": 160,
         "def": 170,
         "hp": 380
        },
        "estimate": {
         "atk": 14872,
         "def": 8449,
         "hp": 400520
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543103",
       "count": 7
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510104",
        "count": 1,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 3,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 2,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 1,
        "weight": 300
       },
       {
        "id": "900904",
        "count": 2,
        "weight": 1400
       },
       {
        "id": "900904",
        "count": 1,
        "weight": 1400
       },
       {
        "id": "543103",
        "count": 2,
        "weight": 3000
       },
       {
        "id": "543103",
        "count": 1,
        "weight": 3000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941016",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543103",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "543103",
        "count": 1,
        "weight": 3000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Estremo",
      "en": "Extreme"
     },
     "color": "#E800CF",
     "level": 3,
     "bossLevel": 200,
     "energy": 24,
     "gold": 18000,
     "power": 200000,
     "unlock": {
      "it": "[Episodio 121] Derubati del potere",
      "en": "[Episode 121] Robbed of Power"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260124",
        "level": 200,
        "multipliers": {
         "atk": 130,
         "def": 150,
         "hp": 240
        },
        "estimate": {
         "atk": 14904,
         "def": 9255,
         "hp": 253200
        }
       }
      },
      {
       "foe": {
        "monster": "2260127",
        "level": 200,
        "multipliers": {
         "atk": 120,
         "def": 150,
         "hp": 240
        },
        "estimate": {
         "atk": 15048,
         "def": 12315,
         "hp": 377400
        }
       }
      },
      {
       "foe": {
        "monster": "2260128",
        "level": 200,
        "multipliers": {
         "atk": 170,
         "def": 200,
         "hp": 480
        },
        "estimate": {
         "atk": 19542,
         "def": 12340,
         "hp": 621120
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543103",
       "count": 9
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510105",
        "count": 1,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 3,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 2,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 1,
        "weight": 200
       },
       {
        "id": "543201",
        "count": 1,
        "weight": 200
       },
       {
        "id": "900905",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "900905",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543103",
        "count": 3,
        "weight": 3500
       },
       {
        "id": "543103",
        "count": 2,
        "weight": 3500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941017",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543103",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543103",
        "count": 1,
        "weight": 2000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Inferno",
      "en": "Hell"
     },
     "color": "#FF007F",
     "level": 4,
     "bossLevel": 240,
     "energy": 28,
     "gold": 24000,
     "power": 300000,
     "unlock": {
      "it": "[Episodio 142] L'ultimo",
      "en": "[Episode 142] The Last One"
     },
     "allowedAttributes": [
      2,
      3
     ],
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260129",
        "level": 240,
        "multipliers": {
         "atk": 130,
         "def": 150,
         "hp": 300
        },
        "estimate": {
         "atk": 17764,
         "def": 11055,
         "hp": 376500
        }
       }
      },
      {
       "foe": {
        "monster": "2260130",
        "level": 240,
        "multipliers": {
         "atk": 130,
         "def": 150,
         "hp": 350
        },
        "estimate": {
         "atk": 19422,
         "def": 14715,
         "hp": 655375
        }
       }
      },
      {
       "foe": {
        "monster": "2260125",
        "level": 240,
        "multipliers": {
         "atk": 180,
         "def": 300,
         "hp": 720
        },
        "estimate": {
         "atk": 24651,
         "def": 22110,
         "hp": 1104480
        }
       }
      }
     ],
     "guaranteed": [
      {
       "id": "543103",
       "count": 12
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543201",
        "count": 1,
        "weight": 800
       },
       {
        "id": "6020007",
        "count": 1,
        "weight": 50
       },
       {
        "id": "510105",
        "count": 1,
        "weight": 600
       },
       {
        "id": "900906",
        "count": 1,
        "weight": 550
       },
       {
        "id": "543103",
        "count": 5,
        "weight": 4000
       },
       {
        "id": "543103",
        "count": 4,
        "weight": 4000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "543201",
        "count": 1,
        "weight": 10000
       }
      ]
     }
    }
   ]
  },
  {
   "key": "demon-bellmoth",
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "stars": 2,
   "regions": [
    "1",
    "2",
    "3"
   ],
   "race": 1,
   "attribute": 3,
   "advantage": 2,
   "guide": [
    {
     "it": "All'inizio della battaglia, la Bestia Demoniaca Bellmoth applica un effetto che impedisce a tutti i nemici di usare abilità Buff. Quando assume un Atteggiamento, limita il Recupero di tutti i nemici.",
     "en": "At the start of battle, Demonic Beast Bellmoth applies an effect which prevents all enemies from using Buff Skills. When assuming a Stance, it restricts all enemies' Recovery."
    }
   ],
   "warnings": [],
   "image": true,
   "icon": true,
   "cutIn": true,
   "material": "543104",
   "repulse": [
    {
     "id": "543104",
     "count": 4
    },
    {
     "id": "543104",
     "count": 1
    }
   ],
   "aiTeam": {
    "name": {
     "it": "Bestia demoniaca Bellmoth\\nSupporto Sterminio",
     "en": "Demonic Beast Bellmoth\\nExtermination Support"
    },
    "power": 240000,
    "heroes": [
     "1881501",
     "1901501",
     "1968501",
     "1896501"
    ]
   },
   "artifactSet": {
    "name": {
     "it": "Scontro finale Bestia demoniaca Bellmoth",
     "en": "Demonic Beast Bellmoth Death Match"
    },
    "cards": [
     {
      "it": "Bestia demoniaca Bellmoth",
      "en": "Demonic Beast Bellmoth"
     },
     {
      "it": "Jericho cavaliere sacro",
      "en": "Holy Knight Jericho"
     },
     {
      "it": "Incendio a Vaizel",
      "en": "Burning Vaizel"
     }
    ],
    "levels": [
     "660071",
     "660072",
     "660073"
    ]
   },
   "costumeSets": [
    {
     "name": {
      "it": "Costume Cioccolatino dolce a forma di cuore",
      "en": "Sweet Chocolate Heart Costume"
     },
     "heroes": [
      "1575001",
      "1575002",
      "1575003"
     ],
     "effect": {
      "it": "Ottieni [FFAE00]1[-] [00D5FF]Cassa materiali Miglioramento costumi casuale[-] portando a termine lo Scontro finale.\\n[00D5FF](Limite: 6 al giorno. Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Obtain [FFAE00]1[-] [00D5FF]Random Costume Enhance Materials Box[-] when clearing Death Match.\\n[00D5FF](Limit 6 times per day. Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    }
   ],
   "difficulties": [
    {
     "name": {
      "it": "Normale",
      "en": "Normal"
     },
     "color": "#0093B0",
     "level": 1,
     "bossLevel": 120,
     "energy": 16,
     "gold": 8000,
     "power": 160000,
     "unlock": {
      "it": "[Capitolo 204] Larva demoniaca",
      "en": "[Episode 204] Demonic Larva"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260273",
        "level": 120,
        "multipliers": {
         "atk": 100,
         "def": 110,
         "hp": 200
        },
        "estimate": {
         "atk": 7928,
         "def": 5800,
         "hp": 144520
        }
       }
      },
      {
       "foe": {
        "monster": "2260274",
        "level": 120,
        "multipliers": {
         "atk": 140,
         "def": 160,
         "hp": 340
        },
        "estimate": {
         "atk": 9503,
         "def": 9619,
         "hp": 236300
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510103",
        "count": 1,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 3,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 2,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 1,
        "weight": 500
       },
       {
        "id": "900903",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "900903",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543104",
        "count": 3,
        "weight": 2500
       },
       {
        "id": "543104",
        "count": 2,
        "weight": 2500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941015",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543104",
        "count": 1,
        "weight": 4000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Difficile",
      "en": "Hard"
     },
     "color": "#DF6100",
     "level": 2,
     "bossLevel": 160,
     "energy": 20,
     "gold": 12000,
     "power": 200000,
     "unlock": {
      "it": "[Capitolo 204] Larva demoniaca",
      "en": "[Episode 204] Demonic Larva"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260275",
        "level": 160,
        "multipliers": {
         "atk": 100,
         "def": 106,
         "hp": 220
        },
        "estimate": {
         "atk": 8868,
         "def": 8408,
         "hp": 196900
        }
       }
      },
      {
       "foe": {
        "monster": "2260276",
        "level": 160,
        "multipliers": {
         "atk": 160,
         "def": 170,
         "hp": 380
        },
        "estimate": {
         "atk": 16224,
         "def": 12403,
         "hp": 340100
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510104",
        "count": 1,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 3,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 2,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 1,
        "weight": 300
       },
       {
        "id": "900904",
        "count": 2,
        "weight": 1400
       },
       {
        "id": "900904",
        "count": 1,
        "weight": 1400
       },
       {
        "id": "543104",
        "count": 3,
        "weight": 3000
       },
       {
        "id": "543104",
        "count": 2,
        "weight": 3000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941016",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543104",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "543104",
        "count": 1,
        "weight": 3000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Estremo",
      "en": "Extreme"
     },
     "color": "#E800CF",
     "level": 3,
     "bossLevel": 200,
     "energy": 24,
     "gold": 18000,
     "power": 240000,
     "unlock": {
      "it": "[Capitolo 204] Larva demoniaca",
      "en": "[Episode 204] Demonic Larva"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260277",
        "level": 200,
        "multipliers": {
         "atk": 110,
         "def": 150,
         "hp": 240
        },
        "estimate": {
         "atk": 14177,
         "def": 12950,
         "hp": 277104
        }
       }
      },
      {
       "foe": {
        "monster": "2260278",
        "level": 200,
        "multipliers": {
         "atk": 100,
         "def": 150,
         "hp": 300
        },
        "estimate": {
         "atk": 10948,
         "def": 14778,
         "hp": 328500
        }
       }
      },
      {
       "foe": {
        "monster": "2260279",
        "level": 200,
        "multipliers": {
         "atk": 140,
         "def": 200,
         "hp": 480
        },
        "estimate": {
         "atk": 17556,
         "def": 18112,
         "hp": 525600
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510105",
        "count": 1,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 3,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 2,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 1,
        "weight": 200
       },
       {
        "id": "543201",
        "count": 1,
        "weight": 200
       },
       {
        "id": "900905",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "900905",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543104",
        "count": 3,
        "weight": 3500
       },
       {
        "id": "543104",
        "count": 2,
        "weight": 3500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941017",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543104",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543104",
        "count": 1,
        "weight": 2000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Inferno",
      "en": "Hell"
     },
     "color": "#FF007F",
     "level": 4,
     "bossLevel": 240,
     "energy": 28,
     "gold": 24000,
     "power": 400000,
     "unlock": {
      "it": "[Episodio 222] Sopravvissuti",
      "en": "[Episode 222] Survivors"
     },
     "allowedAttributes": [
      1,
      3
     ],
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "2260277",
        "level": 240,
        "multipliers": {
         "atk": 110,
         "def": 150,
         "hp": 350
        },
        "estimate": {
         "atk": 16905,
         "def": 15470,
         "hp": 479710
        }
       }
      },
      {
       "foe": {
        "monster": "2260278",
        "level": 240,
        "multipliers": {
         "atk": 100,
         "def": 150,
         "hp": 450
        },
        "estimate": {
         "atk": 13028,
         "def": 17658,
         "hp": 582750
        }
       }
      },
      {
       "foe": {
        "monster": "2260279",
        "level": 240,
        "multipliers": {
         "atk": 140,
         "def": 300,
         "hp": 600
        },
        "estimate": {
         "atk": 20916,
         "def": 32448,
         "hp": 777000
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": null,
        "count": 2,
        "weight": 800,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203"
        }
       },
       {
        "id": "6020008",
        "count": 1,
        "weight": 50
       },
       {
        "id": "510105",
        "count": 1,
        "weight": 600
       },
       {
        "id": "900906",
        "count": 1,
        "weight": 550
       },
       {
        "id": "543104",
        "count": 4,
        "weight": 4000
       },
       {
        "id": "543104",
        "count": 3,
        "weight": 4000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": null,
        "count": 1,
        "weight": 10000,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203"
        }
       }
      ]
     }
    }
   ]
  },
  {
   "key": "demon-origin",
   "name": {
    "it": "Demone Originale",
    "en": "Original Demon"
   },
   "stars": 2,
   "regions": [
    "4",
    "5",
    "6"
   ],
   "race": 1,
   "attribute": 2,
   "advantage": 1,
   "guide": [],
   "warnings": [],
   "image": true,
   "icon": true,
   "cutIn": true,
   "material": "543105",
   "repulse": [
    {
     "id": "543105",
     "count": 4
    },
    {
     "id": "543105",
     "count": 1
    }
   ],
   "aiTeam": {
    "name": {
     "it": "Demone originale\\nSupporto Sterminio",
     "en": "Original Demon\\nExtermination Support"
    },
    "power": 300000,
    "heroes": [
     "1395001",
     "1056502",
     "1956501",
     "1065003"
    ]
   },
   "artifactSet": {
    "name": {
     "it": "Scontro finale Demone Originale",
     "en": "Original Demon Death Match"
    },
    "cards": [
     {
      "it": "Demone Originale",
      "en": "Original Demon"
     },
     {
      "it": "Diane mercenaria",
      "en": "Mercenary Diane"
     },
     {
      "it": "Piazza del villaggio di Ordan in fiamme",
      "en": "Burning Ordan Village Square"
     }
    ],
    "levels": [
     "660163",
     "660164",
     "660165"
    ]
   },
   "costumeSets": [
    {
     "name": {
      "it": "Costume Cioccolatino dolce a forma di cuore",
      "en": "Sweet Chocolate Heart Costume"
     },
     "heroes": [
      "1575001",
      "1575002",
      "1575003"
     ],
     "effect": {
      "it": "Ottieni [FFAE00]1[-] [00D5FF]Cassa materiali Miglioramento costumi casuale[-] portando a termine lo Scontro finale.\\n[00D5FF](Limite: 6 al giorno. Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Obtain [FFAE00]1[-] [00D5FF]Random Costume Enhance Materials Box[-] when clearing Death Match.\\n[00D5FF](Limit 6 times per day. Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    }
   ],
   "difficulties": [
    {
     "name": {
      "it": "Normale",
      "en": "Normal"
     },
     "color": "#0093B0",
     "level": 1,
     "bossLevel": 120,
     "energy": 16,
     "gold": 8000,
     "power": 200000,
     "unlock": {
      "it": "[Capitolo 204] Larva demoniaca",
      "en": "[Episode 204] Demonic Larva"
     },
     "allowedAttributes": null,
     "bannedHeroes": [
      "1898501",
      "1912501",
      "1893501",
      "1893502",
      "1893503",
      "1911501"
     ],
     "phases": [
      {
       "foe": {
        "monster": "2260318",
        "level": 120,
        "multipliers": {
         "atk": 130,
         "def": 150,
         "hp": 500
        },
        "estimate": {
         "atk": 8605,
         "def": 8088,
         "hp": 361300
        }
       }
      },
      {
       "foe": {
        "monster": "2260319",
        "level": 120,
        "multipliers": {
         "atk": 140,
         "def": 160,
         "hp": 650
        },
        "estimate": {
         "atk": 11336,
         "def": 10000,
         "hp": 451750
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510103",
        "count": 1,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 3,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 2,
        "weight": 500
       },
       {
        "id": "510102",
        "count": 1,
        "weight": 500
       },
       {
        "id": "900903",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "900903",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543105",
        "count": 3,
        "weight": 2500
       },
       {
        "id": "543105",
        "count": 2,
        "weight": 2500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941015",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543105",
        "count": 1,
        "weight": 4000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Difficile",
      "en": "Hard"
     },
     "color": "#DF6100",
     "level": 2,
     "bossLevel": 160,
     "energy": 20,
     "gold": 12000,
     "power": 300000,
     "unlock": {
      "it": "[Capitolo 204] Larva demoniaca",
      "en": "[Episode 204] Demonic Larva"
     },
     "allowedAttributes": null,
     "bannedHeroes": [
      "1898501",
      "1912501",
      "1893501",
      "1893502",
      "1893503",
      "1911501"
     ],
     "phases": [
      {
       "foe": {
        "monster": "2260319",
        "level": 160,
        "multipliers": {
         "atk": 110,
         "def": 160,
         "hp": 450
        },
        "estimate": {
         "atk": 11679,
         "def": 13200,
         "hp": 402750
        }
       }
      },
      {
       "foe": {
        "monster": "2260320",
        "level": 160,
        "multipliers": {
         "atk": 135,
         "def": 140,
         "hp": 600
        },
        "estimate": {
         "atk": 10899,
         "def": 11105,
         "hp": 537000
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510104",
        "count": 1,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 3,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 2,
        "weight": 300
       },
       {
        "id": "510103",
        "count": 1,
        "weight": 300
       },
       {
        "id": "900904",
        "count": 2,
        "weight": 1400
       },
       {
        "id": "900904",
        "count": 1,
        "weight": 1400
       },
       {
        "id": "543105",
        "count": 3,
        "weight": 3000
       },
       {
        "id": "543105",
        "count": 2,
        "weight": 3000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941016",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543105",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "543105",
        "count": 1,
        "weight": 3000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Estremo",
      "en": "Extreme"
     },
     "color": "#E800CF",
     "level": 3,
     "bossLevel": 200,
     "energy": 24,
     "gold": 18000,
     "power": 400000,
     "unlock": {
      "it": "[Capitolo 204] Larva demoniaca",
      "en": "[Episode 204] Demonic Larva"
     },
     "allowedAttributes": null,
     "bannedHeroes": [
      "1898501",
      "1912501",
      "1893501",
      "1893502",
      "1893503",
      "1911501"
     ],
     "phases": [
      {
       "foe": {
        "monster": "2260318",
        "level": 200,
        "multipliers": {
         "atk": 145,
         "def": 160,
         "hp": 420
        },
        "estimate": {
         "atk": 15514,
         "def": 14131,
         "hp": 484932
        }
       }
      },
      {
       "foe": {
        "monster": "2260319",
        "level": 200,
        "multipliers": {
         "atk": 130,
         "def": 185,
         "hp": 600
        },
        "estimate": {
         "atk": 17078,
         "def": 18962,
         "hp": 657000
        }
       }
      },
      {
       "foe": {
        "monster": "2260320",
        "level": 200,
        "multipliers": {
         "atk": 115,
         "def": 170,
         "hp": 650
        },
        "estimate": {
         "atk": 11446,
         "def": 16748,
         "hp": 711750
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "510105",
        "count": 1,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 3,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 2,
        "weight": 200
       },
       {
        "id": "510104",
        "count": 1,
        "weight": 200
       },
       {
        "id": null,
        "count": 1,
        "weight": 200,
        "byRegion": {
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       },
       {
        "id": "900905",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "900905",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543105",
        "count": 3,
        "weight": 3500
       },
       {
        "id": "543105",
        "count": 2,
        "weight": 3500
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941017",
        "count": 2,
        "weight": 6000
       },
       {
        "id": "543105",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543105",
        "count": 1,
        "weight": 2000
       }
      ]
     }
    },
    {
     "name": {
      "it": "Inferno",
      "en": "Hell"
     },
     "color": "#FF007F",
     "level": 4,
     "bossLevel": 240,
     "energy": 28,
     "gold": 24000,
     "power": 550000,
     "unlock": {
      "it": "[Episodio 222] Sopravvissuti",
      "en": "[Episode 222] Survivors"
     },
     "allowedAttributes": [
      2,
      3
     ],
     "bannedHeroes": [
      "1898501",
      "1912501",
      "1893501",
      "1893502",
      "1893503",
      "1911501"
     ],
     "phases": [
      {
       "foe": {
        "monster": "2260318",
        "level": 240,
        "multipliers": {
         "atk": 160,
         "def": 180,
         "hp": 500
        },
        "estimate": {
         "atk": 20382,
         "def": 18994,
         "hp": 685300
        }
       }
      },
      {
       "foe": {
        "monster": "2260319",
        "level": 240,
        "multipliers": {
         "atk": 150,
         "def": 200,
         "hp": 700
        },
        "estimate": {
         "atk": 23486,
         "def": 24500,
         "hp": 906500
        }
       }
      },
      {
       "foe": {
        "monster": "2260320",
        "level": 240,
        "multipliers": {
         "atk": 160,
         "def": 220,
         "hp": 950
        },
        "estimate": {
         "atk": 18933,
         "def": 25898,
         "hp": 1230250
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": null,
        "count": 2,
        "weight": 800,
        "byRegion": {
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       },
       {
        "id": "6020046",
        "count": 1,
        "weight": 50
       },
       {
        "id": "510105",
        "count": 1,
        "weight": 600
       },
       {
        "id": "900906",
        "count": 1,
        "weight": 550
       },
       {
        "id": "543105",
        "count": 4,
        "weight": 4000
       },
       {
        "id": "543105",
        "count": 3,
        "weight": 4000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": null,
        "count": 1,
        "weight": 10000,
        "byRegion": {
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       }
      ]
     }
    }
   ]
  },
  {
   "key": "demon-indura-baruja",
   "name": {
    "it": "Indura della Punizione",
    "en": "Indura of Retribution"
   },
   "stars": 3,
   "regions": [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
   ],
   "race": 6,
   "attribute": 1,
   "advantage": 3,
   "guide": [],
   "warnings": [
    {
     "it": "La finestra «Info mostro» del gioco mette una razza fra le avvantaggiate, ma le passive del boss aumentano i danni che infligge proprio a quella razza. Il client non dice quale delle due informazioni valga.",
     "en": "The game's Monster Info window lists a race as advantaged, but the boss's passives increase the damage it deals to that very race. The client does not say which of the two applies."
    }
   ],
   "image": true,
   "icon": true,
   "cutIn": true,
   "material": "910906",
   "repulse": [
    {
     "id": "910906",
     "count": 1
    },
    {
     "id": "910906",
     "count": 1
    }
   ],
   "aiTeam": {
    "name": {
     "it": "Indura della Punizione\\nSupporto Sterminio",
     "en": "Indura of Retribution\\nExtermination Support"
    },
    "power": 300000,
    "heroes": [
     "1913502",
     "1961501",
     "1943501",
     "1879501"
    ]
   },
   "artifactSet": {
    "name": {
     "it": "Scontro finale Indura della Punizione",
     "en": "Indura of Retribution Death Match"
    },
    "cards": [
     {
      "it": "Indura della Punizione",
      "en": "Indura of Retribution"
     },
     {
      "it": "Tutto il nostro potere diventa una cosa sola!",
      "en": "All of Our Power into One!"
     },
     {
      "it": "Distruzione oscura",
      "en": "Dark Eraser"
     },
     {
      "it": "Scenario Regno dei Demoni",
      "en": "Demon Realm Scenery"
     },
     {
      "it": "Terra della sconfitta",
      "en": "Land of Defeat"
     }
    ],
    "levels": [
     "660316",
     "660317",
     "660318",
     "660319",
     "660320"
    ]
   },
   "costumeSets": [
    {
     "name": {
      "it": "Costume Cioccolatino dolce a forma di cuore",
      "en": "Sweet Chocolate Heart Costume"
     },
     "heroes": [
      "1575001",
      "1575002",
      "1575003"
     ],
     "effect": {
      "it": "Ottieni [FFAE00]1[-] [00D5FF]Cassa materiali Miglioramento costumi casuale[-] portando a termine lo Scontro finale.\\n[00D5FF](Limite: 6 al giorno. Attivazione casuale se esistono Set Bonus di San Valentino doppioni. L'effetto non si applica quando le ricompense sono limitate.)[-]",
      "en": "Obtain [FFAE00]1[-] [00D5FF]Random Costume Enhance Materials Box[-] when clearing Death Match.\\n[00D5FF](Limit 6 times per day. Randomized activation if a duplicate Valentines Set Bonus exists. Effect does not apply when rewards are limited.)[-]"
     }
    }
   ],
   "difficulties": [
    {
     "name": {
      "it": "Estremo",
      "en": "Extreme"
     },
     "color": "#E800CF",
     "level": 3,
     "bossLevel": 230,
     "energy": 24,
     "gold": 18000,
     "power": 650000,
     "unlock": {
      "it": "[Capitolo 204] Larva demoniaca",
      "en": "[Episode 204] Demonic Larva"
     },
     "allowedAttributes": null,
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "5221401",
        "level": 230,
        "multipliers": {
         "atk": 175,
         "def": 235,
         "hp": 620
        },
        "estimate": {
         "atk": 20912,
         "def": 21928,
         "hp": 2537660
        }
       }
      },
      {
       "foe": {
        "monster": "5221402",
        "level": 230,
        "multipliers": {
         "atk": 180,
         "def": 270,
         "hp": 620
        },
        "estimate": {
         "atk": 21922,
         "def": 22720,
         "hp": 2551858
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": null,
        "count": 1,
        "weight": 800,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       },
       {
        "id": "540012",
        "count": 2,
        "weight": 1600
       },
       {
        "id": "5301102",
        "count": 3,
        "weight": 2000
       },
       {
        "id": "900905",
        "count": 1,
        "weight": 2800
       },
       {
        "id": "900906",
        "count": 1,
        "weight": 2800
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": "941017",
        "count": 2,
        "weight": 5000
       },
       {
        "id": "941018",
        "count": 2,
        "weight": 4500
       },
       {
        "id": null,
        "count": 1,
        "weight": 500,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       }
      ]
     }
    },
    {
     "name": {
      "it": "Inferno",
      "en": "Hell"
     },
     "color": "#FF007F",
     "level": 4,
     "bossLevel": 260,
     "energy": 28,
     "gold": 24000,
     "power": 700000,
     "unlock": {
      "it": "[Episodio 222] Sopravvissuti",
      "en": "[Episode 222] Survivors"
     },
     "allowedAttributes": [
      1,
      2
     ],
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "5221411",
        "level": 260,
        "multipliers": {
         "atk": 155,
         "def": 210,
         "hp": 600
        },
        "estimate": {
         "atk": 20878,
         "def": 20441,
         "hp": 2777340
        }
       }
      },
      {
       "foe": {
        "monster": "5221412",
        "level": 260,
        "multipliers": {
         "atk": 165,
         "def": 230,
         "hp": 610
        },
        "estimate": {
         "atk": 23047,
         "def": 25893,
         "hp": 2744634
        }
       }
      },
      {
       "foe": {
        "monster": "5221413",
        "level": 260,
        "multipliers": {
         "atk": 200,
         "def": 230,
         "hp": 650
        },
        "estimate": {
         "atk": 30606,
         "def": 23557,
         "hp": 3109795
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": null,
        "count": 2,
        "weight": 100,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       },
       {
        "id": "6030087",
        "count": 1,
        "weight": 50
       },
       {
        "id": null,
        "count": 1,
        "weight": 200,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       },
       {
        "id": "540012",
        "count": 3,
        "weight": 1600
       },
       {
        "id": "5301102",
        "count": 4,
        "weight": 2850
       },
       {
        "id": "900906",
        "count": 1,
        "weight": 5200
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": null,
        "count": 1,
        "weight": 10000,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       }
      ]
     }
    },
    {
     "name": {
      "it": "Caos",
      "en": "Chaos"
     },
     "color": "#FF0000",
     "level": 5,
     "bossLevel": 300,
     "energy": 32,
     "gold": 30000,
     "power": 760000,
     "unlock": {
      "it": "[Episodio 222] Sopravvissuti",
      "en": "[Episode 222] Survivors"
     },
     "allowedAttributes": [
      1,
      2
     ],
     "bannedHeroes": [],
     "phases": [
      {
       "foe": {
        "monster": "5221411",
        "level": 300,
        "multipliers": {
         "atk": 155,
         "def": 210,
         "hp": 600
        },
        "estimate": {
         "atk": 23978,
         "def": 23465,
         "hp": 3187740
        }
       }
      },
      {
       "foe": {
        "monster": "5221412",
        "level": 300,
        "multipliers": {
         "atk": 165,
         "def": 230,
         "hp": 610
        },
        "estimate": {
         "atk": 26479,
         "def": 29757,
         "hp": 3149674
        }
       }
      },
      {
       "foe": {
        "monster": "5221413",
        "level": 300,
        "multipliers": {
         "atk": 200,
         "def": 230,
         "hp": 650
        },
        "estimate": {
         "atk": 35166,
         "def": 27053,
         "hp": 3569995
        }
       }
      }
     ],
     "guaranteed": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "6020071",
        "count": 1,
        "weight": 20
       },
       {
        "id": null,
        "count": 2,
        "weight": 500,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       },
       {
        "id": "6030087",
        "count": 1,
        "weight": 50
       },
       {
        "id": "540012",
        "count": 4,
        "weight": 550
       },
       {
        "id": "5301102",
        "count": 5,
        "weight": 580
       },
       {
        "id": null,
        "count": 1,
        "weight": 1000,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       },
       {
        "id": "540012",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "530001",
        "count": 5,
        "weight": 2300
       },
       {
        "id": "5301102",
        "count": 4,
        "weight": 3000
       }
      ]
     },
     "leader": {
      "draws": 1,
      "entries": [
       {
        "id": null,
        "count": 1,
        "weight": 10000,
        "byRegion": {
         "1": "543201",
         "2": "543202",
         "3": "543203",
         "4": "543201",
         "5": "543202",
         "6": "543203"
        }
       }
      ]
     }
    }
   ]
  }
 ],
 "heroesOnly": [
  {
   "heroId": "1056502",
   "source": "unique",
   "passive": {
    "it": "Siamo tutti amici",
    "en": "We're All Friends"
   }
  },
  {
   "heroId": "1155001",
   "source": "unique",
   "passive": {
    "it": "Volere focoso",
    "en": "Fiery Will"
   }
  },
  {
   "heroId": "1174002",
   "source": "unique",
   "passive": {
    "it": "Protezione perfetta",
    "en": "Perfect Protection"
   }
  },
  {
   "heroId": "1223001",
   "source": "unique",
   "passive": {
    "it": "Imboscata",
    "en": "Ambush"
   }
  },
  {
   "heroId": "1233001",
   "source": "unique",
   "passive": {
    "it": "Corpo d'acciaio",
    "en": "Steel Body"
   }
  },
  {
   "heroId": "1264001",
   "source": "unique",
   "passive": {
    "it": "Contrattacco estremo",
    "en": "Extreme Counter"
   }
  },
  {
   "heroId": "1385002",
   "source": "unique",
   "passive": {
    "it": "Il potere della natura",
    "en": "Power of Nature"
   }
  },
  {
   "heroId": "1881501",
   "source": "unique",
   "passive": {
    "it": "Facile farci amicizia",
    "en": "Easy to Befriend"
   }
  },
  {
   "heroId": "1896501",
   "source": "unique",
   "passive": {
    "it": "Ardente senso di giustizia",
    "en": "Burning Sense of Justice"
   }
  },
  {
   "heroId": "1913502",
   "source": "unique",
   "passive": {
    "it": "Sovrano divino",
    "en": "Divine Ruler"
   }
  }
 ],
 "heroesExcluded": [
  {
   "heroId": "1024001",
   "source": "unique",
   "passive": {
    "it": "Locandiera della taverna",
    "en": "Tavern Mascot"
   }
  },
  {
   "heroId": "1045501",
   "source": "unique",
   "passive": {
    "it": "Faccio paura, vero?",
    "en": "Scary, Aren't I?"
   }
  },
  {
   "heroId": "1114001",
   "source": "relic",
   "passive": {
    "it": "Arco leggendario di Ullr",
    "en": "Ullr's Legendary Bow"
   }
  },
  {
   "heroId": "1115001",
   "source": "relic",
   "passive": {
    "it": "Arco leggendario di Ullr",
    "en": "Ullr's Legendary Bow"
   }
  },
  {
   "heroId": "1115002",
   "source": "relic",
   "passive": {
    "it": "Arco leggendario di Ullr",
    "en": "Ullr's Legendary Bow"
   }
  },
  {
   "heroId": "1115003",
   "source": "relic",
   "passive": {
    "it": "Arco leggendario di Ullr",
    "en": "Ullr's Legendary Bow"
   }
  },
  {
   "heroId": "1135501",
   "source": "unique",
   "passive": {
    "it": "Elemento dell'Infinità",
    "en": "Element of Infinity"
   }
  },
  {
   "heroId": "1135502",
   "source": "unique",
   "passive": {
    "it": "Maga del Mare",
    "en": "Mage of the Sea"
   }
  },
  {
   "heroId": "1136501",
   "source": "relic",
   "passive": {
    "it": "Frammento di Luna di Mani",
    "en": "Mani's Moon Fragment"
   }
  },
  {
   "heroId": "1136502",
   "source": "relic",
   "passive": {
    "it": "Frammento di Luna di Mani",
    "en": "Mani's Moon Fragment"
   }
  },
  {
   "heroId": "1136503",
   "source": "relic",
   "passive": {
    "it": "Frammento di Luna di Mani",
    "en": "Mani's Moon Fragment"
   }
  },
  {
   "heroId": "1195001",
   "source": "unique",
   "passive": {
    "it": "Magia antica",
    "en": "Ancient Magic"
   }
  },
  {
   "heroId": "1405003",
   "source": "unique",
   "passive": {
    "it": "La grande causa",
    "en": "The Great Cause"
   }
  },
  {
   "heroId": "1425001",
   "source": "unique",
   "passive": {
    "it": "Gita di gruppo",
    "en": "Group Trip"
   }
  },
  {
   "heroId": "1466501",
   "source": "unique",
   "passive": {
    "it": "Ira silenziosa",
    "en": "Silent Wrath"
   }
  },
  {
   "heroId": "1467501",
   "source": "relic",
   "passive": {
    "it": "Bastone di Eir",
    "en": "Staff of Eir"
   }
  },
  {
   "heroId": "1505001",
   "source": "unique",
   "passive": {
    "it": "Il gioco di Galland",
    "en": "Galland Game"
   }
  },
  {
   "heroId": "1505001",
   "source": "commandment",
   "passive": {
    "it": "Comandamento della [b]Verità[/b]",
    "en": "Commandment of [b]Truth[/b]"
   }
  },
  {
   "heroId": "1505002",
   "source": "commandment",
   "passive": {
    "it": "Comandamento della [b]Verità[/b]",
    "en": "Commandment of [b]Truth[/b]"
   }
  },
  {
   "heroId": "1585001",
   "source": "commandment",
   "passive": {
    "it": "Comandamento dell'[b]Amore[/b]",
    "en": "Commandment of [b]Love[/b]"
   }
  },
  {
   "heroId": "1585002",
   "source": "commandment",
   "passive": {
    "it": "Comandamento dell'[b]Amore[/b]",
    "en": "Commandment of [b]Love[/b]"
   }
  },
  {
   "heroId": "1595001",
   "source": "commandment",
   "passive": {
    "it": "Comandamento della [b]Pietà[/b]",
    "en": "Commandment of [b]Piety[/b]"
   }
  },
  {
   "heroId": "1595002",
   "source": "commandment",
   "passive": {
    "it": "Comandamento della [b]Pietà[/b]",
    "en": "Commandment of [b]Piety[/b]"
   }
  },
  {
   "heroId": "1685003",
   "source": "unique",
   "passive": {
    "it": "Ombra profonda",
    "en": "Deep Shadow"
   }
  },
  {
   "heroId": "1685501",
   "source": "unique",
   "passive": {
    "it": "Maestra d'armi",
    "en": "Weapon Master"
   }
  },
  {
   "heroId": "1695002",
   "source": "unique",
   "passive": {
    "it": "Protezione solare",
    "en": "UV Protection"
   }
  },
  {
   "heroId": "1715002",
   "source": "unique",
   "passive": {
    "it": "Potere istintivo",
    "en": "Instinctive Power"
   }
  },
  {
   "heroId": "1725001",
   "source": "relic",
   "passive": {
    "it": "Spada Aurora dell'estremo Nord",
    "en": "Aurora Sword of the Far North"
   }
  },
  {
   "heroId": "1725002",
   "source": "unique",
   "passive": {
    "it": "Forte convinzione",
    "en": "Strong Belief"
   }
  },
  {
   "heroId": "1725002",
   "source": "relic",
   "passive": {
    "it": "Spada Aurora dell'estremo Nord",
    "en": "Aurora Sword of the Far North"
   }
  },
  {
   "heroId": "1725003",
   "source": "relic",
   "passive": {
    "it": "Spada Aurora dell'estremo Nord",
    "en": "Aurora Sword of the Far North"
   }
  },
  {
   "heroId": "1815001",
   "source": "grace",
   "passive": {
    "it": "Grazia del [b]Lampo[/b]",
    "en": "Grace of [b]Flash[/b]"
   }
  },
  {
   "heroId": "1815002",
   "source": "grace",
   "passive": {
    "it": "Grazia del [b]Lampo[/b]",
    "en": "Grace of [b]Flash[/b]"
   }
  },
  {
   "heroId": "1835001",
   "source": "unique",
   "passive": {
    "it": "Rabbia angelica",
    "en": "Angelic Wrath"
   }
  },
  {
   "heroId": "1845501",
   "source": "grace",
   "passive": {
    "it": "Grazia del [b]Tornado[/b]",
    "en": "Grace of [b]Tornado[/b]"
   }
  },
  {
   "heroId": "1845502",
   "source": "grace",
   "passive": {
    "it": "Grazia del [b]Tornado[/b]",
    "en": "Grace of [b]Tornado[/b]"
   }
  },
  {
   "heroId": "1866501",
   "source": "unique",
   "passive": {
    "it": "Giardino di polline",
    "en": "Pollen Garden"
   }
  },
  {
   "heroId": "1870501",
   "source": "unique",
   "passive": {
    "it": "Il potere del desiderio",
    "en": "The Power of Desire"
   }
  },
  {
   "heroId": "1871501",
   "source": "unique",
   "passive": {
    "it": "Malizia",
    "en": "Malice"
   }
  },
  {
   "heroId": "1875501",
   "source": "unique",
   "passive": {
    "it": "Lo spirito di un uomo",
    "en": "A Man's Spirit"
   }
  },
  {
   "heroId": "1876502",
   "source": "unique",
   "passive": {
    "it": "Ora di festeggiare",
    "en": "Party Time"
   }
  },
  {
   "heroId": "1878501",
   "source": "unique",
   "passive": {
    "it": "Nuove ali",
    "en": "Sprouted Wings"
   }
  },
  {
   "heroId": "1878502",
   "source": "unique",
   "passive": {
    "it": "Petali di fiori svolazzanti",
    "en": "Fluttering Flower Petals"
   }
  },
  {
   "heroId": "1881502",
   "source": "unique",
   "passive": {
    "it": "Sorpresa!",
    "en": "Surprise!"
   }
  },
  {
   "heroId": "1883501",
   "source": "unique",
   "passive": {
    "it": "Tiratore scelto",
    "en": "Marksman"
   }
  },
  {
   "heroId": "1886501",
   "source": "relic",
   "passive": {
    "it": "Carrozza di Sol",
    "en": "Sol's Chariot"
   }
  },
  {
   "heroId": "1886502",
   "source": "relic",
   "passive": {
    "it": "Carrozza di Sol",
    "en": "Sol's Chariot"
   }
  },
  {
   "heroId": "1886503",
   "source": "relic",
   "passive": {
    "it": "Carrozza di Sol",
    "en": "Sol's Chariot"
   }
  },
  {
   "heroId": "1888501",
   "source": "unique",
   "passive": {
    "it": "Utilizzatrice di Spiriti",
    "en": "Spiritual Arts User"
   }
  },
  {
   "heroId": "1892501",
   "source": "commandment",
   "passive": {
    "it": "Comandamento della [b]Pietà[/b]",
    "en": "Commandment of [b]Piety[/b]"
   }
  },
  {
   "heroId": "1895501",
   "source": "unique",
   "passive": {
    "it": "Erede della spada leggendaria Gramr",
    "en": "Inheritor of Legendary Sword Gram"
   }
  },
  {
   "heroId": "1901501",
   "source": "unique",
   "passive": {
    "it": "Lancia della vittoria",
    "en": "Spear of Victory"
   }
  },
  {
   "heroId": "1904501",
   "source": "relic",
   "passive": {
    "it": "Guanti della Luna di Mani",
    "en": "Mani's Moon Gauntlets"
   }
  },
  {
   "heroId": "1906501",
   "source": "unique",
   "passive": {
    "it": "Sguardo di ghiaccio",
    "en": "Cold Gaze"
   }
  },
  {
   "heroId": "1906502",
   "source": "unique",
   "passive": {
    "it": "Maestra cacciatrice",
    "en": "Master Hunter"
   }
  },
  {
   "heroId": "1908501",
   "source": "unique",
   "passive": {
    "it": "Abbraccio dell'[b]Oceano[/b]",
    "en": "Embrace of [b]Ocean[/b]"
   }
  },
  {
   "heroId": "1908501",
   "source": "grace",
   "passive": {
    "it": "Grazia dell'[b]Oceano[/b]",
    "en": "Grace of [b]Ocean[/b]"
   }
  },
  {
   "heroId": "1945501",
   "source": "relic",
   "passive": {
    "it": "Zanna di Gullinbursti",
    "en": "Gullinbursti's Tusk"
   }
  },
  {
   "heroId": "1959501",
   "source": "unique",
   "passive": {
    "it": "Cancelliere del diavolo",
    "en": "Devil's Chancellor"
   }
  },
  {
   "heroId": "1971501",
   "source": "talent",
   "passive": {
    "it": null,
    "en": null
   }
  },
  {
   "heroId": "1972501",
   "source": "unique",
   "passive": {
    "it": "Grande leader",
    "en": "Mighty Leader"
   }
  },
  {
   "heroId": "1977501",
   "source": "unique",
   "passive": {
    "it": "Guardiani della Terra e della Foresta",
    "en": "Guardians of the Earth and Forest"
   }
  },
  {
   "heroId": "1977501",
   "source": "talent",
   "passive": {
    "it": null,
    "en": null
   }
  },
  {
   "heroId": "1983501",
   "source": "talent",
   "passive": {
    "it": null,
    "en": null
   }
  },
  {
   "heroId": "1990501",
   "source": "talent",
   "passive": {
    "it": null,
    "en": null
   }
  },
  {
   "heroId": "1996501",
   "source": "talent",
   "passive": {
    "it": null,
    "en": null
   }
  },
  {
   "heroId": "2007501",
   "source": "talent",
   "passive": {
    "it": null,
    "en": null
   }
  },
  {
   "heroId": "2016501",
   "source": "talent",
   "passive": {
    "it": null,
    "en": null
   }
  }
 ],
 "monsters": {
  "2260101": {
   "name": {
    "it": "Demone rosso",
    "en": "Red Demon"
   },
   "description": {
    "it": "È un'entità spaventosa agli occhi degli umani, ma il suo rango tra i Demoni è basso.",
    "en": "It is a fearsome entity to human beings, but is low-ranking among other Demons."
   },
   "race": 1,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Semina di distruzione",
      "en": "Reap Smash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_red_demon_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Alito incendiario",
      "en": "Fire Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]72%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]72%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_red_demon_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Protezione infernale",
      "en": "Hell Protect"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta i PS del [FFAE00]50%[-] e riduce i danni subiti del [FFAE00]30%[-] per [FFAE00]3 turno/i[-].",
       "en": "Assumes a Stance which increases HP by [FFAE00]50%[-], and decreases damage taken by [FFAE00]30%[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_red_demon_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610111",
    "610112",
    "800001",
    "601101",
    "601102",
    "601103",
    "611354",
    "611342",
    "601104"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Umano",
     "en": "Human"
    },
    "unfavoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio del turno, assume un Atteggiamento che riduce i danni subiti.\\nAssume di nuovo un Atteggiamento ogni 3 turni.",
     "en": "At the start of the turn, assumes a Stance which decreases damage taken.\\nAssumes Stance again every 3 turns."
    },
    "unique": {
     "it": "Immune a Dissoluzione.",
     "en": "Immune to Dissolve."
    }
   }
  },
  "2260102": {
   "name": {
    "it": "Demone rosso",
    "en": "Red Demon"
   },
   "description": {
    "it": "È un'entità spaventosa agli occhi degli umani,\\nma il suo rango tra i Demoni è basso.",
    "en": "It is a fearsome entity to human beings, but is low-ranking among other Demons."
   },
   "race": 1,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Semina di distruzione",
      "en": "Reap Smash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_red_demon_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Alito incendiario",
      "en": "Fire Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]72%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]72%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_red_demon_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Protezione infernale",
      "en": "Hell Protect"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta i PS del [FFAE00]50%[-] e riduce i danni subiti del [FFAE00]30%[-] per [FFAE00]3 turno/i[-].",
       "en": "Assumes a Stance which increases HP by [FFAE00]50%[-], and decreases damage taken by [FFAE00]30%[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_red_demon_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610111",
    "610112",
    "800001",
    "601101",
    "601102",
    "601103",
    "611354",
    "611342",
    "601104"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Umano",
     "en": "Human"
    },
    "unfavoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio del turno, assume un Atteggiamento che riduce i danni subiti.\\nAssume di nuovo un Atteggiamento ogni 3 turni.",
     "en": "At the start of the turn, assumes a Stance which decreases damage taken.\\nAssumes Stance again every 3 turns."
    },
    "unique": {
     "it": "Immune a Dissoluzione.",
     "en": "Immune to Dissolve."
    }
   }
  },
  "2260103": {
   "name": {
    "it": "Demone rosso",
    "en": "Red Demon"
   },
   "description": {
    "it": "Un Demone di rango basso, ma difficile da sconfiggere a causa\\ndella sua forte difesa. Non si limita ad attaccare altri demoni a causa del suo istinto distruttore.",
    "en": "A low-ranking Demon which is difficult to defeat due to its high defense. It attacks beings other than Demons with its destructive instincts."
   },
   "race": 1,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Semina di distruzione",
      "en": "Reap Smash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_red_demon_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Ombra distruttrice",
      "en": "Shadow Raze"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Protezione infernale",
      "en": "Hell Protect"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta la Difesa del [FFAE00]200%[-] e riduce i danni subiti del [FFAE00]30%[-] per [FFAE00]3 turno/i[-].",
       "en": "Assumes a Stance which increases Defense by [FFAE00]200%[-], and decreases damage taken by [FFAE00]30%[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_red_demon_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Rabbia sanguinaria",
      "en": "Blood Rage"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610111",
    "610112",
    "800002",
    "601101",
    "601102",
    "601103",
    "611354",
    "611342",
    "601104"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Umano",
     "en": "Human"
    },
    "unfavoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio del turno, assume un Atteggiamento che riduce i danni subiti.\\nAssume di nuovo un Atteggiamento ogni 3 turni.",
     "en": "At the start of the turn, assumes a Stance which decreases damage taken.\\nAssumes Stance again every 3 turns."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita tutte le Abilità su tutti i nemici.",
     "en": "Immune to Dissolve / Petrify / Freeze / All-Target Skill Disables."
    }
   }
  },
  "2260104": {
   "name": {
    "it": "Demone rosso",
    "en": "Red Demon"
   },
   "description": {
    "it": "Malgrado sia un Demone di rango basso, è in possesso\\ndi un potere incredibile. È un'entità temibile agli occhi degli umani\\nche non hanno mai visto un Demone di persona.",
    "en": "Though a low-ranking Demon, it possesses incredible power. It reigns as a fearsome entity to humans who have never witnessed a Demon in person."
   },
   "race": 1,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ombra distruttrice",
      "en": "Shadow Raze"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_12"
    },
    {
     "slot": "b",
     "name": {
      "it": "Alito incendiario",
      "en": "Fire Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]72%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]72%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_red_demon_skill_10"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_11"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Protezione infernale",
      "en": "Hell Protect"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta l'Attacco del [FFAE00]100%[-] e riduce i danni subiti del [FFAE00]30%[-] per [FFAE00]3 turno/i[-].",
       "en": "Assumes a Stance which increases Attack by [FFAE00]100%[-], and decreases damage taken by [FFAE00]30%[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_red_demon_skill_09"
    },
    {
     "slot": "special",
     "name": {
      "it": "Fiamme del purgatorio",
      "en": "Purgatory Flame"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610111",
    "610112",
    "800002",
    "601101",
    "601102",
    "601103",
    "611354",
    "611342",
    "601104"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Umano",
     "en": "Human"
    },
    "unfavoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio del turno, assume un Atteggiamento che riduce i danni subiti.\\nAssume di nuovo un Atteggiamento ogni 3 turni.",
     "en": "At the start of the turn, assumes a Stance which decreases damage taken.\\nAssumes Stance again every 3 turns."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento.",
     "en": "Immune to Dissolve / Petrify / Freeze."
    }
   }
  },
  "2260105": {
   "name": {
    "it": "Demone rosso",
    "en": "Red Demon"
   },
   "description": {
    "it": "Un Demone grassoccio con delle corna in testa. Usa degli incantesimi per assorbire le anime.",
    "en": "A pudgy Demon with horns on its head. It uses spells to absorb souls."
   },
   "race": 1,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Semina di distruzione",
      "en": "Reap Smash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_red_demon_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Ombra distruttrice",
      "en": "Shadow Raze"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Protezione infernale",
      "en": "Hell Protect"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta la Difesa del [FFAE00]200%[-] e riduce i danni subiti del [FFAE00]30%[-] per [FFAE00]3 turno/i[-].",
       "en": "Assumes a Stance which increases Defense by [FFAE00]200%[-], and decreases damage taken by [FFAE00]30%[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_red_demon_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Rabbia sanguinaria",
      "en": "Blood Rage"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_red_demon_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610111",
    "610112",
    "800002",
    "601101",
    "601102",
    "601103",
    "611354",
    "611342",
    "601104"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Umano",
     "en": "Human"
    },
    "unfavoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio del turno, assume un Atteggiamento che riduce i danni subiti.\\nAssume di nuovo un Atteggiamento ogni 3 turni.",
     "en": "At the start of the turn, assumes a Stance which decreases damage taken.\\nAssumes Stance again every 3 turns."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita tutte le Abilità su tutti i nemici.",
     "en": "Immune to Dissolve / Petrify / Freeze / All-Target Skill Disables."
    }
   }
  },
  "2260106": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "description": {
    "it": "Un pauroso Demone di rango superiore a quello dei Demoni rossi.\\nUsa delle tecniche che possono manipolare il potere della morte.",
    "en": "A creepy Demon who ranks higher than Red Demons. It uses techniques that manipulate the power of death."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Eruzione fiammeggiante",
      "en": "Blaze Eruption"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]100%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]100%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]120%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Rimbombo di fiamme infernali",
      "en": "Hell Blaze Rumble"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]72%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]72%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Liberazione",
      "en": "Liberation"
     },
     "ranks": [
      {
       "it": "Aumenta le statistiche relative all'Attacco del [FFAE00]20%[-] per [FFAE00]3 turno/i[-]\\nquando si passa allo [00D5FF]stato campo di battaglia[-].",
       "en": "Increases Attack-related stats by [FFAE00]20%[-] for [FFAE00]3 turn(s)[-] when switching to the [00D5FF]ground battle state[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_gray_demon_skill_04"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artigli",
      "en": "Nail Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_01"
    },
    {
     "slot": "special",
     "name": {
      "it": "Pelle viola",
      "en": "Violet Pelt"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610211",
    "610212",
    "800002",
    "610205",
    "610201",
    "610202",
    "610203",
    "611353",
    "611344",
    "610204"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "unfavoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "skills": {
     "it": "Annulla Buff / Frantumazione",
     "en": "Buff Cancel / Shatter"
    },
    "behavior": {
     "it": "Questo stato di battaglia cambia ogni 3 turni.",
     "en": "The battle state changes every 3 turns."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Disabilita Attacco / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Attack Disable / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260107": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "description": {
    "it": "Un pauroso Demone di rango superiore a quello dei Demoni rossi.\\nUsa delle tecniche che possono manipolare il potere della morte.",
    "en": "A creepy Demon who ranks higher than Red Demons. It uses techniques that manipulate the power of death."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]72%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]72%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_06"
    },
    {
     "slot": "b",
     "name": {
      "it": "Esplosione viola",
      "en": "Violet Burst"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]100%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]100%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]120%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Colpo scomparsa",
      "en": "Vanish Hit"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Furia",
      "en": "Rampage"
     },
     "ranks": [
      {
       "it": "Aumenta le statistiche relative alla Difesa del [FFAE00]20%[-] per [FFAE00]3 turno/i[-]\\nquando si passa allo [00D5FF]stato battaglia volante[-].",
       "en": "Increases Defense-related stats by [FFAE00]20%[-] for [FFAE00]3 turn(s)[-] when switching to the [00D5FF]flying battle state[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_gray_demon_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Pelle viola",
      "en": "Violet Pelt"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610221",
    "610222",
    "800001",
    "610205",
    "610201",
    "610202",
    "610203",
    "611353",
    "611344",
    "610204"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "unfavoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "skills": {
     "it": "Annulla Buff / Frantumazione",
     "en": "Buff Cancel / Shatter"
    },
    "behavior": {
     "it": "Questo stato di battaglia cambia ogni 3 turni. Gli Attacchi mischia sono inefficaci quando è attivo il Buff Volo.",
     "en": "The battle state changes every 3 turns. Melee attacks are ineffective while the Flight buff is active."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita Attacco / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Petrify / Freeze / Attack Disable / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260108": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "description": {
    "it": "Un pauroso Demone di rango superiore a quello dei Demoni rossi.\\nUsa delle tecniche che possono manipolare il potere della morte.",
    "en": "A creepy Demon who ranks higher than Red Demons. It uses techniques that manipulate the power of death."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Eruzione fiammeggiante",
      "en": "Blaze Eruption"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]100%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]100%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]120%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_09"
    },
    {
     "slot": "b",
     "name": {
      "it": "Lama ardente",
      "en": "Blazing Razor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_skill_11"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Granata",
      "en": "Grenade"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_10"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Nome abilità non deciso",
      "en": "Undecided Skill Name"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]0%[-] dell'Attacco a {target_val}.",
       "en": "Inflicts damage equal to [FFAE00]0%[-] of Attack on {target_val}."
      }
     ],
     "kind": "defence_pose",
     "icon": null
    },
    {
     "slot": "special",
     "name": {
      "it": "Nebulosa oscura",
      "en": "Dark Nebula"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610231",
    "610232",
    "800002",
    "610201",
    "610202",
    "610203",
    "611353",
    "611344",
    "610204"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "unfavoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "skills": {
     "it": "Annulla Buff / Frantumazione",
     "en": "Buff Cancel / Shatter"
    },
    "behavior": {
     "it": "Gli Attacchi mischia sono inefficaci quando è attivo il Buff Volo. Gli Attacchi mischia sono efficaci quando il nemico è stordito dalla caduta.",
     "en": "Melee attacks are ineffective while the Flight buff is active. Melee attacks are effective when the enemy is stunned from falling."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita Attacco / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Petrify / Freeze / Attack Disable / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260109": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "description": {
    "it": "Un pauroso Demone di rango superiore a quello dei Demoni rossi.\\nUsa delle tecniche che possono manipolare il potere della morte.",
    "en": "A creepy Demon who ranks higher than Red Demons. It uses techniques that manipulate the power of death."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Eruzione fiammeggiante",
      "en": "Blaze Eruption"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]100%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]100%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]120%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_09"
    },
    {
     "slot": "b",
     "name": {
      "it": "Lama ardente",
      "en": "Blazing Razor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_skill_11"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Granata",
      "en": "Grenade"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_10"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Nome abilità non deciso",
      "en": "Undecided Skill Name"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]0%[-] dell'Attacco a {target_val}.",
       "en": "Inflicts damage equal to [FFAE00]0%[-] of Attack on {target_val}."
      }
     ],
     "kind": "defence_pose",
     "icon": null
    },
    {
     "slot": "special",
     "name": {
      "it": "Nebulosa oscura",
      "en": "Dark Nebula"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610231",
    "610232",
    "800002",
    "610201",
    "610202",
    "610203",
    "611353",
    "611344",
    "610204"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "unfavoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "skills": {
     "it": "Annulla Buff / Frantumazione",
     "en": "Buff Cancel / Shatter"
    },
    "behavior": {
     "it": "Gli Attacchi mischia sono inefficaci quando è attivo il Buff Volo. Gli Attacchi mischia sono efficaci quando il nemico è stordito dalla caduta.",
     "en": "Melee attacks are ineffective while the Flight buff is active. Melee attacks are effective when the enemy is stunned from falling."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita Attacco / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Petrify / Freeze / Attack Disable / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260110": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "description": {
    "it": "Un pauroso Demone di rango superiore a quello dei Demoni rossi.\\nUsa delle tecniche che possono manipolare il potere della morte.",
    "en": "A creepy Demon who ranks higher than Red Demons. It uses techniques that manipulate the power of death."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Eruzione fiammeggiante",
      "en": "Blaze Eruption"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]100%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]100%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]120%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Rimbombo di fiamme infernali",
      "en": "Hell Blaze Rumble"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]72%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]72%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Liberazione",
      "en": "Liberation"
     },
     "ranks": [
      {
       "it": "Aumenta le statistiche relative all'Attacco del [FFAE00]20%[-] per [FFAE00]3 turno/i[-]\\nquando si passa allo [00D5FF]stato campo di battaglia[-].",
       "en": "Increases Attack-related stats by [FFAE00]20%[-] for [FFAE00]3 turn(s)[-] when switching to the [00D5FF]ground battle state[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_gray_demon_skill_04"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artigli",
      "en": "Nail Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_01"
    },
    {
     "slot": "special",
     "name": {
      "it": "Pelle viola",
      "en": "Violet Pelt"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610211",
    "610212",
    "800002",
    "610205",
    "610201",
    "610202",
    "610203",
    "611353",
    "611344",
    "610204"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "unfavoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "skills": {
     "it": "Annulla Buff / Frantumazione",
     "en": "Buff Cancel / Shatter"
    },
    "behavior": {
     "it": "Questo stato di battaglia cambia ogni 3 turni.",
     "en": "The battle state changes every 3 turns."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Disabilita Attacco / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Attack Disable / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260112": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "description": {
    "it": "Un pauroso Demone di rango superiore a quello dei Demoni rossi.\\nUsa delle tecniche che possono manipolare il potere della morte.",
    "en": "A creepy Demon who ranks higher than Red Demons. It uses techniques that manipulate the power of death."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]72%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]72%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_06"
    },
    {
     "slot": "b",
     "name": {
      "it": "Esplosione viola",
      "en": "Violet Burst"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]100%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]100%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]120%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Colpo scomparsa",
      "en": "Vanish Hit"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Furia",
      "en": "Rampage"
     },
     "ranks": [
      {
       "it": "Aumenta le statistiche relative alla Difesa del [FFAE00]20%[-] per [FFAE00]3 turno/i[-]\\nquando si passa allo [00D5FF]stato battaglia volante[-].",
       "en": "Increases Defense-related stats by [FFAE00]20%[-] for [FFAE00]3 turn(s)[-] when switching to the [00D5FF]flying battle state[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_gray_demon_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Pelle viola",
      "en": "Violet Pelt"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610221",
    "610222",
    "800001",
    "610205",
    "610201",
    "610202",
    "610203",
    "611353",
    "611344",
    "610204"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "unfavoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "skills": {
     "it": "Annulla Buff / Frantumazione",
     "en": "Buff Cancel / Shatter"
    },
    "behavior": {
     "it": "Questo stato di battaglia cambia ogni 3 turni. Gli Attacchi mischia sono inefficaci quando è attivo il Buff Volo.",
     "en": "The battle state changes every 3 turns. Melee attacks are ineffective while the Flight buff is active."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita Attacco / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Petrify / Freeze / Attack Disable / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260113": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "description": {
    "it": "Un pauroso Demone di rango superiore a quello dei Demoni rossi.\\nUsa delle tecniche che possono manipolare il potere della morte.",
    "en": "A creepy Demon who ranks higher than Red Demons. It uses techniques that manipulate the power of death."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Eruzione fiammeggiante",
      "en": "Blaze Eruption"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]100%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]100%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]120%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_09"
    },
    {
     "slot": "b",
     "name": {
      "it": "Lama ardente",
      "en": "Blazing Razor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_skill_11"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Granata",
      "en": "Grenade"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_gray_demon_skill_10"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Nome abilità non deciso",
      "en": "Undecided Skill Name"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]0%[-] dell'Attacco a {target_val}.",
       "en": "Inflicts damage equal to [FFAE00]0%[-] of Attack on {target_val}."
      }
     ],
     "kind": "defence_pose",
     "icon": null
    },
    {
     "slot": "special",
     "name": {
      "it": "Nebulosa oscura",
      "en": "Dark Nebula"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_gray_demon_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610231",
    "610232",
    "800002",
    "610201",
    "610202",
    "610203",
    "611353",
    "611344",
    "610204"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Fata",
     "en": "Fairy"
    },
    "unfavoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "skills": {
     "it": "Annulla Buff / Frantumazione",
     "en": "Buff Cancel / Shatter"
    },
    "behavior": {
     "it": "Gli Attacchi mischia sono inefficaci quando è attivo il Buff Volo. Gli Attacchi mischia sono efficaci quando il nemico è stordito dalla caduta.",
     "en": "Melee attacks are ineffective while the Flight buff is active. Melee attacks are effective when the enemy is stunned from falling."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita Attacco / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Petrify / Freeze / Attack Disable / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260124": {
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "description": {
    "it": "Il segni neri che coprono il suo corpo sono le cicatrici ottenute in migliaia di battaglie. Ha rischiato la morte in centinaia di occasioni, eppure la Bestia demoniaca è diventata un'entità in grado di far temere alle altre razze per la loro vita.",
    "en": "The black markings covering its body are scars from thousands of battles. Coming close to dying hundreds of times, the surviving Demonic Beast has become an entity that makes other races fear for their lives."
   },
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tripla esplosione",
      "en": "Triple Blow"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Esplosioni parallele",
      "en": "Burst Rail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Tortura infernale",
      "en": "Hell Torture"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]50%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Disabilita le abilità Recupero[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]50%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Recovery Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Sangue risvegliato",
      "en": "Blood Awaken"
     },
     "ranks": [
      {
       "it": "Riduce i danni subiti del [FFAE00]50%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases damage taken by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_crimson_demon_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610311",
    "610312",
    "800001",
    "610301",
    "610303",
    "610302",
    "610305",
    "611351",
    "611340",
    "610304"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Demone",
     "en": "Demon"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Punto debole / Infezione",
     "en": "Weak Point / Infect"
    },
    "behavior": {
     "it": "Le statistiche relative all'Attacco della Bestia demoniaca Howlex aumentano quando viene attaccata dagli Eroi.",
     "en": "Demonic Beast Howlex's Attack-related stats are increased when attacked by heroes."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260125": {
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "description": {
    "it": "Il segni neri che coprono il suo corpo sono le cicatrici ottenute in migliaia di battaglie. Ha rischiato la morte in centinaia di occasioni, eppure la Bestia demoniaca è diventata un'entità in grado di far temere alle altre razze per la loro vita.",
    "en": "The black markings covering its body are scars from thousands of battles. Coming close to dying hundreds of times, the surviving Demonic Beast has become an entity that makes other races fear for their lives."
   },
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Esplosioni parallele",
      "en": "Burst Rail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_10"
    },
    {
     "slot": "b",
     "name": {
      "it": "Lancia oscura",
      "en": "Dark Spear"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_09"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Bomba gancio",
      "en": "Knuckle Bomb"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n[00D5FF]Disabilita le abilità Recupero[-] per [FFAE00]3 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Disables Recovery Skills[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_11"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Colpo segnante",
      "en": "Brand Marking"
     },
     "ranks": [
      {
       "it": "Rimuove i Debuff da sé stesso. Rimuove i Debuff da [FFFFFF]un nemico[-] e applica un Marchio.",
       "en": "Removes Debuffs from self. Cancels Buffs on [FFFFFF]one enemy[-] and applies a Brand."
      }
     ],
     "kind": "exceptional",
     "icon": "icon_crimson_demon_skill_12"
    },
    {
     "slot": "special",
     "name": {
      "it": "Linea rossa",
      "en": "Red Line"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]\\ne [00D5FF]svuota[-] [FFAE00]2[-] sfera/e dalla [FFAE00]Barra Mossa finale[-].",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610331",
    "610332",
    "800002",
    "610301",
    "610303",
    "610305",
    "611600",
    "611351",
    "611340",
    "610304"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Demone",
     "en": "Demon"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Punto debole / Infezione",
     "en": "Weak Point / Infect"
    },
    "behavior": {
     "it": "Le statistiche relative alla Difesa e all'Attacco della Bestia demoniaca Howlex aumentano quando viene attaccata dagli Eroi.\\nI bersagli marchiati verranno attaccati fino alla morte.",
     "en": "Demonic Beast Howlex increases its Defense-related and Attack-related stats when attacked by heroes.\\nBranded targets will be attacked until dead."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita Buff / Disabilita Debuff / Disabilita Attacco.",
     "en": "Immune to Dissolve / Petrify / Freeze / Buff Disable / Debuff Disable / Attack Disable."
    }
   }
  },
  "2260126": {
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "description": {
    "it": "Il segni neri che coprono il suo corpo sono le ferite guarite\\nottenute in migliaia di battaglie. Ha rischiato la morte in centinaia di occasioni,\\neppure la Bestia demoniaca è diventata un'entità in grado di\\nspaventare a morte le altre razze.",
    "en": "The black markings covering its body are the healed injuries from thousands of battles. Coming close to dying hundreds of times, the surviving Demonic Beast has become an entity that makes other races fear death."
   },
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tripla esplosione",
      "en": "Triple Blow"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Esplosioni parallele",
      "en": "Burst Rail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Tortura infernale",
      "en": "Hell Torture"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]50%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Disabilita le abilità Recupero[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]50%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Recovery Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Sangue risvegliato",
      "en": "Blood Awaken"
     },
     "ranks": [
      {
       "it": "Riduce i danni subiti del [FFAE00]50%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases damage taken by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_crimson_demon_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610311",
    "610312",
    "800001",
    "610301",
    "610303",
    "610302",
    "610305",
    "611351",
    "611340",
    "610304"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Demone",
     "en": "Demon"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Punto debole / Infezione",
     "en": "Weak Point / Infect"
    },
    "behavior": {
     "it": "Le statistiche relative all'Attacco della Bestia demoniaca Howlex aumentano quando viene attaccata dagli Eroi.",
     "en": "Demonic Beast Howlex's Attack-related stats are increased when attacked by heroes."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260127": {
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "description": {
    "it": "Il segni neri che coprono il suo corpo sono le cicatrici ottenute in migliaia di battaglie. Ha rischiato la morte in centinaia di occasioni, eppure la Bestia demoniaca è diventata un'entità in grado di far temere alle altre razze per la loro vita.",
    "en": "The black markings covering its body are scars from thousands of battles. Coming close to dying hundreds of times, the surviving Demonic Beast has become an entity that makes other races fear for their lives."
   },
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]50%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]50%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_07"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tripla esplosione",
      "en": "Triple Blow"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Tortura infernale",
      "en": "Hell Torture"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]50%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Disabilita le abilità Recupero[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]50%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Recovery Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Sangue risvegliato",
      "en": "Blood Awaken"
     },
     "ranks": [
      {
       "it": "Riduce i danni subiti del [FFAE00]50%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases damage taken by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_crimson_demon_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Cento pugni",
      "en": "Hundred Fists"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-]\\ne [00D5FF]svuota[-] [FFAE00]2[-] sfera/e dalla [FFAE00]Barra Mossa finale[-].",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610321",
    "610322",
    "800002",
    "610301",
    "610303",
    "610302",
    "610305",
    "611351",
    "611340",
    "610304"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Demone",
     "en": "Demon"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Punto debole / Infezione",
     "en": "Weak Point / Infect"
    },
    "behavior": {
     "it": "Le statistiche relative alla Difesa della Bestia demoniaca Howlex aumentano quando viene attaccata dagli Eroi.",
     "en": "Demonic Beast Howlex's Defense-related stats are increased when attacked by heroes."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento.",
     "en": "Immune to Dissolve / Petrify / Freeze."
    }
   }
  },
  "2260128": {
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "description": {
    "it": "Il segni neri che coprono il suo corpo sono le cicatrici ottenute in migliaia di battaglie. Ha rischiato la morte in centinaia di occasioni, eppure la Bestia demoniaca è diventata un'entità in grado di far temere alle altre razze per la loro vita.",
    "en": "The black markings covering its body are scars from thousands of battles. Coming close to dying hundreds of times, the surviving Demonic Beast has become an entity that makes other races fear for their lives."
   },
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Esplosioni parallele",
      "en": "Burst Rail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_10"
    },
    {
     "slot": "b",
     "name": {
      "it": "Lancia oscura",
      "en": "Dark Spear"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_09"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Bomba gancio",
      "en": "Knuckle Bomb"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n[00D5FF]Disabilita le abilità Recupero[-] per [FFAE00]3 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Disables Recovery Skills[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_11"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Colpo segnante",
      "en": "Brand Marking"
     },
     "ranks": [
      {
       "it": "Rimuove i Debuff da sé stesso. Rimuove i Debuff da [FFFFFF]un nemico[-] e applica un Marchio.",
       "en": "Removes Debuffs from self. Cancels Buffs on [FFFFFF]one enemy[-] and applies a Brand."
      }
     ],
     "kind": "exceptional",
     "icon": "icon_crimson_demon_skill_12"
    },
    {
     "slot": "special",
     "name": {
      "it": "Linea rossa",
      "en": "Red Line"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]\\ne [00D5FF]svuota[-] [FFAE00]2[-] sfera/e dalla [FFAE00]Barra Mossa finale[-].",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610331",
    "610332",
    "800002",
    "610301",
    "610303",
    "610305",
    "611600",
    "611351",
    "611340",
    "610304"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Demone",
     "en": "Demon"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Punto debole / Infezione",
     "en": "Weak Point / Infect"
    },
    "behavior": {
     "it": "Le statistiche relative alla Difesa e all'Attacco della Bestia demoniaca Howlex aumentano quando viene attaccata dagli Eroi.\\nI bersagli marchiati verranno attaccati fino alla morte.",
     "en": "Demonic Beast Howlex increases its Defense-related and Attack-related stats when attacked by heroes.\\nBranded targets will be attacked until dead."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento / Disabilita Buff / Disabilita Debuff / Disabilita Attacco.",
     "en": "Immune to Dissolve / Petrify / Freeze / Buff Disable / Debuff Disable / Attack Disable."
    }
   }
  },
  "2260129": {
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "description": {
    "it": "Il segni neri che coprono il suo corpo sono le cicatrici ottenute in migliaia di battaglie. Ha rischiato la morte in centinaia di occasioni, eppure la Bestia demoniaca è diventata un'entità in grado di far temere alle altre razze per la loro vita.",
    "en": "The black markings covering its body are scars from thousands of battles. Coming close to dying hundreds of times, the surviving Demonic Beast has become an entity that makes other races fear for their lives."
   },
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tripla esplosione",
      "en": "Triple Blow"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Esplosioni parallele",
      "en": "Burst Rail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Tortura infernale",
      "en": "Hell Torture"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]50%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Disabilita le abilità Recupero[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]50%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Recovery Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Sangue risvegliato",
      "en": "Blood Awaken"
     },
     "ranks": [
      {
       "it": "Riduce i danni subiti del [FFAE00]50%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases damage taken by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_crimson_demon_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610311",
    "610312",
    "800001",
    "610301",
    "610303",
    "610302",
    "610305",
    "611351",
    "611340",
    "610304"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Demone",
     "en": "Demon"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Punto debole / Infezione",
     "en": "Weak Point / Infect"
    },
    "behavior": {
     "it": "Le statistiche relative all'Attacco della Bestia demoniaca Howlex aumentano quando viene attaccata dagli Eroi.",
     "en": "Demonic Beast Howlex's Attack-related stats are increased when attacked by heroes."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Disabilita Buff / Disabilita Debuff.",
     "en": "Immune to Dissolve / Buff Disable / Debuff Disable."
    }
   }
  },
  "2260130": {
   "name": {
    "it": "Howlex bestia demoniaca",
    "en": "Demonic Beast Howlex"
   },
   "description": {
    "it": "Il segni neri che coprono il suo corpo sono le cicatrici ottenute in migliaia di battaglie. Ha rischiato la morte in centinaia di occasioni, eppure la Bestia demoniaca è diventata un'entità in grado di far temere alle altre razze per la loro vita.",
    "en": "The black markings covering its body are scars from thousands of battles. Coming close to dying hundreds of times, the surviving Demonic Beast has become an entity that makes other races fear for their lives."
   },
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mieti anime",
      "en": "Reap Soul"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]50%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]50%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]60%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]60%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_07"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tripla esplosione",
      "en": "Triple Blow"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 Danno critico[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Tortura infernale",
      "en": "Hell Torture"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]50%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Disabilita le abilità Recupero[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]50%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Recovery Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_crimson_demon_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Sangue risvegliato",
      "en": "Blood Awaken"
     },
     "ranks": [
      {
       "it": "Riduce i danni subiti del [FFAE00]50%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases damage taken by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_crimson_demon_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Cento pugni",
      "en": "Hundred Fists"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-]\\ne [00D5FF]svuota[-] [FFAE00]2[-] sfera/e dalla [FFAE00]Barra Mossa finale[-].",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_crimson_demon_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "610321",
    "610322",
    "800002",
    "610301",
    "610303",
    "610302",
    "610305",
    "611351",
    "611340",
    "610304"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Demone",
     "en": "Demon"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Punto debole / Infezione",
     "en": "Weak Point / Infect"
    },
    "behavior": {
     "it": "Le statistiche relative alla Difesa della Bestia demoniaca Howlex aumentano quando viene attaccata dagli Eroi.",
     "en": "Demonic Beast Howlex's Defense-related stats are increased when attacked by heroes."
    },
    "unique": {
     "it": "Immune a Dissoluzione / Pietrificazione / Congelamento.",
     "en": "Immune to Dissolve / Petrify / Freeze."
    }
   }
  },
  "2260273": {
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "description": {
    "it": "Una Bestia Demoniaca che ha avvolto le sue due zampe frontali con dei viticci. Usa l'energia creata dal nucleo nel suo petto per distruggere tutto ciò che è sul suo percorso.",
    "en": "A Demonic Beast which has wrapped its two front feet with vines. It uses the energy created from the core in its chest to destroy everything in its path."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Attacco demoniaco",
      "en": "Demonic Attack"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]140%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]140%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]200%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]200%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Colpo spiazzante",
      "en": "Landing Shock"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco su [FFFFFF]tutti i nemici[-]. [00D5FF]Disabilita le abilità Attacco[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Attack Skills[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]disabilita le Abilità Attacco e le Abilità Recupero[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]disables Attack Skills and Recovery Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Nascondersi nei cespugli",
      "en": "Hide in the Bushes"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta le statistiche di base del [FFAE00]30%[-] per [FFAE00]2 turno/i[-] e [00D5FF]riflette[-] il [FFAE00]50%[-] dei danni subiti.\\n[00D5FF]※Riflessione: Restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a stance that increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and [00D5FF]reflects[-] [FFAE00]50%[-] of damage taken.\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Coda di ferro",
      "en": "Iron Tail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Alito infernale",
      "en": "Inferno Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612621",
    "612622",
    "800002",
    "612301",
    "612315",
    "612304",
    "612305",
    "612310",
    "612311",
    "612314"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio della battaglia, il Boss impedisce a tutti i nemici di usare abilità Buff, poi assume un Atteggiamento ogni 2 turni che limita il Recupero di tutti i nemici e aumenta le proprie statistiche di base. Il boss riflette il 50% dei danni subiti quando assume un Atteggiamento.",
     "en": "At the start of battle, the boss prevents all enemies from using Buff Skills, then assumes a stance every 2 turns which restricts all enemies' Recovery and increases its own basic stats. The boss reflects 50% of damage taken when assuming a stance."
    },
    "unique": {
     "it": "Immune a tutti i Debuff eccetto Avvelenamento / Sanguinamento / Shock.",
     "en": "Immune to all Debuffs except Poison / Bleed / Shock."
    }
   }
  },
  "2260274": {
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "description": {
    "it": "Una Bestia Demoniaca che ha avvolto le sue due zampe frontali con dei viticci. Usa l'energia creata dal nucleo nel suo petto per distruggere tutto ciò che è sul suo percorso.",
    "en": "A Demonic Beast which has wrapped its two front feet with vines. It uses the energy created from the core in its chest to destroy everything in its path."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo spiazzante",
      "en": "Landing Shock"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari al [FFAE00]110%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari a un [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]110%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari al [FFAE00]165%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari a un [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]165%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Spazzata demoniaca",
      "en": "Demonic Sweep"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Attacco demoniaco",
      "en": "Demonic Attack"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]200%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]200%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Giro mortale",
      "en": "Death Roll"
     },
     "ranks": [
      {
       "it": "Disabilita le [00D5FF]Abilità Recupero[-] di [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-], poi [00D5FF]Infetta[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Disables [00D5FF]Recovery Skills[-] of [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-], then [00D5FF]Infects[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Alito infernale",
      "en": "Inferno Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612623",
    "612624",
    "800002",
    "612301",
    "612307",
    "612308",
    "612309",
    "612310",
    "612311",
    "612314"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio della battaglia, il Boss impedisce a tutti i nemici di usare abilità Buff, poi usa un'abilità Debuff ogni 3 turni che limita l'uso delle Abilità Recupero di tutti i nemici.",
     "en": "At the start of battle, the boss prevents all enemies from using Buff Skills, then uses a Debuff Skill every 3 turns which prevents all enemies from using Recovery Skills."
    },
    "unique": {
     "it": "Immune a tutti i Debuff eccetto Avvelenamento / Sanguinamento / Shock.",
     "en": "Immune to all Debuffs except Poison / Bleed / Shock."
    }
   }
  },
  "2260275": {
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "description": {
    "it": "Una Bestia Demoniaca che ha avvolto le sue due zampe frontali con dei viticci. Usa l'energia creata dal nucleo nel suo petto per distruggere tutto ciò che è sul suo percorso.",
    "en": "A Demonic Beast which has wrapped its two front feet with vines. It uses the energy created from the core in its chest to destroy everything in its path."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo spiazzante",
      "en": "Landing Shock"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari al [FFAE00]110%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari a un [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]110%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari al [FFAE00]165%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari a un [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]165%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Spazzata demoniaca",
      "en": "Demonic Sweep"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Attacco demoniaco",
      "en": "Demonic Attack"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]200%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]200%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Giro mortale",
      "en": "Death Roll"
     },
     "ranks": [
      {
       "it": "Disabilita le [00D5FF]Abilità Recupero[-] di [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-], poi [00D5FF]Infetta[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Disables [00D5FF]Recovery Skills[-] of [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-], then [00D5FF]Infects[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Alito infernale",
      "en": "Inferno Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612623",
    "612624",
    "800002",
    "612301",
    "612307",
    "612308",
    "612309",
    "612310",
    "612311",
    "612314"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio della battaglia, il Boss impedisce a tutti i nemici di usare abilità Buff, poi usa un'abilità Debuff ogni 3 turni che limita l'uso delle Abilità Recupero di tutti i nemici.",
     "en": "At the start of battle, the boss prevents all enemies from using Buff Skills, then uses a Debuff Skill every 3 turns which prevents all enemies from using Recovery Skills."
    },
    "unique": {
     "it": "Immune a tutti i Debuff eccetto Avvelenamento / Sanguinamento / Shock.",
     "en": "Immune to all Debuffs except Poison / Bleed / Shock."
    }
   }
  },
  "2260276": {
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "description": {
    "it": "Una Bestia Demoniaca che ha avvolto le sue due zampe frontali con dei viticci. Usa l'energia creata dal nucleo nel suo petto per distruggere tutto ciò che è sul suo percorso.",
    "en": "A Demonic Beast which has wrapped its two front feet with vines. It uses the energy created from the core in its chest to destroy everything in its path."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Frusta di vite",
      "en": "Vine Whip"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]130%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]2[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]130%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]195%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]5[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]195%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]5[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_09"
    },
    {
     "slot": "b",
     "name": {
      "it": "Coda di ferro",
      "en": "Iron Tail"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]180%[-] dell'Attacco su [FFFFFF]tutti i nemici[-] e infligge Furto di vita pari al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Colpo di forza: Infligge danni aggiuntivi pari alla Resistenza del nemico.[-]\\n[00D5FF]※Furto di vita: Cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-] and Lifesteals [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_10"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Nascondersi nei cespugli",
      "en": "Hide in the Bushes"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta le statistiche di base del [FFAE00]30%[-] per [FFAE00]2 turno/i[-] e [00D5FF]riflette[-] il [FFAE00]50%[-] dei danni subiti.\\n[00D5FF]※Riflessione: Restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a stance that increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and [00D5FF]reflects[-] [FFAE00]50%[-] of damage taken.\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_11"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Giro mortale",
      "en": "Death Roll"
     },
     "ranks": [
      {
       "it": "Disabilita le [00D5FF]Abilità Recupero[-] di [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-], poi [00D5FF]Infetta[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Disables [00D5FF]Recovery Skills[-] of [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-], then [00D5FF]Infects[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_12"
    },
    {
     "slot": "special",
     "name": {
      "it": "Frantumazione di vite",
      "en": "Vine Crash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]1280%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]1280%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_special_03"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612625",
    "612626",
    "800002",
    "612301",
    "612315",
    "612304",
    "612305",
    "612310",
    "612311",
    "612313"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio della battaglia, il Boss impedisce a tutti i nemici di usare abilità Buff, poi assume un Atteggiamento ogni 2 turni che limita il Recupero di tutti i nemici e aumenta le proprie statistiche di base. Il boss riflette il 50% dei danni subiti quando assume un Atteggiamento.",
     "en": "At the start of battle, the boss prevents all enemies from using Buff Skills, then assumes a stance every 2 turns which restricts all enemies' Recovery and increases its own basic stats. The boss reflects 50% of damage taken when assuming a stance."
    },
    "unique": {
     "it": "Immune a tutti i Debuff eccetto Avvelenamento / Sanguinamento / Shock.",
     "en": "Immune to all Debuffs except Poison / Bleed / Shock."
    }
   }
  },
  "2260277": {
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "description": {
    "it": "Una Bestia Demoniaca che ha avvolto le sue due zampe frontali con dei viticci. Usa l'energia creata dal nucleo nel suo petto per distruggere tutto ciò che è sul suo percorso.",
    "en": "A Demonic Beast which has wrapped its two front feet with vines. It uses the energy created from the core in its chest to destroy everything in its path."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Attacco demoniaco",
      "en": "Demonic Attack"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]140%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]140%[-] of Attack."
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]200%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]200%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Colpo spiazzante",
      "en": "Landing Shock"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]100%[-] dell'Attacco su [FFFFFF]tutti i nemici[-]. [00D5FF]Disabilita le abilità Attacco[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Attack Skills[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]disabilita le Abilità Attacco e le Abilità Recupero[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]disables Attack Skills and Recovery Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Nascondersi nei cespugli",
      "en": "Hide in the Bushes"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta le statistiche di base del [FFAE00]30%[-] per [FFAE00]2 turno/i[-] e [00D5FF]riflette[-] il [FFAE00]50%[-] dei danni subiti.\\n[00D5FF]※Riflessione: Restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a stance that increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and [00D5FF]reflects[-] [FFAE00]50%[-] of damage taken.\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Coda di ferro",
      "en": "Iron Tail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Alito infernale",
      "en": "Inferno Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612621",
    "612622",
    "800002",
    "612301",
    "612315",
    "612304",
    "612305",
    "612310",
    "612311",
    "612314"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio della battaglia, il Boss impedisce a tutti i nemici di usare abilità Buff, poi assume un Atteggiamento ogni 2 turni che limita il Recupero di tutti i nemici e aumenta le proprie statistiche di base. Il boss riflette il 50% dei danni subiti quando assume un Atteggiamento.",
     "en": "At the start of battle, the boss prevents all enemies from using Buff Skills, then assumes a stance every 2 turns which restricts all enemies' Recovery and increases its own basic stats. The boss reflects 50% of damage taken when assuming a stance."
    },
    "unique": {
     "it": "Immune a tutti i Debuff eccetto Avvelenamento / Sanguinamento / Shock.",
     "en": "Immune to all Debuffs except Poison / Bleed / Shock."
    }
   }
  },
  "2260278": {
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "description": {
    "it": "Una Bestia Demoniaca che ha avvolto le sue due zampe frontali con dei viticci. Usa l'energia creata dal nucleo nel suo petto per distruggere tutto ciò che è sul suo percorso.",
    "en": "A Demonic Beast which has wrapped its two front feet with vines. It uses the energy created from the core in its chest to destroy everything in its path."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo spiazzante",
      "en": "Landing Shock"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari al [FFAE00]110%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari a un [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]110%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari al [FFAE00]165%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari a un [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]165%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Spazzata demoniaca",
      "en": "Demonic Sweep"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Attacco demoniaco",
      "en": "Demonic Attack"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]200%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]200%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Giro mortale",
      "en": "Death Roll"
     },
     "ranks": [
      {
       "it": "Disabilita le [00D5FF]Abilità Recupero[-] di [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-], poi [00D5FF]Infetta[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Disables [00D5FF]Recovery Skills[-] of [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-], then [00D5FF]Infects[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Alito infernale",
      "en": "Inferno Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612623",
    "612624",
    "800002",
    "612301",
    "612307",
    "612308",
    "612309",
    "612310",
    "612311",
    "612314"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio della battaglia, il Boss impedisce a tutti i nemici di usare abilità Buff, poi usa un'abilità Debuff ogni 3 turni che limita l'uso delle Abilità Recupero di tutti i nemici.",
     "en": "At the start of battle, the boss prevents all enemies from using Buff Skills, then uses a Debuff Skill every 3 turns which prevents all enemies from using Recovery Skills."
    },
    "unique": {
     "it": "Immune a tutti i Debuff eccetto Avvelenamento / Sanguinamento / Shock.",
     "en": "Immune to all Debuffs except Poison / Bleed / Shock."
    }
   }
  },
  "2260279": {
   "name": {
    "it": "Bellmoth Bestia demoniaca",
    "en": "Demonic Beast Bellmoth"
   },
   "description": {
    "it": "Una Bestia Demoniaca che ha avvolto le sue due zampe frontali con dei viticci. Usa l'energia creata dal nucleo nel suo petto per distruggere tutto ciò che è sul suo percorso.",
    "en": "A Demonic Beast which has wrapped its two front feet with vines. It uses the energy created from the core in its chest to destroy everything in its path."
   },
   "race": 1,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Frusta di vite",
      "en": "Vine Whip"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]130%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]2[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]130%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]195%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]5[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]195%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]5[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_09"
    },
    {
     "slot": "b",
     "name": {
      "it": "Coda di ferro",
      "en": "Iron Tail"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]180%[-] dell'Attacco su [FFFFFF]tutti i nemici[-] e infligge Furto di vita pari al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Colpo di forza: Infligge danni aggiuntivi pari alla Resistenza del nemico.[-]\\n[00D5FF]※Furto di vita: Cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-] and Lifesteals [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_10"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Nascondersi nei cespugli",
      "en": "Hide in the Bushes"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che aumenta le statistiche di base del [FFAE00]30%[-] per [FFAE00]2 turno/i[-] e [00D5FF]riflette[-] il [FFAE00]50%[-] dei danni subiti.\\n[00D5FF]※Riflessione: Restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a stance that increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and [00D5FF]reflects[-] [FFAE00]50%[-] of damage taken.\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_11"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Giro mortale",
      "en": "Death Roll"
     },
     "ranks": [
      {
       "it": "Disabilita le [00D5FF]Abilità Recupero[-] di [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-], poi [00D5FF]Infetta[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Disables [00D5FF]Recovery Skills[-] of [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-], then [00D5FF]Infects[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_bellmoth_ssr_type01_skill_12"
    },
    {
     "slot": "special",
     "name": {
      "it": "Frantumazione di vite",
      "en": "Vine Crash"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]1280%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]1280%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_bellmoth_ssr_type01_special_03"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612625",
    "612626",
    "800002",
    "612301",
    "612315",
    "612304",
    "612305",
    "612310",
    "612311",
    "612313"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": null,
    "unfavoredRaces": null,
    "skills": {
     "it": "Annulla Atteggiamento / Carica",
     "en": "Stance Cancel / Charge"
    },
    "behavior": {
     "it": "All'inizio della battaglia, il Boss impedisce a tutti i nemici di usare abilità Buff, poi assume un Atteggiamento ogni 2 turni che limita il Recupero di tutti i nemici e aumenta le proprie statistiche di base. Il boss riflette il 50% dei danni subiti quando assume un Atteggiamento.",
     "en": "At the start of battle, the boss prevents all enemies from using Buff Skills, then assumes a stance every 2 turns which restricts all enemies' Recovery and increases its own basic stats. The boss reflects 50% of damage taken when assuming a stance."
    },
    "unique": {
     "it": "Immune a tutti i Debuff eccetto Avvelenamento / Sanguinamento / Shock.",
     "en": "Immune to all Debuffs except Poison / Bleed / Shock."
    }
   }
  },
  "2260318": {
   "name": {
    "it": "Demone Originale",
    "en": "Original Demon"
   },
   "description": null,
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Spaccatura dell'anima",
      "en": "Soul Cleave"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]220%[-] dell'Attacco su [FFFFFF]un nemico[-], [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] e riduce di un [FFAE00][FFAE00]30%[-][-] i danni inflitti con le Mosse finali per [FFAE00]1 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]",
       "en": "Inflicts damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]blocks all skill effects including those of Ultimate Moves[-], and decreases damage dealt with Ultimate Moves by [FFAE00][FFAE00]30%[-][-] for [FFAE00]1 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]360%[-] dell'Attacco su [FFFFFF]un nemico[-], [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] e riduce di un [FFAE00][FFAE00]50%[-][-] i danni inflitti con le Mosse finali per [FFAE00]2 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]",
       "en": "Inflicts damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]blocks all skill effects including those of Ultimate Moves[-], and decreases damage dealt with Ultimate Moves by [FFAE00][FFAE00]50%[-][-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_origin_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Cataclisma",
      "en": "Cataclysm"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Rigenerazione",
      "en": "Regeneration"
     },
     "ranks": [
      {
       "it": "Applica un effetto sull'eroe che ripristina il [00FF00]30%[-] dei PS ridotti all'inizio del turno degli alleati per [FFAE00]2 turno/i[-], aumenta del [FFAE00]20%[-] i PS massimi.",
       "en": "Applies an effect on the hero which restores [00FF00]30%[-] of diminished HP at the start of the allies' turn for [FFAE00]2 turn(s)[-], and increases Max HP by [FFAE00]20%[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_origin_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Oscurità della disperazione",
      "en": "Darkness of Despair"
     },
     "ranks": [
      {
       "it": "Per [FFAE00]2 turno/i[-], disabilita [00D5FF]tutte le abilità di [FFFFFF]tutti i nemici[-] a eccezione delle abilità Buff e Debuff[-], disabilita le Mosse finali, [00D5FF]disabilita le abilità di Rango 2 o superiore[-] e riduce i ranghi delle abilità alla fine del turno del nemico.",
       "en": "For [FFAE00]2 turn(s)[-], disables [00D5FF]all skills of [FFFFFF]all enemies[-] except Buff and Debuff Skills[-], disables Ultimate Moves, [00D5FF]disables skills which are Rank 2 or higher[-], and decreases skill ranks at the end of the enemy's turn."
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_origin_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Spinta mortale",
      "en": "Death Drive"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]700%[-] dell'Attacco a [FFFFFF]un nemico[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]5[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]700%[-] of Attack on [FFFFFF]one enemy[-] and fills [FFAE00]5[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "614101",
    "614102",
    "800002",
    "614109",
    "614107",
    "614112",
    "614115",
    "614116",
    "614117",
    "800081"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Provocazione / Annulla Debuff / Colpo di forza",
     "en": "Taunt / Debuff Cancel / Power Strike"
    },
    "behavior": {
     "it": "Usa un'abilità Buff che ripristina nettamente i PS ridotti ogni 2 turni e un'abilità Debuff limita drasticamente l'uso delle abilità del nemico ogni 3 turni.",
     "en": "Uses a Buff skill which greatly restores diminished HP every 2 turns, and a Debuff skill which greatly restricts enemy skill use every 3 turns."
    },
    "unique": null
   }
  },
  "2260319": {
   "name": {
    "it": "Demone Originale",
    "en": "Original Demon"
   },
   "description": null,
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ladro dello spirito",
      "en": "Spirit Taker"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]100%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Lifesteals[-] [FFAE00]100%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]520%[-] dell'Attacco a [FFFFFF]un nemico[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]100%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]520%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Lifesteals[-] [FFAE00]100%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Respiro mortale",
      "en": "Death Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]2[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]2[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Rigenerazione",
      "en": "Regeneration"
     },
     "ranks": [
      {
       "it": "[00D5FF]Riflette[-] [FFAE00]150%[-] dei danni subiti per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "[00D5FF]Reflects[-] [FFAE00]150%[-] of damage taken for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_origin_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Oscurità della disperazione",
      "en": "Darkness of Despair"
     },
     "ranks": [
      {
       "it": "Riduce le [00D5FF]statistiche relative all'Attacco[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases [00D5FF]Attack-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_origin_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Spinta mortale",
      "en": "Death Drive"
     },
     "ranks": [
      {
       "it": "Aumenta le statistiche di base del [FFAE00]50%[-] per [FFAE00]3 turni[-] e infligge danni pari a [FFAE00]630%[-] dell'Attacco su [FFFFFF]un nemico[-].",
       "en": "Increases basic stats by [FFAE00]50%[-] for [FFAE00]3 turns[-] and inflicts damage equal to [FFAE00]630%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "614103",
    "614104",
    "800002",
    "614109",
    "614107",
    "614110",
    "614111",
    "614115",
    "614116",
    "800081"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Provocazione / Annulla Debuff / Colpo di forza",
     "en": "Taunt / Debuff Cancel / Power Strike"
    },
    "behavior": {
     "it": "Il boss usa un'abilità Buff che riflette fortemente i danni subiti e li rimanda al nemico ogni 2 turni, e indebolisce nettamente i nemici ogni 3 turni. Il boss elude le abilità di mischia se i PS sono al di sopra di una determinata soglia e subisce notevoli danni ridotti quando i PS sono quasi a zero.",
     "en": "The boss uses a Buff skill which powerfully reflects damage taken back to the enemy every 2 turns, and greatly weakens enemies every 3 turns. The boss evades melee skills if HP is above a certain threshold and takes greatly reduced damage when HP is almost depleted."
    },
    "unique": null
   }
  },
  "2260320": {
   "name": {
    "it": "Demone Originale",
    "en": "Original Demon"
   },
   "description": null,
   "race": 1,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Aura demoniaca",
      "en": "Demonic Halo"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]160%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Aumenta i danni inflitti sul nemico del [FFAE00][FFAE00]15%[-][-] per [FFAE00]ogni[-] effetto Atteggiamento, Buff o Debuff lanciato sul bersaglio.",
       "en": "Inflicts damage equal to [FFAE00]160%[-] of Attack on [FFFFFF]all enemies[-]. Increases damage dealt on the enemy by [FFAE00][FFAE00]15%[-][-] for [FFAE00]every[-] Stance, Buff, or Debuff effect on the target."
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Aumenta i danni inflitti sul nemico del [FFAE00][FFAE00]15%[-][-] per [FFAE00]ogni[-] effetto Atteggiamento, Buff o Debuff lanciato sul bersaglio.",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-]. Increases damage dealt on the enemy by [FFAE00][FFAE00]15%[-][-] for [FFAE00]every[-] Stance, Buff, or Debuff effect on the target."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Cataclisma",
      "en": "Cataclysm"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fendente[-], che non attivano Danno critico, pari al [FFAE00]150%[-] dell'Attacco su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fendente: Danni aggiuntivi pari al [FFAE00]75%[-] del (Danno critico -100%).[-]",
       "en": "Inflicts [00D5FF]Cleave[-] damage, which does not activate Crit Damage, equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Cleave: Additional damage equal to [FFAE00]75%[-] of (Crit Damage - 100%).[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Fendente[-], che non attivano Danno critico, pari al [FFAE00]240%[-] dell'Attacco su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fendente: Danni aggiuntivi pari al [FFAE00]75%[-] del (Danno critico -100%).[-]",
       "en": "Inflicts [00D5FF]Cleave[-] damage, which does not activate Crit Damage, equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Cleave: Additional damage equal to [FFAE00]75%[-] of (Crit Damage - 100%).[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Rigenerazione",
      "en": "Regeneration"
     },
     "ranks": [
      {
       "it": "Per [FFAE00]2 turno/i[-], aumenta l'Attacco dell'eroe del [FFAE00]45%[-] e, [00D5FF]se subisce danni quando viene attaccato[-], applica un effetto che riduce i [00D5FF]danni inferti[-] da [FFAE00]tutti i nemici[-] del [00D5FF]10%[-] per [FFAE00]1 turno[-].\\n[00D5FF](Può essere accumulato fino a 3 volte)[-]",
       "en": "For [FFAE00]2 turn(s)[-], increases the hero's Attack by [FFAE00]45%[-] and, [00D5FF]if taking damage when attacked[-], applies an effect which decreases [00D5FF]damage dealt[-] by [FFAE00]all enemies[-] by [00D5FF]10%[-] for [FFAE00]1 turn[-].\\n[00D5FF](Can be stacked up to 3 times)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_origin_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Oscurità della disperazione",
      "en": "Darkness of Despair"
     },
     "ranks": [
      {
       "it": "[00D5FF]Inspira[-] [FFAE00]20%[-] dei PS massimi di [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Inspirazione: riduce PS massimi del bersaglio e recupera [FFAE00]una volta[-] i propri PS per la quantità ridotta[-].",
       "en": "[00D5FF]Inhales[-] [FFAE00]20%[-] of Max HP of [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Inhale: Decreases the target's Max HP and recovers own HP by the amount decreased [FFAE00]once[-][-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_origin_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Fiamme infernali Omega",
      "en": "Hell Blaze Omega"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Debuff dagli alleati e Buff dai nemici[-]. Per ciascun Buff rimosso, aumenta i danni subiti dai nemici i cui Buff sono stati rimossi del [FFAE00][FFAE00]40[-]%[-] per [FFAE00]1 turno[-], poi infligge danni pari al [FFAE00]490%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].",
       "en": "[00D5FF]Removes Debuffs from allies and Buffs from enemies[-]. For each Buff removed, increases damage taken by enemies whose Buffs were removed by [FFAE00][FFAE00]40[-]%[-] for [FFAE00]1 turn[-], then inflicts damage equal to [FFAE00]490%[-] of Attack on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_origin_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "614105",
    "614106",
    "800002",
    "614109",
    "614107",
    "614115",
    "614116",
    "614117",
    "800081"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Gigante",
     "en": "Giant"
    },
    "unfavoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "skills": {
     "it": "Provocazione / Annulla Debuff / Colpo di forza",
     "en": "Taunt / Debuff Cancel / Power Strike"
    },
    "behavior": {
     "it": "Aumenta nettamente l'Attacco ogni 2 turni, riduce i danni inflitti dal nemico quando subisce un attacco e recupera nettamente i PS dopo aver ridotto i PS del nemico ogni 3 turni.",
     "en": "Greatly increases Attack every 2 turns, decreases the enemy's damage dealt when attacked, and greatly restores HP after decreasing enemy HP every 3 turns."
    },
    "unique": null
   }
  },
  "5221401": {
   "name": {
    "it": "Indura della Punizione",
    "en": "Indura of Retribution"
   },
   "description": {
    "it": "Una feroce Bestia demoniaca che è stata imprigionata dalle Dee in un lontano passato.\\nÈ una creatura pericolosa che non risponde a nessuno e divora qualsiasi cosa, inclusi i Demoni.",
    "en": "A fierce demonic beast that was sealed away by the Goddesses in the distant past.\\nIt is a dangerous creature with no master, devouring all, including Demons."
   },
   "race": 6,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mazzafrusto",
      "en": "Flail Whip"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Colpo annientatore",
      "en": "Annihilating Strike"
     },
     "ranks": [
      {
       "it": "Riduce la Resistenza critico di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]1 turno[-], poi infligge danni [00D5FF]Disperazione[-] pari a [FFAE00]200%[-] dell'Attacco.\\n\\n[00D5FF]※Disperazione: recupera [FFAE00]5%[-] dei PS ridotti mettendo a segno un colpo critico.[-]",
       "en": "Decreases Crit Resistance of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]1 turn[-], then inflicts [00D5FF]Despair[-] damage equal to [FFAE00]200%[-] of Attack.\\n\\n[00D5FF]※Despair: Recovers [FFAE00]5%[-] of diminished HP upon successful critical strike.[-]"
      },
      {
       "it": "Riduce la Resistenza critico di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]1 turno[-], poi infligge danni [00D5FF]Disperazione[-] pari a [FFAE00]250%[-] dell'Attacco.\\n\\n[00D5FF]※Disperazione: recupera [FFAE00]10%[-] dei PS ridotti mettendo a segno un colpo critico.[-]",
       "en": "Decreases Crit Resistance of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]1 turn[-], then inflicts [00D5FF]Despair[-] damage equal to [FFAE00]250%[-] of Attack.\\n\\n[00D5FF]※Despair: Recovers [FFAE00]10%[-] of diminished HP upon successful critical strike.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Alito maligno",
      "en": "Evil Breath"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]3[-] effetti [00D5FF]Karma[-] a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Karma: infligge danni aggiuntivi pari al [FFAE00]10%[-] dei PS massimi e riduce i danni inflitti del [FFAE00]6%[-] alla fine di ogni turno.\\n(Nessun limite)[-]",
       "en": "Applies [FFAE00]3[-] [00D5FF]Karma[-] effects on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Karma: Inflicts additional damage equal to [FFAE00]10%[-] of Max HP and decreases damage dealt by [FFAE00]6%[-] at the end of every turn.\\n(No limit)[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_indura_baruja_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Punizione",
      "en": "Retribution"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-], [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al [FFAE00]300%[-] dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-], [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to [FFAE00]300%[-] of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_demon_indura_baruja_skill_09"
    },
    {
     "slot": "special",
     "name": {
      "it": "Pestata mortale",
      "en": "Death Stomp"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]666%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]Stordisce[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "Inflicts damage equal to [FFAE00]666%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Stuns[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_special_03"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Punizione",
      "en": "Retribution"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val}, [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for {turn_1_val}, [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to {buff_1_val} of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val}, [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for {turn_1_val}, [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to {buff_1_val} of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val}, [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for {turn_1_val}, [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to {buff_1_val} of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_demon_indura_baruja_skill_09"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "620001",
    "620002",
    "800002",
    "800021",
    "620023",
    "620029",
    "620036",
    "620013",
    "620037",
    "620038",
    "620046",
    "620045"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "unfavoredRaces": null,
    "skills": {
     "it": "Stordimento / Pietrificazione / Congelamento",
     "en": "Stun / Petrify / Freeze"
    },
    "behavior": {
     "it": "Il boss applica Karma su tutti i nemici a ogni turno. Un effetto Karma viene rimosso quando subisci danni dall'abilità \"Punizione\" del boss.",
     "en": "The boss applies Karma on all enemies every turn. One Karma effect is removed when you take damage from the boss's \"Retribution\" skill."
    },
    "unique": null
   }
  },
  "5221402": {
   "name": {
    "it": "Indura della Punizione",
    "en": "Indura of Retribution"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mazzafrusto",
      "en": "Flail Whip"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Sguardo dell'Abisso",
      "en": "Gaze of the Abyss"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] della Difesa su [FFFFFF]un nemico[-] e [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] per [FFAE00]2 turno/i[-], poi causa un'[00D5FF]Esplosione[-] dopo [FFAE00]1 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]\\n\\n[00D5FF]※Esplosione: danni aggiuntivi pari al [FFAE00]200%[-] dei danni inflitti dopo un certo numero di turni.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Defense on [FFFFFF]one enemy[-] and [00D5FF]blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then causes an [00D5FF]Explosion[-] after [FFAE00]1 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]\\n\\n[00D5FF]※Explosion: Additional damage equal to [FFAE00]200%[-] of damage dealt after a certain number of turns.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]450%[-] della Difesa su [FFFFFF]un nemico[-] e [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] per [FFAE00]2 turno/i[-], poi causa un'[00D5FF]Esplosione[-] dopo [FFAE00]1 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]\\n\\n[00D5FF]※Esplosione: danni aggiuntivi pari al [FFAE00]200%[-] dei danni inflitti dopo un certo numero di turni.[-]",
       "en": "Inflicts damage equal to [FFAE00]450%[-] of Defense on [FFFFFF]one enemy[-] and [00D5FF]blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then causes an [00D5FF]Explosion[-] after [FFAE00]1 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]\\n\\n[00D5FF]※Explosion: Additional damage equal to [FFAE00]200%[-] of damage dealt after a certain number of turns.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_indura_baruja_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pestata crudele",
      "en": "Vicious Stomp"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Status[-] a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Status: aumenta i danni per ogni Status applicato.[-]",
       "en": "Inflicts [00D5FF]Tier[-] damage on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Tier: Increases damage for each applied tier.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Ruggito demoniaco",
      "en": "Demonic Roar"
     },
     "ranks": [
      {
       "it": "Guadagna [00D5FF]Immunità da abilità di mischia[-] durante i turni dispari e [00D5FF]Immunità da abilità a distanza[-] nei turni pari.",
       "en": "Gains [00D5FF]Melee Skill Immunity[-] on odd-numbered turns and [00D5FF]Ranged Skill Immunity[-] on even-numbered turns."
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_indura_baruja_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Distruzione oscura",
      "en": "Dark Eraser"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Impedisce il riempimento della Barra Mossa finale[-] per [FFAE00]3 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Prevents Ultimate Move Gauge(s) from filling up[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "620011",
    "620022",
    "800002",
    "800021",
    "620023",
    "620031",
    "620014",
    "620015",
    "620013",
    "620030",
    "620037",
    "620038",
    "620044",
    "620006",
    "620026"
   ],
   "hiddenPassives": 0,
   "tips": {
    "favoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "unfavoredRaces": null,
    "skills": null,
    "behavior": {
     "it": "Il boss applica un effetto Status su di sé all'inizio di ogni turno. Il numero di Status determina i danni inflitti dal boss con l'abilità \"Pestata crudele\". Inoltre, il boss applica abilità di mischia e a distanza in determinati turni. Queste immunità possono essere rimosse usando le Mosse finali.",
     "en": "The boss applies a Tier effect on itself at the start of every turn. The number of Tiers determines the boss's damage dealt with the \"Vicious Stomp\" skill. In addition, the boss applies Ranged and Melee Skill Immunities at certain turns. These immunities can be removed by using Ultimate Moves."
    },
    "unique": null
   }
  },
  "5221411": {
   "name": {
    "it": "Indura della Punizione",
    "en": "Indura of Retribution"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mazzafrusto",
      "en": "Flail Whip"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Colpo annientatore",
      "en": "Annihilating Strike"
     },
     "ranks": [
      {
       "it": "Riduce la Resistenza critico di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]1 turno[-], poi infligge danni [00D5FF]Disperazione[-] pari a [FFAE00]200%[-] dell'Attacco.\\n\\n[00D5FF]※Disperazione: recupera [FFAE00]5%[-] dei PS ridotti mettendo a segno un colpo critico.[-]",
       "en": "Decreases Crit Resistance of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]1 turn[-], then inflicts [00D5FF]Despair[-] damage equal to [FFAE00]200%[-] of Attack.\\n\\n[00D5FF]※Despair: Recovers [FFAE00]5%[-] of diminished HP upon successful critical strike.[-]"
      },
      {
       "it": "Riduce la Resistenza critico di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]1 turno[-], poi infligge danni [00D5FF]Disperazione[-] pari a [FFAE00]250%[-] dell'Attacco.\\n\\n[00D5FF]※Disperazione: recupera [FFAE00]10%[-] dei PS ridotti mettendo a segno un colpo critico.[-]",
       "en": "Decreases Crit Resistance of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]1 turn[-], then inflicts [00D5FF]Despair[-] damage equal to [FFAE00]250%[-] of Attack.\\n\\n[00D5FF]※Despair: Recovers [FFAE00]10%[-] of diminished HP upon successful critical strike.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Alito maligno",
      "en": "Evil Breath"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]3[-] effetti [00D5FF]Karma[-] a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Karma: infligge danni aggiuntivi pari al [FFAE00]10%[-] dei PS massimi e riduce i danni inflitti del [FFAE00]6%[-] alla fine di ogni turno.\\n(Nessun limite)[-]",
       "en": "Applies [FFAE00]3[-] [00D5FF]Karma[-] effects on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Karma: Inflicts additional damage equal to [FFAE00]10%[-] of Max HP and decreases damage dealt by [FFAE00]6%[-] at the end of every turn.\\n(No limit)[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_indura_baruja_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Punizione",
      "en": "Retribution"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-], [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al [FFAE00]300%[-] dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-], [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to [FFAE00]300%[-] of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_demon_indura_baruja_skill_09"
    },
    {
     "slot": "special",
     "name": {
      "it": "Pestata mortale",
      "en": "Death Stomp"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]666%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]Stordisce[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "Inflicts damage equal to [FFAE00]666%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Stuns[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_special_03"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Punizione",
      "en": "Retribution"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val}, [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for {turn_1_val}, [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to {buff_1_val} of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val}, [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for {turn_1_val}, [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to {buff_1_val} of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val}, [00D5FF]aumentando i danni subiti di tutti i nemici del [FFAE00]300%[-][-].\\nInfligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco e [00D5FF]riduce tutte le statistiche del [FFAE00]20%[-][-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](L'attacco non va a segno contro nemici con Impronta karmica; limite: 3 volte)[-]",
       "en": "Assumes a Stance for {turn_1_val}, [00D5FF]increasing all enemies' damage taken by [FFAE00]300%[-][-].\\nInflicts damage equal to {buff_1_val} of Attack via counter and [00D5FF]decreases all stats by [FFAE00]20%[-][-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Results in a miss when attacking enemies with Karmic Imprint, limit 3 times)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_demon_indura_baruja_skill_09"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "620001",
    "620002",
    "800002",
    "800021",
    "620023",
    "620004",
    "620029",
    "620032",
    "620036",
    "620040",
    "620013",
    "620024",
    "620025",
    "620037",
    "620038"
   ],
   "hiddenPassives": 5,
   "tips": {
    "favoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "unfavoredRaces": null,
    "skills": {
     "it": "Stordimento / Pietrificazione / Congelamento",
     "en": "Stun / Petrify / Freeze"
    },
    "behavior": {
     "it": "Il boss applica Karma su tutti i nemici a ogni turno. Un effetto Karma viene rimosso quando subisci danni dall'abilità \"Punizione\" del boss.",
     "en": "The boss applies Karma on all enemies every turn. One Karma effect is removed when you take damage from the boss's \"Retribution\" skill."
    },
    "unique": null
   }
  },
  "5221412": {
   "name": {
    "it": "Indura della Punizione",
    "en": "Indura of Retribution"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Mazzafrusto",
      "en": "Flail Whip"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Sguardo dell'Abisso",
      "en": "Gaze of the Abyss"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] della Difesa su [FFFFFF]un nemico[-] e [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] per [FFAE00]2 turno/i[-], poi causa un'[00D5FF]Esplosione[-] dopo [FFAE00]1 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]\\n\\n[00D5FF]※Esplosione: danni aggiuntivi pari al [FFAE00]200%[-] dei danni inflitti dopo un certo numero di turni.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Defense on [FFFFFF]one enemy[-] and [00D5FF]blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then causes an [00D5FF]Explosion[-] after [FFAE00]1 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]\\n\\n[00D5FF]※Explosion: Additional damage equal to [FFAE00]200%[-] of damage dealt after a certain number of turns.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]450%[-] della Difesa su [FFFFFF]un nemico[-] e [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] per [FFAE00]2 turno/i[-], poi causa un'[00D5FF]Esplosione[-] dopo [FFAE00]1 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]\\n\\n[00D5FF]※Esplosione: danni aggiuntivi pari al [FFAE00]200%[-] dei danni inflitti dopo un certo numero di turni.[-]",
       "en": "Inflicts damage equal to [FFAE00]450%[-] of Defense on [FFFFFF]one enemy[-] and [00D5FF]blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then causes an [00D5FF]Explosion[-] after [FFAE00]1 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]\\n\\n[00D5FF]※Explosion: Additional damage equal to [FFAE00]200%[-] of damage dealt after a certain number of turns.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_demon_indura_baruja_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pestata crudele",
      "en": "Vicious Stomp"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Status[-] a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Status: aumenta i danni per ogni Status applicato.[-]",
       "en": "Inflicts [00D5FF]Tier[-] damage on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Tier: Increases damage for each applied tier.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Ruggito demoniaco",
      "en": "Demonic Roar"
     },
     "ranks": [
      {
       "it": "Applica [00D5FF]Ruggito[-] sull'eroe per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Ruggito: applica Ossidazione su tutti i nemici per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF]※Ossidazione: riduce i ranghi abilità e infligge danni pari al [FFAE00]10%[-] dei PS massimi per [FFAE00]ogni[-] abilità il cui rango è stato ridotto alla fine del turno del nemico.[-][-]",
       "en": "Applies [00D5FF]Roar[-] on the hero for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Roar: Applies Oxidize on all enemies for [FFAE00]2 turns[-] when attacked.\\n[00D5FF]※Oxidize: Decreases skill ranks and inflicts damage equal to [FFAE00]10%[-] of Max HP for [FFAE00]every[-] skill that had its rank decreased at the end of the enemy's turn.[-][-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_indura_baruja_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Pestata mortale",
      "en": "Death Stomp"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]666%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]Stordisce[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "Inflicts damage equal to [FFAE00]666%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Stuns[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_special_03"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "620011",
    "620012",
    "800002",
    "800021",
    "620023",
    "620004",
    "620031",
    "620035",
    "620040",
    "620015",
    "620013",
    "620024",
    "620025",
    "620026",
    "620037",
    "620038"
   ],
   "hiddenPassives": 2,
   "tips": {
    "favoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "unfavoredRaces": null,
    "skills": {
     "it": "Riduzione Barra Mossa finale / Purificazione",
     "en": "Ultimate Move Gauge Decrease / Purify"
    },
    "behavior": {
     "it": "Il boss applica uno Status su di sé all'inizio di ogni turno. Il numero di Status determina i danni inflitti dal boss con l'abilità \"Pestata crudele\".",
     "en": "The boss applies a Tier on itself at the start of every turn. The number of Tiers determines the boss's damage dealt with the \"Vicious Stomp\" skill."
    },
    "unique": null
   }
  },
  "5221413": {
   "name": {
    "it": "Indura della Punizione",
    "en": "Indura of Retribution"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Pestata crudele",
      "en": "Vicious Stomp"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]1[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-] and fills [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]2[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-] and fills [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Colpo annientatore",
      "en": "Annihilating Strike"
     },
     "ranks": [
      {
       "it": "Riduce la Resistenza critico di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]1 turno[-], poi infligge danni [00D5FF]Disperazione[-] pari a [FFAE00]200%[-] dell'Attacco.\\n\\n[00D5FF]※Disperazione: recupera [FFAE00]5%[-] dei PS ridotti mettendo a segno un colpo critico.[-]",
       "en": "Decreases Crit Resistance of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]1 turn[-], then inflicts [00D5FF]Despair[-] damage equal to [FFAE00]200%[-] of Attack.\\n\\n[00D5FF]※Despair: Recovers [FFAE00]5%[-] of diminished HP upon successful critical strike.[-]"
      },
      {
       "it": "Riduce la Resistenza critico di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]1 turno[-], poi infligge danni [00D5FF]Disperazione[-] pari a [FFAE00]250%[-] dell'Attacco.\\n\\n[00D5FF]※Disperazione: recupera [FFAE00]10%[-] dei PS ridotti mettendo a segno un colpo critico.[-]",
       "en": "Decreases Crit Resistance of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]1 turn[-], then inflicts [00D5FF]Despair[-] damage equal to [FFAE00]250%[-] of Attack.\\n\\n[00D5FF]※Despair: Recovers [FFAE00]10%[-] of diminished HP upon successful critical strike.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Alito maligno",
      "en": "Evil Breath"
     },
     "ranks": [
      {
       "it": "Applica [00D5FF]Disabilita Mossa finale[-] per [FFAE00]1 turno[-] a [FFFFFF]tutti i nemici[-] e [00D5FF]blocca tutti gli effetti abilità, inclusi quelli delle Mosse finali[-] per [FFAE00]2 turni[-].\\n[00D5FF](Esclude le Abilità Recupero e Atteggiamento)[-]",
       "en": "Applies [00D5FF]Ultimate Move Disable[-] for [FFAE00]1 turn[-] on [FFFFFF]all enemies[-] and [00D5FF]Blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]2 turns[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_demon_indura_baruja_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Ruggito demoniaco",
      "en": "Demonic Roar"
     },
     "ranks": [
      {
       "it": "Guadagna [00D5FF]Immunità da abilità di mischia[-] durante i turni dispari e [00D5FF]Immunità da abilità a distanza[-] nei turni pari.",
       "en": "Gains [00D5FF]Melee Skill Immunity[-] on odd-numbered turns and [00D5FF]Ranged Skill Immunity[-] on even-numbered turns."
      }
     ],
     "kind": "buff",
     "icon": "icon_demon_indura_baruja_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Distruzione oscura",
      "en": "Dark Eraser"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Impedisce il riempimento della Barra Mossa finale[-] per [FFAE00]3 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Prevents Ultimate Move Gauge(s) from filling up[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_demon_indura_baruja_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "620021",
    "620022",
    "800002",
    "620039",
    "620004",
    "620040",
    "620014",
    "620013",
    "620024",
    "620025",
    "620026",
    "620030",
    "620037",
    "620038",
    "620043",
    "620006"
   ],
   "hiddenPassives": 2,
   "tips": {
    "favoredRaces": {
     "it": "Dea",
     "en": "Goddess"
    },
    "unfavoredRaces": null,
    "skills": null,
    "behavior": {
     "it": "Il boss ottiene Immunità da abilità di mischia e a distanza in determinati turni. Queste immunità possono essere rimosse usando le Mosse finali. Le Barre Mossa finale di tutti i nemici sono bloccate all'inizio della battaglia e ogni volta che il boss usa la Mossa finale.",
     "en": "The boss gains Ranged and Melee Skill Immunities at certain turns. These immunities can be removed by using Ultimate Moves. All enemies' Ultimate Move Gauges are locked at the start of the battle and every time the boss uses the Ultimate Move."
    },
    "unique": null
   }
  }
 },
 "passives": {
  "601101": {
   "name": {
    "it": "Immunità a danni nel tempo",
    "en": "Damage Over Time Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti [00D5FF]Sanguinamento, Avvelenamento, Shock, Corrosione, Ossidazione e Fuoco[-].",
    "en": "The hero becomes immune to [00D5FF]Bleed, Poison, Shock, Corrosion, Oxidize, and Burn[-] effects."
   }
  },
  "601102": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] l'Attacco degli alleati all'inizio del turno successivo se l'Eroe non subisce danni.\\n[00D5FF](Si resetta dopo aver subito danni)[-]",
    "en": "Increases allies' Attack by [FFAE00]50%[-] at the start of the next turn if the hero doesn't take damage.\\n[00D5FF](Resets upon taking damage)[-]"
   }
  },
  "601103": {
   "name": {
    "it": "Riduzione danni Mossa finale",
    "en": "Ultimate Move Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] i danni subiti dall'eroe nelle Mosse finali.",
    "en": "Decreases the hero's damage taken from Ultimate Moves by [FFAE00]30%[-]."
   }
  },
  "601104": {
   "name": {
    "it": "Aumento Carica danni",
    "en": "Charge Damage Increase"
   },
   "text": {
    "it": "Aumenta i danni da abilità con l'effetto Carica subiti dall'eroe di [FFAE00]50%[-].",
    "en": "Increases the hero's damage taken from skills with the Charge effect by [FFAE00]50%[-]."
   }
  },
  "610111": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Mieti anime\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Reap Soul\" every [FFAE00]2 turns[-]."
   }
  },
  "610112": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Protezione infernale\" ogni [FFAE00]3 turni[-].",
    "en": "Uses \"Hell Protect\" every [FFAE00]3 turns[-]."
   }
  },
  "610201": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti gli effetti Debuff[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuff effects[-]."
   }
  },
  "610202": {
   "name": {
    "it": "Immunità a Dissoluzione",
    "en": "Dissolve Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti di [00D5FF]Riduzione barra Mossa finale[-].",
    "en": "The hero becomes immune to [00D5FF]Ultimate Move Gauge Decrease[-] effects."
   }
  },
  "610203": {
   "name": {
    "it": "Aumento Velocità di rigenerazione",
    "en": "Regeneration Rate Increase"
   },
   "text": {
    "it": "Aumenta la Velocità di rigenerazione dell'eroe di [FFAE00]1%[-] quando attaccato.",
    "en": "Increases the hero's Regeneration Rate by [FFAE00]1%[-] when attacked."
   }
  },
  "610204": {
   "name": {
    "it": "Aumento danni Frantumazione",
    "en": "Shatter Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] i danni subiti dall'eroe da abilità con effetto Frantumazione.",
    "en": "Increases the hero's damage taken from skills with the Shatter effect by [FFAE00]50%[-]."
   }
  },
  "610205": {
   "name": {
    "it": "Cambio stato di battaglia",
    "en": "Battle State Change"
   },
   "text": {
    "it": "Lo stato della battaglia dell'eroe cambia ogni [FFAE00]3 turno/i[-].",
    "en": "The hero's battle state changes after [FFAE00]3 turn(s)[-]."
   }
  },
  "610211": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Liberazione\" ogni [FFAE00]3 turni[-].",
    "en": "Uses \"Liberation\" every [FFAE00]3 turns[-]."
   }
  },
  "610212": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Artigli\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Nail Claw\" every [FFAE00]2 turns[-]."
   }
  },
  "610221": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Colpo scomparsa\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Vanish Hit\" every [FFAE00]2 turns[-]."
   }
  },
  "610222": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Furia\" ogni [FFAE00]3 turni[-].",
    "en": "Uses \"Rampage\" every [FFAE00]3 turns[-]."
   }
  },
  "610231": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Granata\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Grenade\" every [FFAE00]2 turns[-]."
   }
  },
  "610232": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "[FFAE00]Quando la barra volo raggiunte lo 0[-], viene stordito all'inizio del suo turno.",
    "en": "Becomes stunned at the beginning of the turn [FFAE00]when the flight gauge reaches 0[-]."
   }
  },
  "610301": {
   "name": {
    "it": "Immunità a Inabilità",
    "en": "Incapacitation Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]Stordimento, Pietrificazione e Congelamento[-].",
    "en": "The hero becomes immune to [00D5FF]Stun, Petrify, and Freeze[-]."
   }
  },
  "610302": {
   "name": {
    "it": "Immunità a Riduzione statistiche",
    "en": "Stat Decrease Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti di [00D5FF]Riduzione statistiche[-].",
    "en": "The hero becomes immune to [00D5FF]Stat Decrease[-] effects."
   }
  },
  "610303": {
   "name": {
    "it": "Immunità a Disabilita abilità",
    "en": "Skill Disable Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti gli effetti Disabilita abilità[-].",
    "en": "The hero becomes immune to [00D5FF]all Skill Disable[-] effects."
   }
  },
  "610304": {
   "name": {
    "it": "Aumento danni Punto debole",
    "en": "Weak Point Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] i danni subiti dall'eroe da abilità con effetto Punto debole.",
    "en": "Increases the hero's damage taken from skills with the Weak Point effect by [FFAE00]50%[-]."
   }
  },
  "610305": {
   "name": {
    "it": "Riduzione danni Contrattacco",
    "en": "Counter Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] i danni subiti dall'eroe dai Contrattacchi.",
    "en": "Decreases the hero's damage taken from Counterattacks by [FFAE00]30%[-]."
   }
  },
  "610311": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Tortura infernale\" [FFAE00]ad ogni turno[-].",
    "en": "Uses \"Hell Torture\" [FFAE00]every turn[-]."
   }
  },
  "610312": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Sangue risvegliato\" ogni [FFAE00]3 turni[-].",
    "en": "Uses \"Blood Awaken\" every [FFAE00]3 turns[-]."
   }
  },
  "610321": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Tortura infernale\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Hell Torture\" every [FFAE00]2 turns[-]."
   }
  },
  "610322": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Sangue risvegliato\" ogni [FFAE00]3 turni[-].",
    "en": "Uses \"Blood Awaken\" every [FFAE00]3 turns[-]."
   }
  },
  "610331": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Bomba gancio\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Knuckle Bomb\" every [FFAE00]2 turns[-]."
   }
  },
  "610332": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Colpo segnante\" quando non c’è [FFAE00]un obiettivo col Debuff Marchio[-].",
    "en": "Uses \"Brand Marking\" when there is [FFAE00]no target with the Brand debuff[-]."
   }
  },
  "611340": {
   "name": {
    "it": "Aumento danni subiti dai Demoni",
    "en": "Increased Damage Taken from Demons"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] i danni subiti dall'eroe da parte di nemici Demoni.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage taken from Demon enemies by [FFAE00]30%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "611342": {
   "name": {
    "it": "Aumento danni subiti dagli Umani",
    "en": "Increased Damage Taken from Humans"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] i danni subiti dall'eroe da parte di nemici Umani.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage taken from Human enemies by [FFAE00]30%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "611344": {
   "name": {
    "it": "Aumento danni subiti dalle Fate",
    "en": "Increased Damage Taken from Fairies"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] i danni subiti dall'eroe da parte di nemici Fate.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage taken from Fairy enemies by [FFAE00]30%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "611351": {
   "name": {
    "it": "Aumento danni inflitti alle Dee",
    "en": "Increased Damage dealt to Goddesses"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] i danni inflitti dall'eroe a nemici della Dea.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage dealt to Goddess enemies by [FFAE00]30%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "611353": {
   "name": {
    "it": "Aumento danni inflitti ai Giganti",
    "en": "Increased Damage dealt to Giants"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] i danni inflitti dall'eroe a nemici Giganti.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage dealt to Giant enemies by [FFAE00]30%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "611354": {
   "name": {
    "it": "Aumento danni inflitti alle Fate",
    "en": "Increased Damage dealt to Fairies"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] i danni inflitti dall'eroe a nemici Fate.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage dealt to Fairy enemies by [FFAE00]30%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "611600": {
   "name": {
    "it": "Marchio",
    "en": "Brand"
   },
   "text": {
    "it": "Dà la priorità agli attacchi contro nemici con l'effetto Debuff Marchio.",
    "en": "Prioritizes attacking enemies with the Brand Debuff effect."
   }
  },
  "612301": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a tutti gli effetti Debuff eccetto [00D5FF]Avvelenamento, Sanguinamento e Shock[-].",
    "en": "The hero becomes immune to all Debuff effects except [00D5FF]Poison, Bleed, and Shock[-]."
   }
  },
  "612304": {
   "name": {
    "it": "Atteggiamento deciso",
    "en": "Solid Stance"
   },
   "text": {
    "it": "Riduce del [FFAE00]50%[-] i danni subiti dall'eroe quando assume un atteggiamento.",
    "en": "Decreases the hero's damage taken by [FFAE00]50%[-] when assuming a Stance."
   }
  },
  "612305": {
   "name": {
    "it": "Armonia naturale",
    "en": "Natural Harmony"
   },
   "text": {
    "it": "Limita le statistiche relative a Recupero di tutti i nemici quando assumono un Atteggiamento.",
    "en": "Restricts Recovery-related stats of all enemies when assuming a Stance."
   }
  },
  "612307": {
   "name": {
    "it": "Cacciatore",
    "en": "Hunter"
   },
   "text": {
    "it": "Aumenta di un ulteriore [FFAE00]50%[-] [FFAE00]i danni inflitti dell'eroe quando attacca nemici con Debuff[-] [00D5FF]Sanguinamento, Avvelenamento o Shock[-].",
    "en": "Increases the hero's damage dealt by [FFAE00]50%[-] [FFAE00]per[-] [00D5FF]Bleeding, Poisoned, and Shocked Debuff[-] when attacking enemies with said Debuffs."
   }
  },
  "612308": {
   "name": {
    "it": "Assorbimento Vita",
    "en": "Absorb Life"
   },
   "text": {
    "it": "[00D5FF]Recupera[-] il [FFAE00]20%[-] dei danni inflitti ai nemici con effetti [00D5FF]Avvelenamento, Sanguinamento e Shock[-].",
    "en": "[00D5FF]Recovers[-] for [FFAE00]20%[-] of damage dealt to enemies with [00D5FF]Poison, Bleed, and Shock[-] effects."
   }
  },
  "612309": {
   "name": {
    "it": "Ferita infetta",
    "en": "Infect Wound"
   },
   "text": {
    "it": "Quando un nemico subisce danni da Colpo critico dall'attacco di un eroe, infligge danni Corrosione pari al [FFAE00]10%[-] dei PS massimi per [FFAE00]1 turno[-].\\n[00D5FF](Può essere accumulato)[-]",
    "en": "When an enemy takes Critical Strike damage from the hero's attack, inflicts Corrosion damage equal to [FFAE00]10%[-] of Max HP for [FFAE00]1 turn[-].\\n[00D5FF](Can be stacked)[-]"
   }
  },
  "612310": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Ogni volta che i PS dell'eroe vengono ridotti del [FFAE00]5%[-], le statistiche relative all'Attacco aumentano del [FFAE00]1%[-] usando un'abilità.",
    "en": "Each time the hero's HP is depleted by [FFAE00]5%[-], Attack-related stats increase by [FFAE00]1%[-] when using skills."
   }
  },
  "612311": {
   "name": {
    "it": "Evasione Attacchi a distanza",
    "en": "Evade Ranged Attacks"
   },
   "text": {
    "it": "L'eroe evade le abilità Attacco a distanza.\\n[00D5FF](Escluse le Mosse finali)[-]",
    "en": "The hero evades Ranged Attack Skills.\\n[00D5FF](Excludes Ultimate Moves)[-]"
   }
  },
  "612313": {
   "name": {
    "it": "Distruzione",
    "en": "Consume"
   },
   "text": {
    "it": "[00D5FF]Riempie la barra Mossa finale[-] in base al numero di sfere svuotate dalla barra Mossa finale del nemico.",
    "en": "[00D5FF]Fills the Ultimate Move Gauge[-] by the number of orbs depleted from the enemy's Ultimate Move Gauge."
   }
  },
  "612314": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]50%[-] i danni subiti dall'eroe dai nemici senza un vantaggio attributo.",
    "en": "Decreases the hero's damage taken from enemies without an attribute advantage by [FFAE00]50%[-]."
   }
  },
  "612315": {
   "name": {
    "it": "Riduzione danni Mossa finale subiti",
    "en": "Ultimate Move Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]50%[-] i danni subiti dall'eroe nelle Mosse finali.",
    "en": "Decreases the hero's damage taken from Ultimate Moves by [FFAE00]50%[-]."
   }
  },
  "612621": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Nascondersi nei cespugli\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Hide in the Bushes\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612622": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Coda di ferro\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Iron Tail\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612623": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Attacco demoniaco\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Demonic Attack\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612624": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Giro mortale\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Death Roll\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612625": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Nascondersi nei cespugli\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Hide in the Bushes\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612626": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Giro mortale\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Death Roll\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "614101": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Rigenerazione\" come prima abilità ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Regeneration\" as the first skill every [FFAE00]2 turn(s)[-]."
   }
  },
  "614102": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Oscurità della disperazione\" come ultima abilità ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Darkness of Despair\" as the last skill every [FFAE00]3 turn(s)[-]."
   }
  },
  "614103": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Rigenerazione\" come prima abilità ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Regeneration\" as the first skill every [FFAE00]2 turn(s)[-]."
   }
  },
  "614104": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Oscurità della disperazione\" come ultima abilità ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Darkness of Despair\" as the last skill every [FFAE00]3 turn(s)[-]."
   }
  },
  "614105": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Rigenerazione\" come prima abilità ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Regeneration\" as the first skill every [FFAE00]2 turn(s)[-]."
   }
  },
  "614106": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Oscurità della disperazione\" come ultima abilità ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Darkness of Despair\" as the last skill every [FFAE00]3 turn(s)[-]."
   }
  },
  "614107": {
   "name": {
    "it": "Riduzione di tutte le Statistiche",
    "en": "All Stats Decrease"
   },
   "text": {
    "it": "Applica un effetto che riduce tutte le statistiche del [FFAE00]7%[-] sui nemici che usano abilità per [FFAE00]1 turno[-].[00D5FF](Si applica prima dell'attivazione dell'abilità e può essere accumulato)[-]",
    "en": "Applies an effect which decreases all stats by [FFAE00]7%[-] on enemies who use skills for [FFAE00]1 turn[-].[00D5FF](Applies before skill activation, can be stacked)[-]"
   }
  },
  "614109": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti gli effetti Debuff[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuff effects[-]."
   }
  },
  "614110": {
   "name": {
    "it": "Riduzione statistiche relative ai PS",
    "en": "HP-related Stats Decrease"
   },
   "text": {
    "it": "Riduce tutte le statistiche relative ai PS degli alleati di [FFAE00]25%[-].",
    "en": "Decreases all enemies' HP-related stats by [FFAE00]25%[-]."
   }
  },
  "614111": {
   "name": {
    "it": "Disabilita Mossa finale",
    "en": "Ultimate Move Disable"
   },
   "text": {
    "it": "Applica un [00D5FF]effetto Disabilita Mossa finale[-] per [FFAE00]2 turni[-] ogni volta che la barra Mossa finale nemica raggiunge almeno [FFAE00]5 sfera/e[-].",
    "en": "Applies an [00D5FF]Ultimate Move Disable effect[-] for [FFAE00]2 turns[-] every time an enemy Ultimate Move Gauge reaches [FFAE00]5 orb(s)[-] or more."
   }
  },
  "614112": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta le statistiche di base dell'eroe del [FFAE00]10%[-] per [FFAE00]ogni[-] Debuff applicato su tutti i nemici.\\n[00D5FF](Limite 10 volta/e)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]10%[-] for [FFAE00]every[-] Debuff applied on all enemies.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "614115": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti [00D5FF]Pietrificazione, Stordimento, Congelamento, Coercizione, Corrosione, Disabilita Attacco, Disabilita Buff, Disabilita Debuff, Riduzione statistiche, Avvelenamento, Sanguinamento, Shock, Ossidazione e Fuoco[-].",
    "en": "The hero becomes immune to [00D5FF]Petrify, Stun, Freeze, Coerce, Corrosion, Attack Disable, Buff Disable, Debuff Disable, Stat Decrease, Poison, Bleed, Shock, Oxidize, and Burn[-] effects."
   }
  },
  "614116": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]100%[-] i danni subiti dall'eroe da parte di nemici della Dea.\\n[00D5FF](Escluse razze aggiuntive applicate con effetti Unici)[-]",
    "en": "Decreases the hero's damage taken from Goddess enemies by [FFAE00]100%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "614117": {
   "name": {
    "it": "Corpo forte",
    "en": "Strong Body"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]40%[-] dei PS massimi. Aumenta del [FFAE00]1%[-] le statistiche relative all'Attacco per [FFAE00]ogni 7%[-] dei PS rimanenti usando le abilità.\\n[00D5FF](Si applica prima dell'attivazione dell'abilità)[-]",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]40%[-] of Max HP. Increases Attack-related stats by [FFAE00]1%[-] for [FFAE00]every 7%[-] of remaining HP when using skills.\\n[00D5FF](Applies before skill activation)[-]"
   }
  },
  "620001": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Alito maligno\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Evil Breath\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "620002": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Punizione\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Retribution\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "620004": {
   "name": {
    "it": "Immunità a Riduzione statistiche",
    "en": "Stat Decrease Immunity"
   },
   "text": {
    "it": "[00D5FF]Tutte le statistiche[-] [00D5FF]non scenderanno al di sotto dei loro valori iniziali.[-]",
    "en": "[00D5FF]All stats[-] [00D5FF]will not fall below their initial values.[-]"
   }
  },
  "620006": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta le proprie statistiche base di [FFAE00]1000%[-] quando un'abilità nemica [00D5FF]sale di rango con un'abilità Unica o con un effetto Reliquia sacra[-].\\n[00D5FF](Limite: 1 volta/e)[-]",
    "en": "Increases own basic stats by [FFAE00]1000%[-] when an enemy's skill is [00D5FF]ranked up with a Unique ability or Holy Relic effect[-].\\n[00D5FF](Limit 1 time(s))[-]"
   }
  },
  "620011": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Pestata crudele\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Vicious Stomp\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "620012": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Ruggito demoniaco\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Demonic Roar\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "620013": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]20%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]20%[-] of Max HP."
   }
  },
  "620014": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta di un [FFAE00]2%[-] le statistiche di base dell'eroe per [FFAE00]ogni sfera[-] nelle barre Mossa finale sul campo di battaglia.",
    "en": "Increases the hero's basic stats by [FFAE00]2%[-] for [FFAE00]every orb[-] in Ultimate Move Gauges on the battlefield."
   }
  },
  "620015": {
   "name": {
    "it": "Recupero PS",
    "en": "HP Recovery"
   },
   "text": {
    "it": "[00D5FF]Infliggendo danni da Esplosione su un nemico[-], guarisce i PS dell'eroe del [FFAE00]10%[-] dei PS massimi e riempie di [FFAE00]1 sfera/e[-] la Barra Mossa finale.",
    "en": "[00D5FF]Inflicting Explosion damage on an enemy[-] heals the hero's HP by [FFAE00]10%[-] of Max HP and fills the Ultimate Move Gauge by [FFAE00]1 orb(s)[-]."
   }
  },
  "620021": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Alito maligno\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Evil Breath\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "620022": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Ruggito demoniaco\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Demonic Roar\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "620023": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Coercizione, Espulsione, Blocco Effetto Abilità e Disabilita abilità[-], oltre che a [00D5FF]Riduzione Barra Mossa finale[-].",
    "en": "Immune to [00D5FF]Coerce, Expel, Skill Effect Block, and Skill Disable[-], as well as [00D5FF]Ultimate Move Gauge Decrease[-]."
   }
  },
  "620024": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]30%[-] i danni subiti dall'eroe dai nemici con attributo Luce.",
    "en": "Decreases the hero's damage taken from Light attribute enemies by [FFAE00]30%[-]."
   }
  },
  "620025": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]30%[-] i danni subiti dall'eroe dai nemici con attributo Oscurità.",
    "en": "Decreases the hero's damage taken from Darkness attribute enemies by [FFAE00]30%[-]."
   }
  },
  "620026": {
   "name": {
    "it": "Barra Mossa finale aumentata",
    "en": "Increases Ultimate Move Gauge."
   },
   "text": {
    "it": "Riempie la barra Mossa finale dell'eroe di [FFAE00]1 sfera/e[-] all'inizio della battaglia.",
    "en": "Fills the hero's Ultimate Move Gauge by [FFAE00]1 orb(s)[-] at the start of the battle."
   }
  },
  "620029": {
   "name": {
    "it": "Ribellione all'effetto",
    "en": "Effect Defiance"
   },
   "text": {
    "it": "Se il nemico usa un effetto [00D5FF]Stordimento, Pietrificazione o Congelamento,[-] [00D5FF]Ribellione all'effetto[-] viene applicato su di sé, poi [00D5FF]Impronta karmica[-] viene applicato su tutti i nemici per [FFAE00]1 turno[-].\\n[00D5FF]※Impronta karmica: L'abilità \"Punizione\" non va a segno.\\nAumenta i ranghi abilità quando viene rimosso.[-]",
    "en": "If the enemy uses a skill with a [00D5FF]Stun, Petrify, or Freeze[-] effect, [00D5FF]Effect Defiance[-] is applied to self, then [00D5FF]Karmic Imprint[-] is applied to all enemies for [FFAE00]1 turn[-].\\n[00D5FF]※Karmic Imprint: \"Retribution\" skill results in a miss.\\nIncreases skill ranks when removed.[-]"
   }
  },
  "620030": {
   "name": {
    "it": "Aumento Barra Mossa finale",
    "en": "Ultimate Move Gauge Increase"
   },
   "text": {
    "it": "Se il nemico usa [00D5FF]diversi tipi di abilità[-] [FFAE00]almeno 3 volte[-], le Barre Mossa finale di tutti i nemici si riempiono di [FFAE00]1 sfera/e[-] all'inizio del turno del boss.\\n[00D5FF](Esclude le Mosse finali)[-]",
    "en": "If the enemy uses [00D5FF]different skill types[-] [FFAE00]3 or more times[-], all enemies' Ultimate Move Gauges are filled by [FFAE00]1 orb(s)[-] at the start of the boss's turn.\\n[00D5FF](Excludes Ultimate Moves)[-]"
   }
  },
  "620031": {
   "name": {
    "it": "Ribellione all'effetto",
    "en": "Effect Defiance"
   },
   "text": {
    "it": "Applica [00D5FF]Ribellione all'effetto[-] su di sé se il nemico usa un'abilità con l'effetto [00D5FF]Stordimento, Pietrificazione o Congelamento[-].\\n\\n[00D5FF]※Ribellione all'effetto: applica solo 1 Status quando usa \"Pestata crudele\".[-]",
    "en": "Applies [00D5FF]Effect Defiance[-] on self if the enemy uses a skill with the [00D5FF]Stun, Petrify, or Freeze[-] effect.\\n\\n[00D5FF]※Effect Defiance: Only applies 1 Tier when using \"Vicious Stomp.\"[-]"
   }
  },
  "620032": {
   "name": {
    "it": "Aumento / Riduzione Danni subiti",
    "en": "Damage Taken Increase / Decrease"
   },
   "text": {
    "it": "Aumenta i propri danni subiti dai nemici con [00D5FF]Impronta karmica[-] del [FFAE00]50%[-].\\nRiduce i propri danni subiti dai nemici senza [00D5FF]Impronta karmica[-] del [FFAE00]50%[-].",
    "en": "Increases own damage taken from enemies with [00D5FF]Karmic Imprint[-] by [FFAE00]50%[-].\\nDecreases own damage taken from enemies without [00D5FF]Karmic Imprint[-] by [FFAE00]50%[-]."
   }
  },
  "620035": {
   "name": {
    "it": "Frammento di Potere",
    "en": "Fragment of Power"
   },
   "text": {
    "it": "[00D5FF]Ruggito e Ossidazione[-] vengono rimossi quando la somma dei ranghi di tutte le abilità [FFAE00]Rango 2[-] o superiore usate in un turno raggiunge una [00D5FF]determinata soglia[-].",
    "en": "[00D5FF]Roar and Oxidize[-] are removed when the sum of the ranks of all skills [FFAE00]Rank 2[-] or higher used in a turn reach a [00D5FF]certain threshold[-]."
   }
  },
  "620036": {
   "name": {
    "it": "Frammento di Potere",
    "en": "Fragment of Power"
   },
   "text": {
    "it": "Applica o rimuove l'effetto [00D5FF]Aumento Attacco [FFAE00]50%[-][-] su di sé e applica o rimuove l'effetto [00D5FF]Riduzione danni Contrattacco [FFAE00]15%[-][-] da tutti i nemici, secondo il [00D5FF]numero di abilità usante in un turno[-].",
    "en": "Applies or removes the [00D5FF][FFAE00]50%[-] Attack Increase[-] effect from self, and applies or removes the [00D5FF][FFAE00]15%[-] Counter Damage Decrease[-] effect from all enemies, according to the [00D5FF]number of skills used in one turn[-]."
   }
  },
  "620037": {
   "name": {
    "it": "Aumento Danni finali",
    "en": "Final Damage Increase"
   },
   "text": {
    "it": "Infligge danni aggiuntivi pari a [FFAE00]2000[-] dei danni finali quando usa un'abilità.",
    "en": "Inflicts additional damage equal to [FFAE00]2000[-] of final damage when using a skill."
   }
  },
  "620038": {
   "name": {
    "it": "Immunità a Dissoluzione",
    "en": "Dissolve Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti di [00D5FF]Riduzione barra Mossa finale[-].",
    "en": "The hero becomes immune to [00D5FF]Ultimate Move Gauge Decrease[-] effects."
   }
  },
  "620039": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]tutti i Debuff[-] e a [00D5FF]Riduzione Barra Mossa finale[-].",
    "en": "Immune to [00D5FF]all Debuffs[-] and [00D5FF]Ultimate Move Gauge Decrease[-]."
   }
  },
  "620040": {
   "name": {
    "it": "Aumento danni razza",
    "en": "Race Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] i danni inflitti dall'eroe a nemici della Dea.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases the hero's damage dealt to Goddess enemies by [FFAE00]100%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "620043": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Aumenta di [FFAE00]5%[-] le statistiche relative all'Attacco dell'eroe alla fine del turno degli alleati.",
    "en": "Increases the hero's Attack-related stats by [FFAE00]5%[-] at the end of the allies' turn."
   }
  },
  "620044": {
   "name": {
    "it": "Riporta in vita",
    "en": "Revive"
   },
   "text": {
    "it": "L'eroe torna in vita con il [FFAE00]30%[-] dei PS massimi quando muore.\\n[00D5FF](Una volta per combattimento)[-]",
    "en": "Revives with [FFAE00]30%[-] of Max HP when the hero dies.\\n[00D5FF](Once per battle)[-]"
   }
  },
  "620045": {
   "name": {
    "it": "Aumento statistiche relative ai PS",
    "en": "HP-related Stats Increase"
   },
   "text": {
    "it": "Aumenta di [FFAE00]5%[-] le statistiche relative ai PS dell'eroe alla fine del turno degli alleati.",
    "en": "Increases the hero's HP-related stats by [FFAE00]5%[-] at the end of the allies' turn."
   }
  },
  "620046": {
   "name": {
    "it": "Recupero",
    "en": "Recovery"
   },
   "text": {
    "it": "Cura [FFAE00]20%[-] dei PS ridotti dell'eroe all'inizio del turno degli alleati.",
    "en": "Heals [FFAE00]20%[-] of the hero's diminished HP at the start of the allies' turn."
   }
  },
  "660041": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 1",
    "en": "Damage Dealt Increase Lv. 1"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]3%[-] in [00D5FF]Scontro finale Demone rosso[-].",
    "en": "Increases allies' damage dealt by [FFAE00]3%[-] in [00D5FF]Red Demon Death Match[-]."
   }
  },
  "660042": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 2",
    "en": "Damage Dealt Increase Lv. 2"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]6%[-] in [00D5FF]Scontro finale Demone rosso[-].",
    "en": "Increases allies' damage dealt by [FFAE00]6%[-] in [00D5FF]Red Demon Death Match[-]."
   }
  },
  "660043": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 3",
    "en": "Damage Dealt Increase Lv. 3"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]10%[-] in [00D5FF]Scontro finale Demone rosso[-].",
    "en": "Increases allies' damage dealt by [FFAE00]10%[-] in [00D5FF]Red Demon Death Match[-]."
   }
  },
  "660051": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 1",
    "en": "Damage Dealt Increase Lv. 1"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]3%[-] in [00D5FF]Scontro finale Demone grigio[-].",
    "en": "Increases allies' damage dealt by [FFAE00]3%[-] in [00D5FF]Gray Demon Death Match[-]."
   }
  },
  "660052": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 2",
    "en": "Damage Dealt Increase Lv. 2"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]6%[-] in [00D5FF]Scontro finale Demone grigio[-].",
    "en": "Increases allies' damage dealt by [FFAE00]6%[-] in [00D5FF]Gray Demon Death Match[-]."
   }
  },
  "660053": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 3",
    "en": "Damage Dealt Increase Lv. 3"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]10%[-] in [00D5FF]Scontro finale Demone grigio[-].",
    "en": "Increases allies' damage dealt by [FFAE00]10%[-] in [00D5FF]Gray Demon Death Match[-]."
   }
  },
  "660061": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 1",
    "en": "Damage Dealt Increase Lv. 1"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]3%[-] in [00D5FF]Scontro finale Bestia demoniaca Howlex[-].",
    "en": "Increases allies' damage dealt by [FFAE00]3%[-] in [00D5FF]Demonic Beast Howlex Death Match[-]."
   }
  },
  "660062": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 2",
    "en": "Damage Dealt Increase Lv. 2"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]6%[-] in [00D5FF]Scontro finale Bestia demoniaca Howlex[-].",
    "en": "Increases allies' damage dealt by [FFAE00]6%[-] in [00D5FF]Demonic Beast Howlex Death Match[-]."
   }
  },
  "660063": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 3",
    "en": "Damage Dealt Increase Lv. 3"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]10%[-] in [00D5FF]Scontro finale Bestia demoniaca Howlex[-].",
    "en": "Increases allies' damage dealt by [FFAE00]10%[-] in [00D5FF]Demonic Beast Howlex Death Match[-]."
   }
  },
  "660071": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 1",
    "en": "Damage Dealt Increase Lv. 1"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]3%[-] in [00D5FF]Scontro finale Bestia demoniaca Bellmoth[-].",
    "en": "Increases allies' damage dealt by [FFAE00]3%[-] in [00D5FF]Demonic Beast Bellmoth Death Match[-]."
   }
  },
  "660072": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 2",
    "en": "Damage Dealt Increase Lv. 2"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]6%[-] in [00D5FF]Scontro finale Bestia demoniaca Bellmoth[-].",
    "en": "Increases allies' damage dealt by [FFAE00]6%[-] in [00D5FF]Demonic Beast Bellmoth Death Match[-]."
   }
  },
  "660073": {
   "name": {
    "it": "Aumento Danni inflitti Liv. 3",
    "en": "Damage Dealt Increase Lv. 3"
   },
   "text": {
    "it": "Aumenta i danni inflitti dagli alleati del [FFAE00]10%[-] in [00D5FF]Scontro finale Bestia demoniaca Bellmoth[-].",
    "en": "Increases allies' damage dealt by [FFAE00]10%[-] in [00D5FF]Demonic Beast Bellmoth Death Match[-]."
   }
  },
  "660163": {
   "name": {
    "it": "Ignora Difesa Liv. 1",
    "en": "Ignore Defense Lv. 1"
   },
   "text": {
    "it": "Gli alleati ignorano il [FFAE00]20%[-] della Difesa nemica quando usano abilità nello [00D5FF]Scontro Finale Demone Originale[-].",
    "en": "Allies ignore [FFAE00]20%[-] of enemy Defense when using Skills in [00D5FF]Original Demon Death Match[-]."
   }
  },
  "660164": {
   "name": {
    "it": "Ignora Difesa Liv. 2",
    "en": "Ignore Defense Lv. 2"
   },
   "text": {
    "it": "Gli alleati ignorano il [FFAE00]40%[-] della Difesa nemica quando usano abilità nello [00D5FF]Scontro Finale Demone Originale[-].",
    "en": "Allies ignore [FFAE00]40%[-] of enemy Defense when using Skills in [00D5FF]Original Demon Death Match[-]."
   }
  },
  "660165": {
   "name": {
    "it": "Ignora Difesa Liv. 3",
    "en": "Ignore Defense Lv. 3"
   },
   "text": {
    "it": "Gli alleati ignorano il [FFAE00]60%[-] della Difesa nemica quando usano abilità nello [00D5FF]Scontro Finale Demone Originale[-].",
    "en": "Allies ignore [FFAE00]60%[-] of enemy Defense when using Skills in [00D5FF]Original Demon Death Match[-]."
   }
  },
  "660316": {
   "name": {
    "it": "Aumento statistiche di base Liv. 1",
    "en": "Basic Stats Increase Lv. 1"
   },
   "text": {
    "it": "Aumenta del [FFAE00]2%[-] le statistiche di base degli alleati, e se un alleato possiede un Buff, le sue statistiche relative all'Attacco aumentano del [FFAE00]1%[-] nello [00D5FF]Scontro finale Indura della Punizione[-].",
    "en": "Increases allies' basic stats by [FFAE00]2%[-], and if an ally has a buff, their Attack-related stats increase by [FFAE00]1%[-] in [00D5FF]Indura of Retribution Death Match[-]."
   }
  },
  "660317": {
   "name": {
    "it": "Aumento statistiche di base Liv. 2",
    "en": "Basic Stats Increase Lv. 2"
   },
   "text": {
    "it": "Aumenta del [FFAE00]4%[-] le statistiche di base degli alleati, e se un alleato possiede un Buff, le sue statistiche relative all'Attacco aumentano del [FFAE00]2%[-] nello [00D5FF]Scontro finale Indura della Punizione[-].",
    "en": "Increases allies' basic stats by [FFAE00]4%[-], and if an ally has a buff, their Attack-related stats increase by [FFAE00]2%[-] in [00D5FF]Indura of Retribution Death Match[-]."
   }
  },
  "660318": {
   "name": {
    "it": "Aumento statistiche di base Liv. 3",
    "en": "Basic Stats Increase Lv. 3"
   },
   "text": {
    "it": "Aumenta del [FFAE00]6%[-] le statistiche di base degli alleati, e se un alleato possiede un Buff, le sue statistiche relative all'Attacco aumentano del [FFAE00]3%[-] nello [00D5FF]Scontro finale Indura della Punizione[-].",
    "en": "Increases allies' basic stats by [FFAE00]6%[-], and if an ally has a buff, their Attack-related stats increase by [FFAE00]3%[-] in [00D5FF]Indura of Retribution Death Match[-]."
   }
  },
  "660319": {
   "name": {
    "it": "Aumento statistiche di base Liv. 4",
    "en": "Basic Stats Increase Lv. 4"
   },
   "text": {
    "it": "Aumenta del [FFAE00]8%[-] le statistiche di base degli alleati, e se un alleato possiede un Buff, le sue statistiche relative all'Attacco aumentano del [FFAE00]4%[-] nello [00D5FF]Scontro finale Indura della Punizione[-].",
    "en": "Increases allies' basic stats by [FFAE00]8%[-], and if an ally has a buff, their Attack-related stats increase by [FFAE00]4%[-] in [00D5FF]Indura of Retribution Death Match[-]."
   }
  },
  "660320": {
   "name": {
    "it": "Aumento statistiche di base Liv. 5",
    "en": "Basic Stats Increase Lv. 5"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] le statistiche di base degli alleati, e se un alleato possiede un Buff, le sue statistiche relative all'Attacco aumentano del [FFAE00]5%[-] nello [00D5FF]Scontro finale Indura della Punizione[-].",
    "en": "Increases allies' basic stats by [FFAE00]10%[-], and if an ally has a buff, their Attack-related stats increase by [FFAE00]5%[-] in [00D5FF]Indura of Retribution Death Match[-]."
   }
  },
  "800001": {
   "name": {
    "it": "Aumento uso abilità",
    "en": "Skill Use Increase"
   },
   "text": {
    "it": "Aumenta il numero di utilizzi abilità di [FFAE00]1[-].",
    "en": "Increases the number of skill uses by [FFAE00]1[-]."
   }
  },
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
  "800021": {
   "name": {
    "it": "Annulla Debuff",
    "en": "Debuff Cancel"
   },
   "text": {
    "it": "[00D5FF]Rimuove Debuff[-] dall'eroe all'inizio del turno degli alleati.",
    "en": "[00D5FF]Removes Debuffs[-] from the hero at the start of the allies' turn."
   }
  },
  "800081": {
   "name": {
    "it": "Ignora Elusione",
    "en": "Ignore Evasion"
   },
   "text": {
    "it": "Ignora Elusione quando attacca.",
    "en": "Ignores Evasion when attacking."
   }
  }
 },
 "items": {
  "510102": {
   "name": {
    "it": "Pietra del risveglio",
    "en": "Awakening Stone"
   },
   "icon": true
  },
  "510103": {
   "name": {
    "it": "Pietra del risveglio",
    "en": "Awakening Stone"
   },
   "icon": true
  },
  "510104": {
   "name": {
    "it": "Pietra del risveglio",
    "en": "Awakening Stone"
   },
   "icon": true
  },
  "510105": {
   "name": {
    "it": "Pietra del risveglio",
    "en": "Awakening Stone"
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
  "543201": {
   "name": {
    "it": "Componente brillante",
    "en": "Brilliant Component"
   },
   "icon": true
  },
  "543202": {
   "name": {
    "it": "Tessuto splendido",
    "en": "Splendid Fabric"
   },
   "icon": true
  },
  "543203": {
   "name": {
    "it": "Profumo seducente",
    "en": "Alluring Perfume"
   },
   "icon": true
  },
  "900903": {
   "name": {
    "it": "Scrigno del tesoro",
    "en": "Treasure Chest"
   },
   "icon": true
  },
  "900904": {
   "name": {
    "it": "Scrigno del tesoro",
    "en": "Treasure Chest"
   },
   "icon": true
  },
  "900905": {
   "name": {
    "it": "Scrigno del tesoro",
    "en": "Treasure Chest"
   },
   "icon": true
  },
  "900906": {
   "name": {
    "it": "Scrigno del tesoro",
    "en": "Treasure Chest"
   },
   "icon": true
  },
  "910906": {
   "name": {
    "it": "Cassa materiali Miglioramento costumi casuale",
    "en": "Random Costume Enhance Materials Box"
   },
   "icon": true
  },
  "941015": {
   "name": {
    "it": "Essenza del risveglio",
    "en": "Awakening Essence"
   },
   "icon": true
  },
  "941016": {
   "name": {
    "it": "Essenza del risveglio",
    "en": "Awakening Essence"
   },
   "icon": true
  },
  "941017": {
   "name": {
    "it": "Essenza del risveglio",
    "en": "Awakening Essence"
   },
   "icon": true
  },
  "941018": {
   "name": {
    "it": "Essenza del risveglio",
    "en": "Awakening Essence"
   },
   "icon": true
  },
  "5301102": {
   "name": {
    "it": "Frammento di Moneta del super risveglio",
    "en": "Super Awakening Coin Fragment"
   },
   "icon": true
  },
  "6020001": {
   "name": {
    "it": "Demone rosso",
    "en": "Red Demon"
   },
   "icon": true
  },
  "6020002": {
   "name": {
    "it": "Demone grigio",
    "en": "Gray Demon"
   },
   "icon": true
  },
  "6020007": {
   "name": {
    "it": "Bestia demoniaca Howlex",
    "en": "Demonic Beast Howlex"
   },
   "icon": true
  },
  "6020008": {
   "name": {
    "it": "Bestia demoniaca Bellmoth",
    "en": "Demonic Beast Bellmoth"
   },
   "icon": true
  },
  "6020046": {
   "name": {
    "it": "Demone Originale",
    "en": "Original Demon"
   },
   "icon": true
  },
  "6020071": {
   "name": {
    "it": "Indura della Punizione",
    "en": "Indura of Retribution"
   },
   "icon": true
  },
  "6030087": {
   "name": {
    "it": "Distruzione oscura",
    "en": "Dark Eraser"
   },
   "icon": true
  }
 }
};
