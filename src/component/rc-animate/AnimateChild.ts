/** @format */

import React from 'react'
import ReactDOM from 'react-dom'
import cssAnimate, { isCssAnimationSupported } from '../css-animation'
import animUtil from './util/animate'

const transitionMap: {
  enter: 'transitionEnter'
  appear: 'transitionAppear'
  leave: 'transitionLeave'
} = {
  enter: 'transitionEnter',
  appear: 'transitionAppear',
  leave: 'transitionLeave',
}
export interface AnimateChildProp {
  children: any
  transitionName?:
    | string
    | {
        enter: string
        appear: string
        leave: string
        enterActive: string
        appearActive: string
        leaveActive: string

        [key: string]: string
      }
  animation: {
    enter?: (
      node: Element,
      end: () => void
    ) => {
      stop(): void
    }
    appear?: (
      node: Element,
      end: () => void
    ) => {
      stop(): void
    }
    leave?: (
      node: Element,
      end: () => void
    ) => {
      stop(): void
    }
  }
  transitionEnter?: boolean
  transitionAppear?: boolean
  transitionLeave?: boolean
}

export function AnimateStop(context: AnimateChild) {
  const stopper = context.stopper
  if (stopper) {
    context.stopper = null
    stopper.stop()
  }
}

export default class AnimateChild extends React.Component<AnimateChildProp> {
  public stopper: null | {
    stop(): void
  } = null

  componentWillUnmount() {
    AnimateStop(this)
  }
  transition(
    animationType: 'enter' | 'appear' | 'leave',
    finishCallback: () => void
  ) {
    const node = ReactDOM.findDOMNode(this) as HTMLElement
    const props = this.props
    const transitionName = props.transitionName

    this.stop()

    const end = () => {
      this.stopper = null
      finishCallback()
    }

    const transitionAction = transitionMap[animationType]
    if (
      (isCssAnimationSupported || !props.animation[animationType]) &&
      transitionName &&
      props[transitionAction]
    ) {
      let name, activeName: string
      if (typeof transitionName === 'string') {
        name = `${transitionName}-${animationType}`
        activeName = `${name}-active`
      } else {
        name = transitionName[animationType]
        activeName = `${name}-active`
        if (transitionName[`${animationType}Active`]) {
          activeName = transitionName[`${animationType}Active`]
        }
      }
      this.stopper = cssAnimate(
        node,
        {
          name,
          active: activeName,
        },
        end
      )
    } else {
      this.stopper = props.animation[animationType]!(node, end) // !! type assertion props.animation[animationType]
    }
  }
  stop() {
    const stopper = this.stopper
    if (stopper) {
      this.stopper = null
      stopper.stop()
    }
  }

  componentWillEnter(done: () => void) {
    if (animUtil.isEnterSupported(this.props)) {
      this.transition('enter', done)
    } else {
      done()
    }
  }

  componentWillAppear(done: () => void) {
    if (animUtil.isAppearSupported(this.props)) {
      this.transition('appear', done)
    } else {
      done()
    }
  }

  componentWillLeave(done: () => void) {
    if (animUtil.isLeaveSupported(this.props)) {
      this.transition('leave', done)
    } else {
      // always sync, do not interupt with react component life cycle
      // update hidden -> animate hidden ->
      // didUpdate -> animate leave -> unmount (if animate is none)
      done()
    }
  }
  render() {
    return this.props.children
  }
}
