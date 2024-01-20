// Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import Chatlogo from '../Images/Chat.png';
import Uploadlogo from '../Images/Upload.png';
import Exitlogo from '../Images/Exit.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className='version'>V 1.0</div>
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="menu-items">
        {isOpen ? (
          <ul>
            {/* <li><Link to="/" onClick={() => handleLinkClick('/')}>Home</Link></li> */}
            <li><Link to="/AIchat" onClick={() => handleLinkClick('/AIchat')}>AIChat</Link></li>
            <li><Link to="/upload" onClick={() => handleLinkClick('/upload')}>Upload</Link></li>
            <li><Link to="/Logout" onClick={() => handleLinkClick('/Logout')}>Logout</Link></li>
          </ul>
        ) : (
          <div className="menu-icons">
            {/* <div className={`icon ${activeLink === '/' ? 'active' : ''}`}>
              <Link to="/" onClick={() => handleLinkClick('/')}><img src={Chatlogo} alt="Home" /></Link>
            </div> */}
            <div className={`icon ${activeLink === '/AIchat' ? 'active' : ''}`}>
              <Link to="/AIchat" onClick={() => handleLinkClick('/AIchat')}><img src={Chatlogo} alt="AIChat" /></Link>
            </div>
            <div className={`icon ${activeLink === '/upload' ? 'active' : ''}`}>
              <Link to="/upload" onClick={() => handleLinkClick('/upload')}><img src={Uploadlogo} alt="Upload" /></Link>
            </div>
            <div className={`icon ${activeLink === '/Logout' ? 'active' : ''}`}>
              <Link to="/Logout" onClick={() => handleLinkClick('/Logout')}><img src={Exitlogo} alt="Logout" /></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
