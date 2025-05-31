import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledCurrencyInput } from '@lambdacurry/medusa-forms/controlled/ControlledCurrencyInput';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Medusa Forms/Controlled Currency Input',
  component: ControlledCurrencyInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    symbol: '$',
    code: 'usd',
  },
} satisfies Meta<typeof ControlledCurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

interface CurrencyFormData {
  price: string;
}

// Base wrapper component for stories
const CurrencyInputWithHookForm = ({
  currency = 'USD',
  symbol = '$',
  code = 'usd',
  schema,
  defaultValues = { price: '' },
  ...props
}: {
  currency?: string;
  symbol?: string;
  code?: string;
  schema?: z.ZodSchema<any>;
  defaultValues?: CurrencyFormData;
  [key: string]: any;
}) => {
  const form = useForm<CurrencyFormData>({
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
          symbol={symbol}
          code={code}
          {...props}
        />
      </div>
    </FormProvider>
  );
};

// 1. Different Currency Symbols
export const USDCurrency: Story = {
  args: {
    name: 'price',
    symbol: '$',
    code: 'usd',
  },
  render: (args) => <CurrencyInputWithHookForm currency="USD" symbol={args.symbol} code={args.code} />,
};

export const EURCurrency: Story = {
  args: {
    name: 'price',
    symbol: '€',
    code: 'eur',
  },
  render: (args) => <CurrencyInputWithHookForm currency="EUR" symbol={args.symbol} code={args.code} />,
};

export const GBPCurrency: Story = {
  args: {
    name: 'price',
    symbol: '£',
    code: 'gbp',
  },
  render: (args) => <CurrencyInputWithHookForm currency="GBP" symbol={args.symbol} code={args.code} />,
};

// 2. Validation with Min/Max Values
const minValidationSchema = z.object({
  price: z.string().refine((val) => {
    const num = Number.parseFloat(val);
    return !Number.isNaN(num) && num >= 10;
  }, 'Minimum price is $10'),
});

export const MinimumValueValidation: Story = {
  args: {
    name: 'price',
    symbol: '$',
    code: 'usd',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="USD"
      symbol={args.symbol}
      code={args.code}
      schema={minValidationSchema}
      defaultValues={{ price: '5' }}
      label="Price (Min $10)"
    />
  ),
};

const maxValidationSchema = z.object({
  price: z.string().refine((val) => {
    const num = Number.parseFloat(val);
    return !Number.isNaN(num) && num <= 1000;
  }, 'Maximum price is $1000'),
});

export const MaximumValueValidation: Story = {
  args: {
    name: 'price',
    symbol: '$',
    code: 'usd',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="USD"
      symbol={args.symbol}
      code={args.code}
      schema={maxValidationSchema}
      defaultValues={{ price: '1500' }}
      label="Price (Max $1000)"
    />
  ),
};

const rangeValidationSchema = z.object({
  price: z.string().refine((val) => {
    const num = Number.parseFloat(val);
    return !Number.isNaN(num) && num >= 50 && num <= 500;
  }, 'Price must be between $50 and $500'),
});

export const RangeValidation: Story = {
  args: {
    name: 'price',
    symbol: '$',
    code: 'usd',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="USD"
      symbol={args.symbol}
      code={args.code}
      schema={rangeValidationSchema}
      defaultValues={{ price: '25' }}
      label="Price ($50 - $500)"
    />
  ),
};

// 3. Error Handling and Validation Messages
const requiredSchema = z.object({
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => {
      const num = Number.parseFloat(val);
      return !Number.isNaN(num) && num > 0;
    }, 'Price must be greater than 0'),
});

export const RequiredFieldValidation: Story = {
  args: {
    symbol: '$',
    code: 'usd',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="USD"
      symbol={args.symbol}
      code={args.code}
      schema={requiredSchema}
      label="Required Price *"
      required
    />
  ),
};

const customValidationSchema = z.object({
  price: z.string().refine((val) => {
    const num = Number.parseFloat(val);
    return !Number.isNaN(num) && num >= 1 && num <= 100;
  }, 'Custom error: Price must be between $1 and $100'),
});

export const CustomValidationMessage: Story = {
  args: {
    symbol: '$',
    code: 'usd',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="USD"
      symbol={args.symbol}
      code={args.code}
      schema={customValidationSchema}
      defaultValues={{ price: '150' }}
      label="Custom Validation Messages"
    />
  ),
};

// 4. Different Currency Codes
export const JPYCurrency: Story = {
  args: {
    symbol: '¥',
    code: 'jpy',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="JPY"
      symbol={args.symbol}
      code={args.code}
      defaultValues={{ price: '11000' }}
      label="Price (JPY)"
    />
  ),
};

export const CADCurrency: Story = {
  args: {
    symbol: 'C$',
    code: 'cad',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="CAD"
      symbol={args.symbol}
      code={args.code}
      defaultValues={{ price: '125.75' }}
      label="Price (CAD)"
    />
  ),
};

export const AUDCurrency: Story = {
  args: {
    name: 'price',
    symbol: 'A$',
    code: 'aud',
  },
  render: (args) => (
    <CurrencyInputWithHookForm
      currency="AUD"
      symbol={args.symbol}
      code={args.code}
      defaultValues={{ price: '135.50' }}
      label="Price (AUD)"
    />
  ),
};
