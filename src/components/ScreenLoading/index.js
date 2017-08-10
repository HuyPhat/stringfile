import React from 'react';
import PropTypes from 'prop-types';

import logo from 'assets/images/svg/logo.svg';
import './pre-loading.css';
/* eslint-disable*/
function PathLoader(el) {
  this.el = el;
  this.el.style.strokeDasharray = this.el.style.strokeDashoffset = this.el.getTotalLength();
}
PathLoader.prototype._draw = function(val) {
  this.el.style.strokeDashoffset = this.el.getTotalLength() * (1 - val);
};

PathLoader.prototype.setProgress = function(val, callback) {
  this._draw(val);
  if (callback && typeof callback === 'function') {
    setTimeout(callback, 200);
  }
};

PathLoader.prototype.setProgressFn = (fn) => {
  if (typeof fn === 'function') {
    var self = this;
    fn(self);
  }
};

export default class ScreenLoading extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  shouldComponentUpdate() {
    if (this.props.completed) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.loader = new PathLoader(this.ipLoaderCircle);
    this.loader.setProgressFn(this.simulationFn);
    this.container = document.getElementById('ip-container');
  }

  simulationFn = () => {
    var progress = 0;
    var interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 0.1, 1);
      if (progress > 0.9 && !window.getFileComplete) {
        progress = 0.9;
      }
      if (this.props.completed) {
        progress = 1;
      }
      this.loader.setProgress(progress);
      // reached the end
      if (progress === 1 && this.props.completed) {
        if (this.container && this.container.classList) {
          this.container.classList.remove('loading');
          this.container.classList.add('loaded');
          if( this.container.style.animationName === undefined ) {
            this.container.classList.add('layout-switch');
          }
        }
        clearInterval(interval);
        // var onEndHeaderAnimation = (ev) => {
          // if (support.animations) {
          //   if (ev.target !== header) {return;}
          //   this.removeEventListener(animEndEventName, onEndHeaderAnimation);
          // }

          // classie.add(container, 'layout-switch');
          // window.removeEventListener('scroll', noscroll);
        // };

        // if (support.animations) {
        //   header.addEventListener(animEndEventName, onEndHeaderAnimation);
        // }
        // else {
        //   onEndHeaderAnimation();
        // }
      }
    }, 400);
  }

  render() {
    const {completed} = this.props;
    let header = null;
    if (!!!completed) {
      header =
        <header className='ip-header'>
              <div className='ip-logo'>
                <img className='ip-inner' src={logo} title='FileString Logo' alt='FileString Logo' />
              </div>
              <h1>Don't Lose Control of Files You Share</h1>
              <div className='ip-loader'>
                <svg className='ip-inner' width='60px' height='60px' viewBox='0 0 80 80'>
                  <path className='ip-loader-circlebg' d='M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z'/>
                  <path id='ip-loader-circle' ref={node => {this.ipLoaderCircle = node;}} className='ip-loader-circle' d='M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z'/>
                </svg>
              </div>
            </header>
    }
    return header;
  }
}
