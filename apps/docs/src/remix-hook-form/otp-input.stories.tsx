import { zodResolver } from '@hookform/resolvers/zod';
import { OTPInput } from '@lambdacurry/forms/remix-hook-form/otp-input';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, Form, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledOtpInputExample = () => {
  const fetcher = useFetcher<{
    message: string;
    otp: string;
  }>();

  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
    fetcher: fetcher,
    submitHandlers: {
      onValid: (data) => {
        fetcher.submit(
          createFormData({
            otp: data.otp,
          }),
          {
            method: 'post',
            action: '/',
          },
        );
      },
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <OTPInput name="otp" label="Enter OTP" maxLength={6} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.otp && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted OTP:</p>
              <p className="text-sm text-gray-500">{fetcher.data.otp}</p>
            </div>
          )}
        </div>
      </Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'OTP submitted successfully', otp: data.otp };
};

const meta: Meta<typeof OTPInput> = {
  title: 'RemixHookForm/OTPInput',
  component: OTPInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledOtpInputExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An OTP input component for entering verification codes.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get the main OTP input
    const otpInput = canvas.getByRole('textbox');

    // Type the 6-digit OTP directly into the hidden input
    await userEvent.type(otpInput, '123456');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the submitted OTP is displayed
    await expect(await canvas.findByText('123456')).toBeInTheDocument();
  },
};
