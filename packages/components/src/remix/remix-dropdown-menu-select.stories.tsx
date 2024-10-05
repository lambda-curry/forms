import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { Button } from '../ui/button';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { RemixDropdownMenuSelect } from './remix-dropdown-menu-select';

// Form schema definition
const formSchema = z.object({
  favoriteColor: z.string().min(1, "Please select a color"),
});

type FormData = z.infer<typeof formSchema>;

// Component for the form
const RemixDropdownMenuSelectExample = () => {
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
        <RemixDropdownMenuSelect
          name="favoriteColor"
          label="Favorite Color"
          description="Choose your favorite color."
          dropdownClassName='border'
        >
          <DropdownMenuItem onSelect={() => methods.setValue("favoriteColor", "Red")}>Red</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => methods.setValue("favoriteColor", "Green")}>Green</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => methods.setValue("favoriteColor", "Blue")}>Blue</DropdownMenuItem>
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
const meta: Meta<typeof RemixDropdownMenuSelect> = {
  title: 'Remix/RemixDropdownMenuSelect',
  component: RemixDropdownMenuSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: RemixDropdownMenuSelectExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof RemixDropdownMenuSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test scenarios
const testDefaultValues = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const dropdownButton = canvas.getByRole('button', { name: 'Select an option' });
  expect(dropdownButton).toHaveTextContent('Select an option');
};

const testInvalidSubmission = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  await expect(canvas.findByText('Please select a color')).resolves.toBeInTheDocument();
};


const testColorSelection = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const dropdownButton = canvas.getByRole('button', { name: 'Select an option' });
  await userEvent.click(dropdownButton);

  // Note: the using the parent container here allows us to find the dropdown menu that is a portal at the bottom of our document
  const parentContainer = within(canvasElement.parentNode as HTMLElement);

  await expect(parentContainer.findByRole('menuitem', { name: 'Green' })).resolves.toBeInTheDocument();

  const greenOption = parentContainer.getByRole('menuitem', { name: 'Green' });
  await userEvent.click(greenOption);

  expect(dropdownButton).toHaveTextContent('Green');
};


const testValidSubmission = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);


  // Note: I believe hidden needs to be true now since the portal is open, the test runner doesn't think these buttons are accessible
  const dropdownButton = canvas.getByRole('button', { name: 'Green', hidden: true });
  await userEvent.click(dropdownButton);


  const parentContainer = within(canvasElement.parentNode as HTMLElement);


  const blueOption = parentContainer.getByRole('menuitem', { name: 'Blue' });
  await userEvent.click(blueOption);

  // Note: I believe hidden needs to be true now since the portal is open, the test runner doesn't think these buttons are accessible
  const submitButton = canvas.getByRole('button', { name: 'Submit', hidden: true });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

// Stories
export const Default: Story = {
  play: async ({ canvasElement }) => {

    testDefaultValues(canvasElement);
    await testInvalidSubmission(canvasElement);
    await testColorSelection(canvasElement);
    await testValidSubmission(canvasElement);
  },
};