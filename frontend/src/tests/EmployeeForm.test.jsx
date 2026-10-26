import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeeForm from '../components/EmployeeForm';

describe('EmployeeForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('renders Add Employee form when no employee prop', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} employee={null} onCancel={mockOnCancel} />);

    expect(screen.getByText('Add Employee')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Designation')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('renders Update Employee form when employee prop is provided', () => {
    const employee = {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      designation: 'Developer',
      status: 'Active',
    };
    render(<EmployeeForm onSubmit={mockOnSubmit} employee={employee} onCancel={mockOnCancel} />);

    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} employee={null} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /add employee/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/department is required/i)).toBeInTheDocument();
      expect(screen.getByText(/designation is required/i)).toBeInTheDocument();
      expect(screen.getByText(/status is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} employee={null} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} employee={null} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Designation'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'Engineering' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Active' } });

    fireEvent.click(screen.getByRole('button', { name: /add employee/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email is required/i)).toBeInTheDocument();
    });
  });
});
