import React from 'react';

export default function Dashboard({ data }) {
  const { total = 0, active = 0, inactive = 0 } = data || {};

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card card-total">
          <h3>Total Employees</h3>
          <p className="card-number">{total}</p>
        </div>
        <div className="card card-active">
          <h3>Active</h3>
          <p className="card-number">{active}</p>
        </div>
        <div className="card card-inactive">
          <h3>Inactive</h3>
          <p className="card-number">{inactive}</p>
        </div>
      </div>
    </div>
  );
}
