import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledInput } from '@lambdacurry/medusa-forms/controlled/ControlledInput';
import { ControlledTextArea } from '@lambdacurry/medusa-forms/controlled/ControlledTextArea';
import { Button } from '@medusajs/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const meta = {
  title: 'Medusa Forms/Controlled Text Area',
  component: ControlledTextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Usage Story
const BasicUsageForm = () => {
  const form = useForm({
    defaultValues: {
      description: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledTextArea
          name="description"
          label="Description"
          placeholder="Enter your description here..."
          rows={4}
        />
      </div>
    </FormProvider>
  );
};

export const BasicUsage: Story = {
  args: {
    name: 'description',
    label: 'Description',
    placeholder: 'Enter your description here...',
    rows: 4,
  },
  render: () => <BasicUsageForm />,
  parameters: {
    docs: {
      description: {
        story: 'A basic textarea with react-hook-form integration for multi-line text input.',
      },
    },
  },
};

// Character Limits Story
const CharacterLimitsSchema = z.object({
  bio: z.string().max(150, 'Bio must be 150 characters or less'),
});

const CharacterLimitsForm = () => {
  const form = useForm({
    resolver: zodResolver(CharacterLimitsSchema),
    defaultValues: {
      bio: '',
    },
  });

  const bioValue = form.watch('bio');
  const characterCount = bioValue?.length || 0;
  const maxLength = 150;

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-2">
        <ControlledTextArea
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={maxLength}
          rules={{
            required: 'Bio is required',
            maxLength: { value: 150, message: 'Bio must be 150 characters or less' },
          }}
        />
        <div className="text-sm text-gray-500 text-right">
          {characterCount}/{maxLength} characters
        </div>
      </div>
    </FormProvider>
  );
};

export const CharacterLimits: Story = {
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    rows: 4,
    maxLength: 150,
  },
  render: () => <CharacterLimitsForm />,
  parameters: {
    docs: {
      description: {
        story: 'Textarea with character count validation, counter display, and limit enforcement.',
      },
    },
  },
};

// Required Field Validation Story
const RequiredFieldSchema = z.object({
  feedback: z.string().min(1, 'Feedback is required').min(10, 'Feedback must be at least 10 characters'),
});

const RequiredFieldForm = () => {
  const form = useForm({
    resolver: zodResolver(RequiredFieldSchema),
    defaultValues: {
      feedback: '',
    },
  });

  const onSubmit = (data: unknown) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-4">
        <ControlledTextArea
          name="feedback"
          label="Feedback *"
          placeholder="Please provide your feedback..."
          rows={5}
          rules={{
            required: 'Feedback is required',
            minLength: { value: 10, message: 'Feedback must be at least 10 characters' },
          }}
        />
        <Button type="submit" variant="primary" className="w-full">
          Submit Feedback
        </Button>
      </form>
    </FormProvider>
  );
};

export const RequiredFieldValidation: Story = {
  args: {
    name: 'feedback',
    label: 'Feedback',
    placeholder: 'Please provide your feedback...',
    rows: 5,
  },
  render: () => <RequiredFieldForm />,
  parameters: {
    docs: {
      description: {
        story: 'Required field validation with error state display and custom validation messages.',
      },
    },
  },
};

// Auto-resize Functionality Story
const AutoResizeForm = () => {
  const form = useForm({
    defaultValues: {
      content: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledTextArea
          name="content"
          label="Auto-resize Content"
          placeholder="Start typing and watch the textarea grow..."
          rows={2}
          style={{
            minHeight: '60px',
            maxHeight: '200px',
            resize: 'none',
            overflow: 'hidden',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
          }}
        />
        <div className="text-sm text-gray-500">
          This textarea automatically adjusts its height based on content (min: 60px, max: 200px)
        </div>
      </div>
    </FormProvider>
  );
};

export const AutoResizeFunctionality: Story = {
  args: {
    name: 'content',
    label: 'Auto-resize Content',
    placeholder: 'Start typing and watch the textarea grow...',
    rows: 2,
  },
  render: () => <AutoResizeForm />,
  parameters: {
    docs: {
      description: {
        story: 'Dynamic height adjustment with content-based resizing and min/max height constraints.',
      },
    },
  },
};

// Validation Error States Story
const ValidationErrorSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(500, 'Message must be less than 500 characters')
    .refine((val) => !val.includes('spam'), 'Message cannot contain spam'),
});

