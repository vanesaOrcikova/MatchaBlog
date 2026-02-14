// routerInit.js
// Inicializácia SPA aplikácie — spája router s trasami.


import routes from "./routes.js";

function router(){
  let hash = window.location.hash || "#welcome";

  if (hash.charAt(0) === "#") {
    hash = hash.substring(1);
  }

  const parts = hash.split("/");
  const routeName = parts[0];
  const params = parts.slice(1);  // všetko za hashom

  const route = routes.find(r => r.hash === routeName);

  if (!route){
    window.location.hash = "#welcome";
    return;
  }

  const targetElm = route.target;

  // getTemplate dostane target + všetky parametre
  route.getTemplate(targetElm, ...params);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);


// Tento súbor spúšťa celú aplikáciu po načítaní stránky.
// Načíta definované trasy z routes.js a vytvorí novú inštanciu routera (ParamHashRouter).
// Router potom sleduje zmeny hash-u v URL (napr. #welcome, #articles).
// Ak stránka nemá hash, automaticky ju presmeruje na úvodnú sekciu (#welcome).
// Je to vlastne štartovací bod celej SPA aplikácie.