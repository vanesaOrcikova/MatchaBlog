"use strict";

const BLOG_TAG = "matchaBlog2025Secret";

function addBlogTagToObj(obj){
    const secret = BLOG_TAG;
    if (!obj.tags || obj.tags.trim() === "") {
        // ak používateľ nezadal žiadne tagy, použijeme len náš
        obj.tags = secret;
    } else {
        const parts = obj.tags
            .split(",")
            .map(t => t.trim())
            .filter(t => t.length > 0);

        const lowerSecret = secret.toLowerCase();
        const hasAlready = parts.some(t => t.toLowerCase() === lowerSecret);

        if (!hasAlready){
            parts.push(secret);
        }

        obj.tags = parts.join(", ");
    }
}

class articleFormsHandler {

    constructor(urlBase){
        this.urlBase = urlBase;
    }

    // EDIT EXISTUJÚCEHO ČLÁNKU (artEdit)
    assignFormAndArticle(formId, hiddenElmId, artId, offset, totalCount){
        const formElm = document.getElementById(formId);

        formElm.addEventListener("submit", (event)=>{
            event.preventDefault();

            const formData = new FormData(formElm);
            const obj = Object.fromEntries(formData.entries());

            // pridáme náš tajný tag
            addBlogTagToObj(obj);

            const url = `${this.urlBase}/article/${artId}`;

            var ajax = new XMLHttpRequest();
            ajax.open("PUT", url, true);
            ajax.setRequestHeader("Content-Type","application/json;charset=UTF-8");

            ajax.onload = () => {
                if (ajax.status == 200){
                    window.location.hash = `#article/${artId}/${offset}/${totalCount}`;
                } else {
                    alert("Error saving article: " + ajax.status + " " + ajax.responseText);
                }
            };

            ajax.onerror = () => {
                alert("Connection error while saving article.");
            };

            ajax.send(JSON.stringify(obj));
        });
    }

    // INSERT NOVÉHO ČLÁNKU (artInsert)
    assignFormForInsert(formId, hiddenElmId, offset, totalCount){
        const formElm = document.getElementById(formId);

        formElm.addEventListener("submit", (event)=>{
            event.preventDefault();

            const formData = new FormData(formElm);
            const obj = Object.fromEntries(formData.entries());

            // pridáme náš tajný tag
            addBlogTagToObj(obj);

            const url = `${this.urlBase}/article`;

            var ajax = new XMLHttpRequest();
            ajax.open("POST", url, true);
            ajax.setRequestHeader("Content-Type","application/json;charset=UTF-8");

            ajax.onload = () => {
                if (ajax.status == 200 || ajax.status == 201){
                    let resp = null;
                    try {
                        resp = JSON.parse(ajax.responseText);
                    } catch(e) {}

                    const newId = resp && resp.id ? resp.id : null;

                    if (newId) {
                        window.location.hash = `#article/${newId}/${offset}/${totalCount}`;
                    } else {
                        window.location.hash = `#articles/${offset}/${totalCount}`;
                    }
                } else {
                    alert("Error creating article: " + ajax.status + " " + ajax.responseText);
                }
            };

            ajax.onerror = () => {
                alert("Connection error while creating article.");
            };

            ajax.send(JSON.stringify(obj));
        });
    }
}

window.articleFormsHandler = articleFormsHandler;


