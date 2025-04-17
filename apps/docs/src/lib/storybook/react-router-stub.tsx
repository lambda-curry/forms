import type { Decorator } from '@storybook/react';
import type { ComponentType } from 'react';
import {
  type ActionFunction,
  type IndexRouteObject,
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  type NonIndexRouteObject,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';

export type StubRouteObject = StubIndexRouteObject | StubNonIndexRouteObject;

interface StubNonIndexRouteObject
  extends Omit<NonIndexRouteObject, 'loader' | 'action' | 'element' | 'errorElement' | 'children'> {
  loader?: LoaderFunction;
  action?: ActionFunction;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
  // biome-ignore lint/suspicious/noExplicitAny: allow any here
  Component?: ComponentType<any>;
}

interface StubIndexRouteObject
  extends Omit<IndexRouteObject, 'loader' | 'action' | 'element' | 'errorElement' | 'children'> {
  loader?: LoaderFunction;
  action?: ActionFunction;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
  // biome-ignore lint/suspicious/noExplicitAny: allow any here
  Component?: ComponentType<any>;
}

interface RemixStubOptions {
  routes: StubRouteObject[];
  initialPath?: string;
}

export const withReactRouterStubDecorator = (options: RemixStubOptions): Decorator => {
  const { routes, initialPath = '/' } = options;
  // This outer function runs once when Storybook loads the story meta

  return (Story, context) => {
    // This inner function runs when the story component actually renders
    const mappedRoutes = routes.map((route) => ({
      ...route,
      Component: route.Component ?? (() => <Story {...context.args} />),
    }));

    // Get the base path (without existing query params from options)
    const basePath = initialPath.split('?')[0];
    
    // Get the current search string from the actual browser window, if available
    // If not available, use a default search string with parameters needed for the data table
    const currentWindowSearch = typeof window !== 'undefined' 
      ? window.location.search 
      : '?page=0&pageSize=10';
    
    // Combine them for the initial entry
    const actualInitialPath = `${basePath}${currentWindowSearch}`;

    // Create a memory router, initializing it with the path derived from the window's search params
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const router = createMemoryRouter(mappedRoutes as any, {
      initialEntries: [actualInitialPath], // Use the path combined with window.location.search
    });

    return <RouterProvider router={router} />;
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
