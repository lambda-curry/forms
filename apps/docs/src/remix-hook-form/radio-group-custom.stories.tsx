import { zodResolver } from '@hookform/resolvers/zod';
import { FormLabel, FormMessage } from '@lambdacurry/forms/remix-hook-form/form';
import { RadioGroup } from '@lambdacurry/forms/remix-hook-form/radio-group';
import { RadioGroupItem } from '@lambdacurry/forms/remix-hook-form/radio-group-item';
import { Button } from '@lambdacurry/forms/ui/button';
import { cn } from '@lambdacurry/forms/ui/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { type ActionFunctionArgs, Form, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise'], {
    required_error: 'You need to select a plan',
  }),
  requiredPlan: z.enum(['starter', 'pro', 'enterprise'], {
    required_error: 'This field is required',
  }),
});

type FormData = z.infer<typeof formSchema>;

// Custom FormLabel component that makes the entire area clickable
const FullWidthCardLabel = ({ className, children, htmlFor, ...props }: ComponentPropsWithoutRef<'label'>) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'absolute inset-0 cursor-pointer flex items-center p-4 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
};

// Custom radio group component
const PurpleRadioGroup = (props: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) => {
  return (
    <RadioGroupPrimitive.Root
      className="flex flex-col space-y-4 border-2 border-purple-300 rounded-lg p-4 bg-purple-50"
      {...props}
    />
  );
};
PurpleRadioGroup.displayName = 'PurpleRadioGroup';

// Custom radio group item component
const PurpleRadioGroupItem = (
  props: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    indicator?: ReactNode;
  },
) => {
  return (
    <RadioGroupPrimitive.Item
      className="h-6 w-6 rounded-full border-2 border-purple-500 text-purple-600 ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {props.children}
    </RadioGroupPrimitive.Item>
  );
};
PurpleRadioGroupItem.displayName = 'PurpleRadioGroupItem';

// Custom radio group indicator component
const PurpleRadioGroupIndicator = (props: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>) => {
  return (
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center" {...props}>
      <div className="h-3 w-3 rounded-full bg-purple-500" />
    </RadioGroupPrimitive.Indicator>
  );
};
PurpleRadioGroupIndicator.displayName = 'PurpleRadioGroupIndicator';

// Custom radio group indicator with icon
const IconRadioGroupIndicator = (props: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>) => {
  return (
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-600"
        aria-hidden="true"
      >
        <title>Checkmark</title>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </RadioGroupPrimitive.Indicator>
  );
};
IconRadioGroupIndicator.displayName = 'IconRadioGroupIndicator';

// Custom form label component
const PurpleLabel = (props: ComponentPropsWithoutRef<typeof FormLabel>) => (
  <FormLabel className="text-purple-700 font-bold text-lg" {...props} />
);
PurpleLabel.displayName = 'PurpleLabel';

// Custom error message component
const PurpleErrorMessage = (props: ComponentPropsWithoutRef<typeof FormMessage>) => (
  <FormMessage className="text-red-500 bg-red-50 p-2 rounded-md border border-red-200 mt-1" {...props} />
);
PurpleErrorMessage.displayName = 'PurpleErrorMessage';

// Card-style radio group item component
const CardRadioGroupItem = (props: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>) => {
  const { value, children, className, ...otherProps } = props;

  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        'relative w-full p-4 border-2 rounded-lg transition-all',
        'data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-50',
        'data-[state=unchecked]:border-gray-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2',
        className,
      )}
      {...otherProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">{children}</div>
        <div className="flex items-center justify-center h-5 w-5">
          <RadioGroupPrimitive.Indicator>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600"
              aria-hidden="true"
            >
              <title>Selected</title>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </RadioGroupPrimitive.Indicator>
        </div>
      </div>
    </RadioGroupPrimitive.Item>
  );
};
CardRadioGroupItem.displayName = 'CardRadioGroupItem';

