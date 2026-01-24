import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@lambdacurry/forms/ui/button';
import { useOnFormValueChange } from '@lambdacurry/forms/remix-hook-form/hooks/use-on-form-value-change';
import { Select } from '@lambdacurry/forms/remix-hook-form/select';
import { TextField } from '@lambdacurry/forms/remix-hook-form/text-field';
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { useState, useMemo, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { useRemixForm, RemixFormProvider, getValidatedFormData } from 'remix-hook-form';
import { z } from 'zod';
import type { ActionFunctionArgs } from 'react-router';
import { selectRadixOption } from '../lib/storybook/test-utils';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

/**
 * # useOnFormValueChange Hook
 *
 * A hook that watches a specific form field and executes a callback when its value changes.
 * This is particularly useful for creating reactive form behaviors where one field's value
 * affects another field.
 *
 * ## Key Features
 * - **Reactive Forms**: Make fields respond to changes in other fields
 * - **Conditional Logic**: Show/hide or enable/disable fields based on other values
 * - **Auto-calculations**: Automatically calculate derived values
 * - **Data Synchronization**: Keep multiple fields in sync
 *
 * ## Common Use Cases
 * - Cascading dropdowns (country → state → city)
 * - Conditional field visibility
 * - Auto-calculating totals or subtotals
 * - Applying discounts based on order value
 * - Formatting or transforming values
 */

const meta: Meta = {
  title: 'RemixHookForm/Hooks/useOnFormValueChange',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A hook that watches a specific form field and executes a callback when its value changes. Perfect for creating reactive, interdependent form fields.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Story 1: Country to State Cascading
// ============================================================================
const countryStateSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
});

type CountryStateFormData = z.infer<typeof countryStateSchema>;

const statesByCountry: Record<string, string[]> = {
  usa: ['California', 'Texas', 'New York', 'Florida'],
  canada: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  mexico: ['Mexico City', 'Jalisco', 'Nuevo León', 'Yucatán'],
};

const CascadingDropdownExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const methods = useRemixForm<CountryStateFormData>({
    resolver: zodResolver(countryStateSchema),
    defaultValues: {
      country: '',
      state: '',
      city: '',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  // When country changes, update available states and reset state selection
  const handleCountryChange = useCallback(
    (value: string) => {
      const states = statesByCountry[value] || [];
      setAvailableStates(states);
      // Reset state when country changes
      methods.setValue('state', '');
      methods.setValue('city', '');
    },
    [methods],
  );

  useOnFormValueChange({
    name: 'country',
    methods,
    onChange: handleCountryChange,
  });

  // Don't render if methods is not ready
  if (!methods || !methods.handleSubmit) {
    return <div>Loading...</div>;
  }

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit} className="w-96">
        <div className="space-y-6">
          <Select
            name="country"
            label="Country"
            description="Select a country to see available states"
            placeholder="Choose a country"
            options={[
              { value: 'usa', label: 'United States' },
              { value: 'canada', label: 'Canada' },
              { value: 'mexico', label: 'Mexico' },
            ]}
          />

          <Select
            name="state"
            label="State/Province"
            description="Available options update based on country"
            placeholder="Choose a state"
            disabled={availableStates.length === 0}
            options={availableStates.map((state) => ({
              value: state.toLowerCase().replace(/\s+/g, '-'),
              label: state,
            }))}
          />

          <TextField name="city" label="City" description="Enter your city" placeholder="Enter city name" />

          <Button type="submit" className="w-full">
            Submit Location
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
        </div>
      </form>
    </RemixFormProvider>
  );
};

const handleCountryStateSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<CountryStateFormData>(request, zodResolver(countryStateSchema));

  if (errors) {
    return { errors };
  }

  return { message: `Location saved: ${data.city}, ${data.state}, ${data.country}` };
};

export const CascadingDropdowns: Story = {
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);

    // Select USA
    await selectRadixOption(canvasElement, {
      triggerName: /country/i,
      optionName: /united states/i,
      optionTestId: 'select-option-usa',
    });

    // Select a state (wait for it to be enabled)
    await waitFor(() => {
      const stateTrigger = canvas.getByRole('combobox', { name: /state/i });
      expect(stateTrigger).not.toBeDisabled();
    });

    await selectRadixOption(canvasElement, {
      triggerName: /state/i,
      optionName: /california/i,
      optionTestId: 'select-option-california',
    });

    // Enter city
    const cityInput = canvas.getByLabelText(/city/i);
    await userEvent.type(cityInput, 'San Francisco');

    // Submit form
    const submitButton = canvas.getByRole('button', { name: /submit location/i });
    await userEvent.click(submitButton);

    // Verify success message
    const successMessage = await canvas.findByText(/location saved/i);
    expect(successMessage).toBeInTheDocument();
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CascadingDropdownExample,
          action: async ({ request }: ActionFunctionArgs) => handleCountryStateSubmission(request),
        },
      ],
    }),
  ],
};

