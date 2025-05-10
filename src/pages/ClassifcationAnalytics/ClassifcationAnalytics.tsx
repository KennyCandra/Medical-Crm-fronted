import { useQuery } from "@tanstack/react-query";
import type { classificationApiData } from "../../../public/types/types";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
  YAxis,
} from "recharts";
import { ArrowLeft, AlertCircle, BarChart2 } from "lucide-react";

function ClassificationAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analytics = useQuery<classificationApiData>({
    queryKey: ["classification analytics", id],
    queryFn: () =>
      axios
        .get(`https://medical-crm-backend-production.up.railway.app/analytics/classification/${id}`)
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),
  });

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

  if (analytics.isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-white rounded-lg shadow space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600 font-medium">Loading classification data...</p>
      </div>
    );
  }

  if (analytics.isError) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-3 mb-4 text-red-500">
          <AlertCircle size={24} />
          <h3 className="text-lg font-semibold">Unable to load classification data</h3>
        </div>
        <p className="text-gray-600 mb-4">
          There was an error loading the classification analytics. Please try again later.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => analytics.refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>
    );
  }

  const hasData = analytics.data?.drugAnalytics && analytics.data.drugAnalytics.length > 0;
  
  if (!hasData) {
    return (
      <div className="w-full bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center mb-2">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-poppins font-bold text-2xl md:text-3xl text-gray-800">
              {analytics.data?.classification?.name || "Classification Details"}
            </h1>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="bg-gray-100 p-5 rounded-full mb-4">
            <AlertCircle size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-gray-500 max-w-md">
            There are no prescriptions in this classification yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
      </div>
    );
  }

  // Transform data for the chart
  const chartData = analytics.data.drugAnalytics.map((item) => ({
    name: item.name,
    count: parseInt(item.count, 10),
    id: item.id,
  }));

  // Calculate total prescriptions
  const totalPrescriptions = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="w-full bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center mb-2">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-poppins font-bold text-2xl md:text-3xl text-gray-800">
            {analytics.data.classification.name}
          </h1>
        </div>
        <p className="text-gray-500 ml-10">
          Detailed breakdown of prescriptions for this drug classification
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <BarChart2 size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Prescriptions</p>
              <p className="text-2xl font-bold text-blue-800">{totalPrescriptions}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 flex items-center text-sm text-gray-600">
            <p>
              Showing {chartData.length} drugs in this classification
            </p>
          </div>
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
                formatter={(value) => [`${value} prescriptions`, "Count"]}
              />
              <Legend 
                formatter={() => <span className="text-gray-700 font-medium">Number of Prescriptions</span>}
                wrapperStyle={{ paddingTop: "1rem" }}
              />
              <Bar 
                dataKey="count" 
                name="Number of Prescriptions" 
                barSize={40}
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((_, index) => (
                  <Cell
                    className="cursor-pointer hover:opacity-90"
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ClassificationAnalytics;