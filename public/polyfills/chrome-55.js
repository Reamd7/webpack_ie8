/* Polyfill service DEVELOPMENT MODE - for live use set NODE_ENV to 'production'
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 * 
 * Features requested: Array.from,Array.isArray,Array.of,Array.prototype.@@iterator,Array.prototype.copyWithin,Array.prototype.entries,Array.prototype.every,Array.prototype.fill,Array.prototype.filter,Array.prototype.find,Array.prototype.findIndex,Array.prototype.forEach,Array.prototype.includes,Array.prototype.indexOf,Array.prototype.keys,Array.prototype.lastIndexOf,Array.prototype.map,Array.prototype.reduce,Array.prototype.reduceRight,Array.prototype.some,Array.prototype.values,AudioContext,Blob,CustomEvent,DOMTokenList,DOMTokenList.prototype.@@iterator,Date.now,Date.prototype.toISOString,DocumentFragment,DocumentFragment.prototype.append,DocumentFragment.prototype.prepend,Element,Element.prototype.after,Element.prototype.append,Element.prototype.before,Element.prototype.classList,Element.prototype.cloneNode,Element.prototype.closest,Element.prototype.dataset,Element.prototype.matches,Element.prototype.placeholder,Element.prototype.prepend,Element.prototype.remove,Element.prototype.replaceWith,Event,Event.focusin,Event.hashchange,EventSource,Function.name,Function.prototype.bind,HTMLCanvasElement.prototype.toBlob,HTMLDocument,HTMLPictureElement,IntersectionObserver,IntersectionObserverEntry,Intl,JSON,Map,Math.acosh,Math.asinh,Math.atanh,Math.cbrt,Math.clz32,Math.cosh,Math.expm1,Math.fround,Math.hypot,Math.imul,Math.log10,Math.log1p,Math.log2,Math.sign,Math.sinh,Math.tanh,Math.trunc,MutationObserver,Node.prototype.contains,NodeList.prototype.@@iterator,NodeList.prototype.forEach,Number.Epsilon,Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER,Number.isFinite,Number.isInteger,Number.isNaN,Number.isSafeInteger,Number.parseFloat,Number.parseInt,Object.assign,Object.create,Object.defineProperties,Object.defineProperty,Object.entries,Object.freeze,Object.getOwnPropertyDescriptor,Object.getOwnPropertyNames,Object.getPrototypeOf,Object.is,Object.keys,Object.setPrototypeOf,Object.values,Promise,Promise.prototype.finally,RegExp.prototype.flags,Set,String.fromCodePoint,String.prototype.@@iterator,String.prototype.codePointAt,String.prototype.endsWith,String.prototype.includes,String.prototype.padEnd,String.prototype.padStart,String.prototype.repeat,String.prototype.startsWith,String.prototype.trim,Symbol,Symbol.hasInstance,Symbol.isConcatSpreadable,Symbol.iterator,Symbol.match,Symbol.replace,Symbol.search,Symbol.species,Symbol.split,Symbol.toPrimitive,Symbol.toStringTag,Symbol.unscopables,URL,UserTiming,WeakMap,WeakSet,WebAnimations,Window,XMLHttpRequest,atob,console,console.assert,console.clear,console.count,console.debug,console.dir,console.dirxml,console.error,console.exception,console.group,console.groupCollapsed,console.groupEnd,console.info,console.log,console.markTimeline,console.profile,console.profileEnd,console.profiles,console.table,console.time,console.timeEnd,console.timeStamp,console.timeline,console.timelineEnd,console.trace,console.warn,default,devicePixelRatio,document,document.currentScript,document.getElementsByClassName,document.head,document.querySelector,document.visibilityState,fetch,getComputedStyle,localStorage,location.origin,matchMedia,navigator.geolocation,navigator.sendBeacon,performance.now,requestAnimationFrame,screen.orientation,setImmediate,~html5-elements,~viewport
 * 
 * - _Iterator, License: MIT (required by "_ArrayIterator", "Array.prototype.values")
 * - _ArrayIterator, License: MIT (required by "Array.prototype.values")
 * - _ESAbstract.CreateMethodProperty, License: CC0 (required by "Array.prototype.values", "Promise.prototype.finally", "String.prototype.padEnd", "String.prototype.padStart", "Function.prototype.bind", "Object.create", "_ArrayIterator", "Object.setPrototypeOf", "String.prototype.includes", "Object.assign", "_Iterator", "Object.defineProperties", "Array.prototype.forEach", "Symbol", "Object.getPrototypeOf", "Object.getOwnPropertyNames", "Object.getOwnPropertyDescriptor", "Array.prototype.filter", "Array.prototype.map", "Object.freeze")
 * - _ESAbstract.ToObject, License: CC0 (required by "Array.prototype.values", "Object.assign", "_Iterator", "_ArrayIterator", "Object.defineProperties", "Object.create", "Array.prototype.forEach", "Object.setPrototypeOf", "Symbol", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.GetV", "_ESAbstract.GetMethod", "_ESAbstract.IsConstructor", "_ESAbstract.SpeciesConstructor", "Promise.prototype.finally", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart")
 * - Array.prototype.values, License: MIT
 * - _ESAbstract.IsCallable, License: CC0 (required by "Promise.prototype.finally", "Function.prototype.bind", "Array.prototype.forEach", "Object.setPrototypeOf", "_ArrayIterator", "Array.prototype.values", "Symbol", "_Iterator", "_ESAbstract.GetMethod", "_ESAbstract.IsConstructor", "_ESAbstract.SpeciesConstructor", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart", "_ESAbstract.OrdinaryToPrimitive", "Array.prototype.filter", "Array.prototype.map")
 * - _ESAbstract.Get, License: CC0 (required by "_ESAbstract.SpeciesConstructor", "Promise.prototype.finally", "Object.assign", "_Iterator", "_ArrayIterator", "Array.prototype.values", "Object.defineProperties", "Object.create", "Array.prototype.forEach", "Object.setPrototypeOf", "Symbol", "_ESAbstract.IsRegExp", "String.prototype.includes", "_ESAbstract.OrdinaryToPrimitive", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ArraySpeciesCreate", "_ESAbstract.GetPrototypeFromConstructor", "_ESAbstract.OrdinaryCreateFromConstructor", "_ESAbstract.Construct")
 * - _ESAbstract.GetV, License: CC0 (required by "_ESAbstract.GetMethod", "_ESAbstract.IsConstructor", "_ESAbstract.SpeciesConstructor", "Promise.prototype.finally", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart")
 * - _ESAbstract.GetMethod, License: CC0 (required by "_ESAbstract.IsConstructor", "_ESAbstract.SpeciesConstructor", "Promise.prototype.finally", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart")
 * - _ESAbstract.Type, License: CC0 (required by "_ESAbstract.SpeciesConstructor", "Promise.prototype.finally", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart", "Object.create", "_ArrayIterator", "Array.prototype.values", "_ESAbstract.IsConstructor", "_ESAbstract.ToPrimitive", "Object.defineProperties", "_Iterator", "_ESAbstract.IsRegExp", "String.prototype.includes", "_ESAbstract.OrdinaryToPrimitive", "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "Array.prototype.map", "_ESAbstract.GetPrototypeFromConstructor", "_ESAbstract.OrdinaryCreateFromConstructor", "_ESAbstract.Construct")
 * - _ESAbstract.IsConstructor, License: CC0 (required by "_ESAbstract.SpeciesConstructor", "Promise.prototype.finally", "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "_Iterator", "_ArrayIterator", "Array.prototype.values", "Array.prototype.map", "_ESAbstract.Construct")
 * - _ESAbstract.SpeciesConstructor, License: CC0 (required by "Promise.prototype.finally")
 * - Promise.prototype.finally, License: MIT
 * - _ESAbstract.RequireObjectCoercible, License: CC0 (required by "String.prototype.padEnd", "String.prototype.padStart", "String.prototype.includes", "_ArrayIterator", "Array.prototype.values")
 * - _ESAbstract.Call, License: CC0 (required by "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart", "Array.prototype.forEach", "Object.setPrototypeOf", "_ArrayIterator", "Array.prototype.values", "Symbol", "_Iterator", "_ESAbstract.OrdinaryToPrimitive", "Array.prototype.filter", "Array.prototype.map")
 * - _ESAbstract.OrdinaryToPrimitive, License: CC0 (required by "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart")
 * - _ESAbstract.ToPrimitive, License: CC0 (required by "_ESAbstract.ToString", "String.prototype.padEnd", "String.prototype.padStart")
 * - _ESAbstract.ToString, License: CC0 (required by "String.prototype.padEnd", "String.prototype.padStart", "String.prototype.includes", "_ArrayIterator", "Array.prototype.values", "Array.prototype.forEach", "Object.setPrototypeOf", "Symbol", "_Iterator", "Array.prototype.filter", "Array.prototype.map")
 * - _ESAbstract.ToInteger, License: CC0 (required by "_ESAbstract.ToLength", "String.prototype.padEnd", "String.prototype.padStart", "String.prototype.includes", "_ArrayIterator", "Array.prototype.values")
 * - _ESAbstract.ToLength, License: CC0 (required by "String.prototype.padEnd", "String.prototype.padStart", "Array.prototype.forEach", "Object.setPrototypeOf", "_ArrayIterator", "Array.prototype.values", "Symbol", "_Iterator", "Array.prototype.filter", "Array.prototype.map")
 * - String.prototype.padEnd, License: CC0
 * - String.prototype.padStart, License: CC0
 * - setImmediate, License: CC0 */

