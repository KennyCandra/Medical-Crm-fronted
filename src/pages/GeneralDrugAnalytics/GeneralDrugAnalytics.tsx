import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { analyticsApiData } from "../../../public/types/types";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function GeneralDrugAnalytics() {
  const navigate = useNavigate();

  const analytics = useQuery<analyticsApiData[]>({
    queryKey: ["generalAnaytics"],
    queryFn: () =>
      axios.get("http://localhost:8001/analytics/").then((res) => {
        console.log(res.data);
        return res.data;
      }),
  });

  if (analytics.isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        Loading analytics data...
      </div>
    );
  if (analytics.isError)
    return <div className="text-red-500 p-4">Error loading analytics data</div>;
  if (!analytics.data || analytics.data.length === 0)
    return <div className="p-4">No analytics data available</div>;

  const chartData = analytics.data.map((item) => ({
    name: item.name,
    count: parseInt(item.count, 10),
    id: item.id,
  }));

  const colors = [
    "#36A2EB",
    "#FF6384",
    "#9966FF",
    "#FFCE56",
    "#4BC0C0",
    "#82ca9d",
    "#FF9F40",
    "#8884d8",
    "#8dd1e1",
    "#ffc658",
  ];


  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-center mb-4">
        Drug Categories Analytics
      </h2>

      {chartData.every((item) => item.count === 0) ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-gray-500">
            No data available for charts yet
          </p>
          <p className="text-sm text-gray-400">
            Add prescriptions to see analytics
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 120,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis allowDecimals={false} domain={[0, "auto"]} tickCount={6} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              name="Number of Prescriptions"
              fill="#8884d8"
              minPointSize={5}
              barSize={40}
            >
              {chartData.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  cursor="pointer"
                  fill={colors[index % colors.length]}
                  onClick={() => {
                    if (item.count > 0) {
                      navigate(`/analytics/${item.id}`);
                    } else {
                      alert("No data available for this category");
                    }
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default GeneralDrugAnalytics;
