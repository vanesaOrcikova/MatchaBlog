// // uložený používateľ
// let LOGGED_USER = null;

// // Google callback
// window.onGoogleSignIn = function(response) {
//     const token = response.credential;
//     const data = jwt_decode(token);

//     LOGGED_USER = data;
//     console.log("Google user:", data);

//     // uložíme meno
//     localStorage.setItem("userName", data.name);

//     // prepnutie tlačidiel
//     document.getElementById("googleSignInBtn").style.display = "none";
//     document.getElementById("googleSignOutBtn").style.display = "inline-block";

//     alert("Signed in as: " + data.name);
// };

// // SIGN OUT
// document.getElementById("googleSignOutBtn").onclick = function() {
//     google.accounts.id.disableAutoSelect();
//     LOGGED_USER = null;

//     localStorage.removeItem("userName");

//     document.getElementById("googleSignInBtn").style.display = "inline-block";
//     document.getElementById("googleSignOutBtn").style.display = "none";

//     alert("Signed out");
// };

// uložený používateľ
let LOGGED_USER = null;

// Google callback
window.onGoogleSignIn = function (response) {
    const token = response.credential;
    const data = jwt_decode(token);

    LOGGED_USER = data;
    console.log("Google user:", data);

    // uložíme meno pod JEDNOTNÝM názvom
    localStorage.setItem("loggedUserName", data.name);

    // prepnutie tlačidiel
    document.getElementById("googleSignInBtn").style.display = "none";
    document.getElementById("googleSignOutBtn").style.display = "inline-block";

    alert("Signed in as: " + data.name);
};

// SIGN OUT
document.getElementById("googleSignOutBtn").onclick = function () {
    google.accounts.id.disableAutoSelect();
    LOGGED_USER = null;

    // vymazanie mena
    localStorage.removeItem("loggedUserName");

    document.getElementById("googleSignInBtn").style.display = "inline-block";
    document.getElementById("googleSignOutBtn").style.display = "none";

    alert("Signed out");
};
