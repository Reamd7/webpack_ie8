/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

// import invariant from 'invariant';

import ReactCurrentDispatcher from './ReactCurrentDispatcher'

function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current
  if (dispatcher === null) {
    throw 'Hooks can only be called inside the body of a function component. ' +
      '(https://fb.me/react-invalid-hook-call)'
  }
  //   invariant(
  //     dispatcher !== null,
  //     'Hooks can only be called inside the body of a function component. ' +
  //       '(https://fb.me/react-invalid-hook-call)',
  //   );
  return dispatcher
}

export function useContext<T>(
  context: React.Context<
    T
  > /*, (not public API) observedBits?: number|boolean */
): T {
  const dispatcher = resolveDispatcher()
  return dispatcher.useContext(context)
}

export function useState<S>(
  initialState: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] {
  const dispatcher = resolveDispatcher()
  return dispatcher.useState(initialState)
}

export function useReducer<R extends React.Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I & React.ReducerState<R>,
  initializer: (arg: I & React.ReducerState<R>) => React.ReducerState<R>
): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>] {
  const dispatcher = resolveDispatcher()
  return dispatcher.useReducer(reducer, initializerArg, initializer)
}
export function useRef<T>(initialValue: T | null): React.RefObject<T>
export function useRef<T extends unknown>(
  initialValue: T
): React.MutableRefObject<T> {
  const dispatcher = resolveDispatcher()
  return dispatcher.useRef(initialValue)
}

export function useEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  const dispatcher = resolveDispatcher()
  return dispatcher.useEffect(effect, deps)
}

export function useLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  const dispatcher = resolveDispatcher()
  return dispatcher.useLayoutEffect(effect, deps)
}

export function useCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  const dispatcher = resolveDispatcher()
  return dispatcher.useCallback(callback, deps)
}

export function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const dispatcher = resolveDispatcher()
  return dispatcher.useMemo(factory, deps)
}

export function useImperativeHandle<T, R extends T>(
  ref: React.Ref<T> | undefined,
  init: () => R,
  deps?: React.DependencyList
): void {
  const dispatcher = resolveDispatcher()
  return dispatcher.useImperativeHandle(ref, init, deps)
}
