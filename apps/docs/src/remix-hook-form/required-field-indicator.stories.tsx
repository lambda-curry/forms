import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().min(1, 'Zip code is required'),
});

type FormData = z.infer<typeof formSchema>;

const RequiredFieldIndicatorExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
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
          <h2 className="text-xl font-bold mb-4">Required Field Indicator Example</h2>
          <p className="text-sm text-gray-500 mb-6">
            This form demonstrates the required field indicator (asterisk) for required fields.
            Notice that only Name, Email, and Zip Code have the asterisk indicator.
          </p>

          <div className="space-y-4">
            <TextField 
              name="name" 
              label="Full Name" 
              autoComplete="name"
            />

            <TextField 
              name="email" 
              label="Email Address" 
              type="email"
              autoComplete="email"
            />

            <TextField 
              name="phone" 
              label="Phone Number (Optional)" 
              type="tel"
              autoComplete="tel"
            />

            <TextField 
              name="address" 
              label="Street Address (Optional)" 
              autoComplete="street-address"
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField 
                name="city" 
                label="City (Optional)" 
                autoComplete="address-level2"
              />

              <TextField 
                name="state" 
                label="State (Optional)" 
                autoComplete="address-level1"
              />
            </div>

            <TextField 
              name="zipCode" 
              label="Zip Code" 
              autoComplete="postal-code"
            />

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Disable Required Indicator</h3>
              <p className="text-sm text-gray-500">
                You can disable the required indicator by setting showRequiredIndicator to false:
              </p>
              
              <TextField 
                name="name" 
                label="Name (No Indicator)" 
                components={{
                  FormLabel: (props) => props.Component?.({ ...props, showRequiredIndicator: false })
                }}
              />
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
  title: 'RemixHookForm/RequiredFieldIndicator',
  component: TextField,
  parameters: { 
    layout: 'centered',
    docs: {
      description: {
        component: 'Demonstrates the required field indicator (asterisk) for required fields.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RequiredFieldExample: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: RequiredFieldIndicatorExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};

