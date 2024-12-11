import { zodResolver } from '@hookform/resolvers/zod';
import { RemixDropdownMenuSelect } from '@lambdacurry/forms/remix/remix-dropdown-menu-select';
import { Button } from '@lambdacurry/forms/ui/button';
import { DropdownMenuItem } from '@lambdacurry/forms/ui/dropdown-menu';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

// Form schema definition
const formSchema = z.object({
  favoriteColor: z.string().min(1, 'Please select a color'),
});

type FormData = z.infer<typeof formSchema>;

// Component for the form
const RemixDropdownMenuSelectExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favoriteColor: '',
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
        <RemixDropdownMenuSelect
          name="favoriteColor"
          label="Favorite Color"
          description="Choose your favorite color."
          dropdownClassName="border"
        >
          <DropdownMenuItem onSelect={() => methods.setValue('favoriteColor', 'Red')}>Red</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => methods.setValue('favoriteColor', 'Green')}>Green</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => methods.setValue('favoriteColor', 'Blue')}>Blue</DropdownMenuItem>
        </RemixDropdownMenuSelect>
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
  const { errors, receivedValues: defaultValues } = await getValidatedFormData<FormData>(
    request,
    zodResolver(formSchema),
  );

  if (errors) {
    return { errors, defaultValues };
  }

  return { message: 'Form submitted successfully' };
};

// Storybook configuration
const meta: Meta<typeof RemixDropdownMenuSelect> = {
  title: 'Remix/RemixDropdownMenuSelect',
  component: RemixDropdownMenuSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: RemixDropdownMenuSelectExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof RemixDropdownMenuSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Update the test functions to accept storyContext
const testDefaultValues = ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const dropdownButton = canvas.getByRole('button', { name: 'Select an option' });
  expect(dropdownButton).toHaveTextContent('Select an option');
};

const testInvalidSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(canvas.findByText('Please select a color')).resolves.toBeInTheDocument();
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
