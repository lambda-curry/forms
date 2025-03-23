# Storybook Mocks

This directory contains mock implementations for React Router components and types that were previously imported from @remix-run packages.

## remix-mock.tsx

This file provides mock implementations for:

1. Types that were previously from @remix-run/node:
   - ActionFunction
   - ActionFunctionArgs
   - LoaderFunction
   - LinksFunction
   - MetaFunction

2. Components that were previously from @remix-run/react:
   - Form
   - useFetcher

3. Utilities that were previously from @remix-run/testing:
   - createRemixStub

## remix-stub.tsx

This file provides a decorator for Storybook stories that need to use the React Router components and types.

## Migration from Remix to React Router

As part of the migration from Remix to React Router v7, we've replaced all @remix-run imports with our own mock implementations that use React Router components under the hood. This approach allows us to:

1. Remove all @remix-run dependencies from the docs app
2. Fix build errors when running `yarn build-storybook`
3. Maintain compatibility with existing code that uses Remix components and types
4. Simplify the codebase by using a single routing library