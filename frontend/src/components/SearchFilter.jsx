import React, { useState, useEffect, useRef } from 'react';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

export default function SearchFilter({ onSearch, onFilterChange }) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(search);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const handleDepartmentChange = (e) => {
    const val = e.target.value;
    setDepartment(val);
    onFilterChange({ department: val, status });
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatus(val);
    onFilterChange({ department, status: val });
  };

  const handleClear = () => {
    setSearch('');
    setDepartment('');
    setStatus('');
    onFilterChange({ department: '', status: '' });
  };

  const hasFilters = search || department || status;

  return (
    <div className="search-filter">
      <div className="search-input-wrap">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          aria-label="Search by name"
        />
      </div>

      <div className="select-wrap">
        <select
          value={department}
          onChange={handleDepartmentChange}
          aria-label="Filter by department"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="select-wrap">
        <select
          value={status}
          onChange={handleStatusChange}
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
