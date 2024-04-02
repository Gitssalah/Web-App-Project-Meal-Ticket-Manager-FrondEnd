"use strict";
const gererTransaction = document.getElementById("GererTransaction");
const lecteur = document.querySelector(".partie-droite");
function afficherTransaction(url, element) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      element.innerHTML = html;

      const scriptElement = document.createElement("script");
      scriptElement.src = "./script/Lecteur.js";

      // Append the script element to the document
      document.body.appendChild(scriptElement);
    })
    .catch((error) => console.error("Error loading HTML:", error));
}

gererTransaction.addEventListener("click", function () {
  afficherTransaction("lecteur.html", lecteur);
});
