// récupération du wrapper "wrapper-page-art" contenant les différentes informations d'un article
const elt = document.getElementById('wrapper-page-art');

// récupération de l'id depuis les paramètres de l'url
const params = new URLSearchParams(document.location.search.substring(1));
const id = params.get("id");

// crée une liste d'option au format html
function lensesOption(lensesData) {
  let lenses ="";
  lensesData.forEach(data => {
    lenses += `<option value="lentille">${data}</option>`
  });
  return lenses;
}

// Fonction qui affiche un article depuis les données qui lui sont transmise
function articleConstructor(article) { 

  // récupération les données des lentilles.
  const articleLenses = lensesOption(article.lenses);
  // formatage du prix en euro
  const articleFormatedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(article.price/100);
  //  variable contenant le html à injecter
  const articleInformation = `
  <div class="wrap-article-left-side">
      <div class="wrap-img-article"> 
          <img src="${article.imageUrl}">
      </div>
  </div>
  <div class="wrap-article-right-side">
    <a href="panier.html" class="wrap-oranj-button">
        <button onclick="addToCart('${article._id}')" class="oranj-button">Ajouter au panier</button>
    </a>
    <div class="wrap-description-article"> 
        <h2>${article.name}</h2>
        <p class="price-article">${articleFormatedPrice}</p>
        <p class="descrip-article">${article.description}</p>
    </div>
    <div class="list-option-article">
        <label for="lenses-select">Choisir une lentille: </label>
        <select class="lense-selector" name="lenses">
        ${articleLenses}    
    </div>
  </div>
  `;

  //  crée un élement <div> avec la class "art-sell" 
  const articleNode = document.createElement('div');
  articleNode.classList.add('art-sell');
  // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper "wrapper-page-art" contenu dans elt
  articleNode.innerHTML=articleInformation;
  elt.appendChild(articleNode);
}

// récupération des données d'un article à partir de son ID
async function fetchCameraById() {
  const res = await fetch("http://127.0.0.1:3000/api/cameras/"+id);
  // appel de la fonction "articleConstructor" avec les données de l'API
  if (res.ok) {
    const json = await res.json();
    articleConstructor(json);
  }
}

fetchCameraById();