const CustomRadioGroupExample = () => {
  const fetcher = useFetcher<{ message?: string; errors?: Record<string, { message: string }> }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: undefined,
      requiredPlan: undefined,
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <div className="space-y-8">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Custom Radio Group Container</h3>
            <RadioGroup
              name="plan"
              label="Select a plan"
              description="Choose the plan that best fits your needs."
              className="space-y-2"
              radioGroupClassName="flex flex-col space-y-4 border-2 border-purple-300 rounded-lg p-4 bg-purple-50"
              components={{
                FormLabel: PurpleLabel,
                FormMessage: PurpleErrorMessage,
              }}
            >
              <RadioGroupItem value="starter" id="starter-1" label="Starter" />
              <RadioGroupItem value="pro" id="pro-1" label="Pro" />
              <RadioGroupItem value="enterprise" id="enterprise-1" label="Enterprise" />
            </RadioGroup>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Custom Radio Items</h3>
            <RadioGroup
              name="plan"
              label="Select a plan"
              description="Choose the plan that best fits your needs."
              className="space-y-2"
            >
              <RadioGroupItem
                value="starter"
                id="starter-2"
                label="Starter"
                labelClassName="text-purple-700"
                components={{
                  RadioGroupItem: PurpleRadioGroupItem,
                  RadioGroupIndicator: PurpleRadioGroupIndicator,
                }}
              />
              <RadioGroupItem
                value="pro"
                id="pro-2"
                label="Pro"
                labelClassName="text-purple-700"
                components={{
                  RadioGroupItem: PurpleRadioGroupItem,
                  RadioGroupIndicator: PurpleRadioGroupIndicator,
                }}
              />
              <RadioGroupItem
                value="enterprise"
                id="enterprise-2"
                label="Enterprise"
                labelClassName="text-purple-700"
                components={{
                  RadioGroupItem: PurpleRadioGroupItem,
                  RadioGroupIndicator: PurpleRadioGroupIndicator,
                }}
              />
            </RadioGroup>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Custom Radio Items with Icon</h3>
            <RadioGroup
              name="plan"
              label="Select a plan"
              description="Choose the plan that best fits your needs."
              className="space-y-2"
            >
              <RadioGroupItem
                value="starter"
                id="starter-3"
                label="Starter"
                components={{
                  RadioGroupItem: PurpleRadioGroupItem,
                  RadioGroupIndicator: IconRadioGroupIndicator,
                  Label: PurpleLabel,
                }}
              />
              <RadioGroupItem
                value="pro"
                id="pro-3"
                label="Pro"
                components={{
                  RadioGroupItem: PurpleRadioGroupItem,
                  RadioGroupIndicator: IconRadioGroupIndicator,
                  Label: PurpleLabel,
                }}
              />
              <RadioGroupItem
                value="enterprise"
                id="enterprise-3"
                label="Enterprise"
                components={{
                  RadioGroupItem: PurpleRadioGroupItem,
                  RadioGroupIndicator: IconRadioGroupIndicator,
                  Label: PurpleLabel,
                }}
              />
            </RadioGroup>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Card-Style Radio Buttons</h3>
            <RadioGroup
              name="plan"
              label="Select a plan"
              description="Choose the plan that best fits your needs."
              className="space-y-4"
            >
              <RadioGroupItem
                value="starter"
                id="starter-4"
                className="sr-only"
                wrapperClassName="relative h-[100px] rounded-lg transition-colors transition-border duration-500 ease-in-out border-2 border-gray-200 hover:bg-purple-100 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-100"
                label={
                  <div className="flex flex-col">
                    <div className="text-lg font-bold text-purple-700 transition-colors duration-500">Starter</div>
                    <div className="text-sm text-gray-500 mt-1 transition-colors duration-500">
                      Perfect for small projects
                    </div>
                  </div>
                }
                components={{
                  Label: FullWidthCardLabel,
                }}
              />

              <RadioGroupItem
                value="pro"
                id="pro-4"
                className="sr-only"
                wrapperClassName="relative h-[100px] rounded-lg transition-colors transition-border duration-500 ease-in-out border-2 border-gray-200 hover:bg-purple-100 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-100"
                label={
                  <div className="flex flex-col">
                    <div className="text-lg font-bold text-purple-700 transition-colors duration-500">Pro</div>
                    <div className="text-sm text-gray-500 mt-1 transition-colors duration-500">
                      For professional developers
                    </div>
                  </div>
                }
                components={{
                  Label: FullWidthCardLabel,
                }}
              />

              <RadioGroupItem
                value="enterprise"
                id="enterprise-4"
                className="sr-only"
                wrapperClassName="relative h-[100px] rounded-lg transition-colors transition-border duration-500 ease-in-out border-2 border-gray-200 hover:bg-purple-100 has-[&:checked]:border-purple-500 has-[&:checked]:bg-purple-100"
                label={
                  <div className="flex flex-col">
                    <div className="text-lg font-bold text-purple-700 transition-colors duration-500">Enterprise</div>
                    <div className="text-sm text-gray-500 mt-1 transition-colors duration-500">
                      Advanced features for teams
                    </div>
                  </div>
                }
                components={{
                  Label: FullWidthCardLabel,
                }}
              />
            </RadioGroup>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Required Radio Group</h3>
            <RadioGroup
              name="requiredPlan"
              label="Select a required plan"
              description="This field is required."
              options={[
                { value: 'starter', label: 'Starter', id: 'starter-5' },
                { value: 'pro', label: 'Pro', id: 'pro-5' },
                { value: 'enterprise', label: 'Enterprise', id: 'enterprise-5' },
              ]}
              components={{
                FormMessage: PurpleErrorMessage,
              }}
            />
          </div>
        </div>

        <Button type="submit" className="mt-6 bg-purple-600 hover:bg-purple-700">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { errors, receivedValues: defaultValues } = await getValidatedFormData<FormData>(
    request,
    zodResolver(formSchema),
  );

  if (errors) {
    return { errors, defaultValues };
  }

  return { message: 'Plan selected successfully' };
};

