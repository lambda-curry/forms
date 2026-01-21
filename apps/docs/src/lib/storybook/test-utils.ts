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
  await userEvent.click(trigger);

  // 2. Wait for the listbox to appear in the document body (Portal)
  // We use findByRole on screen to wait for the element to mount.
  await screen.findByRole('listbox');

  // 3. Find the option
  // Scoping the search to document.body ensures we find the portal content.
  let option: HTMLElement;
  if (optionTestId) {
    option = await screen.findByTestId(optionTestId);
  } else {
    option = await screen.findByRole('option', { name: optionName });
  }

  // 4. Click the option
  // pointerEventsCheck: 0 is used to bypass Radix's temporary pointer-event locks during animations
  await userEvent.click(option, { pointerEventsCheck: 0 });

  // 5. Verify the dropdown closed (optional but ensures stability)
  await waitFor(() => {
    const listbox = screen.queryByRole('listbox');
    if (listbox) throw new Error('Listbox still visible');
  });
}
