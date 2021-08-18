// récupération du wrapper "wrapper-page-art" contenant les différentes informations d'un article
let elt = document.getElementById('wrapper-page-art');

// récupération de l'id depuis les paramètres de l'url
let params = new URLSearchParams(document.location.search.substring(1));
let id = params.get("id");

// crée une liste d'option au format html
function lensesOption(lensesData) {
  let lenses ="";
  lensesData.forEach(data => {
    lenses += `<option value="lentille">`+data+`</option>`
  });
  return lenses;
}

// Fonction qui affiche un article depuis les données qui lui sont transmise
function articleConstructor(article) { 

  // récupération les données des lentilles.
  let articleLenses = lensesOption(article.lenses);

  //  variable contenant le html à injecter
  let articleInformation = `
  <div>
      <img class="img-page-art img-article" src="`+article.imageUrl+`">
  </div

  <div class="descrip-page-art">
      <h2>`+article.name+`</h2>
      <p class="price-article">`+ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(article.price/100)+`</p>
      <p class="descrip-article">`+article.description+`</p>
  </div>

  <div class="wrap-oranj-button">
      <button onclick="addToCart('`+article._id+`')" class="oranj-button">Ajouter au panier</button>
  </div>

  <div class="list-option-page-art">
      <label for="lenses-select">Choisir une lentille: </label>
      <select name="lenses">
      `+articleLenses+`    
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
fetch("http://127.0.0.1:3000/api/cameras/"+id).then(function (response) { 
  if (response.ok) {
    response.json().then(function (value) {
      // appel de la fonction "articleConstructor" avec les données de l'API
      articleConstructor(value);
    });
  }
});