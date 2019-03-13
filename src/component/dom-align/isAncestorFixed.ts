// e814757  on 19 Sep 2017
import * as utils from './utils';

export default function isAncestorFixed(element:Window | Document | HTMLElement) {
  if (utils.isWindow(element) || utils.isDocument(element)) {
    return false;
  }else{
    const doc = utils.getDocument(element);
    const body = doc.body;
    let parent = null;
    for (parent = element.parentNode; parent && parent !== body; parent = parent.parentNode) {
      const positionStyle = utils.css(parent as HTMLElement, 'position');
      if (positionStyle === 'fixed') {
        return true;
      }
    }
    return false;
  }
}