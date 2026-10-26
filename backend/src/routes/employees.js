const express = require('express');
const { validateEmployee, validateEmployeeUpdate } = require('../middleware/validation');

/**
 * Create the employees router.
 * @param {import('better-sqlite3').Database} db - The database instance.
 * @returns {express.Router} Configured Express router for employee endpoints.
 */
function createEmployeesRouter(db) {
  const router = express.Router();

  /**
   * GET /api/employees
   * List all employees with optional search, department, and status filters.
   * Query params:
   *   - search: case-insensitive name search (LIKE %search%)
   *   - department: exact department match
   *   - status: exact status match ('active' or 'inactive')
   */
  router.get('/', (req, res) => {
    try {
      const { search, department, status } = req.query;

      let query = 'SELECT * FROM employees WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND name LIKE ?';
        params.push(`%${search}%`);
      }

      if (department) {
        query += ' AND department = ?';
        params.push(department);
      }

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const employees = db.prepare(query).all(...params);
      res.json(employees);
    } catch (err) {
      console.error('Error fetching employees:', err.message);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  });

  /**
   * GET /api/employees/:id
   * Get a single employee by ID.
   */
  router.get('/:id', (req, res) => {
    try {
      const { id } = req.params;
      const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json(employee);
    } catch (err) {
      console.error('Error fetching employee:', err.message);
      res.status(500).json({ error: 'Failed to fetch employee' });
    }
  });

  /**
   * POST /api/employees
   * Create a new employee. Validates input and checks for duplicate email.
   */
  router.post('/', validateEmployee, (req, res) => {
    try {
      const { name, email, department, designation, status } = req.body;

      // Check for duplicate email
      const existing = db.prepare('SELECT id FROM employees WHERE email = ?').get(email);
      if (existing) {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }

      const stmt = db.prepare(`
        INSERT INTO employees (name, email, department, designation, status)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, email, department, designation, status || 'active');

      const newEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json(newEmployee);
    } catch (err) {
      console.error('Error creating employee:', err.message);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }
      res.status(500).json({ error: 'Failed to create employee' });
    }
  });

  /**
   * PUT /api/employees/:id
   * Update an existing employee. Validates input and checks for duplicate email (excluding current employee).
   */
  router.put('/:id', validateEmployeeUpdate, (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, department, designation, status } = req.body;

      // Check if employee exists
      const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Check for duplicate email (excluding current employee)
      const existing = db.prepare('SELECT id FROM employees WHERE email = ? AND id != ?').get(email, id);
      if (existing) {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }

      const stmt = db.prepare(`
        UPDATE employees
        SET name = ?, email = ?, department = ?, designation = ?, status = ?, updated_at = datetime('now')
        WHERE id = ?
      `);
      stmt.run(name, email, department, designation, status || employee.status, id);

      const updatedEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
      res.json(updatedEmployee);
    } catch (err) {
      console.error('Error updating employee:', err.message);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }
      res.status(500).json({ error: 'Failed to update employee' });
    }
  });

  /**
   * DELETE /api/employees/:id
   * Delete an employee by ID.
   */
  router.delete('/:id', (req, res) => {
    try {
      const { id } = req.params;

      // Check if employee exists
      const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      db.prepare('DELETE FROM employees WHERE id = ?').run(id);
      res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
      console.error('Error deleting employee:', err.message);
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  });

  return router;
}

module.exports = createEmployeesRouter;
