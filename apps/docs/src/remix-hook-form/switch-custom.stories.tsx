import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@lambdacurry/forms/remix-hook-form/switch';
import type { FormLabel, FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { Button } from '@lambdacurry/forms/ui/button';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import type * as React from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  notifications: z.boolean().default(false),
  darkMode: z.boolean().default(false),
  premium: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

// Custom Switch component
const PurpleSwitch = (props: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) => (
  <SwitchPrimitive.Root
    {...props}
    className="peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-purple-300 bg-purple-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-purple-200"
  >
    {props.children}
  </SwitchPrimitive.Root>
);
PurpleSwitch.displayName = 'PurpleSwitch';

// Custom Switch Thumb component
const PurpleSwitchThumb = (props: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>) => (
  <SwitchPrimitive.Thumb
    {...props}
    className="pointer-events-none flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0 relative overflow-hidden data-[state=checked]:[--on-opacity:1] data-[state=checked]:[--off-opacity:0] data-[state=unchecked]:[--on-opacity:0] data-[state=unchecked]:[--off-opacity:1]"
  >
    <span className="absolute inset-0 opacity-[var(--on-opacity)] flex items-center justify-center text-xs font-bold text-purple-600 transition-opacity duration-200 z-10">
      ON
    </span>
    <span className="absolute inset-0 opacity-[var(--off-opacity)] flex items-center justify-center text-xs font-bold text-purple-600 transition-opacity duration-200 z-10">
      OFF
    </span>
  </SwitchPrimitive.Thumb>
);
PurpleSwitchThumb.displayName = 'PurpleSwitchThumb';

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

// Green Switch component
const GreenSwitch = (props: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) => (
  <SwitchPrimitive.Root
    {...props}
    className="peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-green-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-white"
  >
    {props.children}
  </SwitchPrimitive.Root>
);
GreenSwitch.displayName = 'GreenSwitch';

// Green Switch Thumb component
const GreenSwitchThumb = (props: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>) => (
  <SwitchPrimitive.Thumb
    {...props}
    className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-full bg-green-100 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-white"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-green-600 data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <title>Check mark</title>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </SwitchPrimitive.Thumb>
);
GreenSwitchThumb.displayName = 'GreenSwitchThumb';

const CustomSwitchExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notifications: false,
      darkMode: false,
      premium: false,
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
          {/* Default Switch */}
          <Switch
            name="notifications"
            label="Enable notifications"
            description="Receive notifications for important updates"
          />

          {/* Custom Switch with purple styling */}
          <Switch
            name="darkMode"
            label="Dark mode"
            description="Toggle dark mode for the application"
            components={{
              Switch: PurpleSwitch,
              SwitchThumb: PurpleSwitchThumb,
            }}
          />

          {/* Custom Switch with green styling and custom form components */}
          <Switch
            name="premium"
            label="Premium features"
            description="Enable premium features for your account"
            components={{
              FormLabel: PurpleLabel,
              FormMessage: PurpleMessage,
              Switch: GreenSwitch,
              SwitchThumb: GreenSwitchThumb,
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

  return { message: 'Settings updated successfully' };
};

const meta: Meta<typeof Switch> = {
  title: 'RemixHookForm/Switch Customized',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomSwitchExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomComponents: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Switch Component Customization

This example demonstrates three different approaches to customizing the Switch component:

1. **Default Styling**: The first switch uses the default styling with no customization needed.

2. **Custom Switch Elements**: The second switch customizes only the Switch and SwitchThumb components with purple styling and ON/OFF text indicators.
\`\`\`tsx
<Switch
  name="darkMode"
  label="Dark mode"
  description="Toggle dark mode for the application"
  components={{
    Switch: PurpleSwitch,
    SwitchThumb: PurpleSwitchThumb,
  }}
/>
\`\`\`

3. **Fully Customized**: The third switch demonstrates comprehensive customization of all components, including form elements and a green switch with a checkmark icon.
\`\`\`tsx
<Switch
  name="premium"
  label="Premium features"
  description="Enable premium features for your account"
  components={{
    FormLabel: PurpleLabel,
    FormMessage: PurpleMessage,
    Switch: GreenSwitch,
    SwitchThumb: GreenSwitchThumb,
  }}
/>
\`\`\`

The \`components\` prop allows you to override any of the internal components used by the Switch component, giving you complete control over the styling and behavior.
`,
      },
      source: {
        code: `
// APPROACH 1: Default Switch (no customization needed)
<Switch
  name="notifications"
  label="Enable notifications"
  description="Receive notifications for important updates"
/>

// APPROACH 2: Custom Switch with purple styling and ON/OFF text
const PurpleSwitch = React.forwardRef((props, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    {...props}
    className="peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-purple-300 bg-purple-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-purple-200"
  >
    {props.children}
  </SwitchPrimitive.Root>
));

const PurpleSwitchThumb = React.forwardRef((props, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    {...props}
    className="pointer-events-none flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0 relative overflow-hidden data-[state=checked]:[--on-opacity:1] data-[state=checked]:[--off-opacity:0] data-[state=unchecked]:[--on-opacity:0] data-[state=unchecked]:[--off-opacity:1]"
  >
    <span className="absolute inset-0 opacity-[var(--on-opacity)] flex items-center justify-center text-xs font-bold text-purple-600 transition-opacity duration-200 z-10">
      ON
    </span>
    <span className="absolute inset-0 opacity-[var(--off-opacity)] flex items-center justify-center text-xs font-bold text-purple-600 transition-opacity duration-200 z-10">
      OFF
    </span>
  </SwitchPrimitive.Thumb>
));

<Switch 
  name="darkMode" 
  label="Dark mode" 
  description="Toggle dark mode for the application"
  components={{
    Switch: PurpleSwitch,
    SwitchThumb: PurpleSwitchThumb,
  }}
/>

// APPROACH 3: Fully customized switch with green styling, checkmark icon, and custom form components
const GreenSwitch = React.forwardRef((props, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    {...props}
    className="peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-green-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-white"
  >
    {props.children}
  </SwitchPrimitive.Root>
));

const GreenSwitchThumb = React.forwardRef((props, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    {...props}
    className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-full bg-green-100 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-white"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-green-600 data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </SwitchPrimitive.Thumb>
));

const PurpleLabel = React.forwardRef((props, ref) => (
  <FormLabel ref={ref} className="text-lg font-bold text-purple-700" {...props} />
));

const PurpleMessage = React.forwardRef((props, ref) => (
  <FormMessage ref={ref} className="text-purple-500 bg-purple-50 p-2 rounded-md mt-1" {...props} />
));

<Switch
  name="premium"
  label="Premium features"
  description="Enable premium features for your account"
  components={{
    FormLabel: PurpleLabel,
    FormMessage: PurpleMessage,
    Switch: GreenSwitch,
    SwitchThumb: GreenSwitchThumb,
  }}
/>`,
      },
    },
  },
  render: () => <CustomSwitchExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find all switches
    const switches = canvas.getAllByRole('switch');
    expect(switches.length).toBe(3);

    // Toggle the custom switches
    const darkModeSwitch = canvas.getByLabelText('Dark mode');
    const premiumSwitch = canvas.getByLabelText('Premium features');

    await userEvent.click(darkModeSwitch);
    await userEvent.click(premiumSwitch);

    expect(darkModeSwitch).toBeChecked();
    expect(premiumSwitch).toBeChecked();

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify successful submission
    await expect(await canvas.findByText('Settings updated successfully')).toBeInTheDocument();
  },
};
