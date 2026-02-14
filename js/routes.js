import Mustache from "./mustache.js";
import OpinionsHandlerMustache from "./opinionsHandlerMustache.js";

const urlBase = "https://wt.kpi.fei.tuke.sk/api";

// tajný blog tag - neviditeľný pre bežného používateľa
const BLOG_TAG = "matchaBlog2025Secret";

const firstPageCount = 10;
const articlesPerPage = 20;
const commentsPerPage = 10;

/* ---------- pomocné: načítanie uloženého mena z Google Sign-In ---------- */
function getLoggedUserName(){
  return localStorage.getItem("loggedUserName") || "";
}

/* ---------- pomocné: načítanie komentárov s meta ---------- */
function loadCommentsPaged(articleId, offset, callback){
  const url = `${urlBase}/article/${articleId}/comment?offset=${offset}&max=${commentsPerPage}`;

  const ajax = new XMLHttpRequest();
  ajax.addEventListener("load", function(){
    if (this.status === 200){
      const json = JSON.parse(this.responseText);
      const comments = json.comments || json;
      const meta = json.meta || { offset, totalCount: comments.length };
      callback(comments, meta);
    }else{
      callback([], { offset:0, totalCount:0 });
    }
  });
  ajax.open("GET", url);
  ajax.send();
}

/* ---------- pomocné: link na detail article z listu ---------- */
function addArtDetailLink2ResponseJson(responseJSON){
  responseJSON.articles = responseJSON.articles.map(article => (
    {
      ...article,
      detailLink:`#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}/0`
    }
  ));
}

/* ====================== ZOZNAM MOJICH ČLÁNKOV (s tajným TAGom) ====================== */
// function fetchAndDisplayArticles(targetElm, offsetFromHash, totalCountFromHash){

//   const offset = Number(offsetFromHash) || 0;
//   const totalCount = Number(totalCountFromHash) || 0;

//   const maxCount = offset === 0 ? firstPageCount : articlesPerPage;

//   // 🔥 FILTRUJEME PODĽA TAJNÉHO TAGU
//   const url = `${urlBase}/article?offset=${offset}&max=${maxCount}&tag=${BLOG_TAG}`;

//   function reqListener(){
//     if (this.status === 200){

//       console.log(this.responseText);

//       const responseJSON = JSON.parse(this.responseText);
//       console.log(responseJSON);
//       addArtDetailLink2ResponseJson(responseJSON);

//       responseJSON.articles = responseJSON.articles.map(a => ({
//         ...a,
//         shortContent: a.content
//           ? a.content.replace(/<[^>]*>?/gm, "").substring(0,150) + "..."
//           : ""
//       }));

//       const currentOffset = responseJSON.meta.offset;
//       const total = responseJSON.meta.totalCount;

//       responseJSON.showPrev = currentOffset > 0;
//       responseJSON.prevOffset = currentOffset === firstPageCount
//         ? 0
//         : Math.max(0, currentOffset - articlesPerPage);

//       const nextOffset = currentOffset === 0
//         ? firstPageCount
//         : currentOffset + articlesPerPage;

//       responseJSON.showNext = nextOffset < total;
//       responseJSON.nextOffset = nextOffset;
//       responseJSON.totalCount = total;

//       // tieto odkazy sa momentálne v šablóne nepoužívajú, ale nechávam ich tu
//       responseJSON.prevLink = `#articles/${responseJSON.prevOffset}/${total}`;
//       responseJSON.nextLink = `#articles/${responseJSON.nextOffset}/${total}`;

//       // Render
//       document.getElementById(targetElm).innerHTML =
//         Mustache.render(
//           document.getElementById("template-articles").innerHTML,
//           responseJSON
//         );

//     } else {
//       const errMsgObj = {errMessage:this.responseText};
//       document.getElementById(targetElm).innerHTML =
//         Mustache.render(
//           document.getElementById("template-articles-error").innerHTML,
//           errMsgObj
//         );
//     }
//   }

//   const ajax = new XMLHttpRequest();
//   ajax.addEventListener("load", reqListener);
//   ajax.open("GET", url);
//   ajax.send();
// }

