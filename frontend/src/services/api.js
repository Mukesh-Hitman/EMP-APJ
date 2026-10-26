const BASE_URL = 'http://localhost:5000/api';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong');
    error.details = data.details || [];
    throw error;
  }
  return data;
}

export async function getEmployees(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.department) query.set('department', params.department);
  if (params.status) query.set('status', params.status);
  const queryString = query.toString();
  const url = `${BASE_URL}/employees${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
}

export async function getEmployee(id) {
  const response = await fetch(`${BASE_URL}/employees/${id}`);
  return handleResponse(response);
}

export async function createEmployee(data) {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateEmployee(id, data) {
  const response = await fetch(`${BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteEmployee(id) {
  const response = await fetch(`${BASE_URL}/employees/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function getDashboard() {
  const response = await fetch(`${BASE_URL}/dashboard`);
  return handleResponse(response);
}
