import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';
import { Select } from '@lambdacurry/forms/ui/select';

const meta = {
  title: 'UI/Select/Alignment',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Use `contentProps` to align the popover with right-aligned triggers, such as when a Select sits near the edge of a container.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const RightAlignedSelectExample = () => {
  const [value, setValue] = useState('');

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex justify-end">
          <div className="w-44">
            <Select
              aria-label="Favorite fruit"
              placeholder="Select a fruit"
              options={fruits}
              value={value}
              onValueChange={setValue}
              contentProps={{ align: 'end' }}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Right-align the popover when the trigger is flush with the container edge to avoid clipping and keep the
        dropdown visible.
      </p>
    </div>
  );
};

export const RightAligned: Story = {
  args: {
    options: fruits,
    placeholder: 'Select a fruit...',
  },
  render: () => <RightAlignedSelectExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Favorite fruit' });

    await step('Open the select', async () => {
      await userEvent.click(trigger);
      await waitFor(() => {
        const popover = document.querySelector('[data-slot="popover-content"]');
        expect(popover).not.toBeNull();
        expect(popover).toHaveAttribute('data-align', 'end');
      });
    });

    await step('Navigate and select via keyboard', async () => {
      await waitFor(() => {
        const commandRoot = document.querySelector('[cmdk-root]');
        expect(commandRoot).not.toBeNull();
      });
      const listbox = document.querySelector('[role="listbox"]') as HTMLElement;
      listbox.focus();
      await waitFor(() => {
        expect(document.activeElement).toBe(listbox);
      });
      await userEvent.keyboard('{ArrowDown}');
      await waitFor(() => {
        const activeItem = document.querySelector('[cmdk-item][aria-selected="true"]');
        expect(activeItem).not.toBeNull();
      });
      const activeItem = document.querySelector('[cmdk-item][aria-selected="true"]') as HTMLElement;
      activeItem.dispatchEvent(
        new CustomEvent('cmdk-item-select', {
          detail: activeItem.getAttribute('data-value'),
          bubbles: true,
        }),
      );
      await waitFor(() => {
        expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });
  },
};
