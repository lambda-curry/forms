import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, it, expect } from 'vitest';
import { useDataTableUrlState } from './use-data-table-url-state';
import React from 'react';

describe('useDataTableUrlState', () => {
  it('should parse initial state from URL', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={['/?search=initial&page=2&pageSize=20']}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useDataTableUrlState(), { wrapper });

    expect(result.current.urlState.search).toBe('initial');
    expect(result.current.urlState.page).toBe(2);
    expect(result.current.urlState.pageSize).toBe(20);
  });

  it('should update URL state', () => {
    let testLocation: any;

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
    expect(testLocation.search).toContain('search=updated');
  });
});
