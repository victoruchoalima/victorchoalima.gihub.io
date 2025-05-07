const buttonsContainer = document.getElementById("buttons-container");

function clearSubMenu() {
  buttonsContainer.innerHTML = "";
}

export function displaySubMenu(items, onItemClickCallback) {
  clearSubMenu();

  if (!items || items.length === 0) {
    // Optionally display a message if no items for this category
    // buttonsContainer.innerHTML = "<p>Nenhum item disponível.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((itemData, index) => {
    const menuItemElement = document.createElement("button");
    menuItemElement.classList.add("submenu-item");
    menuItemElement.textContent = itemData.name;
    menuItemElement.dataset.itemId = itemData.id;

    // Initial style for animation
    menuItemElement.style.opacity = 0;
    menuItemElement.style.transform = "translateY(20px)";

    menuItemElement.addEventListener("click", () => {
      console.log("Sub-menu item clicked in menuManager.js:", itemData);
      onItemClickCallback(itemData);
    });
    fragment.appendChild(menuItemElement);
  });

  buttonsContainer.appendChild(fragment);

  // Animate items in
  // If using GSAP:
  // gsap.to(".submenu-item", { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" });
  // For a simple CSS transition based reveal:
  requestAnimationFrame(() => {
    // Ensures styles are applied before transition starts
    document.querySelectorAll(".submenu-item").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    });
  });
}
