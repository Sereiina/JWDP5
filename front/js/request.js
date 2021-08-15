let elt = document.getElementById('wrap-articles');

function createFrame(data) {

  let frame = `
    <div class="wrapper-art">
        <a href="pages-html/page-article.html?id=`+data._id+`">
    <div class="wrap-img-art">
        <img class="img-article" src="`+data.imageUrl+`">
    </div>

    <div class="wrap-des-art">
        <h2 class="name-article">`+data.name+`</h2>
        <p class="price-article">`+new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(data.price/100)+`</p>
        <p class="descrip-article">`+data.description+`</p>
    </div>

    <!--Recup from JS-->
        </a>
    </div>
`;
 console.log(data);
  const frameNode = document.createElement('a');
  frameNode.classList.add('frame-sell');
  frameNode.innerHTML=frame;
  elt.appendChild(frameNode);
  
}


fetch("http://127.0.0.1:3000/api/cameras").then(function (response) {
  if (response.ok) {
    response.json().then(function (value) {
      value.forEach(data => {
        createFrame(data);
      });
    });
  }
});