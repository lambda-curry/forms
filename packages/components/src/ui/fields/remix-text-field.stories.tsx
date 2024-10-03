import type { FormEvent } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { BoundFunctions, queries } from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../../lib/storybook/remix-stub';
import { ControlledTextField } from './remix-text-field';
import { Button } from '../button';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

type FormData = z.infer<typeof formSchema>;

// Constants
const INITIAL_USERNAME = 'initialuser';
const USERNAME_TAKEN = 'taken';
const USERNAME_TAKEN_ERROR = 'This username is already taken';

const ControlledTextFieldExample = () => {
  const fetcher = useFetcher();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: INITIAL_USERNAME,
    },
    fetcher,
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    await methods.handleSubmit(event);
    const formData = new FormData(event.target as HTMLFormElement);
    fetcher.submit(formData, { method: 'post', action: '/' });
  };

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={onSubmit} method="post" action="/">
        <ControlledTextField name="username" label="Username" description="Enter a unique username" />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
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

  return { success: true };
};

// Storybook configuration
const meta: Meta<typeof ControlledTextField> = {
  title: 'UI/Fields/ControlledField',
  component: ControlledTextField,
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
} satisfies Meta<typeof ControlledTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios

const testDefaultValues = (canvas: BoundFunctions<typeof queries>) => {
  const input = canvas.getByLabelText('Username');
  expect(input).toHaveValue(INITIAL_USERNAME);
};

const testInvalidSubmission = async (canvas: BoundFunctions<typeof queries>) => {
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

const testUsernameTaken = async (canvas: BoundFunctions<typeof queries>) => {
  const input = canvas.getByLabelText('Username');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  // Note: clicking the input before clearing his helpful to make sure it is ready to be cleared
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, USERNAME_TAKEN);
  await userEvent.click(submitButton);

  await expect(canvas.getByText(USERNAME_TAKEN_ERROR)).toBeInTheDocument();
};

// Stories
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    testDefaultValues(canvas);
    await testInvalidSubmission(canvas);
    await testUsernameTaken(canvas);
  },
};
