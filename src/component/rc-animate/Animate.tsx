/** @format */

import React from 'react'
import {
  toArrayChildren,
  mergeChildren,
  findShownChildInChildrenByKey,
  findChildInChildrenByKey,
  isSameChildren,
} from './ChildrenUtils'
import AnimateChild, {AnimateChildProp} from './AnimateChild'
import animUtil from './util/animate'

const defaultKey = `rc_animate_${Date.now()}`
type AnimateChildNode = React.ReactElement<any> | React.ReactPortal
export interface AnimateProps extends React.Props<typeof Animate>{
  component?:any
  componentProps?:any
  className?:any
  style?:any

  children: AnimateChildNode  | undefined | null
  showProp?: string,
  exclusive?: boolean,
  onAppear:(key:React.Key)=>void;
  onEnter:(key:React.Key)=>void;
  onLeave:(key:React.Key)=>void;
  onEnd:(key:React.Key, status:boolean)=>void;
  animation: AnimateChildProp["animation"]
  transitionName?: AnimateChildProp["transitionName"]
  transitionEnter?: AnimateChildProp["transitionEnter"]
  transitionAppear?: AnimateChildProp["transitionAppear"]
  transitionLeave?: AnimateChildProp["transitionLeave"]
}
interface AnimateState{
  children:AnimateChildNode[]
}
function noop() {
}
function getChildrenFromProps(props:AnimateProps) {
  const children = props.children
  if (React.isValidElement(children)) {
    if (!children.key) {
      return React.cloneElement(children, {
        key: defaultKey,
      })
    }
  }
  return children
}

class Animate extends React.Component<AnimateProps, AnimateState>{
  static isAnimate = true; // eslint-disable-line
  static defaultProps = {
    animation: {},
    component: 'span',
    componentProps: {},
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false,
    onEnd: noop,
    onEnter: noop,
    onLeave: noop,
    onAppear: noop,
  }
  public currentlyAnimatingKeys:{
    [key:string]:boolean
  } = {};
  public keysToEnter:React.Key[] = [];
  public keysToLeave:React.Key[] = [];
  public childrenRefs:{
    [key:string]: AnimateChild 
    [key:number]: AnimateChild 
  } = {};
  
  public nextProps:AnimateProps | null = null;
  
  public props:AnimateProps
  public state:AnimateState;
  constructor(props:AnimateProps){
    super(props);
    this.props = props
    this.state = {
      children: toArrayChildren(getChildrenFromProps(props)) as AnimateChildNode[], // 其实一开 内部是有可能为 null 的 但是由于最后render的时候直接输出了, 所以不会进其他方法中, 所以 这里不如进行断言 , 下文同理
    };
  }

  componentDidMount() {
    const showProp = this.props.showProp;
    let children = this.state.children;
    if (showProp) {
      children = children.filter((child) => {
        return !!child.props[showProp];
      });
    }
    children.forEach((child) => {
      if (child) {
        this.performAppear(child.key!);
      }
    });
  }

