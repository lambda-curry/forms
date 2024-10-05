import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { Button } from '../ui/button';
import { RemixRadioGroupField } from './remix-radio-group';
import { RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise'], {
    required_error: "You need to select a plan",
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

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof RemixRadioGroupField> = {
  title: 'Remix/RemixRadioGroupField',
  component: RemixRadioGroupField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: RemixRadioGroupExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof RemixRadioGroupField>;

export default meta;
type Story = StoryObj<typeof meta>;

const testRadioGroupSelection = async (canvas: ReturnType<typeof within>) => {
  const proRadio = canvas.getByLabelText('Pro');
  await userEvent.click(proRadio);
  expect(proRadio).toBeChecked();
};

const testSubmission = async (canvas: ReturnType<typeof within>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await testRadioGroupSelection(canvas);
    await testSubmission(canvas);
  },
};