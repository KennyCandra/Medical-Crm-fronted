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

function CategoryAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const analytics = useQuery<CategoryApiData>({
    queryKey: ["categoryAnalytics", id],
    queryFn: () =>
      axios.get(`http://localhost:8001/analytics/${id}`).then((res) => {
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
      <h1 className="font-poppins font-bold text-4xl">
        {analytics.data?.drugAnalytics && analytics.data?.category.name}
      </h1>
      {analytics.data?.drugAnalytics &&
        analytics.data?.drugAnalytics.length > 0 && (
          <ResponsiveContainer>
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
                isAnimationActive={true}
              >
                {analytics.data?.drugAnalytics?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/analytics/classification/${entry.id}`)
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
    </div>
  );
}

export default CategoryAnalytics;
