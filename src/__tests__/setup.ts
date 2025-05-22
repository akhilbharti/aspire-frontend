
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Make Vitest's expect use jest-dom's matchers
expect.extend(matchers);

// Expose Vitest's globals for tests
globalThis.expect = expect;
globalThis.afterEach = afterEach;
globalThis.vi = vi;
globalThis.beforeEach = vi.fn();
globalThis.describe = vi.fn();
globalThis.it = vi.fn();
globalThis.test = vi.fn();

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock modules that might be problematic in tests
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock asset imports for TransactionItem tests
vi.mock('@/assets', () => ({
  fileStorageIcon: 'test-file-path.svg',
  megaphoneIcon: 'test-megaphone-path.svg',
  nextArrow: 'test-next-arrow.svg',
  userIcon: 'test-user-icon.svg',
  flightsIcon: 'test-flights-icon.svg',
}));

// Override ts paths for tests
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => null
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    toasts: [],
    dismiss: vi.fn()
  })
}));

// Make sure any @tanstack/react-query hooks have defaults
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn().mockImplementation(() => ({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    })),
  };
});
