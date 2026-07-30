import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, DatePicker, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import CATEGORIES from "../utils/categories";

const TransactionModal = ({ showModal, setShowModal, editable, setEditable, onSuccess }) => {
    const [category, setCategory] = useState("");
    const [isOtherCategory, setIsOtherCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm()



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
        const categoryValue = isOtherCategory
            ? values.customCategory
            : values.category;

        const descriptionValue = values?.description || "No description";

        setLoading(true);
        try {
            if (editable) {
                await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/transactions/edit-transaction`,
                    {
                        payload: {
                            ...values,
                            category: categoryValue,
                        },
                        transactionId: editable._id,
                    },
                    { withCredentials: true }
                );
                message.success("Transaction Updated Successfully");
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/transactions/add-transaction`,
                    {
                        ...values,
                        category: categoryValue,
                        description: descriptionValue,
                    },
                    { withCredentials: true }
                );
                message.success("Transaction Added Successfully");
            }
            setShowModal(false);
            setEditable(null);
            form.resetFields();
            onSuccess();
        } catch (error) {
            message.error("Please fill all fields correctly.");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        if (value === "other") {
            setIsOtherCategory(true);
        } else {
            setIsOtherCategory(false);
        }
    };

    return (
        <Modal
            title={editable ? "Edit Transaction" : "Add Transaction"}
            confirmLoading={loading}
            open={showModal}
            onCancel={() => {
                setShowModal(false);
                setEditable(null);
                form.resetFields();
            }}
            footer={false}
            centered={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: "Amount is required" }]}
                >
                    <Input type="number" />
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
                    <Select value={category} onChange={handleCategoryChange}>
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
                        <Input />
                    </Form.Item>
                )}

                <Form.Item label="Date"
                    name="date"
                    rules={[{ required: true, message: "Date is required" }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input type="text" />
                </Form.Item>

                <Form.Item>
                    <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType="submit">
                            {editable ? "Update" : "Save"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TransactionModal;
