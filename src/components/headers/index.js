/**
 * Created by phathuy on 6/18/17.
 */
import React from 'react';
import logo from './logo-slogan.png';
import { Link } from 'react-router-dom';
import ENV_VARIABLES from 'config/variables';
import './styles.scss';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

class SiteHeader extends React.Component {
  // toggleMenuCollapse = (e) => {
  //   console.log(e);
  // }

  render() {
    return (
      <header id='site-header'>
        <div className='container'>
          <Link to='/'>
            <img src={logo} alt='logo' />
          </Link>
          <button
            className='navbar-toggle'
            type='button'
            onClick={() => this.toggleMenuCollapse()}
          >
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar' />
            <span className='icon-bar' />
            <span className='icon-bar' />
          </button>
          <nav className='navbar-right header-custom-right'>
            <ul className='nav navbar-nav upper-menu hidden-xs'>
              <li>
                <Link to='/sign-up'>Get Started</Link>
              </li>
              <li id='loginButton' className='loginClass desktopShow'>
                <Link to='/login'>Log In</Link>
              </li>
            </ul>
            <div className='clearfix' />
            <ul
              className='collapse navbar-collapse bottom-menu collapse'
              role='navigation'
            >
              {ENV_VARIABLES.header_urls.map((link, index) =>
                <li key={index}>
                  <a href={link.url}>
                    {link.name}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}

export default SiteHeader;
