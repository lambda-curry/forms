import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@lambdacurry/forms/remix-hook-form';
import type { ActionFunctionArgs } from 'react-router';
// Example of using the new middleware feature in remix-hook-form v7.0.0
import { Form } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { getValidatedFormData } from 'remix-hook-form/middleware';
import * as zod from 'zod';

// Define schema and types
const schema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  email: zod.string().email('Invalid email format').min(1, 'Email is required'),
});

type FormData = zod.infer<typeof schema>;
const resolver = zodResolver(schema);

// Action function using the new middleware
export const action = async ({ context }: ActionFunctionArgs) => {
  // Use the middleware to extract and validate form data
  const { errors, data, receivedValues } = await getValidatedFormData<FormData>(context, resolver);

  if (errors) {
    return { errors, defaultValues: receivedValues };
  }

  // Process the validated data
  console.log('Processing data:', data);

  return { success: true, data };
};

// Component
export default function MiddlewareExample() {
  const methods = useRemixForm<FormData>({
    mode: 'onSubmit',
    resolver,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Remix Hook Form v7 Middleware Example</h1>

      <RemixFormProvider {...methods}>
        <Form method="POST" onSubmit={methods.handleSubmit}>
          <div className="space-y-4">
            <TextField name="name" label="Name" />

            <TextField name="email" type="email" label="Email" />

            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
          </div>
        </Form>
      </RemixFormProvider>
    </div>
  );
}
