import { useQuery } from "@tanstack/react-query";
import type { CategoryApiData } from "../../../public/types/types";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pie,
  PieChart,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { BASEURL } from "../../axios/instance";

function CategoryAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analytics = useQuery<CategoryApiData>({
    queryKey: ["categoryAnalytics", id],
    queryFn: () =>
      axios.get(`${BASEURL}/analytics/${id}`).then((res) => {
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
        <p className="text-lg text-gray-600 font-medium">Loading category data...</p>
      </div>
    );
  }

  if (analytics.isError) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-3 mb-4 text-red-500">
          <AlertCircle size={24} />
          <h3 className="text-lg font-semibold">Unable to load category data</h3>
        </div>
        <p className="text-gray-600 mb-4">
          There was an error loading the category analytics. Please try again later.
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

  const hasData = analytics.data?.drugAnalytics && analytics.data?.drugAnalytics.length > 0;
  const totalPrescriptions = hasData
    ? analytics.data.drugAnalytics.reduce((sum, item) => sum + parseInt(item.count, 10), 0)
    : 0;

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
            {analytics.data?.category?.name || "Category Details"}
          </h1>
        </div>
        <p className="text-gray-500 ml-10">
          Breakdown of prescriptions within this category
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="bg-gray-100 p-5 rounded-full mb-4">
            <AlertCircle size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
          <p className="text-gray-500 max-w-md">
            There are no prescriptions in this category yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Categories</span>
          </button>
        </div>
      ) : (
        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <div className="w-6 h-6 flex items-center justify-center text-blue-600 font-semibold">Σ</div>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Prescriptions</p>
                <p className="text-2xl font-bold text-blue-800">{totalPrescriptions}</p>
              </div>
            </div>
            <p className="text-sm text-blue-600 italic">
              Click on any section to view drug details
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="count"
                  data={analytics.data?.drugAnalytics.map((item) => ({
                    name: item.name,
                    count: parseInt(item.count, 10),
                    id: item.id,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={true}
                  isAnimationActive={true}
                >
                  {analytics.data?.drugAnalytics?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      className="cursor-pointer hover:opacity-90"
                      onClick={() =>
                        navigate(`/analytics/classification/${entry.id}`)
                      }
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} prescriptions`, "Count"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    border: "none",
                    padding: "0.75rem",
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => {
                    return (
                      <span className="text-gray-700 font-medium">{value}</span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryAnalytics;