import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { analyticsApiData } from "../../../public/types/types";
import { Bar, Cell } from "recharts";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function GeneralDiseaseAnalytics() {
  const analytics = useQuery<analyticsApiData[]>({
    queryKey: ["diseaseAnalytics"],
    queryFn: () =>
      axios.get("http://localhost:8001/analytics/disease").then((res) => {
        console.log(res.data);
        return res.data;
      }),
  });

  if (analytics.isLoading) return <div>loading...</div>;
  if (analytics.isError) return <div>error...</div>;
  
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
    <div className="w-full h-96 p-4">
      <h2 className="text-xl font-bold text-center mb-4">
        Drug Categories Analytics
      </h2>
      {analytics.data?.length && analytics.data?.length > 0 && (
        <ResponsiveContainer
          className={"min-h-[600px]"}
          width="100%"
          height="100%"
        >
          <BarChart
            data={analytics.data?.map((item) => ({
              name: item.name,
              count: parseInt(item.count, 10),
              id: item.id,
            }))}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 120,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" name="Categories" fill="#8884d8">
              {analytics.data?.map((item, index) => (
                <Cell
                  className="cursor-pointer"
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default GeneralDiseaseAnalytics;
