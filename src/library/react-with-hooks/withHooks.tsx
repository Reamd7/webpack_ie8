/** @format */

import React, { createElement } from 'react'
// import invariant from 'invariant';
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

const RE_RENDER_LIMIT = 25
interface QUEUE{
  // last: IHook<any> | null
  last:any
  dispatch: null | typeof dispatchAction
  eagerReducer: typeof basicStateReducer
  eagerState: any
}
interface IHook<State = any> {
  memoizedState: State | null
  baseState: State | null
  queue: QUEUE | null
  // baseUpdate: null | IHook<any>
  baseUpdate:any
  next:any
  // next: null | IHook
}
interface IEffect {
  tag: number,
  create: React.EffectCallback,
  destroy?:()=>void,
  deps: React.DependencyList | null,
  next: null | IEffect,
}
let firstCurrentHook = null
let firstWorkInProgressHook: null | IHook = null
let currentHook: null | IHook = null
let nextCurrentHook: null | IHook = null
let workInProgressHook: null | IHook = null
let nextWorkInProgressHook: null | IHook = null
let didScheduleRenderPhaseUpdate = false
let currentInstance: any = null
type Updates = {
  action:any,
  next:Updates | null
}
let renderPhaseUpdates: null | Map<Exclude<IHook<any>["queue"], null>,Updates> = null
let numberOfReRenders = 0
let componentUpdateQueue: null | {
  lastEffect: null | IEffect,
} = null
let sideEffectTag = 0
interface IContext<T>{
  Consumer: React.Context<T>["Consumer"],
  next: IContext<T> | null,
}
let componentContext: null | IContext<any> = null
let isRenderPhase = false
let didReceiveUpdate = false
let passiveHookEffects:{
  callback:()=>void,
  cancel:()=>void,
}[] = []

function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true
}

function basicStateReducer(state: any, action: any) {
  return typeof action === 'function' ? action(state) : action
}

function prepareToUseHooks(current:any) {
  currentInstance = current
  firstCurrentHook = nextCurrentHook =
    current !== null ? current.memoizedState : null
}

function resetHooks() {
  currentInstance = null
  firstCurrentHook = null
  currentHook = null
  firstWorkInProgressHook = null
  workInProgressHook = null
  componentUpdateQueue = null
  componentContext = null

  didScheduleRenderPhaseUpdate = false
  renderPhaseUpdates = null
  numberOfReRenders = 0
  isRenderPhase = false
}

function mountWorkInProgressHook() {
  const hook: IHook = {
    memoizedState: null,

    baseState: null,
    queue: null,
    baseUpdate: null,

    next: null,
  }

  if (workInProgressHook === null) {
    // This is the first hook in the list
    firstWorkInProgressHook = workInProgressHook = hook
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook
  }
  return workInProgressHook
}

function updateWorkInProgressHook():IHook<any> {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base. When we reach the end of the base list, we must switch to
  // the dispatcher used for mounts.
  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook
    nextWorkInProgressHook = workInProgressHook.next

    currentHook = nextCurrentHook
    nextCurrentHook = currentHook !== null ? currentHook.next : null
  } else {
    // Clone from the current hook.
    if (nextCurrentHook === null) {
      throw 'Rendered more hooks than during the previous render.'
    }
    // invariant(nextCurrentHook !== null, 'Rendered more hooks than during the previous render.');
    currentHook = nextCurrentHook

    const newHook:IHook<any> = {
      memoizedState: currentHook.memoizedState,

      baseState: currentHook.baseState,
      queue: currentHook.queue,
      baseUpdate: currentHook.baseUpdate,

      next: null,
    }

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      workInProgressHook = firstWorkInProgressHook = newHook
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook
    }
    nextCurrentHook = currentHook.next
  }
  return workInProgressHook
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null,
  }
}

function areHookInputsEqual(
  nextDeps: React.DependencyList,
  prevDeps: React.DependencyList
) {
  if (prevDeps === null) {
    return false
  }

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) {
      continue
    }
    return false
  }
  return true
}

function mountState<S>(
  initialState: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] {
  const hook = mountWorkInProgressHook()
  if (typeof initialState === 'function') {
    initialState = (initialState as (() => S))()
  }
  hook.memoizedState = hook.baseState = initialState
  const queue: typeof hook['queue'] = (hook.queue = {
    last: null,
    dispatch: null,
    eagerReducer: basicStateReducer,
    eagerState: initialState,
  })
  const dispatch = (queue.dispatch = dispatchAction.bind(
    null,
    currentInstance,
    queue
  ))
  return [hook.memoizedState, dispatch]
}

