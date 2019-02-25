/** @format */

import React, { createElement } from 'react'
import ReactCurrentDispatcher from './ReactCurrentDispatcher'
import {
  Update as UpdateEffect,
  Passive as PassiveEffect,
} from './ReactSideEffectTags'
import {
  NoEffect as NoHookEffect,
  UnmountMutation,
  MountLayout,
  UnmountPassive,
  MountPassive,
  MountMutation,
  UnmountLayout,
} from './ReactHookEffectTags'
import is from './objectIs'
import scheduleCallback from './scheduleCallback'

interface WithHooksComponent<P> extends React.FunctionComponent<P>{
  __react_with_hooks:boolean
}

export default function withHooks<Props>(render:React.FunctionComponent<Props>):WithHooksComponent<Props>{
  class WithHooks extends React.Component<any>{
    static displayName = render.displayName || render.name


    
  }
  const wrap = (props?:Props, ref?:any) => <WithHooks {...props} _forwardedRef={ref} />
  wrap.__react_with_hooks = true
  wrap.displayName = `WithHooks(${WithHooks.displayName})`
  return wrap
}