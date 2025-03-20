import { zodResolver } from '@hookform/resolvers/zod';
import { OtpInput } from '@lambdacurry/forms/remix-hook-form/otp-input';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '../lib/storybook/remix-mock';
import { Form, useFetcher } from '../lib/storybook/remix-mock';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const formSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledOtpInputExample = () => {
  const fetcher = useFetcher<{ message: string; otp: string }>();
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
          <OtpInput name="otp" label="Enter OTP" length={6} />
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

const meta: Meta<typeof OtpInput> = {
  title: 'RemixHookForm/OtpInput',
  component: OtpInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledOtpInputExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof OtpInput>;

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

    // Get all input fields
    const inputs = canvas.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);

    // Enter OTP
    await userEvent.type(inputs[0], '1');
    await userEvent.type(inputs[1], '2');
    await userEvent.type(inputs[2], '3');
    await userEvent.type(inputs[3], '4');
    await userEvent.type(inputs[4], '5');
    await userEvent.type(inputs[5], '6');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the submitted OTP is displayed
    await expect(await canvas.findByText('123456')).toBeInTheDocument();
  },
};