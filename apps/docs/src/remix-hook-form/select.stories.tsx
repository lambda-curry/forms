import { zodResolver } from '@hookform/resolvers/zod';
import { CanadaProvinceSelect, Select, USStateSelect } from '@lambdacurry/forms/remix-hook-form';
import { Button } from '@lambdacurry/forms/ui/button';
import { CANADA_PROVINCES } from '@lambdacurry/forms/ui/data/canada-provinces';
import { US_STATES } from '@lambdacurry/forms/ui/data/us-states';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  state: z.string().min(1, 'Please select a state'),
  province: z.string().min(1, 'Please select a province'),
  region: z.string().min(1, 'Please select a region'),
});

type FormData = z.infer<typeof formSchema>;

const RegionSelectExample = () => {
  const fetcher = useFetcher<{ message: string; selectedRegions: Record<string, string> }>();

  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: '',
      province: '',
      region: '',
    },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <USStateSelect name="state" label="US State" description="Select a US state" />

          <CanadaProvinceSelect name="province" label="Canadian Province" description="Select a Canadian province" />

          <Select
            name="region"
            label="Custom Region"
            description="Select a custom region"
            options={[...US_STATES.slice(0, 5), ...CANADA_PROVINCES.slice(0, 5)]}
            placeholder="Select a custom region"
          />
        </div>

        <Button type="submit">Submit</Button>

        {fetcher.data?.selectedRegions && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-sm font-medium">Selected regions:</p>
            <ul className="text-sm text-gray-500">
              {Object.entries(fetcher.data.selectedRegions).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) {
    return { errors };
  }

  return {
    message: 'Form submitted successfully',
    selectedRegions: {
      state: data.state,
      province: data.province,
      region: data.region,
    },
  };
};

const meta: Meta<typeof Select> = {
  title: 'RemixHookForm/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const selectRouterDecorator = withReactRouterStubDecorator({
  routes: [
    {
      path: '/',
      Component: RegionSelectExample,
      action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
    },
  ],
});

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A select component for selecting options from a dropdown list. Includes specialized components for US states and Canadian provinces.',
      },
      source: {
        code: `
const formSchema = z.object({
  state: z.string().min(1, 'Please select a state'),
  province: z.string().min(1, 'Please select a province'),
  region: z.string().min(1, 'Please select a region'),
});

const RegionSelectExample = () => {
  const fetcher = useFetcher<{ message: string; selectedRegions: Record<string, string> }>();
  
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: '',
      province: '',
      region: '',
    },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <USStateSelect
            name="state"
            label="US State"
            description="Select a US state"
          />
          
          <CanadaProvinceSelect
            name="province"
            label="Canadian Province"
            description="Select a Canadian province"
          />
          
          <Select
            name="region"
            label="Custom Region"
            description="Select a custom region"
            options={[
              ...US_STATES.slice(0, 5),
              ...CANADA_PROVINCES.slice(0, 5),
            ]}
            placeholder="Select a custom region"
          />
        </div>
        
        <Button type="submit">Submit</Button>
      </fetcher.Form>
    </RemixFormProvider>
  );
};`,
      },
    },
  },
  decorators: [selectRouterDecorator],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify initial state', () => {
      // Verify all selects are empty initially
      const stateSelect = canvas.getByLabelText('US State');
      const provinceSelect = canvas.getByLabelText('Canadian Province');
      const regionSelect = canvas.getByLabelText('Custom Region');

      expect(stateSelect).toHaveTextContent('Select a state');
      expect(provinceSelect).toHaveTextContent('Select a province');
      expect(regionSelect).toHaveTextContent('Select a custom region');

      // Verify submit button is present
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
    });

    await step('Test validation errors on invalid submission', async () => {
      // Submit form without selecting any options
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify validation error messages appear
      await expect(canvas.findByText('Please select a state')).resolves.toBeInTheDocument();
      await expect(canvas.findByText('Please select a province')).resolves.toBeInTheDocument();
      await expect(canvas.findByText('Please select a region')).resolves.toBeInTheDocument();
    });

    await step('Test successful submission', async () => {
      // Select a state
      const stateSelect = canvas.getByLabelText('US State');
      await userEvent.click(stateSelect);
      {
        const listbox = await within(document.body).findByRole('listbox');
        const californiaOption = within(listbox).getByRole('option', { name: 'California' });
        await userEvent.click(californiaOption);
      }

      // Select a province
      const provinceSelect = canvas.getByLabelText('Canadian Province');
      await userEvent.click(provinceSelect);
      {
        const listbox = await within(document.body).findByRole('listbox');
        const ontarioOption = within(listbox).getByRole('option', { name: 'Ontario' });
        await userEvent.click(ontarioOption);
      }

      // Select a custom region
      const regionSelect = canvas.getByLabelText('Custom Region');
      await userEvent.click(regionSelect);
      {
        const listbox = await within(document.body).findByRole('listbox');
        const customOption = within(listbox).getByRole('option', { name: 'California' });
        await userEvent.click(customOption);
      }

      // Submit
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Assert success UI
      await expect(canvas.findByText('Selected regions:')).resolves.toBeInTheDocument();
      expect(canvas.getByText('state: CA')).toBeInTheDocument();
      expect(canvas.getByText('province: ON')).toBeInTheDocument();
      expect(canvas.getByText('region: CA')).toBeInTheDocument();
    });
  },
};

