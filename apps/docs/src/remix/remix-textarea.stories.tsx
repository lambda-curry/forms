import { zodResolver } from '@hookform/resolvers/zod';
import { RemixTextarea } from '@lambdacurry/forms/remix/remix-textarea';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const formSchema = z.object({
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

const INITIAL_COMMENT = 'Initial comment text';
const BLOCKED_CONTENT = 'blocked_content';
const BLOCKED_CONTENT_ERROR = 'This content is not allowed';

const ControlledTextareaExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: INITIAL_COMMENT,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} method="post" action="/">
        <RemixTextarea name="comment" label="Comment" description="Enter your comment (minimum 10 characters)" />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Action function for form submission
const handleFormSubmission = async (request: Request) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { defaultValues };
  }

  if (data.comment.includes(BLOCKED_CONTENT)) {
    return {
      errors: {
        comment: {
          type: 'manual',
          message: BLOCKED_CONTENT_ERROR,
        },
      },
      defaultValues,
    };
  }

  return { message: 'Comment submitted successfully' };
};

// Storybook configuration
const meta: Meta<typeof RemixTextarea> = {
  title: 'Remix/RemixTextarea',
  component: RemixTextarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledTextareaExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof RemixTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = ({ canvas }: StoryContext) => {
  const textarea = canvas.getByRole('textbox');
  expect(textarea).toHaveValue(INITIAL_COMMENT);
};

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const textarea = canvas.getByRole('textbox');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await userEvent.click(textarea);
  await userEvent.clear(textarea);
  await userEvent.type(textarea, 'short');
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Comment must be at least 10 characters')).resolves.toBeInTheDocument();
};

const testBlockedContent = async ({ canvas }: StoryContext) => {
  const textarea = canvas.getByRole('textbox');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await userEvent.click(textarea);
  await userEvent.clear(textarea);
  await userEvent.type(textarea, BLOCKED_CONTENT);
  await userEvent.click(submitButton);

  await expect(canvas.findByText(BLOCKED_CONTENT_ERROR)).resolves.toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const textarea = canvas.getByRole('textbox');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await userEvent.click(textarea);
  await userEvent.clear(textarea);
  await userEvent.type(textarea, 'This is a valid comment that is long enough');
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Comment submitted successfully')).resolves.toBeInTheDocument();
};

// Stories
export const Tests: Story = {
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testInvalidSubmission(storyContext);
    await testBlockedContent(storyContext);
    await testValidSubmission(storyContext);
  },
};
