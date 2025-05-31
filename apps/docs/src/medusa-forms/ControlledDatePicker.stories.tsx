import { ControlledDatePicker } from '@lambdacurry/medusa-forms/controlled/ControlledDatePicker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';

const meta = {
  title: 'Medusa Forms/Controlled Date Picker',
  component: ControlledDatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ControlledDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Basic Date Selection
const BasicDateSelectionComponent = () => {
  const form = useForm({
    defaultValues: {
      birthDate: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px]">
        <ControlledDatePicker 
          name="birthDate" 
          label="Birth Date" 
          placeholder="Select your birth date"
        />
      </div>
    </FormProvider>
  );
};

export const BasicDateSelection: Story = {
  render: () => <BasicDateSelectionComponent />,
};

// 2. Required Field Validation
const RequiredFieldValidationComponent = () => {
  const form = useForm({
    defaultValues: {
      requiredDate: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-4">
        <ControlledDatePicker 
          name="requiredDate" 
          label="Required Date" 
          placeholder="This field is required"
          required
          rules={{
            required: 'Date is required'
          }}
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
        {form.formState.errors.requiredDate && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.requiredDate.message}
          </p>
        )}
      </form>
    </FormProvider>
  );
};

export const RequiredFieldValidation: Story = {
  render: () => <RequiredFieldValidationComponent />,
};

// 3. Date Format Variations
const DateFormatVariationsComponent = () => {
  const form = useForm({
    defaultValues: {
      usFormat: '',
      euroFormat: '',
      isoFormat: '',
    },
  });

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledDatePicker 
          name="usFormat" 
          label="US Format (MM/DD/YYYY)" 
          placeholder="MM/DD/YYYY"
          dateFormat="MM/dd/yyyy"
        />
        <ControlledDatePicker 
          name="euroFormat" 
          label="European Format (DD/MM/YYYY)" 
          placeholder="DD/MM/YYYY"
          dateFormat="dd/MM/yyyy"
        />
        <ControlledDatePicker 
          name="isoFormat" 
          label="ISO Format (YYYY-MM-DD)" 
          placeholder="YYYY-MM-DD"
          dateFormat="yyyy-MM-dd"
        />
      </div>
    </FormProvider>
  );
};

export const DateFormatVariations: Story = {
  render: () => <DateFormatVariationsComponent />,
};

// 4. Disabled Dates
const DisabledDatesComponent = () => {
  const form = useForm({
    defaultValues: {
      noPastDates: '',
      noFutureDates: '',
      specificDisabled: '',
    },
  });

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledDatePicker 
          name="noPastDates" 
          label="No Past Dates" 
          placeholder="Future dates only"
          minDate={today}
        />
        <ControlledDatePicker 
          name="noFutureDates" 
          label="No Future Dates" 
          placeholder="Past dates only"
          maxDate={today}
        />
        <ControlledDatePicker 
          name="specificDisabled" 
          label="Specific Date Range Disabled" 
          placeholder="Excludes last/next week"
          excludeDateIntervals={[
            { start: oneWeekAgo, end: oneWeekFromNow }
          ]}
        />
      </div>
    </FormProvider>
  );
};

export const DisabledDates: Story = {
  render: () => <DisabledDatesComponent />,
};

// 5. Min/Max Date Constraints
const MinMaxDateConstraintsComponent = () => {
  const form = useForm({
    defaultValues: {
      constrainedDate: '',
      businessDays: '',
      ageRestricted: '',
    },
  });

  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 1); // Tomorrow
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30); // 30 days from now

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(today.getFullYear() - 100);

  return (
    <FormProvider {...form}>
      <div className="w-[400px] space-y-4">
        <ControlledDatePicker 
          name="constrainedDate" 
          label="Date Range (Tomorrow to 30 days)" 
          placeholder="Select within range"
          minDate={minDate}
          maxDate={maxDate}
          rules={{
            validate: (value) => {
              if (!value) return true;
              const selectedDate = new Date(value);
              if (selectedDate < minDate) return 'Date must be tomorrow or later';
              if (selectedDate > maxDate) return 'Date must be within 30 days';
              return true;
            }
          }}
        />
        <ControlledDatePicker 
          name="businessDays" 
          label="Business Days Only" 
          placeholder="Weekdays only"
          filterDate={(date) => {
            const day = date.getDay();
            return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
          }}
        />
        <ControlledDatePicker 
          name="ageRestricted" 
          label="Age Verification (18+)" 
          placeholder="Must be 18 or older"
          maxDate={eighteenYearsAgo}
          minDate={hundredYearsAgo}
          rules={{
            validate: (value) => {
              if (!value) return true;
              const selectedDate = new Date(value);
              const age = today.getFullYear() - selectedDate.getFullYear();
              const monthDiff = today.getMonth() - selectedDate.getMonth();
              const dayDiff = today.getDate() - selectedDate.getDate();
              
              let calculatedAge = age;
              if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                calculatedAge--;
              }
              
              return calculatedAge >= 18 || 'Must be 18 years or older';
            }
          }}
        />
        {form.formState.errors.constrainedDate && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.constrainedDate.message}
          </p>
        )}
        {form.formState.errors.ageRestricted && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.ageRestricted.message}
          </p>
        )}
      </div>
    </FormProvider>
  );
};

export const MinMaxDateConstraints: Story = {
  render: () => <MinMaxDateConstraintsComponent />,
};

