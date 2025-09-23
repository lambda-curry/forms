import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Select, type SelectOption } from '@lambdacurry/forms/ui/select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select/Alignment',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const OPTIONS: SelectOption[] = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
];

export const RightAlignedWithEndContent: Story = {
  name: 'Right-aligned trigger with content align="end"',
  args: {},
  render: () => {
    const [value, setValue] = useState<string>('');
    
    return (
      <div className="w-[480px]">
        <div className="flex justify-end">
          <div className="w-[280px]">
            <Select 
              options={OPTIONS} 
              placeholder="Choose a state" 
              contentProps={{ align: 'end' }}
              value={value}
              onChange={setValue}
            />
          </div>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Open the select', async () => {
      // Find the trigger by its role and accessible name (which should be the placeholder)
      const trigger = await canvas.findByRole('combobox', { name: 'Choose a state' });
      await userEvent.click(trigger);

      // Wait for popover content to be rendered
      await new Promise((r) => setTimeout(r, 100));
      const contentEl = document.body.querySelector('[data-slot="popover-content"]') as HTMLElement | null;
      expect(contentEl).toBeTruthy();

      // Assert alignment override using data attribute we expose
      expect(contentEl).toHaveAttribute('data-align', 'end');
    });

    await step('Keyboard navigate and select', async () => {
      // Focus should be inside the popover; try arrow navigation then enter
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.keyboard('[Enter]');

      // Wait for the selection to be processed
      await new Promise((r) => setTimeout(r, 100));

      // The trigger should now show the selected option (first item: Alabama)
      await expect(canvas.findByRole('combobox', { name: 'Alabama' })).resolves.toBeInTheDocument();

      // Re-open and press Escape to close
      const trigger = await canvas.findByRole('combobox', { name: 'Alabama' });
      await userEvent.click(trigger);
      await userEvent.keyboard('[Escape]');
      
      // Ensure popover content is removed
      await new Promise((r) => setTimeout(r, 200));
      const stillOpen = document.body.querySelector('[data-slot="popover-content"]');
      expect(stillOpen).toBeNull();
    });
  },
};
