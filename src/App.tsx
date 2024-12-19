import { useCallback, useState } from 'react';
import GridComponent from './components/GridComponent';
import { useSelector, useDispatch } from 'react-redux';
import { addLab, addTestMethod, deleteTestMethod, updateLab, updateTestMethod } from './store/labSlice';
import { Button, Modal } from 'antd';
import { Lab, TestMethod } from './types/Lab';
import { RootState } from './store';
import { z } from 'zod';
import { parameters } from './utils/faker';
import ReusableForm, { CustomField } from './components/FormComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import Navbar from './components/Navbar';
import TableComponent from './components/TableComponent';
import { CustomCellRendererProps } from 'ag-grid-react';

const initialFormHeaders: CustomField[] = [
  {
    name: 'labName',
    label: 'Lab Name',
    type: 'input',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Lab Name must be at least 3 characters' }),
    }

  },
  {
    name: 'location',
    label: 'Location',
    type: 'input',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Location must be at least 3 characters' }),
    }
  },
  {
    name: 'contactPerson',
    label: 'Contact Person',
    type: 'input',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Contact Person must be at least 3 characters' }),
    }
  },
  {
    name: 'contactNumber',
    label: 'Contact Number',
    type: 'input',
    validation: {
      required: true,
      pattern: z.string().regex(/^\d{10}$/, { message: 'Enter a valid contact number' }),
    }
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['Active', 'Inactive'],
    validation: {
      required: true,
      pattern: z.enum(['Active', 'Inactive'], { message: 'Select a valid status' }),
    }
  },
  {
    name: 'servicesOffered',
    label: 'Services Offered',
    type: 'select',
    options: [
      'Chemical Analysis',
      'Oil Testing',
      'Water Quality',
      'Material Testing',
      'Environmental Testing',
    ],
    isInputProps: {
      multiple: true
    },
    validation: {
      required: true,
      pattern: z.array(z.string()).min(1, { message: 'Please select at least one service' }),
    }
  }
];


const initialTestMethods: CustomField[] = [
  {
    name: 'method',
    label: 'Method',
    type: 'input',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Method must be at least 3 characters' }),
    }
  },
  {
    name: 'parameters',
    label: 'Parameters',
    type: 'select',
    options: parameters,
    isInputProps: {
      multiple: true
    },
    validation: {
      required: true,
      pattern: z.array(z.string()).min(1, { message: 'Please select at least one parameter' }),
    }
  },
  {
    name: 'sampleType',
    label: 'Sample Type',
    type: 'select',
    options: ['Oil', 'Water', 'Air', 'Metal'],
    validation: {
      required: true,
      pattern: z.enum(['Oil', 'Water', 'Air', 'Metal'], { message: 'Select a valid sample type' }),
    }
  }
]


