import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import type { FormLabel, FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { Button } from '@lambdacurry/forms/ui/button';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
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
const PurpleCheckbox = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>((props, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    {...props}
    className="h-8 w-8 rounded-full border-4 border-purple-500 bg-white data-[state=checked]:bg-purple-500"
  >
    {props.children}
  </CheckboxPrimitive.Root>
));
PurpleCheckbox.displayName = 'PurpleCheckbox';

// Custom indicator
const PurpleIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>((props, ref) => (
  <CheckboxPrimitive.Indicator
    ref={ref}
    {...props}
    className="flex h-full w-full items-center justify-center text-white"
  >
    ✓
  </CheckboxPrimitive.Indicator>
));
PurpleIndicator.displayName = 'PurpleIndicator';

// Custom form label component
const CustomLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof FormLabel>>(
  ({ className, htmlFor, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`custom-label text-purple-600 font-bold text-lg ${className}`}
      {...props}
    >
      {props.children} ★
    </label>
  ),
);
CustomLabel.displayName = 'CustomLabel';

// Custom error message component
const CustomErrorMessage = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof FormMessage>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={`custom-error flex items-center text-red-500 bg-red-100 p-2 rounded-md ${className}`}
      {...props}
    >
      <span className="mr-1 text-lg">⚠️</span> {props.children}
    </p>
  ),
);
CustomErrorMessage.displayName = 'CustomErrorMessage';

// Example with custom checkbox components
const PurpleCheckboxExample = () => {
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
const CustomLabelExample = () => {
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
### Checkbox Component Customization

This example demonstrates three different approaches to customizing the Checkbox component with complete control over styling and behavior.

#### 1. Custom Checkbox Appearance

The first approach customizes the visual appearance of the checkbox itself:

\`\`\`tsx
<Checkbox
  name="terms"
  label="Accept terms and conditions"
  description="You must accept our terms to continue"
  components={{
    Checkbox: PurpleCheckbox,
    CheckboxIndicator: PurpleIndicator,
  }}
/>
\`\`\`

Where the custom components are defined as:

\`\`\`tsx
// Custom checkbox component
const PurpleCheckbox = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>((props, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    {...props}
    className="h-8 w-8 rounded-full border-4 border-purple-500 bg-white data-[state=checked]:bg-purple-500"
  >
    {props.children}
  </CheckboxPrimitive.Root>
));

// Custom indicator
const PurpleIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>((props, ref) => (
  <CheckboxPrimitive.Indicator
    ref={ref}
    {...props}
    className="flex h-full w-full items-center justify-center text-white"
  >
    ✓
  </CheckboxPrimitive.Indicator>
));
\`\`\`

#### 2. Custom Form Elements

The second approach customizes the form elements (label and error message) while keeping the default checkbox:

\`\`\`tsx
<Checkbox
  name="required"
  label="This is a required checkbox"
  components={{
    FormLabel: CustomLabel,
    FormMessage: CustomErrorMessage,
  }}
/>
\`\`\`

With the custom form components defined as:

\`\`\`tsx
// Custom form label component
const CustomLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof FormLabel>
>(({ className, htmlFor, ...props }, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    className={\`custom-label text-purple-600 font-bold text-lg \${className}\`}
    {...props}
  >
    {props.children} ★
  </label>
));

// Custom error message component
const CustomErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof FormMessage>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={\`custom-error flex items-center text-red-500 bg-red-100 p-2 rounded-md \${className}\`}
    {...props}
  >
    <span className="mr-1 text-lg">⚠️</span> {props.children}
  </p>
));
\`\`\`

#### 3. Combining Custom Components

The third approach combines both custom checkbox and form elements:

\`\`\`tsx
// Create component objects for reuse
const customCheckboxComponents = {
  Checkbox: PurpleCheckbox,
  CheckboxIndicator: PurpleIndicator,
};

const customLabelComponents = {
  FormLabel: CustomLabel,
  FormMessage: CustomErrorMessage,
};

// Use spread operator to combine them
<Checkbox
  name="terms"
  label="Accept terms and conditions"
  components={{
    ...customCheckboxComponents,
    ...customLabelComponents,
  }}
/>
\`\`\`

### Key Points

- Always use React.forwardRef when creating custom components
- Make sure to spread the props to pass all necessary attributes
- Include the ref to maintain form functionality
- Add a displayName to your component for better debugging
- The components prop accepts replacements for Checkbox, CheckboxIndicator, FormLabel, FormMessage, and FormDescription
- You can mix and match different custom components as needed
`,
      },
      source: {
        code: `
// Custom checkbox component
const PurpleCheckbox = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>((props, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    {...props}
    className="h-8 w-8 rounded-full border-4 border-purple-500 bg-white data-[state=checked]:bg-purple-500"
  >
    {props.children}
  </CheckboxPrimitive.Root>
));

// Custom indicator
const PurpleIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>((props, ref) => (
  <CheckboxPrimitive.Indicator
    ref={ref}
    {...props}
    className="flex h-full w-full items-center justify-center text-white"
  >
    ✓
  </CheckboxPrimitive.Indicator>
));

// Custom form label component
const CustomLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof FormLabel>
>(({ className, htmlFor, ...props }, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    className={\`custom-label text-purple-600 font-bold text-lg \${className}\`}
    {...props}
  >
    {props.children} ★
  </label>
));

// Custom error message component
const CustomErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof FormMessage>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={\`custom-error flex items-center text-red-500 bg-red-100 p-2 rounded-md \${className}\`}
    {...props}
  >
    <span className="mr-1 text-lg">⚠️</span> {props.children}
  </p>
));

// Usage in form
<Checkbox
  name="terms"
  label="Accept terms and conditions"
  components={{
    ...customCheckboxComponents,
    ...customLabelComponents,
  }}
/>

<Checkbox
  name="required"
  label="This is a required checkbox"
  components={customLabelComponents}
/>`,
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
