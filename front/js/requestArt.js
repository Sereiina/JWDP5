let elt = document.getElementById('wrapper-page-art');

function artDescrip(data) {

    let artData = `
    <div>
    <img class="img-page-art img-article" src="`+data.imageUrl+`">
    </div

    <div class="descrip-page-art">
        <h2>`+data.name+`</h2>
        <p class="price-article">`+data.price+`€</p>
        <p class="descrip-article">`+data.description+`</p>
    </div>

    <div class="wrap-oranj-button">
    <div class="oranj-button">Ajouter au panier</div>
    </div>

    <div class="list-option-page-art">
        <!--list from JS-->
    </div>
    `;
    console.log(data);
    const artNode = document.createElement('div');
      artNode.classList.add('art-sell');
      artNode.innerHTML=artData;
      elt.appendChild(artNode);
}


fetch("http://127.0.0.1:3000/api/cameras").then(function (response) { //recup les données au bon endroit
  if (response.ok) {
    response.json().then(function (value) {
      value.forEach(data =>   {  //sert a rien
         artDescrip(data); 
      });
     
    });
  }
});