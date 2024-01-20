import React from 'react';
import './Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logo from '../Images/pwc.jpg'; // Import the image

const Header = () => {
  return (
    <div>
    <header>
      <div className='logo'><img src={logo} alt='not found' height={40} width={50}></img> Navigate PDF Reader</div>
      <div className='sadmin'>
          <FontAwesomeIcon icon={faUser} style={{ color: '#D93954'}} /> Super Admin
      </div>
    </header>
    </div>
  )
}

export default Header