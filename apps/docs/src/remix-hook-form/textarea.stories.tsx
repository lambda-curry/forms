import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@lambdacurry/forms/remix-hook-form/textarea';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
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
            message: data.message,
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
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
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

// Test scenarios
const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const messageInput = canvas.getByLabelText('Your message');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  // Clear the textarea and enter text that's too short
  await userEvent.click(messageInput);
  await userEvent.clear(messageInput);
  await userEvent.type(messageInput, 'Short');
  await userEvent.click(submitButton);
  
  // Check for validation error
  await expect(await canvas.findByText('Message must be at least 10 characters')).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const messageInput = canvas.getByLabelText('Your message');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  // Clear and enter valid text
  await userEvent.click(messageInput);
  await userEvent.clear(messageInput);
  await userEvent.type(messageInput, 'This is a test message that is longer than 10 characters.');
  await userEvent.click(submitButton);

  // Check for success message
  const successMessage = await canvas.findByText('Message submitted successfully');
  expect(successMessage).toBeInTheDocument();
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A textarea component for entering multiline text input.',
      },
    },
  },
  play: async (storyContext) => {
    await testInvalidSubmission(storyContext);
    await testValidSubmission(storyContext);
  },
};
