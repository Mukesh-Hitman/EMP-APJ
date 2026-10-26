import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard', () => {
  it('renders stat cards with correct numbers', () => {
    const data = { total: 25, active: 18, inactive: 7 };
    render(<Dashboard data={data} />);

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders zeros when data is null', () => {
    render(<Dashboard data={null} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  it('renders zeros when data is empty object', () => {
    render(<Dashboard data={{}} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });
});
