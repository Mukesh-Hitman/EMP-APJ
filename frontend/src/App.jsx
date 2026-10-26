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
  const [toast, setToast] = useState('');

  const showToastMessage = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast('');
    }, 3200);
  };

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
      const id = editingEmployee.id || editingEmployee._id;
      await updateEmployee(id, formData);
      showToastMessage(`Employee "${formData.name}" updated successfully.`);
    } else {
      await createEmployee(formData);
      showToastMessage(`Employee "${formData.name}" created successfully.`);
    }
    setShowForm(false);
    setEditingEmployee(null);
    fetchEmployees();
    fetchDashboard();
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      showToastMessage('Employee record deleted successfully.');
      fetchEmployees();
      fetchDashboard();
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon" aria-hidden="true">
            ⚡
          </div>
          <div className="brand-titles">
            <h1>Employee Management System</h1>
            <div className="brand-subtitle">
              <span>Enterprise Workforce Portal</span>
              <span className="pill-badge">
                <span className="pulse-dot"></span>
                Prisma ORM Connected
              </span>
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleAddClick}>
          <span>+ Add Employee</span>
        </button>
      </header>

      <Dashboard data={dashboardData} />

      <section className="employee-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>Employees Directory</h2>
            <p>Filter, search, review, and manage workforce member profiles</p>
          </div>
        </div>

        <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />

        {error && <div className="server-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {loading ? (
          <p className="empty-subtext" style={{ padding: '2rem', textAlign: 'center' }}>
            Loading workforce records...
          </p>
        ) : (
          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {toast && (
        <div className="toast-banner toast-success" role="status">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
