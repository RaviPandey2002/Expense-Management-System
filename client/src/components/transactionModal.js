import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, DatePicker, App } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import CATEGORIES from "../utils/categories";

const TransactionModal = ({ showModal, setShowModal, editable, setEditable, onSuccess }) => {
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (showModal) {
      if (editable) {
        setIsOtherCategory(editable.category === "other");
        form.setFieldsValue({
          ...editable,
          date: editable.date ? dayjs(editable.date) : null,
        });
      } else {
        setIsOtherCategory(false);
        form.resetFields();
      }
    }
  }, [editable, form, showModal]);

  const handleSubmit = async (values) => {
    const categoryValue = isOtherCategory ? values.customCategory : values.category;
    const descriptionValue = values?.description || "No description";

    setLoading(true);
    try {
      if (editable) {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/edit-transaction`,
          {
            payload: { ...values, category: categoryValue },
            transactionId: editable._id,
          },
          { withCredentials: true }
        );
        message.success("Transaction updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/add-transaction`,
          { ...values, category: categoryValue, description: descriptionValue },
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

  const handleCategoryChange = (value) => {
    setIsOtherCategory(value === "other");
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditable(null);
    setIsOtherCategory(false);
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
      destroyOnClose
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
          rules={[{ required: true, message: "Amount is required" }]}
        >
          <Input
            type="number"
            prefix="$"
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
            placeholder="Select a category"
            onChange={handleCategoryChange}
            size="large"
          >
            {CATEGORIES.map((cat) => (
              <Select.Option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {isOtherCategory && (
          <Form.Item
            label="Custom Category"
            name="customCategory"
            rules={[{ required: true, message: "Please specify the category" }]}
          >
            <Input placeholder="Enter custom category" size="large" />
          </Form.Item>
        )}

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
