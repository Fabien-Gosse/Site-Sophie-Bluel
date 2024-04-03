document.addEventListener("DOMContentLoaded", async () => {
  checkToken();
  logout();
  let modal = null;
  let modal2 = null;
  document.querySelectorAll(".jsModal").forEach((a) => {
    a.addEventListener("click", openModal);
  });
  document.querySelectorAll(".addPicture").forEach((ac) => {
    ac.addEventListener("click", openModal2);
  });

  const projects = await getProjects();
  console.log(projects);
  const filters = await getFilters();

  generateArticles(projects);
  generateFilters(filters);
  buttonFilters(filters, projects);
  articlesTous(projects);
});

/*
if (works === null){
    // Récupération des pièces depuis l'API
    const reponseWorks = await fetch('http://localhost:5678/api/works');
    works = await reponseWorks.json();
    // Transformation des pièces en JSON
    const valeurWorks = JSON.stringify(works);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("works", valeurWorks);
}else{
    works = JSON.parse(works);
}
*/
async function getProjects() {
  return (await fetch("http://localhost:5678/api/works")).json();
}

function generateArticles(projects) {
  for (let i = 0; i < projects.length; i++) {
    // Récupération des pièces depuis l'API
    const article = projects[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionGallery = document.querySelector(".gallery");
    // Création des éléments
    const workElement = document.createElement("article");
    const imageElement = document.createElement("img");
    const nomElement = document.createElement("figcaption");

    // Atribution des propriété des élements
    workElement.dataset.id = article.id;
    imageElement.src = article.imageUrl;
    nomElement.innerText = article.title;

    // On imbrique chaque éléments les uns dans les autres
    sectionGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(nomElement);
  }
}

async function getFilters() {
  return (await fetch("http://localhost:5678/api/categories")).json();
}

function generateFilters(filters) {
  //Recupération du nom des catégories
  const categoryName = filters.map((filters) => filters.name);
  const categoryId = filters.map((filters) => filters.id);
  for (let i = 0; i < categoryName.length; i++) {
    /*
        //Création d'une variable sans espaces pour les classes
        const categoryClass = categoryName[i].split(" ").join(""); */

    //Création des élements
    const sectionFilters = document.querySelector(".filters");
    const btnFilters = document.createElement("input");

    //Attribution des propriétés aux boutons
    btnFilters.type = "button";
    btnFilters.value = categoryName[i];
    btnFilters.classList.add("filters" + categoryId[i]);
    btnFilters.name = "filters" + categoryId[i];
    sectionFilters.appendChild(btnFilters);
  }
}

function buttonFilters(filters, projects) {
  const filtersId = filters.map((filters) => filters.id);

  for (let i = 0; i < filters.length; i++) {
    const buttonFilters = document.querySelector(".filters" + filtersId[i]);
    articleFilters(projects, buttonFilters);
  }
}

function articleFilters(projects, buttonFilters) {
  buttonFilters.addEventListener("click", function () {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionGallery = document.querySelector(".gallery");
    // Suppression des fiches existantes
    sectionGallery.innerHTML = "";
    for (let i2 = 0; i2 < projects.length; i2++) {
      const categoryId = projects.map((projects) => projects.categoryId);
      const categoryCheck = categoryId[i2];
      if (buttonFilters.name === "filters" + categoryCheck) {
        // Création des éléments
        const workElement = document.createElement("article");
        const imageElement = document.createElement("img");
        const nomElement = document.createElement("figcaption");
        workElement.dataset.id = projects[i2].id;
        imageElement.src = projects[i2].imageUrl;
        nomElement.innerText = projects[i2].title;
        // On imbrique chaque éléments les uns dans les autres
        sectionGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nomElement);
      }
    }
  });
}

function articlesTous(projects) {
  tousButton = document.querySelector(".filters0");
  tousButton.addEventListener("click", function () {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionGallery = document.querySelector(".gallery");
    // Suppression des fiches existantes
    sectionGallery.innerHTML = "";
    generateArticles(projects);
  });
}

//recupération du Token de vérification si aucun déjà présent
function checkToken() {
  const tokenSave = localStorage.getItem("tokenSave");
  const tokenLogin = localStorage.getItem("tokenLogin");
  console.log(tokenSave);
  console.log(tokenLogin);
  if (tokenSave === null && tokenLogin !== null) {
    const idConnexion = {
      email: "sophie.bluel@test.tld",
      password: "S0phie",
    };
    const bodyCharge = JSON.stringify(idConnexion);
    getToken(bodyCharge);
  } else {
    checkLogin();
  }
}

async function getToken(bodyCharge) {
  const getLogin = (
    await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyCharge,
    })
  ).json();

  await getLogin.then((value) => {
    token = value.token;
    console.log(token);
    return token;
  });
  tokenSave(token);
}

function tokenSave(token) {
  localStorage.setItem("tokenSave", token);
  checkLogin();
}

function checkLogin() {
  let tokenSave = localStorage.getItem("tokenSave");
  const tokenLogin = localStorage.getItem("tokenLogin");
  console.log(tokenLogin);

  if (tokenLogin === tokenSave && tokenLogin !== null) {
    topEdit = document.querySelector(".header-edit");
    loginEdit = document.querySelector(".navLogin");
    logoutEdit = document.querySelector(".navLogout");
    modificationEdit = document.querySelector(".modification");
    filtersEdit = document.querySelector(".filters");

    topEdit.classList.add("display-flex");
    loginEdit.classList.add("display-none");
    logoutEdit.classList.add("display-inline");
    modificationEdit.classList.add("display-block");
    filtersEdit.classList.add("display-none");
  } else {
    localStorage.removeItem("tokenSave");
    tokenSave = localStorage.getItem("tokenSave");
    console.log(tokenSave);
  }
}

function logout() {
  buttonLogout = document.querySelector(".logout");
  buttonLogout.addEventListener("click", function () {
    localStorage.removeItem("tokenLogin");
    tokenSave = localStorage.getItem("tokenLogin");
    document.location.href = "./index.html";
  });
}

const openModal = function (e) {
  e.preventDefault();

  modal = document.querySelector(e.target.getAttribute("href"));
  console.log(modal);
  modal.classList.add("display-flex");
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".jsCloseModal").addEventListener("click", closeModal);
  modal
    .querySelector(".jsStopModal")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();

  modal.classList.remove("display-flex");
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".jsCloseModal").removeEventListener("click", closeModal);
  modal
    .querySelector(".jsStopModal")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
    closeModal2(e);
  }
});

const openModal2 = function (e) {
  e.preventDefault();

  closeModal(e);
  modal2 = document.querySelector(e.target.getAttribute("href"));
  console.log(modal2);
  modal2.classList.add("display-flex");
  modal2.removeAttribute("aria-hidden");
  modal2.setAttribute("aria-modal", "true");
  modal2.addEventListener("click", closeModal2);
  modal2.querySelector(".jsCloseModal2").addEventListener("click", closeModal2);
  modal2
    .querySelector(".jsStopModal")
    .addEventListener("click", stopPropagation);
};

const closeModal2 = function (e) {
  if (modal2 === null) return;
  e.preventDefault();

  modal2.classList.remove("display-flex");
  modal2.setAttribute("aria-hidden", "true");
  modal2.removeAttribute("aria-modal");
  modal2.removeEventListener("click", closeModal2);
  modal2
    .querySelector(".jsCloseModal2")
    .removeEventListener("click", closeModal2);
  modal2
    .querySelector(".jsStopModal")
    .removeEventListener("click", stopPropagation);
  modal2 = null;
};
