// paramHashRouter.js
//
// Jednoduchý klientský router – sleduje hash v URL (#welcome, #articles, #articles/2, ...)
// a zobrazuje obsah podľa definovaných trás v routes.js.
// Sleduje zmenu hash-u v URL a spúšťa správnu trasu z routes.js

export default class ParamHashRouter {
    constructor(routes) {
        this.routes = routes; // uloženie trás
        this.init(); // spustenie sledovania hash-u
    }

    init() {
        // ak sa hash zmení (kliknutie v menu) → spustí sa handleRouting
        window.addEventListener("hashchange", () => this.handleRouting());
        // ak sa stránka načíta, skontroluj hash
        window.addEventListener("load", () => this.handleRouting());
    }

handleRouting() {
    const fullHash = window.location.hash.replace("#", "");
    const hashSegments = fullHash.split("/"); 
    const mainHash = hashSegments[0];
    // >>> TÁTO ČASŤ JE KRITICKÁ <<<
    const hashParams = hashSegments.slice(1); 
    // >>> ------------------- <<<

    const route = this.routes.find(r => r.hash === mainHash);

    if (route) {
        console.log(`🚦 Navigujem na trasu: ${fullHash}`);
        // UPRAVENÉ: Volanie s parametrami (hashParams)
        route.getTemplate(route.target, ...hashParams); 
    } else {
        // ... (zvyšok kódu zostáva rovnaký)
    }
}

// Tento súbor obsahuje triedu, ktorá spracúva navigáciu medzi sekciami.
// Sleduje, keď sa hash v URL zmení alebo keď sa stránka načíta.
// Podľa hash-u nájde správnu trasu v routes.js a zavolá jej funkciu na zobrazenie obsahu.
// Ak hash neexistuje, zobrazí predvolenú stránku welcome.
// Je to jadro navigačného systému SPA.

