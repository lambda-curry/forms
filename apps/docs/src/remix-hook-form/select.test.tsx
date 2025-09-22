import type { StoryContext } from '@storybook/react';
import { expect } from '@storybook/test';
import { userEvent, within } from '@storybook/testing-library';

// Test selecting a US state
export const testUSStateSelection = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Wait for and click the US state trigger (combobox)
  const stateTrigger = await canvas.findByLabelText('US State');
  await userEvent.click(stateTrigger);

  // Dropdown content is portaled; query from document.body
  const listbox = await within(document.body).findByRole('listbox');
  const californiaOption = within(listbox).getByRole('option', { name: 'California' });
  await userEvent.click(californiaOption);

  // Verify the trigger text updates
  await expect(canvas.findByRole('combobox', { name: 'US State' })).resolves.toHaveTextContent('California');
};

// Test selecting a Canadian province
export const testCanadaProvinceSelection = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Wait for and click the province trigger
  const provinceTrigger = await canvas.findByLabelText('Canadian Province');
  await userEvent.click(provinceTrigger);

  // Query in the portaled content
  const listbox = await within(document.body).findByRole('listbox');
  const ontarioOption = within(listbox).getByRole('option', { name: 'Ontario' });
  await userEvent.click(ontarioOption);

  // Verify the trigger text updates
  await expect(canvas.findByRole('combobox', { name: 'Canadian Province' })).resolves.toHaveTextContent('Ontario');
};

// Test form submission
export const testFormSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Select a state
  const stateTrigger = await canvas.findByLabelText('US State');
  await userEvent.click(stateTrigger);
  {
    const listbox = await within(document.body).findByRole('listbox');
    const californiaOption = within(listbox).getByRole('option', { name: 'California' });
    await userEvent.click(californiaOption);
  }

  // Select a province
  const provinceTrigger = await canvas.findByLabelText('Canadian Province');
  await userEvent.click(provinceTrigger);
  {
    const listbox = await within(document.body).findByRole('listbox');
    const ontarioOption = within(listbox).getByRole('option', { name: 'Ontario' });
    await userEvent.click(ontarioOption);
  }

  // Select a custom region (use an option that exists in the story's options)
  const regionTrigger = await canvas.findByLabelText('Custom Region');
  await userEvent.click(regionTrigger);
  {
    const listbox = await within(document.body).findByRole('listbox');
    const customOption = within(listbox).getByRole('option', { name: 'California' });
    await userEvent.click(customOption);
  }

  // Submit the form
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  // Verify the submission (mock response would be shown)
  await expect(canvas.findByText('Selected regions:')).resolves.toBeInTheDocument();
};

// Test validation errors
export const testValidationErrors = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Submit the form without selecting anything
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);

  // Verify error messages
  await expect(canvas.findByText('Please select a state')).resolves.toBeInTheDocument();
  await expect(canvas.findByText('Please select a province')).resolves.toBeInTheDocument();
  await expect(canvas.findByText('Please select a region')).resolves.toBeInTheDocument();
};
