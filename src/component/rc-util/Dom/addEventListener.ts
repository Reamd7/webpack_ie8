import ReactDOM from 'react-dom';

export default function addEventListenerWrap(target:Element, eventType: string, cb:EventListener, option ?:boolean | AddEventListenerOptions ) {
  const callback = ReactDOM.unstable_batchedUpdates ? function run(e:Event) {
    ReactDOM.unstable_batchedUpdates(cb, e);
  } : cb;
  target.addEventListener(eventType, callback, option || false) // ie polyfill
  let useCapture = false;
  if (typeof option === 'object') {
    useCapture = option.capture || false;
  } else if (typeof option === 'boolean') {
    useCapture = option;
  }
  return {
    remove(){
      target.removeEventListener(eventType, callback, useCapture);
    }
  }
}
