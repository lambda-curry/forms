# Medusa Forms shadcn/ui Registry

This package provides a custom shadcn/ui registry for medusa-forms components, allowing developers to install them using the native shadcn CLI.

## Installation

You can install individual medusa-forms components using the shadcn CLI:

```bash
# Install individual components
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-input.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-select.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-checkbox.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-textarea.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-datepicker.json
npx shadcn@latest add https://raw.githubusercontent.com/lambda-curry/forms/main/packages/medusa-forms/registry/controlled-currency-input.json
```

## Available Components

### ControlledInput
A controlled input component with react-hook-form integration.

```tsx
import { ControlledInput } from '@/components/ui/controlled-input'

<ControlledInput
  name="email"
  label="Email"
  placeholder="Enter your email"
  rules={{ required: 'Email is required' }}
/>
```

### ControlledSelect
A controlled select component with react-hook-form integration.

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

### ControlledCheckbox
A controlled checkbox component with react-hook-form integration.

```tsx
import { ControlledCheckbox } from '@/components/ui/controlled-checkbox'

<ControlledCheckbox
  name="terms"
  label="I agree to the terms and conditions"
  rules={{ required: 'You must agree to the terms' }}
/>
```

### ControlledTextarea
A controlled textarea component with react-hook-form integration.

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

### ControlledDatePicker
A controlled date picker component with react-hook-form integration.

```tsx
import { ControlledDatePicker } from '@/components/ui/controlled-datepicker'

<ControlledDatePicker
  name="birthDate"
  label="Birth Date"
  placeholder="Select your birth date"
  rules={{ required: 'Birth date is required' }}
/>
```

### ControlledCurrencyInput
A controlled currency input component with react-hook-form integration.

```tsx
import { ControlledCurrencyInput } from '@/components/ui/controlled-currency-input'

<ControlledCurrencyInput
  name="price"
  label="Price"
  placeholder="Enter price"
  currency="USD"
  rules={{ required: 'Price is required' }}
/>
```

## Prerequisites

Before using these components, make sure you have:

1. **shadcn/ui initialized** in your project:
   ```bash
   npx shadcn@latest init
   ```

2. **Required dependencies** installed:
   ```bash
   npm install @medusajs/ui react-hook-form @hookform/error-message
   ```

3. **FormProvider setup** in your application:
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

✅ **No Custom CLI**: Leverage existing shadcn infrastructure  
✅ **Familiar UX**: Developers already know `npx shadcn@latest add`  
✅ **Auto Dependencies**: shadcn handles npm package installation  
✅ **TypeScript Support**: Built-in TypeScript compatibility  
✅ **Zero Maintenance**: No CLI package to maintain  
✅ **Instant Adoption**: Works with existing shadcn projects  
✅ **v0 Compatible**: Components work with v0.dev  
✅ **Monorepo Structure**: Registry is properly nested within the medusa-forms package

## Registry Structure

```
packages/medusa-forms/
├── registry.json              # Main registry configuration
├── registry/                  # Component registry files
│   ├── controlled-input.json
│   ├── controlled-select.json
│   ├── controlled-checkbox.json
│   ├── controlled-textarea.json
│   ├── controlled-datepicker.json
│   └── controlled-currency-input.json
├── src/registry/             # Registry-compatible component source files
│   ├── controlled-input.tsx
│   ├── controlled-select.tsx
│   ├── controlled-checkbox.tsx
│   ├── controlled-textarea.tsx
│   ├── controlled-datepicker.tsx
│   └── controlled-currency-input.tsx
└── src/controlled/           # Original medusa-forms components (unchanged)
    ├── ControlledInput.tsx
    ├── ControlledSelect.tsx
    ├── ControlledCheckbox.tsx
    ├── ControlledTextArea.tsx
    ├── ControlledDatePicker.tsx
    └── ControlledCurrencyInput.tsx
```

## Relationship to Existing Components

The registry components in `src/registry/` are **shadcn-compatible versions** of the existing medusa-forms components in `src/controlled/`. Key differences:

- **Registry components**: Use `@medusajs/ui` directly, include built-in labels and error handling, follow shadcn patterns
- **Original components**: Use internal UI wrappers (`FieldWrapper`, etc.), part of the medusa-forms package API

Both sets of components serve different use cases:
- Use **registry components** when installing via shadcn CLI into your project
- Use **original components** when importing the `@lambdacurry/medusa-forms` package directly

## Contributing

To add new components to the registry:

1. Create the shadcn-compatible component in `src/registry/`
2. Add it to the main `registry.json`
3. Generate the individual JSON file in `registry/`
4. Update this documentation

## License

This project is licensed under the same license as the main forms repository.

