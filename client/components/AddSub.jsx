import React from 'react';
import { useState } from 'react';

export default function AddSub(props) {
  const { display, setDisplay } = props;

  const [formData, setFormData] = useState({
    // add username property
    subscription_name: '',
    monthly_price: '',
    category: 'other', //give default value
    due_date: 'PLACEHOLDER', // add later, leaving it as an empty string for now
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = formData;
    const url = '/api/subscriptions';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {})
      .catch((err) => {
        console.log('Error:', err);
      });

    setDisplay([...display, 'Refresh']);

    setFormData((old) => {
      return {
        // add username property
        subscription_name: '',
        monthly_price: '',
        category: 'other', //give default value
        due_date: 'PLACEHOLDER', // add later, leaving it as an empty string for now
      };
    });
  };

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((oldData) => {
      return {
        ...oldData, //Changed OldData to oldData
        [name]: value,
      };
    });
    console.log('formData', formData);
  }

  return (
    <div>
      <form className="addSubForm" onSubmit={handleSubmit}>
        <span>Service Name</span>
        <input
          type="text"
          id="serviceNameInput"
          placeholder="Service Name"
          onChange={handleChange}
          value={formData.subscription_name} // not absolutely necessary, will work without, but just best practice, reason: allows React to remain in control of state
          name="subscription_name" //Added formData. in front of subscription_name
        />
        <span>Service Price</span>

        <input
          type="text"
          id="servicePriceInput"
          placeholder="Monthly Price"
          onChange={handleChange}
          value={formData.monthly_price}
          name="monthly_price"
        />
        <span>Category</span>

        <select
          /* name="category" */
          id="categoryselect"
          onChange={handleChange}
          name="category" //Added formData. infront
          value={formData.category}
        >
          <option value="other">Other</option> {/* changed default to other */}
          <option value="entertainment">Entertainment</option>
          <option value="food">Food</option>
        </select>
        {/* 
        <select name="prepopulated_service_name" id='prepopulated_service_name'>
          {
            once the user selects a subscription category, we need another dropdown menu to select the pre-populated subscription. I am thinking we will need to
            a get request here. Once we get the info to populate the form.

          }
        </select> */}

        <button type="submit" id="AddCardButton">
          Add Subscription
        </button>
      </form>
    </div>
  );
}
