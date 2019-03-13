/**
 * align dom node flexibly
 *
 * @format
 * @author yiminghe@gmail.com
 */

import * as R from '../@type'
import * as utils from '../utils'
// import getOffsetParent from '../getOffsetParent'
import getVisibleRectForElement from '../getVisibleRectForElement'
import adjustForViewport from '../adjustForViewport'
import getRegion from '../getRegion'
import getElFuturePos from '../getElFuturePos'

// http://yiminghe.iteye.com/blog/1124720

function isFailX(elFuturePos: R.Pos, elRegion: R.Region, visibleRect: R.Rect) {
  return (
    elFuturePos.left < visibleRect.left ||
    elFuturePos.left + elRegion.width > visibleRect.right
  )
}

function isFailY(elFuturePos: R.Pos, elRegion: R.Region, visibleRect: R.Rect) {
  return (
    elFuturePos.top < visibleRect.top ||
    elFuturePos.top + elRegion.height > visibleRect.bottom
  )
}

function isCompleteFailX(
  elFuturePos: R.Pos,
  elRegion: R.Region,
  visibleRect: R.Rect
) {
  return (
    elFuturePos.left > visibleRect.right ||
    elFuturePos.left + elRegion.width < visibleRect.left
  )
}

function isCompleteFailY(
  elFuturePos: R.Pos,
  elRegion: R.Region,
  visibleRect: R.Rect
) {
  return (
    elFuturePos.top > visibleRect.bottom ||
    elFuturePos.top + elRegion.height < visibleRect.top
  )
}
function flip(
  points: R.point[],
  reg: RegExp,
  map: {
    [key: string]: string
  }
) {
  const ret:string[] =  []
  utils.each(points, (p) => {
    ret.push(
      p.replace(reg, (m:string) => {
        return map[m]
      })
    )
  })
  return ret
}
function flipOffset(offset: R.Offest, index: 0 | 1) {
  offset[index] = -offset[index]
  return offset
}

function convertOffset(str: string, offsetLen: number) {
  let n
  if (/%$/.test(str)) {
    n = (parseInt(str.substring(0, str.length - 1), 10) / 100) * offsetLen
  } else {
    n = parseInt(str, 10)
  }
  return n || 0
}
type PropsOffest = [string | number, string | number] // 将 offset 转换成数值，支持百分比
function normalizeOffset(
  offset: PropsOffest,
  el: {
    width: number
    height: number
  }
): R.Offest {
  return [
    convertOffset(String(offset[0]), el.width),
    convertOffset(String(offset[1]), el.height),
  ]
}

