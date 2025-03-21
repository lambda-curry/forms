import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
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
  price: z.string().min(1, 'Price is required'),
  email: z.string().email('Invalid email address'),
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
      price: '10.00',
      email: 'user@example.com',
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
        <div className="space-y-6">
          <TextField name="username" label="Username" description="Enter a unique username" />
          
          <TextField 
            name="price" 
            label="Price" 
            description="Enter the price" 
            prefix="$" 
          />
          
          <TextField 
            name="email" 
            label="Email" 
            description="Enter your email address" 
            suffix="@example.com" 
          />
          
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
        </div>
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
const meta: Meta<typeof TextField> = {
  title: 'RemixHookForm/TextField',
  component: TextField,
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
} satisfies Meta<typeof TextField>;

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

  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, 'valid_username');
  await userEvent.click(submitButton);

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

// Additional stories to showcase prefix and suffix
export const WithPrefix: Story = {
  name: 'With Prefix',
  args: {
    name: 'price',
    label: 'Price',
    prefix: '$',
  },
};

export const WithSuffix: Story = {
  name: 'With Suffix',
  args: {
    name: 'email',
    label: 'Email',
    suffix: '@example.com',
  },
};

export const WithBoth: Story = {
  name: 'With Prefix and Suffix',
  args: {
    name: 'measurement',
    label: 'Measurement',
    prefix: '~',
    suffix: 'cm',
  },
};