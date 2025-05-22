
import React, { ReactNode } from 'react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock components that might be used in tests
export const mockToaster = vi.fn(() => null);
export const mockSonner = vi.fn(() => null);
export const mockTooltipProvider = vi.fn(() => null);

// Mock context providers
export const mockCardProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// Mock asset files for TransactionItem tests
export const fileStorageIcon = "test-file-path.svg";
export const megaphoneIcon = "test-megaphone-path.svg";
export const nextArrow = "test-next-arrow.svg";

// Test wrapper for components that need QueryClientProvider
export const createQueryClientWrapper = () => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return function QueryClientWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

// Add more mocks as needed
