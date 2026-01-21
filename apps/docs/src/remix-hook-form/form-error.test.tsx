import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, TextField } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui/button';
import { render, screen } from '@testing-library/react';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import type { ElementType } from 'react';
import type { FetcherWithComponents } from 'react-router';
import type { FormMessageProps } from '@lambdacurry/forms/ui/form';

// Mock useFetcher
jest.mock('react-router', () => ({
  useFetcher: jest.fn(),
}));

const mockUseFetcher = useFetcher as jest.MockedFunction<typeof useFetcher>;

// Test form schema
const testSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

type TestFormData = z.infer<typeof testSchema>;

// Test component wrapper
const TestFormWithError = ({
  initialErrors = {},
  formErrorName = '_form',
  customComponents = {},
  className = '',
  message = '',
}: {
  initialErrors?: Record<string, { message: string }>;
  formErrorName?: string;
  customComponents?: { FormMessage?: React.ComponentType<FormMessageProps> };
  className?: string;
  message?: string;
}) => {
  const mockFetcher = {
    data: { errors: initialErrors },
    state: 'idle' as const,
    submit: jest.fn(),
    Form: 'form' as ElementType,
  } as unknown as FetcherWithComponents<unknown>;

  mockUseFetcher.mockReturnValue(mockFetcher);

  const methods = useRemixForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: { email: '', password: '' },
    fetcher: mockFetcher,
    submitConfig: { action: '/test', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit}>
        <FormError name={formErrorName} className={className} components={customComponents} message={message} />
        <TextField name="email" label="Email" />
        <TextField name="password" label="Password" />
        <Button type="submit">Submit</Button>
      </form>
    </RemixFormProvider>
  );
};

