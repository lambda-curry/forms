import { zodResolver } from '@hookform/resolvers/zod';
import { CanadaProvinceSelect, Select, USStateSelect } from '@lambdacurry/forms/remix-hook-form';
import { Button } from '@lambdacurry/forms/ui/button';
import { CANADA_PROVINCES } from '@lambdacurry/forms/ui/data/canada-provinces';
import { US_STATES } from '@lambdacurry/forms/ui/data/us-states';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { getValidatedFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form';
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

// Region-only submission handler for stories that only submit the `region` field
const handleRegionSubmission = async (request: Request) => {
  const regionSchema = z.object({ region: z.string().min(1) });
  const { data, errors } = await getValidatedFormData<{ region: string }>(request, zodResolver(regionSchema));

  if (errors) {
    return { errors };
  }

  return {
    message: 'Form submitted successfully',
    selectedRegion: data.region,
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

// Additional examples for search behavior and creatable options

const SearchDisabledExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<{ region: string }>({
    resolver: zodResolver(z.object({ region: z.string().min(1) })),
    defaultValues: { region: '' },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });
  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <Select
          name="region"
          label="Custom Region"
          description="Search disabled"
          options={[...US_STATES.slice(0, 5), ...CANADA_PROVINCES.slice(0, 5)]}
          placeholder="Select a custom region"
          searchable={false}
        />
      </fetcher.Form>
    </RemixFormProvider>
  );
};

export const SearchDisabled: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: SearchDisabledExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Open select and ensure no search input', async () => {
      const regionSelect = canvas.getByLabelText('Custom Region');
      await userEvent.click(regionSelect);
      const listbox = await within(document.body).findByRole('listbox');
      expect(within(listbox).queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });
  },
};

const CustomSearchPlaceholderExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<{ region: string }>({
    resolver: zodResolver(z.object({ region: z.string().min(1) })),
    defaultValues: { region: '' },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });
  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <Select
          name="region"
          label="Custom Region"
          description="Custom search placeholder"
          options={[...US_STATES.slice(0, 5), ...CANADA_PROVINCES.slice(0, 5)]}
          placeholder="Select a custom region"
          searchInputProps={{ placeholder: 'Type to filter…' }}
        />
      </fetcher.Form>
    </RemixFormProvider>
  );
};

export const CustomSearchPlaceholder: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CustomSearchPlaceholderExample,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Open select and see custom placeholder', async () => {
      const regionSelect = canvas.getByLabelText('Custom Region');
      await userEvent.click(regionSelect);
      // The search input is rendered alongside the listbox in the portal, not inside the listbox itself.
      const searchInput = await within(document.body).findByPlaceholderText('Type to filter…');
      expect(searchInput).toBeInTheDocument();
    });
  },
};

const CreatableSelectExample = () => {
  const fetcher = useFetcher<{ message: string; selectedRegion?: string }>();
  const methods = useRemixForm<{ region: string }>({
    resolver: zodResolver(z.object({ region: z.string().min(1) })),
    defaultValues: { region: '' },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });
  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit} className="space-y-4">
        <Select
          name="region"
          label="Custom Region"
          description="Creatable option enabled"
          options={[...US_STATES.slice(0, 5), ...CANADA_PROVINCES.slice(0, 5)]}
          placeholder="Select a custom region"
          creatable
          onCreateOption={async (input) => ({ label: input, value: input })}
        />
        <Button type="submit">Submit</Button>
        {fetcher.data?.selectedRegion && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md" data-testid="submitted-region">
            <p className="text-sm font-medium">Submitted region: {fetcher.data.selectedRegion}</p>
          </div>
        )}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

export const CreatableOption: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: CreatableSelectExample,
          action: async ({ request }: ActionFunctionArgs) => handleRegionSubmission(request),
        },
      ],
    }),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Create new option when no exact match', async () => {
      // Wait for the component to render before interacting
      const regionSelect = await canvas.findByLabelText('Custom Region');
      await userEvent.click(regionSelect);
      // Add a small delay to ensure the dropdown has time to render
      await new Promise((resolve) => setTimeout(resolve, 100));
      const listbox = await within(document.body).findByRole('listbox');
      // The search input is outside the listbox container; query from the portal root
      const input = within(document.body).getByPlaceholderText('Search...');
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, 'Atlantis');

      const createItem = await within(listbox).findByRole('option', { name: 'Select "Atlantis"' });
      await userEvent.click(createItem);

      await expect(canvas.findByRole('combobox', { name: 'Custom Region' })).resolves.toHaveTextContent('Atlantis');

      // Submit and verify server received the created option value
      const submitButton = canvas.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      await expect(canvas.findByText('Submitted region: Atlantis')).resolves.toBeInTheDocument();
    });

    await step('No creatable when exact match exists', async () => {
      // Wait for the component to render before interacting
      const regionSelect = await canvas.findByLabelText('Custom Region');
      await userEvent.click(regionSelect);
      // Add a small delay to ensure the dropdown has time to render
      await new Promise((resolve) => setTimeout(resolve, 100));
      const listbox = await within(document.body).findByRole('listbox');
      // The search input is outside the listbox container; query from the portal root
      const input = within(document.body).getByPlaceholderText('Search...');
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, 'California');

      expect(within(listbox).queryByRole('option', { name: 'Select "California"' })).not.toBeInTheDocument();
    });
  },
};
