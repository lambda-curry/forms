import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';
import { RemixTextarea } from '@lambdacurry/forms/remix/remix-textarea';
import { Button } from '@lambdacurry/forms/ui/button';

const formSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

const INITIAL_DESCRIPTION = 'Initial description text';
const INVALID_CONTENT = 'This description is too long and will be rejected by the server';
const CONTENT_ERROR = 'This description is not allowed';

function ControlledTextareaExample() {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: INITIAL_DESCRIPTION,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} method="post" action="/">
        <div className="space-y-4 w-[400px]">
          <RemixTextarea
            name="description"
            label="Description"
            description="Enter a description (minimum 10 characters)"
            placeholder="Type your description here..."
          />
          <Button type="submit" className="w-full">Submit</Button>
          {fetcher.data?.message && (
            <p className="text-green-600 text-sm">{fetcher.data.message}</p>
          )}
        </div>
      </fetcher.Form>
    </RemixFormProvider>
  );
}

async function handleFormSubmission(request: Request) {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors, defaultValues };
  }

  if (data.description === INVALID_CONTENT) {
    return {
      errors: {
        description: {
          type: 'manual',
          message: CONTENT_ERROR,
        },
      },
      defaultValues,
    };
  }

  return { message: 'Form submitted successfully' };
}

const meta = {
  title: 'Remix/RemixTextarea',
  component: RemixTextarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A textarea component that integrates with Remix Form and provides validation feedback.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledTextareaExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof RemixTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  args: {
    name: 'description',
  },
  play: async ({ canvasElement }) => {
    // Test initial state
    const textarea = canvasElement.querySelector('textarea[name="description"]');
    expect(textarea).toHaveValue(INITIAL_DESCRIPTION);

    // Test validation error
    await userEvent.clear(textarea as HTMLTextAreaElement);
    await userEvent.type(textarea as HTMLTextAreaElement, 'short');
    await userEvent.click(canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement);
    expect(canvasElement.querySelector('.form-message')).toHaveTextContent(
      'Description must be at least 10 characters'
    );

    // Test server error
    await userEvent.clear(textarea as HTMLTextAreaElement);
    await userEvent.type(textarea as HTMLTextAreaElement, INVALID_CONTENT);
    await userEvent.click(canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement);
    expect(canvasElement.querySelector('.form-message')).toHaveTextContent(CONTENT_ERROR);

    // Test successful submission
    await userEvent.clear(textarea as HTMLTextAreaElement);
    await userEvent.type(textarea as HTMLTextAreaElement, 'This is a valid description text');
    await userEvent.click(canvasElement.querySelector('button[type="submit"]') as HTMLButtonElement);
    expect(canvasElement.querySelector('.text-green-600')).toHaveTextContent(
      'Form submitted successfully'
    );
  },
}; 