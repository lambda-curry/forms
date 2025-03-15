# Custom Form Components Project

## Overview

This document outlines our approach to allowing users of our form library to inject their own custom components while maintaining a consistent API across all form elements. This feature enables users to fully customize the appearance and behavior of form components while preserving the form handling functionality.

## High-Level Approach

We use a component injection pattern that allows users to replace any part of our form components with their own implementations. This is achieved through a consistent `components` prop that accepts custom component implementations for various parts of the form element.

### Key Principles

1. **Consistency**: All form components follow the same pattern for customization
2. **Flexibility**: Users can replace any part of a form component
3. **Type Safety**: All component replacements are properly typed
4. **Defaults**: Default components are provided if no custom components are specified
5. **Backward Compatibility**: Existing implementations continue to work without changes

## Implementation Details

### Component Interface Extensions

For each form component, we extend the base `FieldComponents` interface to include component-specific elements:

```typescript
// Base interface (already exists)
export interface FieldComponents {
  FormControl: React.ForwardRefExoticComponent<FormControlProps & React.RefAttributes<HTMLDivElement>>;
  FormDescription: React.ForwardRefExoticComponent<FormDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
  FormLabel: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
  FormMessage: React.ForwardRefExoticComponent<FormMessageProps & React.RefAttributes<HTMLParagraphElement>>;
}

// Extended interface for specific components (e.g., Checkbox)
export interface CheckboxFieldComponents extends FieldComponents {
  Checkbox?: React.ComponentType<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>;
  CheckboxIndicator?: React.ComponentType<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>>;
}
```

### Component Implementation

In the component implementation, we extract custom components from the `components` prop with fallbacks to the default components:

```typescript
const CheckboxField = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ control, name, className, label, description, components, ...props }, ref) => {
    // Extract custom components with fallbacks
    const CheckboxComponent = components?.Checkbox || CheckboxPrimitive.Root;
    const IndicatorComponent = components?.CheckboxIndicator || CheckboxPrimitive.Indicator;
    
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={cn('flex flex-row items-start space-y-0', className)} ref={ref}>
            <FormControl Component={components?.FormControl}>
              <CheckboxComponent
                ref={field.ref}
                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                checked={field.value}
                onCheckedChange={field.onChange}
                {...props}
              >
                <IndicatorComponent
                  className={cn('flex items-center justify-center text-current')}
                >
                  <Check className="h-4 w-4" />
                </IndicatorComponent>
              </CheckboxComponent>
            </FormControl>
            {/* Rest of the component */}
          </FormItem>
        )}
      />
    );
  }
);
```

### Remix Hook Form Wrapper

In the Remix Hook Form wrapper, we merge any user-provided components with the default form components:

```typescript
export function Checkbox(props: CheckboxProps) {
  const { control } = useRemixFormContext();

  const components: Partial<CheckboxFieldComponents> = {
    FormDescription,
    FormControl,
    FormLabel,
    FormMessage,
    ...props.components, // Merge user components
  };

  return <BaseCheckbox control={control} {...props} components={components} />;
}
```

## Usage Examples

### Basic Usage (No Customization)

```tsx
import { Checkbox } from '@lambdacurry/forms';

function MyForm() {
  return (
    <Checkbox 
      name="terms" 
      label="Accept terms"
    />
  );
}
```

### Custom Checkbox Component

```tsx
import { Checkbox } from '@lambdacurry/forms';
import { CheckIcon } from 'lucide-react';

// Custom checkbox component
const MyCustomCheckbox = React.forwardRef((props, ref) => (
  <div 
    ref={ref}
    className="custom-checkbox"
    data-state={props.checked ? 'checked' : 'unchecked'}
    onClick={() => props.onCheckedChange(!props.checked)}
    {...props}
  >
    {props.children}
  </div>
));

// Custom indicator component
const MyCustomIndicator = ({ className, children, ...props }) => (
  <div className="custom-indicator" {...props}>
    <CheckIcon className="h-3 w-3" />
  </div>
);

function MyForm() {
  return (
    <Checkbox 
      name="terms" 
      label="Accept terms"
      components={{
        Checkbox: MyCustomCheckbox,
        CheckboxIndicator: MyCustomIndicator
      }}
    />
  );
}
```

