$('.carousel').carousel({
    interval: 2000
  });

  (function() {
    var loaderText = document.getElementById("loading-msg");
    setInterval(function() {
      loaderText.innerHTML = getLoadingText();
    }, 2500);

    function getLoadingText() {
      var strLoadingText;
      var arrLoadingText = [
      "Rss Tvndr App","Namaste ๐","Loading...","Analizing Your Data..",
      "Getting Your Information..","Compressing...","Please Wait...",
      "Getting Data..",".......","Checking Errors..","Scanning...","Updating...",
      "Sucuring Your Account","Loading Components..","Verifying..","It Take Few Seconds..",
      "Checking Your Information","Removing Caches..","An Error Occured","Resolving Error",
      "Thank You For Opening This App ๐งก","Secure & Safe","Welcome...."
      ];
      var rand = Math.floor(Math.random() * arrLoadingText.length);
      return arrLoadingText[rand];
    }
  })();
