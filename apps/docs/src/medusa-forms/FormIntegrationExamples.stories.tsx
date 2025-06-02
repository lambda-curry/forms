import { ControlledCheckbox } from '@lambdacurry/medusa-forms/controlled/ControlledCheckbox';
import { ControlledCurrencyInput } from '@lambdacurry/medusa-forms/controlled/ControlledCurrencyInput';
import { ControlledDatePicker } from '@lambdacurry/medusa-forms/controlled/ControlledDatePicker';
import { ControlledInput } from '@lambdacurry/medusa-forms/controlled/ControlledInput';
import { ControlledSelect } from '@lambdacurry/medusa-forms/controlled/ControlledSelect';
import { ControlledTextArea } from '@lambdacurry/medusa-forms/controlled/ControlledTextArea';
import { Button } from '@medusajs/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const meta = {
  title: 'Medusa Forms/Form Integration Examples',
  component: () => null, // No single component
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Registration Form Types
interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date | null;
  country: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

// Product Creation Form Types
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  sku: string;
  weight: string;
  dimensions: string;
  launchDate: Date | null;
  isActive: boolean;
  isFeatured: boolean;
  tags: string;
}

// Stories
export const CompleteRegistrationFormExample: Story = {
  name: 'Complete Registration Form',
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    const form = useForm<RegistrationFormData>({
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: null,
        country: '',
        agreeToTerms: false,
        subscribeNewsletter: false,
      },
      mode: 'onSubmit',
    });

    const {
      handleSubmit,
      watch,
      formState: { errors, isValid },
    } = form;
    const password = watch('password');

    const onSubmit = async (data: RegistrationFormData) => {
      setIsSubmitting(true);
      setSubmitResult(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitting(false);
      setSubmitResult(`Registration successful for ${data.firstName} ${data.lastName}!`);
      console.log('Registration data:', data);
    };

    const countryOptions = [
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
      { label: 'United Kingdom', value: 'UK' },
      { label: 'Germany', value: 'DE' },
      { label: 'France', value: 'FR' },
      { label: 'Australia', value: 'AU' },
    ];

    return (
      <FormProvider {...form}>
        <div className="w-[500px] space-y-6 p-6 border rounded-lg bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us today and get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <ControlledInput
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  rules={{
                    required: 'First name is required',
                    minLength: { value: 2, message: 'First name must be at least 2 characters' },
                  }}
                />

                <ControlledInput
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  rules={{
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                  }}
                />
              </div>

              <ControlledInput
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
              />

              <ControlledDatePicker
                name="dateOfBirth"
                label="Date of Birth"
                placeholder="Select your date of birth"
                rules={{
                  required: 'Date of birth is required',
                  validate: (value) => {
                    if (!value) return 'Date of birth is required';
                    const age = new Date().getFullYear() - new Date(value).getFullYear();
                    return age >= 18 || 'You must be at least 18 years old';
                  },
                }}
              />

              <ControlledSelect
                name="country"
                label="Country"
                options={countryOptions}
                rules={{ required: 'Country is required' }}
              />
            </div>

            {/* Account Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Account Security</h3>

              <ControlledInput
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                  },
                }}
              />

              <ControlledInput
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                rules={{
                  required: 'Password confirmation is required',
                  validate: (value) => value === password || 'Passwords do not match',
                }}
              />
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>

              <ControlledCheckbox
                name="agreeToTerms"
                label="I agree to the Terms of Service and Privacy Policy"
                rules={{ required: 'You must agree to the terms to continue' }}
              />

              <ControlledCheckbox
                name="subscribeNewsletter"
                label="Subscribe to our newsletter for updates and promotions"
              />
            </div>

            {/* Submit Section */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                className="w-full"
                variant="primary"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              {submitResult && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {submitResult}
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  Please fix the errors above before submitting.
                </div>
              )}
            </div>
          </form>
        </div>
      </FormProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
A comprehensive registration form demonstrating multiple controlled components working together:

**Features:**
- **Form Validation**: Real-time validation with react-hook-form
- **Multiple Input Types**: Text inputs, email, password, date picker, select, checkboxes
- **Complex Validation Rules**: Password strength, email format, age verification, password confirmation
- **Error Handling**: Individual field errors and form-level error summary
- **Submit States**: Loading states and success feedback
- **Responsive Layout**: Grid layouts and proper spacing

**Components Used:**
- ControlledInput (text, email, password)
- ControlledDatePicker (date of birth with age validation)
- ControlledSelect (country selection)
- ControlledCheckbox (terms agreement, newsletter subscription)

**Validation Scenarios:**
- Required fields
- Email format validation
- Password strength requirements
- Password confirmation matching
- Age verification (18+)
- Terms agreement requirement
        `,
      },
    },
  },
};

export const ProductCreationFormExample: Story = {
  name: 'Product Creation Form',
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    const form = useForm<ProductFormData>({
      defaultValues: {
        name: '',
        description: '',
        price: '',
        category: '',
        sku: '',
        weight: '',
        dimensions: '',
        launchDate: null,
        isActive: true,
        isFeatured: false,
        tags: '',
      },
      mode: 'onSubmit',
    });

    const {
      handleSubmit,
      formState: { errors, isValid },
    } = form;

    const onSubmit = async (data: ProductFormData) => {
      setIsSubmitting(true);
      setSubmitResult(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitting(false);
      setSubmitResult(`Product "${data.name}" created successfully!`);
      console.log('Product data:', data);
    };

    const categoryOptions = [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Home & Garden', value: 'home-garden' },
      { label: 'Sports & Outdoors', value: 'sports-outdoors' },
      { label: 'Books', value: 'books' },
      { label: 'Toys & Games', value: 'toys-games' },
    ];

    return (
      <FormProvider {...form}>
        <div className="w-[600px] space-y-6 p-6 border rounded-lg bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
            <p className="text-gray-600 mt-2">Add a new product to your catalog</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

              <ControlledInput
                name="name"
                label="Product Name"
                placeholder="Enter product name"
                rules={{
                  required: 'Product name is required',
                  minLength: { value: 3, message: 'Product name must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Product name must be less than 100 characters' },
                }}
              />

              <ControlledTextArea
                name="description"
                label="Product Description"
                placeholder="Describe your product in detail..."
                rows={4}
                rules={{
                  required: 'Product description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' },
                  maxLength: { value: 1000, message: 'Description must be less than 1000 characters' },
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <ControlledSelect
                  name="category"
                  label="Category"
                  options={categoryOptions}
                  rules={{ required: 'Category is required' }}
                />

                <ControlledInput
                  name="sku"
                  label="SKU"
                  placeholder="Enter SKU"
                  rules={{
                    required: 'SKU is required',
                    pattern: {
                      value: /^[A-Z0-9-]+$/,
                      message: 'SKU must contain only uppercase letters, numbers, and hyphens',
                    },
                  }}
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h3>

              <div className="grid grid-cols-2 gap-4">
                <ControlledCurrencyInput
                  name="price"
                  label="Price"
                  placeholder="0.00"
                  currency="USD"
                  symbol="$"
                  code="usd"
                  rules={{
                    required: 'Price is required',
                    validate: (value) => {
                      const numValue = Number.parseFloat(value);
                      return (numValue > 0 && numValue <= 10000) || 'Price must be between $0.01 and $10,000';
                    },
                  }}
                />

                <ControlledInput
                  name="weight"
                  label="Weight (lbs)"
                  type="number"
                  placeholder="0.0"
                  step="0.1"
                  rules={{
                    required: 'Weight is required',
                    min: { value: 0.1, message: 'Weight must be at least 0.1 lbs' },
                  }}
                />
              </div>

              <ControlledInput
                name="dimensions"
                label="Dimensions (L x W x H)"
                placeholder="e.g., 10 x 8 x 6 inches"
                rules={{
                  required: 'Dimensions are required',
                  pattern: {
                    value: /^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*(inches?|in|cm|centimeters?)?$/i,
                    message: 'Please enter dimensions in format: L x W x H (e.g., 10 x 8 x 6 inches)',
                  },
                }}
              />
            </div>

            {/* Launch & Visibility */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Launch & Visibility</h3>

              <ControlledDatePicker
                name="launchDate"
                label="Launch Date"
                placeholder="Select launch date"
                rules={{
                  required: 'Launch date is required',
                  validate: (value) => {
                    if (!value) return 'Launch date is required';
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return new Date(value) >= today || 'Launch date cannot be in the past';
                  },
                }}
              />

              <div className="space-y-3">
                <ControlledCheckbox name="isActive" label="Product is active and available for sale" />

                <ControlledCheckbox name="isFeatured" label="Feature this product on the homepage" />
              </div>

              <ControlledTextArea
                name="tags"
                label="Tags"
                placeholder="Enter tags separated by commas (e.g., electronics, gadget, portable)"
                rows={2}
                rules={{
                  validate: (value) => {
                    if (!value) return true; // Tags are optional
                    const tags = value.split(',').map((tag) => tag.trim());
                    return tags.length <= 10 || 'Maximum 10 tags allowed';
                  },
                }}
              />
            </div>

            {/* Submit Section */}
            <div className="pt-4 border-t">
              <div className="flex gap-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => form.reset()}>
                  Reset Form
                </Button>

                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                  variant="primary"
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating Product...' : 'Create Product'}
                </Button>
              </div>

              {submitResult && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {submitResult}
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p className="font-medium">Please fix the following errors:</p>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>
                        {field}: {error?.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
        </div>
      </FormProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
A comprehensive product creation form showcasing all controlled components in a real-world e-commerce context:

**Features:**
- **Advanced Validation**: Complex business rules and data validation
- **Multiple Data Types**: Text, numbers, currency, dates, boolean flags
- **Rich Text Input**: Multi-line descriptions with character limits
- **Currency Handling**: Proper currency input with validation
- **Date Constraints**: Future date validation for launch dates
- **Dynamic Feedback**: Real-time validation and error reporting
- **Form Reset**: Ability to clear and reset the entire form

**Components Used:**
- ControlledInput (text, number inputs with various validation rules)
- ControlledTextArea (product description, tags)
- ControlledCurrencyInput (pricing with currency formatting)
- ControlledSelect (category selection)
- ControlledDatePicker (launch date with future date validation)
- ControlledCheckbox (product status flags)

**Complex Validation Examples:**
- SKU format validation (uppercase, numbers, hyphens only)
- Price range validation ($0.01 - $10,000)
- Dimensions format validation (L x W x H pattern)
- Future date validation for launch dates
- Tag count limits (max 10 tags)
- Character limits for descriptions
        `,
      },
    },
  },
};