### Custom Form Elements

```tsx
import { Checkbox } from '@lambdacurry/forms';

// Custom form label
const MyCustomLabel = ({ className, children, ...props }) => (
  <label className="my-custom-label" {...props}>
    {children}
  </label>
);

// Custom error message
const MyCustomMessage = ({ className, children, ...props }) => (
  <div className="my-custom-error" {...props}>
    <AlertIcon className="h-4 w-4 mr-2" />
    {children}
  </div>
);

function MyForm() {
  return (
    <Checkbox 
      name="terms" 
      label="Accept terms"
      components={{
        FormLabel: MyCustomLabel,
        FormMessage: MyCustomMessage
      }}
    />
  );
}
```

## Components to Update

The following form components should be updated to support component injection:

### 1. Checkbox
```typescript
export interface CheckboxFieldComponents extends FieldComponents {
  Checkbox?: React.ComponentType<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>;
  CheckboxIndicator?: React.ComponentType<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>>;
}
```

### 2. TextField/TextInput
```typescript
export interface TextFieldComponents extends FieldComponents {
  Input?: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
}
```

### 3. TextArea
```typescript
export interface TextAreaFieldComponents extends FieldComponents {
  TextArea?: React.ComponentType<React.TextareaHTMLAttributes<HTMLTextAreaElement>>;
}
```

### 4. RadioGroup
```typescript
export interface RadioGroupFieldComponents extends FieldComponents {
  RadioGroup?: React.ComponentType<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>;
  RadioGroupItem?: React.ComponentType<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>;
  RadioGroupIndicator?: React.ComponentType<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>>;
}
```

### 5. Switch
```typescript
export interface SwitchFieldComponents extends FieldComponents {
  Switch?: React.ComponentType<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>;
  SwitchThumb?: React.ComponentType<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>>;
}
```

### 6. DatePicker
```typescript
export interface DatePickerFieldComponents extends FieldComponents {
  DatePicker?: React.ComponentType<React.ComponentPropsWithoutRef<typeof Popover>>;
  DatePickerTrigger?: React.ComponentType<React.ComponentPropsWithoutRef<typeof PopoverTrigger>>;
  DatePickerContent?: React.ComponentType<React.ComponentPropsWithoutRef<typeof PopoverContent>>;
  Calendar?: React.ComponentType<React.ComponentPropsWithoutRef<typeof DayPicker>>;
}
```

### 7. OTPInput
```typescript
export interface OTPInputFieldComponents extends FieldComponents {
  OTPInput?: React.ComponentType<React.ComponentPropsWithoutRef<typeof OTPInputPrimitive.Root>>;
  OTPInputSlot?: React.ComponentType<React.ComponentPropsWithoutRef<typeof OTPInputPrimitive.Slot>>;
  OTPInputChar?: React.ComponentType<React.ComponentPropsWithoutRef<typeof OTPInputPrimitive.Char>>;
}
```

### 8. DropdownMenuSelect
```typescript
export interface DropdownMenuSelectFieldComponents extends FieldComponents {
  DropdownMenu?: React.ComponentType<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>>;
  DropdownMenuTrigger?: React.ComponentType<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>>;
  DropdownMenuContent?: React.ComponentType<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>>;
  DropdownMenuItem?: React.ComponentType<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>>;
}
```

## Implementation Priority

1. **High Priority**:
   - Checkbox
   - TextField
   - RadioGroup
   - Switch

2. **Medium Priority**:
   - TextArea
   - DropdownMenuSelect

3. **Low Priority**:
   - DatePicker
   - OTPInput

## Implementation Template

Here's a template for implementing component injection for each form component:

