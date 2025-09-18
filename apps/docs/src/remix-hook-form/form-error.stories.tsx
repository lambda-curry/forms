import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, TextField } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

const SimpleFormErrorExample = () => {
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
        <h2 className="text-xl font-semibold text-gray-900">Login</h2>

        <FormError />

        <TextField name="email" type="email" label="Email" placeholder="Enter your email" disabled={isSubmitting} />

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
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return {
    errors: {
      _form: { message: 'Invalid credentials. Please try again.' },
    },
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
The FormError component provides standardized form-level error handling for server failures, authentication issues, and other form-wide errors.

**Key Features:**
- Automatic integration with remix-hook-form context
- Uses \`_form\` as the default error key
- Flexible placement anywhere in forms
- Component override support for custom styling

**More Examples:**
- [Basic Usage](?path=/docs/remixhookform-formerror-basic--docs) - Simple form error handling
- [Mixed Errors](?path=/docs/remixhookform-formerror-mixed--docs) - Field and form errors together
- [Custom Styling](?path=/docs/remixhookform-formerror-custom--docs) - Custom error components
- [Placement Options](?path=/docs/remixhookform-formerror-placement--docs) - Different positioning styles
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
          Component: SimpleFormErrorExample,
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
Basic FormError component usage. The component automatically displays when \`errors._form\` exists in the server response.

For more comprehensive examples, see the related stories:
- **Basic**: Simple form error handling patterns
- **Mixed**: Field and form errors together  
- **Custom**: Custom styling and component overrides
- **Placement**: Different positioning and styling options
        `,
      },
    },
  },
};
