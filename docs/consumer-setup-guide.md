# Consumer Setup Guide

This guide covers how to integrate `@lambdacurry/forms` with React Router v7 applications using remix-hook-form.

## React Router v7 Vite Configuration

When using `@lambdacurry/forms` with `remix-hook-form` in a React Router v7 application, you must configure Vite to bundle these packages together. Without this configuration, forms that render conditionally (e.g., triggered by a button click) will fail with:

```
Error: useHref() may be used only in the context of a <Router> component.
```

### Why This Happens

`remix-hook-form`'s `useRemixForm` hook internally calls `useHref("/")`. When Vite's SSR bundling doesn't properly handle `remix-hook-form` and `react-hook-form`, these packages load with a separate instance of `react-router` that doesn't share the router context with your application.

This causes `useHref()` to fail because the hook is looking for router context in the wrong React tree.

### Required Vite Configuration

Add these settings to your application's `vite.config.ts`:

```typescript
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
  ssr: {
    // CRITICAL: Bundle these packages with the app to share react-router context
    noExternal: ['react-hook-form', 'remix-hook-form', '@lambdacurry/forms']
  },
  optimizeDeps: {
    // Pre-bundle dependencies to avoid runtime context issues
    include: ['react', 'react-dom', 'react-router', 'react-hook-form', 'remix-hook-form'],
    // Ensure single instances of these packages
    dedupe: ['react', 'react-dom', 'react-router', 'react-hook-form', 'remix-hook-form']
  }
});
```

### Configuration Breakdown

| Setting | Purpose |
|---------|---------|
| `ssr.noExternal` | Forces Vite to bundle `remix-hook-form`, `react-hook-form`, and `@lambdacurry/forms` with the application instead of treating them as external dependencies. This ensures they share the same `react-router` instance. |
| `optimizeDeps.include` | Pre-bundles these packages during dev, avoiding lazy loading that can cause context issues. |
| `optimizeDeps.dedupe` | Ensures only one copy of each package exists, preventing multiple React or react-router instances. |

## Recommended Form Pattern

Here's the recommended pattern for using `@lambdacurry/forms` with `remix-hook-form`:

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, HiddenField, Textarea } from '@lambdacurry/forms';
import { useEffect } from 'react';
import { useFetcher, useRevalidator } from 'react-router';
import { createFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

const schema = z.object({
  text: z.string().min(1, 'Required'),
  author: z.string().default('User'),
});

type FormData = z.infer<typeof schema>;

function MyForm({ onSuccess }: { onSuccess: () => void }) {
  const fetcher = useFetcher<{ success?: boolean; errors?: Record<string, { message: string }> }>();
  const revalidator = useRevalidator();

  const methods = useRemixForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: '', author: 'User' },
    fetcher,
    submitHandlers: {
      onValid: (data) => {
        // IMPORTANT: Use createFormData() to properly serialize
        fetcher.submit(createFormData(data), {
          method: 'post',
          action: '/api/endpoint',
        });
      },
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.success) {
      revalidator.revalidate();
      methods.reset();
      onSuccess();
    }
  }, [fetcher.state, fetcher.data, revalidator, onSuccess, methods]);

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit}>
        <Textarea name="text" placeholder="Enter text..." rows={4} autoFocus />
        <HiddenField name="author" />
        <FormError className="mt-2" />
        <button type="submit" disabled={fetcher.state !== 'idle'}>
          {fetcher.state !== 'idle' ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </RemixFormProvider>
  );
}
```

### Key Points

1. **Use `createFormData()`** - When using `submitHandlers.onValid`, always use `createFormData()` from `remix-hook-form` to properly serialize form data.

2. **Use `useFetcher`** - For forms that don't navigate, use `useFetcher` instead of the standard form submission.

3. **Handle revalidation** - Call `revalidator.revalidate()` after successful submission to refresh data.

4. **Reset form state** - Call `methods.reset()` after successful submission to clear the form.

## Troubleshooting

### "useHref() may be used only in the context of a `<Router>` component"

**Cause**: Vite is treating `remix-hook-form` or `react-hook-form` as external dependencies, causing them to load with a separate `react-router` instance.

**Solution**: Add the `ssr.noExternal` and `optimizeDeps` configuration shown above.

### Form works on initial render but fails when opened dynamically

**Cause**: Same as above - the packages are being loaded lazily with a different router context.

**Solution**: Ensure all three packages (`react-hook-form`, `remix-hook-form`, `@lambdacurry/forms`) are listed in `ssr.noExternal`.

### Multiple React instances warning

**Cause**: Dependencies are being duplicated in the bundle.

**Solution**: Add `optimizeDeps.dedupe` with React and related packages.

## Related Documentation

- [Form Component Patterns](../packages/components/src/remix-hook-form/README.md)
- [FormError Component Guide](./form-error-guide.md)
- [remix-hook-form Documentation](https://github.com/Code-Forge-Net/remix-hook-form)
