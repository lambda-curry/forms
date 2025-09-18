import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import type { FormLabel, FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { Button } from '@lambdacurry/forms/ui/button';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import type * as React from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  marketing: z.boolean().optional(),
  required: z.boolean().refine((val) => val === true, 'This field is required'),
});

type FormData = z.infer<typeof formSchema>;

// Custom checkbox component
const PurpleCheckbox = (props: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root
    {...props}
    className="h-8 w-8 rounded-full border-4 border-purple-500 bg-white data-[state=checked]:bg-purple-500"
  >
    {props.children}
  </CheckboxPrimitive.Root>
);
PurpleCheckbox.displayName = 'PurpleCheckbox';

// Custom indicator
const PurpleIndicator = (props: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>) => (
  <CheckboxPrimitive.Indicator {...props} className="flex h-full w-full items-center justify-center text-white">
    ✓
  </CheckboxPrimitive.Indicator>
);
PurpleIndicator.displayName = 'PurpleIndicator';

// Custom form label component
const CustomLabel = (props: React.ComponentPropsWithoutRef<typeof FormLabel>) => {
  const { className, htmlFor, ...rest } = props;
  return (
    <label htmlFor={htmlFor} className={`custom-label text-purple-600 font-bold text-lg ${className}`} {...rest}>
      {props.children} ★
    </label>
  );
};
CustomLabel.displayName = 'CustomLabel';

// Custom error message component
const CustomErrorMessage = (props: React.ComponentPropsWithoutRef<typeof FormMessage>) => {
  const { className, ...rest } = props;
  return (
    <p className={`custom-error flex items-center text-red-500 bg-red-100 p-2 rounded-md ${className}`} {...rest}>
      <span className="mr-1 text-lg">⚠️</span> {props.children}
    </p>
  );
};
CustomErrorMessage.displayName = 'CustomErrorMessage';

// Example with custom checkbox components
const _PurpleCheckboxExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false as true,
      marketing: false,
      required: false as true,
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
        <div className="grid gap-8">
          <Checkbox
            name="terms"
            label="Accept terms and conditions"
            description="You must accept our terms to continue"
            components={{
              Checkbox: PurpleCheckbox,
              CheckboxIndicator: PurpleIndicator,
            }}
          />
        </div>
        <Button type="submit" className="mt-8">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Example with custom label components
const _CustomLabelExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false as true,
      marketing: false,
      required: false as true,
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
        <div className="grid gap-8">
          <Checkbox
            name="required"
            label="This is a required checkbox"
            components={{
              FormLabel: CustomLabel,
              FormMessage: CustomErrorMessage,
            }}
          />
        </div>
        <Button type="submit" className="mt-8">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Example with all custom components
const AllCustomComponentsExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false as true,
      marketing: false,
      required: false as true,
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  const customCheckboxComponents = {
    Checkbox: PurpleCheckbox,
    CheckboxIndicator: PurpleIndicator,
  };

  const customLabelComponents = {
    FormLabel: CustomLabel,
    FormMessage: CustomErrorMessage,
  };

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="grid gap-8">
          <Checkbox
            name="terms"
            label="Accept terms and conditions"
            components={{
              ...customCheckboxComponents,
              ...customLabelComponents,
            }}
          />
          <Checkbox
            name="marketing"
            label="Receive marketing emails"
            description="We will send you hourly updates about our products"
            // Using default components for this checkbox
          />
          <Checkbox name="required" label="This is a required checkbox" components={customLabelComponents} />
        </div>
        <Button type="submit" className="mt-8">
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

