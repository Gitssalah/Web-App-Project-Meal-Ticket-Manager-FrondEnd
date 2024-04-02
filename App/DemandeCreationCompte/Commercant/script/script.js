function validateForm() {
  event.preventDefault();
  const form = document.getElementById('Form');
  const formFields = form.querySelectorAll('input, textarea, select');
  let formIsValid = true;
  form.querySelectorAll('.error-message').forEach(errorMessage => {
    errorMessage.remove();
  });

  formFields.forEach(field => {
    if (!field.value.trim()) {
      formIsValid = false;
      const errorMessage = document.createElement('span');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'Ce champ est requis.';
      field.parentNode.appendChild(errorMessage);
      field.addEventListener('input', function () {
        errorMessage.remove();
      });
      field.addEventListener('textarea', function () {
        errorMessage.remove();
      });
    }
    if (field.type === 'email' && field.value != '' && !isValidEmail(field.value)) {
      formIsValid = false;
      const errorMessage = document.createElement('span');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'Veuillez saisir une adresse e-mail valide.';
      field.parentNode.appendChild(errorMessage);
      field.addEventListener('input', function () {
        errorMessage.remove();
      });
    }
  });
  toastr.options.positionClass = 'toast-top-left';
  if (!form.checkValidity()) {
    toastr.error("Veuillez remplir correctement tous les champs obligatoires", 'ERREUR');
    return;
  }

  const formData = new FormData(form);
  const jsonData = {};
  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }
  jsonData["demandeur"] = "COMMERCANT";

  // Send the POST request
  fetch('http://localhost:8955/API/DemandeCreationCompte/creerDemande', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonData)
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.message) {
        form.reset();
        toastr.success(data.message, 'SUCCÈS');
      }
      else {
        toastr.error(data.exception, 'ERREUR');
      }
    });
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}