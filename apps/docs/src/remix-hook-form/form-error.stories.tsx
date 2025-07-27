import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RemixFormProvider, useRemixForm, getValidatedFormData } from 'remix-hook-form';
import { useFetcher, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { FormError, TextField } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui/button';
import { FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Form schema for testing
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;


// Basic Form Error Story
const BasicFormErrorExample = () => {
  const fetcher = useFetcher<{ 
    message?: string; 
    errors?: Record<string, { message: string }> 
  }>();
  
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    fetcher,
    submitConfig: {
      action: '/login',
      method: 'post',
    },
  });

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Login Form</h2>
        
        {/* Form-level error display */}
        <FormError className="mb-4" />
        
        <TextField
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
        
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
        
        {fetcher.data?.message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-medium">{fetcher.data.message}</p>
          </div>
        )}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Mixed Errors Story (Field + Form level)
const MixedErrorsExample = () => {
  const fetcher = useFetcher<{ 
    message?: string; 
    errors?: Record<string, { message: string }> 
  }>();
  
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    fetcher,
    submitConfig: {
      action: '/register',
      method: 'post',
    },
  });

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Registration Form</h2>
        
        {/* Form-level error at the top */}
        <FormError className="mb-4" />
        
        <TextField
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
        
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        {/* Form-level error at the bottom as well */}
        <FormError className="mt-4" />
        
        {fetcher.data?.message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-medium">{fetcher.data.message}</p>
          </div>
        )}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Custom Styling Story
const CustomStyledFormErrorExample = () => {
  const fetcher = useFetcher<{ 
    message?: string; 
    errors?: Record<string, { message: string }> 
  }>();
  
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    fetcher,
    submitConfig: {
      action: '/custom-login',
      method: 'post',
    },
  });

  // Custom error message component
  const CustomErrorMessage = (props: React.ComponentPropsWithoutRef<typeof FormMessage>) => (
    <div className="flex items-center p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <FormMessage className="text-red-800 font-medium" {...props} />
      </div>
    </div>
  );

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Custom Styled Form</h2>
        
        {/* Custom styled form error */}
        <FormError 
          className="mb-4"
          components={{
            FormMessage: CustomErrorMessage,
          }}
        />
        
        <TextField
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
        
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Placement Variations Story
const PlacementVariationsExample = () => {
  const fetcher = useFetcher<{ 
    message?: string; 
    errors?: Record<string, { message: string }> 
  }>();
  
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    fetcher,
    submitConfig: {
      action: '/placement-test',
      method: 'post',
    },
  });

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Error Placement Variations</h2>
        
        {/* Top placement */}
        <FormError className="p-3 bg-red-50 border border-red-200 rounded-lg" />
        
        <TextField
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
        
        {/* Inline placement between fields */}
        <FormError className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800" />
        
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Processing...' : 'Submit'}
        </Button>
        
        {/* Bottom placement */}
        <FormError className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 rounded-r" />
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Server action handlers for different scenarios
const handleBasicFormError = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  // Simulate server-side authentication failure
  if (data.email !== 'user@example.com' || data.password !== 'password123') {
    return {
      errors: {
        _form: { message: 'Invalid email or password. Please try again.' }
      }
    };
  }

  return { message: 'Login successful!' };
};

const handleMixedErrors = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  // Simulate email already exists + server error
  if (data.email === 'taken@example.com') {
    return {
      errors: {
        email: { message: 'This email address is already registered' },
        _form: { message: 'Registration failed. Please check your information and try again.' }
      }
    };
  }

  // Simulate network/server error
  if (data.password === 'servererror') {
    return {
      errors: {
        _form: { message: 'Server error occurred. Please try again later.' }
      }
    };
  }

  return { message: 'Account created successfully!' };
};

const handleCustomStyledError = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  // Always return a form-level error for demonstration
  return {
    errors: {
      _form: { message: 'Authentication service is temporarily unavailable. Please try again in a few minutes.' }
    }
  };
};

const handlePlacementTest = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  // Always return a form-level error to show placement variations
  return {
    errors: {
      _form: { message: 'This error appears in multiple locations to demonstrate placement flexibility.' }
    }
  };
};

const meta: Meta<typeof FormError> = {
  title: 'RemixHookForm/FormError',
  component: FormError,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The FormError component provides a standardized way to display form-level errors in your forms. 
It automatically looks for errors with the key "_form" by default, but can be configured to use any error key.

## Key Features

- **Automatic Error Detection**: Looks for \`errors._form.message\` by default
- **Flexible Placement**: Can be placed anywhere in your form
- **Component Override**: Supports custom styling via the \`components\` prop
- **Consistent API**: Follows the same patterns as other form components

## Usage Patterns

1. **Basic Usage**: \`<FormError />\` - Displays errors._form.message
2. **Custom Error Key**: \`<FormError name="general" />\` - Displays errors.general.message  
3. **Custom Styling**: Use the \`components\` prop to override FormMessage
4. **Multiple Placement**: Place multiple FormError components for different layouts

## Server Action Pattern

Return form-level errors from your server actions:

\`\`\`typescript
return {
  errors: {
    _form: { message: 'Server error occurred. Please try again.' }
  }
};
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The error key to look for in the form errors object',
      defaultValue: '_form',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling and positioning',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const BasicFormError: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: BasicFormErrorExample,
          action: async ({ request }: ActionFunctionArgs) => handleBasicFormError(request),
        },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Basic form error handling with server-side validation failure. 

**Try this:**
1. Click "Sign In" without filling fields (shows field-level errors)
2. Enter invalid credentials like \`wrong@email.com\` and \`badpass\` (shows form-level error)
3. Enter \`user@example.com\` and \`password123\` for success

The FormError component automatically displays when \`errors._form\` exists in the server response.
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    // This would be implemented with actual testing logic
    await step('Form renders with FormError component', async () => {
      // Test implementation would go here
    });
  },
};

export const MixedErrors: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: MixedErrorsExample,
          action: async ({ request }: ActionFunctionArgs) => handleMixedErrors(request),
        },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates handling both field-level and form-level errors simultaneously.

**Try this:**
1. Enter \`taken@example.com\` as email (shows both field and form errors)
2. Enter password \`servererror\` (shows only form-level error)
3. Notice FormError appears both at top and bottom of form

This pattern is useful when you want to show form-level context alongside specific field errors.
        `,
      },
    },
  },
};

export const CustomStyling: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomStyledFormErrorExample,
          action: async ({ request }: ActionFunctionArgs) => handleCustomStyledError(request),
        },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Custom styled FormError with branded error message component.

The \`components\` prop allows you to completely customize how form errors are displayed:

\`\`\`typescript
<FormError 
  components={{
    FormMessage: CustomErrorMessage,
  }}
/>
\`\`\`

This example shows an alert-style error message with an icon and custom styling.
        `,
      },
    },
  },
};

export const PlacementVariations: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: PlacementVariationsExample,
          action: async ({ request }: ActionFunctionArgs) => handlePlacementTest(request),
        },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
Shows different placement options for FormError components within a form.

**Placement Options:**
- **Top**: Above all form fields for immediate visibility
- **Inline**: Between form fields for contextual placement  
- **Bottom**: After form fields and submit button
- **Multiple**: Use several FormError components with different styling

Each FormError instance shows the same error but can be styled differently using the \`className\` prop.
        `,
      },
    },
  },
};

// Action handlers for Storybook (not exported to avoid being treated as a story)
const actionHandlers = {
  '/login': handleBasicFormError,
  '/register': handleMixedErrors,
  '/custom-login': handleCustomStyledError,
  '/placement-test': handlePlacementTest,
};
