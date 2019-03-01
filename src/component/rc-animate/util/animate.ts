import { AnimateProps } from "../Animate";
import { AnimateChildProp } from "../AnimateChild";
const util = {
  isAppearSupported(props:AnimateProps | AnimateChildProp) {
    return props.transitionName && props.transitionAppear || props.animation.appear;
  },
  isEnterSupported(props:AnimateProps | AnimateChildProp) {
    return props.transitionName && props.transitionEnter || props.animation.enter;
  },
  isLeaveSupported(props:AnimateProps | AnimateChildProp) {
    return props.transitionName && props.transitionLeave || props.animation.leave;
  },
  allowAppearCallback(props:AnimateProps | AnimateChildProp) {
    return props.transitionAppear || props.animation.appear;
  },
  allowEnterCallback(props:AnimateProps | AnimateChildProp) {
    return props.transitionEnter || props.animation.enter;
  },
  allowLeaveCallback(props:AnimateProps | AnimateChildProp) {
    return props.transitionLeave || props.animation.leave;
  },
};
export default util;
