import { AreaChartOutlined, UnorderedListOutlined, PlusOutlined } from "@ant-design/icons";
import { DatePicker, Select, Button } from "antd";

const { RangePicker } = DatePicker;

const TableHeader = ({
  setType,
  setViewMode,
  frequency,
  setFrequency,
  selectedDate,
  setSelectedDate,
  type,
  viewMode,
  setShowModal,
  setEditable,
}) => {

  const handleDateChange = (dates) => {
    setSelectedDate(dates ? dates : []);
  };

  const handleFrequencyChange = (value) => {
    setFrequency(value);
    if (value !== "custom") setSelectedDate(null);
  };

  return (
    <div className="toolbar">
      {/* Frequency */}
      <div className="toolbar__group">
        <span className="toolbar__label">Frequency</span>
        <Select
          value={frequency}
          onChange={handleFrequencyChange}
          className="toolbar__select"
        >
          <Select.Option value="7">Last 1 Week</Select.Option>
          <Select.Option value="30">Last 1 Month</Select.Option>
          <Select.Option value="365">Last 1 Year</Select.Option>
          <Select.Option value="custom">Custom</Select.Option>
        </Select>
        {frequency === "custom" && (
          <RangePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            placeholder={["Start Date", "End Date"]}
            className="toolbar__rangepicker"
          />
        )}
      </div>

      {/* Type */}
      <div className="toolbar__group">
        <span className="toolbar__label">Type</span>
        <Select
          value={type}
          onChange={(value) => setType(value)}
          className="toolbar__select"
        >
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value="expense">Expense</Select.Option>
        </Select>
      </div>

      {/* View toggle */}
      <div className="toolbar__group">
        <span className="toolbar__label">View</span>
        <div className="view-toggle">
          <button
            className={`view-toggle__btn${viewMode === "table" ? " view-toggle__btn--active" : ""}`}
            onClick={() => setViewMode("table")}
            aria-label="Table view"
            title="Table view"
          >
            <UnorderedListOutlined />
          </button>
          <button
            className={`view-toggle__btn${viewMode === "analytics" ? " view-toggle__btn--active" : ""}`}
            onClick={() => setViewMode("analytics")}
            aria-label="Analytics view"
            title="Analytics view"
          >
            <AreaChartOutlined />
          </button>
        </div>
      </div>

      {/* Spacer pushes Add New to the right */}
      <div className="toolbar__spacer" />

      {/* Add New */}
      <div className="toolbar__group">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          onClick={() => {
            setEditable(null);
            setShowModal(true);
          }}
        >
          Add New
        </Button>
      </div>
    </div>
  );
};

export default TableHeader;
