'use client';

import { useMemo } from 'react';
import { DataTableFilter } from '../components/data-table-filter';
import { useFilteredData } from '../../utils/use-filtered-data';

// Example data interface
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

// Mock initial data
const initialUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2023-01-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2023-01-15' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'editor', status: 'inactive', createdAt: '2023-02-01' },
];

export function SimplifiedExample() {
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

  // Use our custom hook to handle everything
  const {
    filters,
    columns,
    actions,
    data,
    isLoading,
  } = useFilteredData<User>({
    endpoint: '/api/users',
    columnsConfig,
    initialData: initialUsers,
    queryOptions: {
      // In a real app, you'd set this to true
      // For demo purposes, we'll disable actual API calls
      enabled: false,
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Users (Simplified Example)</h2>
      
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
              {data.map(user => (
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

