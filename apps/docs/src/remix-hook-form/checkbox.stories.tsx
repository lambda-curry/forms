import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
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
          />
          <Checkbox
            className="rounded-md border p-4"
            name="marketing"
            label="Receive marketing emails"
            description="We will send you hourly updates about our products"
          />
          <Checkbox 
            className="rounded-md border p-4" 
            name="required" 
            label="This is a required checkbox"
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

const handleFormSubmission = async (request: Request) => {
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
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
  const termsContainer = canvas.getByText('Accept terms and conditions').closest('.form-item');
  const marketingContainer = canvas.getByText('Receive marketing emails').closest('.form-item');
  const requiredContainer = canvas.getByText('This is a required checkbox').closest('.form-item');
  
  expect(termsContainer?.querySelector('[role="checkbox"]')).not.toBeChecked();
  expect(marketingContainer?.querySelector('[role="checkbox"]')).not.toBeChecked();
  expect(requiredContainer?.querySelector('[role="checkbox"]')).not.toBeChecked();
};

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(await canvas.findByText('You must accept the terms and conditions')).toBeInTheDocument();
  await expect(await canvas.findByText('This field is required')).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const termsCheckbox = canvas.getByText('Accept terms and conditions').closest('.form-item')?.querySelector('[role="checkbox"]');
  const requiredCheckbox = canvas.getByText('This is a required checkbox').closest('.form-item')?.querySelector('[role="checkbox"]');
  
  if (termsCheckbox && requiredCheckbox) {
    await userEvent.click(termsCheckbox);
    await userEvent.click(requiredCheckbox);

    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await expect(await canvas.findByText('Form submitted successfully')).toBeInTheDocument();
  }
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
