import{j as e}from"./jsx-runtime-CQsLhzk5.js";import{useMDXComponents as o}from"./index-C2WH5l5l.js";import"./index-Wp2u197Z.js";function s(t){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...o(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{id:"writing-tests-with-storybook-test-runner",children:"Writing Tests with Storybook Test Runner"}),`
`,e.jsxs(n.p,{children:["Storybook Test Runner is a powerful tool that allows you to write and execute tests directly within your Storybook stories. This approach provides a seamless integration between your component documentation and testing, ensuring that your components behave as expected in various scenarios. Below, we'll explore how to write tests using the Storybook Test Runner, using the ",e.jsx(n.code,{children:"TextField"})," component as a guide."]}),`
`,e.jsx(n.h2,{id:"writing-tests",children:"Writing Tests"}),`
`,e.jsx(n.h3,{id:"define-your-component-and-story",children:"Define Your Component and Story"}),`
`,e.jsxs(n.p,{children:["Create a Storybook story for your component. For example, the ",e.jsx(n.code,{children:"TextField"})," component:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  component: TextField,
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Tests: Story = {};
`})}),`
`,e.jsx(n.h3,{id:"write-test-scenarios",children:"Write Test Scenarios"}),`
`,e.jsxs(n.p,{children:["Define test scenarios as functions that interact with the component using ",e.jsx(n.code,{children:"@storybook/test"})," and ",e.jsx(n.code,{children:"@testing-library/dom"}),". These functions simulate user interactions and assert expected outcomes."]}),`
`,e.jsx(n.p,{children:"Example:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import type { StoryContext } from '@storybook/react';

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Username');
  await userEvent.type(input, 'validuser');
  await userEvent.tab();
  expect(input).toHaveValue('validuser');
  expect(canvas.queryByText('Username is required')).not.toBeInTheDocument();
};

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Username');
  await userEvent.type(input, 'a');
  await userEvent.tab();
  expect(canvas.getByText('Username must be at least 3 characters')).toBeInTheDocument();
};
`})}),`
`,e.jsx(n.h3,{id:"integrate-tests-into-stories",children:"Integrate Tests into Stories"}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.code,{children:"play"})," function in your Storybook story to execute the test scenarios. This function runs after the story renders, allowing you to interact with the component and verify its behavior."]}),`
`,e.jsx(n.p,{children:"Example:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`export const Tests: Story = {
  play: async (storyContext) => {
    await testValidSubmission(storyContext);
    await testInvalidSubmission(storyContext);
  },
};
`})}),`
`,e.jsx(n.h2,{id:"testing-philosophy",children:"Testing Philosophy"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Component Behavior"}),": Focus on testing the behavior of your component in isolation. Ensure that it handles user interactions, displays the correct UI, and manages state as expected."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"User-Centric Scenarios"}),": Write tests that mimic real user interactions. This includes filling out forms, clicking buttons, and verifying that the UI responds correctly."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Edge Cases and Validation"}),": Test edge cases and validation logic to ensure your component handles invalid input gracefully and provides meaningful feedback to users."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Integration with Backend"}),": If your component interacts with a backend (e.g., form submission), simulate these interactions and verify that the component handles responses correctly."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Maintainability"}),": Write clear and concise tests that are easy to understand and maintain. Use descriptive function names and comments to explain the purpose of each test."]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"By following these guidelines, you can leverage Storybook Test Runner to create comprehensive and reliable tests for your components, ensuring they meet both functional and user experience requirements."})]})}function c(t={}){const{wrapper:n}={...o(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{c as default};
