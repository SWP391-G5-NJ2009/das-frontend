import { useState } from "react";
import PropTypes from "prop-types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useMonthlyNoShowRate } from "../../../hooks/usePatientAnalytics";
import "./MonthlyNoShowRate.css";

const LINE_COLOR = "var(--color-primary-700)";

function getCurrentMonthLabel() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatShortLabel(monthStr) {
    return monthStr;
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="monthly-no-show-rate__tooltip">
            <p className="monthly-no-show-rate__tooltip-label">{label}</p>
            <p className="monthly-no-show-rate__tooltip-value">
                {payload[0].value}%
            </p>
        </div>
    );
}

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
        }),
    ),
    label: PropTypes.string,
};

function formatYAxis(value) {
    return `${value}%`;
}

function MonthlyNoShowRate() {
    const [offset, setOffset] = useState(0);
    const { data, isLoading, error } = useMonthlyNoShowRate(offset);

    if (isLoading) {
        return (
            <section className="monthly-no-show-rate">
                <div className="monthly-no-show-rate__skeleton">
                    <div className="monthly-no-show-rate__skeleton-line monthly-no-show-rate__skeleton-line--short" />
                    <div className="monthly-no-show-rate__skeleton-bar" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="monthly-no-show-rate monthly-no-show-rate--error">
                <div className="monthly-no-show-rate__header">
                    <h2 className="monthly-no-show-rate__title">Tỷ lệ không đến khám 12 tháng gần đây</h2>
                </div>
                <p className="monthly-no-show-rate__error-text">
                    Không thể tải dữ liệu.
                </p>
            </section>
        );
    }

    if (!data || data.length === 0) {
        return (
            <section className="monthly-no-show-rate">
                <div className="monthly-no-show-rate__header">
                    <h2 className="monthly-no-show-rate__title">Tỷ lệ không đến khám 12 tháng gần đây</h2>
                </div>
                <p className="monthly-no-show-rate__empty-text">Không có dữ liệu.</p>
            </section>
        );
    }

    const currentMonth = getCurrentMonthLabel();
    const chartData = data.map((item) => ({
        name: formatShortLabel(item.month),
        rawMonth: item.month,
        count: Math.round(Number(item.rate) * 100) || 0,
        isCurrent: item.month === currentMonth,
    }));

    return (
        <section className="monthly-no-show-rate">
            <div className="monthly-no-show-rate__header">
                <h2 className="monthly-no-show-rate__title">Tỷ lệ không đến khám 12 tháng gần đây</h2>
                <div className="monthly-no-show-rate__nav">
                    <button
                        className="monthly-no-show-rate__nav-btn"
                        onClick={() => setOffset((prev) => prev + 1)}
                        aria-label="Tháng trước"
                    >
                        &#8592;
                    </button>
                    <button
                        className="monthly-no-show-rate__nav-btn"
                        onClick={() => setOffset((prev) => Math.max(0, prev - 1))}
                        disabled={offset === 0}
                        aria-label="Tháng sau"
                    >
                        &#8594;
                    </button>
                </div>
            </div>
            <div className="monthly-no-show-rate__chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-neutral-100)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }}
                            axisLine={{ stroke: "var(--color-neutral-200)" }}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }}
                            axisLine={false}
                            tickLine={false}
                            width={50}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke={LINE_COLOR}
                            strokeWidth={2}
                            dot={{ fill: LINE_COLOR, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

MonthlyNoShowRate.propTypes = {};

export default MonthlyNoShowRate;
