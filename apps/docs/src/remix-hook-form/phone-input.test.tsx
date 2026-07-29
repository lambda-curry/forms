import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui/button';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import type { ElementType } from 'react';
import type { FetcherWithComponents } from 'react-router';
import type { FormMessageProps } from '@lambdacurry/forms/ui/form';
import { useRef, useEffect } from 'react';

// Mock useFetcher
jest.mock('react-router', () => ({
  useFetcher: jest.fn(),
}));

const mockUseFetcher = useFetcher as jest.MockedFunction<typeof useFetcher>;

// Test form schema
const testSchema = z.object({
  usaPhone: z.string().min(1, 'USA phone number is required'),
  internationalPhone: z.string().min(1, 'International phone number is required'),
});

type TestFormData = z.infer<typeof testSchema>;

// Test component wrapper
const TestPhoneInputForm = ({
  initialErrors = {},
  customComponents = {},
}: {
  initialErrors?: Record<string, { message: string }>;
  customComponents?: { FormMessage?: React.ComponentType<FormMessageProps> };
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
    defaultValues: { usaPhone: '', internationalPhone: '' },
    fetcher: mockFetcher,
    submitConfig: { action: '/test', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit}>
        <PhoneInput
          name="usaPhone"
          label="USA Phone Number"
          description="Enter a US phone number"
          components={customComponents}
        />
        <PhoneInput
          name="internationalPhone"
          label="International Phone Number"
          description="Enter an international phone number"
          isInternational
          components={customComponents}
        />
        <Button type="submit">Submit</Button>
      </form>
    </RemixFormProvider>
  );
};

