import { AreaChartOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { DatePicker, Select } from "antd";
const { RangePicker } = DatePicker;

const TableHeader = ({ setType,
    setViewMode,
    frequency,
    setFrequency,
    selectedDate,
    setSelectedDate,
    type,
    viewMode,
    setShowModal,
    setEditable
}) => {


    // Function to handle the change of date range
    const handleDateChange = (dates) => {
        if (dates) {
            setSelectedDate(dates); // Dates will be an array [startDate, endDate]
        } else {
            setSelectedDate([]); // Reset if no date range is selected
        }
    };

    const handleFrequencyChange = (value) => {
        setFrequency(value);
        if (value !== "custom") {
            setSelectedDate(null); // Clear custom date range when not in "custom"
        }
    };

    return <>
        <div className="filters h-18 py-2">
            <div className="mb-2 frequency">
                <h6>Select Frequency</h6>
                <Select
                    value={frequency}
                    onChange={handleFrequencyChange}
                    className="w-100"
                >
                    <Select.Option value="7">Last 1 Week</Select.Option>
                    <Select.Option value="30">Last 1 Month</Select.Option>
                    <Select.Option value="365">Last 1 Year</Select.Option>
                    <Select.Option value="custom">Custom</Select.Option>
                </Select>

                {frequency === "custom" && (
                    <>
                        <div>Please select a date range:</div>
                        <RangePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            format="YYYY-MM-DD"
                            placeholder={["Start Date", "End Date"]}
                        />
                    </>
                )}
            </div>
            <div className="filter-tab mb-2">
                <h6>Select Type</h6>
                <Select value={type} onChange={(value) => setType(value)}  >
                    <Select.Option value="all">ALL</Select.Option> 
                    <Select.Option value="income">INCOME</Select.Option>
                    <Select.Option value="expense">EXPENSE</Select.Option>
                </Select>
            </div>

            <div className="mb-2">
                <h6>View mode</h6>
                <div className="switch-icons">
                    <UnorderedListOutlined
                        className={`mx-2 ${viewMode === "table" ? "active-icon" : "inactive-icon"
                            }`}
                        onClick={() => setViewMode("table")}
                    />
                    <AreaChartOutlined
                        className={`mx-2 ${viewMode === "analytics" ? "active-icon" : "inactive-icon"
                            }`} // Changed: Updated variable to "viewMode"
                        onClick={() => setViewMode("analytics")}
                    />
                </div>
            </div>
            <div className="add-btn">
                <button
                    className="btn btn-primary my-btn"
                    onClick={() => {
                        setShowModal(true);
                        setEditable(null)
                    }}
                >
                    Add New
                </button>
            </div>
        </div>
    </>
}

export default TableHeader;