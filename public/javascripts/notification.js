
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('display-mode is standalone');
}else{
  console.log("Not Installed");
}

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});


function showInstallPromotion(){
  // $('#modal').modal('show')
  document.getElementById("pwa-install").style.display = "block";
}

const Pwabutton = document.getElementById('buttoninstall');
// addEventListener('click', async () =>
Pwabutton.addEventListener('click', async () =>{
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  localStorage.setItem("appInstalled",outcome)
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});



function hideInstallPromotion(){
  // $('#modal').modal('hide')
  document.getElementById("pwa-install").style.display = "none";
}

window.addEventListener('appinstalled', (evt) => {
  // $('#modal1').modal('show')
  document.getElementById("pwa-install-success").style.display = "block";
});

