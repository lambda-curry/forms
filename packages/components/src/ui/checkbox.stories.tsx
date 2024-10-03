import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { ControlledCheckbox } from './checkbox';
import { Button } from './button';

// Form schema definition
const formSchema = z.object({
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Component for the form
const ControlledCheckboxExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agreeToTerms: false,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit} method="post" action="/">
        <ControlledCheckbox name="agreeToTerms" label="I agree to the terms and conditions" />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p>{fetcher.data.message}</p>}
      </Form>
    </RemixFormProvider>
  );
};

// Action function for form submission
const handleFormSubmission = async (request: Request) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors, defaultValues };
  }

  return { message: 'Form submitted successfully' };
};

// Storybook configuration
const meta: Meta<typeof ControlledCheckbox> = {
  title: 'UI/Fields/ControlledCheckbox',
  component: ControlledCheckbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledCheckboxExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof ControlledCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = (canvas: ReturnType<typeof within>) => {
  const checkbox = canvas.getByRole('checkbox', { name: 'I agree to the terms and conditions' });
  expect(checkbox).not.toBeChecked();
};

const testInvalidSubmission = async (canvas: ReturnType<typeof within>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(canvas.findByText('You must agree to the terms and conditions')).resolves.toBeInTheDocument();
};

const testValidSubmission = async (canvas: ReturnType<typeof within>) => {
  const checkbox = canvas.getByRole('checkbox', { name: 'I agree to the terms and conditions' });
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await userEvent.click(checkbox);
  await userEvent.click(submitButton);

  // Check for a success message instead of checkbox state
  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

// Stories
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    testDefaultValues(canvas);
    await testInvalidSubmission(canvas);
    await testValidSubmission(canvas);
  },
};