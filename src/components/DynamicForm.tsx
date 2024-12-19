import { useForm, Controller, ControllerRenderProps, ControllerFieldState, Control } from 'react-hook-form';
import { Button, Input, Select } from 'antd';
import { Lab } from '../types/Lab';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
export interface FieldSchema<T> {
    name: string;
    type: 'text' | 'select' | 'customRender';
    label?: string;
    options?: string[];
    isMultiSelect?: boolean;
    dependencies?: string[];
    palceholder?: string;
    validation?: {
        required?: boolean;
        pattern?: z.ZodTypeAny;
    }
    customRender?: (
        data: T,
        field: ControllerRenderProps<Lab, keyof Lab>,
        fieldState: ControllerFieldState,
        control: Control<Lab, unknown>,
        index: number
    ) => JSX.Element;
}

interface DynamicFormProps<T> {
    initialValues?: Lab;
    onSubmit: (data: Lab) => void;
    fields: FieldSchema<T>[];
}

const DynamicForm = <T,>({ initialValues = {} as Lab, onSubmit, fields }: DynamicFormProps<T>) => {


    const SchemaObject = Object.fromEntries(
        fields
            .filter((field) => field?.name) // Ensure fields with a valid name
            .map((field) => [
                field?.name, // Use field name as key
                field?.validation?.pattern ||
                (field?.validation?.required ? z.string().min(1) : z.nullable(z.any()))
            ])
    );

    const schema = z.object(SchemaObject).required();



    const { control, handleSubmit } = useForm({
        defaultValues: initialValues,
        resolver: zodResolver(schema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className=" p-6">
            {fields.map((DynamicFields, index) => (
                <div key={DynamicFields.name} className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">{DynamicFields.label}</label>
                    <Controller
                        name={DynamicFields.name as keyof Lab}
                        control={control}
                        render={({ field, fieldState }) => {
                            const RenderField = () => {
                                switch (DynamicFields.type) {
                                    case 'text':
                                        return <Input {...field} value={String(field.value || '')} placeholder={DynamicFields?.label} />;
                                    case 'select':
                                        return (
                                            <Select
                                                {...field}
                                                options={DynamicFields.options?.map((opt: string) => ({ label: opt, value: opt }))}
                                                placeholder={DynamicFields?.label}
                                                className='w-full'
                                                mode={
                                                    DynamicFields.isMultiSelect
                                                        ? 'multiple'
                                                        : undefined
                                                }
                                                allowClear
                                                showSearch
                                                filterOption={(input, option) =>
                                                    (option?.label?.toLowerCase() ?? '').indexOf(input.toLowerCase()) >= 0
                                                }
                                            />
                                        );
                                    case 'customRender':
                                        return <>
                                            {/* 
                                                Give the Full Access to the Form Functionality
                                            */}
                                            {DynamicFields.customRender?.(
                                                initialValues as T,
                                                field,
                                                fieldState,
                                                control,
                                                index
                                            )}
                                        </>

                                    default:
                                        return <></>;
                                }
                            };

                            // Return the full JSX structure
                            return (
                                <div>
                                    <RenderField />
                                    {fieldState.error && (
                                        <p className="text-red-500 text-xs">
                                            {fieldState.error.message?.toString() ?? "This field is required"}
                                        </p>
                                    )}
                                </div>
                            );
                        }}
                    />

                </div>
            ))}
            <div className="col-span-full flex justify-end">
                <Button htmlType="submit" type="primary" className="bg-blue-500 text-white py-2 px-4 rounded-md">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default DynamicForm;