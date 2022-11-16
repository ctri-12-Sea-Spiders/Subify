import React from 'react';

export default function displayBox(props) {
  const { getSubs, id, subscription_name, category, monthly_price } = props;

  const handleClickDelete = (id) => {
    console.log('Button ID', id);
    fetch('/api/subscriptions', {
      method: 'DELETE',
      body: JSON.stringify({ id: id }),
      headers: {
        'Content-Type': 'Application/JSON',
      },
    })
      .then(getSubs())
      .catch((err) => console.log('Deleting Error', err));
  };

  const handleUpdate = (id, newSub, newContent, newMonthly) => {
    console.log('Update Button ID', id);
    fetch('/api/subscriptions', {
      method: 'PATCH',
      body: JSON.stringify({
        id: id,
        subscription_name: newSub,
        content: newContent,
        monthly_price: newMonthly,
      }),
      headers: {
        'Content-Type': 'Application/JSON',
      },
    })
      .then(getSubs())
      .catch((err) => console.log('Updating Error', err));
  };

  return (
    <div className="displayBox">
      <div className="ServiceDetail">
        <strong>ServiceName:</strong> <div id={`subName${id}`}>{subscription_name}</div>
      </div>
      <div className="ServiceDetail">
        {' '}
        <strong>Category:</strong> <div id={`category${id}`}>{category}</div>
      </div>
      <div className="ServiceDetail">
        {' '}
        <strong>Monthly Price:</strong> <div id={`monthlyPrice${id}`}>{monthly_price}</div>
      </div>
      <div className="ServiceDetail">
        {' '}
        <strong>Yearly Charge:</strong> <div>{monthly_price * 12}</div>
      </div>
      <div></div>
      <div id="CRUD">
        <button
          className="updateBtn"
          id={`updateBtn${id}`}
          onClick={() => {
            const btn = document.getElementById(`updateBtn${id}`);
            const subEdit = document.getElementById(`subName${id}`);
            const categoryEdit = document.getElementById(`category${id}`);
            const monthlyPriceEdit = document.getElementById(`monthlyPrice${id}`);

            if (btn.textContent === 'Update Subscription') {
              subEdit.contentEditable = true;
              subEdit.style.backgroundColor = '#dddbdb';

              categoryEdit.contentEditable = true;
              categoryEdit.style.backgroundColor = '#dddbdb';

              monthlyPriceEdit.contentEditable = true;
              monthlyPriceEdit.style.backgroundColor = '#dddbdb';

              btn.textContent = 'Confirm Changes';
            } else {
              subEdit.contentEditable = false;
              categoryEdit.contentEditable = false;
              monthlyPriceEdit.contentEditable = false;
              subEdit.style.backgroundColor = '#7be495';
              categoryEdit.style.backgroundColor = '#7be495';
              monthlyPriceEdit.style.backgroundColor = '#7be495';
              btn.textContent = 'Update Subscription';
              handleUpdate(id, subEdit.innerText, categoryEdit.innerText, monthlyPriceEdit.innerText);
            }
          }}
        >
          Update Subscription
        </button>
        <button className="newBtn" id="deleteBtn" onClick={() => handleClickDelete(id)}>
          Delete Subscription
        </button>
      </div>
    </div>
  );
}
