# Medusa Forms shadcn/ui Registry

This package provides a custom shadcn/ui registry for medusa-forms components, allowing developers to install them using the native shadcn CLI while preserving the valuable field wrapper structure with built-in labels and error handling.

## Installation

You can install individual medusa-forms components using the shadcn CLI. The registry automatically handles dependencies, so installing a controlled component will also install the necessary UI wrapper components:

```bash
# Install controlled components (automatically includes UI dependencies)
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-input.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-select.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-checkbox.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-textarea.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-datepicker.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-currency-input.json

# Or install UI components individually if needed
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/input.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/field-wrapper.json
```

## Architecture

### 🏗️ **Preserved Field Wrapper Structure**

The registry maintains the valuable field wrapper architecture that provides superior UX:

- **FieldWrapper**: Handles labels, tooltips, and error display
- **UI Components**: Input, Select, Checkbox, etc. with built-in wrapper integration
- **Controlled Components**: react-hook-form integration with wrapper components

### 📦 **Dependency Management**

The registry automatically handles the dependency chain:

```
ControlledInput
└── Input
    └── FieldWrapper
        ├── FieldError
        └── Label
```

When you install `controlled-input`, shadcn automatically copies:
- `ControlledInput.tsx` (main component)
- `Input.tsx` (UI wrapper)
- `FieldWrapper.tsx` (field wrapper logic)
- `Error.tsx` (error display)
- `Label.tsx` (label with tooltip support)
- `types.d.ts` (TypeScript definitions)

## Available Components

### Controlled Components (with react-hook-form)

#### ControlledInput
```tsx
import { ControlledInput } from '@/components/ui/controlled-input'

<ControlledInput
  name="email"
  label="Email Address"
  placeholder="Enter your email"
  labelTooltip="We'll never share your email"
  rules={{ required: 'Email is required' }}
/>
```

#### ControlledSelect
```tsx
import { ControlledSelect } from '@/components/ui/controlled-select'

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
]

<ControlledSelect
  name="category"
  label="Category"
  placeholder="Select a category"
  options={options}
  rules={{ required: 'Category is required' }}
/>
```

#### ControlledCheckbox
```tsx
import { ControlledCheckbox } from '@/components/ui/controlled-checkbox'

<ControlledCheckbox
  name="terms"
  label="I agree to the terms and conditions"
  description="You must agree to continue"
  rules={{ required: 'You must agree to the terms' }}
/>
```

#### ControlledTextarea
```tsx
import { ControlledTextarea } from '@/components/ui/controlled-textarea'

<ControlledTextarea
  name="description"
  label="Description"
  placeholder="Enter a description"
  rows={4}
  rules={{ required: 'Description is required' }}
/>
```

#### ControlledDatePicker
```tsx
import { ControlledDatePicker } from '@/components/ui/controlled-datepicker'

<ControlledDatePicker
  name="birthDate"
  label="Birth Date"
  placeholder="Select your birth date"
  rules={{ required: 'Birth date is required' }}
/>
```

#### ControlledCurrencyInput
```tsx
import { ControlledCurrencyInput } from '@/components/ui/controlled-currency-input'

<ControlledCurrencyInput
  name="price"
  label="Price"
  symbol="$"
  code="USD"
  rules={{ required: 'Price is required' }}
/>
```

### UI Components (standalone)

#### Input
```tsx
import { Input } from '@/components/ui/input'

<Input
  label="Email"
  placeholder="Enter email"
  labelTooltip="Your email address"
  formErrors={errors}
  name="email"
/>
```

#### FieldWrapper
```tsx
import { FieldWrapper } from '@/components/ui/field-wrapper'

<FieldWrapper
  label="Custom Field"
  labelTooltip="Additional information"
  formErrors={errors}
  name="custom"
>
  {(props) => <CustomInput {...props} />}
</FieldWrapper>
```

## Prerequisites

Before using these components, make sure you have:

1. **shadcn/ui initialized** in your project:
   ```bash
   npx shadcn@latest init
   ```

