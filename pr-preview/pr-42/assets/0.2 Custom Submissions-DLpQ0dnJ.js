import{j as e}from"./jsx-runtime-CQsLhzk5.js";import{useMDXComponents as i}from"./index-C2WH5l5l.js";import"./index-Wp2u197Z.js";function r(s){const n={code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{id:"custom-form-submissions-in-remix",children:"Custom Form Submissions in Remix"}),`
`,e.jsxs(n.p,{children:["When working with forms in Remix, you might want to customize how form data is submitted beyond the default behavior. This guide explains how to use custom submission handlers, particularly focusing on the ",e.jsx(n.code,{children:"onValid"})," submit handler pattern."]}),`
`,e.jsx(n.h2,{id:"basic-usage",children:"Basic Usage"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"onValid"})," submit handler is a powerful feature that allows you to intercept and modify form data before it's submitted. Here's a basic example:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const methods = useRemixForm<FormData>({
  resolver: zodResolver(formSchema),
  submitHandlers: {
    onValid: (data) => {
      // Transform your data here
      fetcher.submit(createFormData(transformedData), {
        method: 'post',
        action: '/',
      });
    },
  },
});
`})}),`
`,e.jsx(n.h2,{id:"real-world-example",children:"Real-World Example"}),`
`,e.jsx(n.p,{children:"Let's look at a practical example where we transform checkbox data before submission:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const methods = useRemixForm<FormData>({
  resolver: zodResolver(formSchema),
  fetcher,
  submitConfig: {
    action: '/',
    method: 'post',
  },
  submitHandlers: {
    onValid: (data) => {
      // Extract selected colors from checkbox data
      const selectedColors = Object.entries(data.colors)
        .filter(([_, selected]) => selected)
        .map(([color]) => color);

      // Remove original color data from submission
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => !(key in AVAILABLE_COLORS))
      );

      // Submit transformed data
      fetcher.submit(
        createFormData({ ...filteredData, selectedColors }), 
        {
          method: 'post',
          action: '/',
        }
      );
    },
  },
});
`})}),`
`,e.jsx(n.h2,{id:"key-benefits",children:"Key Benefits"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Data Transformation"}),": Transform your form data before submission"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Validation Control"}),": Only runs after form validation passes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Flexibility"}),": Full control over the submission process"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Maintains TypeScript type safety throughout"]}),`
`]}),`
`,e.jsx(n.h2,{id:"best-practices",children:"Best Practices"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:["Always use ",e.jsx(n.code,{children:"createFormData"})," to properly format your data for submission"]}),`
`,e.jsx(n.li,{children:"Keep transformations pure and predictable"}),`
`,e.jsx(n.li,{children:"Handle both success and error cases"}),`
`,e.jsx(n.li,{children:"Use TypeScript types to ensure type safety"}),`
`,e.jsx(n.li,{children:"Consider using a fetcher for better loading states and optimistic UI"}),`
`]}),`
`,e.jsx(n.h2,{id:"common-use-cases",children:"Common Use Cases"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Transforming checkbox groups into arrays"}),`
`,e.jsx(n.li,{children:"Formatting dates before submission"}),`
`,e.jsx(n.li,{children:"Removing unnecessary fields"}),`
`,e.jsx(n.li,{children:"Combining multiple form fields"}),`
`,e.jsx(n.li,{children:"Converting between data formats"}),`
`]}),`
`,e.jsx(n.h2,{id:"tips",children:"Tips"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Use the ",e.jsx(n.code,{children:"fetcher"})," from Remix for better control over loading states"]}),`
`,e.jsx(n.li,{children:"Leverage TypeScript for type safety"}),`
`,e.jsx(n.li,{children:"Keep transformations simple and focused"}),`
`,e.jsx(n.li,{children:"Consider using Zod for validation alongside custom submissions"}),`
`]})]})}function l(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(r,{...s})}):r(s)}export{l as default};
