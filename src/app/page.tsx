import Link from "next/link";
import { DistributionChart } from "@/components/distribution-chart";
import { listGameModules, simulate } from "@/lib/games/registry";
import type { GameModule } from "@/lib/games/types";
import type { SimulationResult } from "@/lib/engine";

/**
 * La home esegue una simulazione vera durante il render.
 *
 * Non e' una demo finta: e' lo stesso motore che usera' il calcolatore, con lo
 * stesso seed e lo stesso dataset. Essendo fatto di funzioni pure gira identico
 * qui sul server e nel browser, ed e' il motivo per cui questa pagina resta
 * completamente statica.
 */
export default function Home() {
  const modules = listGameModules();
  const featured = modules[0];
  const showcase = featured ? runDemo(featured) : null;

  return (
    <main>
      <section className="shell hero">
        <div>
          <p className="eyebrow">
            {featured ? `Motore di calcolo · ${featured.name}` : "Motore di calcolo"}
          </p>
          <h1 className="display hero__title">
            Una build non e&apos; un numero.
            <br />
            E&apos; una <em>distribuzione</em>.
          </h1>
          <p className="lede" style={{ marginTop: 22 }}>
            GachaZone simula la tua squadra migliaia di volte e non ti dice solo quanto danno fai,
            ma quanto spesso lo fai. Percentili, turni per uccidere, probabilita&apos; di chiudere
            il piano.
          </p>

          <div className="hero__actions">
            <Link href="/registrati" className="btn btn--primary">
              Crea il profilo
            </Link>
            <Link href="/entra" className="btn">
              Entra
            </Link>
          </div>

          <p className="hero__note">
            Stesso seed, stesso dataset, stessi numeri. Un risultato che condividi mostra a
            chiunque esattamente cio&apos; che hai visto tu.
          </p>
        </div>

        {showcase && featured ? (
          <DistributionChart
            histogram={showcase.damageHistogram}
            stats={showcase.damage}
            title="Danno totale su 2.000 simulazioni"
            caption={`seed ${showcase.seed}`}
          />
        ) : null}
      </section>

      <section className="shell section" id="moduli">
        <div className="section__head">
          <h2 className="section__title">Moduli registrati</h2>
          <span className="eyebrow">{modules.length} di 5 previsti</span>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="shell section" id="motore">
        <div className="section__head">
          <h2 className="section__title">Come e&apos; costruito</h2>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <article className="card">
            <h3 className="card__title">Il risultato e&apos; sempre una distribuzione</h3>
            <p className="lede" style={{ marginTop: 10, fontSize: 14 }}>
              I giochi a turni deterministici e quelli a carte casuali passano dallo stesso
              contratto. Chi legge il risultato non deve sapere quale dei due sta guardando.
            </p>
          </article>
          <article className="card">
            <h3 className="card__title">Il calcolo gira nel tuo browser</h3>
            <p className="lede" style={{ marginTop: 10, fontSize: 14 }}>
              Nessuna chiamata al server mentre muovi uno slider: i numeri si aggiornano subito, e
              il costo di calcolo non cresce con il numero di utenti.
            </p>
          </article>
          <article className="card">
            <h3 className="card__title">Le patch non riscrivono il passato</h3>
            <p className="lede" style={{ marginTop: 10, fontSize: 14 }}>
              Ogni build resta legata alla versione di dati con cui e&apos; stata calcolata. Quando
              esce una patch te lo diciamo, non cambiamo i tuoi numeri di nascosto.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

function ModuleCard({ module }: { module: GameModule }) {
  const result = runDemo(module);
  const unit = module.timeUnit === "turns" ? "turni" : "s";

  return (
    <article className="card">
      <div className="card__head">
        <h3 className="card__title">{module.name}</h3>
        <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="tag">{module.publisher}</span>
          <span className={module.paradigm === "stochastic" ? "tag tag--violet" : "tag tag--gold"}>
            {module.paradigm === "stochastic" ? "Monte Carlo" : "deterministico"}
          </span>
          <span className="tag">dataset {module.dataset.patch}</span>
        </span>
      </div>

      {result === null ? (
        <p className="lede" style={{ marginTop: 12, fontSize: 14 }}>
          Modulo registrato, nessuna simulazione di prova configurata.
        </p>
      ) : (
        <dl className="readout">
          <div>
            <dt>Danno mediano</dt>
            <dd>{Math.round(result.damage.median).toLocaleString("it-IT")}</dd>
          </div>
          <div>
            <dt>Intervallo p10-p90</dt>
            <dd style={{ fontSize: 15 }}>
              {Math.round(result.damage.p10).toLocaleString("it-IT")} –{" "}
              {Math.round(result.damage.p90).toLocaleString("it-IT")}
            </dd>
          </div>
          <div>
            <dt>Turni per uccidere</dt>
            <dd>
              {result.timeToKill === null ? "—" : result.timeToKill.median}
              <small>{result.timeToKill === null ? "mai" : unit}</small>
            </dd>
          </div>
          <div>
            <dt>Probabilita&apos; di kill</dt>
            <dd>
              {Math.round(result.killRate * 100)}
              <small>%</small>
            </dd>
          </div>
        </dl>
      )}
    </article>
  );
}

/** Simulazione dimostrativa: intero roster del modulo contro il primo bersaglio. */
function runDemo(module: GameModule): SimulationResult | null {
  const target = module.targets[0];
  if (target === undefined || module.characters.length === 0) return null;

  const actors = module.characters.map((character, index) =>
    module.resolveActor({ characterId: character.id, level: 80, rank: 0 }, `slot${index + 1}`),
  );

  return simulate(
    module,
    {
      gameId: module.id,
      datasetPatch: module.dataset.patch,
      actors,
      rotation: { id: "demo", name: "Demo", steps: [], repeat: 20 },
      target,
    },
    { iterations: 2000, seed: 20260909 },
  );
}
