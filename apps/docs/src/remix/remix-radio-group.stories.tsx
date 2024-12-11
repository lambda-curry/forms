import { zodResolver } from '@hookform/resolvers/zod';
import { RemixRadioGroupField } from '@lambdacurry/forms/remix/remix-radio-group';
import { Button } from '@lambdacurry/forms/ui/button';
import { RadioGroupItem } from '@lambdacurry/forms/ui/radio-group';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const formSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise'], {
    required_error: 'You need to select a plan',
  }),
});

type FormData = z.infer<typeof formSchema>;

const RemixRadioGroupExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: undefined,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit} method="post" action="/">
        <RemixRadioGroupField
          name="plan"
          label="Select a plan"
          description="Choose the plan that best fits your needs."
          className="space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="starter" id="starter" />
            <label htmlFor="starter">Starter</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="pro" />
            <label htmlFor="pro">Pro</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <label htmlFor="enterprise">Enterprise</label>
          </div>
        </RemixRadioGroupField>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors, defaultValues };
  }

  return { message: 'Plan selected successfully' };
};

const meta: Meta<typeof RemixRadioGroupField> = {
  title: 'Remix/RemixRadioGroup',
  component: RemixRadioGroupField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: RemixRadioGroupExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof RemixRadioGroupField>;

export default meta;
type Story = StoryObj<typeof meta>;

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('You need to select a plan')).resolves.toBeInTheDocument();
};

const testRadioGroupSelection = async ({ canvas }: StoryContext) => {
  const proRadio = canvas.getByLabelText('Pro');
  await userEvent.click(proRadio);
  expect(proRadio).toBeChecked();
};

const testSubmission = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Plan selected successfully')).resolves.toBeInTheDocument();
};

export const Tests: Story = {
  play: async (storyContext) => {
    await testInvalidSubmission(storyContext);
    await testRadioGroupSelection(storyContext);
    await testSubmission(storyContext);
  },
};
