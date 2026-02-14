// Import triedy (modulu), ktorá sa stará o spracovanie názorov pomocou Mustache šablón
import OpinionsHandlerMustache from "./opinionsHandlerMustache.js";

// Po načítaní celého HTML dokumentu (keď je pripravený DOM)
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM načítaný, spúšťam inicializáciu...');
    
    // Najprv si z HTML načítame potrebné elementy podľa ich ID
    const form = document.getElementById('opinionForm'); // formulár, kde používateľ píše názor
    const container = document.getElementById('opinionsContainer'); // kontajner, kam sa názory budú vkladať
    const template = document.getElementById('mTmplOneOpinion'); // Mustache šablóna jedného názoru
        
    // Kontrola, či sa elementy naozaj našli
    console.log('📋 Kontrola elementov:');
    console.log('  - Formulár (opinionForm):', form ? '✅' : '❌');
    console.log('  - Kontajner (opinionsContainer):', container ? '✅' : '❌');
    console.log('  - Šablóna (mTmplOneOpinion):', template ? '✅' : '❌');
    
    // Ak niektorý z potrebných elementov chýba, vypíš chybu a ukonči kód
    if (!form || !container || !template) {
        console.error('❌ CHYBA: Niektoré elementy chýbajú!');
        return;
    }
    
    // Ak sú všetky elementy ok, pokračujeme ďalej
    try {
        // Vytvorenie objektu triedy OpinionsHandlerMustache = trieda obsahuje logiku na:
        // čítanie údajov z formulára, ukladanie názorov (napr. do poľa alebo localStorage), zobrazenie názorov pomocou Mustache šablóny.
        window.opnsHndlr = new OpinionsHandlerMustache(
            "opinionForm",           // ID formulára
            "opinionsContainer",     // ID kontajnera
            "mTmplOneOpinion"       // ID Mustache šablóny
        );
        
        console.log('✅ OpinionsHandlerMustache vytvorený');
        
        // Zavolanie metódy init() — zvyčajne slúži na inicializáciu objektu (načítanie už uložených názorov)
        window.opnsHndlr.init();
        
        console.log('✅ Inicializácia dokončená');
        console.log('📊 Počet načítaných názorov:', window.opnsHndlr.opinions.length);
        
    } catch (error) {
        // Keď sa niečo pokazí počas vytvárania inicializácie
        console.error('❌ CHYBA pri inicializácii:', error);
    }
});


// 🧠 Zhrnutie:
// DOMContentLoaded – čaká, kým sa načíta celý HTML dokument, a potom spustí tvoj kód.
// document.getElementById – vyberie HTML prvok podľa jeho ID.
// OpinionsHandlerMustache – trieda (z iného súboru), ktorá sa stará o spracovanie a zobrazenie názorov.
// init() – metóda, ktorá pravdepodobne všetko pripraví (načítanie, zobrazenie, eventy).
// try...catch – slúži na zachytenie chýb, aby skript nespadol.




