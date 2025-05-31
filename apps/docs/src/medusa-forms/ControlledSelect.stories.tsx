import { ControlledSelect } from '@lambdacurry/medusa-forms/controlled/ControlledSelect';
import { Select } from '@lambdacurry/medusa-forms/ui/Select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';

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
const BasicSingleSelectForm = () => {
  const form = useForm({
    defaultValues: {
      country: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledSelect
          name="country"
          label="Country"
          placeholder="Select a country"
          options={countryOptions}
        />
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
        </div>
      </div>
    </FormProvider>
  );
};

export const BasicSingleSelect: Story = {
  render: () => <BasicSingleSelectForm />,
};

// 2. Single Select with Default Value
const DefaultValueSelectForm = () => {
  const form = useForm({
    defaultValues: {
      country: 'us',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledSelect
          name="country"
          label="Country (with default)"
          placeholder="Select a country"
          options={countryOptions}
        />
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
        </div>
      </div>
    </FormProvider>
  );
};

export const WithDefaultValue: Story = {
  render: () => <DefaultValueSelectForm />,
};

// 3. Required Field Validation
const RequiredValidationForm = () => {
  const form = useForm({
    defaultValues: {
      requiredCountry: '',
    },
  });

  const onSubmit = (data: any) => {
    alert(`Form submitted with: ${JSON.stringify(data)}`);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px]">
        <ControlledSelect
          name="requiredCountry"
          label="Country (Required)"
          placeholder="Select a country"
          options={countryOptions}
          rules={{ required: 'Country is required' }}
        />
        <div className="mt-4 space-y-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
          {form.formState.errors.requiredCountry && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.requiredCountry.message}
            </div>
          )}
        </div>
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
        </div>
      </form>
    </FormProvider>
  );
};

export const RequiredValidation: Story = {
  render: () => <RequiredValidationForm />,
};

// 4. Loading States
const LoadingStateForm = () => {
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
          placeholder={isLoading ? "Loading..." : "Select a country"}
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
};

export const LoadingState: Story = {
  render: () => <LoadingStateForm />,
};

// 5. Custom Option Rendering (using children)
const CustomOptionRenderingForm = () => {
  const form = useForm({
    defaultValues: {
      customSelect: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledSelect
          name="customSelect"
          label="Custom Options"
          placeholder="Select an option"
        >
          <Select.Trigger />
          <Select.Value />
          <Select.Content>
            <Select.Item value="premium">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">⭐</span>
                <span>Premium Plan</span>
                <span className="text-sm text-gray-500">($29/mo)</span>
              </div>
            </Select.Item>
            <Select.Item value="standard">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">💎</span>
                <span>Standard Plan</span>
                <span className="text-sm text-gray-500">($19/mo)</span>
              </div>
            </Select.Item>
            <Select.Item value="basic">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">🌱</span>
                <span>Basic Plan</span>
                <span className="text-sm text-gray-500">($9/mo)</span>
              </div>
            </Select.Item>
          </Select.Content>
        </ControlledSelect>
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
        </div>
      </div>
    </FormProvider>
  );
};

export const CustomOptionRendering: Story = {
  render: () => <CustomOptionRenderingForm />,
};

// 6. Disabled State
const DisabledStateForm = () => {
  const form = useForm({
    defaultValues: {
      disabledSelect: 'us',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledSelect
          name="disabledSelect"
          label="Disabled Select"
          placeholder="This is disabled"
          options={countryOptions}
          disabled
        />
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
        </div>
      </div>
    </FormProvider>
  );
};

export const DisabledState: Story = {
  render: () => <DisabledStateForm />,
};

// 7. Error State
const ErrorStateForm = () => {
  const form = useForm({
    defaultValues: {
      errorSelect: '',
    },
  });

  // Manually set an error for demonstration
  form.setError('errorSelect', {
    type: 'manual',
    message: 'This field has an error',
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledSelect
          name="errorSelect"
          label="Select with Error"
          placeholder="Select a country"
          options={countryOptions}
        />
        {form.formState.errors.errorSelect && (
          <div className="mt-2 text-red-500 text-sm">
            {form.formState.errors.errorSelect.message}
          </div>
        )}
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
        </div>
      </div>
    </FormProvider>
  );
};

export const ErrorState: Story = {
  render: () => <ErrorStateForm />,
};

// 8. Small Size Variant
const SmallSizeForm = () => {
  const form = useForm({
    defaultValues: {
      smallSelect: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledSelect
          name="smallSelect"
          label="Small Size Select"
          placeholder="Select a country"
          options={countryOptions}
          size="small"
        />
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Value:</strong> {JSON.stringify(form.watch(), null, 2)}
        </div>
      </div>
    </FormProvider>
  );
};

export const SmallSize: Story = {
  render: () => <SmallSizeForm />,
};

// 9. Complex Form Integration
const ComplexFormIntegration = () => {
  const form = useForm({
    defaultValues: {
      country: '',
      category: '',
      plan: '',
      priority: '',
    },
  });

  const onSubmit = (data: any) => {
    alert(`Complete form submitted: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-4">
        <ControlledSelect
          name="country"
          label="Country"
          placeholder="Select your country"
          options={countryOptions}
          rules={{ required: 'Country is required' }}
        />
        
        <ControlledSelect
          name="category"
          label="Category"
          placeholder="Select a category"
          options={categoryOptions}
        />
        
        <ControlledSelect
          name="plan"
          label="Subscription Plan"
          placeholder="Choose a plan"
          options={[
            { label: 'Free', value: 'free' },
            { label: 'Pro', value: 'pro' },
            { label: 'Enterprise', value: 'enterprise' },
          ]}
        />
        
        <ControlledSelect
          name="priority"
          label="Priority Level"
          placeholder="Set priority"
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
            { label: 'Critical', value: 'critical' },
          ]}
          size="small"
        />

        <div className="space-y-2">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Form
          </button>
          
          <button
            type="button"
            onClick={() => form.reset()}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset Form
          </button>
        </div>

        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Values:</strong>
          <pre className="text-xs mt-2">{JSON.stringify(form.watch(), null, 2)}</pre>
        </div>
        
        <div className="mt-2 p-2 bg-red-50 rounded">
          <strong>Form Errors:</strong>
          <pre className="text-xs mt-2 text-red-600">
            {JSON.stringify(form.formState.errors, null, 2)}
          </pre>
        </div>
      </form>
    </FormProvider>
  );
};

export const ComplexFormIntegration: Story = {
  render: () => <ComplexFormIntegration />,
};

// 10. Interactive Demo with onChange Handler
const InteractiveDemoForm = () => {
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
          placeholder="Select a country"
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
};

export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoForm />,
};

