
import { performance } from 'perf_hooks';
import { dataTableRouterParsers } from '../src/remix-hook-form/data-table-router-parsers';

const ITERATIONS = 10000;

// Create a complex filter state serialized to JSON
const complexFilters = [
  { columnId: 'name', type: 'text', operator: 'contains', values: ['John'] },
  { columnId: 'age', type: 'number', operator: 'between', values: [20, 30] },
  { columnId: 'status', type: 'select', operator: 'isAnyOf', values: ['active', 'pending'] },
  { columnId: 'role', type: 'text', operator: 'equals', values: ['admin'] },
  { columnId: 'department', type: 'text', operator: 'contains', values: ['engineering'] },
];

const serializedFilters = JSON.stringify(complexFilters);

function runBenchmark() {
  console.log('Running benchmark...');
  const start = performance.now();

  for (let i = 0; i < ITERATIONS; i++) {
    // Simulate the parsing operation that happens in the hook
    dataTableRouterParsers.filters.parse(serializedFilters);
  }

  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / ITERATIONS;

  console.log(`Total time for ${ITERATIONS} iterations: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per parse: ${avgTime.toFixed(4)}ms`);
}

runBenchmark();
