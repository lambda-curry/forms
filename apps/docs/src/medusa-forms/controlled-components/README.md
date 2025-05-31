# Controlled Components Stories Implementation

This directory contains Storybook stories for the Medusa Forms controlled components.

## Implementation Status

- ✅ `ControlledInput` (already exists in parent directory)
- ❌ `ControlledCheckbox` (needs story)
- ❌ `ControlledCurrencyInput` (needs story)
- ❌ `ControlledDatePicker` (needs story)
- ❌ `ControlledSelect` (needs story)
- ❌ `ControlledTextArea` (needs story)

## Story Pattern

All stories follow this pattern:
- Use `react-hook-form` directly with `FormProvider` and `useForm`
- NO react-router-stub dependencies
- Follow the pattern established in `ControlledInput.stories.tsx`
- Include multiple variants and states for each component

## Template Structure

```tsx
import { ControlledComponent } from '@lambdacurry/medusa-forms/controlled/ControlledComponent';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';

const meta = {
  title: 'Medusa Forms/Controlled Component',
  component: ControlledComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const ComponentWithHookForm = () => {
  const form = useForm({
    defaultValues: {
      fieldName: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledComponent 
          name="fieldName" 
          label="Field Label" 
          // component-specific props
        />
      </div>
    </FormProvider>
  );
};

export const Basic: Story = {
  render: () => <ComponentWithHookForm />,
};
```

