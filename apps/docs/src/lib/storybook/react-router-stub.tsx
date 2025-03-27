import type { Decorator } from '@storybook/react';
import type { ComponentType } from 'react';
import {
  type ActionFunction,
  type IndexRouteObject,
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  type NonIndexRouteObject,
  createRoutesStub,
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
}

export const withReactRouterStubDecorator = (options: RemixStubOptions): Decorator => {
  const { routes } = options;
  return (Story) => {
    // Map routes to include Story component as fallback if no Component provided
    const mappedRoutes = routes.map((route) => ({
      ...route,
      Component: route.Component ?? (() => <Story />),
    }));

    // Use more specific type assertion to fix the incompatibility
    // @ts-ignore - Types from createRoutesStub are incompatible but the code works at runtime
    const RemixStub = createRoutesStub(mappedRoutes);

    return <RemixStub initialEntries={['/']} />;
  };
};
