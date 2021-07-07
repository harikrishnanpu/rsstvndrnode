window.setTimeout(function() {
  $(".alert").alert('close')
}, 8000);



if(document.getElementById('toast').style.visibility == "hidden"){
    setTimeout(first, 4000)
    setTimeout(toast, 8000)
    setTimeout(hide , 9000)
    function first(){
    document.getElementById('toast').style.visibility = 'visible'
    }
    function toast(){
      document.getElementById('toast').classList.add('toasthide')
    }function hide(){
      document.getElementById('toast').style.display = 'none';
    }
  };