import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { FormLabel, FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { Button } from '@lambdacurry/forms/ui/button';
import { Input } from '@lambdacurry/forms/ui/input';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import type * as React from 'react';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof formSchema>;

// Custom Input component
const PurpleInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2 text-purple-900 placeholder:text-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
  />
);
PurpleInput.displayName = 'PurpleInput';

// Custom Form Label component
const PurpleLabel = (props: React.ComponentPropsWithoutRef<typeof FormLabel>) => (
  <FormLabel className="text-lg font-bold text-purple-700" {...props} />
);
PurpleLabel.displayName = 'PurpleLabel';

// Custom Form Message component
const PurpleMessage = (props: React.ComponentPropsWithoutRef<typeof FormMessage>) => (
  <FormMessage className="text-purple-500 bg-purple-50 p-2 rounded-md mt-1" {...props} />
);
PurpleMessage.displayName = 'PurpleMessage';

// Custom Input with icon
const IconInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <title>Lock</title>
        <path
          fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <input
      {...props}
      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);
IconInput.displayName = 'IconInput';

const CustomTextFieldExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
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
          {/* Default TextField */}
          <TextField name="username" label="Username" placeholder="Enter your username" />

          {/* Custom TextField with purple styling */}
          <TextField
            name="email"
            label="Email"
            placeholder="Enter your email"
            components={{
              Input: PurpleInput,
              FormLabel: PurpleLabel,
              FormMessage: PurpleMessage,
            }}
          />

          {/* Custom TextField with icon */}
          <TextField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            components={{
              Input: IconInput,
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
  title: 'RemixHookForm/TextField Customized',
  component: TextField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomTextFieldExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomComponents: Story = {
  render: () => <CustomTextFieldExample />,
  parameters: {
    docs: {
      description: {
        story: `
### TextField Component Customization

This example demonstrates three different approaches to customizing the TextField component with complete control over styling and behavior.

#### 1. Default Styling

The first text field uses the default styling with no customization needed:

\`\`\`tsx
<TextField 
  name="username" 
  label="Username" 
  placeholder="Enter your username" 
/>
\`\`\`

#### 2. Custom Styling with Purple Theme

The second text field customizes the Input, FormLabel, and FormMessage components with purple styling:

\`\`\`tsx
<TextField
  name="email"
  label="Email"
  placeholder="Enter your email"
  components={{
    Input: PurpleInput,
    FormLabel: PurpleLabel,
    FormMessage: PurpleMessage,
  }}
/>
\`\`\`

Where the custom components are defined as:

\`\`\`tsx
// Custom Input component
const PurpleInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2 text-purple-900 placeholder:text-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
  />
);

// Custom Form Label component
const PurpleLabel = (props: React.ComponentPropsWithoutRef<typeof FormLabel>) => 
  <FormLabel className="text-lg font-bold text-purple-700" {...props} />;

// Custom Form Message component
const PurpleMessage = (props: React.ComponentPropsWithoutRef<typeof FormMessage>) => 
  <FormMessage className="text-purple-500 bg-purple-50 p-2 rounded-md mt-1" {...props} />;
\`\`\`

#### 3. Icon Input

The third text field demonstrates how to create a custom input with an icon:

\`\`\`tsx
<TextField
  name="password"
  label="Password"
  type="password"
  placeholder="Enter your password"
  components={{
    Input: IconInput,
  }}
/>
\`\`\`

With the IconInput component defined as:

\`\`\`tsx
const IconInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <title>Lock</title>
        <path
          fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <input
      {...props}
      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);
\`\`\`

### Key Points

- Always use React.forwardRef when creating custom components
- Make sure to spread the props to pass all necessary attributes
- Include the ref to maintain form functionality
- Add a displayName to your component for better debugging
- The components prop accepts replacements for Input, FormLabel, FormMessage, and FormDescription
`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the form fields
    const usernameInput = canvas.getByPlaceholderText('Enter your username');
    const emailInput = canvas.getByPlaceholderText('Enter your email');
    const passwordInput = canvas.getByPlaceholderText('Enter your password');

    // Type values
    await userEvent.type(usernameInput, 'johndoe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'password123');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify successful submission
    await expect(await canvas.findByText('Form submitted successfully')).toBeInTheDocument();
  },
};