(function(undefined) {

// _Iterator
/* global Symbol */
// A modification of https://github.com/medikoo/es6-iterator
// Copyright (C) 2013-2015 Mariusz Nowak (www.medikoo.com)

var Iterator = (function () { // eslint-disable-line no-unused-vars
	var clear = function () {
		this.length = 0;
		return this;
	};
	var callable = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};

	var Iterator = function (list, context) {
		if (!(this instanceof Iterator)) {
			return new Iterator(list, context);
		}
		Object.defineProperties(this, {
			__list__: {
				writable: true,
				value: list
			},
			__context__: {
				writable: true,
				value: context
			},
			__nextIndex__: {
				writable: true,
				value: 0
			}
		});
		if (!context) return;
		callable(context.on);
		context.on('_add', this._onAdd.bind(this));
		context.on('_delete', this._onDelete.bind(this));
		context.on('_clear', this._onClear.bind(this));
	};

	Object.defineProperties(Iterator.prototype, Object.assign({
		constructor: {
			value: Iterator,
			configurable: true,
			enumerable: false,
			writable: true
		},
		_next: {
			value: function () {
				var i;
				if (!this.__list__) return;
				if (this.__redo__) {
					i = this.__redo__.shift();
					if (i !== undefined) return i;
				}
				if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
				this._unBind();
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		next: {
			value: function () {
				return this._createResult(this._next());
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		_createResult: {
			value: function (i) {
				if (i === undefined) return {
					done: true,
					value: undefined
				};
				return {
					done: false,
					value: this._resolve(i)
				};
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		_resolve: {
			value: function (i) {
				return this.__list__[i];
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		_unBind: {
			value: function () {
				this.__list__ = null;
				delete this.__redo__;
				if (!this.__context__) return;
				this.__context__.off('_add', this._onAdd.bind(this));
				this.__context__.off('_delete', this._onDelete.bind(this));
				this.__context__.off('_clear', this._onClear.bind(this));
				this.__context__ = null;
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		toString: {
			value: function () {
				return '[object Iterator]';
			},
			configurable: true,
			enumerable: false,
			writable: true
		}
	}, {
		_onAdd: {
			value: function (index) {
				if (index >= this.__nextIndex__) return;
				++this.__nextIndex__;
				if (!this.__redo__) {
					Object.defineProperty(this, '__redo__', {
						value: [index],
						configurable: true,
						enumerable: false,
						writable: false
					});
					return;
				}
				this.__redo__.forEach(function (redo, i) {
					if (redo >= index) this.__redo__[i] = ++redo;
				}, this);
				this.__redo__.push(index);
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		_onDelete: {
			value: function (index) {
				var i;
				if (index >= this.__nextIndex__) return;
				--this.__nextIndex__;
				if (!this.__redo__) return;
				i = this.__redo__.indexOf(index);
				if (i !== -1) this.__redo__.splice(i, 1);
				this.__redo__.forEach(function (redo, i) {
					if (redo > index) this.__redo__[i] = --redo;
				}, this);
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		_onClear: {
			value: function () {
				if (this.__redo__) clear.call(this.__redo__);
				this.__nextIndex__ = 0;
			},
			configurable: true,
			enumerable: false,
			writable: true
		}
	}));

	Object.defineProperty(Iterator.prototype, Symbol.iterator, {
		value: function () {
			return this;
		},
		configurable: true,
		enumerable: false,
		writable: true
	});
	Object.defineProperty(Iterator.prototype, Symbol.toStringTag, {
		value: 'Iterator',
		configurable: false,
		enumerable: false,
		writable: true
	});

	return Iterator;
}());

// _ArrayIterator
/* global Iterator */
// A modification of https://github.com/medikoo/es6-iterator
// Copyright (C) 2013-2015 Mariusz Nowak (www.medikoo.com)

var ArrayIterator = (function() { // eslint-disable-line no-unused-vars

	var ArrayIterator = function(arr, kind) {
		if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
		Iterator.call(this, arr);
		if (!kind) kind = 'value';
		else if (String.prototype.includes.call(kind, 'key+value')) kind = 'key+value';
		else if (String.prototype.includes.call(kind, 'key')) kind = 'key';
		else kind = 'value';
		Object.defineProperty(this, '__kind__', {
			value: kind,
			configurable: false,
			enumerable: false,
			writable: false
		});
	};
	if (Object.setPrototypeOf) Object.setPrototypeOf(ArrayIterator, Iterator.prototype);

	ArrayIterator.prototype = Object.create(Iterator.prototype, {
		constructor: {
			value: ArrayIterator,
			configurable: true,
			enumerable: false,
			writable: true
		},
		_resolve: {
			value: function(i) {
				if (this.__kind__ === 'value') return this.__list__[i];
				if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
				return i;
			},
			configurable: true,
			enumerable: false,
			writable: true
		},
		toString: {
			value: function() {
				return '[object Array Iterator]';
			},
			configurable: true,
			enumerable: false,
			writable: true
		}
	});

	return ArrayIterator;
}());

// _ESAbstract.CreateMethodProperty
// 7.3.5. CreateMethodProperty ( O, P, V )
function CreateMethodProperty(O, P, V) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Let newDesc be the PropertyDescriptor{[[Value]]: V, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}.
	var newDesc = {
		value: V,
		writable: true,
		enumerable: false,
		configurable: true
	};
	// 4. Return ? O.[[DefineOwnProperty]](P, newDesc).
	Object.defineProperty(O, P, newDesc);
}

// _ESAbstract.ToObject
// 7.1.13 ToObject ( argument )
// The abstract operation ToObject converts argument to a value of type Object according to Table 12:
// Table 12: ToObject Conversions
/*
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Argument Type | Result                                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Undefined     | Throw a TypeError exception.                                                                                                       |
| Null          | Throw a TypeError exception.                                                                                                       |
| Boolean       | Return a new Boolean object whose [[BooleanData]] internal slot is set to argument. See 19.3 for a description of Boolean objects. |
| Number        | Return a new Number object whose [[NumberData]] internal slot is set to argument. See 20.1 for a description of Number objects.    |
| String        | Return a new String object whose [[StringData]] internal slot is set to argument. See 21.1 for a description of String objects.    |
| Symbol        | Return a new Symbol object whose [[SymbolData]] internal slot is set to argument. See 19.4 for a description of Symbol objects.    |
| Object        | Return argument.                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
*/
function ToObject(argument) { // eslint-disable-line no-unused-vars
	if (argument === null || argument === undefined) {
		throw TypeError();
	}
  return Object(argument);
}

// Array.prototype.values
/* global CreateMethodProperty, Symbol, ToObject */
// 22.1.3.30/ Array.prototype.values ( )
// Polyfill.io - Firefox, Chrome and Opera have Array.prototype[Symbol.iterator], which is the exact same function as Array.prototype.values.
if ('Symbol' in this && 'iterator' in Symbol && typeof Array.prototype[Symbol.iterator] === 'function') {
	CreateMethodProperty(Array.prototype, 'values', Array.prototype[Symbol.iterator]);
} else {
	CreateMethodProperty(Array.prototype, 'values', function values () {
		// 1. Let O be ? ToObject(this value).
		var O = ToObject(this);
		// 2. Return CreateArrayIterator(O, "value").
		// TODO: Add CreateArrayIterator
		return new ArrayIterator(O, 'value');
	});
}

// _ESAbstract.IsCallable
// 7.2.3. IsCallable ( argument )
function IsCallable(argument) { // eslint-disable-line no-unused-vars
	// 1. If Type(argument) is not Object, return false.
	// 2. If argument has a [[Call]] internal method, return true.
	// 3. Return false.

	// Polyfill.io - Only function objects have a [[Call]] internal method. This means we can simplify this function to check that the argument has a type of function.
	return typeof argument === 'function';
}

// _ESAbstract.Get
// 7.3.1. Get ( O, P )
function Get(O, P) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Return ? O.[[Get]](P, O).
	return O[P];
}

// _ESAbstract.GetV
/* global ToObject */
// 7.3.2 GetV (V, P)
function GetV(v, p) { // eslint-disable-line no-unused-vars
	// 1. Assert: IsPropertyKey(P) is true.
	// 2. Let O be ? ToObject(V).
	var o = ToObject(v);
	// 3. Return ? O.[[Get]](P, V).
	return o[p];
}

// _ESAbstract.GetMethod
/* global GetV, IsCallable */
// 7.3.9. GetMethod ( V, P )
function GetMethod(V, P) { // eslint-disable-line no-unused-vars
	// 1. Assert: IsPropertyKey(P) is true.
	// 2. Let func be ? GetV(V, P).
	var func = GetV(V, P);
	// 3. If func is either undefined or null, return undefined.
	if (func === null || func === undefined) {
		return undefined;
	}
	// 4. If IsCallable(func) is false, throw a TypeError exception.
	if (IsCallable(func) === false) {
		throw new TypeError('Method not callable: ' + P);
	}
	// 5. Return func.
	return func;
}

// _ESAbstract.Type
// "Type(x)" is used as shorthand for "the type of x"...
function Type(x) { // eslint-disable-line no-unused-vars
	switch (typeof x) {
		case 'undefined':
			return 'undefined';
		case 'boolean':
			return 'boolean';
		case 'number':
			return 'number';
		case 'string':
			return 'string';
		case 'symbol':
			return 'symbol';
		default:
			// typeof null is 'object'
			if (x === null) return 'null';
			// Polyfill.io - This is here because a Symbol polyfill will have a typeof `object`.
			if ('Symbol' in this && x instanceof this.Symbol) return 'symbol';
			return 'object';
	}
}

// _ESAbstract.IsConstructor
/* global Type */
// 7.2.4. IsConstructor ( argument )
function IsConstructor(argument) { // eslint-disable-line no-unused-vars
	// 1. If Type(argument) is not Object, return false.
	if (Type(argument) !== 'object') {
		return false;
	}
	// 2. If argument has a [[Construct]] internal method, return true.
	// 3. Return false.

	// Polyfill.io - `new argument` is the only way  to truly test if a function is a constructor.
	// We choose to not use`new argument` because the argument could have side effects when called.
	// Instead we check to see if the argument is a function and if it has a prototype.
	// Arrow functions do not have a [[Construct]] internal method, nor do they have a prototype.
	return typeof argument === 'function' && !!argument.prototype;
}

// _ESAbstract.SpeciesConstructor
/* global Get, Type, IsConstructor */
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
function SpeciesConstructor (O, defaultConstructor) { // eslint-disable-line no-unused-vars
	// 7.3.20.1 Assert: Type(O) is Object.
	// 7.3.20.2 Let C be ? Get(O, "constructor").
	var C = Get(O, "constructor");
	// 7.3.20.3 If C is undefined, return defaultConstructor.
	if (C === undefined) {
		return defaultConstructor;
	}
	// 7.3.20.4 If Type(C) is not Object, throw a TypeError exception
	if (Type(C) !== 'object') {
		throw new TypeError('O.constructor is not an Object');
	}
	// 7.3.20.5 Let S be ? Get(C, @@species).
	var S = typeof this.Symbol === 'function' && typeof this.Symbol.species === 'symbol' ? C[this.Symbol.species] : undefined;
	// 7.3.20.6 If S is either undefined or null, return defaultConstructor.
	if (S === undefined || S === null) {
		return defaultConstructor;
	}
	// 7.3.20.7 If IsConstructor(S) is true, return S.
	if (IsConstructor(S)) {
		return S;
	}
	// 7.3.20.8 Throw a TypeError exception.
	throw new TypeError('No constructor found');
}

// Promise.prototype.finally
/* global CreateMethodProperty, IsCallable, SpeciesConstructor, Type, Promise */
(function () {
	// Based on https://github.com/tc39/proposal-promise-finally/blob/master/polyfill.js
	var then = Function.prototype.bind.call(Function.prototype.call, Promise.prototype.then);

	var getPromise = function (C, handler) {
		return new C(function (resolve) {
			resolve(handler());
		});
	};
	// 1. Promise.prototype.finally ( onFinally )
	CreateMethodProperty(Promise.prototype, 'finally', function (onFinally) {
		// 1. Let promise be the this value.
		var promise = this;
		// 2. If Type(promise) is not Object, throw a TypeError exception.
		if (Type(promise) !== 'object') {
			throw new TypeError('Method %PromisePrototype%.finally called on incompatible receiver ' + Object.prototype.toString.call(promise));
		}
		// 3. Let C be ? SpeciesConstructor(promise, %Promise%).
		var C = SpeciesConstructor(promise, Promise);
		// 4. Assert: IsConstructor(C) is true.
		// 5. If IsCallable(onFinally) is false,
		if (IsCallable(onFinally) === false) {
			// a. Let thenFinally be onFinally.
			var thenFinally = onFinally;
			// b. Let catchFinally be onFinally.
			var catchFinally = onFinally;
			// 6. Else,
		} else {
			// a. Let thenFinally be a new built-in function object as defined in ThenFinally Function.
			var thenFinally = function (x) {
				return then(getPromise(C, onFinally), function () {
					return x;
				});
			};
			// b. Let catchFinally be a new built-in function object as defined in CatchFinally Function.
			var catchFinally = function (e) {
				return then(getPromise(C, onFinally), function () {
					throw e;
				});
			};
			// c. Set thenFinally and catchFinally's [[Constructor]] internal slots to C.
			// d. Set thenFinally and catchFinally's [[OnFinally]] internal slots to onFinally.
		}
		// 7. Return ? Invoke(promise, "then", « thenFinally, catchFinally »).
		return then(promise, thenFinally, catchFinally);
	});
}());

// _ESAbstract.RequireObjectCoercible
// 7.2.1. RequireObjectCoercible ( argument )
// The abstract operation ToObject converts argument to a value of type Object according to Table 12:
// Table 12: ToObject Conversions
/*
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Argument Type | Result                                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Undefined     | Throw a TypeError exception.                                                                                                       |
| Null          | Throw a TypeError exception.                                                                                                       |
| Boolean       | Return argument.                                                                                                                   |
| Number        | Return argument.                                                                                                                   |
| String        | Return argument.                                                                                                                   |
| Symbol        | Return argument.                                                                                                                   |
| Object        | Return argument.                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
*/
function RequireObjectCoercible(argument) { // eslint-disable-line no-unused-vars
	if (argument === null || argument === undefined) {
		throw TypeError();
	}
  return argument;
}

// _ESAbstract.Call
/* global IsCallable */
// 7.3.12. Call ( F, V [ , argumentsList ] )
function Call(F, V /* [, argumentsList] */) { // eslint-disable-line no-unused-vars
	// 1. If argumentsList is not present, set argumentsList to a new empty List.
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	// 2. If IsCallable(F) is false, throw a TypeError exception.
	if (IsCallable(F) === false) {
		throw new TypeError(Object.prototype.toString.call(F) + 'is not a function.');
	}
	// 3. Return ? F.[[Call]](V, argumentsList).
	return F.apply(V, argumentsList);
}

// _ESAbstract.OrdinaryToPrimitive
/* global Get, IsCallable, Call, Type */
// 7.1.1.1. OrdinaryToPrimitive ( O, hint )
function OrdinaryToPrimitive(O, hint) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: Type(hint) is String and its value is either "string" or "number".
	// 3. If hint is "string", then
	if (hint === 'string') {
		// a. Let methodNames be « "toString", "valueOf" ».
		var methodNames = ['toString', 'valueOf'];
		// 4. Else,
	} else {
		// a. Let methodNames be « "valueOf", "toString" ».
		methodNames = ['valueOf', 'toString'];
	}
	// 5. For each name in methodNames in List order, do
	for (var i = 0; i < methodNames.length; ++i) {
		var name = methodNames[i];
		// a. Let method be ? Get(O, name).
		var method = Get(O, name);
		// b. If IsCallable(method) is true, then
		if (IsCallable(method)) {
			// i. Let result be ? Call(method, O).
			var result = Call(method, O);
			// ii. If Type(result) is not Object, return result.
			if (Type(result) !== 'object') {
				return result;
			}
		}
	}
	// 6. Throw a TypeError exception.
	throw new TypeError('Cannot convert to primitive.');
}

// _ESAbstract.ToPrimitive
/* global Type, GetMethod, Call, OrdinaryToPrimitive */
// 7.1.1. ToPrimitive ( input [ , PreferredType ] )
function ToPrimitive(input /* [, PreferredType] */) { // eslint-disable-line no-unused-vars
	var PreferredType = arguments.length > 1 ? arguments[1] : undefined;
	// 1. Assert: input is an ECMAScript language value.
	// 2. If Type(input) is Object, then
	if (Type(input) === 'object') {
		// a. If PreferredType is not present, let hint be "default".
		if (arguments.length < 2) {
			var hint = 'default';
			// b. Else if PreferredType is hint String, let hint be "string".
		} else if (PreferredType === String) {
			hint = 'string';
			// c. Else PreferredType is hint Number, let hint be "number".
		} else if (PreferredType === Number) {
			hint = 'number';
		}
		// d. Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
		var exoticToPrim = typeof this.Symbol === 'function' && typeof this.Symbol.toPrimitive === 'symbol' ? GetMethod(input, this.Symbol.toPrimitive) : undefined;
		// e. If exoticToPrim is not undefined, then
		if (exoticToPrim !== undefined) {
			// i. Let result be ? Call(exoticToPrim, input, « hint »).
			var result = Call(exoticToPrim, input, [hint]);
			// ii. If Type(result) is not Object, return result.
			if (Type(result) !== 'object') {
				return result;
			}
			// iii. Throw a TypeError exception.
			throw new TypeError('Cannot convert exotic object to primitive.');
		}
		// f. If hint is "default", set hint to "number".
		if (hint === 'default') {
			hint = 'number';
		}
		// g. Return ? OrdinaryToPrimitive(input, hint).
		return OrdinaryToPrimitive(input, hint);
	}
	// 3. Return input
	return input;
}

// _ESAbstract.ToString
/* global Type, ToPrimitive */
// 7.1.12. ToString ( argument )
// The abstract operation ToString converts argument to a value of type String according to Table 11:
// Table 11: ToString Conversions
/*
|---------------|--------------------------------------------------------|
| Argument Type | Result                                                 |
|---------------|--------------------------------------------------------|
| Undefined     | Return "undefined".                                    |
|---------------|--------------------------------------------------------|
| Null	        | Return "null".                                         |
|---------------|--------------------------------------------------------|
| Boolean       | If argument is true, return "true".                    |
|               | If argument is false, return "false".                  |
|---------------|--------------------------------------------------------|
| Number        | Return NumberToString(argument).                       |
|---------------|--------------------------------------------------------|
| String        | Return argument.                                       |
|---------------|--------------------------------------------------------|
| Symbol        | Throw a TypeError exception.                           |
|---------------|--------------------------------------------------------|
| Object        | Apply the following steps:                             |
|               | Let primValue be ? ToPrimitive(argument, hint String). |
|               | Return ? ToString(primValue).                          |
|---------------|--------------------------------------------------------|
*/
function ToString(argument) { // eslint-disable-line no-unused-vars
	switch(Type(argument)) {
		case 'symbol':
			throw new TypeError('Cannot convert a Symbol value to a string');
			break;
		case 'object':
			var primValue = ToPrimitive(argument, 'string');
			return ToString(primValue);
		default:
			return String(argument);
	}
}

// _ESAbstract.ToInteger
// 7.1.4. ToInteger ( argument )
function ToInteger(argument) { // eslint-disable-line no-unused-vars
	// 1. Let number be ? ToNumber(argument).
	var number = Number(argument);
	// 2. If number is NaN, return +0.
	if (isNaN(number)) {
		return 0;
	}
	// 3. If number is +0, -0, +∞, or -∞, return number.
	if (1/number === Infinity || 1/number === -Infinity || number === Infinity || number === -Infinity) {
		return number;
	}
	// 4. Return the number value that is the same sign as number and whose magnitude is floor(abs(number)).
	return ((number < 0) ? -1 : 1) * Math.floor(Math.abs(number));
}

// _ESAbstract.ToLength
/* global ToInteger */
// 7.1.15. ToLength ( argument )
function ToLength(argument) { // eslint-disable-line no-unused-vars
	// 1. Let len be ? ToInteger(argument).
	var len = ToInteger(argument);
	// 2. If len ≤ +0, return +0.
	if (len <= 0) {
		return 0;
	}
	// 3. Return min(len, 253-1).
	return Math.min(len, Math.pow(2, 53) -1);
}

// String.prototype.padEnd
/* global CreateMethodProperty, RequireObjectCoercible, ToLength, ToString */
// 21.1.3.13. String.prototype.padEnd( maxLength [ , fillString ] )
CreateMethodProperty(String.prototype, 'padEnd', function padEnd(maxLength /* [ , fillString ] */) {
	'use strict';
	var fillString = arguments.length > 1 ? arguments[1] : undefined;
	// 1. Let O be ? RequireObjectCoercible(this value).
	var O = RequireObjectCoercible(this);
	// 2. Let S be ? ToString(O).
	var S = ToString(O);
	// 3. Let intMaxLength be ? ToLength(maxLength).
	var intMaxLength = ToLength(maxLength);
	// 4. Let stringLength be the length of S.
	var stringLength = S.length;
	// 5. If intMaxLength is not greater than stringLength, return S.
	if (intMaxLength <= stringLength) {
		return S;
	}
	// 6. If fillString is undefined, let filler be the String value consisting solely of the code unit 0x0020 (SPACE).
	if (fillString === undefined) {
		var filler = ' ';
		// 7. Else, let filler be ? ToString(fillString).
	} else {
		var filler = ToString(fillString);
	}
	// 8. If filler is the empty String, return S.
	if (filler === '') {
		return S;
	}
	// 9. Let fillLen be intMaxLength - stringLength.
	var fillLen = intMaxLength - stringLength;
	// 10. Let truncatedStringFiller be the String value consisting of repeated concatenations of filler truncated to length fillLen.
	var truncatedStringFiller = '';
	for (var i = 0; i < fillLen; i++) {
		truncatedStringFiller += filler;
	}
	truncatedStringFiller = truncatedStringFiller.substr(0, fillLen);
	// 11. Return the string-concatenation of S and truncatedStringFiller.
	return S + truncatedStringFiller;
});

// String.prototype.padStart
/* global CreateMethodProperty, RequireObjectCoercible, ToLength, ToString */
// 21.1.3.14. String.prototype.padStart( maxLength [ , fillString ] )
CreateMethodProperty(String.prototype, 'padStart', function padStart(maxLength /* [ , fillString ] */) {
	'use strict';
	var fillString = arguments.length > 1 ? arguments[1] : undefined;
	// 1. Let O be ? RequireObjectCoercible(this value).
	var O = RequireObjectCoercible(this);
	// 2. Let S be ? ToString(O).
	var S = ToString(O);
	// 3. Let intMaxLength be ? ToLength(maxLength).
	var intMaxLength = ToLength(maxLength);
	// 4. Let stringLength be the length of S.
	var stringLength = S.length;
	// 5. If intMaxLength is not greater than stringLength, return S.
	if (intMaxLength <= stringLength) {
		return S;
	}
	// 6. If fillString is undefined, let filler be the String value consisting solely of the code unit 0x0020 (SPACE).
	if (fillString === undefined) {
		var filler = ' ';
		// 7. Else, let filler be ? ToString(fillString).
	} else {
		var filler = ToString(fillString);
	}
	// 8. If filler is the empty String, return S.
	if (filler === '') {
		return S;
	}
	// 9. Let fillLen be intMaxLength - stringLength.
	var fillLen = intMaxLength - stringLength;
	// 10. Let truncatedStringFiller be the String value consisting of repeated concatenations of filler truncated to length fillLen.
	var truncatedStringFiller = '';
	for (var i = 0; i < fillLen; i++) {
		truncatedStringFiller += filler;
	}
	truncatedStringFiller = truncatedStringFiller.substr(0, fillLen);
	// 11. Return the string-concatenation of truncatedStringFiller and S.
	return truncatedStringFiller + S;
});

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
