/** @format */

const START_EVENT_NAME_MAP = {
  transitionstart: {
    transition: 'transitionstart',
    WebkitTransition: 'webkitTransitionStart',
    MozTransition: 'mozTransitionStart',
    OTransition: 'oTransitionStart',
    msTransition: 'MSTransitionStart',
  },

  animationstart: {
    animation: 'animationstart',
    WebkitAnimation: 'webkitAnimationStart',
    MozAnimation: 'mozAnimationStart',
    OAnimation: 'oAnimationStart',
    msAnimation: 'MSAnimationStart',
  },
}

const END_EVENT_NAME_MAP = {
  transitionend: {
    transition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'mozTransitionEnd',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
  },

  animationend: {
    animation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    OAnimation: 'oAnimationEnd',
    msAnimation: 'MSAnimationEnd',
  },
}

type KEY<T> = keyof T;
type VAL<T> = T[KEY<T>];

type START_EVENT_NAME_MAP = {
  transitionstart: {
    transition: 'transitionstart',
    WebkitTransition: 'webkitTransitionStart',
    MozTransition: 'mozTransitionStart',
    OTransition: 'oTransitionStart',
    msTransition: 'MSTransitionStart',
  },

  animationstart: {
    animation: 'animationstart',
    WebkitAnimation: 'webkitAnimationStart',
    MozAnimation: 'mozAnimationStart',
    OAnimation: 'oAnimationStart',
    msAnimation: 'MSAnimationStart',
  },
}
type END_EVENT_NAME_MAP = {
  transitionend: {
    transition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'mozTransitionEnd',
    OTransition: 'oTransitionEnd',
    msTransition: 'MSTransitionEnd',
  },

  animationend: {
    animation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
    MozAnimation: 'mozAnimationEnd',
    OAnimation: 'oAnimationEnd',
    msAnimation: 'MSAnimationEnd',
  },
}

type START_EVENT_NAME_MAP_ALL = VAL<START_EVENT_NAME_MAP["animationstart"]> | VAL<START_EVENT_NAME_MAP["transitionstart"]>
type END_EVENT_NAME_MAP_ALL = VAL<END_EVENT_NAME_MAP["animationend"]> | VAL<END_EVENT_NAME_MAP["transitionend"]>


const startEvents:Array<START_EVENT_NAME_MAP_ALL> = []
const endEvents:Array<END_EVENT_NAME_MAP_ALL> = []

function detectEvents() {
  const testEl = document.createElement('div')
  const style = testEl.style

  if (!('AnimationEvent' in window)) {
    delete START_EVENT_NAME_MAP.animationstart.animation
    delete END_EVENT_NAME_MAP.animationend.animation
  }

  if (!('TransitionEvent' in window)) {
    delete START_EVENT_NAME_MAP.transitionstart.transition
    delete END_EVENT_NAME_MAP.transitionend.transition
  }

  function process(
    EVENT_NAME_MAP: {
      [key: string]:any
    }, 
    events:Array<START_EVENT_NAME_MAP_ALL | END_EVENT_NAME_MAP_ALL>
  ) {
    for (const baseEventName in EVENT_NAME_MAP) {
      if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
        const baseEvents = EVENT_NAME_MAP[baseEventName]
        for (const styleName in baseEvents) {
          if (styleName in style) {
            events.push(baseEvents[styleName])
            break
          }
        }
      }
    }
  }

  process(START_EVENT_NAME_MAP, startEvents)
  process(END_EVENT_NAME_MAP, endEvents)
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  detectEvents()
}

function addEventListener(node:HTMLElement, eventName:string, eventListener:EventListener) {
  node.addEventListener(eventName, eventListener, false)
}

function removeEventListener(node:HTMLElement, eventName:string, eventListener:EventListener) {
  node.removeEventListener(eventName, eventListener, false)
}

const TransitionEvents = {
  // Start events
  startEvents,

  addStartEventListener(node:HTMLElement, eventListener:EventListener) {
    if (startEvents.length === 0) {
      window.setTimeout(eventListener as EventListener, 0)
      return
    }
    startEvents.forEach((startEvent) => {
      addEventListener(node, startEvent, eventListener)
    })
  },

  removeStartEventListener(node:HTMLElement, eventListener:EventListener) {
    if (startEvents.length === 0) {
      return
    }
    startEvents.forEach((startEvent) => {
      removeEventListener(node, startEvent, eventListener)
    })
  },

  // End events
  endEvents,

  addEndEventListener(node:HTMLElement, eventListener:EventListener) {
    if (endEvents.length === 0) {
      window.setTimeout(eventListener, 0)
      return
    }
    endEvents.forEach((endEvent) => {
      addEventListener(node, endEvent, eventListener)
    })
  },

  removeEndEventListener(node:HTMLElement, eventListener:EventListener) {
    if (endEvents.length === 0) {
      return
    }
    endEvents.forEach((endEvent) => {
      removeEventListener(node, endEvent, eventListener)
    })
  },
}

export default TransitionEvents
