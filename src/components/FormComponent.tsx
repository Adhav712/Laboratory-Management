import React from "react";
import { UseFormReturn, FieldValues, SubmitHandler, Controller } from "react-hook-form";
import FormFieldRender from "./FormFieldRender";
import { z } from "zod";
import { Button, Input, Select } from "antd";

type FieldType =
    | "input"
    | "email"
    | "number"
    | "password"
    | "checkbox"
    | "select"
    | "textarea"
    | "radio"
    | "date"
    | "upload"
    | "checkboxGroup"
    | "custom"
    | "multiSelect"
    | "text";

export interface CustomField {
    name: string;
    label: string;
    type: FieldType;
    isInputProps?: {
        placeholder?: string;
        defaultValue?: string | number | boolean | string | string[] | number | number[];
        multiple?: boolean;
        loading?: boolean;
    };
    options?: string[];
    validation?: {
        required?: boolean;
        pattern?: z.ZodTypeAny;
    };
    className?: string;
    customRender?: (
        field: CustomField,
        formMethods: UseFormReturn<FieldValues>
    ) => React.ReactNode;
    widthSpan?: number;
    dependencies?: {
        field: string;
        value: string | number | boolean | string | string[] | number | number[] | z.ZodTypeAny;
    }[];
}

interface ReusableFormProps {
    fields: CustomField[] | (CustomField | null)[];
    onSubmit: SubmitHandler<FieldValues>;
    buttonComponent?: (handleSubmit: () => void) => React.ReactNode;
    additionalButton?: React.ReactNode;
    isUpdate?: boolean;
    formMethods: UseFormReturn<FieldValues>;
    gridLayout?: '3x3' | '2x2' | '1x1';
    tableLayout?: 'inline' | 'block';
}

const ReusableForm: React.FC<ReusableFormProps> = ({
    fields,
    onSubmit,
    buttonComponent,
    additionalButton,
    isUpdate,
    formMethods,
    tableLayout,
    gridLayout = '3x3'
}) => {
    const { handleSubmit, formState, control } = formMethods;
    const watchedValues: Record<string, string | number | boolean | string | string[] | number | number[] | z.ZodTypeAny> = formMethods.watch();
    const renderField = (field: CustomField): JSX.Element => {

        switch (field.type) {
            case "input":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        // rules={field.validation}
                        defaultValue={field.isInputProps?.defaultValue || ""}
                        render={({ field: controllerField }) => (
                            <Input
                                {...controllerField}
                                type="text"
                                placeholder={field.isInputProps?.placeholder}
                                className={(field.className)}
                                role="textbox"

                            />
                        )}
                    />
                );
            case "select":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        // rules={field.validation}
                        defaultValue={field.isInputProps?.defaultValue || undefined}
                        render={({ field: controllerField }) => (
                            <Select
                                {...controllerField}
                                options={
                                    field.options?.map((opt) => ({
                                        label: opt,
                                        value: opt,
                                    })) || []
                                }
                                placeholder={
                                    field.isInputProps?.placeholder || field.label
                                }
                                className='w-full'
                                mode={
                                    field.isInputProps?.multiple
                                        ? 'multiple'
                                        : undefined
                                }
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label?.toLowerCase() ?? '').indexOf(input.toLowerCase()) >= 0
                                }
                            />
                        )}
                    />
                );
            case "textarea":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        // rules={field.validation}
                        defaultValue={field.isInputProps?.defaultValue || ""}
                        render={({ field: controllerField }) => (
                            // <TextArea
                            //     {...controllerField}
                            //     placeholder={field.isInputProps?.placeholder}
                            //     className={cn(field.className)}
                            // />
                            <Input
                                {...controllerField}
                                type="textarea"
                                placeholder={field.isInputProps?.placeholder}
                                className={(field.className, 'h-32 w-full')}
                                role="textbox"
                            />
                        )}
                    />
                );
            case "custom":
                return field.customRender ? field.customRender(field, formMethods) as JSX.Element : <></>;
            default:
                return <></>;
        }
    };

    return (
        <>
            <form
                className={`bg-white grid gap-4  rounded-md m-4 ${gridLayout === "3x3" ? "lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1" :
                    gridLayout === "2x2" ? "lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1" :
                        gridLayout === "1x1" ? "lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1" : ""
                    }`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <>
                    {fields.map((field) => (
                        field === null ? (
                            <div key={Math.random()} />
                        ) : (
                            <FormFieldRender
                                field={field}
                                renderField={renderField}
                                formState={formState}
                                watchedValues={watchedValues}
                                tableLayout={tableLayout || 'block'}
                            />
                        )
                    ))}
                </>

            </form>
            {
                buttonComponent!(handleSubmit(onSubmit))
                || (
                    <div className="flex gap-4 justify-center">
                        <Button
                            htmlType="submit"
                            className="bg-green-700 text-white px-2 py-2 rounded-md w-24 flex items-center justify-center gap-2"
                        >
                            {isUpdate ? "Update" : "Add"}
                        </Button>
                    </div>
                )}
            {additionalButton}
        </>
    );
};

export default ReusableForm;
