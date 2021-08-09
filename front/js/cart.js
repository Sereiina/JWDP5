function addToCart(articleId) {
    console.log(articleId);
    let itemQuantity ="";
    try {
         itemQuantity = document.cookie 
        .split('; ')
        .find(row => row.startsWith(articleId))
        .split('=')[1];
    } catch (error) {
        itemQuantity=0;
    }
     let newValue = parseInt(itemQuantity)+1
     document.cookie = id+"="+newValue;
    
  }