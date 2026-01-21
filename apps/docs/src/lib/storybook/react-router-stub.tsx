import { useMemo } from 'react';
import type { Decorator } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import {
  type ActionFunction,
  createRoutesStub,
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
} from 'react-router';

export interface StubRouteObject {
  path?: string;
  index?: boolean;
  loader?: LoaderFunction;
  action?: ActionFunction;
  meta?: MetaFunction;
  links?: LinksFunction;
  // biome-ignore lint/suspicious/noExplicitAny: allow any here for Storybook compatibility
  Component?: ComponentType<any>;
  children?: StubRouteObject[];
  // biome-ignore lint/suspicious/noExplicitAny: allow any here for Storybook compatibility
  errorElement?: any;
}

interface RemixStubOptions {
  routes: StubRouteObject[];
  initialPath?: string;
}

export const withReactRouterStubDecorator = (options: RemixStubOptions): Decorator => {
  const { routes, initialPath = '/' } = options;

  // We define the Stub component outside the return function to ensure it's not recreated
  // on every render of the Story component itself.
  const CachedStub: ComponentType<{ initialEntries?: string[] }> | null = null;
  const lastMappedRoutes: StubRouteObject[] | null = null;

  return (Story, context) => {
    // Map routes to include the Story component if no Component is provided
    const mappedRoutes = useMemo(
      () =>
        routes.map((route) => ({
          ...route,
          Component: route.Component ?? Story,
        })),
      [Story],
    );

    // Get the base path (without existing query params from options)
    const basePath = useMemo(() => initialPath.split('?')[0], []);

    // Get the current search string from the actual browser window, if available
    // If not available, use a default search string with parameters needed for the data table
    const currentWindowSearch = typeof window !== 'undefined' ? window.location.search : '?page=0&pageSize=10';

    // Combine them for the initial entry
    const actualInitialPath = useMemo(() => `${basePath}${currentWindowSearch}`, [basePath, currentWindowSearch]);

    // Use React Router's official createRoutesStub
    // We memoize the Stub component to prevent unnecessary remounts of the entire story
    // when the decorator re-renders.
    const Stub = useMemo(() => createRoutesStub(mappedRoutes), [mappedRoutes]);

    const initialEntries = useMemo(() => [actualInitialPath], [actualInitialPath]);

    return <Stub initialEntries={initialEntries} />;
  };
};

/**
 * A decorator that provides URL state management for stories
 * Use this when you need URL query parameters in your stories
 */
export const withURLState = (initialPath = '/'): Decorator => {
  return withReactRouterStubDecorator({
    routes: [{ path: '/' }],
    initialPath,
  });
};
