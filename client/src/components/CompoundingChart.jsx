import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { generateGrowthData, formatCurrency, calculateCompoundGrowth } from "../utils/calculations";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function StatCard({ label, value, color, icon }) {
  return (
    <div className={`rounded-2xl p-4 text-center border transition-all duration-300 hover:shadow-soft ${color}`}>
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        {icon}
        <p className="text-[11px] font-medium text-taupe-500 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

export default function CompoundingChart({ defaultMonthly = 3000 }) {
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [years, setYears] = useState(10);

  const growthData = useMemo(() => generateGrowthData(monthly, years), [monthly, years]);
  const finalValue = useMemo(() => calculateCompoundGrowth(monthly, years), [monthly, years]);
  const totalInvested = monthly * years * 12;
  const returns = finalValue - totalInvested;

  const chartData = {
    labels: growthData.map((d) => `Year ${d.year}`),
    datasets: [
      {
        label: "Total Value",
        data: growthData.map((d) => d.value),
        borderColor: "#8b6841",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(139, 104, 65, 0.12)");
          gradient.addColorStop(1, "rgba(139, 104, 65, 0.01)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#8b6841",
        pointBorderColor: "#fff",
        pointBorderWidth: 2.5,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 3,
        borderWidth: 2.5,
      },
      {
        label: "Amount Invested",
        data: growthData.map((d) => d.invested),
        borderColor: "#d7c9c1",
        backgroundColor: "transparent",
        fill: false,
        tension: 0.4,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#c3afa2",
        pointHoverBorderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { family: "Inter", size: 11, weight: "500" },
          color: "#9c7963",
        },
      },
      tooltip: {
        backgroundColor: "rgba(31, 24, 20, 0.95)",
        titleFont: { family: "Inter", size: 12, weight: "600" },
        bodyFont: { family: "Inter", size: 12 },
        padding: { x: 14, y: 10 },
        cornerRadius: 10,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "rgba(62, 48, 40, 0.04)", drawBorder: false },
        ticks: {
          font: { family: "Inter", size: 11 },
          color: "#c3afa2",
          padding: 8,
          callback: (val) => formatCurrency(val),
        },
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          font: { family: "Inter", size: 11 },
          color: "#c3afa2",
          padding: 8,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-taupe-500 uppercase tracking-wider mb-2.5">
            Monthly Investment
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400 font-semibold">₹</span>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value) || 0)}
              className="input-modern pl-8"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-taupe-500 uppercase tracking-wider mb-2.5">
            Duration
          </label>
          <div className="bg-taupe-50 rounded-xl p-4 border border-taupe-100">
            <input
              type="range"
              min="1"
              max="30"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-taupe-400 mt-2">
              <span>1 yr</span>
              <span className="text-primary-600 font-bold text-sm bg-primary-50 px-2.5 py-0.5 rounded-full">
                {years} years
              </span>
              <span>30 yrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Invested"
          value={formatCurrency(totalInvested)}
          color="bg-taupe-50/80 border-taupe-100 text-taupe-700"
          icon={<svg className="w-3.5 h-3.5 text-taupe-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
        />
        <StatCard
          label="Returns"
          value={formatCurrency(returns)}
          color="bg-lime-50/80 border-lime-200 text-lime-800"
          icon={<svg className="w-3.5 h-3.5 text-lime-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <StatCard
          label="Total Value"
          value={formatCurrency(finalValue)}
          color="bg-primary-50/80 border-primary-100 text-primary-700"
          icon={<svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Chart */}
      <div className="h-[340px] bg-white rounded-xl p-2">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Insight */}
      <div className="bg-gradient-to-r from-chiffon-50 to-primary-50 border border-chiffon-200/60 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-chiffon-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-chiffon-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-taupe-800 mb-1">The power of compounding</p>
            <p className="text-[13px] text-taupe-600 leading-relaxed">
              Your {formatCurrency(monthly)}/month investment could grow to{" "}
              <strong className="text-primary-700">{formatCurrency(finalValue)}</strong> in {years} years at
              an assumed 12% annual return. Even small investments grow significantly when given enough time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
