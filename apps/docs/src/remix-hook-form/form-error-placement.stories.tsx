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
      action: '/',
      method: 'post',
    },
  });

  const isSubmitting = fetcher.state === 'submitting';

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Payment Form</h2>
        
        {/* Top placement - Alert style */}
        <FormError className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800" />
        
        <TextField
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
        
        {/* Inline placement - Minimal style */}
        <FormError className="text-red-600 text-sm font-medium" />
        
        <TextField
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Processing...' : 'Submit Payment'}
        </Button>
        
        {/* Bottom placement - Banner style */}
        <FormError className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-md" />
        
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
      _form: { message: 'Payment processing failed. Please check your information and try again.' }
    }
  };
};

const meta: Meta<typeof FormError> = {
  title: 'RemixHookForm/FormError/Placement',
  component: FormError,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Demonstrates different FormError placement options and styling approaches. You can place FormError components anywhere in your form and style them differently for various use cases.

**Placement Options:**
- **Top**: Alert-style with full background and border
- **Inline**: Minimal text-only style between fields  
- **Bottom**: Banner-style with left border accent

Each placement can have different styling while showing the same error message.
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
          Component: PlacementVariationsExample,
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
Shows FormError components in different positions with unique styling.

**Placement Styles:**
1. **Top**: Alert box with background and border
2. **Inline**: Simple text between form fields
3. **Bottom**: Banner with left accent border

All three instances show the same error message but with different visual treatments.
        `,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state with multiple placement options', async () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);
      const submitButton = canvas.getByRole('button', { name: /submit payment/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(canvas.queryByText(/payment processing failed/i)).not.toBeInTheDocument();
    });

    await step('Test multiple FormError placements with different styling', async () => {
      const emailInput = canvas.getByLabelText(/email address/i);
      const passwordInput = canvas.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      const submitButton = canvas.getByRole('button', { name: /submit payment/i });
      await userEvent.click(submitButton);

      await expect(canvas.findByText(/payment processing failed/i)).resolves.toBeInTheDocument();

      // Verify all three FormError instances are displayed
      const errorMessages = canvas.getAllByText(/payment processing failed/i);
      expect(errorMessages).toHaveLength(3);
    });

    await step('Verify different styling for each placement', async () => {
      const errorMessages = canvas.getAllByText(/payment processing failed/i);
      
      // Top placement - alert style
      const topError = errorMessages[0];
      expect(topError).toHaveClass('text-red-800');
      expect(topError.closest('div')).toHaveClass('p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg');

      // Inline placement - minimal style  
      const inlineError = errorMessages[1];
      expect(inlineError).toHaveClass('text-red-600', 'text-sm', 'font-medium');

      // Bottom placement - banner style
      const bottomError = errorMessages[2];
      expect(bottomError).toHaveClass('text-red-700');
      expect(bottomError.closest('div')).toHaveClass('mt-4', 'p-3', 'bg-red-100', 'border-l-4', 'border-red-500', 'rounded-r-md');
    });
  },
};

