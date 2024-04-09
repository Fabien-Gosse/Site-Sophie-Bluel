document.addEventListener("DOMContentLoaded", async () => {
  const projects = await getProjects();
  const filters = await getFilters();

  const buttonLogout = document.querySelector(".logout");
  const tousButton = document.querySelector(".filters0");

  const validateForm = document.querySelector(".formNewArticle");

  toggleDisplay();
  generateArticles(projects);
  generateFilters(filters);
  buttonFilters(filters, projects);
  articlesTous(projects);
  formOk();

  let modal = null;
  let modal2 = null;
  document.querySelectorAll(".jsModal").forEach((a) => {
    a.addEventListener("click", openModal);
  });
  document.querySelectorAll(".modalAddPicture").forEach((ac) => {
    ac.addEventListener("click", openModal2);
  });
  document.querySelectorAll(".addPicture").forEach((ad) => {
    ad.addEventListener("change", addPicture);
  });

  validateForm.addEventListener("submit", async function (af) {
    af.preventDefault();

    const projects = await getProjects();
    let lastProjects = projects[projects.length - 1];
    let id = Number(lastProjects.id) + 1;

    const userId = 1;
    /*
    const formData = new FormData(validateForm);
    formData.append("id", id);
    formData.append("userId", userId);
    console.log(formData);
    */
    const baliseTitre = document.querySelector(".titreNewArticle");
    const baliseCategorie = document.querySelector(".categorieNewArticle");
    const file = document.querySelector("input[type=file]").files[0];

    const baliseTitreValue = baliseTitre.value;
    const baliseCategorieValue = baliseCategorie.value;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", baliseTitreValue);
    formData.append("imageUrl", file);
    formData.append("categoryId", baliseCategorieValue);
    formData.append("userId", userId);
    for (var value of formData.values()) {
      console.log(value);
    }
    const bearerTokenLogin = "bearer " + localStorage.getItem("tokenLogin");
    const addWorksHeaders = { Authorization: bearerTokenLogin };

    const request = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: addWorksHeaders,
      body: formData,
    });
  });

  buttonLogout.addEventListener("click", function () {
    localStorage.removeItem("tokenLogin");
    document.location.href = "./index.html";
  });

  tousButton.addEventListener("click", function () {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionGallery = document.querySelector(".gallery");
    // Suppression des fiches existantes
    sectionGallery.innerHTML = "";
    generateArticles(projects);
  });
});

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
  const tousButton = document.querySelector(".filters0");
  tousButton.addEventListener("click", function () {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionGallery = document.querySelector(".gallery");
    // Suppression des fiches existantes
    sectionGallery.innerHTML = "";
    generateArticles(projects);
  });
}

// Récupération du token de vérification
function toggleDisplay() {
  const tokenLogin = localStorage.getItem("tokenLogin");

  if (tokenLogin) {
    const topEdit = document.querySelector(".header-edit");
    const loginEdit = document.querySelector(".navLogin");
    const logoutEdit = document.querySelector(".navLogout");
    const modificationEdit = document.querySelector(".modification");
    const filtersEdit = document.querySelector(".filters");

    topEdit.classList.add("display-flex");
    loginEdit.classList.add("display-none");
    logoutEdit.classList.add("display-inline");
    modificationEdit.classList.add("display-block");
    filtersEdit.classList.add("display-none");
  } else {
    localStorage.removeItem("tokenSave");
  }
}

const openModal = async function (e) {
  e.preventDefault();

  modal = document.querySelector(e.currentTarget.getAttribute("href"));
  console.log(modal);
  modal.classList.add("display-flex");
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".jsCloseModal").addEventListener("click", closeModal);
  modal
    .querySelector(".jsStopModal")
    .addEventListener("click", stopPropagation);
  const projects = await getProjects();
  generateArticlesModal(projects);
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
    .querySelector(".jsReturnModal1")
    .addEventListener("click", returnModal1);
  modal2
    .querySelector(".jsStopModal")
    .addEventListener("click", stopPropagation);
};

generateOptCategorie();

const returnModal1 = function (e) {
  e.preventDefault();

  closeModal2(e);
  document.querySelector(".modification").click();
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

function generateArticlesModal(projects) {
  // Récupération de l'élément du DOM qui accueillera les fiches
  const sectionGallery = document.querySelector(".galleryModal");
  // Suppression des fiches existantes
  sectionGallery.innerHTML = "";

  for (let i = 0; i < projects.length; i++) {
    // Récupération des pièces depuis l'API
    const article = projects[i];

    // Création des éléments
    const workElement = document.createElement("article");
    const imageElement = document.createElement("img");
    const linkDeleteArticle = document.createElement("button");
    const iconDeleteArticle = document.createElement("i");

    // Atribution des propriété des élements
    workElement.dataset.id = article.id;
    console.log(workElement);
    imageElement.src = article.imageUrl;
    linkDeleteArticle.classList = article.id;
    console.log(linkDeleteArticle.classList);
    iconDeleteArticle.classList = "fa-solid fa-trash-can";

    // On imbrique chaque éléments les uns dans les autres
    sectionGallery.appendChild(workElement);
    workElement.appendChild(imageElement);
    workElement.appendChild(linkDeleteArticle);
    linkDeleteArticle.appendChild(iconDeleteArticle);

    buttonDeleteArticle(linkDeleteArticle);
  }
}

function buttonDeleteArticle(linkDeleteArticle) {
  linkDeleteArticle.addEventListener("click", function (e) {
    e.preventDefault();

    idArticleDelete = linkDeleteArticle.classList;
    console.log(idArticleDelete);

    deleteArticle(idArticleDelete);
  });
}

async function deleteArticle(idArticleDelete) {
  // Fetch request to delete article
  const bearerTokenLogin = "bearer " + localStorage.getItem("tokenLogin");
  const deleteHeaders = { Authorization: bearerTokenLogin };
  console.log(deleteHeaders);
  const deleteArticle = await fetch(
    "http://localhost:5678/api/works/" + idArticleDelete,
    {
      method: "DELETE",
      headers: deleteHeaders,
    }
  );
  const projects = await getProjects();
  generateArticlesModal(projects);

  const sectionGallery = document.querySelector(".gallery");
  // Suppression des fiches existantes
  sectionGallery.innerHTML = "";
  generateArticles(projects);
}

async function generateOptCategorie() {
  const filters = await getFilters();
  //Recupération du nom des catégories
  const categoryName = filters.map((filters) => filters.name);
  for (let i = 0; i < categoryName.length; i++) {
    //Création des élements
    const selectCategorie = document.querySelector(".categorieNewArticle");
    const optCategorie = document.createElement("option");

    //Attribution des propriétés aux boutons
    optCategorie.value = categoryName[i];
    optCategorie.label = categoryName[i];
    selectCategorie.appendChild(optCategorie);
  }
}

const addPicture = function (e) {
  const file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();
  const buttonAddImg = document.querySelector(".buttonAddImg");
  const previewImg = document.getElementById("previewImg");

  reader.addEventListener(
    "load",
    () => {
      // on convertit l'image en une chaîne de caractères base64
      previewImg.src = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
    buttonAddImg.classList.add("display-none");
    previewImg.classList.add("display-flex");
  }
};

function formOk() {
  const formNewArticle = document.querySelector(".formNewArticle");

  formNewArticle.addEventListener("change", function () {
    const baliseTitre = document.querySelector(".titreNewArticle");
    const baliseCategorie = document.querySelector(".categorieNewArticle");
    const previewImg = document.getElementById("previewImg");
    const buttonValidateArticle = document.querySelector(
      ".buttonValidateArticle"
    );
    const baliseTitreValue = baliseTitre.value;
    const baliseCategorieValue = baliseCategorie.value;

    console.log(baliseCategorieValue);
    console.log(baliseTitreValue);
    console.log(previewImg);
    if (
      baliseCategorieValue === null ||
      baliseTitreValue === "" ||
      previewImg.className !== "display-flex"
    ) {
      return;
    } else {
      buttonValidateArticle.classList.add("backgroundGreen");
      buttonValidateArticle.disabled = false;
    }
  });
}
