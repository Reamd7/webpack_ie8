export default function warn(msg:string) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(msg);
      }
    }
  }