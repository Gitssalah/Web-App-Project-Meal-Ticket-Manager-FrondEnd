var dataTable;
var selectedcomptes;
async function afficherUtilisateurs() {
  try {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.error('Token JWT non trouvé dans le localStorage.');
      return;
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await fetch('http://localhost:8955/API/Administrateur/Afficher', requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur lors de la récupération des utilisateurs:', errorData);
      return;
    }

    dataTable = await response.json();
    const comptesTable = document.getElementById('comptesTable').getElementsByTagName('tbody')[0];
    comptesTable.innerHTML = '';
    
    dataTable.forEach(demande => {
      const row = comptesTable.insertRow();
      row.innerHTML = `
        <td><input type="checkbox" id="selectComptes" onclick="selectComptes(this, ${demande.id})"></td>
        <td>${demande.id}</td>
        <td>${demande.nom}</td>
        <td>${demande.prenom}</td>
        <td>${demande.email}</td>
        <td>${demande.role}</td>
      `;
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
  }
}

afficherUtilisateurs();

function selectComptes(checkbox, demandeID) {
  if (checkbox.checked) {
    selectedcomptes = searchDemandeById(dataTable, demandeID);
    const otherComptesRows = document.querySelectorAll('input[type="checkbox"][id="selectComptes"]:checked');
    otherComptesRows.forEach(row => {
      if (row !== checkbox) {
        row.checked = false;
      }
    });
  }
}

function searchDemandeById(list, id) {
  return list.find(obj => obj.id === id);
}


function modifierCompte() {
  if (selectedcomptes.role === "ADMINISTRATEUR") {
    const content = `
      <br>
      <div style="display: flex; text-align: left">
        <div style="flex: 1;">
          <label for="identifiant">Identifiant:</label>
          <input type="text" id="identifiant" value="${selectedcomptes.id}" disabled><br><br>
          <label for="nom">Nom:</label>
          <input type="text" id="nom" value="${selectedcomptes.nom}"><br><br>
          <label for="prenom">Prénom:</label>
          <input type="text" id="prenom" value="${selectedcomptes.prenom}"><br><br>
        </div>
        <div style="flex: 1;">
          <label for="email">Email:</label>
          <input type="email" id="email" value="${selectedcomptes.email}" disabled><br><br>
          <label for="telephone">Téléphone:</label>
          <input type="text" id="telephone" value="${selectedcomptes.telephone}"><br><br>
          <label for="service">Service:</label>
          <input type="text" id="service" value="${selectedcomptes.service}"><br><br>
        </div>
      </div>
    `;

    Swal.fire({
      title: `Modification du compte Administrateur : ${selectedcomptes.id}`,
      html: content,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('email').value;
        const telephone = document.getElementById('telephone').value;
        const service = document.getElementById('service').value;

        const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.error('Token JWT non trouvé dans le localStorage.');
      return;
    }
        const url = 'http://localhost:8955/API/Administrateur/Modification/ModifAdmin';
        const data = {
          id: selectedcomptes.id,
          nom: nom,
          prenom: prenom,
          email: email,
          telephone: telephone,
          service: service
        };

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        })
        .then(data => {
          afficherUtilisateurs();
          Swal.fire({
            title: 'Succès',
            text: 'Les modifications ont été enregistrées avec succès.',
            icon: 'success'
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
            icon: 'error'
          });
        });
      }
    });
  }

  
 if (selectedcomptes.role === "EMPLOYEUR") {
    const content = `
      <br>
      <div style="display: flex; text-align: left">
        <div style="flex: 1;">
          <label for="identifiant">Identifiant:</label>
          <input type="text" id="identifiant" value="${selectedcomptes.id}" disabled><br><br>
          <label for="nom">Nom:</label>
          <input type="text" id="nom" value="${selectedcomptes.nom}"><br><br>
          <label for="prenom">Prénom:</label>
          <input type="text" id="prenom" value="${selectedcomptes.prenom}"><br><br>
          <label for="email">Email:</label>
          <input type="email" id="email" value="${selectedcomptes.email}"disabled><br><br>
          <label for="nomEntreprise">Nom entreprise:</label>
          <input type="text" id="nomEntreprise" value="${selectedcomptes.nomEntreprise}"><br><br>
          <label for="nomEntreprise">Telephone:</label>
          <input type="text" id="telephone" value="${selectedcomptes.telephone}"><br><br>
          </div>
          <div style="flex: 1;">
          <label for="raisonSociale">Raison sociale:</label>
          <input type="text" id="raisonSociale" value="${selectedcomptes.raisonSociale}"><br><br>
          <label for="numSiret">SIRET:</label>
          <input type="text" id="numSiret" value="${selectedcomptes.numSiret}"><br><br>
          <label for="codePostal">Code Postal:</label>
          <input type="text" id="codePostal" value="${selectedcomptes.codePostal}"><br><br>
          <label for="adresse">Adresse:</label>
          <input type="text" id="adresse" value="${selectedcomptes.adresse}"><br><br>
          <label for="effectif">Effectif:</label>
          <input type="text" id="effectif" value="${selectedcomptes.effectif}"><br><br>
        </div>
      </div>
    `;

    Swal.fire({
      title: `Modification du compte Employeur : ${selectedcomptes.id}`,
      html: content,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('email').value;
        const telephone = document.getElementById('telephone').value;
        const nomEntreprise = document.getElementById('nomEntreprise').value;
        const raisonSociale = document.getElementById('raisonSociale').value;
        const numSiret = document.getElementById('numSiret').value;
        const codePostal = document.getElementById('codePostal').value;
        const adresse = document.getElementById('adresse').value;
        const effectif = document.getElementById('effectif').value;

        const token = localStorage.getItem('jwtToken');

        if (!token) {
          console.error('Token JWT non trouvé dans le localStorage.');
          return;
        }
            const url = 'http://localhost:8955/API/Administrateur/Modification/ModifEmployeur';
            const data = {
              id: selectedcomptes.id,
              nom: nom,
              prenom: prenom,
              email: email,
              telephone: telephone,
              nomEntreprise : nomEntreprise,
              raisonSociale : raisonSociale,
              numSiret : numSiret,
              codePostal : codePostal,
              adresse : adresse,
              effectif : effectif
            };
    
            fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
            })
            .then(data => {
              afficherUtilisateurs();
              Swal.fire({
                title: 'Succès',
                text: 'Les modifications ont été enregistrées avec succès.',
                icon: 'success'
              });
            })
            .catch(error => {
              Swal.fire({
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
                icon: 'error'
              });
            });
          }
        });
      }
      if (selectedcomptes.role === "COMMERCANT") {
        const content = `
          <br>
          <div style="display: flex; text-align: left">
            <div style="flex: 1;">
              <label for="identifiant">Identifiant:</label>
              <input type="text" id="identifiant" value="${selectedcomptes.id}" disabled><br><br>
              <label for="nom">Nom:</label>
              <input type="text" id="nom" value="${selectedcomptes.nom}"><br><br>
              <label for="prenom">Prénom:</label>
              <input type="text" id="prenom" value="${selectedcomptes.prenom}"><br><br>
              <label for="email">Email:</label>
              <input type="email" id="email" value="${selectedcomptes.email}"disabled><br><br>
              <label for="nomEntreprise">Nom entreprise:</label>
              <input type="text" id="nomEntreprise" value="${selectedcomptes.nomEntreprise}"><br><br>
              </div>
              <div style="flex: 1;">
              <label for="nomEntreprise">Telephone:</label>
              <input type="text" id="telephone" value="${selectedcomptes.telephone}"><br><br>
              <label for="raisonSociale">Raison sociale:</label>
              <input type="text" id="raisonSociale" value="${selectedcomptes.raisonSociale}"><br><br>
              <label for="numSiret">SIRET:</label>
              <input type="text" id="numSiret" value="${selectedcomptes.numSiret}"><br><br>
              <label for="codePostal">Code Postal:</label>
              <input type="text" id="codePostal" value="${selectedcomptes.codePostal}"><br><br>
              <label for="adresse">Adresse:</label>
              <input type="text" id="adresse" value="${selectedcomptes.adresse}"><br><br>
            </div>
          </div>
        `;
    
        Swal.fire({
          title: `Modification du compte Employeur : ${selectedcomptes.id}`,
          html: content,
          showCancelButton: true,
          confirmButtonText: 'Enregistrer',
          cancelButtonText: 'Annuler',
          preConfirm: () => {
            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const email = document.getElementById('email').value;
            const telephone = document.getElementById('telephone').value;
            const nomEntreprise = document.getElementById('nomEntreprise').value;
            const raisonSociale = document.getElementById('raisonSociale').value;
            const numSiret = document.getElementById('numSiret').value;
            const codePostal = document.getElementById('codePostal').value;
            const adresse = document.getElementById('adresse').value;
    
            const token = localStorage.getItem('jwtToken');
    
            if (!token) {
              console.error('Token JWT non trouvé dans le localStorage.');
              return;
            }
                const url = 'http://localhost:8955/API/Administrateur/Modification/ModifCommercant';
                const data = {
                  id: selectedcomptes.id,
                  nom: nom,
                  prenom: prenom,
                  email: email,
                  telephone: telephone,
                  nomEntreprise : nomEntreprise,
                  raisonSociale : raisonSociale,
                  numSiret : numSiret,
                  codePostal : codePostal,
                  adresse : adresse
                };
        
                fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(data)
                })
                .then(data => {
                  afficherUtilisateurs();
                  Swal.fire({
                    title: 'Succès',
                    text: 'Les modifications ont été enregistrées avec succès.',
                    icon: 'success'
                  });
                })
                .catch(error => {
                  Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
                    icon: 'error'
                  });
                });
              }
            });
          }
          if (selectedcomptes.role === "SALARIE") {
            const content = `
              <br>
              <div style="display: flex; text-align: left">
                <div style="flex: 1;">
                  <label for="identifiant">Identifiant:</label>
                  <input type="text" id="identifiant" value="${selectedcomptes.id}" disabled><br><br>
                  <label for="nom">Nom:</label>
                  <input type="text" id="nom" value="${selectedcomptes.nom}"><br><br>
                  <label for="prenom">Prénom:</label>
                  <input type="text" id="prenom" value="${selectedcomptes.prenom}"><br><br>
                </div>
                <div style="flex: 1;">
                  <label for="email">Email:</label>
                  <input type="email" id="email" value="${selectedcomptes.email}" disabled><br><br>
                  <label for="telephone">Téléphone:</label>
                  <input type="text" id="telephone" value="${selectedcomptes.telephone}"><br><br>
                  <label for="poste">POSTE:</label>
                  <input type="text" id="poste" value="${selectedcomptes.poste}"><br><br>
                  <label for="forfaitJournalier">Forfait Journalier:</label>
                  <input type="text" id="forfaitJournalier" value="${selectedcomptes.forfaitJournalier}"><br><br>
                </div>
              </div>
            `;
        
            Swal.fire({
              title: `Modification du compte Administrateur : ${selectedcomptes.id}`,
              html: content,
              showCancelButton: true,
              confirmButtonText: 'Enregistrer',
              cancelButtonText: 'Annuler',
              preConfirm: () => {
                const nom = document.getElementById('nom').value;
                const prenom = document.getElementById('prenom').value;
                const email = document.getElementById('email').value;
                const telephone = document.getElementById('telephone').value;
                const poste = document.getElementById('poste').value;
                const forfaitJournalier = document.getElementById('forfaitJournalier').value;
        
                const token = localStorage.getItem('jwtToken');
        
            if (!token) {
              console.error('Token JWT non trouvé dans le localStorage.');
              return;
            }
                const url = 'http://localhost:8955/API/Administrateur/Modification/ModifSalarie';
                const data = {
                  id: selectedcomptes.id,
                  nom: nom,
                  prenom: prenom,
                  email: email,
                  telephone: telephone,
                  poste: poste,
                  forfaitJournalier: forfaitJournalier
                };
        
                fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(data)
                })
                .then(data => {
                  afficherUtilisateurs();
                  Swal.fire({
                    title: 'Succès',
                    text: 'Les modifications ont été enregistrées avec succès.',
                    icon: 'success'
                  });
                })
                .catch(error => {
                  Swal.fire({
                    title: 'Erreur',
                    text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
                    icon: 'error'
                  });
                });
              }
            });
          }
    
    
    }

    function creerCompte() {
      Swal.fire({
          title: 'Choisir le type de compte',
          html:
          `<div>
              <button id="employeurBtn" class="swal2-confirm swal2-styled" style="background-color: #2196F3;">Employeur</button>
              <button id="administrateurBtn" class="swal2-confirm swal2-styled" style="background-color: #2196F3;">Administrateur</button>
              <button id="commercantBtn" class="swal2-confirm swal2-styled" style="background-color: #2196F3;">Commerçant</button>
          </div>`,
          showCloseButton: true,
          cancelButtonText:'Annuler',
          showCancelButton: true,
          showConfirmButton: false,
          focusConfirm: false,
          focusCancel: false,
          focusDeny: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,          didOpen: () => {
              const employeurBtn = document.getElementById('employeurBtn');
              const administrateurBtn = document.getElementById('administrateurBtn');
              const commercantBtn = document.getElementById('commercantBtn');
  
              employeurBtn.addEventListener('click', () => {
                  Swal.close();
                  traiterChoix('EMPLOYEUR');
              });
  
              administrateurBtn.addEventListener('click', () => {
                  Swal.close();
                  traiterChoix('ADMINISTRATEUR');
              });
  
              commercantBtn.addEventListener('click', () => {
                  Swal.close();
                  traiterChoix('COMMERCANT');
              });
          }
      });
  }
  
  function traiterChoix(choix) {
    if(choix === 'ADMINISTRATEUR'){

      const content = `
      <br>
      <div style="display: flex; text-align: left">
        <div style="flex: 1;">
          <label for="nom">Nom:</label>
          <input type="text" id="nom"><br><br>
          <label for="prenom">Prénom:</label>
          <input type="text" id="prenom"><br><br>
          <label for="mdp">Mot de passe:</label>
          <input type="text" id="mdp"><br><br>
        </div>
        <div style="flex: 1;">
          <label for="email">Email:</label>
          <input type="email" id="email"><br><br>
          <label for="telephone">Téléphone:</label>
          <input type="text" id="telephone" ><br><br>
          <label for="service">Service:</label>
          <input type="text" id="service"><br><br>
        </div>
      </div>
    `;

    Swal.fire({
      title: `Création d'un compte Administrateur`,
      html: content,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('email').value;
        const telephone = document.getElementById('telephone').value;
        const service = document.getElementById('service').value;
        const mdp = document.getElementById('mdp').value;

        const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.error('Token JWT non trouvé dans le localStorage.');
      return;
    }
        const url = 'http://localhost:8955/API/Administrateur/Creation/inscription';
        const data = {
          mdp : mdp,
          nom: nom,
          prenom: prenom,
          email: email,
          telephone: telephone,
          service: service
        };

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        })
        .then(data => {
          afficherUtilisateurs();
          Swal.fire({
            title: 'Succès',
            text: 'Les modifications ont été enregistrées avec succès.',
            icon: 'success'
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
            icon: 'error'
          });
        });
      }
    });

      }

      else if(choix === 'COMMERCANT'){

        const content = `
        <br>
        <div style="display: flex; text-align: left">
          <div style="flex: 1;">
            <label for="mdp">Mot de passe:</label>
            <input type="text" id="mdp" ><br><br>
            <label for="nom">Nom:</label>
            <input type="text" id="nom"><br><br>
            <label for="prenom">Prénom:</label>
            <input type="text" id="prenom"><br><br>
            <label for="email">Email:</label>
            <input type="email" id="email" value=><br><br>
            <label for="nomEntreprise">Nom entreprise:</label>
            <input type="text" id="nomEntreprise" ><br><br>
            </div>
            <div style="flex: 1;">
            <label for="nomEntreprise">Telephone:</label>
            <input type="text" id="telephone" ><br><br>
            <label for="raisonSociale">Raison sociale:</label>
            <input type="text" id="raisonSociale" ><br><br>
            <label for="numSiret">SIRET:</label>
            <input type="text" id="numSiret"><br><br>
            <label for="codePostal">Code Postal:</label>
            <input type="text" id="codePostal" ><br><br>
            <label for="adresse">Adresse:</label>
            <input type="text" id="adresse" ><br><br>
          </div>
        </div>
      `;
  
      Swal.fire({
        title: `Création d'un compte Commercant`,
        html: content,
        showCancelButton: true,
        confirmButtonText: 'Enregistrer',
        cancelButtonText: 'Annuler',
        preConfirm: () => {
          const nom = document.getElementById('nom').value;
          const prenom = document.getElementById('prenom').value;
          const email = document.getElementById('email').value;
          const telephone = document.getElementById('telephone').value;
          const nomEntreprise = document.getElementById('nomEntreprise').value;
          const raisonSociale = document.getElementById('raisonSociale').value;
          const numSiret = document.getElementById('numSiret').value;
          const codePostal = document.getElementById('codePostal').value;
          const adresse = document.getElementById('adresse').value;
          const mdp = document.getElementById('mdp').value;
  
          const token = localStorage.getItem('jwtToken');
  
      if (!token) {
        console.error('Token JWT non trouvé dans le localStorage.');
        return;
      }
          const url = 'http://localhost:8955/API/Commercant/creer';
          const data = {
            mdp : mdp,
            nom: nom,
            prenom: prenom,
            email: email,
            telephone: telephone,
            nomEntreprise : nomEntreprise,
            raisonSociale : raisonSociale,
            numSiret : numSiret,
            codePostal : codePostal,
            adresse : adresse
          };
  
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })
          .then(data => {
            afficherUtilisateurs();
            Swal.fire({
              title: 'Succès',
              text: 'Les modifications ont été enregistrées avec succès.',
              icon: 'success'
            });
          })
          .catch(error => {
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
              icon: 'error'
            });
          });
        }
      });
  
        }

        else if(choix === 'EMPLOYEUR'){

          const content = `
          <br>
          <div style="display: flex; text-align: left">
            <div style="flex: 1;">
              <label for="mdp">Mot de passe:</label>
              <input type="text" id="mdp"><br><br>
              <label for="nom">Nom:</label>
              <input type="text" id="nom"><br><br>
              <label for="prenom">Prénom:</label>
              <input type="text" id="prenom"><br><br>
              <label for="email">Email:</label>
              <input type="email" id="email" value=><br><br>
              <label for="nomEntreprise">Nom entreprise:</label>
              <input type="text" id="nomEntreprise" ><br><br>
              <label for="effectif">Effectif:</label>
              <input type="text" id="effectif"><br><br>
              </div>
              <div style="flex: 1;">
              <label for="nomEntreprise">Telephone:</label>
              <input type="text" id="telephone" ><br><br>
              <label for="raisonSociale">Raison sociale:</label>
              <input type="text" id="raisonSociale" ><br><br>
              <label for="numSiret">SIRET:</label>
              <input type="text" id="numSiret"><br><br>
              <label for="codePostal">Code Postal:</label>
              <input type="text" id="codePostal" ><br><br>
              <label for="adresse">Adresse:</label>
              <input type="text" id="adresse" ><br><br>
            </div>
          </div>
        `;
    
        Swal.fire({
          title: `Création d'un compte Employeur`,
          html: content,
          showCancelButton: true,
          confirmButtonText: 'Enregistrer',
          cancelButtonText: 'Annuler',
          preConfirm: () => {
            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const email = document.getElementById('email').value;
            const telephone = document.getElementById('telephone').value;
            const nomEntreprise = document.getElementById('nomEntreprise').value;
            const raisonSociale = document.getElementById('raisonSociale').value;
            const numSiret = document.getElementById('numSiret').value;
            const codePostal = document.getElementById('codePostal').value;
            const adresse = document.getElementById('adresse').value;
            const mdp = document.getElementById('mdp').value;
            const effectif = document.getElementById('effectif').value;
    
            const token = localStorage.getItem('jwtToken');
    
        if (!token) {
          console.error('Token JWT non trouvé dans le localStorage.');
          return;
        }
            const url = 'http://localhost:8955/API/Employeur/creer';
            const data = {
              mdp : mdp,
              nom: nom,
              prenom: prenom,
              email: email,
              telephone: telephone,
              nomEntreprise : nomEntreprise,
              raisonSociale : raisonSociale,
              numSiret : numSiret,
              codePostal : codePostal,
              adresse : adresse,
              effectif : effectif,
            };
    
            fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
            })
            .then(data => {
              afficherUtilisateurs();
              Swal.fire({
                title: 'Succès',
                text: 'Les modifications ont été enregistrées avec succès.',
                icon: 'success'
              });
            })
            .catch(error => {
              Swal.fire({
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
                icon: 'error'
              });
            });
          }
        });
    
          }
          if(choix === 'SALARIE'){

            const content = `
            <br>
            <div style="display: flex; text-align: left">
              <div style="flex: 1;">
                <label for="nom">Nom:</label>
                <input type="text" id="nom"><br><br>
                <label for="prenom">Prénom:</label>
                <input type="text" id="prenom"><br><br>
                <label for="mdp">Mot de passe:</label>
                <input type="text" id="mdp"><br><br>
              </div>
              <div style="flex: 1;">
                <label for="email">Email:</label>
                <input type="email" id="email"><br><br>
                <label for="telephone">Téléphone:</label>
                <input type="text" id="telephone" ><br><br>
                <label for="poste">Poste:</label>
                <input type="text" id="poste"><br><br>
                <label for="forfaitJournalier">Forfait Journalier:</label>
                <input type="text" id="forfaitJournalier"><br><br>
              </div>
            </div>
          `;
      
          Swal.fire({
            title: `Création d'un compte Salarie`,
            html: content,
            showCancelButton: true,
            confirmButtonText: 'Enregistrer',
            cancelButtonText: 'Annuler',
            preConfirm: () => {
              const nom = document.getElementById('nom').value;
              const prenom = document.getElementById('prenom').value;
              const email = document.getElementById('email').value;
              const telephone = document.getElementById('telephone').value;
              const poste = document.getElementById('poste').value;
              const mdp = document.getElementById('mdp').value;
              const forfaitJournalier = document.getElementById('forfaitJournalier').value;
      
              const token = localStorage.getItem('jwtToken');
      
          if (!token) {
            console.error('Token JWT non trouvé dans le localStorage.');
            return;
          }
              const url = 'http://localhost:8955/API/Salarie/creer';
              const data = {
                mdp : mdp,
                nom: nom,
                prenom: prenom,
                email: email,
                telephone: telephone,
                poste: poste,
                forfaitJournalier :forfaitJournalier
              };
      
              fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
              })
              .then(data => {
                afficherUtilisateurs();
                Swal.fire({
                  title: 'Succès',
                  text: 'Les modifications ont été enregistrées avec succès.',
                  icon: 'success'
                });
              })
              .catch(error => {
                Swal.fire({
                  title: 'Erreur',
                  text: 'Une erreur s\'est produite lors de l\'enregistrement des modifications.',
                  icon: 'error'
                });
              });
            }
          });
      
            }
    }
