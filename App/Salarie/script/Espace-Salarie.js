"use strict";

// Fonction pour charger un script de manière asynchrone
function loadScript(src) {
  return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
  });
}

// Charger Chart.js de manière asynchrone
loadScript('https://cdn.jsdelivr.net/npm/chart.js')
  .then(() => {
      console.log('Chart.js loaded successfully');
      return loadScript('./SuivreSolde/script/SuivreSolde.js');
  })
  .then(() => {
      console.log('SuivreSolde.js loaded successfully');
      // Maintenant que les deux scripts sont chargés, exécutez le reste du code
      fetchData();
  })
  .catch((error) => {
      console.error('Error loading scripts:', error);
  });

import { displayRequestedPart } from '../../Shared/script/script.js'

const espaceUtilisateurBtn = document.getElementById("EspaceUtilisateur");
const suivreSoldeBtn = document.getElementById("SuivreSolde");
const deconnectionBtn=document.getElementById("Deconnection");
const partieDroite = document.querySelector(".partie-droite");
const detailsButton = document.querySelector('.details-button');

espaceUtilisateurBtn.addEventListener("click", function () {
  goToEspaceSalarie();
});

suivreSoldeBtn.addEventListener("click", function () {
  displayRequestedPart("SuivreSolde/SuivreSolde.html", partieDroite, "./SuivreSolde/script/SuivreSolde.js");
});

deconnectionBtn.addEventListener("click", function () {
  seDeconnecter();
});

detailsButton.addEventListener('click', function () {
  displayRequestedPart("SuivreSolde/SuivreSolde.html", partieDroite, "./SuivreSolde/script/SuivreSolde.js");
});

async function fetchData() {
  try {
    const userID = localStorage.getItem("userID");

    const totalSoldeResponse = await fetch(`http://localhost:8955/API/CarteVirtuelle/${userID}/solde`);
    const totalSoldeData = await totalSoldeResponse.json();

    if (!totalSoldeResponse.ok) {
      console.error("Error fetching total solde data:", totalSoldeData);
      throw new Error("Error fetching total solde data");
    }

    const totalSolde = totalSoldeData.solde;
    const numero= totalSoldeData.numero;

    const dailySoldeResponse = await fetch(`http://localhost:8955/API/CarteVirtuelle/${userID}/soldeJournalier`);
    const dailySoldeData = await dailySoldeResponse.json();

    if (!dailySoldeResponse.ok) {
      console.error("Error fetching daily solde data:", dailySoldeData);
      throw new Error("Error fetching daily solde data");
    }

    const dailySolde = dailySoldeData.soldeJournalier;
    const dailyLimit = dailySoldeData.plafondQuotidien;

    updateSoldeDisplay(totalSolde, dailySolde, dailyLimit, numero);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred while fetching data. Please try again.");
  }
}

function updateSoldeDisplay(totalSolde, dailySolde, dailyLimit, numero) {
  const numeroElement = document.querySelector(".numero");
  numeroElement.textContent = `Numéro de la carte: ${numero} `;

  const totalSoldElement = document.querySelector(".total-sold");
  totalSoldElement.textContent = `Solde total: ${totalSolde} €`;

  const dailySoldElement = document.querySelector(".daily-sold");
  dailySoldElement.textContent = `Solde du jour: ${dailySolde} € / ${dailyLimit} €`;
}

function goToEspaceSalarie() {
  window.location.href = "./Espace-Salarie.html";
}

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

fetchData();