import { expect } from '@storybook/test';
import { userEvent, within } from '@storybook/testing-library';
import { StoryContext } from '@storybook/react';

// Test selecting a US state
export const testUSStateSelection = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  
  // Find and click the US state dropdown
  const stateDropdown = canvas.getByLabelText('US State');
  await userEvent.click(stateDropdown);
  
  // Select a state (e.g., California)
  const californiaOption = await canvas.findByText('California');
  await userEvent.click(californiaOption);
  
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
  const ontarioOption = await canvas.findByText('Ontario');
  await userEvent.click(ontarioOption);
  
  // Verify the selection
  expect(provinceDropdown).toHaveTextContent('Ontario');
};

// Test form submission
export const testFormSubmission = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  
  // Select a state
  const stateDropdown = canvas.getByLabelText('US State');
  await userEvent.click(stateDropdown);
  const californiaOption = await canvas.findByText('California');
  await userEvent.click(californiaOption);
  
  // Select a province
  const provinceDropdown = canvas.getByLabelText('Canadian Province');
  await userEvent.click(provinceDropdown);
  const ontarioOption = await canvas.findByText('Ontario');
  await userEvent.click(ontarioOption);
  
  // Select a custom region
  const regionDropdown = canvas.getByLabelText('Custom Region');
  await userEvent.click(regionDropdown);
  const customOption = await canvas.findByText('New York');
  await userEvent.click(customOption);
  
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

