import React, { useState, useEffect } from 'react';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const STATUSES = ['Active', 'Inactive'];

export default function EmployeeForm({ onSubmit, employee, onCancel }) {
  const isEdit = Boolean(employee);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        designation: employee.designation || '',
        status: employee.status
          ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1).toLowerCase()
          : '',
      });
    } else {
      setFormData({ name: '', email: '', department: '', designation: '', status: '' });
    }
    setErrors({});
    setServerError('');
  }, [employee]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name is required and must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'A valid email is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData.designation || formData.designation.trim().length === 0) {
      newErrors.designation = 'Designation is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        status: formData.status ? formData.status.toLowerCase() : 'active',
      });
    } catch (err) {
      const message = err.details && err.details.length > 0
        ? `${err.message}: ${err.details.join('; ')}`
        : (err.message || 'An error occurred');
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="employee-form-container" role="dialog" aria-modal="true">
        <div className="form-header">
          <div>
            <h3>{isEdit ? 'Edit Employee' : 'Add Employee'}</h3>
            <p>{isEdit ? 'Update team member information below' : 'Fill in the information to onboard a team member'}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Mukesh Kumar"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="field-error">⚠ {errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. mukesh@company.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">⚠ {errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? 'input-error' : ''}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <span className="field-error">⚠ {errors.department}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              id="designation"
              name="designation"
              type="text"
              placeholder="e.g. Senior Software Engineer"
              value={formData.designation}
              onChange={handleChange}
              className={errors.designation ? 'input-error' : ''}
            />
            {errors.designation && <span className="field-error">⚠ {errors.designation}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? 'input-error' : ''}
            >
              <option value="">Select Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.status && <span className="field-error">⚠ {errors.status}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
