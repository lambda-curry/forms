import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import { } from './remix-form';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { Button } from './button';
import { ControlledDropdownMenu, DropdownMenuItem } from './dropdown-menu';

// Form schema definition
const formSchema = z.object({
  favoriteColor: z.string().min(1, "Please select a color"),
});

type FormData = z.infer<typeof formSchema>;

// Component for the form
const ControlledDropdownMenuExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favoriteColor: "",
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit} method="post" action="/">
        <ControlledDropdownMenu
          name="favoriteColor"
          label="Favorite Color"
          description="Choose your favorite color."
          dropdownClassName='border'
        >
          <DropdownMenuItem onSelect={() => methods.setValue("favoriteColor", "Red")}>Red</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => methods.setValue("favoriteColor", "Green")}>Green</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => methods.setValue("favoriteColor", "Blue")}>Blue</DropdownMenuItem>

        </ControlledDropdownMenu>
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
const meta: Meta<typeof ControlledDropdownMenu> = {
  title: 'UI/Fields/ControlledDropdownMenu',
  component: ControlledDropdownMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledDropdownMenuExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof ControlledDropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = (canvas: ReturnType<typeof within>) => {
  const dropdownButton = canvas.getByRole('button', { name: 'Select an option' });
  expect(dropdownButton).toHaveTextContent('Select an option');
};

const testColorSelection = async (canvas: ReturnType<typeof within>) => {
  const dropdownButton = canvas.getByRole('button', { name: 'Select an option' });
  await userEvent.click(dropdownButton);

  const greenOption = canvas.getByRole('menuitem', { name: 'Green' });
  await userEvent.click(greenOption);

  expect(dropdownButton).toHaveTextContent('Green');
};

const testInvalidSubmission = async (canvas: ReturnType<typeof within>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(canvas.findByText('Please select a color')).resolves.toBeInTheDocument();
};

const testValidSubmission = async (canvas: ReturnType<typeof within>) => {
  const dropdownButton = canvas.getByRole('button', { name: 'Green' });
  await userEvent.click(dropdownButton);

  const blueOption = canvas.getByRole('menuitem', { name: 'Blue' });
  await userEvent.click(blueOption);

  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

// Stories
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    testDefaultValues(canvas);
    await testInvalidSubmission(canvas);
    await testColorSelection(canvas);
    await testValidSubmission(canvas);
  },
};