import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher, Form } from '@remix-run/react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../../lib/storybook/remix-stub';
import { ControlledDatePicker } from './date-picker';
import { Button } from './button';

const formSchema = z.object({
  eventDate: z.coerce.date()
});

type FormData = z.infer<typeof formSchema>;

const ControlledDatePickerExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDate: undefined,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit} method="post" action="/">
        <ControlledDatePicker
          name="eventDate"
          label="Event Date"
          description="Choose the date for your event."
        />
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
const meta: Meta<typeof ControlledDatePicker> = {
  title: 'UI/Fields/ControlledDatePicker',
  component: ControlledDatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledDatePickerExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof ControlledDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = (canvas: ReturnType<typeof within>) => {
  const datePickerButton = canvas.getByRole('button', { name: 'Event Date' });
  expect(datePickerButton).toHaveTextContent('Event Date');
};

const testDateSelection = async (canvas: ReturnType<typeof within>) => {

  const datePickerButton = canvas.getByRole('button', { name: 'Event Date' });
  await userEvent.click(datePickerButton);


  await waitFor(async () => {
    const popover = document.querySelector('[role="dialog"]');
    expect(popover).not.toBeNull();

    if (popover) {
      const calendar = within(popover as HTMLElement).getByRole('grid');
      expect(calendar).toBeInTheDocument();

      const dateCell = within(calendar).getByRole('gridcell', { name: '15' });
      await userEvent.click(dateCell);
    }
  });

  await waitFor(() => {
    // biome-ignore lint/performance/useTopLevelRegex: ignore for test
    const updatedDatePickerButton = canvas.getByRole('button', { name: /15/ });
    expect(updatedDatePickerButton).toBeInTheDocument();
  });
};

const testSubmission = async (canvas: ReturnType<typeof within>) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

// Stories
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    testDefaultValues(canvas);
    await testDateSelection(canvas);
    await testSubmission(canvas);
  },
};