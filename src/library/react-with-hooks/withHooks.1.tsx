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
// ===== Effect & Queue =====
interface IEffect {
  tag: number,
  create: React.EffectCallback,
  destroy?:()=>void,
  deps: React.DependencyList | null,
  next: null | IEffect,
}
let passiveHookEffects:Array<IEffect> = [];
/**
 * 
 * @param unmountTag 卸载标签
 * @param mountTag 挂载标签
 */
function commitHookEffectList(unmountTag:number, mountTag:number, updateQueue: null | {
  lastEffect: null | IEffect,
}){
  let lastEffect: null | IEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next
    let effect = firstEffect!
    do {
      if ((effect.tag & unmountTag) !== NoHookEffect) {
        // Unmount
        const destroy = effect.destroy
        effect.destroy = undefined
        if (destroy !== undefined) {
          destroy()
        }
      }
      effect = effect.next!
    } while (effect !== firstEffect)

    effect = firstEffect
    do {
      if ((effect.tag & mountTag) !== NoHookEffect) {
        // Mount
        const create = effect.create
        const destroy = create()
        effect.destroy = typeof destroy === 'function' ? destroy : undefined
      }
      effect = effect.next!
    } while (effect !== firstEffect)
  }
}

export default function withHooks<Props>(render:React.FunctionComponent<Props>):WithHooksComponent<Props>{
  class WithHooks extends React.Component<any>{
    static displayName = render.displayName || render.name;

    public updateQueue: null | {
      lastEffect: null | IEffect,
    } = null

    public mounted:boolean = false;

    componentDidMount() {
      // useLayoutEffect
      commitHookEffectList(UnmountMutation, MountMutation, this.updateQueue)
      commitHookEffectList(UnmountLayout, MountLayout, this.updateQueue)

      this.mounted = true
    }
  }
  const wrap = (props?:Props, ref?:any) => <WithHooks {...props} _forwardedRef={ref} />
  wrap.__react_with_hooks = true
  wrap.displayName = `WithHooks(${WithHooks.displayName})`
  return wrap
}