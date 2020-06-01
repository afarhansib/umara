/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

// 12345678.9.format(2, 3, '.', ',');  // "12.345.678,90"
// 123456.789.format(4, 4, ' ', ':');  // "12 3456:7890"
// 12345678.9.format(0, 3, '-');       // "12-345-679"// 

const toRupiahs = number => {
  return `Rp${number.format(0, 3, '.', ',')}`
}

const toastBroadcast = new BroadcastChannel('toast-channel')

toastBroadcast.onmessage = (event) => {
  console.log(event)
  toast(event.data.payload)
}

// broadcast.postMessage({
//   type: 'INCREASE_COUNT',
// })


const toast = (msg = 'Ini adalah toast!', dismissable = true) => {
  document.querySelector('.toast-msg').innerText = msg
  document.querySelector('.toast').classList.add('show')
  if (dismissable) {
    setTimeout(() => {
      document.querySelector('.toast').classList.remove('show')
    }, 5000)
  }
}

document.querySelector('.toast-close button').addEventListener('click', () => {
  document.querySelector('.toast').classList.remove('show')
})