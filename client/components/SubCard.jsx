import React, { useEffect } from 'react';
import DisplayBox from './displayBox.jsx';

export default function SubCard(props) {
  const { display, setDisplay, summaryData, setSummaryData } = props;

  const getSubCards = () => {
    const newSummaryData = summaryData;
    newSummaryData.totalMonthlyPrice = 0;
    newSummaryData.subscriptionCount = 0;
    fetch('/api/subscriptions')
      .then((response) => response.json())
      .then((data) => {
        setDisplay(
          data.map((sub, i) => {
            newSummaryData.totalMonthlyPrice = (parseFloat(newSummaryData.totalMonthlyPrice) + parseFloat(sub.subscription_price)).toFixed(
              2
            );
            newSummaryData.subscriptionCount += 1;
            return (
              <DisplayBox
                getSubs={getSubCards}
                key={`card${i}`}
                id={sub.id}
                subscription_name={sub.subscription_name}
                category={sub.category}
                monthly_price={sub.subscription_price}
              />
            );
          })
        );
        setSummaryData(newSummaryData);
      });
  };
  useEffect(() => {
    getSubCards();
  }, [display.length]);

  return <div className="displayContainer">{display}</div>;
}
