import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import type { Decorator } from '@storybook/react';
import type { ComponentType } from 'react';
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

export type StubRouteObject = StubIndexRouteObject | StubNonIndexRouteObject;

interface StubNonIndexRouteObject
  extends Omit<NonIndexRouteObject, 'loader' | 'action' | 'element' | 'errorElement' | 'children'> {
  loader?: LoaderFunction;
  action?: ActionFunction;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
  Component?: ComponentType<any>;
}

interface StubIndexRouteObject
  extends Omit<IndexRouteObject, 'loader' | 'action' | 'element' | 'errorElement' | 'children'> {
  loader?: LoaderFunction;
  action?: ActionFunction;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
  Component?: ComponentType<any>;
}

interface RemixStubOptions {
  /**
   * Root configuration for providers and shared data
   */
  root?: {
    Component?: ComponentType<{ children: React.ReactNode }>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    meta?: MetaFunction;
    links?: LinksFunction;
  };
  /**
   * Individual route configurations
   */
  routes?: StubRouteObject[];
}

export const withRemixStubDecorator = (options: RemixStubOptions = {}): Decorator => {
  return (Story: ComponentType) => {
    const { root, routes = [] } = options;

    // Default root configuration that wraps everything
    const rootRoute: StubRouteObject = {
      id: 'root',
      path: '/',
      ...root,
      Component: root?.Component
        ? (root.Component as ComponentType<any>)
        : ({ children }: { children: React.ReactNode }) => <div style={{ margin: '3em' }}>{children}</div>,
      // Make all other routes children of root
      children:
        routes.length > 0
          ? routes.map((route) => ({
              ...route,
              Component: route.Component ?? Story,
            }))
          : [
              {
                path: '*',
                Component: Story,
              },
            ],
    };

    const RemixStub = createRemixStub([rootRoute]);

    return <RemixStub initialEntries={['/']} />;
  };
};
