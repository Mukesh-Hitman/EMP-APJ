import '@testing-library/jest-dom';

// Mock window.confirm
vi.stubGlobal('confirm', vi.fn(() => true));
