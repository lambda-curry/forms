import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, } from '@storybook/test';
import type { } from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { RemixTextField } from './remix-text-field';
import { Button } from '../ui/button';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

type FormData = z.infer<typeof formSchema>;

const INITIAL_USERNAME = 'initial_user';
const USERNAME_TAKEN = 'taken';
const USERNAME_TAKEN_ERROR = 'This username is already taken';

const ControlledTextFieldExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: INITIAL_USERNAME,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} method="post" action="/">
        <RemixTextField name="username" label="Username" description="Enter a unique username" />
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
    return { errors, defaultValues };
  }


  if (data.username === USERNAME_TAKEN) {
    return {
      errors: {
        username: {
          type: 'manual',
          message: USERNAME_TAKEN_ERROR,
        },
      },
      defaultValues,
    };
  }

  return { message: 'Form submitted successfully' };
};

// Storybook configuration
const meta: Meta<typeof RemixTextField> = {
  title: 'Remix/RemixTextField',
  component: RemixTextField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledTextFieldExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof RemixTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Username');
  expect(input).toHaveValue(INITIAL_USERNAME);
};

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Username');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  // Note: clicking the input before clearing his helpful to make sure it is ready to be cleared
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, 'ab');
  await userEvent.click(submitButton);
  // Use findByText instead of getByText to allow for async updates
  await expect(await canvas.findByText('Username must be at least 3 characters')).toBeInTheDocument();
};

const testUsernameTaken = async ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Username');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  // Note: clicking the input before clearing his helpful to make sure it is ready to be cleared
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, USERNAME_TAKEN);
  await userEvent.click(submitButton);

  // wait for response to return
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await expect(canvas.getByText(USERNAME_TAKEN_ERROR)).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Username');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  // Note: clicking the input before clearing his helpful to make sure it is ready to be cleared
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, 'valid_username');
  await userEvent.click(submitButton);

  await expect(await canvas.findByText('Form submitted successfully')).toBeInTheDocument();
};

// Stories
export const Tests: Story = {
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testInvalidSubmission(storyContext);
    await testUsernameTaken(storyContext);
    await testValidSubmission(storyContext);
  },
};
