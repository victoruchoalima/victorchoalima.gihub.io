const screenElement = document.getElementById("screen");

// Cache for loaded templates
const templatesCache = {};
let templatesLoaded = false;

// Function to load and cache templates from an external file
async function ensureTemplatesLoaded() {
  if (templatesLoaded) {
    return;
  }

  try {
    const response = await fetch("templates.html");
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} for templates.html`
      );
    }
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    doc.querySelectorAll("template").forEach((templateEl) => {
      if (templateEl.id) {
        templatesCache[templateEl.id] = templateEl.content;
      }
    });
    templatesLoaded = true;
  } catch (error) {
    console.error("Failed to load templates:", error);
    screenElement.innerHTML =
      "<h1>Erro Crítico</h1><p>Não foi possível carregar os componentes da interface. Tente recarregar a página.</p>";
    throw error; // Re-throw to stop further execution that depends on templates
  }
}

function renderDefaultContentTemplate(data, clone) {
  clone.querySelector("h1").textContent = data.title || "Título Indisponível";
  clone.querySelector("p").textContent = data.text || "Conteúdo indisponível.";
}

function renderProjectDetailTemplate(data, clone) {
  clone.querySelector("h1").textContent =
    data.title || "Título do Projeto Indisponível";
  const img = clone.querySelector("img");
  if (data.imageUrl) {
    img.src = data.imageUrl;
    img.alt = data.imageAlt || data.title || "Imagem do Projeto";
    img.style.display = ""; // Ensure it's visible
  } else {
    img.style.display = "none"; // Hide if no image URL
  }
  clone.querySelector("p.description").textContent =
    data.description || "Descrição não disponível.";
  clone.querySelector("p.technologies span").textContent = (
    data.technologies || []
  ).join(", ");
}

const templateRenderers = {
  "default-content-template": renderDefaultContentTemplate,
  "project-detail-template": renderProjectDetailTemplate,
  // Add more renderers here as you create new templates
};

// setScreen now needs to be async to await template loading
export async function setScreen(data, templateId) {
  console.log(
    "setScreen called with data:",
    data,
    "and templateId:",
    templateId
  );
  screenElement.innerHTML = ""; // Clear previous content

  try {
    await ensureTemplatesLoaded(); // Ensure templates are loaded before proceeding
  } catch (error) {
    // Error already logged by ensureTemplatesLoaded, and message shown on screen.
    // No further action needed here.
    return;
  }

  if (!templateId || typeof data !== "object") {
    console.error(
      "setScreen: templateId (string) and data (object) are required.",
      data,
      templateId
    );
    screenElement.innerHTML =
      "<h1>Erro de Exibição</h1><p>Não foi possível carregar o conteúdo corretamente.</p>";
    return;
  }

  const templateContent = templatesCache[templateId];
  if (!templateContent) {
    console.error(`Template with id "${templateId}" not found in cache.`);
    screenElement.innerHTML = `<h1>Erro</h1><p>Template "${templateId}" não encontrado.</p>`;
    return;
  }

  const contentClone = templateContent.cloneNode(true);
  const renderer = templateRenderers[templateId];

  if (renderer) {
    renderer(data, contentClone);
    screenElement.appendChild(contentClone);
  } else {
    console.error(`No renderer found for template id "${templateId}".`);
    screenElement.innerHTML = `<h1>Erro</h1><p>Não foi possível renderizar o conteúdo para o template "${templateId}".</p>`;
  }

  // Optional: Add a fade-in animation for new content
  // screen.style.opacity = 0;
  // gsap.fromTo(screen, { opacity: 0 }, { opacity: 1, duration: 0.5 });
}
