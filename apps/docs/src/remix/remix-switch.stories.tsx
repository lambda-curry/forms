import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { } from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';
import { RemixSwitch } from '@lambdacurry/forms/remix/remix-switch';
import { Button } from '@lambdacurry/forms/ui/button';

const formSchema = z.object({
  notifications: z.boolean().default(false),
  darkMode: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const ControlledSwitchExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notifications: false,
      darkMode: false,
    },
    fetcher,
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} method="post" action="/">
        <div className='grid gap-4'>
          <RemixSwitch name="notifications" label="Enable notifications" />
          <RemixSwitch name="darkMode" label="Dark mode" description="Toggle dark mode for the application" />
        </div>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const {
    errors,
    data,
    receivedValues,
  } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Settings updated successfully' };
};

const meta: Meta<typeof RemixSwitch> = {
  title: 'Remix/RemixSwitch',
  component: RemixSwitch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator([
      {
        path: '/',
        Component: ControlledSwitchExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    ]),
  ],
} satisfies Meta<typeof RemixSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const notificationsSwitch = canvas.getByLabelText('Enable notifications');
  const darkModeSwitch = canvas.getByLabelText('Dark mode');
  expect(notificationsSwitch).not.toBeChecked();
  expect(darkModeSwitch).not.toBeChecked();
};

const testToggleSwitches = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const notificationsSwitch = canvas.getByLabelText('Enable notifications');
  const darkModeSwitch = canvas.getByLabelText('Dark mode');

  await userEvent.click(notificationsSwitch);
  await userEvent.click(darkModeSwitch);

  expect(notificationsSwitch).toBeChecked();
  expect(darkModeSwitch).toBeChecked();
};

const testSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(await canvas.findByText('Settings updated successfully')).toBeInTheDocument();
};

export const Tests: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default switch component with form integration.'
      },
    },
  },
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testToggleSwitches(storyContext);
    await testSubmission(storyContext);
  },
};