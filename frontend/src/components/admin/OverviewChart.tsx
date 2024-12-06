import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";
import React from "react";

interface Account {
  role: string;
  name: string;
  total: number;
}

interface OverviewChartProps {
  accounts: Account[];
}

export function OverviewChart({ accounts }: OverviewChartProps) {
  // Dữ liệu biểu đồ Radial Bar

  const radialChartData = [
    {
      name: "Company",
      value: accounts.find((acc) => acc.role === "company")?.total || 0 ,
      fill: "#006400", // Xanh lá cây đậm
    },
    {
      name: "Recruiter",
      value: accounts.find((acc) => acc.role === "recruiter")?.total || 0,
      fill: "#32CD32", // Xanh lá cây vừa
    },
    {
      name: "Job Seeker",
      value: accounts.find((acc) => acc.role === "job_seeker")?.total || 0,
      fill: "#90EE90", // Xanh lá cây nhạt
    },
  ];
  

  // Tổng số tài khoản
  const totalAccounts = radialChartData.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="bg-white shadow-lg pb-4 rounded-md">
            <div className="flex justify-between px-3 shadow-md">
                <h3 className="text-black text-2xl py-2 font-bold">OVERVIEW</h3>
            </div>
            <div className="h-[380px] w-full pt-8">
                <ResponsiveContainer>
                    <RadialBarChart
                        cx="50%"
                        cy="42%"
                        innerRadius="40%"
                        outerRadius="100%"
                        barSize={15}
                        startAngle={-90}
                        endAngle={270}
                        data={radialChartData}
                    >
                        <RadialBar
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            dataKey="value"
                        />
                        <text 
                            x={"50%"} 
                            y={"39%"} 
                            textAnchor="middle" 
                            dominantBaseline="central" 
                            className="label-top" 
                            fontSize={25} 
                            fontWeight="bold" 
                            fill="#333"
                        >
                            {totalAccounts}
                        </text>
                        <text 
                            x={"50%"} 
                            y={"46%"} 
                            textAnchor="middle" 
                            dominantBaseline="central" 
                            className="label-bottom" 
                            fontSize={15} 
                            fill="#666"
                        >
                            Accounts
                        </text>
                        <Legend
                            iconSize={10}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>

            {/* Rank Icons */}
            <div className="mt-4 flex justify-center gap-4">
                {radialChartData.map((rank, index) => (
                    <div key={index} className="flex items-center space-x-2">

                    </div>
                ))}
            </div>
        </div>
    );
}
