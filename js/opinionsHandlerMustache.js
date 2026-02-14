// Import základnej triedy OpinionsHandler
import OpinionsHandler from "./opinionsHandler.js";
import Mustache from "./mustache.js";

export default class OpinionsHandlerMustache extends OpinionsHandler {

    constructor(opinionsFormElmId, opinionsListElmId, templateElmId) {
        super(opinionsFormElmId, opinionsListElmId);

        const templateElm = document.getElementById(templateElmId);
        if (templateElm) {
            this.mustacheTemplate = templateElm.innerHTML;
            console.log('✅ Mustache šablóna načítaná');
        } else {
            console.error(`❌ Mustache template element with ID "${templateElmId}" not found!`);
            this.mustacheTemplate = '';
        }
    }

    /**
     * 🔥 OVERRIDE pôvodného spôsobu renderovania
     * Renderujeme celý ZOZNAM názorov naraz, nie každý jeden zvlášť
     */
    opinionArray2html(opinionsArray) {

        if (!this.mustacheTemplate) {
            console.error("❌ Mustache šablóna nie je dostupná!");
            return "";
        }

        // Mustache view objekt
        const view = {
            opinions: opinionsArray.map(op => ({
                name: op.name,
                email: op.email || "Nezadaný",
                createdDate: (new Date(op.created)).toDateString(),
                comment: op.opinionText,
                qualityMessage: op.contentQuality || "Nezadané",

                subscribeMessage: op.subscribeNewsletter
                    ? "Prihlásený na odber noviniek."
                    : "Neprihlásený na odber noviniek.",

                hasImage: op.imageUrl && op.imageUrl.trim() !== "",
                imageUrl: op.imageUrl || ""
            }))
        };

        console.log("🎨 Renderujem celé pole názorov:", view);

        return Mustache.render(this.mustacheTemplate, view);
    }
}

// 🧠 Zhrnutie:
// Táto trieda rozširuje základnú triedu OpinionsHandler o možnosť renderovať názory pomocou Mustache šablón.
// Konštruktor:
    // zavolá rodičovský konštruktor (super),
    // načíta Mustache šablónu z HTML (podľa ID).
// Metóda opinion2html(opinion):
    // pripraví dáta z jedného názoru do tvaru vhodného pre šablónu,
    // vloží ich do Mustache šablóny,
    // vráti výsledný HTML text.





