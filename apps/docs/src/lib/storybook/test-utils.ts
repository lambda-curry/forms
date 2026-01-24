import { userEvent, within, screen, waitFor } from '@storybook/test';

/**
 * A robust helper to select an option from a Radix-based Select/Combobox.
 * Handles portals, animations, and pointer-event blockers.
 */
export async function selectRadixOption(
  canvasElement: HTMLElement,
  options: {
    triggerRole?: 'combobox' | 'button';
    triggerName: string | RegExp;
    optionName: string | RegExp;
    optionTestId?: string;
  },
) {
  const canvas = within(canvasElement);
  const { triggerRole = 'combobox', triggerName, optionName, optionTestId } = options;

  // 1. Find and click the trigger within the component canvas
  const trigger = await canvas.findByRole(triggerRole, { name: triggerName });
  if (!trigger) throw new Error(`Trigger with role ${triggerRole} and name ${triggerName} not found`);

  await userEvent.click(trigger);

  // 2. Wait for the listbox to appear in the document body (Portal)
  // We use a slightly longer timeout for CI stability.
  const listbox = await screen.findByRole('listbox', {}, { timeout: 3000 });
  if (!listbox) throw new Error('Radix listbox (portal) not found after clicking trigger');

  // 3. Find the option specifically WITHIN the listbox
  let option: HTMLElement | null = null;
  if (optionTestId) {
    option = await within(listbox).findByTestId(optionTestId);
  } else {
    option = await within(listbox).findByRole('option', { name: optionName });
  }

  if (!option) throw new Error(`Option ${optionName || optionTestId} not found in listbox`);

  // 4. Click the option
  // pointerEventsCheck: 0 is used to bypass Radix's temporary pointer-event locks during animations
  await userEvent.click(option, { pointerEventsCheck: 0 });

  // 5. Verify the dropdown closed (optional but ensures stability)
  await waitFor(() => {
    const listbox = screen.queryByRole('listbox');
    if (listbox) throw new Error('Listbox still visible');
  });

  // 6. Blur the trigger to ensure any onBlur events are fired (simulating "clicking off")
  // This helps when interactions depend on the field losing focus (like updating dirty/touched states)
  await userEvent.click(document.body);
}
