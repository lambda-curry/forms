import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@lambdacurry/forms/ui/button';
import { useAutofillControlledInput } from '@lambdacurry/forms/ui/hooks/use-autofill-controlled-input';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@lambdacurry/forms/ui/form';
import { TextInput } from '@lambdacurry/forms/ui/text-input';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useController, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

type FormData = z.infer<typeof formSchema>;

// Custom TextField that uses the useAutofillControlledInput hook
const ControlledTextField = ({ 
  name, 
  label, 
  description, 
  type = 'text',
  autoComplete,
}: { 
  name: keyof FormData; 
  label: string;
  description?: string;
  type?: string;
  autoComplete?: string;
}) => {
  const controller = useController({ name });
  const { isAutofilled, fieldProps } = useAutofillControlledInput(controller);

  return (
    <div className="relative">
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <TextInput 
            {...fieldProps} 
            type={type}
            autoComplete={autoComplete}
            className={isAutofilled ? 'border-green-500 bg-green-50' : ''}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        {controller.fieldState.error && (
          <FormMessage>{controller.fieldState.error.message}</FormMessage>
        )}
      </FormItem>
      {isAutofilled && (
        <div className="absolute right-0 top-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
          Autofilled
        </div>
      )}
    </div>
  );
};

const AutofillControlledInputsExample = () => {
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

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Autofill Detection with Controlled Inputs</h2>
          <p className="text-sm text-gray-500 mb-6">
            This form demonstrates autofill detection using controlled inputs with useController.
            Try using your browser's autofill feature to populate these fields and watch for the "Autofilled" indicator.
          </p>

          <div className="space-y-4">
            <ControlledTextField 
              name="name" 
              label="Full Name" 
              autoComplete="name"
            />

            <ControlledTextField 
              name="email" 
              label="Email Address" 
              type="email"
              autoComplete="email"
            />

            <ControlledTextField 
              name="phone" 
              label="Phone Number" 
              type="tel"
              autoComplete="tel"
            />

            <ControlledTextField 
              name="address" 
              label="Street Address" 
              autoComplete="street-address"
            />

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

const meta: Meta = {
  title: 'RemixHookForm/AutofillControlledInputs',
  parameters: { 
    layout: 'centered',
    docs: {
      description: {
        component: 'Demonstrates autofill detection using controlled inputs with useController.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ControlledInputsExample: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: AutofillControlledInputsExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};