export const FormValidationShowcase: Story = {
  name: 'Form Validation Showcase',
  render: () => {
    const form = useForm({
      defaultValues: {
        requiredField: '',
        emailField: '',
        numberField: '',
        dateField: null,
        selectField: '',
        checkboxField: false,
      },
      mode: 'onSubmit',
    });

    return (
      <FormProvider {...form}>
        <div className="w-[500px] space-y-4 p-6 border rounded-lg bg-white">
          <h2 className="text-xl font-bold text-gray-900">Validation Examples</h2>
          <p className="text-gray-600">Try interacting with these fields to see validation in action</p>

          <ControlledInput
            name="requiredField"
            label="Required Field"
            placeholder="This field is required"
            rules={{ required: 'This field is required' }}
          />

          <ControlledInput
            name="emailField"
            label="Email Validation"
            type="email"
            placeholder="Enter a valid email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email format',
              },
            }}
          />

          <ControlledCurrencyInput
            name="numberField"
            label="Currency with Range"
            placeholder="$0.00"
            currency="USD"
            symbol="$"
            code="usd"
            rules={{
              required: 'Amount is required',
              validate: (value) => {
                const num = Number.parseFloat(value);
                return (num >= 10 && num <= 1000) || 'Amount must be between $10 and $1,000';
              },
            }}
          />

          <ControlledDatePicker
            name="dateField"
            label="Future Date Only"
            placeholder="Select a future date"
            rules={{
              required: 'Date is required',
              validate: (value) => {
                if (!value) return 'Date is required';
                return new Date(value) > new Date() || 'Date must be in the future';
              },
            }}
          />

          <ControlledSelect
            name="selectField"
            label="Required Selection"
            options={[
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' },
              { label: 'Option 3', value: 'option3' },
            ]}
            rules={{ required: 'Please select an option' }}
          />

          <ControlledCheckbox
            name="checkboxField"
            label="Required Agreement"
            rules={{ required: 'You must agree to continue' }}
          />

          <div className="pt-4 border-t">
            <Button type="button" disabled={!form.formState.isValid} variant="primary" className="w-full">
              Submit (Validation Demo)
            </Button>
          </div>
        </div>
      </FormProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
A focused demonstration of various validation scenarios across all controlled components:

**Validation Types Demonstrated:**
- **Required Fields**: Basic required field validation
- **Format Validation**: Email pattern matching
- **Range Validation**: Currency amounts with min/max limits
- **Date Validation**: Future date constraints
- **Selection Validation**: Required dropdown selections
- **Boolean Validation**: Required checkbox agreements

This example shows how each component handles validation states and error messages consistently.
        `,
      },
    },
  },
};
