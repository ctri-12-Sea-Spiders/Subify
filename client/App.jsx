import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Home from './Home.jsx';
import style from './view/style.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" caseSensitive={false} element={<Login />} />
          <Route path="/signup" caseSensitive={false} element={<Signup />} />
          <Route path="/home" caseSensitive={false} element={<Home />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
