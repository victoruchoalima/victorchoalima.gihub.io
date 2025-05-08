import { setScreen } from "./screen.js";
import { displaySubMenu } from "./menuManager.js";

// initializeApp is now async
async function initializeApp() {
  // Initial screen content using a template
  // This call now needs to be awaited
  try {
    await setScreen(
      {
        title: "Bem-vindo!",
        text: "Selecione uma opção no menu para começar.",
      },
      "default-content-template"
    );
  } catch (error) {
    console.error("Failed to set initial screen:", error);
    // If templates fail to load, screen.js already handles showing an error.
    // If another error occurs here, it's logged.
    return; // Stop initialization if critical components fail
  }

  const navLinks = document.querySelectorAll("#menu-list a[data-category]");

  navLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const category = link.dataset.category;

      try {
        const response = await fetch(`data/${category}.json`);
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} for ${category}.json`
          );
        }
        const itemsToShow = await response.json();

        displaySubMenu(itemsToShow, async (selectedItemData) => {
          // Callback is now async
          console.log("Callback in main.js received:", selectedItemData);
          if (
            selectedItemData &&
            selectedItemData.data &&
            selectedItemData.templateId
          ) {
            // This call now needs to be awaited
            await setScreen(selectedItemData.data, selectedItemData.templateId);
          } else {
            console.error(
              "Error: selectedItemData is missing data or templateId.",
              selectedItemData
            );
            setScreen(
              {
                title: "Erro de Conteúdo",
                text: "Conteúdo não encontrado para este item.",
              },
              "default-content-template"
            );
          }
        });
      } catch (error) {
        console.error("Failed to fetch or process category data:", error);
        // Correctly await the setScreen call for displaying the error
        await setScreen(
          {
            title: "Erro ao Carregar Dados",
            text: `Não foi possível carregar os dados para "${category}". Por favor, tente novamente mais tarde.`,
          },
          "default-content-template"
        );
      }
    });
  });
}

// Call the function after the DOM is fully loaded
// If initializeApp is async and might reject, consider .catch()
document.addEventListener("DOMContentLoaded", () => {
  initializeApp().catch((error) => {
    console.error("Error during application initialization:", error);
    // Optionally display a user-friendly message on the page if init fails critically
    const screenElement = document.getElementById("screen");
    if (screenElement) {
      screenElement.innerHTML =
        "<h1>Falha na Inicialização</h1><p>Ocorreu um erro crítico ao iniciar a aplicação. Por favor, tente recarregar a página.</p>";
    }
  });
});
