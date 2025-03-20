import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '../lib/storybook/remix-mock';
import { useFetcher } from '../lib/storybook/remix-mock';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledTextFieldExample = () => {
  const fetcher = useFetcher<{ message: string; email: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
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
            email: data.email,
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
      <form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <TextField
            name="email"
            label="Email address"
            placeholder="Enter your email"
            type="email"
            autoComplete="email"
          />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.email && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted email:</p>
              <p className="text-sm text-gray-500">{fetcher.data.email}</p>
            </div>
          )}
        </div>
      </form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Email submitted successfully', email: data.email };
};

const meta: Meta<typeof TextField> = {
  title: 'RemixHookForm/TextField',
  component: TextField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledTextFieldExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A text field component for entering text input.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Enter text
    const emailInput = canvas.getByLabelText('Email address');
    await userEvent.type(emailInput, 'test@example.com');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the submitted email is displayed
    await expect(await canvas.findByText('test@example.com')).toBeInTheDocument();
  },
};