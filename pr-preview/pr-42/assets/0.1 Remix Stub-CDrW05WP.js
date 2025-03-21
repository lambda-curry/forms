import{j as n}from"./jsx-runtime-CQsLhzk5.js";import{useMDXComponents as r}from"./index-C2WH5l5l.js";import"./index-Wp2u197Z.js";function o(t){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{id:"remix-stub-decorator-for-storybook",children:"Remix Stub Decorator for Storybook"}),`
`,n.jsx(e.p,{children:"The Remix Stub Decorator provides a mock Remix environment for testing and previewing components in Storybook that depend on Remix's routing and data loading features."}),`
`,n.jsx(e.h2,{id:"basic-usage",children:"Basic Usage"}),`
`,n.jsx(e.p,{children:"The simplest way to use the decorator is to wrap your story with the default configuration:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`import { withRemixStubDecorator } from './remix-stub';

export default {
  title: 'Components/MyComponent',
  component: MyComponent,
  decorators: [withRemixStubDecorator()]
};

export const Default = {
  render: () => <MyComponent />
};
`})}),`
`,n.jsx(e.h2,{id:"root-configuration",children:"Root Configuration"}),`
`,n.jsx(e.p,{children:"The decorator supports root-level configuration for providers, shared data, and actions:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`export const WithRootConfig = {
  decorators: [
    withRemixStubDecorator({
      root: {
        // Root layout with providers
        Component: ({ children }) => (
          <ThemeProvider>
            <Layout>{children}</Layout>
          </ThemeProvider>
        ),
        // Root-level action handler
        action: async ({ request }) => {
          // Handle form submissions
          return { success: true };
        },
        // Root-level loader
        loader: () => ({
          user: { name: 'John Doe' }
        }),
        // Root-level meta tags
        meta: () => [{
          title: 'My App'
        }]
      }
    })
  ]
};
`})}),`
`,n.jsx(e.h2,{id:"route-configuration",children:"Route Configuration"}),`
`,n.jsx(e.p,{children:"Configure additional routes alongside root configuration:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`export const WithRoutes = {
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ({ children }) => (
          <AppShell>{children}</AppShell>
        )
      },
      routes: [
        {
          path: '/form',
          action: async ({ request }) => {
            return { success: true };
          },
          Component: FormComponent
        }
      ]
    })
  ]
};
`})}),`
`,n.jsx(e.h2,{id:"typescript-interfaces",children:"TypeScript Interfaces"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface RemixStubOptions {
  root?: {
    Component?: ComponentType<any>;
    loader?: LoaderFunction;
    action?: ActionFunction;
    meta?: MetaFunction;
    links?: LinksFunction;
  };
  routes?: StubRouteObject[];
}

interface StubRouteObject {
  path?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  Component?: ComponentType<any>;
  children?: StubRouteObject[];
  meta?: MetaFunction;
  links?: LinksFunction;
}
`})}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Root Configuration"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use root for global providers and layouts"}),`
`,n.jsx(e.li,{children:"Handle common actions at the root level"}),`
`,n.jsx(e.li,{children:"Share global data through root loader"}),`
`,n.jsx(e.li,{children:"Set default meta and link tags"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Route Organization"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Define specific routes for form submissions"}),`
`,n.jsx(e.li,{children:"Keep route structure similar to production"}),`
`,n.jsx(e.li,{children:"Provide default actions for routes that need them"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Component Structure"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Place shared UI elements in root Component"}),`
`,n.jsx(e.li,{children:"Use routes for page-specific components"}),`
`,n.jsx(e.li,{children:"Handle form submissions in route actions"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Form Handling"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Set appropriate action paths in forms"}),`
`,n.jsx(e.li,{children:"Handle validation in route actions"}),`
`,n.jsx(e.li,{children:"Return proper response structures"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{id:"common-patterns",children:"Common Patterns"}),`
`,n.jsx(e.h3,{id:"1-form-submission-route",children:"1. Form Submission Route"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`export const FormExample = {
  decorators: [
    withRemixStubDecorator({
      root: {
        Component: ({ children }) => (
          <div className="p-4">{children}</div>
        )
      },
      routes: [
        {
          path: '/submit',
          action: async ({ request }) => {
            const formData = await request.formData();
            return { success: true, data: Object.fromEntries(formData) };
          }
        }
      ]
    })
  ]
};
`})}),`
`,n.jsx(e.h3,{id:"2-protected-routes",children:"2. Protected Routes"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`export const ProtectedExample = {
  decorators: [
    withRemixStubDecorator({
      root: {
        loader: () => {
          return { user: { isAuthenticated: true } };
        },
        Component: ({ children }) => (
          <AuthProvider>{children}</AuthProvider>
        )
      },
      routes: [
        {
          path: '/dashboard',
          loader: () => {
            return { dashboardData: [] };
          },
          Component: Dashboard
        }
      ]
    })
  ]
};
`})}),`
`,n.jsx(e.h2,{id:"testing-tips",children:"Testing Tips"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Form Testing"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Test form submissions with proper action paths"}),`
`,n.jsx(e.li,{children:"Verify error handling and validation"}),`
`,n.jsx(e.li,{children:"Check success messages and redirects"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Route Testing"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Test route transitions"}),`
`,n.jsx(e.li,{children:"Verify loader data is available"}),`
`,n.jsx(e.li,{children:"Check meta tag updates"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Component Integration"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Test component interactions with Remix hooks"}),`
`,n.jsx(e.li,{children:"Verify form state management"}),`
`,n.jsx(e.li,{children:"Check data loading states"}),`
`]}),`
`]}),`
`]})]})}function a(t={}){const{wrapper:e}={...r(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(o,{...t})}):o(t)}export{a as default};
