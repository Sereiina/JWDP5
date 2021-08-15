function addToCart(articleId) {
    console.log(articleId);
    let itemQuantity = "";
    try {
        itemQuantity = document.cookie
            .split('; ')
            .find(row => row.startsWith(articleId))
            .split('=')[1];
    } catch (error) {
        itemQuantity = 0;
    }
    let newValue = parseInt(itemQuantity) + 1
    document.cookie = id + "=" + newValue + "; SameSite=None; Secure; path=/";

} 
function emptyCart() {
    let emptyCartHtml = `
        <div>
        <p> panier Vide </p>
        </div>
    `;
    let elt = document.getElementById('wrap-cart');
        const cartNode = document.createElement('div');
        cartNode.classList.add('cart-article-wrapper');
        cartNode.innerHTML = emptyCartHtml;
        elt.appendChild(cartNode);
}
function loadCart() {
    allCookies = document.cookie.split('; ');
    if (allCookies == "") {
        emptyCart();
        return;
    } 
    allCookies.forEach(cookie => {
        itemConstructor(cookie);
    });
    
}

function itemConstructor(cookie) {

    let cookieItem = cookie.split('=');
    let id = cookieItem[0];
	

    fetch("http://127.0.0.1:3000/api/cameras/" + id).then(function (response) {
        
        if (response.ok) {
            response.json().then(function (value) {
              let  cartInfoArticle = `
                    <div class="cart-article-info">
                        <div class="cart-article-name">
                            <h3> `+ value.name + `</h3>
                        </div>
                        <div class="cart-article-price">
                            <p> `+ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR'}).format(value.price/100)+` </p>
                        </div>
                    </div>
                    
                    <div class="formulaire-order">
                    <form action="http://127.0.0.1:5500/front/pages-html/commandDone.html" method="POST">
                        <div>
                            <label for="name"></label>
                            <input type="text" name="firstName" placeholder="Nom" required>
                            <input type="text" name="LastName" placeholder="Prénom" required>
                        </div>
                        <div>
                            <label for="email"></label>
                            <input type="email" name="email" placeholder="Email" required>
                        </div>
                        <div>
                            <label for="adress"></label>
                            <input type="text" name="address" placeholder="Adresse postale" required>
                            <input type="text" name="complement" placeholder="Complément d'adresse">
                        </div>
                        <div>
                            <label for="codePostal"></label>
                            <input type="text" name="city" placeholder="Code Postal" required>
                            <input type="text" name="city" placeholder="Ville" required>
                        </div>
                        <div  class="wrap-oranj-button">
                        <button href="commandDone.html" class="oranj-button"> Commander </button>
                        </div>
                    </form>
                </div>
                <a href="commandDone.html"> c'est juste pour nav facilement </a>
                `;
                let elt = document.getElementById('wrap-cart');
                const cartNode = document.createElement('div');
                cartNode.classList.add('cart-article-wrapper');
                cartNode.innerHTML = cartInfoArticle;
                elt.appendChild(cartNode);				
            });
        }
    });
}

