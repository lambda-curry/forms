import { zodResolver } from '@hookform/resolvers/zod';
import { SelectCommand, CanadaProvinceSelect as RHFCanadaProvinceSelect } from '@lambdacurry/forms/remix-hook-form';
import { Button } from '@lambdacurry/forms/ui/button';
import { CANADA_PROVINCES } from '@lambdacurry/forms/ui/data/canada-provinces';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import type { ActionFunctionArgs } from 'react-router';
import { RemixFormProvider, getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

const formSchema = z.object({
  province: z.string().min(1, 'Please select a province'),
  region: z.string().min(1, 'Please select a region'),
});

type FormData = z.infer<typeof formSchema>;

const Example = () => {
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Preselect a value far down the list to show scroll-into-view on open
      province: 'SK',
      region: 'BC',
    },
    submitConfig: { action: '/', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Command-based Combobox control */}
          <SelectCommand
            name="region"
            label="Custom Region (Command)"
            description="Combobox built on Command components"
            options={CANADA_PROVINCES}
            placeholder="Select a custom region"
          />

          {/* Keep existing Select (Popover + ul) for comparison */}
          <RHFCanadaProvinceSelect name="province" label="Canadian Province (Current)" description="Existing Select" />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </RemixFormProvider>
  );
};

const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(request, zodResolver(formSchema));

  if (errors) return { errors };
  return { message: 'ok', data };
};

const meta: Meta<typeof Example> = {
  title: 'RemixHookForm/SelectCommand (Combobox)',
  component: Example,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: Example,
          action: async ({ request }: ActionFunctionArgs) => handleFormSubmission(request),
        },
      ],
    }),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open province select with preselected Saskatchewan', async () => {
      const provinceSelect = canvas.getByLabelText('Canadian Province (Current)');
      await userEvent.click(provinceSelect);

      // Ensure listbox is present and Saskatchewan option exists
      const listbox = await within(document.body).findByRole('listbox');
      await expect(within(listbox).findByRole('option', { name: /Saskatchewan/i })).resolves.toBeInTheDocument();
    });

    await step('Open command combobox', async () => {
      const regionSelect = canvas.getByLabelText('Custom Region (Command)');
      await userEvent.click(regionSelect);

      // Ensure listbox is present and British Columbia option exists
      const listbox = await within(document.body).findByRole('listbox');
      await expect(within(listbox).findByRole('option', { name: /British Columbia/i })).resolves.toBeInTheDocument();
    });
  },
};