export const USStateSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Test selecting a US state from the dropdown.',
      },
    },
  },
  decorators: [selectRouterDecorator],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Select a US state', async () => {
      // Find and click the US state dropdown
      const stateSelect = canvas.getByLabelText('US State');
      await userEvent.click(stateSelect);

      // Dropdown content renders in a portal; query via document.body roles
      const listbox = await within(document.body).findByRole('listbox');
      const californiaOption = within(listbox).getByRole('option', { name: 'California' });
      await userEvent.click(californiaOption);

      // Wait for the trigger text to update after portal selection
      await expect(canvas.findByRole('combobox', { name: 'US State' })).resolves.toHaveTextContent('California');
    });
  },
};

export const CanadaProvinceSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Test selecting a Canadian province from the dropdown.',
      },
    },
  },
  decorators: [selectRouterDecorator],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Select a Canadian province', async () => {
      // Find and click the Canada province dropdown
      const provinceSelect = canvas.getByLabelText('Canadian Province');
      await userEvent.click(provinceSelect);

      // Query in portal content by role
      const listbox = await within(document.body).findByRole('listbox');
      const ontarioOption = within(listbox).getByRole('option', { name: 'Ontario' });
      await userEvent.click(ontarioOption);

      // Wait for the trigger text to update after portal selection
      await expect(canvas.findByRole('combobox', { name: 'Canadian Province' })).resolves.toHaveTextContent('Ontario');
    });
  },
};

export const FormSubmission: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Test form submission with selected regions.',
      },
    },
  },
  decorators: [selectRouterDecorator],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Select all regions', async () => {
      // Select a state
      const stateSelect = canvas.getByLabelText('US State');
      await userEvent.click(stateSelect);
      {
        const listbox = await within(document.body).findByRole('listbox');
        const californiaOption = within(listbox).getByRole('option', { name: 'California' });
        await userEvent.click(californiaOption);
      }

      // Select a province
      const provinceSelect = canvas.getByLabelText('Canadian Province');
      await userEvent.click(provinceSelect);
      {
        const listbox = await within(document.body).findByRole('listbox');
        const ontarioOption = within(listbox).getByRole('option', { name: 'Ontario' });
        await userEvent.click(ontarioOption);
      }

      // Select a custom region
      const regionSelect = canvas.getByLabelText('Custom Region');
      await userEvent.click(regionSelect);
      {
        const listbox = await within(document.body).findByRole('listbox');
        const customOption = within(listbox).getByRole('option', { name: 'California' });
        await userEvent.click(customOption);
      }
    });

    await step('Submit the form', async () => {
      // Submit the form
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);

      // Verify the submission result
      await expect(canvas.findByText('Selected regions:')).resolves.toBeInTheDocument();
    });
  },
};

