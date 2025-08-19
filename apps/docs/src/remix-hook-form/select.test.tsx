import { expect, userEvent, within } from '@storybook/test';
import { StoryContext } from '@storybook/react';

// Helper function to wait for a short time
const waitForSelection = async (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

// Test selecting a US state
export const testUSStateSelection = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  
  // Find and click the US state dropdown
  const stateDropdown = canvas.getByLabelText('US State');
  await userEvent.click(stateDropdown);
  
  // Select a state (e.g., California)
  const californiaOption = await within(document.body).findByRole('option', { name: 'California' });
  await userEvent.click(californiaOption);
  
  // Wait for the selection to be applied
  await waitForSelection();
  
  // Verify the selection
  expect(stateDropdown).toHaveTextContent('California');
};

// Test selecting a Canadian province
export const testCanadaProvinceSelection = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  
  // Find and click the Canada province dropdown
  const provinceDropdown = canvas.getByLabelText('Canadian Province');
  await userEvent.click(provinceDropdown);
  
  // Select a province (e.g., Ontario)
  const ontarioOption = await within(document.body).findByRole('option', { name: 'Ontario' });
  await userEvent.click(ontarioOption);
  
  // Wait for the selection to be applied
  await waitForSelection();
  
  // Verify the selection
  expect(provinceDropdown).toHaveTextContent('Ontario');
};

// Test form submission
export const testFormSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  
  // Select a state
  const stateDropdown = canvas.getByLabelText('US State');
  await userEvent.click(stateDropdown);
  const californiaOption = await within(document.body).findByRole('option', { name: 'California' });
  await userEvent.click(californiaOption);
  await waitForSelection();
  
  // Select a province
  const provinceDropdown = canvas.getByLabelText('Canadian Province');
  await userEvent.click(provinceDropdown);
  const ontarioOption = await within(document.body).findByRole('option', { name: 'Ontario' });
  await userEvent.click(ontarioOption);
  await waitForSelection();
  
  // Select a custom region
  const regionDropdown = canvas.getByLabelText('Custom Region');
  await userEvent.click(regionDropdown);
  const customOption = await within(document.body).findByRole('option', { name: 'New York' });
  await userEvent.click(customOption);
  await waitForSelection();
  
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

