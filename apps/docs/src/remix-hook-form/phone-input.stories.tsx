import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput } from '@lambdacurry/forms/remix-hook-form/phone-input';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const successMessageRegex = /Form submitted successfully/;

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
          <PhoneInput name="usaPhone" label="Phone Number" description="Enter a US phone number" />
          <PhoneInput
            name="internationalPhone"
            label="International Phone Number"
            description="Enter an international phone number"
            isInternational={true}
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
    message: `Form submitted successfully! USA: ${data.usaPhone}, International: ${data.internationalPhone}`,
  };
};

const meta: Meta<typeof PhoneInput> = {
  title: 'RemixHookForm/PhoneInput',
  component: PhoneInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
            label="Phone Number"
            description="Enter a US phone number"
          />
          <PhoneInput
            name="internationalPhone"
            label="International Phone Number"
            description="Enter an international phone number"
            isInternational
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
      // Wait for inputs to be mounted and associated with their labels
      const usaPhoneLabel = await canvas.findByLabelText('Phone Number');
      const internationalPhoneLabel = await canvas.findByLabelText('International Phone Number');

      expect(usaPhoneLabel).toBeInTheDocument();
      expect(internationalPhoneLabel).toBeInTheDocument();

      // Wait for submit button to be present
      const submitButton = await canvas.findByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
    });

    await step('Test validation errors on invalid submission', async () => {
      // Submit form without entering phone numbers
      const submitButton = await canvas.findByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify validation error messages appear
      await expect(canvas.findByText('USA phone number is required')).resolves.toBeInTheDocument();
      await expect(canvas.findByText('International phone number is required')).resolves.toBeInTheDocument();
    });

    await step('Test successful form submission with valid phone numbers', async () => {
      // Enter valid phone numbers (await the inputs before typing)
      const usaPhoneInput = await canvas.findByLabelText('Phone Number');
      const internationalPhoneInput = await canvas.findByLabelText('International Phone Number');

      // Enter a US phone number (should format to (202) 555-0123)
      await userEvent.type(usaPhoneInput, '2025550123');

      // Enter an international phone number (UK example digits; component will normalize & format with + and spaces)
      await userEvent.type(internationalPhoneInput, '7911123456');

      // Submit form
      const submitButton = await canvas.findByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify success message (regex matches the prefix of the success text)
      await expect(canvas.findByText(successMessageRegex)).resolves.toBeInTheDocument();
    });
  },
};

export const WithCustomStyling: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
        },
      ],
    }),
  ],
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
              className="border-2 border-blue-500 p-4 rounded-lg"
              inputClassName="bg-gray-100"
            />
            <PhoneInput
              name="internationalPhone"
              label="Custom Styled Intl Phone Input"
              description="With custom styling applied"
              isInternational
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
        story: 'Phone input with custom styling applied for US and International modes.',
      },
    },
  },
};
