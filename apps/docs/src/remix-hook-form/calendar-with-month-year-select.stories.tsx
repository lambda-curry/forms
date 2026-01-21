import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@lambdacurry/forms/ui/button';
import { Calendar } from '@lambdacurry/forms/ui/calendar';
import { Label } from '@lambdacurry/forms/ui/label';
import { Select } from '@lambdacurry/forms/ui/select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { type ActionFunctionArgs, Form, useFetcher } from 'react-router';
import { createFormData, getValidatedFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  date: z.coerce.date({
    required_error: 'Please select a date',
  }),
  captionLayout: z.enum(['dropdown', 'dropdown-months', 'dropdown-years']).optional(),
});

type FormData = z.infer<typeof formSchema>;

function CalendarWithMonthYearSelect() {
  const [dropdown, setDropdown] = React.useState<'dropdown' | 'dropdown-months' | 'dropdown-years'>('dropdown');
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12));

  const dropdownOptions = [
    { label: 'Month and Year', value: 'dropdown' },
    { label: 'Month Only', value: 'dropdown-months' },
    { label: 'Year Only', value: 'dropdown-years' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        captionLayout={dropdown}
        className="rounded-lg border shadow-sm"
      />
      <div className="flex flex-col gap-3">
        <Label htmlFor="dropdown" className="px-1">
          Dropdown
        </Label>
        <Select
          options={dropdownOptions}
          value={dropdown}
          onValueChange={(value) => setDropdown(value as 'dropdown' | 'dropdown-months' | 'dropdown-years')}
          placeholder="Dropdown"
          className="w-full"
        />
      </div>
    </div>
  );
}

const ControlledCalendarWithFormExample = () => {
  const fetcher = useFetcher<{ message: string; date: string; captionLayout: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      captionLayout: 'dropdown',
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
            captionLayout: data.captionLayout || 'dropdown',
          }),
          {
            method: 'post',
            action: '/',
          },
        );
      },
    },
  });

  const [dropdown, setDropdown] = React.useState<'dropdown' | 'dropdown-months' | 'dropdown-years'>('dropdown');
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12));

  const dropdownOptions = [
    { label: 'Month and Year', value: 'dropdown' },
    { label: 'Month Only', value: 'dropdown-months' },
    { label: 'Year Only', value: 'dropdown-years' },
  ];

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <Calendar
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                methods.setValue('date', selectedDate || new Date());
              }}
              captionLayout={dropdown}
              className="rounded-lg border shadow-sm"
            />
            <div className="flex flex-col gap-3">
              <Label htmlFor="dropdown-select" className="px-1">
                Dropdown Type
              </Label>
              <Select
                options={dropdownOptions}
                value={dropdown}
                onValueChange={(value) => {
                  const newLayout = value as 'dropdown' | 'dropdown-months' | 'dropdown-years';
                  setDropdown(newLayout);
                  methods.setValue('captionLayout', newLayout);
                }}
                placeholder="Select dropdown type"
                className="w-full"
              />
            </div>
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.date && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted with:</p>
              <p className="text-sm text-gray-500">Date: {new Date(fetcher.data.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Dropdown Type: {fetcher.data.captionLayout}</p>
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

  return {
    message: 'Calendar data submitted successfully',
    date: data.date.toISOString(),
    captionLayout: data.captionLayout || 'dropdown',
  };
};

const meta: Meta<typeof CalendarWithMonthYearSelect> = {
  title: 'RemixHookForm/Calendar with Month Year Select',
  component: CalendarWithMonthYearSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledCalendarWithFormExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof CalendarWithMonthYearSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A calendar component with configurable month/year dropdown selection.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state', async () => {
      // Verify the dropdown select button is present with default text
      const dropdownSelectButton = await canvas.findByText('Month and Year');
      expect(dropdownSelectButton).toBeInTheDocument();

      // Verify submit button is present but form hasn't been submitted yet
      const submitButton = canvas.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
      expect(canvas.queryByText('Submitted with:')).not.toBeInTheDocument();
    });

    await step('Change dropdown to Month Only', async () => {
      // Find and click the dropdown select button (use text content)
      const dropdownSelectButton = canvas.getByText('Month and Year');
      await userEvent.click(dropdownSelectButton);

      // Find and click "Month Only" option
      const monthOnlyOption = await within(document.body).findByText('Month Only');
      await userEvent.click(monthOnlyOption);

      // Verify the dropdown selection changed by checking the new text
      expect(canvas.getByText('Month Only')).toBeInTheDocument();
    });

    await step('Navigate calendar and select a date', async () => {
      // Use the calendar's month dropdown to navigate to July (month 7)
      const monthDropdown = canvas.getByLabelText('Choose the Month');
      await userEvent.selectOptions(monthDropdown, '6'); // June is month 6 (0-indexed)

      // Find a specific date button using aria-label (includes day of week)
      const dateButton = await canvas.findByRole('button', { name: /15th, 2025/i });
      await userEvent.click(dateButton);
    });

    await step('Submit form and verify success', async () => {
      // Submit the form
      const submitButton = canvas.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Verify submission results with comprehensive assertions
      await expect(canvas.findByText('Submitted with:')).resolves.toBeInTheDocument();
      await expect(canvas.findByText(/Date:/)).resolves.toBeInTheDocument();
      await expect(canvas.findByText('Dropdown Type: dropdown-months')).resolves.toBeInTheDocument();
    });
  },
};

