import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock URL.createObjectURL for export functionality
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'mocked-url')
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn()
});