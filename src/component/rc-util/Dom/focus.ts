function hidden(node:HTMLElement) {
  return node.style.display === 'none';
}

function visible(node:HTMLElement) {
  while (node) {
    if (node === document.body) {
      break;
    }
    if (hidden(node)) {
      return false;
    }
    node = node.parentNode as HTMLElement; // 忽略null 
  }
  return true;
}

function focusable(node:HTMLElement) {
  const nodeName = node.nodeName.toLowerCase();
  const tabIndex = parseInt(node.getAttribute('tabindex') || "0", 10);
  const hasTabIndex = !isNaN(tabIndex) && tabIndex > -1;

  if (visible(node)) {
    if (['input', 'select', 'textarea', 'button'].indexOf(nodeName) > -1) {
      return !(node as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement).disabled;
    } else if (nodeName === 'a') {
      return (node.getAttribute('href') || hasTabIndex);
    }
    return node.isContentEditable || hasTabIndex;
  }
}

export function getFocusNodeList(node:HTMLElement) {
  const res:HTMLElement[] = [].slice.call(node.querySelectorAll('*'), 0).filter((child) => {
    return focusable(child);
  });
  if (focusable(node)) {
    res.unshift(node);
  }
  return res;
}

let lastFocusElement:HTMLElement | null = null;

export function saveLastFocusNode() {
  lastFocusElement = document.activeElement as HTMLElement | null;
}

export function clearLastFocusNode() {
  lastFocusElement = null;
}

export function backLastFocusNode() {
  if (lastFocusElement) {
    try {
      // 元素可能已经被移动了
      lastFocusElement.focus();

    } catch (e) {
      // empty
    }
  }
}

export function limitTabRange(node:HTMLElement, e:KeyboardEvent) {
  if (e.keyCode === 9) {
    const tabNodeList = getFocusNodeList(node);
    const lastTabNode = tabNodeList[e.shiftKey ? 0 : tabNodeList.length - 1];
    const leavingTab = (lastTabNode === document.activeElement || node === document.activeElement);

    if (leavingTab) {
      const target = tabNodeList[e.shiftKey ? tabNodeList.length - 1 : 0];
      target.focus();
      e.preventDefault();
    }
  }
}
