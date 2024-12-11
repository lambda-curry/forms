import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import type { Decorator } from '@storybook/react';
import type { ComponentType, ReactNode } from 'react';
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

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
  /**
   * Root configuration for providers and shared data
   */
  root?: {
    // biome-ignore lint/suspicious/noExplicitAny: allow any here
    Component?: ComponentType<any>;
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
      // Ensure root has a default action that returns null if none provided
      Component: root?.Component
        ? root.Component
        : ({ children }: { children: ReactNode }) => <div style={{ margin: '3em' }}>{children}</div>,
      // Make all other routes children of root
      children:
        routes.length > 0
          ? routes.map((route) => ({
              action: () => null,
              ...route,
            }))
          : undefined,
    };

    console.log('>>>>', rootRoute.children);

    const RemixStub = createRemixStub([rootRoute]);

    // You can also provide hydrationData if needed
    return <RemixStub initialEntries={['/']} />;
  };
};
