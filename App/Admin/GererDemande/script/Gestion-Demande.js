var dataTable;
var selectedDemandeEmployeur;
var selectedDemandeCommercant;
async function populateTable() {
  try {
    disableButtons(".buttonsEmployeur");
    disableButtons(".buttonsCommercant");
    const response = await fetch('http://localhost:8955/API/DemandeCreationCompte/extraireToutesDemandes');
    if (!response.ok) {
      response.json().then(data => {
        toastr.error(data.exception, 'ERREUR');
      });
    }
    dataTable = await response.json();
    dataTable.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
    const employersTable = document.getElementById('employersTable').getElementsByTagName('tbody')[0];
    const commercantsTable = document.getElementById('commercantsTable').getElementsByTagName('tbody')[0];
    employersTable.innerHTML = '';
    commercantsTable.innerHTML = '';
    dataTable.forEach(demande => {
      if (demande.demandeur == 'EMPLOYEUR') {
        row = employersTable.insertRow();
        row.innerHTML = `
        <td><input type="checkbox" id="selectEmployeur" onclick="selectDemandeEmployeur(this, ${demande.identifiant})"></td>
        <td>${demande.identifiant}</td>
        <td>${demande.nomEntreprise}</td>
        <td>${formatDate(demande.dateCreation)}</td>
        <td>${parseEtat(demande.etat)}</td>
    `;
      }
      else {
        row = commercantsTable.insertRow();
        row.innerHTML = `
        <td><input type="checkbox" id="selectCommercant" onclick="selectDemandeCommercant(this, ${demande.identifiant})"></td>
        <td>${demande.identifiant}</td>
        <td>${demande.nomEntreprise}</td>
        <td>${formatDate(demande.dateCreation)}</td>
        <td>${parseEtat(demande.etat)}</td>
    `;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

populateTable();

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return date.toLocaleString('fr-FR', options);
}
function consulterDemandeEmployeur() {
  const content = `
    <br>
    <div style="display: flex; text-align: left">
      <div style="flex: 1;">
        <p><strong>Identifiant:</strong> ${selectedDemandeEmployeur.identifiant}</p>
        <p><strong>Nom:</strong> ${selectedDemandeEmployeur.nom}</p>
        <p><strong>Prénom:</strong> ${selectedDemandeEmployeur.prenom}</p>
        <p><strong>Téléphone:</strong> ${selectedDemandeEmployeur.telephone}</p>
        <p><strong>Email:</strong> ${selectedDemandeEmployeur.email}</p>
        <p><strong>Adresse:</strong> ${selectedDemandeEmployeur.adresse}</p>
        <p><strong>Date de création:</strong> ${formatDate(selectedDemandeEmployeur.dateCreation)}</p>
      </div>
      <div style="flex: 1;">
        <p><strong>Raison sociale:</strong> ${selectedDemandeEmployeur.raisonSociale}</p>
        <p><strong>Nom de l'entreprise:</strong> ${selectedDemandeEmployeur.nomEntreprise}</p>
        <p><strong>Numéro SIRET:</strong> ${selectedDemandeEmployeur.numSiret}</p>
        <p><strong>Code postal:</strong> ${selectedDemandeEmployeur.codePostal}</p>
        <p><strong>Effectif:</strong> ${selectedDemandeEmployeur.effectif}</p>
        <p><strong>État:</strong> ${parseEtat(selectedDemandeEmployeur.etat)}</p>
      </div>
    </div>
`;

  Swal.fire({
    title: `Détails de la demande: ${selectedDemandeEmployeur.identifiant}`,
    html: content,
    icon: 'info',
    confirmButtonText: 'OK'
  });

}

function consulterDemandeCommercant() {
  const content = `
  <br>
  <div style="display: flex; text-align: left">
    <div style="flex: 1;">
      <p><strong>Identifiant:</strong> ${selectedDemandeCommercant.identifiant}</p>
      <p><strong>Nom:</strong> ${selectedDemandeCommercant.nom}</p>
      <p><strong>Prénom:</strong> ${selectedDemandeCommercant.prenom}</p>
      <p><strong>Téléphone:</strong> ${selectedDemandeCommercant.telephone}</p>
      <p><strong>Email:</strong> ${selectedDemandeCommercant.email}</p>
      <p><strong>Date de création:</strong> ${formatDate(selectedDemandeCommercant.dateCreation)}</p>
    </div>
    <div style="flex: 1;">
      <p><strong>Adresse:</strong> ${selectedDemandeCommercant.adresse}</p>
      <p><strong>Nom de l'entreprise:</strong> ${selectedDemandeCommercant.nomEntreprise}</p>
      <p><strong>Numéro SIRET:</strong> ${selectedDemandeCommercant.numSiret}</p>
      <p><strong>Code postal:</strong> ${selectedDemandeCommercant.codePostal}</p>
      <p><strong>État:</strong> ${parseEtat(selectedDemandeCommercant.etat)}</p>
    </div>
  </div>
`;
  Swal.fire({
    title: `Détails de la demande: ${selectedDemandeCommercant.identifiant}`,
    html: content,
    icon: 'info',
    confirmButtonText: 'OK'
  });

}

function validerDemandeEmployeur() {
  validerDemande(selectedDemandeEmployeur);
}
function validerDemandeCommercant() {
  validerDemande(selectedDemandeCommercant);
}

function rejeterDemandeEmployeur() {
  rejeterDemande(selectedDemandeEmployeur);
}
function rejeterDemandeCommercant() {
  rejeterDemande(selectedDemandeCommercant);
}
async function validerDemande(demande) {
  const userID = localStorage.getItem('userID');
  const url = `http://localhost:8955/API/DemandeCreationCompte/validerDemande/${userID}/${demande.identifiant}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      response.json().then(error => {
        toastr.error(error.exception, 'ERREUR');
      });
    }
    const responseData = await response.json();
    populateTable();
    toastr.success(responseData.message, 'SUCCÈS');
  } catch (error) {
    console.error('Erreur lors de la validation de la demande:', error);
  }
}

async function rejeterDemande(demande) {
  const userID = localStorage.getItem('userID');
  const url = `http://localhost:8955/API/DemandeCreationCompte/rejeterDemande/${userID}/${demande.identifiant}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      response.json().then(error => {
        toastr.error(error.exception, 'ERREUR');
      });
    }
    const responseData = await response.json();
    populateTable();
    toastr.success(responseData.message, 'SUCCÈS');
  } catch (error) {
    console.error('Erreur lors du rejet de la demande:', error);
  }
}

