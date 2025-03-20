import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction, createRemixStub } from './remix-mock';
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
  root?: {
    // biome-ignore lint/suspicious/noExplicitAny: allow any here
    Component?: ComponentType<any>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    meta?: MetaFunction;
    links?: LinksFunction;
  };
  routes?: StubRouteObject[];
}

export const withRemixStubDecorator = (options: RemixStubOptions = {}): Decorator => {
  return (Story) => {
    const { root, routes = [] } = options;

    // Map routes to include Story component as fallback if no Component provided
    const mappedRoutes = routes.map((route) => ({
      ...route,
      Component: route.Component ? route.Component : () => <Story />,
    }));
    const rootRoute: StubRouteObject = {
      id: 'root',
      path: '/',
      ...root,
      Component: root?.Component ? root.Component : () => <Story />,
      children:
        mappedRoutes.length > 0
          ? mappedRoutes.map((route) => ({
              action: () => null,
              ...route,
            }))
          : undefined,
    };

    const RemixStub = createRemixStub([rootRoute]);

    // You can also provide hydrationData if needed
    return <RemixStub initialEntries={['/']} />;
  };
};
