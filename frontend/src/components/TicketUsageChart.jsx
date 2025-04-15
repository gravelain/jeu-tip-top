import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TicketUsageChart = ({
  usedTickets,
  unusedTickets,
  usedValue,
  unusedValue,
}) => {
  const data = [
    {
      name: "Used",
      count: usedTickets || 0,
      value: usedValue || 0,
    },
    {
      name: "Unused",
      count: unusedTickets || 0,
      value: unusedValue || 0,
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{payload[0].payload.name} Tickets</p>
          <p className="text-sm">
            Count:{" "}
            <span className="font-medium">{payload[0].payload.count}</span>
          </p>
          <p className="text-sm">
            Value:{" "}
            <span className="font-medium">{payload[0].payload.value}€</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="count" name="Number of Tickets" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketUsageChart;