function updateState<S>(
  initialState: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] {
  return updateReducer(basicStateReducer, initialState)
}

function pushEffect(
  tag: number,
  create: React.EffectCallback,
  destroy: any,
  deps: React.DependencyList | null
) {
  const effect:IEffect = {
    tag,
    create,
    destroy,
    deps,
    // Circular
    next: null,
  }
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue()
    componentUpdateQueue.lastEffect = effect.next = effect
  } else {
    const lastEffect = componentUpdateQueue.lastEffect
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect
    } else {
      const firstEffect = lastEffect.next
      lastEffect.next = effect
      effect.next = firstEffect
      componentUpdateQueue.lastEffect = effect
    }
  }
  return effect
}

function pushContext<T>(context: React.Context<T>) {
  const _context = {
    Consumer: context.Consumer,
    next: null,
  }
  if (componentContext === null) {
    componentContext = _context
  } else {
    componentContext.next = _context
  }
  return _context
}

function mountRef<T>(initialValue: T | null): React.RefObject<T>
function mountRef<T extends unknown>(
  initialValue: T
): React.MutableRefObject<T> {
  const hook = mountWorkInProgressHook()
  const ref = { current: initialValue }
  hook.memoizedState = ref
  return ref
}

function updateRef<T>(initialValue: T | null): React.RefObject<T>
function updateRef<T extends unknown>(
  initialValue: T
): React.MutableRefObject<T> {
  const hook = updateWorkInProgressHook()
  return hook.memoizedState
}

function mountEffectImpl(
  fiberEffectTag: number,
  hookEffectTag: number,
  create: React.EffectCallback,
  deps?: React.DependencyList
) {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  sideEffectTag |= fiberEffectTag
  hook.memoizedState = pushEffect(
    hookEffectTag, create, undefined, nextDeps
  )
}

function updateEffectImpl(
  fiberEffectTag: number,
  hookEffectTag: number,
  create: React.EffectCallback,
  deps?: React.DependencyList
) {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  let destroy = undefined

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState
    destroy = prevEffect.destroy
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(NoHookEffect, create, destroy, nextDeps)
        return
      }
    }
  }

  sideEffectTag |= fiberEffectTag
  hook.memoizedState = pushEffect(hookEffectTag, create, destroy, nextDeps)
}

function mountEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  return mountEffectImpl(
    UpdateEffect | PassiveEffect,
    UnmountPassive | MountPassive,
    effect,
    deps
  )
}

function updateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  return updateEffectImpl(
    UpdateEffect | PassiveEffect,
    UnmountPassive | MountPassive,
    effect,
    deps
  )
}

function mountLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  return mountEffectImpl(
    UpdateEffect,
    UnmountMutation | MountLayout,
    effect,
    deps
  )
}

function updateLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  return updateEffectImpl(
    UpdateEffect,
    UnmountMutation | MountLayout,
    effect,
    deps
  )
}

function imperativeHandleEffect<T, R extends T>(
  create: () => R, 
  ref: Exclude<React.Ref<T>, React.RefObject<T>> | undefined | {
    current : T | null
  }
) {
  if (typeof ref === 'function') {
    const refCallback = ref
    const inst = create()
    refCallback(inst)
    return () => {
      refCallback(null)
    }
  } else if (ref !== null && ref !== undefined) {
    const refObject = ref
    const inst = create()
    refObject.current = inst
    return () => {
      refObject.current = null
    }
  }
}

function mountImperativeHandle<T, R extends T>(
  ref: React.Ref<T> | undefined,
  init: () => R,
  deps?: React.DependencyList
): void {
  // TODO: If deps are provided, should we skip comparing the ref itself?
  const effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : [ref]

  return mountEffectImpl(
    UpdateEffect,
    UnmountMutation | MountLayout,
    imperativeHandleEffect.bind(null, init, ref),
    effectDeps
  )
}

