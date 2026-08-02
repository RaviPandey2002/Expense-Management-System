import {
  DeleteOutlined,
  EditOutlined,
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { App, Modal, Table, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Analytics from "../components/Analytics";
import ErrorBoundary from "../components/ErrorBoundary";
import FilterBar from "../components/FilterBar";
import TransactionModal from "../components/transactionModal";
import Layout from "./../components/Layout/Layout";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState(null);
  const [type, setType] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [editable, setEditable] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { message } = App.useApp();

  const totalIncome = useMemo(
    () => allTransaction.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0),
    [allTransaction]
  );

  const totalExpense = useMemo(
    () => allTransaction.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0),
    [allTransaction]
  );

  const totalBalance = totalIncome - totalExpense;

  const columns = useMemo(() => [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (val, record) => (
        <span style={{ color: record.type === "income" ? "var(--color-income)" : "var(--color-expense)", fontWeight: 600 }}>
          {record.type === "income" ? "+" : "-"}₹{Math.abs(val).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Income",  value: "income"  },
        { text: "Expense", value: "expense" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (val) => (
        <span className={`badge badge--${val}`}>{val}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (val) => val.charAt(0).toUpperCase() + val.slice(1),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <div className="action-icons">
          <Tooltip title="Edit">
            <span
              className="action-icon--edit"
              onClick={() => {
                setEditable(record);
                setShowModal(true);
              }}
            >
              <EditOutlined />
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              className="action-icon--delete"
              onClick={() => handleDelete(record)}
            >
              <DeleteOutlined />
            </span>
          </Tooltip>
        </div>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        setFetchLoading(true);
        const selectedDateParam =
          frequency === "custom" && selectedDate?.length
            ? selectedDate
            : undefined;

        if (frequency !== "custom" || selectedDateParam) {
          const res = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/transactions/get-transactions`,
            { frequency, selectedDate: selectedDateParam, type },
            { withCredentials: true }
          );
          setAllTransaction(Array.isArray(res?.data) ? res.data : []);
        }
      } catch (error) {
        message.error(
          `Failed to fetch transactions: ${error.response?.data?.message || error.message}`
        );
      } finally {
        setFetchLoading(false);
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete this transaction?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/transactions/delete-transaction`,
            { transactionId: record._id },
            { withCredentials: true }
          );
          message.success("Transaction deleted");
          setRefreshKey((k) => k + 1);
        } catch {
          message.error("Unable to delete transaction");
        }
      },
    });
  };

  return (
    <Layout>
      <div className="kpi-row">
        <div className={`kpi-card kpi-card--balance${totalBalance < 0 ? " kpi-card--balance-negative" : ""}`}>
          <div>
            <p className="kpi-card__label">Total Balance</p>
            <p className={`kpi-card__value${totalBalance < 0 ? " kpi-card__value--expense" : " kpi-card__value--balance"}`}>
              {totalBalance < 0 ? "-" : ""}₹{Math.abs(totalBalance).toLocaleString()}
            </p>
          </div>
          <WalletOutlined
            className="kpi-card__icon"
            style={{ color: totalBalance < 0 ? "var(--color-expense)" : "var(--color-primary)" }}
          />
        </div>

        <div className="kpi-card kpi-card--income">
          <div>
            <p className="kpi-card__label">Total Income</p>
            <p className="kpi-card__value kpi-card__value--income">
              +₹{totalIncome.toLocaleString()}
            </p>
          </div>
          <ArrowUpOutlined className="kpi-card__icon" style={{ color: "var(--color-income)" }} />
        </div>

        <div className="kpi-card kpi-card--expense">
          <div>
            <p className="kpi-card__label">Total Expense</p>
            <p className="kpi-card__value kpi-card__value--expense">
              -₹{totalExpense.toLocaleString()}
            </p>
          </div>
          <ArrowDownOutlined className="kpi-card__icon" style={{ color: "var(--color-expense)" }} />
        </div>
      </div>

      <FilterBar
        frequency={frequency}
        setFrequency={setFrequency}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        type={type}
        setType={setType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setShowModal={setShowModal}
        setEditable={setEditable}
      />

      <div className="table-wrap">
        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={allTransaction}
            rowKey="_id"
            loading={fetchLoading}
            scroll={{ x: "max-content" }}
            size="middle"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{ emptyText: "No transactions found. Add your first transaction." }}
          />
        ) : (
          <Analytics allTransaction={allTransaction} totalIncome={totalIncome} totalExpense={totalExpense} />
        )}
      </div>

      <ErrorBoundary>
        <TransactionModal
          showModal={showModal}
          setShowModal={setShowModal}
          editable={editable}
          setEditable={setEditable}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </ErrorBoundary>
    </Layout>
  );
};

export default HomePage;
