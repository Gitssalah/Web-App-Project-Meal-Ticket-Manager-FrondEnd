"use strict";
import { displayRequestedPart } from "../../Shared/script/script.js";
const deconnectionBtn=document.getElementById("Deconnection");
const partieDroite = document.querySelector(".partie-droite");
const gererTransaction = document.getElementById("GererTransactions");
function afficherTransaction(url, element) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      element.innerHTML = html;

      const scriptElement = document.createElement("script");
      scriptElement.src = "./GererTransaction/script/Lecteur.js";

      // Append the script element to the document
      document.body.appendChild(scriptElement);
    })
    .catch((error) => console.error("Error loading HTML:", error));
}
gererTransaction.addEventListener("click", function () {
  afficherTransaction("./GererTransaction/lecteur.html", partieDroite);
});

deconnectionBtn.addEventListener("click", function () {
  seDeconnecter();
});
if (!isLoggedIn()) {
  window.location.href = "../Connexion/Connexion.html";
}
function isLoggedIn() {
  return localStorage.getItem("jwtToken") !== null;
}
function seDeconnecter(){
  localStorage.clear();
  window.location.href = "../Connexion/Connexion.html";
}
