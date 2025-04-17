import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenuSelect } from '@lambdacurry/forms/remix-hook-form/dropdown-menu-select';
import { Button } from '@lambdacurry/forms/ui/button';
import { DropdownMenuItem } from '@lambdacurry/forms/ui/dropdown-menu';
import type { ActionFunctionArgs } from 'react-router';
import { Form, useFetcher } from 'react-router';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  fruit: z.string().min(1, 'Please select a fruit'),
});

type FormData = z.infer<typeof formSchema>;

const DropdownMenuSelectExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
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
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <DropdownMenuSelect
          name="fruit"
          label="Select a fruit"
        >
          {AVAILABLE_FRUITS.map((fruit) => (
            <DropdownMenuItem
              key={fruit.value}
              onSelect={() => methods.setValue('fruit', fruit.value)}
              className="cursor-pointer"
            >
              {fruit.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSelect>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { errors, receivedValues: defaultValues } = await getValidatedFormData<FormData>(
    request,
    zodResolver(formSchema),
  );

  if (errors) {
    return { errors, defaultValues };
  }

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof DropdownMenuSelect> = {
  title: 'RemixHookForm/DropdownMenuSelect',
  component: DropdownMenuSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: DropdownMenuSelectExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof DropdownMenuSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const dropdownButton = canvas.getByRole('button', { name: 'Select an option' });
  expect(dropdownButton).toHaveTextContent('Select an option');
};

const testInvalidSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(canvas.findByText('Please select a fruit')).resolves.toBeInTheDocument();
};

const testColorSelection = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const dropdownButton = canvas.getByRole('button', { name: 'Select an option' });
  await userEvent.click(dropdownButton);

  const parentContainer = within(canvasElement.parentNode as HTMLElement);

  await expect(parentContainer.findByRole('menuitem', { name: 'Green' })).resolves.toBeInTheDocument();

  const greenOption = parentContainer.getByRole('menuitem', { name: 'Green' });
  await userEvent.click(greenOption);

  expect(dropdownButton).toHaveTextContent('Green');
};

const testValidSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  const dropdownButton = canvas.getByRole('button', { name: 'Green', hidden: true });
  await userEvent.click(dropdownButton);

  const parentContainer = within(canvasElement.parentNode as HTMLElement);

  const blueOption = parentContainer.getByRole('menuitem', { name: 'Blue' });
  await userEvent.click(blueOption);

  const submitButton = canvas.getByRole('button', { name: 'Submit', hidden: true });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

export const Tests: Story = {
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testInvalidSubmission(storyContext);
    await testColorSelection(storyContext);
    await testValidSubmission(storyContext);
  },
};

const AVAILABLE_FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
] as const;
