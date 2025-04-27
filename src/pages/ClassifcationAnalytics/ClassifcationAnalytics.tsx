import { useQuery } from "@tanstack/react-query";
import type { classificationApiData } from "../../../public/types/types";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Pie,
  PieChart,
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

function ClassifcationAnalytics() {
  const { id } = useParams();
  const analytics = useQuery<classificationApiData>({
    queryKey: ["classification analytics", id],
    queryFn: () =>
      axios
        .get(`http://localhost:8001/analytics/classification/${id}`)
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),
  });

  if (analytics.isLoading) return <div>Loading...</div>;

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
    <div style={{ width: "100%", height: 400 }}>
      {analytics.data?.drugAnalytics &&
        analytics.data.drugAnalytics.length > 0 && (
          <>
            <h1 className="font-poppins font-bold text-4xl">
              {analytics.data?.classification.name}
            </h1>
            <ResponsiveContainer
              className={"min-h-[600px]"}
              width="100%"
              height="100%"
            >
              <BarChart
                data={analytics.data?.drugAnalytics.map((item) => ({
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
                  {analytics.data?.drugAnalytics.map((item, index) => (
                    <Cell
                      className="cursor-pointer"
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
    </div>
  );
}

export default ClassifcationAnalytics;
