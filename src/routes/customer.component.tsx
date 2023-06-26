import { Space, Typography, Divider, Button } from 'antd';
import Table from 'antd/es/table';
import { ToastContainer, toast } from 'react-toastify';
import UpdateCustomer from '../components/update-customer.component';
import { Fragment, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AddCustomer from '../components/add-customer.component';
import { Customer } from '../types/customer.type';
import { OverlayContext } from '../context/overlay.context';
import { CustomerContext } from '../context/customer.context';
const { Text } = Typography;

// // rowSelection object indicates the need for row selection
// const rowSelection = {
//   onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
//     console.log(
//       `selectedRowKeys: ${selectedRowKeys}`,
//       'selectedRows: ',
//       selectedRows,
//     );
//   },
// };

const CustomerPage = () => {
  const {customers, setCustomers} = useContext(CustomerContext);
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const { isOpen, setIsOpen } = useContext(OverlayContext);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data }: { data: Customer[] } = await axios.get(
        'https://game-rental-management-app-yh3ve.ondigitalocean.app/customer',
      );
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'point',
      dataIndex: 'point',
    }
  ];

  const data = customers.map((customer) => ({
    key: customer._id,
    customerName: customer.customerName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    address: customer.address,
    point: customer.point,
  }));

  const [searchField, setSearchField] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLocaleLowerCase();
    setSearchField(value);
  };

  const rowSelection = {
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleDeleteBtn = async () => {
    try {
      // Delete selected rows
      await Promise.all(
        selectedRowKeys.map(async (key) => {
          await axios.delete(
            `https://game-rental-management-app-yh3ve.ondigitalocean.app/customer/${key}`,
          );
        }),
      );

      // Fetch updated products data
      const { data }: { data: Customer[] } = await axios.get(
        'https://game-rental-management-app-yh3ve.ondigitalocean.app/customer',
      );
      // Update customer state and selectedRowKeys state
      setCustomers(data);
      setSelectedRowKeys([]);

      // Refresh the page by updating the searchField state
      setSearchField('');
    } catch (error) {
      console.log('Error deleting rows:', error);
    }
  };

  const handleAddBtn = () => {
    setIsAddOpen(true);
  };

  const handleUpdateBtn = () => {
    if (selectedRowKeys.length === 0 || selectedRowKeys.length > 1) {
      toast.error('Please select only 1 customer to update 😞', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 8000,
        theme: 'colored',
        pauseOnHover: true,
      });
      return;
    }
    setIsUpdateOpen(true);
    setIsOpen(true);

  };

  return (
    <Fragment>
      <div className="w-[1080px] bg-white rounded-md relative top-[30%] left-[50%] translate-x-[-50%] translate-y-[-30%] p-10 shadow-2xl">
        <Space className="flex justify-between">
          <Text className="text-2xl font-semibold">Customer</Text>
          <div className="input-field">
            <input
              className="px-4"
              type="search"
              placeholder="Search customer"
              name="searchField"
              value={searchField}
              onChange={handleChange}
            />
            <label htmlFor="searchfield">Search customer</label>
          </div>
        </Space>
        <div>
          <Divider />
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize:5 }}
          />
        </div>
        <Space direction="horizontal" className="relative top-[-9%]">
          <Button type="primary" className="bg-blue-500" onClick={handleAddBtn}>
            Thêm
          </Button>
          <Button danger type="primary" onClick={handleDeleteBtn}>
            Xóa
          </Button>

          <Button 
          type="primary" 
          className="bg-green-600"
          onClick={handleUpdateBtn}
          >

            Sửa
          </Button>
        </Space>
      </div>

      {isUpdateOpen && (
        <UpdateCustomer
          setIsUpdateOpen={setIsUpdateOpen}
          selectedUpdate={selectedRowKeys}
        />
      )}
      <ToastContainer />
      {isOpen && <AddCustomer />}
    </Fragment>
  );
};

export default CustomerPage;