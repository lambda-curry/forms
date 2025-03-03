import { zodResolver } from '@hookform/resolvers/zod';
import { OTPInput } from '@lambdacurry/forms/remix-hook-form/otp-input';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type {} from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const formSchema = z.object({
  otp: z.string().length(6, 'Please enter a 6-digit code'),
});

type FormData = z.infer<typeof formSchema>;

const OTPInputExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <OTPInput
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

// Action function for form submission
const handleFormSubmission = async (request: Request) => {
  const { errors, receivedValues: defaultValues } = await getValidatedFormData<FormData>(
    request,
    zodResolver(formSchema),
  );

  if (errors) {
    return { errors, defaultValues };
  }

  return { message: 'OTP verified successfully' };
};

// Storybook configuration
const meta: Meta<typeof OTPInput> = {
  title: 'Form/FormOTPInput',
  component: OTPInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: OTPInputExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Update the test functions to accept storyContext
const testIncompleteSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  const input = canvasElement.querySelector('input');
  await userEvent.type(input as HTMLInputElement, '123');
  await userEvent.click(submitButton);
  await expect(canvas.findByText('Please enter a 6-digit code')).resolves.toBeInTheDocument();
};

const testSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  const input = canvasElement.querySelector('input');
  await userEvent.type(input as HTMLInputElement, '123456');
  await userEvent.click(submitButton);
  await expect(canvas.findByText('OTP verified successfully')).resolves.toBeInTheDocument();
};

export const Tests: Story = {
  play: async (storyContext) => {
    await testIncompleteSubmission(storyContext);
    await testSubmission(storyContext);
  },
};
