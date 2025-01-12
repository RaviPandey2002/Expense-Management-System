import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button, DatePicker, message } from "antd";
import moment from "moment";
import axios from "axios";

const TransactionModal = ({ showModal, setShowModal, editable, setEditable, setLoading }) => {
    const [category, setCategory] = useState("");
    const [isOtherCategory, setIsOtherCategory] = useState(false);
    const [form] = Form.useForm()



    useEffect(() => {
        if (showModal) {
            if (editable) {
                form.setFieldsValue({
                    ...editable,
                    date: editable.date ? moment(editable.date) : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [editable, form, showModal]);


    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user._id) {
                message.error("User data is missing.");
                setLoading(false);
                return;
            }
            setLoading(true);

            // Use the category value (either selected or custom)
            const categoryValue = isOtherCategory
                ? values.customCategory
                : values.category;

            const descriptionValue = values?.description
                ? values.description
                : "No description"
            if (editable) {
                try {
                    await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}/transactions/edit-transaction`,
                        {
                            payload: {
                                ...values,
                                category: categoryValue,
                                userId: user._id
                            },
                            transactionId: editable._id,
                        }
                    );
                    message.success("Transaction Updated Successfully");
                } catch (err) {
                    message.error("Failed to update transaction.");
                    console.log("Error in Edit transaction Error:", err);
                }
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/transactions/add-transaction`,
                    {
                        ...values,
                        category: categoryValue,
                        description: descriptionValue,
                        userId: user._id,
                    }
                );
                message.success("Transaction Added Successfully");
            }
            setShowModal(false);
            setEditable(null);
            form.resetFields(); // Clear form after submission
        } catch (error) {
            message.error("Please fill all fields correctly."); // Changed: Updated error message
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
                        <Select.Option value="salary">Salary</Select.Option>
                        <Select.Option value="groceries">Groceries</Select.Option>
                        <Select.Option value="food">Food</Select.Option>
                        <Select.Option value="movie">Movie</Select.Option>
                        <Select.Option value="bills">Bills</Select.Option>
                        <Select.Option value="fee">Fee</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
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
                    rules={[{ required: true, message: "Type is required" }]}
                >
                    <DatePicker
                        // value={editable?.date ? moment(editable?.date) : moment()}
                        format="YYYY-MM-DD"
                    />
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
