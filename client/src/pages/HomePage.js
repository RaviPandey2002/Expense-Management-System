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

  // ── KPI calculations ──────────────────────────────
  const totalIncome = allTransaction
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = allTransaction
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // ── Table columns ─────────────────────────────────
  // handleDelete is defined below but stable across renders (no state deps change its identity)
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
          {record.type === "income" ? "+" : "-"}${Math.abs(val).toLocaleString()}
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

  // ── Fetch transactions ────────────────────────────
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
          setAllTransaction(res?.data);
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

  // ── Delete handler ────────────────────────────────
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
      {/* ── KPI Summary Cards ── */}
      <div className="kpi-row">
        <div className="kpi-card kpi-card--balance">
          <div>
            <p className="kpi-card__label">Total Balance</p>
            <p className="kpi-card__value kpi-card__value--balance">
              ${totalBalance.toLocaleString()}
            </p>
          </div>
          <WalletOutlined className="kpi-card__icon" style={{ color: "var(--color-primary)" }} />
        </div>

        <div className="kpi-card kpi-card--income">
          <div>
            <p className="kpi-card__label">Total Income</p>
            <p className="kpi-card__value kpi-card__value--income">
              +${totalIncome.toLocaleString()}
            </p>
          </div>
          <ArrowUpOutlined className="kpi-card__icon" style={{ color: "var(--color-income)" }} />
        </div>

        <div className="kpi-card kpi-card--expense">
          <div>
            <p className="kpi-card__label">Total Expense</p>
            <p className="kpi-card__value kpi-card__value--expense">
              -${totalExpense.toLocaleString()}
            </p>
          </div>
          <ArrowDownOutlined className="kpi-card__icon" style={{ color: "var(--color-expense)" }} />
        </div>
      </div>

      {/* ── Filter Bar ── */}
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

      {/* ── Table / Analytics ── */}
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
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
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
