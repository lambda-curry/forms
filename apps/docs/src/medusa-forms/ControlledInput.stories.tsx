import { ControlledInput } from '@lambdacurry/medusa-forms/controlled/ControlledInput';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';

const meta = {
  title: 'Medusa Forms/Controlled Input',
  component: ControlledInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledInputWithHookForm = () => {
  const form = useForm({
    defaultValues: {
      username: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledInput name="username" label="Username" placeholder="Enter your username" />
      </div>
    </FormProvider>
  );
};

export const WithReactHookForm: Story = {
  args: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
  },
  render: () => <ControlledInputWithHookForm />,
};
