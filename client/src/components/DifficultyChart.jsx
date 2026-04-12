import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  Easy: "#4ade80",
  Medium: "#f59e0b",
  Hard: "#f87171"
};

const DifficultyChart = ({ data }) => (
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="solved" nameKey="difficulty" innerRadius={70} outerRadius={98} paddingAngle={3}>
          {data.map((entry) => (
            <Cell key={entry.difficulty} fill={COLORS[entry.difficulty] || "#60a5fa"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: "16px",
            color: "#e2e8f0"
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default DifficultyChart;