function fetchAndDisplayArticles(targetElm, offsetFromHash, totalCountFromHash){

  const offset = Number(offsetFromHash) || 0;
  const totalCount = Number(totalCountFromHash) || 0;

  const maxCount = offset === 0 ? firstPageCount : articlesPerPage;

  const url = `${urlBase}/article?offset=${offset}&max=${maxCount}&tag=${BLOG_TAG}`;

  function reqListener(){
    if (this.status === 200){

      const responseJSON = JSON.parse(this.responseText);
      addArtDetailLink2ResponseJson(responseJSON);

      // 🔥 1. najprv načítame základné články zo zoznamu
      let articles = responseJSON.articles;

      // 🔥 2. pre každý článok stiahneme DETAIL (kde je content)
      let detailPromises = articles.map(a => {
        return new Promise(resolve => {

          const ajax = new XMLHttpRequest();
          ajax.open("GET", `${urlBase}/article/${a.id}`);
          ajax.onload = function(){
            if (this.status === 200){
              const detail = JSON.parse(this.responseText);
              a.shortContent = detail.content
                ? detail.content.replace(/<[^>]*>?/gm,"").substring(0,150) + "..."
                : "";
            } else {
              a.shortContent = "";
            }
            resolve();
          };
          ajax.onerror = () => resolve();
          ajax.send();

        });
      });

      // 🔥 3. keď sú všetky detaily načítané → renderujeme šablónu
      Promise.all(detailPromises).then(() => {

        responseJSON.articles = articles;

        const currentOffset = responseJSON.meta.offset;
        const total = responseJSON.meta.totalCount;

        responseJSON.showPrev = currentOffset > 0;
        responseJSON.prevOffset = currentOffset === firstPageCount
          ? 0
          : Math.max(0, currentOffset - articlesPerPage);

        const nextOffset = currentOffset === 0
          ? firstPageCount
          : currentOffset + articlesPerPage;

        responseJSON.showNext = nextOffset < total;
        responseJSON.nextOffset = nextOffset;
        responseJSON.totalCount = total;

        document.getElementById(targetElm).innerHTML =
          Mustache.render(
            document.getElementById("template-articles").innerHTML,
            responseJSON
          );
      });

    } else {
      const errMsgObj = {errMessage:this.responseText};
      document.getElementById(targetElm).innerHTML =
        Mustache.render(
          document.getElementById("template-articles-error").innerHTML,
          errMsgObj
        );
    }
  }

  const ajax = new XMLHttpRequest();
  ajax.addEventListener("load", reqListener);
  ajax.open("GET", url);
  ajax.send();
}

/* ====================== ZOZNAM VŠETKÝCH ČLÁNKOV (server) ====================== */
// function fetchAndDisplayArticlesAll(targetElm, offsetFromHash, totalCountFromHash, filtered = false){
//   // ked tu dam false - tak sa zobrazia vsetky clanky
//   // ked dam true tak sa vypisu iba moje clanky

//   const offset = Number(offsetFromHash) || 0;
//   const totalCount = Number(totalCountFromHash) || 0;

//   // prvá stránka = 10, ostatné = 20
//   const maxCount = offset === 0 ? 10 : 20;

//   console.log("offset: " + offset)

//   console.log("totalCount: " + totalCount)

//   console.log("maxCount: " + maxCount)

//   // ⭐ BEZ FILTRA – ZOBRAZIŤ VŠETKO
//   //const url = `${urlBase}/article?offset=${offset}&max=${maxCount}`;

//   const url = filtered
//     ? `${urlBase}/article?offset=${offset}&max=${maxCount}&tag=${BLOG_TAG}`
//     : `${urlBase}/article?offset=${offset}&max=${maxCount}`;

//   function reqListener(){
//     if (this.status === 200){

//       const responseJSON = JSON.parse(this.responseText);
//       console.log(responseJSON)
//       addArtDetailLink2ResponseJson(responseJSON);
      
