import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { Button } from '@lambdacurry/forms/ui/button';
import { useAutofillFormState } from '@lambdacurry/forms/ui/hooks/use-autofill-form-state';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

type FormData = z.infer<typeof formSchema>;

const AutofillFormStateExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  // Use the autofill detection hook for each field
  const nameAutofill = useAutofillFormState(methods, 'name');
  const emailAutofill = useAutofillFormState(methods, 'email');
  const phoneAutofill = useAutofillFormState(methods, 'phone');
  const addressAutofill = useAutofillFormState(methods, 'address');

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Autofill Detection with Form State Monitoring</h2>
          <p className="text-sm text-gray-500 mb-6">
            This form demonstrates autofill detection by monitoring form state changes.
            Try using your browser's autofill feature to populate these fields and watch for the "Autofilled" indicator.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <TextField 
                name="name" 
                label="Full Name" 
                autoComplete="name"
              />
              {nameAutofill.isAutofilled && (
                <div className="absolute right-0 top-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Autofilled
                </div>
              )}
            </div>

            <div className="relative">
              <TextField 
                name="email" 
                label="Email Address" 
                type="email"
                autoComplete="email"
              />
              {emailAutofill.isAutofilled && (
                <div className="absolute right-0 top-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Autofilled
                </div>
              )}
            </div>

            <div className="relative">
              <TextField 
                name="phone" 
                label="Phone Number" 
                type="tel"
                autoComplete="tel"
              />
              {phoneAutofill.isAutofilled && (
                <div className="absolute right-0 top-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Autofilled
                </div>
              )}
            </div>

            <div className="relative">
              <TextField 
                name="address" 
                label="Street Address" 
                autoComplete="street-address"
              />
              {addressAutofill.isAutofilled && (
                <div className="absolute right-0 top-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Autofilled
                </div>
              )}
            </div>

            <Button type="submit" className="w-full mt-6">
              Submit
            </Button>
            
            {fetcher.data?.message && (
              <p className="mt-2 text-green-600">{fetcher.data.message}</p>
            )}
          </div>
        </div>
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof TextField> = {
  title: 'RemixHookForm/AutofillFormState',
  component: TextField,
  parameters: { 
    layout: 'centered',
    docs: {
      description: {
        component: 'Demonstrates autofill detection by monitoring form state changes.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FormStateExample: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: AutofillFormStateExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};

