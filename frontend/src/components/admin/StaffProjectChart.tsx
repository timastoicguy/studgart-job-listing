import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, ResponsiveContainer, Legend } from "recharts";
import { useWindowSize } from "@/components/shared/WindowSize";
// Removed Redux imports as we will use mock data
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/redux/redux.config";

export function StaffProjectChart() {
    // Mock data
    const mockAreaChartData = [
        { month: "January", account: 40, jobs: 30 },
        { month: "February", account: 35, jobs: 25 },
        { month: "March", account: 50, jobs: 40 },
        { month: "April", account: 60, jobs: 45 },
    ];

    const size = useWindowSize();
    const getAspect = () => {
        if (size.width > 1200) return 8;
        if (size.width > 992) return 6;
        return 2;
    };

    return (
        <div className="bg-white shadow-lg p-4 pt-6">
            <h3 className="text-center mb-4">ACCOUNTS AND JOBS</h3>
            <ResponsiveContainer width="100%" aspect={getAspect()}>
                <AreaChart
                    data={mockAreaChartData}
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
                        dataKey="account"
                        stackId="1"
                        stroke="hsl(var(--chart-staff))"
                        fill="hsl(var(--chart-staff))"
                    />
                    <Area
                        type="monotone"
                        dataKey="jobs"
                        stackId="1"
                        stroke="hsl(var(--chart-projects))"
                        fill="hsl(var(--chart-projects))"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
