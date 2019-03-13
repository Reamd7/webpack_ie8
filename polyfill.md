Javacript 
## es5-shim / shams 修复ie js runtime 的代码
## core-js-for-ie8 https://www.npmjs.com/package/core-js-for-ie8#ecmascript-5
## core-js https://www.npmjs.com/package/core-js

DOM 
## ie 非标准模式 https://www.npmjs.com/package/ie7js 

## html5shiv IE6-8，可以在DOM中操作HTML5元素，并在IE6-9中为它们应用基本样式。

## ie事件处理 ie8.js == dom3 
https://www.npmjs.com/package/ie8

= addEventListener, removeEventListener, and dispatchEvent for IE8 including custom bubbling events
= timeStamp, cancelable, bubbles, defaultPrevented, target, currentTarget and relatedTarget properties per each event
= document.createEvent('Event') standard API with e.initEvent(type, bubbles, cancelable) supported too
= preventDefault(), stopPropagation(), stopImmediatePropagation() working with both synthetic and real events
= document.addEventListener('DOMContentLoaded', callback, false) supported
textContent, firstElementChild, lastElementChild, previousElementSibling, nextElementSibling, childElementCount
document.defaultView, window.getComputedStyle
HTMLElement
basic support for DOM Ranges mutations

## dom4 
Features
This is a fully tested and covered polyfill for both new DOM Level 4 parentNode entries:

Element#prepend()
Element#append()
And for new DOM Level 4 childNode entries:

Element#before()
Element#after()
Element#replaceWith() ( warning Element#replace() has been recently deprecated )
Element#remove()
The implemented test is conform to current specifications.

Other fixes/standardized behaviors include:

toggleAttribute

DOM Listener: capture, passive, and once
fully normalized KeyboardEvent, MouseEvent and the latest way to create new Event('type')
CSS :scope selector for any HTML Element (no document since useless, sorry)
classList, with forced fixes for iOS 5.1 and Nokia ASHA Xpress Browser and early implementations
CustomEvent constructor for all browsers down to IE8
Element#matches utility to test elements against CSS selectors
Element#closest utility to find element inclusive ancestor via CSS selectors
Node#contains utility to know if another node is inside the current one
requestAnimationFrame and cancelAnimationFrame are polyfilled too but the least legacy fallback to setTimeout does not support accurate timing and doesn't slow down execution with that logic. Feel free to load upfront other polyfills if needed.
If you need other polyfills too, have a look at another DOM-shim repo.