# Remix Stub Decorator for Storybook

The Remix Stub Decorator provides a mock Remix environment for testing and previewing components in Storybook that depend on Remix's routing and data loading features.

## Basic Usage

The simplest way to use the decorator is to wrap your story with the default configuration:

```typescript
import { withRemixStubDecorator } from './remix-stub';

export default {
  title: 'Components/MyComponent',
  component: MyComponent,
  decorators: [withRemixStubDecorator()]
};

export const Default = {
  render: () => <MyComponent />
};
```

## Root Configuration

The decorator now supports root-level configuration for providers and shared data:

```typescript
export const WithRootConfig = {
  decorators: [
    withRemixStubDecorator({
      root: {
        // Root-level loader for global data
        loader: () => ({
          user: { name: 'John Doe' },
          theme: 'dark'
        }),
        // Root layout with providers
        Component: ({ children }) => (
          <ThemeProvider>
            <UserProvider>
              <Layout>{children}</Layout>
            </UserProvider>
          </ThemeProvider>
        ),
        // Root-level meta tags
        meta: () => [{
          title: 'My App',
          description: 'App description'
        }]
      }
    })
  ]
};
```

## Route Configuration

Configure routes alongside root configuration:

```typescript
export const WithRoutes = {
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ({ children }) => (
          <AppShell>{children}</AppShell>
        )
      },
      routes: [
        {
          path: '/dashboard',
          loader: () => ({
            stats: { users: 100, posts: 50 }
          }),
          Component: DashboardComponent
        }
      ]
    })
  ]
};
```

## Advanced Examples

### 1. Nested Routes with Root Provider

```typescript
export const NestedRoutesWithProvider = {
  decorators: [
    withRemixStubDecorator({
      root: {
        loader: () => ({
          user: { id: 1, name: 'John' }
        }),
        Component: ({ children }) => (
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        )
      },
      routes: [
        {
          path: '/app',
          Component: AppLayout,
          children: [
            {
              path: 'dashboard',
              loader: () => ({ dashboardData: [] }),
              Component: Dashboard
            }
          ]
        }
      ]
    })
  ]
};
```

### 2. Form Actions with Error Handling

```typescript
export const FormWithErrorHandling = {
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ({ children }) => (
          <ErrorBoundary fallback={GlobalErrorUI}>
            {children}
          </ErrorBoundary>
        )
      },
      routes: [
        {
          path: '/form',
          action: async ({ request }) => {
            const formData = await request.formData();
            if (!formData.get('email')) {
              throw new Error('Email required');
            }
            return { success: true };
          },
          Component: FormComponent
        }
      ]
    })
  ]
};
```

## TypeScript Interfaces

```typescript
interface RemixStubOptions {
  root?: {
    Component?: ComponentType<{ children: React.ReactNode }>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    meta?: MetaFunction;
    links?: LinksFunction;
  };
  routes?: StubRouteObject[];
}

interface StubRouteObject {
  path?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  Component?: ComponentType;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
}
```

## Best Practices

1. **Root Configuration**
   - Use root for global providers (auth, theme, etc.)
   - Share common data through root loader
   - Handle global errors at root level

2. **Route Organization**
   - Keep route structure similar to production
   - Use nested routes for complex layouts
   - Isolate test-specific logic in route components

3. **Data Management**
   - Mock minimal but realistic data
   - Use TypeScript for data shape validation
   - Share common data through root loader

4. **Error Handling**
   - Implement error boundaries at appropriate levels
   - Test both success and error scenarios
   - Use root error boundary for global error UI

## Testing Tips

1. Use root configuration for:
   - Global providers
   - Authentication state
   - Theme management
   - Error boundaries
   - Common layouts

2. Test scenarios:
   - Authentication flows
   - Form submissions
   - Error handling
   - Route transitions
   - Data loading states

3. Combine with Storybook features:
   - Controls for provider props
   - Actions for form handling
   - Viewport for responsive testing
   - Accessibility checks