import React from 'react';

export default function EmployeeList({ employees, onEdit, onDelete }) {
  if (!employees || employees.length === 0) {
    return <p className="empty-message">No employees found</p>;
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
            return (
              <tr key={empId}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>
                  <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn btn-edit" onClick={() => onEdit(emp)}>
                    Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(emp)}>
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
