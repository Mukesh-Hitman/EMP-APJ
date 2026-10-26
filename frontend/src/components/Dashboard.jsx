import React from 'react';

export default function Dashboard({ data }) {
  const { total = 0, active = 0, inactive = 0 } = data || {};

  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-title-row">
        <h2>Overview & Workforce Metrics</h2>
      </div>

      <div className="dashboard-cards">
        <div className="card card-total">
          <div className="card-content">
            <h3>Total Employees</h3>
            <p className="card-number">{total}</p>
            <p className="card-meta">All registered team records</p>
          </div>
          <div className="card-icon-bubble bubble-total" aria-hidden="true">
            👥
          </div>
        </div>

        <div className="card card-active">
          <div className="card-content">
            <h3>Active</h3>
            <p className="card-number">{active}</p>
            <p className="card-meta">{activePercent}% active capacity</p>
          </div>
          <div className="card-icon-bubble bubble-active" aria-hidden="true">
            ⚡
          </div>
        </div>

        <div className="card card-inactive">
          <div className="card-content">
            <h3>Inactive</h3>
            <p className="card-number">{inactive}</p>
            <p className="card-meta">On leave or paused</p>
          </div>
          <div className="card-icon-bubble bubble-inactive" aria-hidden="true">
            ⏳
          </div>
        </div>
      </div>
    </div>
  );
}
