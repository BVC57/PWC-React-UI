import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Header from './Componets/Header';
import UploadSection from './Componets/Upload';
import Sidebar from './Componets/Sidebar';
import AIChat from './Componets/AiChat';
import LogoutPage from './Componets/Logoutpage';
import Home from './Componets/Home';

function App() {
 
  const [isLoggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const handlePageRefresh = () => {
      // Check if the user is not logged in
      if (!isLoggedIn && window.location.pathname !== '/') {
        // Redirect to the home page on page refresh
        window.location.href = '/';
      }
    };

    // Attach the event listener for page refresh
    window.addEventListener('afterunload', handlePageRefresh);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('afterunload', handlePageRefresh);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogout = () => {
    // Perform logout actions (e.g., clear authentication tokens, reset state)
    setLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className='maincontent'>
          <div className='header1'>
            <Header />
          </div>
          <Routes>
            <Route path="/"  element= { <Home/>} />
            <Route path="/AIchat"  element= { <AIChat/>} />
            <Route path="/Upload"  element= { <UploadSection/>} />
            <Route
              path="/Logout"
              element={
                isLoggedIn ? (
                  <LogoutPage onLogout={handleLogout} />
                ) : (
                  // Redirect to login or home page if not logged in
                  <Link to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
