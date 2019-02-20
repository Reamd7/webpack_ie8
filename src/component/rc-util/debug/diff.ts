
function createArray<T = any>():Array<T> {
  const arr = [] as any;
  arr["__proto__"] = new Array;
  arr["__proto__"].format = function toString() {
    return this.map(function(obj:any){
      return {
        ...obj,
        path: obj.path.join(' > '),
      }
    });
  };
  arr["__proto__"].toString = function toString() {
    return JSON.stringify(this.format(), null, 2);
  };
  return arr;
}

export default function diff(obj1:any , obj2:any , depth = 10, path:string[] = [], diffList = createArray()) {
  if (depth <= 0) return diffList;

  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  keys.forEach((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    // Same value
    if (value1 === value2) return;

    const type1 = typeof value1;
    const type2 = typeof value2;

    // Diff type
    if (type1 !== type2) {
      diffList.push({
        path: path.concat(key),
        value1,
        value2,
      });
      return;
    }

    // NaN
    if (Number.isNaN(value1) && Number.isNaN(value2)) {
      return;
    }

    // Object & Array
    if (type1 === 'object' && value1 !== null && value2 !== null) {
      diff(value1, value2, depth - 1, path.concat(key), diffList);
      return;
    }

    // Rest
    diffList.push({
      path: path.concat(key),
      value1,
      value2,
    });
  });

  return diffList;
}
