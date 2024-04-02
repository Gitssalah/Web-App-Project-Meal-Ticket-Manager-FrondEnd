var dataTable;
var selectedCarteVirtuelle;
async function populateTable() {
    try {
        disableButtons();
      const response = await fetch('http://localhost:8955/API/CarteVirtuelle/extraireToutesCartes');
      if (!response.ok) {
        response.json().then(data => {
          toastr.error(data.exception, 'ERREUR');
        });
      }
      dataTable = await response.json();
      const carteVirtuelleTable = document.getElementById('CartesVirtuellesTable').getElementsByTagName('tbody')[0];
      carteVirtuelleTable.innerHTML = '';
      dataTable.forEach(carteVirtuelle => {
        row = carteVirtuelleTable.insertRow();
        row.innerHTML = `
        <td><input type="checkbox" id="selectCarteVirtuelle" onclick="selectCarteVirtuelle(this, ${carteVirtuelle.numeroCarte})"></td>
        <td>${carteVirtuelle.nom}</td>
        <td>${carteVirtuelle.prenom}</td>
        <td>${carteVirtuelle.employeur}</td>
        <td>${carteVirtuelle.numeroCarte}</td>
        <td>${parseEtat(carteVirtuelle.active)}</td> `;
      });
    } catch (error) {
      console.log(error);
    }
  }
  populateTable();

  function selectCarteVirtuelle(checkbox, numeroCarte) {
   if (checkbox.checked) {
      selectedCarteVirtuelle = searchCarteVirtuelleByNumero(dataTable, numeroCarte);
      const otherCarteVirtuelleRows = document.querySelectorAll('input[type="checkbox"][id="selectCarteVirtuelle"]:checked');
      otherCarteVirtuelleRows.forEach(row => {
        if (row !== checkbox) {
          row.checked = false;
        }
      });
      enableButtons();
    } else {
      selectedCarteVirtuelle = null;
      disableButtons();
    }
    
  }
  function parseEtat(active) {
    if (active == true) {
      return 'OUI';
    }
    return 'NON';
  }
  function searchCarteVirtuelleByNumero(list, numeroCarte) {
    return list.find(obj => obj.numeroCarte == numeroCarte);
  }
  function enableButtons() {
    const btnActiverCarteVirtuelle = document.getElementById('btnActiverCarteVirtuelle');
    const btnDesactiverCarteVirtuelle = document.getElementById('btnDesactiverCarteVirtuelle');
    if (selectedCarteVirtuelle.active == true) {
      btnActiverCarteVirtuelle.disabled = true;
      btnActiverCarteVirtuelle.className = 'disabledButton';
      btnDesactiverCarteVirtuelle.classList.remove('disabledButton');
      btnDesactiverCarteVirtuelle.disabled=false;
    } else {
        btnDesactiverCarteVirtuelle.disabled = true;
        btnDesactiverCarteVirtuelle.className = 'disabledButton';
        btnActiverCarteVirtuelle.classList.remove('disabledButton');
        btnActiverCarteVirtuelle.disabled=false;
    }
  }
  function disableButtons() {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
      button.disabled = true;
      button.className = 'disabledButton';
    });
  }

 async function activer(){
    const url = `http://localhost:8955/API/CarteVirtuelle/activerCarteVirtuelle/${selectedCarteVirtuelle.numeroCarte}`;
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
      console.error("Erreur lors de l'activation de la carte:", error);
    }
  }
  async function desactiver(){
    const url = `http://localhost:8955/API/CarteVirtuelle/desactiverCarteVirtuelle/${selectedCarteVirtuelle.numeroCarte}`;
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
      console.error("Erreur lors de la désactivation de la carte:", error);
    }
  }