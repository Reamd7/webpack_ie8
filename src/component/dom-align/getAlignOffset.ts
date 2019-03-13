// 488c315  on 20 Jul 2017
import * as R from "./@type";

/**
 * 获取 node 上的 align 对齐点 相对于页面的坐标
 */
function getAlignOffset(region: R.Region, align: R.point) {
  const V = align.charAt(0)
  const H = align.charAt(1)
  const w = region.width
  const h = region.height

  let x = region.left
  let y = region.top

  if (V === 'c') {
    y += h / 2
  } else if (V === 'b') {
    y += h
  }

  if (H === 'c') {
    x += w / 2
  } else if (H === 'r') {
    x += w
  }

  return {
    left: x,
    top: y,
  }
}

export default getAlignOffset
