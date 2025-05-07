export function setScreen(htmlContent = "") {
  console.log("setScreen called with htmlContent:", htmlContent);
  const screen = document.getElementById("screen");
  screen.innerHTML = htmlContent;

  // Optional: Add a fade-in animation for new content
  // screen.style.opacity = 0;
  // gsap.fromTo(screen, { opacity: 0 }, { opacity: 1, duration: 0.5 });
}

/*
algumas possibilidades são por exemplo passar como argumento o tipo de conteudo a ser renderizado por setScreen. em caso de projetos por exemplo já ter uma estrutura HTML pronta. é possivel criar alguns TEMPLATES para o setScreen. e aí é só passar o template como argumento. dar um appendchild para screen e renderizar o template de acordo com as informações. ou seja, talvez setScreen receba 2 argumentos, o template e as informações. preciso também deixar a possibilidade de nenhum argumento para o caso de animações etc.
*/
