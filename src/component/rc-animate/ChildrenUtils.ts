import React from 'react';

export function toArrayChildren<C = React.ReactElement<any>>(children:C | C[]) {
  const ret:C[] = [];
  React.Children.forEach(children, (child) => {
    ret.push(child);
  });
  return ret;
}

export function findChildInChildrenByKey(children: React.ReactElement<any>[], key:React.Key) {
  let ret:null | React.ReactElement<any> = null;
  if (children) {
    children.forEach((child) => {
      if (ret) {
        return;
      }
      if (child && child.key === key) {
        ret = child;
      }
    });
  }
  return ret;
}

export function findShownChildInChildrenByKey(children: React.ReactElement<any>[], key:React.Key, showProp:any) {
  let ret:null | React.ReactElement<any> = null;
  if (children) {
    children.forEach((child) => {
      if (child && child.key === key && child.props[showProp]) {
        if (ret) {
          throw new Error('two child with same key for <rc-animate> children');
        }
        ret = child;
      }
    });
  }
  return ret;
}

export function findHiddenChildInChildrenByKey(children: React.ReactElement<any>[], key:React.Key, showProp:string) {
  let found = false;
  if (children) {
    children.forEach((child) => {
      if (found) {
        return;
      }
      found = child && child.key === key && !child.props[showProp];
    });
  }
  return found;
}

export function isSameChildren(c1: React.ReactElement<any>[], c2: React.ReactElement<any>[], showProp:string) {
  let same = c1.length === c2.length;
  if (same) {
    c1.forEach((child, index) => {
      const child2 = c2[index];
      if (child && child2) {
        if ((child && !child2) || (!child && child2)) {
          same = false;
        } else if (child.key !== child2.key) {
          same = false;
        } else if (showProp && child.props[showProp] !== child2.props[showProp]) {
          same = false;
        }
      }
    });
  }
  return same;
}

export function mergeChildren(prev: React.ReactElement<any>[], next: React.ReactElement<any>[]) {
  let ret:React.ReactElement<any>[] = [];

  // For each key of `next`, the list of keys to insert before that key in
  // the combined list
  const nextChildrenPending:{
    [key:string]:React.ReactElement<any>[]
  } = {};
  let pendingChildren:React.ReactElement<any>[] = [];
  prev.forEach((child) => {
    // !! child.key 强制类型断言
    if (child && findChildInChildrenByKey(next, child.key!)) {
      if (pendingChildren.length) {
        nextChildrenPending[child.key!] = pendingChildren;
        pendingChildren = [];
      }
    } else {
      pendingChildren.push(child);
    }
  });

  next.forEach((child) => {
    // !! child.key 强制类型断言
    if (child && Object.prototype.hasOwnProperty.call(nextChildrenPending, child.key!)) {
      ret = ret.concat(nextChildrenPending[child.key!]);
    }
    ret.push(child);
  });

  ret = ret.concat(pendingChildren);

  return ret;
}
