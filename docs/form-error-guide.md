# FormError Component Guide

The `FormError` component provides a standardized way to display form-level errors in your forms. It automatically integrates with the remix-hook-form context and follows the same patterns as other form components in the library.

## Overview

Form-level errors are different from field-level errors. While field-level errors are specific to individual form inputs (like "Email is required"), form-level errors represent general issues that affect the entire form (like "Server error occurred" or "Authentication failed").

## Basic Usage

```typescript
import { FormError } from '@lambdacurry/forms';

// Basic usage - looks for errors._form by default
<FormError />

// Custom error key
<FormError name="general" />

// With custom styling
<FormError className="mb-4 p-3 bg-red-50 border border-red-200 rounded" />
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `"_form"` | The error key to look for in the form errors object |
| `className` | `string` | `undefined` | Additional CSS classes for styling and positioning |
| `components` | `object` | `{}` | Custom component overrides (FormMessage) |

### Component Override

```typescript
interface FormErrorProps {
  name?: string;
  className?: string;
  components?: {
    FormMessage?: React.ComponentType<FormMessageProps>;
  };
}
```

## Server Action Pattern

To use FormError effectively, your server actions should return form-level errors using the standard error key:

```typescript
export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, errors } = await getValidatedFormData<FormData>(
    request, 
    zodResolver(formSchema)
  );

  // Return field-level validation errors
  if (errors) {
    return { errors };
  }

  // Business logic validation
  try {
    await processForm(data);
    return { message: 'Success!' };
  } catch (error) {
    // Return form-level error
    return {
      errors: {
        _form: { message: 'Unable to process form. Please try again.' }
      }
    };
  }
};
```

## Error Hierarchy

Understanding when to use form-level vs field-level errors:

### Field-Level Errors
- **Validation errors**: "Email is required", "Password too short"
- **Format errors**: "Invalid email format", "Phone number must be 10 digits"
- **Field-specific business rules**: "Username already taken"

### Form-Level Errors
- **Server errors**: "Server temporarily unavailable"
- **Authentication failures**: "Invalid credentials"
- **Network issues**: "Connection timeout"
- **General business logic**: "Account suspended"
- **Rate limiting**: "Too many attempts, try again later"

## Usage Patterns

### 1. Basic Form Error

```typescript
const LoginForm = () => {
  const fetcher = useFetcher<{ 
    message?: string; 
    errors?: Record<string, { message: string }> 
  }>();
  
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    fetcher,
    submitConfig: { action: '/login', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        {/* Form-level error at the top */}
        <FormError className="mb-4" />
        
        <TextField name="email" label="Email" />
        <TextField name="password" label="Password" />
        
        <Button type="submit">Sign In</Button>
      </fetcher.Form>
    </RemixFormProvider>
  );
};
```

### 2. Mixed Errors (Field + Form Level)

```typescript
const RegistrationForm = () => {
  // ... form setup

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <FormError className="mb-4" />
        
        <TextField name="email" label="Email" />
        <TextField name="password" label="Password" />
        <TextField name="confirmPassword" label="Confirm Password" />
        
        <Button type="submit">Create Account</Button>
        
        {/* Optional: Show form error at bottom too */}
        <FormError className="mt-4" />
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Server action handling both error types
export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) return { errors };

  // Check if email already exists (field-specific error)
  if (await emailExists(data.email)) {
    return {
      errors: {
        email: { message: 'This email is already registered' }
      }
    };
  }

  // Server/network error (form-level error)
  try {
    await createAccount(data);
    return { message: 'Account created successfully!' };
  } catch (error) {
    return {
      errors: {
        _form: { message: 'Failed to create account. Please try again.' }
      }
    };
  }
};
```

### 3. Custom Styling

```typescript
const CustomStyledForm = () => {
  // Custom error message component
  const AlertErrorMessage = (props: React.ComponentPropsWithoutRef<typeof FormMessage>) => (
    <div className="flex items-center p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
      <div className="flex-shrink-0">
        <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3">
        <FormMessage className="text-red-800 font-medium" {...props} />
      </div>
    </div>
  );

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <FormError 
          className="mb-6"
          components={{
            FormMessage: AlertErrorMessage,
          }}
        />
        
        {/* Form fields */}
      </fetcher.Form>
    </RemixFormProvider>
  );
};
```

### 4. Multiple Placement Options

```typescript
const FlexibleErrorPlacement = () => {
  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        {/* Top placement - most visible */}
        <FormError className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" />
        
        <TextField name="email" label="Email" />
        
        {/* Inline placement - contextual */}
        <FormError className="my-2 text-center text-sm text-red-600" />
        
        <TextField name="password" label="Password" />
        
        <Button type="submit">Submit</Button>
        
        {/* Bottom placement - summary */}
        <FormError className="mt-4 p-3 bg-red-100 border-l-4 border-red-500" />
      </fetcher.Form>
    </RemixFormProvider>
  );
};
```

### 5. Custom Error Keys

```typescript
const MultiErrorForm = () => {
  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        {/* General form errors */}
        <FormError name="_form" className="mb-4" />
        
        {/* Payment-specific errors */}
        <FormError name="payment" className="mb-4 text-orange-600" />
        
        {/* Shipping-specific errors */}
        <FormError name="shipping" className="mb-4 text-blue-600" />
        
        {/* Form fields */}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Server action with multiple error types
export const action = async ({ request }: ActionFunctionArgs) => {
  // ... validation

  try {
    await processPayment(data.payment);
  } catch (error) {
    return {
      errors: {
        payment: { message: 'Payment processing failed. Please check your card details.' }
      }
    };
  }

  try {
    await calculateShipping(data.address);
  } catch (error) {
    return {
      errors: {
        shipping: { message: 'Shipping not available to this address.' }
      }
    };
  }

  // General server error
  try {
    await submitOrder(data);
    return { message: 'Order submitted successfully!' };
  } catch (error) {
    return {
      errors: {
        _form: { message: 'Unable to submit order. Please try again.' }
      }
    };
  }
};
```

## Best Practices

### 1. Error Key Conventions

- Use `_form` for general form-level errors
- Use descriptive keys for specific error categories (`payment`, `shipping`, `auth`)
- Be consistent across your application

### 2. Error Message Guidelines

- **Be specific**: "Server temporarily unavailable" vs "Error occurred"
- **Be actionable**: "Please try again in a few minutes" vs "Failed"
- **Be user-friendly**: Avoid technical jargon and error codes
- **Be consistent**: Use similar tone and format across your app

### 3. Placement Strategy

- **Top placement**: For critical errors that should be seen immediately
- **Inline placement**: For contextual errors related to specific sections
- **Bottom placement**: For summary or less critical errors
- **Multiple placement**: Use sparingly, only when it improves UX

### 4. Styling Consistency

```typescript
// Create reusable error styles
const errorStyles = {
  critical: "p-4 bg-red-50 border-l-4 border-red-400 rounded-md",
  warning: "p-3 bg-yellow-50 border border-yellow-200 rounded",
  info: "p-2 bg-blue-50 text-blue-700 rounded",
};

<FormError className={errorStyles.critical} />
```

### 5. Accessibility Considerations

- FormError automatically includes proper ARIA attributes
- Error messages are announced to screen readers
- Use sufficient color contrast for error styling
- Don't rely solely on color to convey error state

## Migration from Manual Error Handling

If you're currently handling form-level errors manually, here's how to migrate:

### Before (Manual)
```typescript
{fetcher.data?.errors?._form && (
  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
    <p className="text-red-700 font-medium">{fetcher.data.errors._form.message}</p>
  </div>
)}
```

### After (FormError)
```typescript
<FormError className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md" />
```

### Benefits of Migration

1. **Consistency**: Same API as other form components
2. **Automatic integration**: Works with form context automatically
3. **Customization**: Component override system
4. **Accessibility**: Built-in ARIA attributes
5. **Type safety**: TypeScript support
6. **Less boilerplate**: No manual error checking

## Troubleshooting

### FormError not displaying

1. **Check error key**: Ensure your server action returns `errors._form` (or your custom key)
2. **Verify form context**: FormError must be inside `<RemixFormProvider>`
3. **Check fetcher data**: Use React DevTools to inspect `fetcher.data.errors`

### Custom styling not applying

1. **CSS specificity**: Your custom classes might be overridden
2. **Component override**: Use the `components` prop for complex styling
3. **Conditional classes**: Use libraries like `clsx` for dynamic styling

### Multiple errors showing

1. **Error key conflicts**: Ensure different FormError components use different `name` props
2. **Server response format**: Check that your server returns the expected error structure

## Examples Repository

For complete working examples, see the Storybook stories:

- `BasicFormError`: Simple server validation failure
- `MixedErrors`: Field + form-level errors together
- `CustomStyling`: Branded error components
- `PlacementVariations`: Different positioning options

## Related Components

- [`FormMessage`](./form-message.md): For field-level error messages
- [`TextField`](./text-field.md): Text input with built-in error handling
- [`Checkbox`](./checkbox.md): Checkbox with error support
- [`RadioGroup`](./radio-group.md): Radio buttons with error handling