function selectDemandeEmployeur(checkbox, demandeID) {
  if (checkbox.checked) {
    selectedDemandeEmployeur = searchDemandeById(dataTable, demandeID);
    const otherEmployeurRows = document.querySelectorAll('input[type="checkbox"][id="selectEmployeur"]:checked');
    otherEmployeurRows.forEach(row => {
      if (row !== checkbox) {
        row.checked = false;
      }
    });
    enableButtons("EMPLOYEUR");
  } else {
    selectedDemandeEmployeur = null;
    disableButtons(".buttonsEmployeur");
  }
}

function selectDemandeCommercant(checkbox, demandeID) {
  if (checkbox.checked) {
    selectedDemandeCommercant = searchDemandeById(dataTable, demandeID);
    const otherCommercantsRows = document.querySelectorAll('input[type="checkbox"][id="selectCommercant"]:checked');
    otherCommercantsRows.forEach(row => {
      if (row !== checkbox) {
        row.checked = false;
      }
    });
    enableButtons("COMMERCANT");
  } else {
    selectedDemandeCommercant = null;
    disableButtons(".buttonsCommercant");
  }
}

function searchDemandeById(list, id) {
  return list.find(obj => obj.identifiant === id);
}

function parseEtat(etat) {
  if (etat == 'ENCOURSDETRAITEMENT') {
    return 'EN COURS DE TRAITEMENT';
  }
  return etat;
}

function enableButtons(demandeur) {
  if (demandeur == 'EMPLOYEUR') {
    const consulterButton = document.getElementById('btnConsulterEmployeur');
    consulterButton.disabled = false;
    consulterButton.classList.remove('disabledButton');
    const rejeterButton = document.getElementById('btnRejeterEmployeur');
    const validerButton = document.getElementById('btnValiderEmployeur');
    if (selectedDemandeEmployeur.etat == 'ENCOURSDETRAITEMENT') {
      rejeterButton.disabled = false;
      validerButton.disabled = false;
      rejeterButton.classList.remove('disabledButton');
      validerButton.classList.remove('disabledButton');
    }
    else {
      rejeterButton.disabled = true;
      validerButton.disabled = true;
      rejeterButton.className = 'disabledButton';
      validerButton.className = 'disabledButton';
    }
  }
  else {
    const consulterButton = document.getElementById('btnConsulterCommercant');
    consulterButton.disabled = false;
    consulterButton.classList.remove('disabledButton');
    const rejeterButton = document.getElementById('btnRejeterCommercant');
    const validerButton = document.getElementById('btnValiderCommercant');
    if (selectedDemandeCommercant.etat == 'ENCOURSDETRAITEMENT') {
      rejeterButton.disabled = false;
      validerButton.disabled = false;
      rejeterButton.classList.remove('disabledButton');
      validerButton.classList.remove('disabledButton');
    }
    else{
      rejeterButton.disabled = true;
      validerButton.disabled = true;
      rejeterButton.className = 'disabledButton';
      validerButton.className = 'disabledButton';
    }
  }
}

function disableButtons(buttonsSection) {
  const buttons = document.querySelectorAll(buttonsSection + ' button');
  buttons.forEach(button => {
    button.disabled = true;
    button.className = 'disabledButton';
  });
}