export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Test keyboard navigation with arrow keys and Enter selection.',
      },
    },
  },
  decorators: [selectRouterDecorator],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Test keyboard navigation on Custom Region select', async () => {
      // Open the Custom Region select
      const regionSelect = canvas.getByLabelText('Custom Region');
      await userEvent.click(regionSelect);

      // Wait for the ShadCN popover to render in the Portal (document.body)
      // This is the key fix: ShadCN components render via Radix UI Portal to document.body
      const listbox = await waitFor(
        () => within(document.body).getByRole('listbox'),
        { timeout: 3000 }
      );
      expect(listbox).toBeInTheDocument();

      // Wait for the search input to be focused and ready
      const searchInput = await waitFor(
        () => within(listbox).getByPlaceholderText('Search...'),
        { timeout: 1000 }
      );
      
      // Wait for focus to be properly set (ShadCN uses queueMicrotask for focus)
      await waitFor(() => {
        expect(searchInput).toHaveFocus();
      }, { timeout: 1000 });

      // Wait for the component to initialize and set aria-activedescendant
      await waitFor(() => {
        const activeOptionId = searchInput.getAttribute('aria-activedescendant');
        expect(activeOptionId).toBeTruthy();
        return activeOptionId;
      }, { timeout: 1000 });

      // Get the current active option ID after initialization
      const firstOptionId = searchInput.getAttribute('aria-activedescendant');
      
      // Verify the first option exists and has the correct ID
      const firstOption = within(listbox).getByRole('option', { name: 'Alabama' });
      expect(firstOption).toHaveAttribute('id', firstOptionId);
      
      // Verify the active state is properly set
      await waitFor(() => {
        const currentActiveOption = document.getElementById(firstOptionId!);
        expect(currentActiveOption).toHaveAttribute('data-active', 'true');
      }, { timeout: 1000 });
    });

    await step('Navigate with arrow keys', async () => {
      // Get the listbox that should still be open from the previous step
      const listbox = within(document.body).getByRole('listbox');
      const searchInput = within(listbox).getByPlaceholderText('Search...');

      // Debug: Log the current state before navigation
      console.log('Before navigation - activeIndex should be 0');
      const initialActiveOptionId = searchInput.getAttribute('aria-activedescendant');
      const initialActiveOption = document.getElementById(initialActiveOptionId!);
      console.log('Initial active option index:', initialActiveOption?.getAttribute('data-index'));

      // Press ArrowDown once to move to the second item
      fireEvent.keyDown(searchInput, { key: 'ArrowDown', code: 'ArrowDown' });
      
      // Wait for first arrow down to take effect
      await waitFor(() => {
        const activeOptionId = searchInput.getAttribute('aria-activedescendant');
        const activeOption = document.getElementById(activeOptionId!);
        console.log('After first arrow down - expected index 1, actual:', activeOption?.getAttribute('data-index'));
        expect(activeOption).toHaveAttribute('data-index', '1');
      }, { timeout: 2000 });
      
      fireEvent.keyDown(searchInput, { key: 'ArrowDown', code: 'ArrowDown' });

      // Wait for the aria-activedescendant to update after second keyboard navigation
      await waitFor(() => {
        const activeOptionId = searchInput.getAttribute('aria-activedescendant');
        const activeOption = document.getElementById(activeOptionId!);
        console.log('After second arrow down - expected index 2, actual:', activeOption?.getAttribute('data-index'));
        expect(activeOption).toHaveAttribute('data-index', '2');
        return activeOption;
      }, { timeout: 2000 });

      // Verify the active state is properly set on the third option
      const activeOptionId = searchInput.getAttribute('aria-activedescendant');
      const activeOption = document.getElementById(activeOptionId!);
      expect(activeOption).toHaveAttribute('data-active', 'true');
    });

    await step('Select with Enter key', async () => {
      const listbox = within(document.body).getByRole('listbox');
      const searchInput = within(listbox).getByPlaceholderText('Search...');

      // Press Enter to select the active item
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      // Wait for the ShadCN popover to close (Portal cleanup)
      await waitFor(() => {
        expect(() => within(document.body).getByRole('listbox')).toThrow();
      }, { timeout: 2000 });

      // Verify the trigger shows the selected value
      const regionSelect = canvas.getByLabelText('Custom Region');
      // The third item should be "Arizona" (AL, AK, AZ...)
      await waitFor(() => {
        expect(regionSelect).toHaveTextContent('Arizona');
      }, { timeout: 1000 });
    });

    await step('Test filtering and active item reset', async () => {
      // Open the dropdown again
      const regionSelect = canvas.getByLabelText('Custom Region');
      await userEvent.click(regionSelect);

      // Wait for the ShadCN popover to open again
      const listbox = await waitFor(
        () => within(document.body).getByRole('listbox'),
        { timeout: 3000 }
      );
      const searchInput = await waitFor(
        () => within(listbox).getByPlaceholderText('Search...'),
        { timeout: 1000 }
      );

      // Type to filter
      await userEvent.type(searchInput, 'cal');

      // Wait for filtering to complete and active item to reset
      await waitFor(() => {
        const activeOptionId = searchInput.getAttribute('aria-activedescendant');
        const activeOption = document.getElementById(activeOptionId!);
        expect(activeOption).toHaveAttribute('data-index', '0');
        expect(activeOption).toHaveTextContent('California');
      }, { timeout: 1000 });

      // Press Enter to select the filtered item
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      // Wait for the popover to close and selection to update
      await waitFor(() => {
        expect(() => within(document.body).getByRole('listbox')).toThrow();
      }, { timeout: 2000 });
      
      await waitFor(() => {
        expect(regionSelect).toHaveTextContent('California');
      }, { timeout: 1000 });
    });
  },
};
