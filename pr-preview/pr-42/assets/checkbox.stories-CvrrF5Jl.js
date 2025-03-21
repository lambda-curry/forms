import{j as o}from"./jsx-runtime-CQsLhzk5.js";import{z as r,w as p,u as x,a as f,R as g,B as k,g as y,t as h}from"./remix-stub-UXp-yz1T.js";import{C as m}from"./checkbox-BRN3sR2B.js";import{e as a,u as c}from"./index-BvTlRpDL.js";import"./index-Wp2u197Z.js";import"./index-BB6wrN1E.js";import"./index-BFTZjNjp.js";import"./index-C5ITVP_u.js";import"./index-wUI45oDg.js";import"./check-DmlahKRE.js";import"./createLucideIcon-CkelgiAd.js";import"./form-C1Hedwuh.js";const b=r.object({terms:r.boolean().refine(e=>e===!0,"You must accept the terms and conditions"),marketing:r.boolean().optional(),required:r.boolean().refine(e=>e===!0,"This field is required")}),v=()=>{var s;const e=x(),t=f({resolver:h(b),defaultValues:{terms:!1,marketing:!1,required:!1},fetcher:e,submitConfig:{action:"/",method:"post"}});return o.jsx(g,{...t,children:o.jsxs(e.Form,{onSubmit:t.handleSubmit,children:[o.jsxs("div",{className:"grid gap-4",children:[o.jsx(m,{className:"rounded-md border p-4",name:"terms",label:"Accept terms and conditions"}),o.jsx(m,{className:"rounded-md border p-4",name:"marketing",label:"Receive marketing emails",description:"We will send you hourly updates about our products"}),o.jsx(m,{className:"rounded-md border p-4",name:"required",label:"This is a required checkbox"})]}),o.jsx(k,{type:"submit",className:"mt-4",children:"Submit"}),((s=e.data)==null?void 0:s.message)&&o.jsx("p",{className:"mt-2 text-green-600",children:e.data.message})]})})},C=async e=>{const{errors:t}=await y(e,h(b));return t?{errors:t}:{message:"Form submitted successfully"}},L={title:"RemixHookForm/Checkbox",component:m,parameters:{layout:"centered"},tags:["autodocs"],decorators:[p({root:{Component:v,action:async({request:e})=>C(e)}})]},S=({canvas:e})=>{const t=e.getByLabelText("Accept terms and conditions"),s=e.getByLabelText("Receive marketing emails"),n=e.getByLabelText("This is a required checkbox");a(t).not.toBeChecked(),a(s).not.toBeChecked(),a(n).not.toBeChecked()},B=async({canvas:e})=>{const t=e.getByRole("button",{name:"Submit"});await c.click(t),await a(await e.findByText("You must accept the terms and conditions")).toBeInTheDocument(),await a(await e.findByText("This field is required")).toBeInTheDocument()},T=async({canvas:e})=>{const t=e.getByLabelText("Accept terms and conditions"),s=e.getByLabelText("This is a required checkbox");await c.click(t),await c.click(s);const n=e.getByRole("button",{name:"Submit"});await c.click(n),await a(await e.findByText("Form submitted successfully")).toBeInTheDocument()},i={parameters:{docs:{description:{story:"The default checkbox component."},source:{code:`
    const formSchema = z.object({
    terms: z.boolean().optional().refine(val => val === true, 'You must accept the terms and conditions'),
    marketing: z.boolean().optional(),
    required: z.boolean().optional().refine(val => val === true, 'This field is required'),
  });

  const ControlledCheckboxExample = () => {
    const fetcher = useFetcher<{ message: string }>();
    const methods = useRemixForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        terms: false as true, // Note: ZOD Schema expects a true value
        marketing: false,
        required: false as true //Note: ZOD Schema expects a true value
      },
      fetcher,
    });

    return (
      <RemixFormProvider {...methods}>
        <fetcher.Form onSubmit={methods.handleSubmit} method="post" action="/">
          <div className='grid gap-4'>
            <Checkbox className='rounded-md border p-4' name="terms" label="Accept terms and conditions" />
            <Checkbox className='rounded-md border p-4' name="marketing" label="Receive marketing emails" description="We will send you hourly updates about our products" />
            <Checkbox className='rounded-md border p-4' name="required" label="This is a required checkbox" />
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
        </fetcher.Form>
      </RemixFormProvider>
    );
  };`}}},play:async e=>{S(e),await B(e),await T(e)}};var d,l,u;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'The default checkbox component.'
      },
      source: {
        code: \`
    const formSchema = z.object({
    terms: z.boolean().optional().refine(val => val === true, 'You must accept the terms and conditions'),
    marketing: z.boolean().optional(),
    required: z.boolean().optional().refine(val => val === true, 'This field is required'),
  });

  const ControlledCheckboxExample = () => {
    const fetcher = useFetcher<{ message: string }>();
    const methods = useRemixForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        terms: false as true, // Note: ZOD Schema expects a true value
        marketing: false,
        required: false as true //Note: ZOD Schema expects a true value
      },
      fetcher,
    });

    return (
      <RemixFormProvider {...methods}>
        <fetcher.Form onSubmit={methods.handleSubmit} method="post" action="/">
          <div className='grid gap-4'>
            <Checkbox className='rounded-md border p-4' name="terms" label="Accept terms and conditions" />
            <Checkbox className='rounded-md border p-4' name="marketing" label="Receive marketing emails" description="We will send you hourly updates about our products" />
            <Checkbox className='rounded-md border p-4' name="required" label="This is a required checkbox" />
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
          {fetcher.data?.message && <p className="mt-2 text-green-600">{fetcher.data.message}</p>}
        </fetcher.Form>
      </RemixFormProvider>
    );
  };\`
      }
    }
  },
  play: async storyContext => {
    testDefaultValues(storyContext);
    await testInvalidSubmission(storyContext);
    await testValidSubmission(storyContext);
  }
}`,...(u=(l=i.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};const O=["Tests"];export{i as Tests,O as __namedExportsOrder,L as default};
