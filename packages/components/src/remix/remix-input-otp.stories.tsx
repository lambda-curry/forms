import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { Button } from '../ui/button';
import { RemixInputOTPField } from './remix-input-otp';

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type FormData = z.infer<typeof formSchema>;

const RemixInputOTPExample = () => {
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
        <RemixInputOTPField
          name="otp"
          label="One-Time Password"
          description="Enter the 6-digit code sent to your phone."
          maxLength={6}
        />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </Form>
    </RemixFormProvider>
  );
};

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

const meta: Meta<typeof RemixInputOTPField> = {
  title: 'Remix/RemixInputOTPField',
  component: RemixInputOTPField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: RemixInputOTPExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof RemixInputOTPField>;

export default meta;
type Story = StoryObj<typeof meta>;

const testOTPInput = async (canvas: ReturnType<typeof within>) => {
  const otpInputs = canvas.getAllByRole('textbox');
  expect(otpInputs).toHaveLength(6);

  for (let i = 0; i < 6; i++) {
    await userEvent.type(otpInputs[i], `${i + 1}`);
  }

  for (let i = 0; i < 6; i++) {
    expect(otpInputs[i]).toHaveValue(`${i + 1}`);
  }
};

const testSubmission = async (canvas: ReturnType<typeof within>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testOTPInput(canvas);
    await testSubmission(canvas);
  },
};