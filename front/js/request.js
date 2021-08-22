// récupération du wrapper "wrap-article" contenant les différents articles à afficher
const elt = document.getElementById('wrap-articles');

// fonction qui affiche un article d'après les données qui lui sont transmise
function createFrame(data) {

  // formatage du prix en euro
  const articleFormatedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(data.price/100);
  // variable contenant le html à injecter
  const frame = `
    <div class="wrapper-art">
        <a href="pages-html/page-article.html?id=${data._id}">
    <div class="wrap-img-art">
        <img class="img-article" src="${data.imageUrl}">
    </div>
    <div class="wrap-des-art">
        <h2 class="name-article">${data.name}</h2>
        <p class="price-article">${articleFormatedPrice}</p>
        <p class="descrip-article">${data.description}</p>
    </div>
        </a>
    </div>
`; 
  // crée un élement <a> avec la class "frame-sell" 
  const frameNode = document.createElement('a');
  frameNode.classList.add('frame-sell');
  // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper "wrap-articles" contenu dans elt
  frameNode.innerHTML=frame;
  elt.appendChild(frameNode);
}

// récupération des données depuis l'API
async function fetchCameras() {
  const res = await fetch("http://127.0.0.1:3000/api/cameras");
  if (res.ok) {
    const json = await res.json();
    // appel de la fonction "create-frame" afin de générer chaque article présent dans la réponse de l'API
    json.forEach(data => {
      createFrame(data);
    })
  }
}

//point d'entrée du script
fetchCameras();
