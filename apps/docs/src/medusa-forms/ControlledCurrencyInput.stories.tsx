import { ControlledCurrencyInput } from '@lambdacurry/medusa-forms/controlled/ControlledCurrencyInput';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const meta = {
  title: 'Medusa Forms/Controlled Currency Input',
  component: ControlledCurrencyInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledCurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base wrapper component for stories
const CurrencyInputWithHookForm = ({ 
  currency = 'USD', 
  schema,
  defaultValues = { price: '' },
  ...props 
}) => {
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledCurrencyInput 
          name="price" 
          label="Price" 
          currency={currency}
          {...props}
        />
      </div>
    </FormProvider>
  );
};

// 1. Different Currency Symbols
export const USDCurrency: Story = {
  render: () => <CurrencyInputWithHookForm currency="USD" />,
};

export const EURCurrency: Story = {
  render: () => <CurrencyInputWithHookForm currency="EUR" />,
};

export const GBPCurrency: Story = {
  render: () => <CurrencyInputWithHookForm currency="GBP" />,
};

// 2. Validation with Min/Max Values
const minValidationSchema = z.object({
  price: z.number().min(10, 'Minimum price is $10'),
});

export const MinimumValueValidation: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="USD"
      schema={minValidationSchema}
      defaultValues={{ price: 5 }}
      label="Price (Min $10)"
    />
  ),
};

const maxValidationSchema = z.object({
  price: z.number().max(1000, 'Maximum price is $1000'),
});

export const MaximumValueValidation: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="USD"
      schema={maxValidationSchema}
      defaultValues={{ price: 1500 }}
      label="Price (Max $1000)"
    />
  ),
};

const rangeValidationSchema = z.object({
  price: z.number()
    .min(50, 'Price must be at least $50')
    .max(500, 'Price cannot exceed $500'),
});

export const RangeValidation: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="USD"
      schema={rangeValidationSchema}
      defaultValues={{ price: 25 }}
      label="Price ($50 - $500)"
    />
  ),
};

// 3. Error Handling and Validation Messages
const requiredSchema = z.object({
  price: z.number().min(0.01, 'Price is required'),
});

export const RequiredFieldValidation: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="USD"
      schema={requiredSchema}
      label="Required Price *"
      required
    />
  ),
};

const customValidationSchema = z.object({
  price: z.number()
    .min(1, 'Custom error: Price must be at least $1')
    .max(100, 'Custom error: Price cannot exceed $100'),
});

export const CustomValidationMessage: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="USD"
      schema={customValidationSchema}
      defaultValues={{ price: 150 }}
      label="Custom Validation Messages"
    />
  ),
};

// 4. Different Currency Codes
export const JPYCurrency: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="JPY" 
      defaultValues={{ price: 11000 }}
      label="Price (JPY)"
    />
  ),
};

export const CADCurrency: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="CAD" 
      defaultValues={{ price: 125.75 }}
      label="Price (CAD)"
    />
  ),
};

export const AUDCurrency: Story = {
  render: () => (
    <CurrencyInputWithHookForm 
      currency="AUD" 
      defaultValues={{ price: 135.50 }}
      label="Price (AUD)"
    />
  ),
};

