import React from 'react';

function mirror(o:any) {
  return o;
}

export default function mapSelf<C>(children: C | C[]): C[] {
  // return ReactFragment
  return React.Children.map(children, mirror);
}
