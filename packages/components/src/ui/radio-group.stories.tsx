import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { ControlledRadioGroup, RadioGroupItem } from './radio-group';
import { Button } from './button';

// Form schema definition
const formSchema = z.object({
  favoriteColor: z.enum(['red', 'green', 'blue'], {
    required_error: "Please select a color",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Component for the form
const ControlledRadioGroupExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favoriteColor: undefined,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit} method="post" action="/">
        <ControlledRadioGroup name="favoriteColor" label="Favorite Color">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="red" id="red" />
            <label htmlFor="red">Red</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="green" id="green" />
            <label htmlFor="green">Green</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blue" id="blue" />
            <label htmlFor="blue">Blue</label>
          </div>
        </ControlledRadioGroup>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </Form>
    </RemixFormProvider>
  );
};

// Action function for form submission
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

// Storybook configuration
const meta: Meta<typeof ControlledRadioGroup> = {
  title: 'UI/Fields/ControlledRadioGroup',
  component: ControlledRadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledRadioGroupExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof ControlledRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = (canvas: ReturnType<typeof within>) => {
  const radioButtons = canvas.getAllByRole('radio');
  radioButtons.forEach((radio: HTMLInputElement) => {
    expect(radio).not.toBeChecked();
  });
};

const testInvalidSubmission = async (canvas: ReturnType<typeof within>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(canvas.findByText('Please select a color')).resolves.toBeInTheDocument();
};

const testValidSubmission = async (canvas: ReturnType<typeof within>) => {
  const greenRadio = canvas.getByLabelText('Green');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await userEvent.click(greenRadio);
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

// Stories
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    testDefaultValues(canvas);
    await testInvalidSubmission(canvas);
    await testValidSubmission(canvas);
  },
};