import React from 'react';

// Mock types from @remix-run/node
export type ActionFunction = (args: any) => Promise<any>;
export type ActionFunctionArgs = any;
export type LoaderFunction = (args: any) => Promise<any>;
export type LinksFunction = () => Array<{ rel: string; href: string }>;
export type MetaFunction = () => Record<string, string>;

// Mock components from @remix-run/react
export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({ children, ...props }) => (
  <form {...props}>{children}</form>
);

export const useFetcher = () => {
  const [data, setData] = React.useState<any>(null);
  const [state, setState] = React.useState<'idle' | 'submitting' | 'loading'>('idle');

  const submit = React.useCallback((formData: FormData | HTMLFormElement | Record<string, any>) => {
    setState('submitting');
    // Simulate async submission
    setTimeout(() => {
      setData(formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData);
      setState('idle');
    }, 500);
  }, []);

  return {
    data,
    state,
    submit,
    Form: (props: React.FormHTMLAttributes<HTMLFormElement>) => <Form {...props} />,
  };
};

// Mock createRemixStub from @remix-run/testing
export const createRemixStub = (options: any) => {
  const { Component } = options;
  return {
    Component: () => <Component />,
  };
};