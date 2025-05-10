import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { ChevronDown, ChevronUp, RefreshCcw, AlertCircle, PieChart, BarChart2 } from "lucide-react";

function GeneralDrugAnalytics() {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("bar");
  const [sortOrder, setSortOrder] = useState("descending");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["generalAnalytics"],
    queryFn: () =>
      axios.get("https://medical-crm-backend-production.up.railway.app/analytics/").then((res) => {
        console.log(res.data);
        return res.data;
      }),
  });

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-white rounded-lg shadow space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600 font-medium">Loading analytics data...</p>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-3 mb-4 text-red-500">
          <AlertCircle size={24} />
          <h3 className="text-lg font-semibold">Unable to load data</h3>
        </div>
        <p className="text-gray-600 mb-4">
          There was an error loading the analytics data. Please try again later.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center space-x-2"
        >
          <RefreshCcw size={16} />
          <span>Retry</span>
        </button>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <PieChart size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-gray-500 text-center max-w-md">
            There's no analytics data to display at the moment. Add prescriptions to see detailed analytics.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <RefreshCcw size={16} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    );

  let chartData = data.map((item) => ({
    name: item.name,
    count: parseInt(item.count, 10),
    id: item.id,
  }));

  // Sort data based on the selected order
  if (sortOrder === "descending") {
    chartData = chartData.sort((a, b) => b.count - a.count);
  } else if (sortOrder === "ascending") {
    chartData = chartData.sort((a, b) => a.count - b.count);
  } else if (sortOrder === "alphabetical") {
    chartData = chartData.sort((a, b) => a.name.localeCompare(b.name));
  }

  const colors = [
    "#3498db", // Blue
    "#2ecc71", // Green
    "#9b59b6", // Purple
    "#e74c3c", // Red
    "#f1c40f", // Yellow
    "#1abc9c", // Teal
    "#e67e22", // Orange
    "#34495e", // Navy
    "#16a085", // Green Sea
    "#d35400", // Pumpkin
  ];

  const toggleSortOrder = () => {
    if (sortOrder === "descending") setSortOrder("ascending");
    else if (sortOrder === "ascending") setSortOrder("alphabetical");
    else setSortOrder("descending");
  };

  const handleBarClick = (item) => {
    if (item.count > 0) {
      navigate(`/analytics/${item.id}`);
    } else {
      alert("No data available for this category");
    }
  };

  const totalPrescriptions = chartData.reduce((sum, item) => sum + item.count, 0);
  const hasData = chartData.some((item) => item.count > 0);

  return (
    <div className="w-full bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Drug Categories Analytics</h2>
            <p className="text-gray-500 mt-1">Visual breakdown of prescriptions by category</p>
          </div>
          
          {hasData && (
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType("bar")}
                  className={`p-2 rounded-md flex items-center ${
                    chartType === "bar" ? "bg-white shadow text-blue-600" : "text-gray-600"
                  }`}
                >
                  <BarChart2 size={18} />
                </button>
                <button
                  onClick={() => setChartType("pie")}
                  className={`p-2 rounded-md flex items-center ${
                    chartType === "pie" ? "bg-white shadow text-blue-600" : "text-gray-600"
                  }`}
                >
                  <PieChart size={18} />
                </button>
              </div>
              
              <button
                onClick={toggleSortOrder}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <span>Sort</span>
                {sortOrder === "descending" ? (
                  <ChevronDown size={16} />
                ) : sortOrder === "ascending" ? (
                  <ChevronUp size={16} />
                ) : (
                  <span className="text-xs">A-Z</span>
                )}
              </button>
              
              <button
                onClick={() => refetch()}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                title="Refresh data"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <PieChart size={64} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Prescription Data</h3>
          <p className="text-gray-500 max-w-md">
            Start adding prescriptions to generate analytics and visualize your data.
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 rounded-full p-2">
                <PieChart size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Prescriptions</p>
                <p className="text-2xl font-bold text-blue-800">{totalPrescriptions}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic">
              Click on any bar to view detailed analytics for that category
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis 
                  allowDecimals={false} 
                  domain={[0, "auto"]} 
                  tickCount={6} 
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={{ stroke: "#E5E7EB" }}
                  tick={{ fontSize: 12, fill: "#4B5563" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    border: "none",
                    padding: "0.75rem",
                  }}
                  cursor={{ fill: "rgba(236, 236, 236, 0.6)" }}
                />
                <Legend 
                  formatter={(value) => <span className="text-gray-700">{value}</span>}
                  wrapperStyle={{ paddingTop: "1rem" }}
                />
                <Bar
                  dataKey="count"
                  name="Number of Prescriptions"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      cursor="pointer"
                      fill={colors[index % colors.length]}
                      onClick={() => handleBarClick(item)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneralDrugAnalytics;