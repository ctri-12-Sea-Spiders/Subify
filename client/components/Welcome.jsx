import React, { useEffect, useState } from 'react';
import logo from '../assets/Subify_Logo.png';

export default function Welcome() {
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((result) => setCurrentUser(result.fName + ' ' + result.lName));
  }, []);

  return (
    <div id="topcontainer">
      <div id="logocontainer">
        <img src={logo} alt="" />
      </div>
      <div id="welcomemessage">
        <h3>Hello, {currentUser}</h3>
      </div>
    </div>
  );
}
