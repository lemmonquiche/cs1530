import React/*, { Component }*/ from 'react';
// import { Link/*, Route*/ } from 'react-router-dom';
import logo_univ_warm from './logo_univ_warm.png';

export default function Header(props) {
  return <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
    <div className="container">
      <a className="navbar-brand js-scroll-trigger text-univ-gold" href="#page-top">
        <img alt="Grouper Logo" src={logo_univ_warm} />
        Class Grouper
      </a>
      <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="/#about">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="/#services">Services</a>
          </li>
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="/#contact">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
}
