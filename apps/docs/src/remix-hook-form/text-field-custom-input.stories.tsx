import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type * as React from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof formSchema>;

// Custom Input component with rounded corners and a different focus style
const RoundedInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full rounded-full border-2 border-blue-300 bg-white px-4 py-2 text-blue-900 placeholder:text-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
  />
));
RoundedInput.displayName = 'RoundedInput';

// Custom Input component with a search icon
const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <title>Search</title>
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <input
      ref={ref}
      {...props}
      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
));
SearchInput.displayName = 'SearchInput';

const CustomInputExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="grid gap-4">
          {/* TextField with custom rounded input */}
          <TextField
            name="name"
            label="Name"
            placeholder="Enter your name"
            components={{
              Input: RoundedInput,
            }}
          />

          {/* TextField with custom search input */}
          <TextField
            name="email"
            label="Email"
            placeholder="Search for an email"
            components={{
              Input: SearchInput,
            }}
          />
        </div>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof TextField> = {
  title: 'RemixHookForm/TextField Custom Input',
  component: TextField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomInputExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomInputComponents: Story = {
  render: () => <CustomInputExample />,
  parameters: {
    docs: {
      description: {
        story: `
### TextField with Custom Input Components

This example demonstrates how to use custom Input components with the TextField component.

#### 1. Rounded Input

The first text field uses a custom input with rounded corners and a blue theme:

\`\`\`tsx
<TextField
  name="name"
  label="Name"
  placeholder="Enter your name"
  components={{
    Input: RoundedInput,
  }}
/>
\`\`\`

Where the RoundedInput component is defined as:

\`\`\`tsx
const RoundedInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full rounded-full border-2 border-blue-300 bg-white px-4 py-2 text-blue-900 placeholder:text-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
  />
));
RoundedInput.displayName = 'RoundedInput';
\`\`\`

#### 2. Search Input with Icon

The second text field uses a custom input with a search icon:

\`\`\`tsx
<TextField
  name="email"
  label="Email"
  placeholder="Search for an email"
  components={{
    Input: SearchInput,
  }}
/>
\`\`\`

With the SearchInput component defined as:

\`\`\`tsx
const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <title>Search</title>
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <input
      ref={ref}
      {...props}
      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
));
SearchInput.displayName = 'SearchInput';
\`\`\`

### Important Implementation Details

1. **Using forwardRef**: Always use \`React.forwardRef\` when creating custom input components to ensure the ref is properly forwarded to the input element.

2. **Spreading props**: Make sure to spread the \`props\` to pass all necessary attributes to the input element.

3. **Maintaining the ref**: Include the \`ref\` parameter to maintain form functionality and ensure React Hook Form can properly control the input.

4. **Adding a displayName**: Add a displayName to your component for better debugging in React DevTools.

5. **Styling considerations**: When creating custom inputs, consider how they will interact with the TextField's prefix and suffix props if they are used together.
`
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the form fields
    const nameInput = canvas.getByPlaceholderText('Enter your name');
    const emailInput = canvas.getByPlaceholderText('Search for an email');

    // Type values
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify successful submission
    await expect(await canvas.findByText('Form submitted successfully')).toBeInTheDocument();
  },
};

