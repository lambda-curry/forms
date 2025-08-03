import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordField } from '@lambdacurry/forms/remix-hook-form/password-field';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from '@storybook/test';
import { useRef } from 'react';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

const INITIAL_PASSWORD = 'test123456';
const WEAK_PASSWORD = '123';
const WEAK_PASSWORD_ERROR = 'Password must be at least 8 characters';
const MISMATCH_PASSWORD_ERROR = "Passwords don't match";

const CreateAccountForm = () => {
  const fetcher = useFetcher<{ message: string; success: boolean }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: INITIAL_PASSWORD,
      confirmPassword: INITIAL_PASSWORD,
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  const ref = useRef<HTMLInputElement>(null);

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="space-y-6 max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Enter your password details to get started</p>
          </div>

          <PasswordField
            name="password"
            label="Password"
            description="Must be at least 8 characters long"
            placeholder="Enter your password"
          />

          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            description="Re-enter your password to confirm"
            placeholder="Confirm your password"
          />

          <div className="flex gap-2 items-end">
            <PasswordField name="refExample" label="Ref Example" placeholder="This field has a ref" ref={ref} />
            <Button type="button" onClick={() => ref.current?.focus()}>
              Focus
            </Button>
          </div>

          <Button type="submit" className="w-full mt-6">
            Create Account
          </Button>

          {fetcher.data?.message && (
            <p className={`mt-2 text-center ${fetcher.data.success ? 'text-green-600' : 'text-red-600'}`}>
              {fetcher.data.message}
            </p>
          )}
        </div>
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  // Simulate account creation - data is validated at this point
  console.log('Creating account with password length:', data.password.length);
  return {
    message: 'Account created successfully! Welcome aboard!',
    success: true,
  };
};

const meta: Meta<typeof PasswordField> = {
  title: 'RemixHookForm/PasswordField',
  component: PasswordField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = ({ canvas }: StoryContext) => {
  const passwordInput = canvas.getByLabelText('Password');
  const confirmInput = canvas.getByLabelText('Confirm Password');
  expect(passwordInput).toHaveValue(INITIAL_PASSWORD);
  expect(confirmInput).toHaveValue(INITIAL_PASSWORD);
};

const testPasswordVisibilityToggle = async ({ canvas }: StoryContext) => {
  const passwordInput = canvas.getByLabelText('Password');
  const toggleButton = canvas.getByLabelText('Show password');

  // Initially password should be hidden (type="password")
  expect(passwordInput).toHaveAttribute('type', 'password');

  // Click toggle to show password
  await userEvent.click(toggleButton);
  expect(passwordInput).toHaveAttribute('type', 'text');
  expect(canvas.getByLabelText('Hide password')).toBeInTheDocument();

  // Click toggle to hide password again
  await userEvent.click(canvas.getByLabelText('Hide password'));
  expect(passwordInput).toHaveAttribute('type', 'password');
  expect(canvas.getByLabelText('Show password')).toBeInTheDocument();
};

const testWeakPasswordValidation = async ({ canvas }: StoryContext) => {
  const passwordInput = canvas.getByLabelText('Password');
  const submitButton = canvas.getByRole('button', { name: 'Create Account' });

  await userEvent.click(passwordInput);
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, WEAK_PASSWORD);
  await userEvent.click(submitButton);

  await expect(await canvas.findByText(WEAK_PASSWORD_ERROR)).toBeInTheDocument();
};

const testPasswordMismatchValidation = async ({ canvas }: StoryContext) => {
  const passwordInput = canvas.getByLabelText('Password');
  const confirmInput = canvas.getByLabelText('Confirm Password');
  const submitButton = canvas.getByRole('button', { name: 'Create Account' });

  await userEvent.click(passwordInput);
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, 'validpassword123');

  await userEvent.click(confirmInput);
  await userEvent.clear(confirmInput);
  await userEvent.type(confirmInput, 'differentpassword123');

  await userEvent.click(submitButton);

  await expect(await canvas.findByText(MISMATCH_PASSWORD_ERROR)).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const passwordInput = canvas.getByLabelText('Password');
  const confirmInput = canvas.getByLabelText('Confirm Password');
  const submitButton = canvas.getByRole('button', { name: 'Create Account' });

  await userEvent.click(passwordInput);
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, 'validpassword123');

  await userEvent.click(confirmInput);
  await userEvent.clear(confirmInput);
  await userEvent.type(confirmInput, 'validpassword123');

  await userEvent.click(submitButton);

  const successMessage = await canvas.findByText('Account created successfully! Welcome aboard!');
  expect(successMessage).toBeInTheDocument();
};

const testRefFunctionality = async ({ canvas }: StoryContext) => {
  const refInput = canvas.getByLabelText('Ref Example');
  const focusButton = canvas.getByRole('button', { name: 'Focus' });

  await userEvent.click(focusButton);
  expect(refInput).toHaveFocus();
};

// Single story that contains all variants and tests
export const CreateAccountExample: Story = {
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testPasswordVisibilityToggle(storyContext);
    await testWeakPasswordValidation(storyContext);
    await testPasswordMismatchValidation(storyContext);
    await testValidSubmission(storyContext);
    await testRefFunctionality(storyContext);
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CreateAccountForm,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
};
