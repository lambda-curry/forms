import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@lambdacurry/forms/remix-hook-form/date-picker';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '@remix-run/node';
import { Form, useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

const formSchema = z.object({
  eventDate: z.coerce.date(),
});

type FormData = z.infer<typeof formSchema>;

const DatePickerExample = () => {
  const fetcher = useFetcher<{ message?: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDate: undefined,
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
        <DatePicker name="eventDate" label="Event Date" description="Choose the date for your event." />
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
const meta: Meta<typeof DatePicker> = {
  title: 'RemixHookForm/Date Picker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: DatePickerExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = ({ canvas }: StoryContext) => {
  const datePickerButton = canvas.getByRole('button', { name: 'Event Date' });
  expect(datePickerButton).toHaveTextContent('Event Date');
};

const testDateSelection = async ({ canvas }: StoryContext) => {
  const datePickerButton = canvas.getByRole('button', { name: 'Event Date' });
  await userEvent.click(datePickerButton);

  await waitFor(async () => {
    const popover = document.querySelector('[role="dialog"]');
    expect(popover).not.toBeNull();

    if (popover) {
      const calendar = within(popover as HTMLElement).getByRole('grid');
      expect(calendar).toBeInTheDocument();

      const dateCell = within(calendar).getByText('15');
      expect(dateCell).toBeInTheDocument();
      await userEvent.click(dateCell);
    }
  });

  const dateToSelect = '15';
  await waitFor(() => {
    const updatedDatePickerButton = canvas.getByRole('button', { name: new RegExp(dateToSelect, 'i') });
    expect(updatedDatePickerButton).toBeInTheDocument();
  });
};

const testSubmission = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
};

// Stories
export const Tests: Story = {
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testDateSelection(storyContext);
    await testSubmission(storyContext);
  },
};
