import { useState } from "react";
import PropTypes from "prop-types";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useMonthlyReturningPatient } from "../../../hooks/usePatientAnalytics";
import "./MonthlyReturningPatient.css";

const MONTH_NAMES = [
    "T1", "T2", "T3", "T4", "T5", "T6",
    "T7", "T8", "T9", "T10", "T11", "T12",
];

const BAR_COLOR_DEFAULT = "var(--color-primary-700)";
const BAR_COLOR_CURRENT = "var(--color-secondary-700)";

function getCurrentMonthLabel() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatShortLabel(monthStr) {
    const monthIndex = parseInt(monthStr.split("-")[1], 10) - 1;
    return MONTH_NAMES[monthIndex] || monthStr;
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="monthly-returning-patient__tooltip">
            <p className="monthly-returning-patient__tooltip-label">{label}</p>
            <p className="monthly-returning-patient__tooltip-value">
                {payload[0].value}
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
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return value;
}

function MonthlyReturningPatientCount() {
    const [offset, setOffset] = useState(0);
    const { data, isLoading, error } = useMonthlyReturningPatient(offset);

    if (isLoading) {
        return (
            <section className="monthly-returning-patient">
                <div className="monthly-returning-patient__skeleton">
                    <div className="monthly-returning-patient__skeleton-line monthly-returning-patient__skeleton-line--short" />
                    <div className="monthly-returning-patient__skeleton-bar" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="monthly-returning-patient monthly-returning-patient--error">
                <div className="monthly-returning-patient__header">
                    <h2 className="monthly-returning-patient__title">Bệnh nhân quay lại 12 tháng gần đây</h2>
                </div>
                <p className="monthly-returning-patient__error-text">
                    Không thể tải dữ liệu.
                </p>
            </section>
        );
    }

    if (!data || data.length === 0) {
        return (
            <section className="monthly-returning-patient">
                <div className="monthly-returning-patient__header">
                    <h2 className="monthly-returning-patient__title">Bệnh nhân quay lại 12 tháng gần đây</h2>
                </div>
                <p className="monthly-returning-patient__empty-text">Không có dữ liệu.</p>
            </section>
        );
    }

    const currentMonth = getCurrentMonthLabel();
    const chartData = data.map((item) => ({
        name: formatShortLabel(item.month),
        rawMonth: item.month,
        count: Number(item.count) || 0,
        isCurrent: item.month === currentMonth,
    }));

    return (
        <section className="monthly-returning-patient">
            <div className="monthly-returning-patient__header">
                <h2 className="monthly-returning-patient__title">Bệnh nhân quay lại 12 tháng gần đây</h2>
                <div className="monthly-returning-patient__nav">
                    <button
                        className="monthly-returning-patient__nav-btn"
                        onClick={() => setOffset((prev) => prev + 1)}
                        aria-label="Tháng trước"
                    >
                        &#8592;
                    </button>
                    <button
                        className="monthly-returning-patient__nav-btn"
                        onClick={() => setOffset((prev) => Math.max(0, prev - 1))}
                        disabled={offset === 0}
                        aria-label="Tháng sau"
                    >
                        &#8594;
                    </button>
                </div>
            </div>
            <div className="monthly-returning-patient__chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
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
                            allowDecimals={false}
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 12, fill: "var(--color-neutral-500)" }}
                            axisLine={false}
                            tickLine={false}
                            width={50}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "var(--color-primary-100)", opacity: 0.5 }}
                        />
                        <Bar
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={48}
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={entry.name}
                                    fill={entry.isCurrent ? BAR_COLOR_CURRENT : BAR_COLOR_DEFAULT}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

MonthlyReturningPatientCount.propTypes = {};

export default MonthlyReturningPatientCount;
