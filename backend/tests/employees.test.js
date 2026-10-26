const request = require('supertest');
const { initializeDatabase } = require('../src/db');
const createApp = require('../src/app');

let db;
let app;

beforeEach(async () => {
  // Use in-memory database for each test
  db = await initializeDatabase(':memory:');
  app = createApp(db);
});

afterEach(() => {
  db.close();
});

/** Helper to create a valid employee */
const validEmployee = (overrides = {}) => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'Engineering',
  designation: 'Software Engineer',
  status: 'active',
  ...overrides,
});

describe('POST /api/employees', () => {
  it('should create a new employee with valid data', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee());

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('John Doe');
    expect(res.body.email).toBe('john.doe@example.com');
    expect(res.body.department).toBe('Engineering');
    expect(res.body.designation).toBe('Software Engineer');
    expect(res.body.status).toBe('active');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
  });

  it('should default status to active if not provided', async () => {
    const { status, ...employeeWithoutStatus } = validEmployee();
    const res = await request(app)
      .post('/api/employees')
      .send(employeeWithoutStatus);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('active');
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ name: '' }));

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('Name is required');
  });

  it('should return 400 when name is too short', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ name: 'A' }));

    expect(res.status).toBe(400);
    expect(res.body.details).toContain('Name must be between 2 and 100 characters');
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ email: '' }));

    expect(res.status).toBe(400);
    expect(res.body.details).toContain('Email is required');
  });

  it('should return 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ email: 'not-an-email' }));

    expect(res.status).toBe(400);
    expect(res.body.details).toContain('Email must be a valid email address');
  });

  it('should return 400 when department is missing', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ department: '' }));

    expect(res.status).toBe(400);
    expect(res.body.details).toContain('Department is required');
  });

  it('should return 400 when designation is missing', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ designation: '' }));

    expect(res.status).toBe(400);
    expect(res.body.details).toContain('Designation is required');
  });

  it('should return 400 when status is invalid', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ status: 'unknown' }));

    expect(res.status).toBe(400);
    expect(res.body.details).toContain('Status must be either "active" or "inactive"');
  });

  it('should return 400 with multiple validation errors', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ name: '', email: '', department: '', designation: '' });

    expect(res.status).toBe(400);
    expect(res.body.details.length).toBeGreaterThanOrEqual(4);
  });

  it('should return 409 when email already exists', async () => {
    await request(app).post('/api/employees').send(validEmployee());

    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ name: 'Jane Doe' }));

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('email already exists');
  });

  it('should normalize email to lowercase', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee({ email: 'John.Doe@Example.COM' }));

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('john.doe@example.com');
  });
});

describe('GET /api/employees', () => {
  beforeEach(async () => {
    await request(app).post('/api/employees').send(validEmployee());
    await request(app).post('/api/employees').send(validEmployee({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      department: 'Marketing',
      designation: 'Marketing Manager',
      status: 'inactive',
    }));
    await request(app).post('/api/employees').send(validEmployee({
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      department: 'Engineering',
      designation: 'Senior Engineer',
      status: 'active',
    }));
  });

  it('should return all employees', async () => {
    const res = await request(app).get('/api/employees');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it('should filter employees by search (name)', async () => {
    const res = await request(app).get('/api/employees?search=Jane');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Jane Smith');
  });

  it('should filter employees by search case-insensitively', async () => {
    const res = await request(app).get('/api/employees?search=jane');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Jane Smith');
  });

  it('should filter employees by department', async () => {
    const res = await request(app).get('/api/employees?department=Engineering');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should filter employees by status', async () => {
    const res = await request(app).get('/api/employees?status=inactive');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Jane Smith');
  });

  it('should filter by multiple query params', async () => {
    const res = await request(app).get('/api/employees?department=Engineering&status=active');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should return empty array when no matches found', async () => {
    const res = await request(app).get('/api/employees?search=Nonexistent');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('GET /api/employees/:id', () => {
  it('should return a single employee by ID', async () => {
    const createRes = await request(app)
      .post('/api/employees')
      .send(validEmployee());

    const res = await request(app).get(`/api/employees/${createRes.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Doe');
    expect(res.body.id).toBe(createRes.body.id);
  });

  it('should return 404 for non-existent employee', async () => {
    const res = await request(app).get('/api/employees/9999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });
});

describe('PUT /api/employees/:id', () => {
  let employeeId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/employees')
      .send(validEmployee());
    employeeId = res.body.id;
  });

  it('should update an existing employee', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send(validEmployee({
        name: 'John Updated',
        designation: 'Senior Engineer',
      }));

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Updated');
    expect(res.body.designation).toBe('Senior Engineer');
  });

  it('should return 404 for non-existent employee', async () => {
    const res = await request(app)
      .put('/api/employees/9999')
      .send(validEmployee());

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });

  it('should return 409 when updating email to an existing one', async () => {
    await request(app)
      .post('/api/employees')
      .send(validEmployee({ email: 'existing@example.com' }));

    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send(validEmployee({ email: 'existing@example.com' }));

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('email already exists');
  });

  it('should allow updating an employee with the same email (no change)', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send(validEmployee({ name: 'Updated Name' }));

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should return 400 for invalid update data', async () => {
    const res = await request(app)
      .put(`/api/employees/${employeeId}`)
      .send({ name: '', email: '', department: '', designation: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('DELETE /api/employees/:id', () => {
  it('should delete an existing employee', async () => {
    const createRes = await request(app)
      .post('/api/employees')
      .send(validEmployee());

    const res = await request(app).delete(`/api/employees/${createRes.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Employee deleted successfully');

    // Verify deletion
    const getRes = await request(app).get(`/api/employees/${createRes.body.id}`);
    expect(getRes.status).toBe(404);
  });

  it('should return 404 for non-existent employee', async () => {
    const res = await request(app).delete('/api/employees/9999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Employee not found');
  });
});
