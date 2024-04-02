"use strict";

const btnAnnuler = document.querySelector(".annuler");
const btnValider = document.querySelector(".valider");
const inputNum = document.querySelector("#numCarte");
const inputMon = document.querySelector("#montant");
const partieDroite = document.querySelector(".partie-droite");
const commercantId = localStorage.getItem("userID");
console.log(commercantId);

function afficherTransaction(url, element) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      element.innerHTML = html;
      const scriptElement = document.createElement("script");
      scriptElement.src = "./GererTransaction/script/Lecteur.js";
      document.body.appendChild(scriptElement);
    })
    .catch((error) => console.error("Error loading HTML:", error));
}
function handlerAnnuler() {
  inputNum.value = "";
  inputMon.value = "";
}

function ajouterTransaction(numCarte, montant) {
  return fetch("http://localhost:8955/API/Transaction/ajouterTransaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      numCarte: numCarte,
      montant: montant,
      commercantId: commercantId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      toastr.success("Transaction effectuée avec succès", "SUCCÈS");
      console.log("Transaction added successfully:", data);
    })
    .catch((error) => {
      toastr.error("Transaction échouée", "Erreur");
      console.error("Error adding transaction:", error);
    });
}
function verifierCarte(numDeCarte, montant) {
  return fetch(
    `http://localhost:8955/API/Transaction/verifierValiditerCarte/${numDeCarte}/${montant}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to verify transaction");
      }

      return response.json();
    })
    .then((data) => {
      if (data.isValid == true) {
        toastr.success("Vérification effectuée avec succès", "SUCCÈS");
      } else {
        toastr.error("Error de vérification", "ERREUR");
      }
      console.log("Transaction verified successfully:", data);
      return data;
    })
    .catch((error) => {
      throw new Error("Error in verification:", error);
    });
}
btnValider.addEventListener("click", function () {
  var numDeCarte = inputNum.value;
  var leMontant = inputMon.value;
  verifierCarte(numDeCarte, leMontant)
    .then((verificationResult) => {
      if (verificationResult.isValid) {
        const content= `
        <h3>Merci de bien vouloir confirmer les informations de la transaction</h3>
        <br />
        <div style="display: block">
          <p class="label" style="display: inline-block; margin-right: 5px">
            Numéro de la carte :
          </p>
          <p class="numCarte" style="display: inline-block">${numDeCarte}</p>
        </div>
      
        <br />
        <div style="display: block">
          <p class="label" style="display: inline-block; margin-right: 5px">
            Montant :
          </p>
          <div class="montantTransaction" style="display: inline-block">${leMontant}</div>
          <br />      
      `;
        Swal.fire({
          title: 'Êtes-vous sûr?',
          html: content,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText:'Annuler',
          confirmButtonText: 'Je confirme'
        }).then(async (result) => {
          if(result.isConfirmed){
            ajouterTransaction(numDeCarte, leMontant);
            handlerAnnuler();
          }
          else{
            handlerAnnuler();
          }
        });
      } else {
        Swal.fire("Transaction échouée, veuillez vérifier les données saisies");
        throw new Error("Transaction verification failed");
      }
    });
});

btnAnnuler.addEventListener("click", handlerAnnuler);
