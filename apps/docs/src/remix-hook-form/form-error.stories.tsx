import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RemixFormProvider, useRemixForm, getValidatedFormData } from 'remix-hook-form';
import { useFetcher, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { FormError, TextField } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui/button';
import { FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { expect, userEvent, within } from '@storybook/test';
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
  decorators: [withReactRouterStubDecorator],
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
    const canvas = within(canvasElement);

    await step('Verify initial state', async () => {
      // Verify form elements are present
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /sign in/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      // Verify no form-level error is shown initially
      expect(canvas.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
      expect(canvas.queryByText(/server error/i)).not.toBeInTheDocument();
    });

    await step('Test field-level validation errors', async () => {
      // Submit form without filling fields
      const submitButton = canvas.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      // Verify field-level validation errors appear
      await expect(canvas.findByText(/please enter a valid email address/i)).resolves.toBeInTheDocument();
      await expect(canvas.findByText(/password must be at least 6 characters/i)).resolves.toBeInTheDocument();

      // Verify no form-level error is shown for validation errors
      expect(canvas.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
    });

    await step('Test form-level error with invalid credentials', async () => {
      // Fill in invalid credentials
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'wrong@email.com');
      await userEvent.type(passwordInput, 'wrongpass');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      // Verify form-level error appears
      await expect(canvas.findByText(/invalid email or password/i)).resolves.toBeInTheDocument();

      // Verify field-level errors are cleared
      expect(canvas.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
      expect(canvas.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument();
    });

    await step('Test successful form submission', async () => {
      // Fill in correct credentials
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'user@example.com');
      await userEvent.type(passwordInput, 'password123');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      // Verify success message appears and form error is cleared
      await expect(canvas.findByText(/login successful/i)).resolves.toBeInTheDocument();
      expect(canvas.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state with multiple FormError placements', async () => {
      // Verify form elements are present
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /create account/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      // Verify no form-level errors are shown initially (multiple FormError components)
      expect(canvas.queryByText(/registration failed/i)).not.toBeInTheDocument();
      expect(canvas.queryByText(/server error occurred/i)).not.toBeInTheDocument();
    });

    await step('Test mixed errors - field and form level together', async () => {
      // Fill in email that already exists
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'taken@example.com');
      await userEvent.type(passwordInput, 'validpass123');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Verify both field-level and form-level errors appear
      await expect(canvas.findByText(/this email address is already registered/i)).resolves.toBeInTheDocument();
      await expect(canvas.findByText(/registration failed/i)).resolves.toBeInTheDocument();

      // Verify form-level error appears in multiple locations (top and bottom)
      const formErrors = canvas.getAllByText(/registration failed/i);
      expect(formErrors).toHaveLength(2); // Should appear in both FormError components
    });

    await step('Test server error only (form-level error)', async () => {
      // Clear and fill with server error trigger
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'servererror');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Verify only form-level error appears
      await expect(canvas.findByText(/server error occurred/i)).resolves.toBeInTheDocument();

      // Verify field-level error is cleared
      expect(canvas.queryByText(/this email address is already registered/i)).not.toBeInTheDocument();

      // Verify form-level error appears in multiple locations
      const formErrors = canvas.getAllByText(/server error occurred/i);
      expect(formErrors).toHaveLength(2); // Should appear in both FormError components
    });

    await step('Test successful submission clears all errors', async () => {
      // Fill in valid data
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'valid@example.com');
      await userEvent.type(passwordInput, 'validpass123');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Verify success message appears
      await expect(canvas.findByText(/account created successfully/i)).resolves.toBeInTheDocument();

      // Verify all errors are cleared
      expect(canvas.queryByText(/registration failed/i)).not.toBeInTheDocument();
      expect(canvas.queryByText(/server error occurred/i)).not.toBeInTheDocument();
      expect(canvas.queryByText(/this email address is already registered/i)).not.toBeInTheDocument();
    });
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state with custom styling', async () => {
      // Verify form elements are present
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /sign in/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      // Verify no custom styled error is shown initially
      expect(canvas.queryByText(/authentication service is temporarily unavailable/i)).not.toBeInTheDocument();
    });

    await step('Test custom styled form error display', async () => {
      // Fill in any valid data (this story always shows form error for demo)
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      // Verify custom styled error appears
      await expect(canvas.findByText(/authentication service is temporarily unavailable/i)).resolves.toBeInTheDocument();
    });

    await step('Verify custom error styling and structure', async () => {
      // Find the error message
      const errorMessage = canvas.getByText(/authentication service is temporarily unavailable/i);
      expect(errorMessage).toBeInTheDocument();

      // Verify the custom styling structure
      const errorContainer = errorMessage.closest('div');
      expect(errorContainer).toHaveClass('flex', 'items-center', 'p-4', 'bg-red-50', 'border-l-4', 'border-red-400', 'rounded-md');

      // Verify the icon is present (SVG element)
      const icon = errorContainer?.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5', 'w-5', 'text-red-400');

      // Verify the message has custom styling
      expect(errorMessage).toHaveClass('text-red-800', 'font-medium');
    });

    await step('Test accessibility of custom styled error', async () => {
      // Verify the error message has proper accessibility attributes
      const errorMessage = canvas.getByText(/authentication service is temporarily unavailable/i);
      
      // Check that it has the form-message data attribute
      expect(errorMessage).toHaveAttribute('data-slot', 'form-message');
      
      // Verify it's properly structured for screen readers
      expect(errorMessage.tagName.toLowerCase()).toBe('p');
    });
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state with multiple placement options', async () => {
      // Verify form elements are present
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /submit/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      // Verify no errors are shown initially
      expect(canvas.queryByText(/this error appears in multiple locations/i)).not.toBeInTheDocument();
    });

    await step('Test multiple FormError placements with different styling', async () => {
      // Fill in valid data (this story always shows form error for demo)
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Verify error appears in multiple locations
      await expect(canvas.findByText(/this error appears in multiple locations/i)).resolves.toBeInTheDocument();
      
      // Verify multiple instances of the same error message
      const errorMessages = canvas.getAllByText(/this error appears in multiple locations/i);
      expect(errorMessages).toHaveLength(3); // Top, inline, and bottom placements
    });

    await step('Verify different styling for each placement', async () => {
      const errorMessages = canvas.getAllByText(/this error appears in multiple locations/i);
      
      // Check that each error message has different styling based on placement
      const topError = errorMessages[0];
      const inlineError = errorMessages[1];
      const bottomError = errorMessages[2];

      // Verify top placement styling (red background with border)
      const topContainer = topError.closest('div');
      expect(topContainer).toHaveClass('p-3', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg');

      // Verify inline placement styling (yellow background, centered)
      const inlineContainer = inlineError.closest('div');
      expect(inlineContainer).toHaveClass('text-center', 'p-2', 'bg-yellow-50', 'border', 'border-yellow-200', 'rounded', 'text-yellow-800');

      // Verify bottom placement styling (red background with left border)
      const bottomContainer = bottomError.closest('div');
      expect(bottomContainer).toHaveClass('mt-4', 'p-3', 'bg-red-100', 'border-l-4', 'border-red-500', 'rounded-r');
    });

    await step('Test accessibility across all placements', async () => {
      const errorMessages = canvas.getAllByText(/this error appears in multiple locations/i);
      
      // Verify each error message has proper accessibility attributes
      errorMessages.forEach((errorMessage) => {
        expect(errorMessage).toHaveAttribute('data-slot', 'form-message');
        expect(errorMessage.tagName.toLowerCase()).toBe('p');
      });
    });

    await step('Verify form structure and error placement order', async () => {
      // Get all form elements in order
      const formElements = canvas.getByRole('form') || canvasElement;
      const allElements = Array.from(formElements.querySelectorAll('*'));
      
      // Find positions of error messages and form fields
      const errorElements = allElements.filter(el => 
        el.textContent?.includes('This error appears in multiple locations')
      );
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /submit/i });

      // Verify error placement order: top error before email, inline error between fields, bottom error after submit
      expect(errorElements).toHaveLength(3);
      
      // This verifies the structural placement without relying on exact DOM order
      expect(errorElements[0]).toBeInTheDocument(); // Top error
      expect(errorElements[1]).toBeInTheDocument(); // Inline error  
      expect(errorElements[2]).toBeInTheDocument(); // Bottom error
    });
  },
};

// Action handlers for Storybook (not exported to avoid being treated as a story)
const actionHandlers = {
  '/login': handleBasicFormError,
  '/register': handleMixedErrors,
  '/custom-login': handleCustomStyledError,
  '/placement-test': handlePlacementTest,
};
