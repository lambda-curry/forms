import { zodResolver } from '@hookform/resolvers/zod';
import { CanadaProvinceSelect, Select, USStateSelect } from '@lambdacurry/forms/remix-hook-form';
import { Button } from '@lambdacurry/forms/ui/button';
import { CANADA_PROVINCES } from '@lambdacurry/forms/ui/data/canada-provinces';
import { US_STATES } from '@lambdacurry/forms/ui/data/us-states';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { type ActionFunctionArgs, useFetcher } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';
import { testCanadaProvinceSelection, testFormSubmission, testUSStateSelection, testValidationErrors } from './select.test';

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
    await step('Test US State Selection', testUSStateSelection);
    await step('Test Canada Province Selection', testCanadaProvinceSelection);
    await step('Test Form Submission', testFormSubmission);
  },
};

export const ValidationErrors: Story = {
  decorators: [selectRouterDecorator],
  play: testValidationErrors,
};

