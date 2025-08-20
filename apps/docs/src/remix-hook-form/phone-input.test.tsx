import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput } from '@lambdacurry/forms';
import { Button } from '@lambdacurry/forms/ui/button';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFetcher } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

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
  customComponents?: any;
}) => {
  const mockFetcher = {
    data: { errors: initialErrors },
    state: 'idle' as const,
    submit: jest.fn(),
    Form: 'form' as any,
  };

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
      const CustomFormMessage = ({ children, ...props }: any) => (
        <div data-testid="custom-form-message" className="custom-message" {...props}>
          Custom: {children}
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
});
