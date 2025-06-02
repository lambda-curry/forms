import { ControlledSelect } from '@lambdacurry/medusa-forms/controlled/ControlledSelect';
import { Button } from '@lambdacurry/medusa-forms/ui/Button';
import { Select } from '@lambdacurry/medusa-forms/ui/Select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const meta = {
  title: 'Medusa Forms/Controlled Select',
  component: ControlledSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options for stories
const countryOptions = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
  { label: 'Australia', value: 'au' },
];

const categoryOptions = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Books', value: 'books' },
  { label: 'Home & Garden', value: 'home-garden' },
  { label: 'Sports', value: 'sports' },
];

// 1. Basic Single Select
export const BasicSingleSelect: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countryOptions,
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        country: '',
      },
    });

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect name="country" label="Country" options={countryOptions} />
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </div>
      </FormProvider>
    );
  },
};

// 2. Single Select with Default Value
export const WithDefaultValue: Story = {
  args: {
    name: 'country',
    label: 'Country (with default)',
    options: countryOptions,
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        country: 'us',
      },
    });

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect name="country" label="Country (with default)" options={countryOptions} />
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </div>
      </FormProvider>
    );
  },
};

// 3. Required Field Validation
export const SelectRequiredValidation: Story = {
  args: {
    name: 'requiredCountry',
    label: 'Country (Required)',
    options: countryOptions,
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        requiredCountry: '',
      },
    });

    const onSubmit = (data: unknown) => {
      alert(`Form submitted with: ${JSON.stringify(data)}`);
    };

    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px]">
          <ControlledSelect
            name="requiredCountry"
            label="Country (Required)"
            options={countryOptions}
            rules={{ required: 'Country is required' }}
          />
          <div className="mt-4 space-y-2">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
            {form.formState.errors.requiredCountry && (
              <div className="text-red-500 text-sm">{form.formState.errors.requiredCountry.message}</div>
            )}
          </div>
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </form>
      </FormProvider>
    );
  },
};

// 4. Loading States
export const LoadingState: Story = {
  args: {
    name: 'country',
    label: 'Country (Loading State)',
    options: countryOptions,
  },
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
      defaultValues: {
        country: '',
      },
    });

    const toggleLoading = () => {
      setIsLoading(!isLoading);
    };

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect
            name="country"
            label="Country (Loading State)"
            options={countryOptions}
            disabled={isLoading}
          />
          <div className="mt-4">
            <button
              type="button"
              onClick={toggleLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {isLoading ? 'Stop Loading' : 'Start Loading'}
            </button>
          </div>
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
            <br />
            <strong>Loading:</strong> {isLoading.toString()}
          </div>
        </div>
      </FormProvider>
    );
  },
};

// Plan options with custom rendering data
const planOptions = [
  {
    value: 'premium',
    label: 'Premium Plan',
    icon: '⭐',
    iconColor: 'text-yellow-500',
    price: '$29/mo',
  },
  {
    value: 'standard',
    label: 'Standard Plan',
    icon: '💎',
    iconColor: 'text-blue-500',
    price: '$19/mo',
  },
  {
    value: 'basic',
    label: 'Basic Plan',
    icon: '🌱',
    iconColor: 'text-green-500',
    price: '$9/mo',
  },
] as const;

// Reusable component for plan option rendering
const PlanOption = ({
  icon,
  iconColor,
  label,
  price,
}: { icon: string; iconColor: string; label: string; price: string }) => (
  <div className="flex items-center space-x-2">
    <span className={iconColor}>{icon}</span>
    <span>{label}</span>
    <span className="text-sm text-gray-500">({price})</span>
  </div>
);

// 5. Custom Option Rendering (using children)
export const CustomOptionRendering: Story = {
  args: {
    name: 'customSelect',
    label: 'Custom Options',
    options: planOptions.map(({ value, label }) => ({ value, label })),
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        customSelect: '',
      },
    });

    const currentValue = form.watch('customSelect');
    const selectedPlan = planOptions.find((plan) => plan.value === currentValue);

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect name="customSelect" label="Custom Options">
            <Select.Trigger>
              <Select.Value asChild>
                {selectedPlan ? (
                  <PlanOption {...selectedPlan} />
                ) : (
                  <span className="text-gray-400">Select a plan...</span>
                )}
              </Select.Value>
            </Select.Trigger>
            <Select.Content>
              {planOptions.map((plan) => (
                <Select.Item key={plan.value} value={plan.value}>
                  <PlanOption {...plan} />
                </Select.Item>
              ))}
            </Select.Content>
          </ControlledSelect>
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </div>
      </FormProvider>
    );
  },
};