function updateImperativeHandle<T, R extends T>(
  ref: React.Ref<T> | undefined,
  init: () => R,
  deps?: React.DependencyList
): void {
  // TODO: If deps are provided, should we skip comparing the ref itself?
  const effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : [ref]

  return updateEffectImpl(
    UpdateEffect,
    UnmountMutation | MountLayout,
    imperativeHandleEffect.bind(null, init, ref),
    effectDeps
  )
}

function mountContext<T>(
  Context: any
  /*, (not public API) observedBits?: number|boolean */
): T {
  pushContext(Context)
  return Context._currentValue
}

function mountReducer<R extends React.Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I & React.ReducerState<R>,
  initializer: (arg: I & React.ReducerState<R>) => React.ReducerState<R>
): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>] {
  const hook = mountWorkInProgressHook()
  let initialState
  if (initializer !== undefined) {
    initialState = initializer(initializerArg)
  } else {
    initialState = initializerArg
  }
  hook.memoizedState = hook.baseState = initialState
  const queue: typeof hook['queue'] = (hook.queue = {
    last: null,
    dispatch: null,
    eagerReducer: reducer,
    eagerState: initialState,
  })
  const dispatch = (queue.dispatch = dispatchAction.bind(
    null,
    // Flow doesn't know this is non-null, but we do.
    currentInstance,
    queue
  ))
  return [hook.memoizedState, dispatch]
}

function updateReducer<R extends React.Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I & React.ReducerState<R>,
  initializer?: (arg: I & React.ReducerState<R>) => React.ReducerState<R>
): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>] {
  const hook = updateWorkInProgressHook()
  const queue = hook.queue
  if (queue === null) {
    throw 'Should have a queue. This is likely a bug in React. Please file an issue.'
  }
  // invariant(queue !== null, 'Should have a queue. This is likely a bug in React. Please file an issue.');

  if (numberOfReRenders > 0) {
    // This is a re-render. Apply the new render phase updates to the previous
    // work-in-progress hook.
    const dispatch:any = queue.dispatch
    if (renderPhaseUpdates !== null) {
      // Render phase updates are stored in a map of queue -> linked list
      const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue)
      if (firstRenderPhaseUpdate !== undefined) {
        renderPhaseUpdates.delete(queue)
        let newState = hook.memoizedState
        let update:null | Updates = firstRenderPhaseUpdate
        do {
          // Process this render phase update. We don't have to check the
          // priority because it will always be the same as the current
          // render's.
          const action = update.action
          newState = reducer(newState, action)
          update = update.next
        } while (update !== null)

        // Mark that the fiber performed work, but only if the new state is
        // different from the current state.
        if (!is(newState, hook.memoizedState)) {
          markWorkInProgressReceivedUpdate()
        }

        hook.memoizedState = newState

        // Don't persist the state accumlated from the render phase updates to
        // the base state unless the queue is empty.
        // TODO: Not sure if this is the desired semantics, but it's what we
        // do for gDSFP. I can't remember why.
        if (hook.baseUpdate === queue.last) {
          hook.baseState = newState
        }

        return [newState, dispatch]
      }
    }
    return [hook.memoizedState, dispatch]
  }

  // The last update in the entire queue
  const last = queue.last
  // The last update that is part of the base state.
  const baseUpdate = hook.baseUpdate
  const baseState = hook.baseState

  // Find the first unprocessed update.
  let first
  if (baseUpdate !== null) {
    if (last !== null) {
      // For the first update, the queue is a circular linked list where
      // `queue.last.next = queue.first`. Once the first update commits, and
      // the `baseUpdate` is no longer empty, we can unravel the list.
      last.next = null
    }
    first = baseUpdate.next
  } else {
    first = last !== null ? last.next : null
  }
  if (first !== null) {
    let newState = baseState
    let newBaseState = null
    let newBaseUpdate = null
    let prevUpdate = baseUpdate
    let update = first
    let didSkip = false

    do {
      // Process this update.
      if (update.eagerReducer === reducer) {
        // If this update was processed eagerly, and its reducer matches the
        // current reducer, we can use the eagerly computed state.
        newState = update.eagerState
      } else {
        const action = update.action
        newState = reducer(newState, action)
      }
      prevUpdate = update
      update = update.next
    } while (update !== null && update !== first)

    if (!didSkip) {
      newBaseUpdate = prevUpdate
      newBaseState = newState
    }

    // Mark that the fiber performed work, but only if the new state is
    // different from the current state.
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate()
    }

    hook.memoizedState = newState
    hook.baseUpdate = newBaseUpdate
    hook.baseState = newBaseState

    queue.eagerReducer = reducer
    queue.eagerState = newState
  }

  const dispatch:any = queue.dispatch
  return [hook.memoizedState, dispatch]
}

function mountCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  hook.memoizedState = [callback, nextDeps]
  return callback
}

function updateCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const prevState = hook.memoizedState
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1]
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0]
      }
    }
  }
  hook.memoizedState = [callback, nextDeps]
  return callback
}

function mountMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const nextValue = factory()
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}

function updateMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const prevState = hook.memoizedState
  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      const prevDeps = prevState[1]
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0]
      }
    }
  }
  const nextValue = factory()
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}

function flushPassiveEffects() {
  passiveHookEffects.forEach((effect) => {
    effect.cancel()
    effect.callback()
  })
  passiveHookEffects = []
}

function dispatchAction(instance:typeof currentInstance, queue:Exclude<IHook<any>["queue"],null>, action?:any) {
  if (numberOfReRenders >= RE_RENDER_LIMIT) {
    throw 'Too many re-renders. React limits the number of renders to prevent ' +
      'an infinite loop.'
  }
  // invariant(
  //   numberOfReRenders < RE_RENDER_LIMIT,
  //   'Too many re-renders. React limits the number of renders to prevent ' + 'an infinite loop.',
  // );
  if (isRenderPhase) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdate = true
    const update:Updates = {
      action,
      next: null,
    }
    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map()
    }
    const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue)
    if (firstRenderPhaseUpdate === undefined) {
      renderPhaseUpdates.set(queue, update)
    } else {
      // Append the update to the end of the list.
      let lastRenderPhaseUpdate = firstRenderPhaseUpdate
      while (lastRenderPhaseUpdate.next !== null) {
        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next
      }
      lastRenderPhaseUpdate.next = update
    }
  } else {
    flushPassiveEffects()

    const update:Updates = {
      action,
      next: null,
    }
    // Append the update to the end of the list.
    const last = queue.last
    if (last === null) {
      // This is the first update. Create a circular list.
      update.next = update
    } else {
      const first = last.next
      if (first !== null) {
        // Still circular.
        update.next = first
      }
      last.next = update
    }
    queue.last = update

    // The queue is currently empty, which means we can eagerly compute the
    // next state before entering the render phase. If the new state is the
    // same as the current state, we may be able to bail out entirely.
    // const eagerReducer = queue.eagerReducer;
    // if (eagerReducer !== null) {
    //   let prevDispatcher;
    //   try {
    //     const currentState = queue.eagerState;
    //     const eagerState = eagerReducer(currentState, action);
    //     // Stash the eagerly computed state, and the reducer used to compute
    //     // it, on the update object. If the reducer hasn't changed by the
    //     // time we enter the render phase, then the eager state can be used
    //     // without calling the reducer again.
    //     update.eagerReducer = eagerReducer;
    //     update.eagerState = eagerState;
    //     if (is(eagerState, currentState)) {
    //       // Fast path. We can bail out without scheduling React to re-render.
    //       // It's still possible that we'll need to rebase this update later,
    //       // if the component re-renders for a different reason and by that
    //       // time the reducer has changed.
    //       return;
    //     }
    //   } catch (error) {
    //     // Suppress the error. It will throw again in the render phase.
    //   }
    // }

    instance.setState({})
  }
}

const HooksDispatcherOnMount = {
  useCallback: mountCallback,
  useContext: mountContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
}

const HooksDispatcherOnUpdate = {
  useCallback: updateCallback,
  useContext: mountContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
}

