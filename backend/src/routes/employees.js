const express = require('express');
const { validateEmployee, validateEmployeeUpdate } = require('../middleware/validation');

/**
 * Format Prisma employee record to ensure consistent API shape.
 * @param {object} emp
 */
function formatEmployee(emp) {
  if (!emp) return null;
  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,
    department: emp.department,
    designation: emp.designation,
    status: emp.status,
    created_at: emp.createdAt,
    updated_at: emp.updatedAt,
  };
}

/**
 * Create the employees router using Prisma ORM.
 * @param {import('@prisma/client').PrismaClient} prisma - The PrismaClient instance.
 * @returns {express.Router} Configured Express router.
 */
function createEmployeesRouter(prisma) {
  const router = express.Router();

  /**
   * GET /api/employees
   * List all employees with optional search, department, and status filters.
   */
  router.get('/', async (req, res) => {
    try {
      const { search, department, status } = req.query;

      const where = {};

      if (search) {
        where.name = {
          contains: search,
        };
      }

      if (department) {
        where.department = department;
      }

      if (status) {
        where.status = status.trim().toLowerCase();
      }

      const employees = await prisma.employee.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(employees.map(formatEmployee));
    } catch (err) {
      console.error('Error fetching employees with Prisma:', err.message);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  });

  /**
   * GET /api/employees/:id
   * Get a single employee by ID.
   */
  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const employee = await prisma.employee.findUnique({
        where: { id },
      });

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      res.json(formatEmployee(employee));
    } catch (err) {
      console.error('Error fetching employee with Prisma:', err.message);
      res.status(500).json({ error: 'Failed to fetch employee' });
    }
  });

  /**
   * POST /api/employees
   * Create a new employee using Prisma ORM.
   */
  router.post('/', validateEmployee, async (req, res) => {
    try {
      const { name, email, department, designation, status } = req.body;
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedStatus = status ? status.trim().toLowerCase() : 'active';

      // Check for duplicate email
      const existing = await prisma.employee.findUnique({
        where: { email: normalizedEmail },
      });

      if (existing) {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }

      const newEmployee = await prisma.employee.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          department: department.trim(),
          designation: designation.trim(),
          status: normalizedStatus,
        },
      });

      res.status(201).json(formatEmployee(newEmployee));
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }
      console.error('Error creating employee with Prisma:', err.message);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  });

  /**
   * PUT /api/employees/:id
   * Update an existing employee using Prisma ORM.
   */
  router.put('/:id', validateEmployeeUpdate, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const { name, email, department, designation, status } = req.body;
      const normalizedEmail = email.trim().toLowerCase();

      // Check if employee exists
      const employee = await prisma.employee.findUnique({
        where: { id },
      });
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Check duplicate email
      const emailConflict = await prisma.employee.findFirst({
        where: {
          email: normalizedEmail,
          NOT: { id },
        },
      });
      if (emailConflict) {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }

      const updatedEmployee = await prisma.employee.update({
        where: { id },
        data: {
          name: name.trim(),
          email: normalizedEmail,
          department: department.trim(),
          designation: designation.trim(),
          status: status ? status.trim().toLowerCase() : employee.status,
        },
      });

      res.json(formatEmployee(updatedEmployee));
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'An employee with this email already exists' });
      }
      console.error('Error updating employee with Prisma:', err.message);
      res.status(500).json({ error: 'Failed to update employee' });
    }
  });

  /**
   * DELETE /api/employees/:id
   * Delete an employee using Prisma ORM.
   */
  router.delete('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const employee = await prisma.employee.findUnique({
        where: { id },
      });
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      await prisma.employee.delete({
        where: { id },
      });

      res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
      console.error('Error deleting employee with Prisma:', err.message);
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  });

  return router;
}

module.exports = createEmployeesRouter;
