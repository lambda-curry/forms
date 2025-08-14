import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput } from '@lambdacurry/forms/remix-hook-form/phone-input';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Define a schema for phone number validation
const formSchema = z.object({
  usaPhone: z.string().min(1, 'USA phone number is required'),
  internationalPhone: z.string().min(1, 'International phone number is required'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledPhoneInputExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usaPhone: '',
      internationalPhone: '',
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
        <div className="grid gap-8">
          <PhoneInput
            name="usaPhone"
            label="USA Phone Number"
            description="Enter a US phone number"
            defaultCountry="US"
            international={false}
          />
          <PhoneInput
            name="internationalPhone"
            label="International Phone Number"
            description="Enter an international phone number"
            international={true}
          />
        </div>
        <Button type="submit" className="mt-8">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { 
    message: `Form submitted successfully! USA: ${data.usaPhone}, International: ${data.internationalPhone}` 
  };
};

const meta: Meta<typeof PhoneInput> = {
  title: 'RemixHookForm/PhoneInput',
  component: PhoneInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledPhoneInputExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Phone input component with US and international number support.',
      },
      source: {
        code: `
const formSchema = z.object({
  usaPhone: z.string().min(1, 'USA phone number is required'),
  internationalPhone: z.string().min(1, 'International phone number is required'),
});

const ControlledPhoneInputExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usaPhone: '',
      internationalPhone: '',
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
        <div className="grid gap-8">
          <PhoneInput
            name="usaPhone"
            label="USA Phone Number"
            description="Enter a US phone number"
            defaultCountry="US"
            international={false}
          />
          <PhoneInput
            name="internationalPhone"
            label="International Phone Number"
            description="Enter an international phone number"
            international={true}
          />
        </div>
        <Button type="submit" className="mt-8">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};`,
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state', async () => {
      // Verify phone input fields are present
      const usaPhoneLabel = canvas.getByLabelText('USA Phone Number');
      const internationalPhoneLabel = canvas.getByLabelText('International Phone Number');
      
      expect(usaPhoneLabel).toBeInTheDocument();
      expect(internationalPhoneLabel).toBeInTheDocument();

      // Verify submit button is present
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
    });

    await step('Test validation errors on invalid submission', async () => {
      // Submit form without entering phone numbers
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify validation error messages appear
      await expect(canvas.findByText('USA phone number is required')).resolves.toBeInTheDocument();
      await expect(canvas.findByText('International phone number is required')).resolves.toBeInTheDocument();
    });

    await step('Test successful form submission with valid phone numbers', async () => {
      // Enter valid phone numbers
      const usaPhoneInput = canvas.getByLabelText('USA Phone Number');
      const internationalPhoneInput = canvas.getByLabelText('International Phone Number');

      // Enter a US phone number
      await userEvent.type(usaPhoneInput, '2025550123');
      
      // Enter an international phone number (UK format)
      await userEvent.type(internationalPhoneInput, '447911123456');

      // Submit form
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify success message
      await expect(canvas.findByText(/Form submitted successfully/)).resolves.toBeInTheDocument();
    });
  },
};

export const WithCustomStyling: Story = {
  render: () => {
    const fetcher = useFetcher<{ message: string }>();
    const methods = useRemixForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        usaPhone: '',
        internationalPhone: '',
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
          <div className="grid gap-8">
            <PhoneInput
              name="usaPhone"
              label="Custom Styled Phone Input"
              description="With custom styling applied"
              defaultCountry="US"
              className="border-2 border-blue-500 p-4 rounded-lg"
              inputClassName="bg-gray-100"
            />
          </div>
          <Button type="submit" className="mt-8">
            Submit
          </Button>
        </fetcher.Form>
      </RemixFormProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone input with custom styling applied.',
      },
    },
  },
};

export const WithDifferentDefaultCountries: Story = {
  render: () => {
    const fetcher = useFetcher<{ message: string }>();
    const methods = useRemixForm<{
      usPhone: string;
      ukPhone: string;
      canadaPhone: string;
      australiaPhone: string;
    }>({
      resolver: zodResolver(
        z.object({
          usPhone: z.string().optional(),
          ukPhone: z.string().optional(),
          canadaPhone: z.string().optional(),
          australiaPhone: z.string().optional(),
        })
      ),
      defaultValues: {
        usPhone: '',
        ukPhone: '',
        canadaPhone: '',
        australiaPhone: '',
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
          <div className="grid gap-8">
            <PhoneInput
              name="usPhone"
              label="US Phone Number"
              defaultCountry="US"
              international={true}
            />
            <PhoneInput
              name="ukPhone"
              label="UK Phone Number"
              defaultCountry="GB"
              international={true}
            />
            <PhoneInput
              name="canadaPhone"
              label="Canada Phone Number"
              defaultCountry="CA"
              international={true}
            />
            <PhoneInput
              name="australiaPhone"
              label="Australia Phone Number"
              defaultCountry="AU"
              international={true}
            />
          </div>
          <Button type="submit" className="mt-8">
            Submit
          </Button>
        </fetcher.Form>
      </RemixFormProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Phone inputs with different default countries.',
      },
    },
  },
};