describe('PhoneInput Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders phone input fields with labels and descriptions', () => {
      render(<TestPhoneInputForm />);

      // Check for labels
      expect(screen.getByLabelText('USA Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('International Phone Number')).toBeInTheDocument();

      // Check for descriptions
      expect(screen.getByText('Enter a US phone number')).toBeInTheDocument();
      expect(screen.getByText('Enter an international phone number')).toBeInTheDocument();
    });

    it('displays validation errors when provided', async () => {
      const errors = {
        usaPhone: { message: 'USA phone number is required' },
        internationalPhone: { message: 'International phone number is required' },
      };

      render(<TestPhoneInputForm initialErrors={errors} />);

      // Check for error messages
      expect(screen.getByText('USA phone number is required')).toBeInTheDocument();
      expect(screen.getByText('International phone number is required')).toBeInTheDocument();
    });
  });

  describe('Input Behavior', () => {
    it('formats and caps US number at 10 digits', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const usaPhoneInput = screen.getByLabelText('USA Phone Number') as HTMLInputElement;

      // Type more than 10 digits
      await user.type(usaPhoneInput, '2025550123456');

      // Display should be formatted and capped: (202) 555-0123
      await waitFor(() => {
        expect(usaPhoneInput.value).toBe('(202) 555-0123');
      });
    });

    it('handles 11-digit US numbers with leading 1 (autofill case)', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const usaPhoneInput = screen.getByLabelText('USA Phone Number') as HTMLInputElement;

      // Simulate autofill with 11 digits starting with 1
      await user.type(usaPhoneInput, '12025550123');

      // Should format correctly by removing the leading 1
      await waitFor(() => {
        expect(usaPhoneInput.value).toBe('(202) 555-0123');
      });
    });

    it('accepts international number with + and inserts spaces', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const intlInput = screen.getByLabelText('International Phone Number') as HTMLInputElement;

      // Type digits without +; component should normalize to + and format
      await user.type(intlInput, '7911123456');

      await waitFor(() => {
        expect(intlInput.value.startsWith('+')).toBe(true);
        // Digits (without non-digits) should match what was typed with leading country code
        const digitsOnly = intlInput.value.replace(/\D/g, '');
        expect(digitsOnly.endsWith('7911123456')).toBe(true);
      });
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
        usaPhone: { message: 'Test error' },
      };

      render(<TestPhoneInputForm initialErrors={errors} customComponents={{ FormMessage: CustomFormMessage }} />);

      expect(screen.getByTestId('custom-form-message')).toBeInTheDocument();
      expect(screen.getByText('Custom: Test error')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper label associations for screen readers', () => {
      render(<TestPhoneInputForm />);

      const usaPhoneLabel = screen.getByText('USA Phone Number');
      const internationalPhoneLabel = screen.getByText('International Phone Number');

      expect(usaPhoneLabel).toBeInTheDocument();
      expect(internationalPhoneLabel).toBeInTheDocument();

      // Verify labels are properly associated with inputs
      expect(screen.getByLabelText('USA Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('International Phone Number')).toBeInTheDocument();
    });
  });

  describe('MI-1188: Selection Replacement and Cursor Positioning', () => {
    it('replaces selected middle digits when typing (AC #1)', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const input = screen.getByLabelText('USA Phone Number') as HTMLInputElement;

      // Type initial number
      await user.type(input, '2025550123');
      await waitFor(() => {
        expect(input.value).toBe('(202) 555-0123');
      });

      // Select middle digits "555" (positions 6-8 in formatted string "(202) 555-0123")
      input.focus();
      input.setSelectionRange(6, 9);

      // Type replacement digits
      await user.keyboard('999');

      // Should replace selected "555" with "999"
      await waitFor(() => {
        expect(input.value).toBe('(202) 999-0123');
      });
    });

    it('replaces entire number when all text selected (AC #2)', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const input = screen.getByLabelText('USA Phone Number') as HTMLInputElement;

      // Type initial number
      await user.type(input, '2025550123');
      await waitFor(() => {
        expect(input.value).toBe('(202) 555-0123');
      });

      // Select all text
      input.focus();
      input.setSelectionRange(0, input.value.length);

      // Type new number
      await user.keyboard('310');

      // Should replace entire value
      await waitFor(() => {
        expect(input.value).toBe('(310');
      });
    });

    it('maintains cursor position after formatting during typing', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const input = screen.getByLabelText('USA Phone Number') as HTMLInputElement;

      // Type partial number
      await user.type(input, '202555');

      await waitFor(() => {
        expect(input.value).toBe('(202) 555');
        // Cursor should be at exact position after last digit (after "555")
        expect(input.selectionStart).toBe(9); // "(202) 555" length
      });
    });

    it('handles backspace correctly with cursor positioning', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const input = screen.getByLabelText('USA Phone Number') as HTMLInputElement;

      // Type full number
      await user.type(input, '2025550123');
      await waitFor(() => {
        expect(input.value).toBe('(202) 555-0123');
      });

      // Backspace once
      await user.keyboard('{Backspace}');

      await waitFor(() => {
        expect(input.value).toBe('(202) 555-012');
      });
    });
  });

  describe('Paste Events', () => {
    it('formats pasted plain digits correctly', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const input = screen.getByLabelText('USA Phone Number');

      await user.click(input);
      await user.paste('2025550123');

      await waitFor(() => {
        expect((input as HTMLInputElement).value).toBe('(202) 555-0123');
      });
    });

    it('handles pasted formatted number', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const input = screen.getByLabelText('USA Phone Number');

      await user.click(input);
      await user.paste('(202) 555-0123');

      await waitFor(() => {
        expect((input as HTMLInputElement).value).toBe('(202) 555-0123');
      });
    });

    it('handles paste with selection replacement', async () => {
      const user = userEvent.setup();
      render(<TestPhoneInputForm />);

      const input = screen.getByLabelText('USA Phone Number') as HTMLInputElement;

      // Type initial number
      await user.type(input, '2025550123');
      await waitFor(() => {
        expect(input.value).toBe('(202) 555-0123');
      });

      // Select middle portion
      input.focus();
      input.setSelectionRange(6, 9);

      // Paste replacement
      await user.paste('999');

      await waitFor(() => {
        expect(input.value).toBe('(202) 999-0123');
      });
    });
  });

  describe('Ref Forwarding (React 19 Compliance)', () => {
    it('forwards ref correctly to input element', () => {
      const TestRefComponent = () => {
        const ref = useRef<HTMLInputElement>(null);
        const mockFetcher = {
          data: {},
          state: 'idle' as const,
          submit: jest.fn(),
          Form: 'form' as ElementType,
        } as unknown as FetcherWithComponents<unknown>;

        mockUseFetcher.mockReturnValue(mockFetcher);

        const methods = useRemixForm<TestFormData>({
          resolver: zodResolver(testSchema),
          defaultValues: { usaPhone: '', internationalPhone: '' },
          fetcher: mockFetcher,
          submitConfig: { action: '/test', method: 'post' },
        });

        return (
          <RemixFormProvider {...methods}>
            <form>
              <PhoneInput name="usaPhone" label="Phone" ref={ref} />
              <div data-testid="ref-check">{ref.current ? 'ref-attached' : 'no-ref'}</div>
            </form>
          </RemixFormProvider>
        );
      };

      const { rerender } = render(<TestRefComponent />);

      // Trigger rerender to ensure ref is attached
      rerender(<TestRefComponent />);

      const refCheck = screen.getByTestId('ref-check');
      expect(refCheck.textContent).toBe('ref-attached');
    });

    it('calls callback ref cleanup on unmount', () => {
      const cleanup = jest.fn();
      const callbackRef = jest.fn(() => cleanup);

      const TestRefComponent = () => {
        const mockFetcher = {
          data: {},
          state: 'idle' as const,
          submit: jest.fn(),
          Form: 'form' as ElementType,
        } as unknown as FetcherWithComponents<unknown>;

        mockUseFetcher.mockReturnValue(mockFetcher);

        const methods = useRemixForm<TestFormData>({
          resolver: zodResolver(testSchema),
          defaultValues: { usaPhone: '', internationalPhone: '' },
          fetcher: mockFetcher,
          submitConfig: { action: '/test', method: 'post' },
        });

        return (
          <RemixFormProvider {...methods}>
            <form>
              <PhoneInput name="usaPhone" label="Phone" ref={callbackRef} />
            </form>
          </RemixFormProvider>
        );
      };

      const { unmount } = render(<TestRefComponent />);

      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
      expect(callbackRef).toHaveBeenCalledTimes(1);

      unmount();

      expect(cleanup).toHaveBeenCalled();
      // React 19: cleanup-returning callback should NOT be called with null
      expect(callbackRef).toHaveBeenCalledTimes(1); // Still only 1 call
      expect(callbackRef).not.toHaveBeenCalledWith(null);
    });
  });

  describe('Focus/Blur Value Synchronization', () => {
    it('defers external value updates while focused', async () => {
      const TestValueSyncComponent = ({ value }: { value: string }) => {
        const mockFetcher = {
          data: {},
          state: 'idle' as const,
          submit: jest.fn(),
          Form: 'form' as ElementType,
        } as unknown as FetcherWithComponents<unknown>;

        mockUseFetcher.mockReturnValue(mockFetcher);

        const methods = useRemixForm<TestFormData>({
          resolver: zodResolver(testSchema),
          defaultValues: { usaPhone: value, internationalPhone: '' },
          fetcher: mockFetcher,
          submitConfig: { action: '/test', method: 'post' },
        });

        useEffect(() => {
          methods.setValue('usaPhone', value);
        }, [value, methods]);

        return (
          <RemixFormProvider {...methods}>
            <form>
              <PhoneInput name="usaPhone" label="Phone" />
            </form>
          </RemixFormProvider>
        );
      };

      const user = userEvent.setup();
      const { rerender } = render(<TestValueSyncComponent value="2025550100" />);

      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      await waitFor(() => {
        expect(input.value).toBe('(202) 555-0100');
      });

      // Focus the input
      await user.click(input);
      expect(input).toHaveFocus();

      // External value change while focused
      rerender(<TestValueSyncComponent value="3105550200" />);

      // Should still show old value while focused
      await waitFor(() => {
        expect(input.value).toBe('(202) 555-0100');
      });

      // Blur the input
      await user.tab();

      // Should now show new value after blur
      await waitFor(() => {
        expect(input.value).toBe('(310) 555-0200');
      });
    });

    it('applies external value updates immediately when not focused', async () => {
      const TestValueSyncComponent = ({ value }: { value: string }) => {
        const mockFetcher = {
          data: {},
          state: 'idle' as const,
          submit: jest.fn(),
          Form: 'form' as ElementType,
        } as unknown as FetcherWithComponents<unknown>;

        mockUseFetcher.mockReturnValue(mockFetcher);

        const methods = useRemixForm<TestFormData>({
          resolver: zodResolver(testSchema),
          defaultValues: { usaPhone: value, internationalPhone: '' },
          fetcher: mockFetcher,
          submitConfig: { action: '/test', method: 'post' },
        });

        useEffect(() => {
          methods.setValue('usaPhone', value);
        }, [value, methods]);

        return (
          <RemixFormProvider {...methods}>
            <form>
              <PhoneInput name="usaPhone" label="Phone" />
            </form>
          </RemixFormProvider>
        );
      };

      const { rerender } = render(<TestValueSyncComponent value="2025550100" />);

      const input = screen.getByLabelText('Phone') as HTMLInputElement;

      await waitFor(() => {
        expect(input.value).toBe('(202) 555-0100');
      });

      // External value change while NOT focused
      rerender(<TestValueSyncComponent value="3105550200" />);

      // Should apply new value immediately
      await waitFor(() => {
        expect(input.value).toBe('(310) 555-0200');
      });
    });
  });
});
