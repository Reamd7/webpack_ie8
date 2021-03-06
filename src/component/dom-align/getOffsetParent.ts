// 7fb85c5  on 16 May 2017
import * as utils from './utils';

/**
 * 得到会导致元素显示不全的祖先元素
 */

function getOffsetParent(element:Window | Document | HTMLElement) {
  if (utils.isWindow(element) || utils.isDocument(element)) {
    return null;
  }
  // ie 这个也不是完全可行
  /*
   <div style="width: 50px;height: 100px;overflow: hidden">
   <div style="width: 50px;height: 100px;position: relative;" id="d6">
   元素 6 高 100px 宽 50px<br/>
   </div>
   </div>
   */
  // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
  //  In other browsers it only includes elements with position absolute, relative or
  // fixed, not elements with overflow set to auto or scroll.
  //        if (UA.ie && ieMode < 8) {
  //            return element.offsetParent;
  //        }
  // 统一的 offsetParent 方法
  const doc = utils.getDocument(element);
  const body = doc.body;
  let parent;
  let positionStyle = utils.css(element, 'position');
  const skipStatic = positionStyle === 'fixed' || positionStyle === 'absolute';

  if (!skipStatic) {
    return element.nodeName.toLowerCase() === 'html' ? null : element.parentNode;
  }

  for (parent = element.parentNode; parent && parent !== body; parent = parent.parentNode) {
    positionStyle = utils.css(parent as HTMLElement, 'position');
    if (positionStyle !== 'static') {
      return parent;
    }
  }
  return null;
}

export default getOffsetParent;