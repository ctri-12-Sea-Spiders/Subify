import React from 'react';

export default function displayBox(props) {
  const { id, subscription_name, category, monthly_price } = props; // destructuring the props object so we can just use the prop names to render
  // changed attribute names to match exactly with what we have state set with, and how we have it labeled in the backend

  const handleClick = (id) => {
    fetch('/api/subscriptions/', {
      method: 'DELETE',
      body: id,
    }).catch((err) => console.log('Deleting Error', err));
  };

  return (
    <div className="displayBox">
      <p className="ServiceDetail">
        {' '}
        <strong>ServiceName:</strong> {subscription_name}
      </p>
      <p className="ServiceDetail">
        {' '}
        <strong>Category:</strong> {category}
      </p>
      <p className="ServiceDetail">
        {' '}
        <strong>Monthly Price:</strong> {monthly_price}
      </p>
      <p className="ServiceDetail">
        {' '}
        <strong>Yearly Charge:</strong> {monthly_price * 12}
      </p>
      <button onClick={() => handleClick(id)}>Delete Subscription</button>
    </div>
  );
}
