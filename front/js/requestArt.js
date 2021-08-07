let elt = document.getElementById('wrapper-page-art');

function artDescrip(data) {

    let artData = `
    <div>
    <img class="img-page-art" src="`+data.imageUrl+`">
    </div

    <div class="descrip-page-art">
        <h2>`+data.name+`</h2>
    </div>

    <div class="wrap-oranj-button">
    <div class="oranj-button">Ajouter au panier</div>
    </div>

    <div class="list-option-page-art">
        <!--list from JS-->
    </div>
    `;

}


fetch("http://127.0.0.1:3000/api/cameras").then(function (response) {
  if (response.ok) {
    response.json().then(function (value) {
      console.log(value);
    });
  }
});
