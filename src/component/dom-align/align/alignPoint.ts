import * as utils from '../utils';
import doAlign from './align';
import * as R from "../@type";
/**
 * `tgtPoint`: { pageX, pageY } or { clientX, clientY }.
 * If client position provided, will internal convert to page position.
 */

function alignPoint(el:HTMLElement, tgtPoint:{ pageX:number, pageY:number } | { clientX:number, clientY:number }, align:{
  points: [R.point, R.point]
  offset?: R.PropsOffest
  targetOffset?: R.PropsOffest
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
  let pageX;
  let pageY;

  const doc = utils.getDocument(el);
  const win = doc.defaultView || (doc as any).parentWindow;

  const scrollX = utils.getWindowScrollLeft(win);
  const scrollY = utils.getWindowScrollTop(win);
  const viewportWidth = utils.viewportWidth(win);
  const viewportHeight = utils.viewportHeight(win);

  if ('pageX' in tgtPoint) {
    pageX = tgtPoint.pageX;
  } else {
    pageX = scrollX + tgtPoint.clientX;
  }

  if ('pageY' in tgtPoint) {
    pageY = tgtPoint.pageY;
  } else {
    pageY = scrollY + tgtPoint.clientY;
  }

  const tgtRegion = {
    left: pageX,
    top: pageY,
    width: 0,
    height: 0,
  };

  const pointInView = (pageX >= 0 && pageX <= scrollX + viewportWidth) &&
    (pageY >= 0 && pageY <= scrollY + viewportHeight);

  // Provide default target point
  const points:[R.point, R.point] = [align.points[0], 'cc'];

  return doAlign(el, tgtRegion, { ...align, points }, pointInView);
}

export default alignPoint;