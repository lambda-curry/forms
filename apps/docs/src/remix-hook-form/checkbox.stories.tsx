import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher } from 'react-router-dom';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import type {} from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const formSchema = z.object({
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  marketing: z.boolean().optional(),
  required: z.boolean().refine((val) => val === true, 'This field is required'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledCheckboxExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false as true, // Note: ZOD Schema expects a true value
      marketing: false,
      required: false as true, //Note: ZOD Schema expects a true value
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
          <Checkbox className="rounded-md border p-4" name="terms" label="Accept terms and conditions" />
          <Checkbox
            className="rounded-md border p-4"
            name="marketing"
            label="Receive marketing emails"
            description="We will send you hourly updates about our products"
          />
          <Checkbox className="rounded-md border p-4" name="required" label="This is a required checkbox" />
        </div>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof Checkbox> = {
  title: 'RemixHookForm/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledCheckboxExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = ({ canvas }: StoryContext) => {
  const termsCheckbox = canvas.getByLabelText('Accept terms and conditions');
  const marketingCheckbox = canvas.getByLabelText('Receive marketing emails');
  const requiredCheckbox = canvas.getByLabelText('This is a required checkbox');
  expect(termsCheckbox).not.toBeChecked();
  expect(marketingCheckbox).not.toBeChecked();
  expect(requiredCheckbox).not.toBeChecked();
};

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(await canvas.findByText('You must accept the terms and conditions')).toBeInTheDocument();
  await expect(await canvas.findByText('This field is required')).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const termsCheckbox = canvas.getByLabelText('Accept terms and conditions');
  const requiredCheckbox = canvas.getByLabelText('This is a required checkbox');
  await userEvent.click(termsCheckbox);
  await userEvent.click(requiredCheckbox);

  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(await canvas.findByText('Form submitted successfully')).toBeInTheDocument();
};

export const Tests: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default checkbox component.',
      },
      source: {
        code: `
    const formSchema = z.object({
    terms: z.boolean().optional().refine(val => val === true, 'You must accept the terms and conditions'),
    marketing: z.boolean().optional(),
    required: z.boolean().optional().refine(val => val === true, 'This field is required'),
  });

  const ControlledCheckboxExample = () => {
    const fetcher = useFetcher<{ message: string }>();
    const methods = useRemixForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        terms: false as true, // Note: ZOD Schema expects a true value
        marketing: false,
        required: false as true //Note: ZOD Schema expects a true value
      },
      fetcher,
    });

    return (
      <RemixFormProvider {...methods}>
        <fetcher.Form onSubmit={methods.handleSubmit} method="post" action="/">
          <div className='grid gap-4'>
            <Checkbox className='rounded-md border p-4' name="terms" label="Accept terms and conditions" />
            <Checkbox className='rounded-md border p-4' name="marketing" label="Receive marketing emails" description="We will send you hourly updates about our products" />
            <Checkbox className='rounded-md border p-4' name="required" label="This is a required checkbox" />
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
        </fetcher.Form>
      </RemixFormProvider>
    );
  };`,
      },
    },
  },
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testInvalidSubmission(storyContext);
    await testValidSubmission(storyContext);
  },
};