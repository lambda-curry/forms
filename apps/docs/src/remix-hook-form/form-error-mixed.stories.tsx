import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, TextField } from '@lambdacurry/forms';
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

const MixedErrorsExample = () => {
  const fetcher = useFetcher<{
    message?: string;
    errors?: Record<string, { message: string }>;
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
        <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>

        {/* Form-level error at top */}
        <FormError className="p-3 bg-red-50 border border-red-200 rounded-lg" />

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

        {/* Form-level error at bottom */}
        <FormError className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 rounded-r" />

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

  // Simulate mixed errors - both field and form level
  if (data.email === 'taken@example.com') {
    return {
      errors: {
        email: { message: 'This email address is already registered' },
        _form: { message: 'Registration failed. Please correct the errors above.' },
      },
    };
  }

  // Simulate server error only
  if (data.password === 'servererror') {
    return {
      errors: {
        _form: { message: 'Server error occurred. Please try again later.' },
      },
    };
  }

  if (data.email === 'valid@example.com' && data.password === 'validpass123') {
    return { message: 'Account created successfully! Welcome aboard.' };
  }

  return {
    errors: {
      _form: { message: 'Registration failed. Please try again.' },
    },
  };
};

const meta: Meta<typeof FormError> = {
  title: 'RemixHookForm/FormError/Mixed',
  component: FormError,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Demonstrates handling both field-level and form-level errors simultaneously. This pattern is useful when you want to show form-level context alongside specific field errors.

**Multiple FormError Components:**
- You can place multiple FormError components in different locations
- Each instance will show the same form-level error
- Different styling can be applied to each instance
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
          Component: MixedErrorsExample,
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
Shows both field-level and form-level errors working together.

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

    await step('Verify initial state with multiple FormError placements', () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /create account/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(canvas.queryByText(/registration failed/i)).not.toBeInTheDocument();
    });

    await step('Test mixed errors - field and form level together', async () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'taken@example.com');
      await userEvent.type(passwordInput, 'validpass123');

      const submitButton = canvas.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Wait for errors to appear
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check for field-level error
      const fieldError = canvas.queryByText(/this email address is already registered/i);
      expect(fieldError).toBeInTheDocument();

      // Check for form-level errors - use queryAllByText to avoid "multiple elements" error
      const formErrors = canvas.queryAllByText(/registration failed/i);
      expect(formErrors.length).toBeGreaterThanOrEqual(1);
      expect(formErrors.length).toBeLessThanOrEqual(2);
    });
  },
};
