import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import { Button } from '@lambdacurry/forms/ui/button';
import { FormMessage } from '@lambdacurry/forms/ui/form';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { Form } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import type {} from '@testing-library/dom';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const AVAILABLE_COLORS = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
] as const;

const formSchema = z.object({
  colors: z.record(z.boolean()).refine((colors) => {
    return Object.values(colors).some((selected) => selected);
  }, 'Please select at least one color'),
});

type FormData = z.infer<typeof formSchema>;

const ControlledCheckboxListExample = () => {
  const fetcher = useFetcher<{ message: string; selectedColors: string[] }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      colors: AVAILABLE_COLORS.reduce((acc, { value }) => ({ ...acc, [value]: false }), {}),
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
    submitHandlers: {
      onValid: (data) => {
        const selectedColors = Object.entries(data.colors)
          .filter(([_, selected]) => selected)
          .map(([color]) => color);

        const filteredData = Object.fromEntries(
          Object.entries(data).filter(([key]) => !AVAILABLE_COLORS.some((color) => color.value === key)),
        );

        fetcher.submit(createFormData({ ...filteredData, selectedColors }), {
          method: 'post',
          action: '/',
        });
      },
    },
  });

  console.log(methods.formState);

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Select your favorite colors:</p>
          <div className="grid gap-4">
            {AVAILABLE_COLORS.map(({ value, label }) => (
              <Checkbox key={value} className="rounded-md border p-4" name={`colors.${value}`} label={label} />
            ))}
          </div>
          <FormMessage error={methods.formState.errors.colors?.root?.message} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.selectedColors && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted with selected colors:</p>
              <p className="text-sm text-gray-500">{fetcher.data.selectedColors.join(', ')}</p>
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

  const selectedColors = Object.entries(data.colors)
    .filter(([_, selected]) => selected)
    .map(([color]) => AVAILABLE_COLORS.find((c) => c.value === color)?.label ?? color);

  return { message: 'Colors selected successfully', selectedColors };
};

const meta: Meta<typeof Checkbox> = {
  title: 'RemixHookForm/CheckboxList',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledCheckboxListExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = ({ canvas }: StoryContext) => {
  AVAILABLE_COLORS.forEach(({ label }) => {
    const checkbox = canvas.getByLabelText(label);
    expect(checkbox).not.toBeChecked();
  });
};

const testErrorState = async ({ canvas }: StoryContext) => {
  // Submit form without selecting any colors
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  // Check if error message is displayed
  await expect(await canvas.findByText('Please select at least one color')).toBeInTheDocument();
};

const testColorSelection = async ({ canvas }: StoryContext) => {
  // Select two colors
  const redCheckbox = canvas.getByLabelText('Red');
  const blueCheckbox = canvas.getByLabelText('Blue');

  await userEvent.click(redCheckbox);
  await userEvent.click(blueCheckbox);

  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  // Check if the selected colors are displayed
  await expect(await canvas.findByText('Red, Blue')).toBeInTheDocument();
};

export const Tests: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A checkbox list component for selecting multiple colors.',
      },
    },
  },
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testErrorState(storyContext);
    await testColorSelection(storyContext);
  },
};