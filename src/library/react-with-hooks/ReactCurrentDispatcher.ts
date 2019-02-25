/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Keeps track of the current dispatcher.
 */
import * as hooks from './ReactHooks';

export interface IReactCurrentDispatcher{
  useContext:typeof hooks.useContext
  useState:typeof hooks.useState
  useReducer:typeof hooks.useReducer
  useRef:typeof hooks.useRef
  useEffect:typeof hooks.useEffect
  useLayoutEffect:typeof hooks.useLayoutEffect
  useCallback:typeof hooks.useCallback
  useMemo:typeof hooks.useMemo
  useImperativeHandle:typeof hooks.useImperativeHandle
}
const ReactCurrentDispatcher: {
  current: null | IReactCurrentDispatcher
} = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null,
}

export default ReactCurrentDispatcher
