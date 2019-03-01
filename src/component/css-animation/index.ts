/** @format */

import Event from './Event'

const isCssAnimationSupported = Event.endEvents.length !== 0
const capitalPrefixes = [
  'Webkit',
  'Moz',
  'O',
  // ms is special .... !
  'ms',
]
const prefixes = ['-webkit-', '-moz-', '-o-', 'ms-', '']

function getStyleProperty(node: Element, name: string) {
  // old ff need null, https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  const style = window.getComputedStyle(node, null)
  let ret = ''
  for (let i = 0; i < prefixes.length; i++) {
    ret = style.getPropertyValue(prefixes[i] + name)
    if (ret) {
      break
    }
  }
  return ret
}
type AniNode = HTMLElement & {
  rcEndListener?: ( (e?:Event) => void ) | null;
  rcAnimTimeout?: NodeJS.Timeout | null;
  rcEndAnimTimeout?: NodeJS.Timeout | null;
}
function fixBrowserByTimeout(node: AniNode) {
  if (isCssAnimationSupported) {
    const transitionDelay =
      parseFloat(getStyleProperty(node, 'transition-delay')) || 0
    const transitionDuration =
      parseFloat(getStyleProperty(node, 'transition-duration')) || 0
    const animationDelay =
      parseFloat(getStyleProperty(node, 'animation-delay')) || 0
    const animationDuration =
      parseFloat(getStyleProperty(node, 'animation-duration')) || 0
    const time = Math.max(
      transitionDuration + transitionDelay,
      animationDuration + animationDelay
    )
    // sometimes, browser bug
    node.rcEndAnimTimeout = setTimeout(() => {
      node.rcEndAnimTimeout = null
      if (node.rcEndListener) {
        node.rcEndListener()
      }
    }, time * 1000 + 200)
  }
}

function clearBrowserBugTimeout(node: AniNode) {
  if (node.rcEndAnimTimeout) {
    clearTimeout(node.rcEndAnimTimeout)
    node.rcEndAnimTimeout = null
  }
}
type CallBackEnd = () => unknown
type CallBackObj = {
  end: () => unknown
  start: () => unknown
  active: () => unknown
}
const cssAnimation = (
  node: AniNode,
  transitionName:
    | string
    | {
        name: string
        active: string
      },
  endCallback: CallBackEnd | CallBackObj
) => {
  const [className, activeClassName] =
    typeof transitionName === 'string'
      ? [transitionName, `${transitionName}-active`]
      : [transitionName.name, transitionName.active]

  let end = endCallback
  let start: undefined | (() => unknown) = undefined;
  let active: undefined | (() => unknown) = undefined;
  const nodeClasses = node.classList

  if ( typeof endCallback !== "function" ) {
    end = endCallback.end
    start = endCallback.start
    active = endCallback.active
  }

  if (node.rcEndListener) {
    node.rcEndListener()
  }

  node.rcEndListener = (e?: Event) => {
    if (e && e.target !== node) {
      return
    }

    if (node.rcAnimTimeout) {
      clearTimeout(node.rcAnimTimeout)
      node.rcAnimTimeout = null
    }

    clearBrowserBugTimeout(node)

    nodeClasses.remove(className)
    nodeClasses.remove(activeClassName)

    Event.removeEndEventListener(node, node.rcEndListener!)
    node.rcEndListener = null

    // Usually this optional end is used for informing an owner of
    // a leave animation and telling it to remove the child.
    if (end) {
      (end as CallBackEnd)()
    }
  }

  Event.addEndEventListener(node, node.rcEndListener)

  if (start) {
    start()
  }
  nodeClasses.add(className)

  node.rcAnimTimeout = setTimeout(() => {
    node.rcAnimTimeout = null
    nodeClasses.add(activeClassName)
    if (active) {
      setTimeout(active, 0)
    }
    fixBrowserByTimeout(node)
    // 30ms for firefox
  }, 30)

  return {
    stop() {
      if (node.rcEndListener) {
        node.rcEndListener()
      }
    },
  }
}

cssAnimation.style = (
  node: AniNode,
  style: CSSStyleDeclaration,
  callback?: () => void
) => {
  if (node.rcEndListener) {
    node.rcEndListener()
  }

  node.rcEndListener = (e?:Event) => {
    if (e && e.target !== node) {
      return
    }

    if (node.rcAnimTimeout) {
      clearTimeout(node.rcAnimTimeout)
      node.rcAnimTimeout = null
    }

    clearBrowserBugTimeout(node)

    Event.removeEndEventListener(node, node.rcEndListener!) // 强制忽略null | undefined
    node.rcEndListener = null

    // Usually this optional callback is used for informing an owner of
    // a leave animation and telling it to remove the child.
    if (callback) {
      callback()
    }
  }

  Event.addEndEventListener(node, node.rcEndListener)

  node.rcAnimTimeout = setTimeout(() => {
    for (const s in style) {
      if (style.hasOwnProperty(s)) {
        node.style[s] = style[s]
      }
    }
    node.rcAnimTimeout = null
    fixBrowserByTimeout(node)
  }, 0)
}

cssAnimation.setTransition = (node: HTMLElement, p: string, value?: string) => {
  let property = p
  let v = value
  if (value === undefined) {
    v = property
    property = ''
  }
  property = property || ''
  capitalPrefixes.forEach((prefix) => {
    // CSS 重设
    (node.style as any)[`${prefix}Transition${property}`] = v
  })
}

cssAnimation.isCssAnimationSupported = isCssAnimationSupported

export { isCssAnimationSupported }

export default cssAnimation
