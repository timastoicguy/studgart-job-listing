import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    ResponsiveContainer,
  } from "recharts";
  import { ChartContainer } from "@components/ui/chart";
  import { useWindowSize } from "@/components/shared/WindowSize";
  
  type Transaction = {
    createdAt: string | number | Date;
    id: string;
    amount: number;
    status: string;
  };
  
  interface TotalTransChartProps {
    data: Transaction[];
  }
  
  export function TotalTransChart({ data }: TotalTransChartProps) {
    console.log("TotalTransChart:", data);
  
    // Lấy ngày hiện tại và 6 tháng gần đây
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    }).reverse();
  
    // Tạo dữ liệu mặc định với giá trị `0`
    const initialData = months.map((month) => ({ month, completed: 0 }));
  
    // Tích hợp dữ liệu từ `data` vào danh sách 6 tháng
    const processedData = data.reduce((acc, transaction) => {
        const transactionMonth = new Date(transaction.createdAt).toLocaleString(
          "default",
          { month: "long", year: "numeric" }
        );
      
        // Tính tổng cho tất cả giao dịch, không phân biệt trạng thái
        const existingMonth = acc.find((item) => item.month === transactionMonth);
        if (existingMonth) {
          existingMonth.completed += transaction.amount;
        }
      
        return acc;
      }, initialData);
      
  
    const size = useWindowSize();
    const getAspect = () => {
      if (size.width > 1200) return 3.55;
      if (size.width > 992) return 1.95;
      return 2;
    };
  
    return (
      <div className="bg-white shadow-lg p-4 pt-6 rounded-md">
        <h3 className="text-center mb-4">Transaction Total Summary (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" aspect={getAspect()}>
          <ChartContainer config={{ waitingForm: { color: "#006400" } }}>
            <BarChart width={900} height={450} data={processedData}>
              <CartesianGrid strokeDasharray="2" strokeWidth={"3"} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#006400" /> {/* Màu xanh lá đậm */}
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
    );
  }
  