function domAlign(
  el: HTMLElement,
  refNode: HTMLElement,
  align: {
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
  },
  isTargetNotOutOfVisible:boolean
) {
  let points: [R.point, R.point] = align.points
  let overflow: {
    adjustX?: boolean
    adjustY?: boolean
  } = align.overflow || {}
  const target = align.target || refNode
  const source = align.source || el

  // overflow = overflow || {};
  const newOverflowCfg:{
    resizeWidth?:number, resizeHeight?:number,
    adjustX?: boolean, adjustY?: boolean 
} = {}
  let fail = 0
  // 当前节点可以被放置的显示区域
  const visibleRect = getVisibleRectForElement(source)
  // 当前节点所占的区域, left/top/width/height
  const elRegion = getRegion(source)
  // 参照节点所占的区域, left/top/width/height
  const refNodeRegion = getRegion(target)

  // 将 offset 转换成数值，支持百分比
  // let offset = align.offset || [0, 0];
  // offset = [
  //   offset[0],offset[1]
  // ].concat(offset);
  let offset = normalizeOffset(align.offset || [0, 0], elRegion)

  // let targetOffset = align.targetOffset || [0, 0]
  // targetOffset = [].concat(targetOffset);
  // targetOffset = [targetOffset[0], targetOffset[1]]
  let targetOffset = normalizeOffset(
    align.targetOffset || [0, 0],
    refNodeRegion
  )
  // 当前节点将要被放置的位置
  let elFuturePos = getElFuturePos(
    elRegion,
    refNodeRegion,
    points,
    offset,
    targetOffset
  )
  // 当前节点将要所处的区域
  let newElRegion = utils.merge(elRegion, elFuturePos) as R.Region
  
  // !! 提取出来
  // const isTargetNotOutOfVisible = !isOutOfVisibleRect(target)

  // 如果可视区域不能完全放置当前节点时允许调整
  if (
    visibleRect &&
    (overflow.adjustX || overflow.adjustY) &&
    isTargetNotOutOfVisible
  ) {
    if (overflow.adjustX) {
      // 如果横向不能放下
      if (isFailX(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        const newPoints = flip(points, /[lr]/gi, {
          l: 'r',
          r: 'l',
        }) as [R.point, R.point]
        // 偏移量也反下
        const newOffset = flipOffset(offset, 0)
        const newTargetOffset = flipOffset(targetOffset, 0)
        const newElFuturePos = getElFuturePos(
          elRegion,
          refNodeRegion,
          newPoints,
          newOffset,
          newTargetOffset
        )

        if (!isCompleteFailX(newElFuturePos, elRegion, visibleRect)) {
          fail = 1
          points = newPoints
          offset = newOffset
          targetOffset = newTargetOffset
        }
      }
    }

    if (overflow.adjustY) {
      // 如果纵向不能放下
      if (isFailY(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        const newPoints = flip(points, /[tb]/gi, {
          t: 'b',
          b: 't',
        }) as [R.point, R.point]
        // 偏移量也反下
        const newOffset = flipOffset(offset, 1)
        const newTargetOffset = flipOffset(targetOffset, 1)
        const newElFuturePos = getElFuturePos(
          elRegion,
          refNodeRegion,
          newPoints,
          newOffset,
          newTargetOffset
        )

        if (!isCompleteFailY(newElFuturePos, elRegion, visibleRect)) {
          fail = 1
          points = newPoints
          offset = newOffset
          targetOffset = newTargetOffset
        }
      }
    }

    // 如果失败，重新计算当前节点将要被放置的位置
    if (fail) {
      elFuturePos = getElFuturePos(
        elRegion,
        refNodeRegion,
        points,
        offset,
        targetOffset
      )
      utils.mix(newElRegion, elFuturePos)
    }
    const isStillFailX = isFailX(elFuturePos, elRegion, visibleRect)
    const isStillFailY = isFailY(elFuturePos, elRegion, visibleRect)
    // 检查反下后的位置是否可以放下了，如果仍然放不下：
    // 1. 复原修改过的定位参数
    if (isStillFailX || isStillFailY) {
      points = align.points
      offset = align.offset || [0, 0] as any
      targetOffset = align.offset || [0, 0] as any
    }
    // 2. 只有指定了可以调整当前方向才调整
    newOverflowCfg.adjustX = overflow.adjustX && isStillFailX
    newOverflowCfg.adjustY = overflow.adjustY && isStillFailY

    // 确实要调整，甚至可能会调整高度宽度
    if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
      newElRegion = adjustForViewport(
        elFuturePos,
        elRegion,
        visibleRect,
        newOverflowCfg
      )
    }
  }

  // need judge to in case set fixed with in css on height auto element
  if (newElRegion.width !== elRegion.width) {
    utils.css(
      source,
      'width',
      String(
        Number(utils.width(source) as number) +
          newElRegion.width -
          elRegion.width
      )
    )
  }

  if (newElRegion.height !== elRegion.height) {
    utils.css(
      source,
      'height',
      String(
        Number(utils.height(source)) + newElRegion.height - elRegion.height
      )
    )
  }

  // https://github.com/kissyteam/kissy/issues/190
  // 相对于屏幕位置没变，而 left/top 变了
  // 例如 <div 'relative'><el absolute></div>
  utils.offset(
    source,
    {
      left: newElRegion.left,
      top: newElRegion.top,
    },
    {
      useCssRight: align.useCssRight,
      useCssBottom: align.useCssBottom,
      useCssTransform: align.useCssTransform,
      ignoreShake: align.ignoreShake, // !!
    }
  )

  return {
    points,
    offset,
    targetOffset,
    overflow: newOverflowCfg,
  }
}
