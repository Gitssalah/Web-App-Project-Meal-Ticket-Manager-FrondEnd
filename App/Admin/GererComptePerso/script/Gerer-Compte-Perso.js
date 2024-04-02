async function afficherCompte() {
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

        const response = await fetch('http://localhost:8955/API/Administrateur/Consultation', requestOptions);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur lors de la récupération des utilisateurs:', errorData);
            return;
        }


        const data = await response.json();
        console.log(data);


            document.getElementById('nom').value = data.nom;
            document.getElementById('prenom').value = data.prenom;
            document.getElementById('email').value = data.email;
            document.getElementById('telephone').value = data.telephone;
            document.getElementById('service').value = data.service;

    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
}

afficherCompte();

function modifierCompte(){

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

      const url = 'http://localhost:8955/API/Administrateur/Modification/ModifPerso';
      const data = {
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


}