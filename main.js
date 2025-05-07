import { setScreen } from "./screen.js";
import { displaySubMenu } from "./menuManager.js";
import { siteData } from "./data.js";

function initializeApp() {
  setScreen("<h1>Bem-vindo!</h1><p>Selecione uma opção no menu.</p>"); // Initial screen content

  const navLinks = document.querySelectorAll("#menu-list a[data-category]");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const category = link.dataset.category;
      const itemsToShow = siteData[category];

      displaySubMenu(itemsToShow, (selectedItemData) => {
        console.log("Callback in main.js received:", selectedItemData);
        // This callback is executed when a sub-menu item is clicked
        if (
          selectedItemData &&
          typeof selectedItemData.content !== "undefined"
        ) {
          console.log(
            "Calling setScreen with content:",
            selectedItemData.content
          );
          setScreen(selectedItemData.content);
        } else {
          console.error(
            "Error: selectedItemData or selectedItemData.content is missing or undefined.",
            selectedItemData
          );
          setScreen("Error: Conteúdo não encontrado para este item."); // Display an error message on screen
        }
      });
    });
  });
}

// Call the function after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);
