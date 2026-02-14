// // Konštanta pre kľúč v Local Storage
// const STORAGE_KEY = 'matchaBlogOpinions';

// // Pole na uloženie všetkých názorov
// let opinions = [];

// /**
//  * Načíta uložené názory z Local Storage.
//  */
// function loadOpinions() {
//     const jsonString = localStorage.getItem(STORAGE_KEY);
//     if (jsonString) {
//         try {
//             opinions = JSON.parse(jsonString);
//             console.log('Názory úspešne načítané z Local Storage.', opinions);
//         } catch (e) {
//             console.error('Chyba pri parsovaní Local Storage:', e);
//             opinions = []; 
//         }
//     } else {
//         console.log('Local Storage je prázdny. Iniciujem nové pole názorov.');
//     }
// }

// /**
//  * Uloží aktuálne pole názorov do Local Storage.
//  */
// function saveOpinions() {
//     const jsonString = JSON.stringify(opinions);
//     localStorage.setItem(STORAGE_KEY, jsonString);
//     console.log('Názory úspešne uložené do Local Storage.');
// }

// /**
//  * Spracuje dáta z formulára a pridá nový objekt názoru.
//  * @param {Event} event - Objekt udalosti odoslania formulára.
//  */
// function processOpinionFormData(event) {
//     event.preventDefault(); // Zastaví štandardné odoslanie formulára

//     // Načítanie hodnôt z jednotlivých riadiacich elementov
//     const name = document.getElementById('visitorName').value.trim();
//     const email = document.getElementById('visitorEmail').value.trim();
//     const imageUrl = document.getElementById('visitorURL').value.trim();
//     const keywords = document.getElementById('keywords').value.trim();
//     const opinionText = document.getElementById('opinionText').value.trim();
//     const subscribeNewsletter = document.getElementById('newsletter').checked;

//     // Načítanie hodnoty z radio button skupiny 'contentQuality'
//     const qualityElements = document.getElementsByName('contentQuality');
//     let contentQuality = '';
//     for (const radio of qualityElements) {
//         if (radio.checked) {
//             contentQuality = radio.value;
//             break;
//         }
//     }
    
//     // Vytvorenie nového objektu názoru
//     const newOpinion = {
//         name: name,
//         email: email,
//         opinionText: opinionText,
//         // Nepovinné/Checkbox/Radio polia
//         imageUrl: imageUrl,
//         keywords: keywords,
//         contentQuality: contentQuality, // Spoločná položka pre radio button skupinu
//         subscribeNewsletter: subscribeNewsletter,
//         created: new Date().toISOString() // Dátum vytvorenia
//     };

//     // Pridanie nového názoru do poľa a uloženie do Local Storage
//     opinions.push(newOpinion);
//     saveOpinions();

//     // Vyčistenie formulára
//     document.getElementById('opinionForm').reset();
    
//     console.log('A new opinion has been added:', newOpinion);
//     alert('Thank you for your feedback! Your data has been stored locally (in Local Storage).');
// }

// /**
//  * Inicializácia skriptu: načítanie údajov a nastavenie poslucháča udalosti.
//  */
// function initializeFormScript() {
//     const form = document.getElementById('opinionForm');
//     if (form) {
//         loadOpinions(); 
//         form.addEventListener('submit', processOpinionFormData);
//     } else {
//         console.log('Formulár s ID "opinionForm" nebol nájdený. JavaScript pre formulár nebol spustený.');
//     }
// }

// // Spustenie inicializačnej funkcie po načítaní DOM
// document.addEventListener('DOMContentLoaded', initializeFormScript);















