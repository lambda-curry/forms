import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  marketing: z.boolean().optional(),
  required: z.boolean().refine((val) => val === true, 'This field is required'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledCheckboxExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false as true, // Note: ZOD Schema expects a true value
      marketing: false,
      required: false as true, //Note: ZOD Schema expects a true value
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
          <Checkbox name="terms" label="Accept terms and conditions" />
          <Checkbox
            name="marketing"
            label="Receive marketing emails"
            description="We will send you hourly updates about our products"
          />
          <Checkbox name="required" label="This is a required checkbox" />
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
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof Checkbox> = {
  title: 'RemixHookForm/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledCheckboxExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default checkbox component.',
      },
      source: {
        code: `
const formSchema = z.object({
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  marketing: z.boolean().optional(),
  required: z.boolean().refine(val => val === true, 'This field is required'),
});

const ControlledCheckboxExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false as true, // Note: ZOD Schema expects a true value
      marketing: false,
      required: false as true //Note: ZOD Schema expects a true value
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
        <div className='grid gap-8'>
          <Checkbox name="terms" label="Accept terms and conditions" />
          <Checkbox name="marketing" label="Receive marketing emails" description="We will send you hourly updates about our products" />
          <Checkbox name="required" label="This is a required checkbox" />
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
      // Verify all checkboxes are unchecked initially
      const termsCheckbox = canvas.getByLabelText('Accept terms and conditions');
      const marketingCheckbox = canvas.getByLabelText('Receive marketing emails');
      const requiredCheckbox = canvas.getByLabelText('This is a required checkbox');

      expect(termsCheckbox).not.toBeChecked();
      expect(marketingCheckbox).not.toBeChecked();
      expect(requiredCheckbox).not.toBeChecked();

      // Verify submit button is present
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
    });

    await step('Test validation errors on invalid submission', async () => {
      // Submit form without checking required checkboxes
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify validation error messages appear
      await expect(canvas.findByText('You must accept the terms and conditions')).resolves.toBeInTheDocument();
      await expect(canvas.findByText('This field is required')).resolves.toBeInTheDocument();
    });

    await step('Test successful form submission', async () => {
      // Check required checkboxes
      const termsCheckbox = canvas.getByLabelText('Accept terms and conditions');
      const requiredCheckbox = canvas.getByLabelText('This is a required checkbox');

      await userEvent.click(termsCheckbox);
      await userEvent.click(requiredCheckbox);

      // Submit form
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify success message
      await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
    });
  },
};