export const YearOnlyDropdown: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with year-only dropdown selection.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state and change to Year Only', async () => {
      // Find the dropdown select button (use text content)
      const dropdownSelectButton = await canvas.findByText('Month and Year');
      expect(dropdownSelectButton).toBeInTheDocument();

      // Click to open the dropdown
      await userEvent.click(dropdownSelectButton);

      // Find and click "Year Only" option
      const yearOnlyOption = await within(document.body).findByText('Year Only');
      await userEvent.click(yearOnlyOption);

      // Verify the dropdown selection changed by checking the new text
      expect(canvas.getByText('Year Only')).toBeInTheDocument();
    });

    await step('Navigate calendar and select a date', async () => {
      // With year-only dropdown, we should see the year dropdown
      const yearDropdown = canvas.getByLabelText('Choose the Year');
      expect(yearDropdown).toBeInTheDocument();

      // Find a specific date button using aria-label (includes day of week and year)
      const dateButton = await canvas.findByRole('button', { name: /15th, 2025/ });
      await userEvent.click(dateButton);
    });

    await step('Submit form and verify success', async () => {
      // Submit the form
      const submitButton = canvas.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Verify submission with year-only dropdown
      await expect(canvas.findByText('Submitted with:')).resolves.toBeInTheDocument();
      await expect(canvas.findByText('Dropdown Type: dropdown-years')).resolves.toBeInTheDocument();
    });
  },
};

export const MonthAndYearDropdown: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Calendar with both month and year dropdown selection (default).',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state with default dropdown', async () => {
      // Verify default dropdown selection (use text content)
      const dropdownSelectButton = await canvas.findByText('Month and Year');
      expect(dropdownSelectButton).toBeInTheDocument();

      // Test calendar navigation with month/year dropdowns
      // Verify both month and year dropdowns are present
      const monthDropdown = canvas.getByLabelText('Choose the Month');
      const yearDropdown = canvas.getByLabelText('Choose the Year');
      expect(monthDropdown).toBeInTheDocument();
      expect(yearDropdown).toBeInTheDocument();
    });

    await step('Navigate calendar and select a date', async () => {
      // Use both month and year dropdowns to navigate
      const monthDropdown = canvas.getByLabelText('Choose the Month');
      const yearDropdown = canvas.getByLabelText('Choose the Year');

      // Navigate to July 2025
      await userEvent.selectOptions(monthDropdown, '6'); // June is month 6 (0-indexed)
      await userEvent.selectOptions(yearDropdown, '2025');

      // Find a specific date button using aria-label (includes day of week)
      const dateButton = await canvas.findByRole('button', { name: /15th, 2025/i });
      await userEvent.click(dateButton);
    });

    await step('Submit form and verify success', async () => {
      // Submit the form
      const submitButton = canvas.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Verify submission with default dropdown
      await expect(canvas.findByText('Submitted with:')).resolves.toBeInTheDocument();
      await expect(canvas.findByText('Dropdown Type: dropdown')).resolves.toBeInTheDocument();
    });
  },
};
