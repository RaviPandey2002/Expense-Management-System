import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import CATEGORIES from "../utils/categories";

// ── Palette ────────────────────────────────────
const COLOR_INCOME  = "#16a34a";
const COLOR_EXPENSE = "#dc2626";

// ── Helpers ────────────────────────────────────
const fmt = (v) =>
  v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid var(--color-border)",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: "0.8125rem",
    }}>
      {label && <p style={{ marginBottom: 4, fontWeight: 600, color: "var(--color-text)" }}>{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: "2px 0" }}>
          {entry.name}: ${Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const Analytics = ({ allTransaction, totalIncome, totalExpense }) => {
  const categories = CATEGORIES.filter((c) => c !== "other");

  // ── Chart 1: Area chart — income vs expense over time ──
  // Key by ISO date (YYYY-MM-DD) for correct sort, display as "DD MMM"
  const timeMap = {};
  allTransaction.forEach((t) => {
    const isoDay = t.date.slice(0, 10); // "2024-03-15"
    const display = new Date(t.date).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short",
    });
    if (!timeMap[isoDay]) timeMap[isoDay] = { date: display, isoDay, income: 0, expense: 0 };
    if (t.type === "income")  timeMap[isoDay].income  += t.amount;
    if (t.type === "expense") timeMap[isoDay].expense += t.amount;
  });
  const timeData = Object.values(timeMap).sort((a, b) => a.isoDay.localeCompare(b.isoDay));

  // ── Chart 2: Donut — income vs expense split ──
  const donutData = [
    { name: "Income",  value: totalIncome  },
    { name: "Expense", value: totalExpense },
  ].filter((d) => d.value > 0);

  // ── Chart 3: Horizontal bar — category breakdown ──
  const catData = categories
    .map((cat) => {
      const income  = allTransaction.filter((t) => t.type === "income"  && t.category === cat).reduce((a, t) => a + t.amount, 0);
      const expense = allTransaction.filter((t) => t.type === "expense" && t.category === cat).reduce((a, t) => a + t.amount, 0);
      return { category: cat.charAt(0).toUpperCase() + cat.slice(1), income, expense };
    })
    .filter((d) => d.income > 0 || d.expense > 0);

  // ── Empty state ───────────────────────────────
  if (!allTransaction.length) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--color-text-muted)" }}>
        No transaction data to display. Add your first transaction.
      </div>
    );
  }

  return (
    <div className="analytics-charts">

      {/* ── Row 1: Area chart (full width) ── */}
      <div className="analytics-chart-card">
        <p className="analytics-chart-card__title">Income vs Expense Over Time</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={timeData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLOR_INCOME}  stopOpacity={0.18} />
                <stop offset="95%" stopColor={COLOR_INCOME}  stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={COLOR_EXPENSE} stopOpacity={0.18} />
                <stop offset="95%" stopColor={COLOR_EXPENSE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="income"  name="Income"  stroke={COLOR_INCOME}  strokeWidth={2} fill="url(#gradIncome)"  dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="expense" name="Expense" stroke={COLOR_EXPENSE} strokeWidth={2} fill="url(#gradExpense)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Row 2: Donut + Bar side by side ── */}
      <div className="analytics-row2">

        {/* Donut chart */}
        <div className="analytics-chart-card">
          <p className="analytics-chart-card__title">Income vs Expense Split</p>
          {donutData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={i === 0 ? COLOR_INCOME : COLOR_EXPENSE}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 4 }}>
                <span style={{ fontSize: "0.8125rem", color: COLOR_INCOME, fontWeight: 600 }}>
                  Income: ${totalIncome.toLocaleString()}
                </span>
                <span style={{ fontSize: "0.8125rem", color: COLOR_EXPENSE, fontWeight: 600 }}>
                  Expense: ${totalExpense.toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: 8 }}>No data</p>
          )}
        </div>

        {/* Horizontal bar chart */}
        <div className="analytics-chart-card">
          <p className="analytics-chart-card__title">Category Breakdown</p>
          {catData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, catData.length * 36 + 40)}>
              <BarChart
                data={catData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                barSize={10}
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} tickLine={false} axisLine={false} width={64} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-surface)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income"  name="Income"  fill={COLOR_INCOME}  radius={[0, 3, 3, 0]} />
                <Bar dataKey="expense" name="Expense" fill={COLOR_EXPENSE} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: 8 }}>No category data</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Analytics;
