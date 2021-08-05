let elt = document.getElementById('wrap-articles');

function createFrame(data) {

  let frame = `
<div class="article-img"></div>
<div class="article-description">
<img class="img-article" src="`+data.imageUrl+`">
<h2>`+data.name+`</h2>
<p>`+data.price+`</p>
<p>`+data.description+`</p>
<!--Recup from JS-->
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