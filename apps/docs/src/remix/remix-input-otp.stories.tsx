import { zodResolver } from '@hookform/resolvers/zod';
import { RemixInputOTPField } from '@lambdacurry/forms/remix/remix-input-otp';
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

const RemixInputOTPExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
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
const meta: Meta<typeof RemixInputOTPField> = {
  title: 'Remix/RemixInputOTP',
  component: RemixInputOTPField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: RemixInputOTPExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof RemixInputOTPField>;

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
