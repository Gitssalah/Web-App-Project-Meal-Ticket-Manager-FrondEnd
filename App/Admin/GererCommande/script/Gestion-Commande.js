var dataTable;
var selectedCommande;

async function populateTable() {
  try {
    disableButtons();
    const response = await fetch('http://localhost:8955/API/Commande/extraireToutesCommandes');
    if (!response.ok) {
      response.json().then(data => {
        toastr.error(data.exception, 'ERREUR');
      });
    }
    dataTable = await response.json();
    console.log("dataTable",dataTable);
    dataTable.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
    const commandesTable = document.getElementById('commandesTable').getElementsByTagName('tbody')[0];
    commandesTable.innerHTML = '';
    dataTable.forEach(commande => {
      row = commandesTable.insertRow();
      row.innerHTML = `
      <td><input type="checkbox" id="selectCommande" onclick="selectCommande(this, ${commande.reference})"></td>
      <td>${commande.reference}</td>
      <td>${commande.nomEmployeur}</td>
      <td>${formatDate(commande.dateCreation)}</td>
      <td>${parseEtat(commande.etat)}</td>
      <td><button onclick="consulterFacture(${commande.reference})" class="${commande.factureId ? 'buttons btnConsulterFacture ' : 'disabledButton'}" ${commande.factureId ? '' : 'disabled'}>Consulter</button></td>  `;
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
function disableButtons() {
  const buttons = document.querySelectorAll('.buttons button');
  buttons.forEach(button => {
    button.disabled = true;
    button.className = 'disabledButton';
  });
}

function selectCommande(checkbox, reference) {
  if (checkbox.checked) {
    selectedCommande = searchCommandeByReference(dataTable, reference);
    const otherCommandeRows = document.querySelectorAll('input[type="checkbox"][id="selectCommande"]:checked');
    otherCommandeRows.forEach(row => {
      if (row !== checkbox) {
        row.checked = false;
      }
    });
    enableButtons();
  } else {
    selectedCommande = null;
    disableButtons();
  }
}

function enableButtons() {
  const consulterButton = document.getElementById('btnConsulterCommande');
  consulterButton.disabled = false;
  consulterButton.classList.remove('disabledButton');
  const executerTraitementButton = document.getElementById('btnExecuterCommande');
  if (selectedCommande.etat == 'ENCOURSDETRAITEMENT') {
    executerTraitementButton.disabled = false;
    executerTraitementButton.classList.remove('disabledButton');
  } else {
    executerTraitementButton.disabled = true;
    executerTraitementButton.className = 'disabledButton';
  }
}
function parseEtat(etat) {
  if (etat == 'ENCOURSDETRAITEMENT') {
    return 'EN COURS DE TRAITEMENT';
  }
  return etat;
}
function searchCommandeByReference(list, reference) {
  return list.find(obj => obj.reference === reference);
}

function consulter() {
  const content = `
  <br>
  <div style="display: flex; text-align: left">
    <div style="flex: 1;">
      <p><strong>Référence:</strong> ${selectedCommande.reference}</p>
      <p><strong>Nombre salariés:</strong> ${selectedCommande.nombreSalaries}</p>
      <p><strong>Plafond quotidien:</strong> ${selectedCommande.plafondQuotidien}</p>
      <p><strong>État:</strong> ${parseEtat(selectedCommande.etat)}</p>
    </div>
    <div style="flex: 1;">
      <p><strong>Nom d'Employeur:</strong> ${selectedCommande.nomEmployeur}</p>
      <p><strong>Numéro d'Employeur:</strong> ${selectedCommande.employeurId}</p>
      <p><strong>Date de création:</strong> ${formatDate(selectedCommande.dateCreation)}</p>
    </div>
  </div>
`;
  Swal.fire({
    title: `Détails de la commande: ${selectedCommande.reference}`,
    html: content,
    icon: 'info',
    confirmButtonText: 'OK'
  });
}

async function executerCommande() {
  const url = `http://localhost:8955/API/Commande/executerCommande/${selectedCommande.reference}`;
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
    console.error("Erreur lors de l'exécution de la commande:", error);
  }
}

// Fonction asynchrone pour consulter la facture associée à une commande
async function consulterFacture(referenceCommande) {
  try {
    // Effectue une requête pour obtenir les détails de la facture associée à la commande
    const response = await fetch(`http://localhost:8955/API/Facture/getFacture/${referenceCommande}`);
    const data = await response.json(); // Convertit la réponse en JSON

    // Vérifie si la requête a réussi (statut HTTP 200)
    if (response.ok) {
      const facture = data.facture; // Récupère les détails de la facture depuis les données reçues
      // Affiche les détails de la facture dans une boîte de dialogue modale
      Swal.fire({
        title: `Détails de la facture de la commande ${referenceCommande}`,
        // Affiche différents détails de la facture dans le contenu HTML de la boîte de dialogue
        html: `
          <br>
          <div style="display: flex; text-align: left">
            <div style="flex: 1;">
              <p><strong>Montant total:</strong> ${facture.coutTotal}</p>
              <p><strong>Date de facturation:</strong> ${formatDate(facture.commande.dateCreation)}</p>
              <p><strong>Commande associée:</strong> ${facture.commande.reference}</p>
            </div>
            <div style="flex: 1;">
              <p><strong>Nombre de salariés:</strong> ${facture.commande.nombreSalaries}</p>
              <p><strong>Plafond quotidien des salariés:</strong> ${facture.commande.plafondQuotidien}</p>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    } else {
      // Si la requête n'a pas réussi, affiche une erreur
      toastr.error(data.exception, 'ERREUR');
    }
  } catch (error) {
    // Si une erreur se produit pendant le traitement de la requête, affiche une erreur
    console.error("Erreur lors de la récupération des détails de la facture:", error);
    toastr.error('Une erreur s\'est produite lors de la récupération des détails de la facture.', 'ERREUR');
  }
}