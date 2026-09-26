# La base dei concetti di Grand Cross

Questa cartella è il riferimento su **cosa sono** le cose di cui parlano i dati
del gioco: le statistiche e i loro gruppi, razze attributi fazioni e rarità, le
carte, le condizioni delle passive, i contenuti, la tassonomia degli effetti.
Ogni contenuto futuro — schede, sinergie, guide — parte da qui invece di
reinventare i nomi.

Il sito **ancora non la legge**. A tenerla allineata ai dati del sito ci sono
due test in `src/lib/games/__tests__/`: `concetti.test.ts` per i dizionari,
`effetti.test.ts` per le righe d'effetto.

## Da dove viene

I file in `concetti/` li scrive `concetti.py`, quelli in `effetti/` li scrive
`righe_carte.py` con le regole di lettura di `letture_carte.py`, tutti nella
pipeline `_7dsgc` (fuori dal repo), leggendo
il client del gioco: enum e forma delle tabelle da `dump.cs`, tabelle e testi
decifrati dai bundle.
**Non si modificano a mano**: si rigenerano.

    python script\concetti.py                    # dentro _7dsgc, dopo contesto_eroi.py
    python script\righe_carte.py                 # dopo concetti.py, di cui legge carte.json
    python script\concetti.py --rileggi-dump     # dopo una patch del client
    python script\righe_carte.py --rileggi-dump  # idem
    python script\righe_carte.py --rapporto      # le misure per esteso