//       // krátky obsah (ak by ho nejaká šablóna používala)
//       responseJSON.articles = responseJSON.articles.map(a => ({
//         ...a,
//         shortContent: a.content
//           ? a.content.replace(/<[^>]*>?/gm, "").substring(0,150) + "..."
//           : ""
//       }));

//       const currentOffset = Number(responseJSON.meta.offset);
//       console.log(typeof currentOffset)
//       const total = responseJSON.meta.totalCount;

//       // PAGINÁCIA
//       responseJSON.showPrev = currentOffset > 0;
//       responseJSON.prevOffset = currentOffset === 10
//         ? 0
//         : Math.max(0, currentOffset - 20);

//       // KOĽKO článkov prišlo
//       const loadedCount = responseJSON.articles.length;

//       // NEXT OFFSET – podľa počtu načítaných článkov
//       let nextOffset = currentOffset + loadedCount;
//       console.log("currentOffset: " + currentOffset);
//       console.log("loadedCount: " + loadedCount);
      

//       // Zobraziť NEXT len ak existujú ďalšie články
//       responseJSON.showNext = nextOffset < total;
//       console.log("nextOffset: " + nextOffset)
//       console.log("total: " + total)
//       responseJSON.nextOffset = nextOffset;      

//       responseJSON.prevLink = `#articlesAll/${responseJSON.prevOffset}/${total}`;
//       responseJSON.nextLink = `#articlesAll/${responseJSON.nextOffset}/${total}`;

//       document.getElementById(targetElm).innerHTML =
//         Mustache.render(
//           document.getElementById("template-articles").innerHTML,
//           responseJSON
//         );

//     } else {
//       const errMsgObj = {errMessage:this.responseText};
//       document.getElementById(targetElm).innerHTML =
//         Mustache.render(
//           document.getElementById("template-articles-error").innerHTML,
//           errMsgObj
//         );
//     }
//   }

//   const ajax = new XMLHttpRequest();
//   ajax.addEventListener("load", reqListener);
//   ajax.open("GET", url);
//   ajax.send();
// }

function fetchAndDisplayArticlesAll(targetElm, offsetFromHash, totalCountFromHash, filtered = false){

  const offset = Number(offsetFromHash) || 0;
  const totalCount = Number(totalCountFromHash) || 0;

  const maxCount = offset === 0 ? 10 : 20;

  const url = filtered
    ? `${urlBase}/article?offset=${offset}&max=${maxCount}&tag=${BLOG_TAG}`
    : `${urlBase}/article?offset=${offset}&max=${maxCount}`;

  function reqListener(){
    if (this.status === 200){

      const responseJSON = JSON.parse(this.responseText);

      // linky na detail článkov
      addArtDetailLink2ResponseJson(responseJSON);

      let articles = responseJSON.articles;

      let detailPromises = articles.map(a => {
        return new Promise(resolve => {

          const ajax = new XMLHttpRequest();
          ajax.open("GET", `${urlBase}/article/${a.id}`);
          ajax.onload = function(){
            if (this.status === 200){
              const detail = JSON.parse(this.responseText);

              a.shortContent = detail.content
                ? detail.content.replace(/<[^>]*>?/gm, "").substring(0,150) + "..."
                : "No content available.";
            } else {
              a.shortContent = "No content available.";
            }
            resolve();
          };
          ajax.onerror = () => { 
            a.shortContent = "No content available."; 
            resolve(); 
          };
          ajax.send();

        });
      });

      Promise.all(detailPromises).then(() => {

        responseJSON.articles = articles;

        const currentOffset = Number(responseJSON.meta.offset);
        const total = responseJSON.meta.totalCount;

        responseJSON.showPrev = currentOffset > 0;
        responseJSON.prevOffset = currentOffset === 10
          ? 0
          : Math.max(0, currentOffset - 20);

        const loadedCount = responseJSON.articles.length;
        const nextOffset = currentOffset + loadedCount;

        responseJSON.showNext = nextOffset < total;
        responseJSON.nextOffset = nextOffset;

        responseJSON.prevLink = `#articlesAll/${responseJSON.prevOffset}/${total}`;
        responseJSON.nextLink = `#articlesAll/${responseJSON.nextOffset}/${total}`;

        document.getElementById(targetElm).innerHTML =
          Mustache.render(
            document.getElementById("template-articles").innerHTML,
            responseJSON
          );

      });

    } else {
      const errMsgObj = {errMessage:this.responseText};
      document.getElementById(targetElm).innerHTML =
        Mustache.render(
          document.getElementById("template-articles-error").innerHTML,
          errMsgObj
        );
    }
  }

  const ajax = new XMLHttpRequest();
  ajax.addEventListener("load", reqListener);
  ajax.open("GET", url);
  ajax.send();
}


