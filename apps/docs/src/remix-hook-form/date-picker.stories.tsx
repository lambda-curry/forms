import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@lambdacurry/forms/remix-hook-form/date-picker';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, Form, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  date: z.date({
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

// Helper function for sleep delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A date picker component for selecting a date.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find all buttons in the form
    const buttons = await canvas.findAllByRole('button');

    // Select the date picker button (the one with aria-haspopup="dialog")
    const datePickerButton = buttons.find((btn) => btn.getAttribute('aria-haspopup') === 'dialog');
    if (!datePickerButton) {
      throw new Error('Could not find date picker button');
    }
    expect(datePickerButton).toBeInTheDocument();

    // Click to open the date picker
    await userEvent.click(datePickerButton);

    // Wait for date picker dialog to open
    await sleep(200);

    // Find the dialog popup using document.querySelector
    const dialog = document.querySelector('[role="dialog"]');

    // Look for day buttons within the dialog using the dialog element's within scope
    const dialogContent = within(dialog as HTMLElement);

    // Find all day cells
    const dayCells = await dialogContent.findAllByRole('gridcell');

    // Click on a day that's not disabled
    const dayToClick = dayCells.find((day) => day.textContent && /^\d+$/.test(day.textContent.trim()));

    if (dayToClick) {
      await userEvent.click(dayToClick);
    } else {
      // If we can't find a specific day, click the first day cell
      await userEvent.click(dayCells[0]);
    }

    // Wait for date picker to close
    await sleep(100);

    // Now click the submit button
    const submitButton = buttons.find((btn) => btn.textContent?.includes('Submit'));
    if (!submitButton) {
      throw new Error('Could not find submit button');
    }

    await userEvent.click(submitButton);

    // Wait for form submission to complete
    await sleep(200);

    // After submission, the date picker button should now show a date value
    // instead of "Select a date"
    const updatedPickerButton = await canvas.findByRole('button', {
      expanded: false,
    });

    // Check if this is the date picker button
    expect(updatedPickerButton.getAttribute('aria-haspopup')).toBe('dialog');

    // Verify the button's text is no longer just "Select a date"
    const buttonText = updatedPickerButton.textContent || '';
    expect(buttonText).not.toContain('Select a date');
    expect(buttonText).toMatch(/\d/); // Should contain at least one digit
  },
};
