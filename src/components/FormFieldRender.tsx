import { z, ZodTypeAny } from "zod";
import { CustomField } from "./FormComponent";
import { FieldValues, FormState } from "react-hook-form";

interface FormFieldRenderProps {
    field: CustomField;
    renderField: (field: CustomField) => JSX.Element;
    formState: FormState<FieldValues>;
    watchedValues: Record<string, string | number | boolean | string[] | number[] | ZodTypeAny>;
    tableLayout: 'inline' | 'block';
}

const FormFieldRender: React.FC<FormFieldRenderProps> = ({
    field,
    renderField,
    formState,
    watchedValues,
    tableLayout = 'block'
}) => {
    if (
        field.dependencies &&
        !field.dependencies.every((dep) => {
            const depValue = dep.value;
            const watchedValue = watchedValues[dep.field];

            if (depValue instanceof z.ZodType) {
                return depValue.safeParse(watchedValue).success;
            }

            return watchedValue === depValue;
        })
    ) {
        return null;
    }

    return (
        <div key={field.name} className="flex flex-col gap-1">
            {tableLayout === 'inline' ? (
                <div key={field.name} className="flex flex-col gap-1">
                    <div className="grid grid-cols-3">
                        <label htmlFor={field.name} className="text-black text-sm font-medium">
                            {field.label}
                            {field.validation?.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>
                        <div className="col-span-2">
                            {renderField(field)}
                            {formState.errors[field.name] && (
                                <p className="text-red-500 text-xs">
                                    {formState.errors[field.name]?.message?.toString() ?? "This field is required"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <label htmlFor={field.name} className="text-sm">
                        {field.label}
                        {field.validation?.required && (
                            <span className="text-red-500">*</span>
                        )}
                    </label>
                    {renderField(field)}
                    {formState.errors[field.name] && (
                        <p className="text-red-500 text-xs">
                            {formState.errors[field.name]?.message?.toString() ?? "This field is required"}
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default FormFieldRender;