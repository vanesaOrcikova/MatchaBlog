// -----------------------------------------------
// Konštanta – názov kľúča v localStorage
// -----------------------------------------------
const STORAGE_KEY = 'matchaBlogOpinions';

// -----------------------------------------------
// Trieda na prácu s názormi
// -----------------------------------------------
export default class OpinionsHandler {

    constructor(opinionsFormElmId, opinionsListElmId) {

        this.opinionsElm = document.getElementById(opinionsListElmId);
        this.opinionsFrmElm = opinionsFormElmId
            ? document.getElementById(opinionsFormElmId)
            : null;

        this.opinions = [];

        this.processOpnFrmData = this.processOpnFrmData.bind(this);
    }

    // -----------------------------------------------
    // HTML pre jeden názor
    // -----------------------------------------------
    opinion2html(opinion) {

        const createdDate = (new Date(opinion.created)).toDateString();

        const imageUrl = opinion.imageUrl?.trim() || "";
        const keywords = opinion.keywords?.trim() || "";

        return `
            <section class="opinion-item"
                     style="border:1px solid #eee; padding:15px; margin-bottom:15px; border-radius:5px; background:white;">
                
                <h3 style="color:#5d852e; font-size:2rem; margin-bottom:5px;">
                    ${opinion.name} <i>(${createdDate})</i>
                </h3>

                <p><strong>Email:</strong> ${opinion.email}</p>
                <p><strong>Názor:</strong> ${opinion.opinionText}</p>

                ${imageUrl ? `<p><strong>Obrázok:</strong> <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>` : ""}

                ${keywords ? `<p><strong>Kľúčové slová:</strong> ${keywords}</p>` : ""}

                <p><strong>Hodnotenie:</strong> ${opinion.contentQuality || "Nezadané"}</p>

                <p><em>${
                    opinion.subscribeNewsletter
                        ? "Prihlásený na odber noviniek."
                        : "Neprihlásený na odber noviniek."
                }</em></p>
            </section>
        `;
    }

    // -----------------------------------------------
    // HTML pre celé pole názorov
    // -----------------------------------------------
    opinionArray2html(sourceData) {
        return sourceData.map(op => this.opinion2html(op)).join("");
    }

    // -----------------------------------------------
    // Načítanie názorov z localStorage
    // -----------------------------------------------
    loadOpinions() {
        const jsonString = localStorage.getItem(STORAGE_KEY);

        if (jsonString) {
            try {
                this.opinions = JSON.parse(jsonString);
            } catch (e) {
                console.error("❌ Chyba pri čítaní JSON z localStorage");
                this.opinions = [];
            }
        } else {
            this.opinions = [];
        }

        console.log("📦 Loaded opinions:", this.opinions);
    }

    // -----------------------------------------------
    // Uloženie názorov
    // -----------------------------------------------
    saveOpinions() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.opinions));
    }

    // -----------------------------------------------
    // Spracovanie formulára
    // -----------------------------------------------
    processOpnFrmData(event) {
        event.preventDefault();

        const form = this.opinionsFrmElm;
        if (!form) return;

        const newOpinion = {
            name: form.querySelector('[name="name"]').value.trim(),
            email: form.querySelector('[name="email"]').value.trim(),
            opinionText: form.querySelector('[name="opinionText"]').value.trim(),
            imageUrl: form.querySelector('[name="imageUrl"]').value.trim(),
            keywords: form.querySelector('[name="keywords"]').value.trim(),
            subscribeNewsletter: form.querySelector('[name="subscribeNewsletter"]').checked,
            contentQuality: [...form.elements['contentQuality']]
                .find(r => r.checked)?.value || "",
            created: new Date().toISOString()
        };

        // uložíme nový názor
        this.opinions.push(newOpinion);
        this.saveOpinions();

        // reset formulara
        form.reset();

        // plný re-render Mustache alebo fallback renderovania
        if (this.opinionsElm) {
            this.opinionsElm.innerHTML = this.opinionArray2html(this.opinions);
        }

        // presmerovanie
        window.location.hash = "#opinions";

        alert("Ďakujeme za Váš názor! Bol uložený lokálne.");
    }

    // -----------------------------------------------
    // Inicializácia handleru
    // -----------------------------------------------
    init() {

        // načíta názory z localStorage
        this.loadOpinions();

        // zobraz ich
        if (this.opinionsElm) {
            this.opinionsElm.innerHTML = this.opinionArray2html(this.opinions);
        }

        // pridaj handler na formulár
        if (this.opinionsFrmElm) {
            this.opinionsFrmElm.addEventListener("submit", this.processOpnFrmData);
        }
    }
}

// 🧠 Zhrnutie:
// Trieda OpinionsHandler je základ, ktorý rieši:
    // načítanie/uloženie dát do localStorage,
    // spracovanie údajov z formulára,
    // vykreslenie HTML názoru pomocou šablónových reťazcov (bez Mustache).
// OpinionsHandlerMustache z tejto triedy dedi a len mení spôsob renderovania → namiesto obyčajného HTML používa Mustache šablóny.
// Tvoj hlavný skript (s DOMContentLoaded) potom už len všetko spustí a zainicializuje.