```typescript
// 1. Define component-specific interface
export interface [Component]FieldComponents extends FieldComponents {
  [Component]?: React.ComponentType<React.ComponentPropsWithoutRef<typeof [Component]Primitive.Root>>;
  // Add any additional sub-components
}

// 2. Update props interface
export interface [Component]Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends [BaseProps] {
  // Existing props
  components?: Partial<[Component]FieldComponents>;
}

// 3. Update component implementation
const [Component]Field = React.forwardRef<HTML[Element]Element, [Component]Props>(
  ({ control, name, components, ...props }, ref) => {
    // Extract custom components with fallbacks
    const CustomComponent = components?.[Component] || [Component]Primitive.Root;
    
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem ref={ref}>
            {/* Use custom components */}
            <CustomComponent {...field} {...props} />
            {/* Rest of the component */}
          </FormItem>
        )}
      />
    );
  }
);

// 4. Update Remix wrapper
export function [Component](props: [Component]Props) {
  const { control } = useRemixFormContext();

  const components: Partial<[Component]FieldComponents> = {
    FormDescription,
    FormControl,
    FormLabel,
    FormMessage,
    ...props.components,
  };

  return <Base[Component] control={control} {...props} components={components} />;
}
```

## Testing Strategy

When implementing custom component injection, follow these testing steps:


## 1. Storybook Examples

Based on our existing checkbox.stories.tsx, we should create stories that demonstrate both default and custom component usage. Here's how to enhance our stories:

#### Example: Custom Checkbox Story Implementation

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import * as React from 'react';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

// Custom checkbox component
const CustomCheckbox = React.forwardRef<
  HTMLDivElement, 
  React.ComponentPropsWithoutRef<'div'> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>((props, ref) => {
  const { checked, onCheckedChange, children, className, ...rest } = props;
  
  return (
    <div 
      ref={ref}
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      className={`custom-checkbox relative flex h-6 w-6 items-center justify-center rounded-md border-2 border-primary ${
        checked ? 'bg-primary' : 'bg-background'
      } ${className}`}
      onClick={() => onCheckedChange?.(!checked)}
      {...rest}
    >
      {children}
    </div>
  );
});
CustomCheckbox.displayName = 'CustomCheckbox';

// Custom indicator component
const CustomIndicator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-white ${className}`} {...props}>
    ✓
  </div>
);

// Form schema (same as original)
const formSchema = z.object({
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  marketing: z.boolean().optional(),
  required: z.boolean().refine((val) => val === true, 'This field is required'),
});

type FormData = z.infer<typeof formSchema>;

// Example with custom components
const CustomCheckboxExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false as true,
      marketing: false,
      required: false as true,
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
          <Checkbox 
            className="rounded-md border p-4" 
            name="terms" 
            label="Accept terms and conditions"
            components={{
              Checkbox: CustomCheckbox,
              CheckboxIndicator: CustomIndicator
            }}
          />
          <Checkbox
            className="rounded-md border p-4"
            name="marketing"
            label="Receive marketing emails"
            description="We will send you hourly updates about our products"
            // Using default components for this checkbox
          />
          <Checkbox 
            className="rounded-md border p-4" 
            name="required" 
            label="This is a required checkbox"
            components={{
              Checkbox: CustomCheckbox,
              CheckboxIndicator: CustomIndicator
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

// Handler function (same as original)
const handleFormSubmission = async (request: Request) => {
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Form submitted successfully' };
};

// Story definition
export const CustomComponents: Story = {
  render: () => <CustomCheckboxExample />,
  parameters: {
    docs: {
      description: {
        story: 'Example of checkbox with custom components.',
      },
      source: {
        code: `
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';

