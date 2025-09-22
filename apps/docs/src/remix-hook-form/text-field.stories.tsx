import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { useRef } from 'react';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { getValidatedFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  price: z.string().min(1, 'Price is required'),
  email: z.string().email('Invalid email address'),
  measurement: z.string().min(1, 'Measurement is required'),
});

type FormData = z.infer<typeof formSchema>;

const INITIAL_USERNAME = 'test_user';
const USERNAME_TAKEN = 'test_user';
const USERNAME_TAKEN_ERROR = 'Username is already taken';

const ControlledTextFieldExample = () => {
  const fetcher = useFetcher<{ message: string; email: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: INITIAL_USERNAME,
      price: '10.00',
      email: 'user@example.com',
      measurement: '10',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  const ref = useRef<HTMLInputElement>(null);

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="space-y-6">
          <TextField name="username" label="Username" description="Enter a unique username" />

          <TextField name="price" label="Price" description="Enter the price" prefix="$" />

          <TextField name="email" label="Email" description="Enter your email address" suffix="@example.com" />

          <TextField
            type="number"
            name="measurement"
            step={0.1}
            label="Measurement"
            description="Enter a measurement"
            prefix="~"
            suffix="cm"
          />

          <div className="flex gap-2 items-end">
            <TextField name="refExample" label="Ref Example" placeholder="Enter something, this has a ref" ref={ref} />

            <Button onClick={() => ref.current?.focus()}>Focus the input</Button>
          </div>

          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
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

  // Check for taken username
  if (data.username === USERNAME_TAKEN) {
    return {
      errors: {
        username: {
          message: USERNAME_TAKEN_ERROR,
        },
      },
    };
  }

  return { message: 'Form submitted successfully', email: data.email };
};

const meta: Meta<typeof TextField> = {
  title: 'RemixHookForm/TextField',
  component: TextField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const input = canvas.getByLabelText('Username');
  expect(input).toHaveValue(INITIAL_USERNAME);
};

const testInvalidSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
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

const testUsernameTaken = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
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

const testValidSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const input = canvas.getByLabelText('Username');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, 'valid_username');
  await userEvent.click(submitButton);

  // Use findByText which waits for the element to appear
  const successMessage = await canvas.findByText('Form submitted successfully');
  expect(successMessage).toBeInTheDocument();
};

// Single story that contains all variants
export const Examples: Story = {
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testInvalidSubmission(storyContext);
    await testUsernameTaken(storyContext);
    await testValidSubmission(storyContext);
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledTextFieldExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};