const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestMethodModalOpen, setIsTestMethodModalOpen] = useState(false);
  const [editData, setEditData] = useState<Lab | null>(null); // Specify type for editData
  const [currentTestMethod, setCurrentTestMethod] = useState<TestMethod | null>(null); // Specify type for currentTestMethod
  const dispatch = useDispatch();

  const labs = useSelector((state: RootState) => state.labs); // Specify type for state

  console.log(labs);

  const handleRowClick = (data: Lab) => { // Specify type for data
    setEditData(data);
    setIsModalOpen(true);
  };


  const handleSubmit = useCallback((data: Lab) => { // Specify type for data
    if (editData) {
      dispatch(updateLab(data));
    } else {
      console.log(data);
      dispatch(addLab({
        ...data, id: labs.length + 1,
        testMethods: []
      }));
    }
    setIsModalOpen(false);
  }, [dispatch, editData, labs]);





  const MainFormSchemaObject = Object.fromEntries(
    initialTestMethods
      .filter((field) => field?.name) // Ensure fields with a valid name
      .map((field) => [
        field?.name, // Use field name as key
        field?.validation?.pattern ||
        (field?.validation?.required ? z.string().min(1) : z.nullable(z.any()))
      ])
  );


  const TestMethodSchemaObject = Object.fromEntries(
    initialFormHeaders
      .filter((field) => field?.name) // Ensure fields with a valid name
      .map((field) => [
        field?.name, // Use field name as key
        field?.validation?.pattern ||
        (field?.validation?.required ? z.string().min(1) : z.nullable(z.any()))
      ])
  );

  const schema = z.object(MainFormSchemaObject).required();
  const schema2 = z.object(TestMethodSchemaObject).required();

  const MainFormMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues: editData ?? {}
  });

  const TestMethodFormMethods = useForm({
    resolver: zodResolver(schema2),
  });

  const AddTestMehodModal = useCallback(() => {
    return (
      <div>
        <ReusableForm
          fields={
            initialTestMethods
          }
          onSubmit={(data) => {
            console.log(data);

            if (currentTestMethod) {
              dispatch(updateTestMethod({
                labId: editData?.id || 0,
                method: currentTestMethod.method,
                parameters: data.parameters,
                sampleType: data.sampleType
              }))
            } else {
              dispatch(addTestMethod({
                labId: editData?.id || 0,
                method: data.method,
                parameters: data.parameters,
                sampleType: data.sampleType
              }))
            }

          }}
          formMethods={MainFormMethods as unknown as UseFormReturn<FieldValues>}
          buttonComponent={(handleSubmit) => (
            <Button htmlType="submit" onClick={handleSubmit}>Submit</Button>
          )
          }
          gridLayout='1x1'
        />
      </div >
    )
  }, [MainFormMethods, currentTestMethod, dispatch, editData?.id]);


  const MainCard = useCallback(() => {
    return (
      <>
        <ReusableForm
          fields={initialFormHeaders}
          onSubmit={(data) => {
            console.log(data);
            handleSubmit(data as Lab);
          }}
          formMethods={TestMethodFormMethods as unknown as UseFormReturn<FieldValues>}
          buttonComponent={(handleSubmit) => (
            <>
              <div className="w-full flex justify-end mb-2">
                <Button
                  className=''
                  onClick={handleSubmit}>
                  {editData ? 'Update' : 'Submit'}
                </Button>
              </div>
            </>
          )}
          gridLayout='3x3'
        />
        <div className='flex justify-between'>
          <p className='text-xl font-semibold'>Test Method</p>
          <Button onClick={() => {
            setIsTestMethodModalOpen(true);
            setCurrentTestMethod(null);
          }}>
            Add Test Method
          </Button>
        </div>
        <div>
          <div>
            <TableComponent
              data={
                labs.find((lab) => lab.id === editData?.id)?.testMethods || []}
              isLoading={false}
              columns={[
                {
                  headerName: 'Method',
                  field: 'method',
                  sortable: true,
                  filter: true,
                  flex: 1,
                },
                {
                  headerName: 'Parameters',
                  field: 'parameters',
                  sortable: true,
                  filter: true,
                  flex: 1,
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
                            setIsTestMethodModalOpen(true);
                            setCurrentTestMethod(params.data);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this item?')) {
                              dispatch(deleteTestMethod(
                                {
                                  labId: editData?.id || 0,
                                  method: params.data.method
                                }
                              ));
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
          </div>
        </div>
      </>
    )
  }, [TestMethodFormMethods, dispatch, editData, handleSubmit, labs]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Button
          type="primary"
          className='m-2'
          onClick={() => {
            setIsModalOpen(true);
            setEditData(null);
          }}>
          Add Lab
        </Button>
        <div>
          <GridComponent rowData={labs || []} onRowClick={handleRowClick} />
        </div>

        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditData(null);
          }}
          title={editData ? 'Edit Lab' : 'Add Lab'}
          footer={null}
          width={
            window.innerWidth > 768 ? '70%' : '100%'
          }
        >
          <MainCard />
        </Modal>
        <Modal
          open={isTestMethodModalOpen}
          onCancel={() => {
            setIsTestMethodModalOpen(false);
          }}
          title={currentTestMethod ? 'Edit Test Method' : 'Add Test Method'}
          footer={null}
          className='w-full md:w-1/2'
        >
          <AddTestMehodModal />
        </Modal >
      </div >
    </>

  );
};

export default App;