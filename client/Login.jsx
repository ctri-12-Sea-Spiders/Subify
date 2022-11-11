import React from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from './assets/Subify_Logo.png';
import GoogleButton from 'react-google-button';

export default function Login() {
  const URL = '/api/authenticate/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate('/');

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log('Username', result.username);
        if (result.username) {
          console.log('LOGGED IN!');
          navigate('/home');
        }
        //render some alert
        else console.log('INVALID CREDENTIALS');

        setPassword('');
        setUsername('');
      });
  };

  return (
    <div className="base-container">
      <div id="signinlogo">
        <img src={logo} alt="" className="logoimage" />
      </div>
      <div className="content">
        <div className="formGroup">
          <label>Login to Subify</label>
          <form className="loginForm" onSubmit={handleSubmit}>
            <input type="text" id="usernameLogin" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username} />
            <input
              type="password"
              id="passwordLogin"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="button-container">
              <button className="button">Login</button>
              <button className="button" onClick={() => navigate('/signup')}>
                Signup
              </button>
            </div>
            <br />
            <div className="google-button">
              <a href="/api/authenticate/login/google">
                <GoogleButton type="dark" />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
