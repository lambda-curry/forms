import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@lambdacurry/forms/remix-hook-form/checkbox';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const AVAILABLE_COLORS = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple' },
] as const;

const formSchema = z.object({
  colors: z.record(z.boolean()).refine((colors) => {
    return Object.values(colors).some((selected) => selected);
  }, 'Please select at least one color'),
});

type FormData = z.infer<typeof formSchema>;

// Custom FormLabel component that makes the entire area clickable
const FullWidthLabel = ({ className, children, htmlFor, ...props }: React.ComponentPropsWithoutRef<'label'>) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`absolute inset-0 cursor-pointer flex items-center py-4 px-8 ${className}`}
      {...props}
    >
      <span className="ml-2">{children}</span>
    </label>
  );
};

const ControlledCheckboxListExample = () => {
  const fetcher = useFetcher<{ message: string; selectedColors: string[] }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      colors: AVAILABLE_COLORS.reduce((acc, { value }) => ({ ...acc, [value]: false }), {}),
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
    submitHandlers: {
      onValid: (data) => {
        const selectedColors = Object.entries(data.colors)
          .filter(([_, selected]) => selected)
          .map(([color]) => color);

        const filteredData = Object.fromEntries(
          Object.entries(data).filter(([key]) => !AVAILABLE_COLORS.some((color) => color.value === key)),
        );

        fetcher.submit(createFormData({ ...filteredData, selectedColors }), {
          method: 'post',
          action: '/',
        });
      },
    },
  });

  return (
    <RemixFormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Select your favorite colors:</p>
          <div className="grid gap-4">
            {AVAILABLE_COLORS.map(({ value, label }) => (
              <Checkbox
                key={value}
                className="relative rounded-md border p-4 hover:bg-gray-50"
                name={`colors.${value}`}
                label={label}
                components={{
                  FormLabel: FullWidthLabel,
                }}
              />
            ))}
          </div>
          <FormMessage error={methods.formState.errors.colors?.root?.message} />
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.selectedColors && (
            <div className="mt-4">
              <p className="text-sm font-medium">Submitted with selected colors:</p>
              <p className="text-sm text-gray-500">{fetcher.data.selectedColors.join(', ')}</p>
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

  const selectedColors = Object.entries(data.colors)
    .filter(([_, selected]) => selected)
    .map(([color]) => AVAILABLE_COLORS.find((c) => c.value === color)?.label ?? color);

  return { message: 'Colors selected successfully', selectedColors };
};

const meta: Meta<typeof Checkbox> = {
  title: 'RemixHookForm/Checkbox List',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ControlledCheckboxListExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDefaultValues = ({ canvas }: StoryContext) => {
  AVAILABLE_COLORS.forEach(({ label }) => {
    const checkbox = canvas.getByLabelText(label);
    expect(checkbox).not.toBeChecked();
  });
};

const testErrorState = async ({ canvas }: StoryContext) => {
  // Submit form without selecting any colors
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  // Check if error message is displayed
  await expect(await canvas.findByText('Please select at least one color')).toBeInTheDocument();
};

const testColorSelection = async ({ canvas }: StoryContext) => {
  // Select two colors
  const redCheckbox = canvas.getByLabelText('Red');
  const blueCheckbox = canvas.getByLabelText('Blue');

  await userEvent.click(redCheckbox);
  await userEvent.click(blueCheckbox);

  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  // Check if the selected colors are displayed
  await expect(await canvas.findByText('Red, Blue')).toBeInTheDocument();
};

export const Tests: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A checkbox list component for selecting multiple colors with full-width clickable area.',
      },
      source: {
        code: `
// Custom FormLabel component that makes the entire area clickable
const FullWidthLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<'label'>>(
  ({ className, children, htmlFor, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={\`absolute inset-0 cursor-pointer flex items-center py-4 px-8 \${className}\`}
        {...props}
      >
        <span className="ml-2">{children}</span>
      </label>
    );
  },
);

// Usage in your component
<Checkbox
  className="relative rounded-md border p-4 hover:bg-gray-50"
  name="colors.red"
  label="Red"
  components={{
    FormLabel: FullWidthLabel,
  }}
/>
`,
      },
    },
  },
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testErrorState(storyContext);
    await testColorSelection(storyContext);
  },
};
