import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
// import { polyfill } from 'react-lifecycles-compat';
// import classNames from 'classnames';
import {
  getTransitionName,
  animationEndName, transitionEndName,
  supportTransition,
} from './util/motion';

const STATUS_NONE = 'none';
const STATUS_APPEAR = 'appear';
const STATUS_ENTER = 'enter';
const STATUS_LEAVE = 'leave';
type EventFunc = (node:Element | null | Text, event?:Event | null) => object | false
interface CSSMotionProps{
  visible: boolean,
  children: (props:any)=>any,
  motionName: string | {
    [key:string]:string
  },
  motionAppear: boolean,
  motionEnter: boolean,
  motionLeave: boolean,
  motionLeaveImmediately: boolean, // Trigger leave motion immediately
  removeOnLeave: boolean,
  leavedClassName: string,
  onAppearStart: EventFunc,
  onAppearActive: EventFunc,
  onAppearEnd: EventFunc,
  onEnterStart: EventFunc,
  onEnterActive: EventFunc,
  onEnterEnd: EventFunc,
  onLeaveStart: EventFunc,
  onLeaveActive: EventFunc,
  onLeaveEnd: EventFunc,
}
interface CSSMotionState{
  status:'none' | 'appear' | 'enter' | 'leave'
  statusActive: boolean,
  newStatus: boolean,
  statusStyle: null | ReturnType<EventFunc>,
  prevProps?:CSSMotionProps
}

