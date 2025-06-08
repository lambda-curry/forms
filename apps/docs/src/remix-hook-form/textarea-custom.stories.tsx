import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@lambdacurry/forms/remix-hook-form/textarea';
import { Button } from '@lambdacurry/forms/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@lambdacurry/forms/ui/form';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import * as React from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Custom Textarea component
const PurpleTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2 text-purple-900 placeholder:text-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[100px]"
  />
);
PurpleTextarea.displayName = 'PurpleTextarea';

// Custom Form Label component
const PurpleLabel = (props: React.ComponentPropsWithoutRef<typeof FormLabel>) => {
  const { className, htmlFor, ...rest } = props;
  return <FormLabel className="text-lg font-bold text-purple-700" htmlFor={htmlFor} {...rest} />;
};
PurpleLabel.displayName = 'PurpleLabel';

// Custom Form Message component
const PurpleMessage = (props: React.ComponentPropsWithoutRef<typeof FormMessage>) => (
  <FormMessage className="text-purple-500 bg-purple-50 p-2 rounded-md mt-1" {...props} />
);
PurpleMessage.displayName = 'PurpleMessage';

// Custom Textarea with character counter
const CounterTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const [charCount, setCharCount] = React.useState(props.value?.toString().length || 0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <textarea
        {...props}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px] pr-16"
      />
      <div className="absolute bottom-2 right-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
        {charCount} chars
      </div>
    </div>
  );
};
CounterTextarea.displayName = 'CounterTextarea';

// Custom FormItem component that ensures proper label-control association
const AccessibleFormItem = (props: React.ComponentPropsWithoutRef<typeof FormItem>) => {
  const { className, ...rest } = props;
  const id = React.useId();

  return <FormItem className={className} {...rest} data-testid={`form-item-${id}`} />;
};
AccessibleFormItem.displayName = 'AccessibleFormItem';

// Custom FormControl component that ensures proper label-control association
const AccessibleFormControl = (props: React.ComponentPropsWithoutRef<typeof FormControl>) => {
  return <FormControl {...props} />;
};
AccessibleFormControl.displayName = 'AccessibleFormControl';

const CustomTextareaExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: '',
      bio: '',
      notes: '',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  // Generate stable IDs for form controls
  const feedbackId = React.useId();
  const bioId = React.useId();
  const notesId = React.useId();

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <div className="grid gap-4">
          {/* Default Textarea with explicit ID and htmlFor */}
          <div className="space-y-2">
            <label htmlFor={`feedback-${feedbackId}`} className="text-sm font-medium">
              Feedback
            </label>
            <textarea
              id={`feedback-${feedbackId}`}
              {...methods.register('feedback')}
              placeholder="Please provide your feedback"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]"
            />
            {methods.formState.errors.feedback && (
              <p className="text-sm font-medium text-destructive">{methods.formState.errors.feedback.message}</p>
            )}
          </div>

          {/* Custom Textarea with purple styling */}
          <div className="space-y-2">
            <label htmlFor={`bio-${bioId}`} className="text-lg font-bold text-purple-700">
              Bio
            </label>
            <PurpleTextarea id={`bio-${bioId}`} {...methods.register('bio')} placeholder="Tell us about yourself" />
            {methods.formState.errors.bio && (
              <p className="text-purple-500 bg-purple-50 p-2 rounded-md mt-1">{methods.formState.errors.bio.message}</p>
            )}
          </div>

          {/* Custom Textarea with character counter */}
          <div className="space-y-2">
            <label htmlFor={`notes-${notesId}`} className="text-sm font-medium">
              Additional Notes
            </label>
            <CounterTextarea
              id={`notes-${notesId}`}
              {...methods.register('notes')}
              placeholder="Any additional notes (optional)"
            />
            {methods.formState.errors.notes && (
              <p className="text-sm font-medium text-destructive">{methods.formState.errors.notes.message}</p>
            )}
          </div>
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

  return { message: 'Form submitted successfully' };
};

const meta: Meta<typeof Textarea> = {
  title: 'RemixHookForm/Textarea Customized',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomTextareaExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomComponents: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Textarea Component Customization

This example demonstrates three different approaches to customizing the Textarea component:

1. **Default Styling**: The first textarea uses the default styling with no customization needed.

2. **Custom Styling**: The second textarea customizes the TextArea with purple styling.
\`\`\`tsx
<div className="space-y-2">
  <label htmlFor="bio-id" className="text-lg font-bold text-purple-700">Bio</label>
  <PurpleTextarea
    id="bio-id"
    {...methods.register('bio')}
    placeholder="Tell us about yourself"
  />
  {methods.formState.errors.bio && (
    <p className="text-purple-500 bg-purple-50 p-2 rounded-md mt-1">
      {methods.formState.errors.bio.message}
    </p>
  )}
</div>
\`\`\`

3. **Character Counter**: The third textarea demonstrates how to create a custom textarea with a character counter.
\`\`\`tsx
<div className="space-y-2">
  <label htmlFor="notes-id" className="text-sm font-medium">Additional Notes</label>
  <CounterTextarea
    id="notes-id"
    {...methods.register('notes')}
    placeholder="Any additional notes (optional)"
  />
</div>
\`\`\`

This example uses direct DOM elements with explicit label-for associations to ensure proper accessibility.
`,
      },
    },
  },
  render: () => <CustomTextareaExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the form fields
    const feedbackTextarea = canvas.getByLabelText('Feedback');
    const bioTextarea = canvas.getByLabelText('Bio');

    await userEvent.type(feedbackTextarea, 'This is my feedback about the product. It works great!');
    await userEvent.type(bioTextarea, 'I am a software developer with 5 years of experience in React and TypeScript.');

    // Submit the form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify successful submission
    await expect(await canvas.findByText('Form submitted successfully')).toBeInTheDocument();
  },
};
