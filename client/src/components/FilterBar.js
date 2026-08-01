import { AreaChartOutlined, UnorderedListOutlined, PlusOutlined, CalendarOutlined, CheckOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import { useState } from "react";

const { RangePicker } = DatePicker;

const FREQUENCY_OPTIONS = [
  { label: "1W",     value: "7"      },
  { label: "1M",     value: "30"     },
  { label: "1Y",     value: "365"    },
  { label: "Custom", value: "custom" },
];

const TYPE_OPTIONS = [
  { label: "All",     value: "all"     },
  { label: "Income",  value: "income"  },
  { label: "Expense", value: "expense" },
];

const FilterBar = ({
  frequency,
  setFrequency,
  selectedDate,
  setSelectedDate,
  type,
  setType,
  viewMode,
  setViewMode,
  setShowModal,
  setEditable,
}) => {
  // Local draft — only pushed to parent on Apply
  const [draftDate, setDraftDate] = useState(selectedDate);

  const handleFrequencyChange = (value) => {
    setFrequency(value);
    if (value !== "custom") {
      setDraftDate(null);
      setSelectedDate(null);
    }
  };

  const handleDraftChange = (dates) => {
    setDraftDate(dates ?? []);
  };

  const handleApply = () => {
    if (draftDate?.length === 2) {
      setSelectedDate(draftDate);
    }
  };

  const canApply = draftDate?.length === 2;

  return (
    <div className="filterbar">

      {/* ── Primary row ── */}
      <div className="filterbar__row">

        {/* Frequency segment */}
        <div className="filterbar__seg" role="group" aria-label="Time range">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filterbar__seg-btn${frequency === opt.value ? " filterbar__seg-btn--active" : ""}`}
              onClick={() => handleFrequencyChange(opt.value)}
              title={opt.value === "custom" ? "Custom date range" : undefined}
            >
              {opt.value === "custom"
                ? <><CalendarOutlined className="filterbar__seg-icon" /><span className="filterbar__seg-label">{opt.label}</span></>
                : opt.label
              }
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="filterbar__divider" />

        {/* Type pill + Add button — wrapped for mobile row 2 */}
        <div className="filterbar__row-sub">
          <div className="filterbar__pill" role="group" aria-label="Transaction type">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`filterbar__pill-btn${type === opt.value ? ` filterbar__pill-btn--active filterbar__pill-btn--${opt.value}` : ""}`}
                onClick={() => setType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Add Transaction */}
          <button
            className="filterbar__add-btn"
            onClick={() => {
              setEditable(null);
              setShowModal(true);
            }}
          >
            <PlusOutlined />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Push right */}
        <div className="filterbar__spacer" />

        {/* View toggle */}
        <div className="filterbar__view" role="group" aria-label="View mode">
          <button
            className={`filterbar__view-btn${viewMode === "table" ? " filterbar__view-btn--active" : ""}`}
            onClick={() => setViewMode("table")}
            aria-label="Table view"
            title="Table view"
          >
            <UnorderedListOutlined />
          </button>
          <button
            className={`filterbar__view-btn${viewMode === "analytics" ? " filterbar__view-btn--active" : ""}`}
            onClick={() => setViewMode("analytics")}
            aria-label="Analytics view"
            title="Analytics view"
          >
            <AreaChartOutlined />
          </button>
        </div>

      </div>

      {/* ── Custom date range row (conditional) ── */}
      {frequency === "custom" && (
        <div className="filterbar__date-row">
          <span className="filterbar__date-label">Date range</span>
          <RangePicker
            value={draftDate}
            onChange={handleDraftChange}
            format="YYYY-MM-DD"
            placeholder={["Start date", "End date"]}
            className="filterbar__rangepicker"
          />
          <button
            className={`filterbar__apply-btn${canApply ? "" : " filterbar__apply-btn--disabled"}`}
            onClick={handleApply}
            disabled={!canApply}
            title="Apply date range"
          >
            <CheckOutlined />
            <span>Apply</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default FilterBar;