Dal 26/09 gli script della pipeline stanno in `_7dsgc\script\`; la radice di
`_7dsgc` gliela dà `script\percorsi.py`.

Se una prova che si può misurare non torna — un gruppo di statistiche che non
corrisponde più ai costumi, due elenchi della tassonomia che non concordano —
lo script si ferma senza scrivere niente.

## I file

| file | risponde a |
|---|---|
| `statistiche.json` | quali statistiche esistono, come le chiama il gioco, in che gruppo stanno, come le chiamano la scheda degli eroi e gli enum |
| `identita.json` | razze, attributi, fazioni, rarità: codici, nomi, quanti eroi; chi batte chi fra gli attributi e quanto vale (`vantaggi`) |
| `carte.json` | slot delle abilità, tipi di attacco, gittate, bersagli |
| `condizioni.json` | dove si attiva una passiva (codici 1-9) |
| `contenuti.json` | i contenuti che i dati degli eroi nominano |
| `tassonomia.json` | le 319 voci con cui il gioco filtra gli effetti delle abilità, coi tag che le carte citano |

## I file scritti a mano (`manuali/`)

Al contrario di tutto il resto di questa cartella, questi **si scrivono a mano**
e **non si rigenerano** da niente: sono decisioni e fatti che il client non dà.
Fino al 26/09 stavano solo in `_7dsgc\eroi\`, su un disco solo; qui sono
versionati. La pipeline li legge (e in parte li scrive) da qui, col percorso
`A_MANO` di `script\percorsi.py`.

| file | cosa | chi lo scrive | chi lo legge |
|---|---|---|---|
| `accostamenti_manuali.json` | quale illustrazione è la carta A, la B e l'ultimate: le 194 scelte dell'utente fatte con `rivedi_carte.py` fino al 26/09. **Non lo legge più nessuno**: dal 26/09 l'illustrazione di ogni carta la dichiara il client (`DB_skill_card_resource.icon`), e 188 scelte su 194 coincidono. Resta come storico | nessuno (la pagina è in `archivio/script_superati/` della pipeline) | nessuno |
| `etichette_manuali.json` | i nomi dei codici che il client non consegna in nessuna lingua (la fazione 10 è Cross:IF, la 7 Dio) | l'utente; `contesto_eroi.py` semina solo le lacune e non sovrascrive | `contesto_eroi.py`, `concetti.py` |
| `vocabolario_effetti.json` | le 598 voci del vocabolario degli effetti, con l'`asse` da compilare | l'utente; `estrai_effetti.py` aggiunge le voci nuove | `estrai_effetti.py` |
| `uscite_storiche.json` | le date d'uscita dei 373 eroi noti al 16/09, prese una volta dall'archivio di 7dshub | congelato: nessuno lo riscrive | `date_uscita.py` |

Dopo averli cambiati (anche dalla pagina di revisione) vanno committati come
qualunque altro file.

## La forma di una voce

Ogni voce di dizionario ha sempre questi quattro campi, più quelli propri del
dizionario (`gruppo`, `enum`, `uso`…):

```json
{
  "etichetta": { "it": "Perforazione", "en": "Pierce Rate" },
  "etichetta_da": "DB_skill_search_desc_056 e DB_skill_search_desc_045, nome 2 di 4",
  "certezza": "dedotto",
  "prove": ["colonna 2 di 12 in DBCostumeBaseRow, ...", "..."]
}
```

- **`etichetta`** — sempre bilingue. `null` dove il client non consegna una riga
  leggibile in quella lingua: non si traduce e non si indovina.
- **`etichetta_da`** — la riga del client da cui viene il nome, oppure
  `etichette_manuali.json` per le etichette scritte dall'utente. Quando le due
  lingue vengono da righe diverse è un oggetto `{it, en}`.
- **`certezza`**
  - `dichiarato`: il legame lo scrive il gioco (un enum, una colonna, un testo
    con il suo codice)
  - `dedotto`: il legame lo stabilisce `concetti.py`. Allora `prove` non è mai
    vuoto
- **`prove`** — frasi leggibili, con i numeri, per chi deve decidere se fidarsi.

Le chiavi sono i nomi del gioco quando il gioco ne ha uno: le colonne di
`DBCostumeBaseRow` per le statistiche (`fixed_atk_per`), i codici degli enum per
razze, fazioni, tipi di attacco, bersagli. I gruppi di statistiche nel codice
del gioco non hanno un nome, e usano chiavi italiane (`attacco`, `difesa`, `ps`,
`base`, `tutte`).

## Quando una riga del client si legge

La decifratura dei testi fallisce su righe diverse in lingue diverse, e produce
stringhe che sembrano parole («gdote», «URw»). Una riga vale come etichetta solo
se:

- ogni parola di tre lettere o più compare in almeno **due righe diverse** del
  client nella stessa lingua: le parole inventate non si ripetono
- non ha i segni della decifratura sbagliata: simboli (`& ++ * @ ~ = < > { } | $ ^ ; \`),
  quadre sbilanciate, una maiuscola subito dopo una minuscola dentro una parola,
  una lettera sola attaccata con un trattino

Misurato su 551 righe per lingua: scarta tutte le righe marce trovate, e un solo
nome buono, «Fiamme brucianti». Con la soglia a tre righe si perdevano anche
«Snipe», «Shadowflare», «Joker». Gli a capo che il client scrive `\n` diventano
a capo veri.

## Cosa si sa, in breve

**Statistiche.** Le 12 statistiche sono le 12 colonne `float` di
`DBCostumeBaseRow`, e `StatusData.TYPE` le numera con gli stessi nomi (`hp` è
`MAX_HP`). Il nome visibile è **dedotto per posizione**: la tassonomia elenca
«Attack, Pierce Rate, Crit Chance, and Crit Damage» nello stesso ordine delle
colonne `atk, fixed_atk_per, crit_per, crit_atk_per`, e così per Difesa e PS, in
tutte e due le lingue. I gruppi invece sono **dichiarati**: la tassonomia li
nomina e ne elenca i membri. I costumi lo confermano sui dati: 2.833 armi,
3.708 corpi e 3.049 teste portano solo statistiche del proprio gruppo, 0 fuori.
«Basic Stats» sono Attacco, Difesa e PS; «All Stats» i tre gruppi.

La scheda degli eroi (`scheda_client.py`, che scrive le statistiche coi nomi che
usava 7dshub) porta anche campi che non sono statistiche dei costumi (`atkIncPer`,
`atkAdd`, `fPower`…): i valori sono misurati, il significato resta `null`.

**Identità.** I codici vengono dagli enum `TeamUnitData`, i nomi dai testi del
client o da `etichette_manuali.json`. La fazione 10 (Cross:IF) esiste nei dati
ma non nell'enum. `rating` è il **tetto** raggiungibile; la rarità con cui un
eroe esce dal gacha è `startRating`.

**Carte.** `ATTACK_TYPE` ha un nome per i tipi da 1 a 7, dal tutorial di
battaglia e dalla tassonomia; i sei tipi `ability_*` (10-15) sono quelli dei
Talenti, con gli stessi numeri delle icone `ability_icon_10..15`. **`RANGE_TYPE`
non è il numero di bersagli**: le carte `melee` colpiscono un nemico solo nel
72% dei ranghi, le `range` tutti i nemici nel 48%.

**Condizioni e contenuti.** Il legame codice → icona → frase è la tabella
`DB_skill_passive_condition_icon`: dichiarato. Fino al 26/09 era cifrata e il
legame era dedotto dai testi delle passive; la tabella gli dà ragione 9 codici su 9. I contenuti per ora sono i tre
che le condizioni citano: PvP, Scontro finale, Battaglia Bestia demoniaca.

**Tassonomia.** 319 voci. 308 sono le righe di `DB_skill_search_info`, la tabella
dei filtri del gioco, con `tag` (l'id che le carte citano in
`list_array_skill_search_tag`), `gruppo` (Effetti Attacco, Debuff, Buff, Altri) e
`ordine`; le altre 11 hanno solo il testo. 77 sono delle collaborazioni, con un
prefisso nel codice (`ffx_266`): fino al 26/09 si scartavano (trappola 63), e le
regole di lettura delle forme ancora non le guardano, perché molte ripetono il
nome di una voce del gioco e cambierebbero letture già riviste. 15 voci rimandano
a una voce degli altri dizionari (`rimanda_a`).

## Le righe d'effetto delle carte (`effetti/`)

Il gioco tiene le carte in tre tabelle: una riga per rango in `DB_skill_card_base`,
e le righe dei buff e delle opzioni (gli effetti istantanei) in
`DB_skill_card_buff` e `DB_skill_card_option`, che la carta elenca per id. **Dal
26/09 la base le prende dal client** (`tabelle/DB_*.json`, letti da
`leggi_tabelle.py`). Fino ad allora le tabelle erano cifrate e le colonne si
ricavavano dai testi: `atk_per` e `target` dai segnaposto del modello o dalla
lettura della forma, e una riga di buff per segnaposto, con un `valore` che non
era una colonna del gioco.

| file | cosa c'è |
|---|---|
| `carte_base.json` | 4.062 ranghi (A 1.125, B 1.125, ultimate 1.680, coop 132): le colonne della loro riga di `DB_skill_card_base`, e il testo (modello, segnaposto, proposizioni, schema) |
| `buff.json` | le 1.092 righe di `DB_skill_card_buff` che le carte degli eroi usano, e quelle a cui rimandano: una volta per id, con chi le usa |
| `opzioni.json` | le 753 righe di `DB_skill_card_option` che le carte degli eroi usano |
| `carte_buff.json` | per ogni rango i suoi buff: «`<rango>.b<N>`» è l'N-esimo della sua lista (1.728), con quello che il testo della carta ne dice; più le righe «`.p`» degli effetti che dice solo il testo |
| `carte_opzioni.json` | lo stesso per le opzioni (4.686 legami) |
| `forme_carte.json` | 734 forme di proposizione, ognuna scritta una volta; 594 con una lettura delle regole; in coda il glossario italiano di condizioni, precisazioni e termini |
| `segnaposto.json` | i 51 segnaposto dei modelli di testo (`TAG_SKILLEXPLAIN`) e da quale colonna viene il loro valore |
| `conferme_letture.json` | le decisioni dell'utente sulle letture, dalla pagina di revisione: compilato a mano, nessuno script lo sovrascrive |
| `revisione_claude.json` | le letture riviste da Claude coi criteri di quelle che l'utente ha approvato, a parte dalle sue decisioni: le scrive `revisione_claude.py` della pipeline, solo per le forme lette e nominate |

Le righe di tabella stanno una per riga di file: un diff dopo una patch mostra
solo i ranghi cambiati.

### Un rango, i suoi buff e quello che ne dice il testo

La carta B di Derieri al rango 2, «Increases basic stats by 30% for 2 turn(s) and
gains Evasion for 1 turn(s). ※Evasion: …»:

```json
"171012": {"slot": "B", "rango": 2, "eroi": ["1575001"], "range_type": 2, "attack_type": 2, "target": 0,
  "atk_per": 0.0, "atk_per_add": 0.0, "list_array_option_id_list": [],
  "list_array_buff_id_list": [31037, 33057, 35019, 35051], "force_range_type": 0,
  "list_array_skill_search_tag": [], "tassonomia": [],
  "modello": {"esito": "dal client", "chiave": "DB_hero_skill_buff_desc_40202"},
  "segnaposto": {"buff_1_val": "30%", "turn_1_val": "2 turn(s)", "turn_4_val": "1 turn(s)"},
  "proposizioni": [{"forma": "pb9a2f064", "valori": ["30%", "2 turn(s)"]}, ...], "schema": "{1} and {2}.\n\n※Evasion: {3}."}
