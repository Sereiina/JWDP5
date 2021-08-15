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
    } else {
        drawForm();
        itemsConstructor(allCookies)
    }
}

function itemsConstructor(cookies) {
    let totalPrice = 0;

    for (let index = 0; index < cookies.length; index++) {
        const cookie = cookies[index].split('=');
        const id = cookie[0];
        const qty = cookie[1];

        fetch("http://127.0.0.1:3000/api/cameras/" + id).then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            cartItemConstructor(data, qty);
            totalPrice += (data.price * qty);
            if (index == cookies.length - 1) {
                totalPriceConstructor(totalPrice);
            }
        })
    }
}

function totalPriceConstructor(total) {
    let viewTotal = `
    <div class="total-price">
        <p> Total : ` + new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total / 100) + ` </p>
    </div>
    `;
    let elt = document.getElementById('wrap-price');
    const cartNode = document.createElement('div');
    cartNode.innerHTML = viewTotal;
    elt.appendChild(cartNode);
}

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
    let elt = document.getElementById('wrap-cart');
    const cartNode = document.createElement('div');
    cartNode.classList.add('cart-article-wrapper');
    cartNode.innerHTML = cartItemHTML;
    elt.appendChild(cartNode);
}


function drawForm() {
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
            `;
    let elt = document.getElementById('cart-formulaire');
    const cartNode = document.createElement('div');
    cartNode.innerHTML = formulaireOrder;
    elt.appendChild(cartNode);
}

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