/* eslint-disable no-nested-ternary */
const PIXEL_PATTERN = /margin|padding|width|height|max|min|offset/;

const removePixel:{
  [key:string]:boolean
} = {
  left: true,
  top: true,
};
const floatMap:{
  [name:string]:number
} = {
  cssFloat: 1,
  styleFloat: 1,
  float: 1,
};

// !! 
function getComputedStyle(node:Element) {
  return node.ownerDocument!.defaultView!.getComputedStyle(node, null);
  // return node.nodeType === 1 ? node.ownerDocument!.defaultView!.getComputedStyle(node, null) : {};
}

function getStyleValue(node:HTMLElement, type:string, value:string) {
  type = type.toLowerCase();
  if (value === 'auto') {
    if (type === 'height') {
      return node.offsetHeight;
    }
    if (type === 'width') {
      return node.offsetWidth;
    }
  }
  if (!(type in removePixel)) {
    removePixel[type] = PIXEL_PATTERN.test(type);
  }
  return removePixel[type] ? (parseFloat(value) || 0) : value;
}

type CSSKey = Exclude<keyof CSSStyleDeclaration, number>;
export function get(node:HTMLElement, name?:CSSKey) {
  const style = getComputedStyle(node); // ie polyfill
  // polyfill
  name = floatMap[name || ""] ? (
    'cssFloat' in node.style ? 'cssFloat' : 'styleFloat' as CSSKey
  ) : name;

  return (!name) ? style : getStyleValue(node, name, style[name] || node.style[name]);
}

export function set(node:HTMLElement, name:string | {
  [key: string] : any
}, value?:any) {
  if (typeof name === "string"){
    name = floatMap[name] ? 'cssFloat' in node.style ? 'cssFloat' : 'styleFloat' : name;
      
    if (value !== undefined) {
      if (typeof value === 'number' && PIXEL_PATTERN.test(name)) {
        value = `${value}px`;
      }
      // 由于在 typescript 中定义某些量是不可变的, 所以设置为
      node.style[name as any] = value; // Number
      return value;
    }
  }else{
    for (const x in name) {
      if (name.hasOwnProperty(x)) {
        set(node, x, name[x]);
      }
    }
    return getComputedStyle(node);
  }
}

export function getOuterWidth(el:HTMLElement) {
  if (el === document.body) {
    return document.documentElement.clientWidth;
  }
  return el.offsetWidth;
}

export function getOuterHeight(el:HTMLElement) {
  if (el === document.body) {
    return window.innerHeight || document.documentElement.clientHeight;
  }
  return el.offsetHeight;
}

export function getDocSize() {
  const width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

  return {
    width,
    height,
  };
}

export function getClientSize() {
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  return {
    width,
    height,
  };
}

export function getScroll() {
  return {
    scrollLeft: Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
    scrollTop: Math.max(document.documentElement.scrollTop, document.body.scrollTop),
  };
}

export function getOffset(node:HTMLElement) {
  const box = node.getBoundingClientRect();
  const docElem = document.documentElement;

  // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
  return {
    left: box.left + (window.pageXOffset || docElem.scrollLeft) -
      (docElem.clientLeft || document.body.clientLeft || 0),
    top: box.top + (window.pageYOffset || docElem.scrollTop) -
      (docElem.clientTop || document.body.clientTop || 0),
  };
}
