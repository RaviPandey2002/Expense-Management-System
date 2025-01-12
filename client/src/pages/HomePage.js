import {
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons";
import {
    message,
    Modal,
    Table,
    Tooltip
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Analytics from "../components/Analytics";
import ErrorBoundary from "../components/erorBoundary";
import TableHeader from "../components/tableHeader";
import TransactionModal from "../components/transactionModal";
import Layout from "./../components/Layout/Layout";
import Spinner from "./../components/Spinner";

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
            title: 'Index',
            dataIndex: 'index',
            key: 'index',
            render: (_, record, index) => index + 1,
            width: '5%',
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
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Actions",
            render: (text, record) => (
                <div>
                    <Tooltip title="Edit">
                        <EditOutlined
                            onClick={() => {
                                setEditable(record);
                                setShowModal(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined
                            style={{ color: "red" }}
                            className="mx-3"
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>

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
                    frequency === "custom" && selectedDate?.length
                        ? selectedDate
                        : undefined;

                let res;
                // check for custom frequency if yes then only make an API call
                if (frequency !== "custom" || selectedDateParam) {
                    try {
                        res = await axios.post(
                            `${process.env.REACT_APP_API_BASE_URL}/transactions/get-transactions`,
                            {
                                userId: user._id,
                                frequency,
                                selectedDate: selectedDateParam,
                                type,
                            }
                        );
                        setAllTransaction(res?.data);
                        (res?.data)
                            ? console.log("Transactions added successfully!!")
                            : console.log("There is No transaction available")

                    } catch (error) {
                        console.error("Error fetching from the API:", error);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                message.error(`Failed to fetch transactions: ${error.response?.data?.message || error.message}`);
                setLoading(false);
            }
        };
        getAllTransactions();
    }, [frequency, selectedDate, type]);

    const handleDelete = async (record) => {
        Modal.confirm({
            title: "Are you sure you want to delete this record!",
            okText: "Yes",
            okType: "danger",
            onOk: async () => {
                try {
                    setLoading(true);
                    await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}/transactions/delete-transaction`,
                        {
                            transactionId: record._id,
                        }
                    );
                    setLoading(false);
                    message.success("Transaction Deleted!");
                } catch (error) {
                    setLoading(false);
                    message.error("Unable to delete transaction.");
                }
            }
        })
    };

    return (
        <Layout>
            {loading && <Spinner />}

            <TableHeader
                setType={setType}
                setViewMode={setViewMode}
                frequency={frequency}
                setFrequency={setFrequency}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                type={type}
                viewMode={viewMode}
                setShowModal={setShowModal}
                setEditable={setEditable}
            />

            <div className="content">
                {viewMode === "table"
                    ? (
                        <Table
                            columns={columns}
                            dataSource={allTransaction}
                            rowKey="_id"
                            loading={loading}
                            scroll={viewMode === "table" ? { y: 350 } : undefined}
                            size={"medium"}
                            locale={{ emptyText: "No transactions available" }}
                        />
                    )
                    : (
                        <Analytics allTransaction={allTransaction} />
                    )}
            </div>
            <ErrorBoundary>
                <TransactionModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    editable={editable}
                    setEditable={setEditable}
                    setLoading={setLoading}
                />
            </ErrorBoundary>
        </Layout>
    );
};

export default HomePage;
