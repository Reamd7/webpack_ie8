/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Keeps track of the current dispatcher.
 * todo fix type define
 */
const ReactCurrentDispatcher:any = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null,
  };
  
  export default ReactCurrentDispatcher;