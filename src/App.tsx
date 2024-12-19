import { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import { Lab, TestMethod } from './types/Lab';
import { RootState } from './store';
import MainCard from './components/modals/MainCard';
import TestMethodModal from './components/modals/TestMethodModal';

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const GridComponent = lazy(() => import('./components/GridComponent'));

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTestMethodModalOpen, setIsTestMethodModalOpen] = useState(false);
  const [editData, setEditData] = useState<Lab | null>(null); // Specify type for editData
  const [currentTestMethod, setCurrentTestMethod] = useState<TestMethod | null>(null); // Specify type for currentTestMethod

  const labs = useSelector((state: RootState) => state.labs); // Specify type for state

  console.log(labs);

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
            setEditData(null);
          }}>
          Add Lab
        </Button>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <GridComponent rowData={labs || []} onRowClick={handleRowClick} />
          </Suspense>
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
          onClose={
            () => {
              setIsModalOpen(false);
              setEditData(null);
            }
          }
        >
          <MainCard
            editData={editData}
            setIsModalOpen={setIsModalOpen}
            labs={labs}
            setIsTestMethodModalOpen={setIsTestMethodModalOpen}
            setCurrentTestMethod={setCurrentTestMethod}
          />
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
          <TestMethodModal
            editData={editData}
            setIsTestMethodModalOpen={setIsTestMethodModalOpen}
          />
        </Modal >
      </div >
    </>

  );
};

export default App;