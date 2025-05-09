'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { DataTableFilter } from '../components/data-table-filter';
import { createColumns } from '../core/filters';
import type { Column, FiltersState } from '../core/types';
import { useFilterSync } from '../../utils/use-filter-sync';

// Example data interface
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

// Mock API function to fetch data with filters
async function fetchUsers(filters: FiltersState): Promise<{
  data: User[];
  facetedCounts: Record<string, Record<string, number>>;
}> {
  // In a real app, this would be an API call with the filters
  // For demo purposes, we'll simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // This would normally come from your API
  return {
    data: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2023-01-01' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2023-01-15' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'editor', status: 'inactive', createdAt: '2023-02-01' },
      // Add more mock data as needed
    ],
    facetedCounts: {
      role: { admin: 1, user: 1, editor: 1 },
      status: { active: 2, inactive: 1, pending: 0 },
    }
  };
}

export function DataTableFilterExample() {
  // Use the filter sync hook to sync filters with URL query params
  const [filters, setFilters] = useFilterSync();
  
  // Fetch data with the current filters
  const { data, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: (previousData) => previousData,
  });

  // Define column configurations
  const columnsConfig = useMemo(() => [
    {
      id: 'role',
      type: 'option' as const,
      displayName: 'Role',
      accessor: (user: User) => user.role,
      icon: () => null,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'editor', label: 'Editor' },
      ],
    },
    {
      id: 'status',
      type: 'option' as const,
      displayName: 'Status',
      accessor: (user: User) => user.status,
      icon: () => null,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
    },
  ], []);

  // Create columns with faceted counts from the API
  const columns = useMemo(() => {
    if (!data) return [] as Column<User>[];
    
    // Apply faceted counts from the API to the columns
    const enhancedConfig = columnsConfig.map(config => {
      if (config.type === 'option' && data.facetedCounts[config.id]) {
        return {
          ...config,
          facetedOptions: new Map(
            Object.entries(data.facetedCounts[config.id]).map(([key, count]) => [key, count])
          )
        };
      }
      return config;
    });
    
    return createColumns(data.data || [], enhancedConfig, 'client');
  }, [data, columnsConfig]);

  // Create filter actions
  const actions = useMemo(() => {
    return {
      addFilterValue: (column, values) => {
        setFilters(prev => {
          const filter = prev.find(f => f.columnId === column.id);
          if (!filter) {
            return [...prev, {
              columnId: column.id,
              type: column.type,
              operator: column.type === 'option' ? 'is any of' : 'contains',
              values
            }];
          }
          return prev.map(f => 
            f.columnId === column.id 
              ? { ...f, values: [...new Set([...f.values, ...values])] }
              : f
          );
        });
      },
      removeFilterValue: (column, values) => {
        setFilters(prev => {
          const filter = prev.find(f => f.columnId === column.id);
          if (!filter) return prev;
          
          const newValues = filter.values.filter(v => !values.includes(v));
          if (newValues.length === 0) {
            return prev.filter(f => f.columnId !== column.id);
          }
          
          return prev.map(f => 
            f.columnId === column.id 
              ? { ...f, values: newValues }
              : f
          );
        });
      },
      setFilterValue: (column, values) => {
        setFilters(prev => {
          const exists = prev.some(f => f.columnId === column.id);
          if (!exists) {
            return [...prev, {
              columnId: column.id,
              type: column.type,
              operator: column.type === 'option' ? 'is any of' : 'contains',
              values
            }];
          }
          return prev.map(f => 
            f.columnId === column.id 
              ? { ...f, values }
              : f
          );
        });
      },
      setFilterOperator: (columnId, operator) => {
        setFilters(prev => 
          prev.map(f => 
            f.columnId === columnId 
              ? { ...f, operator }
              : f
          )
        );
      },
      removeFilter: (columnId) => {
        setFilters(prev => prev.filter(f => f.columnId !== columnId));
      },
      removeAllFilters: () => {
        setFilters([]);
      }
    };
  }, [setFilters]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Users</h2>
      
      {/* Data Table Filter Component */}
      <DataTableFilter
        columns={columns}
        filters={filters}
        actions={actions}
        strategy="client"
      />
      
      {/* Display the filtered data */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Display current filter state for debugging */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Current Filter State:</h3>
        <pre className="text-xs overflow-auto">{JSON.stringify(filters, null, 2)}</pre>
      </div>
    </div>
  );
}

