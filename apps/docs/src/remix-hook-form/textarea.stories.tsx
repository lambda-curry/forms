import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@lambdacurry/forms/remix-hook-form/textarea';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm, useRemixFormContext } from 'remix-hook-form';
import { expect, userEvent, within } from 'storybook/test';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';
import * as React from 'react';

const formSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

// Debug component to monitor form context
const FormContextDebugger = () => {
  const [debugInfo, setDebugInfo] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      try {
        const context = useRemixFormContext();
        const timestamp = new Date().toISOString();
        const contextInfo = context ? 
          `✅ Context available: handleSubmit=${typeof context.handleSubmit}, control=${typeof context.control}` :
          `❌ Context is null/undefined`;
        
        setDebugInfo(prev => [...prev.slice(-4), `${timestamp}: ${contextInfo}`]);
        console.log(`[FormContextDebugger] ${timestamp}: ${contextInfo}`, context);
      } catch (error) {
        const timestamp = new Date().toISOString();
        const errorInfo = `🚨 Error accessing context: ${error.message}`;
        setDebugInfo(prev => [...prev.slice(-4), `${timestamp}: ${errorInfo}`]);
        console.error(`[FormContextDebugger] ${timestamp}: ${errorInfo}`, error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 right-0 bg-yellow-100 border border-yellow-400 p-2 text-xs max-w-md z-50">
      <h4 className="font-bold">Form Context Debug Info:</h4>
      {debugInfo.map((info, index) => (
        <div key={index} className="text-xs">{info}</div>
      ))}
    </div>
  );
};

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

  // Add debugging for form methods
  React.useEffect(() => {
    console.log('[ControlledTextareaExample] Form methods initialized:', {
      handleSubmit: typeof methods.handleSubmit,
      control: typeof methods.control,
      formState: methods.formState,
    });
  }, [methods]);

  return (
    <RemixFormProvider {...methods}>
      <FormContextDebugger />
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