/**
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */
export function genCSSMotion(transitionSupport:boolean) {
  function isSupportTransition(props:CSSMotionProps) {
    return !!(props.motionName && transitionSupport);
  }

  class CSSMotion extends React.Component<CSSMotionProps,CSSMotionState> {

    static defaultProps = {
      visible: true,
      motionEnter: true,
      motionAppear: true,
      motionLeave: true,
      removeOnLeave: true,
    };
    public raf:null | ReturnType<typeof requestAnimationFrame> = null;
    public $ele:Element | null = null;
    public _destroyed = false;

    constructor(props:CSSMotionProps) {
      super(props);

      this.state = {
        status: STATUS_NONE,
        statusActive: false,
        newStatus: false,
        statusStyle: null,
      };
    }

    static getDerivedStateFromProps(props:CSSMotionProps, { prevProps }:CSSMotionState) {
      if (!isSupportTransition(props)) return {};

      const {
        visible, motionAppear, motionEnter, motionLeave,
        motionLeaveImmediately,
      } = props;
      const newState = {
        prevProps: props,
      } as CSSMotionState;

      // Appear
      if (!prevProps && visible && motionAppear) {
        newState.status = STATUS_APPEAR;
        newState.statusActive = false;
        newState.newStatus = true;
      }

      // Enter
      if (prevProps && !prevProps.visible && visible && motionEnter) {
        newState.status = STATUS_ENTER;
        newState.statusActive = false;
        newState.newStatus = true;
      }

      // Leave
      if (
        (prevProps && prevProps.visible && !visible && motionLeave) ||
        (!prevProps && motionLeaveImmediately && !visible && motionLeave)
      ) {
        newState.status = STATUS_LEAVE;
        newState.statusActive = false;
        newState.newStatus = true;
      }

      return newState;
    };

    componentDidMount() {
      this.onDomUpdate();
    }

    componentDidUpdate() {
      this.onDomUpdate();
    }

    componentWillUnmount() {
      this._destroyed = true;
      this.removeEventListener(this.$ele);
      this.cancelNextFrame();
    }

    onDomUpdate = () => {
      const { status, newStatus } = this.state;
      const {
        onAppearStart, onEnterStart, onLeaveStart,
        onAppearActive, onEnterActive, onLeaveActive,
        motionAppear, motionEnter, motionLeave,
      } = this.props;

      if (!isSupportTransition(this.props)) {
        return;
      }

      // Event injection
      const $ele = ReactDOM.findDOMNode(this) as Element;
      if (this.$ele !== $ele) {
        this.removeEventListener(this.$ele);
        this.addEventListener($ele);
        this.$ele = $ele;
      }

      // Init status
      if (newStatus && status === STATUS_APPEAR && motionAppear) {
        this.updateStatus(onAppearStart, null, null, () => {
          this.updateActiveStatus(onAppearActive, STATUS_APPEAR);
        });
      } else if (newStatus && status === STATUS_ENTER && motionEnter) {
        this.updateStatus(onEnterStart, null, null, () => {
          this.updateActiveStatus(onEnterActive, STATUS_ENTER);
        });
      } else if (newStatus && status === STATUS_LEAVE && motionLeave) {
        this.updateStatus(onLeaveStart, null, null, () => {
          this.updateActiveStatus(onLeaveActive, STATUS_LEAVE);
        });
      }
    };

    onMotionEnd = (event:Event) => {
      const { status, statusActive } = this.state;
      const { onAppearEnd, onEnterEnd, onLeaveEnd } = this.props;
      if (status === STATUS_APPEAR && statusActive) {
        this.updateStatus(onAppearEnd, { status: STATUS_NONE }, event);
      } else if (status === STATUS_ENTER && statusActive) {
        this.updateStatus(onEnterEnd, { status: STATUS_NONE }, event);
      } else if (status === STATUS_LEAVE && statusActive) {
        this.updateStatus(onLeaveEnd, { status: STATUS_NONE }, event);
      }
    };

    addEventListener = ($ele:Element | null) => {
      if (!$ele) return;

      $ele.addEventListener(transitionEndName, this.onMotionEnd);
      $ele.addEventListener(animationEndName, this.onMotionEnd);
    };
    removeEventListener = ($ele:Element | null) => {
      if (!$ele) return;

      $ele.removeEventListener(transitionEndName, this.onMotionEnd);
      $ele.removeEventListener(animationEndName, this.onMotionEnd);
    };

    updateStatus = (styleFunc:EventFunc, additionalState:null | {
      status?:CSSMotionState["status"]
      statusActive?:boolean
    }, event?:Event | null, callback?:FrameRequestCallback) => {
      const statusStyle = styleFunc ? styleFunc(ReactDOM.findDOMNode(this), event) : null;

      if (statusStyle === false || this._destroyed) return;

      let nextStep;
      if (callback) {
        nextStep = () => {
          this.nextFrame(callback);
        };
      }
      
      this.setState({
        statusStyle: typeof statusStyle === 'object' ? statusStyle : null,
        newStatus: false,
        ...additionalState as any, // !! 这里应不应该有非空断言
      }, nextStep); // Trigger before next frame & after `componentDidMount`
    };

    updateActiveStatus = (styleFunc:EventFunc, currentStatus:CSSMotionState["status"]) => {
      // `setState` use `postMessage` to trigger at the end of frame.
      // Let's use requestAnimationFrame to update new state in next frame.
      this.nextFrame(() => {
        const { status } = this.state;
        if (status !== currentStatus) return;

        this.updateStatus(styleFunc, { statusActive: true });
      });
    };

    nextFrame = (func:FrameRequestCallback) => {
      this.cancelNextFrame();
      this.raf = requestAnimationFrame(func);
    };

    cancelNextFrame = () => {
      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = null;
      }
    };

    render() {
      const { status, statusActive, statusStyle } = this.state;
      const { children, motionName, visible, removeOnLeave, leavedClassName } = this.props;

      if (!children) return null;

      if (status === STATUS_NONE || !isSupportTransition(this.props)) {
        if (visible) {
          return children({});
        } else if (!removeOnLeave) {
          return children({ className: leavedClassName });
        }

        return null;
      }
      return children({
        className: (function(){
          let classList:string[] = []
          if (statusActive){
            classList.push(getTransitionName(motionName, `${status}-active`)!)
          }
          if (typeof motionName === 'string'){
            classList.push(motionName)
          }
          return classList.join(" ")
        }()),
        style: statusStyle,
      });
      // return children({
      //   className: classNames({
      //     // [getTransitionName(motionName, status)!]: status !== STATUS_NONE,
      //     [getTransitionName(motionName, `${status}-active`)!]: 
      //       // status !== STATUS_NONE && 
      //       statusActive,
      //     [motionName as string]: typeof motionName === 'string',
      //   }),
      //   style: statusStyle,
      // });
    }
  }

  // polyfill(CSSMotion);

  return CSSMotion;
}

export default genCSSMotion(supportTransition);