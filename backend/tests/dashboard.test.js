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

describe('GET /api/dashboard', () => {
  it('should return zero counts when no employees exist', async () => {
    const res = await request(app).get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 0, active: 0, inactive: 0 });
  });

  it('should return correct counts with active employees only', async () => {
    await request(app).post('/api/employees').send(validEmployee());
    await request(app).post('/api/employees').send(validEmployee({
      name: 'Jane Doe',
      email: 'jane@example.com',
    }));

    const res = await request(app).get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 2, active: 2, inactive: 0 });
  });

  it('should return correct counts with inactive employees only', async () => {
    await request(app).post('/api/employees').send(validEmployee({ status: 'inactive' }));
    await request(app).post('/api/employees').send(validEmployee({
      name: 'Jane Doe',
      email: 'jane@example.com',
      status: 'inactive',
    }));

    const res = await request(app).get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 2, active: 0, inactive: 2 });
  });

  it('should return correct counts with mixed statuses', async () => {
    await request(app).post('/api/employees').send(validEmployee());
    await request(app).post('/api/employees').send(validEmployee({
      name: 'Jane Doe',
      email: 'jane@example.com',
      status: 'inactive',
    }));
    await request(app).post('/api/employees').send(validEmployee({
      name: 'Bob Smith',
      email: 'bob@example.com',
      status: 'active',
    }));

    const res = await request(app).get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 3, active: 2, inactive: 1 });
  });

  it('should update counts after deleting an employee', async () => {
    const createRes = await request(app).post('/api/employees').send(validEmployee());
    await request(app).post('/api/employees').send(validEmployee({
      name: 'Jane Doe',
      email: 'jane@example.com',
    }));

    // Delete one employee
    await request(app).delete(`/api/employees/${createRes.body.id}`);

    const res = await request(app).get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 1, active: 1, inactive: 0 });
  });

  it('should update counts after changing employee status', async () => {
    const createRes = await request(app).post('/api/employees').send(validEmployee());

    // Update status to inactive
    await request(app)
      .put(`/api/employees/${createRes.body.id}`)
      .send(validEmployee({ status: 'inactive' }));

    const res = await request(app).get('/api/dashboard');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 1, active: 0, inactive: 1 });
  });
});
