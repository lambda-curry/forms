import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenuSelect } from '@lambdacurry/forms/remix-hook-form/dropdown-menu-select';
import { Button } from '@lambdacurry/forms/ui/button';
import { FormMessage } from '@lambdacurry/forms/ui/form';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Form, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const AVAILABLE_FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
] as const;

const formSchema = z.object({
  fruit: z.string({
    required_error: 'Please select a fruit',
  }),
});

type FormData = z.infer<typeof formSchema>;

const ControlledDropdownMenuSelectExample = () => {
  const fetcher = useFetcher<{ message: string; selectedFruit: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fruit: '',
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
            selectedFruit: data.fruit,
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
          <DropdownMenuSelect name="fruit" label="Select a fruit" options={AVAILABLE_FRUITS} />
          <FormMessage error={methods.formState.errors.fruit?.message} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.selectedFruit && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted with fruit:</p>
              <p className="text-sm text-gray-500">
                {AVAILABLE_FRUITS.find((fruit) => fruit.value === fetcher.data?.selectedFruit)?.label}
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

  return { message: 'Fruit selected successfully', selectedFruit: data.fruit };
};

const meta: Meta<typeof DropdownMenuSelect> = {
  title: 'RemixHookForm/DropdownMenuSelect',
  component: DropdownMenuSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      root: {
        Component: ControlledDropdownMenuSelectExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof DropdownMenuSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A dropdown menu select component for selecting a single option.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dropdown
    const dropdownButton = canvas.getByRole('combobox');
    await userEvent.click(dropdownButton);

    // Select an option
    const option = canvas.getByRole('option', { name: 'Banana' });
    await userEvent.click(option);

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the selected option is displayed
    await expect(await canvas.findByText('Banana')).toBeInTheDocument();
  },
};
