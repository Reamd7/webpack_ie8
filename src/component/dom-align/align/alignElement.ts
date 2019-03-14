import doAlign from './align';
import getOffsetParent from '../getOffsetParent';
import getVisibleRectForElement from '../getVisibleRectForElement';
import getRegion from '../getRegion';
import * as R from '../@type'

function isOutOfVisibleRect(target: Document | Window | HTMLElement) {
    const visibleRect = getVisibleRectForElement(target)
    const targetRegion = getRegion(target)
  
    return (
      !visibleRect ||
      targetRegion.left + targetRegion.width <= visibleRect.left ||
      targetRegion.top + targetRegion.height <= visibleRect.top ||
      targetRegion.left >= visibleRect.right ||
      targetRegion.top >= visibleRect.bottom
    )
  }
function alignElement(el:HTMLElement, refNode:Window | HTMLElement, align:R.alignConfig) {
  const target = align.target || refNode;
  const refNodeRegion = getRegion(target);

  const isTargetNotOutOfVisible = !isOutOfVisibleRect(target);

  return doAlign(el, refNodeRegion, align, isTargetNotOutOfVisible);
}

alignElement.__getOffsetParent = getOffsetParent;

alignElement.__getVisibleRectForElement = getVisibleRectForElement;

export default alignElement;