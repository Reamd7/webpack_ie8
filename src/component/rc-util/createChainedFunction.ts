/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @returns {function|null}
 */
export default function createChainedFunction(...func:Array<Function>) {
  if (func.length === 1) {
    return func[0];
  }
  return function chainedFunction(this:any) {
    for (let i = 0; i < func.length; i++) {
      if (func[i] && func[i].apply) {
        func[i].apply(this, arguments);
      }
    }
  };
}
