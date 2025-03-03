import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@lambdacurry/forms/remix-hook-form/switch';
import { Button } from '@lambdacurry/forms/ui/button';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type {} from '@testing-library/dom';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withRemixStubDecorator } from '../lib/storybook/remix-stub';

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
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="grid gap-4">
          <Switch name="notifications" label="Enable notifications" />
          <Switch name="darkMode" label="Dark mode" description="Toggle dark mode for the application" />
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
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Settings updated successfully' };
};

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ControlledSwitchExample,
        action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
      },
    }),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = ({ canvas }: StoryContext) => {
  const notificationsContainer = canvas.getByText('Enable notifications').closest('.form-item');
  const darkModeContainer = canvas.getByText('Dark mode').closest('.form-item');
  
  expect(notificationsContainer?.querySelector('[role="switch"]')).not.toBeChecked();
  expect(darkModeContainer?.querySelector('[role="switch"]')).not.toBeChecked();
};

const testToggleSwitches = async ({ canvas }: StoryContext) => {
  const notificationsContainer = canvas.getByText('Enable notifications').closest('.form-item');
  const darkModeContainer = canvas.getByText('Dark mode').closest('.form-item');
  
  const notificationsSwitch = notificationsContainer?.querySelector('[role="switch"]');
  const darkModeSwitch = darkModeContainer?.querySelector('[role="switch"]');

  if (notificationsSwitch && darkModeSwitch) {
    await userEvent.click(notificationsSwitch);
    await userEvent.click(darkModeSwitch);

    expect(notificationsSwitch).toBeChecked();
    expect(darkModeSwitch).toBeChecked();
  }
};

const testSubmission = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  await expect(await canvas.findByText('Settings updated successfully')).toBeInTheDocument();
};

export const Tests: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default switch component with form integration.',
      },
    },
  },
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testToggleSwitches(storyContext);
    await testSubmission(storyContext);
  },
};