// Custom checkbox component
const CustomCheckbox = React.forwardRef((props, ref) => {
  const { checked, onCheckedChange, children, className, ...rest } = props;
  
  return (
    <div 
      ref={ref}
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      className={\`custom-checkbox relative flex h-6 w-6 items-center justify-center rounded-md border-2 border-primary \${
        checked ? 'bg-primary' : 'bg-background'
      } \${className}\`}
      onClick={() => onCheckedChange?.(!checked)}
      {...rest}
    >
      {children}
    </div>
  );
});

// Custom indicator component
const CustomIndicator = ({ className, ...props }) => (
  <div className={\`text-white \${className}\`} {...props}>
    ✓
  </div>
);

// Usage in form
<Checkbox 
  name="terms" 
  label="Accept terms and conditions"
  components={{
    Checkbox: CustomCheckbox,
    CheckboxIndicator: CustomIndicator
  }}
/>`,
      },
    },
  },
  play: async (storyContext) => {
    const { canvas } = storyContext;
    
    // Test 1: Verify custom checkboxes are rendered
    const customCheckboxes = canvas.getAllByRole('checkbox');
    expect(customCheckboxes.length).toBe(3);
    
    // Test 2: Verify custom checkboxes can be checked
    const termsCheckbox = canvas.getByLabelText('Accept terms and conditions');
    const requiredCheckbox = canvas.getByLabelText('This is a required checkbox');
    
    await userEvent.click(termsCheckbox);
    await userEvent.click(requiredCheckbox);
    
    expect(termsCheckbox).toHaveAttribute('aria-checked', 'true');
    expect(requiredCheckbox).toHaveAttribute('aria-checked', 'true');
    
    // Test 3: Verify form submission works with custom components
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    
    await expect(await canvas.findByText('Form submitted successfully')).toBeInTheDocument();
  },
};
```

### 4. Testing Custom Form Elements

In addition to testing custom input components, we should also test custom form elements like labels and error messages:

```tsx
// Custom form elements example
const CustomFormElementsExample = () => {
  // ... form setup code ...

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="grid gap-4">
          <Checkbox 
            className="rounded-md border p-4" 
            name="terms" 
            label="Accept terms and conditions"
            components={{
              FormLabel: ({ children, ...props }) => (
                <label className="custom-label text-blue-600 font-bold" {...props}>
                  {children} ★
                </label>
              ),
              FormMessage: ({ children, ...props }) => (
                <div className="custom-error flex items-center text-red-500" {...props}>
                  <span className="mr-1">⚠️</span> {children}
                </div>
              )
            }}
          />
          {/* ... other form fields ... */}
        </div>
        <Button type="submit" className="mt-4">Submit</Button>
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Tests for custom form elements
const testCustomFormElements = async ({ canvas }: StoryContext) => {
  // Test 1: Verify custom label is rendered
  const customLabel = canvas.getByText(/Accept terms and conditions ★/);
  expect(customLabel).toHaveClass('custom-label');
  
  // Test 2: Verify custom error message is rendered after invalid submission
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  
  const errorMessage = await canvas.findByText('You must accept the terms and conditions');
  expect(errorMessage.parentElement).toHaveClass('custom-error');
  expect(errorMessage.parentElement?.querySelector('span')?.textContent).toBe('⚠️');
};
```

### 5. Accessibility Testing

When implementing custom components, it's crucial to maintain accessibility. Here are specific tests to include:

```tsx
const testAccessibility = async ({ canvas }: StoryContext) => {
  // Test 1: Verify custom checkbox has proper ARIA attributes
  const checkbox = canvas.getByLabelText('Accept terms and conditions');
  expect(checkbox).toHaveAttribute('role', 'checkbox');
  expect(checkbox).toHaveAttribute('aria-checked', 'false');
  
  // Test 2: Verify checkbox can be toggled with keyboard
  checkbox.focus();
  await userEvent.keyboard(' '); // Space key
  expect(checkbox).toHaveAttribute('aria-checked', 'true');
  
  // Test 3: Verify form label is properly associated with the checkbox
  const label = canvas.getByText('Accept terms and conditions');
  expect(label).toHaveAttribute('for', checkbox.id);
};
```

## Conclusion

This component injection pattern provides a flexible and consistent way for users to customize any part of our form components while maintaining a clean API. By following this approach across all form components, we ensure a unified experience for library users.

The implementation should be done incrementally, starting with the high-priority components, and ensuring backward compatibility at each step.
