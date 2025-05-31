import { ControlledTextArea } from '@lambdacurry/medusa-forms/controlled/ControlledTextArea';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
        />
        <div className="text-sm text-gray-500 text-right">
          {characterCount}/{maxLength} characters
        </div>
        {form.formState.errors.bio && (
          <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>
        )}
      </div>
    </FormProvider>
  );
};

export const CharacterLimits: Story = {
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

  const onSubmit = (data: any) => {
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
        />
        {form.formState.errors.feedback && (
          <p className="text-sm text-red-600">{form.formState.errors.feedback.message}</p>
        )}
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
    </FormProvider>
  );
};

export const RequiredFieldValidation: Story = {
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
            overflow: 'hidden'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 200) + 'px';
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
  message: z.string()
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

  const onSubmit = (data: any) => {
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
          />
          <div className="flex justify-between text-sm">
            <div>
              {form.formState.errors.message && (
                <span className="text-red-600">{form.formState.errors.message.message}</span>
              )}
            </div>
            <div className="text-gray-500">
              {messageValue?.length || 0}/500
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Validation Rules:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Required field</li>
            <li>Minimum 20 characters</li>
            <li>Maximum 500 characters</li>
            <li>Cannot contain the word "spam"</li>
          </ul>
        </div>

        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!form.formState.isValid}
        >
          Submit Message
        </button>
      </form>
    </FormProvider>
  );
};

export const ValidationErrorStates: Story = {
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
  });

  const onSubmit = (data: any) => {
    console.log('Comprehensive form submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            {...form.register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a title..."
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <ControlledTextArea 
            name="description" 
            label="Description *" 
            placeholder="Provide a detailed description (minimum 50 characters)..." 
            rows={4}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
          )}
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
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={!form.formState.isValid}
          >
            Submit
          </button>
          <button 
            type="button" 
            onClick={() => form.reset()}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reset
          </button>
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
  render: () => <ComprehensiveForm />,
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive form example showing multiple ControlledTextArea components with different validation rules and states.',
      },
    },
  },
};