export default function withHooks<T>(render:React.SFC<T>):React.SFC<T> {

  class WithHooks extends React.Component<any> {
    static displayName = render.displayName || render.name

    public memoizedState: IHook<any> | null = null 
    public passiveHookEffect:null | {
      callback:()=>void,
      cancel:()=>void,
    } = null
    public mounted = false;
    public updateQueue: null | {
      lastEffect: null | IEffect,
    } = null
    public effectTag = 0

    componentDidMount() {
      // useLayoutEffect
      this.commitHookEffectList(UnmountMutation, MountMutation)
      this.commitHookEffectList(UnmountLayout, MountLayout)

      // useEffect
      this.createPassiveHookEffect()
      this.mounted = true
    }

    componentDidUpdate() {
      // useLayoutEffect
      this.commitHookEffectList(UnmountMutation, MountMutation)
      this.commitHookEffectList(UnmountLayout, MountLayout)

      // useEffect
      this.createPassiveHookEffect()
    }

    componentWillUnmount() {
      this.callDestroy()
    }

    createPassiveHookEffect() {
      const callback = this.commitPassiveHookEffects.bind(this)
      const cancel = scheduleCallback(callback)
      this.passiveHookEffect = {
        callback,
        cancel,
      }
      passiveHookEffects.push(this.passiveHookEffect)
    }

    commitPassiveHookEffects() {
      if (this.passiveHookEffect === null) {
        return
      }
      passiveHookEffects = passiveHookEffects.filter(
        (effect) => effect !== this.passiveHookEffect
      )
      this.passiveHookEffect = null
      this.commitHookEffectList(UnmountPassive, NoHookEffect)
      this.commitHookEffectList(NoHookEffect, MountPassive)
    }

    commitHookEffectList(unmountTag:number, mountTag:number) {
      let lastEffect =
        this.updateQueue !== null ? this.updateQueue.lastEffect : null
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

    callDestroy() {
      const updateQueue = this.updateQueue

      if (updateQueue !== null) {
        var lastEffect = updateQueue.lastEffect

        if (lastEffect !== null) {
          var firstEffect = lastEffect.next
          var effect = firstEffect

          do {
            var destroy = effect!.destroy

            if (destroy !== undefined) {
              destroy()
            }

            effect = effect!.next
          } while (effect !== firstEffect)
        }
      }
    }

    applyContext(render?:any, context?:any, children?:any) {
      if (!children) {
        children = render()
      }
      context = context || componentContext
      if (context !== null) {
        return createElement(context.Consumer, {}, () => {
          if (this.mounted) {
            children = render()
          }
          return context.next === null
            ? children
            : this.applyContext(render, context.next, children)
        })
      }
      return children
    }

    render() {
      resetHooks()
      prepareToUseHooks(this)

      ReactCurrentDispatcher.current =
        nextCurrentHook === null
          ? HooksDispatcherOnMount
          : HooksDispatcherOnUpdate

      const { _forwardedRef, ...rest } = this.props

      isRenderPhase = true

      let children = this.applyContext(() => render(rest as any, _forwardedRef))

      if (didScheduleRenderPhaseUpdate) {
        do {
          didScheduleRenderPhaseUpdate = false
          numberOfReRenders += 1

          // Start over from the beginning of the list
          firstCurrentHook = nextCurrentHook = this.memoizedState
          nextWorkInProgressHook = firstWorkInProgressHook

          currentHook = null
          workInProgressHook = null
          componentUpdateQueue = null

          ReactCurrentDispatcher.current = HooksDispatcherOnUpdate

          children = render(this.props, _forwardedRef)
        } while (didScheduleRenderPhaseUpdate)

        renderPhaseUpdates = null
        numberOfReRenders = 0
      }

      this.memoizedState = firstWorkInProgressHook
      this.updateQueue = componentUpdateQueue
      this.effectTag |= sideEffectTag

      const didRenderTooFewHooks =
        currentHook !== null && currentHook.next !== null

      currentInstance = null

      firstCurrentHook = null
      currentHook = null
      nextCurrentHook = null
      firstWorkInProgressHook = null
      workInProgressHook = null
      nextWorkInProgressHook = null

      componentUpdateQueue = null
      sideEffectTag = 0
      isRenderPhase = false

      // These were reset above
      // didScheduleRenderPhaseUpdate = false;
      // renderPhaseUpdates = null;
      // numberOfReRenders = 0;
      if (!!didRenderTooFewHooks) {
        throw 'Rendered fewer hooks than expected. This may be caused by an accidental ' +
          'early return statement.'
      }
      // invariant(
      //   !didRenderTooFewHooks,
      //   'Rendered fewer hooks than expected. This may be caused by an accidental ' + 'early return statement.',
      // );

      return children
    }
  }
  // WithHooks.displayName = render.displayName || render.name
  const wrap = (props?:T, ref?:any) => <WithHooks {...props} _forwardedRef={ref} />
  wrap.__react_with_hooks = true
  wrap.displayName = `WithHooks(${WithHooks.displayName})`
  return wrap
}
