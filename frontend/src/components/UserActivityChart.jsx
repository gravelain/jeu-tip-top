import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserActivityChart = ({ users }) => {
  // Generate monthly activity data (simulated)
  const generateActivityData = () => {
    const currentMonth = new Date().getMonth();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(currentMonth - i);

      // If we have actual user data, we could calculate real signups per month
      // For now we'll generate simulated data
      const monthName = month.toLocaleString("default", { month: "short" });

      months.push({
        name: monthName,
        "New Users": Math.floor(Math.random() * 15) + 5,
        "Active Users": Math.floor(Math.random() * 25) + 15,
      });
    }

    return months;
  };

  const data = generateActivityData();

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="New Users"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="Active Users"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;
