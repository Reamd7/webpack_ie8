import contains from '../rc-util/Dom/contains';

export function buffer(fn:Function, ms:number) {
  let timer:number | null;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function bufferFn() {
    clear();
    timer = setTimeout(fn, ms);
  }

  bufferFn.clear = clear;

  return bufferFn;
}
type Point = {
    clientX?: number,
    clientY?: number,
    pageX?: number,
    pageY?: number,
}
export function isSamePoint(prev:Point, next:Point) {
  if (prev === next) return true;
  if (!prev || !next) return false;

  if ('pageX' in next && 'pageY' in next) {
    return prev.pageX === next.pageX && prev.pageY === next.pageY;
  }

  if ('clientX' in next && 'clientY' in next) {
    return prev.clientX === next.clientX && prev.clientY === next.clientY;
  }

  return false;
}

export function isWindow(obj:any) {
  return obj && typeof obj === 'object' && obj.window === obj;
}

export function isSimilarValue(val1:number, val2:number) {
  const int1 = Math.floor(val1);
  const int2 = Math.floor(val2);
  return Math.abs(int1 - int2) <= 1;
}

export function restoreFocus(activeElement:HTMLElement, container:Node| null) {
  // Focus back if is in the container
  if (
    activeElement !== document.activeElement &&
    contains(container, activeElement)
  ) {
    activeElement.focus();
  }
}