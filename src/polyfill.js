import 'es5-shim'; //IE8 ^4.5.10
import 'object-create-ie8';//IE8, 我写的库，这样就不用加上es5-sham
import 'object-defineproperty-ie8';//IE8， 我写的库
import 'console-polyfill';//IE8下，如果你不打开开发者工具，window下是没有console这个对象的，
import 'json3';  //比IE8的JSON好用
//只有打开了F12才会有这个方法

import 'bluebird'; //性能超高的Promise实现
import 'fetch-polyfill2'; //fetch 实现，我的另一力作

import 'core-js/fn/object/is';