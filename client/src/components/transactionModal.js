import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, DatePicker, App } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import CATEGORIES from "../utils/categories";

const TransactionModal = ({ showModal, setShowModal, editable, setEditable, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (showModal) {
      if (editable) {
        form.setFieldsValue({
          ...editable,
          date: editable.date ? dayjs(editable.date) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editable, form, showModal]);

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      date: values.date ? values.date.toISOString() : values.date,
      description: values.description || "No description",
    };

    setLoading(true);
    try {
      if (editable) {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/edit-transaction`,
          { payload, transactionId: editable._id },
          { withCredentials: true }
        );
        message.success("Transaction updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/add-transaction`,
          payload,
          { withCredentials: true }
        );
        message.success("Transaction added successfully");
      }
      setShowModal(false);
      setEditable(null);
      form.resetFields();
      onSuccess();
    } catch {
      message.error("Please fill all fields correctly");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditable(null);
    form.resetFields();
  };

  return (
    <Modal
      title={editable ? "Edit Transaction" : "Add Transaction"}
      open={showModal}
      onCancel={handleCancel}
      footer={null}
      centered
      width={480}
      style={{ maxWidth: "calc(100vw - 32px)" }}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ marginTop: 8 }}
      >
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Amount is required" },
            {
              validator: (_, value) =>
                value && Number(value) > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Amount must be a positive number")),
            },
          ]}
        >
          <Input
            type="number"
            min="0.01"
            step="0.01"
            prefix="₹"
            placeholder="Enter amount"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Type is required" }]}
        >
          <Select placeholder="Select type" size="large">
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Select
            showSearch
            placeholder="Select a category"
            size="large"
            options={CATEGORIES.map((cat) => ({
              value: cat,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Date is required" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input placeholder="Optional" size="large" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <div className="modal-footer-btns">
            <Button onClick={handleCancel} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              {editable ? "Update" : "Save"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionModal;
