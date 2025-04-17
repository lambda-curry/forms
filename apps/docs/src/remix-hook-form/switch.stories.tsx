import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@lambdacurry/forms/remix-hook-form/switch';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, createFormData, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  notifications: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const ControlledSwitchExample = () => {
  const fetcher = useFetcher<{
    message: string;
    notifications: boolean;
    marketing: boolean;
  }>();

  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notifications: false,
      marketing: false,
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
            notifications: data.notifications,
            marketing: data.marketing,
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
      <form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <Switch name="notifications" label="Enable notifications" />
          <Switch name="marketing" label="Receive marketing emails" />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted preferences:</p>
              <p className="text-sm text-gray-500">
                Notifications: {fetcher.data.notifications ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-gray-500">
                Marketing emails: {fetcher.data.marketing ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          )}
        </div>
      </form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return {
    message: 'Preferences updated successfully',
    notifications: data.notifications,
    marketing: data.marketing,
  };
};

const meta: Meta<typeof Switch> = {
  title: 'RemixHookForm/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledSwitchExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A switch component for toggling boolean values.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Toggle switches
    const notificationsSwitch = canvas.getByLabelText('Enable notifications');
    const marketingSwitch = canvas.getByLabelText('Receive marketing emails');

    await userEvent.click(notificationsSwitch);
    expect(notificationsSwitch).toBeChecked();

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check if the submitted values are displayed
    await expect(await canvas.findByText('Notifications: Enabled')).toBeInTheDocument();
    await expect(await canvas.findByText('Marketing emails: Disabled')).toBeInTheDocument();
  },
};
