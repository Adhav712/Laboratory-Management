import React, { useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { initialTestMethods } from '../../store/initialData';
import { addTestMethod, emptyTestMethod, updateTestMethod } from '../../store/labSlice';
import { Lab, TestMethod } from '../../types/Lab';
import ReusableForm from '../FormComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';


interface TestMethodModalProps {
    editData: Lab | null;
    setIsTestMethodModalOpen: (state: boolean) => void;
    currentTestMethod: TestMethod | null;
    isEdit: boolean;
    setTempTestMethodData: (state: TestMethod[]) => void;
    tempTestMethodData: TestMethod[];
    isTestMethodNew: boolean;
}

const TestMethodModal: React.FC<TestMethodModalProps> = ({
    editData,
    setIsTestMethodModalOpen,
    currentTestMethod,
    isEdit,
    setTempTestMethodData,
    tempTestMethodData,
    isTestMethodNew
}) => {
    const dispatch = useDispatch();
    const TestMethodSchemaObject = Object.fromEntries(
        initialTestMethods
            .filter((field) => field?.name) // Ensure fields with a valid name
            .map((field) => [
                field?.name, // Use field name as key
                field?.validation?.pattern ||
                (field?.validation?.required ? z.string().min(1) : z.nullable(z.any()))
            ])
    );

    const schema = z.object(TestMethodSchemaObject).required();
    const TestMethodFormMethods = useForm({
        resolver: zodResolver(schema),
        defaultValues: currentTestMethod ?? emptyTestMethod
    });


    const handleSubmit = useCallback((data: TestMethod) => {
        if (isEdit) {
            console.log("Is Edit true");
            if (!isTestMethodNew) {
                console.log("Not New Test Method", {
                    ...data,
                    labId: editData?.id
                });
                dispatch(updateTestMethod(data));
            } else {
                console.log("New TestMethod", {
                    ...data,
                    labId: editData?.id
                });

                dispatch(addTestMethod({
                    ...data, labId: editData?.id,
                    id: tempTestMethodData.length + 1
                }));
            }
        } else {
            console.log("Is Edit false",);
            if (isTestMethodNew) {
                console.log("New TestMethod", {
                    ...data,
                    id: tempTestMethodData.length + 1
                });
                setTempTestMethodData(
                    [...tempTestMethodData, { ...data, id: tempTestMethodData.length + 1 }]
                );
            } else {
                console.log("Not New Test Method", data);
                setTempTestMethodData(
                    tempTestMethodData.map((item) => {
                        if (item.id === currentTestMethod?.id) {
                            return { ...data, id: currentTestMethod?.id };
                        }
                        return item;
                    })
                );
            }
        }
        setIsTestMethodModalOpen(false);
    }, [isEdit, setIsTestMethodModalOpen, isTestMethodNew, editData?.id, dispatch, tempTestMethodData, setTempTestMethodData, currentTestMethod?.id]);

    useEffect(() => {

        if (isEdit) {
            if (currentTestMethod) {
                TestMethodFormMethods.reset(currentTestMethod);
            } else {
                TestMethodFormMethods.reset(emptyTestMethod);
            }
        } else {
            if (currentTestMethod) {
                TestMethodFormMethods.reset(currentTestMethod);
            } else {
                TestMethodFormMethods.reset(emptyTestMethod);
            }
        }

        // if (currentTestMethod && isEdit) {
        //     TestMethodFormMethods.reset(currentTestMethod);
        // } else {
        //     TestMethodFormMethods.reset(emptyTestMethod);
        // }
    }, [TestMethodFormMethods, currentTestMethod, editData, isEdit]);
    return (
        <ReusableForm
            fields={initialTestMethods}
            onSubmit={(data) => handleSubmit(data as TestMethod)}
            formMethods={TestMethodFormMethods as unknown as UseFormReturn<FieldValues>}
            buttonComponent={(handleSubmit) => (
                <Button htmlType="submit" onClick={handleSubmit}>
                    {
                        !isTestMethodNew ? 'Update Test Method' : 'Add Test Method'
                    }
                </Button>
            )}
            gridLayout="1x1"
        />
    );
};

export default TestMethodModal;