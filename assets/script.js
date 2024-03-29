document.addEventListener('DOMContentLoaded', async () => {
    const projects = await getProjects();
    const filters = await getFilters();

    generateArticles(projects);
    generateFilters(filters);
    buttonFilters(filters, projects)
    articlesTous (projects)
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
async function getProjects(){
    return (await fetch('http://localhost:5678/api/works')).json();
}

function generateArticles(projects){
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

async function getFilters(){
    return (await fetch('http://localhost:5678/api/categories')).json();
}

function generateFilters(filters){
    //Recupération du nom des catégories
    const categoryName = filters.map(filters => filters.name);
    const categoryId = filters.map(filters => filters.id);
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
    const filtersId = filters.map(filters => filters.id);

    for (let i = 0; i < filters.length; i++){
        const buttonFilters = document.querySelector(".filters" + filtersId[i]);
        articleFilters (projects, buttonFilters)
    }
}

function articleFilters (projects, buttonFilters) {
    buttonFilters.addEventListener("click", function () {

        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionGallery = document.querySelector(".gallery");
        // Suppression des fiches existantes
        sectionGallery.innerHTML = "";
        for (let i2 = 0; i2 < projects.length; i2++){
            const categoryId = projects.map(projects => projects.categoryId);
            const categoryCheck = categoryId[i2]
            if (buttonFilters.name === "filters" + categoryCheck){
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
    })
}

function articlesTous (projects) {
    tousButton = document.querySelector(".filters0");
    tousButton.addEventListener("click", function () {
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionGallery = document.querySelector(".gallery");
        // Suppression des fiches existantes
        sectionGallery.innerHTML = "";
        generateArticles(projects);
    })
}


    /*
    let categoryNameArray = Array.from(new Set(categoryNameMap));

    }*/
//     const sectionFiltres = document.querySelector(".filtres");

//     // ciblage des filtres en effacant ceux redondants
//     const categoryMap = works.map(works => works.category)
//     const categoryNameMap = categoryMap.map(categoryMap => categoryMap.name)
//     let categoryNameArray = Array.from(new Set(categoryNameMap));
    
//     for (let i = 0; i < categoryNameArray.length; i++) {

//         categoryName = categoryNameArray[i]

//         console.log(categoryName);
//         let filtres = document.createElement("input");
//         filtres.type = "button";
//         filtres.value = categoryName;
//         filtres.classList.add(categoryName);

        
//         sectionFiltres.appendChild(filtres)
//     }
