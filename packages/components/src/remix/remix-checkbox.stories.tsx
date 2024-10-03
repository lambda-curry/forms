
import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { BoundFunctions, queries } from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { RemixCheckbox } from './remix-checkbox';
import { Button } from '../ui/button';

const formSchema = z.object({
  terms: z.boolean().optional().refine(val => val === true, 'You must accept the terms and conditions'),
  marketing: z.boolean().optional(),
  required: z.boolean().optional().refine(val => val === true, 'This field is required'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledCheckboxExample = () => {
  const fetcher = useFetcher();
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
        <RemixCheckbox name="terms" label="Accept terms and conditions" />
        <RemixCheckbox name="marketing" label="Receive marketing emails" description="We will send you weekly updates about our products" />
        <RemixCheckbox name="required" label="This is a required checkbox" />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const {
    errors,
    data,
    receivedValues,
  } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { success: true };
};

const meta: Meta<typeof RemixCheckbox> = {
  title: 'Remix/RemixCheckbox',
  component: RemixCheckbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledCheckboxExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof RemixCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = (canvas: BoundFunctions<typeof queries>) => {
  const termsCheckbox = canvas.getByLabelText('Accept terms and conditions');
  const marketingCheckbox = canvas.getByLabelText('Receive marketing emails');
  const requiredCheckbox = canvas.getByLabelText('This is a required checkbox');
  expect(termsCheckbox).not.toBeChecked();
  expect(marketingCheckbox).not.toBeChecked();
  expect(requiredCheckbox).not.toBeChecked();
};

const testInvalidSubmission = async (canvas: BoundFunctions<typeof queries>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(await canvas.findByText('You must accept the terms and conditions')).toBeInTheDocument();
  await expect(await canvas.findByText('This field is required')).toBeInTheDocument();
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    testDefaultValues(canvas);
    await testInvalidSubmission(canvas);
  },
};