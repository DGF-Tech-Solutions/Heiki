# La base dei concetti di Grand Cross

Questa cartella è il riferimento su **cosa sono** le cose di cui parlano i dati
del gioco: le statistiche e i loro gruppi, razze attributi fazioni e rarità, le
carte, le condizioni delle passive, i contenuti, la tassonomia degli effetti.
Ogni contenuto futuro — schede, sinergie, guide — parte da qui invece di
reinventare i nomi.

Il sito **ancora non la legge**. A tenerla allineata ai dati del sito c'è un
test: `src/lib/games/__tests__/concetti.test.ts`.

## Da dove viene

I file in `concetti/` li scrive `concetti.py`, nella pipeline `_7dsgc` (fuori dal
repo), leggendo il client del gioco (enum e tabelle da `dump.cs`, testi
decifrati) e 7dshub. **Non si modificano a mano**: si rigenerano.

    python concetti.py                 # dentro _7dsgc, dopo contesto_eroi.py
    python concetti.py --rileggi-dump  # dopo una patch del client

Se una prova che si può misurare non torna — un gruppo di statistiche che non
corrisponde più ai costumi, due elenchi della tassonomia che non concordano —
lo script si ferma senza scrivere niente.

## I file

| file | risponde a |
|---|---|
| `statistiche.json` | quali statistiche esistono, come le chiama il gioco, in che gruppo stanno, come le chiamano 7dshub e gli enum |
| `identita.json` | razze, attributi, fazioni, rarità: codici, nomi, quanti eroi |
| `carte.json` | slot delle abilità, tipi di attacco, gittate, bersagli |
| `condizioni.json` | dove si attiva una passiva (codici 1-9) |
| `contenuti.json` | i contenuti che i dati degli eroi nominano |
| `tassonomia.json` | le 238 voci con cui il gioco filtra gli effetti delle abilità |

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

7dshub porta anche campi che il client non nomina (`atkIncPer`, `atkAdd`,
`fPower`…): i valori sono misurati, il significato resta `null`.

**Identità.** I codici vengono dagli enum `TeamUnitData`, i nomi dai testi del
client o da `etichette_manuali.json`. La fazione 10 (Cross:IF) esiste nei dati
ma non nell'enum. `rating` è il **tetto** raggiungibile; la rarità con cui un
eroe esce dal gacha è `startRating`.

**Carte.** `ATTACK_TYPE` ha un nome per i tipi da 1 a 7, dal tutorial di
battaglia e dalla tassonomia; i sei tipi `ability_*` (10-15) sono quelli dei
Talenti, con gli stessi numeri delle icone `ability_icon_10..15`. **`RANGE_TYPE`
non è il numero di bersagli**: le carte `melee` colpiscono un nemico solo nel
72% dei ranghi, le `range` tutti i nemici nel 48%.

**Condizioni e contenuti.** Il legame codice → icona sta in una tabella cifrata:
è dedotto, con le prove dai testi delle passive. I contenuti per ora sono i tre
che le condizioni citano: PvP, Scontro finale, Battaglia Bestia demoniaca.

**Tassonomia.** 238 voci: nomi leggibili 175 in italiano e 158 in inglese,
descrizioni 234 in tutte e due le lingue. 15 voci rimandano a una voce degli
altri dizionari (`rimanda_a`).

## Lacune dichiarate

Ogni file ha la sua lista `lacune`. Le più importanti:

- il **triangolo dei vantaggi** fra attributi non è nei testi del client: i 1,25
  e 0,8 di `src/lib/games/grand-cross/data.ts` sono segnaposto
- a quale gruppo di ricerca appartenga ogni voce della tassonomia: la tabella è
  cifrata
- i nomi di gittate e bersagli: nessun testo del client li nomina come categoria

## Le tappe successive

- **B.** righe d'effetto con lo schema delle tabelle del gioco
  (`DBSkillPassiveRow`, `DBSkillCardBuffRow`, `DBSkillCardOptionRow`), lette dai
  testi, con un controllo che rigenera il testo dal modello
- **C.** pagina di revisione delle letture ambigue, divisa per forma di frase,
  con le conferme in un file scritto a mano
- **D.** un SQLite generato da questi JSON per interrogarli, e questo manuale
  completato
