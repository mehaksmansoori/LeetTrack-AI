import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TrendChart = ({ data }) => (
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
        <XAxis dataKey="weekStart" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={(value) => value.slice(5)} />
        <YAxis yAxisId="left" tick={{ fill: "var(--text-muted)", fontSize: 11 }} allowDecimals={false} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--text-muted)", fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: "16px",
            color: "#e2e8f0"
          }}
        />
        <Line yAxisId="left" type="monotone" dataKey="solvedThisWeek" stroke="#5faeff" strokeWidth={3} dot={{ r: 4 }} />
        <Line yAxisId="right" type="monotone" dataKey="consistencyScore" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendChart;
