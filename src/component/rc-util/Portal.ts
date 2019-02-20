import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
interface PortalProp{
  getContainer:()=>Element
  children:React.ReactNode
  didUpdate?:(prevProps:PortalProp) => any
}
export default class Portal extends React.Component<PortalProp> {
  public _container?: ReturnType<PortalProp["getContainer"]>
  componentDidMount() {
    this.createContainer();
  }

  componentDidUpdate(prevProps:PortalProp) {
    const { didUpdate } = this.props;
    if (didUpdate) {
      didUpdate(prevProps);
    }
  }

  componentWillUnmount() {
    this.removeContainer();
  }

  createContainer() {
    this._container = this.props.getContainer();
    this.forceUpdate();
  }

  removeContainer() {
    if (this._container) {
      this._container.parentNode!.removeChild(this._container);
    }
  }

  render() {
    if (this._container) {
      return ReactDOM.createPortal(this.props.children, this._container);
    }
    return null;
  }
}
