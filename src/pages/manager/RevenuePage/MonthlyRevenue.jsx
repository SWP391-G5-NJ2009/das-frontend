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
import { useMonthlyRevenue } from "../../../hooks/useRevenue";
import "./MonthlyRevenue.css";

const BAR_COLOR_DEFAULT = "var(--color-primary-700)";
const BAR_COLOR_CURRENT = "var(--color-secondary-700)";

function getCurrentMonthLabel() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="monthly-revenue__tooltip">
      <p className="monthly-revenue__tooltip-label">{label}</p>
      <p className="monthly-revenue__tooltip-value">
        {formatVND(payload[0].value)}
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
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)}T`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}TR`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value;
}

function MonthlyRevenueSummary() {
  const [offset, setOffset] = useState(0);
  const { data, isLoading, error } = useMonthlyRevenue(offset);

  if (isLoading) {
    return (
      <section className="monthly-revenue">
        <div className="monthly-revenue__skeleton">
          <div className="monthly-revenue__skeleton-line monthly-revenue__skeleton-line--short" />
          <div className="monthly-revenue__skeleton-bar" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="monthly-revenue monthly-revenue--error">
        <div className="monthly-revenue__header">
          <h2 className="monthly-revenue__title">Doanh thu 12 tháng gần đây</h2>
        </div>
        <p className="monthly-revenue__error-text">
          Không thể tải dữ liệu doanh thu.
        </p>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="monthly-revenue">
        <div className="monthly-revenue__header">
          <h2 className="monthly-revenue__title">Doanh thu 12 tháng gần đây</h2>
        </div>
        <p className="monthly-revenue__empty-text">Không có dữ liệu doanh thu.</p>
      </section>
    );
  }

  const currentMonth = getCurrentMonthLabel();
  const chartData = data.map((item) => ({
    name: item.month,
    revenue: Number(item.revenue) || 0,
    isCurrent: item.month === currentMonth,
  }));

  return (
    <section className="monthly-revenue">
      <div className="monthly-revenue__header">
        <h2 className="monthly-revenue__title">Doanh thu 12 tháng gần đây</h2>
        <div className="monthly-revenue__nav">
          <button
            className="monthly-revenue__nav-btn"
            onClick={() => setOffset((prev) => prev + 1)}
            aria-label="Tháng trước"
          >
            &#8592;
          </button>
          <button
            className="monthly-revenue__nav-btn"
            onClick={() => setOffset((prev) => Math.max(0, prev - 1))}
            disabled={offset === 0}
            aria-label="Tháng sau"
          >
            &#8594;
          </button>
        </div>
      </div>
      <div className="monthly-revenue__chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="15 15"
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
              cursor={{ fill: "var(--color-primary-100)", opacity: 0.5 }}
            />
            <Bar
              dataKey="revenue"
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

MonthlyRevenueSummary.propTypes = {};

export default MonthlyRevenueSummary;
