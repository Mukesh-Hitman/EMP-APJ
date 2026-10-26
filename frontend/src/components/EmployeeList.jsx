import React from 'react';

/**
 * Helper to compute 2-letter initials from name.
 */
function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'EM';
}

export default function EmployeeList({ employees, onEdit, onDelete }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-icon" aria-hidden="true">📂</div>
        <p className="empty-message">No employees found</p>
        <p className="empty-subtext">Try refining your search filters or click "+ Add Employee" to create one.</p>
      </div>
    );
  }

  const handleDelete = (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      onDelete(employee.id || employee._id);
    }
  };

  return (
    <div className="table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const empId = emp.id || emp._id;
            const isActive = String(emp.status).toLowerCase() === 'active';
            const initials = getInitials(emp.name);

            return (
              <tr key={empId}>
                <td>
                  <div className="user-info-cell">
                    <div className="avatar-circle" aria-hidden="true">
                      {initials}
                    </div>
                    <div>
                      <div className="user-name">{emp.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="user-email-text">{emp.email}</span>
                </td>
                <td>
                  <span className="department-chip">{emp.department}</span>
                </td>
                <td>{emp.designation}</td>
                <td>
                  <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="actions">
                  <button
                    type="button"
                    className="btn btn-edit"
                    onClick={() => onEdit(emp)}
                    title="Edit employee record"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-delete"
                    onClick={() => handleDelete(emp)}
                    title="Delete employee record"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
