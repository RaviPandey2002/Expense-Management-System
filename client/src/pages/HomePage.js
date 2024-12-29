import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker, Button } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [editable, setEditable] = useState(null);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference", // Changed: Corrected typo from "Refrence" to "Reference"
      dataIndex: "reference", // Changed: Corrected typo from "refrence" to "reference"
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => handleDelete(record)} // Changed: Simplified function call
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const selectedDateParam =
          frequency === "custom" && selectedDate.length
            ? selectedDate
            : undefined;
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/get-transactions`,
          {
            userid: user._id,
            frequency,
            selectedDate: selectedDateParam,
            type,
          }
        );
        console.log("res:", res);
        setAllTransaction(res.data);
        setLoading(false);
      } catch (error) {
        message.error("Unable to fetch transactions.");
        setLoading(false);
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/transactions/delete-transaction`,
        {
          transactionId: record._id,
        }
      );
      setLoading(false);
      message.success("transaction Deleted!");
    } catch (error) {
      setLoading(false);
      message.error("Unable to delete transaction.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/edit-transaction`,
          {
            payload: { ...values, userId: user._id },
            transactionId: editable._id,
          }
        );
        message.success("transaction Updated Successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/add-transaction`,
          {
            ...values,
            userid: user._id,
          }
        );
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Please fill all fields correctly."); // Changed: Updated error message
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(value) => setFrequency(value)}>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="365">LAST 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(dates) => setSelectedDate(dates)}
            /> // Changed: Corrected date range picker logic
          )}
        </div>
        <div className="filter-tab">
          <h6>Select Type</h6>
          <Select value={type} onChange={(value) => setType(value)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewMode === "table" ? "active-icon" : "inactive-icon"
            }`} // Changed: Updated variable to "viewMode"
            onClick={() => setViewMode("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewMode === "analytics" ? "active-icon" : "inactive-icon"
            }`} // Changed: Updated variable to "viewMode"
            onClick={() => setViewMode("analytics")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewMode === "table" ? (
          <Table columns={columns} dataSource={allTransaction} rowKey="_id" />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Amount is required" }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Type is required" }]}
          >
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Reference"
            name="reference"
            rules={[{ required: true, message: "Reference is required" }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>

          <Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
