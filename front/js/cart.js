// fonction permettant l'ajout d'un article au panier via les cookies
function addToCart(articleId) {
    let itemQuantity = "";

    // vérifie si l'article est deja présent dans le panier
    // Si le l'article est deja dans le panier, on récupère la quantité déjà présente dans le panier
    // sinon on attribue une valeur par défaut
    try {
        itemQuantity = document.cookie                  // récupération des cookies de la page
            .split('; ')                                // séparation de chaque entrée dans les cookies
            .find(row => row.startsWith(articleId))     // recherche de l'article avec son ID
            .split('=')[1];                             // assigne la quantité depuis la valeur après le signe "="
    } catch (error) {                                   
        itemQuantity = 0;       
    }

    // ajoute 1 à la quantité déjà présente dans le panier
    const newValue = parseInt(itemQuantity) + 1

    // création d'un nouveau cookie à partir de la nouvelle valeur dans le panier
    document.cookie = `${id}=${newValue}; SameSite=None; Secure; path=/`;
}

// fonction qui affiche de l'html quand le panier ne contient aucune information
function emptyCart() {

    // variable contenant le html à injecter 
    const emptyCartHtml = `
        <div>
        <p> panier Vide </p>
        </div>
    `;

    // récupération du wrapper "wrap-cart" contenant les articles du panier
    const elt = document.getElementById('wrap-cart');
    // crée un élement <div> avec la class "cart-article-wrapper" 
    const cartNode = document.createElement('div');
    cartNode.classList.add('cart-article-wrapper');
    // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper "wrap-cart" contenu dans elt
    cartNode.innerHTML = emptyCartHtml;
    elt.appendChild(cartNode);
}

// fonction qui gère l'affichage du panier
async function loadCart() {

    // récupération des cookies de la page
    const allCookies = document.cookie.split('; ');

    // affichage du panier
    // si aucun cookie est présent, affichage du panier vide
    // sinon, affichage des articles présent dans le panier et du formulaire de commande
    if (allCookies == "") {
        emptyCart();
    } else {
        drawForm();
        itemsConstructor(allCookies)
        await orderFormHandler();
    }
    
}

// création du tableau contenant les id des différents article présent dans le panier
var articlesIdList = [];

// fonction qui affiche les articles depuis les cookies
async function itemsConstructor(cookies) {

    // initialisation du prix total a 0
    var totalPrice = 0;

    // boucle affichant chaque article et sa quantité présent dans le panier
    // initialisation d'index à 0;
    // tant que l'index est inférieur à cookies.lenght;
    // incrémentation de index;
    for (let index = 0; index < cookies.length; index++) {
        const cookie = cookies[index].split('=');   // récupération des clés/valeurs d'un cookie
        const id = cookie[0];                       // récupération de l'id à l'index 0
        const qty = cookie[1];                      // récupération de la quantité à l'index 1

        
        //ajout de l'id au tableau afin de l'utiliser lors de l'envoi du formulaire de commande
        articlesIdList.push(id);

        // récupération des données d'un article à partir de son ID
        const res = await fetch("http://127.0.0.1:3000/api/cameras/" + id);
        if (res.ok) {
            // renvoi de la promise json de response
            const json = await res.json();
            
            // appel de cartItemConstructor avec les données de data & quantité
            cartItemConstructor(json, qty);

            // ajout du prix de l'article multiplier par sa quantité au prix total du panier
            totalPrice += (json.price * qty);
        }
    }
    // affichage du prix total
    totalPriceConstructor(totalPrice);
    sessionStorage.setItem('totalPrice',totalPrice);
}

// Fonction qui gère l'affichage du prix total
function totalPriceConstructor(total) {

    //  variable contenant le html à injecter
    const viewTotal = `
    <div class="total-price">
        <p> Total : ${ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total / 100) } </p>
    </div>
    `;

    //  crée un élement <div> avec la class "wrap-price" 
    const elt = document.getElementById('wrap-price');
    const cartNode = document.createElement('div');
    // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper "" contenu dans elt
    cartNode.innerHTML = viewTotal;
    elt.appendChild(cartNode);
}

