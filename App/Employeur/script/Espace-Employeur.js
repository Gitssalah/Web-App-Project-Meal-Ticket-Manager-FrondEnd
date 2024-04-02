"use strict";
import { displayRequestedPart } from '../../Shared/script/script.js'

const gererCommandeBtn = document.getElementById("GererCommandes");
const deconnectionBtn=document.getElementById("Deconnection");
const partieDroite = document.querySelector(".partie-droite");
gererCommandeBtn.addEventListener("click", function () {
  displayRequestedPart("GererCommande/Gestion-Commande.html", partieDroite, "./GererCommande/script/Gestion-Commande.js");
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