import React from 'react';

export default function toArray<C>(children: C | C[]) {
  const ret:C[] = [];
  React.Children.forEach(children, (c) => {
    ret.push(c);
  });
  return ret;
}
