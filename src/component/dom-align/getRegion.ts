// 7b6847a  on 8 Oct 2015
import * as utils from './utils';
import * as R from "./@type";
function getRegion(node:Window | Document | HTMLElement):R.Region {
  let offset:any;
  let w;
  let h;
  if (!utils.isWindow(node) && !utils.isDocument(node)) {
    offset = utils.offset(node) as Exclude<ReturnType<typeof utils.offset>,undefined>;
    w = utils.outerWidth(node);
    h = utils.outerHeight(node);
  } else {
    const win = utils.getWindow(node);
    offset = {
      left: utils.getWindowScrollLeft(win),
      top: utils.getWindowScrollTop(win),
    };
    w = utils.viewportWidth(win);
    h = utils.viewportHeight(win);
  }
  offset.width = w;
  offset.height = h;
  return offset;
}

export default getRegion;