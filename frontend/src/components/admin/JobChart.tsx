/* eslint-disable @typescript-eslint/no-explicit-any */
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { useWindowSize } from "@/components/shared/WindowSize";

export function JobChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const size = useWindowSize();
  const getAspect = () => {
    if (size.width > 1200) return 8;
    if (size.width > 992) return 6;
    return 2;
  };

  // Lấy dữ liệu công việc
  const fetchData = async () => {
    try {
      const jobRequests = axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/jobs?page=1&limit=10`);

      // Chờ yêu cầu API hoàn thành
      const jobsResponse = await jobRequests;

      // Tính tổng số công việc cho từng tháng
      const jobData = jobsResponse.data.data.docs;

      // Tạo dữ liệu cho biểu đồ
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(new Date().getMonth() - i);
        return date.toLocaleString("default", { month: "long", year: "numeric" });
      }).reverse();

      const chartData = months.map((month) => {
        const monthJobCount = jobData.filter((job: { postedDate: string | number | Date; }) =>
          new Date(job.postedDate).toLocaleString("default", { month: "long", year: "numeric" }) === month
        ).length;

        return { month, jobs: monthJobCount };
      });

      setChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-lg p-4 pt-6">
      <h3 className="text-center mb-4">JOBS</h3>
      <ResponsiveContainer width="100%" aspect={getAspect()}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="jobs"
            stackId="1"
            stroke="#32CD32"
            fill="#90EE90"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
