import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { type Location, MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { useDataTableUrlState } from './use-data-table-url-state';

describe('useDataTableUrlState', () => {
  it('should parse initial state from URL', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/?search=initial&page=2&pageSize=20']}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useDataTableUrlState(), { wrapper });

    expect(result.current.urlState.search).toBe('initial');
    expect(result.current.urlState.page).toBe(2);
    expect(result.current.urlState.pageSize).toBe(20);
  });

  it('should update URL state', () => {
    let testLocation: Location | undefined;

    const LocationSpy = () => {
      testLocation = useLocation();
      return null;
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/']}>
        <LocationSpy />
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useDataTableUrlState(), { wrapper });

    act(() => {
      result.current.setUrlState({ search: 'updated' });
    });

    expect(result.current.urlState.search).toBe('updated');
    expect(testLocation?.search).toContain('search=updated');
  });
});
