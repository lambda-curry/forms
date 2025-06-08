import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@lambdacurry/forms/remix-hook-form/textarea';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { expect, userEvent, within } from '@storybook/test';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledTextareaExample = () => {
  const fetcher = useFetcher<{ message: string; submittedMessage: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
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
            submittedMessage: data.message,
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
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <Textarea name="message" label="Your message" placeholder="Enter your message here..." rows={5} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.submittedMessage && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted message:</p>
              <p className="text-sm text-gray-500">{fetcher.data.submittedMessage}</p>
            </div>
          )}
        </div>
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Message submitted successfully', submittedMessage: data.message };
};

const meta: Meta<typeof Textarea> = {
  title: 'RemixHookForm/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledTextareaExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A textarea component for entering multiline text input.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Enter text
    const messageInput = canvas.getByLabelText('Your message');
    await userEvent.type(messageInput, 'This is a test message that is longer than 10 characters.');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the submitted message is displayed
    await expect(
      await canvas.findByText('This is a test message that is longer than 10 characters.'),
    ).toBeInTheDocument();
  },
};
