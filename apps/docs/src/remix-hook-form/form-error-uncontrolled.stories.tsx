import { FormError } from '@lambdacurry/forms';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const UncontrolledFormErrorExample = ({ message }: { message?: string }) => {
  const methods = useRemixForm({
    defaultValues: {
      email: '',
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <div className="max-w-md mx-auto p-6 space-y-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Uncontrolled Error</h2>
        <p className="text-sm text-gray-500 mb-4">
          This FormError is rendered with a manual message prop, bypassing the form state.
        </p>

        <FormError message={message} />

        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm text-gray-600">
            The error above is not coming from <code>errors._form</code>. It's passed directly as a prop.
          </p>
        </div>
      </div>
    </RemixFormProvider>
  );
};

const meta: Meta<typeof FormError> = {
  title: 'RemixHookForm/FormError/Uncontrolled',
  component: FormError,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The FormError component can be used in an "uncontrolled" mode by passing a \`message\` prop directly.
This is useful for displaying errors that aren't managed by the form's validation state, such as generic network errors or manual UI feedback.

**Key Features of Uncontrolled Mode:**
- Takes precedence over form-state errors
- Does not require a \`name\` prop
- Maintains consistent styling and accessibility
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: () => <UncontrolledFormErrorExample message="This is a manual, uncontrolled error message." />,
        },
      ],
    }),
  ],
} satisfies Meta<typeof FormError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'A manual error message',
  },
};

export const CustomStyling: Story = {
  args: {
    message: 'A manual error message with custom styling',
    className: 'bg-red-50 p-4 border border-red-200 rounded-md',
  },
};
