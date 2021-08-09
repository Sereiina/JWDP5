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

function loadCart() {
    allCookies = document.cookie.split('; ');
    console.log(allCookies);
    allCookies.forEach(cookie => {
        itemConstructor(cookie);
    });
}

function itemConstructor(cookie) {

    let cookieItem = cookie.split('=');
    let id = cookieItem[0];



    let cartInfoArticle = "";
    fetch("http://127.0.0.1:3000/api/cameras/" + id).then(function (response) {
        
        if (response.ok) {
            response.json().then(function (value) {
                cartInfoArticle = `
                    <div class="cart-article-info">
                        <div class="cart-article-name">
                            <h3> `+ value.name + `</h3>
                        </div>
                        <div class="cart-article-price">
                            <p> <!--JS--> </p>
                        </div>
                    </div>
                `;
            });
        }
    });




    let elt = document.getElementById('wrap-cart');
    const cartNode = document.createElement('div');
    cartNode.classList.add('cart-article-wrapper');
    cartNode.innerHTML = cartInfoArticle;
    elt.appendChild(cartNode);
}




















// 5be1ed3f1c9d44000030b061=5; 5be9bc241c9d440000a730e7=2; 5be9c4c71c9d440000a730e9=3

// let cookieInformation =


//   <div class="cart-title">
//                         <h2>Votre panier</h2>
//                     </div>
//                     <div class="cart-article-info">
//                         <div class="cart-article-name">
//                             <h3> <!--JS--></h3>
//                         </div>
//                         <div class="cart-article-price">
//                             <p> <!--JS--> </p>
//                         </div>
//                     </div>
//                     <div class="cart-article-total">
//                         <p> Total : <!--JS--> </p>
//                     </div>