const meta: Meta<typeof RadioGroup> = {
  title: 'RemixHookForm/Radio Group Customized',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomComponents: Story = {
  render: () => <CustomRadioGroupExample />,
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomRadioGroupExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Examples of different ways to customize radio group components.',
      },
      source: {
        code: `
import { RadioGroup } from '@lambdacurry/forms/remix-hook-form/radio-group';
import { RadioGroupItem } from '@lambdacurry/forms/remix-hook-form/radio-group-item';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '@lambdacurry/forms/ui/utils';

/**
 * Example 1: Custom Container Styling
 * 
 * You can customize the container by using the radioGroupClassName prop.
 * This applies custom styles to the RadioGroup container without changing its behavior.
 */
<RadioGroup
  name="plan"
  label="Select a plan"
  description="Choose the plan that best fits your needs."
  className="space-y-2"
  radioGroupClassName="flex flex-col space-y-4 border-2 border-purple-300 rounded-lg p-4 bg-purple-50"
  components={{
    FormLabel: PurpleLabel,
    FormMessage: PurpleErrorMessage,
  }}
>
  <RadioGroupItem value="starter" id="starter-1" label="Starter" />
  <RadioGroupItem value="pro" id="pro-1" label="Pro" />
  <RadioGroupItem value="enterprise" id="enterprise-1" label="Enterprise" />
</RadioGroup>

/**
 * Example 2: Custom Radio Items
 * 
 * You can customize the radio items by passing custom components through
 * the components prop of RadioGroupItem.
 */
<RadioGroup
  name="plan"
  label="Select a plan"
  description="Choose the plan that best fits your needs."
  className="space-y-2"
>
  <RadioGroupItem
    value="starter"
    id="starter-2"
    label="Starter"
    labelClassName="text-purple-700"
    components={{
      RadioGroupItem: PurpleRadioGroupItem,
      RadioGroupIndicator: PurpleRadioGroupIndicator,
    }}
  />
  {/* More radio items */}
</RadioGroup>

/**
 * Example 3: Using RadioGroupItem with built-in label and custom Label component
 * 
 * Our RadioGroupItem component can use a custom Label component
 */
<RadioGroup
  name="plan"
  label="Select a plan"
  description="Choose the plan that best fits your needs."
  className="space-y-2"
>
  <RadioGroupItem
    value="starter"
    id="starter-3"
    label="Starter"
    components={{
      RadioGroupItem: PurpleRadioGroupItem,
      RadioGroupIndicator: IconRadioGroupIndicator,
      Label: PurpleLabel,
    }}
  />
  <RadioGroupItem
    value="pro"
    id="pro-3"
    label="Pro"
    components={{
      RadioGroupItem: PurpleRadioGroupItem,
      RadioGroupIndicator: IconRadioGroupIndicator,
      Label: PurpleLabel,
    }}
  />
  {/* More radio items */}
</RadioGroup>

/**
 * Example 4: Using options prop for automatic items with labels
 * 
 * You can use the options prop to automatically generate radio items with labels
 */
<RadioGroup
  name="plan"
  label="Select a plan"
  description="Choose the plan that best fits your needs."
  className="space-y-4"
  options={[
    { value: 'starter', label: 'Starter', id: 'starter-4' },
    { value: 'pro', label: 'Pro', id: 'pro-4' },
    { value: 'enterprise', label: 'Enterprise', id: 'enterprise-4' }
  ]}
  itemClassName="bg-purple-50 p-3 rounded-lg border border-purple-100 hover:bg-purple-100 transition-all"
  labelClassName="text-purple-800 font-bold"
/>

/**
 * Example 5: Required Radio Group with options prop
 * 
 * You can create a required radio group with automatic items
 */
<RadioGroup
  name="requiredPlan" // This field is required in the Zod schema
  label="Select a required plan"
  description="This field is required."
  options={[
    { value: 'starter', label: 'Starter', id: 'starter-5' },
    { value: 'pro', label: 'Pro', id: 'pro-5' },
    { value: 'enterprise', label: 'Enterprise', id: 'enterprise-5' }
  ]}
  components={{
    FormMessage: PurpleErrorMessage, // Custom error message styling
  }}
/>

// Zod schema with required field
const formSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise'], {
    required_error: 'You need to select a plan',
  }),
  requiredPlan: z.enum(['starter', 'pro', 'enterprise'], {
    required_error: 'This field is required',
  }),
});`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test 1: Verify custom labels are rendered
    const planLabels = canvas.getAllByText('Select a plan');
    expect(planLabels.length).toBeGreaterThan(0);

    // Find section with custom radio items
    const customRadioItemSection = canvas.getByText('Custom Radio Items with Icon').closest('div');
    expect(customRadioItemSection).toBeTruthy();

    // Verify radio labels exist
    const starterLabel = within(customRadioItemSection as HTMLElement).getByText('Starter');
    expect(starterLabel).toBeInTheDocument();

    // Test 2: Verify card-style radio buttons work
    const cardStyleContainer = canvas.getByText('Card-Style Radio Buttons').closest('div');
    if (!cardStyleContainer) {
      throw new Error('Could not find card-style container');
    }

    // Find all radio inputs in the card-style container and select the one with "enterprise" value
    // A more reliable approach than looking for text and closest button
    const radioInputs = within(cardStyleContainer as HTMLElement).getAllByRole('radio');
    const enterpriseOption = radioInputs.find((input) => input.getAttribute('value') === 'enterprise');

    if (!enterpriseOption) {
      throw new Error('Could not find Enterprise radio option');
    }

    await userEvent.click(enterpriseOption);
    expect(enterpriseOption).toBeChecked();

    // Test 3: Verify required field validation
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Should show error message for required field
    const errorMessage = await canvas.findByText('This field is required');
    expect(errorMessage).toBeInTheDocument();

    // Test 4: Select an option in the required field and submit
    const requiredContainer = canvas.getByText('Required Radio Group').closest('div');
    if (!requiredContainer) {
      throw new Error('Could not find required radio group container');
    }

    // Find all radio inputs in the required container and select the one for "Pro"
    const requiredRadioInputs = within(requiredContainer as HTMLElement).getAllByRole('radio');
    const proOption = requiredRadioInputs.find((input) => input.getAttribute('value') === 'pro');

    if (!proOption) {
      throw new Error('Could not find Pro option in required field');
    }

    await userEvent.click(proOption);

    // Submit the form again
    await userEvent.click(submitButton);

    // Wait for success message
    const successMessage = await canvas.findByText('Plan selected successfully');
    expect(successMessage).toBeInTheDocument();
  },
};
