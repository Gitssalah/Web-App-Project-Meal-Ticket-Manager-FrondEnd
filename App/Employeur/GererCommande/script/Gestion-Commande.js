function updateSliderValue(value) {
  document.getElementById('effectifValue').innerText = value;
}
function telechargerTemplateListeSalaries() {
  fetch('http://localhost:8955/API/Salarie/telechargerTemplateListeSalaries')
    .then(response => {
      if (!response.ok) {
        response.json().then(data => {
          console.log(data);
          toastr.error(data.exception, 'ERREUR');
        });
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'TemplatelisteSalaries.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
}

async function populateTable() {
  try {
    const userID = localStorage.getItem('userID');
    const response = await fetch('http://localhost:8955/API/Commande/extraireToutesCommandesByIdEmployeur/' + userID);
    if (!response.ok) {
      response.json().then(data => {
        toastr.error(data.exception, 'ERREUR');
      });
    }
    dataTable = await response.json();
    dataTable.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
    const commandesTable = document.getElementById('commandesTable').getElementsByTagName('tbody')[0];
    commandesTable.innerHTML = '';
    dataTable.forEach(commande => {
      row = commandesTable.insertRow();
      row.innerHTML = `
      <td>${commande.reference}</td>
      <td>${formatDate(commande.dateCreation)}</td>
      <td>${parseEtat(commande.etat)}</td>
      <td><button onclick="consulterFacture(${commande.reference})" class="${commande.factureId ? 'buttons btnConsulterFacture ' : 'disabledButton'}" ${commande.factureId ? '' : 'disabled'}>Consulter</button></td>  `;
    });
  } catch (error) {
    console.log(error);
  }
}

populateTable();

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

function parseEtat(etat) {
  if (etat == 'ENCOURSDETRAITEMENT') {
    return 'EN COURS DE TRAITEMENT';
  }
  return etat;
}
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

function submitForm(event) {
  event.preventDefault();
  const fileInput = document.getElementById('listeSalaries');
  const file = fileInput.files[0];
  if (file) {
    try {
      processExcelContent(file);
    } catch (error) {
      toastr.error(error.message, 'ERREUR');
    }
  } else {
    toastr.error('Aucun fichier sélectionné.', 'ERREUR');
  }
}

async function processExcelContent(file) {
  const reader = new FileReader();
  reader.onload = async function (event) {
    const content = event.target.result;
    const workbook = XLSX.read(content, { type: 'binary' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const requiredColumns = ['Nom Salarié', 'Prénom Salarié', 'Email', 'Téléphone', 'Forfait journalier', 'Poste'];
    const firstRow = jsonData[0];
    const missingColumns = requiredColumns.filter(column => !firstRow.includes(column));
    if (missingColumns.length > 0) {
      toastr.error('Il manque des colonnes obligatoires dans le fichier Excel:' + missingColumns.join(', '), 'ERREUR');
      return;
    }
    const slider = document.getElementById('plafondQuotidien');
    const sliderValue = slider.value;
    const salaries = [];
    var showErrorPopup=false;
    const dataSize= jsonData.slice(1).filter(row => row.some(cell => cell !== '' && cell !== undefined)).length;
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Votre fichier excel comporte "+dataSize+" salariés",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Annuler',
      confirmButtonText: 'Oui, je crée la commande'
    }).then(async (result) => {
      if (result.isConfirmed) {
        for (const row of jsonData.slice(1).filter(row => row.some(cell => cell !== '' && cell !== undefined))) {
          const email = row[firstRow.indexOf('Email')];
          try {
            const response = await fetch('http://localhost:8955/API/CheckEmail/' + email, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (!response.ok) {
              response.json().then(data => {
                if(!showErrorPopup){
                  toastr.error(data.exception, 'ERREUR');
                  showErrorPopup=true;
                  throw new Error(data.exception);
                }
              });
            }
            else {
              data = await response.json();
              if (!data.emailDisponible && !showErrorPopup) {
                toastr.error("L'adresse mail " + email + " existe déjà", 'ERREUR');
                showErrorPopup=true;
                throw new Error("L'adresse mail " + email + " existe déjà");
              }
              else{
                salaries.push({
                  "nom": row[firstRow.indexOf('Nom Salarié')],
                  "prenom": row[firstRow.indexOf('Prénom Salarié')],
                  "email": email,
                  "telephone": row[firstRow.indexOf('Téléphone')].toString(),
                  "forfaitJournalier": row[firstRow.indexOf('Forfait journalier')],
                  "poste": row[firstRow.indexOf('Poste')]
                });
              }
            }
          }
          catch (error) {
            console.error(error);
            salaries=[];
          }
        }
        creerCommande(sliderValue, salaries);
      }
    });
  };
  reader.readAsBinaryString(file);

}

function creerCommande(plafondQuotidien, salaries) {
  if(salaries.length>0){
    const form = document.getElementById('form');
    const userID = localStorage.getItem('userID');
    const commande = {
      "idEmployeur": userID,
      "plafondQuotidien": plafondQuotidien,
      "salaries": salaries
    };
    const jsonDataString = JSON.stringify(commande);
    const backendUrl = 'http://localhost:8955/API/Commande/creerCommande';
    fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonDataString
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.message) {
          populateTable();
          form.reset();
          toastr.success(data.message, 'SUCCÈS');
        }
        else {
          toastr.error(data.exception, 'ERREUR');
        }
      });
  }
}