describe('FormError Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders without errors when no form-level error exists', () => {
      render(<TestFormWithError />);

      // Should not display any error message
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('displays form-level error when _form error exists', () => {
      const errors = {
        _form: { message: 'Server error occurred' },
      };

      render(<TestFormWithError initialErrors={errors} />);

      expect(screen.getByText('Server error occurred')).toBeInTheDocument();
    });

    it('does not display error when _form error does not exist', () => {
      const errors = {
        email: { message: 'Email is invalid' },
      };

      render(<TestFormWithError initialErrors={errors} />);

      expect(screen.queryByText('Server error occurred')).not.toBeInTheDocument();
    });
  });

  describe('Custom Error Keys', () => {
    it('displays error for custom error key', () => {
      const errors = {
        general: { message: 'General form error' },
      };

      render(<TestFormWithError initialErrors={errors} formErrorName="general" />);

      expect(screen.getByText('General form error')).toBeInTheDocument();
    });

    it('does not display error when custom key does not match', () => {
      const errors = {
        _form: { message: 'Default form error' },
      };

      render(<TestFormWithError initialErrors={errors} formErrorName="custom" />);

      expect(screen.queryByText('Default form error')).not.toBeInTheDocument();
    });
  });

  describe('Styling and CSS Classes', () => {
    it('applies custom className to the error container', () => {
      const errors = {
        _form: { message: 'Test error' },
      };

      render(<TestFormWithError initialErrors={errors} className="custom-error-class" />);

      const errorElement = screen.getByText('Test error').closest('[class*="custom-error-class"]');
      expect(errorElement).toBeInTheDocument();
    });

    it('renders with default styling when no className provided', () => {
      const errors = {
        _form: { message: 'Test error' },
      };

      render(<TestFormWithError initialErrors={errors} />);

      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  describe('Component Customization', () => {
    it('uses custom FormMessage component when provided', () => {
      const CustomFormMessage = (props: FormMessageProps) => (
        <div data-testid="custom-form-message" className="custom-message" {...props}>
          Custom: {props.children}
        </div>
      );

      const errors = {
        _form: { message: 'Test error' },
      };

      render(<TestFormWithError initialErrors={errors} customComponents={{ FormMessage: CustomFormMessage }} />);

      expect(screen.getByTestId('custom-form-message')).toBeInTheDocument();
      expect(screen.getByText('Custom: Test error')).toBeInTheDocument();
    });

    it('falls back to default FormMessage when no custom component provided', () => {
      const errors = {
        _form: { message: 'Test error' },
      };

      render(<TestFormWithError initialErrors={errors} />);

      expect(screen.getByText('Test error')).toBeInTheDocument();
      // Should not have custom wrapper
      expect(screen.queryByTestId('custom-form-message')).not.toBeInTheDocument();
    });
  });

  describe('Integration with Form State', () => {
    it('updates when form errors change', async () => {
      const { rerender } = render(<TestFormWithError />);

      // Initially no error
      expect(screen.queryByText('New error')).not.toBeInTheDocument();

      // Update with error
      const errors = {
        _form: { message: 'New error' },
      };

      rerender(<TestFormWithError initialErrors={errors} />);

      expect(screen.getByText('New error')).toBeInTheDocument();
    });

    it('hides error when form errors are cleared', async () => {
      const errors = {
        _form: { message: 'Initial error' },
      };

      const { rerender } = render(<TestFormWithError initialErrors={errors} />);

      // Initially shows error
      expect(screen.getByText('Initial error')).toBeInTheDocument();

      // Clear errors
      rerender(<TestFormWithError initialErrors={{}} />);

      expect(screen.queryByText('Initial error')).not.toBeInTheDocument();
    });
  });

  describe('Multiple FormError Components', () => {
    const MultipleFormErrorsComponent = () => {
      const mockFetcher = {
        data: {
          errors: {
            _form: { message: 'General error' },
            custom: { message: 'Custom error' },
          },
        },
        state: 'idle' as const,
        submit: jest.fn(),
        Form: 'form' as ElementType,
      } as unknown as FetcherWithComponents<unknown>;

      mockUseFetcher.mockReturnValue(mockFetcher);

      const methods = useRemixForm<TestFormData>({
        resolver: zodResolver(testSchema),
        defaultValues: { email: '', password: '' },
        fetcher: mockFetcher,
        submitConfig: { action: '/test', method: 'post' },
      });

      return (
        <RemixFormProvider {...methods}>
          <form>
            <FormError name="_form" className="top-error" />
            <TextField name="email" label="Email" />
            <FormError name="custom" className="middle-error" />
            <TextField name="password" label="Password" />
            <FormError name="_form" className="bottom-error" />
          </form>
        </RemixFormProvider>
      );
    };

    it('renders multiple FormError components with different error keys', () => {
      render(<MultipleFormErrorsComponent />);

      expect(screen.getAllByText('General error')).toHaveLength(2); // top and bottom
      expect(screen.getByText('Custom error')).toBeInTheDocument(); // middle
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for error messages', () => {
      const errors = {
        _form: { message: 'Accessibility test error' },
      };

      render(<TestFormWithError initialErrors={errors} />);

      const errorMessage = screen.getByText('Accessibility test error');
      expect(errorMessage).toHaveAttribute('data-slot', 'form-message');
    });

    it('is properly associated with form context', () => {
      const errors = {
        _form: { message: 'Form context error' },
      };

      render(<TestFormWithError initialErrors={errors} />);

      const errorMessage = screen.getByText('Form context error');
      expect(errorMessage.tagName.toLowerCase()).toBe('p');
      expect(errorMessage).toHaveClass('form-message');
    });
  });

  describe('Error Message Content', () => {
    it('handles empty error messages gracefully', () => {
      const errors = {
        _form: { message: '' },
      };

      render(<TestFormWithError initialErrors={errors} />);

      // Should not render anything for empty message
      expect(screen.queryByText('')).not.toBeInTheDocument();
    });

    it('handles long error messages', () => {
      const longMessage =
        'This is a very long error message that should still be displayed properly even when it contains a lot of text and might wrap to multiple lines in the user interface.';
      const errors = {
        _form: { message: longMessage },
      };

      render(<TestFormWithError initialErrors={errors} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in error messages', () => {
      const specialMessage = 'Error with special chars: <>&"\'';
      const errors = {
        _form: { message: specialMessage },
      };

      render(<TestFormWithError initialErrors={errors} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });

  describe('Uncontrolled Mode', () => {
    it('displays manual message when provided', () => {
      render(<TestFormWithError message="Manual error message" />);

      expect(screen.getByText('Manual error message')).toBeInTheDocument();
    });

    it('manual message takes precedence over form state error', () => {
      const errors = {
        _form: { message: 'Form state error' },
      };

      render(<TestFormWithError initialErrors={errors} message="Manual error message" />);

      expect(screen.getByText('Manual error message')).toBeInTheDocument();
      expect(screen.queryByText('Form state error')).not.toBeInTheDocument();
    });

    it('renders even when form context is missing if message is provided', () => {
      // Our implementation should be resilient.
      render(<FormError message="Context-less error" />);
      expect(screen.getByText('Context-less error')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily when unrelated form state changes', () => {
      const renderSpy = jest.fn();

      const CustomFormMessage = (props: FormMessageProps) => {
        renderSpy();
        return <div {...props}>{props.children}</div>;
      };

      const errors = {
        _form: { message: 'Performance test' },
      };

      const { rerender } = render(
        <TestFormWithError initialErrors={errors} customComponents={{ FormMessage: CustomFormMessage }} />,
      );

      const initialRenderCount = renderSpy.mock.calls.length;

      // Re-render with same errors (should not cause additional renders)
      rerender(<TestFormWithError initialErrors={errors} customComponents={{ FormMessage: CustomFormMessage }} />);

      expect(renderSpy.mock.calls.length).toBe(initialRenderCount);
    });
  });
});

describe('FormError Integration Tests', () => {
  it('works correctly in a complete form submission flow', async () => {
    const TestForm = () => {
      const mockFetcher = {
        data: null,
        state: 'idle' as const,
        submit: jest.fn(),
        Form: 'form' as ElementType,
      } as unknown as FetcherWithComponents<unknown>;

      mockUseFetcher.mockReturnValue(mockFetcher);

      const methods = useRemixForm<TestFormData>({
        resolver: zodResolver(testSchema),
        defaultValues: { email: '', password: '' },
        fetcher: mockFetcher,
        submitConfig: { action: '/test', method: 'post' },
      });

      return (
        <RemixFormProvider {...methods}>
          <form onSubmit={methods.handleSubmit}>
            <FormError />
            <TextField name="email" label="Email" />
            <TextField name="password" label="Password" />
            <Button type="submit">Submit</Button>
          </form>
        </RemixFormProvider>
      );
    };

    render(<TestForm />);

    // Form should render without errors initially
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

    // Submit button should be present and functional
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();

    // Form fields should be present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
