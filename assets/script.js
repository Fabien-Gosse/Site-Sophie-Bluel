document.addEventListener('DOMContentLoaded', async () => {
    const projects = await getProjects();
    const filters = await getFilters();

    generateArticles(projects);
    generateFilters(filters);
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
        workElement.dataset.id = article.id
        imageElement.src = article.imageUrl;
        nomElement.innerText = article.title;

        // On imbrique chaque éléments les uns dans les autres
        sectionGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(nomElement);

    }
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
}