const ValidationErrorForm = () => {
  const form = useForm({
    resolver: zodResolver(ValidationErrorSchema),
    defaultValues: {
      message: '',
    },
    mode: 'onChange', // Validate on change for immediate feedback
  });

  const onSubmit = (data: unknown) => {
    console.log('Form submitted:', data);
  };

  const hasError = !!form.formState.errors.message;
  const messageValue = form.watch('message');

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-4">
        <div className="space-y-2">
          <ControlledTextArea
            name="message"
            label="Message"
            placeholder="Enter your message (20-500 characters, no spam)..."
            rows={6}
            className={hasError ? 'border-red-500 focus:border-red-500' : ''}
            rules={{
              required: 'Message is required',
              minLength: { value: 20, message: 'Message must be at least 20 characters' },
              maxLength: { value: 500, message: 'Message must be less than 500 characters' },
              validate: (value: string) => !value.includes('spam') || 'Message cannot contain spam',
            }}
          />
          <div className="flex justify-between text-sm">
            <div>
              {form.formState.errors.message && (
                <span className="text-red-600">{form.formState.errors.message.message}</span>
              )}
            </div>
            <div className="text-gray-500">{messageValue?.length || 0}/500</div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Validation Rules:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Required field</li>
            <li>Minimum 20 characters</li>
            <li>Maximum 500 characters</li>
            <li>Cannot contain the word "spam"</li>
          </ul>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={!form.formState.isValid}>
          Submit Message
        </Button>
      </form>
    </FormProvider>
  );
};

export const ValidationErrorStates: Story = {
  args: {
    name: 'message',
    label: 'Message',
    placeholder: 'Enter your message (20-500 characters, no spam)...',
    rows: 6,
  },
  render: () => <ValidationErrorForm />,
  parameters: {
    docs: {
      description: {
        story: 'Various error scenarios with error message display and field highlighting.',
      },
    },
  },
};

// Comprehensive Form Example
const ComprehensiveSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').min(50, 'Description must be at least 50 characters'),
  notes: z.string().optional(),
});

const ComprehensiveForm = () => {
  const form = useForm({
    resolver: zodResolver(ComprehensiveSchema),
    defaultValues: {
      title: '',
      description: '',
      notes: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: unknown) => {
    console.log('Comprehensive form submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] space-y-6">
        <div>
          <ControlledInput
            name="title"
            label="Title *"
            placeholder="Enter a title..."
            rules={{
              required: 'Title is required',
              maxLength: { value: 100, message: 'Title must be less than 100 characters' },
            }}
          />
        </div>

        <div>
          <ControlledTextArea
            name="description"
            label="Description *"
            placeholder="Provide a detailed description (minimum 50 characters)..."
            rows={4}
            rules={{
              required: 'Description is required',
              minLength: { value: 50, message: 'Description must be at least 50 characters' },
            }}
          />
        </div>

        <div>
          <ControlledTextArea
            name="notes"
            label="Additional Notes (Optional)"
            placeholder="Any additional notes or comments..."
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => form.reset()}>
            Reset Form
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={!form.formState.isValid}>
            Submit
          </Button>
        </div>

        <div className="mt-4 p-2 bg-gray-100 rounded">
          <strong>Form Values:</strong>
          <pre className="text-xs mt-2">{JSON.stringify(form.watch(), null, 2)}</pre>
        </div>

        {form.formState.isSubmitted && form.formState.isValid && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Form submitted successfully! Check the console for the data.
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export const ComprehensiveExample: Story = {
  args: {
    name: 'title',
    label: 'Title',
    placeholder: 'Enter a title...',
  },
  render: () => <ComprehensiveForm />,
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive form example showing multiple ControlledTextArea components with different validation rules and states.',
      },
    },
  },
};