  isValidChildByKey(currentChildren:AnimateState["children"], key:React.Key) {
    const showProp = this.props.showProp;
    if (showProp) {
      return findShownChildInChildrenByKey(currentChildren, key, showProp);
    }
    return findChildInChildrenByKey(currentChildren, key);
  }
  handleDoneAdding = (key:React.Key, type:'enter' | 'appear') => {
    const props = this.props;
    delete this.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== this.nextProps) {
      return ()=>{};
    }
    const currentChildren = toArrayChildren(getChildrenFromProps(props)) as AnimateChildNode[];
    if (!this.isValidChildByKey(currentChildren, key)) {
      // exclusive will not need this
      this.performLeave(key);
    } else if (type === 'appear') {
      if (animUtil.allowAppearCallback(props)) {
        props.onAppear(key);
        props.onEnd(key, true);
      }
    } else if (animUtil.allowEnterCallback(props)) {
      props.onEnter(key);
      props.onEnd(key, true);
    }
    return ()=>{};
  }

  performEnter = (key:React.Key) => {
    // may already remove by exclusive
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillEnter(
        this.handleDoneAdding(key, 'enter')
      );
    }
  }
  performAppear = (key:React.Key) => {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillAppear(
        this.handleDoneAdding(key, 'appear')
      );
    }
  }
  performLeave = (key:React.Key) => {
    // may already remove by exclusive
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillLeave(
        this.handleDoneLeaving.bind(this, key)
      );
    }
  }
  handleDoneLeaving = (key:React.Key) => {
    const props = this.props;
    delete this.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== this.nextProps) {
      return;
    }
    const currentChildren = toArrayChildren(getChildrenFromProps(props)) as AnimateChildNode[];
    // in case state change is too fast
    if (this.isValidChildByKey(currentChildren, key)) {
      this.performEnter(key);
    } else {
      const end = () => {
        if (animUtil.allowLeaveCallback(props)) {
          props.onLeave(key);
          props.onEnd(key, false);
        }
      };
      if (!isSameChildren(this.state.children,
        currentChildren, props.showProp)) {
        this.setState({
          children: currentChildren,
        }, end);
      } else {
        end();
      }
    }
  }
  stop(key:React.Key) {
    delete this.currentlyAnimatingKeys[key];
    const component = this.childrenRefs[key];
    if (component) {
      component.stop();
    }
  }

  // todo Change New LifeCycle 
  componentWillReceiveProps(nextProps:AnimateProps) {
    this.nextProps = nextProps;
    const nextChildren = toArrayChildren(getChildrenFromProps(nextProps)) as AnimateChildNode[];
    const props = this.props;
    // exclusive needs immediate response
    if (props.exclusive) {
      Object.keys(this.currentlyAnimatingKeys).forEach((key) => {
        this.stop(key);
      });
    }
    const showProp = props.showProp;
    const currentlyAnimatingKeys = this.currentlyAnimatingKeys;
    // last props children if exclusive
    const currentChildren = props.exclusive ?
      toArrayChildren(getChildrenFromProps(props)) as AnimateChildNode[]:
      this.state.children;
    // in case destroy in showProp mode
    let newChildren:AnimateState["children"] = [];
    if (showProp) {
      currentChildren.forEach((currentChild) => {
        const nextChild = currentChild && findChildInChildrenByKey(nextChildren, currentChild.key as React.Key);
        let newChild;
        if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
          newChild = React.cloneElement(nextChild || currentChild, {
            [showProp]: true,
          });
        } else {
          newChild = nextChild;
        }
        if (newChild) {
          newChildren.push(newChild);
        }
      });
      nextChildren.forEach((nextChild) => {
        if (!nextChild || !findChildInChildrenByKey(currentChildren, nextChild.key as React.Key)) {
          newChildren.push(nextChild);
        }
      });
    } else {
      newChildren = mergeChildren(
        currentChildren,
        nextChildren
      );
    }

    // need render to avoid update
    this.setState({
      children: newChildren,
    });

    nextChildren.forEach((child) => {
      const key = child && child.key as React.Key;
      if (child && currentlyAnimatingKeys[key]) {
        return;
      }
      const hasPrev = child && findChildInChildrenByKey(currentChildren, key);
      if (showProp) {
        const showInNext = child.props[showProp];
        if (hasPrev) {
          const showInNow = findShownChildInChildrenByKey(currentChildren, key, showProp);
          if (!showInNow && showInNext) {
            this.keysToEnter.push(key);
          }
        } else if (showInNext) {
          this.keysToEnter.push(key);
        }
      } else if (!hasPrev) {
        this.keysToEnter.push(key);
      }
    });

    currentChildren.forEach((child) => {
      const key = child && child.key as React.Key;
      if (child && currentlyAnimatingKeys[key]) {
        return;
      }
      const hasNext = child && findChildInChildrenByKey(nextChildren, key);
      if (showProp) {
        const showInNow = child.props[showProp];
        if (hasNext) {
          const showInNext = findShownChildInChildrenByKey(nextChildren, key, showProp);
          if (!showInNext && showInNow) {
            this.keysToLeave.push(key);
          }
        } else if (showInNow) {
          this.keysToLeave.push(key);
        }
      } else if (!hasNext) {
        this.keysToLeave.push(key);
      }
    });
  }

  render() {
    const props = this.props;
    this.nextProps = props;
    const stateChildren = this.state.children;
    let children = null;
    if (stateChildren) {
      children = stateChildren.map((child) => {
        if (child === null || child === undefined) {
          return child;
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children');
        }
        const KEY = child.key
        return (
          <AnimateChild
            key={KEY}
            ref={node => { this.childrenRefs[KEY] = node! }}
            animation={props.animation}
            transitionName={props.transitionName}
            transitionEnter={props.transitionEnter}
            transitionAppear={props.transitionAppear}
            transitionLeave={props.transitionLeave}
          >
            {child}
          </AnimateChild>
        );
      });
    }
    const Component = props.component;
    if (Component) {
      let passedProps = props;
      if (typeof Component === 'string') {
        passedProps = {
          className: props.className,
          style: props.style,
          ...props.componentProps,
        };
      }
      return <Component {...passedProps}>{children}</Component>;
    }
    return children ? children[0] : children;
  }

  componentDidUpdate() {
    const keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    const keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  }
}

export default  Animate