import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { Button } from '../ui/button';
import { RemixInputOTPField } from './remix-input-otp';
import type { } from '@testing-library/dom';


const formSchema = z.object({
  otp: z.string().length(6, "Please enter a 6-digit code"),
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

export const Default: Story = {
  play: async (storyContext) => {
    await testIncompleteSubmission(storyContext);
    await testSubmission(storyContext);
  },
};

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
  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};