/* ====================== DETAIL / EDIT WRAPPERY ====================== */
function fetchAndDisplayArticleDetail(targetElm, id, artOffset, artTotal, commentOffset){
  fetchAndProcessArticle(targetElm, id, artOffset, artTotal, false, commentOffset);
}

function editArticle(targetElm, id, artOffset, artTotal, commentOffset){
  fetchAndProcessArticle(targetElm, id, artOffset, artTotal, true, commentOffset);
}

/* ====================== DETAIL / EDIT + KOMENTÁRE ====================== */
function fetchAndProcessArticle(targetElm, id, artOffsetFromHash, artTotalFromHash, forEdit, commentOffsetFromHash){

  const artOffset = Number(artOffsetFromHash) || 0;
  const artTotal  = Number(artTotalFromHash)  || 0;
  const commentOffset = Number(commentOffsetFromHash) || 0;

  const url = `${urlBase}/article/${id}`;

  function reqListener(){
    if (this.status === 200){

      const article = JSON.parse(this.responseText);

      if (forEdit){
        article.formTitle = "Article Edit";
        article.submitBtTitle = "Save Article";
        article.backLink = `#article/${id}/${artOffset}/${artTotal}/${commentOffset}`;

        document.getElementById(targetElm).innerHTML =
          Mustache.render(
            document.getElementById("template-article-form").innerHTML,
            article
          );

        // 🔥 doplnenie mena autora z Google, ak je prihlásený
        const loggedName = getLoggedUserName();
        if (loggedName){
          const authorInput = document.querySelector("input[name='author']");
          if (authorInput) authorInput.value = loggedName;
        }

        if (!window.artFrmHandler){
          window.artFrmHandler = new articleFormsHandler(urlBase);
        }

        window.artFrmHandler.assignFormAndArticle(
          "articleForm", "hiddenElm", id, artOffset, artTotal
        );

      } else {

        article.backLink = `#articles/${artOffset}/${artTotal}`;
        article.editLink = `#artEdit/${id}/${artOffset}/${artTotal}/${commentOffset}`;
        article.deleteLink = `#artDelete/${id}/${artOffset}/${artTotal}/${commentOffset}`;

        document.getElementById(targetElm).innerHTML =
          Mustache.render(
            document.getElementById("template-article").innerHTML,
            article
          );

        loadAndRenderComments(id, artOffset, artTotal, commentOffset);
      }

    } else {
      const errMsgObj = {errMessage:this.responseText};
      document.getElementById(targetElm).innerHTML =
        Mustache.render(
          document.getElementById("template-articles-error").innerHTML,
          errMsgObj
        );
    }
  }

  const ajax = new XMLHttpRequest();
  ajax.addEventListener("load", reqListener);
  ajax.open("GET", url);
  ajax.send();
}