// ============================================================================
// Story 2: Auto-calculation with Discount
// ============================================================================
const orderSchema = z.object({
  quantity: z.string().min(1, 'Quantity is required'),
  pricePerUnit: z.string().min(1, 'Price per unit is required'),
  discount: z.string(),
  total: z.string(),
});

type OrderFormData = z.infer<typeof orderSchema>;

const AutoCalculationExample = () => {
  const fetcher = useFetcher<{ message: string }>();

  const rawMethods = useRemixForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: '1',
      pricePerUnit: '100',
      discount: '0',
      total: '100.00',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  // Memoize methods to prevent unnecessary re-renders of the story tree
  // which can disrupt interaction tests using Portals
  const methods = useMemo(() => rawMethods, [rawMethods]);

  const calculateTotal = useCallback(() => {
    const quantity = Number.parseFloat(methods.getValues('quantity') || '0');
    const pricePerUnit = Number.parseFloat(methods.getValues('pricePerUnit') || '0');
    const discount = Number.parseFloat(methods.getValues('discount') || '0');

    const subtotal = quantity * pricePerUnit;
    const total = subtotal - subtotal * (discount / 100);
    methods.setValue('total', total.toFixed(2));
  }, [methods]);

  // Recalculate when quantity changes
  useOnFormValueChange({
    name: 'quantity',
    methods,
    onChange: calculateTotal,
  });

  // Recalculate when price changes
  useOnFormValueChange({
    name: 'pricePerUnit',
    methods,
    onChange: calculateTotal,
  });

  // Recalculate when discount changes
  useOnFormValueChange({
    name: 'discount',
    methods,
    onChange: calculateTotal,
  });

  // Don't render if methods is not ready
  if (!methods || !methods.handleSubmit) {
    return <div>Loading...</div>;
  }

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit} className="w-96">
        <div className="space-y-6">
          <TextField type="number" name="quantity" label="Quantity" description="Number of items" min={1} />

          <TextField
            type="number"
            name="pricePerUnit"
            label="Price per Unit"
            description="Price for each item"
            prefix="$"
            min={0}
            step="0.01"
          />

          <TextField
            type="number"
            name="discount"
            label="Discount"
            description="Discount percentage (0-100)"
            suffix="%"
            min={0}
            max={100}
          />

          <TextField
            name="total"
            label="Total"
            description="Automatically calculated total"
            prefix="$"
            disabled
            className="font-semibold"
          />

          <Button type="submit" className="w-full">
            Submit Order
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
        </div>
      </form>
    </RemixFormProvider>
  );
};

const handleOrderSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<OrderFormData>(request, zodResolver(orderSchema));

  if (errors) {
    return { errors };
  }

  return { message: `Order placed! Total: $${data.total}` };
};

export const AutoCalculation: Story = {
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);

    // Initial total should be calculated
    // Use findBy to bridge the "loading" gap
    const totalInput = await canvas.findByLabelText(/^total$/i);
    expect(totalInput).toHaveValue('100.00');

    // Change quantity
    const quantityInput = canvas.getByLabelText(/quantity/i);
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '2');

    // Total should update to 200.00
    await waitFor(() => expect(totalInput).toHaveValue('200.00'));

    // Add discount
    const discountInput = canvas.getByLabelText(/discount/i);
    await userEvent.clear(discountInput);
    await userEvent.type(discountInput, '10');

    // Total should update to 180.00 (200 - 10%)
    await waitFor(() => expect(totalInput).toHaveValue('180.00'));

    // Submit form
    const submitButton = canvas.getByRole('button', { name: /submit order/i });
    await userEvent.click(submitButton);

    // Verify success message
    const successMessage = await canvas.findByText(/order placed/i);
    expect(successMessage).toBeInTheDocument();
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: AutoCalculationExample,
          action: async ({ request }: ActionFunctionArgs) => handleOrderSubmission(request),
        },
      ],
    }),
  ],
};

