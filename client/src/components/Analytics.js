import React from "react";
import { Progress } from "antd";
import CATEGORIES from "../utils/categories";

const Analytics = ({ allTransaction }) => {
  const categories = CATEGORIES.filter((c) => c !== "other");

  // ── Transaction counts ────────────────────────────
  const totalTransaction = allTransaction.length;
  const totalIncomeTransactions = allTransaction.filter((t) => t.type === "income");
  const totalExpenseTransactions = allTransaction.filter((t) => t.type === "expense");

  const totalIncomePercent = totalTransaction
    ? Math.round((totalIncomeTransactions.length / totalTransaction) * 100)
    : 0;
  const totalExpensePercent = totalTransaction
    ? Math.round((totalExpenseTransactions.length / totalTransaction) * 100)
    : 0;

  // ── Turnover amounts ──────────────────────────────
  const totalTurnover = allTransaction.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomeTurnover = totalIncomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenseTurnover = totalExpenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  const totalIncomeTurnoverPercent = totalTurnover
    ? Math.round((totalIncomeTurnover / totalTurnover) * 100)
    : 0;
  const totalExpenseTurnoverPercent = totalTurnover
    ? Math.round((totalExpenseTurnover / totalTurnover) * 100)
    : 0;

  return (
    <div className="analytics-grid" style={{ padding: "16px" }}>

      {/* ── Card 1: Total Transactions ── */}
      <div className="analytics-card">
        <p className="analytics-card__header">
          Total Transactions: <strong>{totalTransaction}</strong>
        </p>
        <p className="analytics-stat analytics-stat--income">
          Income: {totalIncomeTransactions.length}
        </p>
        <p className="analytics-stat analytics-stat--expense">
          Expense: {totalExpenseTransactions.length}
        </p>
        <div className="analytics-rings">
          <Progress
            type="circle"
            percent={totalIncomePercent}
            strokeColor="var(--color-income)"
            size={80}
            format={(p) => <span style={{ fontSize: 12 }}>{p}%<br /><span style={{ color: "var(--color-income)", fontSize: 10 }}>Income</span></span>}
          />
          <Progress
            type="circle"
            percent={totalExpensePercent}
            strokeColor="var(--color-expense)"
            size={80}
            format={(p) => <span style={{ fontSize: 12 }}>{p}%<br /><span style={{ color: "var(--color-expense)", fontSize: 10 }}>Expense</span></span>}
          />
        </div>
      </div>

      {/* ── Card 2: Total Turnover ── */}
      <div className="analytics-card">
        <p className="analytics-card__header">
          Total Turnover: <strong>${totalTurnover.toLocaleString()}</strong>
        </p>
        <p className="analytics-stat analytics-stat--income">
          Income: ${totalIncomeTurnover.toLocaleString()}
        </p>
        <p className="analytics-stat analytics-stat--expense">
          Expense: ${totalExpenseTurnover.toLocaleString()}
        </p>
        <div className="analytics-rings">
          <Progress
            type="circle"
            percent={totalIncomeTurnoverPercent}
            strokeColor="var(--color-income)"
            size={80}
            format={(p) => <span style={{ fontSize: 12 }}>{p}%<br /><span style={{ color: "var(--color-income)", fontSize: 10 }}>Income</span></span>}
          />
          <Progress
            type="circle"
            percent={totalExpenseTurnoverPercent}
            strokeColor="var(--color-expense)"
            size={80}
            format={(p) => <span style={{ fontSize: 12 }}>{p}%<br /><span style={{ color: "var(--color-expense)", fontSize: 10 }}>Expense</span></span>}
          />
        </div>
      </div>

      {/* ── Card 3: Category-wise Income ── */}
      <div className="analytics-card">
        <p className="analytics-card__header analytics-card__header--income">
          Category-wise Income
        </p>
        {categories.some((cat) =>
          allTransaction.some((t) => t.type === "income" && t.category === cat)
        ) ? (
          categories.map((category) => {
            const amount = allTransaction
              .filter((t) => t.type === "income" && t.category === category)
              .reduce((acc, t) => acc + t.amount, 0);
            if (!amount) return null;
            const percent = Math.round((amount / totalIncomeTurnover) * 100);
            return (
              <div key={category} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text)" }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    {percent}%
                  </span>
                </div>
                <Progress
                  percent={percent}
                  strokeColor="var(--color-income)"
                  showInfo={false}
                  size="small"
                />
              </div>
            );
          })
        ) : (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: 8 }}>
            No income data
          </p>
        )}
      </div>

      {/* ── Card 4: Category-wise Expense ── */}
      <div className="analytics-card">
        <p className="analytics-card__header analytics-card__header--expense">
          Category-wise Expense
        </p>
        {categories.some((cat) =>
          allTransaction.some((t) => t.type === "expense" && t.category === cat)
        ) ? (
          categories.map((category) => {
            const amount = allTransaction
              .filter((t) => t.type === "expense" && t.category === category)
              .reduce((acc, t) => acc + t.amount, 0);
            if (!amount) return null;
            const percent = Math.round((amount / totalExpenseTurnover) * 100);
            return (
              <div key={category} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text)" }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    {percent}%
                  </span>
                </div>
                <Progress
                  percent={percent}
                  strokeColor="var(--color-expense)"
                  showInfo={false}
                  size="small"
                />
              </div>
            );
          })
        ) : (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: 8 }}>
            No expense data
          </p>
        )}
      </div>

    </div>
  );
};

export default Analytics;