```

La frase «Increases basic stats by 30%» nel gioco sono **tre righe**: 31037
Aumento Attacco, 33057 Aumento Difesa, 35019 Aumento PS, tutte `effect_value` 30
per 2 turni (`buff.json`). Il modello nomina solo la prima (`{buff_1_val}`), e la
lettura della frase va su `171012.b1`; `.b2` e `.b3` restano senza significato,
perché nessuna frase le dice da sole. L'Evasione è `35051` (`buff_dodge_per`),
detta da `{turn_4_val}`.

### Da dove viene ogni cosa

| cosa | fonte |
|---|---|
| le colonne di un rango (`range_type`, `force_range_type`, `attack_type`, `target`, `atk_per`, `atk_per_add`, le liste di buff, opzioni e tag) | la sua riga di `DB_skill_card_base` |
| `tassonomia` di un rango | i tag di ricerca della carta (`list_array_skill_search_tag`, righe di `DB_skill_search_info`) come codici di `concetti/tassonomia.json`: cosa fa la carta secondo i filtri del gioco |
| `modello` | la chiave che dichiara `skill_explain`: 4.062 ranghi su 4.062, e il suo testo coi valori ridà quello della carta |
| `segnaposto` | i segnaposto del modello col valore che il testo scrive. `{buff_N_val}` è l'N-esimo buff della lista, `{opt_N_val}` l'N-esima opzione: così li riempie il gioco (`UnitSkillCardData.ChangeText`, rifatto in `modelli_client.py`) |
| le righe di `buff.json` e `opzioni.json` | le tabelle, senza effetti visivi e suoni; `name`, `explain`, `effect_name` col testo nelle due lingue invece della chiave |
| `significato` nei legami | le letture delle forme (sotto): cosa ne dice il testo di **quella** carta, nella sua lingua. Sta nel legame e non nella riga del gioco perché la stessa riga è spesso di più carte (un'opzione di 291 ranghi) |
| le righe «`.p`» | un effetto con un numero che il modello scrive a mano: quale riga del gioco sia il testo non lo dice. I numeri vengono dalla lettura (`fonti`: «`lettura:<forma>`»), e `valore` **non è una colonna del gioco** (può essere `buff_per` o `effect_value`) |

**I modelli.** Il client ha 1.337 descrizioni di abilità coi segnaposto
(`Inflicts damage equal to {melee_val} of Attack on {target_val}`), comprese
quelle delle collaborazioni, che hanno un prefisso nella chiave
(`sao_DB_hero_skill_…`). **Le loro chiavi non sono gli id dei ranghi**: il client
salva un testo per ogni testo diverso, e i ranghi che dicono la stessa cosa con
numeri diversi ne usano uno solo. Fino al 26/09 il modello di un rango si
cercava fra tutte le descrizioni (`modelli_abilita.py`): la ricerca non ha mai
sbagliato, ma lasciava senza modello 469 ranghi (445 di collaborazioni, 24 con
due modelli che leggono il testo in modo diverso).

### Proposizioni e forme

Ogni testo si spezza in **proposizioni**: prima in frasi, poi prima di un verbo
d'azione preceduto da virgola, «and» o «then». I verbi non sono scritti a mano:
sono le parole in -s che aprono almeno tre frasi, più le loro forme in -ing (34
oggi, elencati in `forme_carte.json`). Si spezza per proposizione e non per frase
perché la stessa proposizione sta dentro molte frasi composte, e la sua lettura
andrebbe riscritta in ognuna (scelta dell'utente, 15/09).

Una **forma** è la proposizione con tre tipi di slot:

- `<V>` un valore, colorato o no, con la sua unità («30%», «2 turn(s)», «5x»)
- `<T>` un bersaglio, lo span bianco
- `<K>` un termine che la carta stessa definisce in una nota `※`. Gli altri
  termini azzurri restano nella forma: sostituirli tutti fonderebbe «Removes
  Buffs» con «Removes Debuffs»

La carta B di Derieri qui sopra ha tre proposizioni: «Increases basic stats by `<V>` for
`<V>`», «gains `<K>` for `<V>`» (minuscola, dopo «and») e la nota che spiega Evasion.

| | |
|---|---|
| proposizioni | 10.799: 6.890 nel corpo, 3.903 nelle note, 6 nomi di nota con un valore dentro («Lv. 1 Blackout Effect») |
| forme | 739; le prime 300 coprono l'85,3% delle proposizioni, 45 sono usate una volta |
| forme del corpo | 471, e le prime 300 coprono il 94,5% |
| forme delle note | 272, e le prime 200 coprono il 94,7% |
| forme viste in almeno un rango col modello | 498, che coprono 8.577 proposizioni |

L'id di una forma sono i primi 8 caratteri dello SHA-1 del suo testo: la stessa
forma ha lo stesso id a ogni giro, così le conferme della revisione sopravvivono
alle rigenerazioni. `dal_modello` dice, per ogni slot, cosa lo marca nei ranghi
col modello: il segnaposto o «letterale». In 23 forme lo stesso slot è a volte
un segnaposto e a volte scritto a mano, o due segnaposto diversi: sono fra le
`lacune`.

### La lettura delle forme

Una forma dice dove sono i buchi; la **lettura** dice cosa vogliono dire. La scrive
`letture_carte.py` nella pipeline, una volta per forma, e vale per tutti i ranghi
che la usano. L'esempio con cui l'utente ha deciso com'è fatta è l'ultimate di
Gloxinia del Riposo al rango 1 (166921):

> Inflicts Ruin damage equal to 560% of Attack on one enemy, then decreases all
> enemies' basic stats by 5% for 2 turns.
> ※Ruin: Increases damage dealt by 30% per Debuff on the target and removes Debuffs.

| frase coi buchi | dove va | numeri | cosa fa |
|---|---|---|---|
| Inflicts `<K>` damage equal to `<V>` of Attack on `<T>` | la riga della carta | `atk_per` 560, `target` un nemico | danno in base all'Attacco, col termine Ruin |
| decreases all enemies' basic stats by `<V>` for `<V>` | un buff nuovo, `166921.p2` | valore 5, `buff_turn` 2 | riduzione delle statistiche di base, a tutti i nemici |
| Increases damage dealt by `<V>` per Debuff on the target | l'opzione del modello, `166921.o1` | valore 30 | danni inflitti in più per ogni Debuff sul bersaglio |
| removes Debuffs | nessuna riga | — | rimozione dei Debuff, solo nella lettura |

Decisioni dell'utente (15/09):
- la lettura porta i numeri nelle colonne **e** il significato: «cosa fa» e «a chi»
- il nome dell'effetto nell'enum del client (`effect_keyword`) non si sceglie: si
  elencano i `candidati`. 101 nomi di buff hanno varianti per singolo eroe, 312 in
  tutto, e «Attack-related stats increase» da solo ne ha 29
- un effetto senza numeri non crea una riga: il gioco può tenere due frasi in una
  riga sola (per Ruin l'enum ha `skill_after_dispell_debuff_dmg_add_per`, danni per
  Debuff e poi rimozione), e contare le righe dal testo sarebbe un'affermazione non
  letta

**Com'è fatta.** `lettura.effetti` ha una voce per ogni cosa detta:

| campo | |
|---|---|
| `tabella` | `base`, `buff` o `opzione`; manca dove l'effetto non ha numeri e la frase non dice la tabella: una `definizione`, «Decreases skill ranks» |
| `colonne` | colonna → numero del buco, contato come in `dal_modello` fra tutti i `<V>`, `<T>`, `<K>` |
| `bersaglio`, `termine` | il buco che va nella colonna `target` della carta; il buco del termine spiegato in nota |
| `effetto` | `danno`, `cura`, `statistiche`, `rimozione`, `disabilita`, `barra`, `termine`, `danni_inflitti`, `danno_nel_tempo`, `definizione`, `voce` (l'effetto è una voce della tassonomia detta per nome: «Grants Debuff Immunity» è Immunity), `precisazione` (una frase fra parentesi che precisa la frase prima: «(Limit 3)»), `ignora` (ignora una parte delle statistiche del nemico: «Ignores 50% of the enemy's Crit Defense»), `atteggiamento` («Assumes a Stance for 2 turns») |
| `cosa`, `verso` | cosa si rimuove o si disabilita; `aumento` o `riduzione` |
| `statistiche`, `in_base_a` | percorsi in `concetti/statistiche.json`: `statistiche.atk`, `gruppi.base` |
| `a_chi` | un bersaglio di `concetti/carte.json` (`global_enemy`), `self`, o `bersaglio` per il bersaglio della carta |
| `tassonomia` | le voci di `concetti/tassonomia.json` col nome giusto: «Attack-related Stats Increase» è la 056, «Buff Cancel» la 027 |
| `condizione` | il pezzo di frase che dice quando («per Debuff on the target»), in inglese; nelle righe di buff e opzioni diventa `{it, en}` (vedi «L'italiano delle condizioni e delle precisazioni») |
| `nome` | il nome di un effetto scritto nel testo che la carta non spiega in nota e la tassonomia non ha: «Applies Dragon Rage on the hero» |
| `precisa`, `numero` | in una `precisazione`: `limite`, `cumulabile`, `esclude` o `include`, e il buco del numero, che non va in una colonna («(Limit `<V>`)»). `numero` sta anche in una `rimozione`, per dire quanti effetti toglie («Removes `<V>` Buff effect from the target»: nota dell'utente, 16/09) |
| `candidati` | i nomi dell'enum con la statistica subito seguita dal verso (`buff_atk_all_inc_add_per_gowther`); solo dove la statistica ha il suo pezzo di nome, o per le rimozioni di Buff e Debuff |

Accanto a `effetti` stanno `regole`, `certezza` e `prove`: le regole, come il
modello marca i buchi che la lettura mette in colonna, e chi l'ha rivista. La
`certezza` è `dedotto` per la lettura delle regole, `rivisto` se l'ha rivista
Claude coi criteri dell'utente, `verificato` se l'ha decisa l'utente (vedi «La
revisione delle letture»).

**Le regole** sono poche e strette: una forma che nessuna sequenza di regole prende
per intero resta senza lettura, invece di averne una approssimata. Una forma che
dice più cose unite da «, then» o «and» si legge pezzo per pezzo, e ogni pezzo deve
essere preso da una regola. Proposizioni per regola (una forma composta conta per
ognuna delle sue):

| regola | proposizioni |
|---|---|
| danno | 3.509 |
| nota_statistica («5x Pierce Rate Increase») | 1.038 |
| nota_danno («3x damage against Debuffed enemies») | 910 |
| definizione_nota («※Charge: Ignores Defense» è la voce Charge) | 836 |
| statistiche | 786 |
| rimozione | 501 |
| termine («Makes target(s) `<K>` for `<V>`») | 432 |
| barra | 252 |
| definizione (la frase è la descrizione di una voce della tassonomia) | 247 |
| nota_statistica_condizione («Attack `<V>` when using the skill») | 198 |
| termine_contato («Applies `<V>` `<K>` effects for `<V>`») | 176 |
| disabilita | 168 |
| nota_danno_in_base («Additional damage equal to `<V>` of (Crit Damage - `<V>`)») | 168 |
| voce_applicata («Applies Mark of Craving on `<T>` for `<V>`») | 139 |
| nota_danno_nel_tempo | 136 |
| nota_statistica_buff («※Burn: Damage taken +`<V>`») | 105 |
| precisazione («(Limit `<V>`)», «(Excludes Stance and Recovery Skills)») | 103 |
| termine_nominato («Applies Dragon Rage on the hero for `<V>`») | 98 |
| atteggiamento («Assumes a Stance for `<V>`») | 88 |
| le altre 38 | 1.025 |

Forme lette: 597 su 739. Proposizioni lette: 10.201 su 10.799 (94%). Nel corpo sono
6.516 su 6.890 (95%), nelle note 3.685 su 3.903 (94%).

**Il terzo giro (15/09 notte).** Dopo 69 decisioni, 68 «Giusta», l'utente ha chiesto di
leggere le frasi rimaste con la stessa logica. Le regole nuove seguono le letture approvate:
- una nota con un numero e una condizione («Attack +20% when using the skill») è
  un'opzione, come i danni delle note; senza condizione («※Burn: Damage taken +10%») è la
  statistica del buff che la nota spiega. I modelli marcano `{opt_1_val}` le prime e
  `{buff_1_val}` le seconde
- `ignora` legge «Ignores `<V>` of the enemy's Crit Defense» (un'opzione); `atteggiamento`
  legge «Assumes a Stance for `<V>`», e quello che l'Atteggiamento fa dopo «which» lo leggono
  le altre regole; `nome` tiene il nome di un effetto che il testo nomina e nessuno spiega
- il danno di un contrattacco («via counter») resta senza colonna: il modello lo marca
  `{melee_val}` in una forma e `{buff_N_val}` nelle altre
- una definizione per descrizione aggiunge le voci che il nome della nota rivela: «Ignores
  Resistance» è Shatter, ma in 9 carte sta sotto «※Impact:» (l'utente l'aveva segnata
  sbagliata quando nominava Shatter soltanto)

**Le regole del 15/09 notte.** Il primo giro leggeva 263 forme. Le regole aggiunte
dopo stanno in coda alle altre, così una forma già letta si legge come prima: le 263
letture di prima, confrontate una per una, non sono cambiate. Sono di tre tipi:
- varianti delle famiglie di prima: «Inflicting `<V>` of Attack», «Decreases damage
  taken by `<V>` when attacked for `<V>`», due statistiche con gli stessi turni, lo
  svuotamento della barra alla fine del turno nemico (un buff e non un'opzione: il
  modello lo marca `{buff_N_val}`)
- un effetto nuovo, `voce`, per quello che nessun altro effetto dice: la frase nomina
  una voce della tassonomia («Applies Mark of Craving», «Taunts enemies», «Grants
  Debuff Immunity», «Creates a barrier») o ne ripete una frase della descrizione
  («allows only single target skills to be used» è la 146)
- le note senza numeri, che si agganciano alla voce col nome della nota:
  «※Charge: Ignores Defense» è la 005, anche se la tassonomia la descrive «Ignore
  Defense.». Vale solo se tutte le note in cui la frase compare hanno il nome di una
  voce, e la frase non sta mai nel corpo. «Incapacitates target» sta sotto Freeze e
  Petrify, e la lettura nomina tutte e due

Quello che di proposito non si legge: il numero degli effetti applicati («Applies 2
Ignite effects»), perché i modelli lo scrivono sempre a mano e `{number_N_val}` il
client lo usa una volta sola, per le attivazioni di una postura; e il valore di una
barriera in base all'Attacco, che il modello marca `{buff_1_val}` in 9 ranghi e
`{melee_val}` in 6.

**Le precisazioni.** Una frase fra parentesi precisa la frase prima (scelta
dell'utente, 15/09 notte): «(Limit `<V>`)», «(Limit once)», «(Stacks up to `<V>`)»,
«(Can be stacked)», «(Excludes Stance and Recovery Skills)», «(Excludes Rupture)»,
«(Includes Ultimate Moves)». La lettura dice come precisa (`precisa`) e quale buco è
il numero (`numero`, che non va in una colonna perché i modelli lo scrivono sempre a
mano). Nelle carte la parentesi sta sempre dopo il punto della frase che precisa, a
capo o dopo uno spazio: quelle di cui non si sa dire cosa precisano («(Only the
effects applied by the hero are counted)») restano senza lettura.

**Le righe.** La lettura riempie solo quello che il modello non dice:
- nella riga della carta, `atk_per` e `target` vengono solo dal corpo, e solo se le
  letture del rango dicono un valore solo: `atk_per` a 434 ranghi, 431 dei quali
  senza modello o in conflitto; `target` a 30
- un effetto con un numero va nella riga del modello se il modello marca uno dei
  suoi buchi (`BUFF_N`, `TURN_N`, `OPTION_N`), come `166921.o1`. Altrimenti nasce
  una riga `<rango>.p<proposizione>` (con `e<n>` se la proposizione ne dice più
  d'una), perché il posto nella lista dei buff il testo non lo dice. Un buco
  marcato dal modello non si riscrive: «-{opt_1_val}» (Wave, 199691) ha 20 nella
  colonna e -20% nel testo
- `significato` è una lista. La nota che spiega un termine si unisce alla voce del
  termine, ed è successo 160 volte: «Poisons ... for 3 turn(s)» e «※Poison: Additional damage
  equal to 60% ...» sono lo stesso buff `110831.b1`. Una nota si unisce anche a una
  voce del gioco nominata nel corpo, ma solo se la nota ne porta il nome: «Explodes
  after 2 turn(s)» e «※Explosion: Additional damage equal to 100% ...» sono la voce
  055 Explosion su `117071.b1` (scelta dell'utente, 15/09 notte; 12 righe). Le righe
  che restano con più voci sono 35: sono righe del modello a cui due frasi portano un
  numero, cioè il modello mette due frasi sullo stesso segnaposto. `128041.b1`
  («Decreases Defense-related stats of {target_val} by {buff_1_val} and Disables Attack
  Skills for {turn_1_val}»), `151031.b1` (provoca per {turn_1_val} e cura il turno dopo
  di {buff_1_val}), le due note di Immolation su `1000791.o1`
- una precisazione fra parentesi va sull'ultima voce che la frase prima ha scritto in
  una riga, se fra le due ci sono solo punteggiatura e spazi: la voce prende
  `precisazioni` (`precisa`, `cosa`, `tassonomia`, `condizione`, `testo`, `valore`,
  `forme`). «(Limit 7 times)» sta su `1001711.o1`. Unite 48; 55 restano solo nella
  lettura, perché la frase prima non ha una riga (un danno della carta, un effetto
  senza numeri)
- 32 effetti hanno i buchi su due righe diverse del modello, e non si scrivono

Il primo giro si è fermato su 298 contraddizioni. Nessuna era una lettura
sbagliata. Erano tre casi: i termini con la loro nota; i buff composti; e una regola
che divideva «Disables Buff and Debuff Skills» in due buff con gli stessi turni,
mentre il modello ne marca uno solo.

### La revisione delle letture

Le letture si decidono una forma alla volta nella pagina locale
`rivedi_letture.py` della pipeline (http://127.0.0.1:8766), dalla più usata. Per
ogni forma la pagina mostra:
- la frase coi buchi numerati;
- fino a tre carte diverse dove compare, col testo italiano del client e
  l'inglese con la frase evidenziata;
- come il modello del gioco marca ogni buco, e i valori che ogni buco prende in
  tutte le carte;
- cosa ne ricava la base, come righe dei fogli.

Decisioni dell'utente (15/09):
- su una frase si può dire «Giusta», «Sbagliata» con una nota, oppure correggerla
  nella pagina: foglio, cosa fa, verso, a chi, statistiche, voci del gioco, e
  quale buco è quanto, turni, danno o bersaglio
- una frase sbagliata la base la **mette da parte**: niente lettura, e i suoi
  numeri escono dai fogli
- se dopo una decisione le regole dicono altro, la frase torna da rivedere

Le decisioni stanno in `effetti/conferme_letture.json`. È un file compilato a
mano: lo scrive la pagina, nessuno script lo sovrascrive, e `righe_carte.py` lo
legge a ogni giro. Per ogni forma ci sono `esito`, `lettura_vista` (la lettura
delle regole quando si è deciso, senza candidati), `lettura` se corretta, `nota`
e `quando`.

| esito | la base usa | certezza | stato in `revisione` |
|---|---|---|---|
| nessuno | la lettura delle regole | `dedotto` | — (da rivedere) |
| giusta | la lettura delle regole | `verificato` | confermata |
| sbagliata | niente: `lettura` è null, e quella delle regole resta in `lettura_delle_regole` | — | sbagliata |
| corretta | la lettura scritta nella pagina, con `regole: ["a mano"]` | `verificato` | corretta |
| qualunque, ma le regole ora dicono altro | le regole, o la correzione se c'è | `dedotto` o `verificato` | cambiata dopo la revisione |

Una correzione passa gli stessi controlli delle regole (`Letture.controlla` in
`letture_carte.py`). Se mette un turno su un termine, o in un buff un numero che il
gioco marca `{melee_val}`, la pagina non la salva e `righe_carte.py` si ferma.

**Le revisioni di Claude** (15/09 notte). Con 67 letture approvate e 528 da
rivedere, l'utente ha chiesto a Claude di rivedere le altre coi criteri di quelle
approvate. Le revisioni stanno a parte, in `effetti/revisione_claude.json`: in
testa i criteri usati, e per ogni forma `esito` (`giusta` o `dubbia`),
`lettura_vista`, `nota` e `quando`. Le scrive `revisione_claude.py` della
pipeline, solo per le forme nominate: prima la rassegna delle schede, poi gli id
letti. Claude non dice «sbagliata»: una lettura sbagliata si toglie cambiando le
regole.

| revisione di Claude | la base usa | certezza | stato in `revisione` |
|---|---|---|---|
| giusta | la lettura delle regole | `rivisto` | rivista da Claude, con `da: "claude"` |
| dubbia | la lettura delle regole | `dedotto` | dubbia per Claude, col dubbio in `nota` |
| qualunque, ma le regole ora dicono altro | le regole | `dedotto` | — (da rivedere) |

Una decisione dell'utente sulla lettura di oggi vale sempre di più, e una sua
correzione non la scavalca niente. Se l'utente aveva deciso su una lettura che le
regole non danno più, vale la revisione di Claude di quella nuova, e l'esito
dell'utente resta in `decisione_superata`. Per togliere tutte le revisioni di
Claude basta cancellare il file. La pagina le mostra coi filtri «Riviste da
Claude» e «Dubbi di Claude», e l'utente può decidere anche lì. «Campione da controllare»
mette in fila la frase più usata di ogni famiglia di regole di cui l'utente non ha
approvato nessuna lettura.

Al 16/09 le regole leggono 597 frasi: 100 le ha confermate l'utente, 497 le ha rivedute
Claude, tutte giuste, 11 con una nota. L'utente ha controllato il campione: la frase più
usata di ognuna delle 34 famiglie di regole che non avevano un suo esempio approvato,
tutte giuste. Quattro sue note chiedevano di dire meglio cosa fa la frase, e sono fatte:
- «Removes 1 Buff effect from the target» dice quanti Buff rimuove (`numero`)
- i termini sono in italiano come li dice la frase («Taunts» → «Provoca», «Death» →
  «Morte»)
- nella pagina il nome di una voce del gioco ha accanto cosa dice («Immunità (immune ai
  Debuff)») Le misure in
`forme_carte.json` lo dicono a ogni giro. Le 142 frasi senza lettura si possono
scrivere a mano nella pagina. Da sapere mentre si rivede: lo stesso buco può valere «2x» in una carta
e «-100%» in un'altra («`<V>` Crit Chance»), e allora la frase da sola non dice il
verso.

### L'italiano delle condizioni e delle precisazioni

Le letture sono in inglese, come le frasi da cui vengono. Condizioni e precisazioni hanno
anche l'italiano del gioco (scelte dell'utente, 15/09 notte).

**Da dove viene.** Dal testo italiano di ogni rango, dalla scheda italiana del client
(`scheda_client.py`: il modello italiano riempito coi valori delle tabelle, come fa il
gioco). C'è per tutti i 4.062 ranghi. Fino al 25/09 veniva da 7dshub in italiano.

**Come si ritaglia** (`italiano_carte.py`), carta per carta:
- si prendono la frase inglese e la frase italiana nello stesso posto del testo (righe,
  nome della nota, frasi): le due lingue devono avere gli stessi pezzi
- la condizione italiana comincia dove comincia la traduzione della prima parola inglese
  («against» → «contro», «ai»…)
- finisce dove finisce la frase, oppure prima di «per 2 turni», di un numero finale, di una
  «e» che in inglese è «and»
- non si porta dietro un pezzo che in inglese sta prima della condizione
- i numeri diventano `<V>`, come i buchi della forma inglese
- quello che non torna resta vuoto

**Una carta, il suo italiano.** Il gioco traduce la stessa condizione in modi diversi:
«against Debuffed enemies» è «ai nemici con Debuff» in 115 ranghi e «contro nemici con
Debuff» in 32. Per questo:
- nelle righe di buff e opzioni `condizione` è `{it, en}` con l'italiano della **sua** carta,
  e `condizione_da` vale «testo della carta». Se la carta non si ritaglia, l'italiano è il
  nome della condizione, e `condizione_da` vale «altre carte»
- in coda a `forme_carte.json`, `condizioni` è il glossario. Per ogni condizione inglese:
  il nome italiano (la variante più usata), le varianti con i loro usi, gli usi e quanti si
  sono ritagliati. `precisazioni` fa lo stesso per le frasi fra parentesi («(Limit `<V>`)» →
  «(Limite: `<V>`)»)
- una precisazione unita alla sua riga ha `frase` `{it, en}` e `frase_da`
- un termine spiegato in nota («Taunts», «Death») ha `termine` `{it, en}` e `termine_da`.
  L'italiano è quello della frase, «Provoca i nemici» (scelta dell'utente, 16/09: il verbo,
  non «Provocazione»). Si cerca vicino al nome italiano della nota che lo spiega, perché le
  teste delle note si allineano (※Taunt ↔ ※Provocazione). Fra più parole possibili vince
  quella nello stesso punto della frase. Se nessuna frase lo dice, l'italiano è il nome
  della nota, con `termine_da` «nome della nota». Il glossario `termini` ha anche
  `nomi_delle_note`

**I numeri.**

| | usi | ritagliati | nelle righe: dalla carta | dalle altre carte | senza italiano |
|---|---|---|---|---|---|
| condizioni | 1.829 | 1.643 | 1.559 | 28 | 114 |
| precisazioni | 103 | 100 | 48 | 0 | 0 |
| termini | 2.752 | 2.640 | 543 | 67, più 3 dal nome della nota | 12 |

I motivi dei ritagli mancati sono in `misure.letture.italiano`. La cura «by `<V>` of damage
dealt» era l'unica condizione scritta in italiano («in proporzione al danno inflitto») in un
campo inglese. Ora è l'inglese della frase, «of damage dealt», e le 7 forme che la usano
sono state rivedute.

### Le prove che fermano lo script

- forme e valori rifanno il testo senza colori di ogni rango, identico
- il modello che il rango dichiara (`skill_explain`), coi valori letti, rifà il testo
  del gioco, colori compresi: per tutti i ranghi
- `{target_val}` è il `target` della riga del rango, `{melee_val}` il suo `atk_per`
  arrotondato per eccesso, e ogni `{buff_N_*}`, `{turn_N_val}`, `{opt_N_val}` cade
  dentro la lista della carta
- nei modelli nessuno span bianco del corpo è scritto a mano
- la gittata e il tipo del database degli eroi sono quelli della tabella, e ogni tag
  di ricerca di una carta ha la sua voce nella tassonomia
- ogni buff e opzione che le carte usano, e ogni buff a cui rimandano, è nelle tabelle
- lo stesso rango ha lo stesso testo in ogni eroe che lo usa
- un buco che una lettura mette in una colonna, nei ranghi col modello, è marcato col
  segnaposto di quella colonna o scritto a mano; una riga «`.p`» non riceve due valori
  diversi. Le contraddizioni si raccolgono tutte in `eroi/righe_carte_contraddizioni.txt`
  e fermano il giro alla fine

## Lacune dichiarate

Il **triangolo degli attributi** non è più una lacuna dal 27/09: chi batte chi l'ha letto nel
codice del combattimento lo studio delle meccaniche (`MECCANICHE_COMBATTIMENTO.md` nella
pipeline), e `identita.json` lo scrive in `vantaggi` con le prove. Forza batte PS, PS batte
Velocità, Velocità batte Forza; Luce e Oscurità sono fuori dal triangolo e danno un effetto
di squadra. Il vantaggio (0,3, fra gli aumenti del danno) e lo svantaggio (0,2, fra le
riduzioni) si sommano agli altri aumenti e riduzioni, non si moltiplicano. I 1,25 e 0,8 di `src/lib/games/grand-cross/data.ts`
restano segnaposto del vecchio calcolatore.

Ogni file ha la sua lista `lacune`. Le più importanti:

- i nomi di gittate e bersagli: nessun testo del client li nomina come categoria
- **quale riga del gioco è un effetto «`.p`»**: il modello ne scrive i numeri a mano, e il
  testo non dice quale buff o opzione della carta sia (2.876 righe «`.p`»)
- **140 forme senza lettura**: frasi condizionali lunghe che nessuna regola prende per
  intero («If the hero is participating in battle and…»), trasformazioni, note di termini
  che la tassonomia non ha, parentesi di cui non si sa dire cosa precisano
- **21 chiavi del client che nessun rango dichiara** (Lancelot, Percival, Camila,
  Estarossa furioso…), elencate in `carte_base.json`

## Le tappe successive

- **B.** righe d'effetto con lo schema delle tabelle del gioco. **Carte: fatto**, dal
  26/09 con le righe vere delle tabelle, e con la lettura delle forme (594 forme, il 94,5%
  delle proposizioni) per quello che il testo dice. Poi reliquie e passive
  (`DB_skill_passive`), che ora si leggono dalla tabella: bersagli, razze,
  caratteristiche e attributi richiesti sono colonne
- **C.** pagina di revisione delle letture, divisa per forma di frase, con le
  conferme in un file scritto a mano: **fatta** (`rivedi_letture.py`, sopra «La
  revisione delle letture»); le decisioni spettano all'utente
- **D.** un SQLite generato da questi JSON per interrogarli, e questo manuale
  completato