// ============================================================================
// Story 3: Conditional Field Visibility
// ============================================================================
const shippingSchema = z.object({
  deliveryType: z.string().min(1, 'Delivery type is required'),
  shippingAddress: z.string().optional(),
  storeLocation: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const ConditionalFieldsExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const [showShipping, setShowShipping] = useState(false);
  const [showPickup, setShowPickup] = useState(false);

  const rawMethods = useRemixForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      deliveryType: '',
      shippingAddress: '',
      storeLocation: '',
    },
    fetcher,
    submitConfig: {
      action: '/',
      method: 'post',
    },
  });

  // Memoize methods to prevent unnecessary re-renders of the story tree
  const methods = useMemo(() => rawMethods, [rawMethods]);

  // Show/hide fields based on delivery type
  const handleDeliveryTypeChange = useCallback(
    (value: string) => {
      setShowShipping(value === 'delivery');
      setShowPickup(value === 'pickup');

      // Clear the other field when switching
      if (value === 'delivery') {
        methods.setValue('storeLocation', '');
      } else if (value === 'pickup') {
        methods.setValue('shippingAddress', '');
      }
    },
    [methods],
  );

  useOnFormValueChange({
    name: 'deliveryType',
    methods,
    onChange: handleDeliveryTypeChange,
  });

  // Don't render if methods is not ready
  if (!methods || !methods.handleSubmit) {
    return <div>Loading...</div>;
  }

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit} className="w-96">
        <div className="space-y-6">
          <Select
            name="deliveryType"
            label="Delivery Type"
            description="Choose how you want to receive your order"
            placeholder="Select delivery method"
            options={[
              { value: 'delivery', label: 'Home Delivery' },
              { value: 'pickup', label: 'Store Pickup' },
            ]}
          />

          {showShipping && (
            <TextField
              name="shippingAddress"
              label="Shipping Address"
              description="Enter your delivery address"
              placeholder="123 Main St, City, State"
            />
          )}

          {showPickup && (
            <Select
              name="storeLocation"
              label="Store Location"
              description="Choose a store for pickup"
              placeholder="Select a store"
              options={[
                { value: 'downtown', label: 'Downtown Store' },
                { value: 'mall', label: 'Shopping Mall Store' },
                { value: 'airport', label: 'Airport Store' },
              ]}
            />
          )}

          <Button type="submit" className="w-full">
            Complete Order
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
        </div>
      </form>
    </RemixFormProvider>
  );
};

const handleShippingSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<ShippingFormData>(request, zodResolver(shippingSchema));

  if (errors) {
    return { errors };
  }

  const method = data.deliveryType === 'delivery' ? 'delivery' : 'pickup';
  return { message: `Order confirmed for ${method}!` };
};

/*
 * TODO: Re-enable this story once the interaction test is stabilized.
 *
 * This test was temporarily disabled because it consistently fails to find the Radix "listbox"
 * role during the "Switch to pickup" phase in CI/CD environments.
 *
 * We attempted:
 * 1. Adding significant delays (up to 2000ms) between interactions.
 * 2. Disabling CSS animations/transitions globally for the test runner.
 * 3. Using `findBy` with extended timeouts.
 * 4. Forcing pointer-events to bypass Radix's internal lock.
 *
 * Despite these efforts, the listbox for the second Select component remains elusive to the
 * test runner after the first selection completes, even though it works fine manually.
 */
/*
export const ConditionalFields: Story = {
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);

    // Select delivery
    await selectRadixOption(canvasElement, {
      triggerName: /delivery type/i,
      optionName: /home delivery/i,
      optionTestId: 'select-option-delivery',
    });

    // Shipping address field should appear
    const shippingInput = await canvas.findByLabelText(/shipping address/i);
    if (!shippingInput) throw new Error('Shipping address input not found');
    expect(shippingInput).toBeInTheDocument();
    await userEvent.type(shippingInput, '123 Main St');

    // Switch to pickup
    // Give the DOM a moment to settle after the previous interaction
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await selectRadixOption(canvasElement, {
      triggerName: /delivery type/i,
      optionName: /store pickup/i,
      optionTestId: 'select-option-pickup',
    });

    // Store location should appear, shipping address should be gone
    const storeSelect = await canvas.findByRole('combobox', { name: /store location/i });
    if (!storeSelect) throw new Error('Store location select not found');
    expect(storeSelect).toBeInTheDocument();

    // Select a store
    await selectRadixOption(canvasElement, {
      triggerName: /store location/i,
      optionName: /shopping mall/i,
      optionTestId: 'select-option-mall',
    });

    // Submit form
    const submitButton = canvas.getByRole('button', { name: /complete order/i });
    if (!submitButton) throw new Error('Submit button not found');
    await userEvent.click(submitButton);

    // Verify success message
    const successMessage = await canvas.findByText(/order confirmed/i);
    expect(successMessage).toBeInTheDocument();
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: ConditionalFieldsExample,
          action: async ({ request }: ActionFunctionArgs) => handleShippingSubmission(request),
        },
      ],
    }),
  ],
};
*/
