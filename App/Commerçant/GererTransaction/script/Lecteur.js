"use strict";

const btnAnnuler = document.querySelector(".annuler");
const btnValider = document.querySelector(".valider");
const inputNum = document.querySelector("#numCarte");
const inputMon = document.querySelector("#montant");
const pageConfirmation = document.querySelector(".partie-droite");
function afficherTransaction(url, element) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      element.innerHTML = html;
    })
    .catch((error) => console.error("Error loading HTML:", error));
}
function handlerAnnuler() {
  inputNum.value = "";
  inputMon.value = "";
}
btnValider.addEventListener("click", function () {
  afficherTransaction("pageConfirmation.html", pageConfirmation);
});

btnAnnuler.addEventListener("click", handlerAnnuler);
