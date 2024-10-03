import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { createRemixStub } from '@remix-run/testing';
import type { Decorator } from '@storybook/react';
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

export type StubRouteObject = StubIndexRouteObject | StubNonIndexRouteObject;

interface StubNonIndexRouteObject
  extends Omit<NonIndexRouteObject, 'loader' | 'action' | 'element' | 'errorElement' | 'children'> {
  loader?: LoaderFunction;
  action?: ActionFunction;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
}

interface StubIndexRouteObject
  extends Omit<IndexRouteObject, 'loader' | 'action' | 'element' | 'errorElement' | 'children'> {
  loader?: LoaderFunction;
  action?: ActionFunction;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
}

export const withRemixStubDecorator = (routes: StubRouteObject[] = []): Decorator => {
  return (Story: React.ComponentType) => {
    const defaultRoute: StubRouteObject = {
      path: '/*',
      action: () => ({ redirect: '/' }),
      loader: () => ({ redirect: '/' }),
      Component: () => (
        <div style={{ margin: '3em' }}>
          <Story />
        </div>
      ),
    };

    const mappedRoutes = routes.map((route) => ({
      ...route,
      Component: route.Component ? route.Component : () => <Story />,
    }));

    const RemixStub = routes.length > 0 ? createRemixStub(mappedRoutes) : createRemixStub([defaultRoute]);

    return <RemixStub initialEntries={['/']} />;
  };
};
