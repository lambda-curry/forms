import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, TextField } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { getValidatedFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

const BasicFormErrorExample = () => {
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

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  // Simulate server-side authentication
  if (data.email === 'wrong@email.com' && data.password === 'wrongpass') {
    return {
      errors: {
        _form: { message: 'Invalid email or password. Please try again.' },
      },
    };
  }

  if (data.email === 'user@example.com' && data.password === 'password123') {
    return { message: 'Login successful! Welcome back.' };
  }

  return {
    errors: {
      _form: { message: 'Invalid email or password. Please try again.' },
    },
  };
};

const meta: Meta<typeof FormError> = {
  title: 'RemixHookForm/FormError/Basic',
  component: FormError,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The FormError component provides standardized form-level error handling for server failures, authentication issues, and other form-wide errors.

**Key Features:**
- Automatic integration with remix-hook-form context
- Uses \`_form\` as the default error key
- Flexible placement anywhere in forms
- Component override support for custom styling
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
          Component: BasicFormErrorExample,
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
Basic form error handling with server-side validation failure. 

**Try this:**
1. Click "Sign In" without filling fields (shows field-level errors)
2. Enter invalid credentials like \`wrong@email.com\` and \`wrongpass\` (shows form-level error)
3. Enter \`user@example.com\` and \`password123\` for success

The FormError component automatically displays when \`errors._form\` exists in the server response.
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state', async () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /sign in/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(canvas.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
    });

    await step('Test field-level validation errors', async () => {
      const submitButton = canvas.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      await expect(canvas.findByText(/please enter a valid email address/i)).resolves.toBeInTheDocument();
      await expect(canvas.findByText(/password must be at least 6 characters/i)).resolves.toBeInTheDocument();
      expect(canvas.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
    });

    await step('Test form-level error with invalid credentials', async () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.clear(emailInput);
      await userEvent.clear(passwordInput);
      await userEvent.type(emailInput, 'wrong@email.com');
      await userEvent.type(passwordInput, 'wrongpass');

      const submitButton = canvas.getByRole('button', { name: /sign in/i });
      await userEvent.click(submitButton);

      // Wait for form-level error to appear
      await expect(canvas.findByText(/invalid email or password/i)).resolves.toBeInTheDocument();

      // Verify field-level errors are cleared
      expect(canvas.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    });
  },
};
