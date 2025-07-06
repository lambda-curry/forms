// Main entry point for @lambdacurry/forms
// Export UI components first
export * from './ui';

// Export remix-hook-form components with explicit re-exports to avoid conflicts
export {
  // Form components
  useFormField,
  DataTableRouterForm,
  dataTableRouterParsers,
  DataTableRouterToolbar,
  useDataTableUrlState as useRemixDataTableUrlState,
  getDefaultDataTableState,
  // Explicitly export remix-hook-form versions with different names to avoid conflicts
  Checkbox as RemixCheckbox,
  DatePicker as RemixDatePicker,
  DropdownMenuSelect,
  FormControl as RemixFormControl,
  FormDescription as RemixFormDescription,
  FormLabel as RemixFormLabel,
  FormMessage as RemixFormMessage,
  OTPInput as RemixOTPInput,
  RadioGroup as RemixRadioGroup,
  RadioGroupItem as RemixRadioGroupItem,
  Switch as RemixSwitch,
  TextField as RemixTextField,
  Textarea as RemixTextarea,
} from './remix-hook-form';
