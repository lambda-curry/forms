import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from '@lambdacurry/forms/remix-hook-form/select';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  region: z.string().min(1, 'Please select a region'),
  theme: z.string().min(1, 'Please select a theme'),
  fruit: z.string().min(1, 'Please select a fruit'),
});

type FormData = z.infer<typeof formSchema>;

const regionOptions = [
  { label: 'California', value: 'CA' },
  { label: 'Ontario', value: 'ON' },
  { label: 'New York', value: 'NY' },
  { label: 'Quebec', value: 'QC' },
  { label: 'Texas', value: 'TX' },
];

const themeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Purple', value: 'purple' },
  { label: 'Green', value: 'green' },
];

const fruitOptions = [
  { label: '🍎 Apple', value: 'apple' },
  { label: '🍊 Orange', value: 'orange' },
  { label: '🍌 Banana', value: 'banana' },
  { label: '🍇 Grape', value: 'grape' },
];

// Custom Trigger (purple themed)
const PurpleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button
      ref={ref}
      type="button"
      {...props}
      className={
        'flex items-center justify-between w-full rounded-md border-2 border-purple-300 bg-purple-50 px-3 py-2 h-10 text-sm text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ' +
        (props.className || '')
      }
    />
  ),
);
PurpleTrigger.displayName = 'PurpleTrigger';

// Custom Item (purple themed)
const PurpleItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }
>((props, ref) => (
  <button
    ref={ref}
    type="button"
    {...props}
    className={
      'w-full text-left cursor-pointer select-none py-3 px-3 transition-colors duration-150 flex items-center gap-2 rounded text-purple-900 hover:bg-purple-100 data-[selected=true]:bg-purple-100 ' +
      (props.className || '')
    }
  />
));
PurpleItem.displayName = 'PurpleItem';

// Custom Search Input (purple themed)
const PurpleSearchInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      {...props}
      className={'w-full h-9 rounded-md bg-white px-2 text-sm leading-none border-2 border-purple-200 focus:border-purple-400 focus:outline-none ' + (props.className || '')}
    />
  ),
);
PurpleSearchInput.displayName = 'PurpleSearchInput';

// Custom Item (green themed) for the fruit example
const GreenItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }
>((props, ref) => (
  <button
    ref={ref}
    type="button"
    {...props}
    className={
      'w-full text-left cursor-pointer select-none py-3 px-3 transition-colors duration-150 flex items-center gap-2 rounded hover:bg-emerald-100 data-[selected=true]:bg-emerald-100 ' +
      (props.className || '')
    }
  />
));
GreenItem.displayName = 'GreenItem';

const SelectCustomizationExample = () => {
  const fetcher = useFetcher<{ message: string }>();

  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: '',
      theme: '',
      fruit: '',
    },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-6">
        <div className="grid gap-6 w-[320px]">
          {/* Default Select */}
          <Select
            name="region"
            label="Region"
            description="Default Select styling"
            options={regionOptions}
            placeholder="Select a region"
          />

          {/* Custom Trigger and Item using components */}
          <Select
            name="theme"
            label="Theme"
            description="Customized trigger and options via components"
            options={themeOptions}
            placeholder="Choose a theme"
            components={{
              Trigger: PurpleTrigger,
              Item: PurpleItem,
              SearchInput: PurpleSearchInput,
            }}
          />

          {/* Fun labels with emojis to show arbitrary option labels */}
          <Select
            name="fruit"
            label="Favorite Fruit"
            description="Options can include emojis or rich labels"
            options={fruitOptions}
            placeholder="Pick a fruit"
            components={{
              Item: GreenItem,
            }}
          />
        </div>

        <Button type="submit">Submit</Button>

        {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) return { errors };

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof Select> = {
  title: 'RemixHookForm/Select Customized',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: SelectCustomizationExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomComponents: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Select Component Customization

This story demonstrates customizing the Select component by passing component overrides, similar to TextField:

- Override the trigger button via \`components.Trigger\`
- Customize option items with \`components.Item\` (receives \`selected\` and ARIA roles)
- Replace the search input with \`components.SearchInput\`

Example:

\`\`\`tsx
<Select
  name="theme"
  label="Theme"
  options={themeOptions}
  components={{
    Trigger: PurpleTrigger,
    Item: PurpleItem,
    SearchInput: PurpleSearchInput,
  }}
/>
\`\`\`

Each custom component should use React.forwardRef to preserve focus, ARIA, and keyboard behavior.
`,
      },
    },
  },
  render: () => <SelectCustomizationExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open and choose Theme', async () => {
      const themeSelect = canvas.getByLabelText('Theme');
      await userEvent.click(themeSelect);
      const purple = await within(document.body).findByRole('option', { name: 'Purple' });
      await userEvent.click(purple);
      await expect(themeSelect).toHaveTextContent('Purple');
    });

    await step('Open and choose Fruit', async () => {
      const fruitSelect = canvas.getByLabelText('Favorite Fruit');
      await userEvent.click(fruitSelect);
      const banana = await within(document.body).findByRole('option', { name: '🍌 Banana' });
      await userEvent.click(banana);
      await expect(fruitSelect).toHaveTextContent('🍌 Banana');
    });

    await step('Submit the form', async () => {
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      await expect(canvas.findByText('Form submitted successfully')).resolves.toBeInTheDocument();
    });
  },
};

