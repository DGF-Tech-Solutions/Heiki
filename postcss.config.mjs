/*
 * postcss-pxtorem (24/10): ogni misura in px del CSS (le utility di Tailwind
 * come `text-[12px]` e le regole di globals.css) esce in rem, cosi' tutta
 * l'interfaccia segue la dimensione di base che `html` calcola dallo schermo
 * (globals.css, «La misura dell'interfaccia»). Nel codice si continua a
 * scrivere in px: la conversione la fa la build, anche per quello che si
 * scrivera' domani.
 *
 * Restano in px i valori sotto i 3px (bordi, fili, contorni del fuoco, che
 * devono restare sottili) e le condizioni delle media query (le soglie sono
 * dello schermo, non del contenuto). Per questo i punti dei retini in
 * globals.css sono scritti in rem: con la trama in rem e i punti in px la
 * trama si sarebbe diradata. La versione 6.1 non conosce commenti per saltare
 * una riga, e non legge dentro `var(...)`.
 * Fuori dal CSS non arriva: le misure scritte nel JavaScript (stili in linea,
 * icone) passano da `rem()` di src/lib/rem.ts.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-pxtorem": {
      rootValue: 16,
      unitPrecision: 5,
      propList: ["*"],
      minPixelValue: 3,
      mediaQuery: false,
    },
  },
};

export default config;
