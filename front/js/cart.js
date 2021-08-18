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
    let newValue = parseInt(itemQuantity) + 1

    // création d'un nouveau cookie à partir de la nouvelle valeur dans le panier
    document.cookie = id + "=" + newValue + "; SameSite=None; Secure; path=/";
}

// fonction qui affiche de l'html quand le panier ne contient aucune information
function emptyCart() {

    // variable contenant le html à injecter 
    let emptyCartHtml = `
        <div>
        <p> panier Vide </p>
        </div>
    `;
    

    // récupération du wrapper "wrap-cart" contenant les articles du panier
    let elt = document.getElementById('wrap-cart');
    // crée un élement <div> avec la class "cart-article-wrapper" 
    const cartNode = document.createElement('div');
    cartNode.classList.add('cart-article-wrapper');
    // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper "wrap-cart" contenu dans elt
    cartNode.innerHTML = emptyCartHtml;
    elt.appendChild(cartNode);
}

// fonction qui gère l'affichage du panier
function loadCart() {

    // récupération des cookies de la page
    let allCookies = document.cookie.split('; ');

    // affichage du panier
    // si aucun cookie est présent, affichage du panier vide
    // sinon, affichage des articles présent dans le panier et du formulaire de commande
    if (allCookies == "") {
        emptyCart();
    } else {
        drawForm();
        itemsConstructor(allCookies)
    }
}

// fonction qui affiche les articles depuis les cookies
function itemsConstructor(cookies) {

    // initialisation du prix total a 0
    let totalPrice = 0;

    // boucle affichant chaque article et sa quantité présent dans le panier
    // initialisation d'index à 0;
    // tant que l'index est inférieur à cookies.lenght;
    // incrémentation de index;
    for (let index = 0; index < cookies.length; index++) {
        const cookie = cookies[index].split('=');   // récupération des clés/valeurs d'un cookie
        const id = cookie[0];                       // récupération de l'id à l'index 0
        const qty = cookie[1];                      // récupération de la quantité à l'index 1


        // récupération des données d'un article à partir de son ID
        fetch("http://127.0.0.1:3000/api/cameras/" + id).then(function (response) {
            if (response.ok) {
                // renvoi de la promise json de response
                return response.json();
            }
        })

        //création d'une ligne d'article dans le panier
        .then((data) => {

            // appel de cartItemConstructor avec les données de data & quantité
            cartItemConstructor(data, qty);

            // ajout du prix de l'article multiplier par sa quantité au prix total du panier
            totalPrice += (data.price * qty);

            // affichage du prix total si l'index est à sa valeur maximal
            if (index == cookies.length - 1) {
                totalPriceConstructor(totalPrice);
            }
        })
    }
}

// Fonction qui gère l'affichage du prix total
function totalPriceConstructor(total) {

    //  variable contenant le html à injecter
    let viewTotal = `
    <div class="total-price">
        <p> Total : ` + new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total / 100) + ` </p>
    </div>
    `;

    //  crée un élement <div> avec la class "wrap-price" 
    let elt = document.getElementById('wrap-price');
    const cartNode = document.createElement('div');
    // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper "" contenu dans elt
    cartNode.innerHTML = viewTotal;
    elt.appendChild(cartNode);
}

// Fonction qui affiche un article dans le panier depuis les données qui lui sont transmise
function cartItemConstructor(item, qty) {
    let cartItemHTML = `
            <div class="cart-article-info">
                <div class="cart-article-name">
                    <h3> `+ qty+` </h3>
                    <h3> `+ item.name +`</h3>
                </div>
                <div class="cart-article-price">
                    <p> `+ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.price / 100 * qty) + ` </p>
                </div>
            </div>
        `;
    

    // récupération du wrapper "wrap-cart" contenant les articles du panier
    let elt = document.getElementById('wrap-cart');

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
    let formulaireOrder = `
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
                    <input type="text" id="complement" name="complement" placeholder="Complément d'adresse">
                </div>
                <div>
                    <label for="codePostal"></label>
                    <input type="text" id="city" name="city" placeholder="Code Postal" required>
                    <input type="text" id="city" name="city" placeholder="Ville" required>
                </div>
                <div  class="wrap-oranj-button">
                
                <input onclick="orderCommand()" type="submit" value="commander">
                </div>
            </form>
        </div>

    <a href="commandDone.html"> c'est juste pour nav facilement nik</a> 
            `; //TODO oe tkt le a ça reste pas
    

    // récupère l'element conteneur du formulaire
    let elt = document.getElementById('cart-formulaire');
    // crée un élement <div>
    const cartNode = document.createElement('div');

    // injection du html à l'intérieur de l'élément crée et ajout de celui-ci dans le wrapper contenu dans elt
    cartNode.innerHTML = formulaireOrder;
    elt.appendChild(cartNode);
}

//TODO  EN CHANTIER 
function orderCommand() {
     var form = document.getElementById('formulaire-order');
     formData = new FormData(form);

     for (var [key, value] of formData.entries()) { 
        console.log(key, value);
      }
      let machin = {
        contact: {
            firstName: "ada",
            lastName: "dremah",
            address: "perdu",
            city: "lalune",
            email: "ada@gmail.com"
        },
        products: [
            "5be1ef211c9d44000030b062"
        ]
    };
     console.log(formData.entries());
    fetch ("http://127.0.0.1:3000/api/cameras/order/" , {
        method: "POST" , body: machin
    }).then((response) => {
        console.log(response);
    })
}

// <button onclick="orderCommand()" class="oranj-button"> Commander </button>