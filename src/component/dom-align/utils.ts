let vendorPrefix:string | undefined;

const jsCssMap = {
  Webkit: '-webkit-',
  Moz: '-moz-',
  // IE did it wrong again ...
  ms: '-ms-',
  O: '-o-',
};

function getVendorPrefix() {
  if (vendorPrefix !== undefined) {
    return vendorPrefix;
  }
  vendorPrefix = '';
  const style = document.createElement('p').style;
  const testProp = 'Transform';
  for (const key in jsCssMap) {
    if (key + testProp in style) {
      vendorPrefix = key;
    }
  }
  return vendorPrefix;
}

function getTransitionName():string {
  return getVendorPrefix() ? `${getVendorPrefix()}TransitionProperty` : 'transitionProperty';
}

export function getTransformName():string {
  return getVendorPrefix() ? `${getVendorPrefix()}Transform` : 'transform';
}


/**
 * A crude way of determining if an object is a window
 * @member util
 */
export function isWindow(obj:any):obj is Window {
  // must use == for ie8
  return obj !== null && obj !== undefined && obj == obj.window;
}
export function getDocument(node:Document | Node | Window) {
  if (isWindow(node)) {
    return node.document;
  }
  if (node.nodeType === 9) {
    return node as Document;
  }
  return node.ownerDocument!; // !!
}
export function getWindow(node:Window | Document): Window{
  // if (node && node.document && node.setTimeout) {
  //   return node;
  // }
  if (isWindow(node)) {
    return node;
  }
  const doc = node.ownerDocument || node;
  return doc.defaultView || (doc as any).parentWindow;
}

function getScroll(w:Window, top?:boolean) {
  let retMethod = `page${top ? 'Y' : 'X'}Offset` as "pageYOffset" | "pageXOffset";
  let ret = w[retMethod];
  const method = `scroll${top ? 'Top' : 'Left'}` as "scrollTop" | "scrollLeft";
  if (typeof ret !== 'number') {
    const d = w.document;
    // ie6,7,8 standard mode
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method];
    }
  }
  return ret;
}
export function getWindowScrollLeft(w:Window) {
  return getScroll(w);
}
export function getWindowScrollTop(w:Window) {
  return getScroll(w, true);
}
function getClientPosition(elem:Element) {
  let box;
  let x;
  let y;
  const doc = elem.ownerDocument!; // !! 
  const body = doc.body;
  const docElem = doc && doc.documentElement;
  // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
  box = elem.getBoundingClientRect();

  // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
  // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
  // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

  x = box.left;
  y = box.top;

  // In IE, most of the time, 2 extra pixels are added to the top and left
  // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
  // IE6 standards mode, this border can be overridden by setting the
  // document element's border to zero -- thus, we cannot rely on the
  // offset always being 2 pixels.

  // In quirks mode, the offset can be determined by querying the body's
  // clientLeft/clientTop, but in standards mode, it is found by querying
  // the document element's clientLeft/clientTop.  Since we already called
  // getClientBoundingRect we have already forced a reflow, so it is not
  // too expensive just to query them all.

  // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
  // 窗口边框标准是设 documentElement ,quirks 时设置 body
  // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
  // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
  // 标准 ie 下 docElem.clientTop 就是 border-top
  // ie7 html 即窗口边框改变不了。永远为 2
  // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0

  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;

  return {
    left: x,
    top: y,
  };
}
function getOffset(el:Element) {
  const pos = getClientPosition(el);
  const doc = el.ownerDocument as any; // document
  const w = doc.defaultView || doc.parentWindow;
  pos.left += getWindowScrollLeft(w);
  pos.top += getWindowScrollTop(w);
  return pos;
}
type offsetOption = {
  useCssRight?:boolean;
  useCssBottom?:boolean;
  useCssTransform?:boolean;
}
type offset = ReturnType<typeof getClientPosition>
// 设置 elem 相对 elem.ownerDocument 的坐标
function setLeftTop(elem:HTMLElement, offset:offset, option:offsetOption) {
  // set position first, in-case top/left are set even on static elem
  if (css(elem, 'position') === 'static') {
    elem.style.position = 'relative';
  }
  let presetH = -999;
  let presetV = -999;
  const horizontalProperty = getOffsetDirection('left', option);
  const verticalProperty = getOffsetDirection('top', option);
  const oppositeHorizontalProperty = oppositeOffsetDirection(horizontalProperty);
  const oppositeVerticalProperty = oppositeOffsetDirection(verticalProperty);

  if (horizontalProperty !== 'left') {
    presetH = 999;
  }

  if (verticalProperty !== 'top') {
    presetV = 999;
  }
  let originalTransition = '';
  const originalOffset = getOffset(elem);
  if ('left' in offset || 'top' in offset) {
    originalTransition = getTransitionProperty(elem) || '';
    setTransitionProperty(elem, 'none');
  }
  if ('left' in offset) {
    elem.style[oppositeHorizontalProperty] = '';
    elem.style[horizontalProperty] = `${presetH}px`;
  }
  if ('top' in offset) {
    elem.style[oppositeVerticalProperty] = '';
    elem.style[verticalProperty] = `${presetV}px`;
  }
  // force relayout
  forceRelayout(elem);
  const old = getOffset(elem);
  const originalStyle:{
    left?:number;
    top?:number;
    right?:number;
    bottom?:number;
  } = {};
  let key : "left" | "top"
  for ( key in offset) {
    if (offset.hasOwnProperty(key)) {
      const dir = getOffsetDirection(key, option);
      const preset = key === 'left' ? presetH : presetV;
      const off = originalOffset[key] - old[key];
      if (dir === key) {
        originalStyle[dir] = preset + off;
      } else {
        originalStyle[dir] = preset - off;
      }
    }
  }
  css(elem, originalStyle);
  // force relayout
  forceRelayout(elem);
  if ('left' in offset || 'top' in offset) {
    setTransitionProperty(elem, originalTransition);
  }
  const ret:typeof originalStyle = {};
  let offsetkey: keyof typeof offset;
  for (offsetkey in offset) {
    if (offset.hasOwnProperty(offsetkey)) {
      const dir = getOffsetDirection(offsetkey, option);
      const off = offset[offsetkey] - originalOffset[offsetkey];
      if (offsetkey === dir) {
        ret[dir] = originalStyle[dir]! + off;
      } else {
        ret[dir] = originalStyle[dir]! - off;
      }
    }
  }
  css(elem, ret);
}
function setTransform(elem:HTMLElement, offset:offset) {
  const originalOffset = getOffset(elem);
  const originalXY = getTransformXY(elem);
  const resultXY = { x: originalXY.x, y: originalXY.y };
  if ('left' in offset) {
    resultXY.x = originalXY.x + offset.left - originalOffset.left;
  }
  if ('top' in offset) {
    resultXY.y = originalXY.y + offset.top - originalOffset.top;
  }
  setTransformXY(elem, resultXY);
}

function setOffset(elem:HTMLElement, offset:offset, option:offsetOption) {
  if (option.useCssRight || option.useCssBottom) {
    setLeftTop(elem, offset, option);
  } else if (option.useCssTransform && getTransformName() in document.body.style) {
    // setTransform(elem, offset, option);
    setTransform(elem, offset);
  } else {
    setLeftTop(elem, offset, option);
  }
}

export function offset(el:HTMLElement, value?:offset, option?:{
  useCssRight?:boolean;
  useCssBottom?:boolean;
  useCssTransform?:boolean;
}):void | offset {
  if (typeof value !== 'undefined') {
    setOffset(el, value, option || {});
  } else {
    return getOffset(el);
  }
}