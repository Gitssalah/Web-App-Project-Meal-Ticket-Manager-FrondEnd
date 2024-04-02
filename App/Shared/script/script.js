function displayRequestedPart(url, element, scriptPath) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        element.innerHTML = html;
        const scriptElement = document.createElement("script");
        scriptElement.src = scriptPath;
        document.body.appendChild(scriptElement);
      })
      .catch((error) => console.error("Error loading HTML:", error));
  }
  export{
    displayRequestedPart
  }