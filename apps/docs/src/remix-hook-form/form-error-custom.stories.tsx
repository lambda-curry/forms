import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, TextField } from '@lambdacurry/forms';
import { FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

// Custom error message component with icon
const AlertErrorMessage = (props: React.ComponentProps<typeof FormMessage>) => (
  <div className="flex items-center p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
    <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <FormMessage className="text-red-800 font-medium" {...props} />
  </div>
);

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
      action: '/',
      method: 'post',
    },
  });

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
        
        {/* Custom styled form error */}
        <FormError 
          components={{
            FormMessage: AlertErrorMessage,
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
        
        {fetcher.data?.message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-medium">{fetcher.data.message}</p>
          </div>
        )}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));
  
  if (errors) {
    return { errors };
  }
  
  // Always show form error for demo purposes
  return {
    errors: {
      _form: { message: 'Authentication service is temporarily unavailable. Please try again in a few minutes.' }
    }
  };
};

const meta: Meta<typeof FormError> = {
  title: 'RemixHookForm/FormError/Custom',
  component: FormError,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Custom styled FormError with branded error message component. The \`components\` prop allows you to completely customize how form errors are displayed.

**Component Override:**
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
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomStyledFormErrorExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof FormError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Custom styled FormError with branded error message component.

**Features:**
- Alert-style error message with warning icon
- Custom background colors and borders
- Enhanced typography and spacing
- Maintains accessibility attributes

The custom component receives all the same props as the default FormMessage component.
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state with custom styling', async () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /sign in/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(canvas.queryByText(/authentication service is temporarily unavailable/i)).not.toBeInTheDocument();
    });

    await step('Test custom styled form error display', async () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      const submitButton = canvas.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      // Wait for error to appear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check for error message
      const errorMessage = canvas.queryByText(/authentication service is temporarily unavailable/i);
      expect(errorMessage).toBeInTheDocument();
    });

    await step('Verify custom error styling and structure', async () => {
      // Wait for error message to be available
      await new Promise(resolve => setTimeout(resolve, 500));
      const errorMessage = canvas.queryByText(/authentication service is temporarily unavailable/i);
      expect(errorMessage).toBeInTheDocument();

      const errorContainer = errorMessage?.closest('div');
      expect(errorContainer).toHaveClass('flex', 'items-center', 'p-4', 'bg-red-50', 'border-l-4', 'border-red-400', 'rounded-md');

      const icon = errorContainer?.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5', 'w-5', 'text-red-400');

      expect(errorMessage).toHaveClass('text-destructive', 'font-medium');
    });
  },
};
