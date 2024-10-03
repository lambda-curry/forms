import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { ControlledInputOTP } from './input-otp';
import { Button } from './button';

// Form schema definition
const formSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof formSchema>;

// Component for the form
const ControlledInputOTPExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit} method="post" action="/">
        <ControlledInputOTP name="otp" label="OTP" maxLength={6} />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
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
const meta: Meta<typeof ControlledInputOTP> = {
  title: 'UI/Fields/ControlledInputOTP',
  component: ControlledInputOTP,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledInputOTPExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof ControlledInputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = (canvas: ReturnType<typeof within>) => {
  const otpInput = canvas.getByLabelText('OTP');
  expect(otpInput).toHaveValue('');
};

const testInvalidSubmission = async (canvas: ReturnType<typeof within>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(canvas.findByText('OTP must be 6 digits')).resolves.toBeInTheDocument();
};

const testValidSubmission = async (canvas: ReturnType<typeof within>) => {
  const otpInput = canvas.getByLabelText('OTP');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await userEvent.type(otpInput, '123456');
  await userEvent.click(submitButton);

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