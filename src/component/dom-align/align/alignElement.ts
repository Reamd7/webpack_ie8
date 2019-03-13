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
type PropsOffest = [string | number, string | number] // 将 offset 转换成数值，支持百分比

function alignElement(el:HTMLElement, refNode:HTMLElement, align:{
    points: [R.point, R.point]
    offset?: PropsOffest
    targetOffset?: PropsOffest
    overflow?: {
      adjustX?: boolean
      adjustY?: boolean
    }
    useCssRight?: boolean
    useCssBottom?: boolean
    useCssTransform?: boolean
    ignoreShake?:boolean
    target:HTMLElement,
    source:HTMLElement,
  }) {
  const target = align.target || refNode;
  const refNodeRegion = getRegion(target);

  const isTargetNotOutOfVisible = !isOutOfVisibleRect(target);

  return doAlign(el, refNodeRegion, align, isTargetNotOutOfVisible);
}

alignElement.__getOffsetParent = getOffsetParent;

alignElement.__getVisibleRectForElement = getVisibleRectForElement;

export default alignElement;