// Fonction qui affiche un article dans le panier depuis les données qui lui sont transmise
function cartItemConstructor(item, qty) {

    const articleFormatedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.price / 100 * qty);

    const cartItemHTML = `
            <div class="cart-article-info">
                <div class="cart-article-name">
                    <h3> ${ qty } </h3>
                    <h3> ${ item.name }</h3>
                </div>
                <div class="cart-article-price">
                    <p> ${ articleFormatedPrice } </p>
                </div>
            </div>
        `;
    

    // récupération du wrapper "wrap-cart" contenant les articles du panier
    const elt = document.getElementById('wrap-cart');

    //  crée un élement <div> avec la class "cart-article-wrapper" 
    const cartNode = document.createElement('div');
    cartNode.classList.add('cart-article-wrapper');
    // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper contenu dans elt
    cartNode.innerHTML = cartItemHTML;
    elt.appendChild(cartNode);
}

// fonction qui gère l'affichage du formulaire de prise de commande
function drawForm() {

    // variable contenant le formulaire html à injecter
    const formulaireOrder = `
        <div>
            <form id="formulaire-order">
                <div>
                    <label for="name"></label>
                    <input type="text" id="firstName" name="firstName" placeholder="Nom" required>
                    <input type="text" id="lastName" name="lastName" placeholder="Prénom" required>
                </div>
                <div>
                    <label for="email"></label>
                    <input type="email" id="email" name="email" placeholder="Email" required>
                </div>
                <div>
                    <label for="adress"></label>
                    <input type="text" id="address" name="address" placeholder="Adresse postale" required>
                </div>
                <div>
                    <label for="codePostal"></label>
                    <input type="text" id="city" name="city" placeholder="Code Postal" required>
                    <input type="text" id="city" name="city" placeholder="Ville" required>
                </div>
                <div  class="wrap-oranj-button">
                <input type="submit" value="commander">
                </div>
            </form>
        </div>
        `; 
    

    // récupère l'element conteneur du formulaire
    const elt = document.getElementById('cart-formulaire');
    // crée un élement <div>
    const cartNode = document.createElement('div');
    // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper contenu dans elt
    cartNode.innerHTML = formulaireOrder;
    elt.appendChild(cartNode);
}

// fonction qui récupère les données du formulaire et les envoies a l'API
function orderFormHandler() {
    
  const form = document.querySelector('form'); // récupère l'élement du formulaire
  form.addEventListener ( 'submit', async (event) => {
    
    const data = new FormData(event.target); // récupère les informations contenu dans le formulaire

    // construction des données à envoyer à l'API
    const orderData = {
      contact: {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        address: data.get('address'),
        city: data.get('city'),
        email: data.get('email')
      },
      products: articlesIdList
    };
    deleteCart(articlesIdList); // appel de la fonction permettant de supprimer le panier

    // envoie des données à l'API dans une requête POST
    const res = await fetch("http://127.0.0.1:3000/api/cameras/order/",
        {
            method: "POST",
            body: JSON.stringify(orderData), 
            headers : {
                'Accept' : 'application/json', 
                'Content-Type': 'application/json' 
            }
        }
    );

    // stockage de order ID & redirection vers le récapitulatif de commande
    const json = await res.json()
    sessionStorage.setItem('orderId', json.orderId);
    window.open('commandDone.html', '_self');

  });
}

// fonction qui gère l'affiche du récapitulatif de commande
function CommandDoneConstructor() { 
  //récupération du total et de l'id de commande depuis le sessionStorage
  const totalPrice = sessionStorage.getItem('totalPrice');
  const value = sessionStorage.getItem('orderId');

  const elt = document.getElementById('wrapper-page-order');

  const articleFormatedPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPrice / 100);

  // crée des éléments h2 et y insère l'html contenant le prix et l'id de commande
  const orderTotalPrice = document.createElement('h2');
  orderTotalPrice.innerHTML = `Résumer de votre commande :${ articleFormatedPrice}`;
  elt.appendChild(orderTotalPrice);

  const orderId = document.createElement('h2');
  orderId.innerHTML = `identifiant de commande :${value}`;
  elt.appendChild(orderId);

  // efface le sessionStorage
  sessionStorage.clear();

}

// fonction qui efface la totalité des items du panier
function deleteCart(idList) {  
  idList.forEach(id => {
    document.cookie = id+'=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'; 
  });
}