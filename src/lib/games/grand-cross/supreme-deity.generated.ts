/**
 * La Battaglia della Divinita' Suprema di Grand Cross.
 *
 * FONTE: il client, via python script/re_demone_divinita.py (eroi/re_demone_divinita.json).
 * Tre difficolta'; ogni partita e' una serie di Giudizi, il finale scelto dalla magia
 * della Divinita', il nascosto (solo Inferno) con un Arcangelo. I campi della riga copiati
 * da Hraesvelgr non ci sono. Lo studio: RE_DEMONE_DIVINITA.md.
 *
 * GENERATO DA scripts/import-endgame.mts - NON MODIFICARE A MANO.
 */

import type { SupremeDeityIndex } from "../endgame-types";

export const SUPREME_DEITY: SupremeDeityIndex = {
 "name": {
  "it": "Battaglia della Divinità Suprema",
  "en": "Supreme Deity Battle"
 },
 "unlock": {
  "it": "[Episodio 510] Guerriero del Purgatorio",
  "en": "[Episode 510] Warrior of Purgatory"
 },
 "guide": [
  {
   "title": {
    "it": "Battaglia della Divinità Suprema",
    "en": "Supreme Deity Battle"
   },
   "texts": [
    {
     "it": "Nella Battaglia della Divinità Suprema, affronterai i messaggeri della Divinità Suprema attraverso più fasi di Giudizio.\\nAffronta le ondate consecutive di messaggeri della Divinità Suprema!\\n\\nSconfiggili entro il numero limitato di turni.\\nSe il limite di turni scade prima che tu li abbia sconfitti tutti e i messaggeri rimanenti si ritirano, la magia della Divinità Suprema aumenterà in base al numero di nemici fuggiti.\\n\\nLa potenza delle forze della Punizione celeste che compaiono nel Giudizio finale aumenterà in base alla magia della Divinità Suprema, quindi procedi con cautela.\\n\\nOgni volta che la magia della Divinità Suprema raggiunge determinate soglie, verranno emanati Editti divini. Il mancato completamento comporterà una potente maledizione.",
     "en": "In Supreme Deity Battle, you will battle the Supreme Deity's messengers across multiple Judgment stages.\\nFace the successive waves of the Supreme Deity's messengers!\\n\\nDefeat them within the limited number of turns.\\nIf the turn limit expires before all are defeated and the remaining messengers retreat, the Supreme Deity's magic will increase based on the number of enemies that escaped.\\n\\nThe strength of the Heavenly Punishment forces that appear in the Final Judgment will scale with the Supreme Deity's magic, so proceed with caution.\\n\\nWhenever the Supreme Deity's magic reaches certain thresholds, Divine Edicts will be issued. Failure to complete them will result in a powerful curse."
    }
   ]
  },
  {
   "title": {
    "it": "Punizione celeste",
    "en": "Heavenly Punishment"
   },
   "texts": [
    {
     "it": "Se non riesci a sconfiggere i messaggeri della Divinità Suprema entro il limite di turni, la magia della Divinità Suprema aumenta per ogni messaggero sopravvissuto.",
     "en": "If you fail to defeat the Supreme Deity's messengers within the turn limit, the Supreme Deity's magic increases for each surviving messenger."
    },
    {
     "it": "Più aumenta la magia della Divinità Suprema, più i suoi messaggeri diventeranno potenti nel Giudizio finale.",
     "en": "The more the Supreme Deity's magic increases, the more powerful her messengers will be in the Final Judgment."
    },
    {
     "it": "Quando la magia della Divinità Suprema raggiunge il massimo, il Giudizio finale viene attivato automaticamente. Se non riesci a sconfiggere tutti i messaggeri entro il limite di turni, tutti gli eroi verranno sconfitti.",
     "en": "When the Supreme Deity's magic reaches its maximum, the Final Judgment is triggered automatically. If you fail to defeat all the messengers within the turn limit, all heroes will be defeated."
    }
   ]
  },
  {
   "title": {
    "it": "Editti divini e Maledizioni",
    "en": "Divine Edicts and Curses"
   },
   "texts": [
    {
     "it": "Gli Editti divini della Divinità Suprema limitano le azioni degli eroi. Il numero di Editti divini aumenta con l'aumentare della magia della Divinità Suprema.",
     "en": "The Supreme Deity's Divine Edicts restrict the actions of heroes. The number of Divine Edicts increases as the Supreme Deity's magic grows."
    },
    {
     "it": "Completa gli Editti divini per evitare di subire una Maledizione.",
     "en": "Complete Divine Edicts to avoid being Cursed."
    },
    {
     "it": "Se l'Editto divino non viene completato, viene applicata una Maledizione che rimarrà attiva anche nel Giudizio successivo.",
     "en": "If a Divine Edict is not completed, a Curse will be applied, and it will persist into the next Judgment."
    }
   ]
  },
  {
   "title": {
    "it": "Stigmate",
    "en": "Stigmata"
   },
   "texts": [
    {
     "it": "La Barra Stigmate aumenta quando infliggi danni al nemico durante il combattimento.",
     "en": "The Stigmata Gauge increases when dealing damage to the enemy in battle."
    },
    {
     "it": "Quando è piena, la barra si ripristina all'inizio del turno degli alleati e viene attivata un'abilità Stigmate casuale.",
     "en": "When full, the gauge resets at the start of the allies' turn, and a random Stigmata skill is triggered."
    },
    {
     "it": "Ci sono 4 abilità Stigmate, le quali possono essere usate solo una volta per Giudizio nel turno degli alleati, mentre le abilità non sono selezionate.",
     "en": "There are 4 Stigmata skills, and they can be used only once per Judgment on the allies' turn while skills are not selected."
    }
   ]
  },
  {
   "title": {
    "it": "Giudizi nascosti",
    "en": "Hidden Judgments"
   },
   "texts": [
    {
     "it": "Se completi il Giudizio finale mantenendo la magia della Divinità Suprema sotto una certa soglia, darai inizio a un Giudizio nascosto.",
     "en": "If you complete the Final Judgment while keeping the Supreme Deity's magic below a certain threshold, you will begin a Hidden Judgment."
    },
    {
     "it": "Nei Giudizi nascosti, puoi ottenere ricompense aggiuntive in base alla quantità di PS ridotti del boss. La quantità totale di ricompense bonus non può superare i PS massimi del boss. Il boss non morirà se i suoi PS rimanenti scendono a 0 e la battaglia terminerà dopo un determinato numero di turni.",
     "en": "In Hidden Judgments, you can obtain additional rewards based on the amount of the boss's HP reduced. The total amount of bonus rewards cannot exceed the boss's Max HP. The boss will not die even if its remaining HP reaches 0, and the battle will end after a set number of turns."
    }
   ]
  }
 ],
 "attempts": {
  "it": "Puoi affrontare la Divinità Suprema.\\n※Avrai 1 tentativo a settimana di affrontare il Re Demone.",
  "en": "You can battle the Supreme Deity.\\n※You will be given 1 weekly attempt to battle the Demon King."
 },
 "curses": [
  {
   "name": {
    "it": "Maledizione della stanchezza",
    "en": "Curse of Exhaustion"
   },
   "passive": "956001"
  },
  {
   "name": {
    "it": "Maledizione della sete",
    "en": "Curse of Thirst"
   },
   "passive": "956002"
  },
  {
   "name": {
    "it": "Maledizione dell'isolamento",
    "en": "Curse of Isolation"
   },
   "passive": "956003"
  },
  {
   "name": {
    "it": "Maledizione della fine",
    "en": "Curse of the End"
   },
   "passive": "956004"
  }
 ],
 "stigmata": [
  {
   "slot": "special",
   "name": {
    "it": "Stigmate della distruzione",
    "en": "Stigmata of Destruction"
   },
   "ranks": [
    {
     "it": "Infligge [FFAE00]2.000.000[-] di danni a tutti i nemici e [00D5FF]rimuove tutti gli Atteggiamenti[-].",
     "en": "Inflicts [FFAE00]2,000,000[-] damage to all enemies and [00D5FF]removes all Stances[-]."
    }
   ],
   "kind": null,
   "icon": "icon_stigmata_skill_01"
  },
  {
   "slot": "special",
   "name": {
    "it": "Stigmate della purificazione",
    "en": "Stigmata of Purification"
   },
   "ranks": [
    {
     "it": "[00D5FF]Rimuove tutti i Debuff[-] dagli alleati e ripristina immediatamente per l'eroe PS pari al [FFAE00]50%[-] dei suoi PS massimi, poi concede effetti che aumentano i suoi PS massimi del [FFAE00]30%[-] e applica [00D5FF]Purificazione della santità[-].\\n[i][C0C0C0]※Purificazione della santità: quando il bersaglio viene curato oltre i PS massimi, aumenta la Barra Stigmate di una quantità pari al [FFAE00]200%[-] dei PS in eccesso.[-][/i]",
     "en": "[00D5FF]Removes all debuffs[-] from allies and immediately restores HP to the hero equal to [FFAE00]50%[-] of their Max HP, then grants effects to increase their Max HP by [FFAE00]30%[-] and applies [00D5FF]Sanctity Purification[-].\\n[i][C0C0C0]※Sanctity Purification: When target is healed beyond Max HP, increases Stigmata Gauge equal to [FFAE00]200%[-] of the exceeded HP.[-][/i]"
    }
   ],
   "kind": null,
   "icon": "icon_stigmata_skill_02"
  },
  {
   "slot": "special",
   "name": {
    "it": "Stigmate dell'indebolimento",
    "en": "Stigmata of Weakening"
   },
   "ranks": [
    {
     "it": "Applica un effetto a tutti i nemici che [00D5FF]aumenta i danni subiti del [FFAE00]100%[-][-], poi [00D5FF]rimuove i Buff[-] dai nemici e applica effetti aggiuntivi che [00D5FF]aumentano i danni subiti del [FFAE00]100%[-][-] pari al numero di effetti rimossi.",
     "en": "Applies an effect on all enemies which [00D5FF]increases damage taken by [FFAE00]100%[-][-], then [00D5FF]removes buffs[-] from the enemies and applies additional [00D5FF][FFAE00]100%[-] damage taken increase[-] effects equal to the number removed."
    }
   ],
   "kind": null,
   "icon": "icon_stigmata_skill_03"
  },
  {
   "slot": "special",
   "name": {
    "it": "Stigmate del rafforzamento",
    "en": "Stigmata of Strengthening"
   },
   "ranks": [
    {
     "it": "[00D5FF]Aumenta i ranghi abilità[-] di tutti gli alleati, riempie le Barre Mossa finale di [FFAE00]2 sfere[-], poi concede a tutti gli alleati [00D5FF]Bonus Barra Stigmate[-].\\n[i][C0C0C0]※Bonus Barra Stigmate: [FFAE00]100%[-] in più nella Barra Stigmate caricando la Barra Stigmate in base ai danni inflitti ai nemici.[-][/i]",
     "en": "[00D5FF]Increases skill ranks[-] of all allies, fills Ultimate Move Gauges by [FFAE00]2 orbs[-], then grants all allies [00D5FF]Stigmata Gauge Bonus[-].\\n[i][C0C0C0]※Stigmata Gauge Bonus: [FFAE00]100%[-] more in the Stigmata Gauge when gaining Stigmata Gauge based on damage dealt to enemies.[-][/i]"
    }
   ],
   "kind": null,
   "icon": "icon_stigmata_skill_04"
  }
 ],
 "difficulties": [
  {
   "name": {
    "it": "Difficile",
    "en": "Hard"
   },
   "color": "#DF6100",
   "level": 1,
   "energy": 50,
   "gold": 15000,
   "power": 350000,
   "turns": 5,
   "modePassive": "955990",
   "heroPassives": [
    "800001"
   ],
   "clear": [
    {
     "id": "1260152",
     "count": 12
    }
   ],
   "drops": {
    "draws": 3,
    "entries": [
     {
      "id": "542404",
      "count": 5,
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
      "count": 40,
      "weight": 2000
     },
     {
      "id": "543102",
      "count": 40,
      "weight": 2000
     },
     {
      "id": "543103",
      "count": 40,
      "weight": 2000
     }
    ]
   },
   "points": {
    "x1": 75,
    "x3": 225
   },
   "magic": {
    "perSurvivor": 10,
    "inherited": 7
   },
   "judgments": [
    {
     "name": {
      "it": "Primo Giudizio",
      "en": "First Judgment"
     },
     "turns": 5,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": null,
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955919",
       "955979"
      ],
      "foes": [
       {
        "monster": "6000905",
        "level": 180,
        "multipliers": {
         "atk": 323,
         "def": 340,
         "hp": 3077
        },
        "estimate": {
         "atk": 27054,
         "def": 40715,
         "hp": 3657630
        },
        "extraPassives": [
         "800001",
         "955902",
         "955950",
         "955951"
        ]
       },
       {
        "monster": "6000102",
        "level": 180,
        "multipliers": {
         "atk": 323,
         "def": 340,
         "hp": 3077
        },
        "estimate": {
         "atk": 28789,
         "def": 34629,
         "hp": 3489318
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000102",
        "level": 180,
        "multipliers": {
         "atk": 323,
         "def": 340,
         "hp": 3077
        },
        "estimate": {
         "atk": 28789,
         "def": 34629,
         "hp": 3489318
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000101",
        "level": 180,
        "multipliers": {
         "atk": 323,
         "def": 340,
         "hp": 3077
        },
        "estimate": {
         "atk": 31777,
         "def": 28407,
         "hp": 3363776
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000103",
        "level": 180,
        "multipliers": {
         "atk": 323,
         "def": 340,
         "hp": 3077
        },
        "estimate": {
         "atk": 39519,
         "def": 25041,
         "hp": 2898534
        },
        "extraPassives": [
         "955975"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Secondo Giudizio",
      "en": "Second Judgment"
     },
     "turns": 5,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste con [00D5FF]statistiche relative ai colpi critici[-] che aumentano costantemente.",
       "en": "Heavenly Punishment Forces with steadily increasing [00D5FF]Crit-related stats[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955919",
       "955942"
      ],
      "foes": [
       {
        "monster": "6000906",
        "level": 180,
        "multipliers": {
         "atk": 416,
         "def": 425,
         "hp": 3842
        },
        "estimate": {
         "atk": 37078,
         "def": 43286,
         "hp": 4356828
        },
        "extraPassives": [
         "800001",
         "955905",
         "955934",
         "955935",
         "955941"
        ]
       },
       {
        "monster": "6000009",
        "level": 180,
        "multipliers": {
         "atk": 416,
         "def": 425,
         "hp": 3842
        },
        "estimate": {
         "atk": 50153,
         "def": 32823,
         "hp": 3760550
        },
        "extraPassives": [
         "955909"
        ]
       },
       {
        "monster": "6000009",
        "level": 180,
        "multipliers": {
         "atk": 416,
         "def": 425,
         "hp": 3842
        },
        "estimate": {
         "atk": 50153,
         "def": 32823,
         "hp": 3760550
        },
        "extraPassives": [
         "955910"
        ]
       },
       {
        "monster": "6000101",
        "level": 180,
        "multipliers": {
         "atk": 416,
         "def": 425,
         "hp": 3842
        },
        "estimate": {
         "atk": 40926,
         "def": 35509,
         "hp": 4200074
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000101",
        "level": 180,
        "multipliers": {
         "atk": 416,
         "def": 425,
         "hp": 3842
        },
        "estimate": {
         "atk": 40926,
         "def": 35509,
         "hp": 4200074
        },
        "extraPassives": [
         "955975"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Terzo Giudizio",
      "en": "Third Judgment"
     },
     "turns": 5,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste che [00D5FF]riflettono i danni subiti mentre assumono un Atteggiamento[-].",
       "en": "Heavenly Punishment Forces that [00D5FF]Reflect damage taken while assuming a Stance[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955922",
       "955944",
       "955945",
       "955963"
      ],
      "foes": [
       {
        "monster": "6000006",
        "level": 180,
        "multipliers": {
         "atk": 468,
         "def": 442,
         "hp": 4360
        },
        "estimate": {
         "atk": 46042,
         "def": 36929,
         "hp": 4766352
        },
        "extraPassives": [
         "800001",
         "955955",
         "955969"
        ]
       },
       {
        "monster": "6000005",
        "level": 180,
        "multipliers": {
         "atk": 468,
         "def": 442,
         "hp": 4360
        },
        "estimate": {
         "atk": 47764,
         "def": 40885,
         "hp": 4679588
        }
       },
       {
        "monster": "6000005",
        "level": 180,
        "multipliers": {
         "atk": 468,
         "def": 442,
         "hp": 4360
        },
        "estimate": {
         "atk": 47764,
         "def": 40885,
         "hp": 4679588
        }
       },
       {
        "monster": "6000004",
        "level": 180,
        "multipliers": {
         "atk": 468,
         "def": 442,
         "hp": 4360
        },
        "estimate": {
         "atk": 57260,
         "def": 32553,
         "hp": 4107120
        }
       },
       {
        "monster": "6000009",
        "level": 180,
        "multipliers": {
         "atk": 468,
         "def": 442,
         "hp": 4360
        },
        "estimate": {
         "atk": 56422,
         "def": 34136,
         "hp": 4267568
        },
        "extraPassives": [
         "955909",
         "955988"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Quarto Giudizio",
      "en": "Fourth Judgment"
     },
     "turns": 5,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste che ottengono [00D5FF]Evasione ogni volta che i PS sono completamente pieni[-].",
       "en": "Heavenly Punishment Forces that gain [00D5FF]Evasion each time HP is completely filled[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955922",
       "955946"
      ],
      "foes": [
       {
        "monster": "6000007",
        "level": 180,
        "multipliers": {
         "atk": 510,
         "def": 408,
         "hp": 4106
        },
        "estimate": {
         "atk": 42718,
         "def": 48858,
         "hp": 4880802
        },
        "extraPassives": [
         "800001",
         "955904",
         "955938",
         "955968"
        ]
       },
       {
        "monster": "6000005",
        "level": 180,
        "multipliers": {
         "atk": 510,
         "def": 408,
         "hp": 4106
        },
        "estimate": {
         "atk": 52051,
         "def": 37740,
         "hp": 4406970
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000005",
        "level": 180,
        "multipliers": {
         "atk": 510,
         "def": 408,
         "hp": 4106
        },
        "estimate": {
         "atk": 52051,
         "def": 37740,
         "hp": 4406970
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000004",
        "level": 180,
        "multipliers": {
         "atk": 510,
         "def": 408,
         "hp": 4106
        },
        "estimate": {
         "atk": 62398,
         "def": 30049,
         "hp": 3867852
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000004",
        "level": 180,
        "multipliers": {
         "atk": 510,
         "def": 408,
         "hp": 4106
        },
        "estimate": {
         "atk": 62398,
         "def": 30049,
         "hp": 3867852
        },
        "extraPassives": [
         "955939"
        ]
       }
      ]
     }
    }
   ],
   "final": [
    {
     "upTo": 20,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della condanna certa",
        "en": "Heavenly Punishment Forces of Certain Doom"
       },
       "description": {
        "it": "Forze della Punizione celeste con [00D5FF]statistiche relative ai colpi critici[-] che aumentano costantemente.",
        "en": "Heavenly Punishment Forces with steadily increasing [00D5FF]Crit-related stats[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955958",
        "956101",
        "956102",
        "956103",
        "956104",
        "956105"
       ],
       "foes": [
        {
         "monster": "6000008",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 46972,
          "def": 56221,
          "hp": 6843690
         },
         "extraPassives": [
          "800001",
          "955905",
          "956115"
         ]
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 64478,
          "def": 40655,
          "hp": 5684970
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 63535,
          "def": 42631,
          "hp": 5907058
         },
         "extraPassives": [
          "955916"
         ]
        },
        {
         "monster": "6000102",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 46972,
          "def": 56221,
          "hp": 6843690
         }
        },
        {
         "monster": "6000102",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 46972,
          "def": 56221,
          "hp": 6843690
         }
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della distorsione",
        "en": "Heavenly Punishment Forces of Distortion"
       },
       "description": {
        "it": "Forze della Punizione celeste che ottengono [00D5FF]Evasione ogni volta che i PS sono completamente pieni[-].",
        "en": "Heavenly Punishment Forces that gain [00D5FF]Evasion each time HP is completely filled[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955965",
        "955966",
        "956106"
       ],
       "foes": [
        {
         "monster": "6000012",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 52732,
          "def": 48292,
          "hp": 6690384
         },
         "extraPassives": [
          "800001",
          "955911"
         ]
        },
        {
         "monster": "6000007",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 44895,
          "def": 69216,
          "hp": 7274844
         },
         "extraPassives": [
          "955904"
         ]
        },
        {
         "monster": "6000008",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 47774,
          "def": 58869,
          "hp": 6940080
         },
         "extraPassives": [
          "800001",
          "955905"
         ]
        },
        {
         "monster": "6000103",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 65580,
          "def": 42570,
          "hp": 5765040
         }
        },
        {
         "monster": "6000103",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 65580,
          "def": 42570,
          "hp": 5765040
         }
        }
       ]
      }
     ]
    },
    {
     "upTo": 40,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste del castigo",
        "en": "Heavenly Punishment Forces of Retribution"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]riflettono i danni subiti mentre assumono un Atteggiamento[-].",
        "en": "Heavenly Punishment Forces that [00D5FF]Reflect damage taken while assuming a Stance[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955964",
        "956101",
        "956102"
       ],
       "foes": [
        {
         "monster": "6000012",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 51846,
          "def": 46120,
          "hp": 6597462
         },
         "extraPassives": [
          "800001",
          "955913"
         ]
        },
        {
         "monster": "6000013",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 44142,
          "def": 66102,
          "hp": 7173804
         },
         "extraPassives": [
          "955903"
         ]
        },
        {
         "monster": "6000024",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 44142,
          "def": 66102,
          "hp": 7173804
         },
         "extraPassives": [
          "800001",
          "955904"
         ]
        },
        {
         "monster": "6000101",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 51846,
          "def": 46120,
          "hp": 6597462
         }
        },
        {
         "monster": "6000101",
         "level": 180,
         "multipliers": {
          "atk": 527,
          "def": 552,
          "hp": 6035
         },
         "estimate": {
          "atk": 51846,
          "def": 46120,
          "hp": 6597462
         }
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della dannazione",
        "en": "Heavenly Punishment Forces of Condemnation"
       },
       "description": {
        "it": "Forze della Punizione celeste che dispensano la dannazione tramite [00D5FF]potenti attacchi contro tutti[-].",
        "en": "Heavenly Punishment Forces that deliver condemnation through [00D5FF]powerful all-target attacks[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955967",
        "956106"
       ],
       "foes": [
        {
         "monster": "6000002",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 47774,
          "def": 58869,
          "hp": 6940080
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 65580,
          "def": 42570,
          "hp": 5765040
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 65580,
          "def": 42570,
          "hp": 5765040
         }
        },
        {
         "monster": "6000101",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 52732,
          "def": 48292,
          "hp": 6690384
         }
        },
        {
         "monster": "6000103",
         "level": 180,
         "multipliers": {
          "atk": 536,
          "def": 578,
          "hp": 6120
         },
         "estimate": {
          "atk": 65580,
          "def": 42570,
          "hp": 5765040
         }
        }
       ]
      }
     ]
    },
    {
     "upTo": 60,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della protezione",
        "en": "Heavenly Punishment Forces of Protection"
       },
       "description": {
        "it": "Forze della Punizione celeste che applicano alternatamente effetti [00D5FF]Riduzione danni di mischia/a distanza[-] su tutti gli alleati per proteggerli.",
        "en": "Heavenly Punishment Forces that alternate applying [00D5FF]Melee/Ranged Damage Decrease[-] effects on all allies to protect them."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956107"
       ],
       "foes": [
        {
         "monster": "6000019",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 48487,
          "def": 60601,
          "hp": 7036470
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000005",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 55521,
          "def": 55038,
          "hp": 6659826
         }
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 66558,
          "def": 43822,
          "hp": 5845110
         }
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 66558,
          "def": 43822,
          "hp": 5845110
         }
        },
        {
         "monster": "6000020",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 48487,
          "def": 60601,
          "hp": 7036470
         },
         "extraPassives": [
          "800001"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste dell'oppressione",
        "en": "Heavenly Punishment Forces of Oppression"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]indeboliscono il nemico[-] ogni volta che vengono subiti danni.",
        "en": "Heavenly Punishment Forces that [00D5FF]weaken the enemy[-] each time damage is taken."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956108"
       ],
       "foes": [
        {
         "monster": "6000009",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 65585,
          "def": 45952,
          "hp": 6073454
         },
         "extraPassives": [
          "800001",
          "956114"
         ]
        },
        {
         "monster": "6000005",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 55521,
          "def": 55038,
          "hp": 6659826
         }
        },
        {
         "monster": "6000006",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 53519,
          "def": 49712,
          "hp": 6783306
         }
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 66558,
          "def": 43822,
          "hp": 5845110
         }
        },
        {
         "monster": "6000002",
         "level": 180,
         "multipliers": {
          "atk": 544,
          "def": 595,
          "hp": 6205
         },
         "estimate": {
          "atk": 48487,
          "def": 60601,
          "hp": 7036470
         },
         "extraPassives": [
          "800001"
         ]
        }
       ]
      }
     ]
    },
    {
     "upTo": 80,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste dell'uccisione sicura",
        "en": "Heavenly Punishment Forces of Sure Kill"
       },
       "description": {
        "it": "Forze della Punizione celeste che attaccano i [00D5FF]bersagli contrassegnati[-] e causano morte certa.",
        "en": "Heavenly Punishment Forces that attack [00D5FF]marked targets[-] and brings certain death."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956184",
        "956102",
        "956106",
        "956112"
       ],
       "foes": [
        {
         "monster": "6000023",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 46236,
          "def": 73287,
          "hp": 7577962
         },
         "extraPassives": [
          "800001",
          "955903",
          "956116"
         ]
        },
        {
         "monster": "6000005",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 56337,
          "def": 56610,
          "hp": 6842288
         }
        },
        {
         "monster": "6000005",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 56337,
          "def": 56610,
          "hp": 6842288
         }
        },
        {
         "monster": "6000009",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 66549,
          "def": 47265,
          "hp": 6239850
         },
         "extraPassives": [
          "955910"
         ]
        },
        {
         "monster": "6000009",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 66549,
          "def": 47265,
          "hp": 6239850
         },
         "extraPassives": [
          "800001",
          "955909"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della fine",
        "en": "Heavenly Punishment Forces of the End"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]potenziano[-] le loro abilità [00D5FF]in base al numero di Buff[-] applicati agli alleati.",
        "en": "Heavenly Punishment Forces that [00D5FF]enhance[-] their skills [00D5FF]based on the number of buffs[-] applied to allies."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "955917",
        "956102",
        "956106",
        "956113"
       ],
       "foes": [
        {
         "monster": "6000018",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 54306,
          "def": 51133,
          "hp": 6969150
         },
         "extraPassives": [
          "800001",
          "955913",
          "956117"
         ]
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 67537,
          "def": 45074,
          "hp": 6005250
         }
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 67537,
          "def": 45074,
          "hp": 6005250
         }
        },
        {
         "monster": "6000004",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 67537,
          "def": 45074,
          "hp": 6005250
         }
        },
        {
         "monster": "6000005",
         "level": 180,
         "multipliers": {
          "atk": 552,
          "def": 612,
          "hp": 6375
         },
         "estimate": {
          "atk": 56337,
          "def": 56610,
          "hp": 6842288
         },
         "extraPassives": [
          "800001",
          "955957"
         ]
        }
       ]
      }
     ]
    },
    {
     "upTo": 100,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della trascendenza",
        "en": "Heavenly Punishment Forces of Transcendence"
       },
       "description": {
        "it": "Forze della Punizione celeste che ottengono un effetto [00D5FF]Splendore[-] aggiuntivo ogni volta che gli alleati usano un'Abilità Buff.",
        "en": "Heavenly Punishment Forces that gain an additional [00D5FF]Radiance[-] effect each time allies use a Buff Skill."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956111",
        "956102",
        "956112"
       ],
       "foes": [
        {
         "monster": "6000016",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 70718,
          "def": 46989,
          "hp": 6405600
         },
         "extraPassives": [
          "800001",
          "956114"
         ]
        },
        {
         "monster": "6000006",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 56864,
          "def": 53305,
          "hp": 7433760
         }
        },
        {
         "monster": "6000006",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 56864,
          "def": 53305,
          "hp": 7433760
         }
        },
        {
         "monster": "6000007",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 48413,
          "def": 76400,
          "hp": 8083160
         },
         "extraPassives": [
          "955904"
         ]
        },
        {
         "monster": "6000025",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 48413,
          "def": 76400,
          "hp": 8083160
         },
         "extraPassives": [
          "800001",
          "955903"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste dell'immortalità",
        "en": "Heavenly Punishment Forces of Immortality"
       },
       "description": {
        "it": "Forze della Punizione celeste che applicano alternatamente effetti [00D5FF]Immunità da abilità di mischia/a distanza[-] su tutti gli alleati, simulando quasi l'immortalità.",
        "en": "Heavenly Punishment Forces that alternate applying [00D5FF]Melee/Ranged Skill Immunity[-] effects on all allies, nearly demonstrating immortality."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956111",
        "956102",
        "956113"
       ],
       "foes": [
        {
         "monster": "6000021",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 51517,
          "def": 64980,
          "hp": 7711200
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 69684,
          "def": 49273,
          "hp": 6655840
         },
         "extraPassives": [
          "955910"
         ]
        },
        {
         "monster": "6000005",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 58991,
          "def": 59015,
          "hp": 7298440
         },
         "extraPassives": [
          "955957"
         ]
        },
        {
         "monster": "6000022",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 51517,
          "def": 64980,
          "hp": 7711200
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 180,
         "multipliers": {
          "atk": 578,
          "def": 638,
          "hp": 6800
         },
         "estimate": {
          "atk": 69684,
          "def": 49273,
          "hp": 6655840
         },
         "extraPassives": [
          "955909"
         ]
        }
       ]
      }
     ]
    }
   ],
   "hidden": null,
   "edicts": [
    {
     "upTo": 20,
     "edicts": [
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 40,
     "edicts": [
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 60,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      },
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 80,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      },
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 100,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      }
     ]
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
   "energy": 70,
   "gold": 30000,
   "power": 380000,
   "turns": 4,
   "modePassive": "955990",
   "heroPassives": [
    "800001"
   ],
   "clear": [
    {
     "id": "1260152",
     "count": 20
    }
   ],
   "drops": {
    "draws": 3,
    "entries": [
     {
      "id": "542405",
      "count": 1,
      "weight": 1000
     },
     {
      "id": "543104",
      "count": 40,
      "weight": 1500
     },
     {
      "id": "543105",
      "count": 40,
      "weight": 1500
     },
     {
      "id": "543101",
      "count": 60,
      "weight": 2000
     },
     {
      "id": "543102",
      "count": 60,
      "weight": 2000
     },
     {
      "id": "543103",
      "count": 60,
      "weight": 2000
     }
    ]
   },
   "points": {
    "x1": 150,
    "x3": 450
   },
   "magic": {
    "perSurvivor": 10,
    "inherited": 7
   },
   "judgments": [
    {
     "name": {
      "it": "Primo Giudizio",
      "en": "First Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": null,
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955919",
       "955979"
      ],
      "foes": [
       {
        "monster": "6000905",
        "level": 190,
        "multipliers": {
         "atk": 342,
         "def": 360,
         "hp": 3258
        },
        "estimate": {
         "atk": 30151,
         "def": 45450,
         "hp": 4078039
        },
        "extraPassives": [
         "800001",
         "955902",
         "955950",
         "955951"
        ]
       },
       {
        "monster": "6000102",
        "level": 190,
        "multipliers": {
         "atk": 342,
         "def": 360,
         "hp": 3258
        },
        "estimate": {
         "atk": 32090,
         "def": 38646,
         "hp": 3890052
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000102",
        "level": 190,
        "multipliers": {
         "atk": 342,
         "def": 360,
         "hp": 3258
        },
        "estimate": {
         "atk": 32090,
         "def": 38646,
         "hp": 3890052
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000101",
        "level": 190,
        "multipliers": {
         "atk": 342,
         "def": 360,
         "hp": 3258
        },
        "estimate": {
         "atk": 35424,
         "def": 31698,
         "hp": 3750610
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000103",
        "level": 190,
        "multipliers": {
         "atk": 342,
         "def": 360,
         "hp": 3258
        },
        "estimate": {
         "atk": 44067,
         "def": 27954,
         "hp": 3231936
        },
        "extraPassives": [
         "955975"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Secondo Giudizio",
      "en": "Second Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste con [00D5FF]statistiche relative ai colpi critici[-] che aumentano costantemente.",
       "en": "Heavenly Punishment Forces with steadily increasing [00D5FF]Crit-related stats[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955919",
       "955942"
      ],
      "foes": [
       {
        "monster": "6000906",
        "level": 190,
        "multipliers": {
         "atk": 441,
         "def": 450,
         "hp": 4068
        },
        "estimate": {
         "atk": 41379,
         "def": 48308,
         "hp": 4857192
        },
        "extraPassives": [
         "800001",
         "955905",
         "955934",
         "955935",
         "955941"
        ]
       },
       {
        "monster": "6000009",
        "level": 190,
        "multipliers": {
         "atk": 441,
         "def": 450,
         "hp": 4068
        },
        "estimate": {
         "atk": 55989,
         "def": 36644,
         "hp": 4193294
        },
        "extraPassives": [
         "955909"
        ]
       },
       {
        "monster": "6000009",
        "level": 190,
        "multipliers": {
         "atk": 441,
         "def": 450,
         "hp": 4068
        },
        "estimate": {
         "atk": 55989,
         "def": 36644,
         "hp": 4193294
        },
        "extraPassives": [
         "955910"
        ]
       },
       {
        "monster": "6000101",
        "level": 190,
        "multipliers": {
         "atk": 441,
         "def": 450,
         "hp": 4068
        },
        "estimate": {
         "atk": 45679,
         "def": 39622,
         "hp": 4683082
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000101",
        "level": 190,
        "multipliers": {
         "atk": 441,
         "def": 450,
         "hp": 4068
        },
        "estimate": {
         "atk": 45679,
         "def": 39622,
         "hp": 4683082
        },
        "extraPassives": [
         "955975"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Terzo Giudizio",
      "en": "Third Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste che [00D5FF]riflettono i danni subiti mentre assumono un Atteggiamento[-].",
       "en": "Heavenly Punishment Forces that [00D5FF]Reflect damage taken while assuming a Stance[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955922",
       "955944",
       "955945",
       "955963"
      ],
      "foes": [
       {
        "monster": "6000006",
        "level": 190,
        "multipliers": {
         "atk": 495,
         "def": 468,
         "hp": 4617
        },
        "estimate": {
         "atk": 51272,
         "def": 41207,
         "hp": 5315090
        },
        "extraPassives": [
         "800001",
         "955955",
         "955969"
        ]
       },
       {
        "monster": "6000005",
        "level": 190,
        "multipliers": {
         "atk": 495,
         "def": 468,
         "hp": 4617
        },
        "estimate": {
         "atk": 53193,
         "def": 45630,
         "hp": 5218595
        }
       },
       {
        "monster": "6000005",
        "level": 190,
        "multipliers": {
         "atk": 495,
         "def": 468,
         "hp": 4617
        },
        "estimate": {
         "atk": 53193,
         "def": 45630,
         "hp": 5218595
        }
       },
       {
        "monster": "6000004",
        "level": 190,
        "multipliers": {
         "atk": 495,
         "def": 468,
         "hp": 4617
        },
        "estimate": {
         "atk": 63781,
         "def": 36340,
         "hp": 4580064
        }
       },
       {
        "monster": "6000009",
        "level": 190,
        "multipliers": {
         "atk": 495,
         "def": 468,
         "hp": 4617
        },
        "estimate": {
         "atk": 62845,
         "def": 38109,
         "hp": 4759204
        },
        "extraPassives": [
         "955909",
         "955988"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Quarto Giudizio",
      "en": "Fourth Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste che ottengono [00D5FF]Evasione ogni volta che i PS sono completamente pieni[-].",
       "en": "Heavenly Punishment Forces that gain [00D5FF]Evasion each time HP is completely filled[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955922",
       "955946"
      ],
      "foes": [
       {
        "monster": "6000007",
        "level": 190,
        "multipliers": {
         "atk": 540,
         "def": 432,
         "hp": 4347
        },
        "estimate": {
         "atk": 47606,
         "def": 54540,
         "hp": 5441140
        },
        "extraPassives": [
         "800001",
         "955904",
         "955938",
         "955968"
        ]
       },
       {
        "monster": "6000005",
        "level": 190,
        "multipliers": {
         "atk": 540,
         "def": 432,
         "hp": 4347
        },
        "estimate": {
         "atk": 58028,
         "def": 42120,
         "hp": 4913414
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000005",
        "level": 190,
        "multipliers": {
         "atk": 540,
         "def": 432,
         "hp": 4347
        },
        "estimate": {
         "atk": 58028,
         "def": 42120,
         "hp": 4913414
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000004",
        "level": 190,
        "multipliers": {
         "atk": 540,
         "def": 432,
         "hp": 4347
        },
        "estimate": {
         "atk": 69579,
         "def": 33545,
         "hp": 4312224
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000004",
        "level": 190,
        "multipliers": {
         "atk": 540,
         "def": 432,
         "hp": 4347
        },
        "estimate": {
         "atk": 69579,
         "def": 33545,
         "hp": 4312224
        },
        "extraPassives": [
         "955939"
        ]
       }
      ]
     }
    }
   ],
   "final": [
    {
     "upTo": 20,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della condanna certa",
        "en": "Heavenly Punishment Forces of Certain Doom"
       },
       "description": {
        "it": "Forze della Punizione celeste con [00D5FF]statistiche relative ai colpi critici[-] che aumentano costantemente.",
        "en": "Heavenly Punishment Forces with steadily increasing [00D5FF]Crit-related stats[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955958",
        "956101",
        "956102",
        "956103",
        "956104",
        "956105"
       ],
       "foes": [
        {
         "monster": "6000008",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 52357,
          "def": 62800,
          "hp": 7629660
         },
         "extraPassives": [
          "800001",
          "955905",
          "956115"
         ]
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 71898,
          "def": 45425,
          "hp": 6338880
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 70844,
          "def": 47637,
          "hp": 6586812
         },
         "extraPassives": [
          "955916"
         ]
        },
        {
         "monster": "6000102",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 52357,
          "def": 62800,
          "hp": 7629660
         }
        },
        {
         "monster": "6000102",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 52357,
          "def": 62800,
          "hp": 7629660
         }
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della distorsione",
        "en": "Heavenly Punishment Forces of Distortion"
       },
       "description": {
        "it": "Forze della Punizione celeste che ottengono [00D5FF]Evasione ogni volta che i PS sono completamente pieni[-].",
        "en": "Heavenly Punishment Forces that gain [00D5FF]Evasion each time HP is completely filled[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955965",
        "955966",
        "956106"
       ],
       "foes": [
        {
         "monster": "6000012",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 58730,
          "def": 53887,
          "hp": 7459776
         },
         "extraPassives": [
          "800001",
          "955911"
         ]
        },
        {
         "monster": "6000007",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 49987,
          "def": 77265,
          "hp": 8111016
         },
         "extraPassives": [
          "955904"
         ]
        },
        {
         "monster": "6000008",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 53202,
          "def": 65698,
          "hp": 7737120
         },
         "extraPassives": [
          "800001",
          "955905"
         ]
        },
        {
         "monster": "6000103",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 73058,
          "def": 47522,
          "hp": 6428160
         }
        },
        {
         "monster": "6000103",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 73058,
          "def": 47522,
          "hp": 6428160
         }
        }
       ]
      }
     ]
    },
    {
     "upTo": 40,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste del castigo",
        "en": "Heavenly Punishment Forces of Retribution"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]riflettono i danni subiti mentre assumono un Atteggiamento[-].",
        "en": "Heavenly Punishment Forces that [00D5FF]Reflect damage taken while assuming a Stance[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955964",
        "956101",
        "956102"
       ],
       "foes": [
        {
         "monster": "6000012",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 57798,
          "def": 51509,
          "hp": 7356168
         },
         "extraPassives": [
          "800001",
          "955913"
         ]
        },
        {
         "monster": "6000013",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 49193,
          "def": 73856,
          "hp": 7998363
         },
         "extraPassives": [
          "955903"
         ]
        },
        {
         "monster": "6000024",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 49193,
          "def": 73856,
          "hp": 7998363
         },
         "extraPassives": [
          "800001",
          "955904"
         ]
        },
        {
         "monster": "6000101",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 57798,
          "def": 51509,
          "hp": 7356168
         }
        },
        {
         "monster": "6000101",
         "level": 190,
         "multipliers": {
          "atk": 558,
          "def": 585,
          "hp": 6390
         },
         "estimate": {
          "atk": 57798,
          "def": 51509,
          "hp": 7356168
         }
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della dannazione",
        "en": "Heavenly Punishment Forces of Condemnation"
       },
       "description": {
        "it": "Forze della Punizione celeste che dispensano la dannazione tramite [00D5FF]potenti attacchi contro tutti[-].",
        "en": "Heavenly Punishment Forces that deliver condemnation through [00D5FF]powerful all-target attacks[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955967",
        "956106"
       ],
       "foes": [
        {
         "monster": "6000002",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 53202,
          "def": 65698,
          "hp": 7737120
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 73058,
          "def": 47522,
          "hp": 6428160
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 73058,
          "def": 47522,
          "hp": 6428160
         }
        },
        {
         "monster": "6000101",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 58730,
          "def": 53887,
          "hp": 7459776
         }
        },
        {
         "monster": "6000103",
         "level": 190,
         "multipliers": {
          "atk": 567,
          "def": 612,
          "hp": 6480
         },
         "estimate": {
          "atk": 73058,
          "def": 47522,
          "hp": 6428160
         }
        }
       ]
      }
     ]
    },
    {
     "upTo": 60,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della protezione",
        "en": "Heavenly Punishment Forces of Protection"
       },
       "description": {
        "it": "Forze della Punizione celeste che applicano alternatamente effetti [00D5FF]Riduzione danni di mischia/a distanza[-] su tutti gli alleati per proteggerli.",
        "en": "Heavenly Punishment Forces that alternate applying [00D5FF]Melee/Ranged Damage Decrease[-] effects on all allies to protect them."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956107"
       ],
       "foes": [
        {
         "monster": "6000019",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 54046,
          "def": 67630,
          "hp": 7844580
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000005",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 61897,
          "def": 61425,
          "hp": 7426071
         }
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 74218,
          "def": 48920,
          "hp": 6517440
         }
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 74218,
          "def": 48920,
          "hp": 6517440
         }
        },
        {
         "monster": "6000020",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 54046,
          "def": 67630,
          "hp": 7844580
         },
         "extraPassives": [
          "800001"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste dell'oppressione",
        "en": "Heavenly Punishment Forces of Oppression"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]indeboliscono il nemico[-] ogni volta che vengono subiti danni.",
        "en": "Heavenly Punishment Forces that [00D5FF]weaken the enemy[-] each time damage is taken."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956108"
       ],
       "foes": [
        {
         "monster": "6000009",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 73129,
          "def": 51301,
          "hp": 6772356
         },
         "extraPassives": [
          "800001",
          "956114"
         ]
        },
        {
         "monster": "6000005",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 61897,
          "def": 61425,
          "hp": 7426071
         }
        },
        {
         "monster": "6000006",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 59662,
          "def": 55472,
          "hp": 7563384
         }
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 74218,
          "def": 48920,
          "hp": 6517440
         }
        },
        {
         "monster": "6000002",
         "level": 190,
         "multipliers": {
          "atk": 576,
          "def": 630,
          "hp": 6570
         },
         "estimate": {
          "atk": 54046,
          "def": 67630,
          "hp": 7844580
         },
         "extraPassives": [
          "800001"
         ]
        }
       ]
      }
     ]
    },
    {
     "upTo": 80,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste dell'uccisione sicura",
        "en": "Heavenly Punishment Forces of Sure Kill"
       },
       "description": {
        "it": "Forze della Punizione celeste che attaccano i [00D5FF]bersagli contrassegnati[-] e causano morte certa.",
        "en": "Heavenly Punishment Forces that attack [00D5FF]marked targets[-] and brings certain death."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956184",
        "956102",
        "956106",
        "956112"
       ],
       "foes": [
        {
         "monster": "6000023",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 51574,
          "def": 81810,
          "hp": 8448975
         },
         "extraPassives": [
          "800001",
          "955903",
          "956116"
         ]
        },
        {
         "monster": "6000005",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 62864,
          "def": 63180,
          "hp": 7629525
         }
        },
        {
         "monster": "6000005",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 62864,
          "def": 63180,
          "hp": 7629525
         }
        },
        {
         "monster": "6000009",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 74272,
          "def": 52767,
          "hp": 6957900
         },
         "extraPassives": [
          "955910"
         ]
        },
        {
         "monster": "6000009",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 74272,
          "def": 52767,
          "hp": 6957900
         },
         "extraPassives": [
          "800001",
          "955909"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della fine",
        "en": "Heavenly Punishment Forces of the End"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]potenziano[-] le loro abilità [00D5FF]in base al numero di Buff[-] applicati agli alleati.",
        "en": "Heavenly Punishment Forces that [00D5FF]enhance[-] their skills [00D5FF]based on the number of buffs[-] applied to allies."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "955917",
        "956102",
        "956106",
        "956113"
       ],
       "foes": [
        {
         "monster": "6000018",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 60594,
          "def": 57056,
          "hp": 7770600
         },
         "extraPassives": [
          "800001",
          "955913",
          "956117"
         ]
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 75377,
          "def": 50317,
          "hp": 6696000
         }
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 75377,
          "def": 50317,
          "hp": 6696000
         }
        },
        {
         "monster": "6000004",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 75377,
          "def": 50317,
          "hp": 6696000
         }
        },
        {
         "monster": "6000005",
         "level": 190,
         "multipliers": {
          "atk": 585,
          "def": 648,
          "hp": 6750
         },
         "estimate": {
          "atk": 62864,
          "def": 63180,
          "hp": 7629525
         },
         "extraPassives": [
          "800001",
          "955957"
         ]
        }
       ]
      }
     ]
    },
    {
     "upTo": 100,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della trascendenza",
        "en": "Heavenly Punishment Forces of Transcendence"
       },
       "description": {
        "it": "Forze della Punizione celeste che ottengono un effetto [00D5FF]Splendore[-] aggiuntivo ogni volta che gli alleati usano un'Abilità Buff.",
        "en": "Heavenly Punishment Forces that gain an additional [00D5FF]Radiance[-] effect each time allies use a Buff Skill."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956111",
        "956102",
        "956112"
       ],
       "foes": [
        {
         "monster": "6000016",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 78856,
          "def": 52414,
          "hp": 7142400
         },
         "extraPassives": [
          "800001",
          "956114"
         ]
        },
        {
         "monster": "6000006",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 63391,
          "def": 59434,
          "hp": 8288640
         }
        },
        {
         "monster": "6000006",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 63391,
          "def": 59434,
          "hp": 8288640
         }
        },
        {
         "monster": "6000007",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 53954,
          "def": 85219,
          "hp": 9012240
         },
         "extraPassives": [
          "955904"
         ]
        },
        {
         "monster": "6000025",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 53954,
          "def": 85219,
          "hp": 9012240
         },
         "extraPassives": [
          "800001",
          "955903"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste dell'immortalità",
        "en": "Heavenly Punishment Forces of Immortality"
       },
       "description": {
        "it": "Forze della Punizione celeste che applicano alternatamente effetti [00D5FF]Immunità da abilità di mischia/a distanza[-] su tutti gli alleati, simulando quasi l'immortalità.",
        "en": "Heavenly Punishment Forces that alternate applying [00D5FF]Melee/Ranged Skill Immunity[-] effects on all allies, nearly demonstrating immortality."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956111",
        "956102",
        "956113"
       ],
       "foes": [
        {
         "monster": "6000021",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 57424,
          "def": 72461,
          "hp": 8596800
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 77700,
          "def": 54965,
          "hp": 7421760
         },
         "extraPassives": [
          "955910"
         ]
        },
        {
         "monster": "6000005",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 65766,
          "def": 65812,
          "hp": 8138160
         },
         "extraPassives": [
          "955957"
         ]
        },
        {
         "monster": "6000022",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 57424,
          "def": 72461,
          "hp": 8596800
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 190,
         "multipliers": {
          "atk": 612,
          "def": 675,
          "hp": 7200
         },
         "estimate": {
          "atk": 77700,
          "def": 54965,
          "hp": 7421760
         },
         "extraPassives": [
          "955909"
         ]
        }
       ]
      }
     ]
    }
   ],
   "hidden": null,
   "edicts": [
    {
     "upTo": 20,
     "edicts": [
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 40,
     "edicts": [
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 60,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      },
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 80,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      },
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]4 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]4 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]20.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]20,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 100,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      }
     ]
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
   "energy": 100,
   "gold": 50000,
   "power": 400000,
   "turns": 4,
   "modePassive": "955974",
   "heroPassives": [
    "800001"
   ],
   "clear": [
    {
     "id": "1260153",
     "count": 20
    }
   ],
   "drops": {
    "draws": 3,
    "entries": [
     {
      "id": "6010057",
      "count": 1,
      "weight": 100
     },
     {
      "id": "6040066",
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
   "points": {
    "x1": 225,
    "x3": 675
   },
   "magic": {
    "perSurvivor": 10,
    "inherited": 7
   },
   "judgments": [
    {
     "name": {
      "it": "Primo Giudizio",
      "en": "First Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": null,
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955919",
       "955979"
      ],
      "foes": [
       {
        "monster": "6000905",
        "level": 200,
        "multipliers": {
         "atk": 380,
         "def": 400,
         "hp": 3620
        },
        "estimate": {
         "atk": 35173,
         "def": 53100,
         "hp": 4759214
        },
        "extraPassives": [
         "800001",
         "955902",
         "955950",
         "955951"
        ]
       },
       {
        "monster": "6000102",
        "level": 200,
        "multipliers": {
         "atk": 380,
         "def": 400,
         "hp": 3620
        },
        "estimate": {
         "atk": 37441,
         "def": 45140,
         "hp": 4539480
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000102",
        "level": 200,
        "multipliers": {
         "atk": 380,
         "def": 400,
         "hp": 3620
        },
        "estimate": {
         "atk": 37441,
         "def": 45140,
         "hp": 4539480
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000101",
        "level": 200,
        "multipliers": {
         "atk": 380,
         "def": 400,
         "hp": 3620
        },
        "estimate": {
         "atk": 41336,
         "def": 37020,
         "hp": 4377304
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000103",
        "level": 200,
        "multipliers": {
         "atk": 380,
         "def": 400,
         "hp": 3620
        },
        "estimate": {
         "atk": 51433,
         "def": 32660,
         "hp": 3772040
        },
        "extraPassives": [
         "955975"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Secondo Giudizio",
      "en": "Second Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste con [00D5FF]statistiche relative ai colpi critici[-] che aumentano costantemente.",
       "en": "Heavenly Punishment Forces with steadily increasing [00D5FF]Crit-related stats[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955919",
       "955942"
      ],
      "foes": [
       {
        "monster": "6000906",
        "level": 200,
        "multipliers": {
         "atk": 490,
         "def": 500,
         "hp": 4520
        },
        "estimate": {
         "atk": 48280,
         "def": 56425,
         "hp": 5668080
        },
        "extraPassives": [
         "800001",
         "955905",
         "955934",
         "955935",
         "955941"
        ]
       },
       {
        "monster": "6000009",
        "level": 200,
        "multipliers": {
         "atk": 490,
         "def": 500,
         "hp": 4520
        },
        "estimate": {
         "atk": 65346,
         "def": 42815,
         "hp": 4894256
        },
        "extraPassives": [
         "955909"
        ]
       },
       {
        "monster": "6000009",
        "level": 200,
        "multipliers": {
         "atk": 490,
         "def": 500,
         "hp": 4520
        },
        "estimate": {
         "atk": 65346,
         "def": 42815,
         "hp": 4894256
        },
        "extraPassives": [
         "955910"
        ]
       },
       {
        "monster": "6000101",
        "level": 200,
        "multipliers": {
         "atk": 490,
         "def": 500,
         "hp": 4520
        },
        "estimate": {
         "atk": 53302,
         "def": 46275,
         "hp": 5465584
        },
        "extraPassives": [
         "955975"
        ]
       },
       {
        "monster": "6000101",
        "level": 200,
        "multipliers": {
         "atk": 490,
         "def": 500,
         "hp": 4520
        },
        "estimate": {
         "atk": 53302,
         "def": 46275,
         "hp": 5465584
        },
        "extraPassives": [
         "955975"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Terzo Giudizio",
      "en": "Third Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste che [00D5FF]riflettono i danni subiti mentre assumono un Atteggiamento[-].",
       "en": "Heavenly Punishment Forces that [00D5FF]Reflect damage taken while assuming a Stance[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955922",
       "955944",
       "955945",
       "955963"
      ],
      "foes": [
       {
        "monster": "6000006",
        "level": 200,
        "multipliers": {
         "atk": 550,
         "def": 520,
         "hp": 5130
        },
        "estimate": {
         "atk": 59829,
         "def": 48126,
         "hp": 6203196
        },
        "extraPassives": [
         "800001",
         "955955",
         "955969"
        ]
       },
       {
        "monster": "6000005",
        "level": 200,
        "multipliers": {
         "atk": 550,
         "def": 520,
         "hp": 5130
        },
        "estimate": {
         "atk": 62073,
         "def": 53300,
         "hp": 6090849
        }
       },
       {
        "monster": "6000005",
        "level": 200,
        "multipliers": {
         "atk": 550,
         "def": 520,
         "hp": 5130
        },
        "estimate": {
         "atk": 62073,
         "def": 53300,
         "hp": 6090849
        }
       },
       {
        "monster": "6000004",
        "level": 200,
        "multipliers": {
         "atk": 550,
         "def": 520,
         "hp": 5130
        },
        "estimate": {
         "atk": 74442,
         "def": 42458,
         "hp": 5345460
        }
       },
       {
        "monster": "6000009",
        "level": 200,
        "multipliers": {
         "atk": 550,
         "def": 520,
         "hp": 5130
        },
        "estimate": {
         "atk": 73348,
         "def": 44528,
         "hp": 5554764
        },
        "extraPassives": [
         "955909",
         "955988"
        ]
       }
      ]
     }
    },
    {
     "name": {
      "it": "Quarto Giudizio",
      "en": "Fourth Judgment"
     },
     "turns": 4,
     "group": {
      "name": {
       "it": "[Messaggero della Divinità Suprema] Guerriero della Dea",
       "en": "[Supreme Deity's Messenger] Goddess Warrior"
      },
      "description": {
       "it": "Forze della Punizione celeste che ottengono [00D5FF]Evasione ogni volta che i PS sono completamente pieni[-].",
       "en": "Heavenly Punishment Forces that gain [00D5FF]Evasion each time HP is completely filled[-]."
      },
      "image": null,
      "strong": null,
      "weak": null,
      "skills": null,
      "teamPassives": [
       "955922",
       "955946"
      ],
      "foes": [
       {
        "monster": "6000007",
        "level": 200,
        "multipliers": {
         "atk": 600,
         "def": 480,
         "hp": 4830
        },
        "estimate": {
         "atk": 55536,
         "def": 63720,
         "hp": 6350001
        },
        "extraPassives": [
         "800001",
         "955904",
         "955938",
         "955968"
        ]
       },
       {
        "monster": "6000005",
        "level": 200,
        "multipliers": {
         "atk": 600,
         "def": 480,
         "hp": 4830
        },
        "estimate": {
         "atk": 67716,
         "def": 49200,
         "hp": 5734659
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000005",
        "level": 200,
        "multipliers": {
         "atk": 600,
         "def": 480,
         "hp": 4830
        },
        "estimate": {
         "atk": 67716,
         "def": 49200,
         "hp": 5734659
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000004",
        "level": 200,
        "multipliers": {
         "atk": 600,
         "def": 480,
         "hp": 4830
        },
        "estimate": {
         "atk": 81210,
         "def": 39192,
         "hp": 5032860
        },
        "extraPassives": [
         "955939"
        ]
       },
       {
        "monster": "6000004",
        "level": 200,
        "multipliers": {
         "atk": 600,
         "def": 480,
         "hp": 4830
        },
        "estimate": {
         "atk": 81210,
         "def": 39192,
         "hp": 5032860
        },
        "extraPassives": [
         "955939"
        ]
       }
      ]
     }
    }
   ],
   "final": [
    {
     "upTo": 20,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della condanna certa",
        "en": "Heavenly Punishment Forces of Certain Doom"
       },
       "description": {
        "it": "Forze della Punizione celeste con [00D5FF]statistiche relative ai colpi critici[-] che aumentano costantemente.",
        "en": "Heavenly Punishment Forces with steadily increasing [00D5FF]Crit-related stats[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955958",
        "956101",
        "956102",
        "956103",
        "956104",
        "956105"
       ],
       "foes": [
        {
         "monster": "6000008",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 61089,
          "def": 73352,
          "hp": 8903400
         },
         "extraPassives": [
          "800001",
          "955905",
          "956115"
         ]
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 83917,
          "def": 53072,
          "hp": 7398200
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 82683,
          "def": 55660,
          "hp": 7687880
         },
         "extraPassives": [
          "955916"
         ]
        },
        {
         "monster": "6000102",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 61089,
          "def": 73352,
          "hp": 8903400
         }
        },
        {
         "monster": "6000102",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 61089,
          "def": 73352,
          "hp": 8903400
         }
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della distorsione",
        "en": "Heavenly Punishment Forces of Distortion"
       },
       "description": {
        "it": "Forze della Punizione celeste che ottengono [00D5FF]Evasione ogni volta che i PS sono completamente pieni[-].",
        "en": "Heavenly Punishment Forces that gain [00D5FF]Evasion each time HP is completely filled[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955965",
        "955966",
        "956106"
       ],
       "foes": [
        {
         "monster": "6000012",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 68531,
          "def": 62934,
          "hp": 8706240
         },
         "extraPassives": [
          "800001",
          "955911"
         ]
        },
        {
         "monster": "6000007",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 58313,
          "def": 90270,
          "hp": 9465840
         },
         "extraPassives": [
          "955904"
         ]
        },
        {
         "monster": "6000008",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 62074,
          "def": 76738,
          "hp": 9028800
         },
         "extraPassives": [
          "800001",
          "955905"
         ]
        },
        {
         "monster": "6000103",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 85270,
          "def": 55522,
          "hp": 7502400
         }
        },
        {
         "monster": "6000103",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 85270,
          "def": 55522,
          "hp": 7502400
         }
        }
       ]
      }
     ]
    },
    {
     "upTo": 40,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste del castigo",
        "en": "Heavenly Punishment Forces of Retribution"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]riflettono i danni subiti mentre assumono un Atteggiamento[-].",
        "en": "Heavenly Punishment Forces that [00D5FF]Reflect damage taken while assuming a Stance[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955964",
        "956101",
        "956102"
       ],
       "foes": [
        {
         "monster": "6000012",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 67444,
          "def": 60158,
          "hp": 8585320
         },
         "extraPassives": [
          "800001",
          "955913"
         ]
        },
        {
         "monster": "6000013",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 57387,
          "def": 86288,
          "hp": 9334370
         },
         "extraPassives": [
          "955903"
         ]
        },
        {
         "monster": "6000024",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 57387,
          "def": 86288,
          "hp": 9334370
         },
         "extraPassives": [
          "800001",
          "955904"
         ]
        },
        {
         "monster": "6000101",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 67444,
          "def": 60158,
          "hp": 8585320
         }
        },
        {
         "monster": "6000101",
         "level": 200,
         "multipliers": {
          "atk": 620,
          "def": 650,
          "hp": 7100
         },
         "estimate": {
          "atk": 67444,
          "def": 60158,
          "hp": 8585320
         }
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della dannazione",
        "en": "Heavenly Punishment Forces of Condemnation"
       },
       "description": {
        "it": "Forze della Punizione celeste che dispensano la dannazione tramite [00D5FF]potenti attacchi contro tutti[-].",
        "en": "Heavenly Punishment Forces that deliver condemnation through [00D5FF]powerful all-target attacks[-]."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955919",
        "955967",
        "956106"
       ],
       "foes": [
        {
         "monster": "6000002",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 62074,
          "def": 76738,
          "hp": 9028800
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 85270,
          "def": 55522,
          "hp": 7502400
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 85270,
          "def": 55522,
          "hp": 7502400
         }
        },
        {
         "monster": "6000101",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 68531,
          "def": 62934,
          "hp": 8706240
         }
        },
        {
         "monster": "6000103",
         "level": 200,
         "multipliers": {
          "atk": 630,
          "def": 680,
          "hp": 7200
         },
         "estimate": {
          "atk": 85270,
          "def": 55522,
          "hp": 7502400
         }
        }
       ]
      }
     ]
    },
    {
     "upTo": 60,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della protezione",
        "en": "Heavenly Punishment Forces of Protection"
       },
       "description": {
        "it": "Forze della Punizione celeste che applicano alternatamente effetti [00D5FF]Riduzione danni di mischia/a distanza[-] su tutti gli alleati per proteggerli.",
        "en": "Heavenly Punishment Forces that alternate applying [00D5FF]Melee/Ranged Damage Decrease[-] effects on all allies to protect them."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956107"
       ],
       "foes": [
        {
         "monster": "6000019",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 63059,
          "def": 78995,
          "hp": 9154200
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000005",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 72230,
          "def": 71750,
          "hp": 8667290
         }
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 86624,
          "def": 57155,
          "hp": 7606600
         }
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 86624,
          "def": 57155,
          "hp": 7606600
         }
        },
        {
         "monster": "6000020",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 63059,
          "def": 78995,
          "hp": 9154200
         },
         "extraPassives": [
          "800001"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste dell'oppressione",
        "en": "Heavenly Punishment Forces of Oppression"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]indeboliscono il nemico[-] ogni volta che vengono subiti danni.",
        "en": "Heavenly Punishment Forces that [00D5FF]weaken the enemy[-] each time damage is taken."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956108"
       ],
       "foes": [
        {
         "monster": "6000009",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 85350,
          "def": 59941,
          "hp": 7904440
         },
         "extraPassives": [
          "800001",
          "956114"
         ]
        },
        {
         "monster": "6000005",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 72230,
          "def": 71750,
          "hp": 8667290
         }
        },
        {
         "monster": "6000006",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 69619,
          "def": 64785,
          "hp": 8827160
         }
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 86624,
          "def": 57155,
          "hp": 7606600
         }
        },
        {
         "monster": "6000002",
         "level": 200,
         "multipliers": {
          "atk": 640,
          "def": 700,
          "hp": 7300
         },
         "estimate": {
          "atk": 63059,
          "def": 78995,
          "hp": 9154200
         },
         "extraPassives": [
          "800001"
         ]
        }
       ]
      }
     ]
    },
    {
     "upTo": 80,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste dell'uccisione sicura",
        "en": "Heavenly Punishment Forces of Sure Kill"
       },
       "description": {
        "it": "Forze della Punizione celeste che attaccano i [00D5FF]bersagli contrassegnati[-] e causano morte certa.",
        "en": "Heavenly Punishment Forces that attack [00D5FF]marked targets[-] and brings certain death."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956184",
        "956102",
        "956106",
        "956112"
       ],
       "foes": [
        {
         "monster": "6000023",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 60164,
          "def": 95580,
          "hp": 9860250
         },
         "extraPassives": [
          "800001",
          "955903",
          "956116"
         ]
        },
        {
         "monster": "6000005",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 73359,
          "def": 73800,
          "hp": 8904750
         }
        },
        {
         "monster": "6000005",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 73359,
          "def": 73800,
          "hp": 8904750
         }
        },
        {
         "monster": "6000009",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 86684,
          "def": 61654,
          "hp": 8121000
         },
         "extraPassives": [
          "955910"
         ]
        },
        {
         "monster": "6000009",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 86684,
          "def": 61654,
          "hp": 8121000
         },
         "extraPassives": [
          "800001",
          "955909"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste della fine",
        "en": "Heavenly Punishment Forces of the End"
       },
       "description": {
        "it": "Forze della Punizione celeste che [00D5FF]potenziano[-] le loro abilità [00D5FF]in base al numero di Buff[-] applicati agli alleati.",
        "en": "Heavenly Punishment Forces that [00D5FF]enhance[-] their skills [00D5FF]based on the number of buffs[-] applied to allies."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "955917",
        "956102",
        "956106",
        "956113"
       ],
       "foes": [
        {
         "monster": "6000018",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 70707,
          "def": 66636,
          "hp": 9069000
         },
         "extraPassives": [
          "800001",
          "955913",
          "956117"
         ]
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 87978,
          "def": 58788,
          "hp": 7815000
         }
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 87978,
          "def": 58788,
          "hp": 7815000
         }
        },
        {
         "monster": "6000004",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 87978,
          "def": 58788,
          "hp": 7815000
         }
        },
        {
         "monster": "6000005",
         "level": 200,
         "multipliers": {
          "atk": 650,
          "def": 720,
          "hp": 7500
         },
         "estimate": {
          "atk": 73359,
          "def": 73800,
          "hp": 8904750
         },
         "extraPassives": [
          "800001",
          "955957"
         ]
        }
       ]
      }
     ]
    },
    {
     "upTo": 100,
     "groups": [
      {
       "name": {
        "it": "Forze della Punizione celeste della trascendenza",
        "en": "Heavenly Punishment Forces of Transcendence"
       },
       "description": {
        "it": "Forze della Punizione celeste che ottengono un effetto [00D5FF]Splendore[-] aggiuntivo ogni volta che gli alleati usano un'Abilità Buff.",
        "en": "Heavenly Punishment Forces that gain an additional [00D5FF]Radiance[-] effect each time allies use a Buff Skill."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956111",
        "956102",
        "956112"
       ],
       "foes": [
        {
         "monster": "6000016",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 92038,
          "def": 61238,
          "hp": 8336000
         },
         "extraPassives": [
          "800001",
          "956114"
         ]
        },
        {
         "monster": "6000006",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 73970,
          "def": 69412,
          "hp": 9673600
         }
        },
        {
         "monster": "6000006",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 73970,
          "def": 69412,
          "hp": 9673600
         }
        },
        {
         "monster": "6000007",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 62941,
          "def": 99562,
          "hp": 10517600
         },
         "extraPassives": [
          "955904"
         ]
        },
        {
         "monster": "6000025",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 62941,
          "def": 99562,
          "hp": 10517600
         },
         "extraPassives": [
          "800001",
          "955903"
         ]
        }
       ]
      },
      {
       "name": {
        "it": "Forze della Punizione celeste dell'immortalità",
        "en": "Heavenly Punishment Forces of Immortality"
       },
       "description": {
        "it": "Forze della Punizione celeste che applicano alternatamente effetti [00D5FF]Immunità da abilità di mischia/a distanza[-] su tutti gli alleati, simulando quasi l'immortalità.",
        "en": "Heavenly Punishment Forces that alternate applying [00D5FF]Melee/Ranged Skill Immunity[-] effects on all allies, nearly demonstrating immortality."
       },
       "image": null,
       "strong": null,
       "weak": null,
       "skills": null,
       "teamPassives": [
        "955922",
        "956111",
        "956102",
        "956113"
       ],
       "foes": [
        {
         "monster": "6000021",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 67000,
          "def": 84638,
          "hp": 10032000
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 90685,
          "def": 64222,
          "hp": 8662400
         },
         "extraPassives": [
          "955910"
         ]
        },
        {
         "monster": "6000005",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 76745,
          "def": 76875,
          "hp": 9498400
         },
         "extraPassives": [
          "955957"
         ]
        },
        {
         "monster": "6000022",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 67000,
          "def": 84638,
          "hp": 10032000
         },
         "extraPassives": [
          "800001"
         ]
        },
        {
         "monster": "6000015",
         "level": 200,
         "multipliers": {
          "atk": 680,
          "def": 750,
          "hp": 8000
         },
         "estimate": {
          "atk": 90685,
          "def": 64222,
          "hp": 8662400
         },
         "extraPassives": [
          "955909"
         ]
        }
       ]
      }
     ]
    }
   ],
   "hidden": {
    "opensBelow": 50,
    "groups": [
     {
      "name": {
       "it": "[I Quattro Arcangeli] Ludociel del [b]Lampo[/b]",
       "en": "[The Four Archangels] Ludociel of [b]Flash[/b]"
      },
      "description": null,
      "image": "1001",
      "strong": 2,
      "weak": 1,
      "skills": {
       "it": "Annulla Atteggiamento",
       "en": "Stance Cancel"
      },
      "teamPassives": [
       "955922"
      ],
      "foes": [
       {
        "monster": "6000901",
        "level": 200,
        "multipliers": {
         "atk": 700,
         "def": 1000,
         "hp": 99999
        },
        "estimate": {
         "atk": 65485,
         "def": 54250,
         "hp": 99999000
        },
        "extraPassives": [
         "956188",
         "956153",
         "956154",
         "956151",
         "956161",
         "956162",
         "956163",
         "956164",
         "956165",
         "956166",
         "956176",
         "956178",
         "956181"
        ]
       }
      ]
     },
     {
      "name": {
       "it": "[I Quattro Arcangeli] Sariel del [b]Tornado[/b]",
       "en": "[The Four Archangels] Sariel of [b]Tornado[/b]"
      },
      "description": {
       "it": "Forze della Punizione celeste con [00D5FF]statistiche relative ai colpi critici[-] che aumentano costantemente.",
       "en": "Heavenly Punishment Forces with steadily increasing [00D5FF]Crit-related stats[-]."
      },
      "image": "1002",
      "strong": 3,
      "weak": 2,
      "skills": {
       "it": "Annulla Debuff",
       "en": "Debuff Cancel"
      },
      "teamPassives": [
       "955922"
      ],
      "foes": [
       {
        "monster": "6000902",
        "level": 200,
        "multipliers": {
         "atk": 700,
         "def": 1000,
         "hp": 99999
        },
        "estimate": {
         "atk": 74550,
         "def": 42300,
         "hp": 99999000
        },
        "extraPassives": [
         "956188",
         "956155",
         "956156",
         "956151",
         "956168",
         "956169",
         "956170",
         "956176",
         "956179",
         "956178"
        ]
       }
      ]
     },
     {
      "name": {
       "it": "[I Quattro Arcangeli] Tarmiel dell'[b]Oceano[/b]",
       "en": "[The Four Archangels] Tarmiel of [b]Ocean[/b]"
      },
      "description": {
       "it": "Forze della Punizione celeste che [00D5FF]riflettono i danni subiti mentre assumono un Atteggiamento[-].",
       "en": "Heavenly Punishment Forces that [00D5FF]Reflect damage taken while assuming a Stance[-]."
      },
      "image": "1003",
      "strong": 1,
      "weak": 3,
      "skills": {
       "it": "Annulla Atteggiamento",
       "en": "Stance Cancel"
      },
      "teamPassives": [
       "955922",
       "956187"
      ],
      "foes": [
       {
        "monster": "6000903",
        "level": 200,
        "multipliers": {
         "atk": 800,
         "def": 1000,
         "hp": 99999
        },
        "estimate": {
         "atk": 53360,
         "def": 83100,
         "hp": 99999000
        },
        "extraPassives": [
         "956188",
         "956157",
         "956158",
         "956151",
         "956171",
         "956176",
         "956179",
         "956178",
         "956183",
         "956186"
        ]
       }
      ]
     },
     {
      "name": {
       "it": "[I Quattro Arcangeli] Mael della [b]Luce del Sole[/b]",
       "en": "[The Four Archangels] Mael of [b]Sunshine[/b]"
      },
      "description": {
       "it": "Forze della Punizione celeste che ottengono [00D5FF]Evasione ogni volta che i PS sono completamente pieni[-].",
       "en": "Heavenly Punishment Forces that gain [00D5FF]Evasion each time HP is completely filled[-]."
      },
      "image": "1004",
      "strong": 2,
      "weak": 1,
      "skills": {
       "it": "Annulla Debuff/Atteggiamento Contrattacco",
       "en": "Debuff Cancel/Counter Stance"
      },
      "teamPassives": [
       "955922"
      ],
      "foes": [
       {
        "monster": "6000904",
        "level": 200,
        "multipliers": {
         "atk": 1000,
         "def": 1000,
         "hp": 99999
        },
        "estimate": {
         "atk": 114750,
         "def": 53150,
         "hp": 99999000
        },
        "extraPassives": [
         "956188",
         "956159",
         "956160",
         "956151",
         "956172",
         "956180",
         "956179",
         "956178",
         "956184",
         "956185"
        ]
       }
      ]
     }
    ]
   },
   "edicts": [
    {
     "upTo": 20,
     "edicts": [
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]3 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]30.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]30,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 40,
     "edicts": [
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]3 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]30.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]30,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 60,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      },
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]3 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]30.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]30,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 80,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      },
      {
       "it": "Sconfiggi [FFAE00]1[-] o più nemici in [FFAE00]3 turno/i[-].",
       "en": "Defeat [FFAE00]1[-] or more enemies in [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Infliggi un totale di [FFAE00]30.000.000[-] o più danni critici nel Giudizio attuale.",
       "en": "Inflict a total of [FFAE00]30,000,000[-] or more critical damage in the current Judgment."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, lo [00D5FF]stesso eroe[-] non deve usare le abilità [FFAE00]2[-] o più volte.",
       "en": "On the turn all enemies are defeated, the [00D5FF]same hero[-] must not use skills [FFAE00]2[-] or more times."
      },
      {
       "it": "Nel turno in cui tutti i nemici vengono sconfitti, usa l'abilità di [FFAE00]1[-] solo eroe.",
       "en": "On the turn all enemies are defeated, use the skill of only [FFAE00]1[-] hero."
      },
      {
       "it": "Usa Contrattacco per infliggere danni almeno [FFAE00]4 volta/e[-]",
       "en": "Use Counter to inflict damage [FFAE00]4 time(s)[-] or more"
      }
     ]
    },
    {
     "upTo": 100,
     "edicts": [
      {
       "it": "Sconfiggi tutti i nemici nel Giudizio senza usare Stigmate.",
       "en": "Defeat all enemies in the Judgment without using any Stigmata."
      },
      {
       "it": "Sconfiggi tutti i nemici usando al massimo [FFAE00]10[-] abilità.",
       "en": "Defeat all enemies using [FFAE00]10[-] or fewer skills."
      },
      {
       "it": "Porta a termine in meno di [FFAE00]3 turno/i[-].",
       "en": "Clear within [FFAE00]3 turn(s)[-]."
      },
      {
       "it": "Sconfiggi tutti i nemici allo stesso tempo.",
       "en": "Defeat all enemies at the same time."
      }
     ]
    }
   ]
  }
 ],
 "boxes": {
  "1260152": [
   {
    "id": "5301021",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301022",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301023",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301024",
    "count": 2,
    "weight": 1000
   },
   {
    "id": "5301025",
    "count": 2,
    "weight": 1000
   }
  ],
  "1260153": [
   {
    "id": "5301021",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301022",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301023",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301024",
    "count": 3,
    "weight": 1000
   },
   {
    "id": "5301025",
    "count": 3,
    "weight": 1000
   }
  ],
  "1260154": [
   {
    "id": "5301021",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301022",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301023",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301024",
    "count": 2,
    "weight": 0
   },
   {
    "id": "5301025",
    "count": 2,
    "weight": 0
   }
  ],
  "1260155": [
   {
    "id": "5301021",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301022",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301023",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301024",
    "count": 3,
    "weight": 0
   },
   {
    "id": "5301025",
    "count": 3,
    "weight": 0
   }
  ]
 },
 "banned": [
  "1815001",
  "1815002",
  "1897501",
  "1897502",
  "1835001",
  "1908501",
  "1845001",
  "1845501",
  "1845502",
  "1930501",
  "1975501",
  "1585001",
  "1585002",
  "1585501",
  "1585502"
 ],
 "monsters": {
  "6000002": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto divino",
      "en": "Divine Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Potere del giudizio",
      "en": "Might of Judgment"
     },
     "ranks": [
      {
       "it": "Applica l'effetto [00D5FF]Protezione del giudice[-] a tutti gli alleati per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Protezione del giudice: tutte le statistiche [FFAE00]+[-][FFAE00]5%[-][-]\\n[00D5FF](Nessun limite)[-]",
       "en": "Applies [00D5FF]Judge's Protection[-] effect on all allies for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Judge's Protection: All Stats [FFAE00]+[-][FFAE00]5%[-][-]\\n[00D5FF](No limit)[-]"
      },
      {
       "it": "Applica l'effetto [00D5FF]Protezione del giudice[-] a tutti gli alleati per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Protezione del giudice: tutte le statistiche [FFAE00]+[-][FFAE00]10%[-][-]\\n[00D5FF](Nessun limite)[-]",
       "en": "Applies [00D5FF]Judge's Protection[-] effect on all allies for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Judge's Protection: All Stats [FFAE00]+[-][FFAE00]10%[-][-]\\n[00D5FF](No limit)[-]"
      },
      {
       "it": "Applica l'effetto [00D5FF]Protezione del giudice[-] a tutti gli alleati per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Protezione del giudice: tutte le statistiche [FFAE00]+[-][FFAE00]15%[-][-]\\n[00D5FF](Nessun limite)[-]",
       "en": "Applies [00D5FF]Judge's Protection[-] effect on all allies for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Judge's Protection: All Stats [FFAE00]+[-][FFAE00]15%[-][-]\\n[00D5FF](No limit)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955927",
    "955928"
   ],
   "hiddenPassives": 2
  },
  "6000004": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Slancio della Dea",
      "en": "Goddess Momentum"
     },
     "ranks": [
      {
       "it": "Ottiene [FFAE00]1[-] effetto [00D5FF]Esecuzione del giudizio[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Esecuzione del giudizio: danni inflitti [FFAE00]+[FFAE00]15%[-][-], Possibilità critico [FFAE00]+[FFAE00]30[-]%[-][-]",
       "en": "Gains [FFAE00]1[-] [00D5FF]Judgment Execution[-] effect for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Judgment Execution: Damage Dealt [FFAE00]+[FFAE00]15%[-][-], Crit Chance [FFAE00]+[FFAE00]30[-]%[-][-]"
      },
      {
       "it": "Ottiene [FFAE00]2[-] effetti [00D5FF]Esecuzione del giudizio[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Esecuzione del giudizio: danni inflitti [FFAE00]+[FFAE00]15%[-][-], Possibilità critico [FFAE00]+[FFAE00]30[-]%[-][-]",
       "en": "Gains [FFAE00]2[-] [00D5FF]Judgment Execution[-] effects for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Judgment Execution: Damage Dealt [FFAE00]+[FFAE00]15%[-][-], Crit Chance [FFAE00]+[FFAE00]30[-]%[-][-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_05"
    },
    {
     "slot": "b",
     "name": {
      "it": "Raffica lampo",
      "en": "Flash Barrage"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Esecuzione[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Esecuzione: danni inflitti [FFAE00]+[-][FFAE00]15%[-][-] per ogni effetto Esecuzione del giudizio attivo su di sé.",
       "en": "Inflicts [00D5FF]Execution[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Execution: Damage dealt [FFAE00]+[-][FFAE00]15%[-][-] per active Judgment Execution effect on self."
      },
      {
       "it": "Infligge danni [00D5FF]Esecuzione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Esecuzione: danni inflitti [FFAE00]+[-][FFAE00]15%[-][-] per ogni effetto Esecuzione del giudizio attivo su di sé.",
       "en": "Inflicts [00D5FF]Execution[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Execution: Damage dealt [FFAE00]+[-][FFAE00]15%[-][-] per active Judgment Execution effect on self."
      },
      {
       "it": "Infligge danni [00D5FF]Esecuzione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Esecuzione: danni inflitti [FFAE00]+[-][FFAE00]15%[-][-] per ogni effetto Esecuzione del giudizio attivo su di sé.",
       "en": "Inflicts [00D5FF]Execution[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Execution: Damage dealt [FFAE00]+[-][FFAE00]15%[-][-] per active Judgment Execution effect on self."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955929",
    "955937"
   ],
   "hiddenPassives": 2
  },
  "6000005": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raggio della Dea",
      "en": "Goddess Beam"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      },
      {
       "it": "Infligge danni pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-], [00D5FF]riduce i ranghi abilità[-], poi svuota la Barra Mossa finale in base al numero di abilità il cui rango è stato ridotto.",
       "en": "Inflicts damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-], [00D5FF]decreases skill ranks[-], then depletes the Ultimate Move Gauge by the number of skills that had ranks decreased."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Ira celeste",
      "en": "Heaven's Wrath"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
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
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955930",
    "955931",
    "955932"
   ],
   "hiddenPassives": 2
  },
  "6000006": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tranquillità posata",
      "en": "Posed Tranquility"
     },
     "ranks": [
      {
       "it": "[00D5FF]Infetta[-] [FFFFFF]tutti i nemici[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "[00D5FF]Infects[-] [FFFFFF]all enemies[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "[00D5FF]Infetta[-] [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "[00D5FF]Infects[-] [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Luce del recupero",
      "en": "Light of Recovery"
     },
     "ranks": [
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]10%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]10%[-] of Max HP."
      },
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]15%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]15%[-] of Max HP."
      },
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]25%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]25%[-] of Max HP."
      }
     ],
     "kind": "heal",
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955933",
    "955940"
   ],
   "hiddenPassives": 2
  },
  "6000007": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Distruzione del giudizio",
      "en": "Smite of Judgment"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Cammino del fuoco divino",
      "en": "Divine Fire Walk"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che [00D5FF]Provoca[-] i nemici e riduce i danni subiti del [FFAE00]50%[-] quando subisce un attacco per [FFAE00]2 turno/i[-]. Svuota di [FFAE00]1[-][FFAE00] sfera/e[-] la Barra Mossa finale del nemico che ha usato l'abilità.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance which [00D5FF]Taunts[-] enemies and decreases damage taken by [FFAE00]50%[-] when attacked for [FFAE00]2 turn(s)[-]. Depletes the Ultimate Move Gauge of the enemy who used the skill by [FFAE00]1[-][FFAE00] orb(s)[-].\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955925",
    "955926"
   ],
   "hiddenPassives": 2
  },
  "6000008": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto divino",
      "en": "Divine Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Potere del giudizio",
      "en": "Might of Judgment"
     },
     "ranks": [
      {
       "it": "Applica l'effetto [00D5FF]Protezione del giudice[-] a tutti gli alleati per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Protezione del giudice: tutte le statistiche [FFAE00]+[-][FFAE00]10%[-][-]\\n[00D5FF](Nessun limite)[-]",
       "en": "Applies [00D5FF]Judge's Protection[-] effect on all allies for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Judge's Protection: All Stats [FFAE00]+[-][FFAE00]10%[-][-]\\n[00D5FF](No limit)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955927",
    "955928"
   ],
   "hiddenPassives": 2
  },
  "6000009": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo divino",
      "en": "Divine Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Dannazione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Dannazione: danni inflitti [FFAE00]+1,5%[-] per ogni [FFAE00]1%[-] di PS ridotti quando usa un'abilità.",
       "en": "Inflicts [00D5FF]Condemnation[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Condemnation: Damage dealt [FFAE00]+1.5%[-] per [FFAE00]1%[-] of diminished HP when using skill."
      },
      {
       "it": "Infligge danni [00D5FF]Dannazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Dannazione: danni inflitti [FFAE00]+1,5%[-] per ogni [FFAE00]1%[-] di PS ridotti quando usa un'abilità.",
       "en": "Inflicts [00D5FF]Condemnation[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Condemnation: Damage dealt [FFAE00]+1.5%[-] per [FFAE00]1%[-] of diminished HP when using skill."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Riflesso angelico",
      "en": "Angelic Reflection"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]1 turno/i[-] e infligge danni pari al [FFAE00]150%[-] dell'Attacco tramite contrattacco quando subisce un attacco, poi aumenta i danni inflitti del [FFAE00]50%[-] dei danni subiti.",
       "en": "Assumes a Stance for [FFAE00]1 turn(s)[-] and inflicts damage equal to [FFAE00]150%[-] of Attack via counter when attacked, then increases damage dealt by [FFAE00]50%[-] of damage taken."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_02"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Riflesso angelico",
      "en": "Angelic Reflection"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che infligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco quando un alleato viene attaccato.",
       "en": "Assumes a Stance for {turn_1_val} which inflicts damage equal to {buff_1_val} of Attack via counter when an ally is attacked."
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
    "955953"
   ],
   "hiddenPassives": 2
  },
  "6000012": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tranquillità posata",
      "en": "Posed Tranquility"
     },
     "ranks": [
      {
       "it": "[00D5FF]Infetta[-] [FFFFFF]tutti i nemici[-] per [FFAE00]1 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "[00D5FF]Infects[-] [FFFFFF]all enemies[-] for [FFAE00]1 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      },
      {
       "it": "[00D5FF]Infetta[-] [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "[00D5FF]Infects[-] [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Luce del recupero",
      "en": "Light of Recovery"
     },
     "ranks": [
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]15%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]15%[-] of Max HP."
      }
     ],
     "kind": "heal",
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955933",
    "955940"
   ],
   "hiddenPassives": 2
  },
  "6000013": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Distruzione del giudizio",
      "en": "Smite of Judgment"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Cammino del fuoco divino",
      "en": "Divine Fire Walk"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che [00D5FF]Provoca[-] i nemici e riduce i danni subiti del [FFAE00]50%[-] quando subisce un attacco per [FFAE00]2 turno/i[-]. Svuota di [FFAE00]1[-][FFAE00] sfera/e[-] la Barra Mossa finale del nemico che ha usato l'abilità.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance which [00D5FF]Taunts[-] enemies and decreases damage taken by [FFAE00]50%[-] when attacked for [FFAE00]2 turn(s)[-]. Depletes the Ultimate Move Gauge of the enemy who used the skill by [FFAE00]1[-][FFAE00] orb(s)[-].\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955925",
    "955926"
   ],
   "hiddenPassives": 2
  },
  "6000015": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Colpo divino",
      "en": "Divine Strike"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Dannazione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Dannazione: danni inflitti [FFAE00]+1,5%[-] per ogni [FFAE00]1%[-] di PS ridotti quando usa un'abilità.",
       "en": "Inflicts [00D5FF]Condemnation[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Condemnation: Damage dealt [FFAE00]+1.5%[-] per [FFAE00]1%[-] of diminished HP when using skill."
      },
      {
       "it": "Infligge danni [00D5FF]Dannazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Dannazione: danni inflitti [FFAE00]+1,5%[-] per ogni [FFAE00]1%[-] di PS ridotti quando usa un'abilità.",
       "en": "Inflicts [00D5FF]Condemnation[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Condemnation: Damage dealt [FFAE00]+1.5%[-] per [FFAE00]1%[-] of diminished HP when using skill."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Riflesso amplificato",
      "en": "Amplified Reflection"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]1 turno/i[-] che infligge danni pari al [FFAE00]150%[-] dell'Attacco tramite contrattacco quando un alleato viene attaccato.",
       "en": "Assumes a Stance for [FFAE00]1 turn(s)[-] which inflicts damage equal to [FFAE00]150%[-] of Attack via counter when an ally is attacked."
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_03"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Riflesso amplificato",
      "en": "Amplified Reflection"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per {turn_1_val} che infligge danni pari al {buff_1_val} dell'Attacco tramite contrattacco quando un alleato viene attaccato.",
       "en": "Assumes a Stance for {turn_1_val} which inflicts damage equal to {buff_1_val} of Attack via counter when an ally is attacked."
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
    "955953"
   ],
   "hiddenPassives": 2
  },
  "6000016": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raffica lampo",
      "en": "Flash Barrage"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Esecuzione[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Esecuzione: danni inflitti [FFAE00]+[-][FFAE00]15%[-][-] per ogni effetto Esecuzione del giudizio attivo su di sé.",
       "en": "Inflicts [00D5FF]Execution[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Execution: Damage dealt [FFAE00]+[-][FFAE00]15%[-][-] per active Judgment Execution effect on self."
      },
      {
       "it": "Infligge danni [00D5FF]Esecuzione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Esecuzione: danni inflitti [FFAE00]+[-][FFAE00]15%[-][-] per ogni effetto Esecuzione del giudizio attivo su di sé.",
       "en": "Inflicts [00D5FF]Execution[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Execution: Damage dealt [FFAE00]+[-][FFAE00]15%[-][-] per active Judgment Execution effect on self."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Slancio della Dea",
      "en": "Goddess Momentum"
     },
     "ranks": [
      {
       "it": "Ottiene [FFAE00]2[-] effetti [00D5FF]Esecuzione del giudizio[-] per [FFAE00]2 turni[-].\\n\\n[00D5FF]※Esecuzione del giudizio: danni inflitti [FFAE00]+[FFAE00]15%[-][-], Possibilità critico [FFAE00]+[FFAE00]30[-]%[-][-]",
       "en": "Gains [FFAE00]2[-] [00D5FF]Judgment Execution[-] effects for [FFAE00]2 turns[-].\\n\\n[00D5FF]※Judgment Execution: Damage Dealt [FFAE00]+[FFAE00]15%[-][-], Crit Chance [FFAE00]+[FFAE00]30[-]%[-][-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_knight_ssr_type01_skill_05"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955929",
    "955937"
   ],
   "hiddenPassives": 2
  },
  "6000018": {
   "name": {
    "it": null,
    "en": null
   },
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Luce del recupero",
      "en": "Light of Recovery"
     },
     "ranks": [
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]10%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]10%[-] of Max HP."
      },
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]15%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]15%[-] of Max HP."
      }
     ],
     "kind": "heal",
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Tranquillità posata",
      "en": "Posed Tranquility"
     },
     "ranks": [
      {
       "it": "[00D5FF]Infetta[-] [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Infezione: blocca le statistiche relative a Recupero.[-]",
       "en": "[00D5FF]Infects[-] [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Infect: Restricts Recovery-related stats.[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_supreme_deity_mage_ssr_type01_skill_03"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955933",
    "955940"
   ],
   "hiddenPassives": 2
  },
  "6000019": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto divino",
      "en": "Divine Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Potere del giudizio",
      "en": "Might of Judgment"
     },
     "ranks": [
      {
       "it": "Riduce i [00D5FF]danni subiti da abilità di mischia[-] di tutti gli alleati del [FFAE00]300%[-] per [FFAE00]1 turno/i[-].",
       "en": "Decreases all allies' [00D5FF]Melee Skill damage taken[-] by [FFAE00]300%[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955906",
    "955927"
   ],
   "hiddenPassives": 2
  },
  "6000020": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto divino",
      "en": "Divine Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Potere del giudizio",
      "en": "Might of Judgment"
     },
     "ranks": [
      {
       "it": "Riduce i [00D5FF]danni subiti da abilità a distanza[-] di tutti gli alleati del [FFAE00]300%[-] per [FFAE00]1 turno/i[-].",
       "en": "Decreases all allies' [00D5FF]Ranged Skill damage taken[-] by [FFAE00]300%[-] for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955907",
    "955927"
   ],
   "hiddenPassives": 2
  },
  "6000021": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto divino",
      "en": "Divine Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Potere del giudizio",
      "en": "Might of Judgment"
     },
     "ranks": [
      {
       "it": "Applica [00D5FF]Immunità da abilità di mischia[-] a tutti gli alleati per [FFAE00]1 turno/i[-].",
       "en": "Applies [00D5FF]Melee Skill Immunity[-] to all allies for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955906",
    "955927"
   ],
   "hiddenPassives": 2
  },
  "6000022": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto divino",
      "en": "Divine Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Potere del giudizio",
      "en": "Might of Judgment"
     },
     "ranks": [
      {
       "it": "Applica [00D5FF]Immunità da abilità a distanza[-] a tutti gli alleati per [FFAE00]1 turno/i[-].",
       "en": "Applies [00D5FF]Ranged Skill Immunity[-] to all allies for [FFAE00]1 turn(s)[-]."
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955907",
    "955927"
   ],
   "hiddenPassives": 2
  },
  "6000023": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Distruzione del giudizio",
      "en": "Smite of Judgment"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Cammino del fuoco divino",
      "en": "Divine Fire Walk"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che [00D5FF]provoca[-] i nemici per [FFAE00]2 turno/i[-]. Quando un [00D5FF]alleato[-] viene attaccato, riduce i suoi [00D5FF]danni finali subiti[-] di un [FFAE00]50%[-], e l'eroe subisce un [FFAE00]20%[-] dei danni ridotti [00D5FF]su di sé[-].\\n\\n[00D5FF]※ Riduzione danni finali: viene applicato il valore più alto se sono presenti più effetti Buff dello stesso tipo.[-]",
       "en": "Assumes a Stance which [00D5FF]Taunts[-] enemies for [FFAE00]2 turn(s)[-]. When an [00D5FF]ally[-] is attacked, decreases their [00D5FF]final damage taken[-] by [FFAE00]50%[-], and the hero takes [FFAE00]20%[-] of the reduced damage [00D5FF]for them[-].\\n\\n[00D5FF]※ Final Damage Decrease: The highest value takes effect if there are multiple of the same Buff effect.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955925",
    "955926"
   ],
   "hiddenPassives": 2
  },
  "6000024": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Distruzione del giudizio",
      "en": "Smite of Judgment"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Cammino del fuoco divino",
      "en": "Divine Fire Walk"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che [00D5FF]Provoca[-] i nemici e riduce i danni subiti del [FFAE00]50%[-] quando subisce un attacco per [FFAE00]2 turno/i[-]. Svuota di [FFAE00]1[-][FFAE00] sfera/e[-] la Barra Mossa finale del nemico che ha usato l'abilità.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance which [00D5FF]Taunts[-] enemies and decreases damage taken by [FFAE00]50%[-] when attacked for [FFAE00]2 turn(s)[-]. Depletes the Ultimate Move Gauge of the enemy who used the skill by [FFAE00]1[-][FFAE00] orb(s)[-].\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955925",
    "955926"
   ],
   "hiddenPassives": 2
  },
  "6000025": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Distruzione del giudizio",
      "en": "Smite of Judgment"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Cammino del fuoco divino",
      "en": "Divine Fire Walk"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che [00D5FF]Provoca[-] i nemici e riduce i danni subiti del [FFAE00]50%[-] quando subisce un attacco per [FFAE00]2 turno/i[-]. Svuota di [FFAE00]1[-][FFAE00] sfera/e[-] la Barra Mossa finale del nemico che ha usato l'abilità.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance which [00D5FF]Taunts[-] enemies and decreases damage taken by [FFAE00]50%[-] when attacked for [FFAE00]2 turn(s)[-]. Depletes the Ultimate Move Gauge of the enemy who used the skill by [FFAE00]1[-][FFAE00] orb(s)[-].\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955925",
    "955926"
   ],
   "hiddenPassives": 2
  },
  "6000101": {
   "name": {
    "it": "Frammento della sostanza",
    "en": "Substance Fragment"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 2,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Sopraffazione",
      "en": "Overwhelm"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]\\n[00D5FF](Manca il bersaglio quando attacca nemici usando Provocazione)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]\\n[00D5FF](Misses when attacking enemies using Taunt)[-]"
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]tutti i nemici[-]. Applica [00D5FF]Sanguinamento[-] ai bersagli per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Sanguinamento: danni aggiuntivi pari al [FFAE00]90%[-] dei danni inflitti alla fine di ogni turno.[-]\\n[00D5FF](Manca il bersaglio quando attacca nemici usando Provocazione)[-]",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]all enemies[-]. Makes target(s) [00D5FF]Bleed[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Bleed: Additional damage equal to [FFAE00]90%[-] of damage dealt at the end of every turn.[-]\\n[00D5FF](Misses when attacking enemies using Taunt)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_monster_debuff"
    },
    {
     "slot": "b",
     "name": {
      "it": "Concentrazione",
      "en": "Concentrate"
     },
     "ranks": [
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]10%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]10%[-] of Max HP."
      },
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]15%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]15%[-] of Max HP."
      },
      {
       "it": "Cura i PS di [FFFFFF]tutti gli alleati[-] del [00FF00]25%[-] dei PS massimi.",
       "en": "Heals HP of [FFFFFF]all allies[-] by [00FF00]25%[-] of Max HP."
      }
     ],
     "kind": "heal",
     "icon": "icon_monster_buff"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955978",
    "955987"
   ],
   "hiddenPassives": 1
  },
  "6000102": {
   "name": {
    "it": "Frammento della sostanza",
    "en": "Substance Fragment"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 3,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Rovina",
      "en": "Ruin"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_monster_debuff_attack"
    },
    {
     "slot": "b",
     "name": {
      "it": "Concentrazione",
      "en": "Concentrate"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]1[-] effetto che aumenta i PS del [FFAE00]20%[-] per [FFAE00]2 turni[-] a tutti gli alleati.\\n[00D5FF](Può essere accumulato fino a 5 volte)[-]",
       "en": "Applies [FFAE00]1[-] effect that increases HP by [FFAE00]20%[-] for [FFAE00]2 turns[-] on all allies.\\n[00D5FF](Can be stacked up to 5 times)[-]"
      },
      {
       "it": "Applica [FFAE00]2[-] effetti che aumentano i PS del [FFAE00]20%[-] per [FFAE00]2 turni[-] a tutti gli alleati.\\n[00D5FF](Può essere accumulato fino a 5 volte)[-]",
       "en": "Applies [FFAE00]2[-] effects that increase HP by [FFAE00]20%[-] for [FFAE00]2 turns[-] on all allies.\\n[00D5FF](Can be stacked up to 5 times)[-]"
      },
      {
       "it": "Applica [FFAE00]3[-] effetti che aumentano i PS del [FFAE00]20%[-] per [FFAE00]2 turni[-] a tutti gli alleati.\\n[00D5FF](Può essere accumulato fino a 5 volte)[-]",
       "en": "Applies [FFAE00]3[-] effects that increase HP by [FFAE00]20%[-] for [FFAE00]2 turns[-] on all allies.\\n[00D5FF](Can be stacked up to 5 times)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_monster_buff"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955976",
    "955985"
   ],
   "hiddenPassives": 1
  },
  "6000103": {
   "name": {
    "it": "Frammento della sostanza",
    "en": "Substance Fragment"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 1,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Aura gloriosa",
      "en": "Glorious Aura"
     },
     "ranks": [
      {
       "it": "Applica [00D5FF]Colpo potente[-] a tutti gli alleati.\\n\\n[00D5FF]※Colpo potente: aumenta i danni inflitti con attacchi contro tutti del [FFAE00]100%[-].\\nViene rimosso dopo aver usato un attacco contro tutti.[-]",
       "en": "Applies [00D5FF]Powerful Strike[-] on all allies.\\n\\n[00D5FF]※Powerful Strike: Increases damage dealt with all-target attacks by [FFAE00]100%[-]\\nRemoved after using an all-target attack.[-]"
      },
      {
       "it": "Applica [00D5FF]Colpo potente[-] a tutti gli alleati.\\n\\n[00D5FF]※Colpo potente: aumenta i danni inflitti con attacchi contro tutti del [FFAE00]150%[-].\\nViene rimosso dopo aver usato un attacco contro tutti.[-]",
       "en": "Applies [00D5FF]Powerful Strike[-] on all allies.\\n\\n[00D5FF]※Powerful Strike: Increases damage dealt with all-target attacks by [FFAE00]150%[-]\\nRemoved after using an all-target attack.[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_monster_buff"
    },
    {
     "slot": "b",
     "name": {
      "it": "Dolore costante",
      "en": "Seething Pain"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Amplificazione[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Amplificazione: danni inflitti +[FFAE00]30%[-] per Buff attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Amplify[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Amplify: Damage dealt +[FFAE00]30%[-] per active Buff on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Amplificazione[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Amplificazione: danni inflitti +[FFAE00]30%[-] per Buff attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Amplify[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Amplify: Damage dealt +[FFAE00]30%[-] per active Buff on self.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Amplificazione[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Amplificazione: danni inflitti +[FFAE00]30%[-] per Buff attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Amplify[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Amplify: Damage dealt +[FFAE00]30%[-] per active Buff on self.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_monster_strike"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955977",
    "955986"
   ],
   "hiddenPassives": 1
  },
  "6000901": {
   "name": {
    "it": "Ludociel del [b]Lampo[/b]",
    "en": "Ludociel of [b]Flash[/b]"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 3,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Bagliore sacro",
      "en": "Holy Beam"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]250%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_ludociel_ssr_type01_skill_02"
    },
    {
     "slot": "b",
     "name": {
      "it": "Luce del giudizio",
      "en": "Light of Judgment"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Perforazione[-] pari al [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Perforazione:  x3 aumento della Perforazione.[-]",
       "en": "Inflicts [00D5FF]Pierce[-] damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Pierce: 3x Pierce Rate Increase.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_ludociel_ssr_type01_skill_07"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Redenzione splendente",
      "en": "Shining Redemption"
     },
     "ranks": [
      {
       "it": "Crea una barriera attorno a [FFFFFF]tutti gli alleati[-] pari a [FFAE00]999%[-] dell'Attacco per [FFAE00]1 turno/i[-]. Sotto attacco, subisce danni solo da statistiche di base.\\n[00D5FF](Esclude Rottura)[-]",
       "en": "Creates a barrier around [FFFFFF]all allies[-] equal to [FFAE00]999%[-] of Attack for [FFAE00]1 turn(s)[-]. Takes damage only from basic stats when attacked.\\n[00D5FF](Excludes Rupture)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_goddess_ludociel_ssr_type01_skill_08"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Fortezza divina",
      "en": "Divine Fortress"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento per [FFAE00]1 turno/i[-] che infligge danni [00D5FF]Recisione[-] pari a [FFAE00]100%[-] dell'Attacco su tutti i nemici con un contrattacco quando qualsiasi alleato viene attaccato.\\n\\n[00D5FF]※Recisione: Aumento Possibilità critico x3[-]",
       "en": "Assumes a Stance for [FFAE00]1 turn(s)[-], which deals [00D5FF]Sever[-] damage equal to [FFAE00]100%[-] of Attack on all enemies via counter when any ally is attacked.\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase[-]"
      }
     ],
     "kind": "counter_pose",
     "icon": "icon_goddess_ludociel_ssr_type01_skill_06"
    },
    {
     "slot": "special",
     "name": {
      "it": "Dea dell'arca santa",
      "en": "Goddess Holy Ark"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]350%[-] dell'Attacco a [FFFFFF]tutti i nemici[-] e crea una barriera pari al [FFAE00]20%[-] dei danni.",
       "en": "Inflicts damage equal to [FFAE00]350%[-] of Attack on [FFFFFF]all enemies[-] and creates a barrier equal to [FFAE00]20%[-] of the damage."
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_ludociel_ssr_type01_special_01"
    },
    {
     "slot": "counter",
     "name": {
      "it": "Fortezza divina",
      "en": "Divine Fortress"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari al [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Recisione: aumento x3 della Possibilità critico.[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Sever: 3x Crit Chance Increase.[-]"
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
   "passives": [],
   "hiddenPassives": 0
  },
  "6000902": {
   "name": {
    "it": "Sariel",
    "en": "Sariel"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 1,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Raffica tagliente",
      "en": "Sharp Wind"
     },
     "ranks": [
      {
       "it": "Infligge danni pari [FFAE00]80%[-] dell'Attacco \\ne applica un effetto [00D5FF]Corrosione [-] per [FFAE00]2 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi pari a [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(accumulo: 5 volte)[-]",
       "en": "Inflicts damage equal to [FFAE00]80%[-] of Attack and applies a [00D5FF]Corrosion[-] effect for [FFAE00]2 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Corrosion: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Stacks 5 times)[-]"
      },
      {
       "it": "Infligge danni pari [FFAE00]120%[-] dell'Attacco \\ne applica un effetto [00D5FF]Corrosione [-] per [FFAE00]2 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi pari a [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(accumulo: 5 volte)[-]",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack and applies a [00D5FF]Corrosion[-] effect for [FFAE00]2 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Corrosion: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Stacks 5 times)[-]"
      },
      {
       "it": "Infligge danni pari [FFAE00]320%[-] dell'Attacco \\ne applica un effetto [00D5FF]Corrosione [-] per [FFAE00]2 turno/i[-] su [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi pari a [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(accumulo: 5 volte)[-]",
       "en": "Inflicts damage equal to [FFAE00]320%[-] of Attack and applies a [00D5FF]Corrosion[-] effect for [FFAE00]2 turn(s)[-] on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Corrosion: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Stacks 5 times)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_goddess_sariel_npc_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "[b]Tornado[/b]",
      "en": "[b]Tornado[/b]"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]80%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]80%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Colpo di forza[-] pari al [FFAE00]320%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Colpo di forza: danni aggiuntivi pari alla Resistenza del nemico.[-]",
       "en": "Inflicts [00D5FF]Power Strike[-] damage equal to [FFAE00]320%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Power Strike: Additional damage equal to enemy Resistance.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_sariel_ssr_type01_skill_02"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Esponi debolezza",
      "en": "Expose Weakness"
     },
     "ranks": [
      {
       "it": "Applica [FFAE00]2[-] effetti [00D5FF]Corrosione[-] a [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n[00D5FF]Impedisce l'uso di abilità[-] di [FFFFFF]tutti i nemici[-] nell'ordine seguente: [00D5FF]Atteggiamento, Debuff, Buff, Attacco, Mossa finale[-].\\n\\n[00D5FF]※Corrosione: danni aggiuntivi pari al [FFAE00][FFAE00]5%[-][-] dei PS massimi alla fine di ogni turno.\\n(Accumulo: 5 volte)[-]",
       "en": "Applies [FFAE00]2[-] [00D5FF]Corrosion[-] effects on [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF]Disables skill usage[-] of [FFFFFF]all enemies[-] in the following order: [00D5FF]Stance, Debuff, Buff, Attack, Ultimate Move[-].\\n\\n[00D5FF]※Corrosion: Additional damage equal to [FFAE00][FFAE00]5%[-][-] of Max HP at the end of every turn.\\n(Stacks 5 times)[-]"
      }
     ],
     "kind": "debuff",
     "icon": "icon_goddess_sariel_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Raffica polverizzante",
      "en": "Pulverizing Wind"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Buff[-] da [FFFFFF]tutti i nemici[-] e infligge danni pari al [FFAE00]120%[-] dell'Attacco. Riduce del [FFAE00]15%[-] i PS massimi per [FFAE00]2 turno/i[-].\\n[00D5FF](Accumulo: 5 volte)[-]",
       "en": "[00D5FF]Removes Buffs[-] from [FFFFFF]all enemies[-] and inflicts damage equal to [FFAE00]120%[-] of Attack. Decreases Max HP by [FFAE00]15%[-] for [FFAE00]2 turn(s)[-].\\n[00D5FF](Stacks 5 times)[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_goddess_sariel_ssr_type01_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Lame gemelle del vento",
      "en": "Twin Wind Blade"
     },
     "ranks": [
      {
       "it": "Rimuove [00D5FF]Corrosione[-] da [FFFFFF]un nemico[-],\\n infligge danni pari a [FFAE00]400%[-] dell'Attacco, poi causa un [00D5FF]Rilascio Corrosione[-] pari a [FFAE00]100%[-].\\n\\n[00D5FF]※Rilascio Corrosione: infligge danni aggiuntivi \\npari al danni residui dell'effetto Corrosione rimosso.[-]",
       "en": "Removes [00D5FF]Corrosion[-] from [FFFFFF]one enemy[-], inflicts damage equal to [FFAE00]400%[-] of Attack, then causes [00D5FF]Corrosion Release[-] equal to [FFAE00]100%[-].\\n\\n[00D5FF]※Corrosion Release: Inflicts additional damage equal to the remaining damage of the removed Corrosion effect.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_sariel_ssr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "6000903": {
   "name": {
    "it": "Tarmiel",
    "en": "Tarmiel"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 2,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Bagliore dell'arca",
      "en": "Ark Beam"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_tarmiel_ssr_type01_skill_01"
    },
    {
     "slot": "b",
     "name": {
      "it": "Inondazione oceanica",
      "en": "Ocean Core Flood"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]180%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]180%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]270%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]270%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Polverizzazione[-] pari al [FFAE00]450%[-] dell'Attacco a [FFFFFF]un nemico[-]. Se la Barra Mossa finale dell'eroe ha almeno [FFAE00]4[-] [FFAE00]sfere[-], rimuove [FFAE00]1 sfera[-] dalla Barra Mossa finale del nemico.\\n\\n[00D5FF]※Polverizzazione: infligge [FFAE00]20%[-] danni aggiuntivi per [FFAE00]ogni sfera[-] nella Barra Mossa finale dell'eroe.[-]",
       "en": "Inflicts [00D5FF]Pulverize[-] damage equal to [FFAE00]450%[-] of Attack on [FFFFFF]one enemy[-]. If the hero's Ultimate Move Gauge has [FFAE00]4[-] [FFAE00]orb(s)[-] or more, removes [FFAE00]1 orb[-] from the enemy's Ultimate Move Gauge.\\n\\n[00D5FF]※Pulverize: [FFAE00]20%[-] additional damage for [FFAE00]each orb[-] in the hero's Ultimate Move Gauge.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_tarmiel_ssr_type01_skill_04"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Scudo dell'arca",
      "en": "Ark Shield"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che [00D5FF]Provoca[-] i nemici e riduce i danni subiti del [FFAE00]30%[-] quando subisce un attacco per [FFAE00]1 turno/i[-]. Svuota di [FFAE00]1[-][FFAE00] sfera/e[-] la Barra Mossa finale del nemico che ha usato l'abilità.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance which [00D5FF]Taunts[-] enemies and decreases damage taken by [FFAE00]30%[-] when attacked for [FFAE00]1 turn(s)[-]. Depletes the Ultimate Move Gauge of the enemy who used the skill by [FFAE00]1[-][FFAE00] orb(s)[-].\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_goddess_tarmiel_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Luce celestiale",
      "en": "Heavenly Light"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Domatura[-] pari al [FFAE00]90%[-] della Difesa su [FFFFFF]tutti i nemici[-] e riduce del [FFAE00]20%[-] l'Attacco per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Domatura: danni inflitti +[FFAE00]50%[-] per Atteggiamento attivo su sé stesso.[-]",
       "en": "Inflicts [00D5FF]Quell[-] damage equal to [FFAE00]90%[-] of Defense on [FFFFFF]all enemies[-] and decreases Attack by [FFAE00]20%[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Quell: Damage dealt +[FFAE00]50%[-] per active Stance on self.[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_goddess_tarmiel_ssr_type01_skill_05"
    },
    {
     "slot": "special",
     "name": {
      "it": "Arca",
      "en": "Ark"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]200%[-] della Difesa a [FFFFFF]tutti i nemici[-] e crea delle barriere intorno agli alleati pari al [FFAE00]10%[-] dei danni, subendo danni solo da statistiche di base.\\n[00D5FF](Effetto Rottura escluso)[-]",
       "en": "Inflicts damage equal to [FFAE00]200%[-] of Defense on [FFFFFF]all enemies[-] and creates barriers around all allies equal to [FFAE00]10%[-] of damage, taking damage only from basic stats.\\n[00D5FF](Excludes Rupture effect)[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_tarmiel_ssr_type01_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "6000904": {
   "name": {
    "it": "Mael",
    "en": "Mael"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 3,
   "icon": false,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Tagliasole",
      "en": "Sun Cutter"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari a [FFAE00]200%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Recisione: x2 aumento possibilità critico[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]200%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Sever: 2x Crit Chance Increase[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari a [FFAE00]300%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Recisione: x2 aumento possibilità critico[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]300%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Sever: 2x Crit Chance Increase[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Recisione[-] pari a [FFAE00]500%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Recisione: x2 aumento possibilità critico[-]",
       "en": "Inflicts [00D5FF]Sever[-] damage equal to [FFAE00]500%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Sever: 2x Crit Chance Increase[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_mael_ssr_type02_skill_03"
    },
    {
     "slot": "b",
     "name": {
      "it": "Bagliore di Elio",
      "en": "Helios Flare"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]250%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]250%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      },
      {
       "it": "Infligge danni [00D5FF]Fiamme nere[-] pari al [FFAE00]400%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Fiamme nere: [FFAE00]+[-][FFAE00]25%[-][-] danni inflitti per effetto Incendio sul bersaglio.",
       "en": "Inflicts [00D5FF]Blaze[-] damage equal to [FFAE00]400%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Blaze: [FFAE00]+[-][FFAE00]25%[-][-] damage dealt per Ignite effect on target."
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_mael_ssr_type02_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Raggio solare",
      "en": "Solar Ray"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Lancia[-] pari a [FFAE00]200%[-] dell'Attacco e applica [FFAE00]1[-] [00D5FF]Punto del Sole[-] su [FFFFFF]tutti i nemici[-] per [FFAE00]2 turno/i[-].\\n\\n[00D5FF]※Lancia: x2 aumento Danno critico.[-]\\n[00D5FF]※Punto del Sole: [FFAE00]-[FFAE00]20%[-][-] di danni inflitti (può essere accumulato fino a [FFAE00]3 volte[-])[-]",
       "en": "Inflicts [00D5FF]Spike[-] damage equal to [FFAE00]200%[-] of Attack and applies [FFAE00]1[-] [00D5FF]Sunspot[-] effect on [FFFFFF]all enemies[-] for [FFAE00]2 turn(s)[-].\\n\\n[00D5FF]※Spike: 2x Crit Damage Increase.[-]\\n[00D5FF]※Sunspot: Damage dealt [FFAE00]-[FFAE00]20%[-][-] (Can be stacked up to [FFAE00]3 times[-])[-]"
      }
     ],
     "kind": "debuff_atk",
     "icon": "icon_goddess_mael_ssr_type02_skill_02"
    },
    {
     "slot": "exclusive_b",
     "name": {
      "it": "Combinazione solare",
      "en": "Sun Combination"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Co-distruzione[-] pari al [FFAE00]5000%[-] dell'Attacco a [FFFFFF]un nemico[-].\\n\\n[00D5FF]※Co-distruzione: [FFAE00]40%[-] danni aumentati [FFAE00]per Debuff[-] sul bersaglio.[-]\\n[00D5FF](Manca il bersaglio quando attacca nemici assumendo un Atteggiamento Contrattacco)[-]",
       "en": "Inflicts [00D5FF]Co-destruction[-] damage equal to [FFAE00]5000%[-] of Attack on [FFFFFF]one enemy[-].\\n\\n[00D5FF]※Co-destruction: [FFAE00]40%[-] increased damage [FFAE00]per Debuff[-] on the target.[-]\\n[00D5FF](Misses when attacking enemies assuming a Counter Stance)[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_mael_ssr_type02_skill_04"
    },
    {
     "slot": "special",
     "name": {
      "it": "Sole nascente",
      "en": "Rising Sun"
     },
     "ranks": [
      {
       "it": "[00D5FF]Rimuove Atteggiamento/i[-] da [FFFFFF]tutti i nemici[-], applica [FFAE00]1[-] [00D5FF]Punto del Sole[-] per [FFAE00]2 turni[-] e infligge danni [00D5FF]Esplosione Punto del Sole[-] pari a [FFAE00]500%[-] dell'Attacco.\\n\\n[00D5FF]※Esplosione Punto del Sole: [FFAE00]+[-][FFAE00]5%[-] danni inflitti per [FFAE00]ogni[-] Punto del Sole applicato al bersaglio.[-]",
       "en": "[00D5FF]Removes Stance(s)[-] from [FFFFFF]all enemies[-], applies [FFAE00]1[-] [00D5FF]Sunspot[-] for [FFAE00]2 turns[-], and inflicts [00D5FF]Sunspot Explosion[-] damage equal to [FFAE00]500%[-] of Attack.\\n\\n[00D5FF]※Sunspot Explosion: Damage dealt [FFAE00]+[-][FFAE00]5%[-] for [FFAE00]every[-] Sunspot applied to the target.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_goddess_mael_ssr_type02_special_01"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [],
   "hiddenPassives": 0
  },
  "6000905": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Distruzione del giudizio",
      "en": "Smite of Judgment"
     },
     "ranks": [
      {
       "it": "Infligge danni pari al [FFAE00]120%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]1[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]120%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]1[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      },
      {
       "it": "Infligge danni pari al [FFAE00]150%[-] dell'Attacco a [FFFFFF]un nemico[-] e [00D5FF]svuota[-] [FFAE00]3[-] [FFAE00]sfera/e[-] dalla Barra Mossa finale.",
       "en": "Inflicts damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]one enemy[-] and [00D5FF]depletes[-] [FFAE00]3[-] Ultimate Move Gauge [FFAE00]orb(s)[-]."
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_01"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Cammino del fuoco divino",
      "en": "Divine Fire Walk"
     },
     "ranks": [
      {
       "it": "Assume un Atteggiamento che [00D5FF]Provoca[-] i nemici e riduce i danni subiti del [FFAE00]50%[-] quando subisce un attacco per [FFAE00]2 turno/i[-]. Svuota di [FFAE00]1[-][FFAE00] sfera/e[-] la Barra Mossa finale del nemico che ha usato l'abilità.\\n\\n[00D5FF]※Provocazione: indirizza tutti gli attacchi a sé stesso.[-]",
       "en": "Assumes a Stance which [00D5FF]Taunts[-] enemies and decreases damage taken by [FFAE00]50%[-] when attacked for [FFAE00]2 turn(s)[-]. Depletes the Ultimate Move Gauge of the enemy who used the skill by [FFAE00]1[-][FFAE00] orb(s)[-].\\n\\n[00D5FF]※Taunt: Directs all attacks to self.[-]"
      }
     ],
     "kind": "defence_pose",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_02"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955925",
    "955926",
    "955956"
   ],
   "hiddenPassives": 2
  },
  "6000906": {
   "name": {
    "it": "Guerriero della Dea",
    "en": "Goddess Warrior"
   },
   "nameDeduced": true,
   "description": null,
   "race": 5,
   "attribute": 4,
   "icon": true,
   "skills": [
    {
     "slot": "a",
     "name": {
      "it": "Impatto divino",
      "en": "Divine Impact"
     },
     "ranks": [
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]100%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]100%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      },
      {
       "it": "Infligge danni [00D5FF]Rottura[-] pari a [FFAE00]150%[-] dell'Attacco a [FFFFFF]tutti i nemici[-].\\n\\n[00D5FF]※Rottura: x2 danni contro nemici con Buff.[-]",
       "en": "Inflicts [00D5FF]Rupture[-] damage equal to [FFAE00]150%[-] of Attack on [FFFFFF]all enemies[-].\\n\\n[00D5FF]※Rupture: 2x damage against Buffed enemies.[-]"
      }
     ],
     "kind": "atk",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_03"
    },
    {
     "slot": "exclusive_a",
     "name": {
      "it": "Potere del giudizio",
      "en": "Might of Judgment"
     },
     "ranks": [
      {
       "it": "Applica l'effetto [00D5FF]Protezione del giudice[-] a tutti gli alleati per [FFAE00]3 turno/i[-].\\n\\n[00D5FF]※Protezione del giudice: tutte le statistiche [FFAE00]+[-][FFAE00]10%[-][-]\\n[00D5FF](Nessun limite)[-]",
       "en": "Applies [00D5FF]Judge's Protection[-] effect on all allies for [FFAE00]3 turn(s)[-].\\n\\n[00D5FF]※Judge's Protection: All Stats [FFAE00]+[-][FFAE00]10%[-][-]\\n[00D5FF](No limit)[-]"
      }
     ],
     "kind": "buff",
     "icon": "icon_supreme_deity_tank_ssr_type01_skill_04"
    }
   ],
   "draw": {
    "a": 60,
    "b": 40
   },
   "passives": [
    "955927",
    "955928",
    "955980",
    "955984"
   ],
   "hiddenPassives": 2
  }
 },
 "passives": {
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
  "955902": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Cammino del fuoco divino\" [FFAE00]ogni turno[-].",
    "en": "Uses \"Divine Fire Walk\" [FFAE00]every turn[-]."
   }
  },
  "955903": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Cammino del fuoco divino\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Divine Fire Walk\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955904": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Cammino del fuoco divino\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Divine Fire Walk\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955905": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Potere del giudizio\" [FFAE00]ogni turno[-].",
    "en": "Uses \"Might of Judgment\" [FFAE00]every turn[-]."
   }
  },
  "955906": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Potere del giudizio\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Might of Judgment\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955907": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Potere del giudizio\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Might of Judgment\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955909": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Riflesso angelico\" a ogni [FFAE00]turno dispari[-].",
    "en": "Uses \"Angelic Reflection\" every [FFAE00]odd-numbered turn[-]."
   }
  },
  "955910": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Riflesso angelico\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Angelic Reflection\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955911": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Tranquillità posata\" [FFAE00]ogni turno[-].",
    "en": "Uses \"Posed Tranquility\" [FFAE00]every turn[-]."
   }
  },
  "955913": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Tranquillità posata\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Posed Tranquility\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955916": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Riflesso amplificato\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Amplified Reflection\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "955917": {
   "name": {
    "it": "Riduzione danni Contrattacco e Riflessione",
    "en": "Counter and Reflect Damage Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]100%[-] i danni subiti dall'eroe dai Contrattacchi e Riflessione.",
    "en": "Decreases the hero's damage taken from Counterattacks and Reflect by [FFAE00]100%[-]."
   }
  },
  "955919": {
   "name": {
    "it": "Immunità a Inabilità",
    "en": "Incapacitation Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]Congelamento, Pietrificazione e Stordimento[-].\\n[00D5FF]Nessuna statistica scende al di sotto dei valori iniziali[-]. [00D5FF]Blocca gli effetti delle abilità Visione e Macchia di sangue dei nemici, inclusi quelli delle Mosse finali[-].",
    "en": "Immune to [00D5FF]Freeze, Petrify, and Stun[-].\\n[00D5FF]No stats will decrease below their initial values[-]. [00D5FF]Blocks enemies' Bloodstain and Insight skill effects, including those of Ultimate Moves[-]."
   }
  },
  "955922": {
   "name": {
    "it": "Immunità ai Debuff",
    "en": "Debuff Immunity"
   },
   "text": {
    "it": "Immune a [00D5FF]tutti i Debuff[-]. [00D5FF]Nessuna statistica scende al di sotto dei valori iniziali[-]. [00D5FF]Blocca gli effetti delle abilità Visione e Macchia di sangue dei nemici, inclusi quelli delle Mosse finali[-].",
    "en": "Immune to [00D5FF]all Debuffs[-]. [00D5FF]No stats will decrease below their initial values[-]. [00D5FF]Blocks enemies' Bloodstain and Insight skill effects, including those of Ultimate Moves[-]."
   }
  },
  "955925": {
   "name": {
    "it": "Atteggiamento minaccioso",
    "en": "Threatening Posture"
   },
   "text": {
    "it": "Assume un Atteggiamento Difesa all'inizio della battaglia. L'Atteggiamento applicato all'inizio della battaglia è [00D5FF]immune ad Annulla Atteggiamento[-].",
    "en": "Assumes a Defense Stance at the start of the battle. The Stance applied at the start of the battle is [00D5FF]immune to Stance Cancel[-]."
   }
  },
  "955926": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "Mentre assume un Atteggiamento, i danni subiti da tutti gli alleati da parte di abilità durante il turno del nemico non superano il 15% dei PS massimi.",
    "en": "While assuming a Stance, the damage taken by all allies from skills during the enemy's turn does not exceed 15% of Max HP."
   }
  },
  "955927": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta l'Attacco di un valore pari al [FFAE00]35%[-] della Difesa dell'eroe all'inizio della battaglia.",
    "en": "Increases Attack by a value equal to [FFAE00]35%[-] of the hero's Defense at the start of the battle."
   }
  },
  "955928": {
   "name": {
    "it": "Conversione Buff",
    "en": "Buff Conversion"
   },
   "text": {
    "it": "Se quest'unità ha [FFAE00]2[-] o più effetti [00D5FF]Protezione del giudice[-] all'inizio del turno degli alleati, vengono rimossi e sostituiti con [00D5FF]Canzone del giudizio[-].\\n\\n[00D5FF]※Canzone del giudizio: tutte le statistiche [FFAE00]+10%[-]\\nI danni subiti da abilità durante il turno del nemico non superano il [FFAE00]40%[-] dei PS massimi.[-]",
    "en": "If this unit has [FFAE00]2[-] or more [00D5FF]Judge's Protection[-] effects at the start of the allies' turn, they are removed and replaced with [00D5FF]Song of Judgment[-].\\n\\n[00D5FF]※Song of Judgment: All stats [FFAE00]+10%[-]\\nDamage taken from skills during the enemy's turn does not exceed [FFAE00]40%[-] of Max HP.[-]"
   }
  },
  "955929": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Se i danni subiti dall'eroe superano un [FFAE00]30%[-] dei suoi PS massimi quando viene attaccato, i danni finali sono ridotti di un [FFAE00]50%[-].",
    "en": "If the damage taken is greater than [FFAE00]30%[-] of the hero's Max HP when attacked, decreases final damage taken by [FFAE00]50%[-]."
   }
  },
  "955930": {
   "name": {
    "it": "Aumento statistiche di base",
    "en": "Basic Stats Increase"
   },
   "text": {
    "it": "Aumenta le statistiche di base di tutti gli alleati del 10%.",
    "en": "Increases all allies' basic stats by 10%."
   }
  },
  "955931": {
   "name": {
    "it": "Aumento Difesa",
    "en": "Defense Increase"
   },
   "text": {
    "it": "Aumenta la Difesa degli alleati di [FFAE00]10%[-].",
    "en": "Increases allies' Defense by [FFAE00]10%[-]."
   }
  },
  "955932": {
   "name": {
    "it": "Aumento PS",
    "en": "HP Increase"
   },
   "text": {
    "it": "Aumenta i PS di tutti gli alleati di [FFAE00]10%[-].",
    "en": "Increases allies' HP by [FFAE00]10%[-]."
   }
  },
  "955933": {
   "name": {
    "it": "Nascondersi",
    "en": "Hide"
   },
   "text": {
    "it": "Impossibile selezionare i bersagli se c'è un alleato oltre all'eroe sul campo di battaglia.",
    "en": "Cannot select targets when an ally other than the hero exists on the battlefield."
   }
  },
  "955934": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] le statistiche di base dell'eroe [FFAE00]per ogni[-] Buff sul campo di battaglia.\\n[00D5FF](Limite 10 volte)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]5%[-] [FFAE00]for each[-] battlefield Buff.\\n[00D5FF](Limit 10 times)[-]"
   }
  },
  "955935": {
   "name": {
    "it": "Aggiungi effetto bonus",
    "en": "Add Bonus Effect"
   },
   "text": {
    "it": "Quando un alleato con [00D5FF]Canzone del giudizio[-] subisce o infligge danni, [00D5FF]blocca tutti gli effetti Abilità, inclusi quelli delle Mosse finali,[-] per [FFAE00]2 turni[-] per il nemico corrispondente.\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]\\n\\n[00D5FF]※Canzone del giudizio: tutte le statistiche [FFAE00]+10%[-].\\nI danni subiti da abilità durante il turno del nemico non superano il [FFAE00]40%[-] dei PS massimi.[-]",
    "en": "When an ally with [00D5FF]Song of Judgment[-] takes or deals damage, it [00D5FF]blocks all skill effects including those of Ultimate Moves[-] for [FFAE00]2 turns[-] for the corresponding enemy.\\n[00D5FF](Excludes Stance and Recovery Skills)[-]\\n\\n[00D5FF]※Song of Judgment: All stats [FFAE00]+10%[-].\\nDamage taken from skills during the enemy's turn does not exceed [FFAE00]40%[-] of Max HP.[-]"
   }
  },
  "955937": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Ottiene [00D5FF]Esecuzione del giudizio[-] per [FFAE00]2 turni[-] quando subisce un attacco.\\n\\n[00D5FF]※Esecuzione del giudizio: danni inflitti [FFAE00]+15%[-], Possibilità critico [FFAE00]+30%[-][-]\\n[00D5FF](Nessun limite)[-]",
    "en": "Gains [00D5FF]Judgment Execution[-] for [FFAE00]2 turns[-] when attacked.\\n\\n[00D5FF]※Judgment Execution: Damage dealt [FFAE00]+15%[-], Crit Chance [FFAE00]+30%[-][-]\\n[00D5FF](No limit)[-]"
   }
  },
  "955938": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Applica [00D5FF]Danni inflitti fissi con attacchi contro tutti[-] a tutti i nemici all'inizio del turno degli alleati. Tutti gli effetti vengono rimossi quando quest'unità muore.",
    "en": "Applies [00D5FF]fixed damage dealt with all-target attacks[-] on all enemies at the start of the allies' turn. The effects are all removed when this unit dies."
   }
  },
  "955939": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Applica [00D5FF]Corrosione[-] che infligge danni pari al [FFAE00]15%[-] dei PS rimanenti a tutti i nemici alla fine del turno per [FFAE00]2 turni[-] quando quest'unità muore.",
    "en": "Applies [00D5FF]Corrosion[-] which inflicts damage equal to [FFAE00]15%[-] of the remaining HP to all enemies at the end of the turn for [FFAE00]2 turns[-] when this unit dies."
   }
  },
  "955940": {
   "name": {
    "it": "Potere delle Dee",
    "en": "Power of the Goddesses"
   },
   "text": {
    "it": "Se i danni subiti dall'eroe superano il [FFAE00]50%[-] dei suoi PS massimi quando viene attaccato, recupera [FFAE00]50%[-] dei danni subiti.",
    "en": "If the damage taken is greater than [FFAE00]50%[-] of the hero's Max HP when attacked, recovers [FFAE00]50%[-] of damage taken."
   }
  },
  "955941": {
   "name": {
    "it": "Riduzione danni",
    "en": "Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]300%[-] i danni subiti dagli alleati dalle abilità Attacco di tutti i bersagli.",
    "en": "Decreases allies' damage taken from all-target attack skills by [FFAE00]300%[-]."
   }
  },
  "955942": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta [FFAE00]20%[-] le statistiche di base dell'eroe all'inizio del turno degli alleati se l'Eroe non subisce danni.\\n[00D5FF](Limite: 5 volta/e; si resetta dopo aver subito danni)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]20%[-] at the start of the allies' turn if the hero doesn't take damage.\\n[00D5FF](Limit 5 time(s), resets upon taking damage)[-]"
   }
  },
  "955944": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] i danni inflitti quando l'eroe usa un'abilità su un nemico con la barra Mossa finale vuota.\\n[00D5FF](Si applica prima dell'attivazione dell'abilità)[-]",
    "en": "Increases damage dealt by [FFAE00]50%[-] when the hero uses a skill on an enemy with an empty Ultimate Move Gauge.\\n[00D5FF](Applies before skill activation)[-]"
   }
  },
  "955945": {
   "name": {
    "it": "Ultima possibilità",
    "en": "Last Chance"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] i danni inflitti agli eroi con la Barra Mossa finale piena.",
    "en": "Increases damage dealt to heroes with full Ultimate Move Gauges by [FFAE00]50%[-]."
   }
  },
  "955946": {
   "name": {
    "it": "Aumento statistiche relative all'Attacco",
    "en": "Attack-related Stats Increase"
   },
   "text": {
    "it": "Ogni volta che i PS dell'eroe vengono ridotti del [FFAE00]5%[-], le statistiche relative all'Attacco aumentano del [FFAE00]1%[-] usando un'abilità.",
    "en": "Each time the hero's HP is depleted by [FFAE00]5%[-], Attack-related stats increase by [FFAE00]1%[-] when using skills."
   }
  },
  "955950": {
   "name": {
    "it": "Convinzione immutabile",
    "en": "Immutable Conviction"
   },
   "text": {
    "it": "All'inizio del turno degli alleati, ogni [FFAE00]2 turno/i[-], ripristina la percentuale di PS di tutti gli alleati [00D5FF]al valore dell'alleato con la percentuale di PS rimanenti più alta[-].",
    "en": "At the start of the allies' turn every [FFAE00]2 turn(s)[-], restores all allies' HP percentage [00D5FF]to that of the ally with the highest remaining HP percentage[-]."
   }
  },
  "955951": {
   "name": {
    "it": "Autodistruzione",
    "en": "Self-Destruct"
   },
   "text": {
    "it": "Ottiene [00D5FF]Catene raggianti[-] all'inizio della battaglia. Quando è in fin di vita, infligge danni pari al 100% dei punti [00D5FF]Catene raggianti[-] accumulati a tutti gli alleati.",
    "en": "Gains [00D5FF]Radiant Shackles[-] at the start of the battle. When dying, inflicts damage equal to 100% of the accumulated [00D5FF]Radiant Shackles[-] points to all allies."
   }
  },
  "955953": {
   "name": {
    "it": "Recupero PS",
    "en": "HP Recovery"
   },
   "text": {
    "it": "Ogni volta che l'Atteggiamento di quest'unità viene rimosso, quest'ultima recupera PS pari al 20% dei suoi PS massimi.",
    "en": "Each time this unit's Stance is removed, it recovers HP equal to 20% of their Max HP."
   }
  },
  "955955": {
   "name": {
    "it": "Riflessione danni",
    "en": "Damage Reflect"
   },
   "text": {
    "it": "Quando si subiscono danni fatali, infligge danni pari al 300% dei danni subiti al nemico che ha usato l'abilità.",
    "en": "When taking fatal damage, inflicts damage equal to 300% of damage taken to the enemy who used the skill."
   }
  },
  "955956": {
   "name": {
    "it": "Determinazione infrangibile",
    "en": "Solid Resolve"
   },
   "text": {
    "it": "Ottiene [00D5FF]Catene raggianti[-] all'inizio della battaglia.",
    "en": "Gains [00D5FF]Radiant Shackles[-] at the start of the battle."
   }
  },
  "955957": {
   "name": {
    "it": "Estorsione barra Mossa finale",
    "en": "Extort Ultimate Move Gauge"
   },
   "text": {
    "it": "Ruba [FFAE00]1 sfera/e[-] dalla barra Mossa finale del bersaglio quando attacca.",
    "en": "Steals [FFAE00]1 orb(s)[-] from the target's Ultimate Move Gauge when attacking."
   }
  },
  "955958": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico dell'eroe del [FFAE00]20%[-] e il Danno critico del [FFAE00]20%[-] per ogni uso di un'abilità da parte di questo eroe.\\n[00D5FF](Limite: 10 volta/e)[-]",
    "en": "Increases the hero's Crit Chance by [FFAE00]20%[-] and Crit Damage by [FFAE00]20%[-] for each time this hero has used a skill.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "955963": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Ottiene [FFAE00]4[-] applicazioni di [00D5FF]Favore della Divinità Suprema[-] all'inizio della battaglia. Applica [FFAE00]1[-] [00D5FF]Stemma della protezione[-] ogni volta che l'effetto viene rimosso.\\n\\n[00D5FF]※Favore della Divinità Suprema: quando subisce più di una certa quantità di danni durante il turno del nemico, rimuove [FFAE00]1[-] [00D5FF]Favore della Divinità Suprema[-] applicato a tutti gli alleati.\\n※Stemma della protezione: fissa i danni subiti a [FFAE00]1[-] quando un nemico usa un'abilità. (Limite: [FFAE00]una volta[-])[-]",
    "en": "Gains [FFAE00]4[-] instances of [00D5FF]Supreme Deity's Favor[-] at the start of the battle. Applies [FFAE00]1[-] [00D5FF]Crest of Protection[-] each time the effect is removed.\\n\\n[00D5FF]※Supreme Deity's Favor: When taking more than a set amount of damage during the enemy's turn, removes [FFAE00]1[-] [00D5FF]Supreme Deity's Favor[-] applied to all allies.\\n※Crest of Protection: Fixes damage taken to [FFAE00]1[-] when an enemy uses a skill. (Limit [FFAE00]once[-])[-]"
   }
  },
  "955964": {
   "name": {
    "it": "Traccia della Divinità Suprema",
    "en": "Trace of the Supreme Deity"
   },
   "text": {
    "it": "Ottiene [00D5FF]Riflessione[-] ogni volta che quest'unità assume un Atteggiamento. Quando subisce un attacco da un nemico mentre assume un Atteggiamento, riduce le statistiche di chi ha attaccato, tranne le statistiche di base, del [FFAE00]20%[-].",
    "en": "Gains [00D5FF]Reflect[-] each time this unit assumes a Stance. When attacked by an enemy while assuming a Stance, decreases the attacker's stats other than basic stats by [FFAE00]20%[-]."
   }
  },
  "955965": {
   "name": {
    "it": "Applica l'effetto Evasione",
    "en": "Apply Evade Effect"
   },
   "text": {
    "it": "Ottiene [00D5FF]Evasione[-] [FFAE00]1 volta[-] ogni volta che i PS sono completamente pieni.",
    "en": "Gains [00D5FF]Evade[-] [FFAE00]1 time[-] every time HP is completely filled."
   }
  },
  "955966": {
   "name": {
    "it": "Conversione Buff",
    "en": "Buff Conversion"
   },
   "text": {
    "it": "Se quest'unità ha [FFAE00]2[-] o più effetti [00D5FF]Protezione del giudice[-] all'inizio del turno degli alleati, vengono rimossi e sostituiti con [00D5FF]Canzone del giudizio[-].\\n\\n[00D5FF]※Canzone del giudizio: tutte le statistiche [FFAE00]+10%[-]\\nI danni subiti da abilità durante il turno del nemico non superano il [FFAE00]40%[-] dei PS massimi.[-]",
    "en": "If this unit has [FFAE00]2[-] or more [00D5FF]Judge's Protection[-] effects at the start of the allies' turn, they are removed and replaced with [00D5FF]Song of Judgment[-].\\n\\n[00D5FF]※Song of Judgment: All stats [FFAE00]+10%[-]\\nDamage taken from skills during the enemy's turn does not exceed [FFAE00]40%[-] of Max HP.[-]"
   }
  },
  "955967": {
   "name": {
    "it": "Aumento Danni subiti",
    "en": "Damage Taken Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] per [FFAE00]2 turni[-] i danni subiti da un nemico che ha usato un'abilità, fino a [FFAE00]3 volte[-].",
    "en": "Increases damage taken by an enemy who used a skill by [FFAE00]10%[-] for [FFAE00]2 turns[-], up to [FFAE00]3 times[-]."
   }
  },
  "955968": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Applica [00D5FF]Splendore e Collettività[-] a tutti gli alleati all'inizio della battaglia.\\n\\n[00D5FF]※Splendore: i PS non scendono sotto il [FFAE00]20%[-] e i [00D5FF]danni subiti[-] da attacchi a bersaglio singolo si riducono del [FFAE00]40%[-] mentre gli alleati sono vivi.\\n※Collettività: riceve danni pari al [FFAE00]10%[-] dei danni ridotti da Splendore.[-]",
    "en": "Applies [00D5FF]Radiance and Collective[-] on all allies at the start of the battle.\\n\\n[00D5FF]※Radiance: HP doesn't fall below [FFAE00]20%[-] and [00D5FF]damage taken[-] from single-target attacks decrease by [FFAE00]40%[-] while allies are alive.\\n※Collective: Receives damage equal to [FFAE00]10%[-] of damage reduced by Radiance.[-]"
   }
  },
  "955969": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Applica [00D5FF]Riflusso[-] a tutti i nemici all'inizio della battaglia.\\n\\n[00D5FF]※Riflusso: la Barra Stigmate non aumenta in proporzione ai danni inflitti ma, invece, si riduce.[-]",
    "en": "Applies [00D5FF]Reflux[-] on all enemies at the start of the battle.\\n\\n[00D5FF]※Reflux: Stigmata Gauge does not increase proportional to damage dealt, instead, decreases.[-]"
   }
  },
  "955974": {
   "name": {
    "it": "Autorità della Divinità Suprema",
    "en": "Supreme Deity's Authority"
   },
   "text": {
    "it": "Se [FFAE00]3[-] o più abilità dello stesso tipo vengono usate in un turno, tutti gli alleati [FFAE00]non posso usare quel tipo di abilità[-] per [00D5FF]2 turni[-].",
    "en": "If [FFAE00]3[-] or more of the same skill type is used in one turn, all allies [FFAE00]cannot use that skill type[-] for [00D5FF]2 turns[-]."
   }
  },
  "955975": {
   "name": {
    "it": "Amplificazione magica",
    "en": "Magic Amplification"
   },
   "text": {
    "it": "Se il Giudizio termina mentre sei ancora in vita, la magia della Divinità Suprema aumenta ulteriormente.",
    "en": "If Judgment ends while still alive, Supreme Deity's magic is additionally increased."
   }
  },
  "955976": {
   "name": {
    "it": "Energia dell'acqua",
    "en": "Water Energy"
   },
   "text": {
    "it": "La Barra Stigmate del nemico aumenta dell'[FFAE00]1%[-] quando si subiscono danni dal nemico.",
    "en": "The enemy's Stigmata Gauge increases by [FFAE00]1%[-] when taking damage from the enemy."
   }
  },
  "955977": {
   "name": {
    "it": "Energia della luce",
    "en": "Light Energy"
   },
   "text": {
    "it": "La Barra Stigmate del nemico aumenta del [FFAE00]50%[-] quando quest'unità muore.",
    "en": "The enemy's Stigmata Gauge increases by [FFAE00]50%[-] when this unit dies."
   }
  },
  "955978": {
   "name": {
    "it": "Energia del vento",
    "en": "Wind Energy"
   },
   "text": {
    "it": "Se non riesce a infliggere danni usando un'Abilità Attacco, aumenta i [00D5FF]danni subiti[-] di tutti gli alleati del [FFAE00]300%[-].",
    "en": "If unable to deal damage upon using an Attack Skill, increases all allies' [00D5FF]damage taken[-] by [FFAE00]300%[-]."
   }
  },
  "955979": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "[00D5FF]Difesa critico e Resistenza critico vengono ridotte del [FFAE00]100%[-][-] per [FFAE00]2 turni[-] quando attacca un nemico assumendo un Atteggiamento.",
    "en": "[00D5FF]Crit Defense and Crit Resistance is reduced by [FFAE00]100%[-][-] for [FFAE00]2 turns[-] when attacking an enemy assuming a Stance."
   }
  },
  "955980": {
   "name": {
    "it": "Traccia della Divinità Suprema",
    "en": "Trace of the Supreme Deity"
   },
   "text": {
    "it": "Applica [00D5FF]Barriera raggiante[-] a tutti gli alleati all'inizio della battaglia e, se [00D5FF]Barriera raggiante[-] viene rimossa da sé, [00D5FF]Barriera raggiante[-] viene rimossa anche da tutti gli alleati.\\n\\n[00D5FF]※Barriera raggiante: crea una barriera pari al [FFAE00]999%[-] dell'Attacco che subisce danni solo dalle statistiche di base. Applica Sopprimi Danni subiti pari al [FFAE00]20%[-] per [FFAE00]1 turno[-] quando viene rimossa.[-]",
    "en": "Applies [00D5FF]Radiant Barrier[-] on all allies at the start of the battle, and if [00D5FF]Radiant Barrier[-] is removed from self, [00D5FF]Radiant Barrier[-] is removed from all allies.\\n\\n[00D5FF]※Radiant Barrier: Creates a barrier equal to [FFAE00]999%[-] of Attack that takes damage only from basic stats. Applies [FFAE00]20%[-] Suppress Damage Taken for [FFAE00]1 turn[-] when removed.[-]"
   }
  },
  "955984": {
   "name": {
    "it": "Martello del giudizio",
    "en": "Hammer of Judgment"
   },
   "text": {
    "it": "All'inizio della battaglia, [00D5FF]Fulmine divino[-] viene applicato all'eroe e i [00D5FF]danni subiti[-] dagli [00D5FF]alleati[-] si riducono del [FFAE00]30%[-] per [FFAE00]2 turni[-]. Quando [00D5FF]Fulmine divino[-] raggiunge il suo [00D5FF]valore massimo, l'effetto viene rimosso[-] e l'eroe guadagna [00D5FF]Concentrato di fulmine[-] per [FFAE00]3 turni[-].\\n\\nInoltre, per [FFAE00]ogni[-] [00D5FF]alleato[-] che partecipa alla battaglia, tutte le statistiche dell'eroe aumentano del [FFAE00]5%[-]. Per [FFAE00]ogni[-] Buff o Debuff applicato agli [00D5FF]alleati[-], i [00D5FF]danni inflitti[-] dall'eroe aumentano del [FFAE00]4%[-], fino al [FFAE00]40%[-].\\n\\n[00D5FF]※ Fulmine divino: danni inflitti e danni subiti si accumulano fino a un massimo di [FFAE00]300.000[-].\\nInfligge danni aggiuntivi pari al [FFAE00]10%[-] dei danni immagazzinati utilizzando un'abilità.\\n[FFAE00]+50%[-] di danni inflitti ai bersagli con Provocazione.[-]\\n[00D5FF]※ Concentrato di fulmine: statistiche relative all'Attacco [FFAE00]+10%[-].\\nInfligge danni aggiuntivi pari al [FFAE00]10%[-] dei danni finali a tutti i nemici quando usano un'Abilità Attacco.\\n[FFAE00]+50%[-] di danni inflitti ai bersagli con Provocazione.\\nApplica Fulmine divino quando viene rimosso.[-][-]",
    "en": "At the start of the battle, [00D5FF]Divine Lightning[-] is applied on the hero and [00D5FF]allies'[-] [00D5FF]damage taken[-] decreases by [FFAE00]30%[-] for [FFAE00]2 turns[-]. When [00D5FF]Divine Lightning[-] reaches its [00D5FF]maximum value, the effect is removed[-] and the hero gains [00D5FF]Condensed Lightning[-] for [FFAE00]3 turns[-].\\n\\nIn addition, for [FFAE00]each[-] [00D5FF]ally[-] participating in battle, all of the hero's stats are increased by [FFAE00]5%[-]. For [FFAE00]each[-] Buff or Debuff applied to [00D5FF]allies[-], the hero's [00D5FF]damage dealt[-] increases by [FFAE00]4%[-], up to [FFAE00]40%[-].\\n\\n[00D5FF]※Divine Lightning: Damage dealt and damage taken accumulate up to [FFAE00]300,000[-].\\nInflicts additional damage equal to [FFAE00]10%[-] of the stored damage when using a skill.\\n[FFAE00]+50%[-] damage dealt to Taunted targets.[-]\\n[00D5FF]※Condensed Lightning: Attack-related stats [FFAE00]+10%[-].\\nInflicts additional damage equal to [FFAE00]10%[-] of the final damage to all enemies when using an Attack Skill.\\n[FFAE00]+50%[-] damage dealt to Taunted targets.\\nApplies Divine Lightning when removed.[-][-]"
   }
  },
  "955985": {
   "name": {
    "it": "Superiorità attributo",
    "en": "Attribute Superiority"
   },
   "text": {
    "it": "Ottiene [00D5FF]Danni attributo[-] quando subisce danni da un [00D5FF]nemico con un vantaggio attributo[-].\\n\\n[00D5FF]※Danni attributo: immune ai danni da tutti gli attributi, tranne quelli in svantaggio.[-]",
    "en": "Gains [00D5FF]Attribute Damage[-] when taking damage from an [00D5FF]enemy with an attribute advantage[-].\\n\\n[00D5FF]※Attribute Damage: Immune to damage from all attributes other than those at a disadvantage.[-]"
   }
  },
  "955986": {
   "name": {
    "it": "Superiorità attributo",
    "en": "Attribute Superiority"
   },
   "text": {
    "it": "Ottiene [00D5FF]Danni attributo[-] quando subisce danni da un [00D5FF]nemico con un vantaggio attributo[-].\\n\\n[00D5FF]※Danni attributo: immune ai danni da tutti gli attributi, tranne quelli in svantaggio.[-]",
    "en": "Gains [00D5FF]Attribute Damage[-] when taking damage from an [00D5FF]enemy with an attribute advantage[-].\\n\\n[00D5FF]※Attribute Damage: Immune to damage from all attributes other than those at a disadvantage.[-]"
   }
  },
  "955987": {
   "name": {
    "it": "Superiorità attributo",
    "en": "Attribute Superiority"
   },
   "text": {
    "it": "Ottiene [00D5FF]Danni attributo[-] quando subisce danni da un [00D5FF]nemico con un vantaggio attributo[-].\\n\\n[00D5FF]※Danni attributo: immune ai danni da tutti gli attributi, tranne quelli in svantaggio.[-]",
    "en": "Gains [00D5FF]Attribute Damage[-] when taking damage from an [00D5FF]enemy with an attribute advantage[-].\\n\\n[00D5FF]※Attribute Damage: Immune to damage from all attributes other than those at a disadvantage.[-]"
   }
  },
  "955988": {
   "name": {
    "it": "Lama della dannazione",
    "en": "Blade of Condemnation"
   },
   "text": {
    "it": "Quando assume un Atteggiamento, se i PS scendono al [FFAE00]50%[-] o meno e sopravvive, rimuove tutti i Debuff da sé, recupera tutti i PS e ottiene [00D5FF]Invincibilità[-] per [FFAE00]1 turno[-].\\n[00D5FF](Limite: [FFAE00]una volta[-])[-]",
    "en": "While assuming a Stance, if HP falls to [FFAE00]50%[-] or below and it survives, removes all debuffs from self, fully recovers HP, and gains [00D5FF]Invincibility[-] for [FFAE00]1 turn[-].\\n[00D5FF](Limit [FFAE00]once[-])[-]"
   }
  },
  "955990": {
   "name": {
    "it": "Autorità della Divinità Suprema",
    "en": "Supreme Deity's Authority"
   },
   "text": {
    "it": "Se [FFAE00]4[-] o più abilità dello stesso tipo vengono usate in un turno, tutti gli alleati [00D5FF]non posso usare quel tipo di abilità[-] per [FFAE00]2 turni[-].",
    "en": "If [FFAE00]4[-] or more of the same skill type is used in one turn, all allies [00D5FF]cannot use that skill type[-] for [FFAE00]2 turns[-]."
   }
  },
  "956001": {
   "name": {
    "it": "Maledizione della stanchezza",
    "en": "Curse of Exhaustion"
   },
   "text": {
    "it": "Riduce tutte le statistiche del [FFAE00]15%[-].",
    "en": "Decreases all stats by [FFAE00]15%[-]."
   }
  },
  "956002": {
   "name": {
    "it": "Maledizione della sete",
    "en": "Curse of Thirst"
   },
   "text": {
    "it": "Riduce tutte le statistiche relative ai PS del [FFAE00]50%[-].",
    "en": "Decreases all HP-related stats other than HP by [FFAE00]50%[-]."
   }
  },
  "956003": {
   "name": {
    "it": "Maledizione dell'isolamento",
    "en": "Curse of Isolation"
   },
   "text": {
    "it": "Limita a [FFAE00]2 sfere[-] la quantità della Barra Mossa finale che può essere riempita in un turno con abilità Uniche, abilità e azioni correlate.",
    "en": "Limits the amount of the Ultimate Move Gauge that can be filled in one turn from Unique abilities, skills, and related actions to [FFAE00]2 orbs[-]."
   }
  },
  "956004": {
   "name": {
    "it": "Maledizione della fine",
    "en": "Curse of the End"
   },
   "text": {
    "it": "Infligge Stordimento per [FFAE00]1 turno[-] all'inizio di ogni Giudizio.",
    "en": "Inflicts Stun for [FFAE00]1 turn[-] at the start of each Judgment."
   }
  },
  "956101": {
   "name": {
    "it": "Segni del giudizio",
    "en": "Signs of Judgment"
   },
   "text": {
    "it": "Applica a tutti gli alleati un effetto che [00D5FF]riduce i danni in base al rango abilità[-] all'inizio della battaglia.\\n\\n[00D5FF]※Riduzione danni in base al rango abilità: riduce i danni subiti da ranghi abilità 1, 2 e 3.[-]",
    "en": "Applies an effect on all allies that [00D5FF]decreases damage based on skill rank[-] at the start of the battle.\\n\\n[00D5FF]※Damage Decrease Based on Skill Rank: Decreases damage taken from Skill Ranks 1, 2, and 3.[-]"
   }
  },
  "956102": {
   "name": {
    "it": "Riduzione danni Mossa finale",
    "en": "Ultimate Move Damage Decrease"
   },
   "text": {
    "it": "Riduce del [FFAE00]100%[-] i danni subiti dall'eroe nelle Mosse finali.",
    "en": "Decreases the hero's damage taken from Ultimate Moves by [FFAE00]100%[-]."
   }
  },
  "956103": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta i [00D5FF]danni inflitti[-] del [FFAE00]50%[-] quando un nemico subisce danni da colpo critico da un attacco.",
    "en": "Increases [00D5FF]damage dealt[-] by [FFAE00]50%[-] when an enemy takes critical strike damage from an attack."
   }
  },
  "956104": {
   "name": {
    "it": "Riduzione Danni subiti",
    "en": "Damage Taken Decrease"
   },
   "text": {
    "it": "Se un colpo critico non si verifica attaccando un nemico, riduce i [00D5FF]danni subiti[-] del [FFAE00]50%[-].",
    "en": "If a critical strike does not occur when attacking an enemy, decreases [00D5FF]damage taken[-] by [FFAE00]50%[-]."
   }
  },
  "956105": {
   "name": {
    "it": "Aumento Statistiche di base",
    "en": "Basic Stat Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]10%[-] le statistiche di base dell'eroe quando muore un alleato o un nemico.\\n[00D5FF](Limite 10 volta/e, si applica all'ingresso nella battaglia.)[-]",
    "en": "Increases the hero's basic stats by [FFAE00]10%[-] when an ally or enemy dies.\\n[00D5FF](Limit 10 time(s), applies when entering battle)[-]"
   }
  },
  "956106": {
   "name": {
    "it": "Riduzione danni",
    "en": "Damage Decrease"
   },
   "text": {
    "it": "Riduce i danni subiti da quest'unità del [FFAE00]5%[-] per [FFAE00]ogni[-] sfera della Barra Mossa finale sul campo di battaglia.",
    "en": "Decreases this unit's damage taken by [FFAE00]5%[-] for [FFAE00]each[-] Ultimate Move Gauge orb on the battlefield."
   }
  },
  "956107": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Ottiene [FFAE00]1[-] [00D5FF]Evasione[-] quando la Barra Mossa finale è completamente piena.",
    "en": "Gains [FFAE00]1[-] [00D5FF]Evade[-] when the Ultimate Move Gauge is completely filled."
   }
  },
  "956108": {
   "name": {
    "it": "Riduzione statistiche",
    "en": "Stat Decrease"
   },
   "text": {
    "it": "Riduce tutte le statistiche tranne le statistiche di base del nemico che ha inflitto danni del [FFAE00]10%[-] per [FFAE00]2 turni[-].\\n[00D5FF](Accumulo: 5 volte)",
    "en": "Decreases all stats other than basic stats of the enemy who dealt damage by [FFAE00]10%[-] for [FFAE00]2 turns[-].\\n[00D5FF](Stacks 5 times)"
   }
  },
  "956111": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "I danni subiti dall'eroe da abilità durante il turno nemico non superano il [FFAE00]30%[-] dei PS massimi.",
    "en": "The hero's damage taken from skills during the enemy turn does not exceed [FFAE00]30%[-] of Max HP."
   }
  },
  "956112": {
   "name": {
    "it": "Riflessione danni",
    "en": "Damage Reflect"
   },
   "text": {
    "it": "Riflette il [FFAE00]50%[-] dei danni subiti da [00D5FF]attacchi contro tutti[-] durante il turno del nemico.",
    "en": "Reflects [FFAE00]50%[-] of damage taken from [00D5FF]all-target attacks[-] during the enemy's turn."
   }
  },
  "956113": {
   "name": {
    "it": "Riflessione danni",
    "en": "Damage Reflect"
   },
   "text": {
    "it": "Riflette il [FFAE00]50%[-] dei danni subiti da [00D5FF]attacchi a bersaglio singolo[-] durante il turno del nemico.",
    "en": "Reflects [FFAE00]50%[-] of damage taken from [00D5FF]single-target attacks[-] during the enemy's turn."
   }
  },
  "956114": {
   "name": {
    "it": "Vita o morte",
    "en": "Life or Death"
   },
   "text": {
    "it": "Aumenta di [FFAE00]30%[-] le statistiche relative alla Difesa dell'eroe per [FFAE00]ogni[-] alleato sopravvissuto. Aumenta di [FFAE00]30%[-] le statistiche relative all'Attacco quando muore un alleato.\\n[00D5FF](Si applica all'ingresso nella battaglia)[-]",
    "en": "Increases the hero's Defense-related stats by [FFAE00]30%[-] for [FFAE00]every[-] surviving ally. Increases Attack-related stats by [FFAE00]30%[-] when an ally dies.\\n[00D5FF](Applies when entering battle)[-]"
   }
  },
  "956115": {
   "name": {
    "it": "Corpo d'acciaio",
    "en": "Steel Body"
   },
   "text": {
    "it": "Quando quest'unità ha [00D5FF]Canzone del giudizio[-], i PS degli alleati non scendono sotto il [FFAE00]50%%[-]. L'effetto viene rimosso quando si subiscono danni dallo stesso nemico [FFAE00]3 volte[-] in 1 turno.",
    "en": "When this unit has [00D5FF]Song of Judgment[-], allies' HP does not fall below [FFAE00]50%%[-]. The effect is removed when taking damage from the same enemy [FFAE00]3 times[-] in 1 turn."
   }
  },
  "956116": {
   "name": {
    "it": "Riduzione danni",
    "en": "Damage Decrease"
   },
   "text": {
    "it": "Riduce i danni subiti da attacco a bersaglio singolo del 50% mentre assume un Atteggiamento.",
    "en": "Decreases single-target attack damage taken by 50% while assuming a Stance."
   }
  },
  "956117": {
   "name": {
    "it": "Traccia della Divinità Suprema",
    "en": "Trace of the Supreme Deity"
   },
   "text": {
    "it": "Quando usa \"Tranquillità posata\", l'effetto Abilità cambia in base al numero di Buff sugli alleati.",
    "en": "When using \"Posed Tranquility,\" the skill effect changes according to the number of Buffs on allies."
   }
  },
  "956151": {
   "name": {
    "it": "Immortalità",
    "en": "Immortality"
   },
   "text": {
    "it": "I PS dell'eroe non scendono sotto [FFAE00]1[-].",
    "en": "The hero's HP does not drop below [FFAE00]1[-]."
   }
  },
  "956153": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Redenzione splendente\" [FFAE00]ogni turno[-].",
    "en": "Uses \"Shining Redemption\" [FFAE00]every turn[-]."
   }
  },
  "956154": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Fortezza divina\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Divine Fortress\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "956155": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Esponi debolezza\" [FFAE00]ogni turno[-].",
    "en": "Uses \"Expose Weakness\" [FFAE00]every turn[-]."
   }
  },
  "956156": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Raffica polverizzante\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Pulverizing Wind\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "956157": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Scudo dell'arca\" [FFAE00]ogni turno[-].",
    "en": "Uses \"Ark Shield\" [FFAE00]every turn[-]."
   }
  },
  "956158": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Luce celestiale\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Heavenly Light\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "956159": {
   "name": {
    "it": "Energia del purgatorio",
    "en": "Purgatory Energy"
   },
   "text": {
    "it": "Usa \"Raggio solare\" [FFAE00]ogni turno[-].",
    "en": "Uses \"Solar Ray\" [FFAE00]every turn[-]."
   }
  },
  "956160": {
   "name": {
    "it": "Aura nefasta",
    "en": "Ominous Aura"
   },
   "text": {
    "it": "Usa \"Combinazione solare\" a ogni [FFAE00]turno pari[-].",
    "en": "Uses \"Sun Combination\" every [FFAE00]even-numbered turn[-]."
   }
  },
  "956161": {
   "name": {
    "it": "Applica Buff",
    "en": "Apply Buff"
   },
   "text": {
    "it": "Aumenta l'Attacco del [FFAE00]50%[-] all'inizio del turno degli alleati.",
    "en": "Increases Attack by [FFAE00]50%[-] at the start of the allies' turn."
   }
  },
  "956162": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta i [00D5FF]danni inflitti[-] alle razze diverse dalle Dee del 100%.",
    "en": "Increases [00D5FF]damage dealt[-] to races except Goddesses by 100%."
   }
  },
  "956163": {
   "name": {
    "it": "Aumento danni inflitti alle Dee",
    "en": "Increased Damage dealt to Goddesses"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] i danni inflitti da alleati a nemici della Dea.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases allies' damage dealt to Goddess enemies by [FFAE00]100%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "956164": {
   "name": {
    "it": "Aumento danni inflitti ai Giganti",
    "en": "Increased Damage dealt to Giants"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] i danni inflitti da alleati a nemici Giganti.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases allies' damage dealt to Giant enemies by [FFAE00]100%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "956165": {
   "name": {
    "it": "Aumento danni inflitti alle Fate",
    "en": "Increased Damage dealt to Fairies"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] i danni inflitti da alleati a nemici Fate.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases allies' damage dealt to Fairy enemies by [FFAE00]100%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "956166": {
   "name": {
    "it": "Aumento danni inflitti a razze sconosciute",
    "en": "Increased Damage Dealt to Unknown Races"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] i danni inflitti da alleati a nemici di razza sconosciuta.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases allies' damage dealt to enemies of Unknown races by [FFAE00]100%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "956168": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico dell'eroe del [FFAE00]10%[-] e il Danno critico del [FFAE00]10%[-] per ogni uso di un'abilità da parte di questo eroe.\\n[00D5FF](Limite: 10 volta/e)[-]",
    "en": "Increases the hero's Crit Chance by [FFAE00]10%[-] and Crit Damage by [FFAE00]10%[-] for each time this hero has used a skill.\\n[00D5FF](Limit 10 time(s))[-]"
   }
  },
  "956169": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico e il Danno critico dell'[FFAE00]1%[-] per ogni [FFAE00]1%[-] di PS ridotti.",
    "en": "Increases Crit Chance and Crit Damage by [FFAE00]1%[-] per [FFAE00]1%[-] of diminished HP."
   }
  },
  "956170": {
   "name": {
    "it": "Aumento Possibilità critico/Danno critico",
    "en": "Crit Chance/Crit Damage Increase"
   },
   "text": {
    "it": "Aumenta la Possibilità critico e il Danno critico dell'[FFAE00]1%[-] per ogni [FFAE00]1%[-] di PS ridotti.",
    "en": "Increases Crit Chance and Crit Damage by [FFAE00]1%[-] per [FFAE00]1%[-] of diminished HP."
   }
  },
  "956171": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Quando subisce danni dallo stesso nemico [FFAE00]2 o più volte[-] in un turno, [00D5FF]blocca tutti i suoi effetti Abilità, inclusi quelli delle Mosse finali,[-] per [FFAE00]2 turni[-].\\n[00D5FF](Abilità Recupero e Atteggiamento escluse)[-]",
    "en": "When taking damage from the same enemy [FFAE00]2 or more times[-] in one turn, it [00D5FF]blocks all of their skill effects including those of Ultimate Moves[-] for [FFAE00]2 turns[-].\\n[00D5FF](Excludes Stance and Recovery Skills)[-]"
   }
  },
  "956172": {
   "name": {
    "it": "Sopprimi Danni subiti",
    "en": "Suppress Damage Taken"
   },
   "text": {
    "it": "Ottiene [00D5FF]Sopprimi Danni subiti pari al [FFAE00]10%[-][-] all'inizio del turno degli alleati. Viene rimosso quando un nemico usa [00D5FF]Stigmate[-].",
    "en": "Gains [00D5FF][FFAE00]10%[-] Suppress Damage Taken[-] at the start of the allies' turn. Removed when an enemy uses [00D5FF]Stigmata[-]."
   }
  },
  "956176": {
   "name": {
    "it": "Miglioramento Attributo",
    "en": "Attribute Enhancement"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] i danni inflitti dall'eroe agli attributi Vantaggio.",
    "en": "Increases the hero's damage dealt to Advantageous Attributes by [FFAE00]50%[-]."
   }
  },
  "956178": {
   "name": {
    "it": "Miglioramento Attributo",
    "en": "Attribute Enhancement"
   },
   "text": {
    "it": "Aumenta del [FFAE00]50%[-] i danni inflitti dall'eroe agli attributi Vantaggio.",
    "en": "Increases the hero's damage dealt to Advantageous Attributes by [FFAE00]50%[-]."
   }
  },
  "956179": {
   "name": {
    "it": "Aumento danni inflitti",
    "en": "Damage Dealt Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]100%[-] i danni inflitti da alleati a nemici Demoni.\\n[00D5FF](Escluse razze aggiuntive applicate con Unico)[-]",
    "en": "Increases allies' damage dealt to Demon enemies by [FFAE00]100%[-].\\n[00D5FF](Excluding additional races applied with Unique)[-]"
   }
  },
  "956180": {
   "name": {
    "it": "Applica Debuff",
    "en": "Apply Debuff"
   },
   "text": {
    "it": "Applica [FFAE00]3[-] effetti [00D5FF]Incendio[-] su tutti i nemici per [FFAE00]3 turni[-] all'inizio del turno degli alleati.",
    "en": "Applies [FFAE00]3[-] [00D5FF]Ignite[-] effects on all enemies for [FFAE00]3 turns[-] at the start of the allies' turn."
   }
  },
  "956181": {
   "name": {
    "it": "Estorsione Attacco",
    "en": "Extort Attack"
   },
   "text": {
    "it": "Riduce del [FFAE00]15%[-] le statistiche relative all'Attacco di tutti i nemici all'inizio del turno degli alleati, se l'Eroe non subisce danni.\\n[00D5FF](Limite 5 volta/e, si resetta quando si subiscono danni)[-]",
    "en": "Decreases all enemies' Attack-related stats by [FFAE00]15%[-] at the start of the allies' turn if the hero doesn't take damage.\\n[00D5FF](Limit 5 time(s), resets upon taking damage)[-]"
   }
  },
  "956183": {
   "name": {
    "it": "Riduzione Barra Mossa finale",
    "en": "Ultimate Move Gauge Decrease"
   },
   "text": {
    "it": "Riduce di [FFAE00]2 sfera/e[-] la barra Mossa finale quando l'eroe entra in battaglia.",
    "en": "Decreases enemies' Ultimate Move Gauges by [FFAE00]2 orb(s)[-] when the hero enters the battle."
   }
  },
  "956184": {
   "name": {
    "it": "Cattura",
    "en": "Capture"
   },
   "text": {
    "it": "Dà la priorità agli attacchi contro nemici che assumono un Atteggiamento Contrattacco.",
    "en": "Prioritizes attacking enemies assuming Counter Stance."
   }
  },
  "956185": {
   "name": {
    "it": "Aumento Attacco",
    "en": "Attack Increase"
   },
   "text": {
    "it": "Aumenta del [FFAE00]5%[-] l'Attacco dell'eroe per [FFAE00]ogni[-] Debuff applicato sui nemici.",
    "en": "Increases the hero's Attack by [FFAE00]5%[-] for [FFAE00]every[-] Debuff applied on enemies."
   }
  },
  "956186": {
   "name": {
    "it": "Atteggiamento deciso",
    "en": "Solid Stance"
   },
   "text": {
    "it": "Riduce i danni subiti del [FFAE00]100%[-] mentre assume un Atteggiamento.\\nQuando l'Atteggiamento viene rimosso, i danni subiti da quest'unità dalle Mosse finali aumentano del [FFAE00]300%[-] per [FFAE00]1 turno[-].",
    "en": "Decreases damage taken by [FFAE00]100%[-] while assuming a Stance.\\nWhen the Stance is removed, this unit's damage taken from Ultimate Moves increases by [FFAE00]300%[-] for [FFAE00]1 turn[-]."
   }
  },
  "956187": {
   "name": {
    "it": "Atteggiamento deciso",
    "en": "Solid Stance"
   },
   "text": {
    "it": "Riduce del [FFAE00]100%[-] i danni subiti dall'eroe quando assume un atteggiamento.",
    "en": "Decreases the hero's damage taken by [FFAE00]100%[-] when assuming a Stance."
   }
  },
  "956188": {
   "name": {
    "it": "Aumento uso abilità",
    "en": "Skill Use Increase"
   },
   "text": {
    "it": "Il numero di utilizzi abilità è fissato a [FFAE00]4[-].",
    "en": "The number of skill uses is fixed to [FFAE00]4[-]."
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
  "1260152": {
   "name": {
    "it": "Cassa Volere primordiale I",
    "en": "Primordial Will Box I"
   },
   "icon": true
  },
  "1260153": {
   "name": {
    "it": "Cassa Volere primordiale II",
    "en": "Primordial Will Box II"
   },
   "icon": true
  },
  "1260154": {
   "name": {
    "it": "Cassa Volere primordiale I",
    "en": "Primordial Will Box I"
   },
   "icon": true
  },
  "1260155": {
   "name": {
    "it": "Cassa Volere primordiale II",
    "en": "Primordial Will Box II"
   },
   "icon": true
  },
  "5301021": {
   "name": {
    "it": "Volere primordiale (Forza)",
    "en": "Primordial Will (Strength)"
   },
   "icon": true
  },
  "5301022": {
   "name": {
    "it": "Volere primordiale (PS)",
    "en": "Primordial Will (HP)"
   },
   "icon": true
  },
  "5301023": {
   "name": {
    "it": "Volere primordiale (Velocità)",
    "en": "Primordial Will (Speed)"
   },
   "icon": true
  },
  "5301024": {
   "name": {
    "it": "Volere primordiale (Luce)",
    "en": "Primordial Will (Light)"
   },
   "icon": true
  },
  "5301025": {
   "name": {
    "it": "Volere primordiale (Oscurità)",
    "en": "Primordial Will (Darkness)"
   },
   "icon": true
  },
  "6010057": {
   "name": {
    "it": "Sariel del [b]Tornado[/b]",
    "en": "Sariel of [b]Tornado[/b]"
   },
   "icon": true
  },
  "6040066": {
   "name": {
    "it": "Altare del Tempio del Cielo",
    "en": "Sky Temple Shrine"
   },
   "icon": true
  }
 }
};
