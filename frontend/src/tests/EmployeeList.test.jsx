import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeList from '../components/EmployeeList';

const mockEmployees = [
  {
    _id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    department: 'Engineering',
    designation: 'Developer',
    status: 'Active',
  },
  {
    _id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    department: 'Marketing',
    designation: 'Manager',
    status: 'Inactive',
  },
];

describe('EmployeeList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders employee data in a table', () => {
    render(<EmployeeList employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('shows "No employees found" when list is empty', () => {
    render(<EmployeeList employees={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('No employees found')).toBeInTheDocument();
  });

  it('shows "No employees found" when employees is null', () => {
    render(<EmployeeList employees={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('No employees found')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    render(<EmployeeList employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('calls onDelete after confirmation when Delete button is clicked', () => {
    window.confirm.mockReturnValue(true);
    render(<EmployeeList employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('does not call onDelete when confirmation is cancelled', () => {
    window.confirm.mockReturnValue(false);
    mockOnDelete.mockClear();
    render(<EmployeeList employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('renders status badges correctly', () => {
    render(<EmployeeList employees={mockEmployees} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const activeBadge = screen.getByText('Active');
    const inactiveBadge = screen.getByText('Inactive');

    expect(activeBadge).toHaveClass('badge-active');
    expect(inactiveBadge).toHaveClass('badge-inactive');
  });
});
