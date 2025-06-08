import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup } from '@lambdacurry/forms/remix-hook-form/radio-group';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const AVAILABLE_SIZES: RadioOption[] = [
  { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const AVAILABLE_COLORS: RadioOption[] = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
];

const formSchema = z.object({
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl'], {
    required_error: 'Please select a size',
  }),
  color: z.enum(['red', 'blue', 'green', 'yellow', 'purple'], {
    required_error: 'Please select a color',
  }),
  design: z.enum(['modern', 'classic', 'vintage'], {
    required_error: 'Please select a design',
  }),
});

type FormData = z.infer<typeof formSchema>;

// Custom label style component
const CustomLabel: ComponentType<ComponentPropsWithoutRef<typeof Label>> = (props) => {
  return <Label className="text-blue-600 font-medium" {...props} />;
};
CustomLabel.displayName = 'CustomLabel';

// Radio group example with multiple usage patterns
const RadioGroupExample = () => {
  const fetcher = useFetcher<{ message: string; data?: FormData; errors?: Record<string, { message: string }> }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: 'md',
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
          {/* Example 1: Basic usage with options prop */}
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Basic Usage</h3>
            <RadioGroup
              name="size"
              label="Select a size"
              description="Choose the size that fits you best"
              options={AVAILABLE_SIZES}
            />
          </div>

          {/* Example 2: Using options with custom styling */}
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Custom Styled Options</h3>
            <RadioGroup
              name="color"
              label="Select a color"
              description="Choose your preferred color"
              options={AVAILABLE_COLORS}
              labelClassName="text-blue-600 font-semibold"
              itemClassName="bg-gray-50 p-2 rounded-md hover:bg-gray-100"
            />
          </div>

          {/* Example 3: Using RadioGroupItem directly */}
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-4">Custom Layout with RadioGroupItem</h3>
            <RadioGroup
              name="design"
              label="Select a design style"
              description="Choose the design that matches your aesthetic"
            >
              <div className="grid grid-cols-3 gap-4">
                <RadioGroupItem
                  value="modern"
                  id="design-modern"
                  label="Modern"
                  wrapperClassName="bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all flex-col space-y-2"
                  labelClassName="text-blue-800 font-bold"
                />
                <RadioGroupItem
                  value="classic"
                  id="design-classic"
                  label="Classic"
                  wrapperClassName="bg-amber-50 p-3 rounded-lg border border-amber-100 hover:bg-amber-100 transition-all flex-col space-y-2"
                  labelClassName="text-amber-800 font-bold"
                />
                <RadioGroupItem
                  value="vintage"
                  id="design-vintage"
                  label="Vintage"
                  wrapperClassName="bg-green-50 p-3 rounded-lg border border-green-100 hover:bg-green-100 transition-all flex-col space-y-2"
                  labelClassName="text-green-800 font-bold"
                />
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button type="submit" className="mt-6">
          Submit
        </Button>

        {fetcher.data?.message && (
          <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
            <p className="text-green-700 font-medium">{fetcher.data.message}</p>
            {fetcher.data.data && (
              <pre className="mt-2 text-sm bg-white p-2 rounded-md overflow-auto">
                {JSON.stringify(fetcher.data.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return {
    message: 'Form submitted successfully!',
    data,
  };
};

const meta: Meta<typeof RadioGroup> = {
  title: 'RemixHookForm/Radio Group',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: RadioGroupExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The RadioGroup component provides multiple ways to create radio button groups. ' +
          'You can use the options prop for automatic generation, customize styling, or use RadioGroupItem directly for maximum flexibility.',
      },
      source: {
        code: `
// Method 1: Basic usage with options prop
<RadioGroup
  name="size"
  label="Select a size"
  description="Choose the size that fits you best"
  options={[
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ]}
/>

// Method 2: Custom styling with options prop
<RadioGroup
  name="color"
  label="Select a color"
  description="Choose your preferred color"
  options={AVAILABLE_COLORS}
  labelClassName="text-blue-600 font-semibold"
  itemClassName="bg-gray-50 p-2 rounded-md hover:bg-gray-100"
/>

// Method 3: Custom layout with RadioGroupItem components
<RadioGroup
  name="design"
  label="Select a design style"
  description="Choose the design that matches your aesthetic"
>
  <div className="grid grid-cols-3 gap-4">
    <RadioGroupItem
      value="modern"
      id="design-modern"
      label="Modern"
      wrapperClassName="bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all flex-col space-y-2"
      labelClassName="text-blue-800 font-bold"
    />
    <RadioGroupItem
      value="classic"
      id="design-classic"
      label="Classic"
      wrapperClassName="bg-amber-50 p-3 rounded-lg border border-amber-100 hover:bg-amber-100 transition-all flex-col space-y-2"
      labelClassName="text-amber-800 font-bold"
    />
    <RadioGroupItem
      value="vintage"
      id="design-vintage"
      label="Vintage"
      wrapperClassName="bg-green-50 p-3 rounded-lg border border-green-100 hover:bg-green-100 transition-all flex-col space-y-2"
      labelClassName="text-green-800 font-bold"
    />
  </div>
</RadioGroup>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test the first radio group (size)
    const sizeGroupElement = canvas.getByText('Basic Usage').closest('div');
    if (!sizeGroupElement) throw new Error('Size group element not found');
    const sizeGroup = within(sizeGroupElement);
    const mediumOption = sizeGroup.getByLabelText('Medium');
    expect(mediumOption).toBeChecked(); // Default value

    // Change selection
    const largeOption = sizeGroup.getByLabelText('Large');
    await userEvent.click(largeOption);
    expect(largeOption).toBeChecked();

    // Test the second radio group (color)
    const colorGroupElement = canvas.getByText('Custom Styled Options').closest('div');
    if (!colorGroupElement) throw new Error('Color group element not found');
    const colorGroup = within(colorGroupElement);
    const blueOption = colorGroup.getByLabelText('Blue');
    await userEvent.click(blueOption);
    expect(blueOption).toBeChecked();

    // Test the third radio group (design)
    const designGroupElement = canvas.getByText('Custom Layout with RadioGroupItem').closest('div');
    if (!designGroupElement) throw new Error('Design group element not found');
    const designGroup = within(designGroupElement);
    const vintageOption = designGroup.getByLabelText('Vintage');
    await userEvent.click(vintageOption);
    expect(vintageOption).toBeChecked();

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify submission results
    const resultMessage = await canvas.findByText('Form submitted successfully!');
    expect(resultMessage).toBeInTheDocument();
  },
};
