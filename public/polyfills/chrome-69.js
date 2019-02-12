/* Polyfill service DEVELOPMENT MODE - for live use set NODE_ENV to 'production'
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 * 
 * Features requested: Array.from,Array.isArray,Array.of,Array.prototype.@@iterator,Array.prototype.copyWithin,Array.prototype.entries,Array.prototype.every,Array.prototype.fill,Array.prototype.filter,Array.prototype.find,Array.prototype.findIndex,Array.prototype.forEach,Array.prototype.includes,Array.prototype.indexOf,Array.prototype.keys,Array.prototype.lastIndexOf,Array.prototype.map,Array.prototype.reduce,Array.prototype.reduceRight,Array.prototype.some,Array.prototype.values,AudioContext,Blob,CustomEvent,DOMTokenList,DOMTokenList.prototype.@@iterator,Date.now,Date.prototype.toISOString,DocumentFragment,DocumentFragment.prototype.append,DocumentFragment.prototype.prepend,Element,Element.prototype.after,Element.prototype.append,Element.prototype.before,Element.prototype.classList,Element.prototype.cloneNode,Element.prototype.closest,Element.prototype.dataset,Element.prototype.matches,Element.prototype.placeholder,Element.prototype.prepend,Element.prototype.remove,Element.prototype.replaceWith,Event,Event.focusin,Event.hashchange,EventSource,Function.name,Function.prototype.bind,HTMLCanvasElement.prototype.toBlob,HTMLDocument,HTMLPictureElement,IntersectionObserver,IntersectionObserverEntry,Intl,JSON,Map,Math.acosh,Math.asinh,Math.atanh,Math.cbrt,Math.clz32,Math.cosh,Math.expm1,Math.fround,Math.hypot,Math.imul,Math.log10,Math.log1p,Math.log2,Math.sign,Math.sinh,Math.tanh,Math.trunc,MutationObserver,Node.prototype.contains,NodeList.prototype.@@iterator,NodeList.prototype.forEach,Number.Epsilon,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.isFinite,Number.isInteger,Number.isNaN,Number.isSafeInteger,Number.parseFloat,Number.parseInt,Object.assign,Object.create,Object.defineProperties,Object.defineProperty,Object.entries,Object.freeze,Object.getOwnPropertyDescriptor,Object.getOwnPropertyNames,Object.getPrototypeOf,Object.is,Object.keys,Object.setPrototypeOf,Object.values,Promise,Promise.prototype.finally,RegExp.prototype.flags,Set,String.fromCodePoint,String.prototype.@@iterator,String.prototype.codePointAt,String.prototype.endsWith,String.prototype.includes,String.prototype.padEnd,String.prototype.padStart,String.prototype.repeat,String.prototype.startsWith,String.prototype.trim,Symbol,Symbol.hasInstance,Symbol.isConcatSpreadable,Symbol.iterator,Symbol.match,Symbol.replace,Symbol.search,Symbol.species,Symbol.split,Symbol.toPrimitive,Symbol.toStringTag,Symbol.unscopables,URL,UserTiming,WeakMap,WeakSet,WebAnimations,Window,XMLHttpRequest,atob,console,console.assert,console.clear,console.count,console.debug,console.dir,console.dirxml,console.error,console.exception,console.group,console.groupCollapsed,console.groupEnd,console.info,console.log,console.markTimeline,console.profile,console.profileEnd,console.profiles,console.table,console.time,console.timeEnd,console.timeStamp,console.timeline,console.timelineEnd,console.trace,console.warn,default,devicePixelRatio,document,document.currentScript,document.getElementsByClassName,document.head,document.querySelector,document.visibilityState,fetch,getComputedStyle,localStorage,location.origin,matchMedia,navigator.geolocation,navigator.sendBeacon,performance.now,requestAnimationFrame,screen.orientation,setImmediate,~html5-elements,~viewport
 * 
 * - setImmediate, License: CC0 */

(function(undefined) {

// setImmediate
(function (global, undef) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediatePolyfill;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undef, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undef, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function installNextTickImplementation() {
        setImmediatePolyfill = function setImmediate(handler) { // eslint-disable-line no-unused-vars
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediatePolyfill = function setImmediate(handler) { // eslint-disable-line no-unused-vars
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediatePolyfill = function setImmediate(handler) { // eslint-disable-line no-unused-vars
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediatePolyfill = function setImmediate(handler) { // eslint-disable-line no-unused-vars
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        setImmediatePolyfill = function setImmediate(handler) { // eslint-disable-line no-unused-vars
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediatePolyfill;
    attachTo.clearImmediate = clearImmediate;
}(this)); // eslint-disable-line no-undef
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
