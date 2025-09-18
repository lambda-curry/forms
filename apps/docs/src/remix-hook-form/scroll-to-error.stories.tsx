import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import { ScrollToErrorOnSubmit } from '@lambdacurry/forms/remix-hook-form/components/ScrollToErrorOnSubmit';
import { useScrollToErrorOnSubmit } from '@lambdacurry/forms/remix-hook-form/hooks/useScrollToErrorOnSubmit';
import { RadioGroup, RadioGroupItem } from '@lambdacurry/forms/remix-hook-form/radio-group';
import { Select } from '@lambdacurry/forms/remix-hook-form/select';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { Textarea } from '@lambdacurry/forms/remix-hook-form/textarea';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Regex constants for performance
const SUBMIT_FORM_REGEX = /submit form/i;

const formSchema = z.object({
  // Personal Information Section
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),

  // Address Section
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(1, 'Please select a state'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),

  // Preferences Section
  newsletter: z.boolean(),
  notifications: z.enum(['email', 'sms', 'none'], {
    errorMap: () => ({ message: 'Please select a notification preference' }),
  }),

  // Additional Information
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  experience: z.string().min(1, 'Please select your experience level'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),

  // Terms and Conditions
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
});

type FormData = z.infer<typeof formSchema>;

// Component using the hook approach
const ScrollToErrorHookExample = () => {
  const fetcher = useFetcher<{ message: string; errors?: Record<string, unknown> }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      newsletter: false,
      notifications: undefined,
      company: '',
      jobTitle: '',
      experience: '',
      bio: '',
      terms: false,
      privacy: false,
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  // Use the scroll-to-error hook with custom options
  useScrollToErrorOnSubmit({
    offset: 100, // Account for fixed header
    behavior: 'smooth',
    shouldFocus: true,
    scrollOnServerErrors: true,
    scrollOnMount: true,
    retryAttempts: 3,
    delay: 150,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scroll-to-Error Demo (Hook)</h1>
          <p className="text-gray-600">
            This form demonstrates the scroll-to-error functionality using the{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">useScrollToErrorOnSubmit</code> hook. Try submitting
            the form without filling out required fields to see the scroll behavior.
          </p>
        </div>

        <RemixFormProvider {...methods}>
          <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  description="Your legal first name"
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  description="Your legal last name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <TextField
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  description="We'll use this to contact you"
                />
                <TextField
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                  description="Include area code"
                />
              </div>
            </section>

            {/* Address Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Address Information</h2>
              <div className="space-y-4">
                <TextField
                  name="address"
                  label="Street Address"
                  placeholder="123 Main Street"
                  description="Your full street address"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField name="city" label="City" placeholder="New York" description="Your city" />
                  <Select
                    name="state"
                    label="State"
                    placeholder="Select state"
                    description="Your state or province"
                    options={[
                      { value: 'ny', label: 'New York' },
                      { value: 'ca', label: 'California' },
                      { value: 'tx', label: 'Texas' },
                      { value: 'fl', label: 'Florida' },
                    ]}
                  />
                  <TextField name="zipCode" label="ZIP Code" placeholder="12345" description="Your postal code" />
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Communication Preferences</h2>
              <div className="space-y-4">
                <Checkbox
                  name="newsletter"
                  label="Subscribe to Newsletter"
                  description="Receive our weekly newsletter with updates and tips"
                />
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3 block">Notification Preferences</div>
                  <RadioGroup name="notifications" className="space-y-2">
                    <RadioGroupItem value="email" label="Email notifications" />
                    <RadioGroupItem value="sms" label="SMS notifications" />
                    <RadioGroupItem value="none" label="No notifications" />
                  </RadioGroup>
                </div>
              </div>
            </section>

            {/* Professional Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="company"
                    label="Company"
                    placeholder="Acme Corporation"
                    description="Your current employer"
                  />
                  <TextField
                    name="jobTitle"
                    label="Job Title"
                    placeholder="Software Engineer"
                    description="Your current position"
                  />
                </div>
                <Select
                  name="experience"
                  label="Years of Experience"
                  placeholder="Select experience level"
                  description="Your professional experience"
                  options={[
                    { value: '0-1', label: '0-1 years' },
                    { value: '2-5', label: '2-5 years' },
                    { value: '6-10', label: '6-10 years' },
                    { value: '10+', label: '10+ years' },
                  ]}
                />
                <Textarea
                  name="bio"
                  label="Professional Bio"
                  placeholder="Tell us about your professional background..."
                  description="A brief description of your professional experience and interests"
                  rows={4}
                />
              </div>
            </section>

            {/* Terms and Conditions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Terms and Conditions</h2>
              <div className="space-y-4">
                <Checkbox
                  name="terms"
                  label="I accept the Terms and Conditions"
                  description="You must accept our terms to continue"
                />
                <Checkbox
                  name="privacy"
                  label="I accept the Privacy Policy"
                  description="You must accept our privacy policy to continue"
                />
              </div>
            </section>

            {/* Submit Section */}
            <div className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-gray-600">All fields marked with * are required</div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => methods.reset()}>
                    Reset Form
                  </Button>
                  <Button type="submit" disabled={methods.formState.isSubmitting}>
                    {methods.formState.isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {fetcher.data?.message && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">{fetcher.data.message}</p>
              </div>
            )}
          </fetcher.Form>
        </RemixFormProvider>
      </div>
    </div>
  );
};

// Component using the component approach
const ScrollToErrorComponentExample = () => {
  const fetcher = useFetcher<{ message: string; errors?: Record<string, unknown> }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      newsletter: false,
      notifications: undefined,
      company: '',
      jobTitle: '',
      experience: '',
      bio: '',
      terms: false,
      privacy: false,
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scroll-to-Error Demo (Component)</h1>
          <p className="text-gray-600">
            This form demonstrates the scroll-to-error functionality using the{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">ScrollToErrorOnSubmit</code> component. Try
            submitting the form without filling out required fields to see the scroll behavior.
          </p>
        </div>

        <RemixFormProvider {...methods}>
          <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-8">
            {/* Add the ScrollToErrorOnSubmit component */}
            <ScrollToErrorOnSubmit
              offset={100}
              behavior="smooth"
              shouldFocus={true}
              scrollOnServerErrors={true}
              scrollOnMount={true}
              retryAttempts={3}
              delay={150}
            />

            {/* Same form content as hook example */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  description="Your legal first name"
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  description="Your legal last name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <TextField
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  description="We'll use this to contact you"
                />
                <TextField
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="(555) 123-4567"
                  description="Include area code"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Address Information</h2>
              <div className="space-y-4">
                <TextField
                  name="address"
                  label="Street Address"
                  placeholder="123 Main Street"
                  description="Your full street address"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField name="city" label="City" placeholder="New York" description="Your city" />
                  <Select
                    name="state"
                    label="State"
                    placeholder="Select state"
                    description="Your state or province"
                    options={[
                      { value: 'ny', label: 'New York' },
                      { value: 'ca', label: 'California' },
                      { value: 'tx', label: 'Texas' },
                      { value: 'fl', label: 'Florida' },
                    ]}
                  />
                  <TextField name="zipCode" label="ZIP Code" placeholder="12345" description="Your postal code" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Communication Preferences</h2>
              <div className="space-y-4">
                <Checkbox
                  name="newsletter"
                  label="Subscribe to Newsletter"
                  description="Receive our weekly newsletter with updates and tips"
                />
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3 block">Notification Preferences</div>
                  <RadioGroup name="notifications" className="space-y-2">
                    <RadioGroupItem value="email" label="Email notifications" />
                    <RadioGroupItem value="sms" label="SMS notifications" />
                    <RadioGroupItem value="none" label="No notifications" />
                  </RadioGroup>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="company"
                    label="Company"
                    placeholder="Acme Corporation"
                    description="Your current employer"
                  />
                  <TextField
                    name="jobTitle"
                    label="Job Title"
                    placeholder="Software Engineer"
                    description="Your current position"
                  />
                </div>
                <Select
                  name="experience"
                  label="Years of Experience"
                  placeholder="Select experience level"
                  description="Your professional experience"
                  options={[
                    { value: '0-1', label: '0-1 years' },
                    { value: '2-5', label: '2-5 years' },
                    { value: '6-10', label: '6-10 years' },
                    { value: '10+', label: '10+ years' },
                  ]}
                />
                <Textarea
                  name="bio"
                  label="Professional Bio"
                  placeholder="Tell us about your professional background..."
                  description="A brief description of your professional experience and interests"
                  rows={4}
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Terms and Conditions</h2>
              <div className="space-y-4">
                <Checkbox
                  name="terms"
                  label="I accept the Terms and Conditions"
                  description="You must accept our terms to continue"
                />
                <Checkbox
                  name="privacy"
                  label="I accept the Privacy Policy"
                  description="You must accept our privacy policy to continue"
                />
              </div>
            </section>

            <div className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-gray-600">All fields marked with * are required</div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => methods.reset()}>
                    Reset Form
                  </Button>
                  <Button type="submit" disabled={methods.formState.isSubmitting}>
                    {methods.formState.isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
                </div>
              </div>
            </div>

            {fetcher.data?.message && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">{fetcher.data.message}</p>
              </div>
            )}
          </fetcher.Form>
        </RemixFormProvider>
      </div>
    </div>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  // Simulate server-side validation
  if (data.email === 'taken@example.com') {
    return {
      errors: {
        email: {
          message: 'This email address is already registered',
        },
      },
    };
  }

  return { message: 'Form submitted successfully! All validation passed.' };
};

const meta: Meta = {
  title: 'RemixHookForm/ScrollToError',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The scroll-to-error functionality automatically scrolls to the first validation error when form submission fails. 
This improves user experience by helping users quickly find and fix validation issues, especially in long forms.

## Features

- **Smart Element Targeting**: Uses existing \`data-slot\` selectors to find error elements
- **Retry Logic**: Handles async rendering scenarios common with Remix SSR
- **Accessibility**: Automatically focuses error elements for screen readers
- **Customizable**: Configurable scroll behavior, offset, and retry attempts
- **Two Usage Patterns**: Available as both a hook and a component

## Usage Patterns

### Hook Approach (Recommended)
\`\`\`tsx
import { useScrollToErrorOnSubmit } from '@lambdacurry/forms/remix-hook-form';

const MyForm = () => {
  useScrollToErrorOnSubmit({
    offset: 80,
    behavior: 'smooth',
    shouldFocus: true,
  });
  
  return (
    <form>
      {/* Your form fields */}
    </form>
  );
};
\`\`\`

### Component Approach
\`\`\`tsx
import { ScrollToErrorOnSubmit } from '@lambdacurry/forms/remix-hook-form';

const MyForm = () => (
  <form>
    <ScrollToErrorOnSubmit offset={80} behavior="smooth" />
    {/* Your form fields */}
  </form>
);
\`\`\`

## Configuration Options

- **offset**: Pixels to offset from top (default: 80)
- **behavior**: 'smooth' or 'instant' scrolling (default: 'smooth')
- **shouldFocus**: Focus the error element (default: true)
- **scrollOnServerErrors**: Handle server validation errors (default: true)
- **scrollOnMount**: Handle SSR errors on page load (default: true)
- **retryAttempts**: Retry attempts for async rendering (default: 3)
- **delay**: Delay before scrolling in ms (default: 100)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios for the hook approach
const testHookScrollBehavior = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: SUBMIT_FORM_REGEX });

  // Submit form without filling required fields
  await userEvent.click(submitButton);

  // Wait for validation errors to appear
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check that error messages are displayed
  const firstNameError = await canvas.findByText('First name must be at least 2 characters');
  expect(firstNameError).toBeInTheDocument();
};

const testComponentScrollBehavior = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: SUBMIT_FORM_REGEX });

  // Submit form without filling required fields
  await userEvent.click(submitButton);

  // Wait for validation errors to appear
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check that error messages are displayed
  const firstNameError = await canvas.findByText('First name must be at least 2 characters');
  expect(firstNameError).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  // Fill out all required fields
  await userEvent.type(canvas.getByLabelText('First Name'), 'John');
  await userEvent.type(canvas.getByLabelText('Last Name'), 'Doe');
  await userEvent.type(canvas.getByLabelText('Email Address'), 'john.doe@example.com');
  await userEvent.type(canvas.getByLabelText('Phone Number'), '5551234567');
  await userEvent.type(canvas.getByLabelText('Street Address'), '123 Main Street');
  await userEvent.type(canvas.getByLabelText('City'), 'New York');
  await userEvent.selectOptions(canvas.getByLabelText('State'), 'ny');
  await userEvent.type(canvas.getByLabelText('ZIP Code'), '12345');
  await userEvent.click(canvas.getByLabelText('Email notifications'));
  await userEvent.type(canvas.getByLabelText('Company'), 'Acme Corp');
  await userEvent.type(canvas.getByLabelText('Job Title'), 'Developer');
  await userEvent.selectOptions(canvas.getByLabelText('Years of Experience'), '2-5');
  await userEvent.type(
    canvas.getByLabelText('Professional Bio'),
    'I am a software developer with experience in React and TypeScript.',
  );
  await userEvent.click(canvas.getByLabelText('I accept the Terms and Conditions'));
  await userEvent.click(canvas.getByLabelText('I accept the Privacy Policy'));

  const submitButton = canvas.getByRole('button', { name: SUBMIT_FORM_REGEX });
  await userEvent.click(submitButton);

  // Wait for success message
  const successMessage = await canvas.findByText('Form submitted successfully! All validation passed.');
  expect(successMessage).toBeInTheDocument();
};

export const HookApproach: Story = {
  name: 'Hook Approach (useScrollToErrorOnSubmit)',
  play: async (storyContext) => {
    await testHookScrollBehavior(storyContext);
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ScrollToErrorHookExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};

export const ComponentApproach: Story = {
  name: 'Component Approach (ScrollToErrorOnSubmit)',
  play: async (storyContext) => {
    await testComponentScrollBehavior(storyContext);
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ScrollToErrorComponentExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};

export const ValidSubmission: Story = {
  name: 'Valid Form Submission',
  play: async (storyContext) => {
    await testValidSubmission(storyContext);
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ScrollToErrorHookExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};
