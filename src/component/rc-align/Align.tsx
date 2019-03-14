import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import alignElement from '../dom-align/align/alignElement';
import alignPoint from '../dom-align/align/alignPoint';
import * as R from "../dom-align/@type";
import addEventListener from '../rc-util/Dom/addEventListener';
import { isWindow, buffer, isSamePoint, isSimilarValue, restoreFocus } from './util';

function getElement(func: 
    (()=> (Window | HTMLElement | null)) | 
    { pageX:number, pageY:number } | 
    { clientX:number, clientY:number }
  ) {
  if (typeof func !== 'function' || !func) return null;
  return func();
}

function getPoint(point:(()=> (Window | HTMLElement | null)) | 
                        { pageX:number, pageY:number } | 
                        { clientX:number, clientY:number }) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}
interface AlignProps extends React.Props<typeof Align>{
  align:R.alignConfig
  onAlign?:(source:HTMLElement , result:{
    points: [R.point, R.point];
    offset: [number, number];
    targetOffset: [number, number];
    overflow: {
        resizeWidth?: number | undefined;
        resizeHeight?: number | undefined;
        adjustX?: boolean | undefined;
        adjustY?: boolean | undefined;
    };
} | undefined)=>unknown
  target?:(()=> (Window | HTMLElement | null)) | 
          { pageX:number, pageY:number } | 
          { clientX:number, clientY:number }
  monitorWindowResize?:boolean
  monitorBufferTime?: number
  disabled?:boolean;

  children?: React.ReactElement<any> | React.CElement<any,any> | React.FunctionComponentElement<any>;
  childrenProps?:{
    [key:string]:any
  };
}
interface AlignState{
  bufferMonitor:ReturnType<typeof buffer> | null,
  resizeHandler:ReturnType<typeof addEventListener> | null
}
type api = {
  state:AlignState,
  setState:React.Dispatch<React.SetStateAction<AlignState>>,
  props:AlignProps
}
const defaultProps = {
  target: () => window,
  monitorBufferTime: 50,
  monitorWindowResize: false,
  disabled: false,
};

let $id = 0
let PrivateMap = {}
function usePrivateVar<T>(V:T) : [
  ()=>T,
  (V:T)=>unknown
]{
  let Val:T
  // 初始化时
  useEffect(()=>{
    Val = V;
    return function(){
      Val = null as any;
    }
  },[]);
  return [
    ()=>Val,
    (V:T)=>(Val = V)
  ]
}

const Align:React.FunctionComponent<AlignProps> = (function(props:AlignProps){
  props = {
    ...defaultProps,
    ...props
  }
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<AlignState>({
    bufferMonitor:null,
    resizeHandler:null
  });

  // let [$sourceRect , update$sourceRect] = useState<ClientRect | null>(null);

  let [$PrevProps, setPrevProps] = useState<AlignProps>(props);
  let [$SourceRect , setSourceRect] = useState<ClientRect | null>(null);

  let forceAlign = useMemo(()=>function(
  ){
    const disabled =  !!props.disabled
    const { target, align, onAlign } = props;
    if (!disabled && target) {
      // const source = ReactDOM.findDOMNode(this);
      const source = ref.current!;
      let result;
      const element = getElement(target);
      const point = getPoint(target);
  
      // IE lose focus after element realign
      // We should record activeElement and restore later
      const activeElement = document.activeElement as HTMLElement;
  
      if (element) {
        result = alignElement(source, element, align);
      } else if (point) {
        result = alignPoint(source, point, align);
      }
  
      restoreFocus(activeElement, source);
  
      if (onAlign) {
        onAlign(source, result);
      }
    }
  },[]);
  let startMonitorWindowResize = useMemo(()=>function (){
    if (!state.resizeHandler) {
      const bufferMonitor = buffer(forceAlign, props.monitorBufferTime!)
      setState({
        bufferMonitor,
        resizeHandler:addEventListener(window, 'resize', bufferMonitor)
      });
    }
  },[]);
  let stopMonitorWindowResize = useMemo(()=>function() {
    if (state.resizeHandler) {
      state.bufferMonitor!.clear();
      state.resizeHandler.remove();
      setState({
        bufferMonitor:null,
        resizeHandler:null
      });
    }
  },[]);

  useEffect(()=>{
    // componentDidMount
    forceAlign();
    if (!props.disabled && props.monitorWindowResize) {
      startMonitorWindowResize();
    }
    return ()=>{
      // componentWillUnmount
      stopMonitorWindowResize();
    }
  },[]);

  useEffect(()=>{ 
    // componentDidUpdate
    let reAlign = false;
    if (!props.disabled) {
      const source = ref.current;
      const sourceRect = source ? source.getBoundingClientRect() : null;
      const prevProps = $PrevProps;

      if (prevProps.disabled) {
        reAlign = true;
      } else {
        const lastElement = getElement(prevProps.target!);
        const currentElement = getElement(props.target!);
        const lastPoint = getPoint(prevProps.target!);
        const currentPoint = getPoint(props.target!);

        if (isWindow(lastElement) && isWindow(currentElement)) {
          // Skip if is window
          reAlign = false;
        } else if (
          lastElement !== currentElement || // Element change
          (lastElement && !currentElement && currentPoint) || // Change from element to point
          (lastPoint && currentPoint && currentElement) || // Change from point to element
          (currentPoint && !isSamePoint(lastPoint!, currentPoint))
        ) {
          reAlign = true;
        }

        // If source element size changed
        const preRect = $SourceRect || {} as ClientRect;
        if (
          !reAlign &&
          source &&
          (!isSimilarValue(preRect.width, sourceRect!.width) || !isSimilarValue(preRect.height, sourceRect!.height))
        ) {
          reAlign = true;
        }
      }
      // update$sourceRect(sourceRect)
      // this.sourceRect = sourceRect;
      // updatePrevProps(props);
      (sourceRect === $SourceRect) || setSourceRect($SourceRect = sourceRect);
      (props === $PrevProps) || setPrevProps($PrevProps = props);
    }
  },[props]);

  useEffect(()=>{
    
  })
  const { childrenProps, children } = props;
  const child = React.Children.only(children) as React.ReactElement<any> | React.CElement<any,any> | React.FunctionComponentElement<any>;
  return React.cloneElement(child, childrenProps ? Object.assign({
    ref
  },childrenProps) : {
    ref
  });
});
export default Align