import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup } from '@lambdacurry/forms/remix-hook-form/radio-group';
import { Button } from '@lambdacurry/forms/ui/button';
import { FormLabel, FormMessage } from '@lambdacurry/forms/ui/form';
import { RadioGroupItem } from '@lambdacurry/forms/ui/radio-group';
import { cn } from '@lambdacurry/forms/ui/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type * as React from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { Form, useFetcher } from 'react-router';
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

// Custom radio group component
const PurpleRadioGroup = (props: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>) => {
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
  props: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    indicator?: React.ReactNode;
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
const PurpleRadioGroupIndicator = (props: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>) => {
  return (
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center" {...props}>
      <div className="h-3 w-3 rounded-full bg-purple-500" />
    </RadioGroupPrimitive.Indicator>
  );
};
PurpleRadioGroupIndicator.displayName = 'PurpleRadioGroupIndicator';

// Custom radio group indicator with icon
const IconRadioGroupIndicator = (props: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>) => {
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
const PurpleLabel = (props: React.ComponentPropsWithoutRef<typeof FormLabel>) => (
  <FormLabel className="text-purple-700 font-bold text-lg" {...props} />
);
PurpleLabel.displayName = 'PurpleLabel';

// Custom error message component
const PurpleErrorMessage = (props: React.ComponentPropsWithoutRef<typeof FormMessage>) => (
  <FormMessage className="text-red-500 bg-red-50 p-2 rounded-md border border-red-200 mt-1" {...props} />
);
PurpleErrorMessage.displayName = 'PurpleErrorMessage';

// Card-style radio group item component
const CardRadioGroupItem = (props: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>) => {
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="starter" id="starter-1" />
                <label htmlFor="starter-1">Starter</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id="pro-1" />
                <label htmlFor="pro-1">Pro</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enterprise" id="enterprise-1" />
                <label htmlFor="enterprise-1">Enterprise</label>
              </div>
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="starter"
                  id="starter-2"
                  components={{
                    RadioGroupItem: PurpleRadioGroupItem,
                    RadioGroupIndicator: PurpleRadioGroupIndicator,
                  }}
                />
                <label htmlFor="starter-2" className="text-purple-700">
                  Starter
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="pro"
                  id="pro-2"
                  components={{
                    RadioGroupItem: PurpleRadioGroupItem,
                    RadioGroupIndicator: PurpleRadioGroupIndicator,
                  }}
                />
                <label htmlFor="pro-2" className="text-purple-700">
                  Pro
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="enterprise"
                  id="enterprise-2"
                  components={{
                    RadioGroupItem: PurpleRadioGroupItem,
                    RadioGroupIndicator: PurpleRadioGroupIndicator,
                  }}
                />
                <label htmlFor="enterprise-2" className="text-purple-700">
                  Enterprise
                </label>
              </div>
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
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="starter"
                  id="starter-3"
                  components={{
                    RadioGroupItem: PurpleRadioGroupItem,
                    RadioGroupIndicator: IconRadioGroupIndicator,
                  }}
                />
                <label htmlFor="starter-3" className="text-purple-700">
                  Starter
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="pro"
                  id="pro-3"
                  components={{
                    RadioGroupItem: PurpleRadioGroupItem,
                    RadioGroupIndicator: IconRadioGroupIndicator,
                  }}
                />
                <label htmlFor="pro-3" className="text-purple-700">
                  Pro
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="enterprise"
                  id="enterprise-3"
                  components={{
                    RadioGroupItem: PurpleRadioGroupItem,
                    RadioGroupIndicator: IconRadioGroupIndicator,
                  }}
                />
                <label htmlFor="enterprise-3" className="text-purple-700">
                  Enterprise
                </label>
              </div>
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
              <CardRadioGroupItem className="text-left" value="starter" id="starter-4">
                <div className="font-medium">Starter</div>
                <div className="text-sm text-gray-500">Perfect for beginners</div>
              </CardRadioGroupItem>

              <CardRadioGroupItem className="text-left" value="pro" id="pro-4">
                <div className="font-medium">Pro</div>
                <div className="text-sm text-gray-500">For professional users</div>
              </CardRadioGroupItem>

              <CardRadioGroupItem className="text-left" value="enterprise" id="enterprise-4">
                <div className="font-medium">Enterprise</div>
                <div className="text-sm text-gray-500">For large organizations</div>
              </CardRadioGroupItem>
            </RadioGroup>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Required Radio Group</h3>
            <RadioGroup
              name="requiredPlan"
              label="Select a required plan"
              description="This field is required."
              className="space-y-2"
              components={{
                FormMessage: PurpleErrorMessage,
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="starter" id="starter-5" />
                <label htmlFor="starter-5">Starter</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id="pro-5" />
                <label htmlFor="pro-5">Pro</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enterprise" id="enterprise-5" />
                <label htmlFor="enterprise-5">Enterprise</label>
              </div>
            </RadioGroup>
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
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

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
import { RadioGroupItem } from '@lambdacurry/forms/ui/radio-group';
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
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="starter" id="starter-1" />
    <label htmlFor="starter-1">Starter</label>
  </div>
  {/* More radio items */}
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
  <div className="flex items-center space-x-2">
    <RadioGroupItem
      value="starter"
      id="starter-2"
      components={{
        RadioGroupItem: PurpleRadioGroupItem,
        RadioGroupIndicator: PurpleRadioGroupIndicator,
      }}
    />
    <label htmlFor="starter-2" className="text-purple-700">
      Starter
    </label>
  </div>
  {/* More radio items */}
</RadioGroup>

/**
 * Example 3: Custom Radio Items with Icon
 * 
 * You can replace the default indicator with a custom icon.
 * This example uses an SVG checkmark instead of the default circle.
 */
<RadioGroup
  name="plan"
  label="Select a plan"
  description="Choose the plan that best fits your needs."
  className="space-y-2"
>
  <div className="flex items-center space-x-2">
    <RadioGroupItem
      value="starter"
      id="starter-3"
      components={{
        RadioGroupItem: PurpleRadioGroupItem,
        RadioGroupIndicator: IconRadioGroupIndicator, // Custom SVG icon indicator
      }}
    />
    <label htmlFor="starter-3" className="text-purple-700">
      Starter
    </label>
  </div>
  {/* More radio items */}
</RadioGroup>

/**
 * Example 4: Card-Style Radio Buttons
 * 
 * You can completely transform the appearance of radio buttons
 * by creating a custom component that uses RadioGroupPrimitive.Item.
 * This example creates card-style radio buttons with rich content.
 */

// Card-style radio group item component
const CardRadioGroupItem = React.forwardRef((props, ref) => {
  const { value, children, className, ...otherProps } = props;
  
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        "relative w-full p-4 border-2 rounded-lg transition-all",
        "data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-50",
        "data-[state=unchecked]:border-gray-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
        className
      )}
      {...otherProps}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          {children}
        </div>
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
});

// Usage with card-style radio buttons
<RadioGroup
  name="plan"
  label="Select a plan"
  description="Choose the plan that best fits your needs."
  className="space-y-4"
>
  <CardRadioGroupItem value="starter" id="starter-4">
    <div className="font-medium">Starter</div>
    <div className="text-sm text-gray-500">Perfect for beginners</div>
  </CardRadioGroupItem>
  
  <CardRadioGroupItem value="pro" id="pro-4">
    <div className="font-medium">Pro</div>
    <div className="text-sm text-gray-500">For professional users</div>
  </CardRadioGroupItem>
  
  <CardRadioGroupItem value="enterprise" id="enterprise-4">
    <div className="font-medium">Enterprise</div>
    <div className="text-sm text-gray-500">For large organizations</div>
  </CardRadioGroupItem>
</RadioGroup>

/**
 * Example 5: Required Radio Group
 * 
 * You can create a required radio group by using Zod validation.
 * This example shows how to display custom error messages when validation fails.
 */
<RadioGroup
  name="requiredPlan" // This field is required in the Zod schema
  label="Select a required plan"
  description="This field is required."
  className="space-y-2"
  components={{
    FormMessage: PurpleErrorMessage, // Custom error message styling
  }}
>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="starter" id="starter-5" />
    <label htmlFor="starter-5">Starter</label>
  </div>
  {/* More radio items */}
</RadioGroup>

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

    // Test 1: Verify custom label is rendered with purple styling
    const customLabel = canvas.getAllByText('Select a plan')[0];
    expect(customLabel).toHaveClass('text-purple-700');
    expect(customLabel).toHaveClass('font-bold');

    // Test 2: Verify card-style radio buttons work
    const cardStyleContainer = canvas.getByText('Card-Style Radio Buttons').closest('div');
    if (!cardStyleContainer) {
      throw new Error('Could not find card-style container');
    }

    // Find and click the Enterprise card option
    const enterpriseCard = within(cardStyleContainer as HTMLElement)
      .getByText('Enterprise')
      .closest('button');
    if (!enterpriseCard) {
      throw new Error('Could not find Enterprise card option');
    }

    await userEvent.click(enterpriseCard);
    expect(enterpriseCard).toHaveAttribute('data-state', 'checked');

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

    const proOption = within(requiredContainer as HTMLElement).getByLabelText('Pro');
    await userEvent.click(proOption);

    // Submit the form again
    await userEvent.click(submitButton);

    // Wait for success message
    const successMessage = await canvas.findByText('Plan selected successfully');
    expect(successMessage).toBeInTheDocument();
  },
};
