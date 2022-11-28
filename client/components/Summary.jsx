import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard.jsx';

export default function Summary(props) {
  const { display, setDisplay } = props;

  const [display1, setDisplay1] = useState([]);

  useEffect(() => {
    fetch('/api/subscriptions')
      .then((res) => {
        res.json();
      })
      .then((data) => {
        setDisplay1(
          data.map((sub, i) => {
            return (
              <SummaryCard
                id={sub._id}
                key={i}
                totalSubs={display1.length}
                yearly_price={sub.subscription_price * 12}
                monthly_price={sub.subscription_price}
              />
            );
          })
        );
      });
  }, [display.length]);

  return <div>{display1}</div>;
}
