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

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <select value={department} onChange={handleDepartmentChange}>
        <option value="">All Departments</option>
        {DEPARTMENTS.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <select value={status} onChange={handleStatusChange}>
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
