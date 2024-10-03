# Form Library Documentation

This repository contains a comprehensive form library built using modern web technologies such as TypeScript, React, and Remix. The library is designed to provide a seamless and efficient form handling experience, leveraging the power of `react-hook-form` and `remix-hook-form` for form state management and validation.

## Features

- **TypeScript Support**: All components are written in TypeScript, ensuring type safety and better developer experience.
- **React Components**: Functional components are used throughout the library, promoting a declarative and modular approach.
- **Remix Integration**: The library is designed to work seamlessly with Remix, providing hooks and components that integrate with Remix's data fetching and mutation capabilities.
- **Radix UI**: Utilizes Radix UI components for accessible and customizable UI elements.
- **Zod Validation**: Form validation is handled using Zod, a TypeScript-first schema declaration and validation library.
- **Storybook**: Interactive documentation and testing of components using Storybook.

## Installation

To use the form library in your project, you need to install the necessary dependencies. Ensure you have the following packages in your `package.json`:



## Components

### Form Components

The library provides a set of form components that can be used to build complex forms with ease. Below are some of the key components:

- **FormField**: A context provider for form fields, integrating with `react-hook-form`'s `Controller`.
  ```typescript:packages/components/src/ui/remix-form.tsx
  startLine: 32
  endLine: 42
  ```

- **FormItem**: A wrapper component that provides context for individual form items.
  ```typescript:packages/components/src/ui/remix-form.tsx
  startLine: 74
  endLine: 84
  ```

- **FormLabel, FormControl, FormDescription, FormMessage**: Components for rendering form labels, controls, descriptions, and error messages.
  ```typescript:packages/components/src/ui/remix-form.tsx
  startLine: 87
  endLine: 139
  ```

### Controlled Components

These components are designed to work with `react-hook-form`'s controlled inputs:

- **ControlledTextField**: A text input field with integrated validation and error handling.
  ```typescript:packages/components/src/ui/fields/remix-text-field.tsx
  startLine: 36
  endLine: 56
  ```

- **ControlledRadioGroup**: A radio group component for selecting options.
  ```typescript:packages/components/src/ui/radio-group.tsx
  startLine: 46
  endLine: 83
  ```

- **ControlledCheckbox**: A checkbox component with validation support.
  ```typescript:packages/components/src/ui/checkbox.tsx
  startLine: 40
  endLine: 76
  ```

- **ControlledDatePicker**: A date picker component for selecting dates.
  ```typescript:packages/components/src/ui/date-picker.tsx
  startLine: 19
  endLine: 60
  ```

## Usage

To use the form components, wrap your form in the `RemixFormProvider` and use the provided components to build your form. Here's a basic example:

```typescript
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { ControlledTextField, Button } from './components';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

const MyForm = () => {
  const methods = useRemixForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '' },
  });

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit}>
        <ControlledTextField name="username" label="Username" />
        <Button type="submit">Submit</Button>
      </form>
    </RemixFormProvider>
  );
};
```

## Storybook

The library includes a Storybook setup for interactive component documentation and testing. To start Storybook, run:

```bash
yarn storybook
```

## Contributing

Contributions are welcome! Please ensure that your code adheres to the project's coding standards and passes all tests before submitting a pull request.

## License

This project is licensed under the MIT License.
