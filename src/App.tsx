import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import { Lab, TestMethod } from './types/Lab';
import { RootState } from './store';
import MainCard from './components/modals/MainCard';
import TestMethodModal from './components/modals/TestMethodModal';
import { emptyLab, emptyTestMethod } from './store/labSlice';

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const MasterTable = lazy(() => import('./components/MasterTable'));

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestMethodModalOpen, setIsTestMethodModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isTestMethodNew, setIsTestMethodNew] = useState(false);
  const [editData, setEditData] = useState<Lab>(emptyLab); // Specify type for editData
  const [currentTestMethod, setCurrentTestMethod] = useState<TestMethod>(); // Specify type for currentTestMethod
  const [tempTestMethodData, setTempTestMethodData] = useState<TestMethod[]>([]); // Specify type for tempTestMethodData
  const labs = useSelector((state: RootState) => state.labs); // Specify type for state


  console.log("labs", labs);
  console.log("editData", editData);
  console.log("isEdit", isEdit);
  console.log("currentTestMethod", currentTestMethod);
  console.log("tempTestMethodData", tempTestMethodData);



  const handleRowClick = (data: Lab) => { // Specify type for data
    setEditData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>
      <div className="container mx-auto p-4">
        <Button
          type="primary"
          className='m-2'
          onClick={() => {
            setIsModalOpen(true);
            setEditData(emptyLab);
            setIsEdit(false);
            setTempTestMethodData([]);
          }}>
          Add Lab
        </Button>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <MasterTable rowData={labs || []} onRowClick={handleRowClick}
              setIsEdit={setIsEdit}
            />
          </Suspense>
        </div>

        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditData(emptyLab);
            setIsEdit(false);
          }}
          title={isEdit ? 'Edit Lab' : 'Add Lab'}
          footer={null}
          width={
            window.innerWidth > 768 ? '70%' : '100%'
          }
          onClose={
            () => {
              setIsModalOpen(false);
              setEditData(emptyLab);
              setIsEdit(false);
            }
          }
        >
          <MainCard
            editData={editData || emptyLab}
            setIsModalOpen={setIsModalOpen}
            labs={labs}
            setIsTestMethodModalOpen={setIsTestMethodModalOpen}
            setCurrentTestMethod={setCurrentTestMethod}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            tempTestMethodData={tempTestMethodData}
            setTempTestMethodData={setTempTestMethodData}
            setIsTestMethodNew={setIsTestMethodNew}
          />
        </Modal>
        <Modal
          open={isTestMethodModalOpen}
          onCancel={() => {
            setIsTestMethodModalOpen(false);
          }}
          title={isEdit ? 'Edit Test Method' : 'Add Test Method'}
          footer={null}
          className='w-full md:w-1/2'
        >
          <TestMethodModal
            editData={editData || emptyLab}
            setIsTestMethodModalOpen={setIsTestMethodModalOpen}
            currentTestMethod={currentTestMethod || emptyTestMethod}
            isEdit={isEdit}
            setTempTestMethodData={setTempTestMethodData}
            tempTestMethodData={tempTestMethodData}
            isTestMethodNew={isTestMethodNew}

          />
        </Modal >
      </div >
    </>

  );
};

export default App;