// 6. Disabled State
export const SelectDisabledState: Story = {
  args: {
    name: 'disabledSelect',
    label: 'Disabled Select',
    options: countryOptions,
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        disabledSelect: 'us',
      },
    });

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect name="disabledSelect" label="Disabled Select" options={countryOptions} disabled />
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </div>
      </FormProvider>
    );
  },
};

// 7. Error State
export const SelectErrorState: Story = {
  args: {
    name: 'errorSelect',
    label: 'Select with Error',
    options: countryOptions,
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        errorSelect: '',
      },
    });

    // Manually set an error for demonstration - use useEffect to avoid infinite re-renders
    useEffect(() => {
      form.setError('errorSelect', {
        type: 'manual',
        message: 'This field has an error',
      });
    }, [form]);

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect name="errorSelect" label="Select with Error" options={countryOptions} />
          {form.formState.errors.errorSelect && (
            <div className="mt-2 text-red-500 text-sm">{form.formState.errors.errorSelect.message}</div>
          )}
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </div>
      </FormProvider>
    );
  },
};

// 8. Small Size Variant
export const SmallSize: Story = {
  args: {
    name: 'smallSelect',
    label: 'Small Size Select',
    options: countryOptions,
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        smallSelect: '',
      },
    });

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect name="smallSelect" label="Small Size Select" options={countryOptions} size="small" />
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </div>
      </FormProvider>
    );
  },
};

// 9. Complex Form Integration
export const ComplexFormIntegration: Story = {
  args: {
    name: 'country',
    label: 'Country',
    options: countryOptions,
  },
  render: () => {
    const form = useForm({
      defaultValues: {
        country: '',
        category: '',
        plan: '',
        priority: '',
      },
    });

    const onSubmit = (data: unknown) => {
      alert(`Complete form submitted: ${JSON.stringify(data, null, 2)}`);
    };

    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-4">
          <ControlledSelect
            name="country"
            label="Country"
            options={countryOptions}
            rules={{ required: 'Country is required' }}
          />

          <ControlledSelect name="category" label="Category" options={categoryOptions} />

          <ControlledSelect
            name="plan"
            label="Subscription Plan"
            options={[
              { label: 'Free', value: 'free' },
              { label: 'Pro', value: 'pro' },
              { label: 'Enterprise', value: 'enterprise' },
            ]}
          />

          <ControlledSelect
            name="priority"
            label="Priority Level"
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Critical', value: 'critical' },
            ]}
            size="small"
          />

          <div className="space-y-2">
            <Button variant="primary" type="submit" className="w-full">
              Submit Form
            </Button>

            <Button variant="secondary" type="button" onClick={() => form.reset()} className="w-full">
              Reset Form
            </Button>
          </div>

          <div className="mt-4 p-2 bg-gray-100 rounded">
            <strong>Form Values:</strong>
            <pre className="text-xs mt-2">{JSON.stringify(form.watch(), null, 2)}</pre>
          </div>

          <div className="mt-2 p-2 bg-red-50 rounded">
            <strong>Form Errors:</strong>
            <pre className="text-xs mt-2 text-red-600">{JSON.stringify(form.formState.errors, null, 2)}</pre>
          </div>
        </form>
      </FormProvider>
    );
  },
};

// 10. Interactive Demo with onChange Handler
export const InteractiveDemo: Story = {
  args: {
    name: 'interactiveSelect',
    label: 'Interactive Select',
    options: countryOptions,
  },
  render: () => {
    const [selectedValue, setSelectedValue] = useState('');
    const form = useForm({
      defaultValues: {
        interactiveSelect: '',
      },
    });

    const handleSelectChange = (value: unknown) => {
      setSelectedValue(value as string);
      console.log('Select value changed:', value);
    };

    return (
      <FormProvider {...form}>
        <div className="w-[400px]">
          <ControlledSelect
            name="interactiveSelect"
            label="Interactive Select"
            options={countryOptions}
            onChange={handleSelectChange}
          />
          <div className="mt-4 p-2 bg-blue-50 rounded">
            <strong>External State Value:</strong> {selectedValue || 'None'}
          </div>
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
          </div>
        </div>
      </FormProvider>
    );
  },
};
