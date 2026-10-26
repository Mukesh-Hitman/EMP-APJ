/**
 * Validation middleware for employee input fields.
 * Validates name, email, department, designation, and status.
 */

/**
 * Simple email format validation using a regex pattern.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email format is valid.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Middleware to validate employee fields on creation (POST).
 * All fields (name, email, department, designation) are required.
 * Status defaults to 'active' if not provided.
 */
function validateEmployee(req, res, next) {
  const errors = [];
  const { name, email, department, designation, status } = req.body;

  // Validate name: required, 2-100 characters
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }

  // Validate email: required, valid format
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(email.trim())) {
    errors.push('Email must be a valid email address');
  }

  // Validate department: required, non-empty
  if (!department || typeof department !== 'string' || department.trim().length === 0) {
    errors.push('Department is required');
  }

  // Validate designation: required, non-empty
  if (!designation || typeof designation !== 'string' || designation.trim().length === 0) {
    errors.push('Designation is required');
  }

  // Validate status: if provided, must be 'active' or 'inactive' (case-insensitive)
  if (status !== undefined && status !== null) {
    const normalized = typeof status === 'string' ? status.trim().toLowerCase() : '';
    if (!['active', 'inactive'].includes(normalized)) {
      errors.push('Status must be either "active" or "inactive"');
    } else {
      req.body.status = normalized;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  // Trim whitespace from validated fields
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.department = department.trim();
  req.body.designation = designation.trim();
  if (!status) {
    req.body.status = 'active';
  }

  next();
}

/**
 * Middleware to validate employee fields on update (PUT).
 * Same rules as creation validation.
 */
function validateEmployeeUpdate(req, res, next) {
  const errors = [];
  const { name, email, department, designation, status } = req.body;

  // Validate name: required, 2-100 characters
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2 || name.trim().length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }

  // Validate email: required, valid format
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(email.trim())) {
    errors.push('Email must be a valid email address');
  }

  // Validate department: required, non-empty
  if (!department || typeof department !== 'string' || department.trim().length === 0) {
    errors.push('Department is required');
  }

  // Validate designation: required, non-empty
  if (!designation || typeof designation !== 'string' || designation.trim().length === 0) {
    errors.push('Designation is required');
  }

  // Validate status: must be 'active' or 'inactive' (case-insensitive)
  if (status !== undefined && status !== null) {
    const normalized = typeof status === 'string' ? status.trim().toLowerCase() : '';
    if (!['active', 'inactive'].includes(normalized)) {
      errors.push('Status must be either "active" or "inactive"');
    } else {
      req.body.status = normalized;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  // Trim whitespace from validated fields
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.department = department.trim();
  req.body.designation = designation.trim();

  next();
}

module.exports = { validateEmployee, validateEmployeeUpdate };
