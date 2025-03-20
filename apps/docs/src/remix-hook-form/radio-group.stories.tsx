import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup } from '@lambdacurry/forms/remix-hook-form/radio-group';
import { Button } from '@lambdacurry/forms/ui/button';
import { FormMessage } from '@lambdacurry/forms/ui/form';
import type { ActionFunctionArgs } from '../lib/storybook/remix-mock';
import { Form, useFetcher } from '../lib/storybook/remix-mock';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const AVAILABLE_SIZES = [
  { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
] as const;

const formSchema = z.object({
  size: z.string({
    required_error: 'Please select a size',
  }),
});

type FormData = z.infer<typeof formSchema>;

const ControlledRadioGroupExample = () => {
  const fetcher = useFetcher<{ message: string; selectedSize: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: '',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
    submitHandlers: {
      onValid: (data) => {
        fetcher.submit(
          createFormData({
            selectedSize: data.size,
          }),
          {
            method: 'post',
            action: '/',
          },
        );
      },
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <RadioGroup name="size" label="Select a size" options={AVAILABLE_SIZES} />
          <FormMessage error={methods.formState.errors.size?.message} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.selectedSize && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted with size:</p>
              <p className="text-sm text-gray-500">
                {AVAILABLE_SIZES.find((size) => size.value === fetcher.data?.selectedSize)?.label}
              </p>
            </div>
          )}
        </div>
      </Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Size selected successfully', selectedSize: data.size };
};

const meta: Meta<typeof RadioGroup> = {
  title: 'RemixHookForm/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledRadioGroupExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A radio group component for selecting a single option from a list.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Select an option
    const mediumOption = canvas.getByLabelText('Medium');
    await userEvent.click(mediumOption);

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the selected option is displayed
    await expect(await canvas.findByText('Medium')).toBeInTheDocument();
  },
};