import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@lambdacurry/forms/remix-hook-form/date-picker';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, Form, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Regex for finding day buttons in calendar
const DAY_BUTTON_REGEX = /^\d+$/;

const formSchema = z.object({
  date: z.coerce.date({
    required_error: 'Please select a date',
  }),
});

type FormData = z.infer<typeof formSchema>;

const ControlledDatePickerExample = () => {
  const fetcher = useFetcher<{ message: string; date: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
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
            date: data.date.toISOString(),
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
          <DatePicker name="date" label="Select a date" />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.date && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted with date:</p>
              <p className="text-sm text-gray-500">{new Date(fetcher.data.date).toLocaleDateString()}</p>
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

  return { message: 'Date selected successfully', date: data.date.toISOString() };
};

const meta: Meta<typeof DatePicker> = {
  title: 'RemixHookForm/Date Picker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledDatePickerExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A date picker component for selecting a date.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state', async () => {
      // Verify the date picker trigger is present and has correct label
      const datePickerTrigger = canvas.getByRole('button', { name: /select a date/i });
      expect(datePickerTrigger).toBeInTheDocument();

      // Verify submit button is present but form hasn't been submitted yet
      const submitButton = canvas.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
      expect(canvas.queryByText('Submitted with date:')).not.toBeInTheDocument();
    });

    await step('Open calendar and select date', async () => {
      // Find and click the date picker trigger button
      const datePickerTrigger = canvas.getByRole('button', { name: /select a date/i });
      await userEvent.click(datePickerTrigger);

      // Wait for calendar dialog to appear (it's rendered in a portal)
      const dialog = await within(document.body).findByRole('dialog');
      const dialogCanvas = within(dialog);

      // Find any available day button in the calendar (look for a button with a number)
      // We'll look for any day button that's not disabled
      const dayButtons = await dialogCanvas.findAllByRole('button');
      const availableDayButton = dayButtons.find((button) => {
        const text = button.textContent;
        return text && DAY_BUTTON_REGEX.test(text.trim()) && !button.hasAttribute('disabled');
      });

      if (!availableDayButton) {
        throw new Error('No available day button found in calendar');
      }

      await userEvent.click(availableDayButton);
    });

    await step('Submit form and verify success', async () => {
      // Submit the form
      const submitButton = canvas.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Verify submission with comprehensive assertions
      await expect(canvas.findByText('Submitted with date:')).resolves.toBeInTheDocument();
      // Check for any date format (MM/DD/YYYY or DD/MM/YYYY)
      await expect(canvas.findByText(/\d{1,2}\/\d{1,2}\/\d{4}/)).resolves.toBeInTheDocument();
    });
  },
};
