// fonction permettant l'ajout d'un article au panier via localStorage
function addToCart(articleId) {
    
    // vérifie si l'article est deja présent dans le panier
    // Si le l'article est deja dans le panier, on récupère la quantité déjà présente dans le panier
    // sinon on attribue une valeur par défaut
    let itemQuantity = localStorage.getItem(articleId);
    if (itemQuantity == null) {
        itemQuantity = 0;
    }
    
    // ajoute 1 à la quantité déjà présente dans le panier
    const elt = document.getElementById('itemQtySelector');
    const qty = parseInt(elt.value);
    const newValue = parseInt(itemQuantity) + qty;

    // ajout au localStorage à partir de la nouvelle valeur dans le panier
    localStorage.setItem(articleId, newValue);
}

// fonction qui affiche de l'html quand le panier ne contient aucune information
function emptyCart() {

    // variable contenant le html à injecter 
    const emptyCartHtml = `
        <div class="empty-cart">
            <p> Votre panier est vide, retournez à l'accueil ? </p>
                <a href="../index.html"> 
                    <button class="oranj-button">
                        Retourner à l'accueil
                    </button>
                </a>
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

    // récupération du localStorage de la page
    const storage = {...localStorage};

    // affichage du panier
    // si le local storage est vide, affichage du panier vide
    // sinon, affichage des articles présent dans le panier et du formulaire de commande
    if (Object.keys(storage).length == 0) {
        emptyCart();
    }
    else {
        drawForm();
        itemsConstructor(storage)
        await orderFormHandler();
    }
}

// création du tableau contenant les id des différents article présent dans le panier
var articlesIdList = [];

// fonction qui affiche les articles depuis le localStorage
async function itemsConstructor(storage) {

    // initialisation du prix total a 0
    var totalPrice = 0;

    // boucle affichant chaque article et sa quantité présent dans le panier
    for (const item_id in storage) {
        const qty = storage[item_id];

        //ajout de l'id au tableau afin de l'utiliser lors de l'envoi du formulaire de commande
        articlesIdList.push(item_id);

        // récupération des données d'un article à partir de son ID
        const res = await fetch("http://127.0.0.1:3000/api/cameras/" + item_id);
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
                    <h3> ${ articleFormatedPrice } </h3>
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
        <div class="form-wrap">
            <form id="formulaire-order">

                    <div class="wrapper-row "> 
                        <label for="name"></label>
                        <input type="text" class="cart-form-champ" id="firstName" name="firstName" placeholder="Nom" required>
                        <input type="text" class="cart-form-champ" id="lastName" name="lastName" placeholder="Prénom" required>
                    </div>
               
                    <div class="wrapper-row ">
                    <label for="email"></label>
                    <input type="email" class="cart-form-champ" id="email" name="email" placeholder="Email" required>
                    <label for="adress"></label>
                    <input type="text" class="cart-form-champ" id="address" name="address" placeholder="Adresse postale" required>
                    </div> 
            
                
                    <div class="wrapper-row"> 
                        <label for="codePostal"></label>
                        <input type="text" class="cart-form-champ" id="city" name="city" placeholder="Code Postal" required>
                        <input type="text" class="cart-form-champ" id="city" name="city" placeholder="Ville" required>
                    </div>
                
                <a href="commandDone.html">
                    <div  class="wrap-oranj-button wrapper-row">
                        <input type="submit"  value="Commander">
                    </div>
                </a>
                
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
    localStorage.clear(); // permet de supprimer le panier

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

// fonction qui gère l'affichage du récapitulatif de commande
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