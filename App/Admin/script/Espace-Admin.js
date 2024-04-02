"use strict";
import { displayRequestedPart } from '../../Shared/script/script.js'
const gererCommandeBtn = document.getElementById("GererCommandes");
const gererDemandeBtn = document.getElementById("GererDemandesCreationCompte");
const gererComptesBtn = document.getElementById("GererComptes");
const gererComptePersoBtn = document.getElementById("ModifierCompte");
const gererCartesVirtuellesBtn = document.getElementById("GererCartesVirtuelles");
const deconnectionBtn=document.getElementById("Deconnection");
const partieDroite = document.querySelector(".partie-droite");

gererCommandeBtn.addEventListener("click", function () {
  displayRequestedPart("GererCommande/Gestion-Commande.html", partieDroite, "./GererCommande/script/Gestion-Commande.js");
});
gererDemandeBtn.addEventListener("click", function () {
  displayRequestedPart("GererDemande/Gestion-Demande.html", partieDroite, "./GererDemande/script/Gestion-Demande.js");
});
gererComptesBtn.addEventListener("click", function () {
  displayRequestedPart("GererComptes/Gerer-Comptes.html", partieDroite, "./GererComptes/script/Gerer-Comptes.js");
});
gererComptePersoBtn.addEventListener("click", function () {
  displayRequestedPart("GererComptePerso/Gerer-Compte-Perso.html", partieDroite, "./GererComptePerso/script/Gerer-Compte-Perso.js");
});
gererCartesVirtuellesBtn.addEventListener("click", function () {
  displayRequestedPart("GererCarteVirtuelle/Gerer-CarteVirtuelle.html", partieDroite, "./GererCarteVirtuelle/script/Gerer-CarteVirtuelle.js");
});
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
