import { zodResolver } from '@hookform/resolvers/zod';
import { HiddenField } from '@lambdacurry/forms/remix-hook-form/hidden-field';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  // Hidden field still participates in validation and submission
  lineItemId: z.string().min(1, 'Missing line item id'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const DEFAULT_ID = 'abc-123';

const HiddenFieldExample = () => {
  const fetcher = useFetcher<{ message: string; submittedId: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lineItemId: DEFAULT_ID,
      note: '',
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
        {/* This registers the field without rendering any extra DOM */}
        <HiddenField name="lineItemId" />

        {/* A visible field just to demonstrate normal layout around the hidden input */}
        <div className="space-y-4">
          <TextField name="note" label="Note" placeholder="Optional note" />
          <Button type="submit">Submit</Button>
          {fetcher.data?.message && (
            <p className="mt-2 text-green-600">
              {fetcher.data.message} – submittedId: {fetcher.data.submittedId}
            </p>
          )}
        </div>
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return { message: 'Form submitted successfully', submittedId: data.lineItemId };
};

const meta: Meta<typeof HiddenField> = {
  title: 'RemixHookForm/HiddenField',
  component: HiddenField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: HiddenFieldExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta<typeof HiddenField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'HiddenField renders a plain <input type="hidden" /> registered with remix-hook-form. Use it to submit values that should not impact layout or be visible to users.',
      },
    },
  },
};
