import { useCallback, useState } from 'react';
import GridComponent from './components/GridComponent';
import DynamicForm, { FieldSchema } from './components/DynamicForm';
import { useSelector, useDispatch } from 'react-redux';
import { addLab, deleteTestMethod, emptyLab, updateLab } from './store/labSlice';
import { Button, Modal } from 'antd';
import { Lab, TestMethod } from './types/Lab';
import { RootState } from './store';
import { z } from 'zod';
import { parameters } from './utils/faker';

const initialFormHeaders: FieldSchema<Lab>[] = [
  {
    name: 'labName',
    label: 'Lab Name',
    type: 'text',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Lab Name must be at least 3 characters' }),
    }

  },
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Location must be at least 3 characters' }),
    }
  },
  {
    name: 'contactPerson',
    label: 'Contact Person',
    type: 'text',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Contact Person must be at least 3 characters' }),
    }
  },
  {
    name: 'contactNumber',
    label: 'Contact Number',
    type: 'text',
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
    isMultiSelect: true,
    validation: {
      required: true,
      pattern: z.array(z.string()).min(1, { message: 'Please select at least one service' }),
    }
  },
  {
    name: 'text',
    label: 'text',
    type: 'textarea',
    validation: {
      required: true,
      pattern: z.string().min(3, { message: 'Text must be at least 3 characters' })
    }
  }
];


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

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleSubmit = useCallback((data: Lab) => { // Specify type for data
    if (editData) {
      dispatch(updateLab(data));
    } else {
      console.log(data);

      dispatch(addLab({ ...data, id: labs.length + 1 }));
    }
    setIsModalOpen(false);
  }, [dispatch, editData, labs]);

  const [formFields] = useState(initialFormHeaders);




  const AddTestMehodModal = useCallback(() => {
    return (
      <div>
        <DynamicForm
          initialValues={
            currentTestMethod || {
              method: '',
              parameters: [],
              sampleType: ''
            }
          }
          onSubmit={(data) => {
            console.log(data);
          }}
          fields={[
            {
              name: 'method',
              label: 'Method',
              type: 'text',
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
              isMultiSelect: true,
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
          ]}
        />
      </div>
    )
  }, [currentTestMethod]);


  const TestMehodCard = useCallback(() => {
    return (
      <>
        <DynamicForm
          initialValues={editData || emptyLab}
          onSubmit={handleSubmit}
          fields={formFields}
        />
        <div className='flex justify-between'>
          <p className='text-xl font-semibold'>Test Method</p>
          <Button onClick={() => {
            setIsTestMethodModalOpen(true);
          }}>
            Add Test Method
          </Button>
        </div>
        <div>
          <div>
            <div className="flex gap-4 overflow-x-auto">
              {editData?.testMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex-none w-64 p-4 border rounded-lg shadow-md bg-white"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{method.method}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Parameters: </span>
                    {method.parameters.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sample Type: </span>
                    {method.sampleType}
                  </p>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setIsTestMethodModalOpen(true);
                        setCurrentTestMethod(method);
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
                              labId: editData.id,
                              method: method.method
                            }
                          ));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }, [dispatch, editData, formFields, handleSubmit]);

  return (
    <div className="container mx-auto">
      <button className="btn btn-primary my-4" onClick={handleAdd}>
        Add Form
      </button>
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
        <TestMehodCard />
      </Modal>
      {/* 
        Add Test Method Modal
      */}
      <Modal
        open={isTestMethodModalOpen}
        onCancel={() => {
          setIsTestMethodModalOpen(false);
        }}
        footer={null}
        className='w-1/2'
      >
        <AddTestMehodModal />
      </Modal>


    </div>
  );
};

export default App;