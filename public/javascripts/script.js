
 $('.carousel').carousel({
  interval: 2000
  });

  
  if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').then(()=>{
    console.log("SW Registerd");
  })
  };


//Get the button
var mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
  mybutton.style.display = "block";
  mybutton.style.visibility = "visible";
} else {
  mybutton.style.display = "none";
  mybutton.style.visibility = "hidden";
}
}

// document.onreadystatechange = function() {
//   if (document.readyState !== "complete") {
//     document.querySelector("#body").style.visibility = "hidden";
//     document.querySelector("#overlay").style.display = "block";
//   } 
//   else if(document.readyState == 'interactive'){
//     document.querySelector("#body").style.visibility = "hidden";
//     document.querySelector("#overlay").style.display = "block";
//   }
  
//   else {
//     document.querySelector('.progress-bar').style.width = "100%";
//     setTimeout(loader,1000)
//     function loader(){
//     document.querySelector("#overlay").style.display = "none";
//     document.querySelector("#body").style.visibility = "visible";
//     document.querySelector('.helpbar').style.visibility = "visible";
//   }
// }
// }

function topFunction(){
document.body.scrollTop = 0,
document.documentElement.scrollTop = 0
}




// function modal(){
//   $('#myModal').modal('show')
// }