/* ====================== KOMENTÁRE PRE DETAIL ====================== */
function loadAndRenderComments(id, artOffset, artTotal, commentOffset){

  const commentsContainer = document.getElementById("commentsContainer");
  const commentFormContainer = document.getElementById("commentFormContainer");

  loadCommentsPaged(id, commentOffset, function(comments, meta){

    const currentCommOffset = meta.offset || 0;
    const totalComments = meta.totalCount || comments.length;

    const showPrev = currentCommOffset > 0;
    const prevOffset = Math.max(0, currentCommOffset - commentsPerPage);

    const nextOffset = currentCommOffset + commentsPerPage;
    const showNext = nextOffset < totalComments;

    const ctx = {
      comments,
      showPrev,
      showNext,
      prevLink: `#article/${id}/${artOffset}/${artTotal}/${prevOffset}`,
      nextLink: `#article/${id}/${artOffset}/${artTotal}/${nextOffset}`
    };

    // vyrenderujeme komentáre
    commentsContainer.innerHTML = Mustache.render(
      document.getElementById("template-comments").innerHTML,
      ctx
    );

    // vyprázdnime formulárový kontajner
    commentFormContainer.innerHTML = "";

    // ---------- Add Comment button ----------
    const addBtn = document.getElementById("addCommentBtn");
    if (addBtn){
      addBtn.onclick = function(){

        // vložíme formulár
        commentFormContainer.innerHTML = Mustache.render(
          document.getElementById("template-add-comment").innerHTML,
          {}
        );

        const cancelBtn = document.getElementById("cancelCommentBtn");
        const form = document.getElementById("newCommentForm");

        // Cancel = skryť formulár
        if (cancelBtn){
          cancelBtn.onclick = function(){
            commentFormContainer.innerHTML = "";
          };
        }

        // 🔥 doplnenie mena autora do formulára komentára (ak je prihlásený)
        const savedName = getLoggedUserName();
        if (form && savedName && form.author){
          form.author.value = savedName;
        }

        // Submit = uložiť komentár + znova načítať
        if (form){
          form.onsubmit = function(e){
            e.preventDefault();

            let author = form.author.value.trim();
            const text   = form.text.value.trim();

            // ak je používateľ prihlásený, prepíšeme autora jeho menom
            const googleName = getLoggedUserName();
            if (googleName){
              author = googleName;
            }

            if (!author || !text){
              alert("Please fill both fields.");
              return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${urlBase}/article/${id}/comment`);
            xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");

            xhr.onload = function(){
              if (xhr.status === 200 || xhr.status === 201){
                // po úspechu – skryť formulár a znova načítať komentáre
                commentFormContainer.innerHTML = "";
                loadAndRenderComments(id, artOffset, artTotal, currentCommOffset);
              } else {
                alert("Error saving comment: " + xhr.responseText);
              }
            };

            xhr.send(JSON.stringify({ author, text }));
          };
        }
      };
    }
  });
}

/* ====================== LEN STRÁNKOVANIE KOMENTÁROV (artComment) ====================== */
function fetchAndDisplayCommentsOnly(targetElm, id, artOffset, artTotal, commentOffset){

  loadCommentsPaged(id, commentOffset, function(comments, meta){

    const currentCommOffset = meta.offset || 0;
    const totalComments = meta.totalCount || comments.length;

    const prevOffset = Math.max(0, currentCommOffset - commentsPerPage);
    const nextOffset = currentCommOffset + commentsPerPage;

    const ctx = {
      comments,
      showPrev: currentCommOffset > 0,
      showNext: nextOffset < totalComments,
      prevLink: `#artComment/${id}/${artOffset}/${artTotal}/${prevOffset}`,
      nextLink: `#artComment/${id}/${artOffset}/${artTotal}/${nextOffset}`
    };

    document.getElementById("commentsContainer").innerHTML =
      Mustache.render(
        document.getElementById("template-comments-only").innerHTML,
        ctx
      );
  });
}

/* ====================== DELETE ====================== */
function deleteArticle(targetElm, id, artOffset, artTotal, commentOffset){

  if (!confirm("Do you really want to delete this article?")){
    window.location.hash = `#article/${id}/${artOffset}/${artTotal}/${commentOffset}`;
    return;
  }

  const ajax = new XMLHttpRequest();
  ajax.open("DELETE", `${urlBase}/article/${id}`);
  ajax.onload = function(){
    if (ajax.status === 200 || ajax.status === 204){
      window.location.hash = `#articles/${artOffset}/${artTotal}`;
    } else {
      alert("Delete failed: " + ajax.responseText);
    }
  };
  ajax.send();
}

/* ====================== INSERT ====================== */
function insertArticle(targetElm, offsetFromHash, totalFromHash){

  const offset = Number(offsetFromHash) || 0;
  const total = Number(totalFromHash) || 0;

  const empty = {
    formTitle: "New Article",
    submitBtTitle: "Create Article",
    author: "",
    title: "",
    imageLink: "",
    content: "",
    tags: "",
    backLink: `#articles/${offset}/${total}`
  };

  document.getElementById(targetElm).innerHTML =
    Mustache.render(
      document.getElementById("template-article-form").innerHTML,
      empty
    );

  // 🔥 doplnenie mena autora z Google, ak je prihlásený
  const loggedName = getLoggedUserName();
  if (loggedName){
    const authorInput = document.querySelector("input[name='author']");
    if (authorInput) authorInput.value = loggedName;
  }

  if (!window.artFrmHandler){
    window.artFrmHandler = new articleFormsHandler(urlBase);
  }

  window.artFrmHandler.assignFormForInsert(
    "articleForm", "hiddenElm", offset, total
  );
}

/* ====================== OPINIONS ====================== */
/* ====================== OPINIONS – ZOZNAM ====================== */
function createHtml4opinions(targetElm) {
    console.log("🔄 Route #opinions");

    // tu nechceme formulár, len zoznam názorov
    const handler = new OpinionsHandlerMustache(
        null,                 // na tejto stránke NIE je formulár
        targetElm,            // id elementu, kde sa má vypísať zoznam (router-view)
        "template-opinions"   // Mustache šablóna zoznamu názorov
    );

    handler.init();          // načíta z localStorage a vyrenderuje do #router-view
}

/* ====================== OPINIONS – PRIDANIE NOVÉHO ====================== */
function createHtml4addOpinion(targetElm) {
    console.log("🔄 Route #addOpinion");

    const container = document.getElementById(targetElm);

    // 1️⃣ vložíme HTML formulára
    container.innerHTML =
        document.getElementById("template-addOpinion").innerHTML;

    // 2️⃣ auto-doplnenie mena z Google loginu (ak je uložený v localStorage)
    const savedName = localStorage.getItem("loggedUserName");
    if (savedName) {
        const nameInput = container.querySelector("#visitorName");
        if (nameInput) {
            nameInput.value = savedName;
        }
    }

    // 3️⃣ vytvoríme handler len pre FORMULÁR
    //    - druhý parameter = null → na tejto stránke nič nerenderujeme
    const handler = new OpinionsHandlerMustache(
        "opinionForm",        // id formulára z template-addOpinion
        null,                 // tu nemáme kontajner na zoznam
        "template-opinions"   // šablóna sa využije až na stránke #opinions
    );

    handler.init();          // pridá submit listener na form, načíta existujúce názory
}

/* ====================== ROUTES ====================== */
export default [
  {
    hash:"welcome",
    target:"router-view",
    getTemplate:(t)=>
      document.getElementById(t).innerHTML =
        document.getElementById("template-welcome").innerHTML
  },
  {
    hash:"articles",
    target:"router-view",
    getTemplate:fetchAndDisplayArticles
  },
  {
    hash:"articlesAll",
    target:"router-view",
    getTemplate:fetchAndDisplayArticlesAll
  },
  {
    hash:"article",
    target:"router-view",
    getTemplate:fetchAndDisplayArticleDetail
  },
  {
    hash:"artEdit",
    target:"router-view",
    getTemplate:editArticle
  },
  {
    hash:"artDelete",
    target:"router-view",
    getTemplate:deleteArticle
  },
  {
    hash:"artInsert",
    target:"router-view",
    getTemplate:insertArticle
  },
  {
    hash:"artComment",
    target:"router-view",
    getTemplate:fetchAndDisplayCommentsOnly
  },
  {
    hash:"opinions",
    target:"router-view",
    getTemplate:createHtml4opinions
  },
  {
    hash:"addOpinion",
    target:"router-view",
    getTemplate:createHtml4addOpinion
  }
];



