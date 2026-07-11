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
import "./MonthlyNewPatient.css";

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LINE_COLOR = "var(--color-primary-700)";

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
        <div className="monthly-new-patient__tooltip">
            <p className="monthly-new-patient__tooltip-label">{label}</p>
            <p className="monthly-new-patient__tooltip-value">
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
    const { data, isLoading, error } = useMonthlyNoShowRate();

    if (isLoading) {
        return (
            <section className="monthly-new-patient">
                <div className="monthly-new-patient__skeleton">
                    <div className="monthly-new-patient__skeleton-line monthly-new-patient__skeleton-line--short" />
                    <div className="monthly-new-patient__skeleton-bar" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="monthly-new-patient monthly-new-patient--error">
                <div className="monthly-new-patient__header">
                    <h2 className="monthly-new-patient__title">Last 12 Months&apos; No-Show Rate</h2>
                </div>
                <p className="monthly-new-patient__error-text">
                    Unable to load data.
                </p>
            </section>
        );
    }

    if (!data || data.length === 0) {
        return (
            <section className="monthly-new-patient">
                <div className="monthly-new-patient__header">
                    <h2 className="monthly-new-patient__title">Last 12 Months&apos; No-Show Rate</h2>
                </div>
                <p className="monthly-new-patient__empty-text">No data available.</p>
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
        <section className="monthly-new-patient">
            <div className="monthly-new-patient__header">
                <h2 className="monthly-new-patient__title">Last 12 Months&apos; No-Show Rate</h2>
            </div>
            <div className="monthly-new-patient__chart-container">
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
