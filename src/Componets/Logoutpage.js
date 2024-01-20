// Logout.js
import React from 'react';

const Logout = ({ onLogout }) => {
  return (
    <div className="logout-container">
      <h2>Logout Page</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Logout;