2. **Required dependencies** installed:
   ```bash
   npm install @medusajs/ui react-hook-form
   ```

3. **FormProvider setup** for controlled components:
   ```tsx
   import { useForm, FormProvider } from 'react-hook-form'
   
   function MyForm() {
     const methods = useForm()
     
     return (
       <FormProvider {...methods}>
         <form onSubmit={methods.handleSubmit(onSubmit)}>
           {/* Your controlled components here */}
         </form>
       </FormProvider>
     )
   }
   ```

## Benefits

✅ **Preserved Architecture**: Maintains valuable field wrapper structure  
✅ **Built-in Labels & Errors**: Superior UX with integrated label and error handling  
✅ **Automatic Dependencies**: shadcn handles all component dependencies  
✅ **No Custom CLI**: Leverage existing shadcn infrastructure  
✅ **TypeScript Support**: Full TypeScript compatibility  
✅ **Familiar UX**: Developers already know `npx shadcn@latest add`  
✅ **v0 Compatible**: Components work with v0.dev  
✅ **Single Source of Truth**: Components serve both shadcn and npm package usage

## Registry Structure

```
packages/medusa-forms/
├── registry.json              # Main registry configuration
├── registry/                  # Component registry files
│   ├── controlled-*.json      # Controlled components
│   ├── field-wrapper.json     # Core wrapper component
│   ├── input.json             # UI components
│   └── ...
├── src/controlled/           # Controlled component source files
│   ├── ControlledInput.tsx
│   └── ...
└── src/ui/                   # UI wrapper components
    ├── FieldWrapper.tsx      # Core field wrapper
    ├── Input.tsx             # Input with wrapper
    ├── Error.tsx             # Error display
    ├── Label.tsx             # Label with tooltip
    ├── types.d.ts            # TypeScript definitions
    └── ...
```

## Dependency Chain

The registry manages a complete dependency chain:

```
Controlled Components
├── ControlledInput → Input → FieldWrapper → [FieldError, Label]
├── ControlledSelect → Select → FieldWrapper → [FieldError, Label]
├── ControlledCheckbox → FieldCheckbox → [FieldWrapper, Label] → [FieldError]
├── ControlledTextarea → TextArea → FieldWrapper → [FieldError, Label]
├── ControlledDatePicker → DatePicker → FieldWrapper → [FieldError, Label]
└── ControlledCurrencyInput → CurrencyInput → FieldWrapper → [FieldError, Label]

Core Components
├── FieldWrapper (requires FieldError, Label, types.d.ts)
├── FieldError (standalone)
└── Label (standalone)
```

## Usage Patterns

### 1. **Form with Validation**
```tsx
import { useForm, FormProvider } from 'react-hook-form'
import { ControlledInput, ControlledSelect } from '@/components/ui'

function ContactForm() {
  const methods = useForm()
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ControlledInput
          name="name"
          label="Full Name"
          rules={{ required: 'Name is required' }}
        />
        <ControlledSelect
          name="country"
          label="Country"
          options={countries}
          rules={{ required: 'Please select a country' }}
        />
      </form>
    </FormProvider>
  )
}
```

### 2. **Custom Field with Wrapper**
```tsx
import { FieldWrapper } from '@/components/ui/field-wrapper'

function CustomField({ name, label, formErrors }) {
  return (
    <FieldWrapper
      name={name}
      label={label}
      formErrors={formErrors}
      labelTooltip="Custom field tooltip"
    >
      {(props) => (
        <div className="custom-input">
          <input {...props} />
        </div>
      )}
    </FieldWrapper>
  )
}
```

## Contributing

To add new components to the registry:

1. Create the UI component in `src/ui/` following the wrapper pattern
2. Create the controlled component in `src/controlled/` 
3. Add both to the main `registry.json` with proper dependencies
4. Generate the individual JSON files
5. Update this documentation

## License

This project is licensed under the same license as the main forms repository.

