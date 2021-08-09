let elt = document.getElementById('wrapper-page-art');
let params = new URLSearchParams(document.location.search.substring(1));
let id = params.get("id");

function lensesOption(lensesData) {
  let lenses ="";
  lensesData.forEach(data => {
    lenses += `<option value="lentille">`+data+`</option>`
  });
  return lenses;
}

function articleConstructor(article) { 

    let articleLenses = lensesOption(article.lenses);
   
    let articleInformation = `
    <div>
    <img class="img-page-art img-article" src="`+article.imageUrl+`">
    </div

    <div class="descrip-page-art">
        <h2>`+article.name+`</h2>
        <p class="price-article">`+article.price+`€</p>
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
    console.log(article);
    const articleNode = document.createElement('div');
      articleNode.classList.add('art-sell');
      articleNode.innerHTML=articleInformation;
      elt.appendChild(articleNode);
}



fetch("http://127.0.0.1:3000/api/cameras/"+id).then(function (response) { //recup les données au bon endroit
  if (response.ok) {
    response.json().then(function (value) {
     articleConstructor(value);
    });
  }
});