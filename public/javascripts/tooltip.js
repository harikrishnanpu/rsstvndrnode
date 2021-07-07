$('.carousel').carousel({
    interval: 2000
  });

  (function() {
    var loaderText = document.getElementById("loading-msg");
    setInterval(function() {
      loaderText.innerHTML = getLoadingText();
    }, 1500);

    function getLoadingText() {
      var strLoadingText;
      var arrLoadingText = [
      "Rss Tvndr App","Namaste 🙏","Loading...","Analizing Your Data..",
      "Getting Your Information..","Compressing...","Please Wait...",
      "Getting Data..",".......","Checking Errors..","Scanning...","Updating...",
      "Sucuring Your Account","Loading Components..","Verifying..","It Take Few Seconds..",
      "Checking Your Information","Removing Caches..","An Error Occured","Resolving Error",
      "Thank You For Opening This App 🧡","Secure & Safe","Welcome...."
      ];
      var rand = Math.floor(Math.random() * arrLoadingText.length);
      return arrLoadingText[rand];
    }
  })();
