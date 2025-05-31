import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@lambdacurry/forms/remix-hook-form/textarea';
import { Button } from '@lambdacurry/forms/ui/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm, useRemixFormContext } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';
import * as React from 'react';

const formSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

// Context monitoring component
const ContextMonitor = ({ label }: { label: string }) => {
  const [status, setStatus] = React.useState<string>('Checking...');
  
  React.useEffect(() => {
    try {
      const context = useRemixFormContext();
      if (context && context.handleSubmit) {
        setStatus(`✅ ${label}: Context OK`);
        console.log(`[${label}] Context available:`, context);
      } else {
        setStatus(`❌ ${label}: Context NULL`);
        console.log(`[${label}] Context is null:`, context);
      }
    } catch (error) {
      setStatus(`🚨 ${label}: Error - ${error.message}`);
      console.error(`[${label}] Context error:`, error);
    }
  }, [label]);

  return (
    <div className="text-xs p-1 border rounded mb-2" style={{ 
      backgroundColor: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#fff3cd' 
    }}>
      {status}
    </div>
  );
};

// Working pattern (like textarea-custom)
const WorkingPatternExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });

  const messageId = React.useId();

  return (
    <RemixFormProvider {...methods}>
      <div className="border p-4 rounded">
        <h3 className="font-bold text-green-700 mb-2">✅ Working Pattern (Direct DOM)</h3>
        <ContextMonitor label="Working Pattern" />
        
        <fetcher.Form onSubmit={methods.handleSubmit}>
          <div className="space-y-2">
            <label htmlFor={`message-${messageId}`} className="text-sm font-medium">
              Message (Working)
            </label>
            <textarea
              id={`message-${messageId}`}
              {...methods.register('message')}
              placeholder="Enter your message here..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px]"
            />
            {methods.formState.errors.message && (
              <p className="text-sm font-medium text-destructive">
                {methods.formState.errors.message.message}
              </p>
            )}
          </div>
          <Button type="submit" className="mt-4">
            Submit Working
          </Button>
        </fetcher.Form>
      </div>
    </RemixFormProvider>
  );
};

// Broken pattern (using component)
const BrokenPatternExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <div className="border p-4 rounded">
        <h3 className="font-bold text-red-700 mb-2">❌ Broken Pattern (Component)</h3>
        <ContextMonitor label="Broken Pattern" />
        
        <fetcher.Form onSubmit={methods.handleSubmit}>
          <div className="space-y-4">
            <Textarea 
              name="message" 
              label="Message (Broken)" 
              placeholder="Enter your message here..." 
              rows={3} 
            />
          </div>
          <Button type="submit" className="mt-4">
            Submit Broken
          </Button>
        </fetcher.Form>
      </div>
    </RemixFormProvider>
  );
};

// Side-by-side comparison
const ComparisonExample = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
      <WorkingPatternExample />
      <BrokenPatternExample />
      
      <div className="lg:col-span-2 mt-4 p-4 bg-gray-50 rounded">
        <h4 className="font-bold mb-2">🔍 Debug Information</h4>
        <p className="text-sm text-gray-600">
          Check the browser console for detailed context debugging information.
          The working pattern uses direct DOM elements with explicit register(),
          while the broken pattern uses the Textarea component that calls useRemixFormContext() internally.
        </p>
      </div>
    </div>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));
  if (errors) return { errors };
  return { message: 'Form submitted successfully' };
};

const meta: Meta = {
  title: 'RemixHookForm/Context Debug Comparison',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ComparisonExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideBySideComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Context Debug Comparison

This story demonstrates the difference between working and broken patterns:

**Working Pattern (Left):**
- Uses direct DOM elements (\`<textarea>\`)
- Explicitly calls \`methods.register('message')\`
- Context is only used for \`handleSubmit\` and form state
- ✅ Works in both dev and static builds

**Broken Pattern (Right):**
- Uses the \`<Textarea>\` component from \`@lambdacurry/forms/remix-hook-form/textarea\`
- Component internally calls \`useRemixFormContext()\` to get \`control\`
- ❌ Fails when context is not available

**Debug Features:**
- Real-time context monitoring with visual indicators
- Console logging for detailed debugging
- Side-by-side comparison to see the difference

Check the browser console for detailed context availability information.
`,
    },
  },
  render: () => <ComparisonExample />,
};

