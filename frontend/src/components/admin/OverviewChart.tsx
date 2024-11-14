import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts";
import React from 'react';
import { FaGem, FaTrophy, FaMedal, FaStar, FaCoins } from 'react-icons/fa'; // Import icons

export function OverviewChart() {
    // Mock data với các sắc thái của màu sắc phù hợp với từng cấp độ rank
    const mockRadialChartData = [
        { name: 'Kim cương', value: 10, fill: '#4B0082', icon: <FaGem /> },   // Màu tím đậm
        { name: 'Bạch kim', value: 100, fill: '#D3D3D3', icon: <FaTrophy /> },  // Màu xám sáng
        { name: 'Vàng', value: 300, fill: '#FFD700', icon: <FaMedal /> },      // Màu vàng ánh kim
        { name: 'Bạc', value: 200, fill: '#A9A9A9', icon: <FaStar /> },        // Màu xám đậm
        { name: 'Đồng', value: 200, fill: '#CD7F32', icon: <FaCoins /> },      // Màu đồng
    ];
    const mockTotalClaims = mockRadialChartData.reduce((acc, item) => acc + item.value, 0);

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
                        data={mockRadialChartData}
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
                            {mockTotalClaims}
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
                {mockRadialChartData.map((rank, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div className="text-xl">{rank.icon}</div>
                        <div>{rank.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
