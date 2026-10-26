import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import SearchFilter from './components/SearchFilter';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboard,
} from './services/api';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [dashboardData, setDashboardData] = useState({ total: 0, active: 0, inactive: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [filters, setFilters] = useState({ search: '', department: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEmployees(filters);
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDashboard();
  }, [fetchEmployees, fetchDashboard]);

  const handleSearch = (search) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleFilterChange = ({ department, status }) => {
    setFilters((prev) => ({ ...prev, department, status }));
  };

  const handleAddClick = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (formData) => {
    if (editingEmployee) {
      await updateEmployee(editingEmployee._id, formData);
    } else {
      await createEmployee(formData);
    }
    setShowForm(false);
    setEditingEmployee(null);
    fetchEmployees();
    fetchDashboard();
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      fetchEmployees();
      fetchDashboard();
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Employee Management System</h1>
      </header>

      <Dashboard data={dashboardData} />

      <section className="employee-section">
        <div className="section-header">
          <h2>Employees</h2>
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Add Employee
          </button>
        </div>

        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />

        {error && <div className="error-banner">{error}</div>}
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}
