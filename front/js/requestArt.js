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
  <div class="wrap-article">
    <div class="wrap-button">
        <a href="../index.html">
            <button class="oranj-button">retourner à l'accueil </button>
        </a>
      <a href="panier.html"> 
        <button onclick="addToCart('${article._id}')" class="oranj-button">Add au panier</button>
      </a>
    </div>
    <div class="item-center">
      <div class="wrap-article-left-side">
        <div class="wrap-img-article"> 
            <img src="${article.imageUrl}">
        </div>
      </div>
      <div class="wrap-article-right-side">
        <div class="wrap-description-article"> 
            <h2>${article.name}</h2>
            <p class="price-article">${articleFormatedPrice}</p>
            <p class="descrip-article">${article.description}</p>
        </div>
          <div class="list-wrap"> 

            <div clas="list-Qty"> 
                <label for="itemQty" > Quantité : </label>
                <select id="itemQtySelector"  name="item-select-Qty"> 
                    <option value="1" selected> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> 5 </option>
                </select>
              </div>

            <div class="list-option-article">
                <label for="lenses-select">Choisir une lentille: </label>
                <select class="lense-selector" name="lenses">
                ${articleLenses}  
                </select>
            </div>
              
          </div>
        </div>
      </div> 
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
async function fetchCameraById(id) {
  const res = await fetch("http://127.0.0.1:3000/api/cameras/"+id);
  // appel de la fonction "articleConstructor" avec les données de l'API
  if (res.ok) {
    const json = await res.json();
    articleConstructor(json);
  }
  else {
    window.open('404.html', '_self'); // renvoie une 404
  }
}

fetchCameraById(id);
