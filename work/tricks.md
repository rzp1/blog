# tricks

## 1. Scroll smoothly to the top of the page

```JS
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop

  if (c > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, c - c / 8)
  }
}
// CSS way
html, body {
  scroll-behavior: smooth;
}
```

## 2. Format money

```JS
const formatMoney = (money) => {
  return money.replace(new RegExp(`(?!^)(?=(\\d{3})+${money.includes('.') ? '\\.' : '$'})`, 'g'), ',')
}
formatMoney('123456789') // '123,456,789'
formatMoney('123456789.123') // '123,456,789.123'
formatMoney('123') // '123'

// also work
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
number.toLocaleString()
```

## 3. Enter and exit fullScreen

```JS
// Enter full screen
function fullScreen() {
  let el = document.documentElement
  let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen
  //typeof rfs != "undefined" && rfs
  if (rfs) {
    rfs.call(el)
  } else if (typeof window.ActiveXObject !== "undefined") {
    let wscript = new ActiveXObject("WScript.Shell")
    if (wscript != null) {
      wscript.SendKeys("{F11}")
    }
  }
}
// Exit full screen
function exitScreen() {
  let el = document
  let cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen
  //typeof cfs != "undefined" && cfs
  if (cfs) {
    cfs.call(el)
  } else if (typeof window.ActiveXObject !== "undefined") {
    let wscript = new ActiveXObject("WScript.Shell")
    if (wscript != null) {
      wscript.SendKeys("{F11}")
    }
  }
}
```
