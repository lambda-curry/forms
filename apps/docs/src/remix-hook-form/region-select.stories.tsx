import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetcher } from '@remix-run/react';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { Button } from '@lambdacurry/forms/ui/button';
import { RegionSelect, USStateSelect, CanadaProvinceSelect } from '@lambdacurry/forms/remix-hook-form';
import { US_STATES } from '@lambdacurry/forms/ui/data/us-states';
import { CANADA_PROVINCES } from '@lambdacurry/forms/ui/data/canada-provinces';
import { testUSStateSelection, testCanadaProvinceSelection, testFormSubmission, testValidationErrors } from './region-select.test';

const formSchema = z.object({
  state: z.string().min(1, 'Please select a state'),
  province: z.string().min(1, 'Please select a province'),
  region: z.string().min(1, 'Please select a region'),
});

type FormData = z.infer<typeof formSchema>;

function RegionSelectExample() {
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
          
          <RegionSelect
            name="region"
            label="Custom Region"
            description="Select a custom region"
            options={[
              ...US_STATES.slice(0, 5),
              ...CANADA_PROVINCES.slice(0, 5),
            ]}
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
}

export default {
  title: 'RemixHookForm/RegionSelect',
  component: RegionSelectExample,
} satisfies Meta<typeof RegionSelectExample>;

type Story = StoryObj<typeof RegionSelectExample>;

export const Default: Story = {
  render: () => <RegionSelectExample />,
  parameters: {
    docs: {
      description: {
        story: 'A region select component for selecting US states, Canadian provinces, or custom regions.',
      },
    },
  },
  play: async (context) => {
    await testValidationErrors(context);
  },
};

export const USStateSelectionTest: Story = {
  render: () => <RegionSelectExample />,
  parameters: {
    docs: {
      description: {
        story: 'Test selecting a US state from the dropdown.',
      },
    },
  },
  play: async (context) => {
    await testUSStateSelection(context);
  },
};

export const CanadaProvinceSelectionTest: Story = {
  render: () => <RegionSelectExample />,
  parameters: {
    docs: {
      description: {
        story: 'Test selecting a Canadian province from the dropdown.',
      },
    },
  },
  play: async (context) => {
    await testCanadaProvinceSelection(context);
  },
};

export const FormSubmissionTest: Story = {
  render: () => <RegionSelectExample />,
  parameters: {
    docs: {
      description: {
        story: 'Test form submission with selected regions.',
      },
    },
  },
  play: async (context) => {
    await testFormSubmission(context);
  },
};
