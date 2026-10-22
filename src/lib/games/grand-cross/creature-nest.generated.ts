/**
 * Le Bestie demoniache («Creature Nest») di Grand Cross.
 *
 * FONTE: il client, via python script/creature_nest.py (eroi/creature_nest.json). Le
 * sei bestie coi loro piani; il colosseo («Prova di coraggio») resta fuori perche' nel
 * client non ha stagioni. Lo studio: CREATURE_NEST.md.
 *
 * GENERATO DA scripts/import-endgame.mts - NON MODIFICARE A MANO.
 */

import type { CreatureNestIndex } from "../endgame-types";

export const CREATURE_NEST: CreatureNestIndex = {
 "name": {
  "it": "Battaglia Bestia demoniaca",
  "en": "Demonic Beast Battle"
 },
 "guide": [
  {
   "title": {
    "it": "Introduzione Battaglia Bestia demoniaca",
    "en": "Demonic Beast Battle Introduction"
   },
   "text": {
    "it": "[FF9C00]Affronta le potentissime Bestie demoniache che esistono nelle aree nascoste di questo mondo.[-]\\n\\n<Demonic Beast Forms>\\nLe Bestie demoniache hanno tre forme: Bestia demoniaca, Bestia demoniaca superiore e Bestia demoniaca definitiva, ciascuna più forte della precedente.\\n\\n<Demonic Beast Passives>\\nLe Bestie demoniache diventano più forti man mano che avanzi nelle battaglie. Al termine di una fase, un'abilità passiva della Bestia demoniaca si attiva. La Bestia demoniaca può anche accumulare abilità passive. Alcune Bestie demoniache non accumulano abilità passive, ma le applicano solo in alcune fasi.\\n\\n<Preparing for Demonic Beast Battles>\\nSfida le Bestie demoniache con un party a scelta. Puoi scegliere fino a quattro eroi e quattro eroi associati. Le impostazioni Artefatti vengono salvate insieme al party alla conferma.\\n\\n<Demonic Beast Battle>\\nI quattro eroi possono usare fino a quattro abilità contro le Bestie demoniache. Quando una fase è completata, i PS rimanenti degli eroi e le abilità passive della Bestia demoniaca vengono trasferiti alla fase successiva. Ciò non si applica ad alcune Bestie demoniache e le abilità passive possono essere applicate solo in alcune fasi. Gli eroi sconfitti in battaglia non possono partecipare alla fase successiva.\\n\\n<Demonic Beast Battle Progress Reset>\\nI progressi della Battaglia Bestia demoniaca si resettano completando il piano più alto. Quando si resettano, dovrai ricominciare dal primo piano. Dopo che si sono resettati, è possibile cambiare il party. Inoltre è possibile resettare manualmente i progressi.\\n\\n<Weekly Demonic Beast Battle Reset>\\nLa Battaglia Bestia demoniaca si resetta ogni lunedì a mezzanotte. Puoi ottenere le ricompense primo completamento e le ricompense sfida dalla Battaglia Bestia demoniaca dopo il ripristino settimanale.",
    "en": "[FF9C00]Battle against all-powerful Demonic Beasts who exist in hidden areas of this world.[-]\\n\\n<Demonic Beast Forms>\\nDemonic Beasts have three forms: Demonic Beast, Greater Demonic Beast, and Ultimate Demonic Beast, each stronger than the last.\\n\\n<Demonic Beast Passives>\\nDemonic Beasts become stronger as you progress through the battles. When a phase ends, a Demonic Beast Passive activates. The Demonic Beast also accumulates passives. Some Demonic Beasts do not accumulate passives, instead applying them only during certain phases.\\n\\n<Preparing for Demonic Beast Battles>\\nChallenge Demonic Beasts with the party of your choice. You can choose up to four heroes and four associated heroes. Artifact settings are saved along with the party when confirmed.\\n\\n<Demonic Beast Battle>\\nThe four heroes can use up to four skills against Demonic Beasts. Once a stage is cleared, the heroes' remaining HP and accumulated Demonic Beast Passives carry over to the next stage. This does not apply to some Demonic Beasts, and passives may be applied only during certain stages. Heroes who are defeated in battle cannot participate in the next stage.\\n\\n<Demonic Beast Battle Progress Reset>\\nDemonic Beast Battle progress resets if you clear the highest floor. If a reset occurs, you must start over from the first floor. You can change your party once reset. You can also manually reset your progress.\\n\\n<Weekly Demonic Beast Battle Reset>\\nDemonic Beast Battle resets every Monday at midnight. You can obtain first time clear rewards and challenge rewards from the Demonic Beast Battle after the weekly reset."
   }
  },
  {
   "title": {
    "it": "Introduzione Bestia demoniaca trascendente",
    "en": "Transcendent Demonic Beast Introduction"
   },
   "text": {
    "it": "[FF9C00]\"Sono state trovate delle tracce di alcune Bestie demoniache che hanno superato i propri limiti.\"[-]\\n\\n[Consigli Bestia demoniaca trascendente]\\n\\n1. Puoi provare la difficoltà Bestia demoniaca trascendente dopo aver sconfitto una Bestia demoniaca definitiva che ha un livello di difficoltà trascendente.\\n\\n2. Se riuscirai a completare la difficoltà Bestia demoniaca trascendente, potrai giocare solo la difficoltà Bestia demoniaca trascendente. Ogni tentativo richiede degli oggetti Fonte.\\n\\n3. Tutti i tentativi e i progressi contro la Bestia demoniaca trascendente vengono azzerati ogni settimana.\\n\\n4. Se possiedi almeno un certo numero di Reliquie sacre ottenibili da una Battaglia Bestia demoniaca, puoi tentare subito la Battaglia Bestia demoniaca trascendente senza dover completare i piani 1-3.",
    "en": "[FF9C00]\"Signs of Demonic Beasts that have transcended their limits have been found.\"[-]\\n\\n[Transcendent Demonic Beast Tips]\\n\\n1. You can attempt the Transcendent Demonic Beast difficulty after defeating an Ultimate Demonic Beast that has a Transcendent difficulty level.\\n\\n2. If you clear the Transcendent Demonic Beast difficulty, you can play only the Transcendent Demonic Beast difficulty. Re-entry requires Source items.\\n\\n3. All Transcendent Demonic Beast attempts and progress are reset weekly.\\n\\n4. If you own a certain number or more of Holy Relics that can be crafted from a Demonic Beast Battle, you can attempt the Transcendent Demonic Beast battle immediately without clearing Floors 1-3."
   }
  },
  {
   "title": {
    "it": "Selezione Bestia demoniaca",
    "en": "Demonic Beast Selection"
   },
   "text": {
    "it": "Le [FFE809]ricompense primo completamento[-] e le [FFE809]ricompense sfida[-] possono essere ottenute solo attraverso [FFE809]la Battaglia Bestia demoniaca selezionata dopo il ripristino settimanale.[-]",
    "en": "[FFE809]First Time Clear Rewards[-] and [FFE809]Challenge Rewards[-] can only be obtained through [FFE809]the selected Demonic Beast Battle after the weekly reset.[-]"
   }
  }
 ],
 "beasts": [
  {
   "key": "hraesvelgr",
   "group": "101",
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "power": 4000000,
   "image": true,
   "info": true,
   "material": "543207",
   "guaranteed": {
    "it": "Porta a termine il Piano 3 del Nido di Hraesvelgr per ricevere la ricompensa garantita.",
    "en": "Clear Hraesvelgr's Nest Floor 3 to receive the guaranteed reward."
   },
   "floors": [
    {
     "name": {
      "it": "Bestia demoniaca",
      "en": "Demonic Beast"
     },
     "color": "#0093B0",
     "title": {
      "it": "Nido di Hraesvelgr Piano 1",
      "en": "Hraesvelgr's Nest Floor 1"
     },
     "floor": 1,
     "transcendent": false,
     "energy": 30,
     "firstClear": [
      {
       "id": "543207",
       "count": 1
      },
      {
       "id": "543215",
       "count": 2
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543215",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "6020041",
        "count": 1,
        "weight": 20
       },
       {
        "id": "543211",
        "count": 5,
        "weight": 2000
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 2000
       },
       {
        "id": "543211",
        "count": 2,
        "weight": 2490
       },
       {
        "id": "543214",
        "count": 2,
        "weight": 2490
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, infligge danni Lancia a bersagli singoli, e usa un'abilità che applica Sanguinamento su tutti i nemici. Devi prestare molta attenzione alla battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage, deals Spike damage on single targets, and uses a skill which applies Bleed on all enemies. You must pay close attention to the battle."
       },
       "foes": [
        {
         "monster": "2390101",
         "level": 100,
         "multipliers": {
          "atk": 200,
          "def": 210,
          "hp": 500
         },
         "estimate": {
          "atk": 11296,
          "def": 8946,
          "hp": 366500
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e usa un'abilità che applica Sanguinamento su tutti i nemici. La sua Mossa finale infligge danni Punto debole a tutti i nemici, perciò è importante usare abilità che rimuovono i Debuff.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a skill which applies Bleed on all enemies. Its Ultimate Move deals Weak Point damage to all enemies, so it is important to use skills which remove Debuffs."
       },
       "foes": [
        {
         "monster": "2390102",
         "level": 100,
         "multipliers": {
          "atk": 210,
          "def": 220,
          "hp": 520
         },
         "estimate": {
          "atk": 11861,
          "def": 9808,
          "hp": 381160
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, infligge danni a bersagli singoli dopo aver rimosso i Buff, e usa un'abilità che incendia i nemici. Devi prestare molta attenzione alla rimozione dei Debuff e all'utilizzo di Abilità Buff durante la battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage, deals damage to single targets after removing Buffs, and uses a skill which Ignites enemies. You must pay close attention to remove Debuffs and use Buff Skills in battle."
       },
       "foes": [
        {
         "monster": "2390103",
         "level": 100,
         "multipliers": {
          "atk": 260,
          "def": 200,
          "hp": 570
         },
         "estimate": {
          "atk": 12883,
          "def": 12480,
          "hp": 502455
         }
        }
       ],
       "randomPassives": [
        "613101",
        "613102",
        "613103"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, e la sua Difesa aumenta enormemente all'inizio della battaglia. Se non subisce danni, infligge danni Corrosione a tutti i nemici in base ai PS massimi. Inoltre, limita gli effetti di recupero di tutti i nemici dopo 3 turni, poi aumenta il suo Attacco. La battaglia diventa più difficile con il passare del tempo.",
        "en": "The Demonic Beast is immune to Reflect damage, and its Defense greatly increases at the start of the battle. If it does not take damage, it deals Corrosion damage on all enemies based on Max HP. In addition, it restricts the Recovery effects of all enemies after 3 turns, then increases its Attack. The battle becomes increasingly harder as it continues."
       },
       "foes": [
        {
         "monster": "2390104",
         "level": 100,
         "multipliers": {
          "atk": 220,
          "def": 220,
          "hp": 650
         },
         "estimate": {
          "atk": 14168,
          "def": 20262,
          "hp": 522138
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca superiore",
      "en": "Greater Demonic Beast"
     },
     "color": "#DF6100",
     "title": {
      "it": "Nido di Hraesvelgr Piano 2",
      "en": "Hraesvelgr's Nest Floor 2"
     },
     "floor": 2,
     "transcendent": false,
     "energy": 45,
     "firstClear": [
      {
       "id": "543207",
       "count": 2
      },
      {
       "id": "543215",
       "count": 4
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543215",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "6020041",
        "count": 1,
        "weight": 60
       },
       {
        "id": "543211",
        "count": 10,
        "weight": 2500
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 2500
       },
       {
        "id": "543215",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543211",
        "count": 5,
        "weight": 1470
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 1470
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, usa un'Abilità Buff che aumenta le sue statistiche di base dopo un numero di turni prestabilito, e usa un'Abilità Attacco con l'effetto Amplificazione. La cautela è essenziale in questa battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage, uses a Buff Skill which increases basic stats every set number of turns, and uses an Attack Skill with the Amplify effect. Caution is required."
       },
       "foes": [
        {
         "monster": "2390105",
         "level": 200,
         "multipliers": {
          "atk": 130,
          "def": 130,
          "hp": 320
         },
         "estimate": {
          "atk": 14102,
          "def": 10738,
          "hp": 458880
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e usa un'Abilità Attacco che infligge gravi danni a tutti i nemici dopo un numero di turni prestabilito. Se l'attacco colpisce un nemico provocato, quest'ultimo non subirà danni.",
        "en": "The Demonic Beast is immune to Reflect damage and uses an Attack Skill which deals great damage to all enemies every set number of turns. If the attack lands on a Taunted enemy, they will not take damage."
       },
       "foes": [
        {
         "monster": "2390106",
         "level": 200,
         "multipliers": {
          "atk": 130,
          "def": 150,
          "hp": 350
         },
         "estimate": {
          "atk": 14102,
          "def": 12987,
          "hp": 501900
         }
        }
       ],
       "randomPassives": [
        "613111",
        "613112",
        "613113"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, e le sue statistiche vengono potenziate quando i suoi PS rimanenti raggiungono valori prestabiliti. Devi prestare molta attenzione alla quantità di danni che infliggi in questa battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage, and its stats become enhanced at set amounts of remaining HP. You must pay close attention to your damage dealt in battle."
       },
       "foes": [
        {
         "monster": "2390107",
         "level": 200,
         "multipliers": {
          "atk": 170,
          "def": 130,
          "hp": 320
         },
         "estimate": {
          "atk": 16074,
          "def": 15912,
          "hp": 554400
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e usa un'abilità con l'effetto Esplosione su tutti i nemici dopo un numero di turni prestabilito. Se un nemico subisce danni dall'effetto Esplosione, la Bestia demoniaca recupera i suoi PS e riempie la sua Barra Mossa finale.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a skill with the Explosion effect on all enemies every set number of turns. If an enemy takes damage from the Explosion effect, the Demonic Beast restores its HP and fills its Ultimate Move Gauge."
       },
       "foes": [
        {
         "monster": "2390108",
         "level": 200,
         "multipliers": {
          "atk": 135,
          "def": 150,
          "hp": 450
         },
         "estimate": {
          "atk": 16794,
          "def": 13882,
          "hp": 708880
         }
        }
       ],
       "randomPassives": [
        "613121",
        "613122",
        "613123"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca definitiva",
      "en": "Ultimate Demonic Beast"
     },
     "color": "#E800CF",
     "title": {
      "it": "Nido di Hraesvelgr Piano 3",
      "en": "Hraesvelgr's Nest Floor 3"
     },
     "floor": 3,
     "transcendent": false,
     "energy": 60,
     "firstClear": [
      {
       "id": "543207",
       "count": 3
      },
      {
       "id": "543215",
       "count": 6
      }
     ],
     "clear": [
      {
       "id": "543207",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543215",
        "count": 3,
        "weight": 1500
       },
       {
        "id": "6020041",
        "count": 1,
        "weight": 100
       },
       {
        "id": "543211",
        "count": 15,
        "weight": 2500
       },
       {
        "id": "543214",
        "count": 15,
        "weight": 2500
       },
       {
        "id": "543215",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "543211",
        "count": 10,
        "weight": 950
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 950
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, e i suoi Debuff impediscono l'uso delle Abilità Rango 2. Devi rimuovere il Debuff o fare affidamento alle Abilità Rango 1 e Mosse finali per sconfiggerla.",
        "en": "The Demonic Beast is immune to Reflect damage, and its Debuff disables the use of Rank 2 Skills. You must remove the Debuff or depend on Rank 1 Skills and Ultimate Moves to defeat it."
       },
       "foes": [
        {
         "monster": "2390109",
         "level": 300,
         "multipliers": {
          "atk": 120,
          "def": 120,
          "hp": 350
         },
         "estimate": {
          "atk": 19258,
          "def": 14712,
          "hp": 748020
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e svuota le Barre Mossa finale dei nemici in determinate condizioni. Devi prestare molta attenzione alla battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage and follows a pattern of depleting enemy Ultimate Move Gauges in certain conditions. You must pay close attention to the battle."
       },
       "foes": [
        {
         "monster": "2390110",
         "level": 300,
         "multipliers": {
          "atk": 130,
          "def": 120,
          "hp": 350
         },
         "estimate": {
          "atk": 20862,
          "def": 15430,
          "hp": 748020
         }
        }
       ],
       "randomPassives": [
        "613131",
        "613132",
        "613133",
        "613134"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e disabilita un tipo di abilità nemiche ogni turno. La Bestia demoniaca deve essere sconfitta prima che tutte le abilità siano disabilitate.",
        "en": "The Demonic Beast is immune to Reflect damage and disables an enemy skill type every turn. The Demonic Beast must be defeated before all skills are sealed."
       },
       "foes": [
        {
         "monster": "2390111",
         "level": 300,
         "multipliers": {
          "atk": 125,
          "def": 130,
          "hp": 350
         },
         "estimate": {
          "atk": 17444,
          "def": 23712,
          "hp": 904995
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e infligge gravi danni a bersagli singoli in proporzione ai suoi PS. Devi infliggere il maggior numero possibile di danni nel giro di poco tempo per proteggere i tuoi eroi.",
        "en": "The Demonic Beast is immune to Reflect damage and deals greater damage to single targets the higher its HP. You must deal as much damage as possible within a short time to protect your heroes."
       },
       "foes": [
        {
         "monster": "2390112",
         "level": 300,
         "multipliers": {
          "atk": 130,
          "def": 130,
          "hp": 410
         },
         "estimate": {
          "atk": 23972,
          "def": 17882,
          "hp": 963291
         }
        }
       ],
       "randomPassives": [
        "613141",
        "613142",
        "613143"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca trascendente",
      "en": "Transcendent Demonic Beast"
     },
     "color": "#FF007F",
     "title": {
      "it": "Hraesvelgr trascendente",
      "en": "Transcendent Hraesvelgr"
     },
     "floor": 4,
     "transcendent": true,
     "energy": 60,
     "firstClear": [],
     "clear": [
      {
       "id": "545101",
       "count": 1
      },
      {
       "id": "545102",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "6050109",
        "count": 1,
        "weight": 10
       },
       {
        "id": "6020041",
        "count": 1,
        "weight": 140
       },
       {
        "id": "545102",
        "count": 4,
        "weight": 900
       },
       {
        "id": "545102",
        "count": 2,
        "weight": 2500
       },
       {
        "id": "6040051",
        "count": 1,
        "weight": 250
       },
       {
        "id": "545102",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543211",
        "count": 15,
        "weight": 2350
       },
       {
        "id": "543214",
        "count": 15,
        "weight": 2350
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Difesa della Bestia demoniaca aumenta con ogni effetto Debuff applicato sui nemici e usa un attacco difensivo a ogni turno, perciò è importante [FFAE00]tenere d'occhio i Debuff[-].",
        "en": "The Demonic Beast's Defense increases with each Debuff effect applied to enemies and uses a Defense-based attack every turn, so it is important to [FFAE00]keep an eye on your Debuffs[-]."
       },
       "foes": [
        {
         "monster": "2390401",
         "level": 400,
         "multipliers": {
          "atk": 120,
          "def": 120,
          "hp": 350
         },
         "estimate": {
          "atk": 21068,
          "def": 22026,
          "hp": 2007600
         }
        }
       ],
       "randomPassives": [
        "952131"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Ottieni [00D5FF]Protezione di Hraesvelgr[-] [FFAE00]utilizzando almeno 3 abilità dello stesso rango (Rango 2 o superiore)[-]. Gli eroi con [00D5FF]Protezione di Hraesvelgr[-] possono infliggere gravi danni alle Bestie demoniache.",
        "en": "Obtain [00D5FF]Hraesvelgr's Protection[-] by [FFAE00]using 3 or more skills of the same rank (Rank 2 or higher)[-]. Heroes with [00D5FF]Hraesvelgr's Protection[-] can deal great damage to the Demonic Beast."
       },
       "foes": [
        {
         "monster": "2390402",
         "level": 400,
         "multipliers": {
          "atk": 130,
          "def": 120,
          "hp": 350
         },
         "estimate": {
          "atk": 23992,
          "def": 32680,
          "hp": 2723350
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca applica molti Buff [00D5FF]Immortalità[-] su di sé all'inizio della battaglia. [00D5FF]Immortalità[-] viene aggiunta o rimossa quando la Bestia demoniaca [FFAE00]subisce danni dalle abilità con determinati effetti[-].",
        "en": "The Demonic Beast applies many [00D5FF]Immortality[-] effects on itself at the start of the battle. [00D5FF]Immortality[-] is added or removed when the Demonic Beast [FFAE00]takes damage from skills with certain effects[-]."
       },
       "foes": [
        {
         "monster": "2390403",
         "level": 400,
         "multipliers": {
          "atk": 125,
          "def": 130,
          "hp": 350
         },
         "estimate": {
          "atk": 26061,
          "def": 30346,
          "hp": 2426550
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "[FFAE00]Le statistiche della Bestia demoniaca migliorano per ogni quantità predefinita di PS rimanenti[-]. Devi prestare molta attenzione alla quantità di danni che infliggi in questa battaglia.",
        "en": "[FFAE00]The Demonic Beast's stats become enhanced at set amounts of remaining HP[-]. You must pay close attention to your damage dealt in battle."
       },
       "foes": [
        {
         "monster": "2390404",
         "level": 400,
         "multipliers": {
          "atk": 130,
          "def": 130,
          "hp": 410
         },
         "estimate": {
          "atk": 26585,
          "def": 24122,
          "hp": 3018420
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    }
   ],
   "relics": [
    {
     "name": {
      "it": "Guanti di pietra di Hrungnir",
      "en": "Hrungnir's Stone Gloves"
     },
     "heroes": [
      "1064001"
     ]
    },
    {
     "name": {
      "it": "Guanti di pietra di Hrungnir",
      "en": "Hrungnir's Stone Gloves"
     },
     "heroes": [
      "1065002",
      "1065001",
      "1065003"
     ]
    },
    {
     "name": {
      "it": "Gleipnir",
      "en": "Gleipnir"
     },
     "heroes": [
      "1075001",
      "1075002",
      "1075003"
     ]
    },
    {
     "name": {
      "it": "Draupnir",
      "en": "Draupnir"
     },
     "heroes": [
      "1076501"
     ]
    },
    {
     "name": {
      "it": "Spada a doppio taglio degli Einherjar",
      "en": "Doubled-edged Sword of the Einherjar"
     },
     "heroes": [
      "1203001"
     ]
    },
    {
     "name": {
      "it": "Spada degli Einherjar",
      "en": "Sword of the Einherjar"
     },
     "heroes": [
      "1213001"
     ]
    },
    {
     "name": {
      "it": "Spada degli Einherjar",
      "en": "Sword of the Einherjar"
     },
     "heroes": [
      "1334001"
     ]
    },
    {
     "name": {
      "it": "Bacinella di Sigyn",
      "en": "Bowl of Sigyn"
     },
     "heroes": [
      "1455001",
      "1455002"
     ]
    },
    {
     "name": {
      "it": "Andvaranautr",
      "en": "Andvaranaut"
     },
     "heroes": [
      "1870501",
      "1870502"
     ]
    },
    {
     "name": {
      "it": "Campana a martello di Einherjar",
      "en": "Alarm Bell of the Einherjar"
     },
     "heroes": [
      "1273001"
     ]
    },
    {
     "name": {
      "it": "Spada luminescente dei Ljosalfar",
      "en": "Glowing Sword of the Ljosalfar"
     },
     "heroes": [
      "1404001"
     ]
    },
    {
     "name": {
      "it": "Spada luminescente dei Ljosalfar",
      "en": "Glowing Sword of the Ljosalfar"
     },
     "heroes": [
      "1405001",
      "1405002",
      "1405003"
     ]
    },
    {
     "name": {
      "it": "Guanti del gelo di Niflheim",
      "en": "Frost Gauntlets of Niflheim"
     },
     "heroes": [
      "1894501",
      "1894502"
     ]
    },
    {
     "name": {
      "it": "Grimorio di Aegir",
      "en": "Aegir's Grimoire"
     },
     "heroes": [
      "1675001",
      "1675002",
      "1675003"
     ]
    },
    {
     "name": {
      "it": "Artiglio di Nidhoggr",
      "en": "Nidhoggr's Claw"
     },
     "heroes": [
      "1685001",
      "1685002",
      "1685003"
     ]
    },
    {
     "name": {
      "it": "Ascia dorata di Forseti",
      "en": "Forseti's Golden Axe"
     },
     "heroes": [
      "1475001",
      "1475002"
     ]
    },
    {
     "name": {
      "it": "Laevateinn",
      "en": "Laevateinn"
     },
     "heroes": [
      "1877501"
     ]
    },
    {
     "name": {
      "it": "Arco leggendario di Ullr",
      "en": "Ullr's Legendary Bow"
     },
     "heroes": [
      "1114001"
     ]
    },
    {
     "name": {
      "it": "Arco leggendario di Ullr",
      "en": "Ullr's Legendary Bow"
     },
     "heroes": [
      "1115001",
      "1115002",
      "1115003"
     ]
    },
    {
     "name": {
      "it": "Spada a due mani di Dainn",
      "en": "Dainn's Two-handed Sword"
     },
     "heroes": [
      "1144001",
      "1144002"
     ]
    },
    {
     "name": {
      "it": "Spada a due mani di Dainn",
      "en": "Dainn's Two-handed Sword"
     },
     "heroes": [
      "1145001",
      "1145002"
     ]
    },
    {
     "name": {
      "it": "Lancia di Dainn",
      "en": "Dainn's Lance"
     },
     "heroes": [
      "1165001",
      "1165002"
     ]
    },
    {
     "name": {
      "it": "Spada di Dainn",
      "en": "Dainn's One-handed Sword"
     },
     "heroes": [
      "1175001",
      "1175002"
     ]
    },
    {
     "name": {
      "it": "Mela d'oro di Idun",
      "en": "Golden Apple of Idun"
     },
     "heroes": [
      "1887501",
      "1887502"
     ]
    },
    {
     "name": {
      "it": "Bastone di Njord",
      "en": "Njord's Baton"
     },
     "heroes": [
      "1675501",
      "1675502",
      "1675503"
     ]
    },
    {
     "name": {
      "it": "Occhio di Thiassi",
      "en": "Thiassi's Eye"
     },
     "heroes": [
      "1705001",
      "1705002",
      "1705003"
     ]
    },
    {
     "name": {
      "it": "Saggezza di Mimir",
      "en": "Mimir's Wisdom"
     },
     "heroes": [
      "1135001",
      "1135002",
      "1135003"
     ]
    },
    {
     "name": {
      "it": "Frammento di Luna di Mani",
      "en": "Mani's Moon Fragment"
     },
     "heroes": [
      "1136501",
      "1136502",
      "1136503"
     ]
    },
    {
     "name": {
      "it": "Fiamma di Niflheim",
      "en": "Flame of Niflheim"
     },
     "heroes": [
      "1695001",
      "1695002",
      "1695003"
     ]
    },
    {
     "name": {
      "it": "Spadone di Narfi",
      "en": "Narfi's Greatsword"
     },
     "heroes": [
      "1294001"
     ]
    },
    {
     "name": {
      "it": "Spadone di Narfi",
      "en": "Narfi's Greatsword"
     },
     "heroes": [
      "1295001",
      "1295002"
     ]
    },
    {
     "name": {
      "it": "Carrozza di Sol",
      "en": "Sol's Chariot"
     },
     "heroes": [
      "1886501",
      "1886502",
      "1886503"
     ]
    },
    {
     "name": {
      "it": "Huginn e Muninn",
      "en": "Huginn and Muninn"
     },
     "heroes": [
      "1665001",
      "1665003",
      "1665004"
     ]
    },
    {
     "name": {
      "it": "Spada a doppio taglio di Narfi",
      "en": "Narfi's Double-edged Sword"
     },
     "heroes": [
      "1745001"
     ]
    },
    {
     "name": {
      "it": "Volontà delle Valchirie",
      "en": "Will of the Valkyries"
     },
     "heroes": [
      "1905501",
      "1905502"
     ]
    },
    {
     "name": {
      "it": "Spadone di Alberich",
      "en": "Alberich's Greatsword"
     },
     "heroes": [
      "1364001",
      "1364002"
     ]
    },
    {
     "name": {
      "it": "Oscurità di Hodr",
      "en": "Darkness of Hodr"
     },
     "heroes": [
      "1895501",
      "1895502"
     ]
    },
    {
     "name": {
      "it": "Luce di Baldr",
      "en": "Light of Baldr"
     },
     "heroes": [
      "1901501",
      "1901502"
     ]
    },
    {
     "name": {
      "it": "Finnsleif",
      "en": "Finnsleif"
     },
     "heroes": [
      "1116501"
     ]
    },
    {
     "name": {
      "it": "Bastone di Snotra",
      "en": "Snotra's Staff"
     },
     "heroes": [
      "1485001",
      "1485002"
     ]
    },
    {
     "name": {
      "it": "Bracciale di Embla",
      "en": "Embla's Bracelets"
     },
     "heroes": [
      "1495001",
      "1495002"
     ]
    },
    {
     "name": {
      "it": "Armatura di Tanngnjostr",
      "en": "Tanngnjostr's Armor"
     },
     "heroes": [
      "1876501",
      "1876502",
      "1876503"
     ]
    }
   ],
   "heroesOnly": [
    {
     "heroId": "1905501",
     "source": "unique",
     "passive": {
      "it": "Vuoi venire con me?",
      "en": "Wanna Come With Me?"
     }
    },
    {
     "heroId": "1905501",
     "source": "relic",
     "passive": {
      "it": "Volontà delle Valchirie",
      "en": "Will of the Valkyries"
     }
    },
    {
     "heroId": "1905502",
     "source": "relic",
     "passive": {
      "it": "Volontà delle Valchirie",
      "en": "Will of the Valkyries"
     }
    }
   ],
   "badBlood": [
    "1961501"
   ]
  },
  {
   "key": "eikthyrnir",
   "group": "102",
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "power": 5500000,
   "image": true,
   "info": true,
   "material": "543208",
   "guaranteed": {
    "it": "Porta a termine il Piano 3 del Rifugio di Eikthyrnir per ricevere la ricompensa garantita.",
    "en": "Clear Eikthyrnir's Refuge Floor 3 to receive the guaranteed reward."
   },
   "floors": [
    {
     "name": {
      "it": "Bestia demoniaca",
      "en": "Demonic Beast"
     },
     "color": "#0093B0",
     "title": {
      "it": "Rifugio di Eikthyrnir 1° piano",
      "en": "Eikthyrnir's Refuge Floor 1"
     },
     "floor": 1,
     "transcendent": false,
     "energy": 30,
     "firstClear": [
      {
       "id": "543208",
       "count": 1
      },
      {
       "id": "543216",
       "count": 2
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543216",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "6020047",
        "count": 1,
        "weight": 20
       },
       {
        "id": "543213",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543213",
        "count": 2,
        "weight": 1990
       },
       {
        "id": "543214",
        "count": 2,
        "weight": 1990
       },
       {
        "id": "543219",
        "count": 3,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e infligge danni Lancia a bersaglio singolo e danni Perforazione contro tutti. Fai molta attenzione durante la battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage, and deals both single-target Spike and all-target Pierce damage. You must pay close attention during the battle."
       },
       "foes": [
        {
         "monster": "2390114",
         "level": 100,
         "multipliers": {
          "atk": 240,
          "def": 220,
          "hp": 600
         },
         "estimate": {
          "atk": 13555,
          "def": 9372,
          "hp": 439800
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e aumenta i suoi attributi Perforazione, Possibilità critico e Danno critico del 10% per ogni Debuff sul nemico. Subisce danni aumentati da specifici attributi a seconda del suo stato di battaglia. È necessario avere un team con attributi diversi.",
        "en": "The Demonic Beast is immune to Reflect damage and increases its Pierce Rate, Crit Chance, and Crit Damage by 10% for each Debuff on the enemy. It takes increased damage from certain attributes depending on its battle state. You must have a team of diverse attributes."
       },
       "foes": [
        {
         "monster": "2390115",
         "level": 100,
         "multipliers": {
          "atk": 240,
          "def": 180,
          "hp": 600
         },
         "estimate": {
          "atk": 13555,
          "def": 8024,
          "hp": 1806000
         }
        }
       ],
       "randomPassives": [
        "613207"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e aumenta la Possibilità critico del 10% ogni volta che usa un'abilità. Usa un'abilità con effetto Disperazione su tutti i nemici a ogni numero di turni prestabilito. Dovrai fermare la sua guarigione durante la battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage and increases its Crit Chance by 10% each time it uses a skill. It uses a skill with the Despair effect on all enemies every set number of turns. You must disrupt its healing during battle."
       },
       "foes": [
        {
         "monster": "2390116",
         "level": 100,
         "multipliers": {
          "atk": 270,
          "def": 200,
          "hp": 550
         },
         "estimate": {
          "atk": 13378,
          "def": 12480,
          "hp": 484825
         }
        }
       ],
       "randomPassives": [
        "613201",
        "613202",
        "613203"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e usa periodicamente un'abilità Atteggiamento dopo un certo numero di turni, contrattaccando per infliggere danni quando viene attaccata. Subisce danni aumentati da specifici attributi a seconda del suo stato di battaglia. È necessario avere un team con attributi diversi.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a Stance Skill every set number of turns, countering to deal damage when attacked. It takes reduced damage from certain attributes depending on its battle state. You must have a team of diverse attributes."
       },
       "foes": [
        {
         "monster": "2390117",
         "level": 100,
         "multipliers": {
          "atk": 250,
          "def": 200,
          "hp": 520
         },
         "estimate": {
          "atk": 16100,
          "def": 18420,
          "hp": 417711
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca superiore",
      "en": "Greater Demonic Beast"
     },
     "color": "#DF6100",
     "title": {
      "it": "Rifugio di Eikthyrnir 2° piano",
      "en": "Eikthyrnir's Refuge Floor 2"
     },
     "floor": 2,
     "transcendent": false,
     "energy": 45,
     "firstClear": [
      {
       "id": "543208",
       "count": 2
      },
      {
       "id": "543216",
       "count": 4
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543216",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "6020047",
        "count": 1,
        "weight": 60
       },
       {
        "id": "543213",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543216",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543213",
        "count": 5,
        "weight": 970
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 970
       },
       {
        "id": "543219",
        "count": 4,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, usa un'abilità Buff che aumenta il suo Attacco dopo un numero di turni prestabilito, e infligge danni aggiuntivi sui nemici con Attacco inferiore. La cautela è essenziale in questa battaglia.",
        "en": "The Demonic Beast is immune to Reflect damage, uses a Buff Skill which increases its Attack every set number of turns, and deals additional damage to enemies with lower Attack. Caution is required."
       },
       "foes": [
        {
         "monster": "2390118",
         "level": 200,
         "multipliers": {
          "atk": 100,
          "def": 160,
          "hp": 370
         },
         "estimate": {
          "atk": 11348,
          "def": 13216,
          "hp": 530580
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e usa periodicamente una potente abilità Attacco su tutti i nemici dopo un certo numero di turni. I nemici congelati non subiscono danni da questa abilità. Subisce danni ridotti soltanto da alcuni attributi a seconda del suo stato di battaglia e congela i nemici in determinate situazioni.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a powerful Attack Skill on all enemies every set number of turns. Frozen enemies do not take damage from this skill. It takes reduced damage from certain attributes depending on its battle state and Freezes enemies under certain conditions."
       },
       "foes": [
        {
         "monster": "2390119",
         "level": 200,
         "multipliers": {
          "atk": 140,
          "def": 180,
          "hp": 410
         },
         "estimate": {
          "atk": 15187,
          "def": 15584,
          "hp": 587940
         }
        }
       ],
       "randomPassives": [
        "613211",
        "613212",
        "613213"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e usa periodicamente un'abilità con effetto Eliminazione su bersagli individuali ogni certo numero di turni. Le sue statistiche di base aumentano quando usa un'abilità Eliminazione.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a skill with the Delete effect on individual targets every set number of turns. Increases Demonic Beast's basic stats when using a Delete skill."
       },
       "foes": [
        {
         "monster": "2390120",
         "level": 200,
         "multipliers": {
          "atk": 165,
          "def": 110,
          "hp": 380
         },
         "estimate": {
          "atk": 15601,
          "def": 13464,
          "hp": 658350
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e usa periodicamente un'abilità Atteggiamento ogni certo numero di turni, che aumenta le sue statistiche relative all'attacco. Riduce notevolmente i danni subiti da attributi specifici a seconda del suo stato di battaglia. È necessario avere un team con attributi diversi.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a Stance Skill every set number of turns, increasing the Demonic Beast's Attack-related stats. It greatly reduces damage taken from certain attributes depending on its battle state. You must have a team of diverse attributes."
       },
       "foes": [
        {
         "monster": "2390121",
         "level": 200,
         "multipliers": {
          "atk": 150,
          "def": 170,
          "hp": 500
         },
         "estimate": {
          "atk": 16869,
          "def": 15734,
          "hp": 787645
         }
        }
       ],
       "randomPassives": [
        "613221",
        "613222",
        "613223"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca definitiva",
      "en": "Ultimate Demonic Beast"
     },
     "color": "#E800CF",
     "title": {
      "it": "Rifugio di Eikthyrnir 3° piano",
      "en": "Eikthyrnir's Refuge Floor 3"
     },
     "floor": 3,
     "transcendent": false,
     "energy": 60,
     "firstClear": [
      {
       "id": "543208",
       "count": 3
      },
      {
       "id": "543216",
       "count": 6
      }
     ],
     "clear": [
      {
       "id": "543208",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543216",
        "count": 3,
        "weight": 1500
       },
       {
        "id": "6020047",
        "count": 1,
        "weight": 100
       },
       {
        "id": "543213",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543214",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543216",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "543213",
        "count": 10,
        "weight": 450
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 450
       },
       {
        "id": "543219",
        "count": 5,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi, usa un'abilità con effetto Shock su tutti i nemici e infligge danni aggiuntivi quando attacca i nemici sotto Shock.",
        "en": "The Demonic Beast is immune to Reflect damage, uses a skill with the Shock effect on all enemies, and deals additional damage when attacking Shocked enemies."
       },
       "foes": [
        {
         "monster": "2390122",
         "level": 300,
         "multipliers": {
          "atk": 100,
          "def": 125,
          "hp": 320
         },
         "estimate": {
          "atk": 16048,
          "def": 15325,
          "hp": 683904
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi e i danni che infligge aumentano in proporzione alle sfere nella Barra Mossa finale. Ogni 2 turni usa un'abilità che aumenta i danni subiti da determinati attributi. È necessario avere un team con attributi diversi.",
        "en": "The Demonic Beast is immune to Reflect damage and its damage dealt increases for each orb in the Ultimate Move Gauge. It uses a skill which increases its damage taken from certain attributes every 2 turns. You must have a team of diverse attributes."
       },
       "foes": [
        {
         "monster": "2390123",
         "level": 300,
         "multipliers": {
          "atk": 90,
          "def": 200,
          "hp": 440
         },
         "estimate": {
          "atk": 14443,
          "def": 25716,
          "hp": 940368
         }
        }
       ],
       "randomPassives": [
        "613231",
        "613232",
        "613233",
        "613234"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La bestia demoniaca è immune ai danni da Riflessione e usa un'abilità che riempie la propria Barra Mossa finale. Usa un Buff che aumenta notevolmente le sue statistiche di base ogni 3 turni, e un'abilità con l'effetto Amplificazione, che infligge ulteriori danni per ogni Buff, ogni 2 turni.",
        "en": "The demonic beast is immune to Reflect damage and uses a skill that fills its own Ultimate Move Gauge. It uses a Buff which greatly increases its basic stats every 3 turns, and a skill with the Amplify effect, which deals additional damage for each Buff, every 2 turns."
       },
       "foes": [
        {
         "monster": "2390124",
         "level": 300,
         "multipliers": {
          "atk": 110,
          "def": 115,
          "hp": 360
         },
         "estimate": {
          "atk": 15350,
          "def": 20976,
          "hp": 930852
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni riflessi. Quando sopravvive con i PS inferiori al 20%, riporta la sua salute al massimo e aumenta tutte le statistiche (limite di una volta). Riduce significativamente i danni subiti da attributi specifici a seconda del suo stato di battaglia. È necessario avere un team con attributi diversi.",
        "en": "The Demonic Beast is immune to Reflect damage. When surviving with less than 20% HP, it heals itself to full health and increases all stats (limit once). It greatly reduces damage taken from certain attributes depending on its battle state. You must have a team of diverse attributes."
       },
       "foes": [
        {
         "monster": "2390125",
         "level": 300,
         "multipliers": {
          "atk": 90,
          "def": 110,
          "hp": 400
         },
         "estimate": {
          "atk": 16596,
          "def": 15130,
          "hp": 939796
         }
        }
       ],
       "randomPassives": [
        "613241",
        "613242",
        "613243"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca trascendente",
      "en": "Transcendent Demonic Beast"
     },
     "color": "#FF007F",
     "title": {
      "it": "Eikthyrnir trascendente",
      "en": "Transcendent Eikthyrnir"
     },
     "floor": 4,
     "transcendent": true,
     "energy": 60,
     "firstClear": [],
     "clear": [
      {
       "id": "545109",
       "count": 1
      },
      {
       "id": "545110",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "6050109",
        "count": 1,
        "weight": 10
       },
       {
        "id": "6020047",
        "count": 1,
        "weight": 140
       },
       {
        "id": "545110",
        "count": 4,
        "weight": 900
       },
       {
        "id": "545110",
        "count": 2,
        "weight": 2500
       },
       {
        "id": "6040052",
        "count": 1,
        "weight": 250
       },
       {
        "id": "545110",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543213",
        "count": 15,
        "weight": 2350
       },
       {
        "id": "543214",
        "count": 15,
        "weight": 2350
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca usa [00D5FF]\"Pioggia intensa\"[-] ogni numero stabilito di turni per infliggere [00D5FF]Torrente[-] ai nemici. Tutti gli effetti [00D5FF]Torrente[-] sono rimossi quando il nemico usa una Mossa finale o subisce un colpo da [00D5FF]\"Stagno ghiacciato\"[-] della Bestia demoniaca.",
        "en": "The Demonic Beast uses [00D5FF]\"Splash Shower\"[-] every set number of turns to apply [00D5FF]Torrent[-] on enemies. All [00D5FF]Torrent[-] effects are removed when the enemy uses an Ultimate Move or when they are hit by the Demonic Beast's [00D5FF]\"Icy Pond\"[-]."
       },
       "foes": [
        {
         "monster": "2390411",
         "level": 400,
         "multipliers": {
          "atk": 125,
          "def": 150,
          "hp": 350
         },
         "estimate": {
          "atk": 25438,
          "def": 27682,
          "hp": 2566200
         }
        }
       ],
       "randomPassives": [
        "953520"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "All'inizio della battaglia, la Bestia demoniaca ottiene effetti [00D5FF]Riduzione Danni subiti[-] per gli attributi Forza, PS e Velocità. Attaccando [FFAE00]ripetutamente la Bestia demoniaca con lo stesso attributo,[-] l'effetto [FFAE00][00D5FF]Riduzione Danni subiti[-] collegato all'attributo che è in svantaggio contro l'attributo di chi attacca verrà rimosso[-].",
        "en": "At the start of the battle, the Demonic Beast gains [00D5FF]Damage Taken Decrease[-] effects for Strength, HP, and Speed attributes. When you [FFAE00]continuously attack the Demonic Beast with the same attribute[-], the [FFAE00][00D5FF]Damage Taken Decrease[-] effect related to the attribute that is weak against the attacker's attribute will be removed[-]."
       },
       "foes": [
        {
         "monster": "2390412",
         "level": 400,
         "multipliers": {
          "atk": 115,
          "def": 130,
          "hp": 335
         },
         "estimate": {
          "atk": 24378,
          "def": 25094,
          "hp": 2589885
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Attaccando la Bestia demoniaca un [FFAE00]determinato numero di volte usando lo stesso attributo[-], tutti i nemici ottengono [00D5FF]Protezione di Eikthyrnir[-]. I nemici con [00D5FF]Protezione di Eikthyrnir[-] [FFAE00]non subiscono danni dall'abilità [00D5FF]\"Raffica ardente\"[-] della Bestia demoniaca[-].",
        "en": "When the Demonic Beast is [FFAE00]attacked a certain number of times using the same attribute[-] all enemies gain [00D5FF]Eikthyrnir's Protection[-]. Enemies with [00D5FF]Eikthyrnir's Protection[-] [FFAE00]do not take damage from the Demonic Beast's [00D5FF]\"Fierce Rush\"[-] skill[-]."
       },
       "foes": [
        {
         "monster": "2390413",
         "level": 400,
         "multipliers": {
          "atk": 120,
          "def": 135,
          "hp": 350
         },
         "estimate": {
          "atk": 26431,
          "def": 27204,
          "hp": 2852500
         }
        }
       ],
       "randomPassives": [
        "953542",
        "953543"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "All'inizio della battaglia, la Bestia demoniaca ottiene [00D5FF]Immortalità[-] e [00D5FF]Difesa Attributo[-] contro tutti gli attributi. [FFAE00]1 effetto [00D5FF]Immortalità[-] viene rimosso quando subisce un attacco un certo numero di volte in una determinata sequenza di attributi[-]. La [00D5FF]Difesa Attributo[-] di ciascun attributo viene [FFAE00]rimossa quando i PS sono una certa quantità[-].",
        "en": "At the start of the battle, the Demonic Beast gains [00D5FF]Immortality[-] and [00D5FF]Attribute Defense[-] against all attributes. [FFAE00]1 [00D5FF]Immortality[-] effect is removed when it is attacked a certain number of times in a certain sequence of attributes[-]. The [00D5FF]Attribute Defense[-] of each attribute is [FFAE00]removed at certain amounts of HP[-]."
       },
       "foes": [
        {
         "monster": "2390414",
         "level": 400,
         "multipliers": {
          "atk": 125,
          "def": 140,
          "hp": 350
         },
         "estimate": {
          "atk": 28056,
          "def": 28840,
          "hp": 3135300
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    }
   ],
   "relics": [
    {
     "name": {
      "it": "Svalinn",
      "en": "Svalinn"
     },
     "heroes": [
      "1805001",
      "1805002"
     ]
    },
    {
     "name": {
      "it": "Spada lunga di Dainn",
      "en": "Dainn's Longsword"
     },
     "heroes": [
      "1303001"
     ]
    },
    {
     "name": {
      "it": "Lancia a doppio taglio dei Vanir",
      "en": "Double-edged Spear of the Vanir"
     },
     "heroes": [
      "1095001",
      "1095002",
      "1095003"
     ]
    },
    {
     "name": {
      "it": "Cuscino magico dei Vanir",
      "en": "Magic Cushion of the Vanir"
     },
     "heroes": [
      "1105001",
      "1105002",
      "1105003"
     ]
    },
    {
     "name": {
      "it": "Spada a una mano dei Vanir",
      "en": "One-handed Sword of the Vanir"
     },
     "heroes": [
      "1195001",
      "1195002",
      "1195003"
     ]
    },
    {
     "name": {
      "it": "Bastone magico dei Vanir",
      "en": "Magic Staff of the Vanir"
     },
     "heroes": [
      "1825001"
     ]
    },
    {
     "name": {
      "it": "Golem della battaglia degli Alfr",
      "en": "Alfr Battle Golem"
     },
     "heroes": [
      "1865001",
      "1865002"
     ]
    },
    {
     "name": {
      "it": "Braccialetto dello spirito degli Alfr",
      "en": "Alfr Spirit Bracelets"
     },
     "heroes": [
      "1878501",
      "1878502",
      "1878503"
     ]
    },
    {
     "name": {
      "it": "Guanto di Frigg",
      "en": "Frigg's Gauntlet"
     },
     "heroes": [
      "1815001",
      "1815002"
     ]
    },
    {
     "name": {
      "it": "Angurvadal",
      "en": "Angurvadal"
     },
     "heroes": [
      "1897501",
      "1897502"
     ]
    },
    {
     "name": {
      "it": "Bracciali Onde di Hvergelmir",
      "en": "Hvergelmir Wave Bracelets"
     },
     "heroes": [
      "1835001"
     ]
    },
    {
     "name": {
      "it": "Bracciali Rapide di Hvergelmir",
      "en": "Hvergelmir Rapids Bracelets"
     },
     "heroes": [
      "1908501"
     ]
    },
    {
     "name": {
      "it": "Guanti del vento di Njord",
      "en": "Njord's Wind Gauntlets"
     },
     "heroes": [
      "1845001"
     ]
    },
    {
     "name": {
      "it": "Guanti della tempesta di Njord",
      "en": "Njord's Storm Gloves"
     },
     "heroes": [
      "1845501",
      "1845502"
     ]
    },
    {
     "name": {
      "it": "Gullinbursti",
      "en": "Gullinbursti"
     },
     "heroes": [
      "1024001",
      "1024002"
     ]
    },
    {
     "name": {
      "it": "Gullinbursti",
      "en": "Gullinbursti"
     },
     "heroes": [
      "1425001",
      "1425002"
     ]
    },
    {
     "name": {
      "it": "Essenza di Yggdrasill",
      "en": "Essence of Yggdrasil"
     },
     "heroes": [
      "1034001"
     ]
    },
    {
     "name": {
      "it": "Essenza di Yggdrasill",
      "en": "Essence of Yggdrasil"
     },
     "heroes": [
      "1035001",
      "1035002",
      "1035003"
     ]
    },
    {
     "name": {
      "it": "Frusta per vegetazione di Nanna",
      "en": "Nanna's Verdure Whip"
     },
     "heroes": [
      "1907501",
      "1907502"
     ]
    },
    {
     "name": {
      "it": "Spada azzurra di Niflheim",
      "en": "Azure Sword of Niflheim"
     },
     "heroes": [
      "1881501",
      "1881502",
      "1881503"
     ]
    }
   ],
   "heroesOnly": [
    {
     "heroId": "1907501",
     "source": "unique",
     "passive": {
      "it": "Caccia programmata",
      "en": "Planned Hunt"
     }
    },
    {
     "heroId": "1907501",
     "source": "relic",
     "passive": {
      "it": "Frusta per vegetazione di Nanna",
      "en": "Nanna's Verdure Whip"
     }
    },
    {
     "heroId": "1907502",
     "source": "relic",
     "passive": {
      "it": "Frusta per vegetazione di Nanna",
      "en": "Nanna's Verdure Whip"
     }
    }
   ],
   "badBlood": [
    "1907501",
    "1907502"
   ]
  },
  {
   "key": "skoll-and-hati",
   "group": "103",
   "name": {
    "it": "Skoll e Hati",
    "en": "Skoll and Hati"
   },
   "power": 7000000,
   "image": true,
   "info": true,
   "material": "543209",
   "guaranteed": {
    "it": "Porta a termine il Piano 3 del Tempio del Crepuscolo per ricevere la ricompensa garantita.",
    "en": "Clear Twilight Temple Floor 3 to receive the guaranteed reward."
   },
   "floors": [
    {
     "name": {
      "it": "Bestia demoniaca",
      "en": "Demonic Beast"
     },
     "color": "#0093B0",
     "title": {
      "it": "1° piano Tempio del Crepuscolo",
      "en": "Twilight Temple Floor 1"
     },
     "floor": 1,
     "transcendent": false,
     "energy": 30,
     "firstClear": [
      {
       "id": "543209",
       "count": 1
      },
      {
       "id": "543217",
       "count": 2
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543217",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "6020051",
        "count": 1,
        "weight": 20
       },
       {
        "id": "6020052",
        "count": 1,
        "weight": 20
       },
       {
        "id": "543211",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543212",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543211",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543212",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543221",
        "count": 3,
        "weight": 1960
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Hati è debole e usa un Atteggiamento ogni 2 turni per proteggere Skoll. Le statistiche relative alla Difesa di Skoll aumentano notevolmente ogni 2 turni.",
        "en": "The demonic beasts are immune to Reflect damage. Hati is weak and uses a Stance every 2 turns to protect Skoll. Skoll's Defense-related stats greatly increase every 2 turns."
       },
       "foes": [
        {
         "monster": "2390126",
         "level": 100,
         "multipliers": {
          "atk": 340,
          "def": 180,
          "hp": 850
         },
         "estimate": null
        },
        {
         "monster": "2390127",
         "level": 100,
         "multipliers": {
          "atk": 340,
          "def": 180,
          "hp": 850
         },
         "estimate": {
          "atk": 20903,
          "def": 16065,
          "hp": 842775
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Skoll è debole e usa un Atteggiamento ogni 2 turni per proteggere Hati. L'attacco di Hati congela i nemici per interrompere l'uso dell'abilità.",
        "en": "The demonic beasts are immune to Reflect damage. Skoll is weak and uses a Stance every 2 turns to protect Hati. Hati's attack freezes enemies to interrupt skill use."
       },
       "foes": [
        {
         "monster": "2390128",
         "level": 100,
         "multipliers": {
          "atk": 300,
          "def": 180,
          "hp": 850
         },
         "estimate": {
          "atk": 20820,
          "def": 14639,
          "hp": 817530
         }
        },
        {
         "monster": "2390129",
         "level": 100,
         "multipliers": {
          "atk": 300,
          "def": 180,
          "hp": 850
         },
         "estimate": null
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Durante il crepuscolo, il giorno e la notte coesistono. Skoll applica Incendio e Hati applica vari Debuff a ogni turno. Inoltre, è fondamentale ricordare che queste bestie demoniache diventano incredibilmente forti in determinate condizioni.",
        "en": "The demonic beasts are immune to Reflect damage. Day and night coexist during twilight. Skoll applies Ignite and Hati applies various Debuffs every turn. Also, it is important to remember these demonic beasts become incredibly strong under certain conditions."
       },
       "foes": [
        {
         "monster": "2390130",
         "level": 100,
         "multipliers": {
          "atk": 240,
          "def": 210,
          "hp": 820
         },
         "estimate": {
          "atk": 14755,
          "def": 18742,
          "hp": 813030
         }
        },
        {
         "monster": "2390131",
         "level": 100,
         "multipliers": {
          "atk": 240,
          "def": 210,
          "hp": 820
         },
         "estimate": {
          "atk": 14496,
          "def": 17079,
          "hp": 788676
         }
        }
       ],
       "randomPassives": [
        "613311",
        "613312",
        "613313"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca superiore",
      "en": "Greater Demonic Beast"
     },
     "color": "#DF6100",
     "title": {
      "it": "2° piano Tempio del Crepuscolo",
      "en": "Twilight Temple Floor 2"
     },
     "floor": 2,
     "transcendent": false,
     "energy": 45,
     "firstClear": [
      {
       "id": "543209",
       "count": 2
      },
      {
       "id": "543217",
       "count": 4
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543217",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "6020051",
        "count": 1,
        "weight": 60
       },
       {
        "id": "6020052",
        "count": 1,
        "weight": 60
       },
       {
        "id": "543211",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543212",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543217",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543211",
        "count": 5,
        "weight": 1000
       },
       {
        "id": "543212",
        "count": 5,
        "weight": 1000
       },
       {
        "id": "543221",
        "count": 4,
        "weight": 1880
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Hati è debole e protegge Skoll ogni 2 turni con grande efficacia. Skoll applica Incendio a ogni turno e le sue statistiche relative alla Difesa aumentano notevolmente ogni 2 turni, perciò è fondamentale adattarsi a ogni situazione.",
        "en": "The demonic beasts are immune to Reflect damage. Hati is weak and protects Skoll every 2 turns with great efficiency. Skoll applies Ignite every turn and its Defense-related stats increase greatly every 2 turns, so it is crucial to adapt to each situation."
       },
       "foes": [
        {
         "monster": "2390132",
         "level": 200,
         "multipliers": {
          "atk": 185,
          "def": 220,
          "hp": 480
         },
         "estimate": null
        },
        {
         "monster": "2390133",
         "level": 200,
         "multipliers": {
          "atk": 185,
          "def": 220,
          "hp": 480
         },
         "estimate": {
          "atk": 21730,
          "def": 36135,
          "hp": 883920
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Skoll è debole e usa protegge Hati ogni 2 turni con grande efficacia. Hati applica vari Debuff a ogni turno e i suoi attacchi congelano i nemici per interrompere l'uso dell'abilità.",
        "en": "The demonic beasts are immune to Reflect damage. Skoll is weak and protects Hati every 2 turns with great efficiency. Hati applies various Debuffs every turn, and its attack freezes enemies to interrupt skill use."
       },
       "foes": [
        {
         "monster": "2390134",
         "level": 200,
         "multipliers": {
          "atk": 145,
          "def": 170,
          "hp": 500
         },
         "estimate": {
          "atk": 24534,
          "def": 26231,
          "hp": 890900
         }
        },
        {
         "monster": "2390135",
         "level": 200,
         "multipliers": {
          "atk": 145,
          "def": 170,
          "hp": 500
         },
         "estimate": null
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Durante il crepuscolo, il giorno e la notte coesistono. Skoll applica Incendio e Hati applica vari Debuff a ogni turno. Inoltre, è fondamentale ricordare che queste bestie demoniache usano degli schemi a cui è difficile adattarsi in determinate condizioni.",
        "en": "The demonic beasts are immune to Reflect damage. Day and night coexist during twilight. Skoll applies Ignite and Hati applies various Debuffs every turn. Also, it is important to remember these demonic beasts use patterns that are difficult to adapt to under certain conditions."
       },
       "foes": [
        {
         "monster": "2390136",
         "level": 200,
         "multipliers": {
          "atk": 140,
          "def": 155,
          "hp": 540
         },
         "estimate": {
          "atk": 15887,
          "def": 25459,
          "hp": 994410
         }
        },
        {
         "monster": "2390137",
         "level": 200,
         "multipliers": {
          "atk": 140,
          "def": 155,
          "hp": 540
         },
         "estimate": {
          "atk": 18116,
          "def": 22991,
          "hp": 962172
         }
        }
       ],
       "randomPassives": [
        "613315",
        "613316",
        "613317"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca definitiva",
      "en": "Ultimate Demonic Beast"
     },
     "color": "#E800CF",
     "title": {
      "it": "3° piano Tempio del Crepuscolo",
      "en": "Twilight Temple Floor 3"
     },
     "floor": 3,
     "transcendent": false,
     "energy": 60,
     "firstClear": [
      {
       "id": "543209",
       "count": 3
      },
      {
       "id": "543217",
       "count": 6
      }
     ],
     "clear": [
      {
       "id": "543209",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543217",
        "count": 3,
        "weight": 1500
       },
       {
        "id": "6020051",
        "count": 1,
        "weight": 100
       },
       {
        "id": "6020052",
        "count": 1,
        "weight": 100
       },
       {
        "id": "543211",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543212",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543217",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "543211",
        "count": 10,
        "weight": 500
       },
       {
        "id": "543212",
        "count": 10,
        "weight": 500
       },
       {
        "id": "543221",
        "count": 5,
        "weight": 1800
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Hati è debole e protegge Skoll alla perfezione ogni 3 turni. Skoll applica Incendio a ogni turno e le sue statistiche relative alla Difesa aumentano notevolmente ogni 2 turni, perciò è fondamentale adattarsi a ogni situazione.",
        "en": "The demonic beasts are immune to Reflect damage. Hati is weak and protects Skoll perfectly every 3 turns. Skoll applies Ignite every turn, and its Defense-related stats increase greatly every 2 turns, so it is crucial to adapt to each situation."
       },
       "foes": [
        {
         "monster": "2390138",
         "level": 300,
         "multipliers": {
          "atk": 145,
          "def": 110,
          "hp": 430
         },
         "estimate": null
        },
        {
         "monster": "2390139",
         "level": 300,
         "multipliers": {
          "atk": 145,
          "def": 110,
          "hp": 430
         },
         "estimate": {
          "atk": 24862,
          "def": 26318,
          "hp": 1157345
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Skoll è debole e usa protegge perfettamente Hati ogni 3 turni. Hati applica vari e potenti Debuff a ogni turno e i suoi attacchi congelano i nemici per infliggere gravi danni.",
        "en": "The demonic beasts are immune to Reflect damage. Skoll is weak and protects Hati perfectly every 3 turns. Hati applies various powerful Debuffs every turn, and its attack freezes enemies to deal great damage."
       },
       "foes": [
        {
         "monster": "2390140",
         "level": 300,
         "multipliers": {
          "atk": 110,
          "def": 120,
          "hp": 450
         },
         "estimate": {
          "atk": 27412,
          "def": 26916,
          "hp": 1170810
         }
        },
        {
         "monster": "2390141",
         "level": 300,
         "multipliers": {
          "atk": 110,
          "def": 120,
          "hp": 450
         },
         "estimate": null
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Le Bestie demoniache sono immuni ai danni Riflessione. Skoll è debole e usa protegge perfettamente Hati ogni 3 turni. Hati applica vari e potenti Debuff a ogni turno e i suoi attacchi congelano i nemici per infliggere gravi danni.",
        "en": "The demonic beasts are immune to Reflect damage. Skoll is weak and protects Hati perfectly every 3 turns. Hati applies various powerful Debuffs every turn, and its attack freezes enemies to deal great damage."
       },
       "foes": [
        {
         "monster": "2390142",
         "level": 300,
         "multipliers": {
          "atk": 120,
          "def": 130,
          "hp": 475
         },
         "estimate": {
          "atk": 19858,
          "def": 31102,
          "hp": 1278462
         }
        },
        {
         "monster": "2390143",
         "level": 300,
         "multipliers": {
          "atk": 120,
          "def": 130,
          "hp": 475
         },
         "estimate": {
          "atk": 22728,
          "def": 27993,
          "hp": 1235855
         }
        }
       ],
       "randomPassives": [
        "613319",
        "613320",
        "613321"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca trascendente",
      "en": "Transcendent Demonic Beast"
     },
     "color": "#FF007F",
     "title": {
      "it": "Skoll e Hati trascendenti",
      "en": "Transcendent Skoll and Hati"
     },
     "floor": 4,
     "transcendent": true,
     "energy": 60,
     "firstClear": [],
     "clear": [
      {
       "id": "545111",
       "count": 1
      },
      {
       "id": "545112",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "6050109",
        "count": 1,
        "weight": 10
       },
       {
        "id": "6020051",
        "count": 1,
        "weight": 70
       },
       {
        "id": "6020052",
        "count": 1,
        "weight": 70
       },
       {
        "id": "545112",
        "count": 4,
        "weight": 900
       },
       {
        "id": "545112",
        "count": 2,
        "weight": 2500
       },
       {
        "id": "6040052",
        "count": 1,
        "weight": 250
       },
       {
        "id": "545112",
        "count": 1,
        "weight": 1500
       },
       {
        "id": "543211",
        "count": 15,
        "weight": 2350
       },
       {
        "id": "543212",
        "count": 15,
        "weight": 2350
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "Il Debuff [00D5FF]Onda lunare[-] di Hati applica [00D5FF]Stordimento[-] al bersaglio per immobilizzarlo per [FFAE00]2 turni[-] quando raggiunge [FFAE00]5 accumuli[-]",
        "en": "Hati's [00D5FF]Moonwave[-] Debuff [00D5FF]Stuns[-] the target to incapacitate them for [FFAE00]2 turns[-] when stacked [FFAE00]5 times[-]."
       },
       "foes": [
        {
         "monster": "2390421",
         "level": 400,
         "multipliers": {
          "atk": 130,
          "def": 125,
          "hp": 450
         },
         "estimate": null
        },
        {
         "monster": "2390422",
         "level": 400,
         "multipliers": {
          "atk": 130,
          "def": 125,
          "hp": 450
         },
         "estimate": {
          "atk": 30088,
          "def": 39281,
          "hp": 3312900
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "Il Debuff [00D5FF]Onda solare[-] di Skoll infligge una quantità letale di [FFAE00]1.000.000[-] di danni fissi quando raggiunge [FFAE00]5 accumuli[-].",
        "en": "Skoll's [00D5FF]Sunwave[-] Debuff inflicts a deadly fixed damage of [FFAE00]1,000,000[-] when stacked [FFAE00]5 times[-]."
       },
       "foes": [
        {
         "monster": "2390423",
         "level": 400,
         "multipliers": {
          "atk": 100,
          "def": 135,
          "hp": 470
         },
         "estimate": {
          "atk": 31125,
          "def": 37037,
          "hp": 3272610
         }
        },
        {
         "monster": "2390424",
         "level": 400,
         "multipliers": {
          "atk": 100,
          "def": 135,
          "hp": 470
         },
         "estimate": null
        }
       ],
       "randomPassives": [
        "613316",
        "953542"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "All'inizio della battaglia, Skoll e Hati ottengono il Buff [00D5FF]Sopprimi Danni Subiti[-], che viene [FFAE00]rimosso quando i nemici ricevono il Buff [00D5FF]Luce dell'alba[-][-]. [00D5FF]Luce dell'alba[-] viene concesso ai nemici che possiedono sia il Buff [00D5FF]Luce solare[-] sia il Buff [00D5FF]Luce lunare[-], assegnati al [FFAE00]verificarsi di determinate condizioni[-].",
        "en": "At the start of the battle, Skoll and Hati are granted the [00D5FF]Suppress Damage Taken[-] Buff, which is [FFAE00]removed when enemies receive the [00D5FF]Light of Dawn[-] Buff[-]. [00D5FF]Light of Dawn[-] is granted to enemies who have both the [00D5FF]Sunlight[-] and [00D5FF]Moonlight[-] Buffs, which are given [FFAE00]when certain conditions are met[-]."
       },
       "foes": [
        {
         "monster": "2390425",
         "level": 400,
         "multipliers": {
          "atk": 110,
          "def": 140,
          "hp": 500
         },
         "estimate": {
          "atk": 29848,
          "def": 39806,
          "hp": 4090000
         }
        },
        {
         "monster": "2390426",
         "level": 400,
         "multipliers": {
          "atk": 110,
          "def": 140,
          "hp": 500
         },
         "estimate": {
          "atk": 25460,
          "def": 45392,
          "hp": 4289500
         }
        }
       ],
       "randomPassives": [
        "613234",
        "613211"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    }
   ],
   "relics": [
    {
     "name": {
      "it": "Essenza di Thrymheim",
      "en": "Essence of Thrymheim"
     },
     "heroes": [
      "1906501",
      "1906502",
      "1906503"
     ]
    },
    {
     "name": {
      "it": "Guanti di Mundilfari",
      "en": "Mundilfari's Gloves"
     },
     "heroes": [
      "1545001",
      "1545002",
      "1545003"
     ]
    },
    {
     "name": {
      "it": "Guanti della galassia di Ginnungagap",
      "en": "Ginnungagap's Galaxy Gloves"
     },
     "heroes": [
      "1055001",
      "1055002",
      "1055003",
      "1055004"
     ]
    },
    {
     "name": {
      "it": "Guanti della nebula di Ginnungagap",
      "en": "Ginnungagap's Nebula Gloves"
     },
     "heroes": [
      "1056501",
      "1056502",
      "1056503"
     ]
    },
    {
     "name": {
      "it": "Guanti della Terra di Jord",
      "en": "Jord's Earth Gauntlets"
     },
     "heroes": [
      "1415001",
      "1415002",
      "1415003"
     ]
    },
    {
     "name": {
      "it": "Lama del risentimento di Kvasir",
      "en": "Kvasir's Blade of Resentment"
     },
     "heroes": [
      "1892501"
     ]
    },
    {
     "name": {
      "it": "Bastone runico di Kon",
      "en": "Kon's Rune Staff"
     },
     "heroes": [
      "1893501",
      "1893502",
      "1893503"
     ]
    },
    {
     "name": {
      "it": "Spade gemelle di Ymir",
      "en": "Ymir's Dual Swords"
     },
     "heroes": [
      "1898501"
     ]
    },
    {
     "name": {
      "it": "Dente di Garmr",
      "en": "Garmr's Tooth"
     },
     "heroes": [
      "1879501"
     ]
    },
    {
     "name": {
      "it": "Corno di Tanngnjostr",
      "en": "Tanngnjostr's Horn"
     },
     "heroes": [
      "1896501",
      "1896502",
      "1896503"
     ]
    },
    {
     "name": {
      "it": "Lancia a spirale infuocata di Surtr",
      "en": "Surtr's Flaming Helix Spear"
     },
     "heroes": [
      "1866501",
      "1866502",
      "1866503"
     ]
    },
    {
     "name": {
      "it": "Fodero avaro di Geri",
      "en": "Geri's Greedy Sheath"
     },
     "heroes": [
      "1685501",
      "1685502",
      "1685503"
     ]
    },
    {
     "name": {
      "it": "Spada Aurora dell'estremo Nord",
      "en": "Aurora Sword of the Far North"
     },
     "heroes": [
      "1725001",
      "1725002",
      "1725003"
     ]
    },
    {
     "name": {
      "it": "Lancia di Gunnthra",
      "en": "Spear of Gunnthra"
     },
     "heroes": [
      "1535001",
      "1535002"
     ]
    },
    {
     "name": {
      "it": "Orecchino di cote di Hrungnir",
      "en": "Hrungnir's Whetstone Earring"
     },
     "heroes": [
      "1795001",
      "1795002"
     ]
    },
    {
     "name": {
      "it": "Spada ghiacciata di Thiazi",
      "en": "Thiazi's Frozen Sword"
     },
     "heroes": [
      "1184001",
      "1184002"
     ]
    },
    {
     "name": {
      "it": "Spada ghiacciata di Thiazi",
      "en": "Thiazi's Frozen Sword"
     },
     "heroes": [
      "1185001",
      "1185002",
      "1185003"
     ]
    },
    {
     "name": {
      "it": "Zanna di Gullinbursti",
      "en": "Gullinbursti's Tusk"
     },
     "heroes": [
      "1945501"
     ]
    }
   ],
   "heroesOnly": [
    {
     "heroId": "1896501",
     "source": "relic",
     "passive": {
      "it": "Corno di Tanngnjostr",
      "en": "Tanngnjostr's Horn"
     }
    },
    {
     "heroId": "1896502",
     "source": "unique",
     "passive": {
      "it": "Mani della salvezza",
      "en": "Hands of Salvation"
     }
    },
    {
     "heroId": "1896502",
     "source": "relic",
     "passive": {
      "it": "Corno di Tanngnjostr",
      "en": "Tanngnjostr's Horn"
     }
    },
    {
     "heroId": "1896503",
     "source": "unique",
     "passive": {
      "it": "Mercenaria del crepuscolo",
      "en": "Twilight Mercenary"
     }
    },
    {
     "heroId": "1896503",
     "source": "relic",
     "passive": {
      "it": "Corno di Tanngnjostr",
      "en": "Tanngnjostr's Horn"
     }
    }
   ],
   "badBlood": [
    "1896501",
    "1896502",
    "1896503"
   ]
  },
  {
   "key": "nidhoggr",
   "group": "104",
   "name": {
    "it": "Nidhoggr",
    "en": "Nidhoggr"
   },
   "power": 10000000,
   "image": true,
   "info": true,
   "material": "543210",
   "guaranteed": {
    "it": "Porta a termine il Piano 3 della Nave dei Morti Naglfar per ricevere la ricompensa garantita.",
    "en": "Clear Corpse Farer Naglfar Floor 3 to receive the guaranteed reward."
   },
   "floors": [
    {
     "name": {
      "it": "Bestia demoniaca",
      "en": "Demonic Beast"
     },
     "color": "#0093B0",
     "title": {
      "it": "1° Piano Nave dei Morti Naglfar",
      "en": "Corpse Farer Naglfar Floor 1"
     },
     "floor": 1,
     "transcendent": false,
     "energy": 30,
     "firstClear": [
      {
       "id": "543210",
       "count": 1
      },
      {
       "id": "543218",
       "count": 2
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543218",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "6020066",
        "count": 1,
        "weight": 20
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543212",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543214",
        "count": 2,
        "weight": 1990
       },
       {
        "id": "543212",
        "count": 2,
        "weight": 1990
       },
       {
        "id": "543220",
        "count": 3,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione e usa un'abilità che applica un Debuff sui nemici. Infligge danni Punto debole, perciò è importante usare abilità che rimuovono i Debuff.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a skill which applies a Debuff on enemies. It deals Weak Point damage, so it is important to use skills which remove Debuffs."
       },
       "foes": [
        {
         "monster": "2390144",
         "level": 100,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 19099,
          "def": 13099,
          "hp": 780099
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione ma subisce danni aggiuntivi dalle abilità Annulla Atteggiamento. Disattiva gli effetti delle abilità di tutti i nemici, perciò è importante usare abilità che rimuovono i Debuff.",
        "en": "The Demonic Beast is immune to Reflect damage but takes increased damage from Stance Cancel skills. It disables skills effects of all enemies, so a hero who can remove Debuffs is required."
       },
       "foes": [
        {
         "monster": "2390145",
         "level": 100,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 19099,
          "def": 14099,
          "hp": 900099
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione e usa un'abilità che Debuff ai nemici. Infligge danni Rovina, perciò è importante usare abilità che rimuovono i Debuff. La Bestia demoniaca diventa più forte quando i suoi PS raggiungono una determinata soglia. L'effetto Immortalità può essere rimosso svuotando la barra dell'Immortalità.",
        "en": "The Demonic Beast is immune to Reflect damage and uses a skill which applies a Debuff on enemies. It deals Ruin damage, so it is important to use skills which remove Debuffs. The Demonic Beast strengthens itself when its HP reaches a certain threshold. The Immortality effect can be removed by fully depleting the Immortality Gauge."
       },
       "foes": [
        {
         "monster": "2390146",
         "level": 100,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 21099,
          "def": 14099,
          "hp": 800099
         }
        }
       ],
       "randomPassives": [
        "901401",
        "901402",
        "901403"
       ],
       "gauge": {
        "name": {
         "it": "Rimuovi Immortalità",
         "en": "Remove Immortality"
        },
        "text": {
         "it": "Svuota completamente la barra per rimuovere l'effetto Immortalità della Bestia demoniaca!",
         "en": "Fully deplete the gauge to remove the demonic beast's immortality effect!"
        }
       },
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca superiore",
      "en": "Greater Demonic Beast"
     },
     "color": "#DF6100",
     "title": {
      "it": "2° Piano Nave dei Morti Naglfar",
      "en": "Corpse Farer Naglfar Floor 2"
     },
     "floor": 2,
     "transcendent": false,
     "energy": 45,
     "firstClear": [
      {
       "id": "543210",
       "count": 2
      },
      {
       "id": "543218",
       "count": 4
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543218",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "6020066",
        "count": 1,
        "weight": 60
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543212",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543218",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 970
       },
       {
        "id": "543212",
        "count": 5,
        "weight": 970
       },
       {
        "id": "543220",
        "count": 4,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione e recupera PS quando subisci danni dalle spore. Diventa più forte quando il suo effetto Immortalità viene rimosso.",
        "en": "The Demonic Beast is immune to Reflect damage and recovers HP when taking damage from Spores. It becomes stronger when its Immortality effect is removed."
       },
       "foes": [
        {
         "monster": "2390147",
         "level": 200,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 19199,
          "def": 13199,
          "hp": 870199
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione e applica Debuff su tutti i nemici se il suo Buff viene rimosso infliggendo danni con determinati attacchi. Ricorda: la Bestia demoniaca può diventare più forte in determinate circostanze.",
        "en": "The Demonic Beast is immune to Reflect damage, and it applies Debuffs on all enemies if its Buff is removed by inflicting damage with certain attacks. Note that the Demonic Beast can strengthen itself under certain conditions."
       },
       "foes": [
        {
         "monster": "2390148",
         "level": 200,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 21199,
          "def": 14199,
          "hp": 1200199
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione. Diventa più forte a ogni turno e la sua barra si riempie o si riduce in base ai suoi PS rimanenti. L'effetto Immortalità può essere rimosso svuotando completamente la barra dell'Immortalità.",
        "en": "The Demonic Beast is immune to Reflect damage. The Demonic Beast strengthens itself every turn, and its gauge fills or depletes based on its remaining HP. The Immortality effect can be removed by fully depleting the Immortality Gauge."
       },
       "foes": [
        {
         "monster": "2390149",
         "level": 200,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 21199,
          "def": 14199,
          "hp": 1350199
         }
        }
       ],
       "randomPassives": [
        "901404",
        "901405",
        "901406"
       ],
       "gauge": {
        "name": {
         "it": "Rimuovi Immortalità",
         "en": "Remove Immortality"
        },
        "text": {
         "it": "Svuota completamente la barra per rimuovere l'effetto Immortalità della Bestia demoniaca!",
         "en": "Fully deplete the gauge to remove the demonic beast's immortality effect!"
        }
       },
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca definitiva",
      "en": "Ultimate Demonic Beast"
     },
     "color": "#E800CF",
     "title": {
      "it": "3° Piano Nave dei Morti Naglfar",
      "en": "Corpse Farer Naglfar Floor 3"
     },
     "floor": 3,
     "transcendent": false,
     "energy": 60,
     "firstClear": [
      {
       "id": "543210",
       "count": 3
      },
      {
       "id": "543218",
       "count": 6
      }
     ],
     "clear": [
      {
       "id": "543210",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543218",
        "count": 3,
        "weight": 1500
       },
       {
        "id": "6020066",
        "count": 1,
        "weight": 100
       },
       {
        "id": "543214",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543212",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543218",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 450
       },
       {
        "id": "543212",
        "count": 10,
        "weight": 450
       },
       {
        "id": "543220",
        "count": 5,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione e la sua barra si riempie all'inizio di ogni turno. È possibile svuotare la barra infliggendo danni alla Bestia demoniaca usando le abilità. La Bestia demoniaca può recuperare più della sua barra in certe situazioni e compromette l'uso delle abilità da parte dei nemici.",
        "en": "The Demonic Beast is immune to Reflect damage, and its gauge fills at the start of every turn. The gauge can be depleted by dealing damage to the Demonic Beast using skills. The Demonic Beast restores more of its gauge in certain situations, and it also disrupts enemy skill use."
       },
       "foes": [
        {
         "monster": "2390150",
         "level": 300,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 23299,
          "def": 13299,
          "hp": 1000299
         }
        }
       ],
       "randomPassives": [],
       "gauge": {
        "name": {
         "it": "Rimuovi Immortalità",
         "en": "Remove Immortality"
        },
        "text": {
         "it": "Svuota completamente la barra per rimuovere l'effetto Immortalità della Bestia demoniaca!",
         "en": "Fully deplete the gauge to remove the demonic beast's immortality effect!"
        }
       },
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione e la sua barra si riempie in determinate circostanze. Tuttavia, la barra può svuotarsi considerevolmente in determinate circostanze applicate.",
        "en": "The Demonic Beast is immune to Reflect damage, and its gauge fills under certain conditions. However, the gauge can be greatly depleted under certain applied conditions."
       },
       "foes": [
        {
         "monster": "2390151",
         "level": 300,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 19299,
          "def": 14299,
          "hp": 1300299
         }
        }
       ],
       "randomPassives": [],
       "gauge": {
        "name": {
         "it": "Rimuovi Immortalità",
         "en": "Remove Immortality"
        },
        "text": {
         "it": "Svuota completamente la barra per rimuovere l'effetto Immortalità della Bestia demoniaca!",
         "en": "Fully deplete the gauge to remove the demonic beast's immortality effect!"
        }
       },
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca è immune ai danni Riflessione e la sua barra si riempie o si svuota in determinate circostanze. Inoltre, la Bestia demoniaca diventa considerevolmente più forte dopo un determinato numero di turni, quindi è meglio eliminarla in fretta.",
        "en": "The Demonic Beast is immune to Reflect damage, and its gauge fills or depletes under certain conditions. In addition, the Demonic Beast strengthens itself greatly after a certain number of turns, so you must take it down quickly."
       },
       "foes": [
        {
         "monster": "2390152",
         "level": 300,
         "multipliers": {
          "atk": 100,
          "def": 100,
          "hp": 100
         },
         "estimate": {
          "atk": 20799,
          "def": 15299,
          "hp": 2000299
         }
        }
       ],
       "randomPassives": [
        "901407",
        "901408",
        "901409"
       ],
       "gauge": {
        "name": {
         "it": "Rimuovi Immortalità",
         "en": "Remove Immortality"
        },
        "text": {
         "it": "Svuota completamente la barra per rimuovere l'effetto Immortalità della Bestia demoniaca!",
         "en": "Fully deplete the gauge to remove the demonic beast's immortality effect!"
        }
       },
       "surtr": null,
       "turnLimit": null
      }
     ]
    }
   ],
   "relics": [
    {
     "name": {
      "it": "Spada maledetta di Gunnthra",
      "en": "Cursed Sword of Gunnthra"
     },
     "heroes": [
      "1555001",
      "1555002"
     ]
    },
    {
     "name": {
      "it": "Oscurità di Gunnthra",
      "en": "Gunnthra's Darkness"
     },
     "heroes": [
      "1515001",
      "1515002",
      "1515003"
     ]
    },
    {
     "name": {
      "it": "Spada lacerante di Gunnthra",
      "en": "Tearing Sword of Gunnthra"
     },
     "heroes": [
      "1595001",
      "1595002"
     ]
    },
    {
     "name": {
      "it": "Immagine residua di Hati",
      "en": "Hati's Afterimage"
     },
     "heroes": [
      "1929501",
      "1929502",
      "1929503"
     ]
    },
    {
     "name": {
      "it": "Antica spada frammentata di Narfi",
      "en": "Narfi's Ancient Fragmented Sword"
     },
     "heroes": [
      "1595501"
     ]
    },
    {
     "name": {
      "it": "Spada Spirito di Gunnthra",
      "en": "Spirit Sword of Gunnthra"
     },
     "heroes": [
      "1880501",
      "1880502"
     ]
    },
    {
     "name": {
      "it": "Fodero magico di Fafnir",
      "en": "Fafnir's Magic Scabbard"
     },
     "heroes": [
      "1395001",
      "1395002"
     ]
    },
    {
     "name": {
      "it": "Martello ghiacciato di Nastrond",
      "en": "Nastrond's Ice Hammer"
     },
     "heroes": [
      "1057501",
      "1057502"
     ]
    },
    {
     "name": {
      "it": "Bracciale di Ask ed Embla",
      "en": "Ask and Embla's Bracelets"
     },
     "heroes": [
      "1030501"
     ]
    },
    {
     "name": {
      "it": "Chiave degli Dei Vanir",
      "en": "Key of the Vanir Gods"
     },
     "heroes": [
      "1913501",
      "1913502"
     ]
    },
    {
     "name": {
      "it": "Artiglio di Garmr",
      "en": "Garmr's Claw"
     },
     "heroes": [
      "1585501",
      "1585502"
     ]
    },
    {
     "name": {
      "it": "Sega dell'avidità",
      "en": "Saw Blade of Greed"
     },
     "heroes": [
      "1931501",
      "1931502"
     ]
    },
    {
     "name": {
      "it": "Fuoco di Nastrond",
      "en": "Nastrond's Flame"
     },
     "heroes": [
      "1525001",
      "1525002"
     ]
    },
    {
     "name": {
      "it": "Cubo di Ginnungagap",
      "en": "Cube of Ginnungagap"
     },
     "heroes": [
      "1135501",
      "1135502"
     ]
    }
   ],
   "heroesOnly": [
    {
     "heroId": "1897502",
     "source": "unique",
     "passive": {
      "it": "Solidarietà delle Dee",
      "en": "Solidarity of Goddesses"
     }
    },
    {
     "heroId": "1929501",
     "source": "relic",
     "passive": {
      "it": "Immagine residua di Hati",
      "en": "Hati's Afterimage"
     }
    },
    {
     "heroId": "1929502",
     "source": "relic",
     "passive": {
      "it": "Immagine residua di Hati",
      "en": "Hati's Afterimage"
     }
    },
    {
     "heroId": "1929503",
     "source": "relic",
     "passive": {
      "it": "Immagine residua di Hati",
      "en": "Hati's Afterimage"
     }
    }
   ],
   "badBlood": []
  },
  {
   "key": "ratatoskr",
   "group": "108",
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "power": 12000000,
   "image": true,
   "info": true,
   "material": "543222",
   "guaranteed": {
    "it": "Porta a termine il Piano 3 del Nascondiglio dei combinaguai per ricevere la ricompensa garantita.",
    "en": "Clear Troublemaker's Hideout Floor 3 to receive the guaranteed reward."
   },
   "floors": [
    {
     "name": {
      "it": "Bestia demoniaca",
      "en": "Demonic Beast"
     },
     "color": "#0093B0",
     "title": {
      "it": "Nascondiglio dei combinaguai Piano 1",
      "en": "Troublemaker's Hideout Floor 1"
     },
     "floor": 1,
     "transcendent": false,
     "energy": 30,
     "firstClear": [
      {
       "id": "543222",
       "count": 1
      },
      {
       "id": "543223",
       "count": 2
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543223",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543213",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543211",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543211",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543213",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543221",
        "count": 3,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è [FFAE00]immune a tutti i Debuff tranne[-] [00D5FF]Shock, Avvelenamento e Sanguinamento[-], e [FFAE00]si sposta in diverse posizioni a seconda dei tipi di Debuff applicati a essa[-]. Inoltre, la Bestia demoniaca usa un [FFAE00]potente Debuff[-] sui suoi nemici [FFAE00]durante i turni in cui non si sposta[-], perciò è fondamentale spostarla per tutta la durata della battaglia.",
        "en": "The Demonic Beast is [FFAE00]immune to all Debuffs except[-] [00D5FF]Shock, Poison, and Bleed[-], and it [FFAE00]moves to different locations depending on the types of Debuffs applied to it[-]. In addition, the Demonic Beast uses a [FFAE00]powerful Debuff[-] on its enemies [FFAE00]during turns it doesn't move[-], so you must continue to make it move throughout the battle."
       },
       "foes": [
        {
         "monster": "2490101",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 20818,
          "def": 6024,
          "hp": 1238790
         }
        },
        {
         "monster": "2490011",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1748250
         }
        },
        {
         "monster": "2490012",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1716750
         }
        },
        {
         "monster": "2490013",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1716750
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "[FFAE00]Alcuni dispositivi di legno applicano [00D5FF]Miglioramenti demoniaci[-] sulla Bestia demoniaca quando subisce danni da un'abilità[-]. Un [FFAE00]potente Buff[-] viene applicato alla Bestia demoniaca con l'[FFAE00]accumulo[-] di sufficienti [00D5FF]Miglioramenti demoniaci[-].",
        "en": "[FFAE00]Certain Wooden Devices apply [00D5FF]Demonic Enhancements[-] on the Demonic Beast when it takes damage from skills[-]. A [FFAE00]powerful Buff[-] is applied to the Demonic Beast when enough [00D5FF]Demonic Enhancements[-] have [FFAE00]stacked[-]."
       },
       "foes": [
        {
         "monster": "2490102",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 20818,
          "def": 5864,
          "hp": 1238790
         }
        },
        {
         "monster": "2490014",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1874250
         }
        },
        {
         "monster": "2490015",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1874250
         }
        },
        {
         "monster": "2490016",
         "level": 100,
         "multipliers": {
          "atk": 280,
          "def": 80,
          "hp": 1050
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1874250
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca applica un Buff [00D5FF]Riduzione danni finali[-] su di sé all'inizio della battaglia. Il Buff viene rimosso quando la Bestia demoniaca si [FFAE00]è spostata su ciascun dispositivo di legno una volta.[-] Inoltre, la prima volta che [FFAE00]un dispositivo di legno raggiunge i 0 PS o la Bestia demoniaca si sposta su un dispositivo di legno[-], questo [FFAE00]applica un Buff o un Debuff[-] sulla Bestia demoniaca.",
        "en": "The Demonic Beast applies a [00D5FF]Final Damage Decrease[-] Buff on itself at the start of the battle. The Buff is removed when the Demonic Beast has [FFAE00]moved to each Wooden Device once[-]. In addition, the first time [FFAE00]a Wooden Device reaches 0 HP or the Demonic Beast moves to a Wooden Device[-], it [FFAE00]applies a Buff or Debuff[-] on the Demonic Beast."
       },
       "foes": [
        {
         "monster": "2490103",
         "level": 100,
         "multipliers": {
          "atk": 290,
          "def": 80,
          "hp": 1000
         },
         "estimate": {
          "atk": 21562,
          "def": 5864,
          "hp": 1179800
         }
        },
        {
         "monster": "2490017",
         "level": 100,
         "multipliers": {
          "atk": 290,
          "def": 80,
          "hp": 1000
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 912000
         }
        },
        {
         "monster": "2490018",
         "level": 100,
         "multipliers": {
          "atk": 290,
          "def": 80,
          "hp": 1000
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1605000
         }
        },
        {
         "monster": "2490019",
         "level": 100,
         "multipliers": {
          "atk": 290,
          "def": 80,
          "hp": 1000
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1605000
         }
        }
       ],
       "randomPassives": [
        "951580",
        "951581"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca superiore",
      "en": "Greater Demonic Beast"
     },
     "color": "#DF6100",
     "title": {
      "it": "Nascondiglio dei combinaguai Piano 2",
      "en": "Troublemaker's Hideout Floor 2"
     },
     "floor": 2,
     "transcendent": false,
     "energy": 45,
     "firstClear": [
      {
       "id": "543222",
       "count": 2
      },
      {
       "id": "543223",
       "count": 4
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543223",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "543213",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543211",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543223",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543213",
        "count": 5,
        "weight": 1000
       },
       {
        "id": "543211",
        "count": 5,
        "weight": 1000
       },
       {
        "id": "543221",
        "count": 4,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è [FFAE00]immune a tutti i Debuff tranne [00D5FF]Shock, Avvelenamento e Sanguinamento[-][-], e [FFAE00]si sposta in diverse posizioni a seconda dei tipi di Debuff applicati a essa[-]. Inoltre, [FFAE00]se il nemico non ha un effetto [00D5FF]Avvelenamento da cibo[-] quando la Bestia demoniaca usa \"Velocità della luce\", applica un potente Debuff[-].",
        "en": "The Demonic Beast is [FFAE00]immune to all Debuffs except [00D5FF]Shock, Poison, and Bleed[-][-], and it [FFAE00]moves to different locations depending on the types of Debuffs applied to it[-]. In addition, [FFAE00]if the enemy does not have a [00D5FF]Food Poisoning[-] effect when the Demonic Beast uses \"Lightning Speed,\" it applies a powerful Debuff[-]."
       },
       "foes": [
        {
         "monster": "2490201",
         "level": 200,
         "multipliers": {
          "atk": 140,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 20066,
          "def": 12978,
          "hp": 1427370
         }
        },
        {
         "monster": "2490021",
         "level": 100,
         "multipliers": {
          "atk": 140,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 892200
         }
        },
        {
         "monster": "2490022",
         "level": 100,
         "multipliers": {
          "atk": 140,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 963000
         }
        },
        {
         "monster": "2490023",
         "level": 100,
         "multipliers": {
          "atk": 140,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 963000
         }
        }
       ],
       "randomPassives": [
        "951582",
        "951583"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca [00D5FF]lascia il campo di battaglia[-] dopo un numero di turni prestabilito, poi riappare nel turno successivo sulla posizione di un dispositivo di legno a caso. Se il dispositivo di legno ha un effetto [00D5FF]Contrassegno[-], applica un Buff sui nemici. Se non ha un effetto Contrassegno, applica un Buff sulla Bestia demoniaca.",
        "en": "The Demonic Beast [00D5FF]leaves the battlefield[-] every set number of turns, then reappears on the next turn in the location of a random Wooden Device. If the Wooden Device has a [00D5FF]Mark[-] effect, it applies a Buff on enemies. If it does not have a Mark effect, it applies a Buff on the Demonic Beast."
       },
       "foes": [
        {
         "monster": "2490202",
         "level": 200,
         "multipliers": {
          "atk": 200,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 28666,
          "def": 12818,
          "hp": 1546318
         }
        },
        {
         "monster": "2490024",
         "level": 100,
         "multipliers": {
          "atk": 200,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1082250
         }
        },
        {
         "monster": "2490025",
         "level": 100,
         "multipliers": {
          "atk": 200,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 914550
         }
        },
        {
         "monster": "2490026",
         "level": 100,
         "multipliers": {
          "atk": 200,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 914550
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca guadagna un [FFAE00]potente Buff[-] all'inizio della battaglia. Il Buff viene [FFAE00]rimosso quando un determinato dispositivo di legno raggiunge i 0 PS[-]. Inoltre, la Bestia demoniaca [00D5FF]lascia il campo di battaglia[-] quando i suoi PS scendono al di sotto di una certa soglia, poi riappare nel turno successivo nella posizione di un dispositivo di legno a caso. Se il dispositivo di legno ha un effetto [00D5FF]Contrassegno[-], applica un Buff sui nemici. Se non ha un effetto Contrassegno, applica un Buff sulla Bestia demoniaca.",
        "en": "The Demonic Beast gains a [FFAE00]powerful Buff[-] at the start of the battle. The Buff is [FFAE00]removed when a certain Wooden Device reaches 0 HP[-]. In addition, the Demonic Beast [00D5FF]leaves the battlefield[-] when its HP drops below a certain threshold, then reappears in the next turn at the location of a random Wooden Device. If the Wooden Device has a [00D5FF]Mark[-] effect, it applies a Buff on enemies. If it does not have a Mark effect, it applies a Buff on the Demonic Beast."
       },
       "foes": [
        {
         "monster": "2490203",
         "level": 200,
         "multipliers": {
          "atk": 220,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 31533,
          "def": 12818,
          "hp": 1665265
         }
        },
        {
         "monster": "2490027",
         "level": 100,
         "multipliers": {
          "atk": 220,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1144500
         }
        },
        {
         "monster": "2490028",
         "level": 100,
         "multipliers": {
          "atk": 220,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 970900
         }
        },
        {
         "monster": "2490029",
         "level": 100,
         "multipliers": {
          "atk": 220,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 777000
         }
        }
       ],
       "randomPassives": [
        "951584",
        "951585"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca definitiva",
      "en": "Ultimate Demonic Beast"
     },
     "color": "#E800CF",
     "title": {
      "it": "Nascondiglio dei combinaguai Piano 3",
      "en": "Troublemaker's Hideout Floor 3"
     },
     "floor": 3,
     "transcendent": false,
     "energy": 60,
     "firstClear": [
      {
       "id": "543222",
       "count": 3
      },
      {
       "id": "543223",
       "count": 6
      }
     ],
     "clear": [
      {
       "id": "543222",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543223",
        "count": 3,
        "weight": 1500
       },
       {
        "id": "543213",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543211",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543223",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "543213",
        "count": 10,
        "weight": 500
       },
       {
        "id": "543211",
        "count": 10,
        "weight": 500
       },
       {
        "id": "543221",
        "count": 5,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La Bestia demoniaca è [FFAE00]immune a tutti i Debuff tranne[-] [00D5FF]Shock, Avvelenamento e Sanguinamento[-], e [FFAE00]si sposta in diverse posizioni a seconda del numero di Debuff applicati a essa[-]. Se la Bestia demoniaca [FFAE00]non si sposta per un determinato numero di turni o se si sposta sullo stesso dispositivo di legno un determinato numero di volte[-], [FFAE00]applica un potente Debuff[-] sulla Bestia demoniaca o sul nemico a seconda del dispositivo di legno.",
        "en": "The Demonic Beast is [FFAE00]immune to all Debuffs except[-] [00D5FF]Shock, Poison, and Bleed[-], and it [FFAE00]moves to different locations depending on the number of Debuffs applied to it[-]. If the Demonic Beast [FFAE00]does not move for a certain number of turns, or if it moves to the same Wooden Device a certain number of times[-], it [FFAE00]applies a powerful Debuff[-] on the Demonic Beast or the enemy depending on the Wooden Device."
       },
       "foes": [
        {
         "monster": "2490301",
         "level": 300,
         "multipliers": {
          "atk": 95,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 21686,
          "def": 19298,
          "hp": 2102370
         }
        },
        {
         "monster": "2490031",
         "level": 100,
         "multipliers": {
          "atk": 95,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1320000
         }
        },
        {
         "monster": "2490032",
         "level": 100,
         "multipliers": {
          "atk": 95,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1368000
         }
        },
        {
         "monster": "2490033",
         "level": 100,
         "multipliers": {
          "atk": 95,
          "def": 80,
          "hp": 600
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1296000
         }
        }
       ],
       "randomPassives": [
        "951586",
        "951587"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "[00D5FF]Se la Bestia demoniaca non si sposta su altre posizioni[-] per un determinato numero turni, [00D5FF]applica un Buff o un Debuff[-] su di sé a seconda del dispositivo di legno su cui si trova.",
        "en": "[00D5FF]If the Demonic Beast doesn't move locations[-] for a certain number of turns, it [00D5FF]applies a Buff or Debuff[-] on itself depending on the Wooden Device it is at."
       },
       "foes": [
        {
         "monster": "2490302",
         "level": 300,
         "multipliers": {
          "atk": 100,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 22827,
          "def": 19138,
          "hp": 2277568
         }
        },
        {
         "monster": "2490034",
         "level": 100,
         "multipliers": {
          "atk": 100,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1430000
         }
        },
        {
         "monster": "2490035",
         "level": 100,
         "multipliers": {
          "atk": 100,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1404000
         }
        },
        {
         "monster": "2490036",
         "level": 100,
         "multipliers": {
          "atk": 100,
          "def": 80,
          "hp": 650
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1482000
         }
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      },
      {
       "description": {
        "it": "La Bestia demoniaca applica molti effetti [00D5FF]Immortalità[-] su di sé all'inizio della battaglia. L'[00D5FF]Immortalità[-] viene rimossa se il nemico [FFAE00]rispetta determinati requisiti[-] e la [FFAE00]Bestia demoniaca resta su un certo dispositivo di legno per un determinato numero di turni[-].",
        "en": "The Demonic Beast applies many [00D5FF]Immortality[-] effects on itself at the start of the battle. [00D5FF]Immortality[-] is removed if the enemy [FFAE00]meets certain conditions[-] and the [FFAE00]Demonic Beast remains with a certain Wooden Device for a certain number of turns[-]."
       },
       "foes": [
        {
         "monster": "2490303",
         "level": 300,
         "multipliers": {
          "atk": 110,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 25110,
          "def": 19138,
          "hp": 2452765
         }
        },
        {
         "monster": "2490037",
         "level": 100,
         "multipliers": {
          "atk": 110,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1540000
         }
        },
        {
         "monster": "2490038",
         "level": 100,
         "multipliers": {
          "atk": 110,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1596000
         }
        },
        {
         "monster": "2490039",
         "level": 100,
         "multipliers": {
          "atk": 110,
          "def": 80,
          "hp": 700
         },
         "estimate": {
          "atk": 0,
          "def": 8962,
          "hp": 1526000
         }
        }
       ],
       "randomPassives": [
        "951588",
        "951589"
       ],
       "gauge": null,
       "surtr": null,
       "turnLimit": null
      }
     ]
    }
   ],
   "relics": [
    {
     "name": {
      "it": "Guantoni dello Spirito di Fafnir",
      "en": "Fafnir's Spirit Gauntlets"
     },
     "heroes": [
      "1930501"
     ]
    },
    {
     "name": {
      "it": "Spadone corrotto di Surtr",
      "en": "Surtr's Corrupted Greatsword"
     },
     "heroes": [
      "1010501"
     ]
    },
    {
     "name": {
      "it": "Guantoni di Modgudr",
      "en": "Modgudr's Gauntlet"
     },
     "heroes": [
      "1575001",
      "1575002",
      "1575003"
     ]
    },
    {
     "name": {
      "it": "Guantoni di magma di Surtr",
      "en": "Surtr's Magma Gauntlets"
     },
     "heroes": [
      "1715001",
      "1715002",
      "1715003"
     ]
    },
    {
     "name": {
      "it": "Chiave di Eljudnir",
      "en": "Key of Eljudnir"
     },
     "heroes": [
      "1943501"
     ]
    },
    {
     "name": {
      "it": "Lancia della verità di Syn",
      "en": "Syn's Spear of Truth"
     },
     "heroes": [
      "1505001",
      "1505002"
     ]
    },
    {
     "name": {
      "it": "Decorazione Piuma d'ala di Hraesvelgr",
      "en": "Hraesvelgr's Wing Feather Decoration"
     },
     "heroes": [
      "1944501",
      "1944502"
     ]
    },
    {
     "name": {
      "it": "Spada maledetta di Fafnir",
      "en": "Fafnir's Cursed Sword"
     },
     "heroes": [
      "1936501"
     ]
    },
    {
     "name": {
      "it": "Radice di Yggdrasil",
      "en": "Roots of Yggdrasil"
     },
     "heroes": [
      "1933501",
      "1933502"
     ]
    },
    {
     "name": {
      "it": "Guanti runici di Freyr",
      "en": "Freyr's Runestone Gauntlets"
     },
     "heroes": [
      "1919501"
     ]
    },
    {
     "name": {
      "it": "Bastone delle ali di Nidhoggr",
      "en": "Nidhoggr Wing Staff"
     },
     "heroes": [
      "1911501"
     ]
    },
    {
     "name": {
      "it": "Ascia antica di Jord",
      "en": "Jord's Ancient Axe"
     },
     "heroes": [
      "1961501"
     ]
    },
    {
     "name": {
      "it": "Segnale per Valaskjalf",
      "en": "Beacon to Valaskjalf"
     },
     "heroes": [
      "1934501",
      "1934502"
     ]
    },
    {
     "name": {
      "it": "Fiamme primordiali di Muspell",
      "en": "Primordial Flames of Muspell"
     },
     "heroes": [
      "1935501",
      "1935502"
     ]
    },
    {
     "name": {
      "it": "Vento per vegetazione di Nanna",
      "en": "Nanna's Verdure Wind"
     },
     "heroes": [
      "1967501",
      "1967502"
     ]
    },
    {
     "name": {
      "it": "Decorazione del serpente oscuro di Hvergelmir",
      "en": "Hvergelmir's Dark Snake Decoration"
     },
     "heroes": [
      "1950501"
     ]
    },
    {
     "name": {
      "it": "Occhio penetrante del Guardiano",
      "en": "Watcher's Piercing Eye"
     },
     "heroes": [
      "1958501"
     ]
    },
    {
     "name": {
      "it": "Pugnale caotico degli Elivagar",
      "en": "Chaos Dagger of Elivagar"
     },
     "heroes": [
      "1585001",
      "1585002"
     ]
    },
    {
     "name": {
      "it": "Spada delle piante rampicanti di Yggdrasil",
      "en": "Yggdrasil Vine Sword"
     },
     "heroes": [
      "1955501"
     ]
    }
   ],
   "heroesOnly": [
    {
     "heroId": "1907502",
     "source": "unique",
     "passive": {
      "it": "Inizia la caccia",
      "en": "Beginning the Hunt"
     }
    }
   ],
   "badBlood": []
  },
  {
   "key": "surtr-and-the-primordial-flame",
   "group": "109",
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
   },
   "power": null,
   "image": true,
   "info": true,
   "material": "543244",
   "guaranteed": {
    "it": "Porta a termine il Piano 3 della Sala della genesi per ricevere la ricompensa garantita.",
    "en": "Clear Hall of Genesis Floor 3 to receive the guaranteed reward."
   },
   "floors": [
    {
     "name": {
      "it": "Bestia demoniaca",
      "en": "Demonic Beast"
     },
     "color": "#0093B0",
     "title": {
      "it": "Sala della genesi Piano 1",
      "en": "Hall of Genesis Floor 1"
     },
     "floor": 1,
     "transcendent": false,
     "energy": 30,
     "firstClear": [
      {
       "id": "543244",
       "count": 1
      },
      {
       "id": "543245",
       "count": 2
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543245",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543213",
        "count": 5,
        "weight": 1500
       },
       {
        "id": "543214",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543213",
        "count": 2,
        "weight": 2000
       },
       {
        "id": "543220",
        "count": 3,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "La bestia demoniaca usa \"Incantesimo di Kenaz\" e, se non riesci a contrastarlo con il tipo di abilità indicato, subirai Surriscaldamento o Scioglimento. Contrattaccando con il tipo di abilità corrispondente, si attiva un incantesimo runico.",
        "en": "The demonic beast uses \"Spell of Kenaz,\" and if you fail to counter with the displayed skill type, you'll be afflicted with Overheat or Melt. Countering with the matching skill type activates a Rune Spell."
       },
       "foes": [
        {
         "monster": "2390427",
         "level": 200,
         "multipliers": {
          "atk": 340,
          "def": 350,
          "hp": 1800
         },
         "estimate": {
          "atk": 30454,
          "def": 32742,
          "hp": 5284800
         },
         "extraPassives": [
          "956701",
          "956831",
          "956832",
          "956711",
          "956712",
          "956775",
          "956715",
          "956718",
          "956748",
          "956726",
          "956729",
          "956736",
          "956738",
          "956751",
          "956754",
          "956755"
         ]
        }
       ],
       "randomPassives": [
        "956851",
        "956852",
        "956853"
       ],
       "gauge": null,
       "surtr": {
        "laevateinn": [],
        "kenaz": [
         {
          "it": "Attacco",
          "en": "Attack"
         },
         {
          "it": "Buff",
          "en": "Buff"
         },
         {
          "it": "Debuff",
          "en": "Debuff"
         },
         {
          "it": "Recupero",
          "en": "Recovery"
         },
         {
          "it": "Atteggiamento",
          "en": "Stance"
         }
        ],
        "kenazPenalty": {
         "it": "Se usi un [00D5FF]tipo di abilità diverso[-] da quello dello slot abilità, \"Incantesimo di Kenaz\" infligge danni [00D5FF]Fiammata di Muspell[-] e [00D5FF]Giudizio ardente[-], [00D5FF]rimuove Buff e Atteggiamenti[-] e applica [00D5FF]Esplosione[-].",
         "en": "If you use a [00D5FF]skill type different[-] from the skill slot, \"Spell of Kenaz\" inflicts [00D5FF]Burning Judgment[-] and [00D5FF]Muspell Blaze[-] damage, [00D5FF]removes Buffs and Stances[-], and applies an [00D5FF]Explosion[-]."
        },
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 1
         }
        ]
       },
       "turnLimit": null
      },
      {
       "description": {
        "it": "La bestia demoniaca usa \"Laevateinn\", infliggendo danni con un effetto aggiuntivo diverso a seconda del tipo di abilità utilizzato contro di essa. Gli incantesimi runici non si attivano contro \"Laevateinn\".",
        "en": "The demonic beast uses \"Laevateinn,\" dealing damage with a different added effect depending on the skill type used against it. Rune Spells do not activate against \"Laevateinn.\""
       },
       "foes": [
        {
         "monster": "2390428",
         "level": 200,
         "multipliers": {
          "atk": 370,
          "def": 320,
          "hp": 2000
         },
         "estimate": {
          "atk": 39401,
          "def": 38218,
          "hp": 7066000
         },
         "extraPassives": [
          "956701",
          "956833",
          "956834",
          "956711",
          "956712",
          "956775",
          "956715",
          "956718",
          "956748",
          "956726",
          "956730",
          "956736",
          "956739",
          "956752",
          "956754",
          "956755"
         ]
        }
       ],
       "randomPassives": [
        "956854",
        "956855",
        "956856"
       ],
       "gauge": null,
       "surtr": {
        "laevateinn": [
         {
          "type": {
           "it": "Attacco",
           "en": "Attack"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Attacco[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Annulla Atteggiamento e Buff[-].",
           "en": "Facing \"Laevateinn\" with an [ff6347]Attack Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Buff and Stance Cancel[-] to it."
          }
         },
         {
          "type": {
           "it": "Buff",
           "en": "Buff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Buff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Blocco Effetto Abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Buff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Skill Effect Block[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Debuff",
           "en": "Debuff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Debuff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e [00D5FF]annulli gli Atteggiamenti[-], e aggiunge ad essa [00D5FF]Stordimento[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Debuff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and [00D5FF]cancel Stances[-], and adds [00D5FF]Stun[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Recupero",
           "en": "Recovery"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Recupero[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Infezione[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Recovery Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Infect[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Atteggiamento",
           "en": "Stance"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Atteggiamento[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Disabilita ogni abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Stance Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]All Skill Disable[-] to it for [FFAE00]1 turn[-]."
          }
         }
        ],
        "kenaz": [],
        "kenazPenalty": null,
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 1
         }
        ]
       },
       "turnLimit": null
      },
      {
       "description": {
        "it": "Se il limite di turni viene superato, il tipo di abilità necessario per contrastare \"Incantesimo di Kenaz\" non sarà più visibile.",
        "en": "If the turn limit is exceeded, the skill type needed to counter \"Spell of Kenaz\" will no longer be visible."
       },
       "foes": [
        {
         "monster": "2390429",
         "level": 200,
         "multipliers": {
          "atk": 390,
          "def": 380,
          "hp": 2000
         },
         "estimate": {
          "atk": 40755,
          "def": 36309,
          "hp": 7524000
         },
         "extraPassives": [
          "956701",
          "956835",
          "956836",
          "956771",
          "956712",
          "956773",
          "956775",
          "956715",
          "956718",
          "956748",
          "956726",
          "956731",
          "956737",
          "956738",
          "956753",
          "956754",
          "956755"
         ]
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": {
        "laevateinn": [],
        "kenaz": [
         {
          "it": "Attacco",
          "en": "Attack"
         },
         {
          "it": "Buff",
          "en": "Buff"
         },
         {
          "it": "Debuff",
          "en": "Debuff"
         },
         {
          "it": "Recupero",
          "en": "Recovery"
         },
         {
          "it": "Atteggiamento",
          "en": "Stance"
         }
        ],
        "kenazPenalty": {
         "it": "Se usi un [00D5FF]tipo di abilità diverso[-] da quello dello slot abilità, \"Incantesimo di Kenaz\" infligge danni [00D5FF]Fiammata di Muspell[-] e [00D5FF]Giudizio ardente[-], [00D5FF]rimuove Buff e Atteggiamenti[-] e applica [00D5FF]Esplosione[-].",
         "en": "If you use a [00D5FF]skill type different[-] from the skill slot, \"Spell of Kenaz\" inflicts [00D5FF]Burning Judgment[-] and [00D5FF]Muspell Blaze[-] damage, [00D5FF]removes Buffs and Stances[-], and applies an [00D5FF]Explosion[-]."
        },
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 1
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 1
         }
        ]
       },
       "turnLimit": 5
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca superiore",
      "en": "Greater Demonic Beast"
     },
     "color": "#DF6100",
     "title": {
      "it": "Sala della genesi Piano 2",
      "en": "Hall of Genesis Floor 2"
     },
     "floor": 2,
     "transcendent": false,
     "energy": 45,
     "firstClear": [
      {
       "id": "543244",
       "count": 2
      },
      {
       "id": "543245",
       "count": 4
      }
     ],
     "clear": [],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543245",
        "count": 2,
        "weight": 1000
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543213",
        "count": 10,
        "weight": 2000
       },
       {
        "id": "543245",
        "count": 1,
        "weight": 1000
       },
       {
        "id": "543214",
        "count": 5,
        "weight": 1000
       },
       {
        "id": "543213",
        "count": 5,
        "weight": 1000
       },
       {
        "id": "543220",
        "count": 4,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "L'Atteggiamento difensivo usato dalla bestia demoniaca riduce i danni subiti, facendo durare più a lungo la battaglia se non puoi usare un'abilità Annulla Atteggiamento. In tal caso, dovrai prestare attenzione all'accumulo di Scioglimento.",
        "en": "The defensive stance the demonic beast uses decreases damage taken, causing the battle to drag on if you can't use a Stance Cancel skill. In such cases, you'll need to watch out for the Melt buildup."
       },
       "foes": [
        {
         "monster": "2390430",
         "level": 250,
         "multipliers": {
          "atk": 280,
          "def": 370,
          "hp": 1750
         },
         "estimate": {
          "atk": 31100,
          "def": 42938,
          "hp": 6363000
         },
         "extraPassives": [
          "956701",
          "956837",
          "956838",
          "956771",
          "956712",
          "956776",
          "956715",
          "956718",
          "956748",
          "956726",
          "956729",
          "956736",
          "956738",
          "956751",
          "956756",
          "956757"
         ]
        }
       ],
       "randomPassives": [
        "956857",
        "956858",
        "956859"
       ],
       "gauge": null,
       "surtr": {
        "laevateinn": [
         {
          "type": {
           "it": "Attacco",
           "en": "Attack"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Attacco[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Annulla Atteggiamento e Buff[-].",
           "en": "Facing \"Laevateinn\" with an [ff6347]Attack Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Buff and Stance Cancel[-] to it."
          }
         },
         {
          "type": {
           "it": "Buff",
           "en": "Buff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Buff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Blocco Effetto Abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Buff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Skill Effect Block[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Debuff",
           "en": "Debuff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Debuff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e [00D5FF]annulli gli Atteggiamenti[-], e aggiunge ad essa [00D5FF]Stordimento[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Debuff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and [00D5FF]cancel Stances[-], and adds [00D5FF]Stun[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Recupero",
           "en": "Recovery"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Recupero[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Infezione[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Recovery Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Infect[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Atteggiamento",
           "en": "Stance"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Atteggiamento[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Disabilita ogni abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Stance Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]All Skill Disable[-] to it for [FFAE00]1 turn[-]."
          }
         }
        ],
        "kenaz": [],
        "kenazPenalty": null,
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 2
         }
        ]
       },
       "turnLimit": null
      },
      {
       "description": {
        "it": "Se il limite di turni viene superato, la penalità di \"Incantesimo di Kenaz\" viene trasferita alla fase successiva, quindi dovrai prestare attenzione anche ai danni che infliggi alla bestia demoniaca. Il suo Atteggiamento difensivo è più potente rispetto alla fase precedente, rendendo particolarmente utili le abilità Annulla Atteggiamento.",
        "en": "If the turn limit is exceeded, the penalty from \"Spell of Kenaz\" carries over into the next phase, so you'll need to pay attention to the damage you deal to the demonic beast as well. Its defensive stance is stronger than in the previous phase, making Stance Cancel skills useful here."
       },
       "foes": [
        {
         "monster": "2390431",
         "level": 250,
         "multipliers": {
          "atk": 300,
          "def": 380,
          "hp": 1750
         },
         "estimate": {
          "atk": 39597,
          "def": 56213,
          "hp": 7670250
         },
         "extraPassives": [
          "956701",
          "956839",
          "956840",
          "956771",
          "956712",
          "956776",
          "956764",
          "956715",
          "956718",
          "956748",
          "956726",
          "956730",
          "956736",
          "956739",
          "956752",
          "956756",
          "956757"
         ]
        }
       ],
       "randomPassives": [
        "956860",
        "956861",
        "956862"
       ],
       "gauge": null,
       "surtr": {
        "laevateinn": [],
        "kenaz": [
         {
          "it": "Attacco",
          "en": "Attack"
         },
         {
          "it": "Buff",
          "en": "Buff"
         },
         {
          "it": "Debuff",
          "en": "Debuff"
         },
         {
          "it": "Recupero",
          "en": "Recovery"
         },
         {
          "it": "Atteggiamento",
          "en": "Stance"
         }
        ],
        "kenazPenalty": {
         "it": "Se usi un [00D5FF]tipo di abilità diverso[-] da quello dello slot abilità, \"Incantesimo di Kenaz\" infligge danni [00D5FF]Fiammata di Muspell[-] e [00D5FF]Giudizio ardente[-], [00D5FF]rimuove Buff e Atteggiamenti[-] e applica [00D5FF]Esplosione[-].",
         "en": "If you use a [00D5FF]skill type different[-] from the skill slot, \"Spell of Kenaz\" inflicts [00D5FF]Burning Judgment[-] and [00D5FF]Muspell Blaze[-] damage, [00D5FF]removes Buffs and Stances[-], and applies an [00D5FF]Explosion[-]."
        },
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 2
         }
        ]
       },
       "turnLimit": 5
      },
      {
       "description": {
        "it": "La bestia demoniaca utilizza sia \"Laevateinn\" sia \"Incantesimo di Kenaz\". È necessaria una strategia che sfrutti correttamente gli incantesimi runici, facendo attenzione a non permettere l'accumulo di Surriscaldamento e Scioglimento.",
        "en": "The demonic beast uses both \"Laevateinn\" and \"Spell of Kenaz.\" A strategy that makes proper use of Rune Spells is needed, while being careful not to let Overheat and Melt stack up."
       },
       "foes": [
        {
         "monster": "2390432",
         "level": 250,
         "multipliers": {
          "atk": 320,
          "def": 400,
          "hp": 1800
         },
         "estimate": {
          "atk": 41440,
          "def": 47220,
          "hp": 8391600
         },
         "extraPassives": [
          "956701",
          "956841",
          "956771",
          "956712",
          "956776",
          "956715",
          "956718",
          "956748",
          "956726",
          "956731",
          "956737",
          "956738",
          "956753",
          "956769",
          "956770"
         ]
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": {
        "laevateinn": [
         {
          "type": {
           "it": "Attacco",
           "en": "Attack"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Attacco[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Annulla Atteggiamento e Buff[-].",
           "en": "Facing \"Laevateinn\" with an [ff6347]Attack Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Buff and Stance Cancel[-] to it."
          }
         },
         {
          "type": {
           "it": "Buff",
           "en": "Buff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Buff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Blocco Effetto Abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Buff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Skill Effect Block[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Debuff",
           "en": "Debuff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Debuff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e [00D5FF]annulli gli Atteggiamenti[-], e aggiunge ad essa [00D5FF]Stordimento[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Debuff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and [00D5FF]cancel Stances[-], and adds [00D5FF]Stun[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Recupero",
           "en": "Recovery"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Recupero[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Infezione[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Recovery Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Infect[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Atteggiamento",
           "en": "Stance"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Atteggiamento[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Disabilita ogni abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Stance Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]All Skill Disable[-] to it for [FFAE00]1 turn[-]."
          }
         }
        ],
        "kenaz": [
         {
          "it": "Attacco",
          "en": "Attack"
         },
         {
          "it": "Buff",
          "en": "Buff"
         },
         {
          "it": "Debuff",
          "en": "Debuff"
         },
         {
          "it": "Recupero",
          "en": "Recovery"
         },
         {
          "it": "Atteggiamento",
          "en": "Stance"
         }
        ],
        "kenazPenalty": {
         "it": "Se usi un [00D5FF]tipo di abilità diverso[-] da quello dello slot abilità, \"Incantesimo di Kenaz\" infligge danni [00D5FF]Fiammata di Muspell[-] e [00D5FF]Giudizio ardente[-], [00D5FF]rimuove Buff e Atteggiamenti[-] e applica [00D5FF]Esplosione[-].",
         "en": "If you use a [00D5FF]skill type different[-] from the skill slot, \"Spell of Kenaz\" inflicts [00D5FF]Burning Judgment[-] and [00D5FF]Muspell Blaze[-] damage, [00D5FF]removes Buffs and Stances[-], and applies an [00D5FF]Explosion[-]."
        },
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 2
         }
        ]
       },
       "turnLimit": 4
      }
     ]
    },
    {
     "name": {
      "it": "Bestia demoniaca definitiva",
      "en": "Ultimate Demonic Beast"
     },
     "color": "#E800CF",
     "title": {
      "it": "Sala della genesi Piano 3",
      "en": "Hall of Genesis Floor 3"
     },
     "floor": 3,
     "transcendent": false,
     "energy": 60,
     "firstClear": [
      {
       "id": "543244",
       "count": 3
      },
      {
       "id": "543245",
       "count": 6
      }
     ],
     "clear": [
      {
       "id": "543244",
       "count": 1
      }
     ],
     "drops": {
      "draws": 3,
      "entries": [
       {
        "id": "543245",
        "count": 3,
        "weight": 1500
       },
       {
        "id": "543214",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543213",
        "count": 15,
        "weight": 2000
       },
       {
        "id": "543245",
        "count": 2,
        "weight": 1500
       },
       {
        "id": "543214",
        "count": 10,
        "weight": 500
       },
       {
        "id": "543213",
        "count": 10,
        "weight": 500
       },
       {
        "id": "543220",
        "count": 5,
        "weight": 2000
       }
      ]
     },
     "phases": [
      {
       "description": {
        "it": "I danni Contrattacco della bestia demoniaca hanno l'effetto Surriscaldamento, quindi, se non riesci a rispondere a \"Incantesimo di Kenaz\", i danni inflitti aumenteranno.",
        "en": "The demonic beast's counter damage has Overheat added to it, so if you fail to respond to \"Spell of Kenaz,\" the damage dealt will be amplified."
       },
       "foes": [
        {
         "monster": "2390433",
         "level": 300,
         "multipliers": {
          "atk": 290,
          "def": 370,
          "hp": 1750
         },
         "estimate": {
          "atk": 38445,
          "def": 51264,
          "hp": 7588000
         },
         "extraPassives": [
          "956701",
          "956842",
          "956843",
          "956771",
          "956712",
          "956774",
          "956776",
          "956715",
          "956718",
          "956748",
          "956726",
          "956729",
          "956736",
          "956738",
          "956751",
          "956769",
          "956770",
          "956777"
         ]
        }
       ],
       "randomPassives": [
        "956863",
        "956864",
        "956865"
       ],
       "gauge": null,
       "surtr": {
        "laevateinn": [],
        "kenaz": [
         {
          "it": "Attacco",
          "en": "Attack"
         },
         {
          "it": "Buff",
          "en": "Buff"
         },
         {
          "it": "Debuff",
          "en": "Debuff"
         },
         {
          "it": "Recupero",
          "en": "Recovery"
         },
         {
          "it": "Atteggiamento",
          "en": "Stance"
         }
        ],
        "kenazPenalty": {
         "it": "Se usi un [00D5FF]tipo di abilità diverso[-] da quello dello slot abilità, \"Incantesimo di Kenaz\" infligge danni [00D5FF]Fiammata di Muspell[-] e [00D5FF]Giudizio ardente[-], [00D5FF]rimuove Buff e Atteggiamenti[-] e applica [00D5FF]Esplosione[-].",
         "en": "If you use a [00D5FF]skill type different[-] from the skill slot, \"Spell of Kenaz\" inflicts [00D5FF]Burning Judgment[-] and [00D5FF]Muspell Blaze[-] damage, [00D5FF]removes Buffs and Stances[-], and applies an [00D5FF]Explosion[-]."
        },
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 2
         }
        ]
       },
       "turnLimit": 4
      },
      {
       "description": {
        "it": "Se hai ricevuto la penalità \"Incantesimo di Kenaz\" nella fase precedente, dovrai completare questa fase entro il limite di turni per accedere alla fase finale senza alcuna penalità.",
        "en": "If you received the \"Spell of Kenaz\" penalty in the previous phase, you'll need to clear this phase within the turn limit in order to enter the final phase without any penalty."
       },
       "foes": [
        {
         "monster": "2390434",
         "level": 300,
         "multipliers": {
          "atk": 290,
          "def": 380,
          "hp": 1750
         },
         "estimate": {
          "atk": 45672,
          "def": 67043,
          "hp": 9157750
         },
         "extraPassives": [
          "956701",
          "956844",
          "956771",
          "956712",
          "956774",
          "956776",
          "956715",
          "956718",
          "956748",
          "956726",
          "956730",
          "956736",
          "956739",
          "956752",
          "956769",
          "956770",
          "956777"
         ]
        }
       ],
       "randomPassives": [
        "956866",
        "956867",
        "956868"
       ],
       "gauge": null,
       "surtr": {
        "laevateinn": [
         {
          "type": {
           "it": "Attacco",
           "en": "Attack"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Attacco[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Annulla Atteggiamento e Buff[-].",
           "en": "Facing \"Laevateinn\" with an [ff6347]Attack Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Buff and Stance Cancel[-] to it."
          }
         },
         {
          "type": {
           "it": "Buff",
           "en": "Buff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Buff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Blocco Effetto Abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Buff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Skill Effect Block[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Debuff",
           "en": "Debuff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Debuff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e [00D5FF]annulli gli Atteggiamenti[-], e aggiunge ad essa [00D5FF]Stordimento[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Debuff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and [00D5FF]cancel Stances[-], and adds [00D5FF]Stun[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Recupero",
           "en": "Recovery"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Recupero[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Infezione[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Recovery Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]Infect[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Atteggiamento",
           "en": "Stance"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Atteggiamento[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Disabilita ogni abilità[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Stance Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds [00D5FF]All Skill Disable[-] to it for [FFAE00]1 turn[-]."
          }
         }
        ],
        "kenaz": [
         {
          "it": "Attacco",
          "en": "Attack"
         },
         {
          "it": "Buff",
          "en": "Buff"
         },
         {
          "it": "Debuff",
          "en": "Debuff"
         },
         {
          "it": "Recupero",
          "en": "Recovery"
         },
         {
          "it": "Atteggiamento",
          "en": "Stance"
         }
        ],
        "kenazPenalty": {
         "it": "Se usi un [00D5FF]tipo di abilità diverso[-] da quello dello slot abilità, \"Incantesimo di Kenaz\" infligge danni [00D5FF]Fiammata di Muspell[-] e [00D5FF]Giudizio ardente[-], [00D5FF]rimuove Buff e Atteggiamenti[-] e applica [00D5FF]Esplosione[-].",
         "en": "If you use a [00D5FF]skill type different[-] from the skill slot, \"Spell of Kenaz\" inflicts [00D5FF]Burning Judgment[-] and [00D5FF]Muspell Blaze[-] damage, [00D5FF]removes Buffs and Stances[-], and applies an [00D5FF]Explosion[-]."
        },
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 2
         }
        ]
       },
       "turnLimit": 5
      },
      {
       "description": {
        "it": "La bestia demoniaca usa \"Laevateinn\" e \"Incantesimo di Kenaz\" per un totale di 3 volte in un turno. La bestia demoniaca recupera PS quando subisce danni superiori alla quantità di danni che può ricevere con un singolo attacco, quindi dovrai prestare molta attenzione per mantenere in vita i tuoi alleati e calcolare i danni inflitti.",
        "en": "The demonic beast uses \"Laevateinn\" and \"Spell of Kenaz\" a total of 3 times in one turn. The demonic beast recovers HP when it takes damage exceeding the amount it can receive in a single attack, so you must play close attention to keep your allies in the fight and calculate the damage dealt."
       },
       "foes": [
        {
         "monster": "2390435",
         "level": 300,
         "multipliers": {
          "atk": 300,
          "def": 400,
          "hp": 1850
         },
         "estimate": {
          "atk": 46350,
          "def": 56220,
          "hp": 10289700
         },
         "extraPassives": [
          "956701",
          "956845",
          "956771",
          "956712",
          "956774",
          "956776",
          "956764",
          "956715",
          "956718",
          "956748",
          "956726",
          "956731",
          "956737",
          "956738",
          "956753",
          "956769",
          "956770",
          "956777"
         ]
        }
       ],
       "randomPassives": [],
       "gauge": null,
       "surtr": {
        "laevateinn": [
         {
          "type": {
           "it": "Attacco",
           "en": "Attack"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Attacco[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa un effetto che [00D5FF]rimuove Buff e Atteggiamenti[-] dai nemici e che riduce le loro [00D5FF]Barre Mossa finale[-] di [FFAE00]1 sfera[-].",
           "en": "Facing \"Laevateinn\" with an [ff6347]Attack Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage, and adds an effect which [00D5FF]removes Buffs and Stances[-] from enemies and decreases their [00D5FF]Ultimate Move Gauges[-] by [FFAE00]1 orb[-]."
          }
         },
         {
          "type": {
           "it": "Buff",
           "en": "Buff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Buff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Blocco Effetto Abilità[-] e [00D5FF]Ossidazione[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Buff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage, and adds [00D5FF]Skill Effect Block[-] and [00D5FF]Oxidize[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Debuff",
           "en": "Debuff"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Debuff[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e [00D5FF]annulli gli Atteggiamenti[-], e aggiunge ad essa [00D5FF]Stordimento[-] e [00D5FF]Riduzione Rango[-] Abilità per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Debuff Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and [00D5FF]cancel Stances[-], and adds [00D5FF]Stun[-] and Skill [00D5FF]Rank Decrease[-] to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Recupero",
           "en": "Recovery"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Recupero[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge ad essa [00D5FF]Infezione[-] e Aumento [00D5FF]Danni subiti[-] del [FFAE00]50%[-] per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Recovery Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage, and adds [00D5FF]Infect[-] and [FFAE00]50%[-] [00D5FF]Damage Taken[-] Increase to it for [FFAE00]1 turn[-]."
          }
         },
         {
          "type": {
           "it": "Atteggiamento",
           "en": "Stance"
          },
          "effect": {
           "it": "Affrontare \"Laevateinn\" con un'[ff6347]Abilità Atteggiamento[-] fa sì che \"Laevateinn\" di Surtr infligga danni [00D5FF]Giudizio ardente[-] e aggiunge l'effetto [00D5FF]Disabilita ogni abilità[-] e [00D5FF]Riduzione Difesa del [FFAE00]20%[-][-] ad essa per [FFAE00]1 turno[-].",
           "en": "Facing \"Laevateinn\" with a [ff6347]Stance Skill[-] causes Surtr's \"Laevateinn\" to inflict [00D5FF]Burning Judgment[-] damage and adds the [00D5FF]All Skill Disable[-] effect and [00D5FF][FFAE00]20%[-] Defense Decrease[-] to it for [FFAE00]1 turn[-]."
          }
         }
        ],
        "kenaz": [
         {
          "it": "Attacco",
          "en": "Attack"
         },
         {
          "it": "Buff",
          "en": "Buff"
         },
         {
          "it": "Debuff",
          "en": "Debuff"
         },
         {
          "it": "Recupero",
          "en": "Recovery"
         },
         {
          "it": "Atteggiamento",
          "en": "Stance"
         }
        ],
        "kenazPenalty": {
         "it": "Se usi un [00D5FF]tipo di abilità diverso[-] da quello dello slot abilità, \"Incantesimo di Kenaz\" infligge danni [00D5FF]Fiammata di Muspell[-] e [00D5FF]Giudizio ardente[-], [00D5FF]rimuove Buff e Atteggiamenti[-], applica [00D5FF]Esplosione[-], poi converte le istanze attive di [00D5FF]Incendio[-] in effetti [00D5FF]Esplosione[-].",
         "en": "If you use a [00D5FF]skill type that is different[-] from the skill slot, \"Spell of Kenaz\" inflicts [00D5FF]Burning Judgment[-] and [00D5FF]Muspell Blaze[-] damage, [00D5FF]removes Buffs and Stances[-], applies [00D5FF]Explosion[-], then converts active instances of [00D5FF]Ignite[-] into [00D5FF]Explosion[-] effects."
        },
        "runes": [
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Attacco[-]",
           "en": "[99FFFF]Rune Spell: Attack Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Atteggiamenti e Buff[-] da tutti i nemici e [00D5FF]riduce i loro ranghi abilità[-].",
           "en": "Removes [00D5FF]Stances and Buffs[-] from all enemies and [00D5FF]decreases their skill ranks[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Buff[-]",
           "en": "[99FFFF]Rune Spell: Buff Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e concede loro [FFAE00]1[-] [00D5FF]Evasione[-] per [FFAE00]1 turno[-].\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and grants them [FFAE00]1[-] [00D5FF]Evasion[-] for [FFAE00]1 turn[-].\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Debuff[-]",
           "en": "[99FFFF]Rune Spell: Debuff Shape[-]"
          },
          "text": {
           "it": "Infligge [00D5FF]Disabilita Atteggiamento[-] a tutti i nemici per [FFAE00]1 turno[-] e riduce le loro Barre Mossa finale di [FFAE00]1 sfera[-].",
           "en": "Inflicts [00D5FF]Stance Disable[-] on all enemies for [FFAE00]1 turn[-] and decreases their Ultimate Move Gauges by [FFAE00]1 orb[-]."
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Recupero[-]",
           "en": "[99FFFF]Rune Spell: Recovery Shape[-]"
          },
          "text": {
           "it": "Rimuove [00D5FF]Surriscaldamento[-] dagli alleati e ripristina il [FFAE00]50%[-] dei PS affetti da [00D5FF]Scioglimento[-].\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, in base ai PS massimi iniziali.[-]",
           "en": "Removes [00D5FF]Overheat[-] from allies and restores [FFAE00]50%[-] of [00D5FF]Melted[-] HP.\\n[00D5FF]※Melted: An unrecoverable Max HP decrease applied based on initial Max HP.[-]"
          },
          "cooldown": 2
         },
         {
          "name": {
           "it": "[99FFFF]Incantesimo runico: Forma di Atteggiamento[-]",
           "en": "[99FFFF]Rune Spell: Stance Shape[-]"
          },
          "text": {
           "it": "Applica [00D5FF]Soppressione danni subiti del [FFAE00]30%[-][-] agli alleati per [FFAE00]2 turni[-].",
           "en": "Applies [00D5FF][FFAE00]30%[-] Damage Taken Suppression[-] on allies for [FFAE00]2 turns[-]."
          },
          "cooldown": 2
         }
        ]
       },
       "turnLimit": 5
      }
     ]
    }
   ],
   "relics": [
    {
     "name": {
      "it": "Luna crescente delle Norn",
      "en": "Crescent Moon of the Norns"
     },
     "heroes": [
      "1988501"
     ]
    },
    {
     "name": {
      "it": "Avatar di Skoll",
      "en": "Avatar of Skoll"
     },
     "heroes": [
      "1929501",
      "1929502",
      "1929503"
     ]
    }
   ],
   "heroesOnly": [],
   "badBlood": []
  }
 ],
 "exchange": {
  "text": {
   "it": "Puoi usare i materiali per ottenere punti, che possono essere scambiati con altri materiali.\\n※Il numero di scambi si ripristina ogni lunedì alle 00:00.",
   "en": "You can use materials to earn points, which can be exchanged for other materials.\\n※The number of exchanges resets every Monday at 12:00 AM."
  },
  "points": [
   {
    "id": "543211",
    "points": 10
   },
   {
    "id": "543212",
    "points": 10
   },
   {
    "id": "543213",
    "points": 10
   },
   {
    "id": "543214",
    "points": 10
   },
   {
    "id": "543219",
    "points": 30
   },
   {
    "id": "543220",
    "points": 30
   },
   {
    "id": "543221",
    "points": 30
   }
  ],
  "rewards": [
   {
    "id": "545101",
    "points": 1400,
    "weekly": 1
   },
   {
    "id": "545102",
    "points": 500,
    "weekly": 3
   },
   {
    "id": "545109",
    "points": 1500,
    "weekly": 1
   },
   {
    "id": "545110",
    "points": 600,
    "weekly": 3
   },
   {
    "id": "545111",
    "points": 1700,
    "weekly": 1
   },
   {
    "id": "545112",
    "points": 700,
    "weekly": 3
   }
  ]
 },
 "heroesOnly": [
  {
   "heroId": "1886503",
   "source": "unique",
   "passive": {
    "it": "Potere d'acciaio",
    "en": "Fullmetal Power"
   }
  },
  {
   "heroId": "1905502",
   "source": "unique",
   "passive": {
    "it": "Fidati di me",
    "en": "Trust Me"
   }
  },
  {
   "heroId": "1935502",
   "source": "unique",
   "passive": {
    "it": "Seguitemi",
    "en": "Follow My Lead"
   }
  }
 ],
 "heroesExcluded": [
  {
   "heroId": "1785001",
   "source": "relic",
   "passive": {
    "it": "Strumento di estrazione di Eitri",
    "en": "Eitri's Mining Tool"
   }
  },
  {
   "heroId": "1805002",
   "source": "unique",
   "passive": {
    "it": "Profumo di primavera",
    "en": "Scent of Spring"
   }
  },
  {
   "heroId": "1918501",
   "source": "unique",
   "passive": {
    "it": "Una grossa pescata!",
    "en": "Got a Whopper!"
   }
  },
  {
   "heroId": "1918501",
   "source": "relic",
   "passive": {
    "it": "Canna da pesca di Hymir",
    "en": "Hymir's Fishing Rod"
   }
  },
  {
   "heroId": "1926501",
   "source": "unique",
   "passive": {
    "it": "Abilità nascosta",
    "en": "Hidden Ability"
   }
  },
  {
   "heroId": "1942501",
   "source": "unique",
   "passive": {
    "it": "Berserker del Freddo",
    "en": "Berserker of the Cold"
   }
  },
  {
   "heroId": "1942501",
   "source": "relic",
   "passive": {
    "it": "Tesoro sacro di Hreidmarr",
    "en": "Hreidmarr's Sacred Treasure"
   }
  },
  {
   "heroId": "1947501",
   "source": "unique",
   "passive": {
    "it": "L'oppresso",
    "en": "The Burdened One"
   }
  },
  {
   "heroId": "1947501",
   "source": "relic",
   "passive": {
    "it": "Guantoni di Audumla",
    "en": "Audumla's Gauntlets"
   }
  }
 ],
 "monsters": {
  "2390101": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]788%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]788%[-] of Attack on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "612886",
    "612891",
    "612892",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390102": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]420%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]420%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]315%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]315%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "612886",
    "612891",
    "612892",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390103": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni\\npari a [FFAE00]250%[-] dell'Attacco. [00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]250%[-] of Attack. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]400%[-] dell'Attacco. Applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] per [FFAE00]4 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti da uno o più bersagli [FFAE00]+[-][FFAE00]10%[-] (possono essere accumulati).[-]",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]400%[-] of Attack. Applies [FFAE00]2[-] [00D5FF]Ignite[-] effects for [FFAE00]4 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_debuff_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]160%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]160%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]788%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]788%[-] of Attack on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612849",
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "952142",
    "612886",
    "612891",
    "612892",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390104": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]130%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]130%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco su [FFFFFF]un nemico[-]. [00D5FF]Disabilita le abilità Attacco[-] per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Disables Attack Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]315%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]315%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612850",
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "952142",
    "612886",
    "612889",
    "612891",
    "612892",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390105": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Esplosione di vento",
      "en": "Wind Explosion"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]20%[-] le statistiche di base per [FFAE00]2 turno/i[-].",
       "en": "Increases basic stats by [FFAE00]20%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_hraesvelgr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Amplificazione[-] pari al [FFAE00]270%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Amplificazione: danni inflitti +[FFAE00]30%[-] per Buff attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Amplify[-] damage equal to [FFAE00]270%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Amplify: Damage dealt +[FFAE00]30%[-] per active Buff on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]788%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]788%[-] of Attack on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612851",
    "612852",
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "952142",
    "612886",
    "612891",
    "612892",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390106": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "Riduce l'Attacco di [FFFFFF]tutti i nemici[-] di [FFAE00]20%[-] e\\n[00D5FF]disabilita le abilità Buff e Debuff[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases Attack of [FFFFFF]all enemies[-] by [FFAE00]20%[-] and [00D5FF]disables Buff and Debuff Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_hraesvelgr_type01_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]3500%[-] dell'Attacco su [FFFFFF]tutti i nemici[-], poi recupera PS pari al [FFAE00]100%[-] dei danni inflitti.\\n[00D5FF](Manca il bersaglio quando attacca nemici usando Provocazione)[-]",
       "en": "Inflicts damage equal to [FFAE00]3500%[-] of Attack on [FFFFFF]all enemies[-], then restores HP equal to [FFAE00]100%[-] of damage dealt.\\n[00D5FF](Misses when attacking enemies using Taunt)[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]315%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]315%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612853",
    "612854",
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "952142",
    "612886",
    "612891",
    "612892",
    "612893"
   ],
   "hiddenPassives": 1
  },
  "2390107": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]130%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]130%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] e [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] and [00D5FF]Infects[-] them for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] e [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] and [00D5FF]Infects[-] them for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco su [FFFFFF]tutti i nemici[-]. [00D5FF]Disabilita le abilità Attacco[-] per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Disables Attack Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]40%[-] per [FFAE00]3 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]40%[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_hraesvelgr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612855",
    "612856",
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "952142",
    "612886",
    "612891",
    "612892",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390108": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]270%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]270%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]160%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]160%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e causa [00D5FF]Esplosione[-] dopo [FFAE00]1 turno/i[-].\\n\\n[00D5FF]*Esplosione: danni aggiuntivi pari al [FFAE00]100%[-] dei danni inflitti dopo un certo numero di turni.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Explodes[-] after [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Explosion: Additional damage equal to [FFAE00]100%[-] of damage dealt after a certain number of turns.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Esplosione di vento",
      "en": "Wind Explosion"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]20%[-] le statistiche di base per [FFAE00]2 turno/i[-].",
       "en": "Increases basic stats by [FFAE00]20%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_hraesvelgr_type01_skill_05"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612857",
    "612858",
    "800002",
    "612870",
    "612871",
    "612878",
    "612869",
    "612879",
    "952142",
    "612886",
    "612891",
    "612892"
   ],
   "hiddenPassives": 1
  },
  "2390109": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]230%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Carica: ignora Difesa.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]230%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Carica: ignora Difesa.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]permette solo l’uso delle abilità di Rango 1[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]allows the use of only Rank 1 skills[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]270%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]permette solo l’uso delle abilità di Rango 1[-] per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]270%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]allows the use of only Rank 1 skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Esplosione di vento",
      "en": "Wind Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rovina[-] e [00D5FF]Rottura[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rovina: aumenta i danni inflitti del [FFAE00]30%[-] per Debuff sul bersaglio e rimuove i Debuff[-]\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Ruin[-] and [00D5FF]Rupture[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Ruin: Increases damage dealt by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "Aumenta i danni subiti da [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]2 turno/i[-].",
       "en": "Increases damage taken by [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_hraesvelgr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]330%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]330%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612859",
    "612860",
    "800002",
    "612872",
    "612878",
    "612869",
    "612883",
    "612886",
    "952142",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390110": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-], rimuove [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale del bersaglio e [00D5FF]Cancella[-] [FFAE00]2[-] [FFAE00]abilità[-].\\n\\n[00D5FF]※Cancellazione: rimuove casualmente delle abilità dal bersaglio quando attacca (mosse finali escluse)\\n(Cancella le Mosse finali se non ci sono abilità da rimuovere)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-], removes [FFAE00]1[-] [FFAE00]orb(s)[-] from the target's Ultimate Move Gauge, and [00D5FF]Deletes[-] [FFAE00]2[-] [FFAE00]skill(s)[-] at random.\\n\\n[00D5FF]※Delete: Randomly removes skills from the target (Excluding Ultimate Moves)\\n(Deletes Ultimate Moves if there is no skill to remove)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-], rimuove [FFAE00]2[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale del bersaglio e [00D5FF]Cancella[-] [FFAE00]2[-] [FFAE00]abilità[-].\\n\\n[00D5FF]※Cancellazione: rimuove casualmente delle abilità dal bersaglio quando attacca (mosse finali escluse)\\n(Cancella le Mosse finali se non ci sono abilità da rimuovere)[-]",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-], removes [FFAE00]2[-] [FFAE00]orb(s)[-] from the target's Ultimate Move Gauge, and [00D5FF]Deletes[-] [FFAE00]2[-] [FFAE00]skill(s)[-] at random.\\n\\n[00D5FF]※Delete: Randomly removes skills from the target (Excluding Ultimate Moves)\\n(Deletes Ultimate Moves if there is no skill to remove)[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]160%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Infligge Shock[-] per [FFAE00]4 turno/i[-].\\n\\n[00D5FF]※Shock: danni aggiuntivi pari al [FFAE00]45%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]160%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Shocks[-] for [FFAE00]4 turn(s)[-].\\n\\n[00D5FF]※Shock: Additional damage equal to [FFAE00]45%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Infligge Shock[-] per [FFAE00]4 turno/i[-].\\n\\n[00D5FF]※Shock: danni aggiuntivi pari al [FFAE00]45%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Shocks[-] for [FFAE00]4 turn(s)[-].\\n\\n[00D5FF]※Shock: Additional damage equal to [FFAE00]45%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Esplosione di vento",
      "en": "Wind Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nRiduce [00D5FF]le statistiche relative alla Difesa[-] di [FFAE00]40%[-] per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\nDecreases [00D5FF]Defense-related stats[-] by [FFAE00]40%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_debuff_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]svuota[-] [FFAE00]2[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale alla fine del turno nemico per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]depletes[-] [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-] at the end of the enemy's turn for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]350%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]350%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612861",
    "612862",
    "800002",
    "612872",
    "612878",
    "612869",
    "612884",
    "612886",
    "952142",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390111": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]un nemico[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]1[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]one enemy[-] and fills [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]2[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-] and fills [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Onda[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Onda: Danni inflitti -[FFAE00]8%[-] per nemico sul campo di battaglia.[-]",
       "en": "Inflicts [00D5FF]Wave[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Wave: Damage dealt -[FFAE00]8%[-] per enemy on the battlefield.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Onda[-] pari al [FFAE00]420%[-] dell'Attacco su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Onda: Danni inflitti -[FFAE00]12%[-] per nemico sul campo di battaglia.[-]",
       "en": "Inflicts [00D5FF]Wave[-] damage equal to [FFAE00]420%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Wave: Damage dealt -[FFAE00]12%[-] per enemy on the battlefield.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Esplosione di vento",
      "en": "Wind Explosion"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]30%[-] le statistiche di base per [FFAE00]2 turno/i[-] e ottiene [00D5FF]Evasione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Evasione: immune ad Attacco e Abilità Attacco debuff.[-]",
       "en": "Increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and gains [00D5FF]Evasion[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Evasion: Immune to Attack and Debuff Atk Skills.[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_hraesvelgr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "[00D5FF]Impedisce l'uso di abilità[-] di [FFFFFF]tutti i nemici[-] nell'ordine seguente: [00D5FF]Atteggiamento, Debuff, Buff, Attacco, Mossa finale[-].",
       "en": "[00D5FF]Disables skill usage[-] of [FFFFFF]all enemies[-] in the following order: [00D5FF]Stance, Debuff, Buff, Attack, Ultimate Move[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_hraesvelgr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612863",
    "612864",
    "800002",
    "612872",
    "612878",
    "612869",
    "612885",
    "612886",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390112": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]400%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Esplosione di vento",
      "en": "Wind Explosion"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]30%[-] le statistiche di base per [FFAE00]2 turno/i[-] e ottiene [00D5FF]Evasione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Evasione: immune ad Attacco e Abilità Attacco debuff.[-]",
       "en": "Increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and gains [00D5FF]Evasion[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Evasion: Immune to Attack and Debuff Atk Skills.[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_hraesvelgr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "Riduce l'Attacco di [FFFFFF]tutti i nemici[-] di [FFAE00]40%[-] e\\n[00D5FF]disabilita tutto tranne le abilità Attacco[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases Attack of [FFFFFF]all enemies[-] by [FFAE00]40%[-] and [00D5FF]disables everything but Attack Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_hraesvelgr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612865",
    "612866",
    "800002",
    "612872",
    "612878",
    "612869",
    "612885",
    "612886",
    "800081"
   ],
   "hiddenPassives": 1
  },
  "2390114": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raffica ardente",
      "en": "Fierce Rush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]788%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]788%[-] of Attack on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "612924",
    "612925",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "800081",
    "612983"
   ],
   "hiddenPassives": 1
  },
  "2390115": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Circolo d'acqua",
      "en": "Water Loop"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]190%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Disabilita le Mosse finali[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]190%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF]Disables Ultimate Moves[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]285%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Disabilita le Mosse finali[-] per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]285%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF]Disables Ultimate Moves[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "612924",
    "612925",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612930",
    "800081",
    "612983"
   ],
   "hiddenPassives": 4
  },
  "2390116": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raffica ardente",
      "en": "Fierce Rush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]230%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]230%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
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
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Disperazione[-] pari a [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Disperazione: recupera [FFAE00]30%[-] dei PS ridotti mettendo a segno un colpo critico.[-]",
       "en": "Inflicts [00D5FF]Despair[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Despair: Recovers [FFAE00]30%[-] of diminished HP upon successful critical strike.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]520%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]520%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612906",
    "800002",
    "612924",
    "612925",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612946",
    "612929",
    "612961",
    "612983"
   ],
   "hiddenPassives": 1
  },
  "2390117": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza vitale",
      "en": "Life Force"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_03_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Stagno ghiacciato",
      "en": "Icy Pond"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_06_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Corno Difensivo",
      "en": "Defensive Horn"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari a un [FFAE00]1500%[-] dell'Attacco tramite contrattacco quando viene aggredito.\\n\\n[00D5FF](L'attacco non va a segno contro nemici con delle barriere)[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]1500%[-] of Attack via counter when attacked.\\n\\n[00D5FF](Results in a miss when attacking enemies with barriers)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_eikthyrnir_type01_skill_09"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]420%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]420%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Nome abilità non deciso",
      "en": "Undecided Skill Name"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612907",
    "800002",
    "612924",
    "612925",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612946",
    "612947",
    "612962",
    "612983"
   ],
   "hiddenPassives": 4
  },
  "2390118": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raffica ardente",
      "en": "Fierce Rush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Carica: ignora Difesa.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Carica: ignora Difesa.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Rinfrescata",
      "en": "Refresh"
     },
     "ranks": [
      {
       "it": "Aumenta l'Attacco di [FFAE00]200%[-] per [FFAE00]2 turno/i[-].",
       "en": "Increases Attack by [FFAE00]200%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_eikthyrnir_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Incursione ghiacciata",
      "en": "Frosty Raid"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]560%[-] dell'Attacco a [FFFFFF]un nemico[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]100%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]560%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Lifesteals[-] [FFAE00]100%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612908",
    "612909",
    "800002",
    "612926",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612948",
    "800081",
    "612887",
    "612983"
   ],
   "hiddenPassives": 1
  },
  "2390119": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Circolo d'acqua",
      "en": "Water Loop"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Frantumazione[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Frantumazione: ignora Resistenza.[-]",
       "en": "Inflicts [00D5FF]Shatter[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Shatter: Ignores Resistance.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Frantumazione[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Frantumazione: ignora Resistenza.[-]",
       "en": "Inflicts [00D5FF]Shatter[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Shatter: Ignores Resistance.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Forza vitale",
      "en": "Life Force"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]300%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]300%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_03_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Stagno ghiacciato",
      "en": "Icy Pond"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]10000%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF](Manca i bersagli congelati)[-]",
       "en": "Inflicts damage equal to [FFAE00]10000%[-] of Attack on [FFFFFF]all enemies[-].\\n[00D5FF](Misses Frozen targets)[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_06_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni da [00D5FF]Tecnica segreta[-] pari al [FFAE00]300%[-] dell'attacco su [FFFFFF]tutti i nemici[-] e infligge danni con vantaggio sull'attributo indifferentemente dall'attributo.\\n\\n[00D5FF]※Tecnica segreta: [FFAE00]+[-][FFAE00]20%[-] danni aggiuntivi per abilità eroe.[-]",
       "en": "Inflicts [00D5FF]Secret Technique[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-] and deals damage with attribute advantage regardless of attribute.\\n\\n[00D5FF]※Secret Technique: [FFAE00]+[-][FFAE00]20%[-] additional damage per hero skill.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612910",
    "612911",
    "800002",
    "612926",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612960",
    "612945",
    "612887",
    "612983"
   ],
   "hiddenPassives": 4
  },
  "2390120": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Circolo d'acqua",
      "en": "Water Loop"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]220%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]220%[-] of Attack."
      },
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]360%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]360%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Stagno ghiacciato",
      "en": "Icy Pond"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_06_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]170%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]170%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Forza vitale",
      "en": "Life Force"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]360%[-] dell'Attacco a [FFFFFF]un nemico[-], rimuove [FFAE00]2[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale del bersaglio e [00D5FF]Cancella[-] [FFAE00]2[-] [FFAE00]abilità[-].\\n\\n[00D5FF]※Cancellazione: rimuove casualmente delle abilità dal bersaglio quando attacca (mosse finali escluse)\\n(Cancella le Mosse finali se non ci sono abilità da rimuovere)[-]",
       "en": "Inflicts damage equal to [FFAE00]360%[-] of Attack on [FFFFFF]one enemy[-], removes [FFAE00]2[-] [FFAE00]orb(s)[-] from the target's Ultimate Move Gauge, and [00D5FF]Deletes[-] [FFAE00]2[-] [FFAE00]skill(s)[-] at random.\\n\\n[00D5FF]※Delete: Randomly removes skills from the target (Excluding Ultimate Moves)\\n(Deletes Ultimate Moves if there is no skill to remove)[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_03_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Incursione ghiacciata",
      "en": "Frosty Raid"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]385%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]385%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612912",
    "612913",
    "800002",
    "612926",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612951",
    "800081",
    "612887",
    "612983"
   ],
   "hiddenPassives": 1
  },
  "2390121": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Circolo d'acqua",
      "en": "Water Loop"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]380%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]380%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]1[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-] and fills [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]270%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]2[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]270%[-] of Attack on [FFFFFF]all enemies[-] and fills [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Bomba di Bolle",
      "en": "Bubble Bomb"
     },
     "ranks": [
      {
       "it": "Aumenta i danni subiti da [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]2 turno/i[-].",
       "en": "Increases damage taken by [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_eikthyrnir_type01_skill_08"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Corno Difensivo",
      "en": "Defensive Horn"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari a un [FFAE00]1500%[-] dell'Attacco tramite contrattacco quando viene aggredito.\\n\\n[00D5FF](L'attacco non va a segno contro nemici con delle barriere)[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]1500%[-] of Attack via counter when attacked.\\n\\n[00D5FF](Results in a miss when attacking enemies with barriers)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_eikthyrnir_type01_skill_09"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Nome abilità non deciso",
      "en": "Undecided Skill Name"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612914",
    "612915",
    "800002",
    "612926",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612952",
    "800081",
    "612887",
    "612983"
   ],
   "hiddenPassives": 4
  },
  "2390122": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza vitale",
      "en": "Life Force"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]190%[-] dell'Attacco su [FFFFFF]un nemico[-]. [00D5FF]Disabilita le abilità Attacco[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]190%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Disables Attack Skills[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]285%[-] dell'Attacco su [FFFFFF]un nemico[-]. [00D5FF]Disabilita le abilità Attacco[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]285%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Disables Attack Skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_03_debuff_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Infligge Shock[-] per [FFAE00]4 turno/i[-].\\n\\n[00D5FF]※Shock: danni aggiuntivi pari al [FFAE00]45%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Shocks[-] for [FFAE00]4 turn(s)[-].\\n\\n[00D5FF]※Shock: Additional damage equal to [FFAE00]45%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Infligge Shock[-] per [FFAE00]4 turno/i[-].\\n\\n[00D5FF]※Shock: danni aggiuntivi pari al [FFAE00]45%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Shocks[-] for [FFAE00]4 turn(s)[-].\\n\\n[00D5FF]※Shock: Additional damage equal to [FFAE00]45%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]permette solo l’uso delle abilità di Rango 1[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]allows the use of only Rank 1 skills[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Stagno ghiacciato",
      "en": "Icy Pond"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Impedisce il riempimento della Barra Mossa finale[-] per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Prevents Ultimate Move Gauge(s) from filling up[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_06_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612916",
    "612917",
    "800002",
    "612926",
    "612928",
    "612927",
    "612943",
    "612891",
    "612892",
    "612953",
    "800081",
    "612887",
    "612983"
   ],
   "hiddenPassives": 1
  },
  "2390123": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raffica ardente",
      "en": "Fierce Rush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Rinfrescata",
      "en": "Refresh"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]500%[-] i danni subiti dai mostri inferti da [00D5FF]determinati attributi[-].",
       "en": "Increases the monster's damage taken from [00D5FF]certain attributes[-] by [FFAE00]500%[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_eikthyrnir_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Stagno ghiacciato",
      "en": "Icy Pond"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_06_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Incursione ghiacciata",
      "en": "Frosty Raid"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612918",
    "612919",
    "800002",
    "612926",
    "612928",
    "612943",
    "612891",
    "612892",
    "612955",
    "612956",
    "800081",
    "612887",
    "612983"
   ],
   "hiddenPassives": 4
  },
  "2390124": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza vitale",
      "en": "Life Force"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]190%[-] dell'Attacco a [FFFFFF]un nemico[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]1[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]190%[-] of Attack on [FFFFFF]one enemy[-] and fills [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-] e riempie la [FFAE00]Barra Mossa finale[-] di [FFAE00]2[-] sfera/e.",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-] and fills [FFAE00]2[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_03_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Carica: ignora Difesa.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Carica: ignora Difesa.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Amplificazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Amplificazione: danni inflitti +[FFAE00]30%[-] per Buff attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Amplify[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Amplify: Damage dealt +[FFAE00]30%[-] per active Buff on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Rinfrescata",
      "en": "Refresh"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]50%[-] le statistiche di base per [FFAE00]3 turno/i[-].",
       "en": "Increases basic stats by [FFAE00]50%[-] for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_eikthyrnir_type01_skill_07"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612920",
    "612921",
    "800002",
    "612926",
    "612928",
    "612943",
    "612891",
    "612892",
    "800081",
    "612887",
    "612983"
   ],
   "hiddenPassives": 1
  },
  "2390125": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Circolo d'acqua",
      "en": "Water Loop"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]150%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]220%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Stagno ghiacciato",
      "en": "Icy Pond"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_06_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Rinfrescata",
      "en": "Refresh"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]30%[-] le statistiche di base per [FFAE00]2 turno/i[-] e ottiene [00D5FF]Evasione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Evasione: immune ad Attacco e Abilità Attacco debuff.[-]",
       "en": "Increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and gains [00D5FF]Evasion[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Evasion: Immune to Attack and Debuff Atk Skills.[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_eikthyrnir_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Corno Difensivo",
      "en": "Defensive Horn"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari a un [FFAE00]1500%[-] dell'Attacco tramite contrattacco quando viene aggredito.\\n\\n[00D5FF](L'attacco non va a segno contro nemici con delle barriere)[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]1500%[-] of Attack via counter when attacked.\\n\\n[00D5FF](Results in a miss when attacking enemies with barriers)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_eikthyrnir_type01_skill_09"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Nome abilità non deciso",
      "en": "Undecided Skill Name"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "612922",
    "612923",
    "800002",
    "612926",
    "612928",
    "612943",
    "612891",
    "612892",
    "612952",
    "612959",
    "800081",
    "612887",
    "612983"
   ],
   "hiddenPassives": 4
  },
  "2390126": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Hati, che vuole divorare la Luna, diventa più debole di giorno.",
    "en": "A demonic beast that will lead the world to its end. Hati, who wishes to devour the moon, becomes weaker during daytime."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]3%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]3%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]5%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]5%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]10%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]10%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che riduce del [FFAE00]35%[-] [00D5FF]i danni finali subiti[-] quando viene attaccato [00D5FF]un alleato[-]. [00D5FF]L'eroe[-] subisce il [FFAE00]50%[-] dei danni ridotti.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which reduces [00D5FF]the final damage taken[-] by [FFAE00]35%[-] when [00D5FF]an ally[-] is attacked. The [00D5FF]hero[-] takes [FFAE00]50%[-] of the reduced damage."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Riduce tutte le statistiche relative all'Attacco dei nemici del [FFAE00]20%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases all enemies' Attack-related stats by [FFAE00]20%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_03"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613251",
    "613252",
    "613281",
    "613285",
    "613286",
    "613279",
    "613282"
   ],
   "hiddenPassives": 1
  },
  "2390127": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Skoll, che vuole divorare il Sole, diventa più forte di giorno.",
    "en": "A demonic beast that will lead the world to its end. Skoll, who wishes to devour the sun, becomes stronger during daytime."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]160%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]160%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]50%[-] le proprie statistiche relative alla Difesa per [FFAE00]2 turno/i[-].",
       "en": "Increases own Defense-related stats by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]380%[-] dell'Attacco a [FFFFFF]un nemico[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]200%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]380%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Lifesteals[-] [FFAE00]200%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]560%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]560%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613253",
    "613254",
    "800002",
    "613284",
    "613285",
    "612886",
    "613298"
   ],
   "hiddenPassives": 2
  },
  "2390128": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Hati, che vuole divorare la Luna, diventa più forte di notte.",
    "en": "A demonic beast that will lead the world to its end. Hati, who wishes to devour the moon, becomes stronger during nighttime."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]310%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]310%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]420%[-] dell'Attacco a [FFFFFF]un nemico[-] e applica [00D5FF]Congelamento[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Congelamento: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
       "en": "Inflicts damage equal to [FFAE00]420%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Freezes[-] them for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Freeze: Incapacitates target. Effect is removed when target is attacked[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]30%[-] le statistiche relative all'Attacco di tutti i nemici e [00D5FF]disattiva le Abilità Buff[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases the Attack-related stats of all enemies by [FFAE00]30%[-] and [00D5FF]disables Buff Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]15%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]15%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge danni [00D5FF]Corrosione[-] pari al [FFAE00]20%[-] dei PS massimi per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-] and inflicts [00D5FF]Corrosion[-] damage equal to [FFAE00]20%[-] of Max HP for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Corrosion: Additional damage at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613255",
    "613256",
    "800002",
    "613285",
    "613284",
    "613279",
    "612886",
    "613298"
   ],
   "hiddenPassives": 2
  },
  "2390129": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Skoll, che vuole divorare il Sole, diventa più debole di notte.",
    "en": "A demonic beast that will lead the world to its end. Skoll, who wishes to devour the sun, becomes weaker during nighttime."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]10%[-] per [FFAE00]1 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]10%[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]15%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]15%[-] for [FFAE00]2 turn(s)[-]."
      },
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riempie le Barre Mossa finale degli alleati di [FFAE00][FFAE00]3[-] sfera/e[-] ogni turno per [FFAE00]3 turno/i[-].",
       "en": "Fills allies' Ultimate Move Gauges by [FFAE00][FFAE00]3[-] orb(s)[-] every turn for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che riduce del [FFAE00]35%[-] [00D5FF]i danni finali subiti[-] quando viene attaccato [00D5FF]un alleato[-]. [00D5FF]L'eroe[-] subisce il [FFAE00]50%[-] dei danni ridotti.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which reduces [00D5FF]the final damage taken[-] by [FFAE00]35%[-] when [00D5FF]an ally[-] is attacked. The [00D5FF]hero[-] takes [FFAE00]50%[-] of the reduced damage."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613257",
    "613258",
    "613281",
    "613285",
    "613286",
    "613283"
   ],
   "hiddenPassives": 1
  },
  "2390130": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. I poteri di Hati tornano alla normalità al crepuscolo, quando né il Sole né la Luna sono in cielo.",
    "en": "A demonic beast that will lead the world to its end. Hati's power returns to normal during twilight, when neither the sun nor the moon is in the sky."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto stellare",
      "en": "Star Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]190%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]190%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]260%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]260%[-] of Attack."
      },
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]400%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]400%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "[00D5FF]Estorce[-] del [FFAE00]20%[-] Attacco e Difesa da [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Estorsione: Riduce le statistiche del bersaglio e aumenta le proprie statistiche della stessa quantità.[-]",
       "en": "[00D5FF]Extorts[-] [FFAE00]20%[-] Attack and Defense from [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Extort: Decreases the target's stats and increases own stats by the same amount.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco\\n e applica gli effetti [00D5FF]Avvelenamento e Sanguinamento[-] per [FFAE00]2 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.\\n※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack and applies [00D5FF]Poison and Bleed[-] effects for [FFAE00]2 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.\\n※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613259",
    "613260",
    "800001",
    "613278",
    "613285",
    "613284",
    "613279",
    "612886"
   ],
   "hiddenPassives": 3
  },
  "2390131": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. I poteri di Skoll tornano alla normalità al crepuscolo, quando né il Sole né la Luna sono in cielo.",
    "en": "A demonic beast that will lead the world to its end. Skoll's power returns to normal during twilight, when neither the sun nor the moon is in the sky."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Diffusore solare",
      "en": "Solar Diffusion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]190%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]190%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "[00D5FF]Provoca[-] i nemici per [FFAE00]2 turno/i[-], applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] su tutti i nemici per [FFAE00]3 turni[-] quando subisce un attacco.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]\\n[00D5FF]※Incendio: danni subiti dai bersagli [FFAE00]+10%[-] (Può essere accumulato).[-]",
       "en": "[00D5FF]Taunts[-] enemies for [FFAE00]2 turn(s)[-], applying [FFAE00]2[-] [00D5FF]Ignite[-] effects on all enemies for [FFAE00]3 turns[-] when attacked.\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]\\n[00D5FF]※Ignite: Damage taken by targets [FFAE00]+10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]560%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ripristina i PS di tutti gli alleati del [FFAE00]80%[-] dei danni inflitti.",
       "en": "Inflicts damage equal to [FFAE00]560%[-] of Attack on [FFFFFF]all enemies[-] and restores the HP of all allies by [FFAE00]80%[-] of damage dealt."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613261",
    "613262",
    "800001",
    "613273",
    "613285",
    "613284",
    "612886"
   ],
   "hiddenPassives": 3
  },
  "2390132": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Hati, che vuole divorare la Luna, diventa più debole di giorno.",
    "en": "A demonic beast that will lead the world to its end. Hati, who wishes to devour the moon, becomes weaker during daytime."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]3%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]3%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]5%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]5%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]10%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]10%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che riduce del [FFAE00]60%[-] [00D5FF]i danni finali subiti[-] quando viene attaccato [00D5FF]un alleato[-]. [00D5FF]L'eroe[-] subisce il [FFAE00]50%[-] dei danni ridotti.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which reduces [00D5FF]the final damage taken[-] by [FFAE00]60%[-] when [00D5FF]an ally[-] is attacked. The [00D5FF]hero[-] takes [FFAE00]50%[-] of the reduced damage."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Riduce tutte le statistiche relative all'Attacco dei nemici del [FFAE00]20%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases all enemies' Attack-related stats by [FFAE00]20%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_03"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613251",
    "613252",
    "613281",
    "613285",
    "613286",
    "613279",
    "613282"
   ],
   "hiddenPassives": 1
  },
  "2390133": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Skoll, che vuole divorare il Sole, diventa più forte di giorno.",
    "en": "A demonic beast that will lead the world to its end. Skoll, who wishes to devour the sun, becomes stronger during daytime."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]50%[-] le proprie statistiche relative alla Difesa per [FFAE00]2 turno/i[-].",
       "en": "Increases own Defense-related stats by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]200%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Lifesteals[-] [FFAE00]200%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]560%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]560%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613253",
    "613254",
    "800002",
    "613271",
    "613285",
    "613284",
    "612886",
    "613294",
    "613298",
    "613299",
    "613300",
    "613301"
   ],
   "hiddenPassives": 2
  },
  "2390134": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Hati, che vuole divorare la Luna, diventa più forte di notte.",
    "en": "A demonic beast that will lead the world to its end. Hati, who wishes to devour the moon, becomes stronger during nighttime."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-] e li [00D5FF]Congela[-] per [FFAE00]1 turno/i[-]. I nemici congelati subiscono [FFAE00]30%[-] danni aggiuntivi.\\n[00D5FF]※Congelamento: immobilizza il bersaglio. L’effetto viene rimosso quando il bersaglio viene attaccato[-].",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Freezes[-] them for [FFAE00]1 turn(s)[-]. Frozen enemies take [FFAE00]30%[-] additional damage.\\n[00D5FF]※Freeze: Incapacitates target. Effect is removed when target is attacked[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]30%[-] le statistiche relative all'Attacco di tutti i nemici e [00D5FF]disattiva le Abilità Buff[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases the Attack-related stats of all enemies by [FFAE00]30%[-] and [00D5FF]disables Buff Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]15%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]15%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge danni [00D5FF]Corrosione[-] pari al [FFAE00]20%[-] dei PS massimi per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-] and inflicts [00D5FF]Corrosion[-] damage equal to [FFAE00]20%[-] of Max HP for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Corrosion: Additional damage at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613255",
    "613256",
    "800002",
    "613278",
    "613285",
    "613284",
    "613279",
    "612886",
    "613295",
    "613298",
    "613299",
    "613302",
    "613303"
   ],
   "hiddenPassives": 2
  },
  "2390135": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Skoll, che vuole divorare il Sole, diventa più debole di notte.",
    "en": "A demonic beast that will lead the world to its end. Skoll, who wishes to devour the sun, becomes weaker during nighttime."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]10%[-] per [FFAE00]1 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]10%[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]15%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]15%[-] for [FFAE00]2 turn(s)[-]."
      },
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riempie le Barre Mossa finale degli alleati di [FFAE00][FFAE00]3[-] sfera/e[-] ogni turno per [FFAE00]3 turno/i[-].",
       "en": "Fills allies' Ultimate Move Gauges by [FFAE00][FFAE00]3[-] orb(s)[-] every turn for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che riduce del [FFAE00]60%[-] [00D5FF]i danni finali subiti[-] quando viene attaccato [00D5FF]un alleato[-]. [00D5FF]L'eroe[-] subisce il [FFAE00]50%[-] dei danni ridotti.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which reduces [00D5FF]the final damage taken[-] by [FFAE00]60%[-] when [00D5FF]an ally[-] is attacked. The [00D5FF]hero[-] takes [FFAE00]50%[-] of the reduced damage."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613257",
    "613258",
    "613281",
    "613285",
    "613286",
    "613283"
   ],
   "hiddenPassives": 1
  },
  "2390136": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. I poteri di Hati tornano alla normalità al crepuscolo, quando né il Sole né la Luna sono in cielo.",
    "en": "A demonic beast that will lead the world to its end. Hati's power returns to normal during twilight, when neither the sun nor the moon is in the sky."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto stellare",
      "en": "Star Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]220%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]220%[-] of Attack."
      },
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]400%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]400%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "[00D5FF]Estorce[-] del [FFAE00]20%[-] Attacco e Difesa da [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Estorsione: Riduce le statistiche del bersaglio e aumenta le proprie statistiche della stessa quantità.[-]",
       "en": "[00D5FF]Extorts[-] [FFAE00]20%[-] Attack and Defense from [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Extort: Decreases the target's stats and increases own stats by the same amount.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco\\n e applica gli effetti [00D5FF]Avvelenamento e Sanguinamento[-] per [FFAE00]2 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.\\n※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack and applies [00D5FF]Poison and Bleed[-] effects for [FFAE00]2 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.\\n※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613259",
    "613260",
    "800001",
    "613274",
    "613285",
    "613284",
    "613279",
    "613287",
    "612886",
    "613295",
    "613298",
    "613299"
   ],
   "hiddenPassives": 3
  },
  "2390137": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. I poteri di Skoll tornano alla normalità al crepuscolo, quando né il Sole né la Luna sono in cielo.",
    "en": "A demonic beast that will lead the world to its end. Skoll's power returns to normal during twilight, when neither the sun nor the moon is in the sky."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Diffusore solare",
      "en": "Solar Diffusion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]170%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]170%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "[00D5FF]Provoca[-] i nemici per [FFAE00]2 turno/i[-], applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] su tutti i nemici per [FFAE00]3 turni[-] quando subisce un attacco.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]\\n[00D5FF]※Incendio: danni subiti dai bersagli [FFAE00]+10%[-] (Può essere accumulato).[-]",
       "en": "[00D5FF]Taunts[-] enemies for [FFAE00]2 turn(s)[-], applying [FFAE00]2[-] [00D5FF]Ignite[-] effects on all enemies for [FFAE00]3 turns[-] when attacked.\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]\\n[00D5FF]※Ignite: Damage taken by targets [FFAE00]+10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]420%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ripristina i PS di tutti gli alleati del [FFAE00]80%[-] dei danni inflitti.",
       "en": "Inflicts damage equal to [FFAE00]420%[-] of Attack on [FFFFFF]all enemies[-] and restores the HP of all allies by [FFAE00]80%[-] of damage dealt."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613261",
    "613262",
    "800001",
    "613273",
    "613285",
    "613284",
    "613288",
    "612886",
    "613294",
    "613298",
    "613299"
   ],
   "hiddenPassives": 3
  },
  "2390138": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Hati, che vuole divorare la Luna, diventa più debole di giorno.",
    "en": "A demonic beast that will lead the world to its end. Hati, who wishes to devour the moon, becomes weaker during daytime."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]3%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]3%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]5%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]5%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      },
      {
       "it": "Riduce del [FFAE00]10%[-] i danni subiti da tutti gli alleati per [FFAE00]2 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]10%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che [00D5FF]provoca[-] i nemici e riduce [00D5FF]i danni finali subiti[-] del [FFAE00]60%[-] quando [00D5FF]un alleato[-] subisce un attacco. [00D5FF]Chi ha lanciato l'incantesimo[-] subisce [FFAE00]50%[-] dei danni ridotti.\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which [00D5FF]Taunts[-] enemies and reduces [00D5FF]the final damage taken[-] by [FFAE00]60%[-] when [00D5FF]an ally[-] is attacked. [00D5FF]The caster[-] takes [FFAE00]50%[-] of the reduced damage.\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Riduce tutte le statistiche relative all'Attacco dei nemici del [FFAE00]20%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases all enemies' Attack-related stats by [FFAE00]20%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_03"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613251",
    "613252",
    "613281",
    "613285",
    "613286",
    "613279",
    "613282"
   ],
   "hiddenPassives": 1
  },
  "2390139": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Skoll, che vuole divorare il Sole, diventa più forte di giorno.",
    "en": "A demonic beast that will lead the world to its end. Skoll, who wishes to devour the sun, becomes stronger during daytime."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]190%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]190%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]50%[-] le proprie statistiche relative alla Difesa per [FFAE00]2 turno/i[-].",
       "en": "Increases own Defense-related stats by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]200%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Lifesteals[-] [FFAE00]200%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]560%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]560%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613253",
    "613254",
    "800002",
    "613271",
    "613285",
    "613284",
    "613288",
    "612886",
    "613294",
    "613298",
    "613299"
   ],
   "hiddenPassives": 2
  },
  "2390140": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Hati, che vuole divorare la Luna, diventa più forte di notte.",
    "en": "A demonic beast that will lead the world to its end. Hati, who wishes to devour the moon, becomes stronger during nighttime."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]un nemico[-] e applica [00D5FF]Congelamento[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Congelamento: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
       "en": "Inflicts damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Freezes[-] them for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Freeze: Incapacitates target. Effect is removed when target is attacked[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]30%[-] le statistiche relative all'Attacco di tutti i nemici e [00D5FF]disattiva le Abilità Buff[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases the Attack-related stats of all enemies by [FFAE00]30%[-] and [00D5FF]disables Buff Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]15%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]15%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge danni [00D5FF]Corrosione[-] pari al [FFAE00]20%[-] dei PS massimi per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-] and inflicts [00D5FF]Corrosion[-] damage equal to [FFAE00]20%[-] of Max HP for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Corrosion: Additional damage at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613255",
    "613256",
    "800002",
    "613272",
    "613285",
    "613284",
    "613279",
    "613287",
    "612886",
    "613295",
    "613298",
    "613299"
   ],
   "hiddenPassives": 2
  },
  "2390141": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. Skoll, che vuole divorare il Sole, diventa più debole di notte.",
    "en": "A demonic beast that will lead the world to its end. Skoll, who wishes to devour the sun, becomes weaker during nighttime."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]10%[-] per [FFAE00]1 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]10%[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]15%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]15%[-] for [FFAE00]2 turn(s)[-]."
      },
      {
       "it": "Riduce [00D5FF]le statistiche relative alla Difesa[-] di [FFFFFF]tutti i nemici[-] del [FFAE00]30%[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases [00D5FF]Defense-related stats[-] of [FFFFFF]all enemies[-] by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riempie le Barre Mossa finale degli alleati di [FFAE00][FFAE00]3[-] sfera/e[-] ogni turno per [FFAE00]3 turno/i[-].",
       "en": "Fills allies' Ultimate Move Gauges by [FFAE00][FFAE00]3[-] orb(s)[-] every turn for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che [00D5FF]provoca[-] i nemici e riduce [00D5FF]i danni finali subiti[-] del [FFAE00]60%[-] quando [00D5FF]un alleato[-] subisce un attacco. [00D5FF]Chi ha lanciato l'incantesimo[-] subisce [FFAE00]50%[-] dei danni ridotti.\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which [00D5FF]Taunts[-] enemies and reduces [00D5FF]the final damage taken[-] by [FFAE00]60%[-] when [00D5FF]an ally[-] is attacked. [00D5FF]The caster[-] takes [FFAE00]50%[-] of the reduced damage.\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613257",
    "613258",
    "613281",
    "613285",
    "613286",
    "613283"
   ],
   "hiddenPassives": 1
  },
  "2390142": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. I poteri di Hati tornano alla normalità al crepuscolo, quando né il Sole né la Luna sono in cielo.",
    "en": "A demonic beast that will lead the world to its end. Hati's power returns to normal during twilight, when neither the sun nor the moon is in the sky."
   },
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto stellare",
      "en": "Star Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]220%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]220%[-] of Attack."
      },
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]350%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]350%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "[00D5FF]Estorce[-] del [FFAE00]20%[-] Attacco e Difesa da [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Estorsione: Riduce le statistiche del bersaglio e aumenta le proprie statistiche della stessa quantità.[-]",
       "en": "[00D5FF]Extorts[-] [FFAE00]20%[-] Attack and Defense from [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Extort: Decreases the target's stats and increases own stats by the same amount.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco\\n e applica gli effetti [00D5FF]Avvelenamento e Sanguinamento[-] per [FFAE00]2 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.\\n※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack and applies [00D5FF]Poison and Bleed[-] effects for [FFAE00]2 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.\\n※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613259",
    "613260",
    "800001",
    "613274",
    "613285",
    "613284",
    "613279",
    "613287",
    "612886",
    "613295",
    "613298",
    "613299"
   ],
   "hiddenPassives": 2
  },
  "2390143": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "description": {
    "it": "Una bestia demoniaca che condurrà il mondo verso la sua fine. I poteri di Skoll tornano alla normalità al crepuscolo, quando né il Sole né la Luna sono in cielo.",
    "en": "A demonic beast that will lead the world to its end. Skoll's power returns to normal during twilight, when neither the sun nor the moon is in the sky."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Diffusore solare",
      "en": "Solar Diffusion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]170%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]170%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]380%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]380%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "[00D5FF]Provoca[-] i nemici per [FFAE00]2 turno/i[-], applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] su tutti i nemici per [FFAE00]3 turni[-] quando subisce un attacco.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]\\n[00D5FF]※Incendio: danni subiti dai bersagli [FFAE00]+10%[-] (Può essere accumulato).[-]",
       "en": "[00D5FF]Taunts[-] enemies for [FFAE00]2 turn(s)[-], applying [FFAE00]2[-] [00D5FF]Ignite[-] effects on all enemies for [FFAE00]3 turns[-] when attacked.\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]\\n[00D5FF]※Ignite: Damage taken by targets [FFAE00]+10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]490%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ripristina i PS di tutti gli alleati del [FFAE00]80%[-] dei danni inflitti.",
       "en": "Inflicts damage equal to [FFAE00]490%[-] of Attack on [FFFFFF]all enemies[-] and restores the HP of all allies by [FFAE00]80%[-] of damage dealt."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "613261",
    "613262",
    "800001",
    "613273",
    "613285",
    "613284",
    "613288",
    "612886",
    "613294",
    "613298",
    "613299"
   ],
   "hiddenPassives": 2
  },
  "2390144": {
   "name": {
    "it": "Spora inquietante",
    "en": "Creepy Spore"
   },
   "description": {
    "it": "Una spora colma di una terribile energia. Coloro che vi entrano in contatto possono essere profondamente corrotti.",
    "en": "A spore filled with atrocious energy. Those who come in contact with it can be deeply corrupted."
   },
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Spine offensive",
      "en": "Offensive Thorns"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]160%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]160%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_spore_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Sputo acido",
      "en": "Acid Spit"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni pari al [FFAE00]150%[-] dell'Attacco, poi applica [00D5FF]Avvelenamento[-] e [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Avvelenamento: Danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts damage equal to [FFAE00]150%[-] of Attack, then applies [00D5FF]Poison[-] and [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "[00D5FF]Rimuove Atteggiamenti e Buff[-] da [FFFFFF]tutti i nemici[-], infligge danni pari al [FFAE00]240%[-] dell'Attacco, poi applica [00D5FF]Avvelenamento[-] e [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Avvelenamento: Danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "[00D5FF]Removes Buffs and Stances[-] from [FFFFFF]all enemies[-], inflicts damage equal to [FFAE00]240%[-] of Attack, then applies [00D5FF]Poison[-] and [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_spore_type01_skill_02_01"
    },
    {
     "slot": "special",
     "name": {
      "it": "Bomba di tossine",
      "en": "Toxin Bomb"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_spore_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901576",
    "901572",
    "901569",
    "901516",
    "901518",
    "901507",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390145": {
   "name": {
    "it": "Fonte della corruzione",
    "en": "Source of the Corruption"
   },
   "description": {
    "it": "La fonte della corruzione che ha prodotto inquietanti spore. Si dice che sia nata dalle radici marce di Yggdrasil.",
    "en": "The source of the corruption that had been producing the creepy spores. It is said to be born from the rotten roots of Yggdrasil."
   },
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza demoniaca",
      "en": "Demonic Force"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Estorce[-] l'[FFAE00]50%[-] Attacco e Difesa per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Estorsione: riduce le statistiche del bersaglio e aumenta le proprie statistiche della stessa quantità.[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Extorts[-] [FFAE00]50%[-] Attack and Defense for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Extort: Decreases the target's stats and increases own stats by the same amount.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]340%[-] dell'Attacco a [FFFFFF]un nemico[-]. [00D5FF]Estorce[-] l'[FFAE00]80%[-] Attacco e Difesa per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Estorsione: riduce le statistiche del bersaglio e aumenta le proprie statistiche della stessa quantità.[-]",
       "en": "Inflicts damage equal to [FFAE00]340%[-] of Attack on [FFFFFF]one enemy[-]. [00D5FF]Extorts[-] [FFAE00]80%[-] Attack and Defense for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Extort: Decreases the target's stats and increases own stats by the same amount.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_demon_type01_skill_01_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Pungiglione perforante",
      "en": "Piercing Stinger"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-], poi riduce i PS massimi del [FFAE00]25%[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Perforazione: x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-], then decreases Max HP by [FFAE00]25%[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]340%[-] dell'Attacco a [FFFFFF]un nemico[-], poi riduce i PS massimi del [FFAE00]40%[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Perforazione: x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]340%[-] of Attack on [FFFFFF]one enemy[-], then decreases Max HP by [FFAE00]40%[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_demon_type01_skill_05_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Raffica di spine",
      "en": "Hail of Thorns"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]tutti i nemici[-] e [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] per [FFAE00]1 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]1 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_demon_type01_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Pungiglione contorto",
      "en": "Twisted Stinger"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari al [FFAE00]500%[-] dell'Attacco tramite contrattacco quando attaccato.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]500%[-] of Attack via counter when attacked."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_nidhogg_demon_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ira del drago",
      "en": "Wrath of the Dragon"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]580%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]580%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_demon_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Pungiglione perforante",
      "en": "Piercing Stinger"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901581",
    "901582",
    "901506",
    "901572",
    "901569",
    "901511",
    "901518",
    "901507",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390146": {
   "name": {
    "it": "Nidhoggr Corrotto",
    "en": "Corrupted Nidhoggr"
   },
   "description": {
    "it": "Una bestia demoniaca che vaga nel mondo sotterraneo sotto Yggdrasil. La profonda corruzione lo porta a volere una cosa sola: uccidere tutti gli intrusi.",
    "en": "A demonic beast who roams the subterranean world below Yggdrasil. The deep-seated corruption has left it with only one desire: to kill any intruders."
   },
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Furia",
      "en": "Rampage"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]195%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]195%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]325%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]325%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Emissione oscura",
      "en": "Dark Emission"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mega gobba",
      "en": "Massive Bump"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rovina[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rovina: rimuove gli effetti Debuff e infligge [FFAE00]+[-][FFAE00]20%[-] danni per Debuff.[-]",
       "en": "Inflicts [00D5FF]Ruin[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Ruin: Removes Debuff effects and inflicts [FFAE00]+[-][FFAE00]20%[-] damage per Debuff.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ira degli Dèi",
      "en": "Wrath of the Gods"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]650%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nApplica [FFAE00]3[-] effetti [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]20%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]650%[-] of Attack on [FFFFFF]all enemies[-]. Applies [FFAE00]3[-] [00D5FF]Ignite[-] effects for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]20%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_upper_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901583",
    "901506",
    "901572",
    "901569",
    "901511",
    "901518",
    "901514",
    "901515",
    "901507",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390147": {
   "name": {
    "it": "Spora inquietante",
    "en": "Creepy Spore"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Sferzata folle",
      "en": "Crazy Lash"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_spore_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Sputo acido",
      "en": "Acid Spit"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]170%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge danni [00D5FF]Corrosione[-] pari al [FFAE00]10%[-] dei PS rimanenti.\\n\\n[00D5FF]※Corrosione: danni aggiuntivi alla fine di ogni turno. (Può essere accumulato)[-]",
       "en": "Inflicts damage equal to [FFAE00]170%[-] of Attack on [FFFFFF]all enemies[-] and inflicts [00D5FF]Corrosion[-] damage equal to [FFAE00]10%[-] of the remaining HP.\\n\\n[00D5FF]※Corrosion: Additional damage at the end of every turn. (Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e applica [FFAE00]2[-] effetti [00D5FF]Corrosione[-] pari al [FFAE00]10%[-] dei PS rimanenti.\\n\\n[00D5FF]※Corrosione: danni aggiuntivi alla fine di ogni turno. (Può essere accumulato)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-] and applies [FFAE00]2[-] [00D5FF]Corrosion[-] effects equal to [FFAE00]10%[-] of the remaining HP.\\n\\n[00D5FF]※Corrosion: Additional damage at the end of every turn. (Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_spore_type01_skill_02_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Assorbimento nero",
      "en": "Black Absorption"
     },
     "ranks": [
      {
       "it": "Applica un effetto per [FFAE00]2 turno/i[-] che ripristina [FFAE00]20%[-] dei danni subiti da un attacco, poi infligge danni [00D5FF]Spora[-] pari al [FFAE00]1%[-] dei PS massimi su sé stesso.\\n\\n[00D5FF]※Spora: Danni aggiuntivi alla fine di ogni turno. (Può essere accumulato)[-]",
       "en": "Applies an effect for [FFAE00]2 turn(s)[-] which restores [FFAE00]20%[-] of damage taken when attacked, then inflicts [00D5FF]Spore[-] damage equal to [FFAE00]1%[-] of Max HP on self.\\n\\n[00D5FF]※Spore: Additional damage at the end of every turn. (Can be stacked)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_nidhogg_spore_type01_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Spine difensive",
      "en": "Defensive Thorns"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che infligge danni pari al [FFAE00]500%[-] dell'Attacco con un contrattacco quando viene attaccato. Se il nemico ha almeno [FFAE00]3[-] effetti [00D5FF]Corrosione[-], gli effetti vengono rimossi e viene applicato [00D5FF]Stordimento[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-], inflicting damage equal to [FFAE00]500%[-] of Attack via counter when attacked. If the enemy has [FFAE00]3[-] or more [00D5FF]Corrosion[-] effects, the effects are removed and [00D5FF]Stun[-] is applied for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_nidhogg_spore_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Bomba di tossine",
      "en": "Toxin Bomb"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]380%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]380%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_spore_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Spine offensive",
      "en": "Offensive Thorns"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco su [FFFFFF]un nemico[-], poi infligge danni aggiuntivi pari a [FFAE00][FFAE00]3[-]%[-] dei PS massimi. Se il nemico ha almeno 3 effetti [00D5FF]Corrosione[-], gli effetti vengono rimossi e viene applicato [00D5FF]Stordimento[-] per {turn_2_val}.\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-], then inflicts additional damage equal to [FFAE00][FFAE00]3[-]%[-] of Max HP. If the enemy has 3 or more [00D5FF]Corrosion[-] effects, the effects are removed and [00D5FF]Stun[-] is applied for {turn_2_val}.\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco su [FFFFFF]un nemico[-], poi infligge danni aggiuntivi pari a [FFAE00][FFAE00]3[-]%[-] dei PS massimi. Se il nemico ha almeno 3 effetti [00D5FF]Corrosione[-], gli effetti vengono rimossi e viene applicato [00D5FF]Stordimento[-] per {turn_2_val}.\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-], then inflicts additional damage equal to [FFAE00][FFAE00]3[-]%[-] of Max HP. If the enemy has 3 or more [00D5FF]Corrosion[-] effects, the effects are removed and [00D5FF]Stun[-] is applied for {turn_2_val}.\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco su [FFFFFF]un nemico[-], poi infligge danni aggiuntivi pari a [FFAE00][FFAE00]3[-]%[-] dei PS massimi. Se il nemico ha almeno 3 effetti [00D5FF]Corrosione[-], gli effetti vengono rimossi e viene applicato [00D5FF]Stordimento[-] per {turn_2_val}.\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-], then inflicts additional damage equal to [FFAE00][FFAE00]3[-]%[-] of Max HP. If the enemy has 3 or more [00D5FF]Corrosion[-] effects, the effects are removed and [00D5FF]Stun[-] is applied for {turn_2_val}.\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "atk",
     "icon": null
    }
   ],
   "draw": {
    "a": 50,
    "b": 50
   },
   "passives": [
    "800002",
    "901585",
    "901586",
    "901576",
    "901571",
    "901512",
    "901517",
    "901518",
    "901514",
    "901515",
    "901507",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390148": {
   "name": {
    "it": "Fonte della corruzione",
    "en": "Source of the Corruption"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza demoniaca",
      "en": "Demonic Force"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nRiduce [00D5FF]le statistiche relative alla Difesa[-] di [FFAE00]30%[-] per [FFAE00]1 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\nDecreases [00D5FF]Defense-related stats[-] by [FFAE00]30%[-] for [FFAE00]1 turn(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nRiduce [00D5FF]le statistiche relative alla Difesa[-] di [FFAE00]40%[-] per [FFAE00]2 turno/i[-].",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-].\\nDecreases [00D5FF]Defense-related stats[-] by [FFAE00]40%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_demon_type01_skill_01_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Pungiglione perforante",
      "en": "Piercing Stinger"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]290%[-] dell'Attacco a [FFFFFF]un nemico[-], [00D5FF]impedisce le Mosse Finali[-] per [FFAE00]2 turno/i[-], poi [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale alla fine del turno nemico.",
       "en": "Inflicts damage equal to [FFAE00]290%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]disables Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-] at the end of the enemy's turn."
      },
      {
       "it": "Infligge danni pari al [FFAE00]370%[-] dell'Attacco a [FFFFFF]un nemico[-], [00D5FF]impedisce le Mosse Finali[-] per [FFAE00]2 turno/i[-], poi [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale alla fine del turno nemico.",
       "en": "Inflicts damage equal to [FFAE00]370%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]disables Ultimate Moves[-] for [FFAE00]2 turn(s)[-], then [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-] at the end of the enemy's turn."
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_demon_type01_skill_05_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pungiglione contorto",
      "en": "Twisted Stinger"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari al [FFAE00]500%[-] dell'Attacco tramite contrattacco quando attaccato.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]500%[-] of Attack via counter when attacked."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_nidhogg_demon_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ira del drago",
      "en": "Wrath of the Dragon"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]600%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_demon_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Pungiglione perforante",
      "en": "Piercing Stinger"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901587",
    "901506",
    "901571",
    "901512",
    "901517",
    "901518",
    "901514",
    "901515",
    "901507",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390149": {
   "name": {
    "it": "Nidhoggr Corrotto",
    "en": "Corrupted Nidhoggr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Furia",
      "en": "Rampage"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]300%[-] dell'Attacco.",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]300%[-] of Attack."
      },
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]400%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]400%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_01_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Emissione oscura",
      "en": "Dark Emission"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]30%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]30%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_02_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mega gobba",
      "en": "Massive Bump"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Detonazione[-] pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Detonazione: [FFAE00]20%[-] danni aggiuntivi [FFAE00]per ogni sfera[-] nella Barra Mossa finale del bersaglio.[-]",
       "en": "Inflicts [00D5FF]Detonate[-] damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Detonate: [FFAE00]20%[-] additional damage [FFAE00]per orb[-] in the target's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Mega morso",
      "en": "Massive Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ira degli Dèi",
      "en": "Wrath of the Gods"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]650%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e causa [00D5FF]Esplosione[-] dopo [FFAE00]1 turno/i[-].\\n\\n[00D5FF]*Esplosione: danni aggiuntivi pari al [FFAE00]100%[-] dei danni inflitti dopo un certo numero di turni.[-]",
       "en": "Inflicts damage equal to [FFAE00]650%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Explodes[-] after [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Explosion: Additional damage equal to [FFAE00]100%[-] of damage dealt after a certain number of turns.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_upper_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901589",
    "901590",
    "901506",
    "901571",
    "901517",
    "901518",
    "901512",
    "901514",
    "901515",
    "901507",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390150": {
   "name": {
    "it": "Spora inquietante",
    "en": "Creepy Spore"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Sferzata folle",
      "en": "Crazy Lash"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]155%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]155%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]30%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]30%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_spore_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Sputo acido",
      "en": "Acid Spit"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Domatura[-] pari al [FFAE00]180%[-] della Difesa su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Domatura: danni inflitti +[FFAE00]50%[-] per Atteggiamento attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Quell[-] damage equal to [FFAE00]180%[-] of Defense on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Quell: Damage dealt +[FFAE00]50%[-] per active Stance on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Domatura[-] pari al [FFAE00]250%[-] della Difesa su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Domatura: danni inflitti +[FFAE00]50%[-] per Atteggiamento attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Quell[-] damage equal to [FFAE00]250%[-] of Defense on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Quell: Damage dealt +[FFAE00]50%[-] per active Stance on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_spore_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Assorbimento nero",
      "en": "Black Absorption"
     },
     "ranks": [
      {
       "it": "Aumenta l'Attacco di [FFAE00]60%[-] per [FFAE00]2 turno/i[-].",
       "en": "Increases Attack by [FFAE00]60%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_nidhogg_spore_type01_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Spine difensive",
      "en": "Defensive Thorns"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari al [FFAE00]500%[-] dell'Attacco tramite contrattacco quando attaccato.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]500%[-] of Attack via counter when attacked."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_nidhogg_spore_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Bomba di tossine",
      "en": "Toxin Bomb"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]480%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]100%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]480%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]100%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_spore_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Spine offensive",
      "en": "Offensive Thorns"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901591",
    "901592",
    "901506",
    "901571",
    "901512",
    "901517",
    "901518",
    "901514",
    "901515",
    "901507",
    "901521",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390151": {
   "name": {
    "it": "Fonte della corruzione",
    "en": "Source of the Corruption"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza demoniaca",
      "en": "Demonic Force"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Azione sotto copertura[-] pari al [FFAE00]200%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Azione sotto copertura: [FFAE00]+[-][FFAE00]50%[-][-] danni inflitti per ogni Oscurità sul bersaglio.",
       "en": "Inflicts [00D5FF]Covert Action[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Covert Action: [FFAE00]+[-][FFAE00]50%[-][-] damage dealt per Darkness on target."
      },
      {
       "it": "Infligge danni [00D5FF]Azione sotto copertura[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Azione sotto copertura: [FFAE00]+[-][FFAE00]50%[-][-] danni inflitti per ogni Oscurità sul bersaglio.",
       "en": "Inflicts [00D5FF]Covert Action[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Covert Action: [FFAE00]+[-][FFAE00]50%[-][-] damage dealt per Darkness on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_demon_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Pungiglione perforante",
      "en": "Piercing Stinger"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]240%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]240%[-] of Attack."
      },
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]360%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]360%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_demon_type01_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pungiglione contorto",
      "en": "Twisted Stinger"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari a [FFAE00]500%[-] dell'Attacco con un contrattacco quando ne subisce uno. Applica [00D5FF]Furto di vita[-] per il [FFAE00]100%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]500%[-] of Attack via counter when attacked. [00D5FF]Lifesteals[-] [FFAE00]100%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_nidhogg_demon_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ira del drago",
      "en": "Wrath of the Dragon"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]520%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Estorce[-] l'[FFAE00]30%[-] Attacco e Difesa per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Estorsione: riduce le statistiche del bersaglio e aumenta le proprie statistiche della stessa quantità.[-]",
       "en": "Inflicts damage equal to [FFAE00]520%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Extorts[-] [FFAE00]30%[-] Attack and Defense for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Extort: Decreases the target's stats and increases own stats by the same amount.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_demon_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Pungiglione perforante",
      "en": "Piercing Stinger"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-]."
      }
     ],
     "kind": "atk",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901587",
    "901506",
    "901571",
    "901512",
    "901517",
    "901518",
    "901514",
    "901515",
    "901507",
    "901522",
    "901530",
    "901574"
   ],
   "hiddenPassives": 3
  },
  "2390152": {
   "name": {
    "it": "Nidhoggr Corrotto",
    "en": "Corrupted Nidhoggr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 6,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Furia",
      "en": "Rampage"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]195%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]195%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]325%[-] dell'Attacco a [FFFFFF]un nemico[-].\\nCausa [00D5FF]Sanguinamento[-] per [FFAE00]2 turno/i[-] ai bersagli.\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]325%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Emissione oscura",
      "en": "Dark Emission"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. [00D5FF]Avvelena[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Poisons[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Mega morso",
      "en": "Massive Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_nidhogg_upper_type01_skill_04"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Agonia mortale",
      "en": "Death Throes"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che riduce del [FFAE00]20%[-] i danni subiti per [FFAE00]2 turno/i[-] e applica [00D5FF]Riflessione[-] sul [FFAE00]100%[-] dei danni subiti.\\n[00D5FF]※Riflessione: Restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance that decreases damage taken by [FFAE00]20%[-] for [FFAE00]2 turn(s)[-], [00D5FF]Reflecting[-] [FFAE00]100%[-] of damage taken.\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_nidhogg_upper_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ira degli Dèi",
      "en": "Wrath of the Gods"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]650%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Applica [FFAE00]6[-] effetti [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]20%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]650%[-] of Attack on [FFFFFF]all enemies[-]. Applies [FFAE00]6[-] [00D5FF]Ignite[-] effects for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]20%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_nidhogg_upper_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "800002",
    "901595",
    "901596",
    "901506",
    "901517",
    "901518",
    "901514",
    "901515",
    "901507",
    "901522",
    "901525",
    "901530",
    "901574"
   ],
   "hiddenPassives": 2
  },
  "2390401": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]un nemico[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]350%[-] dell'Attacco su [FFFFFF]un nemico[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_debuff_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]40%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]40%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]40%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]40%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "[00D5FF]Blocca tutti gli effetti abilità di [FFFFFF]tutti i nemici[-], inclusi quelli delle Mosse finali[-] e riduce le sue statistiche relative all'Attacco del [FFAE00]20%[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]",
       "en": "[00D5FF]Blocks all skill effects of [FFFFFF]all enemies[-] including those of Ultimate Moves[-] and decreases their Attack-related stats by [FFAE00]20%[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_hraesvelgr_type01_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] della Difesa a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Defense on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "952101",
    "952102",
    "800002",
    "952109",
    "952117",
    "952118",
    "952119",
    "952124",
    "952111",
    "952113",
    "952114"
   ],
   "hiddenPassives": 4
  },
  "2390402": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]un nemico[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]350%[-] dell'Attacco su [FFFFFF]un nemico[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_debuff_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]350%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]1000%[-] dell'Attacco su [FFFFFF]tutti i nemici[-] e [00D5FF]disabilita le sue abilità di Attacco, Buff, Debuff, Atteggiamento e Mossa finale[-].\\n[00D5FF](Gli attacchi contro i nemici con la Protezione di Hraesvelgr mancano automaticamente)[-]",
       "en": "Inflicts damage equal to [FFAE00]1000%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]disables their Attack, Buff, Debuff, Stance, and Ultimate Move skills[-].\\n[00D5FF](Attacks against enemies with Hraesvelgr's Protection miss)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]40%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]40%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "952103",
    "952104",
    "800002",
    "952109",
    "952117",
    "952118",
    "952120",
    "952125",
    "952111",
    "952113",
    "952114"
   ],
   "hiddenPassives": 6
  },
  "2390403": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo del tuono",
      "en": "Lightning Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]un nemico[-] e ne [00D5FF]rilascia[-] l'[FFAE00]130%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Releases[-] [FFAE00]130%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]200%[-] dell'Attacco su [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Squarcio aereo",
      "en": "Air Break"
     },
     "ranks": [
      {
       "it": "[00D5FF]Impedisce l'uso di abilità[-] di [FFFFFF]tutti i nemici[-] nell'ordine seguente: [00D5FF]Atteggiamento, Debuff, Buff, Attacco, Mossa finale[-].",
       "en": "[00D5FF]Disables skill usage[-] of [FFFFFF]all enemies[-] in the following order: [00D5FF]Stance, Debuff, Buff, Attack, Ultimate Move[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_hraesvelgr_type01_skill_06"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco su [FFFFFF]un nemico[-] e [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali[-] per [FFAE00]2 turno/i[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "952105",
    "952106",
    "800002",
    "952109",
    "952117",
    "952128",
    "952121",
    "952123",
    "952111",
    "952113",
    "952114"
   ],
   "hiddenPassives": 6
  },
  "2390404": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "description": {
    "it": "Un essere leggendario che risiede nei lontani confini settentrionali del mondo. Le sue ali sono la fonte di ogni vento.",
    "en": "A legendary being that exists on the northernmost edge of the world. Its wings are the source of all winds."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Affondo opprimente",
      "en": "Hunting Dive"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tornado abbattente",
      "en": "Flap Tornado"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]200%[-] dell'Attacco su [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Carica[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Carica: Ignora Difesa.[-]\\n[00D5FF]※Sanguinamento: Danni aggiuntivi pari a [FFAE00]90%[-] dei danni subiti alla fine di ogni turno.[-]",
       "en": "Inflicts [00D5FF]Charge[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Charge: Ignores Defense.[-]\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Getto d'aria",
      "en": "Air Blast"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Infligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_hraesvelgr_type01_skill_03_debuff_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Esplosione di vento",
      "en": "Wind Explosion"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]30%[-] le statistiche di base per [FFAE00]2 turno/i[-] e ottiene [00D5FF]Evasione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Evasione: immune ad Attacco e Abilità Attacco debuff.[-]",
       "en": "Increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-] and gains [00D5FF]Evasion[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Evasion: Immune to Attack and Debuff Atk Skills.[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_hraesvelgr_type01_skill_05"
    },
    {
     "slot": "special",
     "name": {
      "it": "Corrente squarciante",
      "en": "Jetstream"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]60%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Lifesteals[-] [FFAE00]60%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_hraesvelgr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "952107",
    "952108",
    "800002",
    "952109",
    "952117",
    "952128",
    "952122",
    "952111",
    "952113",
    "952114"
   ],
   "hiddenPassives": 7
  },
  "2390411": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza vitale",
      "en": "Life Force"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]1[-] effetto [00D5FF]Seme della vita[-] su di sé per [FFAE00]2 turno/i[-] e infligge danni [00D5FF]Carica[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Seme della vita: quando subisce un attacco durante il turno del nemico, [FFAE00]1[-] applicazione viene rimossa e si verifica un ripristino dei PS del [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Carica: Ignora Difesa.[-]",
       "en": "Applies [FFAE00]1[-] [00D5FF]Seed of Life[-] effect to self for [FFAE00]2 turn(s)[-] and inflicts [00D5FF]Charge[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Seed of Life: When attacked during the enemy's turn, [FFAE00]1[-] instance is removed and HP is restored by [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Charge: Ignores Defense.[-]"
      },
      {
       "it": "Applica [FFAE00]2[-] effetti [00D5FF]Seme della vita[-] su di sé per [FFAE00]2 turno/i[-] e infligge danni [00D5FF]Carica[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Seme della vita: quando subisce un attacco durante il turno del nemico, [FFAE00]1[-] applicazione viene rimossa e si verifica un ripristino dei PS del [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Carica: Ignora Difesa.[-]",
       "en": "Applies [FFAE00]2[-] [00D5FF]Seed of Life[-] effects to self for [FFAE00]2 turn(s)[-] and inflicts [00D5FF]Charge[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Seed of Life: When attacked during the enemy's turn, [FFAE00]1[-] instance is removed and HP is restored by [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Charge: Ignores Defense.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_03_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco e applica [FFAE00]2[-] effetti [00D5FF]Torrente[-] a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Torrente: danni aggiuntivi pari al [FFAE00][FFAE00]10%[-][-] dei PS massimi quando usa le abilità.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack and applies [FFAE00]2[-] [00D5FF]Torrent[-] effects on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Torrent: Additional damage equal to [FFAE00][FFAE00]10%[-][-] of Max HP when using skills.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_debuff_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Stagno ghiacciato",
      "en": "Icy Pond"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], rimuove tutti gli effetti [00D5FF]Torrente[-] dai nemici colpiti, poi applica [00D5FF]Congelamento[-] sui nemici a cui era stato rimosso l'effetto [00D5FF]Torrente[-] per [FFAE00]1 turno[-]. Infligge danni pari al [FFAE00]20%[-] dei [00D5FF]PS rimanenti[-] quando l'effetto viene rimosso a causa di un'abilità, un'Unica, un Comandamento o turni scaduti.\\n\\n[00D5FF]※Congelamento: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-], removes all [00D5FF]Torrent[-] effects from enemies hit, then [00D5FF]Freezes[-] enemies that had the [00D5FF]Torrent[-] effect removed for [FFAE00]1 turn[-]. Inflicts damage equal to [FFAE00]20%[-] of [00D5FF]remaining HP[-] when the effect is removed due to a skill, Unique, Commandment, or elapsed turns.\\n\\n[00D5FF]※Freeze: Incapacitates target. Effect is removed when target is attacked.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_06_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Incursione ghiacciata",
      "en": "Frosty Raid"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Impennata[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Impennata: [FFAE00]+[-][FFAE00]30%[-] di danni inflitti per Torrente al bersaglio.[-]",
       "en": "Inflicts [00D5FF]Surge[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Surge: [FFAE00]+[-][FFAE00]30%[-] damage dealt per Torrent on target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "953501",
    "953502",
    "800002",
    "953522",
    "953509",
    "953511",
    "953526",
    "953534",
    "612891",
    "612892",
    "953514",
    "953517"
   ],
   "hiddenPassives": 10
  },
  "2390412": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raffica ardente",
      "en": "Fierce Rush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]400%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_01_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica [FFAE00]1[-] effetto [00D5FF]Torrente[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Torrente: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi quando usa le abilità.\\n(Può essere accumulato)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies [FFAE00]1[-] [00D5FF]Torrent[-] effect on [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Torrent: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP when using skills.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica [FFAE00]2[-] effetti [00D5FF]Torrente[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Torrente: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi quando usa le abilità.\\n(Può essere accumulato)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies [FFAE00]2[-] [00D5FF]Torrent[-] effects on [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Torrent: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP when using skills.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Circolo d'acqua",
      "en": "Water Loop"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Impennata[-] pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Impennata: [FFAE00]+[-][FFAE00]30%[-] di danni inflitti per Torrente al bersaglio.[-]",
       "en": "Inflicts [00D5FF]Surge[-] damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Surge: [FFAE00]+[-][FFAE00]30%[-] damage dealt per Torrent on target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_02_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_debuff_atk"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Impennata[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Impennata: [FFAE00]+[-][FFAE00]30%[-] di danni inflitti per Torrente al bersaglio.[-]",
       "en": "Inflicts [00D5FF]Surge[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Surge: [FFAE00]+[-][FFAE00]30%[-] damage dealt per Torrent on target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "953503",
    "953504",
    "800002",
    "953523",
    "953509",
    "953511",
    "953526",
    "953534",
    "612891",
    "612892",
    "953514",
    "953516"
   ],
   "hiddenPassives": 11
  },
  "2390413": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Circolo d'acqua",
      "en": "Water Loop"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Impennata[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Impennata: [FFAE00]+[-][FFAE00]30%[-] di danni inflitti per Torrente al bersaglio.[-]",
       "en": "Inflicts [00D5FF]Surge[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Surge: [FFAE00]+[-][FFAE00]30%[-] damage dealt per Torrent on target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Impennata[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Impennata: [FFAE00]+[-][FFAE00]30%[-] di danni inflitti per Torrente al bersaglio.[-]",
       "en": "Inflicts [00D5FF]Surge[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Surge: [FFAE00]+[-][FFAE00]30%[-] damage dealt per Torrent on target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_02_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Pioggia intensa",
      "en": "Splash Shower"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica [FFAE00]1[-] effetto [00D5FF]Torrente[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Torrente: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi quando usa le abilità.\\n(Può essere accumulato)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies [FFAE00]1[-] [00D5FF]Torrent[-] effect on [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Torrent: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP when using skills.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica [FFAE00]2[-] effetti [00D5FF]Torrente[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Torrente: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi quando usa le abilità.\\n(Può essere accumulato)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies [FFAE00]2[-] [00D5FF]Torrent[-] effects on [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Torrent: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP when using skills.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_05_debuff_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Raffica ardente",
      "en": "Fierce Rush"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]20000%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF](L'attacco non va a segno contro nemici con Protezione di Eikthyrnir)[-]",
       "en": "Inflicts damage equal to [FFAE00]20000%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF](Results in a miss when attacking enemies with Eikthyrnir's Protection)[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_01_atk"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Bomba di Bolle",
      "en": "Bubble Bomb"
     },
     "ranks": [
      {
       "it": "Applica [00D5FF]Ossidazione[-] su [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Ossidazione: riduce i ranghi abilità e infligge danni pari al [FFAE00]10%[-] dei PS massimi per [FFAE00]ogni[-] abilità il cui rango è stato ridotto alla fine del turno del nemico.[-]",
       "en": "Applies [00D5FF]Oxidize[-] on [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Oxidize: Decreases skill ranks and inflicts damage equal to [FFAE00]10%[-] of Max HP for [FFAE00]every[-] skill that had its rank decreased at the end of the enemy's turn.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_eikthyrnir_type01_skill_08"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Impennata[-] pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Impennata: [FFAE00]+[-][FFAE00]30%[-] di danni inflitti per Torrente al bersaglio.[-]",
       "en": "Inflicts [00D5FF]Surge[-] damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Surge: [FFAE00]+[-][FFAE00]30%[-] damage dealt per Torrent on target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "953505",
    "953506",
    "800002",
    "953524",
    "953509",
    "953511",
    "953526",
    "953534",
    "612891",
    "612892",
    "953514",
    "953517"
   ],
   "hiddenPassives": 11
  },
  "2390414": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "description": {
    "it": "Un alce che si dice viva sul tetto del Valhalla. L'acqua che gocciola dalle corna di Eikthyrnir fluisce verso Hvergelmir, la fonte di tutti i fiumi del mondo.",
    "en": "An elk that is said to live on the roof of Valhalla. The water that drips from the antlers of Eikthyrnir pools at Hvergelmir, the source of all rivers in the world."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Forza vitale",
      "en": "Life Force"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]1[-] effetto [00D5FF]Seme della vita[-] su di sé per [FFAE00]2 turno/i[-] e infligge danni [00D5FF]Carica[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Seme della vita: quando subisce un attacco durante il turno del nemico, [FFAE00]1[-] applicazione viene rimossa e si verifica un ripristino dei PS del [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Carica: Ignora Difesa.[-]",
       "en": "Applies [FFAE00]1[-] [00D5FF]Seed of Life[-] effect to self for [FFAE00]2 turn(s)[-] and inflicts [00D5FF]Charge[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Seed of Life: When attacked during the enemy's turn, [FFAE00]1[-] instance is removed and HP is restored by [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Charge: Ignores Defense.[-]"
      },
      {
       "it": "Applica [FFAE00]2[-] effetti [00D5FF]Seme della vita[-] su di sé per [FFAE00]2 turno/i[-] e infligge danni [00D5FF]Carica[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Seme della vita: quando subisce un attacco durante il turno del nemico, [FFAE00]1[-] applicazione viene rimossa e si verifica un ripristino dei PS del [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Carica: Ignora Difesa.[-]",
       "en": "Applies [FFAE00]2[-] [00D5FF]Seed of Life[-] effects to self for [FFAE00]2 turn(s)[-] and inflicts [00D5FF]Charge[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Seed of Life: When attacked during the enemy's turn, [FFAE00]1[-] instance is removed and HP is restored by [FFAE00][FFAE00]300000[-][-].[-]\\n[00D5FF]※Charge: Ignores Defense.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_03_atk"
    },
    {
     "slot": "b",
     "name": {
      "it": "Frantumazione nebulosa",
      "en": "Hazy Crush"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_skill_04_atk"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Rinfrescata",
      "en": "Refresh"
     },
     "ranks": [
      {
       "it": "Rimuove tutti gli effetti [00D5FF]Seme della vita[-] su di sé e [00D5FF]aumenta tutte le statistiche del [FFAE00]5%[-][-] per ciascun effetto rimosso, poi aumenta le statistiche di base del [FFAE00]30%[-] per [FFAE00]2 turno/i[-].",
       "en": "Removes all [00D5FF]Seed of Life[-] effects from self and [00D5FF]increases all stats by [FFAE00]5%[-][-] for each one removed, then increases basic stats by [FFAE00]30%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_eikthyrnir_type01_skill_07"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Corno Difensivo",
      "en": "Defensive Horn"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] e infligge danni pari a un [FFAE00]1500%[-] dell'Attacco tramite contrattacco quando viene aggredito.\\n\\n[00D5FF](L'attacco non va a segno contro nemici con delle barriere)[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] and inflicts damage equal to [FFAE00]1500%[-] of Attack via counter when attacked.\\n\\n[00D5FF](Results in a miss when attacking enemies with barriers)[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_eikthyrnir_type01_skill_09"
    },
    {
     "slot": "special",
     "name": {
      "it": "Esplosione di vita",
      "en": "Life Explosion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Amplificazione[-] pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Amplificazione: danni inflitti +[FFAE00]30%[-] per Buff attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Amplify[-] damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Amplify: Damage dealt +[FFAE00]30%[-] per active Buff on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_eikthyrnir_type01_special_02"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Nome abilità non deciso",
      "en": "Undecided Skill Name"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      },
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che riduce i danni subiti del {buff_2_val} quando viene attaccato e infligge danni Rovina pari al {buff_1_val} dell’Attacco tramite contrattacco.\\n\\n[00D5FF]※Rovina: aumenta del [FFAE00]30%[-] danni per Debuff sul bersaglio e rimuove i Debuff.[-]",
       "en": "Assumes a Stance for {turn_1_val} which decreases damage taken by {buff_2_val} when attacked and inflicts Ruin damage equal to {buff_1_val} of Attack via counter.\\n\\n[00D5FF]※Ruin: Increases damage by [FFAE00]30%[-] per Debuff on the target and removes Debuffs.[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": null
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "953507",
    "953508",
    "800002",
    "953525",
    "953509",
    "953529",
    "953511",
    "953526",
    "953534",
    "612891",
    "612892",
    "953514",
    "953516"
   ],
   "hiddenPassives": 12
  },
  "2390421": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Infligge [FFAE00]1[-] [00D5FF]Onda lunare[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Onda lunare: tutte le statistiche [FFAE00]-[FFAE00]5%[-][-].\\nApplica Stordimento per [FFAE00]2 turni[-] quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
       "en": "Inflicts [FFAE00]1[-] [00D5FF]Moonwave[-] on [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Moonwave: All stats [FFAE00]-[FFAE00]5%[-][-].\\nStuns for [FFAE00]2 turns[-] when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
      },
      {
       "it": "Infligge [FFAE00]2[-] accumuli di [00D5FF]Onda lunare[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Onda lunare: tutte le statistiche [FFAE00]-[FFAE00]5%[-][-].\\nApplica Stordimento per [FFAE00]2 turni[-] quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
       "en": "Inflicts [FFAE00]2[-] [00D5FF]Moonwave[-] stacks on [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Moonwave: All stats [FFAE00]-[FFAE00]5%[-][-].\\nStuns for [FFAE00]2 turns[-] when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]40%[-] i danni subiti da tutti gli alleati per [FFAE00]3 turno/i[-].\\n[00D5FF](Non può essere accumulato)[-]",
       "en": "Decreases allies' damage taken by [FFAE00]40%[-] for [FFAE00]3 turn(s)[-].\\n[00D5FF](Can be stacked)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che [00D5FF]provoca[-] i nemici e riduce [00D5FF]i danni finali subiti[-] del [FFAE00]60%[-] quando [00D5FF]un alleato[-] subisce un attacco. [00D5FF]Chi ha lanciato l'incantesimo[-] subisce [FFAE00]50%[-] dei danni ridotti.\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which [00D5FF]Taunts[-] enemies and reduces [00D5FF]the final damage taken[-] by [FFAE00]60%[-] when [00D5FF]an ally[-] is attacked. [00D5FF]The caster[-] takes [FFAE00]50%[-] of the reduced damage.\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_hati_type01_skill_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955701",
    "955702",
    "800002",
    "613281",
    "955721",
    "955744",
    "955743",
    "955741",
    "955742"
   ],
   "hiddenPassives": 5
  },
  "2390422": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]190%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]190%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]140%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]140%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]220%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]220%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "Aumenta del [FFAE00]50%[-] le proprie statistiche relative alla Difesa per [FFAE00]2 turno/i[-].",
       "en": "Increases own Defense-related stats by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-] e infligge [00D5FF]Furto di vita[-] al [FFAE00]200%[-] dei danni.\\n\\n[00D5FF]※Furto di vita: cura per una parte dei danni inflitti.[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Lifesteals[-] [FFAE00]200%[-] of the damage.\\n\\n[00D5FF]※Lifesteal: Heals for a portion of the damage dealt.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]560%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]560%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955703",
    "955704",
    "955721",
    "955754",
    "955751",
    "955752",
    "955753",
    "955724",
    "955726",
    "955727"
   ],
   "hiddenPassives": 5
  },
  "2390423": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Morsa stretta",
      "en": "Fierce Bite"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]un nemico[-].",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]one enemy[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]280%[-] dell'Attacco a [FFFFFF]un nemico[-] e applica [00D5FF]Congelamento[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Congelamento: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
       "en": "Inflicts damage equal to [FFAE00]280%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]Freezes[-] them for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Freeze: Incapacitates target. Effect is removed when target is attacked[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\nInfligge [00D5FF]Infezione[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative al Recupero.[-]",
       "en": "Inflicts damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Infects[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "Riduce del [FFAE00]30%[-] le statistiche relative all'Attacco di tutti i nemici e [00D5FF]disattiva le Abilità Buff[-] per [FFAE00]2 turno/i[-].",
       "en": "Decreases the Attack-related stats of all enemies by [FFAE00]30%[-] and [00D5FF]disables Buff Skills[-] for [FFAE00]2 turn(s)[-]."
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Riverbero[-] pari al [FFAE00]300%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Riverbero: +[FFAE00]15%[-] danni inflitti per [FFAE00]ogni[-] Buff, Debuff e Atteggiamento sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Resonance[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Resonance: +[FFAE00]15%[-] damage dealt for [FFAE00]every[-] Buff, Debuff, and Stance on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e infligge danni [00D5FF]Corrosione[-] pari al [FFAE00]20%[-] dei PS massimi per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-] and inflicts [00D5FF]Corrosion[-] damage equal to [FFAE00]20%[-] of Max HP for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Corrosion: Additional damage at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955705",
    "955706",
    "955721",
    "955764",
    "955761",
    "955762",
    "955763",
    "955724",
    "955726",
    "955727"
   ],
   "hiddenPassives": 5
  },
  "2390424": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ululato di massa",
      "en": "Mass Howling"
     },
     "ranks": [
      {
       "it": "Infligge [FFAE00]1[-] [00D5FF]Onda solare[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Onda solare: tutte le statistiche [FFAE00]-[FFAE00]5%[-][-].\\n[FFAE00]1.000.000[-] di danni fissi quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
       "en": "Inflicts [FFAE00]1[-] [00D5FF]Sunwave[-] on [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Sunwave: All stats [FFAE00]-[FFAE00]5%[-][-].\\n[FFAE00]1,000,000[-] fixed damage when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
      },
      {
       "it": "Infligge [FFAE00]2[-] accumuli di [00D5FF]Onda solare[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Onda solare: tutte le statistiche [FFAE00]-[FFAE00]5%[-][-].\\n[FFAE00]1.000.000[-] di danni fissi quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
       "en": "Inflicts [FFAE00]2[-] [00D5FF]Sunwave[-] stacks on [FFFFFF]all enemies[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Sunwave: All stats [FFAE00]-[FFAE00]5%[-][-].\\n[FFAE00]1,000,000[-] fixed damage when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Irascibile",
      "en": "Short Temper"
     },
     "ranks": [
      {
       "it": "Riempie le Barre Mossa finale degli alleati di [FFAE00][FFAE00]3[-] sfera/e[-] ogni turno per [FFAE00]3 turno/i[-].",
       "en": "Fills allies' Ultimate Move Gauges by [FFAE00][FFAE00]3[-] orb(s)[-] every turn for [FFAE00]3 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Aggressione difensiva",
      "en": "Defensive Aggression"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che [00D5FF]provoca[-] i nemici e riduce [00D5FF]i danni finali subiti[-] del [FFAE00]60%[-] quando [00D5FF]un alleato[-] subisce un attacco. [00D5FF]Chi ha lanciato l'incantesimo[-] subisce [FFAE00]50%[-] dei danni ridotti.\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which [00D5FF]Taunts[-] enemies and reduces [00D5FF]the final damage taken[-] by [FFAE00]60%[-] when [00D5FF]an ally[-] is attacked. [00D5FF]The caster[-] takes [FFAE00]50%[-] of the reduced damage.\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_twinwolf_small_skoll_type01_skill_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955707",
    "955708",
    "800002",
    "613281",
    "955721",
    "955774",
    "955773",
    "955771",
    "955772"
   ],
   "hiddenPassives": 5
  },
  "2390425": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 5,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto stellare",
      "en": "Star Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]20%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]20%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Mandria dell'ombra",
      "en": "Shadow Herd"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]220%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]220%[-] of Attack."
      },
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-] e infligge danni pari al [FFAE00]350%[-] dell'Attacco.",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-] and inflicts damage equal to [FFAE00]350%[-] of Attack."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Buco nero dell'ombra",
      "en": "Shadow Black Hole"
     },
     "ranks": [
      {
       "it": "[00D5FF]Estorce[-] del [FFAE00]20%[-] Attacco e Difesa da [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Estorsione: Riduce le statistiche del bersaglio e aumenta le proprie statistiche della stessa quantità.[-]",
       "en": "[00D5FF]Extorts[-] [FFAE00]20%[-] Attack and Defense from [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Extort: Decreases the target's stats and increases own stats by the same amount.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]180%[-] dell'Attacco\\n e applica gli effetti [00D5FF]Avvelenamento e Sanguinamento[-] per [FFAE00]2 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.\\n※Avvelenamento: danni aggiuntivi pari al [FFAE00]60%[-] dei danni inflitti alla fine di ogni turno.[-]",
       "en": "Inflicts damage equal to [FFAE00]180%[-] of Attack and applies [00D5FF]Poison and Bleed[-] effects for [FFAE00]2 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.\\n※Poison: Additional damage equal to [FFAE00]60%[-] of damage dealt at the end of every turn.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora lunare",
      "en": "Moonlight Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_hati_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955709",
    "955710",
    "800001",
    "955721",
    "955784",
    "955781",
    "955786",
    "955763",
    "955724",
    "955730",
    "955726",
    "955727"
   ],
   "hiddenPassives": 9
  },
  "2390426": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Diffusore solare",
      "en": "Solar Diffusion"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]170%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]170%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Palla scintillante",
      "en": "Flare Ball"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]240%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]240%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]380%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]4[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]380%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]4[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Benedizione solare",
      "en": "Solar Blessing"
     },
     "ranks": [
      {
       "it": "[00D5FF]Provoca[-] i nemici per [FFAE00]2 turno/i[-], applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] su tutti i nemici per [FFAE00]3 turni[-] quando subisce un attacco.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]\\n[00D5FF]※Incendio: danni subiti dai bersagli [FFAE00]+10%[-] (Può essere accumulato).[-]",
       "en": "[00D5FF]Taunts[-] enemies for [FFAE00]2 turn(s)[-], applying [FFAE00]2[-] [00D5FF]Ignite[-] effects on all enemies for [FFAE00]3 turns[-] when attacked.\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]\\n[00D5FF]※Ignite: Damage taken by targets [FFAE00]+10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Artiglio del lupo",
      "en": "Wolf Claw"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ne [00D5FF]rilascia[-] l'[FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio: infligge danni aggiuntivi usando quelli rimasti nei debuff Shock, Avvelenamento e Sanguinamento.[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-] and [00D5FF]Releases[-] [FFAE00]100%[-].\\n\\n[00D5FF]※Release: Deals additional damage using remaining damage in Shock, Poison, and Bleed Debuffs.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Meteora del Sol nascente",
      "en": "Rising Sun Meteor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]490%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e ripristina i PS di tutti gli alleati del [FFAE00]80%[-] dei danni inflitti.",
       "en": "Inflicts damage equal to [FFAE00]490%[-] of Attack on [FFFFFF]all enemies[-] and restores the HP of all allies by [FFAE00]80%[-] of damage dealt."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_twinwolf_big_skoll_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955711",
    "955712",
    "800001",
    "955721",
    "955794",
    "955791",
    "955796",
    "955753",
    "955724",
    "955730",
    "955726",
    "955727"
   ],
   "hiddenPassives": 8
  },
  "2390427": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
   },
   "description": {
    "it": "Il Gigante del fuoco Surtr, che si dice porterà alla fine del mondo nel momento in cui lascerà Muspelheim, e la fiamma che arde sin dai tempi del vuoto primordiale si sono uniti, irrompendo come un unico essere.",
    "en": "Fire Giant Surtr, said to bring the world's end the moment he leaves Muspelheim, and the flame that has burned since the primordial void, have become one, surging as a single being."
   },
   "race": 6,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Ombra di Hati",
      "en": "Hati's Shadow"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-], poi infligge danni [00D5FF]Co-distruzione[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Co-distruzione: [FFAE00]40%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-] then inflicts [00D5FF]Co-destruction[-] damage.\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Co-destruction: [FFAE00]40%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Maestosità di Skoll",
      "en": "Skoll's Majesty"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]260%[-] dell'Attacco. Applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti da uno o più bersagli [FFAE00]+[-][FFAE00]10%[-] (possono essere accumulati).[-]",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]260%[-] of Attack. Applies [FFAE00]2[-] [00D5FF]Ignite[-] effects for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_06_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Runa della penetrazione",
      "en": "Rune of Penetration"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]1 turno/i[-] e infligge danni pari al [FFAE00]250%[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]1 turn(s)[-] and inflicts damage equal to [FFAE00]250%[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_09"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Incantesimo di Kenaz",
      "en": "Spell of Kenaz"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fuoco della provvidenza[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fuoco della provvidenza: si verifica un effetto aggiuntivo se l'abilità del nemico non corrisponde al [FFAE00]tipo di abilità[-] visualizzato.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00]10.000[-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Fire of Providence[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Fire of Providence: Additional effect occurs if the enemy's skill does not match the displayed [FFAE00]skill type[-].[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00]10,000[-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Furia di Fafnir",
      "en": "Fafnir's Wrath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]un nemico[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]one enemy[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Runa della penetrazione",
      "en": "Rune of Penetration"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_09"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390428": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Scintilla di Ratatoskr",
      "en": "Ratatoskr's Sparkle"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-], poi infligge danni [00D5FF]Co-distruzione[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Co-distruzione: [FFAE00]40%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-] then inflicts [00D5FF]Co-destruction[-] damage.\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Co-destruction: [FFAE00]40%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Riaccensione",
      "en": "Reignition"
     },
     "ranks": [
      {
       "it": "Ottiene [FFAE00]2[-] effetti [00D5FF]Attacco incendiario[-] per [FFAE00]3 turni[-].\\n\\n[00D5FF]※Attacco incendiario: infligge l'effetto Incendio al bersaglio quando usa un'Abilità Attacco diversa dalla Mossa finale.\\n(Accumulo massimo: 9 volte)[-]",
       "en": "Gains [FFAE00]2[-] [00D5FF]Igniting Attack[-] effects for [FFAE00]3 turns[-].\\n\\n[00D5FF]※Igniting Attack: Inflicts the Ignite effect on the target when using an Attack Skill other than the Ultimate Move.\\n(Stacks up to 9 times)[-]"
      },
      {
       "it": "Ottiene [FFAE00]2[-] effetti [00D5FF]Attacco incendiario[-] e un [00D5FF]Aumento danni inflitti[-] del [FFAE00]50%[-] per [FFAE00]3 turni[-].\\n\\n[00D5FF]※Attacco incendiario: infligge l'effetto Incendio al bersaglio quando usa un'Abilità Attacco diversa dalla Mossa finale.\\n(Accumulo massimo: 9 volte)[-]",
       "en": "Gains [FFAE00]2[-] [00D5FF]Igniting Attack[-] effects and a [FFAE00]50%[-] [00D5FF]Damage Dealt Increase[-] for [FFAE00]3 turns[-].\\n\\n[00D5FF]※Igniting Attack: Inflicts the Ignite effect on the target when using an Attack Skill other than the Ultimate Move.\\n(Stacks up to 9 times)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_surt_firstflame_type01_skill_07"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Laevateinn",
      "en": "Laevateinn"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Laevateinn della regressione[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Laevateinn della regressione: si verifica un effetto aggiuntivo in base al [FFAE00]tipo di abilità[-] usato dal nemico.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00][FFAE00]10000[-][-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Retrogression Laevateinn[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Retrogression Laevateinn: Additional effect occurs based on the [FFAE00]skill type[-] the enemy used.[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00][FFAE00]10000[-][-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Runa dell'esplosione",
      "en": "Rune of Explosion"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]1 turno/i[-] e infligge danni pari al [FFAE00]250%[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]1 turn(s)[-] and inflicts damage equal to [FFAE00]250%[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_10"
    },
    {
     "slot": "special",
     "name": {
      "it": "Furia di Fafnir",
      "en": "Fafnir's Wrath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]un nemico[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]one enemy[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Runa dell'esplosione",
      "en": "Rune of Explosion"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_10"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390429": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Maestosità di Skoll",
      "en": "Skoll's Majesty"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]260%[-] dell'Attacco. Applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti da uno o più bersagli [FFAE00]+[-][FFAE00]10%[-] (possono essere accumulati).[-]",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]260%[-] of Attack. Applies [FFAE00]2[-] [00D5FF]Ignite[-] effects for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_06_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Respiro di Eikthyrnir",
      "en": "Eikthyrnir's Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi [00D5FF]riduce[-] la sua Barra Mossa finale di [FFAE00]1[-] [FFAE00]sfera/e[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-], then [00D5FF]decreases[-] their Ultimate Move Gauge by [FFAE00]1[-] [FFAE00]orb(s)[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-] damage dealt per Ignite effect on target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Runa della penetrazione",
      "en": "Rune of Penetration"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]1 turno/i[-] e infligge danni pari al [FFAE00]250%[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]1 turn(s)[-] and inflicts damage equal to [FFAE00]250%[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_09"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Incantesimo di Kenaz",
      "en": "Spell of Kenaz"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fuoco della provvidenza[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fuoco della provvidenza: si verifica un effetto aggiuntivo se l'abilità del nemico non corrisponde al [FFAE00]tipo di abilità[-] visualizzato.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00]10.000[-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Fire of Providence[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Fire of Providence: Additional effect occurs if the enemy's skill does not match the displayed [FFAE00]skill type[-].[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00]10,000[-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Furia di Fafnir",
      "en": "Fafnir's Wrath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]600%[-] dell'Attacco a [FFFFFF]un nemico[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]one enemy[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Runa della penetrazione",
      "en": "Rune of Penetration"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco tramite contrattacco quando attaccato. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_09"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390430": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Maestosità di Skoll",
      "en": "Skoll's Majesty"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]260%[-] dell'Attacco. Applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti da uno o più bersagli [FFAE00]+[-][FFAE00]10%[-] (possono essere accumulati).[-]",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]260%[-] of Attack. Applies [FFAE00]2[-] [00D5FF]Ignite[-] effects for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_06_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Respiro di Eikthyrnir",
      "en": "Eikthyrnir's Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]ignorando Difesa e Resistenza[-].",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]ignoring Defense and Resistance[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]ignorando Difesa e Resistenza[-].",
       "en": "Inflicts damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]ignoring Defense and Resistance[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Laevateinn",
      "en": "Laevateinn"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Laevateinn della regressione[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Laevateinn della regressione: si verifica un effetto aggiuntivo in base al [FFAE00]tipo di abilità[-] usato dal nemico.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00][FFAE00]10000[-][-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Retrogression Laevateinn[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Retrogression Laevateinn: Additional effect occurs based on the [FFAE00]skill type[-] the enemy used.[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00][FFAE00]10000[-][-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Runa della protezione",
      "en": "Rune of Protection"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che riduce del [FFAE00]50%[-] i danni subiti per [FFAE00]2 turno/i[-], applica [00D5FF]Riflessione[-] sul [FFAE00]50%[-] dei danni subiti, poi ottiene un Aumento [00D5FF]statistiche relative alla Difesa[-] del [FFAE00]15%[-].\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance that decreases damage taken by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-], [00D5FF]Reflecting[-] [FFAE00]50%[-] of damage taken, then gains a [FFAE00]15%[-] [00D5FF]Defense-related Stats[-] Increase.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_08_2"
    },
    {
     "slot": "special",
     "name": {
      "it": "Furia di Fafnir",
      "en": "Fafnir's Wrath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]600%[-] dell'Attacco a [FFFFFF]un nemico[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]one enemy[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390431": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Ombra di Hati",
      "en": "Hati's Shadow"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-], poi applica [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Incendio: danni subiti da uno o più bersagli [FFAE00]+[-][FFAE00]10%[-]\\n(Accumulo massimo: 9 volte).[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-], then applies [00D5FF]Ignite[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-]\\n(Stacks up to 9 times).[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-], poi applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Incendio: danni subiti da uno o più bersagli [FFAE00]+[-][FFAE00]10%[-]\\n(Accumulo massimo: 9 volte).[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-], then applies [FFAE00]2[-] [00D5FF]Ignite[-] effects for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-]\\n(Stacks to up 9 times).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_03_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Maestosità di Skoll",
      "en": "Skoll's Majesty"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Runa della protezione",
      "en": "Rune of Protection"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che riduce del [FFAE00]50%[-] i danni subiti per [FFAE00]2 turno/i[-], applica [00D5FF]Riflessione[-] sul [FFAE00]50%[-] dei danni subiti, poi ottiene [FFAE00]2[-] istanze di Aumento [00D5FF]statistiche relative alla Difesa[-] del [FFAE00]15%[-].\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance that decreases damage taken by [FFAE00]50%[-] for [FFAE00]2 turn(s)[-], [00D5FF]Reflecting[-] [FFAE00]50%[-] of damage taken, then gains [FFAE00]2[-] instances of a [FFAE00]15%[-] [00D5FF]Defense-related Stats[-] Increase.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_08_2"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Incantesimo di Kenaz",
      "en": "Spell of Kenaz"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fuoco della provvidenza[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fuoco della provvidenza: si verifica un effetto aggiuntivo se l'abilità del nemico non corrisponde al [FFAE00]tipo di abilità[-] visualizzato.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00]10.000[-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Fire of Providence[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Fire of Providence: Additional effect occurs if the enemy's skill does not match the displayed [FFAE00]skill type[-].[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00]10,000[-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Giudizio di Muspelheim",
      "en": "Judgment of Muspelheim"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]600%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]all enemies[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390432": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Respiro di Eikthyrnir",
      "en": "Eikthyrnir's Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Maestosità di Skoll",
      "en": "Skoll's Majesty"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Atteggiamento[-] su [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]210%[-] dell'Attacco.\\nInfligge [FFAE00][FFAE00]100%[-][-] danni aggiuntivi se il bersaglio subisce [00D5FF]Surriscaldamento[-].",
       "en": "[00D5FF]Cancels Stances[-] on [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]210%[-] of Attack.\\nInflicts [FFAE00][FFAE00]100%[-][-] additional damage if the target is afflicted with [00D5FF]Overheat[-]."
      },
      {
       "it": "[00D5FF]Annulla Atteggiamento[-] su [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]260%[-] dell'Attacco.\\nInfligge [FFAE00][FFAE00]100%[-][-] danni aggiuntivi se il bersaglio subisce [00D5FF]Surriscaldamento[-].",
       "en": "[00D5FF]Cancels Stances[-] on [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]260%[-] of Attack.\\nInflicts [FFAE00][FFAE00]100%[-][-] additional damage if the target is afflicted with [00D5FF]Overheat[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_06"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Laevateinn",
      "en": "Laevateinn"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Laevateinn della regressione[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Laevateinn della regressione: si verifica un effetto aggiuntivo in base al [FFAE00]tipo di abilità[-] usato dal nemico.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00][FFAE00]10000[-][-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Retrogression Laevateinn[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Retrogression Laevateinn: Additional effect occurs based on the [FFAE00]skill type[-] the enemy used.[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00][FFAE00]10000[-][-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Incantesimo di Kenaz",
      "en": "Spell of Kenaz"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fuoco della provvidenza[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fuoco della provvidenza: si verifica un effetto aggiuntivo se l'abilità del nemico non corrisponde al [FFAE00]tipo di abilità[-] visualizzato.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00]10.000[-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Fire of Providence[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Fire of Providence: Additional effect occurs if the enemy's skill does not match the displayed [FFAE00]skill type[-].[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00]10,000[-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Giudizio di Muspelheim",
      "en": "Judgment of Muspelheim"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]600%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]all enemies[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390433": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Scintilla di Ratatoskr",
      "en": "Ratatoskr's Sparkle"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]250%[-] dell'Attacco su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0.8%[-] dei danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of remaining HP on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-], poi infligge danni [00D5FF]Co-distruzione[-].\\n\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Co-distruzione: [FFAE00]40%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-] then inflicts [00D5FF]Co-destruction[-] damage.\\n\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Co-destruction: [FFAE00]40%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_04"
    },
    {
     "slot": "b",
     "name": {
      "it": "Respiro di Eikthyrnir",
      "en": "Eikthyrnir's Breath"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]ignorando Difesa e Resistenza[-].",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]ignoring Defense and Resistance[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]260%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], [00D5FF]ignorando Difesa e Resistenza[-].",
       "en": "Inflicts damage equal to [FFAE00]260%[-] of Attack on [FFFFFF]all enemies[-], [00D5FF]ignoring Defense and Resistance[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_05"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Runa dell'esplosione",
      "en": "Rune of Explosion"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]1 turno/i[-] e infligge danni pari al [FFAE00]250%[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]1 turn(s)[-] and inflicts damage equal to [FFAE00]250%[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_10"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Incantesimo di Kenaz",
      "en": "Spell of Kenaz"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fuoco della provvidenza[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fuoco della provvidenza: si verifica un effetto aggiuntivo se l'abilità del nemico non corrisponde al [FFAE00]tipo di abilità[-] visualizzato.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00]10.000[-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Fire of Providence[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Fire of Providence: Additional effect occurs if the enemy's skill does not match the displayed [FFAE00]skill type[-].[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00]10,000[-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Giudizio di Muspelheim",
      "en": "Judgment of Muspelheim"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]600%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]all enemies[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_02"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Runa dell'esplosione",
      "en": "Rune of Explosion"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      },
      {
       "it": "Assume un Atteggiamento per [FFAE00]-1 turno/i[-] e infligge danni pari al [FFAE00]0[-] dell'Attacco a tutti i nemici tramite contrattacco quando subisce un attacco. Se il bersaglio subisce [00D5FF]Surriscaldamento[-], il contrattacco infligge il [FFAE00]200%[-] di danni aggiuntivi.",
       "en": "Assumes a Stance for [FFAE00]-1 turn(s)[-] and inflicts damage equal to [FFAE00]0[-] of Attack on all enemies via counter when attacked. If the target is afflicted with [00D5FF]Overheat[-], the counter inflicts [FFAE00]200%[-] additional damage."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_10"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390434": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Maestosità di Skoll",
      "en": "Skoll's Majesty"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]210%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n[00D5FF]Incendia[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti dal bersaglio/i [FFAE00]+[-][FFAE00]10%[-] (Può essere accumulato).[-]",
       "en": "Inflicts damage equal to [FFAE00]210%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Ignites[-] for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      },
      {
       "it": "[00D5FF]Rimuove i Buff[-] da [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]260%[-] dell'Attacco. Applica [FFAE00]2[-] effetti [00D5FF]Incendio[-] per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Incendio: danni subiti da uno o più bersagli [FFAE00]+[-][FFAE00]10%[-] (possono essere accumulati).[-]",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]260%[-] of Attack. Applies [FFAE00]2[-] [00D5FF]Ignite[-] effects for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Ignite: Damage taken by target(s) [FFAE00]+[-][FFAE00]10%[-] (Can be stacked).[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_06_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Riaccensione",
      "en": "Reignition"
     },
     "ranks": [
      {
       "it": "Ottiene un effetto [00D5FF]Attacco incendiario[-] e un [00D5FF]Aumento danni inflitti[-] del [FFAE00]50%[-] per [FFAE00]3 turni[-].\\n\\n[00D5FF]※Attacco incendiario: infligge l'effetto Incendio al bersaglio quando usa un'Abilità Attacco diversa dalla Mossa finale.\\n(Accumulo massimo: 9 volte)[-]",
       "en": "Gains an [00D5FF]Igniting Attack[-] effect and a [FFAE00]50%[-] [00D5FF]Damage Dealt Increase[-] for [FFAE00]3 turns[-].\\n\\n[00D5FF]※Igniting Attack: Inflicts the Ignite effect on the target when using an Attack Skill other than the Ultimate Move.\\n(Stacks up to 9 times)[-]"
      },
      {
       "it": "Ottiene 2 effetti [00D5FF]Attacco incendiario[-] e un [00D5FF]Aumento danni inflitti[-] del [FFAE00]50%[-] per [FFAE00]3 turni[-].\\n\\n[00D5FF]※Attacco incendiario: infligge l'effetto Incendio al bersaglio quando usa un'Abilità Attacco diversa dalla Mossa finale.\\n(Accumulo massimo: 9 volte)[-]",
       "en": "Gains 2 [00D5FF]Igniting Attack[-] effects and a [FFAE00]50%[-] [00D5FF]Damage Dealt Increase[-] for [FFAE00]3 turns[-].\\n\\n[00D5FF]※Igniting Attack: Inflicts the Ignite effect on the target when using an Attack Skill other than the Ultimate Move.\\n(Stacks up to 9 times)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_surt_firstflame_type01_skill_07"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Laevateinn",
      "en": "Laevateinn"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Laevateinn della regressione[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Laevateinn della regressione: si verifica un effetto aggiuntivo in base al [FFAE00]tipo di abilità[-] usato dal nemico.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00][FFAE00]10000[-][-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Retrogression Laevateinn[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Retrogression Laevateinn: Additional effect occurs based on the [FFAE00]skill type[-] the enemy used.[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00][FFAE00]10000[-][-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Incantesimo di Kenaz",
      "en": "Spell of Kenaz"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fuoco della provvidenza[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fuoco della provvidenza: si verifica un effetto aggiuntivo se l'abilità del nemico non corrisponde al [FFAE00]tipo di abilità[-] visualizzato.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00]10.000[-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Fire of Providence[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Fire of Providence: Additional effect occurs if the enemy's skill does not match the displayed [FFAE00]skill type[-].[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00]10,000[-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Giudizio di Muspelheim",
      "en": "Judgment of Muspelheim"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]600%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]600%[-] of Attack on [FFFFFF]all enemies[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2390435": {
   "name": {
    "it": "Surtr e la fiamma primordiale",
    "en": "Surtr and the Primordial Flame"
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
      "it": "Ombra di Hati",
      "en": "Hati's Shadow"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] della Difesa a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Defense on [FFFFFF]all enemies[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]320%[-] della Difesa a [FFFFFF]tutti i nemici[-].",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Defense on [FFFFFF]all enemies[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Runa della protezione",
      "en": "Rune of Protection"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che riduce del [FFAE00]60%[-] i danni subiti per [FFAE00]2 turno/i[-], applica [00D5FF]Riflessione[-] sul [FFAE00]50%[-] dei danni subiti, poi ottiene un Aumento [00D5FF]statistiche relative alla Difesa[-] del [FFAE00]15%[-].\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance that decreases damage taken by [FFAE00]60%[-] for [FFAE00]2 turn(s)[-], [00D5FF]Reflecting[-] [FFAE00]50%[-] of damage taken, then gains a [FFAE00]15%[-] [00D5FF]Defense-related Stats[-] Increase.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      },
      {
       "it": "Assume un Atteggiamento che riduce del [FFAE00]60%[-] i danni subiti per [FFAE00]2 turno/i[-], applica [00D5FF]Riflessione[-] sul [FFAE00]50%[-] dei danni subiti, poi ottiene [FFAE00]2[-] istanze di Aumento [00D5FF]statistiche relative alla Difesa[-] del [FFAE00]15%[-].\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance that decreases damage taken by [FFAE00]60%[-] for [FFAE00]2 turn(s)[-], [00D5FF]Reflecting[-] [FFAE00]50%[-] of damage taken, then gains [FFAE00]2[-] instances of a [FFAE00]15%[-] [00D5FF]Defense-related Stats[-] Increase.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_surt_firstflame_type01_skill_08_1"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Laevateinn",
      "en": "Laevateinn"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Laevateinn della regressione[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Laevateinn della regressione: si verifica un effetto aggiuntivo in base al [FFAE00]tipo di abilità[-] usato dal nemico.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00][FFAE00]10000[-][-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Retrogression Laevateinn[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Retrogression Laevateinn: Additional effect occurs based on the [FFAE00]skill type[-] the enemy used.[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00][FFAE00]10000[-][-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Incantesimo di Kenaz",
      "en": "Spell of Kenaz"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fuoco della provvidenza[-] e danni [00D5FF]Fiammata di Muspell[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Fuoco della provvidenza: si verifica un effetto aggiuntivo se l'abilità del nemico non corrisponde al [FFAE00]tipo di abilità[-] visualizzato.[-]\\n[00D5FF]※Fiammata di Muspell: aggiunge [FFAE00]10.000[-] danni aggiuntivi ai danni finali e infligge Surriscaldamento.[-]",
       "en": "Inflicts [00D5FF]Fire of Providence[-] damage and [00D5FF]Muspell Blaze[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Fire of Providence: Additional effect occurs if the enemy's skill does not match the displayed [FFAE00]skill type[-].[-]\\n[00D5FF]※Muspell Blaze: Adds [FFAE00]10,000[-] additional damage to the final damage and inflicts Overheat.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_surt_firstflame_type01_skill_02"
    },
    {
     "slot": "special",
     "name": {
      "it": "Giudizio di Muspelheim",
      "en": "Judgment of Muspelheim"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Inondazione[-] pari al [FFAE00]650%[-] dell'Attacco a [FFFFFF]tutti i nemici[-], poi applica [00D5FF]Surriscaldamento[-].\\n[00D5FF]※Inondazione: [FFAE00]0,8%[-] di danni aggiuntivi per [FFAE00]ogni percentuale[-] di PS rimanenti su di sé.[-]\\n[00D5FF]※Surriscaldamento: i PS lampeggiano. Subiscono Scioglimento se vengono ricevuti danni Giudizio ardente mentre si è in questo stato.[-]",
       "en": "Inflicts [00D5FF]Flood[-] damage equal to [FFAE00]650%[-] of Attack on [FFFFFF]all enemies[-], then applies [00D5FF]Overheat[-].\\n[00D5FF]※Flood: [FFAE00]0.8%[-] additional damage for [FFAE00]every percent[-] of HP remaining on self.[-]\\n[00D5FF]※Overheat: HP flickers. If Burning Judgment damage is taken while in this state, it is Melted.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_surt_firstflame_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "2490011": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "description": {
    "it": "Dispositivo di legno sospetto di Ratatoskr.",
    "en": "Ratatoskr's suspicious wooden device."
   },
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951660",
    "951695"
   ],
   "hiddenPassives": 2
  },
  "2490012": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "description": {
    "it": "Dispositivo di legno sospetto di Ratatoskr.",
    "en": "Ratatoskr's suspicious wooden device."
   },
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951674",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490013": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "description": {
    "it": "Dispositivo di legno sospetto di Ratatoskr.",
    "en": "Ratatoskr's suspicious wooden device."
   },
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951680",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490014": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951660",
    "951692",
    "951695"
   ],
   "hiddenPassives": 2
  },
  "2490015": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951692",
    "951674",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490016": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951680",
    "951692",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490017": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951660",
    "951692",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490018": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951692",
    "951674",
    "951695"
   ],
   "hiddenPassives": 0
  },
  "2490019": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951680",
    "951692",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490021": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951660",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490022": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951674",
    "951695"
   ],
   "hiddenPassives": 0
  },
  "2490023": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951680",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490024": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951660",
    "951693",
    "951695"
   ],
   "hiddenPassives": 2
  },
  "2490025": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951693",
    "951674",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490026": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951680",
    "951693",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490027": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951660",
    "951693",
    "951695"
   ],
   "hiddenPassives": 2
  },
  "2490028": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951693",
    "951673",
    "951674",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490029": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951681",
    "951693",
    "951683",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490031": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951661",
    "951695"
   ],
   "hiddenPassives": 2
  },
  "2490032": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951674",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490033": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951660",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490034": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951661",
    "951695"
   ],
   "hiddenPassives": 2
  },
  "2490035": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951674",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490036": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951682",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490037": {
   "name": {
    "it": "Dispositivo di legno sospetto 1",
    "en": "Suspicious Wooden Device 1"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 1,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951661",
    "951693",
    "951695"
   ],
   "hiddenPassives": 2
  },
  "2490038": {
   "name": {
    "it": "Dispositivo di legno sospetto 2",
    "en": "Suspicious Wooden Device 2"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 2,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951670",
    "951672",
    "951693",
    "951674",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490039": {
   "name": {
    "it": "Dispositivo di legno sospetto 3",
    "en": "Suspicious Wooden Device 3"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 3,
   "icon": true,
   "skills": [],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951682",
    "951693",
    "951695"
   ],
   "hiddenPassives": 1
  },
  "2490101": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "description": {
    "it": "Uno scoiattolo che vive nel tronco dell'Albero del mondo, Yggdrasil. Corre su e giù per l'albero per portare messaggi tra Hraesvelgr in cima e Nidhoggr alle radici.",
    "en": "A squirrel who lives on the trunk of the World Tree Yggdrasil. It runs up and down the tree to carry messages between Hraesvelgr at the top and Nidhoggr at the roots."
   },
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Scossa di Thor",
      "en": "Shock of Thor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_03_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Tentazione di falsità",
      "en": "Untruth Temptation"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Frutto fantastico",
      "en": "Brilliant Fruit"
     },
     "ranks": [
      {
       "it": "Cura i PS ridotti dell'eroe del [00FF00]20%[-] e [00D5FF]riempie[-] la Barra Mossa finale di [FFAE00]2[-] [FFAE00]sfera/e[-].",
       "en": "Heals the hero's diminished HP by [00FF00]20%[-] and [00D5FF]fills[-] the Ultimate Move Gauge by [FFAE00]2[-] [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "heal",
     "icon": "icon_nor_ratatoskr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-].",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Tempesta mistica",
      "en": "Mythic Storm"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-],\\ninfligge danni pari al [FFAE00]800%[-] dell'Attacco, poi infligge [00D5FF]Stordimento[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-], inflicts damage equal to [FFAE00]800%[-] of Attack, then [00D5FF]Stuns[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951601",
    "951602",
    "951606",
    "951607",
    "951608",
    "951610",
    "951611",
    "951612",
    "951692"
   ],
   "hiddenPassives": 4
  },
  "2490102": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Scossa di Thor",
      "en": "Shock of Thor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_03_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Fine del tuono",
      "en": "Thunderbolt Tail"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Frutto fantastico",
      "en": "Brilliant Fruit"
     },
     "ranks": [
      {
       "it": "Cura i PS ridotti dell'eroe del [00FF00]20%[-] e [00D5FF]riempie[-] la Barra Mossa finale di [FFAE00]2[-] [FFAE00]sfera/e[-].",
       "en": "Heals the hero's diminished HP by [00FF00]20%[-] and [00D5FF]fills[-] the Ultimate Move Gauge by [FFAE00]2[-] [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "heal",
     "icon": "icon_nor_ratatoskr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-].",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ingordigia abissale",
      "en": "Abyssal Gluttony"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951601",
    "951602",
    "951606",
    "951607",
    "951608",
    "951610",
    "951611",
    "951612"
   ],
   "hiddenPassives": 5
  },
  "2490103": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tentazione di falsità",
      "en": "Untruth Temptation"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari [FFAE00]350%[-] dell'Attacco e applica [FFAE00]2[-] effetti [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari a [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack and applies [FFAE00]2[-] [00D5FF]Food Poisoning[-] effects for [FFAE00]5 turn(s)[-] on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_02_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Scossa di Thor",
      "en": "Shock of Thor"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Velocità della luce",
      "en": "Lightning Speed"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_04"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-].",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-]."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Tempesta mistica",
      "en": "Mythic Storm"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-],\\ninfligge danni pari al [FFAE00]800%[-] dell'Attacco, poi infligge [00D5FF]Stordimento[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-], inflicts damage equal to [FFAE00]800%[-] of Attack, then [00D5FF]Stuns[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951603",
    "951602",
    "951606",
    "951607",
    "951608",
    "951610",
    "951611",
    "951612"
   ],
   "hiddenPassives": 4
  },
  "2490201": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Fine del tuono",
      "en": "Thunderbolt Tail"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari [FFAE00]350%[-] dell'Attacco e applica [FFAE00]2[-] effetti [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari a [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack and applies [FFAE00]2[-] [00D5FF]Food Poisoning[-] effects for [FFAE00]5 turn(s)[-] on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_01_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Scossa di Thor",
      "en": "Shock of Thor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_03_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Velocità della luce",
      "en": "Lightning Speed"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_04"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-] e fissa i danni subiti a [FFAE00]1[-] quando viene attaccato.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-] and fixes all damage taken to [FFAE00]1[-] when attacked."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ingordigia abissale",
      "en": "Abyssal Gluttony"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951605",
    "951602",
    "951606",
    "951607",
    "951608",
    "951610",
    "951611",
    "951612",
    "951693",
    "951621"
   ],
   "hiddenPassives": 5
  },
  "2490202": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tentazione di falsità",
      "en": "Untruth Temptation"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari [FFAE00]350%[-] dell'Attacco e applica [FFAE00]2[-] effetti [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari a [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack and applies [FFAE00]2[-] [00D5FF]Food Poisoning[-] effects for [FFAE00]5 turn(s)[-] on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_02_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Velocità della luce",
      "en": "Lightning Speed"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Frutto fantastico",
      "en": "Brilliant Fruit"
     },
     "ranks": [
      {
       "it": "Cura i PS ridotti dell'eroe del [00FF00]20%[-] e [00D5FF]riempie[-] la Barra Mossa finale di [FFAE00]2[-] [FFAE00]sfera/e[-].",
       "en": "Heals the hero's diminished HP by [00FF00]20%[-] and [00D5FF]fills[-] the Ultimate Move Gauge by [FFAE00]2[-] [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "heal",
     "icon": "icon_nor_ratatoskr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-] e fissa i danni subiti a [FFAE00]1[-] quando viene attaccato.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-] and fixes all damage taken to [FFAE00]1[-] when attacked."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ingordigia abissale",
      "en": "Abyssal Gluttony"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]550%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]550%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951601",
    "951602",
    "951606",
    "951607",
    "951608",
    "951610",
    "951611",
    "951612",
    "951621"
   ],
   "hiddenPassives": 6
  },
  "2490203": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Scossa di Thor",
      "en": "Shock of Thor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_03_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Velocità della luce",
      "en": "Lightning Speed"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Punto debole[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Punto debole: x3 danni ai nemici con Debuff.[-]",
       "en": "Inflicts [00D5FF]Weak Point[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Weak Point: 3x damage against Debuffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Frutto fantastico",
      "en": "Brilliant Fruit"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]10[-] effetti sull'eroe per [FFAE00]2 turni[-] che aumentano tutte le statistiche del [FFAE00]10%[-].",
       "en": "Applies [FFAE00]10[-] effects to the hero for [FFAE00]2 turns[-] which increases all stats by [FFAE00]10%[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_nor_ratatoskr_type01_skill_05_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-] e fissa i danni subiti a [FFAE00]1[-] quando viene attaccato.",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-] and fixes all damage taken to [FFAE00]1[-] when attacked."
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Tempesta mistica",
      "en": "Mythic Storm"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-],\\ninfligge danni pari al [FFAE00]800%[-] dell'Attacco, poi infligge [00D5FF]Stordimento[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-], inflicts damage equal to [FFAE00]800%[-] of Attack, then [00D5FF]Stuns[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951604",
    "951602",
    "951606",
    "951607",
    "951608",
    "951610",
    "951611",
    "951612",
    "951613"
   ],
   "hiddenPassives": 6
  },
  "2490301": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Velocità della luce",
      "en": "Lightning Speed"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_04_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Fine del tuono",
      "en": "Thunderbolt Tail"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Frutto fantastico",
      "en": "Brilliant Fruit"
     },
     "ranks": [
      {
       "it": "Cura i PS ridotti dell'eroe del [00FF00]20%[-] e [00D5FF]riempie[-] la Barra Mossa finale di [FFAE00]2[-] [FFAE00]sfera/e[-].",
       "en": "Heals the hero's diminished HP by [00FF00]20%[-] and [00D5FF]fills[-] the Ultimate Move Gauge by [FFAE00]2[-] [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "heal",
     "icon": "icon_nor_ratatoskr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-] e [00D5FF]Riflette[-] il [FFAE00]100%[-] dei danni subiti.\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-] and [00D5FF]Reflects[-] [FFAE00]100%[-] of the damage taken.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ingordigia abissale",
      "en": "Abyssal Gluttony"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Pietrificazione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Lancia: x2 aumento Danno critico.[-]\\n[00D5FF]※Pietrificazione: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Petrifies[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]\\n[00D5FF]※Petrify: Incapacitates target. Effect is removed when target is attacked.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951601",
    "951602",
    "951606",
    "951607",
    "951608",
    "951620",
    "951611",
    "951612",
    "951693"
   ],
   "hiddenPassives": 4
  },
  "2490302": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Scossa di Thor",
      "en": "Shock of Thor"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_03_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Velocità della luce",
      "en": "Lightning Speed"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco e applica un effetto [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies a [00D5FF]Food Poisoning[-] effect for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_04_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Frutto fantastico",
      "en": "Brilliant Fruit"
     },
     "ranks": [
      {
       "it": "Cura i PS ridotti dell'eroe del [00FF00]20%[-] e [00D5FF]riempie[-] la Barra Mossa finale di [FFAE00]2[-] [FFAE00]sfera/e[-].",
       "en": "Heals the hero's diminished HP by [00FF00]20%[-] and [00D5FF]fills[-] the Ultimate Move Gauge by [FFAE00]2[-] [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "heal",
     "icon": "icon_nor_ratatoskr_type01_skill_05"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-] e [00D5FF]Riflette[-] il [FFAE00]100%[-] dei danni subiti.\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-] and [00D5FF]Reflects[-] [FFAE00]100%[-] of the damage taken.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Tempesta mistica",
      "en": "Mythic Storm"
     },
     "ranks": [
      {
       "it": "[00D5FF]Annulla Buff e Atteggiamenti[-] su [FFFFFF]un nemico[-],\\ninfligge danni pari al [FFAE00]800%[-] dell'Attacco, poi infligge [00D5FF]Stordimento[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Stordimento: impedisce tutte le azioni.[-]",
       "en": "[00D5FF]Cancels Buffs and Stances[-] on [FFFFFF]one enemy[-], inflicts damage equal to [FFAE00]800%[-] of Attack, then [00D5FF]Stuns[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Stun: Prohibits all actions.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951601",
    "951602",
    "951606",
    "951607",
    "951608",
    "951620",
    "951611",
    "951612",
    "951694"
   ],
   "hiddenPassives": 6
  },
  "2490303": {
   "name": {
    "it": "Ratatoskr",
    "en": "Ratatoskr"
   },
   "nameDeduced": true,
   "description": null,
   "race": 4,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tentazione di falsità",
      "en": "Untruth Temptation"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Lancia: aumento x2 del Danno critico.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Scossa di Thor",
      "en": "Shock of Thor"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_nor_ratatoskr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Velocità della luce",
      "en": "Lightning Speed"
     },
     "ranks": [
      {
       "it": "Infligge danni pari [FFAE00]300%[-] dell'Attacco e applica [FFAE00]5[-] effetti [00D5FF]Avvelenamento da cibo[-] per [FFAE00]5 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Avvelenamento da cibo: danni aggiuntivi pari a [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulabile)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack and applies [FFAE00]5[-] [00D5FF]Food Poisoning[-] effects for [FFAE00]5 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Food Poisoning: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Can be stacked)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_skill_04_01"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Guscio statico",
      "en": "Static Shell"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]2 turno/i[-] che aumenta le statistiche relative ai PS del [FFAE00][FFAE00]30%[-][-] e [00D5FF]Riflette[-] il [FFAE00]100%[-] dei danni subiti.\\n\\n[00D5FF]※Riflessione: restituisce una parte dei danni subiti a chi attacca.[-]",
       "en": "Assumes a Stance for [FFAE00]2 turn(s)[-] which increases HP-related stats by [FFAE00][FFAE00]30%[-][-] and [00D5FF]Reflects[-] [FFAE00]100%[-] of the damage taken.\\n\\n[00D5FF]※Reflect: Returns a portion of damage taken back to the attacker.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_nor_ratatoskr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Ingordigia abissale",
      "en": "Abyssal Gluttony"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Pietrificazione[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Lancia: x2 aumento Danno critico.[-]\\n[00D5FF]※Pietrificazione: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]all enemies[-]. [00D5FF]Petrifies[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]\\n[00D5FF]※Petrify: Incapacitates target. Effect is removed when target is attacked.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_nor_ratatoskr_type01_special_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "951622",
    "951602",
    "951606",
    "951607",
    "951608",
    "951620",
    "951611",
    "951612"
   ],
   "hiddenPassives": 5
  }
 },
 "passives": {
  "612849": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Colpo del tuono\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Lightning Strike\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612850": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Affondo opprimente\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Hunting Dive\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612851": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Esplosione di vento\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Wind Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612852": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Colpo del tuono\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Lightning Strike\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612853": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612854": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Getto d'aria\" ogni [FFAE00]1 turni[-].",
    "en": "Uses \"Air Blast\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "612855": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Tornado abbattente\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Flap Tornado\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612856": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612857": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Getto d'aria\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Air Blast\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612858": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Esplosione di vento\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Wind Explosion\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612859": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Esplosione di vento\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Wind Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612860": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612861": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Esplosione di vento\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Wind Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612862": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612863": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Esplosione di vento\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Wind Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612864": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "612865": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Esplosione di vento\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Wind Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612866": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612869": {
   "name": {
    "it": "Riduzione danni Mossa finale",
    "en": "Ultimate Move Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] i danni subiti dall'eroe nelle Mosse finali.",
    "en": "Decreases the hero's damage taken from Ultimate Moves by [FFAE00]30%[-]."
   }
  },
  "612870": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Pietrificazione, Stordimento, Congelamento, Corrosione, Disabilita Attacco, Disabilita Buff, Disabilita Debuff, Riduzione statistiche, Avvelenamento, Sanguinamento, Shock, Ossidazione, Fuoco, Svenimento[-] e [00D5FF]Coercizione[-].",
    "en": "Immune to [00D5FF]Petrify, Stun, Freeze, Corrosion, Attack Disable, Buff Disable, Debuff Disable, Stat Decrease, Poison, Bleed, Shock, Oxidize, Burn, Blackout[-], and [00D5FF]Coerce[-]."
   }
  },
  "612871": {
   "name": {
    "it": "Annulla Debuff",
    "en": "Debuff Cancel"
   },
   "text": {
    "it": "Rimuove [FFAE00]1[-] Debuff sull'eroe all'inizio di ogni turno.",
    "en": "Removes [FFAE00]1[-] Debuff from the hero at the start of every turn."
   }
  },
  "612872": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti gli effetti Debuff[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuff effects[-]."
   }
  },
  "612878": {
   "name": {
    "it": "Rimuovi il potere attributo",
    "en": "Remove Attribute Leverage"
   },
   "text": {
    "it": "Nessun cambio dei danni per attributi vantaggio o svantaggio.",
    "en": "No change in damage from attribute advantage or disadvantage."
   }
  },
  "612879": {
   "name": {
    "it": "Follia",
    "en": "Lunacy"
   },
   "text": {
    "it": "[00D5FF]Infliggendo danni da Esplosione su un nemico[-], guarisce i PS dell'eroe del [FFAE00]20%[-] dei PS massimi e riempie di [FFAE00]1 sfera/e[-] la Barra Mossa finale.",
    "en": "[00D5FF]Inflicting Explosion damage on an enemy[-] heals the hero's HP by [FFAE00]20%[-] of Max HP and fills the Ultimate Move Gauge by [FFAE00]1 orb(s)[-]."
   }
  },
  "612883": {
   "name": {
    "it": "Riduzione danni",
    "en": "Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]50%[-] i danni subiti dalle Abilità Rango 1.",
    "en": "Decreases damage taken from Rank 1 Skills by [FFAE00]50%[-]."
   }
  },
  "612884": {
   "name": {
    "it": "Riduzione Barra Mossa finale",
    "en": "Ultimate Move Gauge Decrease"
   },
   "text": {
    "it": "Svuota [FFAE00]5 sfera/e[-] dalla/e Barra/e Mossa finale di tutti i nemici alla fine del turno, quando l'eroe sconfigge un nemico.",
    "en": "Depletes [FFAE00]5 orb(s)[-] from the Ultimate Move Gauge(s) of all enemies at the end of the turn when the hero defeats an enemy."
   }
  },
  "612885": {
   "name": {
    "it": "Corpo forte",
    "en": "Strong Body"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]35%[-] dei PS massimi. Aumenta del [FFAE00]1%[-] le statistiche relative all'Attacco per [FFAE00]ogni 5%[-] dei PS rimanenti usando le abilità.\\n[00D5FF](Si applica prima dell'attivazione dell'abilità)[-]",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]35%[-] of Max HP. Increases Attack-related stats by [FFAE00]1%[-] for [FFAE00]every 5%[-] of remaining HP when using skills.\\n[00D5FF](Applies before skill activation)[-]"
   }
  },
  "612886": {
   "name": {
    "it": "Riduzione statistiche relative ai PS",
    "en": "HP-related Stats Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] la Velocità di rigenerazione, la Velocità di recupero e il Furto di vita del nemico.",
    "en": "Decreases the enemy's Regeneration Rate, Recovery Rate, and Lifesteal by [FFAE00]40%[-]."
   }
  },
  "612887": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]30%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]30%[-] of Max HP."
   }
  },
  "612889": {
   "name": {
    "it": "Estorsione Attacco",
    "en": "Extort Attack"
   },
   "text": {
    "it": "Riduce del [FFAE00]0%[-] le statistiche relative all'Attacco di tutti i nemici all'inizio del turno degli alleati, se l'Eroe non subisce danni.\\n[00D5FF](Limite 1 volta/e, si resetta quando si subiscono danni)[-]",
    "en": "Decreases all enemies' Attack-related stats by [FFAE00]0%[-] at the start of the allies' turn if the hero doesn't take damage.\\n[00D5FF](Limit 1 time(s), resets upon taking damage)[-]"
   }
  },
  "612891": {
   "name": {
    "it": "Immunità a Riduzione statistiche",
    "en": "Stat Decrease Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti di [00D5FF]Riduzione statistiche[-].",
    "en": "The hero becomes immune to [00D5FF]Stat Decrease[-] effects."
   }
  },
  "612892": {
   "name": {
    "it": "Immunità a danni nel tempo",
    "en": "Damage Over Time Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti [00D5FF]Sanguinamento, Avvelenamento, Shock, Corrosione, Ossidazione e Fuoco[-].",
    "en": "The hero becomes immune to [00D5FF]Bleed, Poison, Shock, Corrosion, Oxidize, and Burn[-] effects."
   }
  },
  "612893": {
   "name": {
    "it": "Riporta in vita",
    "en": "Revive"
   },
   "text": {
    "it": "Cura il [FFAE00]100%[-] della Difesa quando i PS dell'eroe raggiungono [FFAE00]0[-].\\n[00D5FF](Una volta per battaglia)[-]",
    "en": "Heals for [FFAE00]100%[-] of Defense when the hero's HP reaches [FFAE00]0[-].\\n[00D5FF](Once per battle)[-]"
   }
  },
  "612906": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Pioggia intensa\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Splash Shower\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612907": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Corno Difensivo\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Defensive Horn\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612908": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Rinfrescata\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Refresh\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612909": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Pioggia intensa\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Splash Shower\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612910": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Forza vitale\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Life Force\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "612911": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Stagno ghiacciato\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Icy Pond\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612912": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Pioggia intensa\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Splash Shower\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612913": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Forza vitale\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Life Force\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612914": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Bomba di Bolle\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Bubble Bomb\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612915": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Corno Difensivo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Defensive Horn\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612916": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Frantumazione nebulosa\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Hazy Crush\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612917": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Stagno ghiacciato\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Icy Pond\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612918": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Rinfrescata\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Refresh\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612919": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Stagno ghiacciato\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Icy Pond\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612920": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Pioggia intensa\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Splash Shower\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612921": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Rinfrescata\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Refresh\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612922": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Rinfrescata\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Refresh\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "612923": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Corno Difensivo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Defensive Horn\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "612924": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Pietrificazione, Stordimento, Congelamento, Corrosione, Disabilita Attacco, Disabilita Buff, Disabilita Debuff, Riduzione statistiche, Avvelenamento, Sanguinamento, Shock, Ossidazione, Fuoco, Svenimento[-] e [00D5FF]Coercizione[-].",
    "en": "Immune to [00D5FF]Petrify, Stun, Freeze, Corrosion, Attack Disable, Buff Disable, Debuff Disable, Stat Decrease, Poison, Bleed, Shock, Oxidize, Burn, Blackout[-], and [00D5FF]Coerce[-]."
   }
  },
  "612925": {
   "name": {
    "it": "Annulla Debuff",
    "en": "Debuff Cancel"
   },
   "text": {
    "it": "Rimuove [FFAE00]1[-] Debuff sull'eroe all'inizio di ogni turno.",
    "en": "Removes [FFAE00]1[-] Debuff from the hero at the start of every turn."
   }
  },
  "612926": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti gli effetti Debuff[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuff effects[-]."
   }
  },
  "612927": {
   "name": {
    "it": "Riduzione danni Mossa finale",
    "en": "Ultimate Move Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] i danni subiti dall'eroe nelle Mosse finali.",
    "en": "Decreases the hero's damage taken from Ultimate Moves by [FFAE00]30%[-]."
   }
  },
  "612928": {
   "name": {
    "it": "Rimuovi il Potere attributo",
    "en": "Remove Attribute Leverage"
   },
   "text": {
    "it": "Nessun cambio dei danni per attributi vantaggio o svantaggio.",
    "en": "No change in damage from attribute advantage or disadvantage."
   }
  },
  "612929": {
   "name": {
    "it": "Aumento Furto di vita",
    "en": "Lifesteal Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]25%[-] Furto di vita mentre usa un'abilità quando i PS dell'eroe sono [FFAE00]50%[-] o meno.\\n[00D5FF](Si applica prima dell'attivazione dell'abilità)[-]",
    "en": "Increases Lifesteal by [FFAE00]25%[-] when using a skill while the hero's HP is [FFAE00]50%[-] or less.\\n[00D5FF](Applies before skill activation)[-]"
   }
  },
  "612930": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] Perforazione, Possibilità critico e Danno critico dell'eroe per [FFAE00]ogni[-] Debuff applicato sui nemici.\\n[00D5FF](Limite: 15 volta/e, si applica all’ingresso nella battaglia)[-]",
    "en": "Increases the hero's Pierce Rate, Crit Chance, and Crit Damage by [FFAE00]10%[-] for [FFAE00]every[-] Debuff applied on enemies.\\n[00D5FF](Limit 15 time(s), applies when entering battle)[-]"
   }
  },
  "612943": {
   "name": {
    "it": "Riduzione statistiche relative ai PS",
    "en": "HP-related Stats Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] la Velocità di rigenerazione, la Velocità di recupero e il Furto di vita del nemico.",
    "en": "Decreases the enemy's Regeneration Rate, Recovery Rate, and Lifesteal by [FFAE00]40%[-]."
   }
  },
  "612945": {
   "name": {
    "it": "Cattura",
    "en": "Capture"
   },
   "text": {
    "it": "Da' la priorità agli attacchi contro nemici congelati.",
    "en": "Prioritizes attacking Frozen enemies."
   }
  },
  "612946": {
   "name": {
    "it": "Aumento Possibilità critico",
    "en": "Crit Chance Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico di [FFAE00]10%[-] per ogni uso delle abilità.",
    "en": "Increases Crit Chance by [FFAE00]10%[-] per hero skill use."
   }
  },
  "612947": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]20%[-] il Danno critico dell'eroe per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'Eroe.",
    "en": "Increases the hero's Crit Damage by [FFAE00]20%[-] for [FFAE00]every orb[-] in the hero's Ultimate Move Gauge."
   }
  },
  "612948": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Infligge [FFAE00]200%[-] danni aggiuntivi quando l'eroe attacca un nemico con un Attacco inferiore.",
    "en": "Deals [FFAE00]200%[-] additional damage when the hero attacks an enemy with a lower Attack."
   }
  },
  "612951": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]40%[-] le statistiche di base dell'eroe quando usa un'abilità con effetto Rimozione abilità.\\n[00D5FF](Limite di una volta)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]40%[-] when using a skill with the Skill Deletion effect.\\n[00D5FF](Limit once)[-]"
   }
  },
  "612952": {
   "name": {
    "it": "Atteggiamento evoluto",
    "en": "Evolved Stance"
   },
   "text": {
    "it": "Aumenta del [FFAE00]15%[-] le statistiche relative all'Attacco dell'Eroe per [FFAE00]2 turni[-] usando delle Abilità Atteggiamento.\\n[00D5FF](Escluse le Mosse finali)[-]",
    "en": "Increases the hero's Attack-related stats by [FFAE00]15%[-] for [FFAE00]2 turns[-] when using Stance Skills.\\n[00D5FF](Excluding Ultimate Moves)[-]"
   }
  },
  "612953": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]35%[-] i danni inflitti dall'eroe quando si attaccano nemici con il Debuff [00D5FF]Shock[-].",
    "en": "Increases the hero's damage dealt by [FFAE00]35%[-] when attacking enemies afflicted with the [00D5FF]Shock[-] Debuff."
   }
  },
  "612955": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] i danni inflitti dell'eroe per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'Eroe.",
    "en": "Increases the hero's damage dealt by [FFAE00]5%[-] for [FFAE00]every orb[-] in the hero's Ultimate Move Gauge."
   }
  },
  "612956": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] il Danno critico dell'eroe [FFAE00]per ogni sfera[-] rimossa dalla Barra Mossa finale dell'eroe.\\n[00D5FF](Limite: 3 volte. Esclude svuotamento dalla Barra Mossa finale.)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]30%[-] [FFAE00]for each orb[-] removed from the hero's Ultimate Move Gauge.\\n[00D5FF](Limit 3 times, excludes depletion from Ultimate Move use)[-]"
   }
  },
  "612959": {
   "name": {
    "it": "Benedizioni in incognito",
    "en": "Blessing in Disguise"
   },
   "text": {
    "it": "Rimuove i Debuff dell'eroe, cura completamente i suoi PS, e aumenta del [FFAE00]10%[-] tutte le statistiche quando un eroe sopravvive con [FFAE00]20%[-] PS o meno.\\n[00D5FF](Limite di una volta)[-]",
    "en": "Removes the hero's Debuffs, fully heals their HP, and increases all stats by [FFAE00]10%[-] when the hero survives with [FFAE00]20%[-] HP or less.\\n[00D5FF](Limit once)[-]"
   }
  },
  "612960": {
   "name": {
    "it": "Aumento Danni continui",
    "en": "Continuous Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] i danni inflitti dall'eroe per ogni abilità consecutiva usata in 1 turno.\\n[00D5FF](Si ripristina alla fine di ogni turno)[-]",
    "en": "Increases damage dealt by [FFAE00]10%[-] for each consecutive skill used by the hero in 1 turn.\\n[00D5FF](Resets at the end of every turn)[-]"
   }
  },
  "612961": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]25%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]25%[-] of Max HP."
   }
  },
  "612962": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]35%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]35%[-] of Max HP."
   }
  },
  "612983": {
   "name": {
    "it": "Ignora Difesa",
    "en": "Ignore Defense"
   },
   "text": {
    "it": "Immune a [00D5FF]Stordimento, Pietrificazione e Congelamento[-], oltre che a [00D5FF]Coercizione[-].",
    "en": "Immune to [00D5FF]Stun, Petrify, and Freeze[-], as well as [00D5FF]Coerce[-]."
   }
  },
  "613101": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] il Danno critico dell'eroe [FFAE00]per ogni sfera[-] rimossa dalla Barra Mossa finale dell'eroe.\\n[00D5FF](Limite 3 volte. Esclude svuotamento dalla Barra Mossa finale.)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]30%[-] [FFAE00]for each orb[-] removed from the hero's Ultimate Move Gauge.\\n[00D5FF](Limit 3 times, excludes depletion from Ultimate Move use)[-]"
   }
  },
  "613102": {
   "name": {
    "it": "Occhi acuti",
    "en": "Keen Eyes"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] la Resistenza critico e la Difesa critico di tutti i nemici.",
    "en": "Decreases all enemies' Crit Resistance and Crit Defense by [FFAE00]30%[-]."
   }
  },
  "613103": {
   "name": {
    "it": "Distruzione armatura",
    "en": "Armor Destruction"
   },
   "text": {
    "it": "Se un nemico subisce danni da Colpo critico dall'attacco dell'eroe, applica un effetto su quel nemico che riduce del [FFAE00]40%[-] le statistiche relative alla Difesa per [FFAE00]2 turni[-].",
    "en": "When an enemy takes Critical Strike damage from the hero's attack, an effect is applied on that enemy which decreases Defense-related stats by [FFAE00]40%[-] for [FFAE00]2 turns[-]."
   }
  },
  "613111": {
   "name": {
    "it": "Risoluzione disperata",
    "en": "Desperate Resolve"
   },
   "text": {
    "it": "Riempie la barra Mossa finale dell'eroe di [FFAE00]3 sfera/e[-] all'inizio della battaglia.",
    "en": "Fills the hero's Ultimate Move Gauge by [FFAE00]3 orb(s)[-] at the start of the battle."
   }
  },
  "613112": {
   "name": {
    "it": "Riduzione Difesa & Attacco",
    "en": "Attack & Defense Decrease"
   },
   "text": {
    "it": "Riduce l’Attacco e la Difesa nemiche del [FFAE00]5%[-] per [FFAE00]5 turni[-] alla fine di ogni turno.\\n[00D5FF](Può essere accumulato fino a 5 volte)[-]",
    "en": "Decreases enemy Attack and Defense by [FFAE00]5%[-] for [FFAE00]5 turns[-] at the end of every turn.\\n[00D5FF](Can be stacked up to 5 times)[-]"
   }
  },
  "613113": {
   "name": {
    "it": "Riduzione PS massimi",
    "en": "Max HP Decrease"
   },
   "text": {
    "it": "Riduce i PS massimi di tutti i nemici del [FFAE00]200%[-] della Difesa dell'eroe.",
    "en": "Decreases all enemies' Max HP by the value of [FFAE00]200%[-] of the hero's Defense."
   }
  },
  "613121": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] i danni subiti da attacchi contro bersagli singoli e del [FFAE00]30%[-] quelli subiti da attacchi contro tutti i bersagli.",
    "en": "Decreases damage taken from single-target attacks by [FFAE00]40%[-] and all-target attacks by [FFAE00]30%[-]."
   }
  },
  "613122": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] i danni inflitti dai nemici a questo eroe.",
    "en": "Decreases the damage this hero takes from enemies by [FFAE00]40%[-]."
   }
  },
  "613123": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Applica un effetto sull'eroe che riduce del [FFAE00]15%[-] i danni subiti per [FFAE00]2 turni[-] quando subisce un attacco.\\n[00D5FF](Può essere accumulato massimo 4 volte)[-]",
    "en": "Applies an effect on the hero which decreases damage taken by [FFAE00]15%[-] for [FFAE00]2 turns[-] when attacked.\\n[00D5FF](Can be stacked up to 4 times)[-]"
   }
  },
  "613131": {
   "name": {
    "it": "Configurazione bersaglio",
    "en": "Configure Target"
   },
   "text": {
    "it": "Attaccare un nemico con un Debuff provocherà un colpo critico.",
    "en": "Attacking an enemy with a Debuff results in a critical strike."
   }
  },
  "613132": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] le statistiche relative all'Attacco dell'eroe per [FFAE00]3 turni[-] ogni volta che la Barra Mossa finale di un nemico raggiunge almeno [FFAE00]5 sfera/e[-].",
    "en": "Increases the hero's Attack-related stats by [FFAE00]5%[-] for [FFAE00]3 turns[-] every time an enemy Ultimate Move Gauge reaches [FFAE00]5 orb(s)[-] or more."
   }
  },
  "613133": {
   "name": {
    "it": "Colpo potente",
    "en": "Powerful Strike"
   },
   "text": {
    "it": "Aumenta del [FFAE00]8%[-] l'Attacco dell'eroe per [FFAE00]ogni[-] Atteggiamento o Buff sul nemico quando si utilizza un'abilità.\\n[00D5FF](Si applica prima dell'attivazione dell'abilità)[-]",
    "en": "Increases the hero's attack by [FFAE00]8%[-] for [FFAE00]each[-] Stance or Buff on the enemy when using a skill.\\n[00D5FF](Applies before skill activation)[-]"
   }
  },
  "613134": {
   "name": {
    "it": "Riflessione danni",
    "en": "Damage Reflect"
   },
   "text": {
    "it": "Applica un effetto che riflette il [FFAE00]25%[-] dei danni subiti dall'eroe all'inizio della battaglia.",
    "en": "Applies an effect which Reflects [FFAE00]25%[-] of the hero's damage taken at the start of the battle."
   }
  },
  "613141": {
   "name": {
    "it": "Riporta in vita",
    "en": "Revive"
   },
   "text": {
    "it": "L'eroe torna in vita con [FFAE00]50%[-] dei PS massimi quando muore.\\n[00D5FF](Una volta per combattimento)[-]",
    "en": "Revives with [FFAE00]50%[-] of Max HP when the hero dies.\\n[00D5FF](Once per battle)[-]"
   }
  },
  "613142": {
   "name": {
    "it": "Superamento crisi",
    "en": "Overcome Crisis"
   },
   "text": {
    "it": "Rimuove i Debuff dell'eroe, cura completamente i suoi PS, e aumenta del [FFAE00]15%[-] tutte le statistiche quando un eroe sopravvive con [FFAE00]25%[-] PS o meno.\\n[00D5FF](Limite di una volta)[-]",
    "en": "Removes the hero's Debuffs, fully heals their HP, and increases all stats by [FFAE00]15%[-] when the hero survives with [FFAE00]25%[-] HP or less.\\n[00D5FF](Limit once)[-]"
   }
  },
  "613143": {
   "name": {
    "it": "Distruzione arma",
    "en": "Weapon Destruction"
   },
   "text": {
    "it": "Se l'eroe infligge danni a un nemico con un attacco a bersaglio singolo, applica un effetto sul bersaglio che diminuisce del [FFAE00]30%[-] le statistiche relative all'Attacco per [FFAE00]2 turni[-].",
    "en": "If the hero inflicts damage on an enemy using a single-target attack, applies an effect on the target which decreases Attack-related stats by [FFAE00]30%[-] for [FFAE00]2 turns[-]."
   }
  },
  "613201": {
   "name": {
    "it": "Risoluzione disperata",
    "en": "Desperate Resolve"
   },
   "text": {
    "it": "Riempie la barra Mossa finale dell'eroe di [FFAE00]2 sfera/e[-] all'inizio della battaglia.",
    "en": "Fills the hero's Ultimate Move Gauge by [FFAE00]2 orb(s)[-] at the start of the battle."
   }
  },
  "613202": {
   "name": {
    "it": "Distruzione armatura",
    "en": "Armor Destruction"
   },
   "text": {
    "it": "Se un nemico subisce danni da Colpo critico dall'attacco dell'eroe, applica un effetto su quel nemico che riduce del [FFAE00]40%[-] le statistiche relative alla Difesa per [FFAE00]2 turni[-].",
    "en": "When an enemy takes Critical Strike damage from the hero's attack, an effect is applied on that enemy which decreases Defense-related stats by [FFAE00]40%[-] for [FFAE00]2 turns[-]."
   }
  },
  "613203": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] i danni inflitti dai nemici a questo eroe.",
    "en": "Decreases the damage this hero takes from enemies by [FFAE00]30%[-]."
   }
  },
  "613207": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] le statistiche di base dell'eroe quando un nemico usa un'Abilità Rango aumentato durante il turno del nemico.\\n[00D5FF](Limite: 10 volte)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]100%[-] when an enemy uses a Rank Up Skill during the enemy's turn.\\n[00D5FF](Limit 10 times)[-]"
   }
  },
  "613211": {
   "name": {
    "it": "Aumento statistiche relative ai PS",
    "en": "HP-related Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]2%[-] le statistiche relative ai PS all'inizio del turno degli alleati se l'eroe subisce danni.\\n[00D5FF](Limite 10 volta/e)[-]",
    "en": "Increases HP-related stats by [FFAE00]2%[-] at the start of the allies' turn if the hero takes damage.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "613212": {
   "name": {
    "it": "Aumento PS",
    "en": "HP Increase"
   },
   "text": {
    "it": "Applica un effetto sull'eroe che aumenta del [FFAE00]15%[-] i PS massimi all'inizio della battaglia.\\n[00D5FF](Si applica all'ingresso nella battaglia)[-]",
    "en": "Applies an effect on the hero which increases max HP by [FFAE00]15%[-] at the start of the battle.\\n[00D5FF](Applies when entering battle)[-]"
   }
  },
  "613213": {
   "name": {
    "it": "Aumento statistiche relative alla Difesa",
    "en": "Defense-related Stats Increase"
   },
   "text": {
    "it": "Aumenta le statistiche relative alla Difesa del [FFAE00]30%[-] quando sopravvive alla Mossa finale.\\n[00D5FF](Limite 1 volta/e)[-]",
    "en": "Increases Defense-related stats by [FFAE00]30%[-] when surviving an Ultimate Move.\\n[00D5FF](Limit 1 time(s))[-]"
   }
  },
  "613221": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta di un [FFAE00]0.5%[-] le statistiche di base dell'eroe per [FFAE00]ogni sfera[-] nelle barre Mossa finale sul campo di battaglia.",
    "en": "Increases the hero's basic stats by [FFAE00]0.5%[-] for [FFAE00]every orb[-] in Ultimate Move Gauges on the battlefield."
   }
  },
  "613222": {
   "name": {
    "it": "Riduzione Barra Mossa finale",
    "en": "Ultimate Move Gauge Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]2 sfera/e[-] la Barra Mossa finale quando l'eroe entra in battaglia.",
    "en": "Decreases enemies' Ultimate Move Gauges by [FFAE00]2 orb(s)[-] when the hero enters the battle."
   }
  },
  "613223": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] l'Attacco dell'eroe all'inizio del turno successivo se l'Eroe non subisce danni.\\n[00D5FF](Si resetta dopo aver subito danni)[-]",
    "en": "Increases the hero's Attack by [FFAE00]50%[-] at the start of the next turn if the hero doesn't take damage.\\n[00D5FF](Resets upon taking damage)[-]"
   }
  },
  "613231": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta il Danno critico dell'eroe di [FFAE00]50%[-].",
    "en": "Increases the hero's Crit Damage by [FFAE00]50%[-]."
   }
  },
  "613232": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] il Danno critico dell'eroe per ogni uso delle abilità.\\n[00D5FF](Limite: 20 volta/e)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]5%[-] per hero skill use.\\n[00D5FF](Limit 20 time(s))[-]"
   }
  },
  "613233": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]2%[-] le statistiche relative all'Attacco all'inizio del turno degli alleati se l'eroe ha subito danni durante il turno nemico precedente.\\n[00D5FF](Limite: 10 volta/e)[-]",
    "en": "Increases Attack-related stats by [FFAE00]2%[-] at the start of the allies' turn if the hero took damage during the enemy's previous turn.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "613234": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta Possibilità critico/Danno critico al calare dei PS rimanenti dell'eroe.\\n[00D5FF](L'1% dei PS massimi persi aumenta le statistiche dello 0,2%)[-]",
    "en": "Increases Crit Chance/Crit Damage as the hero's remaining HP decreases.\\n[00D5FF](1% of max HP lost increases the stats by 0.2%)[-]"
   }
  },
  "613241": {
   "name": {
    "it": "Comportamento radicato",
    "en": "Grounded Attitude"
   },
   "text": {
    "it": "Applica 4 effetti Incendio su tutti i nemici quando assumono un Atteggiamento.",
    "en": "Applies 4 Ignite effects on all enemies when assuming a Stance."
   }
  },
  "613242": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta l'Attacco di un valore pari al [FFAE00]15%[-] della Difesa dell'eroe all'inizio della battaglia.",
    "en": "Increases Attack by a value equal to [FFAE00]15%[-] of the hero's Defense at the start of the battle."
   }
  },
  "613243": {
   "name": {
    "it": "Riduzione PS massimi del nemico",
    "en": "Enemy Max HP Decrease"
   },
   "text": {
    "it": "Riduce i PS massimi di tutti i nemici del [FFAE00]150%[-] della Difesa dell'eroe.",
    "en": "Decreases all enemies' Max HP by the value of [FFAE00]150%[-] of the hero's Defense."
   }
  },
  "613251": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Aggressione difensiva\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Defensive Aggression\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "613252": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Ululato di massa\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Mass Howling\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "613253": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Benedizione solare\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Solar Blessing\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "613254": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Palla scintillante\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Flare Ball\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "613255": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Buco nero dell'ombra\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Shadow Blackhole\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "613256": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Mandria dell'ombra\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Shadow Herd\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "613257": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Irascibile\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Short Temper\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "613258": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Aggressione difensiva\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Defensive Aggression\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "613259": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Buco nero dell'ombra\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Shadow Blackhole\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "613260": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Artiglio del lupo\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Wolf Claw\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "613261": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Benedizione solare\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Solar Blessing\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "613262": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Artiglio del lupo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Wolf Claw\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "613271": {
   "name": {
    "it": "Terra bruciata",
    "en": "Scorched Earth"
   },
   "text": {
    "it": "All'inizio del turno degli alleati, [FFAE00]3[-] effetti [00D5FF]Incendio[-] vengono applicati su tutti i nemici per [FFAE00]3 turni[-], riducendo del [FFAE00]5%[-] i danni inflitti a tutti gli alleati per [FFAE00]ogni[-] effetto [00D5FF]Incendio[-] su un nemico.\\n[00D5FF](Si applica all'ingresso nella battaglia, escluso lo Scontro finale)[-]",
    "en": "At the beginning of the allies' turn, [FFAE00]3[-] [00D5FF]Ignite[-] effects are applied on all enemies for [FFAE00]3 turns[-], reducing damage dealt to allies by [FFAE00]5%[-] for [FFAE00]each[-] [00D5FF]Ignite[-] effect on an enemy.\\n[00D5FF](Applies when entering battle, excludes Death Match)[-]"
   }
  },
  "613272": {
   "name": {
    "it": "Fredda oscurità",
    "en": "Cold Darkness"
   },
   "text": {
    "it": "Applica casualmente [FFAE00]uno[-] dei seguenti effetti su ciascun nemico per [FFAE00]1 turno[-] all'inizio del turno degli alleati: [00D5FF]Congelamento, Riduzione statistiche relative alla Difesa del [FFAE00]50%[-], Corrosione o rimozione di 2 sfere dalla Barra Mossa finale alla fine del turno del nemico[-].",
    "en": "Randomly applies [FFAE00]one[-] of the following effects on each enemy for [FFAE00]1 turn[-] at the start of the allies' turn: [00D5FF]Freeze, [FFAE00]50%[-] Defense-related stats Decrease, Corrosion, or 2 Ultimate Move orbs removed at the end of the enemy's turn[-]."
   }
  },
  "613273": {
   "name": {
    "it": "Terra bruciata",
    "en": "Scorched Earth"
   },
   "text": {
    "it": "All'inizio del turno degli alleati, [FFAE00]1[-] effetto [00D5FF]Incendio[-] viene applicato su tutti i nemici per [FFAE00]3 turni[-], riducendo del [FFAE00]5%[-] i danni inflitti a tutti gli alleati per [FFAE00]ogni[-] effetto [00D5FF]Incendio[-] su un nemico.\\n[00D5FF](Si applica all'ingresso nella battaglia, escluso lo Scontro finale)[-]",
    "en": "At the beginning of the allies' turn, [FFAE00]1[-] [00D5FF]Ignite[-] effect is applied on all enemies for [FFAE00]3 turns[-], reducing damage dealt to allies by [FFAE00]5%[-] for [FFAE00]each[-] [00D5FF]Ignite[-] effect on an enemy.\\n[00D5FF](Applies when entering battle, excludes Death Match)[-]"
   }
  },
  "613274": {
   "name": {
    "it": "Fredda oscurità",
    "en": "Cold Darkness"
   },
   "text": {
    "it": "Applica casualmente [FFAE00]uno[-] dei seguenti effetti su ciascun nemico per [FFAE00]1 turno[-] all'inizio del turno degli alleati: [00D5FF]Congelamento, Disabilita Buff, Disabilita Atteggiamento o Riduzione statistiche relative all'Attacco del [FFAE00]30%[-][-].",
    "en": "Randomly applies [FFAE00]one[-] of the following effects on each enemy for [FFAE00]1 turn[-] at the start of the allies' turn: [00D5FF]Freeze, Buff Disable, Stance Disable, or [FFAE00]30%[-] Attack-related stats Decrease[-]."
   }
  },
  "613278": {
   "name": {
    "it": "Fredda oscurità",
    "en": "Cold Darkness"
   },
   "text": {
    "it": "Applica casualmente [FFAE00]uno[-] dei seguenti effetti su ciascun nemico per [FFAE00]1 turno[-] all'inizio del turno degli alleati: [00D5FF]Congelamento, Disabilita Buff, Disabilita Atteggiamento o Riduzione statistiche relative all'Attacco del [FFAE00]30%[-][-].",
    "en": "Randomly applies [FFAE00]one[-] of the following effects on each enemy for [FFAE00]1 turn[-] at the start of the allies' turn: [00D5FF]Freeze, Buff Disable, Stance Disable, or [FFAE00]30%[-] Attack-related stats Decrease[-]."
   }
  },
  "613279": {
   "name": {
    "it": "Immunità a Oscurità",
    "en": "Darkness Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]Oscurità[-].",
    "en": "The hero becomes immune to [00D5FF]Darkness[-]."
   }
  },
  "613281": {
   "name": {
    "it": "Immortalità",
    "en": "Immortality"
   },
   "text": {
    "it": "I PS dell'eroe non scendono sotto [FFAE00]1[-].",
    "en": "The hero's HP does not drop below [FFAE00]1[-]."
   }
  },
  "613282": {
   "name": {
    "it": "Aumento Possibilità critico",
    "en": "Crit Chance Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico degli alleati del [FFAE00]10%[-] per [FFAE00]ogni sfera[-] piena nella barra Mossa finale dell'eroe.",
    "en": "Increases allies' Crit Chance by [FFAE00]10%[-] for [FFAE00]every orb[-] filled in the hero's Ultimate Move Gauge."
   }
  },
  "613283": {
   "name": {
    "it": "Aumento Difesa",
    "en": "Defense Increase"
   },
   "text": {
    "it": "Aumenta la Difesa degli alleati del [FFAE00]30%[-] per [FFAE00]ogni sfera[-] piena nella barra Mossa finale dell'eroe.",
    "en": "Increases allies' Defense by [FFAE00]30%[-] for [FFAE00]every orb[-] filled in the hero's Ultimate Move Gauge."
   }
  },
  "613284": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti gli effetti Debuff[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuff effects[-]."
   }
  },
  "613285": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti [00D5FF]Stordimento, Pietrificazione, Congelamento, Coercizione, Espulsione, Corrosione, Disabilita abilità e Fuoco[-].",
    "en": "The hero becomes immune to [00D5FF]Stun, Petrify, Freeze, Coerce, Expel, Corrosion, Skill Disable, and Burn[-] effects."
   }
  },
  "613286": {
   "name": {
    "it": "Immunità a Inabilità",
    "en": "Incapacitation Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Congelamento, Pietrificazione, Stordimento e Svenimento[-].",
    "en": "Immune to [00D5FF]Freeze, Petrify, Stun, and Blackout[-]."
   }
  },
  "613287": {
   "name": {
    "it": "Rimuovi Buff",
    "en": "Remove Buffs"
   },
   "text": {
    "it": "Rimuove tutti i Buff [00D5FF]Aumento Attacco[-] dai nemici all'inizio del turno degli alleati.",
    "en": "Removes all Buffs from enemies with [00D5FF]Attack Increase[-] at the start of the allies' turn."
   }
  },
  "613288": {
   "name": {
    "it": "Rimuovi Buff",
    "en": "Remove Buffs"
   },
   "text": {
    "it": "Rimuove tutti i Buff dai nemici con [00D5FF]Immunità ai Debuff[-] all'inizio del turno degli alleati.",
    "en": "Removes all Buffs from enemies with [00D5FF]Debuff Immunity[-] at the start of the allies' turn."
   }
  },
  "613294": {
   "name": {
    "it": "Ululato",
    "en": "Howling"
   },
   "text": {
    "it": "Riduce del [FFAE00]20%[-] le statistiche relative ai PS per [FFAE00]2 turni[-] se i nemici hanno almeno [FFAE00]7[-] Debuff all'inizio del turno degli alleati.",
    "en": "Decreases HP-related stats by [FFAE00]20%[-] for [FFAE00]2 turns[-] if enemies have [FFAE00]7[-] or more Debuffs at the start of the allies' turn."
   }
  },
  "613295": {
   "name": {
    "it": "Ululato",
    "en": "Howling"
   },
   "text": {
    "it": "Riduce del [FFAE00]20%[-] le statistiche relative ai PS per [FFAE00]2 turni[-] se i nemici hanno almeno [FFAE00]6[-] Debuff all'inizio del turno degli alleati.",
    "en": "Decreases HP-related stats by [FFAE00]20%[-] for [FFAE00]2 turns[-] if enemies have [FFAE00]6[-] or more Debuffs at the start of the allies' turn."
   }
  },
  "613298": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]30%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]30%[-] of Max HP."
   }
  },
  "613299": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] le statistiche di base dell'eroe quando un nemico usa un'Abilità Rango aumentato durante il turno del nemico.\\n[00D5FF](Limite: 10 volte)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]100%[-] when an enemy uses a Rank Up Skill during the enemy's turn.\\n[00D5FF](Limit 10 times)[-]"
   }
  },
  "613300": {
   "name": {
    "it": "Recupero PS",
    "en": "HP Recovery"
   },
   "text": {
    "it": "L'eroe recupera il [FFAE00]3%[-] dei PS massimi [FFAE00]per ogni Buff[-] sull'eroe all'inizio del turno.",
    "en": "The hero recovers [FFAE00]3%[-] of Max HP [FFAE00]per Buff[-] on the hero at the start of the turn."
   }
  },
  "613301": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] l'Attacco degli alleati per [FFAE00]ogni[-] buff applicato sull'eroe.",
    "en": "Increases allies' Attack by [FFAE00]5%[-] for [FFAE00]every[-] Buff applied to the hero."
   }
  },
  "613302": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]2%[-] le statistiche di base per [FFAE00]ogni[-] Debuff su nemici.\\n[00D5FF](Nessun limite)[-]",
    "en": "Increases basic stats by [FFAE00]2%[-] for [FFAE00]each[-] Debuff on enemies.\\n[00D5FF](No limit)[-]"
   }
  },
  "613303": {
   "name": {
    "it": "Aumento PS",
    "en": "HP Increase"
   },
   "text": {
    "it": "Aumenta i PS massimi dell'eroe del [FFAE00]3%[-] per [FFAE00]ogni[-] Debuff applicato sui nemici.",
    "en": "Increases the hero's Max HP by [FFAE00]3%[-] for [FFAE00]every[-] Debuff applied on enemies."
   }
  },
  "613311": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] il Danno critico dell'eroe [FFAE00]per ogni sfera[-] rimossa dalla Barra Mossa finale dell'eroe.\\n[00D5FF](Limite: 10 volta/e. Esclude svuotamento dalla Barra Mossa finale.)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]10%[-] [FFAE00]for each orb[-] removed from the hero's Ultimate Move Gauge.\\n[00D5FF](Limit 10 time(s), excludes depletion from Ultimate Move use)[-]"
   }
  },
  "613312": {
   "name": {
    "it": "Resistenza critico/Riduzione Difesa",
    "en": "Crit Resistance/Defense Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]25%[-] la Resistenza critico e la Difesa critico di tutti i nemici.",
    "en": "Decreases all enemies' Crit Resistance and Crit Defense by [FFAE00]25%[-]."
   }
  },
  "613313": {
   "name": {
    "it": "Riduzione statistiche relative alla Difesa",
    "en": "Defense-related Stats Decrease"
   },
   "text": {
    "it": "Se un nemico subisce danni da Colpo critico dall'attacco dell'eroe, applica un effetto su quel nemico che riduce del [FFAE00]40%[-] le statistiche relative alla Difesa per [FFAE00]2 turni[-].",
    "en": "When an enemy takes Critical Strike damage from the hero's attack, an effect is applied on that enemy which decreases Defense-related stats by [FFAE00]40%[-] for [FFAE00]2 turns[-]."
   }
  },
  "613315": {
   "name": {
    "it": "Disprezzo per i deboli",
    "en": "Scorn for the Weak"
   },
   "text": {
    "it": "Infligge [FFAE00]40%[-] danni aggiuntivi quando l'eroe attacca un nemico con un Attacco inferiore.",
    "en": "Deals [FFAE00]40%[-] additional damage when the hero attacks an enemy with a lower Attack."
   }
  },
  "613316": {
   "name": {
    "it": "Riverbero Debuff",
    "en": "Debuff Resonance"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] l'Attacco dell'eroe per [FFAE00]ogni[-] Debuff applicato su tutti i nemici.",
    "en": "Increases the hero's Attack by [FFAE00]5%[-] for [FFAE00]every[-] Debuff applied on all enemies."
   }
  },
  "613317": {
   "name": {
    "it": "Individuazione di debolezza",
    "en": "Weakness Identification"
   },
   "text": {
    "it": "Aumenta di un [FFAE00]20%[-] i danni inflitti dall'eroe quando attacca i nemici affetti da Debuff.",
    "en": "Increases the hero's damage dealt by [FFAE00]20%[-] when attacking Debuffed enemies."
   }
  },
  "613319": {
   "name": {
    "it": "Riduzione statistiche",
    "en": "Stats Decrease"
   },
   "text": {
    "it": "All'inizio del turno degli alleati, riduce del [FFAE00]30%[-] l'Attacco del nemico con i PS rimanenti più alti\\n per [FFAE00]1 turno[-] e applica [00D5FF]Provocazione[-].",
    "en": "At the start of the allies' turn, decreases the Attack of the enemy with the highest remaining HP by [FFAE00]30%[-] for [FFAE00]1 turn[-] and applies [00D5FF]Taunt[-]."
   }
  },
  "613320": {
   "name": {
    "it": "Aumento danni subiti",
    "en": "Damage Taken Increase"
   },
   "text": {
    "it": "All'inizio del turno degli alleati, aumenta del [FFAE00]10%[-] i danni\\n subiti dai nemici per [FFAE00]1 turno[-] \\ned esclude il nemico con i PS rimanenti più alti.",
    "en": "At the start of the allies' turn, increases enemies' damage taken by [FFAE00]10%[-] for [FFAE00]1 turn[-] excluding the enemy with the highest remaining HP."
   }
  },
  "613321": {
   "name": {
    "it": "Avvenimento Colpo critico",
    "en": "Critical Strike Occurrence"
   },
   "text": {
    "it": "[00D5FF]Attaccare il nemico[-] con la percentuale più bassa di PS causerà un Colpo critico.\\n[00D5FF](Si attiva attaccando l’ultimo nemico rimasto o quando ci sono due nemici con la stessa percentuale di PS.)[-]",
    "en": "[00D5FF]Attacking the enemy with the lowest[-] percentage of HP results in a critical strike.\\n[00D5FF](Activates even when attacking the last remaining enemy or when there are two enemies with the same HP percentage.)[-]"
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
  "800081": {
   "name": {
    "it": "Ignora Elusione",
    "en": "Ignore Evasion"
   },
   "text": {
    "it": "Ignora Elusione quando attacca.",
    "en": "Ignores Evasion when attacking."
   }
  },
  "901401": {
   "name": {
    "it": "Riverbero Debuff",
    "en": "Debuff Resonance"
   },
   "text": {
    "it": "Aumenta del [FFAE00]4%[-] l'Attacco dell'eroe per [FFAE00]ogni[-] Debuff applicato su tutti i nemici.",
    "en": "Increases the hero's Attack by [FFAE00]4%[-] for [FFAE00]every[-] Debuff applied on all enemies."
   }
  },
  "901402": {
   "name": {
    "it": "Aumento statistiche relative alla Difesa",
    "en": "Defense-related Stats Increase"
   },
   "text": {
    "it": "Aumenta le statistiche relative alla Difesa del [FFAE00]20%[-] quando sopravvive alla Mossa finale.\\n[00D5FF](Limite 1 volta/e)[-]",
    "en": "Increases Defense-related stats by [FFAE00]20%[-] when surviving an Ultimate Move.\\n[00D5FF](Limit 1 time(s))[-]"
   }
  },
  "901403": {
   "name": {
    "it": "Resistenza critico/Riduzione Difesa",
    "en": "Crit Resistance/Defense Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]20%[-] la Resistenza critico e la Difesa critico di tutti i nemici.",
    "en": "Decreases all enemies' Crit Resistance and Crit Defense by [FFAE00]20%[-]."
   }
  },
  "901404": {
   "name": {
    "it": "Aumento PS",
    "en": "HP Increase"
   },
   "text": {
    "it": "Aumenta i PS dell'eroe di [FFAE00]15%[-].",
    "en": "Increases the hero's HP by [FFAE00]15%[-]."
   }
  },
  "901405": {
   "name": {
    "it": "Ignora Difesa",
    "en": "Ignore Defense"
   },
   "text": {
    "it": "L'eroe ignora [FFAE00]40%[-] della Difesa del nemico quando usa le abilità. [00D5FF](Si applica prima dell'attivazione dell'abilità)[-]",
    "en": "The hero ignores [FFAE00]40%[-] of enemy Defense when using skills.[00D5FF](Applies before skill activation)[-]"
   }
  },
  "901406": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]20%[-] i danni inflitti dai nemici a questo eroe.",
    "en": "Decreases the damage this hero takes from enemies by [FFAE00]20%[-]."
   }
  },
  "901407": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] il Danno critico dell'eroe per ogni uso delle abilità.\\n[00D5FF](Limite: 10 volta/e)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]5%[-] per hero skill use.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "901408": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]3%[-] l'Attacco dell'Eroe alla fine del turno degli alleati.\\n[00D5FF](Limite 5 volte)[-]",
    "en": "Increases the hero's Attack by [FFAE00]3%[-] at the end of the allies' turn.\\n[00D5FF](Limit 5 times)[-]"
   }
  },
  "901409": {
   "name": {
    "it": "Risoluzione disperata",
    "en": "Desperate Resolve"
   },
   "text": {
    "it": "Riempie la barra Mossa finale dell'eroe di [FFAE00]1 sfera/e[-] all'inizio della battaglia.",
    "en": "Fills the hero's Ultimate Move Gauge by [FFAE00]1 orb(s)[-] at the start of the battle."
   }
  },
  "901506": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti i Debuff[-] oltre che a [00D5FF]Coercizione, Espulsione e Oscurità[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuffs[-], as well as [00D5FF]Coerce, Expel, and Darkness[-]."
   }
  },
  "901507": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Stordimento / Pietrificazione / Congelamento / Coercizione / Espulsione / Corrosione / Infezione / Oscurità / Disabilita abilità / Fuoco[-].",
    "en": "Immune to [00D5FF]Stun / Petrify / Freeze / Coerce / Expel / Corrosion / Infect / Darkness / Skill Disable / Burn[-]."
   }
  },
  "901511": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]35%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]35%[-] of Max HP."
   }
  },
  "901512": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]35%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]35%[-] of Max HP."
   }
  },
  "901514": {
   "name": {
    "it": "Immunità a Riduzione statistiche",
    "en": "Stat Decrease Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti di [00D5FF]Riduzione statistiche[-].",
    "en": "The hero becomes immune to [00D5FF]Stat Decrease[-] effects."
   }
  },
  "901515": {
   "name": {
    "it": "Immunità a danni nel tempo",
    "en": "Damage Over Time Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti [00D5FF]Sanguinamento, Avvelenamento, Shock, Corrosione, Ossidazione e Fuoco[-].",
    "en": "The hero becomes immune to [00D5FF]Bleed, Poison, Shock, Corrosion, Oxidize, and Burn[-] effects."
   }
  },
  "901516": {
   "name": {
    "it": "Aumento PS",
    "en": "HP Increase"
   },
   "text": {
    "it": "Aumenta i PS massimi dell'eroe del [FFAE00]3%[-] per [FFAE00]ogni[-] Debuff applicato sui nemici.",
    "en": "Increases the hero's Max HP by [FFAE00]3%[-] for [FFAE00]every[-] Debuff applied on enemies."
   }
  },
  "901517": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] le statistiche di base dell'eroe quando un nemico usa un'Abilità Rango aumentato durante il turno del nemico.\\n[00D5FF](Limite: 10 volte)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]100%[-] when an enemy uses a Rank Up Skill during the enemy's turn.\\n[00D5FF](Limit 10 times)[-]"
   }
  },
  "901518": {
   "name": {
    "it": "Riduzione statistiche relative ai PS",
    "en": "HP-related Stats Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] la Velocità di rigenerazione, la Velocità di recupero e il Furto di vita del nemico.",
    "en": "Decreases the enemy's Regeneration Rate, Recovery Rate, and Lifesteal by [FFAE00]40%[-]."
   }
  },
  "901521": {
   "name": {
    "it": "Atteggiamento minaccioso",
    "en": "Threatening Posture"
   },
   "text": {
    "it": "Applica Infezione su tutti i nemici per [FFAE00]2 turno/i[-] quando assume un Atteggiamento.",
    "en": "Applies Infect on all enemies for [FFAE00]2 turn(s)[-] when assuming a Stance."
   }
  },
  "901522": {
   "name": {
    "it": "Fiamma Definitiva",
    "en": "Final Flame"
   },
   "text": {
    "it": "Applica [00D5FF]Fiamma Sacra[-] su sé stesso all'inizio della battaglia. Aumenta del [FFAE00]1%[-] i danni inflitti dall'eroe dopo aver usato un'abilità fino a [FFAE00]4 volte[-]. [00D5FF]Tutte le statistiche dell'eroe non scendono al di sotto dei loro valori iniziali.[-]\\nQuando subisce danni fatali, le statistiche relative all'Attacco dell'eroe aumentano del [FFAE00]30%[-].\\n\\n[00D5FF]※Fiamma Sacra: aumenta tutte le statistiche del [FFAE00]4%[-] col passare di ogni turno, per [FFAE00]5 turni[-].[-]",
    "en": "Applies [00D5FF]Holy Flame[-] on self at the start of the battle. Increases the hero's damage dealt by [FFAE00]1%[-] after using a skill, up to [FFAE00]4 times[-]. [00D5FF]All of the hero's stats do not drop below their initial values.[-]\\nWhen taking fatal damage, the hero's Attack-related stats increase by [FFAE00]30%[-].\\n\\n[00D5FF]※Holy Flame: Increases all stats by [FFAE00]4%[-] with each passing turn for [FFAE00]5 turns[-][-]"
   }
  },
  "901525": {
   "name": {
    "it": "Amico del drago della tempesta",
    "en": "Storm Dragon's Friend"
   },
   "text": {
    "it": "Se l'eroe subisce danni, le statistiche relative all'Attacco dell'eroe aumentano del [FFAE00]0[-] e le statistiche relative alla Difesa aumentano del [FFAE00]3%[-] all'inizio del turno degli alleati.\\n[00D5FF](Limite: 99 volta/e)[-]",
    "en": "If the hero takes damage, the hero's Attack-related stats increase by [FFAE00]0[-] and Defense-related stats increase by [FFAE00]3%[-] at the start of the allies' turn.\\n[00D5FF](Limit 99 time(s))[-]"
   }
  },
  "901530": {
   "name": {
    "it": "Ignora Elusione",
    "en": "Ignore Evasion"
   },
   "text": {
    "it": "Ignora Elusione quando attacca.",
    "en": "Ignores Evasion when attacking."
   }
  },
  "901569": {
   "name": {
    "it": "Riduzione danni Mossa finale subiti",
    "en": "Ultimate Move Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] i danni subiti dall'eroe nelle Mosse finali.",
    "en": "Decreases the hero's damage taken from Ultimate Moves by [FFAE00]30%[-]."
   }
  },
  "901571": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]1%[-] i danni subiti da abilità per ogni [FFAE00]3%[-] dei [00D5FF]PS rimanenti[-] dell'eroe.",
    "en": "Decreases damage taken from skills by [FFAE00]1%[-] for every [FFAE00]3%[-] of the hero's [00D5FF]remaining HP[-]."
   }
  },
  "901572": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]1%[-] i danni subiti da abilità per ogni [FFAE00]2%[-] dei [00D5FF]PS rimanenti[-] dell'eroe.",
    "en": "Decreases damage taken from skills by [FFAE00]1%[-] for every [FFAE00]2%[-] of the hero's [00D5FF]remaining HP[-]."
   }
  },
  "901574": {
   "name": {
    "it": "Riduzione danni Contrattacco",
    "en": "Counter Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]1000%[-] i danni subiti dall'eroe dai Contrattacchi.",
    "en": "Decreases the hero's damage taken from Counterattacks by [FFAE00]1000%[-]."
   }
  },
  "901576": {
   "name": {
    "it": "Immunità",
    "en": "Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Disabilita abilità, Riduzione statistiche, Sanguinamento, Avvelenamento, Shock, Stordimento, Pietrificazione, Congelamento, Corrosione, Ossidazione, Fuoco, Blocco Effetto Abilità e Svenimento[-], oltre che a [00D5FF]Coercizione, Espulsione e Oscurità[-].",
    "en": "Immune to [00D5FF]Skill Disable, Stat Decrease, Bleed, Poison, Shock, Stun, Petrify, Freeze, Corrosion, Oxidize, Burn, Skill Effect Block, and Blackout[-], as well as [00D5FF]Coerce, Expel, and Darkness[-]."
   }
  },
  "901581": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Raffica di spine\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Hail of Thorns\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "901582": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Pungiglione contorto\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Twisted Stinger\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "901583": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Mega gobba\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Massive Bump\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "901585": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Assorbimento nero\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Black Absorption\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "901586": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Spine difensive\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Defensive Thorns\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "901587": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Pungiglione contorto\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Twisted Stinger\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "901589": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Mega gobba\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Massive Bump\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "901590": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Mega morso\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Massive Bite\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "901591": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Assorbimento nero\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Black Absorption\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "901592": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Spine difensive\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Defensive Thorns\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "901595": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Mega morso\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Massive Bite\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "901596": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Agonia mortale\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Death Throes\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "951580": {
   "name": {
    "it": "Ignora Difesa",
    "en": "Ignore Defense"
   },
   "text": {
    "it": "L'eroe ignora [FFAE00]40%[-] della Difesa del nemico quando usa le abilità. [00D5FF](Si applica prima dell'attivazione dell'abilità)[-]",
    "en": "The hero ignores [FFAE00]40%[-] of enemy Defense when using skills.[00D5FF](Applies before skill activation)[-]"
   }
  },
  "951581": {
   "name": {
    "it": "Aumento Danno critico/Possibilità critico",
    "en": "Crit Chance / Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]20%[-] il Danno critico e la Possibilità critico dell'eroe.",
    "en": "Increases the hero's Crit Chance and Crit Damage by [FFAE00]20%[-]."
   }
  },
  "951582": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] l'Attacco dell'eroe all'inizio del turno successivo se l'Eroe non subisce danni.\\n[00D5FF](Si resetta dopo aver subito danni)[-]",
    "en": "Increases the hero's Attack by [FFAE00]10%[-] at the start of the next turn if the hero doesn't take damage.\\n[00D5FF](Resets upon taking damage)[-]"
   }
  },
  "951583": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] le statistiche di base dell'eroe quando un nemico usa un'Abilità Rango aumentato durante il turno del nemico.\\n[00D5FF](Limite: 10 volte)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]10%[-] when an enemy uses a Rank Up Skill during the enemy's turn.\\n[00D5FF](Limit 10 times)[-]"
   }
  },
  "951584": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]2%[-] l'Attacco dell'Eroe alla fine del turno degli alleati.\\n[00D5FF](Limite 5 volte)[-]",
    "en": "Increases the hero's Attack by [FFAE00]2%[-] at the end of the allies' turn.\\n[00D5FF](Limit 5 times)[-]"
   }
  },
  "951585": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] il Danno critico dell'eroe [FFAE00]per ogni sfera[-] rimossa dalla Barra Mossa finale dell'eroe.\\n[00D5FF](Limite: 10 volta/e. Esclude svuotamento dalla Barra Mossa finale.)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]10%[-] [FFAE00]for each orb[-] removed from the hero's Ultimate Move Gauge.\\n[00D5FF](Limit 10 time(s), excludes depletion from Ultimate Move use)[-]"
   }
  },
  "951586": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]10%[-] i danni inflitti dai nemici a questo eroe.",
    "en": "Decreases the damage this hero takes from enemies by [FFAE00]10%[-]."
   }
  },
  "951587": {
   "name": {
    "it": "Aumento PS",
    "en": "HP Increase"
   },
   "text": {
    "it": "Applica un effetto sull'eroe che aumenta del [FFAE00]15%[-] i PS massimi all'inizio della battaglia.\\n[00D5FF](Si applica all'ingresso nella battaglia)[-]",
    "en": "Applies an effect on the hero which increases max HP by [FFAE00]15%[-] at the start of the battle.\\n[00D5FF](Applies when entering battle)[-]"
   }
  },
  "951588": {
   "name": {
    "it": "Risoluzione disperata",
    "en": "Desperate Resolve"
   },
   "text": {
    "it": "Riempie la barra Mossa finale dell'eroe di [FFAE00]1 sfera/e[-] all'inizio della battaglia.",
    "en": "Fills the hero's Ultimate Move Gauge by [FFAE00]1 orb(s)[-] at the start of the battle."
   }
  },
  "951589": {
   "name": {
    "it": "Riduzione Barra Mossa finale",
    "en": "Ultimate Move Gauge Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]1 sfera/e[-] la Barra Mossa finale quando l'eroe entra in battaglia.",
    "en": "Decreases enemies' Ultimate Move Gauges by [FFAE00]1 orb(s)[-] when the hero enters the battle."
   }
  },
  "951601": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Frutto fantastico\" ogni [FFAE00]1 turno/i[-] al dispositivo di legno sospetto 3.",
    "en": "Uses \"Brilliant Fruit\" every [FFAE00]1 turn(s)[-] at Suspicious Wooden Device 3."
   }
  },
  "951602": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Guscio statico\" ogni [FFAE00]2 turno/i[-] al dispositivo di legno sospetto 2.",
    "en": "Uses \"Static Shell\" every [FFAE00]2 turn(s)[-] at Suspicious Wooden Device 2."
   }
  },
  "951603": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Velocità della luce\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Lightning Speed\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "951604": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Frutto fantastico\" ogni [FFAE00]2 turno/i[-] al dispositivo di legno sospetto 3.",
    "en": "Uses \"Brilliant Fruit\" every [FFAE00]2 turn(s)[-] at Suspicious Wooden Device 3."
   }
  },
  "951605": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Velocità della luce\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Lightning Speed\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "951606": {
   "name": {
    "it": "Aumento uso abilità",
    "en": "Skill Use Increase"
   },
   "text": {
    "it": "Il numero di utilizzi abilità è fissato a [FFAE00]3[-].",
    "en": "The number of skill uses is fixed to [FFAE00]3[-]."
   }
  },
  "951607": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta le statistiche di base dell'eroe del [FFAE00]2%[-] per [FFAE00]ogni[-] Debuff applicato su tutti i nemici.\\n[00D5FF](Limite 10 volta/e)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]2%[-] for [FFAE00]every[-] Debuff applied on all enemies.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "951608": {
   "name": {
    "it": "Riduzione danni Contrattacco e Riflessione",
    "en": "Counter and Reflect Damage Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]500%[-] i danni subiti dall'eroe dai Contrattacchi e Riflessione.",
    "en": "Decreases the hero's damage taken from Counterattacks and Reflect by [FFAE00]500%[-]."
   }
  },
  "951610": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Debuff applicabile/i: [FFAE00]1[-]. Aumenta l'Attacco di [FFAE00]5%[-] quando subisce un Debuff.",
    "en": "Only [FFAE00]1[-] Debuff(s) can be applied. Increases Attack by [FFAE00]5%[-] when Debuffed."
   }
  },
  "951611": {
   "name": {
    "it": "Rimuovi Buff",
    "en": "Remove Buffs"
   },
   "text": {
    "it": "Rimuove tutti i Buff dai nemici con [00D5FF]Immunità ai Debuff[-] all'inizio del turno degli alleati.",
    "en": "Removes all Buffs from enemies with [00D5FF]Debuff Immunity[-] at the start of the allies' turn."
   }
  },
  "951612": {
   "name": {
    "it": "Riduzione statistiche relative ai PS",
    "en": "HP-related Stats Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] la Velocità di rigenerazione, la Velocità di recupero e il Furto di vita del nemico.",
    "en": "Decreases the enemy's Regeneration Rate, Recovery Rate, and Lifesteal by [FFAE00]40%[-]."
   }
  },
  "951613": {
   "name": {
    "it": "Recupero PS",
    "en": "HP Recovery"
   },
   "text": {
    "it": "Rimuove i Debuff dell'eroe, cura completamente i suoi PS, e aumenta del [FFAE00]5%[-] tutte le statistiche quando un eroe sopravvive con [FFAE00]30%[-] PS o meno.\\n[00D5FF](Limite di una volta)[-]",
    "en": "Removes the hero's Debuffs, fully heals their HP, and increases all stats by [FFAE00]5%[-] when the hero survives with [FFAE00]30%[-] HP or less.\\n[00D5FF](Limit once)[-]"
   }
  },
  "951620": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Debuff applicabile/i: [FFAE00]3[-]. Aumenta l'Attacco di [FFAE00]5%[-] quando subisce un Debuff.",
    "en": "Only [FFAE00]3[-] Debuff(s) can be applied. Increases Attack by [FFAE00]5%[-] when Debuffed."
   }
  },
  "951621": {
   "name": {
    "it": "Il combinaguai dell'Albero del mondo",
    "en": "World Tree's Troublemaker"
   },
   "text": {
    "it": "Applica [00D5FF]Immortalità[-] su di sé se i dispositivi di legno sospetti 2 e 3 hanno ancora dei PS.",
    "en": "Applies [00D5FF]Immortality[-] on self if the Suspicious Wooden Devices 2 and 3 have HP remaining."
   }
  },
  "951622": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Velocità della luce\" ogni [FFAE00]2 turno/i[-] al dispositivo di legno sospetto 3.",
    "en": "Uses \"Lightning Speed\" every [FFAE00]2 turn(s)[-] at Suspicious Wooden Device 3."
   }
  },
  "951660": {
   "name": {
    "it": "Aumento PS",
    "en": "HP Increase"
   },
   "text": {
    "it": "Aumenta i PS dell'eroe di [FFAE00]100%[-].",
    "en": "Increases the hero's HP by [FFAE00]100%[-]."
   }
  },
  "951661": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta le statistiche di base dell'eroe del [FFAE00]20%[-].",
    "en": "Increases the hero's basic stats by [FFAE00]20%[-]."
   }
  },
  "951670": {
   "name": {
    "it": "Atteggiamento deciso",
    "en": "Solid Stance"
   },
   "text": {
    "it": "Riduce del [FFAE00]90%[-] i danni subiti dall'eroe quando assume un atteggiamento.",
    "en": "Decreases the hero's damage taken by [FFAE00]90%[-] when assuming a Stance."
   }
  },
  "951672": {
   "name": {
    "it": "L'inizio della vendetta",
    "en": "The Beginning of Vengeance"
   },
   "text": {
    "it": "L'eroe perde gli effetti Debuff quando usa un'abilità Atteggiamento e ottiene Immunità ai Debuff per [FFAE00]2 turni[-].\\n[00D5FF](Esclusa la Mossa finale)[-]",
    "en": "The hero's Debuffs are removed when using Stance Skills. The hero gains Debuff Immunity for [FFAE00]2 turns[-].\\n[00D5FF](Excluding Ultimate Moves)[-]"
   }
  },
  "951673": {
   "name": {
    "it": "Effetto sospetto",
    "en": "Suspicious Effect"
   },
   "text": {
    "it": "Applica [FFAE00]Immortalità[-] sulla Bestia demoniaca se questo dispositivo di legno ha ancora dei PS.",
    "en": "Applies [FFAE00]Immortality[-] on the Demonic Beast if this Wooden Device has HP remaining."
   }
  },
  "951674": {
   "name": {
    "it": "Comportamento radicato",
    "en": "Grounded Attitude"
   },
   "text": {
    "it": "La Bestia demoniaca non si muove se sta [00D5FF]assumendo un Atteggiamento[-] attraverso il Dispositivo di legno sospetto 2.",
    "en": "The Demonic Beast does not move if it is [00D5FF]assuming a Stance[-] by Suspicious Wooden Device 2."
   }
  },
  "951680": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta l'Attacco dell'eroe del [FFAE00]30%[-].",
    "en": "Increases the hero's Attack by [FFAE00]30%[-]."
   }
  },
  "951681": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Aumenta le statistiche degli alleati relative all'Attacco di [FFAE00]20%[-].",
    "en": "Increases allies' Attack-related stats by [FFAE00]20%[-]."
   }
  },
  "951682": {
   "name": {
    "it": "Aumento Tutte le Statistiche",
    "en": "All Stats Increase"
   },
   "text": {
    "it": "Aumenta tutte le statistiche dell'eroe del [FFAE00]20%[-].",
    "en": "Increases all stats of the hero by [FFAE00]20%[-]."
   }
  },
  "951683": {
   "name": {
    "it": "Effetto sospetto",
    "en": "Suspicious Effect"
   },
   "text": {
    "it": "Aumenta i PS della Bestia demoniaca del [FFAE00]500%[-] se questo dispositivo di legno ha ancora dei PS.",
    "en": "Increases the Demonic Beast's HP by [FFAE00]500%[-] if this Wooden Device has HP remaining."
   }
  },
  "951692": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]40%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]40%[-] of Max HP."
   }
  },
  "951693": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]33%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]33%[-] of Max HP."
   }
  },
  "951694": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]10%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]10%[-] of Max HP."
   }
  },
  "951695": {
   "name": {
    "it": "Immunità a Effetto",
    "en": "Effect Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti [00D5FF]Stordimento, Pietrificazione, Congelamento, Coercizione, Espulsione, Corrosione, Disabilita abilità e Fuoco[-].",
    "en": "The hero becomes immune to [00D5FF]Stun, Petrify, Freeze, Coerce, Expel, Corrosion, Skill Disable, and Burn[-] effects."
   }
  },
  "952101": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "952102": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Tornado abbattente\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Flap Tornado\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "952103": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Getto d'aria\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Air Blast\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "952104": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Tornado abbattente\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Flap Tornado\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "952105": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Squarcio aereo\" ogni [FFAE00]1 turno/i[-].",
    "en": "Uses \"Air Break\" every [FFAE00]1 turn(s)[-]."
   }
  },
  "952106": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Affondo opprimente\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Hunting Dive\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "952107": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Getto d'aria\" ogni [FFAE00]2 turni[-].",
    "en": "Uses \"Air Blast\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "952108": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Esplosione di vento\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Wind Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "952109": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "Diventa immune a [00D5FF]tutti gli effetti Debuff[-] oltre che a [00D5FF]Coercizione, Espulsione, Oscurità e Seme della fine[-].",
    "en": "Becomes immune to [00D5FF]all Debuff effects[-], as well as [00D5FF]Coerce, Expel, Darkness, and Seed of the End[-]."
   }
  },
  "952111": {
   "name": {
    "it": "Riduzione danni Contrattacco e Riflessione",
    "en": "Counter and Reflect Damage Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]1000%[-] i danni subiti dall'eroe dai Contrattacchi e Riflessione.",
    "en": "Decreases the hero's damage taken from Counterattacks and Reflect by [FFAE00]1000%[-]."
   }
  },
  "952113": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta le proprie statistiche base di [FFAE00]1000%[-] quando un'abilità nemica [00D5FF]sale di rango con un'abilità Unica o con un effetto Reliquia sacra[-].\\n[00D5FF](Limite: 1 volta/e)[-]",
    "en": "Increases own basic stats by [FFAE00]1000%[-] when an enemy's skill is [00D5FF]ranked up with a Unique ability or Holy Relic effect[-].\\n[00D5FF](Limit 1 time(s))[-]"
   }
  },
  "952114": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta le proprie statistiche base di [FFAE00]1000%[-] quando la barra Mossa finale di un nemico [00D5FF]si riempie con un'abilità Unica o un effetto Reliquia sacra[-].\\n[00D5FF](Limite: 1 volta/e)[-]",
    "en": "Increases own basic stats by [FFAE00]1000%[-] when an enemy's Ultimate Move Gauge is [00D5FF]filled with a Unique ability or Holy Relic effect[-].\\n[00D5FF](Limit 1 time(s))[-]"
   }
  },
  "952117": {
   "name": {
    "it": "Riduzione statistiche relative ai PS",
    "en": "HP-related Stats Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] la Velocità di rigenerazione, la Velocità di recupero e il Furto di vita del nemico.",
    "en": "Decreases the enemy's Regeneration Rate, Recovery Rate, and Lifesteal by [FFAE00]40%[-]."
   }
  },
  "952118": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]20%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]20%[-] of Max HP."
   }
  },
  "952119": {
   "name": {
    "it": "Vento di Yggdrasil",
    "en": "Yggdrasil's Wind"
   },
   "text": {
    "it": "Aumenta la Difesa dell'eroe del [FFAE00]50%[-] per [FFAE00]ogni[-] Debuff applicato a tutti i nemici.",
    "en": "Increases the hero's Defense by [FFAE00]50%[-] for [FFAE00]every[-] Debuff applied on all enemies."
   }
  },
  "952120": {
   "name": {
    "it": "Vento di Yggdrasil",
    "en": "Yggdrasil's Wind"
   },
   "text": {
    "it": "Applica [00D5FF]Protezione di Hraesvelgr[-] su tutti i nemici se il nemico usa [FFAE00]3[-] o più abilità dello stesso rango (Rango 2 o superiore) durante il turno del nemico.",
    "en": "Applies [00D5FF]Hraesvelgr's Protection[-] on all enemies if the enemy uses [FFAE00]3[-] or more skills of the same rank (Rank 2 or higher) during the enemy's turn."
   }
  },
  "952121": {
   "name": {
    "it": "Vento di Yggdrasil",
    "en": "Yggdrasil's Wind"
   },
   "text": {
    "it": "Applica [FFAE00]8[-] effetti [00D5FF]Immortalità[-] su di sé all'inizio della battaglia. [00D5FF]Immortalità[-] viene aggiunta o rimossa quando si subiscono danni da un'abilità con un determinato effetto durante il turno del nemico. Aumenta [00D5FF]tutte le proprie statistiche del [FFAE00]+100%[-][-] quando [00D5FF]Immortalità[-] raggiunge [FFAE00]15[-] accumuli.",
    "en": "Applies [FFAE00]8[-] [00D5FF]Immortality[-] effect(s) on self at the start of the battle. [00D5FF]Immortality[-] is added or removed when taking damage from a skill with a certain effect during the enemy's turn. Increases [00D5FF]all of own stats by [FFAE00]+100%[-][-] when [00D5FF]Immortality[-] reaches [FFAE00]15[-] stacks."
   }
  },
  "952122": {
   "name": {
    "it": "Vento di Yggdrasil",
    "en": "Yggdrasil's Wind"
   },
   "text": {
    "it": "Usare un'abilità applica [00D5FF]Furia di Hraesvelgr[-] sui nemici che subiscono danni da essa, con valori diversi in base alla sezione dei PS rimanenti di Hraesvelgr.\\n\\n[00D5FF]※Furia di Hraesvelgr: Danni inflitti [FFAE00]-10%[-].\\nInfligge [FFAE00]500000[-] danni fissi al bersaglio col massimo di accumuli, poi rimuove l'effetto.\\n(Può essere accumulato [FFAE00]7 volta/e[-])[-]",
    "en": "Using a skill applies [00D5FF]Hraesvelgr's Wrath[-] on enemies that take damage from it, applied differentially based on the section of Hraesvelgr's remaining HP.\\n\\n[00D5FF]※Hraesvelgr's Wrath: Damage dealt [FFAE00]-10%[-]\\nInflicts [FFAE00]500000[-] fixed damage on the target with max stacks, then removes the effect.\\n(Can be stacked [FFAE00]7 time(s)[-])[-]"
   }
  },
  "952123": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] l'Attacco dell'eroe alla fine del turno degli alleati.\\n[00D5FF](Limite 10 volta/e)[-]",
    "en": "Increases the hero's Attack by [FFAE00]10%[-] at the end of the allies' turn.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "952124": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Quando subire danni causa Pazienza, aumenta le [00D5FF]statistiche relative all'Attacco dell'eroe del [FFAE00]10%[-][-] per [FFAE00]2 turni[-].\\n[00D5FF](Può essere accumulato fino a 5 volte)[-]",
    "en": "When taking damage results in Patience, it increases the hero's own [00D5FF]Attack-related stats by [FFAE00]10%[-][-] for [FFAE00]2 turns[-].\\n[00D5FF](Can be stacked 5 times)[-]"
   }
  },
  "952125": {
   "name": {
    "it": "Aumento / Riduzione Danni subiti",
    "en": "Damage Taken Increase / Decrease"
   },
   "text": {
    "it": "Aumenta i propri danni subiti dai nemici con [00D5FF]Protezione di Hraesvelgr[-] del [FFAE00]300%[-]. Riduce i propri danni subiti dai nemici senza [00D5FF]Protezione di Hraesvelgr[-] del [FFAE00]300%[-].",
    "en": "Increases own damage taken from enemies with [00D5FF]Hraesvelgr's Protection[-] by [FFAE00]300%[-]. Decreases own damage taken from enemies without [00D5FF]Hraesvelgr's Protection[-] by [FFAE00]300%[-]."
   }
  },
  "952128": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]25%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]25%[-] of Max HP."
   }
  },
  "952131": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]1000%[-] le proprie statistiche di base quando un nemico usa un'Abilità Purificazione durante il turno del nemico.",
    "en": "Increases own basic stats by [FFAE00]1000%[-] when an enemy uses a Purify skill during the enemy's turn."
   }
  },
  "952142": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]50%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]50%[-] of Max HP."
   }
  },
  "953501": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Pioggia intensa\" ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Splash Shower\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "953502": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Stagno ghiacciato\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Icy Pond\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "953503": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Circolo d'acqua\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Water Loop\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "953504": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Frantumazione nebulosa\" ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Hazy Crush\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "953505": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Raffica ardente\" ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Fierce Rush\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "953506": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Bomba di Bolle\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Bubble Bomb\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "953507": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Rinfrescata\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Refresh\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "953508": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Corno Difensivo\" ogni [FFAE00]3 turno/i[-].",
    "en": "Uses \"Defensive Horn\" every [FFAE00]3 turn(s)[-]."
   }
  },
  "953509": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "Diventa immune a [00D5FF]tutti gli effetti Debuff[-] oltre che a [00D5FF]Coercizione, Espulsione, Oscurità e Seme della fine[-].",
    "en": "Becomes immune to [00D5FF]all Debuff effects[-], as well as [00D5FF]Coerce, Expel, Darkness, and Seed of the End[-]."
   }
  },
  "953511": {
   "name": {
    "it": "Riduzione danni Contrattacco e Riflessione",
    "en": "Counter and Reflect Damage Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]1000%[-] i danni subiti dall'eroe dai Contrattacchi e Riflessione.",
    "en": "Decreases the hero's damage taken from Counterattacks and Reflect by [FFAE00]1000%[-]."
   }
  },
  "953514": {
   "name": {
    "it": "Ignora Elusione",
    "en": "Ignore Evasion"
   },
   "text": {
    "it": "Ignora Elusione quando attacca.",
    "en": "Ignores Evasion when attacking."
   }
  },
  "953516": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]20%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]20%[-] of Max HP."
   }
  },
  "953517": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]25%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]25%[-] of Max HP."
   }
  },
  "953520": {
   "name": {
    "it": "Recupero",
    "en": "Recovery"
   },
   "text": {
    "it": "[00D5FF]Recupera[-] una quantità di PS pari al [FFAE00]50%[-] dei danni inflitti sui nemici con [00D5FF]Torrente[-].",
    "en": "[00D5FF]Recovers[-] HP equal to [FFAE00]50%[-] of the damage dealt to enemies with [00D5FF]Torrent[-]."
   }
  },
  "953522": {
   "name": {
    "it": "Alce della vita",
    "en": "Elk of Life"
   },
   "text": {
    "it": "Tutti gli effetti [00D5FF]Torrente[-] applicati ai nemici vengono rimossi quando usa una \"Mossa Finale\" o subisce [00D5FF]\"Stagno ghiacciato\"[-].",
    "en": "All [00D5FF]Torrent[-] effects applied to enemies are removed when they use an Ultimate Move or are hit by [00D5FF]\"Icy Pond\"[-]."
   }
  },
  "953523": {
   "name": {
    "it": "Alce della vita",
    "en": "Elk of Life"
   },
   "text": {
    "it": "Se il nemico attacca ripetutamente usando lo stesso attributo, la [00D5FF]Riduzione Danni subiti[-] dell'attributo che è in svantaggio contro l'attributo dell'eroe viene rimossa.",
    "en": "If the enemy attacks multiple times using the same attribute, the [00D5FF]Damage Taken Decrease[-] of the attribute that is weak against the enemy's attribute is removed."
   }
  },
  "953524": {
   "name": {
    "it": "Alce della vita",
    "en": "Elk of Life"
   },
   "text": {
    "it": "Garantisce a tutti i nemici [00D5FF]Protezione di Eikthyrnir[-] quando subiscono un attacco un determinato numero di volte usando lo stesso attributo. I nemici con [00D5FF]Protezione di Eikthyrnir[-] non subiscono danni da [00D5FF]\"Raffica ardente\"[-].",
    "en": "Grants all enemies [00D5FF]Eikthyrnir's Protection[-] when attacked a certain number of times using the same attribute. Enemies with [00D5FF]Eikthyrnir's Protection[-] do not take damage from [00D5FF]\"Fierce Rush\"[-]."
   }
  },
  "953525": {
   "name": {
    "it": "Alce della vita",
    "en": "Elk of Life"
   },
   "text": {
    "it": "Rimuove [FFAE00]1[-] effetto [00D5FF]Immortalità[-] da sé e subisce [FFAE00]1[-] effetto [00D5FF]Corrosione[-], che infligge danni pari al [FFAE00]10%[-] dei PS rimanenti per [FFAE00]2 turni[-], quando subisce un attacco un determinato numero di volte da parte del nemico in una certa sequenza di attributi. [00D5FF](Può essere accumulato)[-]",
    "en": "Removes [FFAE00]1[-] [00D5FF]Immortality[-] effect from self and becomes inflicted with [FFAE00]1[-] [00D5FF]Corrosion[-] effect, which inflicts damage equal to [FFAE00]10%[-] of remaining HP for [FFAE00]2 turns[-], when attacked a certain number of times by the enemy in a certain sequence of attributes. [00D5FF](Can be stacked)[-]"
   }
  },
  "953526": {
   "name": {
    "it": "Superiorità attributo",
    "en": "Attribute Superiority"
   },
   "text": {
    "it": "Riduce del [FFAE00]1000[-] i danni subiti dagli eroi Luce e Oscurità.",
    "en": "Decreases the hero's damage taken from Light and Darkness heroes by [FFAE00]1000%[-]."
   }
  },
  "953529": {
   "name": {
    "it": "Atteggiamento evoluto",
    "en": "Evolved Stance"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] le statistiche relative all'Attacco dell'Eroe per [FFAE00]2 turni[-] usando un'Abilità Atteggiamento.",
    "en": "Increases the hero's Attack-related stats by [FFAE00]30%[-] for [FFAE00]2 turns[-] when using a Stance Skill."
   }
  },
  "953534": {
   "name": {
    "it": "Superiorità caratteristica",
    "en": "Characteristic Superiority"
   },
   "text": {
    "it": "Aumenta i danni inflitti ai nemici con caratteristiche diverse da [00D5FF][Ragnarok][-] del [FFAE00]1000%[-] e riduce i danni da loro subiti del [FFAE00]1000%[-].\\n[00D5FF](Include i nemici senza una caratteristica)[-]",
    "en": "Increases damage dealt to enemies with characteristics other than [00D5FF][Ragnarok][-] by [FFAE00]1000%[-] and decreases damage taken from them by [FFAE00]1000%[-].\\n[00D5FF](Includes enemies without a characteristic)[-]"
   }
  },
  "953542": {
   "name": {
    "it": "Aumento Possibilità critico",
    "en": "Crit Chance Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] la Possibilità critico dell'eroe per [FFAE00]ogni sfera[-] piena nella Barra Mossa finale dell'Eroe.",
    "en": "Increases the hero's Crit Chance by [FFAE00]10%[-] for [FFAE00]every orb[-] filled in the hero's Ultimate Move Gauge."
   }
  },
  "953543": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]20%[-] il Danno critico dell'eroe per [FFAE00]ogni sfera[-] piena nella Barra Mossa finale dell'Eroe.",
    "en": "Increases the hero's Crit Damage by [FFAE00]20%[-] for [FFAE00]every orb[-] filled in the hero's Ultimate Move Gauge."
   }
  },
  "955701": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Irascibile\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Short Temper\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955702": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Aggressione difensiva\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Defensive Aggression\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955703": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Benedizione solare\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Solar Blessing\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955704": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Palla scintillante\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Flare Ball\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955705": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Buco nero dell'ombra\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Shadow Black Hole\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955706": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Mandria dell'ombra\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Shadow Herd\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955707": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Irascibile\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Short Temper\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955708": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Aggressione difensiva\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Defensive Aggression\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955709": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Buco nero dell'ombra\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Shadow Black Hole\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955710": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Artiglio del lupo\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Wolf Claw\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955711": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Benedizione solare\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Solar Blessing\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955712": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Artiglio del lupo\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Wolf Claw\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955721": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]tutti i Debuff[-]. [00D5FF]Nessuna statistica scende al di sotto dei valori iniziali[-]. [00D5FF]Blocca gli effetti delle abilità Visione e Macchia di sangue dei nemici, inclusi quelli delle Mosse finali[-].",
    "en": "Immune to [00D5FF]all Debuffs[-]. [00D5FF]No stats will decrease below their initial values[-]. [00D5FF]Blocks enemies' Bloodstain and Insight skill effects, including those of Ultimate Moves[-]."
   }
  },
  "955724": {
   "name": {
    "it": "Riduzione danni Contrattacco e Riflessione",
    "en": "Counter and Reflect Damage Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]500%[-] i danni subiti dall'eroe dai Contrattacchi e Riflessione.",
    "en": "Decreases the hero's damage taken from Counterattacks and Reflect by [FFAE00]500%[-]."
   }
  },
  "955726": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]30%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]30%[-] of Max HP."
   }
  },
  "955727": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] le statistiche di base dell'eroe quando un nemico usa un'Abilità Rango aumentato durante il turno del nemico.\\n[00D5FF](Limite: 10 volte)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]100%[-] when an enemy uses a Rank Up Skill during the enemy's turn.\\n[00D5FF](Limit 10 times)[-]"
   }
  },
  "955730": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Se i danni subiti superano il [FFAE00]20%[-] dei PS massimi, i danni finali subiti si riducono del [FFAE00]50%[-].",
    "en": "If damage taken exceeds [FFAE00]20%[-] of Max HP, final damage taken decreases by [FFAE00]50%[-]."
   }
  },
  "955741": {
   "name": {
    "it": "Atteggiamento minaccioso",
    "en": "Threatening Posture"
   },
   "text": {
    "it": "Quando subisce danni mentre assume un Atteggiamento, [FFAE00]1[-] [00D5FF]Onda lunare[-] viene inflitta a tutti i nemici per [FFAE00]3 turni[-], poi i loro Buff [00D5FF]Luce lunare[-] vengono rimossi.\\n\\n[00D5FF]※Onda lunare: tutte le statistiche [FFAE00]-5%[-].\\nApplica Stordimento per [FFAE00]2 turni[-] quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
    "en": "When taking damage while assuming a Stance, [FFAE00]1[-] [00D5FF]Moonwave[-] is inflicted on all enemies for [FFAE00]3 turns[-], then their [00D5FF]Moonlight[-] Buffs are removed.\\n\\n[00D5FF]※Moonwave: All stats [FFAE00]-5%[-].\\nStuns for [FFAE00]2 turns[-] when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
   }
  },
  "955742": {
   "name": {
    "it": "Riduzione statistiche relative all'Attacco",
    "en": "Attack-related Stats Decrease"
   },
   "text": {
    "it": "Riduce le statistiche relative all'Attacco dei nemici del [FFAE00]40%[-].",
    "en": "Decreases enemies' Attack-related stats by [FFAE00]40%[-]."
   }
  },
  "955743": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Quando un nemico rimuove l'Atteggiamento del boss, applica [00D5FF]Luce lunare[-] a tutti i nemici per [FFAE00]2 turni[-], poi rimuove [FFAE00]2[-] Debuff [00D5FF]Onda lunare[-] da loro.\\n\\n[00D5FF]※Luce lunare: statistiche relative all'Attacco [FFAE00]+40%[-]. Immune a Cecità.[-]",
    "en": "When an enemy removes the boss's Stance, it applies [00D5FF]Moonlight[-] on all enemies for [FFAE00]2 turns[-], then removes [FFAE00]2[-] [00D5FF]Moonwave[-] Debuffs from them.\\n\\n[00D5FF]※Moonlight: Attack-related stats [FFAE00]+40%[-]. Immune to Blindness.[-]"
   }
  },
  "955744": {
   "name": {
    "it": "Comportamento radicato",
    "en": "Grounded Attitude"
   },
   "text": {
    "it": "Usa \"Aggressione difensiva\" all'inizio della battaglia.",
    "en": "Uses \"Defensive Aggression\" at the start of the battle."
   }
  },
  "955751": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Infligge [00D5FF]Cecità[-] su tutti i nemici per [FFAE00]2 turni[-] alla fine del turno degli alleati.\\n\\n[00D5FF]※Cecità: le abilità Attacco, tranne le Mosse finali, mancheranno il bersaglio. (Inclusi i contrattacchi)[-]",
    "en": "Inflicts [00D5FF]Blindness[-] on all enemies for [FFAE00]2 turns[-] at the end of the allies' turn.\\n\\n[00D5FF]※Blindness: Attack Skills other than Ultimate Moves will miss. (Including counters)[-]"
   }
  },
  "955752": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta i danni inflitti del boss del [FFAE00]100%[-] quando attacca un nemico colpito da [00D5FF]Cecità[-].\\n\\n[00D5FF]※Cecità: le abilità Attacco, tranne le Mosse finali, mancheranno il bersaglio. (Inclusi i contrattacchi)[-]",
    "en": "Increases the boss's damage dealt by [FFAE00]100%[-] when attacking an enemy affected by [00D5FF]Blindness[-].\\n\\n[00D5FF]※Blindness: Attack Skills other than Ultimate Moves will miss. (Including counters)[-]"
   }
  },
  "955753": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico e il Danno critico del boss del [FFAE00]10%[-] per [FFAE00]ogni[-] [00D5FF]Onda lunare[-] sul nemico.\\n[00D5FF](Limite: [FFAE00]20 volta/e[-])[-]\\n\\n[00D5FF]※Onda lunare: tutte le statistiche [FFAE00]-5%[-].\\nApplica Stordimento per [FFAE00]2 turni[-] quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
    "en": "Increases the boss's Crit Chance and Crit Damage by [FFAE00]10%[-] for [FFAE00]each[-] [00D5FF]Moonwave[-] on the enemy.\\n[00D5FF](Limit [FFAE00]20 time(s)[-])[-]\\n\\n[00D5FF]※Moonwave: All stats [FFAE00]-5%[-].\\nStuns for [FFAE00]2 turns[-] when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
   }
  },
  "955754": {
   "name": {
    "it": "Il lupo che cerca il sole",
    "en": "The Wolf That Seeks the Sun"
   },
   "text": {
    "it": "Riduce i danni subiti dai nemici senza il Buff [00D5FF]Luce lunare[-] del [FFAE00]100%[-]. Quando il boss usa la Mossa finale, il Buff [00D5FF]Luce lunare[-] del bersaglio viene rimosso.\\n\\n[00D5FF]※Luce lunare: statistiche relative all'Attacco [FFAE00]+40%[-]. Immune a Cecità.[-]",
    "en": "Decreases damage taken from enemies without the [00D5FF]Moonlight[-] Buff by [FFAE00]100%[-]. When the boss uses the Ultimate Move, the target's [00D5FF]Moonlight[-] Buff is removed.\\n\\n[00D5FF]※Moonlight: Attack-related stats [FFAE00]+40%[-]. Immune to Blindness.[-]"
   }
  },
  "955761": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Applica [00D5FF]Congelamento[-] su tutti i nemici per [FFAE00]2 turni[-] alla fine del turno degli alleati.\\n\\n[00D5FF]※Congelamento: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
    "en": "[00D5FF]Freezes[-] all enemies for [FFAE00]2 turns[-] at the end of the allies' turn.\\n\\n[00D5FF]※Freeze: Incapacitates target. Effect is removed when target is attacked.[-]"
   }
  },
  "955762": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta i danni inflitti del boss del [FFAE00]200%[-] quando attacca un nemico [00D5FF]Congelato[-].\\n\\n[00D5FF]※Congelamento: immobilizza il bersaglio. L'effetto viene rimosso quando il bersaglio viene attaccato.[-]",
    "en": "Increases the boss's damage dealt by [FFAE00]200%[-] when attacking a [00D5FF]Frozen[-] enemy.\\n\\n[00D5FF]※Freeze: Incapacitates target. Effect is removed when target is attacked.[-]"
   }
  },
  "955763": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico e il Danno critico del boss del [FFAE00]10%[-] per [FFAE00]ogni[-] [00D5FF]Onda solare[-] sul nemico.\\n[00D5FF](Limite: [FFAE00]20 volta/e[-])[-]\\n\\n[00D5FF]※Onda solare: tutte le statistiche [FFAE00]-5%[-].\\n[FFAE00]1.000.000[-] di danni fissi quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
    "en": "Increases the boss's Crit Chance and Crit Damage by [FFAE00]10%[-] for [FFAE00]each[-] [00D5FF]Sunwave[-] on the enemy.\\n[00D5FF](Limit [FFAE00]20 time(s)[-])[-]\\n\\n[00D5FF]※Sunwave: All stats [FFAE00]-5%[-].\\n[FFAE00]1,000,000[-] fixed damage when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
   }
  },
  "955764": {
   "name": {
    "it": "Il lupo che cerca la luna",
    "en": "The Wolf that Seeks the Moon"
   },
   "text": {
    "it": "Riduce i danni subiti dai nemici senza il Buff [00D5FF]Luce solare[-] del [FFAE00]100%[-]. Quando il boss usa la sua Mossa finale, il Buff [00D5FF]Luce solare[-] del bersaglio viene rimosso.\\n\\n[00D5FF]※Luce solare: statistiche relative all'Attacco [FFAE00]+40%[-]. Immune a Congelamento.[-]",
    "en": "Decreases damage taken from enemies without the [00D5FF]Sunlight[-] Buff by [FFAE00]100%[-]. When the boss uses their Ultimate Move, the target's [00D5FF]Sunlight[-] Buff is removed.\\n\\n[00D5FF]※Sunlight: Attack-related stats [FFAE00]+40%[-]. Immune to Freeze.[-]"
   }
  },
  "955771": {
   "name": {
    "it": "Atteggiamento minaccioso",
    "en": "Threatening Posture"
   },
   "text": {
    "it": "Quando subisce danni mentre assume un Atteggiamento, [FFAE00]1[-] [00D5FF]Onda solare[-] viene inflitta a tutti i nemici per [FFAE00]3 turni[-], poi i loro Buff [00D5FF]Luce solare[-] vengono rimossi.\\n\\n[00D5FF]※Onda solare: tutte le statistiche [FFAE00]-5%[-].\\n[FFAE00]1.000.000[-] di danni fissi quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
    "en": "When taking damage while assuming a Stance, [FFAE00]1[-] [00D5FF]Sunwave[-] is inflicted on all enemies for [FFAE00]3 turns[-], then their [00D5FF]Sunlight[-] Buffs are removed.\\n\\n[00D5FF]※Sunwave: All stats [FFAE00]-5%[-].\\n[FFAE00]1,000,000[-] fixed damage when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
   }
  },
  "955772": {
   "name": {
    "it": "Riduzione statistiche relative all'Attacco",
    "en": "Attack-related Stats Decrease"
   },
   "text": {
    "it": "Riduce le statistiche relative all'Attacco dei nemici del [FFAE00]40%[-].",
    "en": "Decreases enemies' Attack-related stats by [FFAE00]40%[-]."
   }
  },
  "955773": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Quando un nemico rimuove l'Atteggiamento del boss, applica [00D5FF]Luce solare[-] a tutti i nemici per [FFAE00]2 turni[-], poi rimuove [FFAE00]2[-] Debuff [00D5FF]Onda solare[-] da loro.\\n\\n[00D5FF]※Luce solare: statistiche relative all'Attacco [FFAE00]+40%[-]. Immune a Congelamento.[-]",
    "en": "When an enemy removes the boss's Stance, it applies [00D5FF]Sunlight[-] on all enemies for [FFAE00]2 turns[-], then removes [FFAE00]2[-] [00D5FF]Sunwave[-] Debuffs from them.\\n\\n[00D5FF]※Sunlight: Attack-related stats [FFAE00]+40%[-]. Immune to Freeze.[-]"
   }
  },
  "955774": {
   "name": {
    "it": "Comportamento radicato",
    "en": "Grounded Attitude"
   },
   "text": {
    "it": "Usa \"Aggressione difensiva\" all'inizio della battaglia.",
    "en": "Uses \"Defensive Aggression\" at the start of the battle."
   }
  },
  "955781": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Quando un nemico rimuove almeno [FFAE00]3 sfera/e[-] dalla Barra Mossa finale del boss in [FFAE00]1 turno[-], applica [00D5FF]Luce lunare[-] a tutti i nemici per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Luce lunare: statistiche relative all'Attacco [FFAE00]+40%[-]. Immune a Cecità.[-]",
    "en": "When an enemy removes [FFAE00]3 orb(s)[-] or more from the boss's Ultimate Move Gauge in [FFAE00]1 turn[-], it applies [00D5FF]Moonlight[-] on all enemies for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Moonlight: Attack-related stats [FFAE00]+40%[-]. Immune to Blindness.[-]"
   }
  },
  "955784": {
   "name": {
    "it": "Il lupo che cerca la luna",
    "en": "The Wolf that Seeks the Moon"
   },
   "text": {
    "it": "Se il nemico ha entrambi i Buff [00D5FF]Luce solare[-] e [00D5FF]Luce lunare[-], tutti i nemici ottengono il Buff [00D5FF]Luce dell'alba[-] e [00D5FF]Soppressione danni[-] viene rimosso dal boss.\\n\\n[00D5FF]※Luce dell'alba: tutte le statistiche [FFAE00]+40%[-]. Immune ai Debuff Onda solare e Onda lunare.[-]",
    "en": "If an enemy has both the [00D5FF]Sunlight[-] and [00D5FF]Moonlight[-] Buffs, all enemies gain the [00D5FF]Light of Dawn[-] Buff, and [00D5FF]Damage Suppression[-] is removed from the boss.\\n\\n[00D5FF]※Light of Dawn: All stats [FFAE00]+40%[-]. Immune to Sunwave and Moonwave Debuffs.[-]"
   }
  },
  "955786": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Quando subisce danni da un'abilità durante il turno del nemico, chi attacca subisce [FFAE00]1[-] [00D5FF]Onda lunare[-] per [FFAE00]3 turni[-].\\n\\n[00D5FF]※Onda lunare: tutte le statistiche [FFAE00]-5%[-].\\nApplica Stordimento per [FFAE00]2 turni[-] quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
    "en": "When taking damage from a skill during the enemy's turn, the attacker is inflicted with [FFAE00]1[-] [00D5FF]Moonwave[-] for [FFAE00]3 turns[-].\\n\\n[00D5FF]※Moonwave: All stats [FFAE00]-5%[-].\\nStuns for [FFAE00]2 turns[-] when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
   }
  },
  "955791": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Quando un nemico rimuove almeno [FFAE00]3 sfera/e[-] dalla Barra Mossa finale del boss in [FFAE00]1 turno[-], applica [00D5FF]Luce solare[-] a tutti i nemici per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Luce solare: statistiche relative all'Attacco [FFAE00]+40%[-]. Immune a Congelamento.[-]",
    "en": "When an enemy removes [FFAE00]3 orb(s)[-] or more from the boss's Ultimate Move Gauge in [FFAE00]1 turn[-], it applies [00D5FF]Sunlight[-] on all enemies for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Sunlight: Attack-related stats [FFAE00]+40%[-]. Immune to Freeze.[-]"
   }
  },
  "955794": {
   "name": {
    "it": "Il lupo che cerca il sole",
    "en": "The Wolf That Seeks the Sun"
   },
   "text": {
    "it": "Se il nemico ha entrambi i Buff [00D5FF]Luce solare[-] e [00D5FF]Luce lunare[-], tutti i nemici ottengono il Buff [00D5FF]Luce dell'alba[-] e [00D5FF]Soppressione danni[-] viene rimosso dal boss.\\n\\n[00D5FF]※Luce dell'alba: tutte le statistiche [FFAE00]+40%[-]. Immune ai Debuff Onda solare e Onda lunare.[-]",
    "en": "If an enemy has both the [00D5FF]Sunlight[-] and [00D5FF]Moonlight[-] Buffs, all enemies gain the [00D5FF]Light of Dawn[-] Buff, and [00D5FF]Damage Suppression[-] is removed from the boss.\\n\\n[00D5FF]※Light of Dawn: All stats [FFAE00]+40%[-]. Immune to Sunwave and Moonwave Debuffs.[-]"
   }
  },
  "955796": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Quando subisce danni da un'abilità durante il turno del nemico, chi attacca subisce [FFAE00]1[-] [00D5FF]Onda solare[-] per [FFAE00]3 turni[-].\\n\\n[00D5FF]※Onda solare: tutte le statistiche [FFAE00]-5%[-].\\n[FFAE00]1.000.000[-] di danni fissi quando l'effetto raggiunge l'accumulo massimo.\\n(Accumulo: [FFAE00]5 volte[-])[-]",
    "en": "When taking damage from a skill during the enemy's turn, the attacker is inflicted with [FFAE00]1[-] [00D5FF]Sunwave[-] for [FFAE00]3 turns[-].\\n\\n[00D5FF]※Sunwave: All stats [FFAE00]-5%[-].\\n[FFAE00]1,000,000[-] fixed damage when the effect reaches max stacks.\\n(Stacks [FFAE00]5 times[-])[-]"
   }
  },
  "956701": {
   "name": {
    "it": "Aumento uso abilità",
    "en": "Skill Use Increase"
   },
   "text": {
    "it": "Aumenta il numero di utilizzi abilità di [FFAE00]3[-].",
    "en": "Increases the number of skill uses by [FFAE00]3[-]."
   }
  },
  "956711": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "Immune a tutti i Debuff eccetto [00D5FF]Avvelenamento, Sanguinamento, Shock e Infezione[-].",
    "en": "Immune to all Debuffs except [00D5FF]Poison, Bleed, Shock, and Infect[-]."
   }
  },
  "956712": {
   "name": {
    "it": "Fiamme di Muspell",
    "en": "Flames of Muspell"
   },
   "text": {
    "it": "Applica [00D5FF]Scioglimento[-] ai PS massimi del nemico pari al [FFAE00]10%[-] dei danni inflitti da [00D5FF]Giudizio ardente[-] ai nemici con [00D5FF]Surriscaldamento[-].\\n\\n[00D5FF]※Scioglimento: viene applicata una riduzione dei PS massimi che non può essere annullata, fino all'[FFAE00]80%[-] dei PS massimi iniziali o pari a [FFAE00]600.000[-].[-]",
    "en": "[00D5FF]Melts[-] the enemy's Max HP by [FFAE00]10%[-] of [00D5FF]Burning Judgment[-] damage dealt to [00D5FF]Overheated[-] enemies.\\n\\n[00D5FF]※Melted: An unrecoverable Max HP Decrease is applied, up to [FFAE00]80%[-] of the initial Max HP or [FFAE00]600,000[-].[-]"
   }
  },
  "956715": {
   "name": {
    "it": "Riduzione Danni Contrattacco / Danni Riflessione",
    "en": "Counter Damage / Reflect Damage Decrease"
   },
   "text": {
    "it": "Riduce di un [FFAE00]800%[-] i danni subiti dall'eroe dai Contrattacchi e di un [FFAE00]500%[-] i danni subiti da Riflessione.",
    "en": "Decreases the hero's damage taken from Counterattacks by [FFAE00]800%[-] and damage taken from Reflect by [FFAE00]500%[-]."
   }
  },
  "956718": {
   "name": {
    "it": "Immunità ai danni",
    "en": "Damage Immunity"
   },
   "text": {
    "it": "Ottiene [00D5FF]Immunità ai danni[-] e immunità agli effetti abilità che infliggono [00D5FF]danni in proporzione ai PS dell'eroe[-] all'inizio della battaglia.\\n\\n[00D5FF]※Immunità ai danni: immune ai danni basati sui PS rimanenti da Fiamma definitiva e Maledizione di Gram.[-]",
    "en": "Gains [00D5FF]Damage Immunity[-] and immunity to skill effects which deal [00D5FF]damage proportional to the hero's HP[-] at the start of the battle.\\n\\n[00D5FF]※Damage Immunity: Immune to remaining HP-based damage from Final Flame and Gram's Curse.[-]"
   }
  },
  "956726": {
   "name": {
    "it": "Riduzione danni",
    "en": "Damage Decrease"
   },
   "text": {
    "it": "Riduce i danni subiti del [FFAE00]100%[-]. [00D5FF]Tutte le statistiche non scenderanno al di sotto dei loro valori all'inizio della battaglia.[-]",
    "en": "Decreases damage taken by [FFAE00]100%[-]. [00D5FF]All stats will not fall below their values at the start of the battle.[-]"
   }
  },
  "956729": {
   "name": {
    "it": "Danni finali aggiuntivi",
    "en": "Additional Final Damage"
   },
   "text": {
    "it": "Infligge danni aggiuntivi pari a [FFAE00]10000[-] dei danni finali quando usa un'abilità.",
    "en": "Inflicts additional damage equal to [FFAE00]10000[-] of final damage when using a skill."
   }
  },
  "956730": {
   "name": {
    "it": "Danni finali aggiuntivi",
    "en": "Additional Final Damage"
   },
   "text": {
    "it": "Infligge danni aggiuntivi pari a [FFAE00]13000[-] dei danni finali quando usa un'abilità.",
    "en": "Inflicts additional damage equal to [FFAE00]13000[-] of final damage when using a skill."
   }
  },
  "956731": {
   "name": {
    "it": "Danni finali aggiuntivi",
    "en": "Additional Final Damage"
   },
   "text": {
    "it": "Infligge danni aggiuntivi pari a [FFAE00]15000[-] dei danni finali quando usa un'abilità.",
    "en": "Inflicts additional damage equal to [FFAE00]15000[-] of final damage when using a skill."
   }
  },
  "956736": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]1%[-] i danni subiti da abilità per ogni [FFAE00]2%[-] dei [00D5FF]PS rimanenti[-] dell'eroe.",
    "en": "Decreases damage taken from skills by [FFAE00]1%[-] for every [FFAE00]2%[-] of the hero's [00D5FF]remaining HP[-]."
   }
  },
  "956737": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]1%[-] i danni subiti da abilità per ogni [FFAE00]1%[-] dei [00D5FF]PS rimanenti[-] dell'eroe.",
    "en": "Decreases damage taken from skills by [FFAE00]1%[-] for every [FFAE00]1%[-] of the hero's [00D5FF]remaining HP[-]."
   }
  },
  "956738": {
   "name": {
    "it": "Contrassegno",
    "en": "Mark"
   },
   "text": {
    "it": "[00D5FF]Infetta[-] il nemico con i PS rimanenti più alti all'inizio del turno degli alleati.",
    "en": "[00D5FF]Infects[-] the enemy with the highest remaining HP at the start of the allies' turn."
   }
  },
  "956739": {
   "name": {
    "it": "Contrassegno",
    "en": "Mark"
   },
   "text": {
    "it": "[00D5FF]Infetta[-] il nemico con i PS rimanenti più alti all'inizio del turno degli alleati.",
    "en": "[00D5FF]Infects[-] the enemy with the highest remaining HP at the start of the allies' turn."
   }
  },
  "956748": {
   "name": {
    "it": "Fiamme brucianti",
    "en": "Scorching Flame"
   },
   "text": {
    "it": "I danni inflitti da Surtr ai nemici colpiti con [00D5FF]Surriscaldamento[-] aumentano del [FFAE00]200%[-].",
    "en": "Surtr's damage dealt to enemies afflicted with [00D5FF]Overheat[-] increases by [FFAE00]200%[-]."
   }
  },
  "956751": {
   "name": {
    "it": "Riduzione danni Mossa finale subiti",
    "en": "Ultimate Move Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]40%[-] i danni subiti dal boss nelle Mosse finali. Quando un nemico usa una Mossa finale, applica Riduzione danni inflitti con la Mossa finale del [FFAE00]100%[-] a tutti i nemici per [FFAE00]2 turni[-].\\n[00D5FF](Accumulo: 3 volte)[-]",
    "en": "Decreases the boss's damage taken from Ultimate Moves by [FFAE00]40%[-]. When an enemy uses an Ultimate Move, it applies a [FFAE00]100%[-] Ultimate Move Damage Dealt Decrease on all enemies for [FFAE00]2 turns[-].\\n[00D5FF](Stacks 3 times)[-]"
   }
  },
  "956752": {
   "name": {
    "it": "Riduzione danni Mossa finale subiti",
    "en": "Ultimate Move Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]50%[-] i danni subiti dal boss nelle Mosse finali. Quando un nemico usa una Mossa finale, applica Riduzione danni inflitti con la Mossa finale del [FFAE00]100%[-] a tutti i nemici per [FFAE00]2 turni[-].\\n[00D5FF](Accumulo: 3 volte)[-]",
    "en": "Decreases the boss's damage taken from Ultimate Moves by [FFAE00]50%[-]. When an enemy uses an Ultimate Move, it applies a [FFAE00]100%[-] Ultimate Move Damage Dealt Decrease on all enemies for [FFAE00]2 turns[-].\\n[00D5FF](Stacks 3 times)[-]"
   }
  },
  "956753": {
   "name": {
    "it": "Riduzione danni Mossa finale subiti",
    "en": "Ultimate Move Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]60%[-] i danni subiti dal boss nelle Mosse finali. Quando un nemico usa una Mossa finale, applica Riduzione danni inflitti con la Mossa finale del [FFAE00]100%[-] a tutti i nemici per [FFAE00]2 turni[-].\\n[00D5FF](Accumulo: 3 volte)[-]",
    "en": "Decreases the boss's damage taken from Ultimate Moves by [FFAE00]60%[-]. When an enemy uses an Ultimate Move, it applies a [FFAE00]100%[-] Ultimate Move Damage Dealt Decrease on all enemies for [FFAE00]2 turns[-].\\n[00D5FF](Stacks 3 times)[-]"
   }
  },
  "956754": {
   "name": {
    "it": "Rimuovi il potere attributo",
    "en": "Remove Attribute Leverage"
   },
   "text": {
    "it": "I danni non aumentano né diminuiscono in base a un vantaggio o uno svantaggio attributo, e i danni subiti dal boss da parte di un'abilità durante il turno del nemico non superano il [FFAE00]40%[-] dei PS massimi.",
    "en": "Damage is not increased or decreased due to attribute advantage or disadvantage, and damage taken by the boss from a skill during the enemy's turn does not exceed [FFAE00]40%[-] of Max HP."
   }
  },
  "956755": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti da abilità durante il turno nemico non superano il [FFAE00]40%[-] dei PS massimi.\\nRiduce del [FFAE00]300%[-] i danni subiti da attacchi derivanti da Contrattacco e Riflessione.",
    "en": "Damage taken from skills during the enemy turn does not exceed [FFAE00]40%[-] of Max HP.\\nDecreases damage taken from Counter and Reflect attacks by [FFAE00]300%[-]."
   }
  },
  "956756": {
   "name": {
    "it": "Rimuovi il potere attributo",
    "en": "Remove Attribute Leverage"
   },
   "text": {
    "it": "I danni non aumentano né diminuiscono in base a un vantaggio o uno svantaggio attributo, e i danni subiti dal boss da parte di un'abilità durante il turno del nemico non superano il [FFAE00]35%[-] dei PS massimi.",
    "en": "Damage is not increased or decreased due to attribute advantage or disadvantage, and damage taken by the boss from a skill during the enemy's turn does not exceed [FFAE00]35%[-] of Max HP."
   }
  },
  "956757": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti da abilità durante il turno nemico non superano il [FFAE00]35%[-] dei PS massimi.\\nRiduce del [FFAE00]300%[-] i danni subiti da attacchi derivanti da Contrattacco e Riflessione.",
    "en": "Damage taken from skills during the enemy turn does not exceed [FFAE00]35%[-] of Max HP.\\nDecreases damage taken from Counter and Reflect attacks by [FFAE00]300%[-]."
   }
  },
  "956764": {
   "name": {
    "it": "Fiamma impetuosa",
    "en": "Surging Flame"
   },
   "text": {
    "it": "Ottiene [FFAE00]1[-] [00D5FF]Aumento danni inflitti del [FFAE00]100%[-][-] e [00D5FF]Aumento statistiche relative alla Difesa del [FFAE00]50%[-][-] se nessun nemico assume un Atteggiamento all'inizio del turno degli alleati.\\nSe il nemico sta assumendo un Atteggiamento, rimuove [FFAE00]1[-] [00D5FF]Aumento danni inflitti del [FFAE00]100%[-][-] e [00D5FF]Aumento statistiche relative alla Difesa del [FFAE00]50%[-][-] da sé.\\n[00D5FF](Accumulo: 3 volte)[-]",
    "en": "Gains [FFAE00]1[-] [00D5FF][FFAE00]100%[-] Damage Dealt Increase[-] and [00D5FF][FFAE00]50%[-] Defense-related Stats Increase[-] if no enemies are assuming a Stance at the start of the allies' turn.\\nIf an enemy is assuming a Stance, removes [FFAE00]1[-] [00D5FF][FFAE00]100%[-] Damage Dealt Increase[-] and [00D5FF][FFAE00]50%[-] Defense-related Stats Increase[-] from self.\\n[00D5FF](Stacks 3 times)[-]"
   }
  },
  "956769": {
   "name": {
    "it": "Rimuovi il potere attributo",
    "en": "Remove Attribute Leverage"
   },
   "text": {
    "it": "I danni non aumentano né diminuiscono in base a un vantaggio o uno svantaggio attributo, e i danni subiti dal boss da parte di un'abilità durante il turno del nemico non superano il [FFAE00]30%[-] dei PS massimi.\\nDopo aver subito i danni massimi, il boss recupera immediatamente il [FFAE00]60%[-] dei danni subiti e infligge l'effetto [00D5FF]Disabilita Attacco[-] sul nemico che attacca per [FFAE00]2 turni[-].",
    "en": "Damage is not increased or decreased due to attribute advantage or disadvantage, and damage taken by the boss from a skill during the enemy's turn does not exceed [FFAE00]30%[-] of Max HP.\\nUpon taking max damage, the boss immediately recovers [FFAE00]60%[-] of the damage taken and inflicts the [00D5FF]Attack Disable[-] effect on the attacking enemy for [FFAE00]2 turns[-]."
   }
  },
  "956770": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti da abilità durante il turno nemico non superano il [FFAE00]30%[-] dei PS massimi.\\nRiduce del [FFAE00]300%[-] i danni subiti da attacchi derivanti da Contrattacco e Riflessione.",
    "en": "Damage taken from skills during the enemy turn does not exceed [FFAE00]30%[-] of Max HP.\\nDecreases damage taken from Counter and Reflect attacks by [FFAE00]300%[-]."
   }
  },
  "956771": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune a [00D5FF]tutti gli effetti Debuff[-].",
    "en": "The hero becomes immune to [00D5FF]all Debuff effects[-]."
   }
  },
  "956773": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Ottiene l'effetto [00D5FF]Attacco incendiario[-], che si accumula [FFAE00]9 volte[-], all'inizio del turno degli alleati.\\nQuando usa un'Abilità Atteggiamento, il boss ottiene [00D5FF]Aumento danni inflitti del [FFAE00]100%[-][-], che si accumula [FFAE00]2 volte[-].",
    "en": "Gains the [00D5FF]Igniting Attack[-] effect, which stacks [FFAE00]9 times[-], at the start of the allies' turn.\\nWhen using a Stance Skill, the boss gains [00D5FF][FFAE00]100%[-] Damage Dealt Increase[-], which stacks [FFAE00]2 times[-]."
   }
  },
  "956774": {
   "name": {
    "it": "Riduzione Perforazione",
    "en": "Pierce Rate Decrease"
   },
   "text": {
    "it": "Applica [00D5FF]Riduzione Perforazione del [FFAE00]70%[-][-] a tutti i nemici all'inizio della battaglia.",
    "en": "Applies [00D5FF][FFAE00]70%[-] Pierce Rate Decrease[-] on all enemies at the start of the battle."
   }
  },
  "956775": {
   "name": {
    "it": "Riduzione Velocità di recupero",
    "en": "Recovery Rate Decrease"
   },
   "text": {
    "it": "Applica [00D5FF]Riduzione Velocità di recupero del [FFAE00]50%[-][-] a tutti i nemici all'inizio del turno degli alleati. La [00D5FF]Riduzione Velocità di recupero[-] applicata durante il turno degli alleati viene rimossa all'inizio del turno del nemico.",
    "en": "Applies [00D5FF][FFAE00]50%[-] Recovery Rate Decrease[-] on all enemies at the start of the allies' turn. [00D5FF]Recovery Rate Decrease[-] applied during the allies' turn is removed at the start of the enemy's turn."
   }
  },
  "956776": {
   "name": {
    "it": "Riduzione Velocità di recupero",
    "en": "Recovery Rate Decrease"
   },
   "text": {
    "it": "Applica [00D5FF]Riduzione Velocità di recupero del [FFAE00]100%[-][-] a tutti i nemici all'inizio del turno degli alleati. La [00D5FF]Riduzione Velocità di recupero[-] applicata durante il turno degli alleati viene rimossa all'inizio del turno del nemico.",
    "en": "Applies [00D5FF][FFAE00]100%[-] Recovery Rate Decrease[-] on all enemies at the start of the allies' turn. [00D5FF]Recovery Rate Decrease[-] applied during the allies' turn is removed at the start of the enemy's turn."
   }
  },
  "956777": {
   "name": {
    "it": "Immunità Riduzione Barra Mossa finale",
    "en": "Ultimate Move Gauge Decrease Immunity"
   },
   "text": {
    "it": "L'eroe diventa immune agli effetti di [00D5FF]Riduzione barra Mossa finale[-].",
    "en": "The hero becomes immune to [00D5FF]Ultimate Move Gauge Decrease[-] effects."
   }
  },
  "956831": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Incantesimo di Kenaz\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Spell of Kenaz\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956832": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Runa della penetrazione\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Rune of Penetration\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "956833": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Laevateinn\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Laevateinn\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956834": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Runa dell'esplosione\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Rune of Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "956835": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Incantesimo di Kenaz\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Spell of Kenaz\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956836": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Runa della penetrazione\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Rune of Penetration\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "956837": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Laevateinn\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Laevateinn\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956838": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Runa della protezione\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Rune of Protection\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "956839": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Incantesimo di Kenaz\" [FFAE00]2 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Spell of Kenaz\" [FFAE00]2 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956840": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Runa della protezione\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Rune of Protection\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "956841": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Laevateinn\" [FFAE00]1 volta/e[-] e \"Incantesimo di Kenaz\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Laevateinn\" [FFAE00]1 time(s)[-] and \"Spell of Kenaz\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956842": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Incantesimo di Kenaz\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Spell of Kenaz\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956843": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Runa dell'esplosione\" ogni [FFAE00]2 turno/i[-].",
    "en": "Uses \"Rune of Explosion\" every [FFAE00]2 turn(s)[-]."
   }
  },
  "956844": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Laevateinn\" [FFAE00]1 volta/e[-] e \"Incantesimo di Kenaz\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Laevateinn\" [FFAE00]1 time(s)[-] and \"Spell of Kenaz\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956845": {
   "name": {
    "it": "Verdetto di regressione e provvidenza",
    "en": "Verdict of Retrogression and Providence"
   },
   "text": {
    "it": "Usa \"Laevateinn\" [FFAE00]2 volta/e[-] e \"Incantesimo di Kenaz\" [FFAE00]1 volta/e[-] [FFAE00]ogni turno[-].",
    "en": "Uses \"Laevateinn\" [FFAE00]2 time(s)[-] and \"Spell of Kenaz\" [FFAE00]1 time(s)[-] [FFAE00]every turn[-]."
   }
  },
  "956851": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]20%[-] i danni inflitti dai nemici a questo eroe.",
    "en": "Decreases the damage this hero takes from enemies by [FFAE00]20%[-]."
   }
  },
  "956852": {
   "name": {
    "it": "Riduzione Barra Mossa finale",
    "en": "Ultimate Move Gauge Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]2 sfera/e[-] la Barra Mossa finale quando l'eroe entra in battaglia.",
    "en": "Decreases enemies' Ultimate Move Gauges by [FFAE00]2 orb(s)[-] when the hero enters the battle."
   }
  },
  "956853": {
   "name": {
    "it": "Risoluzione disperata",
    "en": "Desperate Resolve"
   },
   "text": {
    "it": "Riempie la barra Mossa finale dell'eroe di [FFAE00]2 sfera/e[-] all'inizio della battaglia.",
    "en": "Fills the hero's Ultimate Move Gauge by [FFAE00]2 orb(s)[-] at the start of the battle."
   }
  },
  "956854": {
   "name": {
    "it": "Riverbero Debuff",
    "en": "Debuff Resonance"
   },
   "text": {
    "it": "Aumenta del [FFAE00]3%[-] l'Attacco dell'eroe per [FFAE00]ogni[-] Debuff applicato su tutti i nemici.",
    "en": "Increases the hero's Attack by [FFAE00]3%[-] for [FFAE00]every[-] Debuff applied on all enemies."
   }
  },
  "956855": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] il Danno critico dell'eroe per ogni uso delle abilità.\\n[00D5FF](Limite: 10 volta/e)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]5%[-] per hero skill use.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "956856": {
   "name": {
    "it": "Aumento statistiche relative alla Difesa",
    "en": "Defense-related Stats Increase"
   },
   "text": {
    "it": "Aumenta le statistiche relative alla Difesa del [FFAE00]20%[-] quando sopravvive alla Mossa finale.\\n[00D5FF](Limite 1 volta/e)[-]",
    "en": "Increases Defense-related stats by [FFAE00]20%[-] when surviving an Ultimate Move.\\n[00D5FF](Limit 1 time(s))[-]"
   }
  },
  "956857": {
   "name": {
    "it": "Aumento Danno critico",
    "en": "Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] il Danno critico dell'eroe [FFAE00]per ogni sfera[-] rimossa dalla Barra Mossa finale dell'eroe.\\n[00D5FF](Limite: 10 volta/e. Esclude svuotamento dalla Barra Mossa finale.)[-]",
    "en": "Increases the hero's Crit Damage by [FFAE00]10%[-] [FFAE00]for each orb[-] removed from the hero's Ultimate Move Gauge.\\n[00D5FF](Limit 10 time(s), excludes depletion from Ultimate Move use)[-]"
   }
  },
  "956858": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]30%[-] l'Attacco dell'eroe all'inizio del turno successivo se l'Eroe non subisce danni.\\n[00D5FF](Si resetta dopo aver subito danni)[-]",
    "en": "Increases the hero's Attack by [FFAE00]30%[-] at the start of the next turn if the hero doesn't take damage.\\n[00D5FF](Resets upon taking damage)[-]"
   }
  },
  "956859": {
   "name": {
    "it": "Aumento statistiche relative ai PS",
    "en": "HP-related Stats Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]2%[-] le statistiche relative ai PS all'inizio del turno degli alleati se l'eroe subisce danni.\\n[00D5FF](Limite 10 volta/e)[-]",
    "en": "Increases HP-related stats by [FFAE00]2%[-] at the start of the allies' turn if the hero takes damage.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "956860": {
   "name": {
    "it": "Riduzione PS massimi del nemico",
    "en": "Enemy Max HP Decrease"
   },
   "text": {
    "it": "Riduce i PS massimi di tutti i nemici del [FFAE00]150%[-] della Difesa dell'eroe.",
    "en": "Decreases all enemies' Max HP by the value of [FFAE00]150%[-] of the hero's Defense."
   }
  },
  "956861": {
   "name": {
    "it": "Resistenza critico/Riduzione Difesa",
    "en": "Crit Resistance/Defense Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]30%[-] la Resistenza critico e la Difesa critico di tutti i nemici.",
    "en": "Decreases all enemies' Crit Resistance and Crit Defense by [FFAE00]30%[-]."
   }
  },
  "956862": {
   "name": {
    "it": "Disprezzo per i deboli",
    "en": "Scorn for the Weak"
   },
   "text": {
    "it": "Infligge [FFAE00]40%[-] danni aggiuntivi quando l'eroe attacca un nemico con un Attacco inferiore.",
    "en": "Deals [FFAE00]40%[-] additional damage when the hero attacks an enemy with a lower Attack."
   }
  },
  "956863": {
   "name": {
    "it": "Disabilita Buff",
    "en": "Buff Disable"
   },
   "text": {
    "it": "Applica [00D5FF]Disabilita Buff[-] su tutti i nemici per [FFAE00]2 turni[-] all'inizio della battaglia.",
    "en": "Applies [00D5FF]Buff Disable[-] on all enemies for [FFAE00]2 turns[-] at the start of the battle."
   }
  },
  "956864": {
   "name": {
    "it": "Fiamme brucianti",
    "en": "Scorching Flame"
   },
   "text": {
    "it": "I danni inflitti da Surtr ai nemici colpiti con [00D5FF]Surriscaldamento[-] aumentano del [FFAE00]50%[-].",
    "en": "Surtr's damage dealt to enemies afflicted with [00D5FF]Overheat[-] increases by [FFAE00]50%[-]."
   }
  },
  "956865": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] l'Attacco dell'eroe all'inizio del turno successivo se l'Eroe non subisce danni.\\n[00D5FF](Si resetta dopo aver subito danni)[-]",
    "en": "Increases the hero's Attack by [FFAE00]50%[-] at the start of the next turn if the hero doesn't take damage.\\n[00D5FF](Resets upon taking damage)[-]"
   }
  },
  "956866": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta Possibilità critico/Danno critico al calare dei PS rimanenti dell'eroe.\\n[00D5FF](L'1% dei PS massimi persi aumenta le statistiche dello 0,2%)[-]",
    "en": "Increases Crit Chance/Crit Damage as the hero's remaining HP decreases.\\n[00D5FF](1% of max HP lost increases the stats by 0.2%)[-]"
   }
  },
  "956867": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta l'Attacco di un valore pari al [FFAE00]10%[-] della Difesa dell'eroe all'inizio della battaglia.",
    "en": "Increases Attack by a value equal to [FFAE00]10%[-] of the hero's Defense at the start of the battle."
   }
  },
  "956868": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] l'Attacco dell'Eroe alla fine del turno degli alleati.\\n[00D5FF](Limite 5 volte)[-]",
    "en": "Increases the hero's Attack by [FFAE00]5%[-] at the end of the allies' turn.\\n[00D5FF](Limit 5 times)[-]"
   }
  }
 },
 "items": {
  "543207": {
   "name": {
    "it": "Fonte del vento",
    "en": "Wind Source"
   },
   "icon": true
  },
  "543208": {
   "name": {
    "it": "Fonte del fiume",
    "en": "River Source"
   },
   "icon": true
  },
  "543209": {
   "name": {
    "it": "Fonte del crepuscolo",
    "en": "Twilight Source"
   },
   "icon": true
  },
  "543210": {
   "name": {
    "it": "Fonte della Corruzione delle radici",
    "en": "Source of the Roots' Corruption"
   },
   "icon": true
  },
  "543211": {
   "name": {
    "it": "Essenza magica blu",
    "en": "Blue Magic Essence"
   },
   "icon": true
  },
  "543212": {
   "name": {
    "it": "Essenza magica nera",
    "en": "Black Magic Essence"
   },
   "icon": true
  },
  "543213": {
   "name": {
    "it": "Essenza magica dorata",
    "en": "Golden Magic Essence"
   },
   "icon": true
  },
  "543214": {
   "name": {
    "it": "Essenza magica sconosciuta",
    "en": "Unknown Magic Essence"
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
  "543216": {
   "name": {
    "it": "Sublimità delle Valchirie",
    "en": "Sublimity of Valkyries"
   },
   "icon": true
  },
  "543217": {
   "name": {
    "it": "Onore degli Einherjar",
    "en": "Honor of the Einherjar"
   },
   "icon": true
  },
  "543218": {
   "name": {
    "it": "Cristallo rosso scuro",
    "en": "Dark Red Crystal"
   },
   "icon": true
  },
  "543219": {
   "name": {
    "it": "Meticolosità di Eitri",
    "en": "Eitri's Meticulousness"
   },
   "icon": true
  },
  "543220": {
   "name": {
    "it": "Tenacia di Volundr",
    "en": "Volundr's Tenacity"
   },
   "icon": true
  },
  "543221": {
   "name": {
    "it": "Forza di Brokkr",
    "en": "Brokkr's Strength"
   },
   "icon": true
  },
  "543222": {
   "name": {
    "it": "Fonte del ciclo",
    "en": "Source of the Cycle"
   },
   "icon": true
  },
  "543223": {
   "name": {
    "it": "Frutto di Yggdrasil",
    "en": "Fruit of Yggdrasil"
   },
   "icon": true
  },
  "543244": {
   "name": {
    "it": "Fonte di fuoco",
    "en": "Source of Fire"
   },
   "icon": true
  },
  "543245": {
   "name": {
    "it": "Runa magica",
    "en": "Magic Rune"
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
  "545109": {
   "name": {
    "it": "Sfera di Eikthyrnir",
    "en": "Eikthyrnir's Orb"
   },
   "icon": true
  },
  "545110": {
   "name": {
    "it": "Palco rotto di Eikthyrnir",
    "en": "Eikthyrnir's Broken Antler"
   },
   "icon": true
  },
  "545111": {
   "name": {
    "it": "Sfera di Skoll e Hati",
    "en": "Skoll and Hati's Orb"
   },
   "icon": true
  },
  "545112": {
   "name": {
    "it": "Artiglio di Skoll e Hati",
    "en": "Skoll and Hati's Claw"
   },
   "icon": true
  },
  "6020041": {
   "name": {
    "it": "Hraesvelgr",
    "en": "Hraesvelgr"
   },
   "icon": false
  },
  "6020047": {
   "name": {
    "it": "Eikthyrnir",
    "en": "Eikthyrnir"
   },
   "icon": false
  },
  "6020051": {
   "name": {
    "it": "Skoll",
    "en": "Skoll"
   },
   "icon": false
  },
  "6020052": {
   "name": {
    "it": "Hati",
    "en": "Hati"
   },
   "icon": false
  },
  "6020066": {
   "name": {
    "it": "Nidhoggr",
    "en": "Nidhoggr"
   },
   "icon": false
  },
  "6040051": {
   "name": {
    "it": "Campo di battaglia Hraesvelgr",
    "en": "Hraesvelgr's Battlefield"
   },
   "icon": false
  },
  "6040052": {
   "name": {
    "it": "Accampamento delle forze alleate",
    "en": "Allied Forces Encampment"
   },
   "icon": false
  },
  "6050109": {
   "name": {
    "it": "Murale antico",
    "en": "Ancient Mural"
   },
   "icon": false
  }
 }
};
