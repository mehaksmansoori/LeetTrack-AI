import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ActivityChart = ({ data }) => (
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={(value) => value.slice(5)} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "rgba(95, 174, 255, 0.08)" }}
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: "16px",
            color: "#e2e8f0"
          }}
        />
        <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="var(--accent)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ActivityChart;
