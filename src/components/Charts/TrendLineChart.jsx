import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function TrendLineChart({ termTrends = [], gpaScale = '4.0', gpaDenominator = '4.00' }) {
  //Checking whether data exists
  if (!termTrends || termTrends.length === 0) {
    return (
      <div className="bg-white border border-slate-300 rounded p-6 flex flex-col items-center justify-center h-80 text-center">
        <h3 className="text-base font-bold text-slate-800 mb-1">Term-over-Term Trend</h3>
        <p className="text-slate-500 text-sm">No term data available.</p>
        <p className="text-slate-400 text-xs mt-1">Add subjects under academic terms to track performance trends.</p>
      </div>
    );
  }

  // When only 1 term is recorded, a comparative line chart cannot be plotted without fabricating data
  if (termTrends.length < 2) {
    return (
      <div className="bg-white border border-slate-300 rounded p-6 flex flex-col items-center justify-center h-80 text-center">
        <h3 className="text-base font-bold text-slate-800 mb-1">Term-over-Term Trend</h3>
        <p className="text-slate-700 text-sm font-medium mb-1">
          Currently 1 term recorded ({termTrends[0].term}: Average {termTrends[0].averageScore}%, GPA {termTrends[0].gpa.toFixed(2)} / {gpaDenominator})
        </p>
        <p className="text-slate-500 text-xs max-w-sm mt-1">
          Add subjects under additional terms (e.g. Term 2) to display a comparative performance trend line.
        </p>
      </div>
    );
  }

  //Creating the chart layout
  return (
    <div className="bg-white border border-slate-300 rounded p-4 flex flex-col justify-between">
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-800">Term-over-Term Trend</h3>
        <p className="text-xs text-slate-500">Average marks (%) and GPA across academic terms</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">

          //Creating the actual Line Chart
          <LineChart data={termTrends} margin={{ top: 15, right: 20, left: -10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="term" 
              stroke="#475569" 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            {/* Left Axis: Marks % */}
            <YAxis 
              yAxisId="left" 
              stroke="#2563eb" 
              fontSize={12} 
              domain={[0, 100]} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `${v}%`}
            />
            {/* Right Axis: GPA */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#16a34a" 
              fontSize={12} 
              domain={[0, gpaScale === '10.0' ? 10.0 : 4.0]} 
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(v) => `${v.toFixed(1)}`}
            />
            <Tooltip 
              formatter={(value, name) => [
                name.includes('GPA') ? `${Number(value).toFixed(2)} / ${gpaDenominator}` : `${value}%`,
                name
              ]}
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '12px' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
            />
            <Line
              yAxisId="left"
              type="linear"
              dataKey="averageScore"
              name="Average Score (%)"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4, fill: '#2563eb' }}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="linear"
              dataKey="gpa"
              name={`Cumulative GPA (${gpaScale})`}
              stroke="#16a34a"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#16a34a' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}