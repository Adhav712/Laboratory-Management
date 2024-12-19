import React, { Suspense, useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { initialFormHeaders } from '../../store/initialData';
import { updateLab, addLab, deleteTestMethod, emptyLab } from '../../store/labSlice';
import { Lab, TestMethod } from '../../types/Lab';
import ReusableForm from '../FormComponent';
import TableComponent from '../TableComponent';
import { CustomCellRendererProps } from 'ag-grid-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

interface MainCardProps {
    editData: Lab | null;
    setIsModalOpen: (state: boolean) => void;
    labs: Lab[];
    setIsTestMethodModalOpen: (state: boolean) => void;
    setCurrentTestMethod: (state: TestMethod) => void;
    isEdit: boolean;
    setIsEdit: (state: boolean) => void;
    tempTestMethodData: TestMethod[];
    setIsTestMethodNew: (state: boolean) => void;
    setTempTestMethodData: (state: TestMethod[]) => void;
}

const MainCard: React.FC<MainCardProps> = ({
    editData,
    setIsModalOpen,
    labs,
    setIsTestMethodModalOpen,
    setCurrentTestMethod,
    isEdit,
    tempTestMethodData,
    setIsTestMethodNew,
    setTempTestMethodData
}) => {
    const dispatch = useDispatch();
    const MainFormSchemaObject = Object.fromEntries(
        initialFormHeaders
            .filter((field) => field?.name) // Ensure fields with a valid name
            .map((field) => [
                field?.name, // Use field name as key
                field?.validation?.pattern ||
                (field?.validation?.required ? z.string().min(1) : z.nullable(z.any()))
            ])
    );
    const schema = z.object(MainFormSchemaObject).required();

    const MainFormMethods = useForm({
        resolver: zodResolver(schema)
    });
    const handleSubmit = useCallback((data: Lab) => {
        console.log(data);

        if (isEdit && (editData?.id !== 0)) {
            dispatch(updateLab(data));
            toast.success('Lab Updated Successfully');
        } else {
            dispatch(addLab({ ...data, id: labs.length + 1, testMethods: tempTestMethodData }));
            toast.success('Lab Added Successfully');
        }
        setIsModalOpen(false);

        console.log(data);

    },
        [dispatch, editData?.id, isEdit, labs.length, setIsModalOpen, tempTestMethodData]
    );


    useEffect(() => {
        if ((editData?.id !== 0) && isEdit
        ) {
            MainFormMethods.reset(editData as FieldValues);
        } else {
            MainFormMethods.reset(emptyLab);
        }
    }, [editData, MainFormMethods, isEdit]);

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ReusableForm
                    fields={initialFormHeaders}
                    onSubmit={(data) => {
                        console.log(data);
                        handleSubmit(data as Lab);
                    }}
                    formMethods={MainFormMethods as unknown as UseFormReturn<FieldValues>}
                    buttonComponent={(handleSubmit) => (
                        <>
                            <div className="w-full flex justify-end mb-1 pr-3 gap-2">
                                <Button onClick={() => {
                                    setIsTestMethodModalOpen(true);
                                    setCurrentTestMethod({
                                        method: '',
                                        parameters: [],
                                        sampleType: ''
                                    });
                                    setIsTestMethodNew(true);
                                }}>
                                    Add Test Method
                                </Button>
                                <Button
                                    className=''
                                    onClick={handleSubmit}>
                                    {isEdit ? 'Update' : 'Submit'}
                                </Button>

                            </div>

                        </>
                    )}
                    gridLayout='3x3'
                />

            </Suspense>
            <div className='flex justify-between items-center py-1 px-2'>
                <p className='text-lg font-semibold'>Test Method</p>

            </div>
            <div>
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <TableComponent
                            data={
                                isEdit ?
                                    (labs.find((lab) => lab.id === editData?.id)?.testMethods || []) :
                                    tempTestMethodData
                            }
                            isLoading={false}

                            paginationPageSize={5}
                            paginationPageSizeSelector={
                                // Increment by 5 after 20 then 50, 100, 200, 500, 1000
                                Array.from({ length: 6 }, (_, index) => index * 5 + 5)

                            }
                            height='35vh'
                            columns={[
                                {
                                    headerName: 'ID',
                                    field: 'id',
                                    sortable: true,
                                    filter: true,
                                    width: 50
                                },
                                {
                                    headerName: 'Method',
                                    field: 'method',
                                    sortable: true,
                                    filter: true,
                                    flex: 1
                                },
                                {
                                    headerName: 'Parameters',
                                    field: 'parameters',
                                    sortable: true,
                                    filter: true,
                                    flex: 1,
                                    // editable: true,
                                    // cellEditor: 'agMultiSelectCellEditor',
                                },
                                {
                                    headerName: 'Sample Type',
                                    field: 'sampleType',
                                    sortable: true,
                                    filter: true,
                                    flex: 1,
                                },
                                {
                                    headerName: 'Action',
                                    field: 'Action',
                                    cellRenderer: (params: CustomCellRendererProps) => {
                                        return (
                                            <div className="flex gap-4">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        console.log(params.data);

                                                        setIsTestMethodModalOpen(true);
                                                        setCurrentTestMethod(params.data);
                                                        setIsTestMethodNew(false);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this item?')) {
                                                            if (isEdit) {
                                                                dispatch(deleteTestMethod(
                                                                    {
                                                                        labId: editData?.id || 0,
                                                                        id: params.data.id
                                                                    }
                                                                ));
                                                            } else {
                                                                setTempTestMethodData(
                                                                    tempTestMethodData.filter(
                                                                        (method) => method.method !== params.data.method
                                                                    )
                                                                )
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )
                                    },
                                    flex: 1,
                                }
                            ]}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    )
};

export default MainCard;