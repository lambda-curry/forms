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
  title: 'RemixHookForm/DatePicker',
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the date picker
    const datePickerButton = canvas.getByRole('button', { name: /select a date/i });
    await userEvent.click(datePickerButton);

    // Select a date (today)
    const today = new Date();
    const formattedDate = today.getDate().toString();
    const dateButton = canvas.getByRole('button', { name: new RegExp(`^${formattedDate}$`) });
    await userEvent.click(dateButton);

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the selected date is displayed
    const selectedDate = new Date(today).toLocaleDateString();
    await expect(await canvas.findByText(selectedDate)).toBeInTheDocument();
  },
};
