if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('../../sw.js')
      .then(reg => {
        console.log('Service worker registered! 😎', reg)
      })
      .catch(err => {
        console.log('😥 Service worker registration failed: ', err)
      })
  })
}

let deferredPrompt
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  deferredPrompt = event

  document.querySelector('#install-banner').style.display = 'flex'
})

document.querySelector('#install-btn').addEventListener('click', event => {
  deferredPrompt.prompt()
  deferredPrompt.userChoice
    .then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null
    })
})

document.addEventListener("DOMContentLoaded", function() {
  initSidenav()
  let page = window.location.hash.substr(1)
  if (page === "") page = "home"
  loadPage(page)
})

const initSidenav = () => {
  document.getElementById('blocker').addEventListener('click', () => {
    hideSidenav()
    hideBlocker()
  })
  document.querySelector('.sidenav-trigger').addEventListener('click', () => {
    showSidenav()
    showBlocker()
  })
}

const showSidenav = () => {
  document.querySelector('.sidenav').classList.add('show')
}
const hideSidenav = () => {
  document.querySelector('.sidenav').classList.remove('show')
}
const showBlocker = () => {
  document.getElementById('blocker').classList.add('show')
}
const hideBlocker = () => {
  document.getElementById('blocker').classList.remove('show')
}