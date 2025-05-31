import { ControlledCheckbox } from '@lambdacurry/medusa-forms/controlled/ControlledCheckbox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const meta = {
  title: 'Medusa Forms/Controlled Checkbox',
  component: ControlledCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Usage Story
const BasicCheckboxForm = () => {
  const form = useForm({
    defaultValues: {
      acceptTerms: false,
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="acceptTerms" 
          label="I accept the terms and conditions" 
        />
        <div className="text-sm text-gray-600">
          Current value: {form.watch('acceptTerms') ? 'true' : 'false'}
        </div>
      </div>
    </FormProvider>
  );
};

export const BasicUsage: Story = {
  render: () => <BasicCheckboxForm />,
};

// Default Checked State Story
const DefaultCheckedForm = () => {
  const form = useForm({
    defaultValues: {
      newsletter: true,
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="newsletter" 
          label="Subscribe to newsletter" 
        />
        <div className="text-sm text-gray-600">
          Current value: {form.watch('newsletter') ? 'true' : 'false'}
        </div>
      </div>
    </FormProvider>
  );
};

export const DefaultChecked: Story = {
  render: () => <DefaultCheckedForm />,
};

// Default Unchecked State Story
const DefaultUncheckedForm = () => {
  const form = useForm({
    defaultValues: {
      marketing: false,
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="marketing" 
          label="Receive marketing emails" 
        />
        <div className="text-sm text-gray-600">
          Current value: {form.watch('marketing') ? 'true' : 'false'}
        </div>
      </div>
    </FormProvider>
  );
};

export const DefaultUnchecked: Story = {
  render: () => <DefaultUncheckedForm />,
};

// Required Field Validation Story
const RequiredValidationForm = () => {
  const form = useForm({
    defaultValues: {
      requiredField: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="requiredField" 
          label="This field is required" 
          rules={{ 
            required: 'You must check this box to continue' 
          }}
        />
        <div className="text-sm text-gray-600">
          Form valid: {form.formState.isValid ? 'Yes' : 'No'}
        </div>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={!form.formState.isValid}
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export const RequiredValidation: Story = {
  render: () => <RequiredValidationForm />,
};

// Custom Validation Message Story
const CustomValidationForm = () => {
  const form = useForm({
    defaultValues: {
      agreement: false,
    },
    mode: 'onChange',
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="agreement" 
          label="I agree to the privacy policy" 
          rules={{ 
            required: 'Please accept our privacy policy to continue',
            validate: (value) => value === true || 'You must agree to the privacy policy'
          }}
        />
        <div className="text-sm text-gray-600">
          Has errors: {form.formState.errors.agreement ? 'Yes' : 'No'}
        </div>
        {form.formState.errors.agreement && (
          <div className="text-sm text-red-600">
            Error: {form.formState.errors.agreement.message}
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export const CustomValidationMessage: Story = {
  render: () => <CustomValidationForm />,
};

// Error State Display Story
const ErrorStateForm = () => {
  const form = useForm({
    defaultValues: {
      errorField: false,
    },
  });

  // Manually trigger an error for demonstration
  React.useEffect(() => {
    form.setError('errorField', {
      type: 'manual',
      message: 'This is an example error message'
    });
  }, [form]);

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="errorField" 
          label="Checkbox with error state" 
        />
        <div className="text-sm text-gray-600">
          This checkbox demonstrates the error state styling
        </div>
      </div>
    </FormProvider>
  );
};

export const ErrorState: Story = {
  render: () => <ErrorStateForm />,
};

// Disabled State Story
const DisabledStateForm = () => {
  const form = useForm({
    defaultValues: {
      disabledUnchecked: false,
      disabledChecked: true,
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="disabledUnchecked" 
          label="Disabled unchecked checkbox" 
          disabled
        />
        <ControlledCheckbox 
          name="disabledChecked" 
          label="Disabled checked checkbox" 
          disabled
        />
        <div className="text-sm text-gray-600">
          These checkboxes are disabled and cannot be interacted with
        </div>
      </div>
    </FormProvider>
  );
};

export const DisabledState: Story = {
  render: () => <DisabledStateForm />,
};

// Multiple Checkboxes with State Management Story
const MultipleCheckboxesForm = () => {
  const form = useForm({
    defaultValues: {
      option1: false,
      option2: true,
      option3: false,
      selectAll: false,
    },
  });

  const watchedValues = form.watch(['option1', 'option2', 'option3']);
  const allSelected = watchedValues.every(Boolean);
  const someSelected = watchedValues.some(Boolean);

  React.useEffect(() => {
    form.setValue('selectAll', allSelected);
  }, [allSelected, form]);

  const handleSelectAll = (checked: boolean) => {
    form.setValue('option1', checked);
    form.setValue('option2', checked);
    form.setValue('option3', checked);
    form.setValue('selectAll', checked);
  };

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledCheckbox 
          name="selectAll" 
          label="Select All" 
          checked={allSelected ? true : someSelected ? 'indeterminate' : false}
          onChange={handleSelectAll}
        />
        <div className="ml-4 space-y-2">
          <ControlledCheckbox 
            name="option1" 
            label="Option 1" 
          />
          <ControlledCheckbox 
            name="option2" 
            label="Option 2" 
          />
          <ControlledCheckbox 
            name="option3" 
            label="Option 3" 
          />
        </div>
        <div className="text-sm text-gray-600">
          Selected: {watchedValues.filter(Boolean).length} of {watchedValues.length}
        </div>
      </div>
    </FormProvider>
  );
};

export const MultipleCheckboxes: Story = {
  render: () => <MultipleCheckboxesForm />,
};

// Form Integration Example Story
const CompleteFormExample = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      acceptTerms: false,
      newsletter: false,
      marketing: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    alert(`Form submitted with data: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input 
            {...form.register('username', { required: 'Username is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter username"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            {...form.register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter email"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <ControlledCheckbox 
            name="acceptTerms" 
            label="I accept the terms and conditions" 
            rules={{ required: 'You must accept the terms' }}
          />
          <ControlledCheckbox 
            name="newsletter" 
            label="Subscribe to newsletter" 
          />
          <ControlledCheckbox 
            name="marketing" 
            label="Receive marketing emails" 
          />
        </div>

        <div className="flex space-x-2">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!form.formState.isValid}
          >
            Submit
          </button>
          <button 
            type="button" 
            onClick={() => form.reset()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Form valid: {form.formState.isValid ? 'Yes' : 'No'}
        </div>
      </form>
    </FormProvider>
  );
};

export const CompleteFormExample: Story = {
  render: () => <CompleteFormExample />,
};
