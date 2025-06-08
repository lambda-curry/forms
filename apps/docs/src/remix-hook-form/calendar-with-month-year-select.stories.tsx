import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@lambdacurry/forms/ui/button';
import { Calendar } from '@lambdacurry/forms/ui/calendar';
import { Label } from '@lambdacurry/forms/ui/label';
import { Select } from '@lambdacurry/forms/ui/select';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { type ActionFunctionArgs, Form, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { expect, userEvent, within } from 'storybook/test';
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
  const [date, setDate] = React.useState<Date | undefined>();

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

// Helper function for sleep delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A calendar component with configurable month/year dropdown selection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for initial render
    await sleep(500);

    // Find the dropdown select button
    const dropdownSelectButton = await canvas.findByRole('combobox', { expanded: false });
    expect(dropdownSelectButton).toBeInTheDocument();

    // Click to open the dropdown
    await userEvent.click(dropdownSelectButton);
    await sleep(500);

    // Find and click "Month Only" option - look in the popover content
    const monthOnlyOption =
      document.querySelector('[data-value="dropdown-months"]') || (await canvas.findByText('Month Only'));
    await userEvent.click(monthOnlyOption);
    await sleep(300);

    // Verify the dropdown closed and selection changed
    expect(dropdownSelectButton).toHaveTextContent('Month Only');

    // Find a day in the calendar to click
    const dayButtons = await canvas.findAllByRole('gridcell');
    const availableDay = dayButtons.find(
      (day) => day.textContent && /^\d+$/.test(day.textContent.trim()) && !day.hasAttribute('aria-disabled'),
    ) as HTMLElement;

    console.log('>>>> availableDay', availableDay);

    await userEvent.click(availableDay);
    await sleep(300);

    // Find and click the submit button
    const submitButton = await canvas.findByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // Wait for form submission
    await sleep(1000);

    // Verify submission results
    expect(canvas.getByText('Submitted with:')).toBeInTheDocument();
    expect(canvas.getByText(/Date:/)).toBeInTheDocument();
    expect(canvas.getByText('Dropdown Type: dropdown-months')).toBeInTheDocument();
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for initial render
    await sleep(500);

    // Find the dropdown select button
    const dropdownSelectButton = await canvas.findByRole('combobox', { expanded: false });
    expect(dropdownSelectButton).toBeInTheDocument();

    // Click to open the dropdown
    await userEvent.click(dropdownSelectButton);
    await sleep(500);

    // Find and click "Year Only" option - look in the popover content
    const yearOnlyOption =
      document.querySelector('[data-value="dropdown-years"]') || (await canvas.findByText('Year Only'));
    await userEvent.click(yearOnlyOption);
    await sleep(300);

    // Verify the dropdown closed and selection changed
    expect(dropdownSelectButton).toHaveTextContent('Year Only');

    // Test calendar interaction with year-only dropdown
    const dayButtons = await canvas.findAllByRole('gridcell');
    const availableDay = dayButtons.find(
      (day) => day.textContent && /^\d+$/.test(day.textContent.trim()) && !day.hasAttribute('aria-disabled'),
    ) as HTMLElement;

    console.log('>>>> availableDay', availableDay);

    if (availableDay) {
      await userEvent.click(availableDay);
      await sleep(300);
    }

    // Submit the form
    const submitButton = await canvas.findByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    await sleep(1000);

    // Verify submission with year-only dropdown
    expect(canvas.getByText('Submitted with:')).toBeInTheDocument();
    expect(canvas.getByText('Dropdown Type: dropdown-years')).toBeInTheDocument();
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for initial render
    await sleep(500);

    // Verify default dropdown selection
    const dropdownSelectButton = await canvas.findByRole('combobox', { expanded: false });
    expect(dropdownSelectButton).toHaveTextContent('Month and Year');

    // Test calendar navigation with month/year dropdowns
    // Look for month/year dropdown elements in the calendar
    const calendarDropdowns = document.querySelectorAll('[data-slot="calendar"] select');
    expect(calendarDropdowns.length).toBeGreaterThan(0);

    // Select a date
    const dayButtons = await canvas.findAllByRole('gridcell');
    const availableDay = dayButtons.find(
      (day) => day.textContent && /^\d+$/.test(day.textContent.trim()) && !day.hasAttribute('aria-disabled'),
    ) as HTMLElement;

    console.log('>>>> availableDay', availableDay);

    if (availableDay) {
      await userEvent.click(availableDay);
      await sleep(300);
    }

    // Submit the form
    const submitButton = await canvas.findByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    await sleep(1000);

    // Verify submission with default dropdown
    expect(canvas.getByText('Submitted with:')).toBeInTheDocument();
    expect(canvas.getByText('Dropdown Type: dropdown')).toBeInTheDocument();
  },
};
