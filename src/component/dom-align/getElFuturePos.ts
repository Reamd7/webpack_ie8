// 488c315  on 20 Jul 2017
import * as R from "./@type";
import getAlignOffset from './getAlignOffset';

function getElFuturePos(elRegion:R.Region, refNodeRegion:R.Region, points:R.point[], offset:R.Offest, targetOffset:R.Offest) {
  const p1 = getAlignOffset(refNodeRegion, points[1]);
  const p2 = getAlignOffset(elRegion, points[0]);
  const diff = [p2.left - p1.left, p2.top - p1.top];

  return {
    left: elRegion.left - diff[0] + offset[0] - targetOffset[0],
    top: elRegion.top - diff[1] + offset[1] - targetOffset[1],
  };
}

export default getElFuturePos;