import React, { useState, useEffect } from 'react';
import AddSub from './components/AddSub.jsx';
import Welcome from './components/Welcome.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import SubCard from './components/SubCard.jsx';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate('/');
  const [display, setDisplay] = useState([]);
  const [summaryData, setSummaryData] = useState({
    subscriptionCount: 0,
    totalMonthlyPrice: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/authenticate/')
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        // result is true if authorized, and false if not
        if (result) {
          setIsLoggedIn(true);
        } else {
          navigate('/');
        }
      });
  }, []);

  const contentLoggedIn = (
    <div id="mainContainer">
      <Welcome />
      <div id="midContainer">
        <AddSub display={display} setDisplay={setDisplay} />
        <div className="all-cards">
          <SummaryCard summaryData={summaryData} />
          {/* <Summary display={display} setDisplay={setDisplay} /> */}
          {/* <CardContainer /> Why was this needed? unsure about purpose*/}
          <SubCard display={display} setDisplay={setDisplay} summaryData={summaryData} setSummaryData={setSummaryData} />
        </div>
      </div>
    </div>
  );

  // conditionally render based on authorization status
  if (isLoggedIn) {
    return contentLoggedIn;
  } else {
    return <></>;
  }
}