const meta: Meta<typeof Checkbox> = {
  title: 'RemixHookForm/Checkbox Customized',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomCheckboxComponentExamples: Story = {
  name: 'Custom Checkbox Component Examples',
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: AllCustomComponentsExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: `
### Checkbox Customization Examples

This story demonstrates three different approaches to customizing the Checkbox component:

#### Custom Checkbox Components Example

The first example customizes the actual checkbox and its indicator component:

\`\`\`tsx
const PurpleCheckbox = (
  props: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
) => (
  <CheckboxPrimitive.Root
    {...props}
    className="h-8 w-8 rounded-full border-4 border-purple-500 bg-white data-[state=checked]:bg-purple-500"
  >
    {props.children}
  </CheckboxPrimitive.Root>
);

const PurpleIndicator = (
  props: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
) => (
  <CheckboxPrimitive.Indicator
    {...props}
    className="flex h-full w-full items-center justify-center text-white"
  >
    ✓
  </CheckboxPrimitive.Indicator>
);
\`\`\`

#### Custom Form Components Example

The second example customizes the form label and error message components:

\`\`\`tsx
const CustomLabel = (
  props: React.ComponentPropsWithoutRef<typeof FormLabel>
) => {
  const { className, htmlFor, ...rest } = props;
  return (
    <label
      htmlFor={htmlFor}
      className={\`custom-label text-purple-600 font-bold text-lg \${className}\`}
      {...rest}
    >
      {props.children} ★
    </label>
  );
};

const CustomErrorMessage = (
  props: React.ComponentPropsWithoutRef<typeof FormMessage>
) => {
  const { className, ...rest } = props;
  return (
    <p
      className={\`custom-error flex items-center text-red-500 bg-red-100 p-2 rounded-md \${className}\`}
      {...rest}
    >
      <span className="mr-1 text-lg">⚠️</span> {props.children}
    </p>
  );
};
\`\`\`
        `,
      },
      source: {
        code: `
// Custom checkbox component
const PurpleCheckbox = (
  props: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
) => (
  <CheckboxPrimitive.Root
    {...props}
    className="h-8 w-8 rounded-full border-4 border-purple-500 bg-white data-[state=checked]:bg-purple-500"
  >
    {props.children}
  </CheckboxPrimitive.Root>
);

// Custom indicator
const PurpleIndicator = (
  props: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
) => (
  <CheckboxPrimitive.Indicator
    {...props}
    className="flex h-full w-full items-center justify-center text-white"
  >
    ✓
  </CheckboxPrimitive.Indicator>
);

// Custom form label component
const CustomLabel = (
  props: React.ComponentPropsWithoutRef<typeof FormLabel>
) => {
  const { className, htmlFor, ...rest } = props;
  return (
    <label
      htmlFor={htmlFor}
      className={\`custom-label text-purple-600 font-bold text-lg \${className}\`}
      {...rest}
    >
      {props.children} ★
    </label>
  );
};

// Custom error message component
const CustomErrorMessage = (
  props: React.ComponentPropsWithoutRef<typeof FormMessage>
) => {
  const { className, ...rest } = props;
  return (
    <p
      className={\`custom-error flex items-center text-red-500 bg-red-100 p-2 rounded-md \${className}\`}
      {...rest}
    >
      <span className="mr-1 text-lg">⚠️</span> {props.children}
    </p>
  );
};

// Usage in form
`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find all checkboxes
    const checkboxElements = canvas.getAllByRole('checkbox', { hidden: true });

    // Get all button checkboxes
    const checkboxButtons = Array.from(checkboxElements)
      .map((checkbox) => checkbox.closest('button'))
      .filter((button) => button !== null) as HTMLButtonElement[];

    // We should have at least one custom checkbox button
    expect(checkboxButtons.length).toBeGreaterThan(0);

    // Find the custom purple checkbox (the one with rounded-full class)
    const purpleCheckbox = checkboxButtons.find(
      (button) => button.classList.contains('rounded-full') && button.classList.contains('border-purple-500'),
    );

    if (purpleCheckbox) {
      // Verify custom checkbox styling
      expect(purpleCheckbox).toHaveClass('rounded-full');
      expect(purpleCheckbox).toHaveClass('border-purple-500');

      // Check the terms checkbox
      await userEvent.click(purpleCheckbox);
      expect(purpleCheckbox).toHaveAttribute('data-state', 'checked');

      // Find the required checkbox (we'll just check all remaining checkboxes)
      for (const button of checkboxButtons) {
        if (button !== purpleCheckbox) {
          await userEvent.click(button);
        }
      }

      // Submit the form
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify successful submission
      const successMessage = await canvas.findByText('Form submitted successfully');
      expect(successMessage).toBeInTheDocument();
    }
  },
};
