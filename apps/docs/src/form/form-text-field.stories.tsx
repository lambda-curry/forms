import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextField } from '@lambdacurry/forms/form/form-text-field';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import type {} from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

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
    submitConfig: {
      action: '/username',
      method: 'post',
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <FormTextField name="username" label="Username" description="Enter a unique username" />
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
const meta: Meta<typeof FormTextField> = {
  title: 'Form/FormTextField',
  component: FormTextField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledTextFieldExample,
      },
      routes: [
        {
          path: '/username',
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof FormTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = ({ canvas }: StoryContext) => {
  const container = canvas.getByText('Username').closest('.form-item');
  const input = container?.querySelector('input');
  expect(input).toHaveValue(INITIAL_USERNAME);
};

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const container = canvas.getByText('Username').closest('.form-item');
  const input = container?.querySelector('input');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  if (input) {
    // Note: clicking the input before clearing his helpful to make sure it is ready to be cleared
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'ab');
    await userEvent.click(submitButton);
  }
  
  // Use findByText instead of getByText to allow for async updates
  await expect(await canvas.findByText('Username must be at least 3 characters')).toBeInTheDocument();
};

const testUsernameTaken = async ({ canvas }: StoryContext) => {
  const container = canvas.getByText('Username').closest('.form-item');
  const input = container?.querySelector('input');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  if (input) {
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, USERNAME_TAKEN);
    await userEvent.click(submitButton);
  }

  await expect(canvas.getByText(USERNAME_TAKEN_ERROR)).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const container = canvas.getByText('Username').closest('.form-item');
  const input = container?.querySelector('input');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  if (input) {
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'valid_username');
    await userEvent.click(submitButton);
  }

  // Use findByText which waits for the element to appear
  const successMessage = await canvas.findByText('Form submitted successfully');
  expect(successMessage).toBeInTheDocument();
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
