import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ collapsed }) => {
    const [chartData, setChartData] = useState('daily'); // State to manage which data to display

    const monthlyData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Purchases',
                data: [0, 0, 0, 0, 0, 2750, 500, 2000, 0, 0, 0, 0],
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Sales',
                data: [0, 0, 0, 0, 0, 0, 2250, 1750, 0, 0, 0, 0],
                backgroundColor: '#2196F3',
            },
            {
                label: 'Expenses',
                data: [0, 0, 0, 0, 0, 0, 0, 2000, 0, 0, 0, 0],
                backgroundColor: '#FF5252',
            },
        ],
    };

    const generateWeekLabels = () => {
        const weeks = [];
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let currentWeekStart = firstDayOfMonth;
        while (currentWeekStart <= lastDayOfMonth) {
            const weekStart = new Date(currentWeekStart);
            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            weeks.push(weekLabel);

            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        }

        return weeks;
    };

    const weeklyData = {
        labels: generateWeekLabels(),
        datasets: [
            {
                label: 'Purchases',
                data: [0, 2750, 500, 2500],
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Sales',
                data: [0, 2250, 1750, 0],
                backgroundColor: '#2196F3',
            },
            {
                label: 'Expenses',
                data: [0, 0, 2000, 0],
                backgroundColor: '#FF5252',
            },
        ],
    };

    // Function to generate labels for each day in the current month
    const generateDailyLabels = () => {
        const labels = [];
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            labels.push(`${month + 1}/${i}`);
        }

        return labels;
    };

    const dailyData = {
        labels: generateDailyLabels(),
        datasets: [
            {
                label: 'Purchases',
                data: [150, 200, 300, 250, 400, 500, 450, 300, 200, 350, 400, 300, 350, 250, 450, 500, 600, 700, 800, 750, 700, 600, 500, 450, 400, 350, 300, 250, 200, 150],
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Sales',
                data: [100, 150, 250, 200, 300, 400, 350, 250, 150, 300, 350, 250, 300, 200, 400, 450, 550, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100, 50],
                backgroundColor: '#2196F3',
            },
            {
                label: 'Expenses',
                data: [50, 100, 150, 100, 200, 250, 200, 150, 100, 200, 250, 150, 200, 100, 150, 200, 250, 300, 350, 300, 250, 200, 150, 100, 150, 200, 100, 50, 0, 0],
                backgroundColor: '#FF5252',
            },
        ],
    };

    const data = chartData === 'monthly' ? monthlyData : (chartData === 'weekly' ? weeklyData : dailyData);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        family: 'Roboto, sans-serif',
                    },
                    color: '#4A5568',
                },
            },
            title: {
                display: true,
                text: chartData === 'monthly' ? 'Monthly Data' : (chartData === 'weekly' ? 'Weekly Data' : 'Daily Data'),
                font: {
                    size: 18,
                    family: 'Roboto, sans-serif',
                },
                color: '#2D3748',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#4A5568',
                    font: {
                        family: 'Roboto, sans-serif',
                    },
                },
            },
            y: {
                ticks: {
                    color: '#4A5568',
                    font: {
                        family: 'Roboto, sans-serif',
                    },
                },
            },
        },
    };

    const handleTabChange = (tab) => {
        setChartData(tab);
    };

    return (
        <div className={`bg-gray-50 p-8 rounded-lg  transition-all duration-300 ${collapsed ? 'w-64' : 'w-full'} h-[calc(100vh-120px)]`}>
            <div className="flex justify-center mb-6">
                <button
                    className={`px-8 py-1 mr-4 rounded-lg focus:outline-none transition duration-300 ${chartData === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    onClick={() => handleTabChange('daily')}
                >
                    Daily
                </button>
                <button
                    className={`mr-4 px-8 py-1 rounded-lg focus:outline-none transition duration-300 ${chartData === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    onClick={() => handleTabChange('weekly')}
                >
                    Weekly
                </button>
                <button
                    className={`mr-4 px-8 py-1 rounded-lg focus:outline-none transition duration-300 ${chartData === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    onClick={() => handleTabChange('monthly')}
                >
                    Monthly
                </button>
               
               
            </div>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
