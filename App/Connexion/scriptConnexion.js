function validateConnexion() {
    event.preventDefault();
    const connexionForm = document.getElementById('ConnexionForm');
    const connexionFormFields = connexionForm.querySelectorAll('input, textarea, select');
    let connexionDataIsValid = true;
    connexionForm.querySelectorAll('.error-message').forEach(errorMessage => {
      errorMessage.remove();
    });

      const connexionData = new FormData(connexionForm);
      const jsonData = {};
      for (const [key, value] of connexionData.entries()) {
        jsonData[key] = value;
      }

      fetch('http://localhost:8955/API/Connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 403) {
            throw new Error("Informations de connexion incorrectes. Veuillez réessayer.");
        } else {
            throw new Error("Une erreur s'est produite lors de la connexion.");
        }
    })
    .then(data => {
        const bearer = data.bearer;
        const ID = data.userID;
        console.log("Token JWT reçu :", bearer);
        localStorage.setItem('jwtToken', bearer);
        localStorage.setItem('userID', ID);
    
        const decodedToken = parseJwt(bearer);
        console.log("Informations du token JWT décodé :", decodedToken);
    
        // Redirection en fonction du rôle attribué dans le token
        if (decodedToken.roles === 'ROLE_EMPLOYEUR') {
            window.location.href = '../../App/Employeur/Espace-Employeur.html';
        } else if (decodedToken.roles === 'ROLE_COMMERCANT') {
            window.location.href = '../../App/Commercant/Espace-Commercant.html';
        } else if (decodedToken.roles === 'ROLE_ADMINISTRATEUR') {
            window.location.href = '../../App/Admin/Espace-Admin.html';}
            else if (decodedToken.roles === 'ROLE_SALARIE') {
                window.location.href = '../../App/Salarie/Espace-Salarie.html';}
                else {
            // Redirection par défaut si le rôle n'est pas reconnu
            window.location.href = 'App/index.html';
        }
    
        connexionForm.reset();
        toastr.success(data.message, 'SUCCÈS');
    })
    .catch(error => {
        console.error("Erreur lors de la requête :", error);
        toastr.error(error.message, 'ERREUR');
    });
    
    // Fonction pour décoder le token JWT
    function parseJwt(bearer) {
        try {
            const base64Url = bearer.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
    
            return JSON.parse(jsonPayload);
        } catch (error) {
            return {};
        }
    }
}